import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { Worker } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { QUEUE_NAMES, getEnv } from "@vedaai/config";
import type { CreateAssignmentDto } from "@vedaai/validation";
import type { GenerationProgressEvent } from "@vedaai/types";

let apiKeys: string[] = [];
let currentKeyIndex = 0;

// ─── Mongoose schemas ─────────────────────────────────────────────────────────

const questionTypeSchema = new mongoose.Schema(
  { id: String, type: String, label: String, count: Number, marksPerQuestion: Number },
  { _id: false },
);

const assignmentSchema = new mongoose.Schema(
  {
    title: String, subject: String, className: String, dueDate: String,
    additionalInstructions: String, questionTypes: [questionTypeSchema],
    status: String, questionPaperId: String,
  },
  { timestamps: true },
);

const questionPaperSchema = new mongoose.Schema(
  {
    id: String, schoolName: String, subject: String, className: String,
    timeAllowed: String, maximumMarks: Number, generalInstruction: String,
    introMessage: String, sections: Array, answerKey: Array,
  },
  { timestamps: true },
);

const AssignmentModel =
  mongoose.models.Assignment || mongoose.model("Assignment", assignmentSchema);
const QuestionPaperModel =
  mongoose.models.QuestionPaper || mongoose.model("QuestionPaper", questionPaperSchema);

// ─── Zod schema for Gemini response validation ────────────────────────────────

const geminiQuestionSchema = z.object({
  number: z.number().int().positive(),
  text: z.string().min(5),
  difficulty: z.enum(["easy", "medium", "hard"]),
  marks: z.number().int().positive(),
  options: z.array(z.string()).optional(), // MCQ only
});

const geminiSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  instruction: z.string(),
  questions: z.array(geminiQuestionSchema).min(1),
});

const geminiPaperSchema = z.object({
  sections: z.array(geminiSectionSchema).min(1),
  answerKey: z.array(
    z.object({
      number: z.number().int().positive(),
      sectionId: z.string(),
      answer: z.string().min(1),
    }),
  ).min(1),
  generalInstruction: z.string(),
  timeAllowed: z.string(),
});

type GeminiPaper = z.infer<typeof geminiPaperSchema>;

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(payload: CreateAssignmentDto): string {
  const sectionLines = payload.questionTypes
    .map((row, i) => {
      const letter = String.fromCharCode(65 + i);
      const typeLabel =
        row.type === "multiple_choice" ? "Multiple Choice Questions (with 4 options A/B/C/D)"
        : row.type === "short"          ? "Short Answer Questions"
        : row.type === "diagram"        ? "Diagram / Graph-Based Questions"
        : row.type === "numerical"      ? "Numerical Problems (show formula/working expected)"
        : row.label;
      return `Section ${letter}: ${row.count} × ${typeLabel}, ${row.marksPerQuestion} mark(s) each`;
    })
    .join("\n");

  const totalMarks = payload.questionTypes.reduce(
    (acc, r) => acc + r.count * r.marksPerQuestion,
    0,
  );

  const instructions = payload.additionalInstructions?.trim()
    ? `\nSpecial instructions from teacher: ${payload.additionalInstructions}`
    : "";

  return `You are an expert question-paper setter for Indian school examinations (CBSE/ICSE standard).

Generate a complete question paper for:
- Subject: ${payload.subject}
- Class: ${payload.className}
- Total Marks: ${totalMarks}${instructions}

Sections to generate:
${sectionLines}

STRICT RULES:
1. Every question must be genuinely subject-specific and educationally appropriate for ${payload.className} students.
2. Do NOT write generic or placeholder questions like "Question 1 about Physics".
3. Distribute difficulty: roughly 40% easy, 40% medium, 20% hard per section.
4. For Multiple Choice Questions, always provide exactly 4 options labeled A), B), C), D).
5. Answers must be concise but complete model answers.
6. generalInstruction should be a standard exam instruction (1-2 sentences).
7. timeAllowed should be reasonable (e.g. "1 hour", "2 hours 30 minutes").
8. Section IDs must be "A", "B", "C" etc matching the sections listed above.
9. Question numbers restart from 1 within each section.

Respond with ONLY this exact JSON structure, no markdown, no explanation, no code fences:
{
  "sections": [
    {
      "id": "A",
      "title": "Section A",
      "instruction": "...",
      "questions": [
        {
          "number": 1,
          "text": "...",
          "difficulty": "easy",
          "marks": 1,
          "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
        }
      ]
    }
  ],
  "answerKey": [
    { "number": 1, "sectionId": "A", "answer": "..." }
  ],
  "generalInstruction": "...",
  "timeAllowed": "..."
}`;
}

// ─── Gemini call with 1 retry ─────────────────────────────────────────────────

async function callGemini(apiKey: string, prompt: string, attempt = 1): Promise<GeminiPaper> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192,
    },
  });

  const result = await model.generateContent(prompt);
  const raw = result.response.text().trim();

  // Strip markdown code fences if Gemini wraps in ```json ... ```
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    if (attempt < 2) {
      console.warn("[worker] Gemini returned non-JSON, retrying…");
      return callGemini(apiKey, prompt + "\n\nIMPORTANT: Your previous response was not valid JSON. Return ONLY raw JSON, no markdown.", 2);
    }
    throw new Error(`Gemini did not return valid JSON after ${attempt} attempt(s). Raw: ${raw.slice(0, 300)}`);
  }

  const validated = geminiPaperSchema.safeParse(parsed);
  if (!validated.success) {
    if (attempt < 2) {
      console.warn("[worker] Gemini JSON failed schema validation, retrying…", validated.error.flatten());
      return callGemini(apiKey, prompt + "\n\nIMPORTANT: Your previous response did not match the required schema. Follow the schema exactly.", 2);
    }
    throw new Error(`Gemini response failed schema validation: ${JSON.stringify(validated.error.flatten())}`);
  }

  return validated.data;
}

// ─── Gemini Call with Key Rotation ──────────────────────────────────────────

async function callGeminiWithRotation(apiKeys: string[], prompt: string): Promise<GeminiPaper> {
  if (apiKeys.length === 0) {
    throw new Error("No Gemini API keys are configured.");
  }

  let attempts = 0;
  const maxAttempts = apiKeys.length;

  while (attempts < maxAttempts) {
    const index = currentKeyIndex % apiKeys.length;
    const apiKey = apiKeys[index];
    
    // Partially mask key for security logging
    const maskedKey = apiKey.length > 8 
      ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` 
      : "***";

    try {
      console.log(`[worker] Attempting generation using Gemini API key at index ${index} (${maskedKey})`);
      return await callGemini(apiKey, prompt);
    } catch (err: any) {
      const errMessage = err.message || "";
      const isRateLimit = 
        errMessage.includes("429") || 
        errMessage.includes("Quota exceeded") || 
        errMessage.includes("Too Many Requests") ||
        errMessage.includes("quota limit exceeded") ||
        errMessage.includes("ResourceExhausted") ||
        errMessage.includes("RESOURCE_EXHAUSTED");

      if (isRateLimit && apiKeys.length > 1) {
        console.warn(`[worker] Gemini API key at index ${index} (${maskedKey}) hit quota/rate limit. Error: ${errMessage.slice(0, 200)}. Rolling to next key...`);
        currentKeyIndex = (index + 1) % apiKeys.length;
        attempts++;
        continue;
      }
      
      throw err;
    }
  }

  throw new Error(`All ${maxAttempts} configured Gemini API keys exceeded their quota/rate limits.`);
}

// ─── Map Gemini output → QuestionPaper DB shape ───────────────────────────────

function mapToQuestionPaper(
  assignmentId: string,
  payload: CreateAssignmentDto,
  gemini: GeminiPaper,
) {
  const totalMarks = payload.questionTypes.reduce(
    (acc, r) => acc + r.count * r.marksPerQuestion,
    0,
  );

  return {
    id: assignmentId,
    schoolName: "Delhi Public School, Sector-4, Bokaro",
    subject: payload.subject,
    className: payload.className,
    timeAllowed: gemini.timeAllowed,
    maximumMarks: totalMarks,
    generalInstruction: gemini.generalInstruction,
    introMessage: `AI-generated question paper for ${payload.subject} — ${payload.className}`,
    sections: gemini.sections.map((s) => ({
      id: s.id,
      title: s.title,
      instruction: s.instruction,
      questions: s.questions.map((q) => ({
        id: `${s.id}-${q.number}`,
        number: q.number,
        text: q.text,
        difficulty: q.difficulty,
        marks: q.marks,
        ...(q.options ? { options: q.options } : {}),
      })),
    })),
    answerKey: gemini.answerKey.map((a) => ({
      number: a.number,
      sectionId: a.sectionId,
      answer: a.answer,
    })),
  };
}

// ─── Progress event helper ────────────────────────────────────────────────────

function progressEvent(
  assignmentId: string,
  status: GenerationProgressEvent["status"],
  message: string,
  progress: number,
): GenerationProgressEvent {
  return { assignmentId, status, message, progress, timestamp: new Date().toISOString() };
}

// ─── Bootstrap ───────────────────────────────────────────────────────────────

async function bootstrap() {
  const env = getEnv();

  apiKeys = Array.from(
    new Set(
      [env.GEMINI_API_KEY, ...(env.GEMINI_API_KEYS || "").split(",")]
        .map((k) => k.trim())
        .filter(Boolean)
    )
  );

  if (apiKeys.length === 0) {
    console.error("[worker] No Gemini API keys are configured (neither GEMINI_API_KEY nor GEMINI_API_KEYS). Exiting.");
    process.exit(1);
  }

  console.log(`[worker] Configured with ${apiKeys.length} Gemini API key(s) for rolling rotation.`);

  await mongoose.connect(env.MONGODB_URI);

  const redis = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  const worker = new Worker(
    QUEUE_NAMES.generation,
    async (job) => {
      const { assignmentId, payload } = job.data as {
        assignmentId: string;
        payload: CreateAssignmentDto;
      };

      // Stage 1 — mark processing
      await AssignmentModel.findByIdAndUpdate(assignmentId, { status: "processing" });
      await job.updateProgress(
        progressEvent(assignmentId, "processing", "Building your question paper with AI…", 20),
      );

      // Stage 2 — call Gemini
      console.log(`[worker] Calling Gemini for assignment ${assignmentId}`);
      const prompt = buildPrompt(payload);
      await job.updateProgress(
        progressEvent(assignmentId, "processing", "Generating questions with Gemini…", 50),
      );

      const geminiResult = await callGeminiWithRotation(apiKeys, prompt);
      console.log(`[worker] Gemini responded — ${geminiResult.sections.length} section(s)`);

      await job.updateProgress(
        progressEvent(assignmentId, "processing", "Structuring and validating paper…", 80),
      );

      // Stage 3 — save validated paper
      const paper = mapToQuestionPaper(assignmentId, payload, geminiResult);
      await QuestionPaperModel.findOneAndUpdate({ id: assignmentId }, paper, { upsert: true });
      await AssignmentModel.findByIdAndUpdate(assignmentId, {
        status: "completed",
        questionPaperId: assignmentId,
      });

      await job.updateProgress(
        progressEvent(assignmentId, "completed", "Your question paper is ready!", 100),
      );

      console.log(`[worker] Completed assignment ${assignmentId}`);
    },
    { connection: redis },
  );

  worker.on("completed", (job) => {
    console.log(`[worker] job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[worker] job ${job?.id} failed:`, err.message);
  });

  console.log("[worker] 🚀 Listening for generation jobs (Gemini-powered)");
}

bootstrap().catch((error) => {
  console.error("[worker] failed to bootstrap", error);
  process.exit(1);
});

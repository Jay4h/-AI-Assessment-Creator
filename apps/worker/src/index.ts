import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { Worker } from "bullmq";
import IORedis from "ioredis";
import mongoose from "mongoose";
import OpenAI from "openai";
import { QUEUE_NAMES, getWorkerEnv } from "@vedaai/config";
import type { CreateAssignmentDto } from "@vedaai/validation";
import type { GenerationProgressEvent } from "@vedaai/types";
import { extractImageContext, generateAnswerKey, generateSection } from "./llm/generate.js";
import type { GeneratedAnswerKey, GeneratedSection } from "./llm/schemas.js";

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

// ─── Map LLM output → QuestionPaper DB shape ──────────────────────────────────

function mapToQuestionPaper(
  assignmentId: string,
  payload: CreateAssignmentDto,
  sections: GeneratedSection[],
  meta: GeneratedAnswerKey,
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
    timeAllowed: meta.timeAllowed,
    maximumMarks: totalMarks,
    generalInstruction: meta.generalInstruction,
    introMessage: `AI-generated question paper for ${payload.subject} — ${payload.className}`,
    sections: sections.map((s, i) => ({
      id: s.id,
      title: s.title,
      typeLabel: payload.questionTypes[i]?.label,
      instruction: s.instruction,
      questions: s.questions.map((q) => ({
        id: `${s.id}-${q.number}`,
        number: q.number,
        text: q.text,
        difficulty: q.difficulty,
        marks: q.marks,
        ...("options" in q && q.options ? { options: q.options } : {}),
      })),
    })),
    answerKey: meta.answerKey.map((a) => ({
      number: a.number,
      sectionId: a.sectionId,
      answer: a.answer,
    })),
  };
}

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
  const env = getWorkerEnv(process.env);
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const model = env.OPENAI_MODEL;

  console.log(`[worker] OpenAI model: ${model} (structured outputs)`);

  await mongoose.connect(env.MONGODB_URI);

  const redis = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(env.REDIS_URL.startsWith("rediss://") && {
      tls: { rejectUnauthorized: false },
    }),
  });

  const worker = new Worker(
    QUEUE_NAMES.generation,
    async (job) => {
      const { assignmentId, payload } = job.data as {
        assignmentId: string;
        payload: CreateAssignmentDto;
      };

      console.log(
        `[worker] Assignment ${assignmentId} — image attached: ${!!payload.imageBase64}`,
      );

      await AssignmentModel.findByIdAndUpdate(assignmentId, { status: "processing" });
      await job.updateProgress(
        progressEvent(assignmentId, "processing", "Building your question paper with AI…", 10),
      );

      // ── Step 1: Vision pre-pass (best-effort, non-strict) ─────────────────
      // Extracts a plain-text description from the uploaded image so it can be
      // injected as text context into the structured output prompts in Step 2.
      // This avoids the OpenAI limitation: strict structured outputs refuse
      // image_url content parts.
      let imageContext: string | undefined;
      if (payload.imageBase64 && payload.imageMimeType) {
        await job.updateProgress(
          progressEvent(assignmentId, "processing", "Analysing reference image…", 8),
        );
        imageContext = await extractImageContext(
          openai,
          model,
          payload.imageBase64,
          payload.imageMimeType,
          payload.subject,
          payload.className,
        );
        console.log(
          `[worker] Image context extracted (${imageContext?.length ?? 0} chars): ${imageContext?.slice(0, 80)}…`,
        );
      }

      // ── Step 2: Structured section generation ─────────────────────────────
      const sectionCount = payload.questionTypes.length;
      const sections: GeneratedSection[] = [];

      for (let i = 0; i < sectionCount; i++) {
        const letter = String.fromCharCode(65 + i);
        console.log(`[worker] Generating Section ${letter} for assignment ${assignmentId}`);

        const section = await generateSection(openai, model, payload, i, imageContext);
        sections.push(section);

        const pct = 10 + Math.round(((i + 1) / sectionCount) * 60);
        await job.updateProgress(
          progressEvent(
            assignmentId,
            "processing",
            `Generated Section ${letter} (${section.questions.length} questions)…`,
            pct,
          ),
        );
      }

      console.log(`[worker] Generating answer key for assignment ${assignmentId}`);
      const meta = await generateAnswerKey(openai, model, payload, sections);

      await job.updateProgress(
        progressEvent(assignmentId, "processing", "Saving question paper…", 85),
      );

      const paper = mapToQuestionPaper(assignmentId, payload, sections, meta);
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

  worker.on("failed", async (job, err) => {
    console.error(`[worker] job ${job?.id} failed:`, err.message);
    const assignmentId = (job?.data as { assignmentId?: string } | undefined)?.assignmentId;
    if (assignmentId) {
      await AssignmentModel.findByIdAndUpdate(assignmentId, { status: "failed" });
    }
  });

  console.log("[worker] Listening for generation jobs");
}

bootstrap().catch((error) => {
  console.error("[worker] failed to bootstrap", error);
  process.exit(1);
});

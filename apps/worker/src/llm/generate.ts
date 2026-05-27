import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import type { z } from "zod";
import type { CreateAssignmentDto } from "@vedaai/validation";
import { buildAnswerKeyPrompt, buildSectionPrompt } from "./prompts.js";
import {
  answerKeySchema,
  sectionSchemaFor,
  type GeneratedAnswerKey,
  type GeneratedSection,
} from "./schemas.js";

const SYSTEM_PROMPT =
  "You are an expert Indian school exam question-paper setter (CBSE / ICSE). " +
  "Follow the user instructions precisely.";

const REQUEST_TIMEOUT_MS = 120_000;
const RATE_LIMIT_MAX_RETRIES = 5;

function isRateLimitError(err: unknown): boolean {
  if (err && typeof err === "object" && "status" in err) {
    return (err as { status: number }).status === 429;
  }
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes("429") || msg.includes("rate_limit");
}

function rateLimitDelayMs(err: unknown, attempt: number): number {
  if (err && typeof err === "object" && "headers" in err) {
    const retryAfter = (err as { headers?: Record<string, string> }).headers?.["retry-after"];
    if (retryAfter) {
      const seconds = parseFloat(retryAfter);
      if (!Number.isNaN(seconds)) return Math.ceil(seconds * 1000) + 500;
    }
  }
  return Math.min(60_000, 2000 * 2 ** attempt);
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseWithSchema<T extends z.ZodType>(
  client: OpenAI,
  model: string,
  label: string,
  userPrompt: string,
  schema: T,
  schemaName: string,
): Promise<z.infer<T>> {
  let lastError: unknown;

  for (let attempt = 0; attempt < RATE_LIMIT_MAX_RETRIES; attempt++) {
    try {
      const completion = await client.beta.chat.completions.parse(
        {
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          response_format: zodResponseFormat(schema, schemaName),
          temperature: 0.7,
        },
        { timeout: REQUEST_TIMEOUT_MS },
      );

      const message = completion.choices[0]?.message;
      if (message?.refusal) {
        throw new Error(`${label}: model refused — ${message.refusal}`);
      }
      if (!message?.parsed) {
        throw new Error(`${label}: structured output missing`);
      }

      return message.parsed;
    } catch (err) {
      lastError = err;
      if (!isRateLimitError(err) || attempt >= RATE_LIMIT_MAX_RETRIES - 1) {
        throw err;
      }
      const delayMs = rateLimitDelayMs(err, attempt);
      console.warn(
        `[worker] ${label}: rate limited, retrying in ${delayMs}ms (${attempt + 1}/${RATE_LIMIT_MAX_RETRIES})…`,
      );
      await sleep(delayMs);
    }
  }

  throw lastError;
}

export async function generateSection(
  client: OpenAI,
  model: string,
  payload: CreateAssignmentDto,
  sectionIndex: number,
): Promise<GeneratedSection> {
  const row = payload.questionTypes[sectionIndex];
  const letter = String.fromCharCode(65 + sectionIndex);
  const schema = sectionSchemaFor(row);

  return parseWithSchema(
    client,
    model,
    `Section ${letter}`,
    buildSectionPrompt(payload, sectionIndex),
    schema,
    `section_${letter.toLowerCase()}`,
  );
}

export async function generateAnswerKey(
  client: OpenAI,
  model: string,
  payload: CreateAssignmentDto,
  sections: GeneratedSection[],
): Promise<GeneratedAnswerKey> {
  const totalQuestions = sections.reduce((n, s) => n + s.questions.length, 0);
  const schema = answerKeySchema(totalQuestions);

  return parseWithSchema(
    client,
    model,
    "Answer key",
    buildAnswerKeyPrompt(payload, sections),
    schema,
    "answer_key",
  );
}

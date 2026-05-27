import { z } from "zod";

const baseEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().default(4001),
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017/vedaai"),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

const workerEnvSchema = baseEnvSchema.extend({
  OPENAI_API_KEY: z.string().min(1),
  /** e.g. gpt-4o-mini, gpt-4o — https://platform.openai.com/docs/models */
  OPENAI_MODEL: z.string().min(1).default("gpt-4o-mini"),
});

export type ApiEnv = z.infer<typeof baseEnvSchema>;
export type WorkerEnv = z.infer<typeof workerEnvSchema>;
/** @deprecated Use ApiEnv or WorkerEnv */
export type AppEnv = WorkerEnv;

export function getApiEnv(source: Record<string, string | undefined>): ApiEnv {
  return baseEnvSchema.parse(source);
}

export function getWorkerEnv(source: Record<string, string | undefined>): WorkerEnv {
  return workerEnvSchema.parse(source);
}

/** @deprecated Use getWorkerEnv */
export function getEnv(source: Record<string, string | undefined>): WorkerEnv {
  return getWorkerEnv(source);
}

export const QUEUE_NAMES = {
  generation: "generation-queue",
  pdf: "pdf-queue",
  regeneration: "regeneration-queue",
} as const;

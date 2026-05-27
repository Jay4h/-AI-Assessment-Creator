import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_PORT: z.coerce.number().default(4001),
  MONGODB_URI: z.string().min(1).default("mongodb://localhost:27017/vedaai"),
  REDIS_URL: z.string().min(1).default("redis://localhost:6379"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  GEMINI_API_KEY: z.string().default(""),
  GEMINI_API_KEYS: z.string().default(""),
});

export type AppEnv = z.infer<typeof envSchema>;

export function getEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  return envSchema.parse(source);
}

export const QUEUE_NAMES = {
  generation: "generation-queue",
  pdf: "pdf-queue",
  regeneration: "regeneration-queue",
} as const;

import { Queue } from "bullmq";
import { QUEUE_NAMES } from "@vedaai/config";
import type IORedis from "ioredis";

/** Image and form fields live on MongoDB; worker loads by assignmentId. */
export interface GenerationJobData {
  assignmentId: string;
}

export function createQueues(connection: IORedis) {
  const generationQueue = new Queue<GenerationJobData>(QUEUE_NAMES.generation, {
    connection,
  });

  return { generationQueue };
}

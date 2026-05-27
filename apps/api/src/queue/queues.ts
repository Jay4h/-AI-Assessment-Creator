import { Queue } from "bullmq";
import { QUEUE_NAMES } from "@vedaai/config";
import type { CreateAssignmentInput } from "@vedaai/types";
import type IORedis from "ioredis";

export interface GenerationJobData {
  assignmentId: string;
  payload: CreateAssignmentInput;
}

export function createQueues(connection: IORedis) {
  const generationQueue = new Queue<GenerationJobData>(QUEUE_NAMES.generation, {
    connection,
  });

  return { generationQueue };
}

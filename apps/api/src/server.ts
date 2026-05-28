import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { QueueEvents } from "bullmq";
import IORedis from "ioredis";
import { SOCKET_EVENTS } from "@vedaai/websocket";
import { QUEUE_NAMES } from "@vedaai/config";
import { createAssignmentsRouter } from "./routes/assignments";
import { healthRouter } from "./routes/health";
import type { Queue } from "bullmq";
import type { GenerationJobData } from "./queue/queues";
import type { GenerationProgressEvent } from "@vedaai/types";

export function createApiServer({
  corsOrigin,
  redisUrl,
  generationQueue,
}: {
  corsOrigin: string;
  redisUrl: string;
  generationQueue: Queue<GenerationJobData>;
}) {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, credentials: true },
  });

  app.use(cors({ origin: corsOrigin, credentials: true }));
  app.use(express.json({ limit: "20mb" }));

  app.use("/health", healthRouter);
  app.use("/api/assignments", createAssignmentsRouter(generationQueue));

  // Room subscription
  io.on("connection", (socket) => {
    socket.on("assignment:subscribe", (assignmentId: string) => {
      socket.join(SOCKET_EVENTS.assignmentRoom(assignmentId));
    });
  });

  // --- QueueEvents bridge -------------------------------------------------
  // Uses a dedicated Redis connection (BullMQ best practice: one connection
  // per QueueEvents instance, separate from the Queue connection).
  const queueEventsRedis = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  const queueEvents = new QueueEvents(QUEUE_NAMES.generation, {
    connection: queueEventsRedis,
  });

  // progress — the worker embeds assignmentId in the progress payload
  queueEvents.on("progress", ({ data }) => {
    const payload = data as GenerationProgressEvent;
    if (!payload?.assignmentId) return;
    io.to(SOCKET_EVENTS.assignmentRoom(payload.assignmentId)).emit(
      SOCKET_EVENTS.status,
      payload,
    );
  });

  // failed — emit a failed status event so the client can show an error
  queueEvents.on("failed", async ({ jobId, failedReason }) => {
    try {
      const job = await generationQueue.getJob(jobId);
      if (!job) return;
      const { assignmentId } = job.data;
      const payload: GenerationProgressEvent = {
        assignmentId,
        status: "failed",
        message: failedReason ?? "Generation failed. Please try again.",
        progress: 0,
        timestamp: new Date().toISOString(),
      };
      io.to(SOCKET_EVENTS.assignmentRoom(assignmentId)).emit(SOCKET_EVENTS.status, payload);
    } catch (err) {
      console.error("[api] QueueEvents failed handler error", err);
    }
  });

  return { app, io, httpServer };
}

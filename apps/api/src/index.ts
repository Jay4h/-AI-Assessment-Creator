import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import { getApiEnv } from "@vedaai/config";
import { connectMongo } from "./db/mongo";
import { createRedisConnection } from "./queue/connection";
import { createQueues } from "./queue/queues";
import { createApiServer } from "./server";

async function bootstrap() {
  const env = getApiEnv(process.env);
  await connectMongo(env.MONGODB_URI);

  const redis = createRedisConnection(env.REDIS_URL);
  const { generationQueue } = createQueues(redis);
  const { httpServer } = createApiServer({
    corsOrigin: env.CORS_ORIGIN,
    redisUrl: env.REDIS_URL,
    generationQueue,
  });

  httpServer.listen(env.API_PORT, () => {
    console.log(`[api] listening on http://localhost:${env.API_PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("[api] failed to bootstrap", error);
  process.exit(1);
});

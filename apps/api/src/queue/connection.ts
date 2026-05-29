import IORedis from "ioredis";

export function createRedisConnection(redisUrl: string) {
  const isTls = redisUrl.startsWith("rediss://");
  const conn = new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(isTls && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
  });
  conn.on("error", (err) => {
    console.error("[redis] connection error:", err.message);
  });
  return conn;
}

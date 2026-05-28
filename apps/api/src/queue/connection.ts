import IORedis from "ioredis";

export function createRedisConnection(redisUrl: string) {
  const isTls = redisUrl.startsWith("rediss://");
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(isTls && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
  });
}

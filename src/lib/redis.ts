import { createClient } from 'redis';

import type { RedisClientType } from 'redis';


const globalForRedis = globalThis as unknown as { redis: RedisClientType };

export const redis =
  globalForRedis.redis ||
  await createClient({ url: process.env.REDIS_URL })
    .on('error', async (e) => {
      console.error('Redis Client Error:', e);
    })
    .connect();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

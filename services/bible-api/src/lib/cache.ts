import Redis from 'ioredis';

let redis: Redis | null = null;
let redisAvailable = true;

function getRedis(): Redis | null {
  if (!redisAvailable) return null;
  if (redis) return redis;

  const url = process.env.REDIS_URL ?? 'redis://localhost:6379';
  redis = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 1 });

  redis.on('error', (err: Error) => {
    if (redisAvailable) {
      console.warn('[Cache] Redis unavailable, caching disabled:', err.message);
      redisAvailable = false;
    }
  });

  redis.on('connect', () => {
    redisAvailable = true;
    console.log('[Cache] Redis connected');
  });

  return redis;
}

export async function get<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client || !redisAvailable) return null;
  try {
    const val = await client.get(key);
    if (!val) return null;
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

export async function set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
  const client = getRedis();
  if (!client || !redisAvailable) return;
  try {
    await client.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  } catch {
    // silently fail
  }
}

export async function del(key: string): Promise<void> {
  const client = getRedis();
  if (!client || !redisAvailable) return;
  try {
    await client.del(key);
  } catch {
    // silently fail
  }
}

export async function flush(): Promise<void> {
  const client = getRedis();
  if (!client || !redisAvailable) return;
  try {
    await client.flushall();
  } catch {
    // silently fail
  }
}

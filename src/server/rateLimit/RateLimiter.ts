import { RateLimitError } from '../core/errors';

type Bucket = {
  count: number;
  resetAt: number; // epoch ms
};

export type RateLimitResult = {
  headers: Record<string, string>;
};

export interface IRateLimiter {
  check(key: string, limit: number, windowMs: number): RateLimitResult;
}

export class MemoryRateLimiter implements IRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  public check(key: string, limit: number, windowMs: number): RateLimitResult {
    const now = Date.now();
    const existing = this.buckets.get(key);

    let bucket: Bucket;
    if (!existing || existing.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      this.buckets.set(key, bucket);
    } else {
      bucket = existing;
    }

    if (bucket.count >= limit) {
      throw new RateLimitError('Too many requests. Please try again later.', bucket.resetAt);
    }

    bucket.count += 1;

    const remaining = Math.max(0, limit - bucket.count);
    const resetSec = Math.ceil(bucket.resetAt / 1000);

    return {
      headers: {
        'X-RateLimit-Limit': String(limit),
        'X-RateLimit-Remaining': String(remaining),
        'X-RateLimit-Reset': String(resetSec)
      }
    };
  }
}

import type { RateLimiter, RateLimitConfig, RateLimitResult } from '@/app/security/rate-limit';

type Bucket = { count: number; resetsAt: number };
export class MemoryRateLimiter implements RateLimiter {
  private readonly buckets = new Map<string, Bucket>();
  async check(key: string, config: RateLimitConfig): Promise<RateLimitResult> {
    const now = Date.now();
    const current = this.buckets.get(key);
    const bucket = !current || current.resetsAt <= now ? { count: 0, resetsAt: now + config.windowSeconds * 1000 } : current;
    bucket.count += 1; this.buckets.set(key, bucket);
    return { allowed: bucket.count <= config.limit, remaining: Math.max(0, config.limit - bucket.count), retryAfterSeconds: Math.ceil((bucket.resetsAt - now) / 1000) };
  }
}

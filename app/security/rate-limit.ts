export type RateLimitConfig = { limit: number; windowSeconds: number };
export type RateLimitResult = { allowed: boolean; remaining: number; retryAfterSeconds?: number };

export interface RateLimiter {
  check(key: string, config: RateLimitConfig): Promise<RateLimitResult>;
}

// A distributed adapter must be supplied before OTP or other protected endpoints are enabled.
export function requireRateLimiter(adapter?: RateLimiter): RateLimiter {
  if (!adapter) throw new Error('A distributed rate-limit adapter has not been configured');
  return adapter;
}

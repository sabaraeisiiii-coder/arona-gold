import { describe, expect, it } from 'vitest';
import { validateEnvironment } from '@/app/config/env';

const valid = {
  NODE_ENV: 'test',
  APP_ENV: 'development',
  APP_URL: 'http://localhost:3000',
  DATABASE_URL: 'postgresql://user:pass@example.test/db',
  LOG_LEVEL: 'info',
  SESSION_SECRET: 'a-secure-test-secret-with-32-characters',
  OTP_HASH_SECRET: 'a-secure-otp-secret-with-32-characters',
};

describe('environment validation', () => {
  it('accepts a complete environment', () => {
    expect(validateEnvironment(valid).APP_ENV).toBe('development');
  });

  it('reports missing required variables without exposing values', () => {
    expect(() => validateEnvironment({})).toThrow('APP_URL');
  });
});

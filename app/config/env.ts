import { z } from 'zod';
import { ENVIRONMENTS, LOG_LEVELS } from '@/app/constants/foundation';

const blankToUndefined = (value: unknown) => value === '' ? undefined : value;
const optionalSecret = z.preprocess(blankToUndefined, z.string().min(1).optional());

export const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(ENVIRONMENTS).default('development'),
  APP_URL: z.url(),
  DATABASE_URL: z.string().min(1).refine(
    (value) => value.startsWith('postgres://') || value.startsWith('postgresql://'),
    'DATABASE_URL must be a PostgreSQL URL',
  ),
  LOG_LEVEL: z.enum(LOG_LEVELS).default('info'),
  SESSION_SECRET: z.string().min(32),
  OTP_HASH_SECRET: z.string().min(32),
  OTP_EXPIRES_SECONDS: z.coerce.number().int().min(60).max(600).default(120),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(10).default(5),
  OTP_RATE_LIMIT_MAX: z.coerce.number().int().min(1).max(20).default(5),
  OTP_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().min(60).default(900),
  SESSION_EXPIRES_SECONDS: z.coerce.number().int().min(3600).default(604800),
  AUTH_DEBUG_OTP: z.preprocess(blankToUndefined, z.enum(['true', 'false']).default('false')).transform((v) => v === 'true'),
  SMS_API_KEY: optionalSecret,
  PAYMENT_API_KEY: optionalSecret,
  GOLD_PRICE_API_KEY: optionalSecret,
});

export type AppConfig = z.infer<typeof environmentSchema>;

export function validateEnvironment(env: Record<string, string | undefined>): AppConfig {
  const result = environmentSchema.safeParse(env);
  if (!result.success) {
    const names = result.error.issues.map((issue) => issue.path.join('.') || 'environment').join(', ');
    throw new Error(`Invalid environment configuration: ${names}`);
  }
  return result.data;
}

let cachedConfig: AppConfig | undefined;

export function getConfig(): AppConfig {
  cachedConfig ??= validateEnvironment(process.env);
  return cachedConfig;
}

export function getDatabaseUrl(env: Record<string, string | undefined> = process.env): string {
  const result = environmentSchema.shape.DATABASE_URL.safeParse(env.DATABASE_URL);
  if (!result.success) throw new Error('Invalid environment configuration: DATABASE_URL');
  return result.data;
}

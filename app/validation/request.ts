import { z } from 'zod';
import { ValidationError } from '@/app/lib/errors';

function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const result = schema.safeParse(value);
  if (result.success) return result.data;
  throw new ValidationError('ورودی نامعتبر است', result.error.issues.map((issue) => ({
    field: issue.path.join('.'),
    issue: issue.code,
    message: issue.message,
  })));
}

export async function validateJsonBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ValidationError('بدنه JSON نامعتبر است');
  }
  return parse(schema, body);
}

export function validateQuery<T>(request: Request, schema: z.ZodType<T>): T {
  return parse(schema, Object.fromEntries(new URL(request.url).searchParams));
}

export function validateParams<T>(params: unknown, schema: z.ZodType<T>): T {
  return parse(schema, params);
}

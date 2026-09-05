import { describe, expect, it } from 'vitest';
import { AppError, ConflictError, normalizeError } from '@/app/lib/errors';

describe('application errors', () => {
  it('exposes a stable code and HTTP status', () => {
    const error = new ConflictError('Duplicate');
    expect(error).toBeInstanceOf(AppError);
    expect(error.code).toBe('CONFLICT');
    expect(error.httpStatus).toBe(409);
  });

  it('hides unknown error messages', () => {
    const error = normalizeError(new Error('database password leaked'));
    expect(error.code).toBe('INTERNAL_ERROR');
    expect(error.message).toBe('An unexpected error occurred');
  });
});

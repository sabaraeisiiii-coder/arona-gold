import { ValidationError } from '@/app/lib/errors';

export function asObject(value: unknown, field = 'body'): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationError(`${field} must be an object`, [{ field, issue: 'invalid_type' }]);
  }
  return value as Record<string, unknown>;
}

export function asNonEmptyString(value: unknown, field: string, maxLength = 255): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ValidationError(`${field} is required`, [{ field, issue: 'required' }]);
  }
  const normalized = value.trim();
  if (normalized.length > maxLength) {
    throw new ValidationError(`${field} is too long`, [{ field, issue: 'max_length', maxLength }]);
  }
  return normalized;
}

export function asPositiveInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1) {
    throw new ValidationError(`${field} must be a positive integer`, [{ field, issue: 'invalid_value' }]);
  }
  return value;
}

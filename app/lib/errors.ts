export type AppErrorOptions = {
  status?: number;
  code?: string;
  details?: Record<string, unknown> | unknown[];
  cause?: unknown;
};

export class AppError extends Error {
  readonly httpStatus: number;
  readonly code: string;
  readonly details?: Record<string, unknown> | unknown[];

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause });
    this.name = 'AppError';
    this.httpStatus = options.status ?? 500;
    this.code = options.code ?? 'INTERNAL_ERROR';
    this.details = options.details;
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Request validation failed', details?: AppErrorOptions['details']) {
    super(message, { status: 400, code: 'VALIDATION_ERROR', details });
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication is required') {
    super(message, { status: 401, code: 'UNAUTHORIZED' });
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'You do not have permission to perform this action') {
    super(message, { status: 403, code: 'FORBIDDEN' });
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} was not found`, { status: 404, code: 'NOT_FOUND' });
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message = 'The request conflicts with the current state', details?: AppErrorOptions['details']) {
    super(message, { status: 409, code: 'CONFLICT', details });
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, { status: 429, code: 'RATE_LIMITED' });
    this.name = 'RateLimitError';
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'An unexpected error occurred', cause?: unknown) {
    super(message, { status: 500, code: 'INTERNAL_ERROR', cause });
    this.name = 'InternalServerError';
  }
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) return error;
  return new InternalServerError('An unexpected error occurred', error);
}

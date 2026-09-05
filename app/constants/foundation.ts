export const API_VERSION = 'v1' as const;

export const ENVIRONMENTS = ['development', 'pre-production', 'production'] as const;
export type AppEnvironment = (typeof ENVIRONMENTS)[number];

export const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

export const HEADERS = {
  requestId: 'x-request-id',
} as const;

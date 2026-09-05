import type { LogLevel } from '@/app/constants/foundation';
import { redactSensitive } from './redact';

export type LogContext = {
  module: string;
  requestId?: string;
  userId?: string;
  orderId?: string;
  paymentId?: string;
  [key: string]: unknown;
};

export type Logger = {
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: unknown, context?: Record<string, unknown>): void;
  child(context: Partial<LogContext>): Logger;
};

function write(level: LogLevel, base: LogContext, message: string, extra: Record<string, unknown> = {}) {
  const entry = redactSensitive({
    timestamp: new Date().toISOString(),
    level,
    ...base,
    ...extra,
    message,
  });
  const serialized = JSON.stringify(entry);
  if (level === 'error') console.error(serialized);
  else if (level === 'warn') console.warn(serialized);
  else if (level === 'debug') console.debug(serialized);
  else console.info(serialized);
}

export function createLogger(base: LogContext): Logger {
  return {
    debug: (message, context) => write('debug', base, message, context),
    info: (message, context) => write('info', base, message, context),
    warn: (message, context) => write('warn', base, message, context),
    error: (message, error, context) => write('error', base, message, {
      ...context,
      ...(error instanceof Error ? { error: { name: error.name, message: error.message } } : { error }),
    }),
    child: (context) => createLogger({ ...base, ...context }),
  };
}

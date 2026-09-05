import { NextResponse } from 'next/server';
import type { ApiFailure, ApiMeta, ApiSuccess } from '@/app/types/api';
import { normalizeError } from './errors';
import { requestIdHeader } from './request-id';

export function apiSuccess<T>(
  data: T,
  options: { status?: number; meta?: ApiMeta; requestId: string },
) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
    meta: { ...options.meta, requestId: options.requestId },
  };

  return NextResponse.json(body, {
    status: options.status ?? 200,
    headers: requestIdHeader(options.requestId),
  });
}

export function apiError(error: unknown, requestId: string) {
  const normalized = normalizeError(error);
  const body: ApiFailure = {
    success: false,
    error: {
      code: normalized.code,
      message: normalized.message,
      ...(normalized.details ? { details: normalized.details } : {}),
    },
  };

  return NextResponse.json(body, {
    status: normalized.httpStatus,
    headers: requestIdHeader(requestId),
  });
}

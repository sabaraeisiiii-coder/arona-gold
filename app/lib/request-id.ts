import { HEADERS } from '@/app/constants/foundation';

const SAFE_REQUEST_ID = /^[A-Za-z0-9._:-]{8,128}$/;

export function getRequestId(request: Request): string {
  const supplied = request.headers.get(HEADERS.requestId)?.trim();
  return supplied && SAFE_REQUEST_ID.test(supplied) ? supplied : crypto.randomUUID();
}

export function requestIdHeader(requestId: string): Record<string, string> {
  return { [HEADERS.requestId]: requestId };
}

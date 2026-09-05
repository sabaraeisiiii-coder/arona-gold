import type { RequestContext } from '@/app/types/api';
import { apiError } from './api-response';
import { getRequestId } from './request-id';
import { createLogger } from '@/app/logging/logger';

type ApiHandler = (request: Request, context: RequestContext) => Response | Promise<Response>;

export function withApiHandler(handler: ApiHandler) {
  return async function apiHandler(request: Request): Promise<Response> {
    const requestId = getRequestId(request);
    const logger = createLogger({ module: 'api', requestId });
    const startedAt = Date.now();

    try {
      const response = await handler(request, { requestId, logger });
      logger.info('API request completed', {
        method: request.method,
        path: new URL(request.url).pathname,
        status: response.status,
        durationMs: Date.now() - startedAt,
      });
      return response;
    } catch (error) {
      logger.error('API request failed', error, {
        method: request.method,
        path: new URL(request.url).pathname,
        durationMs: Date.now() - startedAt,
      });
      return apiError(error, requestId);
    }
  };
}

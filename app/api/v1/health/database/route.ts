import { withApiHandler } from '@/app/lib/api-handler';
import { apiSuccess } from '@/app/lib/api-response';
import { checkDatabaseConnection } from '@/app/db/health';

export const GET = withApiHandler(async (_request, { requestId, logger }) => {
  const connected = await checkDatabaseConnection();
  if (!connected) logger.warn('Database health check failed');

  return apiSuccess(
    { status: connected ? 'ok' : 'degraded', connected },
    { requestId, status: connected ? 200 : 503 },
  );
});

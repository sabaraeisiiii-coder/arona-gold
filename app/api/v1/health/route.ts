import { withApiHandler } from '@/app/lib/api-handler';
import { apiSuccess } from '@/app/lib/api-response';
import { API_VERSION } from '@/app/constants/foundation';

export const GET = withApiHandler((_request, { requestId }) => {
  return apiSuccess(
    { status: 'ok', service: 'Arona Gold', version: API_VERSION },
    { requestId },
  );
});

import { describe, expect, it } from 'vitest';
import { apiError, apiSuccess } from '@/app/lib/api-response';
import { ValidationError } from '@/app/lib/errors';

describe('API responses', () => {
  it('creates the standard success envelope and request ID header', async () => {
    const response = apiSuccess({ status: 'ok' }, { requestId: 'request-12345' });
    expect(response.headers.get('x-request-id')).toBe('request-12345');
    expect(await response.json()).toEqual({
      success: true,
      data: { status: 'ok' },
      meta: { requestId: 'request-12345' },
    });
  });

  it('creates the standard validation error envelope', async () => {
    const response = apiError(new ValidationError('Invalid', [{ field: 'name' }]), 'request-12345');
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ success: false, error: { code: 'VALIDATION_ERROR' } });
  });
});

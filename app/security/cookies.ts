import type { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import type { AppEnvironment } from '@/app/constants/foundation';

export function secureCookieOptions(environment: AppEnvironment): Partial<ResponseCookie> {
  return {
    httpOnly: true,
    secure: environment !== 'development',
    sameSite: 'lax',
    path: '/',
  };
}

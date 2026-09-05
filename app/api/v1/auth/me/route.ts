import type { NextRequest } from 'next/server'; import { apiSuccess } from '@/app/lib/api-response'; import { withApiHandler } from '@/app/lib/api-handler'; import { requireAuth } from '@/app/auth/request';
export const GET=withApiHandler(async(request,{requestId})=>apiSuccess(await requireAuth(request as NextRequest),{requestId}));

import { apiRequest } from './api-client';import type { AuthUser } from '@/app/auth/types';
export const profileService={get:()=>apiRequest<AuthUser>('/profile'),update:(value:{firstName:string|null;lastName:string|null})=>apiRequest<AuthUser>('/profile',{method:'PATCH',body:JSON.stringify(value)})};

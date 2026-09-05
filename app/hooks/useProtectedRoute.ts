'use client';
import { useEffect } from 'react';import { usePathname,useRouter } from 'next/navigation';import { useAppStore } from '@/app/store/AppStore';
export function useProtectedRoute(){const{user,authReady}=useAppStore();const router=useRouter();const pathname=usePathname();useEffect(()=>{if(authReady&&!user)router.replace(`/login?next=${encodeURIComponent(pathname)}`)},[authReady,user,router,pathname]);return{user,loading:!authReady};}

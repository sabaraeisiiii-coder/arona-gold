'use client';
import type { ReactNode } from 'react';import { AuthStoreProvider,useAuthStore } from './AuthStore';import { CommerceStoreProvider,useCommerceStore } from './CommerceStore';import { UiStoreProvider,useUiStore } from './UiStore';
export type { Address } from '../types/address';export type { CartItem as CartLine } from '../types/cart';export type { Order } from '../types/order';
export function AppStoreProvider({children}:{children:ReactNode}){return <UiStoreProvider><AuthStoreProvider><CommerceStoreProvider>{children}</CommerceStoreProvider></AuthStoreProvider></UiStoreProvider>}
/** Compatibility facade for existing consumers; state ownership is split across focused contexts. */
export function useAppStore(){return {...useAuthStore(),...useCommerceStore(),...useUiStore()}}
export { useAuthStore } from './AuthStore';export { useCommerceStore } from './CommerceStore';export { useUiStore } from './UiStore';

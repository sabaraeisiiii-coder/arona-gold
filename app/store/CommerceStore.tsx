'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { parseCommerceState } from '../services/commerce-storage';
import type { Address } from '../types/address';
import type { CartItem } from '../types/cart';
import type { Order } from '../types/order';
import { initialAddresses, initialCart, initialOrders, initialWishlist } from '../data/mock/account';
import { useUiStore } from './UiStore';

type CommerceState = { cart: CartItem[]; wishlist: number[]; coupon: string | null; addresses: Address[]; orders: Order[] };
type CommerceStore = CommerceState & {
  addToCart: (id: number) => void; changeQuantity: (id: number, delta: number) => void; removeFromCart: (id: number) => void;
  toggleWishlist: (id: number) => void; applyCoupon: (code: string) => boolean;
  saveAddress: (address: Omit<Address, 'id'> & { id?: Address['id'] }) => void; deleteAddress: (id: Address['id']) => void;
  replaceAddresses: (addresses: Address[]) => void;
  placeOrder: (amount: number, addressId?: Address['id']) => Order;
};
const CommerceContext = createContext<CommerceStore | null>(null);

/** A per-provider browser snapshot: SSR keeps fixtures, hydration reads storage once.
 * useSyncExternalStore synchronizes this external data without cascading hydration effects.
 */
function createCommerceState() {
  const initial: CommerceState = { cart: initialCart, wishlist: initialWishlist, coupon: null, addresses: initialAddresses, orders: initialOrders };
  let current = initial, initialized = false, recoveryNeeded = false;
  const listeners = new Set<() => void>();
  const getSnapshot = () => {
    if (!initialized) {
      initialized = true;
      try {
        const raw = localStorage.getItem('zarinbaz-state');
        if (raw) {
          const saved = parseCommerceState(raw);
          current = { cart: saved.cart ?? initial.cart, wishlist: saved.wishlist ?? initial.wishlist, coupon: saved.coupon ?? null, addresses: saved.addresses ?? initial.addresses, orders: saved.orders ?? initial.orders };
        }
      } catch { recoveryNeeded = true; }
    }
    return current;
  };
  return {
    getSnapshot, getServerSnapshot: () => initial,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    recoveryNeeded: () => recoveryNeeded,
    update: (change: (state: CommerceState) => CommerceState) => {
      current = change(getSnapshot());
      try { localStorage.setItem('zarinbaz-state', JSON.stringify(current)); }
      catch { /* Browser storage can be unavailable; retain this session's in-memory state. */ }
      listeners.forEach(listener => listener());
    },
  };
}

export function CommerceStoreProvider({ children }: { children: ReactNode }) {
  const [storage] = useState(createCommerceState);
  const state = useSyncExternalStore(storage.subscribe, storage.getSnapshot, storage.getServerSnapshot);
  const { notify } = useUiStore();
  useEffect(() => { if (storage.recoveryNeeded()) notify('بازیابی سبد ذخیره‌شده ممکن نبود', 'warning'); }, [storage, notify]);
  const replaceAddresses = useCallback((addresses: Address[]) => storage.update(current => ({ ...current, addresses })), [storage]);
  const value = useMemo<CommerceStore>(() => ({
    ...state, replaceAddresses,
    addToCart: id => {
      storage.update(current => ({ ...current, cart: current.cart.some(item => item.productId === id) ? current.cart.map(item => item.productId === id ? { ...item, quantity: item.quantity + 1 } : item) : [...current.cart, { productId: id, quantity: 1 }] }));
      notify('محصول به سبد خرید اضافه شد');
    },
    changeQuantity: (id, delta) => {
      if (!Number.isSafeInteger(delta)) return;
      storage.update(current => ({ ...current, cart: current.cart.map(item => item.productId === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0) }));
    },
    removeFromCart: id => { storage.update(current => ({ ...current, cart: current.cart.filter(item => item.productId !== id) })); notify('محصول از سبد حذف شد', 'warning'); },
    toggleWishlist: id => {
      const wished = storage.getSnapshot().wishlist.includes(id);
      storage.update(current => ({ ...current, wishlist: wished ? current.wishlist.filter(item => item !== id) : [...current.wishlist, id] }));
      notify(wished ? 'از علاقه‌مندی‌ها حذف شد' : 'به علاقه‌مندی‌ها اضافه شد', 'info');
    },
    applyCoupon: code => {
      const valid = code.trim().toUpperCase() === 'ARONA10';
      if (valid) storage.update(current => ({ ...current, coupon: 'ARONA10' }));
      notify(valid ? 'کد تخفیف اعمال شد' : 'کد تخفیف نامعتبر است', valid ? 'success' : 'error');
      return valid;
    },
    saveAddress: address => {
      const saved = { ...address, id: address.id ?? Date.now() };
      storage.update(current => ({ ...current, addresses: address.id ? current.addresses.map(item => item.id === address.id ? saved : item) : [...current.addresses, saved] }));
      notify('آدرس ذخیره شد');
    },
    deleteAddress: id => { storage.update(current => ({ ...current, addresses: current.addresses.filter(item => item.id !== id) })); notify('آدرس حذف شد', 'warning'); },
    placeOrder: (amount, addressId) => {
      const current = storage.getSnapshot();
      const address = addressId === undefined ? current.addresses[0] : current.addresses.find(item => item.id === addressId);
      if (!current.cart.length || !address || !Number.isFinite(amount) || amount < 0) throw new Error('Invalid local order');
      const order: Order = { id: `ZB-${Date.now().toString().slice(-8)}`, date: new Intl.DateTimeFormat('fa-IR').format(new Date()), amount, status: 'paid', items: current.cart, address: address.line, reference: `REF-${Math.floor(Math.random() * 900000000 + 100000000)}` };
      storage.update(current => ({ ...current, orders: [order, ...current.orders], cart: [], coupon: null }));
      notify('سفارش با موفقیت ثبت شد');
      return order;
    },
  }), [state, storage, notify, replaceAddresses]);
  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}
export function useCommerceStore() {
  const value = useContext(CommerceContext);
  if (!value) throw new Error('useCommerceStore must be used inside CommerceStoreProvider');
  return value;
}

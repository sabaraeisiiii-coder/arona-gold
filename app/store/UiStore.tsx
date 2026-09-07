'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Toast } from '../components/ui/Toast';

export type ToastTone = 'success' | 'warning' | 'error' | 'info';
export type ToastMessage = { id: number; text: string; tone: ToastTone };
type UiStore = { toasts: ToastMessage[]; notify: (text: string, tone?: ToastTone) => void };
const UiContext = createContext<UiStore | null>(null);

export function UiStoreProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const nextId = useRef(0);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const notify = useCallback((text: string, tone: ToastTone = 'success') => {
    const id = ++nextId.current;
    setToasts(items => [...items, { id, text, tone }]);
    const timer = setTimeout(() => {
      setToasts(items => items.filter(item => item.id !== id));
      timers.current.delete(timer);
    }, 2800);
    timers.current.add(timer);
  }, []);

  const value = useMemo<UiStore>(() => ({ toasts, notify }), [toasts, notify]);
  return (
    <UiContext.Provider value={value}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-relevant="additions">
        {toasts.map(toast => <Toast key={toast.id} tone={toast.tone}>{toast.text}</Toast>)}
      </div>
    </UiContext.Provider>
  );
}

export function useUiStore() {
  const value = useContext(UiContext);
  if (!value) throw new Error('useUiStore must be used inside UiStoreProvider');
  return value;
}

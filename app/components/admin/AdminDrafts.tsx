'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { initialAdminRecords, type AdminRecord } from './resource-config';
import type { AdminResource } from '../../mock/admin';

type DraftContext = {
  records: Record<AdminResource, AdminRecord[]>;
  save: (resource: AdminResource, record: AdminRecord) => void;
  remove: (resource: AdminResource, id: string) => void;
};
const Context = createContext<DraftContext | null>(null);
export function AdminDrafts({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState(initialAdminRecords);
  return <Context.Provider value={{ records,
    save: (resource, record) => setRecords(current => ({ ...current, [resource]: current[resource].some(item => item.id === record.id)
      ? current[resource].map(item => item.id === record.id ? { ...record } : item) : [...current[resource], { ...record }] })),
    remove: (resource, id) => setRecords(current => ({ ...current, [resource]: current[resource].filter(item => item.id !== id) })),
  }}>{children}</Context.Provider>;
}
export function useAdminDrafts() {
  const context = useContext(Context);
  if (!context) throw new Error('AdminDrafts provider is required');
  return context;
}

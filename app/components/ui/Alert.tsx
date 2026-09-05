import type { ReactNode } from 'react';
export function Alert({ tone='info', children }: { tone?: 'success'|'warning'|'error'|'info'; children: ReactNode }) { return <div className={`ds-alert ds-alert-${tone}`} role="status">{children}</div>; }

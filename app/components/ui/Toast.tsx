import type { ReactNode } from 'react';
export function Toast({children,tone='info'}:{children:ReactNode;tone?:'success'|'warning'|'error'|'info'}){return <div className={`toast toast-${tone}`} role="status">{children}</div>}

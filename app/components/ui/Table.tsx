import type { ReactNode } from 'react';
export function Table({ headers, children }: { headers: string[]; children: ReactNode }) { return <div className="ds-table-wrapper"><table className="ds-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>; }

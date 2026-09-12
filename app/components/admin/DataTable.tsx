import type { ReactNode } from 'react';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';

export type Column<Row> = { key: string; header: string; render: (row: Row) => ReactNode };

export function DataTable<Row>({ columns, rows, rowKey, loading = false, emptyTitle = 'داده‌ای وجود ندارد', actions }: {
  columns: Column<Row>[]; rows: Row[]; rowKey: (row: Row) => string;
  loading?: boolean; emptyTitle?: string; actions?: (row: Row) => ReactNode;
}) {
  if (loading) return <div className="ds-card admin-table-loading"><Skeleton height={48} /><Skeleton height={48} /><Skeleton height={48} /></div>;
  if (!rows.length) return <EmptyState title={emptyTitle} description="با تغییر فیلترها دوباره بررسی کنید." />;
  return <div className="ds-table-wrapper admin-data-table" role="region" aria-label="جدول داده‌ها" tabIndex={0}>
    <table className="ds-table" role="table">
      <thead role="rowgroup"><tr role="row">
        {columns.map(column => <th key={column.key} scope="col" role="columnheader">{column.header}</th>)}
        {actions && <th scope="col" role="columnheader">عملیات</th>}
      </tr></thead>
      <tbody role="rowgroup">{rows.map(row => <tr key={rowKey(row)} role="row">
        {columns.map(column => <td key={column.key} role="cell" data-column={column.key}>
          <span className="admin-mobile-label" aria-hidden="true">{column.header}</span>
          <div className="admin-cell-content">{column.render(row)}</div>
        </td>)}
        {actions && <td role="cell" className="admin-actions-cell">
          <span className="admin-mobile-label" aria-hidden="true">عملیات</span>
          {actions(row)}
        </td>}
      </tr>)}</tbody>
    </table>
  </div>;
}

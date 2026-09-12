import Link from 'next/link';
import { EmptyState } from '../ui/EmptyState';
import { AdminRecordValue } from './AdminRecordValue';
import { resourceConfig, type AdminRecord } from './resource-config';

const layouts = {
  orders: { groups: [['number', 'date'], ['customer', 'mobile'], ['amount'], ['status'], ['shipping']], secondary: ['address', 'reference'] },
  payments: { groups: [['number', 'order', 'createdAt'], ['customer'], ['amount'], ['status'], ['gateway']], secondary: ['transaction', 'reference', 'verifiedAt'] },
};
const noWrap = new Set(['number', 'order', 'mobile', 'amount', 'status', 'date', 'createdAt', 'verifiedAt', 'reference', 'transaction']);

/** Orders and payments share a presentation only; their records and actions stay unchanged. */
export function AdminFinancialList({ resource, rows, emptyTitle }: {
  resource: keyof typeof layouts; rows: AdminRecord[]; emptyTitle: string;
}) {
  if (!rows.length) return <EmptyState title={emptyTitle} description="با تغییر فیلترها دوباره بررسی کنید." />;
  const layout = layouts[resource];
  function field(record: AdminRecord, key: string) {
    const label = resourceConfig[resource].fields.find(item => item.key === key)?.label;
    return <div key={key} className={`admin-financial-field${noWrap.has(key) ? ' admin-financial-nowrap' : ''}`}>
      <dt>{label}</dt><dd><AdminRecordValue field={key} value={record[key]} /></dd>
    </div>;
  }
  return <ul className="admin-financial-list" aria-label={resource === 'orders' ? 'فهرست سفارش‌ها' : 'فهرست پرداخت‌ها'}>
    {rows.map(record => <li key={record.id} className="admin-financial-record">
      <div className="admin-financial-main">
        {layout.groups.map(keys => <dl key={keys[0]} className="admin-financial-group">{keys.map(key => field(record, key))}</dl>)}
        <div className="admin-financial-actions"><Link className="ds-button ds-button-secondary" href={`/admin/${resource}/${encodeURIComponent(record.id)}`}>مشاهده</Link></div>
      </div>
      <dl className="admin-financial-secondary">{layout.secondary.map(key => field(record, key))}</dl>
    </li>)}
  </ul>;
}

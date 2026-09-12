import { formatMoney } from '../../lib/format';
import { displayValue } from './resource-config';
import { StatusBadge } from './StatusBadge';

/** Presentation only: no inferred fields, status transitions or numeric conversion beyond existing price formatting. */
export function AdminRecordValue({ field, value }: { field: string; value?: string }) {
  if (field === 'status') return <StatusBadge status={value || ''} />;
  const primary = ['number', 'name', 'customer', 'order', 'title'].includes(field);
  const amount = ['price', 'amount', 'totalSpent'].includes(field);
  return <span className={`admin-cell-text ${primary ? 'admin-value-primary' : amount ? 'admin-value-amount' : 'admin-value-secondary'}`}>
    <bdi>{field === 'price' && value ? formatMoney(Number(value)) : displayValue(value)}</bdi>
  </span>;
}

'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { AdminResource } from '../../mock/admin';
import { products } from '../../data/mock/products';
import { formatNumber } from '../../lib/format';
import { useUiStore } from '../../store/UiStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { ProductMedia } from '../commerce/ProductMedia';
import { DataTable, type Column } from './DataTable';
import { AdminPageHeader } from './AdminPageHeader';
import { ConfirmDialog } from './ConfirmDialog';
import { AdminRecordForm } from './AdminRecordForm';
import { useAdminDrafts } from './AdminDrafts';
import { resourceConfig, normalizeAdminSearch, type AdminRecord } from './resource-config';
import { AdminRecordValue } from './AdminRecordValue';
import { AdminFinancialList } from './AdminFinancialList';

const statuses: Record<string, string> = { active: 'فعال', inactive: 'غیرفعال', draft: 'پیش‌نویس', out_of_stock: 'ناموجود' };
export function AdminResourcePage({ resource, title, description }: { resource: AdminResource; title: string; description: string }) {
  const { records, save, remove } = useAdminDrafts();
  const { notify } = useUiStore();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<AdminRecord | null>(null);
  const [deleting, setDeleting] = useState<AdminRecord | null>(null);
  const config = resourceConfig[resource];
  const rows = records[resource];
  const filtered = rows.filter(row => Object.values(row).some(value => normalizeAdminSearch(value).includes(normalizeAdminSearch(query)))
    && (!status || row.status === status) && Object.entries(filters).every(([key, value]) => normalizeAdminSearch(row[key] || '').includes(normalizeAdminSearch(value))));
  const columns: Column<AdminRecord>[] = config.fields
    .filter(field => resource !== 'products' || !['slug', 'wage', 'image', 'description', 'metaTitle', 'metaDescription'].includes(field.key))
    .map(field => ({ key: field.key, header: field.label, render: row => <AdminRecordValue field={field.key} value={row[field.key]} /> }));
  if (resource === 'products') columns.unshift({ key: 'image', header: 'تصویر', render: row => {
    const product = products.find(product => String(product.id) === row.id);
    return product ? <ProductMedia product={product} className="admin-product-thumbnail" sizes="48px" /> : <span className="admin-muted">ثبت نشده</span>;
  } });
  const canCreateInline = ['announcements', 'roles'].includes(resource);
  return <>
    <AdminPageHeader title={title} description={description} action={<div className="table-actions">
      {config.create && <Link className="ds-button ds-button-primary" href={`/admin/${resource}/new`}>＋ افزودن</Link>}
      {canCreateInline && <Button onClick={() => setEditing({ id: '' })}>＋ افزودن آزمایشی</Button>}
      {resource === 'inventory' && <Link className="ds-button ds-button-secondary" href="/admin/inventory/history">تاریخچه موجودی</Link>}
    </div>} />
    <p className="admin-notice">داده‌های نمونه · {config.readOnly ? 'فقط خواندنی؛ اطلاعات تکمیلی ناموجود با «ثبت نشده» مشخص است.' : 'تغییرات آزمایشی فقط تا بارگذاری مجدد، در حافظه پنل باقی می‌مانند.'}</p>
    <section className="ds-card admin-resource">
      <div className="admin-filter-bar">
        <Input label="جستجو" value={query} onChange={event => setQuery(event.target.value)} placeholder="نام، شناسه یا کد را جستجو کنید" />
        {config.fields.some(field => field.key === 'status') && <Select label="وضعیت" value={status} onChange={event => setStatus(event.target.value)}>
          <option value="">همه وضعیت‌ها</option>{[...new Set(rows.map(row => row.status).filter(Boolean))].map(value => <option key={value} value={value}>{statuses[value] || value}</option>)}
        </Select>}
        {resource === 'audit' && [['admin', 'مدیر'], ['module', 'ماژول'], ['action', 'عملیات'], ['date', 'تاریخ'], ['reference', 'مرجع']].map(([key, label]) => <Input key={key} label={label} value={filters[key] || ''} onChange={event => setFilters(current => ({ ...current, [key]: event.target.value }))} />)}
        <Button variant="secondary" onClick={() => { setQuery(''); setStatus(''); setFilters({}); }}>پاک کردن فیلترها</Button>
      </div>
      <p className="admin-result-count" role="status">{formatNumber(filtered.length)} مورد از {formatNumber(rows.length)}</p>
      {resource === 'orders' || resource === 'payments' ? <AdminFinancialList resource={resource} rows={filtered}
        emptyTitle={rows.length ? 'موردی مطابق جستجو پیدا نشد' : 'هنوز رکوردی ثبت نشده است'} /> : <DataTable columns={columns} rows={filtered} rowKey={row => row.id}
        emptyTitle={rows.length ? 'موردی مطابق جستجو پیدا نشد' : 'هنوز رکوردی ثبت نشده است'}
        actions={config.readOnly && !config.detail ? undefined : row => <div className="table-actions">
          {config.detail ? <Link className="ds-button ds-button-secondary" href={`/admin/${resource}/${encodeURIComponent(row.id)}`}>{config.readOnly || resource === 'products' ? 'مشاهده' : 'ویرایش'}</Link>
            : <Button variant="secondary" onClick={() => setEditing(row)}>ویرایش آزمایشی</Button>}
          {!config.readOnly && <Button variant="danger" onClick={() => setDeleting(row)}>حذف آزمایشی</Button>}
        </div>} />}
    </section>
    <Modal open={Boolean(editing)} title="ویرایش پیش‌نویس آزمایشی" onClose={() => setEditing(null)}>
      {editing && <AdminRecordForm key={editing.id} resource={resource} record={editing} onCancel={() => setEditing(null)} onSave={record => { save(resource, record); setEditing(null); notify('پیش‌نویس آزمایشی ذخیره شد'); }} />}
    </Modal>
    <ConfirmDialog open={Boolean(deleting)} title="حذف پیش‌نویس آزمایشی" description="این تغییر فقط در حافظه پنل انجام می‌شود و روی فروشگاه اثری ندارد." onClose={() => setDeleting(null)} onConfirm={() => {
      if (deleting) { remove(resource, deleting.id); setDeleting(null); notify('رکورد از نمای آزمایشی حذف شد', 'warning'); }
    }} />
  </>;
}

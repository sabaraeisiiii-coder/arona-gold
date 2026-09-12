'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { AdminResource } from '../../mock/admin';
import { products } from '../../data/mock/products';
import { useUiStore } from '../../store/UiStore';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminRecordForm } from './AdminRecordForm';
import { useAdminDrafts } from './AdminDrafts';
import { resourceConfig, matchingOrder, type AdminRecord } from './resource-config';
import { AdminRecordValue } from './AdminRecordValue';
import { AdminTabs } from './AdminTabs';
import { DataTable } from './DataTable';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';

export function AdminRecordScreen({ resource, id, title, mode = 'view' }: {
  resource: AdminResource; id?: string; title: string; mode?: 'view' | 'edit' | 'new';
}) {
  const { records, save } = useAdminDrafts();
  const { notify } = useUiStore();
  const record = records[resource].find(item => item.id === id);
  const config = resourceConfig[resource];
  const groups = [...new Set(config.fields.map(field => field.group || 'اطلاعات'))];
  const tabs = resource === 'orders' ? [...groups, 'محصولات'] : groups;
  const [tab, setTab] = useState(tabs[0]);
  const order = matchingOrder(record);
  const back = <Link className="ds-button ds-button-secondary" href={`/admin/${resource}`}>بازگشت به فهرست</Link>;
  if (mode !== 'new' && !record) return <><AdminPageHeader title={title} action={back} /><EmptyState title="رکورد پیدا نشد" description="شناسه را بررسی کنید یا از فهرست، یک رکورد موجود را انتخاب کنید." /></>;
  function onSave(value: AdminRecord) { save(resource, value); notify('پیش‌نویس آزمایشی در حافظه پنل ذخیره شد'); }
  return <>
    <AdminPageHeader title={title} description={record ? `شناسه: ${record.id}` : 'رکورد آزمایشی جدید'} action={back} />
    <p className="admin-notice">داده‌های نمونه؛ پیش‌نویس‌ها با بارگذاری مجدد پاک می‌شوند و روی فروشگاه اثری ندارند.</p>
    {mode !== 'view' && !config.readOnly
      ? <AdminRecordForm key={id || 'new'} resource={resource} record={record || { id: '' }} onSave={onSave} />
      : <>
        {resource === 'products' && record && <Link className="ds-button ds-button-primary" href={`/admin/products/${encodeURIComponent(record.id)}/edit`}>ویرایش پیش‌نویس محصول</Link>}
        <AdminTabs tabs={tabs} active={tab} onChange={setTab}>
          <section className="ds-card admin-detail-card">
            {tab === 'محصولات' ? <DataTable rows={order?.items || []} rowKey={item => String(item.productId)} columns={[
              { key: 'name', header: 'محصول', render: item => products.find(product => product.id === item.productId)?.name || 'ثبت نشده' },
              { key: 'sku', header: 'SKU', render: item => products.find(product => product.id === item.productId)?.sku || 'ثبت نشده' },
              { key: 'weight', header: 'وزن محصول', render: item => products.find(product => product.id === item.productId)?.weight || 'ثبت نشده' },
              { key: 'quantity', header: 'تعداد', render: item => item.quantity.toLocaleString('fa-IR') },
              { key: 'price', header: 'قیمت ثبت‌شده در سفارش', render: () => 'ثبت نشده' },
            ]} emptyTitle="اقلام این سفارش در داده‌های فعلی ثبت نشده است" />
              : <dl className="admin-details">{config.fields.filter(field => (field.group || 'اطلاعات') === tab).map(field => <div key={field.key} data-field={field.key}><dt>{field.label}</dt><dd><AdminRecordValue field={field.key} value={record?.[field.key]} /></dd></div>)}</dl>}
          </section>
        </AdminTabs>
        {resource === 'orders' && <section className="ds-card admin-detail-card"><h2>وضعیت و یادداشت داخلی</h2><p className="admin-muted">تاریخچه تکمیلی و سرویس ثبت یادداشت در پروژه موجود نیست.</p><Button disabled variant="secondary">تغییر وضعیت سفارش — در دسترس نیست</Button></section>}
        {resource === 'payments' && <Button disabled variant="secondary">تأیید یا استرداد پرداخت — سرویس متصل نیست</Button>}
      </>}
  </>;
}

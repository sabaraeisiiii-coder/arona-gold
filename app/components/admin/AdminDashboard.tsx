'use client';
import Link from 'next/link';
import { useAdminDrafts } from './AdminDrafts';
import { AdminPageHeader } from './AdminPageHeader';
import { KpiCard } from './KpiCard';
import { DataTable } from './DataTable';
import { formatNumber } from '../../lib/format';
import { AdminRecordValue } from './AdminRecordValue';

export function AdminDashboard() {
  const { records } = useAdminDrafts();
  const lowStock = records.products.filter(product => Number(product.stock) > 0 && Number(product.stock) <= 3).length;
  const weekly = [45, 68, 52, 84, 61, 92, 73];
  const days = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'];
  return <>
    <AdminPageHeader title="داشبورد مدیریت" description="نمای کلی سفارش‌ها، موجودی و فعالیت‌های فروشگاه." />
    <div className="admin-grid"><KpiCard label="سفارشات امروز" value="—" /><KpiCard label="فروش امروز" value="—" /><KpiCard label="کاربران جدید" value="—" /><KpiCard label="محصولات کم‌موجود" value={formatNumber(lowStock)} /></div>
    <p className="admin-notice">آمار روزانه در داده‌های فعلی موجود نیست. موجودی و نمودار بر پایه داده‌های نمونه نمایش داده می‌شوند.</p>
    <div className="admin-dashboard-columns">
      <section className="ds-card admin-detail-card"><div className="admin-section-heading"><h2>آخرین سفارش‌ها</h2><Link href="/admin/orders">همه سفارش‌ها ←</Link></div>
        <DataTable rows={records.orders.slice(0, 5)} rowKey={row => row.id} columns={[
          { key: 'number', header: 'شماره سفارش', render: row => <Link href={`/admin/orders/${encodeURIComponent(row.id)}`}><AdminRecordValue field="number" value={row.number} /></Link> },
          { key: 'customer', header: 'مشتری', render: row => <AdminRecordValue field="customer" value={row.customer} /> },
          { key: 'amount', header: 'مبلغ', render: row => <AdminRecordValue field="amount" value={row.amount} /> },
          { key: 'status', header: 'وضعیت', render: row => <AdminRecordValue field="status" value={row.status} /> },
        ]} />
      </section>
      <section className="ds-card admin-detail-card"><div className="admin-section-heading"><h2>فعالیت‌های اخیر</h2><Link href="/admin/audit">لاگ تغییرات ←</Link></div>
        <ul className="admin-activity-list">{records.audit.slice(0, 5).map(row => <li key={row.id}><strong>{row.action}</strong><p>{row.admin} · {row.target}</p><small>{row.date}</small></li>)}</ul>
      </section>
    </div>
    <section className="ds-card admin-weekly"><div className="admin-section-heading"><div><h2>روند فروش هفتگی</h2><p className="admin-muted">شاخص نسبی نمونه؛ مبالغ فروش واقعی نیست.</p></div></div>
      <div className="admin-weekly-bars" role="img" aria-label={days.map((day, index) => `${day}: ${formatNumber(weekly[index])}`).join('، ')}>
        {weekly.map((value, index) => <div key={days[index]}><span>{formatNumber(value)}</span><i style={{ height: `${value}%` }} /><small>{days[index]}</small></div>)}
      </div>
    </section>
  </>;
}

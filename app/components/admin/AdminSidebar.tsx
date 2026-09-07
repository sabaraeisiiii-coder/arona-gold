'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const groups = [
  { label: 'اصلی', items: [['/admin', 'داشبورد', '◉']] },
  { label: 'فروشگاه', items: [['/admin/products', 'محصولات', '◇'], ['/admin/categories', 'دسته‌بندی‌ها', '▦'], ['/admin/inventory', 'موجودی', '▤'], ['/admin/discounts', 'تخفیف‌ها', '٪'], ['/admin/banners', 'بنرها', '▧'], ['/admin/announcements', 'اطلاعیه‌ها', '◌']] },
  { label: 'سفارشات', items: [['/admin/orders', 'سفارش‌ها', '▣'], ['/admin/payments', 'پرداخت‌ها', '▱']] },
  { label: 'کاربران', items: [['/admin/users', 'کاربران', '♙'], ['/admin/roles', 'نقش‌ها و دسترسی‌ها', '⚿']] },
  { label: 'محتوا', items: [['/admin/content', 'مدیریت محتوا', '≡']] },
  { label: 'سیستم', items: [['/admin/audit', 'لاگ تغییرات', '≣'], ['/admin/settings', 'تنظیمات', '⚙']] },
];
export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <aside className="admin-side admin-sidebar">
    <div className="admin-sidebar-brand"><Link className="brand" href="/admin" onClick={onNavigate}>آرونا <span>گلد</span></Link><p>پنل مدیریت</p></div>
    <nav aria-label="منوی مدیریت">
      {groups.map(group => <div className="admin-nav-group" key={group.label}><h2>{group.label}</h2>
        {group.items.map(([href, label, icon]) => {
          const active = href === '/admin' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
          return <Link key={href} href={href} aria-current={active ? 'page' : undefined} onClick={onNavigate}><span aria-hidden="true">{icon}</span>{label}</Link>;
        })}
      </div>)}
      {process.env.NODE_ENV === 'development' && <div className="admin-nav-group"><h2>توسعه و QA</h2><Link href="/admin/ux-states" onClick={onNavigate}>حالت‌های رابط کاربری</Link></div>}
    </nav>
    <Link className="back-store" href="/" onClick={onNavigate}>← بازگشت به فروشگاه</Link>
  </aside>;
}

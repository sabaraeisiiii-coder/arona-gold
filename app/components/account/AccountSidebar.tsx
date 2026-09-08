'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAppStore } from '../../store/AppStore';
import { Button } from '../ui/Button';
const accountLinks = [['/account', 'داشبورد'], ['/profile', 'پروفایل'], ['/orders', 'سفارش‌ها'], ['/addresses', 'آدرس‌ها'], ['/wishlist', 'علاقه‌مندی‌ها'], ['/notifications', 'اعلان‌ها']] as const;
export function AccountSidebar() {
  const { logout } = useAppStore();
  const router = useRouter(), pathname = usePathname();
  const [pending, setPending] = useState(false), [error, setError] = useState('');
  return <aside className="ds-card account-nav"><nav aria-label="حساب کاربری">{accountLinks.map(([href, label]) => <Link href={href} key={href} aria-current={pathname === href || pathname.startsWith(href + '/') ? 'page' : undefined}>{label}</Link>)}</nav><Button variant="danger" loading={pending} onClick={async () => { setPending(true); setError(''); try { await logout(); router.push('/'); } catch { setError('خروج ناموفق بود. دوباره تلاش کنید.'); } finally { setPending(false); } }}>خروج</Button>{error && <p role="alert">{error}</p>}</aside>;
}

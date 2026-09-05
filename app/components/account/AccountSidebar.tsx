'use client';
import Link from 'next/link';import { useRouter } from 'next/navigation';import { useAppStore } from '../../store/AppStore';import { Button } from '../ui/Button';
const accountLinks=[['/account','داشبورد'],['/profile','پروفایل'],['/orders','سفارش‌ها'],['/addresses','آدرس‌ها'],['/wishlist','علاقه‌مندی‌ها'],['/notifications','اعلان‌ها']] as const;
export function AccountSidebar(){const{logout}=useAppStore();const router=useRouter();return <aside className="ds-card account-nav" aria-label="حساب کاربری">{accountLinks.map(([href,label])=><Link href={href} key={href}>{label}</Link>)}<Button variant="danger" onClick={async()=>{await logout();router.push('/')}}>خروج</Button></aside>}

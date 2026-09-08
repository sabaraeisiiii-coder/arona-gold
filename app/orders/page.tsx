'use client';
import Link from 'next/link';
import { StoreShell } from '../components/StoreShell';
import { PageHeader } from '../components/layout/PageHeader';
import { OrderCard } from '../components/account/OrderCard';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppStore } from '../store/AppStore';
export default function OrdersPage() {
  const { orders } = useAppStore();
  return <StoreShell><section className="page"><PageHeader eyebrow="حساب من" title="سفارش‌ها" description="تاریخچه خرید و وضعیت ارسال سفارش‌های شما." /><div className="stack">{orders.length ? orders.map(order => <OrderCard key={order.id} order={order} />) : <EmptyState title="هنوز سفارشی ثبت نشده است" action={<Link href="/products">مشاهده محصولات</Link>} />}</div></section></StoreShell>;
}

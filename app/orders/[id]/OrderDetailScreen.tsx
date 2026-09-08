'use client';
import Link from 'next/link';
import { useAppStore } from '../../store/AppStore';
import { getCartLines } from '../../services/cart.service';
import { PageHeader } from '../../components/layout/PageHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { StatusBadge } from '../../components/admin/StatusBadge';
import { formatMoney } from '../../lib/format';
export default function OrderDetailScreen({ id }: { id: string }) {
  const { orders } = useAppStore();
  const order = orders.find(item => item.id === id);
  return <section className="page"><PageHeader title="جزئیات سفارش" description="اقلام، پرداخت و آدرس تحویل سفارش." action={<Link href="/orders">بازگشت به سفارش‌ها</Link>} />
    {order ? <article className="ds-card order-detail stack"><div><h2>{order.id}</h2><StatusBadge status={order.status} /><p>{order.date}</p></div><p>{order.address}</p><p>کد پیگیری: {order.reference}</p>{getCartLines(order.items).map(({ product, quantity }) => <div className="review-line" key={product.id}><Link href={`/products/${product.slug}`}>{product.name}</Link><span>تعداد: {quantity.toLocaleString('fa-IR')}</span></div>)}<p>مبلغ ثبت‌شده: {formatMoney(order.amount)}</p></article> : <EmptyState title="سفارش پیدا نشد" description="این سفارش در فهرست سفارش‌های شما نیست." action={<Link href="/orders">مشاهده سفارش‌ها</Link>} />}
  </section>;
}

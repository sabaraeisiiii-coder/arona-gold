'use client';
import Link from 'next/link';
import { useState } from 'react';
import { StoreShell } from '../components/StoreShell';
import { PageHeader } from '../components/layout/PageHeader';
import { CartItem } from '../components/commerce/CartItem';
import { OrderSummary } from '../components/commerce/OrderSummary';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { getCartPreview } from '../services/cart.service';
import { useAppStore } from '../store/AppStore';

export default function CartPage() {
  const { cart, coupon, applyCoupon } = useAppStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { lines, subtotal } = getCartPreview(cart, coupon);
  return <StoreShell><section className="page">
    <PageHeader eyebrow="خرید شما" title="سبد خرید" description={`${lines.length.toLocaleString('fa-IR')} محصول در سبد شماست.`} />
    {lines.length ? <div className="split"><div className="stack">
      {lines.map(({ product, quantity }) => <CartItem key={product.id} product={product} quantity={quantity} />)}
      <form className="coupon-form" onSubmit={event => { event.preventDefault(); setError(applyCoupon(code) ? '' : 'کد تخفیف نامعتبر است'); }}>
        <Input label="کد تخفیف" value={code} error={error} onChange={event => { setCode(event.target.value); setError(''); }} placeholder="نمونه ARONA10" />
        <Button type="submit" variant="outline" disabled={!code.trim()}>اعمال کد</Button>
      </form>
      {coupon && <p role="status">کد {coupon} اعمال شده است.</p>}
    </div><OrderSummary subtotal={subtotal} /></div> : <EmptyState title="سبد خرید خالی است" description="محصول دلخواه خود را از فروشگاه انتخاب کنید." action={<Link className="ds-button ds-button-primary" href="/products">مشاهده محصولات</Link>} />}
  </section></StoreShell>;
}

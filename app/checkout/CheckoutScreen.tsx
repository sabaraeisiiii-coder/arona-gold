'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StoreShell } from '../components/StoreShell';
import { CheckoutProgress } from '../components/checkout/CheckoutProgress';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import { getCartPreview } from '../services/cart.service';
import { shippingMethods } from '../data/mock/shipping';
import { useAppStore } from '../store/AppStore';
import { addressService, toCommerceAddress } from '../services/address.service';
import Loading from '../loading';

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [selectedAddress, setAddress] = useState<number | string | null>(null);
  const [selectedShip, setShip] = useState(shippingMethods[1]?.id ?? shippingMethods[0]?.id);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const lock = useRef(false);
  const { cart, addresses, coupon, placeOrder, user, authReady, replaceAddresses } = useAppStore();
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!user) return;
    let active = true;
    addressService.list().then(items => { if (active) { replaceAddresses(items.map(toCommerceAddress)); setAddressError(''); } })
      .catch(() => { if (active) setAddressError('دریافت آدرس‌های تحویل ناموفق بود.'); })
      .finally(() => { if (active) setAddressLoading(false); });
    return () => { active = false; };
  }, [user, replaceAddresses, retry]);
  const router = useRouter();
  const address = selectedAddress === null ? addresses.find(item => item.isDefault) ?? addresses[0] : addresses.find(item => item.id === selectedAddress);
  const shipping = shippingMethods.find(item => item.id === selectedShip);
  const { lines, total } = getCartPreview(cart, coupon, shipping);
  const invalidCart = lines.length !== cart.length || lines.some(line => line.quantity > line.product.stock);
  function pay() {
    if (lock.current || !terms || !address || !shipping || !lines.length || invalidCart) return;
    lock.current = true;
    setSubmitting(true);
    setError('');
    try {
      placeOrder(total, address.id);
      router.push('/payment/success');
    } catch {
      lock.current = false;
      setSubmitting(false);
      setError('ثبت سفارش ناموفق بود. دوباره تلاش کنید.');
    }
  }
  if (!authReady || (user && addressLoading)) return <Loading />;
  if (user && addressError) return <section className="page"><ErrorState description={addressError} retry={() => { setAddressLoading(true); setRetry(value => value + 1); }} /></section>;
  return <StoreShell><section className="page">
    <PageHeader eyebrow={`مرحله ${step + 1} از ۳`} title="تکمیل خرید" description="آدرس، روش ارسال و سفارش را بازبینی کنید." />
    {!lines.length ? <EmptyState title="سبد خرید خالی است" action={<Link className="ds-button ds-button-primary" href="/products">مشاهده محصولات</Link>} /> : invalidCart ? <ErrorState description="موجودی برخی اقلام تغییر کرده است. سبد خرید را بازبینی کنید." /> : <>
      <CheckoutProgress step={step} steps={['آدرس تحویل', 'روش ارسال', 'بررسی سفارش']} />
      <div className="ds-card checkout-panel">
        {error && <p role="alert" className="form-error">{error}</p>}
        {step === 0 && <><h2>آدرس تحویل</h2>
          {addresses.length ? addresses.map(item => <button type="button" aria-pressed={address?.id === item.id} className={`choice-card ${address?.id === item.id ? 'selected' : ''}`} onClick={() => setAddress(item.id)} key={item.id}><strong>{item.name}</strong>{item.isDefault && <Badge tone="info">پیش‌فرض</Badge>}<span>{item.province}، {item.city}، {item.line}</span><small>{item.mobile}</small></button>) : <EmptyState title="آدرس تحویل موجود نیست" description="برای ادامه، آدرس تحویل باید در دسترس باشد." action={<Link href="/addresses">مدیریت آدرس‌ها</Link>} />}
          <Button disabled={!address} onClick={() => setStep(1)}>ادامه</Button>
        </>}
        {step === 1 && <><h2>روش ارسال</h2>{shippingMethods.map(item => <button type="button" aria-pressed={selectedShip === item.id} className={`choice-card ${selectedShip === item.id ? 'selected' : ''}`} onClick={() => setShip(item.id)} key={item.id}><strong>{item.name}</strong><span>{item.desc}</span><small>{item.cost ? item.cost.toLocaleString('fa-IR') + ' تومان' : 'رایگان'}</small></button>)}<div className="inline-actions"><Button variant="secondary" onClick={() => setStep(0)}>بازگشت</Button><Button disabled={!shipping || !address} onClick={() => setStep(2)}>ادامه</Button></div></>}
        {step === 2 && <><h2>بررسی سفارش</h2><p>{address?.line}</p><p>{shipping?.name}</p>{lines.map(({ product, quantity }) => <div className="review-line" key={product.id}><span>{product.name} × {quantity.toLocaleString('fa-IR')}</span><strong>{(product.price * quantity).toLocaleString('fa-IR')} تومان</strong></div>)}<div className="review-line total"><span>مبلغ قابل پرداخت</span><strong>{total.toLocaleString('fa-IR')} تومان</strong></div><label className="terms-check"><input type="checkbox" checked={terms} onChange={event => setTerms(event.target.checked)} /> قوانین و مقررات خرید را می‌پذیرم.</label><Link href="/terms">مطالعه قوانین خرید</Link><div className="inline-actions"><Button variant="secondary" disabled={submitting} onClick={() => setStep(1)}>بازگشت</Button><Button loading={submitting} disabled={!terms || !address || !shipping} onClick={pay}>پرداخت امن</Button></div></>}
      </div>
    </>}
    {invalidCart && <Link className="ds-button ds-button-outline" href="/cart">بازبینی سبد خرید</Link>}
  </section></StoreShell>;
}

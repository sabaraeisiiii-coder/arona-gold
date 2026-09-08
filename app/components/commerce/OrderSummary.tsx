import Link from 'next/link';
import { Price } from './Price';
export function OrderSummary({ subtotal, href='/checkout' }: { subtotal: number; href?: string }) { return <aside className="ds-card order-summary"><h3>خلاصه سفارش</h3><p><span>جمع محصولات</span><Price value={subtotal}/></p><p><span>ارسال</span><strong>در مرحله بعد</strong></p><hr/><p><span>مبلغ قابل پرداخت</span><Price value={subtotal}/></p><Link className="ds-button ds-button-primary" href={href}>ادامه فرایند خرید</Link></aside>; }

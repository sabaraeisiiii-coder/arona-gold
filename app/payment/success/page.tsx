import Link from 'next/link';
import { StoreShell } from '../../components/StoreShell';
export default function Page(){return <StoreShell><section className="page"><header className="page-head"><span className="eyebrow">آرونا گلد</span><h1>پرداخت موفق</h1><p>سفارش با موفقیت ثبت و پرداخت شد.</p></header><div className="ds-card status-page"><b className="success">✓</b><h2>پرداخت موفق</h2><p>سفارش با موفقیت ثبت و پرداخت شد.</p><Link className="ds-button ds-button-primary" href="/orders">مشاهده سفارش‌ها</Link></div></section></StoreShell>}

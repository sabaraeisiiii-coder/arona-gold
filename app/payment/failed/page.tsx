import Link from 'next/link';
import { StoreShell } from '../../components/StoreShell';
export default function Page(){return <StoreShell><section className="page"><header className="page-head"><span className="eyebrow">آرونا گلد</span><h1>پرداخت ناموفق</h1><p>پرداخت تکمیل نشد؛ امکان تلاش مجدد وجود دارد.</p></header><div className="ds-card status-page"><b className="danger">×</b><h2>پرداخت ناموفق</h2><p>پرداخت تکمیل نشد؛ امکان تلاش مجدد وجود دارد.</p><Link className="ds-button ds-button-primary" href="/checkout">تلاش مجدد</Link></div></section></StoreShell>}

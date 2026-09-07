import Link from "next/link";
import { customerNavigation, quickNavigation } from "../../data/navigation";
export function Footer() {
  return (
    <footer className="store-footer">
      <div>
        <Link className="brand" href="/">
          آرونا <span>گلد</span>
          <i></i>
        </Link>
        <p>انتخابی مطمئن برای خرید آنلاین طلای اصیل.</p>
        <Link href="/about">درباره آرونا گلد</Link>
      </div>
      <div>
        <h2>دسترسی سریع</h2>
        {quickNavigation.map(item => <Link key={item.label} href={item.href}>{item.label}</Link>)}
      </div>
      <div>
        <h2>راهنمای مشتریان</h2>
        {customerNavigation.map(item => <Link key={item.label} href={item.href}>{item.label}</Link>)}
      </div>
      <div>
        <h2>ارتباط با ما</h2>
        <Link href="/contact">تماس با ما</Link>
        <p>برای آشنایی با روند خرید و پاسخ پرسش‌های خود، راهنمای مشتریان را ببینید.</p>
        <Link href="/faq">پرسش‌های خرید و پشتیبانی</Link>
      </div>
      <small className="store-footer__copyright">تمامی حقوق این وب‌سایت متعلق به آرونا گلد است.</small>
    </footer>
  );
}

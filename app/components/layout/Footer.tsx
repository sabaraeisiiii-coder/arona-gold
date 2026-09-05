import Link from "next/link";
export function Footer() {
  return (
    <footer>
      <div>
        <Link className="brand" href="/">
          آرونا <span>گلد</span>
          <i></i>
        </Link>
        <p>انتخابی مطمئن برای خرید آنلاین طلای اصیل.</p>
      </div>
      <div>
        <b>دسترسی سریع</b>
        <Link href="/products">فروشگاه</Link>
        <Link href="/orders">سفارش‌ها</Link>
      </div>
      <div>
        <b>پشتیبانی</b>
        <Link href="/contact">تماس با ما</Link>
        <Link href="/terms">قوانین</Link>
      </div>
      <small>تمامی حقوق برای آرونا گلد محفوظ است.</small>
    </footer>
  );
}

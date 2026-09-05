"use client";
import Link from "next/link";
import { useAppStore } from "@/app/store/AppStore";
import { formatNumber } from "@/app/lib/format";
export function Header() {
  const { cart, user } = useAppStore();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="store-header">
      <Link className="brand" href="/">
        آرونا <span>گلد</span>
        <i></i>
      </Link>
      <nav aria-label="ناوبری اصلی">
        <Link href="/">خانه</Link>
        <Link href="/products">فروشگاه</Link>
        <Link href="/wishlist">علاقه‌مندی‌ها</Link>
        <Link href="/faq">راهنما</Link>
      </nav>
      <div className="header-actions">
        <Link aria-label="جستجو" href="/search">
          ⌕
        </Link>
        <Link aria-label="حساب کاربری" href={user ? "/account" : "/login"}>
          ♙
        </Link>
        <Link aria-label={`سبد خرید، ${formatNumber(count)} قلم`} href="/cart">
          ▢{count > 0 && <span>{formatNumber(count)}</span>}
        </Link>
      </div>
    </header>
  );
}

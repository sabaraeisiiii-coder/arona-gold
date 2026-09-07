"use client";
import Link from "next/link";
import { useAppStore } from "@/app/store/AppStore";
import { formatNumber } from "@/app/lib/format";
import { HeaderSearch } from "./HeaderSearch";
import { MobileHeader } from "./MobileHeader";
import { mainNavigation } from "../../data/navigation";
import "../../styles/store-chrome.css";
export function Header() {
  const { cart, user, wishlist } = useAppStore();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <header className="store-header">
      <div className="store-header__top">
      <MobileHeader />
      <Link className="brand" href="/">
        آرونا <span>گلد</span>
        <i></i>
      </Link>
      <HeaderSearch />
      <div className="header-actions">
        <Link aria-label="حساب کاربری" href={user ? "/account" : "/login"}>
          ♙
        </Link>
        <Link aria-label={`علاقه‌مندی‌ها، ${formatNumber(wishlist.length)} محصول`} href="/wishlist">
          ♡{wishlist.length > 0 && <span aria-live="polite" aria-atomic="true">{formatNumber(wishlist.length)}</span>}
        </Link>
        <Link aria-label={`سبد خرید، ${formatNumber(count)} قلم`} href="/cart">
          ▢{count > 0 && <span aria-live="polite" aria-atomic="true">{formatNumber(count)}</span>}
        </Link>
      </div>
      </div>
      <nav className="store-header__navigation" aria-label="ناوبری اصلی">
        {mainNavigation.map(item => <Link key={item.label} href={item.href}>{item.label}</Link>)}
      </nav>
    </header>
  );
}

"use client";
import Link from "next/link";
import { StoreShell } from "../components/StoreShell";
import { ProductGrid } from "../components/ProductGrid";
import { useAppStore } from "../store/AppStore";
import type { Product } from "../types/product";
export default function WishlistScreen({ products }: { products: Product[] }) {
  const { wishlist } = useAppStore();
  const items = products.filter((product) => wishlist.includes(product.id));
  return (
    <StoreShell>
      <section className="page">
        <header className="page-head">
          <span className="eyebrow">حساب من</span>
          <h1>علاقه‌مندی‌ها</h1>
          <p>محصولات ذخیره‌شده برای مشاهده و خرید در آینده.</p>
        </header>
        {items.length ? (
          <ProductGrid products={items} />
        ) : (
          <div className="ds-card empty">
            <b>♡</b>
            <h2>فهرست علاقه‌مندی خالی است</h2>
            <p>روی قلب محصولات بزنید تا اینجا ذخیره شوند.</p>
            <Link className="ds-button ds-button-primary" href="/products">
              مشاهده محصولات
            </Link>
          </div>
        )}
      </section>
    </StoreShell>
  );
}

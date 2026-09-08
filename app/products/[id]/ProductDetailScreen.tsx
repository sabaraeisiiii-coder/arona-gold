"use client";
import { useEffect, useRef, useState } from "react";
// Route screen implementation; page.tsx remains composition-only.
import { StoreShell } from "../../components/StoreShell";
import { ProductGrid } from "../../components/ProductGrid";
import { ProductGallery } from "../../components/commerce/ProductGallery";
import { ProductPrice } from "../../components/commerce/ProductPrice";
import { StockStatus } from "../../components/commerce/StockStatus";
import { Button } from "../../components/ui/Button";
import type { Product } from "../../types/product";
import { useAppStore } from "../../store/AppStore";
export default function ProductDetailScreen({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const { addToCart, toggleWishlist, wishlist, cart } = useAppStore();
  const quantity = cart.find(item => item.productId === product.id)?.quantity ?? 0;
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const added = addedProductId === product.id;
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimer.current !== null) clearTimeout(feedbackTimer.current);
    };
  }, []);

  function handleAddToCart() {
    if (quantity >= product.stock) return;
    addToCart(product.id);
    setAddedProductId(product.id);
    if (feedbackTimer.current !== null) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setAddedProductId(null), 2000);
  }
  return (
    <StoreShell>
      <section className="page">
        <div className="product-detail">
          <ProductGallery product={product} />
          <div>
            <StockStatus stock={product.stock} />
            <h1>{product.name}</h1>
            <p className="product-sku">کد محصول: {product.sku}</p>
            <div className="product-specs">
              <span>
                وزن <b>{product.weight}</b>
              </span>
              <span>
                عیار <b>{product.karat.toLocaleString("fa-IR")} عیار</b>
              </span>
              <span>
                اجرت <b>{product.wage.toLocaleString("fa-IR")}٪</b>
              </span>
            </div>
            <ProductPrice
              price={product.price}
              oldPrice={product.oldPrice}
              discountPercent={product.discountPercent}
              className="detail-price"
            />
            <p className="muted-copy">{product.description}</p>
            <div className="inline-actions">
              <Button
                disabled={quantity >= product.stock}
                onClick={handleAddToCart}
                aria-live="polite"
              >
                {added ? "✓ به سبد اضافه شد" : "افزودن به سبد خرید"}
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleWishlist(product.id)}
              >
                {wishlist.includes(product.id)
                  ? "حذف از علاقه‌مندی"
                  : "افزودن به علاقه‌مندی"}
              </Button>
            </div>
          </div>
        </div>
        {relatedProducts.length > 0 && (
          <section className="section">
            <h2>محصولات مرتبط</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </section>
    </StoreShell>
  );
}

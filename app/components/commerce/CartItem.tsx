'use client';
import Link from 'next/link';
import type { Product } from '../../types/product';
import { Price } from './Price';
import { ProductMedia } from './ProductMedia';
import { Button } from '../ui/Button';
import { useCommerceStore } from '../../store/CommerceStore';

export function CartItem({ product, quantity = 1 }: { product: Product; quantity?: number }) {
  const { changeQuantity, removeFromCart } = useCommerceStore();
  return <article className="ds-card cart-item" aria-label={product.name}>
    <Link href={`/products/${product.slug}`} className="mini-art"><ProductMedia product={product} sizes="70px" /></Link>
    <div><h3><Link href={`/products/${product.slug}`}>{product.name}</Link></h3><span className="text-caption">{product.weight}</span></div>
    <Price value={product.price * quantity} />
    <div className="cart-quantity"><Button variant="secondary" aria-label={`کاهش تعداد ${product.name}`} disabled={quantity <= 1} onClick={() => changeQuantity(product.id, -1)}>−</Button><span aria-live="polite">{quantity.toLocaleString('fa-IR')}</span><Button variant="secondary" aria-label={`افزایش تعداد ${product.name}`} disabled={quantity >= product.stock} onClick={() => changeQuantity(product.id, 1)}>＋</Button></div>
    <Button variant="danger" aria-label={`حذف ${product.name} از سبد`} onClick={() => removeFromCart(product.id)}>حذف</Button>
  </article>;
}

import { catalogSnapshot } from './product.service';
import type { CartItem } from '../types/cart';
import type { Product } from '../types/product';
import type { ShippingMethod } from '../data/mock/shipping';

export function getCartLines(cart: CartItem[]): { product: Product; quantity: number }[] {
  return cart.flatMap(line => {
    const product = catalogSnapshot.find(item => item.id === line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
}
/** Existing local preview calculation only; replace with the server quote at API integration. */
export function getCartPreview(cart: CartItem[], coupon: string | null, shipping?: ShippingMethod) {
  const lines = getCartLines(cart);
  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const discountedSubtotal = coupon ? subtotal * 0.9 : subtotal;
  return { lines, subtotal: discountedSubtotal, total: discountedSubtotal + (shipping?.cost ?? 0) };
}

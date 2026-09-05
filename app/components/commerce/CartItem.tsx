import type { Product } from '../../types/product';
import { Price } from './Price';
import { Button } from '../ui/Button';
export function CartItem({ product, quantity=1 }: { product: Product; quantity?: number }) { return <article className="ds-card cart-item"><div className="mini-art" style={{background:product.accent}}/><div><h3>{product.name}</h3><span className="text-caption">{product.weight}</span></div><Price value={product.price*quantity}/><div className="cart-quantity"><Button variant="secondary" aria-label="کاهش تعداد">−</Button><span>{quantity.toLocaleString('fa-IR')}</span><Button variant="secondary" aria-label="افزایش تعداد">＋</Button></div></article>; }

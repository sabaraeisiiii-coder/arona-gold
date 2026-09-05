'use client';
// Route screen implementation; page.tsx remains composition-only.
import Link from 'next/link';
import { useState } from 'react';
import { StoreShell } from '../components/StoreShell';
import { CartItem } from '../components/commerce/CartItem';
import { OrderSummary } from '../components/commerce/OrderSummary';
import { Button } from '../components/ui/Button';
import { catalogSnapshot as products } from '../services/product.service';
import { useAppStore } from '../store/AppStore';
export default function CartPage(){const{cart,coupon,changeQuantity,removeFromCart,applyCoupon}=useAppStore();const[code,setCode]=useState('');const lines=cart.map(i=>({line:i,product:products.find(p=>p.id===i.productId)})).filter(x=>x.product);const subtotal=lines.reduce((n,x)=>n+x.product!.price*x.line.quantity,0);const total=coupon?subtotal*.9:subtotal;return <StoreShell><section className="page"><header className="page-head"><span className="eyebrow">خرید شما</span><h1>سبد خرید</h1><p>{lines.length.toLocaleString('fa-IR')} محصول در سبد شماست.</p></header>{lines.length?<div className="split"><div className="stack">{lines.map(({line,product})=><div key={line.productId}><CartItem product={product!} quantity={line.quantity}/><div className="inline-actions"><Button variant="secondary" onClick={()=>changeQuantity(line.productId,-1)}>کاهش</Button><Button variant="secondary" onClick={()=>changeQuantity(line.productId,1)}>افزایش</Button><Button variant="danger" onClick={()=>removeFromCart(line.productId)}>حذف</Button></div></div>)}<form className="coupon-form" onSubmit={e=>{e.preventDefault();applyCoupon(code)}}><input className="ds-input" value={code} onChange={e=>setCode(e.target.value)} placeholder="کد تخفیف؛ نمونه ARONA10"/><Button type="submit" variant="outline">اعمال کد</Button></form></div><OrderSummary subtotal={total}/></div>:<div className="ds-card empty"><b>◇</b><h2>سبد خرید خالی است</h2><p>محصول دلخواه خود را از فروشگاه انتخاب کنید.</p><Link className="ds-button ds-button-primary" href="/products">مشاهده محصولات</Link></div>}</section></StoreShell>}

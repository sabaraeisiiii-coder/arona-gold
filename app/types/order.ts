import type { CartItem } from './cart';
export type OrderStatus='paid'|'processing'|'shipped'|'delivered'|'cancelled';
export type Order={id:string;date:string;amount:number;status:OrderStatus;items:CartItem[];address:string;reference:string};

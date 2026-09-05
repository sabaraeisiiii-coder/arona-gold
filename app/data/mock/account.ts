import type { Address } from '../../types/address';
import type { CartItem } from '../../types/cart';
import type { Order } from '../../types/order';
export const initialCart:CartItem[]=[{productId:1,quantity:1},{productId:2,quantity:1}];
export const initialWishlist:number[]=[3];
export const initialAddresses:Address[]=[{id:1,name:'علی محمدی',mobile:'09123456789',province:'تهران',city:'تهران',line:'خیابان ولیعصر، کوچه یاس، پلاک ۱۲',postal:'۱۵۹۹۸۱۲۳۴۵',isDefault:true}];
export const initialOrders:Order[]=[{id:'ZB-1403-1003',date:'۱۴۰۳/۱۰/۱۸',amount:12800000,status:'shipped',items:[{productId:1,quantity:1}],address:initialAddresses[0].line,reference:'REF-784231090'}];

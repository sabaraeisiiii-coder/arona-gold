import { products as fixtures } from '../data/mock/products';import type { Product } from '../types/product';
export type ProductSort='featured'|'newest'|'price_asc'|'price_desc';export type ProductAvailability='all'|'in_stock'|'out_of_stock';
export type ProductQuery={page?:number;pageSize?:number;category?:string;sort?:ProductSort;availability?:ProductAvailability};
const visible=(product:Product)=>product.status==='active'||product.status==='out_of_stock';
/** Transitional synchronous snapshot for existing client-only cart and checkout screens. */
export const catalogSnapshot=fixtures.filter(visible);
export async function getProducts(query:ProductQuery={}){const{page=1,pageSize=Number.POSITIVE_INFINITY,category,sort='featured',availability='all'}=query;let result=fixtures.filter(visible);if(category)result=result.filter(product=>product.categorySlug===category);if(availability==='in_stock')result=result.filter(product=>product.stock>0);if(availability==='out_of_stock')result=result.filter(product=>product.stock===0);result=[...result].sort((a,b)=>sort==='price_asc'?a.price-b.price:sort==='price_desc'?b.price-a.price:sort==='newest'?b.id-a.id:Number(Boolean(b.featured))-Number(Boolean(a.featured)));if(!Number.isFinite(pageSize))return result;const start=Math.max(0,page-1)*pageSize;return result.slice(start,start+pageSize)}
export async function getProductBySlug(slug:string){return fixtures.find(product=>visible(product)&&product.slug===slug)}
export async function getProductById(id:number){return fixtures.find(product=>visible(product)&&product.id===id)}
export async function getFeaturedProducts(limit=4){return(await getProducts({sort:'featured'})).filter(product=>product.featured).slice(0,limit)}
export async function searchProducts(query:string){const value=query.trim().toLowerCase();if(!value)return[];return(await getProducts()).filter(product=>[product.name,product.category,product.sku,product.slug].some(field=>field.toLowerCase().includes(value)))}
export async function getProductsByCategory(category:string){return getProducts({category})}
export const productService={getProducts,getProductBySlug,getProductById,getFeaturedProducts,searchProducts,getProductsByCategory};

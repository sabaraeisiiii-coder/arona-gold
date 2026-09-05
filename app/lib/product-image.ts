import type { Product, ProductImage } from '../types/product';
export function getPrimaryProductImage(product: Product): ProductImage|undefined{return product.images.find(image=>image.isPrimary)??product.images[0]}

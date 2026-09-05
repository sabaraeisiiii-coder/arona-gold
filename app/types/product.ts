export type ProductImage = {
  src: string;
  alt: string;
  isPrimary?: boolean;
};

export type ProductStatus = 'active' | 'inactive' | 'out_of_stock' | 'draft';

export type Product = {
  id: number;
  slug: string;
  sku: string;
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  weight: string;
  karat: number;
  wage: number;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  stock: number;
  status: ProductStatus;
  images: ProductImage[];
  /** Transitional colour used only by the branded image fallback. */
  accent?: string;
  featured?: boolean;
};

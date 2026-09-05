import { notFound } from "next/navigation";
import {
  getProductById,
  getProductBySlug,
  getProductsByCategory,
} from "../../services/product.service";
import ProductDetailScreen from "./ProductDetailScreen";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { name } = this.req.query;
  const product =
    (await getProductBySlug(id)) ??
    (/^\d+$/.test(id) ? await getProductById(Number(id)) : undefined);
  if (!product) notFound();
  const related = (await getProductsByCategory(product.categorySlug))
    .filter((item) => item.id !== product.id)
    .slice(0, 4);
  return <ProductDetailScreen product={product} relatedProducts={related} />;
}

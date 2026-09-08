import Link from 'next/link';
import { StoreShell } from '../components/StoreShell';
import { ProductGrid } from '../components/ProductGrid';
import { PageHeader } from '../components/layout/PageHeader';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import { EmptyState } from '../components/ui/EmptyState';
import { getProducts, type ProductAvailability, type ProductSort } from '../services/product.service';
import { getCategories } from '../services/category.service';

export default async function Page({ searchParams }: { searchParams: Promise<{ page?: string; category?: string; sort?: string; availability?: string }> }) {
  const params = await searchParams;
  const sorts: ProductSort[] = ['featured', 'newest', 'price_asc', 'price_desc'];
  const availabilityOptions: ProductAvailability[] = ['all', 'in_stock', 'out_of_stock'];
  const sort = sorts.find(value => value === params.sort) ?? 'featured';
  const availability = availabilityOptions.find(value => value === params.availability) ?? 'all';
  const [products, categories] = await Promise.all([getProducts({ category: params.category, sort, availability }), getCategories()]);
  const totalPages = Math.max(1, Math.ceil(products.length / 24));
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) ? Math.max(1, Math.min(totalPages, requestedPage)) : 1;
  function pageHref(next: number) {
    const query = new URLSearchParams({ page: String(next), sort, availability });
    if (params.category) query.set('category', params.category);
    return '/products?' + query.toString();
  }
  return <StoreShell><section className="page">
    <PageHeader eyebrow="آرونا گلد" title="محصولات" description="فهرست کامل محصولات با فیلتر و مرتب‌سازی." />
    <form action="/products" className="catalog-filters">
      <Select label="دسته‌بندی" name="category" defaultValue={params.category ?? ''}><option value="">همه دسته‌ها</option>{categories.map(category => <option key={category.slug} value={category.slug}>{category.name}</option>)}</Select>
      <Select label="مرتب‌سازی" name="sort" defaultValue={sort}><option value="featured">پیشنهاد فروشگاه</option><option value="newest">جدیدترین</option><option value="price_asc">ارزان‌ترین</option><option value="price_desc">گران‌ترین</option></Select>
      <Select label="موجودی" name="availability" defaultValue={availability}><option value="all">همه محصولات</option><option value="in_stock">موجود</option><option value="out_of_stock">ناموجود</option></Select>
      <Button type="submit">اعمال فیلترها</Button><Link className="ds-button ds-button-ghost" href="/products">پاک کردن فیلترها</Link>
    </form>
    <p className="result-count" role="status">{products.length.toLocaleString('fa-IR')} محصول</p>
    <ProductGrid products={products.slice((page - 1) * 24, page * 24)} emptyState={<EmptyState title="محصولی پیدا نشد" description="فیلترهای دیگری را امتحان کنید." action={<Link href="/products">مشاهده همه محصولات</Link>} />} />
    {totalPages > 1 && <Pagination page={page} totalPages={totalPages} hrefForPage={pageHref} />}
  </section></StoreShell>;
}

import { StoreShell } from '../components/StoreShell';
import { ProductGrid } from '../components/ProductGrid';
import { PageHeader } from '../components/layout/PageHeader';
import { SearchField } from '../components/ui/SearchField';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { searchProducts } from '../services/product.service';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const result = query ? await searchProducts(query) : [];
  return <StoreShell><section className="page">
    <PageHeader eyebrow="پیدا کردن محصول" title="جستجو" description="نام، دسته‌بندی یا کد محصول را وارد کنید." />
    <form action="/search" role="search" className="catalog-search">
      <SearchField name="q" defaultValue={q} placeholder="جستجوی محصول یا کد محصول" />
      <Button type="submit">جستجو</Button>
    </form>
    {query ? <><p className="result-count" role="status">{result.length.toLocaleString('fa-IR')} نتیجه برای «{query}»</p>
      <ProductGrid products={result} emptyState={<EmptyState title="نتیجه‌ای پیدا نشد" description="عبارت دیگری را امتحان کنید." />} />
    </> : <EmptyState title="محصول دلخواه را پیدا کنید" description="برای شروع، نام محصول، دسته‌بندی یا کد آن را جستجو کنید." />}
  </section></StoreShell>;
}

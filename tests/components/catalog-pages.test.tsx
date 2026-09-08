// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ProductsPage from '../../app/products/page';
import SearchPage from '../../app/search/page';
vi.mock('../../app/store/AppStore', () => ({ useAppStore: () => ({ wishlist: [], addToCart: vi.fn(), toggleWishlist: vi.fn() }) }));
afterEach(cleanup);
it('renders service-backed filters and returns an actionable empty catalog', async () => {
  render(await ProductsPage({ searchParams: Promise.resolve({ category: 'missing', page: '-2' }) }));
  expect(screen.getByLabelText('مرتب‌سازی')).toBeTruthy();
  expect(screen.getByLabelText('موجودی')).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'محصولی پیدا نشد' })).toBeTruthy();
  expect(screen.getByRole('link', { name: 'پاک کردن فیلترها' }).getAttribute('href')).toBe('/products');
});
it('searches by Persian SKU and links to the matching product', async () => {
  render(await SearchPage({ searchParams: Promise.resolve({ q: 'ZR-۱۰۰۱' }) }));
  expect(screen.getByRole('searchbox', { name: 'جستجوی محصول' })).toHaveProperty('value', 'ZR-۱۰۰۱');
  const links = screen.getAllByRole('link', { name: 'انگشتر طلای آفتاب' });
  expect(links).toHaveLength(2);
  for (const link of links) expect(link.getAttribute('href')).toBe('/products/ring-aftab');
});
it('renders search guidance for whitespace and empty state for no matches', async () => {
  render(await SearchPage({ searchParams: Promise.resolve({ q: '  ' }) }));
  expect(screen.getByText('محصول دلخواه را پیدا کنید')).toBeTruthy();
  cleanup();
  render(await SearchPage({ searchParams: Promise.resolve({ q: 'not-a-product' }) }));
  expect(screen.getByRole('heading', { name: 'نتیجه‌ای پیدا نشد' })).toBeTruthy();
});

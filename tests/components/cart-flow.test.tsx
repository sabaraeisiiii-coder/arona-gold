// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { AppStoreProvider } from '../../app/store/AppStore';
import { Header } from '../../app/components/layout/Header';
import ProductDetailScreen from '../../app/products/[id]/ProductDetailScreen';
import type { Product } from '../../app/types/product';

vi.mock('../../app/services/auth.service', () => ({ authService: { getMe: async () => null } }));
const product: Product = {
  id: 50, slug: 'test-ring', sku: 'TEST', name: 'انگشتر تست', category: 'انگشتر',
  categorySlug: 'rings', description: 'تست', weight: '۳ گرم', karat: 18, wage: 12,
  price: 12000000, stock: 2, status: 'active', images: [], accent: '#000',
};

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.setItem('zarinbaz-state', JSON.stringify({ cart: [{ productId: 1, quantity: 3 }] }));
});
afterEach(() => { cleanup(); vi.useRealTimers(); localStorage.clear(); });

async function mount(stock = 2) {
  await act(async () => {
    render(<AppStoreProvider><Header /><ProductDetailScreen product={{ ...product, stock }} relatedProducts={[]} /></AppStoreProvider>);
  });
}

it('adds, increments, updates the quantity badge immediately, renders toast and persists across remount', async () => {
  await mount();
  expect(screen.getByRole('link', { name: 'سبد خرید، ۳ قلم' }).textContent).toContain('۳');
  fireEvent.click(screen.getByRole('button', { name: 'افزودن به سبد خرید' }));
  expect(screen.getByRole('link', { name: 'سبد خرید، ۴ قلم' }).textContent).toContain('۴');
  expect(screen.getByRole('status').textContent).toBe('محصول به سبد خرید اضافه شد');
  act(() => { vi.advanceTimersByTime(1000); });
  fireEvent.click(screen.getByRole('button', { name: '✓ به سبد اضافه شد' }));
  expect(screen.getByRole('link', { name: 'سبد خرید، ۵ قلم' }).textContent).toContain('۵');
  expect(JSON.parse(localStorage.getItem('zarinbaz-state')!).cart).toEqual([
    { productId: 1, quantity: 3 }, { productId: 50, quantity: 2 },
  ]);
  act(() => { vi.advanceTimersByTime(1000); });
  expect(screen.getByRole('button', { name: '✓ به سبد اضافه شد' })).toBeTruthy();
  act(() => { vi.advanceTimersByTime(1000); });
  expect(screen.getByRole('button', { name: 'افزودن به سبد خرید' })).toBeTruthy();
  act(() => { vi.advanceTimersByTime(800); });
  expect(screen.queryByRole('status')).toBeNull();
  cleanup();
  await mount();
  expect(screen.getByRole('link', { name: 'سبد خرید، ۵ قلم' })).toBeTruthy();
});

it('does not add out-of-stock products', async () => {
  await mount(0);
  const button = screen.getByRole('button', { name: 'افزودن به سبد خرید' });
  expect(button).toHaveProperty('disabled', true);
  fireEvent.click(button);
  expect(screen.getByRole('link', { name: 'سبد خرید، ۳ قلم' })).toBeTruthy();
  expect(screen.queryByRole('status')).toBeNull();
});

// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Header } from '../../app/components/layout/Header';

vi.mock('../../app/store/AppStore', () => ({ useAppStore: () => ({ cart: [], wishlist: [], user: null }) }));
afterEach(cleanup);

function openSearch() {
  render(<Header />);
  expect(screen.queryByRole('link', { name: 'جستجو' })).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'جستجو' }));
  return screen.getByRole('searchbox', { name: 'جستجوی محصول' });
}

describe('header search', () => {
  it('opens in the header, focuses the input and renders live product details and direct links', () => {
    const input = openSearch();
    expect(document.activeElement).toBe(input);
    fireEvent.change(input, { target: { value: 'ZR-1001' } });
    const result = screen.getByRole('link', { name: /انگشتر طلای آفتاب/ });
    expect(result.getAttribute('href')).toBe('/products/ring-aftab');
    expect(result.textContent).toContain('۱۲٬۸۰۰٬۰۰۰ تومان');
    expect(result.textContent).toContain('۳.۲ گرم');
    expect(result.querySelector('img')).toBeTruthy();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(result);
    fireEvent.keyDown(result, { key: 'Escape' });
    expect(screen.queryByRole('searchbox')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'جستجو' }));
  });

  it('shows an empty result message, refreshes results and closes on outside pointer interaction', () => {
    const input = openSearch();
    fireEvent.change(input, { target: { value: 'does-not-exist' } });
    expect(screen.getByRole('status').textContent).toBe('محصولی پیدا نشد');
    fireEvent.change(input, { target: { value: 'ring-aftab' } });
    expect(screen.getByRole('link', { name: /انگشتر طلای آفتاب/ })).toBeTruthy();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('searchbox')).toBeNull();
  });

  it('closes after choosing a product', () => {
    const input = openSearch();
    fireEvent.change(input, { target: { value: 'ZR-1001' } });
    const result = screen.getByRole('link', { name: /انگشتر طلای آفتاب/ });
    // Prevent jsdom navigation while still exercising the real link click handler.
    result.addEventListener('click', event => event.preventDefault());
    fireEvent.click(result);
    expect(screen.queryByRole('searchbox')).toBeNull();
  });
});

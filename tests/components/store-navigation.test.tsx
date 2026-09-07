// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { Header } from '../../app/components/layout/Header';
import { Footer } from '../../app/components/layout/Footer';
import { mainNavigation } from '../../app/data/navigation';

vi.mock('../../app/store/AppStore', () => ({ useAppStore: () => ({
  cart: [{ productId: 1, quantity: 3 }, { productId: 2, quantity: 2 }], wishlist: [1, 3], user: null,
}) }));
afterEach(cleanup);

it('renders the main routes and keeps cart quantities, wishlist count and account actions', () => {
  render(<Header />);
  const navigation = screen.getByRole('navigation', { name: 'ناوبری اصلی' });
  for (const item of mainNavigation) {
    expect(within(navigation).getByRole('link', { name: item.label }).getAttribute('href')).toBe(item.href);
  }
  expect(screen.getByRole('link', { name: 'سبد خرید، ۵ قلم' }).textContent).toContain('۵');
  expect(screen.getByRole('link', { name: 'علاقه‌مندی‌ها، ۲ محصول' }).textContent).toContain('۲');
  expect(screen.getByRole('link', { name: 'حساب کاربری' }).getAttribute('href')).toBe('/login');
  expect(within(navigation).queryByRole('link', { name: /علاقه/ })).toBeNull();
});

it('opens the mobile menu, closes on Escape, outside interaction and route selection', () => {
  render(<Header />);
  const trigger = screen.getByLabelText('منوی اصلی');
  const menu = trigger.closest('details')!;
  fireEvent.click(trigger);
  expect(menu.open).toBe(true);
  fireEvent.keyDown(trigger, { key: 'Escape' });
  expect(menu.open).toBe(false);
  expect(document.activeElement).toBe(trigger);
  fireEvent.click(trigger);
  fireEvent.pointerDown(document.body);
  expect(menu.open).toBe(false);
  fireEvent.click(trigger);
  const link = within(screen.getByRole('navigation', { name: 'ناوبری موبایل' })).getByRole('link', { name: 'درباره ما' });
  link.addEventListener('click', event => event.preventDefault());
  fireEvent.click(link);
  expect(menu.open).toBe(false);
});

it('renders four footer columns with real destinations and the exact copyright', () => {
  const { container } = render(<Footer />);
  expect(container.querySelectorAll('footer > div')).toHaveLength(4);
  expect(screen.getByRole('link', { name: 'روش‌های ارسال' }).getAttribute('href')).toBe('/guide#shipping');
  expect(screen.getByRole('link', { name: 'شرایط بازگشت کالا' }).getAttribute('href')).toBe('/faq#returns');
  expect(screen.getByText('تمامی حقوق این وب‌سایت متعلق به آرونا گلد است.')).toBeTruthy();
  expect(container.querySelector('a[href="#"]')).toBeNull();
});

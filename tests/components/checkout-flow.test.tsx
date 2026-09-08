// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { AppStoreProvider } from '../../app/store/AppStore';
import CartScreen from '../../app/cart/CartScreen';
import CheckoutScreen from '../../app/checkout/CheckoutScreen';
import { initialAddresses } from '../../app/data/mock/account';
import { authService } from '../../app/services/auth.service';
import { addressService } from '../../app/services/address.service';

const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('../../app/services/auth.service', () => ({ authService: { getMe: async () => null } }));
beforeEach(() => { push.mockClear(); localStorage.clear(); });
afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });

async function mount(screen: 'cart' | 'checkout', state: object) {
  localStorage.setItem('zarinbaz-state', JSON.stringify(state));
  await act(async () => { render(<AppStoreProvider>{screen === 'cart' ? <CartScreen /> : <CheckoutScreen />}</AppStoreProvider>); });
}

it('wires the actual quantity controls, preserves a valid coupon after an invalid attempt, and removes the last item', async () => {
  await mount('cart', { cart: [{ productId: 1, quantity: 1 }] });
  const card = screen.getByRole('article', { name: 'انگشتر طلای آفتاب' });
  expect(within(card).getByRole('button', { name: /کاهش تعداد/ })).toHaveProperty('disabled', true);
  fireEvent.click(within(card).getByRole('button', { name: /افزایش تعداد/ }));
  expect(JSON.parse(localStorage.getItem('zarinbaz-state')!).cart[0].quantity).toBe(2);
  fireEvent.change(screen.getByLabelText('کد تخفیف'), { target: { value: 'ARONA10' } });
  fireEvent.click(screen.getByRole('button', { name: 'اعمال کد' }));
  fireEvent.change(screen.getByLabelText('کد تخفیف'), { target: { value: 'invalid' } });
  fireEvent.click(screen.getByRole('button', { name: 'اعمال کد' }));
  expect(screen.getByLabelText('کد تخفیف').getAttribute('aria-invalid')).toBe('true');
  expect(JSON.parse(localStorage.getItem('zarinbaz-state')!).coupon).toBe('ARONA10');
  fireEvent.click(within(card).getByRole('button', { name: /حذف .* از سبد/ }));
  expect(screen.getByText('سبد خرید خالی است')).toBeTruthy();
});

it('blocks checkout for an empty cart or absent address', async () => {
  await mount('checkout', { cart: [] });
  expect(screen.queryByRole('button', { name: 'ادامه' })).toBeNull();
  cleanup();
  await mount('checkout', { cart: [{ productId: 1, quantity: 1 }], addresses: [] });
  expect(screen.getByRole('button', { name: 'ادامه' })).toHaveProperty('disabled', true);
  expect(screen.getByRole('link', { name: 'مدیریت آدرس‌ها' }).getAttribute('href')).toBe('/addresses');
});

it('keeps the selected address and shipping, requires terms, and records a single local order', async () => {
  const second = { ...initialAddresses[0], id: 9, name: 'گیرنده دوم', line: 'نشانی دوم', isDefault: false };
  await mount('checkout', { cart: [{ productId: 1, quantity: 1 }], addresses: [...initialAddresses, second], orders: [], coupon: 'ARONA10' });
  fireEvent.click(screen.getByRole('button', { name: /گیرنده دوم/ }));
  fireEvent.click(screen.getByRole('button', { name: 'ادامه' }));
  fireEvent.click(screen.getByRole('button', { name: /پیک ویژه تهران/ }));
  fireEvent.click(screen.getByRole('button', { name: 'ادامه' }));
  expect(screen.getByText('نشانی دوم')).toBeTruthy();
  const pay = screen.getByRole('button', { name: 'پرداخت امن' });
  expect(pay).toHaveProperty('disabled', true);
  fireEvent.click(screen.getByRole('checkbox'));
  fireEvent.click(pay);
  const saved = JSON.parse(localStorage.getItem('zarinbaz-state')!);
  expect(saved.orders).toHaveLength(1);
  expect(saved.orders[0].address).toBe('نشانی دوم');
  expect(saved.orders[0].amount).toBe(12800000 * 0.9 + 65000);
  expect(saved.cart).toEqual([]);
  expect(saved.coupon).toBeNull();
  expect(push).toHaveBeenCalledOnce();
  expect(push).toHaveBeenCalledWith('/payment/success');
});

it('recovers from corrupt storage without crashing the store', async () => {
  localStorage.setItem('zarinbaz-state', '{invalid');
  await act(async () => { render(<AppStoreProvider><CartScreen /></AppStoreProvider>); });
  expect(screen.getByRole('heading', { name: 'سبد خرید', level: 1 })).toBeTruthy();
  expect(screen.getByText('بازیابی سبد ذخیره‌شده ممکن نبود')).toBeTruthy();
});

it('blocks checkout when a stored quantity exceeds current stock', async () => {
  await mount('checkout', { cart: [{ productId: 1, quantity: 9999 }] });
  expect(screen.getByRole('alert').textContent).toContain('موجودی');
  expect(screen.queryByRole('button', { name: 'پرداخت امن' })).toBeNull();
});

it('uses API delivery addresses for an authenticated customer instead of mock addresses', async () => {
  vi.spyOn(authService, 'getMe').mockResolvedValue({ id: 'user', mobile: '09123456789', firstName: null, lastName: null, status: 'active' });
  vi.spyOn(addressService, 'list').mockResolvedValue([{ id: 'api-address', receiverName: 'گیرنده واقعی', mobile: '09123456789', province: 'تهران', city: 'تهران', address: 'نشانی API', plaque: null, unit: null, postalCode: '1234567890', isDefault: true }]);
  await mount('checkout', { cart: [{ productId: 1, quantity: 1 }], addresses: initialAddresses });
  expect(screen.getByRole('button', { name: /گیرنده واقعی/ })).toBeTruthy();
  expect(screen.queryByText(initialAddresses[0].line)).toBeNull();
  expect(JSON.parse(localStorage.getItem('zarinbaz-state')!).addresses[0].id).toBe('api-address');
});

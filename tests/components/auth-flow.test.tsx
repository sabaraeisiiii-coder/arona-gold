// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import LoginScreen from '../../app/login/LoginScreen';
import OtpScreen from '../../app/otp/OtpScreen';
const mocks = vi.hoisted(() => ({ router: { push: vi.fn(), replace: vi.fn() }, login: vi.fn(), sendOtp: vi.fn(), verifyOtp: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => mocks.router, useSearchParams: () => new URLSearchParams('next=/checkout') }));
vi.mock('../../app/store/AppStore', () => ({ useAppStore: () => ({ login: mocks.login, notify: vi.fn() }) }));
vi.mock('../../app/services/auth.service', () => ({ authService: { sendOtp: mocks.sendOtp, verifyOtp: mocks.verifyOtp } }));
afterEach(() => { cleanup(); sessionStorage.clear(); vi.clearAllMocks(); });
it('validates mobile before requesting OTP and preserves the intended destination', async () => {
  mocks.sendOtp.mockResolvedValue({ expiresIn: 120 });
  render(<LoginScreen />);
  fireEvent.change(screen.getByRole('textbox', { name: /شماره موبایل/ }), { target: { value: '123' } });
  fireEvent.submit(screen.getByRole('button', { name: 'دریافت کد تأیید' }).closest('form')!);
  expect(mocks.sendOtp).not.toHaveBeenCalled();
  expect(screen.getByText('شماره موبایل معتبر وارد کنید')).toBeTruthy();
  fireEvent.change(screen.getByRole('textbox', { name: /شماره موبایل/ }), { target: { value: '۰۹۱۲۳۴۵۶۷۸۹' } });
  fireEvent.submit(screen.getByRole('button', { name: 'دریافت کد تأیید' }).closest('form')!);
  await waitFor(() => expect(mocks.router.push).toHaveBeenCalledWith('/otp?next=%2Fcheckout'));
  expect(mocks.sendOtp).toHaveBeenCalledWith('09123456789');
});
it('normalizes Persian OTP digits, authenticates, and returns to checkout', async () => {
  sessionStorage.setItem('pending-mobile', '09123456789');
  const user = { id: 'user', mobile: '09123456789', firstName: null, lastName: null, status: 'active' };
  mocks.verifyOtp.mockResolvedValue({ user });
  render(<OtpScreen />);
  fireEvent.change(screen.getByRole('textbox', { name: 'کد تأیید' }), { target: { value: '۱۲۳۴۵۶' } });
  fireEvent.click(screen.getByRole('button', { name: 'تأیید و ورود' }));
  await waitFor(() => expect(mocks.router.replace).toHaveBeenCalledWith('/checkout'));
  expect(mocks.verifyOtp).toHaveBeenCalledWith('09123456789', '123456');
  expect(mocks.login).toHaveBeenCalledWith(user);
  expect(sessionStorage.getItem('pending-mobile')).toBeNull();
});
it('keeps retry available after OTP rejection', async () => {
  sessionStorage.setItem('pending-mobile', '09123456789');
  mocks.verifyOtp.mockRejectedValue(new Error('offline'));
  render(<OtpScreen />);
  fireEvent.change(screen.getByRole('textbox', { name: 'کد تأیید' }), { target: { value: '123456' } });
  fireEvent.click(screen.getByRole('button', { name: 'تأیید و ورود' }));
  await waitFor(() => expect(screen.getByText('تأیید کد ناموفق بود')).toBeTruthy());
  expect(screen.getByRole('button', { name: 'تأیید و ورود' })).toHaveProperty('disabled', false);
  expect(mocks.login).not.toHaveBeenCalled();
});

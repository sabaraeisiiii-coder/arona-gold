// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import AddressesScreen from '../../app/addresses/AddressesScreen';
const mocks = vi.hoisted(() => ({ user: { id: 'user' }, list: vi.fn(), remove: vi.fn(), setDefault: vi.fn(), replaceAddresses: vi.fn(), notify: vi.fn() }));
vi.mock('../../app/hooks/useProtectedRoute', () => ({ useProtectedRoute: () => ({ user: mocks.user, loading: false }) }));
vi.mock('../../app/store/CommerceStore', () => ({ useCommerceStore: () => ({ replaceAddresses: mocks.replaceAddresses }) }));
vi.mock('../../app/store/UiStore', () => ({ useUiStore: () => ({ notify: mocks.notify }) }));
vi.mock('../../app/services/address.service', async importOriginal => {
  const original = await importOriginal<typeof import('../../app/services/address.service')>();
  return { ...original, addressService: { ...original.addressService, list: mocks.list, remove: mocks.remove, setDefault: mocks.setDefault } };
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });
const address = { id: 'api-address', receiverName: 'گیرنده', mobile: '09123456789', province: 'تهران', city: 'تهران', address: 'نشانی', plaque: null, unit: null, postalCode: '1234567890', isDefault: false };
it('synchronizes API addresses with checkout and displays failed mutations without an unhandled rejection', async () => {
  mocks.list.mockResolvedValue([address]);
  mocks.remove.mockRejectedValue(new Error('offline'));
  render(<AddressesScreen />);
  await screen.findByText('گیرنده');
  expect(mocks.replaceAddresses).toHaveBeenCalledWith([expect.objectContaining({ id: 'api-address', name: 'گیرنده', line: 'نشانی' })]);
  fireEvent.click(screen.getByRole('button', { name: 'حذف' }));
  await screen.findByRole('alert');
  expect(screen.getByText('گیرنده')).toBeTruthy();
  await waitFor(() => expect(screen.getByRole('button', { name: 'حذف' })).toHaveProperty('disabled', false));
});
it('retries loading after an API error and renders a genuine empty state', async () => {
  mocks.list.mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce([]);
  render(<AddressesScreen />);
  await screen.findByRole('alert');
  expect(screen.queryByText('هنوز آدرسی ثبت نشده است')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));
  await screen.findByText('هنوز آدرسی ثبت نشده است');
  expect(mocks.list).toHaveBeenCalledTimes(2);
});

// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import type { ReactNode } from 'react';
import { UiStoreProvider } from '../../app/store/UiStore';
import { AdminDrafts } from '../../app/components/admin/AdminDrafts';
import { AdminResourcePage } from '../../app/components/admin/AdminResourcePage';
import { AdminRecordScreen } from '../../app/components/admin/AdminRecordScreen';
import { AdminSettings } from '../../app/components/admin/AdminSettings';
import { AdminLayout } from '../../app/components/admin/AdminLayout';
import { AdminRoles } from '../../app/components/admin/AdminRoles';
import { initialAdminRecords, matchingOrder, resourceConfig } from '../../app/components/admin/resource-config';
import type { AdminResource } from '../../app/mock/admin';

vi.mock('next/navigation', () => ({ usePathname: () => '/admin/products/1/edit' }));
const wrap = (children: ReactNode) => <UiStoreProvider><AdminDrafts>{children}</AdminDrafts></UiStoreProvider>;
beforeEach(() => {
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('admin workspace', () => {
  it.each(['orders', 'payments'] as const)('keeps every %s field and detail action in its responsive row', resource => {
    render(wrap(<AdminResourcePage resource={resource} title={resource} description="تست" />));
    const records = initialAdminRecords()[resource];
    const rows = within(screen.getByRole('list', { name: resource === 'orders' ? 'فهرست سفارش‌ها' : 'فهرست پرداخت‌ها' })).getAllByRole('listitem');
    expect(rows).toHaveLength(records.length);
    rows.forEach((row, index) => {
      for (const field of resourceConfig[resource].fields) {
        const value = records[index][field.key];
        if (value) expect(row.textContent).toContain(value);
      }
      expect(within(row).getByRole('link', { name: 'مشاهده' }).getAttribute('href'))
        .toBe(`/admin/${resource}/${encodeURIComponent(records[index].id)}`);
    });
  });

  it('renders every existing resource without placeholder links', () => {
    for (const resource of Object.keys(resourceConfig) as AdminResource[]) {
      const view = render(wrap(<AdminResourcePage resource={resource} title={resource} description="تست" />));
      expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(resource);
      expect(view.container.querySelector('a[href="#"]')).toBeNull();
      cleanup();
    }
  });

  it('searches Persian SKU digits and opens the correct product route', () => {
    render(wrap(<AdminResourcePage resource="products" title="محصولات" description="تست" />));
    fireEvent.change(screen.getByLabelText('جستجو'), { target: { value: 'zr-۱۰۰۱' } });
    expect(screen.getAllByRole('link', { name: 'مشاهده' })).toHaveLength(1);
    expect(screen.getByRole('link', { name: 'مشاهده' }).getAttribute('href')).toBe('/admin/products/1');
    fireEvent.change(screen.getByLabelText('جستجو'), { target: { value: 'not-found' } });
    expect(screen.getByText('موردی مطابق جستجو پیدا نشد')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'پاک کردن فیلترها' }));
    expect(screen.getAllByRole('link', { name: 'مشاهده' }).length).toBeGreaterThan(1);
  });

  it('creates a draft shared across admin screens and leaves original fixtures unchanged', () => {
    const view = render(wrap(<AdminRecordScreen resource="products" mode="new" title="افزودن" />));
    fireEvent.change(screen.getByLabelText('نام محصول'), { target: { value: 'محصول آزمایشی جدید' } });
    fireEvent.change(screen.getByLabelText('SKU'), { target: { value: 'LOCAL-99' } });
    fireEvent.click(screen.getByRole('button', { name: 'ذخیره پیش‌نویس آزمایشی' }));
    view.rerender(wrap(<AdminResourcePage resource="products" title="محصولات" description="تست" />));
    fireEvent.change(screen.getByLabelText('جستجو'), { target: { value: 'LOCAL-99' } });
    expect(screen.getByText('محصول آزمایشی جدید')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'مشاهده' }).getAttribute('href')).toMatch(/^\/admin\/products\/draft-/);
    expect(initialAdminRecords().products.some(product => product.sku === 'LOCAL-99')).toBe(false);
  });

  it('requires confirmation for mock deletion and supports cancel', () => {
    render(wrap(<AdminResourcePage resource="products" title="محصولات" description="تست" />));
    fireEvent.change(screen.getByLabelText('جستجو'), { target: { value: 'ZR-1001' } });
    fireEvent.click(screen.getByRole('button', { name: 'حذف آزمایشی' }));
    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    expect(screen.getByText('انگشتر طلای آفتاب')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'حذف آزمایشی' }));
    fireEvent.click(screen.getByRole('button', { name: 'تأیید' }));
    expect(screen.queryByText('انگشتر طلای آفتاب')).toBeNull();
  });

  it('keeps audit read-only and applies audit filters', () => {
    render(wrap(<AdminResourcePage resource="audit" title="لاگ" description="تست" />));
    expect(screen.queryByRole('button', { name: /حذف|ویرایش|افزودن/ })).toBeNull();
    fireEvent.change(screen.getByLabelText('مدیر'), { target: { value: 'support@' } });
    expect(screen.getByText('support@aronagold.ir')).toBeTruthy();
    expect(screen.queryByText('admin@aronagold.ir')).toBeNull();
    fireEvent.change(screen.getByLabelText('مرجع'), { target: { value: 'missing-reference' } });
    expect(screen.getByText('موردی مطابق جستجو پیدا نشد')).toBeTruthy();
  });

  it('uses accessible settings tabs with unavailable save explicitly disabled', () => {
    render(<AdminSettings />);
    expect(screen.getAllByRole('tab')).toHaveLength(8);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'عمومی' }), { key: 'ArrowLeft' });
    expect(screen.getByRole('tab', { name: 'فروشگاه' }).getAttribute('aria-selected')).toBe('true');
    fireEvent.click(screen.getByRole('tab', { name: 'ارسال' }));
    expect(screen.getByLabelText('پیک ویژه تهران')).toHaveProperty('readOnly', true);
    expect(screen.getByRole('button', { name: /ذخیره تنظیمات/ })).toHaveProperty('disabled', true);
  });

  it('highlights parent navigation and supports mobile drawer focus and Escape', () => {
    render(<UiStoreProvider><AdminLayout><p>محتوای پنل</p></AdminLayout></UiStoreProvider>);
    expect(screen.getByRole('link', { name: 'محصولات' }).getAttribute('aria-current')).toBe('page');
    const trigger = screen.getByRole('button', { name: 'باز کردن منوی مدیریت' });
    trigger.focus(); fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'پنل مدیریت' });
    expect(within(dialog).getByRole('link', { name: 'محصولات' })).toBeTruthy();
    fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(within(dialog).getByRole('link', { name: /بازگشت به فروشگاه/ }));
    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it('shows unknown IDs safely and does not merge conflicting order fixtures', () => {
    render(wrap(<AdminRecordScreen resource="orders" id="unknown" title="سفارش" />));
    expect(screen.getByText('رکورد پیدا نشد')).toBeTruthy();
    const record = initialAdminRecords().orders.find(order => order.id === 'ZB-1403-1003')!;
    expect(matchingOrder(record)?.id).toBe(record.id);
    expect(matchingOrder({ ...record, amount: '۱ تومان' })).toBeUndefined();
  });

  it('allows only explicit mock role permission changes', () => {
    render(wrap(<AdminRoles />));
    const checkbox = screen.getByRole('checkbox', { name: 'محصولات: مشاهده' });
    expect(checkbox).toHaveProperty('disabled', true);
    fireEvent.change(screen.getByLabelText('نقش'), { target: { value: '1' } });
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole('button', { name: 'ذخیره ماتریس آزمایشی' }));
    expect(screen.getByText('محصولات: مشاهده')).toBeTruthy();
  });
});

it('validates an admin draft and exposes a saved edit through the existing view screen', () => {
  const view = render(wrap(<AdminRecordScreen resource="products" id="1" mode="edit" title="ویرایش" />));
  fireEvent.change(screen.getByLabelText('نام محصول'), { target: { value: '' } });
  fireEvent.click(screen.getByRole('button', { name: 'ذخیره پیش‌نویس آزمایشی' }));
  expect(screen.getByRole('alert').textContent).toContain('نام محصول');
  fireEvent.change(screen.getByLabelText('نام محصول'), { target: { value: 'نام ویرایش‌شده' } });
  fireEvent.click(screen.getByRole('button', { name: 'ذخیره پیش‌نویس آزمایشی' }));
  view.rerender(wrap(<AdminRecordScreen resource="products" id="1" title="مشاهده" />));
  expect(screen.getByText('نام ویرایش‌شده')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'ویرایش پیش‌نویس محصول' }).getAttribute('href')).toBe('/admin/products/1/edit');
});

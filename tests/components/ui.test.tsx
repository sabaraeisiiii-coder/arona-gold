// @vitest-environment jsdom
import { afterEach,describe,expect,it,vi } from 'vitest';import { cleanup,fireEvent,render,screen } from '@testing-library/react';import { Button } from '@/app/components/ui/Button';import { Input } from '@/app/components/ui/Input';import { EmptyState } from '@/app/components/ui/EmptyState';import { Modal } from '@/app/components/ui/Modal';import { StatusBadge } from '@/app/components/admin/StatusBadge';
afterEach(cleanup);describe('UI primitives',()=>{it('renders button variants and blocks interaction while loading',()=>{const click=vi.fn();render(<Button variant="danger" loading onClick={click}>حذف</Button>);const button=screen.getByRole('button',{name:/حذف/});expect(button.className).toContain('ds-button-danger');expect(button).toHaveProperty('disabled',true);fireEvent.click(button);expect(click).not.toHaveBeenCalled()});it('associates input label, hint and error accessibly',()=>{render(<Input label="موبایل" name="mobile" error="نامعتبر"/>);const input=screen.getByLabelText(/موبایل/);expect(input.getAttribute('aria-invalid')).toBe('true');expect(screen.getByText('نامعتبر')).toBeTruthy()});it('renders empty and centralized status states',()=>{render(<><EmptyState title="خالی است" description="موردی نیست"/><StatusBadge status="paid"/></>);expect(screen.getByText('خالی است')).toBeTruthy();expect(screen.getByText('پرداخت شده').className).toContain('success')});it('closes modal with Escape and restores accessible dialog semantics',()=>{const close=vi.fn();render(<Modal open title="تأیید" description="ادامه می‌دهید؟" onClose={close}>محتوا</Modal>);expect(screen.getByRole('dialog',{name:'تأیید'})).toBeTruthy();fireEvent.keyDown(document,{key:'Escape'});expect(close).toHaveBeenCalledOnce()})});

it('keeps focus inside the shared modal across rerenders and restores the trigger and body scroll on close', () => {
  const trigger = document.createElement('button');
  document.body.appendChild(trigger);
  trigger.focus();
  const view = render(<Modal open title="فرم" onClose={() => {}} footer={<Button>ذخیره</Button>}><Input label="نام" /></Modal>);
  const input = screen.getByLabelText('نام');
  input.focus();
  view.rerender(<Modal open title="فرم" onClose={() => {}} footer={<Button>ذخیره</Button>}><Input label="نام" value="تست" readOnly /></Modal>);
  expect(document.activeElement).toBe(input);
  screen.getByRole('button', { name: 'ذخیره' }).focus();
  fireEvent.keyDown(document, { key: 'Tab' });
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'بستن' }));
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'ذخیره' }));
  expect(document.body.style.overflow).toBe('hidden');
  view.rerender(<Modal open={false} title="فرم" onClose={() => {}}>محتوا</Modal>);
  expect(document.activeElement).toBe(trigger);
  expect(document.body.style.overflow).toBe('');
  trigger.remove();
});

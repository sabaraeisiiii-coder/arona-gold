'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StoreShell } from '../components/StoreShell';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { AddressCard } from '../components/account/AddressCard';
import { useCommerceStore } from '../store/CommerceStore';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';
import Loading from '../loading';
import { useProtectedRoute } from '../hooks/useProtectedRoute';
import { useUiStore } from '../store/UiStore';
import { addressService, toCommerceAddress, type ApiAddress, type AddressInput } from '../services/address.service';
import { ApiClientError } from '../services/api-client';

const empty: AddressInput = { receiverName: '', mobile: '', province: '', city: '', address: '', plaque: '', unit: '', postalCode: '' };
export default function AddressesPage() {
  const { user, loading: authLoading } = useProtectedRoute();
  const { notify } = useUiStore();
  const { replaceAddresses } = useCommerceStore();
  const [items, setItems] = useState<ApiAddress[]>([]), [form, setForm] = useState<AddressInput>(empty);
  const [editing, setEditing] = useState<string>(), [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [pending, setPending] = useState(false);
  const lock = useRef(false);
  const load = useCallback(() => addressService.list()
    .then(items => { setItems(items); replaceAddresses(items.map(toCommerceAddress)); setError(''); })
    .catch((error: unknown) => { setError(error instanceof ApiClientError ? error.message : 'دریافت آدرس‌ها ناموفق بود'); })
    .finally(() => setLoading(false)), [replaceAddresses]);
  useEffect(() => { if (user) void load(); }, [user, load]);
  async function mutate(action: () => Promise<unknown>, message: string) {
    if (lock.current) return;
    lock.current = true; setPending(true); setError('');
    try { await action(); notify(message); setLoading(true); await load(); }
    catch (error) { setError(error instanceof ApiClientError ? error.message : 'ذخیره تغییرات ناموفق بود'); }
    finally { lock.current = false; setPending(false); }
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await mutate(async () => {
      if (editing) await addressService.update(editing, form); else await addressService.create(form);
      setOpen(false); setEditing(undefined); setForm(empty);
    }, 'آدرس ذخیره شد');
  }
  function edit(address: ApiAddress) {
    setEditing(address.id);
    setForm({ receiverName: address.receiverName, mobile: address.mobile, province: address.province, city: address.city, address: address.address, plaque: address.plaque, unit: address.unit, postalCode: address.postalCode });
    setError(''); setOpen(true);
  }
  if (authLoading || !user) return <Loading />;
  return <StoreShell><section className="page">
    <PageHeader eyebrow="حساب من" title="آدرس‌ها" action={<Button disabled={pending} onClick={() => { setOpen(true); setEditing(undefined); setForm(empty); setError(''); }}>افزودن آدرس</Button>} />
    {error && <ErrorState description={error} retry={pending ? undefined : () => { setLoading(true); void load(); }} />}
    {open && <form className="ds-card address-form" onSubmit={submit} aria-label={editing ? 'ویرایش آدرس' : 'افزودن آدرس'}>
      {([['receiverName', 'نام گیرنده'], ['mobile', 'موبایل'], ['province', 'استان'], ['city', 'شهر'], ['plaque', 'پلاک'], ['unit', 'واحد'], ['postalCode', 'کد پستی']] as const).map(([key, label]) => <Input key={key} name={key} label={label} value={form[key] ?? ''} disabled={pending} onChange={event => setForm({ ...form, [key]: event.target.value })} inputMode={key === 'mobile' || key === 'postalCode' ? 'numeric' : 'text'} required={key !== 'plaque' && key !== 'unit'} />)}
      <Textarea label="نشانی کامل" required value={form.address} disabled={pending} onChange={event => setForm({ ...form, address: event.target.value })} />
      <div className="inline-actions"><Button type="submit" loading={pending}>ذخیره آدرس</Button><Button variant="secondary" disabled={pending} onClick={() => { setOpen(false); setError(''); }}>انصراف</Button></div>
    </form>}
    {loading ? <Loading /> : items.length === 0 ? !error && <EmptyState title="هنوز آدرسی ثبت نشده است" description="برای ثبت نشانی، افزودن آدرس را انتخاب کنید." /> : <div className="address-grid">{items.map(address => <AddressCard key={address.id} address={address} pending={pending} onEdit={() => edit(address)} onDefault={() => void mutate(() => addressService.setDefault(address.id), "\u0622\u062f\u0631\u0633 \u067e\u06cc\u0634\u200c\u0641\u0631\u0636 \u062a\u063a\u06cc\u06cc\u0631 \u06a9\u0631\u062f")} onDelete={() => void mutate(() => addressService.remove(address.id), "\u0622\u062f\u0631\u0633 \u062d\u0630\u0641 \u0634\u062f")} />)}</div>}
  </section></StoreShell>;
}

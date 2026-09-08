'use client';
import { useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { StoreShell } from '../components/StoreShell';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { authService } from '../services/auth.service';
import { ApiClientError } from '../services/api-client';
import { normalizeIranianMobile } from '../auth/mobile';

export default function LoginPage() {
  const [mobile, setMobile] = useState(''), [error, setError] = useState(''), [loading, setLoading] = useState(false);
  const pending = useRef(false);
  const router = useRouter(), params = useSearchParams();
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending.current) return;
    let normalized: string;
    try { normalized = normalizeIranianMobile(mobile); } catch { setError('شماره موبایل معتبر وارد کنید'); return; }
    pending.current = true; setLoading(true); setError('');
    try {
      const result = await authService.sendOtp(normalized);
      sessionStorage.setItem('pending-mobile', normalized);
      sessionStorage.removeItem('debug-otp');
      if (result.debugOtp) sessionStorage.setItem('debug-otp', result.debugOtp);
      const next = params.get('next');
      router.push(`/otp${next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\') ? `?next=${encodeURIComponent(next)}` : ''}`);
    } catch (error) { setError(error instanceof ApiClientError ? error.message : 'ارسال کد تأیید ناموفق بود'); }
    finally { pending.current = false; setLoading(false); }
  }
  return <StoreShell><section className="auth-page"><form className="ds-card auth-card" onSubmit={submit}><span className="brand">آرونا گلد.</span><h1>ورود / ثبت‌نام</h1><p>برای ادامه شماره موبایل خود را وارد کنید.</p><Input label="شماره موبایل" name="mobile" type="tel" inputMode="tel" autoComplete="tel" required dir="ltr" maxLength={16} value={mobile} error={error} onChange={event => { setMobile(event.target.value); setError(''); }} placeholder="09123456789" /><Button type="submit" loading={loading} disabled={!mobile.trim()}>دریافت کد تأیید</Button><small>با ورود، <Link href="/terms">قوانین و مقررات</Link> را می‌پذیرید.</small></form></section></StoreShell>;
}

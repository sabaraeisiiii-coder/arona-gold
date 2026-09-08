'use client';
import { ErrorState } from './components/ui/ErrorState';
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="page"><ErrorState description="دریافت اطلاعات این صفحه ناموفق بود. دوباره تلاش کنید." retry={reset} /></section>;
}

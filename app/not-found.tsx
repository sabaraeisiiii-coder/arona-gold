import Link from 'next/link';
import { EmptyState } from './components/ui/EmptyState';
export default function NotFound() {
  return <section className="page"><EmptyState title="صفحه پیدا نشد" description="این نشانی در دسترس نیست." action={<Link className="ds-button ds-button-primary" href="/products">مشاهده محصولات</Link>} /></section>;
}

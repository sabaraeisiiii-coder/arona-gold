import { Skeleton } from './components/ui/Skeleton';
export default function Loading() {
  return <section className="page stack" role="status" aria-label="در حال بارگذاری"><span className="sr-only">در حال بارگذاری…</span><Skeleton height={48} /><Skeleton height={180} /><Skeleton height={180} /></section>;
}

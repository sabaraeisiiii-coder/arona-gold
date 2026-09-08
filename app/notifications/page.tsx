import { StoreShell } from '../components/StoreShell';
import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
export default function Page() {
  return <StoreShell><section className="page"><PageHeader eyebrow="حساب من" title="اعلان‌ها" description="پیام‌های سفارش، پرداخت و فروشگاه." /><EmptyState title="اعلان جدیدی ندارید" description="پیام‌های جدید شما در این بخش نمایش داده می‌شوند." /></section></StoreShell>;
}

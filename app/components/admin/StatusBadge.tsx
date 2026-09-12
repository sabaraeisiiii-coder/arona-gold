import { Badge, type BadgeVariant } from '../ui/Badge';
import { STATUS, type Status } from '@/app/constants/status';

const labels: Record<string, string> = { inactive: 'غیرفعال', draft: 'پیش‌نویس', out_of_stock: 'ناموجود' };
function displayTone(value: string): BadgeVariant {
  if (/ناموفق|مسدود|ناموجود|لغو|expired|منقضی/.test(value)) return 'error';
  if (/کم|پیش|انتظار|pending/.test(value)) return 'warning';
  if (/^فعال$|^موجود$|پرداخت شده|تأیید شده|منتشر شده|تحویل شده/.test(value)) return 'success';
  if (/ارسال شده|پردازش/.test(value)) return 'info';
  return 'neutral';
}

export function StatusBadge({ status }: { status: string }) {
  const known = Object.hasOwn(STATUS, status) ? STATUS[status as Status] : undefined;
  const label = known?.label ?? labels[status] ?? (status || 'ثبت نشده');
  return <Badge variant={known?.variant ?? displayTone(label)} className={known ? `status-${status}` : undefined}>{label}</Badge>;
}

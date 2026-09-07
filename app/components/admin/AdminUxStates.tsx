'use client';
import { useState } from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Skeleton } from '../ui/Skeleton';
import { EmptyState } from '../ui/EmptyState';
import { ErrorState } from '../ui/ErrorState';
import { Badge } from '../ui/Badge';
import { Toast } from '../ui/Toast';
export function AdminUxStates() {
  const [retried, setRetried] = useState(false);
  return <><AdminPageHeader title="حالت‌های رابط کاربری" description="مرجع توسعه و QA؛ خارج از مسیر عادی مدیریت." />
    <div className="admin-form-grid">
      <section className="ds-card admin-detail-card"><h2>بارگذاری</h2><Spinner /><Skeleton height={48} /><Skeleton height={48} /></section>
      <EmptyState title="داده‌ای وجود ندارد" description="حالت خالی فهرست" />
      <EmptyState title="نتیجه‌ای پیدا نشد" description="حالت بدون نتیجه جستجو" />
      {retried ? <Toast tone="success">تلاش آزمایشی موفق بود</Toast> : <ErrorState description="خطای نمونه برای بررسی رابط کاربری" retry={() => setRetried(true)} />}
      <section className="ds-card admin-detail-card"><h2>وضعیت عملیات</h2><Badge variant="warning">در انتظار</Badge><Badge variant="error">منقضی‌شده</Badge><Badge variant="success">موفق</Badge><Button disabled>عملیات غیرفعال</Button></section>
    </div>
  </>;
}

'use client';
import { useState } from 'react';
import { AdminPageHeader } from './AdminPageHeader';
import { AdminTabs } from './AdminTabs';
import { FormSection } from './FormSection';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { shippingMethods } from '../../data/mock/shipping';
import { goldPriceSnapshot } from '../../data/mock/market';
import { formatMoney } from '../../lib/format';

const tabs = ['عمومی', 'فروشگاه', 'پرداخت', 'ارسال', 'اعلان‌ها', 'قیمت طلا', 'SEO', 'امنیت'];
const settings: Record<string, [string, string][]> = {
  'عمومی': [['نام فروشگاه', 'آرونا گلد'], ['شماره تماس', ''], ['ایمیل', ''], ['آدرس', '']],
  'فروشگاه': [['واحد نمایش قیمت', 'تومان'], ['تنظیمات فروش', '']],
  'پرداخت': [['درگاه فعال', ''], ['وضعیت اتصال', 'سرویس مدیریت درگاه موجود نیست']],
  'ارسال': shippingMethods.map(method => [method.name, `${method.desc} · ${formatMoney(method.cost)}`]),
  'اعلان‌ها': [['ارائه‌دهنده اعلان', ''], ['تنظیمات پیامک', '']],
  'قیمت طلا': [['قیمت نمونه هر گرم', formatMoney(goldPriceSnapshot.price)], ['آخرین بروزرسانی نمونه', goldPriceSnapshot.updatedAt]],
  'SEO': [['عنوان سایت', 'آرونا گلد | فروشگاه طلای اصیل'], ['توضیحات سایت', 'فروشگاه آنلاین آرونا گلد؛ عرضه طلای ۱۸ عیار با ضمانت اصالت و فاکتور رسمی']],
  'امنیت': [['مدیریت نشست‌ها', ''], ['تنظیمات ورود مدیر', '']],
};
export function AdminSettings() {
  const [tab, setTab] = useState(tabs[0]);
  return <><AdminPageHeader title="تنظیمات فروشگاه" description="تنظیمات عمومی و اتصال سرویس‌ها." />
    <p className="admin-notice">این بخش نمای فقط‌خواندنی تنظیمات موجود است. سرویس ذخیره تنظیمات Admin در پروژه وجود ندارد.</p>
    <AdminTabs tabs={tabs} active={tab} onChange={setTab}>
      <FormSection title={tab}><div className="admin-form-grid">{settings[tab].map(([label, value]) => <Input key={label} label={label} value={value} readOnly placeholder="ثبت نشده" />)}</div></FormSection>
    </AdminTabs>
    <Button disabled>ذخیره تنظیمات — سرویس متصل نیست</Button>
  </>;
}

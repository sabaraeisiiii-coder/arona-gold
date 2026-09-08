import { StoreShell } from '../components/StoreShell';
import { PageHeader } from '../components/layout/PageHeader';
import { Input, Textarea } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
export default function Page() {
  return <StoreShell><section className="page"><PageHeader eyebrow="آرونا گلد" title="تماس با ما" description="اطلاعات پشتیبانی و فرم تماس." /><form className="ds-card form-surface"><Input label="نام و نام خانوادگی" name="name" autoComplete="name" placeholder="نام خود را وارد کنید" /><Input label="شماره موبایل" name="mobile" type="tel" autoComplete="tel" dir="ltr" placeholder="09123456789" /><Textarea label="توضیحات" name="message" rows={4} placeholder="توضیحات تکمیلی" /><p id="contact-unavailable">ارسال پیام از این فرم هنوز در دسترس نیست.</p><Button type="button" disabled aria-describedby="contact-unavailable">ثبت اطلاعات</Button></form></section></StoreShell>;
}

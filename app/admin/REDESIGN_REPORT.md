# گزارش بازطراحی Admin آرونا گلد

این تغییر روی Admin موجود انجام شده است؛ هیچ Admin موازی یا route جدید ساخته نشده و هیچ فایل قبلی حذف نشده است.

## ۱. فایل‌های موجود اصلاح‌شده

کامپوننت‌های موجود:
- `app/components/admin/AdminLayout.tsx`: استفاده از توکن‌های تیره موجود، provider پیش‌نویس Admin، drawer موبایل، overlay، مدیریت فوکوس و Escape.
- `app/components/admin/AdminSidebar.tsx`: گروه‌بندی منو، active state برای routeهای فرزند، آیکن‌های متنی، لینک فروشگاه و نمایش UX States فقط در منوی development.
- `app/components/admin/AdminTopbar.tsx`: کنترل منوی موبایل و نمایش وضعیت محیط آزمایشی.
- `app/components/admin/AdminResourcePage.tsx`: جدول اختصاصی هر ماژول، فیلتر، جستجو، مقصد واقعی جزئیات، فرم آزمایشی داخل Modal و حذف با تأیید؛ Audit فقط‌خواندنی است.

فایل‌های route موجود که به کامپوننت‌های تکمیل‌شده متصل شدند:
- `app/admin/page.tsx`
- `app/admin/products/new/page.tsx`
- `app/admin/products/[id]/page.tsx`
- `app/admin/products/[id]/edit/page.tsx`
- `app/admin/categories/new/page.tsx`
- `app/admin/categories/[id]/page.tsx`
- `app/admin/discounts/new/page.tsx`
- `app/admin/discounts/[id]/page.tsx`
- `app/admin/banners/new/page.tsx`
- `app/admin/banners/[id]/page.tsx`
- `app/admin/content/[id]/page.tsx`
- `app/admin/orders/[id]/page.tsx`
- `app/admin/payments/[id]/page.tsx`
- `app/admin/users/[id]/page.tsx`
- `app/admin/roles/page.tsx`
- `app/admin/settings/page.tsx`
- `app/admin/ux-states/page.tsx`

`AdminShell.tsx`، `app/admin/layout.tsx` و primitiveهای مشترک نیاز به تغییر نداشتند و reuse شدند. تغییرات قبلی کاربر در فایل‌ها دست‌نخورده باقی ماندند.

## ۲. فایل‌های جدید

- `app/admin/admin.css`: تمام CSS جدید زیر `.admin-layout` محدود شده است.
- `app/components/admin/resource-config.ts`: تعریف فیلدهای هر ماژول و adapter داده‌های موجود، بدون تغییر fixtureها.
- `app/components/admin/AdminDrafts.tsx`: حافظه موقت پیش‌نویس‌های UI داخل layout موجود Admin.
- `app/components/admin/AdminRecordForm.tsx`: فرم مشترک فیلدمحور، گروه‌بندی، اعتبارسنجی ابتدایی و ذخیره آزمایشی.
- `app/components/admin/AdminRecordScreen.tsx`: نمایش/ویرایش شناسه انتخاب‌شده در routeهای فعلی؛ حالت رکورد ناموجود و جزئیات سفارش.
- `app/components/admin/AdminTabs.tsx`: تب اختصاصی Admin با پشتیبانی کیبورد؛ Tabs قابل reuse در پروژه وجود نداشت.
- `app/components/admin/AdminDashboard.tsx`: KPIها، سفارش‌های اخیر، فعالیت‌ها و نمودار هفتگی موجود.
- `app/components/admin/AdminSettings.tsx`: هشت تب تنظیمات، با داده‌های موجود و ذخیره غیرفعال.
- `app/components/admin/AdminRoles.tsx`: نقش‌ها و ماتریس آزمایشی مجوزها.
- `app/components/admin/AdminUxStates.tsx`: حالت‌های loading، empty، error/retry، success، no-result، disabled، pending و expired برای QA.
- `tests/components/admin-workspace.test.tsx`: ۹ تست Admin.
- `app/admin/REDESIGN_REPORT.md`: همین گزارش.

## ۳. routeهای بازطراحی‌شده

تمام مسیرهای زیر همان routeهای قبلی هستند. برخی فایل‌های page تغییر کردند و فهرست‌ها از طریق AdminResourcePage و layout مشترک بازطراحی شدند:

- `/admin`
- `/admin/products`، `/admin/products/new`، `/admin/products/[id]`، `/admin/products/[id]/edit`
- `/admin/categories`، `/admin/categories/new`، `/admin/categories/[id]`
- `/admin/inventory`، `/admin/inventory/history`
- `/admin/orders`، `/admin/orders/[id]`
- `/admin/payments`، `/admin/payments/[id]`
- `/admin/users`، `/admin/users/[id]`
- `/admin/discounts`، `/admin/discounts/new`، `/admin/discounts/[id]`
- `/admin/banners`، `/admin/banners/new`، `/admin/banners/[id]`
- `/admin/announcements`
- `/admin/content`، `/admin/content/[id]`
- `/admin/roles`، `/admin/settings`، `/admin/audit`، `/admin/ux-states`

## ۴. قابلیت‌های قابل استفاده

- Navigation، active state، مقصد جزئیات هر رکورد و بازگشت به فهرست.
- drawer موبایل، overlay، Escape و گردش فوکوس.
- جستجو، فیلتر وضعیت و پاک‌کردن فیلترها.
- فیلترهای مدیر، ماژول، عملیات، تاریخ و مرجع در Audit؛ تطبیق با داده‌های متنی فعلی.
- تب‌های محصول، جزئیات سفارش و تنظیمات، همراه کنترل کیبورد.
- ایجاد/ویرایش پیش‌نویس برای منابع قابل ویرایش و حذف آزمایشی با تأیید.
- پیش‌نویس‌ها بین صفحات Admin در طول mount همان layout باقی می‌مانند؛ reload آن‌ها را پاک می‌کند.
- نمایش پیام موفقیت با UiStore و Toast موجود.
- فرم‌های ساده اعتبارسنجی می‌شوند؛ ذخیره عنوان خالی و اعداد منفی نامعتبر پذیرفته نمی‌شود.

## ۵. محدودیت‌ها و بخش‌های mock

- همه عملیات نوشتن Admin فقط در حافظه UI هستند. هیچ تغییری در فروشگاه، موجودی واقعی، فایل mock یا دیتابیس ایجاد نمی‌کنند.
- داده روزانه برای سفارشات امروز، فروش امروز و کاربران جدید وجود ندارد؛ KPI مربوطه «—» نشان می‌دهد. کم‌موجودها از داده محصولات محاسبه می‌شوند.
- نمودار هفتگی با همان مقادیر نمونه قبلی حفظ شده و به‌عنوان شاخص نسبی نمونه برچسب خورده است.
- فیلدهای ناموجود مانند رزرو انبار، زمان‌های تراکنش، سقف استفاده تخفیف و مقادیر قبل/بعد Audit با «ثبت نشده» نمایش داده می‌شوند.
- داده کامل برخی سفارش‌ها، پرداخت‌ها و کاربران موجود نیست. شناسه و مبلغ برای اتصال جزئیات سفارش بررسی می‌شوند تا fixtureهای متناقض صرفاً بر اساس ID ادغام نشوند.
- ثبت قیمت تاریخی اقلام، تاریخچه کامل سفارش و یادداشت داخلی پشتیبانی نشده‌اند.
- تغییر وضعیت سفارش، تأیید/استرداد پرداخت و ذخیره تنظیمات سرویس متصل ندارند و غیرفعال‌اند.
- ماتریس نقش‌ها فقط پیش‌نویس UI است و هیچ مجوز واقعی اعطا نمی‌کند.
- تصاویر واقعی محصولات موجود با ProductMedia نمایش داده می‌شوند؛ بارگذاری و ویرایش رسانه متصل نیست.
- تب‌های تنظیمات فقط‌خواندنی‌اند؛ تنظیمات امنیتی، پیامک و درگاه واقعی ساخته نشده‌اند.

## ۶. ساختارهای منتقل‌شده از Prototype

فایل دقیق `admin.prototype(1).html` در فایل‌های قابل دسترس موجود نبود. مرجع بررسی‌شده، نسخه موجود پروژه در `legacy/admin.prototype.html` بود؛ انطباق با نسخه ناموجود `(1)` ادعا نمی‌شود.

از نسخه موجود و شرح درخواست استفاده شد: گروه‌بندی Sidebar، چیدمان داشبورد، KPIها، سفارش‌ها و فعالیت‌های اخیر، نوع ستون‌های هر ماژول، گروه‌بندی فرم محصول، اطلاعات جزئیات سفارش، ماتریس نقش‌ها، فیلترهای Audit، هشت تب تنظیمات و حالت‌های QA.

## ۷. مواردی که منتقل نشدند

CSS و پالت روشن Prototype، Tailwind CDN، Font Awesome خارجی، handlerهای رشته‌ای onclick، ساخت HTML با رشته و دستکاری محتوای DOM، نمونه اطلاعات تماس، آمار و داده‌های تکمیلی ساختگی و شبیه‌سازی backend واقعی منتقل نشدند.

## ۸. اثر بر Storefront

هیچ فایل خارج از Admin و تست‌های مربوطه در این کار تغییر نکرد. این موضوع با مقایسه SHA-256 فایل‌ها نسبت به ابتدای کار بررسی شد. CSS فقط زیر `.admin-layout` است؛ primitiveهای Button، Input، Card، Badge، Table، Modal، Toast و سایر کامپوننت‌های مشترک تغییر نکرده‌اند.

تست‌های regression موجود فروشگاه نیز موفق بودند. بررسی بصری مرورگر انجام نشده است.

## ۹. منطق بیزینسی و اعتبارسنجی

Store، Service، API، schema، احراز هویت، fixtureهای موجود و منطق بیزینسی واقعی تغییر نکردند. تنها رفتار آزمایشی UI Admin گسترش یافت و عملیات ناامن/ناموجود صریحاً غیرفعال شدند.

Build، TypeScript و lint بخش Admin موفق بودند. تمام ۴۲ تست پروژه در ۱۴ فایل موفق شدند، شامل ۹ تست جدید Admin.

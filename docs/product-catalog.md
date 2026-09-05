# کاتالوگ محصولات آرونا گلد

## مدل داده

مدل‌های مرکزی در `app/types/product.ts` قرار دارند. `ProductImage` شامل `src`، `alt` و `isPrimary?` است. `Product` شامل `id`، `slug`، `sku`، نام، دسته، توضیح، وزن، عیار، اجرت، قیمت، قیمت قبلی و درصد تخفیف اختیاری، موجودی، وضعیت و `images` است. وضعیت محصول یکی از `active`، `inactive`، `out_of_stock` یا `draft` است. Storefront فقط وضعیت‌های قابل نمایش را از service دریافت می‌کند.

قیمت یک دادهٔ نمایشی است؛ هیچ فرمول مالی در ProductCard یا صفحهٔ جزئیات اجرا نمی‌شود. تمام نمایش‌های قیمت از `formatMoney` و `ProductPrice` استفاده می‌کنند.

## محل داده و Service

- fixture محصول: `app/data/mock/products.ts`
- fixture دسته‌بندی: `app/data/mock/categories.ts`
- service محصول: `app/services/product.service.ts`
- service دسته‌بندی: `app/services/category.service.ts`

صفحه‌ها fixture را مستقیم import نمی‌کنند. Home، Listing، Search، Wishlist و Product Detail از service داده می‌گیرند. `getProducts` ورودی‌های `page`، `pageSize`، `category`، `sort` و `availability` را پشتیبانی می‌کند. برای اتصال API در آینده فقط پیاده‌سازی service عوض می‌شود و قرارداد componentها ثابت می‌ماند.

`catalogSnapshot` موقتاً برای Cart و Checkout نگه داشته شده چون این دو screen کاملاً client-side هستند. این export فقط یک compatibility bridge است و fixture را به UI معرفی نمی‌کند؛ هنگام API integration باید دادهٔ سبد از loader یا commerce API به این screenها تزریق شود.

## معماری تصویر

فایل‌ها در پوشه‌ای URL-safe بر اساس slug ذخیره می‌شوند:

```text
public/images/products/[product-slug]/
  main.jpg
  gallery-01.jpg
  gallery-02.jpg
  gallery-03.jpg
```

نام پوشه و فایل انگلیسی، بدون فاصله و URL-safe باشد. تصویر پیشنهادی مربع، حداقل `1200x1200`، با پس‌زمینه هماهنگ و حجم optimize شده است. JPG پشتیبانی می‌شود و WebP برای حجم کمتر پیشنهاد می‌شود.

`getPrimaryProductImage(product)` ابتدا تصویر دارای `isPrimary: true`، سپس اولین عضو `images` را انتخاب می‌کند. اگر تصویری وجود نداشته باشد یا بارگذاری شکست بخورد، `ProductMedia` fallback برند آرونا گلد را نمایش می‌دهد؛ بنابراین broken image icon دیده نمی‌شود. `accent` فقط برای رنگ همین fallback و به‌صورت transitional نگه داشته شده است.

ProductCard تصویر اصلی را در نسبت `1:1` نمایش می‌دهد. Product Detail یک تصویر اصلی و، فقط در صورت وجود بیش از یک تصویر، thumbnail gallery تعاملی نمایش می‌دهد. فقط Gallery/Media client component هستند.

## افزودن محصول جدید

1. یک رکورد type-safe در `app/data/mock/products.ts` با slug و SKU یکتا اضافه کنید.
2. تا وقتی عکس واقعی آماده نیست `images: []` قرار دهید.
3. categorySlug را با یکی از دسته‌های `app/data/mock/categories.ts` هماهنگ کنید.
4. برای انتشار در Storefront وضعیت `active` یا `out_of_stock` تعیین کنید؛ `draft` و `inactive` نمایش داده نمی‌شوند.

## افزودن عکس محصول

برای محصولی با `slug = ring-aftab` فایل‌ها را اینجا قرار دهید:

```text
public/images/products/ring-aftab/main.jpg
public/images/products/ring-aftab/gallery-01.jpg
```

سپس در Product Data ثبت کنید:

```ts
images: [
  {
    src: '/images/products/ring-aftab/main.jpg',
    alt: 'انگشتر طلای آفتاب آرونا گلد',
    isPrimary: true,
  },
  {
    src: '/images/products/ring-aftab/gallery-01.jpg',
    alt: 'نمای کنار انگشتر طلای آفتاب',
  },
]
```

هیچ path را پیش از قرار دادن فایل واقعی در `public` ثبت نکنید.

## سازگاری Route

لینک‌های جدید از slug مانند `/products/ring-aftab` استفاده می‌کنند. نام پوشهٔ Route فعلی `[id]` برای جلوگیری از rewrite گسترده حفظ شده، اما resolver ابتدا slug را بررسی می‌کند و سپس ID عددی قدیمی را به‌عنوان compatibility fallback می‌پذیرد.

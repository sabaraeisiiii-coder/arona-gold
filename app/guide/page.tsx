import Link from "next/link";
import { StoreShell } from "../components/StoreShell";
import { shippingMethods } from "../data/mock/shipping";
import { formatMoney } from "../lib/format";
import "./guide.css";

export default function GuidePage() {
  return (
    <StoreShell>
      <section className="page shopping-guide guide-page">
        <header className="guide-page__hero">
          <span className="eyebrow">همراه شما در انتخاب طلا</span>
          <h1>راهنمای خرید از آرونا گلد</h1>
          <p>
            از انتخاب محصول تا دریافت سفارش، مراحل خرید را به‌سادگی دنبال کنید.
          </p>
        </header>
        <section aria-labelledby="guide-steps-title">
          <div className="guide-page__section-heading">
            <h2 id="guide-steps-title">مراحل خرید</h2>
            <p>چهار گام ساده برای ثبت سفارش</p>
          </div>
          <ol className="guide-page__steps" role="list">
            <li className="ds-card guide-page__step">
              <span className="guide-page__step-number">مرحله ۱</span>
              <h3>انتخاب محصول</h3>
              <p>
                محصول موردنظر را از <Link href="/products">فروشگاه</Link> پیدا
                کنید یا از جستجوی سایت استفاده کنید.
              </p>
            </li>
            <li className="ds-card guide-page__step">
              <span className="guide-page__step-number">مرحله ۲</span>
              <h3>بررسی و افزودن به سبد</h3>
              <p>
                قیمت، وزن، عیار، موجودی و مشخصات محصول را بررسی کرده و آن را به
                سبد خرید اضافه کنید.
              </p>
            </li>
            <li className="ds-card guide-page__step">
              <span className="guide-page__step-number">مرحله ۳</span>
              <h3>بررسی سبد خرید</h3>
              <p>
                تعداد محصولات، مبلغ سفارش و اطلاعات{" "}
                <Link href="/cart">سبد خرید</Link> را بررسی کنید.
              </p>
            </li>
            <li className="ds-card guide-page__step">
              <span className="guide-page__step-number">مرحله ۴</span>
              <h3>تکمیل سفارش</h3>
              <p>
                اطلاعات گیرنده، روش ارسال و پرداخت را انتخاب کرده و سفارش را
                نهایی کنید.
              </p>
            </li>
          </ol>
        </section>
        <section id="shipping" aria-labelledby="guide-shipping-title">
          <div className="guide-page__section-heading">
            <h2 id="guide-shipping-title">روش‌های ارسال</h2>
            <p>زمان تحویل و هزینه هر روش را بررسی کنید.</p>
          </div>
          <div className="guide-page__shipping-grid">
            {shippingMethods.map((method) => (
              <article
                className="ds-card guide-page__shipping-card"
                key={method.id}
              >
                <h3>{method.name}</h3>
                <p>
                  {method.desc}
                  {method.id === 2 ? " تومان" : ""}
                </p>
                <div className="guide-page__shipping-cost">
                  <span>هزینه ارسال</span>
                  <strong>
                    {method.cost
                      ? formatMoney(method.cost)
                      : "بدون هزینه ارسال"}
                  </strong>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="guide-page__help"
          aria-labelledby="guide-help-title"
        >
          <div className="guide-page__section-heading">
            <h2 id="guide-help-title">پیش از نهایی کردن خرید</h2>
            <p>شرایط خرید را مطالعه کنید و پاسخ پرسش‌های خود را بیابید.</p>
          </div>
          <div className="guide-page__help-links">
            <Link href="/terms">
              قوانین و مقررات<span aria-hidden="true">←</span>
            </Link>
            <Link href="/faq#returns">
              شرایط بازگشت کالا<span aria-hidden="true">←</span>
            </Link>
            <Link href="/faq">
              سوالات متداول<span aria-hidden="true">←</span>
            </Link>
            <Link href="/contact">
              تماس با ما<span aria-hidden="true">←</span>
            </Link>
          </div>
        </section>
        <section className="guide-page__cta" aria-labelledby="guide-cta-title">
          <div>
            <h2 id="guide-cta-title">آماده خرید هستید؟</h2>
            <p>محصولات آرونا گلد را بررسی کنید و انتخاب خود را انجام دهید.</p>
          </div>
          <Link className="ds-button ds-button-primary" href="/products">
            مشاهده فروشگاه
          </Link>
        </section>
      </section>
    </StoreShell>
  );
}

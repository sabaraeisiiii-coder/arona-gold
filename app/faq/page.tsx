import { StoreShell } from "../components/StoreShell";

const faqItems = [
  {
    question: "چطور می‌تونم سفارش ثبت کنم؟",
    answer:
      "محصول موردنظر را انتخاب کنید، به سبد خرید اضافه کنید و سفارش را نهایی کنید.",
  },
  {
    question: "ارسال سفارش چقدر زمان می‌برد؟",
    answer: "ارسال سفارش معمولاً بین ۲ تا ۵ روز کاری زمان می‌برد.",
  },
  {
    question: "آیا امکان بازگشت کالا وجود دارد؟",
    answer:
      "بله، در صورت رعایت شرایط بازگشت کالا می‌توانید درخواست مرجوعی ثبت کنید.",
  },
];

export default function Page() {
  return (
    <StoreShell>
      <section className="page">
        <header className="page-head">
          <h1>سوالات متداول</h1>
          <p>پاسخ به پرسش‌های خرید، ارسال و بازگشت.</p>
        </header>

        <div className="faq-list">
          {faqItems.map((item, index) => (
            <details className="ds-card" key={index} id={index === 2 ? "returns" : undefined} open={index === 2 ? true : undefined}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </StoreShell>
  );
}

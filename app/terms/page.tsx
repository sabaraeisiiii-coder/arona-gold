import { PageHeader } from "../components/layout/PageHeader";
import { StoreShell } from "../components/StoreShell";
export default function Page() {
  return (
    <StoreShell>
      <section className="page">
        <PageHeader
          title="قوانین و مقررات"
          description="شرایط خرید، بازگشت و حریم خصوصی."
        />
        <article className="ds-card prose">
          <p>
            تمام اطلاعات این بخش در مسیر مستقل خودش نگهداری می‌شود و برای اتصال
            به سرویس واقعی آماده است.
          </p>
        </article>
      </section>
    </StoreShell>
  );
}

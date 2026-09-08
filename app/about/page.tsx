import { StoreShell } from "../components/StoreShell";
import { PageHeader } from "../components/layout/PageHeader";
export default function Page() {
  return (
    <StoreShell>
      <section className="page">
        <PageHeader
          title="درباره ما"
          description="معرفی آرونا گلد، سابقه و ضمانت اصالت."
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

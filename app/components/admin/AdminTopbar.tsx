import { Button } from "../ui/Button";
export function AdminTopbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="admin-top">
      <div className="admin-top-title">
        <Button
          className="admin-menu-toggle"
          variant="secondary"
          aria-label="باز کردن منوی مدیریت"
          onClick={onOpenMenu}
        >
          ☰
        </Button>
        <strong>مدیریت آرونا گلد</strong>
      </div>
    </header>
  );
}

import Link from "next/link";
const links = [
  ["/admin", "داشبورد"],
  ["/admin/products", "محصولات"],
  ["/admin/categories", "دسته‌بندی‌ها"],
  ["/admin/inventory", "موجودی"],
  ["/admin/orders", "سفارش‌ها"],
  ["/admin/payments", "پرداخت‌ها"],
  ["/admin/users", "کاربران"],
  ["/admin/discounts", "تخفیف‌ها"],
  ["/admin/banners", "بنرها"],
  ["/admin/content", "محتوا"],
  ["/admin/roles", "نقش‌ها"],
  ["/admin/settings", "تنظیمات"],
];
export function AdminSidebar() {
  return (
    <aside className="admin-side">
      <Link className="brand" href="/admin">
        آرونا <span>گلد</span>
        <i></i>
      </Link>
      <nav>
        {links.map(([href, label]) => (
          <Link href={href} key={href}>
            {label}
          </Link>
        ))}
      </nav>
      <Link className="back-store" href="/">
        ← فروشگاه
      </Link>
    </aside>
  );
}

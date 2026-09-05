# Frontend migration — آرونا گلد

این سند منبع وضعیت مهاجرت از prototypeهای `legacy/` است. فایل‌های HTML قدیمی فقط مرجع‌اند و هیچ کد Runtime مجاز به import، load، parse، embed یا inject کردن آن‌ها نیست.

## Storefront and customer screens

| Legacy Screen | React Route | Components Used | Migration Status |
|---|---|---|---|
| Home | `/` | StoreShell, Header, Footer, ProductGrid, ProductCard | Migrated |
| Catalog/category/search | `/products`, `/search` | ProductGrid, ProductCard, Filter UI | Migrated |
| Product detail | `/products/[id]` | ProductPrice, Stock UI, StoreShell | Migrated |
| Cart | `/cart` | CartItem, OrderSummary, Button | Migrated |
| Wishlist | `/wishlist` | ProductGrid, ProductCard, EmptyState | Migrated |
| Login and OTP | `/login`, `/otp` | Input, Button, Alert | Migrated |
| Checkout | `/checkout` | CheckoutProgress, OrderSummary, form controls | Migrated |
| Payment result | `/payment/success`, `/payment/failed` | Alert, Button, StoreShell | Migrated |
| Account dashboard | `/account` | AccountLayout, AccountSidebar, Badge | Migrated |
| Profile | `/profile` | Input, Button, StoreShell | Migrated |
| Addresses | `/addresses` | AddressCard, Modal, form controls | Migrated |
| Orders and detail | `/orders`, `/orders/[id]` | OrderCard, StatusBadge, OrderSummary | Migrated |
| Notifications | `/notifications` | Card, EmptyState, StoreShell | Migrated |
| Informational pages | `/about`, `/contact`, `/faq`, `/terms` | PageHeader, Card, StoreShell | Migrated |

## Administration screens

| Legacy Screen | React Route | Components Used | Migration Status |
|---|---|---|---|
| Dashboard | `/admin` | AdminLayout, AdminSidebar, AdminTopbar, KpiCard | Migrated |
| Products | `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit` | AdminResourcePage, DataTable, FormSection | Migrated |
| Categories | `/admin/categories`, `/admin/categories/new`, `/admin/categories/[id]` | AdminResourcePage, DataTable, FormSection | Migrated |
| Inventory/history | `/admin/inventory`, `/admin/inventory/history` | DataTable, FilterBar, StatusBadge | Migrated |
| Orders/detail | `/admin/orders`, `/admin/orders/[id]` | AdminResourcePage, DataTable, StatusBadge | Migrated |
| Users/detail | `/admin/users`, `/admin/users/[id]` | AdminResourcePage, DataTable, StatusBadge | Migrated |
| Payments/detail | `/admin/payments`, `/admin/payments/[id]` | AdminResourcePage, DataTable, StatusBadge | Migrated |
| Discounts | `/admin/discounts`, `/admin/discounts/new`, `/admin/discounts/[id]` | AdminResourcePage, DataTable, FormSection | Migrated |
| Banners | `/admin/banners`, `/admin/banners/new`, `/admin/banners/[id]` | AdminResourcePage, DataTable, FormSection | Migrated |
| Announcements | `/admin/announcements` | AdminResourcePage, DataTable, ConfirmDialog | Migrated |
| Content | `/admin/content`, `/admin/content/[id]` | AdminResourcePage, DataTable, FormSection | Migrated |
| Roles, audit, settings | `/admin/roles`, `/admin/audit`, `/admin/settings` | DataTable, FormSection, Switch | Migrated |
| Prototype UX states | `/admin/ux-states` | Alert, EmptyState, ErrorState, Skeleton | Migrated |

## Architecture status

- Storefront chrome is centralized by `StoreShell`; the global `app/layout.tsx` owns metadata, direction and application providers.
- Account chrome is owned by `app/account/layout.tsx` and `AccountLayout`.
- Admin chrome is owned once by `app/admin/layout.tsx`; pages do not render another sidebar or topbar.
- Product presentation is centralized in `ProductCard` and `ProductGrid`.
- Admin resource lists share the typed `DataTable`/`AdminResourcePage` pattern.
- Domain types live in `app/types`, services in `app/services`, and mock fixtures in `app/data/mock` or the transitional `app/mock/admin.ts`.
- Home is composed from `HomeHero`, `GoldPriceStrip`, `ProductSection`, and `TrustSection`; its route contains no monolithic screen markup.
- No screen is deferred; every screen discovered in the two legacy prototypes has an explicit React route above.

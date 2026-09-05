# Arona Gold HTML-to-React migration map

The files `legacy/index.prototype.html` and root `admin.html` are read-only design/behavior references. Runtime code lives only in `react-app`.

## Storefront prototype map

| Prototype screen | React route |
|---|---|
| Home | `/` → `app/page.tsx` |
| Product listing/category | `/products` → `app/products/page.tsx` |
| Product detail | `/products/[id]` → `app/products/[id]/page.tsx` |
| Search | `/search` |
| Cart | `/cart` |
| Wishlist | `/wishlist` |
| Login | `/login` |
| OTP | `/otp` |
| Checkout | `/checkout` |
| Payment success/failure | `/payment/success`, `/payment/failed` |
| Customer dashboard | `/account` |
| Profile | `/profile` |
| Addresses | `/addresses` |
| Orders/detail | `/orders`, `/orders/[id]` |
| Notifications | `/notifications` |
| FAQ/About/Terms/Contact | `/faq`, `/about`, `/terms`, `/contact` |

Repeated prototype patterns—desktop/mobile navigation, footer, product cards, prices, badges, modal, toast, empty state, cart rows, summaries and account navigation—map to `components/layout`, `components/ui`, `components/commerce`, and `components/account`.

## Admin prototype map

| Prototype area | React route |
|---|---|
| Dashboard | `/admin` |
| Products and forms | `/admin/products`, `/admin/products/new`, `/admin/products/[id]` |
| Categories and forms | `/admin/categories`, `/admin/categories/new`, `/admin/categories/[id]` |
| Inventory/history | `/admin/inventory`, `/admin/inventory/history` |
| Orders/detail | `/admin/orders`, `/admin/orders/[id]` |
| Payments/detail | `/admin/payments`, `/admin/payments/[id]` |
| Users/detail | `/admin/users`, `/admin/users/[id]` |
| Discounts | `/admin/discounts`, `/admin/discounts/new`, `/admin/discounts/[id]` |
| Banners | `/admin/banners`, `/admin/banners/new`, `/admin/banners/[id]` |
| Announcements/content | `/admin/announcements`, `/admin/content`, `/admin/content/[id]` |
| Roles/audit/settings | `/admin/roles`, `/admin/audit`, `/admin/settings` |
| UX states | `/admin/ux-states` |

The shared admin sidebar/topbar is rendered once by `app/admin/layout.tsx`. List routes share `AdminResourcePage` and typed `DataTable`. Mock records live in `app/mock/admin.ts`, never in the UI components.

## Interactions inventoried

The prototypes implement client-side navigation, filters/sorting/search, wishlist/cart quantity, coupons, modal/drawer/toast, OTP simulation, address/profile management, checkout steps, payment states, FAQ expansion, product gallery/tabs, admin CRUD simulations, confirmations and responsive mobile navigation. React routes preserve the available migrated interactions; production business behavior is accessed through typed services and APIs rather than HTML scripts.

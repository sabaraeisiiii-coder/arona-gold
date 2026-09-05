# Arona Gold component system

## Audit summary

The project already had Button, Input, Badge, Card, Alert, Modal, Skeleton, Table, ProductCard, CartItem, OrderSummary, StoreShell, AdminShell, AdminSidebar, FilterBar and a static DataTable. Repeated patterns were page headings, empty cards, manual field labels/errors, money formatting, account navigation, status badges, admin table markup, store header/footer, and loading text. Ten admin edit/create routes still share placeholder form markup and remain a documented follow-up because turning those placeholders into real domain forms would exceed this structural sprint.

## Folders

- `components/ui`: domain-free primitives and feedback states.
- `components/layout`: storefront structure and page composition.
- `components/commerce`: product, price, cart and order presentation.
- `components/account`: account navigation and record cards.
- `components/checkout`: checkout-only composition.
- `components/admin`: admin shell, tables, filters, page headings and dialogs.
- `constants/status.ts`: centralized labels and semantic badge variants.
- `lib/format.ts`: shared Persian number, money, date and datetime formatting.

## API and naming

Base components consistently use `variant`, `size`, `loading`, `disabled`, `error`, `onClick`, and `className`. Buttons default to `type="button"`. Inputs own label, hint, error and ARIA association. Badge variants are `neutral`, `info`, `success`, `warning`, `error`, and `gold`. Components consume semantic CSS tokens and support both storefront and `[data-theme="admin"]`.

```tsx
<Button variant="primary" size="md" loading={saving}>ذخیره</Button>
<Input label="نام" name="firstName" error={errors.firstName} />
<EmptyState title="موردی وجود ندارد" action={<Button>افزودن</Button>} />
```

Create a shared component when a stable visual/interaction pattern has multiple consumers or needs one accessibility implementation. Keep it local when it represents one route's unique composition or when its API would merely mirror arbitrary markup. Business calculations, payment verification and server authorization never belong in UI components.

Modal owns Escape, optional backdrop dismissal, focus entry/restoration and accessible title/description. DataTable stays intentionally small; remote sorting/filtering belongs to later feature sprints. Storybook was not added because it would add substantial tooling for the current project size.

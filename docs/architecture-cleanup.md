# Final architecture cleanup

## Layout ownership

- `app/layout.tsx` owns storefront navigation through `ApplicationChrome`.
- `app/account/layout.tsx` owns account navigation through `AccountLayout` and `AccountSidebar`.
- `app/admin/layout.tsx` owns admin navigation through `AdminLayout`, `AdminSidebar`, and `AdminTopbar`.

## Transitional compatibility surfaces

- `components/StoreShell.tsx` remains because existing route screens still import it. It renders no navigation or container; those are owned by the root layout. Removing all imports is a later mechanical cleanup and is not required for runtime correctness.
- `components/AdminShell.tsx` remains because legacy-migrated admin screen components still import it. It renders no sidebar or topbar; admin chrome is owned exclusively by `app/admin/layout.tsx`.
- `components/ProductGrid.tsx` forwards to the single implementation in `components/commerce/ProductGrid.tsx` while existing routes migrate their import paths.
- `data/catalog.ts` forwards to canonical fixtures in `data/mock/products.ts` and the canonical `Product` type in `types/product.ts`.
- `useAppStore` remains as a compatibility facade. State ownership is split between `AuthStore`, `CommerceStore`, and `UiStore`; new focused consumers can use their dedicated hooks.

No compatibility surface imports or renders legacy HTML.

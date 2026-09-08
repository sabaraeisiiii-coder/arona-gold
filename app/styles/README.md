# Arona Gold styles

## Ownership and import order

- `globals.css`: imports, box sizing, document background, global typography inheritance, anchors, the shared brand wordmark, reduced-motion scrolling. Page layouts no longer live here.
- `tokens.css`: existing brand, semantic colors, spacing and sizing tokens. Unchanged in this phase.
- `typography.css`: Persian type scale and text utilities. Unchanged.
- `components.css`: shared UI and commerce primitives: fields, buttons, cards, badges, product media, modal, table, skeleton, toast, pagination and focus states.
- `utilities.css`: shared containers and product-grid breakpoints. Unchanged.
- `storefront.css`: Home, catalog forms, product detail, cart, checkout, auth, account, addresses, FAQ and store page composition. Loaded after primitive/grid styles through globals.
- `store-chrome.css`: Header/MobileHeader/Footer foundation and responsive navigation; imported by Header. Footer selectors are scoped to `.store-footer`, not every HTML footer.
- `header-search.css`: HeaderSearch form, dropdown, results, viewport sizing and responsive placement.
- `admin/admin.css`: admin foundation plus `.admin-layout` refinements, sidebar/drawer, topbar, forms, resource tables, dashboard, tabs and responsive rules; imported by AdminLayout.
- `extra.css`: remaining legacy compatibility rules, imported after globals. Avoid adding new page rules here. Cart composition uses `.site-shell .cart-item` to override its older four-column rule deliberately.
- `functional.css`: small pre-existing admin-resource compatibility rules. Further migration can be incremental rather than changing every legacy consumer in this phase.

## Themes and breakpoints

Preserve the current dark store and `data-theme="admin-dark"` admin appearance. No tokens or theme were redesigned.
Primary grid breakpoints are 480, 768, 1024 and 1280px; chrome also has existing 560/1100px rules.
Final browser QA covers 360, 480, 768, 1024 and 1440px, plus open search and mobile admin drawer.

Tables scroll inside focusable, labelled regions. Account navigation and gallery thumbnails may scroll inside their own containers. Do not hide all document overflow to mask layout defects.

## Maintenance

Reuse existing primitives before adding another variant. Scope feature layout near its stylesheet owner. Shared controls have touch sizing, visible focus and accessible descriptions.
Do not move sensitive pricing, shipping eligibility or payment decisions into CSS/UI. The cart preview service only preserves the existing local demo arithmetic.

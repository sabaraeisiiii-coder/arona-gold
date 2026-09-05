# Arona Gold Design System

This directory is the frozen foundation for storefront and admin UI.

## Import order

1. `tokens.css` — brand, neutral, semantic, status, spacing, type, radius, shadow, layout, and motion tokens.
2. `typography.css` — global Persian type scale and text utilities.
3. `components.css` — stable `ds-*` primitives for buttons, fields, cards, badges, modals, tables, alerts, skeletons, and product cards.
4. `utilities.css` — containers and responsive grids using the project breakpoints.

## Themes

- Storefront uses the default luxury dark token set.
- Admin applies `data-theme="admin"` at `AdminShell` and receives a functional light token set.

## Breakpoints

- Mobile: below 480px
- Mobile large: 480–767px
- Tablet: 768–1023px
- Desktop: 1024–1279px
- Desktop large: 1280px and above

## Rules

- Use gold for primary actions, price, active navigation, important links, and highlights—not for every border or label.
- Consume semantic tokens instead of adding raw colors to components.
- Prefer the React primitives under `app/components/ui`, `commerce`, and `admin`.
- Add a new token only when an existing semantic token cannot express the design intent.
- Changes to frozen primitives require checking storefront dark mode, admin light mode, RTL, keyboard focus, and all five responsive ranges.

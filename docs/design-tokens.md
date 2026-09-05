# Arona Gold design tokens

CSS custom properties in `app/styles/tokens.css` are the single source of truth. `globals.css` imports tokens first, followed by typography, component styles, and utilities. Tailwind CSS 4 receives semantic color mappings through `@theme inline`; it does not own a second palette.

The final stylesheet contains one Storefront `:root`, one `[data-theme="admin"]` override block, and one `@theme inline` mapping. A token is defined at most once per scope; Admin repeats only values that genuinely differ from Storefront. Derived card, popover, table-header, and sidebar values are inherited rather than redefined.

## Raw tokens

- Brand: `--gold-50` through `--gold-900`, using the champagne/luxury Arona Gold palette.
- Neutral: `--neutral-0` through `--neutral-950`.
- Feedback values: success, warning, error, and info each provide base, background, and foreground values.

Raw palette values are defined once. Components should consume semantic or component tokens instead of raw colors.

## Semantic tokens

Storefront defaults are dark-luxury values: `--background`, `--foreground`, `--surface*`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border*`, `--input-*`, `--link`, and `--focus-ring`.

Order/payment states use `--status-{state}-{bg|text}`. Inventory uses `--stock-{in|low|out}-{bg|text}`. Gold is never used as a success, warning, error, or info substitute.

## Component tokens

- Button: `--button-radius`, `--button-height-*`
- Input: `--input-radius`, `--input-height`, `--input-focus-ring`
- Card: `--card-radius`, `--card-border`, `--card-shadow`
- Modal: `--modal-radius`, `--modal-shadow`, `--modal-overlay`
- Table: `--table-border`, `--table-header-bg`, `--table-row-hover`

The shared Button, form controls, Card, Modal, Table, Badge, StatusBadge, toast, and pagination styles consume these tokens.

## Storefront theme

`:root` is the storefront theme. It uses `--neutral-950` as the page background, warm near-white foreground, dark layered surfaces, and champagne gold only for brand/action emphasis.

## Admin theme

`[data-theme="admin"]` overrides semantic values with a light functional theme. `AdminLayout` already places this attribute on the root admin shell. Sidebar tokens preserve the existing dark sidebar within the light content theme.

## Typography, spacing, and layout

Vazirmatn remains the sans-serif family. Type sizes use `--font-size-*`, weights use `--font-weight-*`, and line heights use `--line-height-*`. Spacing follows the four-pixel `--space-*` scale. Container, gutter, header, sidebar, control, icon, z-index, shadow, radius, and motion scales are centralized in `tokens.css`.

## Naming convention

Use `--{category}-{role}-{state}` where applicable. Raw palette names describe a color scale; semantic names describe intent; component names describe a reusable component decision.

## Compatibility aliases

`--bg`, `--panel`, `--panel2`, `--gold`, `--gold2`, `--text`, `--line`, `--danger`, `--radius`, `--input-bg`, `--ring`, legacy `--text-*`, weight, and leading names are transitional aliases. They keep older styles visually stable and should be removed only after every legacy selector has migrated to canonical names.

## Adding a token

1. Reuse an existing semantic token whenever the intent already exists.
2. Add a raw value only when the palette genuinely lacks it.
3. Add or override a semantic value for theme-level meaning.
4. Add a component token only when multiple states or implementations share that decision.
5. Document the new intent and migrate every consumer.

## Forbidden hardcoded patterns

Runtime component styles must not introduce brand hex/rgb values, arbitrary feedback colors, repeated radius/shadow/z-index values, or ad-hoc transition durations. Inline values remain acceptable for data-driven product artwork dimensions/values and chart percentages; decorative illustration gradients may keep local colors when they are not semantic UI colors.

## Migration status

Raw, semantic, feedback, status, typography, spacing, radius, shadow, motion, layout, control, icon, z-index, chart, sidebar, and component token layers are present. Storefront and admin themes are connected. Shared UI controls and status badges are token-driven. Remaining hardcoded decorative artwork values are intentionally outside the semantic UI system.

# Admin UI polish

## Follow-up: financial record layout

Orders and Payments now use `AdminFinancialList.tsx`, a semantic list of CSS Grid
records, instead of DataTable. The main row contains identity/date, customer/mobile,
amount, status, shipping/gateway and the original detail action. Address, payment
reference, transaction and verification metadata occupy a separate secondary area.
All existing fields remain visible. Other resources retain DataTable.

At 1440px the main record uses six groups across; at 768px it uses three columns;
at 390px it stacks into one column. Identifiers, order numbers, references, mobile,
amounts, dates and badges use nowrap and normal word wrapping. The browser script
now rejects financial tables and broken/overflowing nowrap fields. The existing
record-preservation tests target list items instead of table rows.

Follow-up files: `AdminFinancialList.tsx`, `AdminResourcePage.tsx`, `admin.css`,
`admin-workspace.test.tsx`, `admin-visual-check.mjs`, and this document.
No business logic, API, state, route, or record shape changed.

Follow-up validation: typecheck, lint and build passed. The default `npm test`
run hit six existing 5000ms timeouts, including Storefront tests unrelated to this
change; a second default run repeated them. `npm test -- --maxWorkers=2` passed
all 63 tests across 19 files without changing timeouts, assertions or coverage.
Logs are kept separately as `test.log`, `test-final.log` and
`test-limited-workers.log` in `outputs/admin-polish`.

Visual scope: dashboard, Orders and Payments lists/details, Products, Users and
Inventory. Existing routes, fixtures, filters, state, mutations, detail tabs,
disabled actions and backend services are unchanged.

## Changes

- `app/components/admin/DataTable.tsx`: retain the existing component API, empty
  and loading states; add semantic roles and mobile field labels. Desktop stays
  tabular; below the existing 600px breakpoint rows stack with every cell intact.
- `app/components/admin/AdminResourcePage.tsx`: group existing Orders/Payments
  fields into related columns. No missing values are inferred or removed. Status
  stays beside the identifier; customer, money, references and dates are grouped.
- `app/components/admin/AdminRecordValue.tsx`: shared presentation for primary
  values, metadata, amounts and statuses in lists, details and dashboard. Preserve
  the existing price formatter; use bidi isolation for identifiers and numbers.
- `app/components/admin/StatusBadge.tsx`: extend the existing badge to render
  record status strings as well as canonical statuses. Semantic colors are a
  presentation mapping; there are no status transitions or data changes.
- `app/components/admin/AdminRecordScreen.tsx`: use the same value presentation
  inside the original detail sections and tabs.
- `app/components/admin/AdminDashboard.tsx`: apply the shared value/badge styling
  to recent orders while preserving all links and record selection.
- `app/admin/admin.css`: admin-scoped spacing, hierarchy, badge dimensions,
  detail separators, mobile row labels, action alignment and numeric readability.
  Wide desktop/tablet tables scroll inside their focusable wrapper. Existing
  breakpoints, palette, fonts and tokens are unchanged.
- `tests/components/admin-workspace.test.tsx`: two regression cases ensure every
  populated Orders/Payments field and each original detail link stays in its row.
- `scripts/admin-visual-check.mjs`: browser checks and screenshots for eight routes
  at 390, 768 and 1440px, including all detail tabs and horizontal table scrolling.

## Browser verification

Run the app and a dedicated Chrome session with remote debugging on port 9224.
Use a temporary browser profile outside this repository. The script defaults to
`http://localhost:3001`; set `QA_ORIGIN` to select another origin.

```powershell
node scripts/admin-visual-check.mjs
```

Reports and screenshots: `outputs/admin-polish/`. The 24 route/viewport checks
cover `/admin`, Orders list and `ZB-1403-1004`, Payments list and `PAY-7842`,
Products, Users and Inventory. The checks reject page overflow, clipped value
elements, mobile table overflow, console errors and uncaught JavaScript errors.
Wide tablet tables were also inspected at their action end.

The Orders fixture has no separate payment-status field. None was invented.
Missing gateway/timestamp values retain the original missing-data label. No
timeline, payment operation or other absent feature was added.

Pre-existing changes to `vite.config.ts`, `docs/RUNTIME_DIAGNOSIS.md` and
`scripts/runtime-smoke.mjs` belong to the prior runtime task and were preserved.

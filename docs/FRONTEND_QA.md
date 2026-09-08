# Frontend QA

Run from `react-app`:

```text
npm run lint
npm run typecheck
npm test
npm run build
```

The project retains its existing Vinext/Vite build and Next App Router routes.

## Browser runner

`scripts/frontend-browser-check.mjs` uses Node's built-in WebSocket and Chrome DevTools Protocol; no new dependency is required.

1. Run `npm run dev`.
2. Start a separate headless Chrome profile **outside the project** (for example in the OS temporary directory) with `--remote-debugging-port=9224`. Do not reuse a personal browsing profile. Putting Chrome's profile in the Vite project causes watcher/file-lock conflicts on Windows.
3. Run `node scripts/frontend-browser-check.mjs`; `QA_ORIGIN` can override `http://localhost:3000`.
4. Results and representative screenshots are written to ignored `outputs/frontend-qa/`.

The runner visits 41 explicit routes at 360, 480, 768, 1024 and 1440px, checks document overflow, records runtime exceptions, and exercises open/close search and the mobile admin drawer.
It waits for route rendering and React-bound interactive controls; a failed navigation or render timeout is a failure, not a successful empty page.
Admin table and account navigation scrolling are intentional and contained.

Auth `getMe` and address list responses are intercepted with local fixtures. These tests validate frontend rendering, not live authentication, SMS delivery, database access, payment processing or API authorization.
The address fixture is empty, so browser Checkout coverage includes its disabled empty-address state. Vitest exercises the complete local order flow and populated authenticated API addresses.

## Regression coverage

- Header Search: focus, live results, SKU matching, keyboard Escape/ArrowDown, outside dismissal and full search form action.
- Navigation: store/footer destinations, mobile navigation dismissal, cart and wishlist counters.
- Catalog/search: real local service filtering, Persian SKU, empty guidance and filter reset.
- Cart/Checkout: actual quantity buttons, removal, coupon validation, corrupt storage, stock validation, required address/terms, chosen shipping and address, one local order, cleared cart/coupon, API address adaptation.
- Login/OTP: invalid mobile, Persian digits, destination preservation, OTP success and recoverable rejection.
- Addresses: API list synchronization, failed mutations, load retry and empty state.
- Admin: all resource lists, search, create draft, view/edit validation, deletion confirmation, tabs, unknown record, sidebar focus and Escape.
- Shared Modal: focus containment, stable focus across rerenders, body scroll restoration and trigger restoration.

## Known runtime limits

The provided product image directories lack their referenced main JPGs; direct requests return 404. Existing branded fallbacks remain. Browser QA does not certify missing assets as present.
Mock commerce/admin data and local order/payment success remain transitional. Production quotation, shipping eligibility and payment verification must come from backend contracts.

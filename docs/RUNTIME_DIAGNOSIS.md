# Runtime diagnosis — 2026-09-08

## Confirmed production failure

With the original configuration, `vinext build` and `vinext start` succeeded and
all five requested routes returned complete HTTP 200 documents. A real browser
then failed when clicking Home's Products link. The console repeatedly reported
`[vinext] RSC prefetch setup error: TypeError: ee is not a function` and clicking
the link threw another `TypeError` inside `React.startTransition`.

The failing callers are in `vinext/dist/shims/link.js`: the prefetch loader's
`getPrefetchInterceptionContext` call and the click handler's
`navigateClientSide` call. In the emitted client bundle, their dynamic import
target was the browser `index-*.js` entry, whose exports did not expose those
names. Another affected namespace was `server/app-rsc-cache-busting.js`.
The code is syntactically valid, so compilation alone does not detect this.

The installed toolchain is Vite 8.0.13, Rolldown 1.0.1, Vinext 1.0.0-beta.3.
Disabling only Rolldown's `experimental.chunkOptimization.avoidRedundantChunkLoads`
for the client build retains the correct dynamic module namespaces. The identical
browser test then passes. Minification, tree shaking, common-chunk merging,
prefetch, SSR, Cloudflare bindings and all application code are preserved.
No packages were changed. The setting is applied after Vinext's environment
configuration so that it affects the final client build options.

## Original dev reference: not conclusively diagnosed

The old running development process logged the reported reference
`v4u3vmcnhq20r135tm7idrng` through Cloudflare's
`workers/runner-worker/index.js:107` (`runInRunnerObject`) and
`@vitejs/plugin-rsc/dist/ssr.js:28` (`Object.load`). This identifies the failing
module-loader layer, not its underlying exception. Clean restarts, repeated
HTTP requests and over 150 temporary HMR updates did not reproduce that exact
reference. All temporary source probes were restored.

Do not describe the production fix as proof of the cause of the old dev error.
There is no evidence justifying changes to Home, browser-storage access, auth,
environment validation or database initialization. Switching local development
to Node was tested and reverted because it timed out. The original Cloudflare
development runtime remains in place.

## Verification

`scripts/runtime-smoke.mjs` makes three real HTTP requests to each of `/`,
`/products`, `/login`, `/account`, `/admin`, verifies complete SSR documents,
then visits them in Chrome and checks headings, hydration, error overlays,
uncaught exceptions and console errors. It also opens Header Search and clicks
Home's Products link. No API fixtures are intercepted. A guest Account visit
must reach `/login?next=%2Faccount`; the auth API's guest 401 is expected.

Run Chrome with a dedicated temporary profile and remote debugging port 9224.
Keep its profile outside the repository so Vite and ESLint cannot watch/index
browser databases. With the app running on port 3000:

```powershell
node scripts/runtime-smoke.mjs development
# Stop dev, then build and start production before the next invocation.
npm run build
npm run start
# In a second terminal:
node scripts/runtime-smoke.mjs production
```

`QA_ORIGIN` can override the default `http://localhost:3000`.
Reports are written to `outputs/frontend-qa/development-smoke.json` and
`production-smoke.json`. Command exit codes are in `runtime-command-results.json`;
the adjacent `runtime-*.log` files contain the command/server output.

Both modes passed the five-route browser/HTTP smoke after the compatibility
change. This is bounded verification, not a guarantee against a future
long-running workerd failure. Missing product image assets still return 404
and use the existing fallback. External OTP/database/payment integrations are
outside this runtime smoke. The Admin screen currently renders for a guest;
this check does not certify authorization.

Remove the compatibility setting only after the same production smoke passes
with the default compiler options. To finish diagnosis of the original dev
error, capture the first underlying workerd exception before restarting the
failing process; the opaque reference alone cannot establish its cause.

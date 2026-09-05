# Arona Gold technical foundation

## Architecture

The application remains a Next.js App Router project running through Vinext/Vite. Backend capabilities are added incrementally under `app/api/v1`; UI routes and legacy prototypes are not part of this foundation.

- `app/config`: validated, centralized environment configuration.
- `app/constants`: shared API, environment, header, and pagination constants.
- `app/db`: Drizzle schema, Neon HTTP client, and database health probe.
- `app/lib`: API wrappers, errors, response helpers, request IDs, and pagination.
- `app/logging`: structured JSON logger and recursive sensitive-data redaction.
- `app/security`: cookie defaults, security-header policy, and rate-limit contract.
- `app/validation`: Zod-backed request validation for body, query, and route params.
- `app/services`: frontend-to-API boundary; domain services arrive in later sprints.
- `app/types` and `app/schemas`: shared transport types and domain schemas.

## Environment setup

Copy `.env.example` to `.env.local` and supply local values. Never commit real secrets. `APP_ENV` is one of `development`, `pre-production`, or `production`. Startup-facing server modules call the central config and fail with the names of invalid variables, never their values.

Required now: `APP_URL`, `DATABASE_URL`, `SESSION_SECRET`. `NODE_ENV`, `APP_ENV`, and `LOG_LEVEL` have safe defaults. SMS, payment, and gold-price keys are optional placeholders until their sprints.

## Database and migrations

PostgreSQL is accessed with Drizzle ORM and the Neon serverless HTTP driver. This is type-safe, lightweight, and compatible with the Cloudflare/Vinext runtime where raw TCP database connections are unavailable. The production PostgreSQL provider must expose a Neon-compatible HTTP endpoint.

The initial migration creates only `system_metadata`, proving the migration pipeline without introducing business tables.

```text
npm run db:check
npm run db:generate
npm run db:migrate
```

`DATABASE_URL` must be available when running database commands. Business schemas are intentionally deferred.

## API convention

All endpoints use `/api/v1`. Success responses contain `{ success: true, data, meta }`; failures contain `{ success: false, error: { code, message, details? } }`. `withApiHandler` supplies error conversion, request-scoped logging, and `x-request-id`. Unknown errors return a generic message and never expose stack traces.

Health endpoints:

- `GET /api/v1/health`
- `GET /api/v1/health/database`

The database endpoint exposes only status and `connected`; it never returns connection information.

## Logging and security

Application logs are JSON with an ISO timestamp, level, module, message, and optional request/user/order/payment IDs. Sensitive keys—including passwords, OTPs, tokens, authorization, cookies, API keys, secrets, and payment credentials—are recursively redacted.

Security headers are set globally. A CSP template exists but is not enforced until current inline frontend requirements are removed. Session cookie defaults are HttpOnly, SameSite=Lax, Path=/, and Secure outside development. Rate limiting is adapter-ready but deliberately has no unsafe in-memory production fallback.

## Money and time

All backend timestamps are UTC and all API timestamps use ISO 8601. Persian/Jalali formatting belongs only in the frontend.

All monetary values use integers in **toman** in the database and API. Floating-point values are forbidden for monetary storage and arithmetic. Future percentage calculations must use integer/rational arithmetic with an explicitly tested rounding rule.

## Verification

```text
npm run lint
npm run typecheck
npm test
npm run build
```

Vitest currently covers API envelopes, application errors, environment validation, and pagination. Domain tests are added with their respective sprints.

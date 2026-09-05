# Sprint 1 — Authentication and user account

Authentication uses a six-digit cryptographically generated OTP and an HttpOnly session cookie. OTPs and session tokens are stored only as HMAC-SHA-256 hashes. OTPs expire, have a bounded attempt count, and are consumed with a conditional atomic update so concurrent verification cannot reuse a code.

`users`, `otp_requests`, `sessions`, and `addresses` are introduced by migration `0001_auth_users_addresses.sql`. A partial unique index guarantees at most one default address per user. The first address becomes default automatically. Deleting a default address promotes the oldest remaining address; setting a default clears the previous default in one database transaction batch.

Authentication endpoints use the shared API wrapper and never log OTPs, tokens, cookies, or secrets. Production refuses to send OTPs until a real SMS provider and distributed rate limiter are configured. Development uses an in-process limiter; `AUTH_DEBUG_OTP=true` explicitly exposes a debug OTP only in development and is off by default.

Protected frontend pages call `/auth/me` through the shared auth service and redirect unauthenticated users to `/login` with a same-origin path-only return target.

Admin block/activate endpoints are intentionally deferred because RBAC is not available yet. Blocking is already enforced during session creation and authenticated requests when a user status has been changed through a trusted database/admin process.

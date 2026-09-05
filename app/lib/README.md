# Application foundation

- `api-handler.ts`: common route-handler boundary and error conversion.
- `api-response.ts`: versioned success/error response helpers.
- `errors.ts`: typed application errors and HTTP status mapping.
- `request-id.ts`: validates or creates an ID for every API request.
- `../config/env.ts`: separates public configuration from server-only secrets and validates values on use.

Server-only configuration must never use the `NEXT_PUBLIC_` prefix.

# Services

Service modules are the boundary between pages/components and `/api/v1` endpoints. UI code should not calculate or persist sensitive financial values here.

`api-client.ts` supplies the shared response parsing and error behavior. Domain-specific services will be added incrementally in their implementation phases.

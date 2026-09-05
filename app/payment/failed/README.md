# پرداخت ناموفق

## Purpose

پرداخت تکمیل نشد؛ امکان تلاش مجدد وجود دارد.

## Route

`/payment/failed`

## Area

Storefront / Customer

## Page responsibilities

- Render this route independently from the former monolithic HTML prototype.
- Use shared layout and design-system components where appropriate.
- Keep page-specific behavior inside this directory or a colocated feature module.
- Load data through the service boundary rather than directly from UI markup.

## State and interactions

Page pattern: **status**. Loading, empty, validation, success, and error states should be preserved when the real service is connected.

## Data/API requirements

Currently uses representative local data. Replace it through the matching catalog, account, order, payment, content, or admin service adapter.

## Access

Public or customer route. Account-specific data requires an authenticated session.

## Testing

Verify RTL layout, keyboard access, responsive behavior, loading/error handling, and the primary action for this page.

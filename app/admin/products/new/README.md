# افزودن محصول

## Purpose

ثبت مشخصات، قیمت، تصاویر و موجودی محصول.

## Route

`/admin/products/new`

## Area

Admin

## Page responsibilities

- Render this route independently from the former monolithic HTML prototype.
- Use shared layout and design-system components where appropriate.
- Keep page-specific behavior inside this directory or a colocated feature module.
- Load data through the service boundary rather than directly from UI markup.

## State and interactions

Page pattern: **form**. Loading, empty, validation, success, and error states should be preserved when the real service is connected.

## Data/API requirements

Currently uses representative local data. Replace it through the matching catalog, account, order, payment, content, or admin service adapter.

## Access

Protected admin route. Both the UI and backend must enforce role permissions.

## Testing

Verify RTL layout, keyboard access, responsive behavior, loading/error handling, and the primary action for this page.

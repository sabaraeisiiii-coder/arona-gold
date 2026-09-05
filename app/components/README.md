# Component Library

The component library is organized by responsibility:

- `ui/`: Button, Input/Textarea, Badge, Card, Modal, Alert, Skeleton, and Table primitives.
- `commerce/`: ProductCard, Price, CartItem, and OrderSummary.
- `admin/`: AdminSidebar, DataTable, FilterBar, and StatusBadge.

Page routes should compose these components and keep only page-specific content and orchestration in their own folders. All visual variants must use the design tokens and `ds-*` classes from `app/styles`.

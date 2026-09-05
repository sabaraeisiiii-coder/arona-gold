// Compatibility wrapper while individual admin pages are incrementally simplified.
// The actual shared chrome is rendered once by app/admin/layout.tsx.
export function AdminShell({ children }: { children: React.ReactNode; title: string }) { return <>{children}</>; }

import { useId, type SelectHTMLAttributes } from 'react';
export function Select({ label, error, hint, children, id, className = '', 'aria-describedby': describedBy, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; hint?: string }) {
  const generated = useId(), fieldId = id ?? generated, descriptionId = `${fieldId}-description`;
  return <div className="ds-field"><label className="ds-label" htmlFor={fieldId}>{label}</label><select {...props} id={fieldId} className={`ds-input ${className}`.trim()} aria-invalid={Boolean(error) || props['aria-invalid']} aria-describedby={[describedBy, (error || hint) && descriptionId].filter(Boolean).join(' ') || undefined}>{children}</select>{(error || hint) && <small id={descriptionId} className={error ? 'ds-field-error' : 'ds-field-hint'}>{error ?? hint}</small>}</div>;
}

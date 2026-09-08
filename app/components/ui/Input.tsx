import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';
type FieldProps = { label: string; error?: string; hint?: string };
export function Input({ label, error, hint, id, className = '', 'aria-describedby': describedBy, ...props }: InputHTMLAttributes<HTMLInputElement> & FieldProps) {
  const generated = useId(), fieldId = id ?? generated, descriptionId = `${fieldId}-description`;
  return <div className="ds-field"><label className="ds-label" htmlFor={fieldId}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><input {...props} id={fieldId} className={`ds-input ${className}`.trim()} aria-invalid={Boolean(error) || props['aria-invalid']} aria-describedby={[describedBy, (error || hint) && descriptionId].filter(Boolean).join(' ') || undefined} />{(error || hint) && <small id={descriptionId} className={error ? 'ds-field-error' : 'ds-field-hint'}>{error ?? hint}</small>}</div>;
}
export function Textarea({ label, error, hint, id, className = '', 'aria-describedby': describedBy, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  const generated = useId(), fieldId = id ?? generated, descriptionId = `${fieldId}-description`;
  return <div className="ds-field"><label className="ds-label" htmlFor={fieldId}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><textarea {...props} id={fieldId} className={`ds-input ${className}`.trim()} aria-invalid={Boolean(error) || props['aria-invalid']} aria-describedby={[describedBy, (error || hint) && descriptionId].filter(Boolean).join(' ') || undefined} />{(error || hint) && <small id={descriptionId} className={error ? 'ds-field-error' : 'ds-field-hint'}>{error ?? hint}</small>}</div>;
}

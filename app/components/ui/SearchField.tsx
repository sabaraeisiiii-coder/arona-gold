import type { InputHTMLAttributes, Ref } from 'react';
import { useId } from 'react';
export function SearchField({ label = 'جستجوی محصول', inputRef, id, className = '', ...props }: InputHTMLAttributes<HTMLInputElement> & { label?: string; inputRef?: Ref<HTMLInputElement> }) {
  const generated = useId();
  const fieldId = id ?? generated;
  return <><label className="sr-only" htmlFor={fieldId}>{label}</label><input {...props} id={fieldId} ref={inputRef} type="search" className={`ds-input ${className}`} /></>;
}

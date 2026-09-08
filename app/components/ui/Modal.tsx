'use client';
import { useEffect, useEffectEvent, useId, useRef, type ReactNode } from 'react';
import { Button } from './Button';

export function Modal({ open, title, description, children, footer, onClose, closeOnBackdrop = true }: { open: boolean; title: string; description?: string; children: ReactNode; footer?: ReactNode; onClose: () => void; closeOnBackdrop?: boolean }) {
  const titleId = useId(), descriptionId = useId(), dialog = useRef<HTMLElement>(null);
  const close = useEffectEvent(onClose);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.current?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key !== 'Tab') return;
      const items = Array.from(dialog.current?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled):not([type="hidden"]), select:not(:disabled), textarea:not(:disabled), [tabindex="0"]') ?? []).filter(item => !item.closest('[hidden], [inert]'));
      const first = items[0], last = items.at(-1);
      if (!first || !last) { event.preventDefault(); dialog.current?.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || !dialog.current?.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = overflow; previous?.focus(); };
  }, [open]);
  if (!open) return null;
  return <div className="ds-modal-backdrop" onMouseDown={() => closeOnBackdrop && onClose()}><section ref={dialog} tabIndex={-1} className="ds-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined} onMouseDown={event => event.stopPropagation()}><header className="modal-head"><div><h2 id={titleId}>{title}</h2>{description && <p id={descriptionId}>{description}</p>}</div><Button variant="ghost" size="sm" aria-label="بستن" onClick={onClose}>×</Button></header><div className="ds-modal-content">{children}</div>{footer && <footer className="ds-modal-footer">{footer}</footer>}</section></div>;
}

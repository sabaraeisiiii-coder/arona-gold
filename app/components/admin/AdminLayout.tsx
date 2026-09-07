"use client";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminDrafts } from "./AdminDrafts";
import { Modal } from "../ui/Modal";
import "../../admin/admin.css";
export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const resize = () => { if (media.matches) close(); };
    media.addEventListener('change', resize);
    return () => media.removeEventListener('change', resize);
  }, [close]);
  useEffect(() => {
    if (!open) return;
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const items = root.current?.querySelectorAll<HTMLElement>('[role="dialog"] a[href], [role="dialog"] button:not(:disabled)');
      if (!items?.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement?.getAttribute('role') === 'dialog')) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => document.removeEventListener('keydown', trap);
  }, [open]);
  return (
    <AdminDrafts><div className="admin-shell admin-layout" data-theme="admin-dark" ref={root} dir="rtl">
      <div className="admin-desktop-sidebar" inert={open}><AdminSidebar /></div>
      <div className="admin-main" inert={open}>
        <AdminTopbar onOpenMenu={() => setOpen(true)} />
        <main className="admin-content">{children}</main>
      </div>
      <Modal open={open} title="پنل مدیریت" onClose={close}>
        <AdminSidebar onNavigate={close} />
      </Modal>
    </div></AdminDrafts>
  );
}

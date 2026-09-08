"use client";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";
import { AdminDrafts } from "./AdminDrafts";
import { Modal } from "../ui/Modal";
import "../../admin/admin.css";
export function AdminLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)');
    const resize = () => { if (media.matches) close(); };
    media.addEventListener('change', resize);
    return () => media.removeEventListener('change', resize);
  }, [close]);
  return (
    <AdminDrafts><div className="admin-shell admin-layout" data-theme="admin-dark" dir="rtl">
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

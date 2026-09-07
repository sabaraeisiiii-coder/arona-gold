'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { mainNavigation } from '../../data/navigation';

export function MobileHeader() {
  const menu = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !menu.current?.contains(event.target)) menu.current?.removeAttribute('open');
    }
    function escape(event: KeyboardEvent) {
      if (event.key === 'Escape' && menu.current?.open) {
        menu.current.removeAttribute('open');
        menu.current.querySelector('summary')?.focus();
      }
    }
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('keydown', escape);
    };
  }, []);
  return <details className="store-mobile-menu" ref={menu}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) menu.current?.removeAttribute('open'); }}>
    <summary aria-label="منوی اصلی">☰</summary>
    <nav aria-label="ناوبری موبایل">
      {mainNavigation.map(item => <Link key={item.label} href={item.href}
        onClick={() => menu.current?.removeAttribute('open')}>{item.label}</Link>)}
    </nav>
  </details>;
}

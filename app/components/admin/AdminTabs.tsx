'use client';
import { useId, type ReactNode } from 'react';
export function AdminTabs({ tabs, active, onChange, children }: {
  tabs: string[]; active: string; onChange: (tab: string) => void; children: ReactNode;
}) {
  const id = useId();
  return <><div className="admin-tabs" role="tablist" aria-label="بخش‌های صفحه">
    {tabs.map((tab, index) => <button key={tab} type="button" role="tab" id={`${id}-tab-${index}`}
      aria-selected={active === tab} tabIndex={active === tab ? 0 : -1} aria-controls={`${id}-panel`}
      onClick={() => onChange(tab)} onKeyDown={event => {
        let next: number | undefined;
        if (event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowRight') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) {
          event.preventDefault(); onChange(tabs[next]);
          (event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
        }
      }}>{tab}</button>)}
  </div><div role="tabpanel" tabIndex={0} id={`${id}-panel`} aria-labelledby={`${id}-tab-${tabs.indexOf(active)}`}>{children}</div></>;
}

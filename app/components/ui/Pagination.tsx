import Link from 'next/link';
import { Button } from './Button';
type Props = { page: number; totalPages: number } & ({ onChange: (page: number) => void; hrefForPage?: never } | { hrefForPage: (page: number) => string; onChange?: never });
export function Pagination({ page, totalPages, onChange, hrefForPage }: Props) {
  const pages = Math.max(1, totalPages);
  function control(label: string, target: number, disabled: boolean) {
    return hrefForPage && !disabled
      ? <Link className="ds-button ds-button-ghost ds-button-sm" href={hrefForPage(target)}>{label}</Link>
      : <Button variant="ghost" size="sm" disabled={disabled} onClick={onChange ? () => onChange(target) : undefined}>{label}</Button>;
  }
  return <nav className="ds-pagination" aria-label="صفحه‌بندی">{control('قبلی', page - 1, page <= 1)}<span>صفحه {page.toLocaleString('fa-IR')} از {pages.toLocaleString('fa-IR')}</span>{control('بعدی', page + 1, page >= pages)}</nav>;
}

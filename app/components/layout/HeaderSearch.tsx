"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { filterProducts } from "../../services/product.service";
import { formatMoney, formatNumber } from "../../lib/format";
import { ProductMedia } from "../commerce/ProductMedia";
import "../../styles/header-search.css";

export function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const resultsId = useId();
  const results = filterProducts(query);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false);
    }
    function dismissEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", dismissOutside);
    document.addEventListener("keydown", dismissEscape);
    return () => {
      document.removeEventListener("pointerdown", dismissOutside);
      document.removeEventListener("keydown", dismissEscape);
    };
  }, [open]);

  return (
    <div className="header-search" data-open={open} ref={root} dir="rtl"
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}>
      <button type="button" className="header-search__trigger" ref={trigger}
        aria-label={open ? "بستن جستجو" : "جستجو"} aria-expanded={open}
        aria-controls={open ? resultsId : undefined} onClick={() => setOpen(value => !value)}>
        {open ? "×" : "⌕"}
      </button>
      {open && <div className="header-search__panel" role="search" aria-label="جستجوی محصولات">
        <input ref={input} type="search" className="ds-input header-search__input"
          value={query} onChange={event => setQuery(event.target.value)}
          aria-label="جستجوی محصول" aria-controls={resultsId} autoComplete="off"
          placeholder="نام محصول، کد یا دسته‌بندی…"
          onKeyDown={event => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              root.current?.querySelector<HTMLAnchorElement>(".header-search__result")?.focus();
            }
          }} />
        <div className="header-search__dropdown" id={resultsId}>
          <p className="header-search__summary" role="status">
            {!query.trim() ? "نام محصول، کد یا دسته‌بندی را وارد کنید" : results.length ? `${formatNumber(results.length)} محصول پیدا شد` : "محصولی پیدا نشد"}
          </p>
          {results.length > 0 && <ul className="header-search__results">
            {results.map(product => <li key={product.id}>
              <Link className="header-search__result" href={`/products/${product.slug}`}
                onClick={() => { setOpen(false); setQuery(""); }}>
                <ProductMedia product={product} className="header-search__thumbnail" sizes="56px" />
                <div className="header-search__details">
                  <strong>{product.name}</strong>
                  <small>{[product.category, product.weight].filter(Boolean).join(" · ")}</small>
                  <span className="header-search__price">{formatMoney(product.price)}</span>
                </div>
              </Link>
            </li>)}
          </ul>}
        </div>
      </div>}
    </div>
  );
}

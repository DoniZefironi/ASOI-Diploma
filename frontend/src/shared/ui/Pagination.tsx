'use client';

import { useState, useEffect } from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  total?: number;
  pageSize?: number;
}

export function Pagination({ page, totalPages, onPage, total, pageSize }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | '…')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('…');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('…');
    pages.push(totalPages);
  }

  const NavBtn = ({ label, target, active = false, disabled = false }: { label: string | number; target: number; active?: boolean; disabled?: boolean }) => (
    <button
      onClick={() => !disabled && onPage(target)}
      disabled={disabled}
      style={{
        minWidth: 32, height: 32, padding: '0 8px',
        fontSize: 13, fontWeight: active ? 700 : 400,
        borderRadius: 6, border: '1px solid',
        borderColor: active ? 'var(--color-accent-fg)' : 'var(--color-border-default)',
        background: active ? 'var(--color-accent-subtle)' : 'transparent',
        color: active ? 'var(--color-accent-fg)' : disabled ? 'var(--color-fg-subtle)' : 'var(--color-fg-default)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 100ms',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '16px 0' }}>
      {total !== undefined && pageSize !== undefined && (
        <span style={{ fontSize: 12, color: 'var(--color-fg-muted)', marginRight: 12 }}>
          {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} из {total}
        </span>
      )}
      <NavBtn label="←" target={page - 1} disabled={page === 1} />
      {pages.map((p, i) =>
        p === '…'
          ? <span key={`el-${i}`} style={{ padding: '0 4px', color: 'var(--color-fg-subtle)', fontSize: 13 }}>…</span>
          : <NavBtn key={p} label={p} target={p as number} active={p === page} />
      )}
      <NavBtn label="→" target={page + 1} disabled={page === totalPages} />
    </div>
  );
}

/** Client-side pagination hook. Resets to page 1 when items change. */
export function usePagination<T>(items: T[], pageSize = 20) {
  const [page, setPage] = useState(1);

  useEffect(() => { setPage(1); }, [items.length]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const slice = items.slice((safePage - 1) * pageSize, safePage * pageSize);

  return { page: safePage, setPage, totalPages, slice, total: items.length };
}

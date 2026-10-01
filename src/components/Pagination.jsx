import React from 'react';

export default function Pagination({ page, pages, start, end, total, onPageChange, label }) {
  if (!total) return null;
  return <nav aria-label={label} dir="rtl" className="flex flex-wrap items-center justify-between gap-3 py-4 text-sm text-slate-300">
    <p role="status">عرض {start + 1}–{end} من {total} · الصفحة {page} من {pages}</p>
    <div className="flex gap-2">
      <button type="button" disabled={page === 1} onClick={() => onPageChange(page - 1)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-40">السابق</button>
      <button type="button" disabled={page === pages} onClick={() => onPageChange(page + 1)} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 disabled:opacity-40">التالي</button>
    </div>
  </nav>;
}

import { useMemo, useState } from 'react';
import { pageBounds } from '../lib/pagination.mjs';

// Filters reset immediately; deleting the last row of a page clamps the page.
export function usePagination(items, resetKey, pageSize = 50) {
  const [selection, setSelection] = useState({ key: resetKey, page: 1 });
  const bounds = pageBounds(items.length, selection.key === resetKey ? selection.page : 1, pageSize);
  if (selection.key !== resetKey || selection.page !== bounds.page) {
    setSelection({ key: resetKey, page: bounds.page });
  }
  const pageItems = useMemo(() => items.slice(bounds.start, bounds.end), [items, bounds.start, bounds.end]);
  return { ...bounds, pageItems, onPageChange: page => setSelection({ key: resetKey, page }) };
}

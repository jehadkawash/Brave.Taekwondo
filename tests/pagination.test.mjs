import test from 'node:test';
import assert from 'node:assert/strict';
import { pageBounds } from '../src/lib/pagination.mjs';

test('all receipts remain reachable exactly once across pages', () => {
  const rows = Array.from({ length: 356 }, (_, id) => id);
  const visited = [];
  for (let page = 1; page <= 8; page++) {
    const { start, end } = pageBounds(rows.length, page);
    visited.push(...rows.slice(start, end));
  }
  assert.deepEqual(visited, rows);
});
test('empty results and deletion of last page clamp safely', () => {
  assert.deepEqual(pageBounds(0, 8), { page: 1, pages: 1, start: 0, end: 0, total: 0 });
  assert.deepEqual(pageBounds(100, 3), { page: 2, pages: 2, start: 50, end: 100, total: 100 });
});

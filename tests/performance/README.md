# Browser performance regression fixture

Run from the repository root:

```sh
node node_modules/vite/bin/vite.js --config tests/performance/vite.config.mjs --host 127.0.0.1 --port 5174
```

Open `http://127.0.0.1:5174/tests/performance/index.html`.

This fixture uses 102 generated students and 356 generated receipts. Firebase imports and collection hooks are replaced by local mocks; receipt writes modify React state only. Printing is captured locally and reports its row count, period and totals. Do not use this configuration to run the real application.

Verified manually on 2026-10-02:

- Desktop receipts: 50 table rows and no hidden mobile list; approximately 2,007 DOM elements before adding the print diagnostics.
- Desktop students: 50 table rows, zero student cards; approximately 3,430 DOM elements before adding print diagnostics.
- At 390px: 50 student cards and no table; receipts have 50 print actions and no table. Resizing restores the appropriate desktop layout.
- Next page shows 51–100; applying a student filter resets to page one and searches all loaded records. Empty student search results show the empty state.
- Receipt selection, amount, reason and save work against the in-memory mock. Saving 25 for student 101 adds a receipt to the filtered list.
- Printing students from page two captures 102 report rows, not 50.
- Financial report for the fixture's default date captures all 356 receipts and a total of 3560 JD.
- Student picker initially builds only 20 options, with more available through search or the explicit show-more button.

The baseline live-site numbers in PERFORMANCE-AUDIT.md use real data and the full dashboard shell; these fixture numbers are not an exact before/after timing benchmark. No CPU, INP or frame-rate improvement percentage is claimed.

Automated pagination invariants:

```sh
node --test tests/pagination.test.mjs
```

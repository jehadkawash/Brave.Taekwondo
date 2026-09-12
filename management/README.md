# Unified three-portal foundation

Updated architecture: src/views/LoginView.jsx is the single login screen (student / coach / management). src/App.jsx verifies Firebase identity and the selected portal. StudentPortal and AdminDashboard are unchanged. ManagementView lazy-loads the management UI in a shadow root to isolate its CSS. All use the existing Firebase auth and database instance; the separate management Firebase module is unused. Production route: /#management_portal. /management/ is a compatibility redirect to /#login, not an independent account system.

Build: npm run build. Domain checks: node management/domain.test.mjs.

Salary advances are separate ledger entries (kind advance), deducted from monthly paid balance and counted once as an expense. Current policy caps advances at earned/unpaid salary; no borrowing against unearned or future months. No production deployment or live writes were performed. New management rules still need emulator validation and deployment before real data operations work.

## Remaining activation work

The additive Firestore rule files remain drafts. Run emulator compilation and tests before deployment, including staff/family denial, supervisor permissions, attendance calendar dates, salary cap, closed months and concurrent salary/advance writes. No rules were deployed and the existing firestore.rules was not changed.

Payroll, attendance, advances, notes and supervisor access use management_* collections. The six relocated club pages retain their original data collections and editing behavior (schedule, accounts, inventory, news, reports, captains). General-management summaries continue to read student/payment data. Captain/account security administration and full database backup remain director-only. Financial totals use payment date; salary balances use the payroll month. Current student/debt totals are not historical snapshots. Account provisioning requires an existing Firebase Auth account.

Domain checks and production build pass. Browser verification uses local UI and synthetic records; live login/persistence and rule enforcement remain unverified.

## Page relocation and backup

Schedule, club accounts, inventory, news, comprehensive reports and captain permissions are available only in the general-management UI. Coach bookmark routes for these pages fall back to the coach landing page. Backup remains available to a director in either UI. src/lib/databaseBackup.js exports all explicitly registered app collections across branches from server reads, including management collections, retaining document IDs and Firestore-specific types. Any collection read failure cancels download. This is not a transactionally consistent server backup and excludes Storage binaries, Authentication accounts, push tokens and unknown/subcollections. A full disaster recovery plan needs a server backup and restore test. No live backup export or restore was performed.

Tests: node management/relocation.test.mjs covers page registry and mocked backup success/failure; node management/domain.test.mjs covers payroll and advance accounting.

import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import FinanceManager from '../../src/views/dashboard/FinanceManager';
import StudentsManager from '../../src/views/dashboard/StudentsManager';

const branch = 'أبو نصير';
const students = Array.from({ length: 102 }, (_, i) => ({
  id: `student-${i}`, name: `طالب تجريبي ${String(i).padStart(3, '0')}`, branch,
  joinDate: '2026-01-01', createdAt: new Date(2026, 0, 1, 0, i).toISOString(),
  subEnd: '2099-01-01', belt: 'أبيض', group: 'تجريبية', phone: '0700000000',
}));
const initialPayments = Array.from({ length: 356 }, (_, i) => ({
  id: `receipt-${i}`, studentId: students[i % students.length].id,
  name: students[i % students.length].name, branch, amount: 10,
  date: new Date().toISOString().split('T')[0], createdAt: new Date(2026, 0, 1, 0, i).toISOString(), reason: 'اشتراك تجريبي',
}));
function Fixture() {
  const [view, setView] = useState('finance');
  const [payments, setPayments] = useState(initialPayments);
  const [lastSave, setLastSave] = useState(null);
  const [printedRows, setPrintedRows] = useState(null);
  const [printSummary, setPrintSummary] = useState('');
  useEffect(() => {
    const originalOpen = window.open;
    window.open = () => ({ document: {
      write: html => { const doc = new DOMParser().parseFromString(html, 'text/html'); setPrintedRows(doc.querySelectorAll('tbody tr').length); setPrintSummary(doc.querySelector('.header-left')?.textContent + ' ' + doc.querySelector('.stats-grid')?.textContent); },
      open() {}, close() {},
    }, focus() {}, print() {}, close() {} });
    return () => { window.open = originalOpen; };
  }, []);
  const collection = {
    add: async value => { const id = `saved-${payments.length}`; setPayments(rows => [...rows, { ...value, id }]); setLastSave(value); return { id }; },
    update: async (id, updates) => { setPayments(rows => rows.map(row => row.id === id ? { ...row, ...updates } : row)); return true; },
    remove: async id => { setPayments(rows => rows.filter(row => row.id !== id)); return true; },
  };
  return <main className="p-6 bg-slate-950 min-h-screen text-white">
    <div className="flex gap-4 pb-6"><button onClick={() => setView('finance')}>اختبار الوصولات</button><button onClick={() => setView('students')}>اختبار الطلاب</button></div>
    <p data-testid="fixture-save">{lastSave ? `حفظ تجريبي: ${lastSave.amount} · ${lastSave.name}` : 'بيانات تجريبية فقط'}</p>
    <p data-testid="fixture-print">{printedRows === null ? 'لم تتم طباعة تجريبية' : `صفوف التقرير: ${printedRows}`}</p>
    <p data-testid="fixture-print-summary">{printSummary}</p>
    {view === 'finance' ? <FinanceManager students={students} payments={payments} selectedBranch={branch} paymentsCollection={collection} studentsCollection={collection} financeReasons={[{ title: 'اشتراك تجريبي' }]} financeReasonsCollection={collection} logActivity={() => {}} /> : <StudentsManager students={students} studentsCollection={collection} archiveCollection={collection} selectedBranch={branch} groups={[]} debts={[]} logActivity={() => {}} />}
  </main>;
}
createRoot(document.getElementById('root')).render(<Fixture />);

export const dayString = value => { if (!value) return ''; if(Array.isArray(value)) return dayString(value[0]); if(value.toDate) return value.toDate().toISOString().slice(0,10); return String(value).slice(0,10); };
export const money = value => Math.round((Number(value) || 0)*100)/100;
export function payroll(month) {
 const days = Object.values(month.attendance || {}).filter(Boolean).length;
 const earned = money(Number(month.salary || 0) * Math.min(days,26) / 26);
 return {days,earned,paid:money(month.paid),remaining:money(earned-Number(month.paid||0))};
}
export function totals(data, month, branch) {
 const scope = list => (list || []).filter(row => branch==='all' || row.branch===branch);
 const period = list => scope(list).filter(row => dayString(row.date).startsWith(month));
 const sum = list => money(list.reduce((n,r)=>n+Number(r.amount||0),0));
 const students=scope(data.students);
 const receipts=period(data.payments), extra=period(data.income_extra), expenses=period(data.expenses), ledger=period(data.management_ledger);
 const income=money(sum(receipts)+sum(extra)+sum(ledger.filter(r=>r.kind==='income')));
 const outgoing=money(sum(expenses)+sum(ledger.filter(r=>r.kind!=='income')));
 return {students,receipts,extra,expenses,ledger,income,outgoing,net:money(income-outgoing)};
}

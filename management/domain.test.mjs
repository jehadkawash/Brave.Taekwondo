import assert from 'node:assert/strict';
import {payroll,totals} from './domain.mjs';
const attendance=n=>Object.fromEntries(Array.from({length:n},(_,i)=>[String(i+1),true]));
assert.equal(payroll({salary:520,attendance:attendance(24)}).earned,480);
assert.equal(payroll({salary:520,attendance:attendance(27)}).earned,520);
assert.equal(payroll({salary:520,attendance:{}}).earned,0);
assert.equal(payroll({salary:520,attendance:attendance(26),paid:200}).remaining,320);
const old={salary:520,attendance:attendance(26)},next={salary:600,attendance:attendance(26)};
assert.equal(payroll(old).earned,520);assert.equal(payroll(next).earned,600);
const result=totals({payments:[{amount:100,date:'2026-09-01',branch:'A'},{amount:999,date:'2026-08-01',branch:'A'}],expenses:[{amount:20,date:'2026-09-01',branch:'A'}],management_ledger:[{amount:30,kind:'salary',date:'2026-09-01',branch:'A'}]},'2026-09','A');
assert.equal(result.income,100);assert.equal(result.outgoing,50);assert.equal(result.net,50);
console.log('PASS: attendance payroll, 26-day cap, monthly independence, paid balance, month filtering, salary expense counted once.');

const advances=totals({management_ledger:[{amount:50,kind:'advance',date:'2026-09-10',branch:'A'},{amount:430,kind:'salary',date:'2026-09-20',branch:'A'}]},'2026-09','A');
assert.equal(advances.outgoing,480);
assert.equal(payroll({salary:520,attendance:attendance(24),paid:50}).remaining,430);
console.log('PASS: advance deducted once; advance plus final payment equals total earned.');

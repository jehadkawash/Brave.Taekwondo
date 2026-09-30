import {test} from 'node:test';
import assert from 'node:assert/strict';
import {familyPhone,familyContacts,familyContactName,familyVCard} from './familyContacts.mjs';
import * as XLSX from 'xlsx';
test('Jordanian mobile formats become international numbers',()=>{for(const p of ['0791234567','+962 79 123 4567','00962791234567','9620791234567','٧٩١٢٣٤٥٦٧','۰۷۹۱۲۳۴۵۶۷'])assert.equal(familyPhone(p),'+962791234567');assert.equal(familyPhone('0781234567'),'+962781234567');assert.equal(familyPhone('0771234567'),'+962771234567');for(const p of ['',null,'+971501234567','061234567','079abc1234567','079123'])assert.equal(familyPhone(p),'');});
test('merge normalized numbers and use only supplied students and primary phone',()=>{const s=[{name:'أ',phone:'0791234567',branch:'أبو نصير'},{name:'ب',phone:'+962791234567',branch:'شفا بدران'},{name:'ج',phone:'',secondaryPhone:'0781234567'}];const result=familyContacts(s);assert.equal(result.rows.length,1);assert.deepEqual(result.rows[0].names,['أ','ب']);assert.equal(result.skipped,1);assert.equal(familyContacts(s,false).rows.length,2);assert.equal(familyContacts(s.slice(0,1)).rows[0].names.length,1);});
test('xlsx preserves phone and untrusted names as text',()=>{const rows=familyContacts([{name:'=1+1',phone:'0791234567'}]).rows;const ws=XLSX.utils.aoa_to_sheet(rows.map(r=>[r.names.join(' / '),r.phone]));ws.B1={t:'s',v:rows[0].phone,z:'@'};const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'contacts');const read=XLSX.read(XLSX.write(wb,{type:'buffer',bookType:'xlsx'}),{type:'buffer'}).Sheets.contacts;assert.equal(read.B1.t,'s');assert.equal(read.B1.v,'+962791234567');assert.equal(read.A1.t,'s');assert.equal(read.A1.f,undefined);});

test('vCard exports merged Arabic names, escaped text and international mobile',()=>{
 const {rows}=familyContacts([{name:'أحمد; محمد,\\علي\nسالم',phone:'0791234567'},{name:'محمد',phone:'+962791234567'}]);
 const text=familyVCard(rows),unfolded=text.replace(/\r\n /g,'');
 assert.equal((text.match(/BEGIN:VCARD/g)||[]).length,1);
 assert.ok(unfolded.includes('TEL;TYPE=CELL:+962791234567\r\n'));
 assert.ok(unfolded.includes('FN:أحمد\\; سالم / محمد - الشجاع'));
 assert.ok(unfolded.endsWith('END:VCARD\r\n'));
 for(const line of text.split('\r\n'))assert.ok(Buffer.byteLength(line,'utf8')<=75);
 assert.equal(familyVCard([]),'');
});
test('contact names use first and last names and combine siblings by family',()=>{
 assert.equal(familyContactName({names:['أحمد محمود حسن علي','محمد محمود حسن علي'],branches:['أبو نصير']}),'أحمد ومحمد علي - الشجاع بحرية');
 assert.equal(familyContactName({names:['  أحمد   محمود علي  '],branches:['شفا بدران']}),'أحمد علي - الشجاع شفا بدران');
 assert.equal(familyContactName({names:['أحمد محمود علي','محمد خالد سالم'],branches:[]}),'أحمد علي / محمد سالم - الشجاع');
 assert.equal(familyContactName({names:['محمد'],branches:[]}),'محمد - الشجاع');
});
test('every excluded student remains identifiable with the original phone',()=>{
 const students=[{id:'foreign',name:'طالب دولي',phone:'+971 50 123 4567',branch:'أبو نصير'},{id:'missing',name:'بدون رقم',phone:''},{id:'bad',name:'رقم ناقص',phone:'07912'}];
 const result=familyContacts(students);
 assert.equal(result.skipped,3);assert.equal(result.excluded.length,3);assert.equal(result.rows.length,0);
 assert.equal(result.excluded[0].name,'طالب دولي');assert.equal(result.excluded[0].phone,'+971 50 123 4567');assert.equal(result.excluded[1].reason,'لا يوجد رقم رئيسي');assert.equal(result.excluded[2].phone,'07912');
});

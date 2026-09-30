// Normalize Jordanian mobile numbers to international +962 format.
export function familyPhone(value) {
  let phone=String(value??'').trim().replace(/[٠-٩]/g,n=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(n))).replace(/[۰-۹]/g,n=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(n)));
  if(!/^[+\d\s().-]+$/.test(phone))return '';
  phone=phone.replace(/[\s().-]/g,'');
  if(phone.startsWith('+962'))phone=phone.slice(4);
  else if(phone.startsWith('00962'))phone=phone.slice(5);
  else if(phone.startsWith('962'))phone=phone.slice(3);
  if(phone.startsWith('0'))phone=phone.slice(1);
  return /^7[789]\d{7}$/.test(phone)?'+962'+phone:'';
}
export function familyContacts(students,merge=true){
  const rows=[],byPhone=new Map(),excluded=[];let skipped=0;
  for(const student of students){
    const phone=familyPhone(student.phone);
    if(!phone){skipped++;const original=String(student.phone??'');excluded.push({id:student.id,name:String(student.name||'بدون اسم'),phone:original,branch:String(student.branch||''),reason:original.trim()?'الرقم ليس بالصيغة المعتمدة للجوال الأردني؛ قد يكون دوليًا أو يحتاج تصحيحًا':'لا يوجد رقم رئيسي'});continue;}
    const name=String(student.name||'بدون اسم'),branch=String(student.branch||''),label=String(student.phoneLabel||'غير محدد');
    let row=merge?byPhone.get(phone):null;
    if(!row){row={phone,names:[],branches:[],labels:[]};rows.push(row);byPhone.set(phone,row);}
    row.names.push(name);
    if(branch&&!row.branches.includes(branch))row.branches.push(branch);
    if(!row.labels.includes(label))row.labels.push(label);
  }
  return {rows,skipped,excluded};
}


export function familyContactName(row){
 const families=new Map();
 for(const name of row.names){
  const parts=String(name).trim().split(/\s+/).filter(Boolean);
  if(!parts.length)continue;
  const first=parts[0],last=parts.length>1?parts[parts.length-1]:'';
  if(!families.has(last))families.set(last,[]);
  if(!families.get(last).includes(first))families.get(last).push(first);
 }
 const names=[...families].map(([last,firsts])=>firsts.join(' و')+(last?' '+last:'')).join(' / ');
 const branches=[...new Set((row.branches||[]).map(b=>b.trim()==='أبو نصير'?'بحرية':b.trim()).filter(Boolean))];
 return `${names||'بدون اسم'} - الشجاع${branches.length?' '+branches.join(' / '):''}`;
}
const escapeVCard=value=>String(value).replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
function foldVCard(line){
 const encoder=new TextEncoder();let result='',bytes=0;
 for(const character of line){const length=encoder.encode(character).length;if(bytes+length>75){result+='\r\n ';bytes=1;}result+=character;bytes+=length;}
 return result;
}
export function familyVCard(rows){
 return rows.map(row=>{
  const name=escapeVCard(familyContactName(row));
  return ['BEGIN:VCARD','VERSION:3.0',`FN:${name}`,`N:;${name};;;`,`TEL;TYPE=CELL:${row.phone}`,'ORG:اكاديمية الشجاع',`NOTE:${escapeVCard('الفرع: '+row.branches.join(' / ')+'\nصاحب الرقم: '+row.labels.join(' / '))}`,'END:VCARD'].map(foldVCard).join('\r\n');
 }).join('\r\n')+(rows.length?'\r\n':'');
}

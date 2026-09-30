// Export local Jordanian mobile numbers without 0 / +962 / 00962.
export function familyPhone(value) {
  let phone=String(value??'').trim().replace(/[٠-٩]/g,n=>String('٠١٢٣٤٥٦٧٨٩'.indexOf(n))).replace(/[۰-۹]/g,n=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(n)));
  if(!/^[+\d\s().-]+$/.test(phone))return '';
  phone=phone.replace(/[\s().-]/g,'');
  if(phone.startsWith('+962'))phone=phone.slice(4);
  else if(phone.startsWith('00962'))phone=phone.slice(5);
  else if(phone.startsWith('962'))phone=phone.slice(3);
  if(phone.startsWith('0'))phone=phone.slice(1);
  return /^7[789]\d{7}$/.test(phone)?phone:'';
}
export function familyContacts(students,merge=true){
  const rows=[],byPhone=new Map();let skipped=0;
  for(const student of students){
    const phone=familyPhone(student.phone);
    if(!phone){skipped++;continue;}
    const name=String(student.name||'بدون اسم'),branch=String(student.branch||''),label=String(student.phoneLabel||'غير محدد');
    let row=merge?byPhone.get(phone):null;
    if(!row){row={phone,names:[],branches:[],labels:[]};rows.push(row);byPhone.set(phone,row);}
    row.names.push(name);
    if(branch&&!row.branches.includes(branch))row.branches.push(branch);
    if(!row.labels.includes(label))row.labels.push(label);
  }
  return {rows,skipped};
}

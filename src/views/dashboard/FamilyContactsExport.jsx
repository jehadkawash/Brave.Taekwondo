import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Download,X} from 'lucide-react';
import * as XLSX from 'xlsx';
import {familyContacts,familyVCard,familyContactName} from '../../lib/familyContacts.mjs';
export default function FamilyContactsExport({students,onClose,format='xlsx'}){
 const [merge,setMerge]=useState(true),[error,setError]=useState('');
 const dialog=useRef(null);
 const {rows,skipped,excluded}=useMemo(()=>familyContacts(students,merge),[students,merge]);
 useEffect(()=>{const node=dialog.current,trigger=document.activeElement;node.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{node.close();document.body.style.overflow=old;trigger?.focus();};},[]);
 const download=()=>{try{
  if(format==='vcf'){
   const url=URL.createObjectURL(new Blob([familyVCard(rows)],{type:'text/vcard;charset=utf-8'}));
   const link=document.createElement('a');link.href=url;link.download=`أرقام-الأهالي-${new Date().toISOString().slice(0,10)}.vcf`;
   document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);onClose();return;
  }
  const sheet=XLSX.utils.aoa_to_sheet([['اسم الطالب / الأبناء','رقم الهاتف الرئيسي','صاحب الرقم','الفرع'],...rows.map(r=>[r.names.join(' / '),r.phone,r.labels.join(' / '),r.branches.join(' / ')])]);
  rows.forEach((r,i)=>{sheet['B'+(i+2)]={t:'s',v:r.phone,z:'@'};});
  sheet['!cols']=[{wch:42},{wch:23},{wch:22},{wch:25}];
  sheet['!autofilter']={ref:sheet['!ref']};
  const book=XLSX.utils.book_new();book.Workbook={Views:[{RTL:true}]};
  XLSX.utils.book_append_sheet(book,sheet,'أرقام الأهالي');
  if(excluded.length){
   const review=XLSX.utils.aoa_to_sheet([['اسم الطالب','الرقم المسجّل كما هو','الفرع','سبب المراجعة'],...excluded.map(r=>[r.name,r.phone,r.branch,r.reason])]);
   excluded.forEach((r,i)=>{review['B'+(i+2)]={t:'s',v:r.phone,z:'@'};});
   review['!cols']=[{wch:38},{wch:25},{wch:22},{wch:75}];review['!autofilter']={ref:review['!ref']};
   XLSX.utils.book_append_sheet(book,review,'أرقام تحتاج مراجعة');
  }
  XLSX.writeFile(book,`أرقام-الأهالي-${new Date().toISOString().slice(0,10)}.xlsx`);
  onClose();
 }catch{setError('تعذر تجهيز الملف. حاول مرة أخرى.');}};
 return <dialog ref={dialog} dir="rtl" aria-labelledby="family-export-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}} className="m-auto w-[calc(100%-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 p-6 backdrop:bg-black/70">
 <div className="flex items-center justify-between gap-4"><h2 id="family-export-title" className="text-xl font-bold">{format==='vcf'?'جهات اتصال للآيفون':'تصدير أرقام الأهالي — Excel'}</h2><button aria-label="إغلاق التصدير" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800"><X size={20}/></button></div>
 <p className="text-sm text-slate-400 mt-4 leading-7">يشمل الطلاب الظاهرين حسب البحث والفلاتر الحالية ({students.length} طالب)، بالرقم الرئيسي فقط.</p>
 {format==='vcf'&&<p className="text-sm text-slate-400 mt-3 leading-7">نزّل الملف وافتحه على الآيفون لإضافة جهات الاتصال. نستخدم الاسم الأول وآخر اسم مسجّل كاسم العائلة، مثل «أحمد ومحمد علي - الشجاع بحرية». فرع أبو نصير يظهر باسم «بحرية».</p>}
 <label className="flex items-center gap-3 p-4 my-4 rounded-xl border border-slate-700 bg-slate-950 cursor-pointer"><input type="checkbox" checked={merge} onChange={e=>setMerge(e.target.checked)} className="accent-yellow-500 w-4 h-4"/><span className="text-sm">دمج الأرقام المشتركة وجمع أسماء الأبناء في سطر واحد</span></label>
 <p className="text-sm text-slate-300">صيغة الرقم في الملف: <bdi className="font-mono">+962791234567</bdi> — بالصيغة الدولية في كلا الملفين.</p>
  {skipped>0&&<section className="my-4 rounded-xl border border-orange-500/30 p-4" aria-label="أرقام تحتاج مراجعة"><p className="text-sm text-orange-400" role="status">{skipped} طالب بحاجة لمراجعة الرقم الرئيسي</p><p className="text-xs text-slate-400 mt-2">{format==='xlsx'?'ستُحفظ الأسماء والأرقام التالية كما هي في ورقة «أرقام تحتاج مراجعة» داخل Excel.':'لن تُضاف الأرقام التالية إلى ملف جهات الاتصال. تستطيع حفظها للمراجعة من خيار Excel.'}</p><div className="overflow-x-auto mt-3"><table className="w-full text-sm text-right"><thead className="text-slate-400"><tr><th className="p-2">الطالب</th><th className="p-2">الرقم المسجّل</th><th className="p-2">السبب</th></tr></thead><tbody>{excluded.map((r,i)=><tr key={r.id||i} className="border-t border-slate-700"><td className="p-2">{r.name}</td><td className="p-2 font-mono"><bdi>{r.phone||'غير مسجّل'}</bdi></td><td className="p-2 text-xs text-slate-400">{r.reason}</td></tr>)}</tbody></table></div></section>}
 <div className="overflow-x-auto mt-4"><table className="w-full text-sm text-right"><thead className="text-slate-400"><tr><th className="p-2">اسم الطالب / الأبناء</th><th className="p-2">الرقم الرئيسي</th></tr></thead><tbody>{rows.slice(0,5).map((r,i)=><tr key={i} className="border-t border-slate-800"><td className="p-2">{format==='vcf'?familyContactName(r):r.names.join(' / ')}</td><td className="p-2 font-mono"><bdi>{r.phone}</bdi></td></tr>)}</tbody></table></div>
 <p className="text-xs text-slate-400 my-4">{rows.length} رقم جاهز{format==='xlsx'&&skipped>0?' · '+skipped+' سجل في ورقة المراجعة':''}{rows.length>5?' · المعاينة تعرض أول 5 صفوف':''}</p>{error&&<p role="alert" className="text-red-400 text-sm mb-3">{error}</p>}
 <button onClick={download} disabled={format==='vcf'?!rows.length:!rows.length&&!excluded.length} className="w-full bg-yellow-500 text-slate-950 font-bold rounded-xl p-3 flex items-center justify-center gap-2 disabled:opacity-40"><Download size={18}/> {format==='vcf'?'تنزيل جهات الاتصال (VCF)':'تنزيل Excel'}</button>
 </dialog>;
}

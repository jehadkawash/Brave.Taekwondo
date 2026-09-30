import React,{useEffect,useMemo,useRef,useState} from 'react';
import {Download,X} from 'lucide-react';
import * as XLSX from 'xlsx';
import {familyContacts} from '../../lib/familyContacts.mjs';
export default function FamilyContactsExport({students,onClose}){
 const [merge,setMerge]=useState(true),[error,setError]=useState('');
 const dialog=useRef(null);
 const {rows,skipped}=useMemo(()=>familyContacts(students,merge),[students,merge]);
 useEffect(()=>{const node=dialog.current,trigger=document.activeElement;node.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{node.close();document.body.style.overflow=old;trigger?.focus();};},[]);
 const download=()=>{try{
  const sheet=XLSX.utils.aoa_to_sheet([['اسم الطالب / الأبناء','رقم الهاتف الرئيسي','صاحب الرقم','الفرع'],...rows.map(r=>[r.names.join(' / '),r.phone,r.labels.join(' / '),r.branches.join(' / ')])]);
  rows.forEach((r,i)=>{sheet['B'+(i+2)]={t:'s',v:r.phone,z:'@'};});
  sheet['!cols']=[{wch:42},{wch:23},{wch:22},{wch:25}];
  sheet['!autofilter']={ref:sheet['!ref']};
  const book=XLSX.utils.book_new();book.Workbook={Views:[{RTL:true}]};
  XLSX.utils.book_append_sheet(book,sheet,'أرقام الأهالي');
  XLSX.writeFile(book,`أرقام-الأهالي-${new Date().toISOString().slice(0,10)}.xlsx`);
  onClose();
 }catch{setError('تعذر تجهيز الملف. حاول مرة أخرى.');}};
 return <dialog ref={dialog} dir="rtl" aria-labelledby="family-export-title" onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}} className="m-auto w-[calc(100%-2rem)] max-w-xl max-h-[90dvh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 text-slate-200 p-6 backdrop:bg-black/70">
 <div className="flex items-center justify-between gap-4"><h2 id="family-export-title" className="text-xl font-bold">تصدير أرقام الأهالي</h2><button aria-label="إغلاق التصدير" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-800"><X size={20}/></button></div>
 <p className="text-sm text-slate-400 mt-4 leading-7">يشمل الطلاب الظاهرين حسب البحث والفلاتر الحالية ({students.length} طالب)، بالرقم الرئيسي فقط.</p>
 <label className="flex items-center gap-3 p-4 my-4 rounded-xl border border-slate-700 bg-slate-950 cursor-pointer"><input type="checkbox" checked={merge} onChange={e=>setMerge(e.target.checked)} className="accent-yellow-500 w-4 h-4"/><span className="text-sm">دمج الأرقام المشتركة وجمع أسماء الأبناء في سطر واحد</span></label>
 <p className="text-sm text-slate-300">صيغة الرقم في الملف: <bdi className="font-mono">791234567</bdi> — بدون الصفر الأول أو رمز الدولة.</p>
 {skipped>0&&<p className="text-sm text-orange-400 my-3" role="status">سيُستبعد {skipped} طالب لعدم وجود رقم رئيسي أردني صالح يبدأ بـ 77 أو 78 أو 79.</p>}
 <div className="overflow-x-auto mt-4"><table className="w-full text-sm text-right"><thead className="text-slate-400"><tr><th className="p-2">اسم الطالب / الأبناء</th><th className="p-2">الرقم الرئيسي</th></tr></thead><tbody>{rows.slice(0,5).map((r,i)=><tr key={i} className="border-t border-slate-800"><td className="p-2">{r.names.join(' / ')}</td><td className="p-2 font-mono"><bdi>{r.phone}</bdi></td></tr>)}</tbody></table></div>
 <p className="text-xs text-slate-400 my-4">{rows.length} رقم في الملف{rows.length>5?' · المعاينة تعرض أول 5 صفوف':''}</p>{error&&<p role="alert" className="text-red-400 text-sm mb-3">{error}</p>}
 <button onClick={download} disabled={!rows.length} className="w-full bg-yellow-500 text-slate-950 font-bold rounded-xl p-3 flex items-center justify-center gap-2 disabled:opacity-40"><Download size={18}/> تنزيل Excel</button>
 </dialog>;
}

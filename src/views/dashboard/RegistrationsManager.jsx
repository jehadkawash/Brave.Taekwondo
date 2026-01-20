import React, { useState } from 'react';
import { Inbox, Trash2, Phone, MapPin, Calendar, Check, UserPlus, X } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

// --- دوال مساعدة ---
const generateCredentials = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const username = `student${randomNum}`;
    let password = ""; 
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    for (let i = 0; i < 8; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    return { username, password };
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString; 
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
};

export default function RegistrationsManager({ registrations, students, registrationsCollection, studentsCollection, selectedBranch, logActivity }) {
  const [confirmModal, setConfirmModal] = useState(null); 
  const [formData, setFormData] = useState({});
  
  // استخراج العائلات الفريدة لربط الطالب
  const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];
  
  const openConfirm = (reg) => { 
      const today = new Date().toISOString().split('T')[0]; 
      const nextMonth = new Date(); nextMonth.setMonth(nextMonth.getMonth()+1); 
      setFormData({ 
          name: reg.name, 
          phone: reg.phone, 
          dob: reg.dob, 
          address: reg.address, 
          belt: 'أبيض', 
          joinDate: today, 
          subEnd: nextMonth.toISOString().split('T')[0], 
          balance: 0, 
          linkFamily: 'new' 
      }); 
      setConfirmModal(reg); 
  };
  
  const confirmStudent = async (e) => {
    e.preventDefault(); 
    const { username, password } = generateCredentials();
    let finalFamilyId, finalFamilyName;
    
    if (formData.linkFamily === 'new') { 
        finalFamilyId = Math.floor(Date.now() / 1000); 
        finalFamilyName = `عائلة ${formData.name.split(' ').slice(-1)[0]}`; 
    } else { 
        finalFamilyId = parseInt(formData.linkFamily); 
        finalFamilyName = students.find(s => s.familyId === finalFamilyId)?.familyName || "عائلة"; 
    }
    
    const newStudent = { 
        branch: selectedBranch, 
        status: 'active', 
        notes: [], 
        internalNotes: [], 
        attendance: {}, 
        username, 
        password, 
        familyId: finalFamilyId, 
        familyName: finalFamilyName, 
        customOrder: Date.now(), 
        ...formData 
    };
    delete newStudent.linkFamily; 

    await studentsCollection.add(newStudent); 
    await registrationsCollection.remove(confirmModal.id); 
    logActivity("تسجيل طالب", `تم قبول الطالب ${formData.name}`); 
    alert(`تم إضافة الطالب بنجاح!\nUser: ${username}\nPass: ${password}`); 
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-20 md:pb-0">
       
       {/* شبكة البطاقات */}
       <div className="grid gap-4">
           {registrations.length === 0 ? (
               <div className="text-center py-16 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800">
                   <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                        <Inbox size={32} className="text-slate-500"/>
                   </div>
                   <p className="text-slate-500 font-bold">لا توجد طلبات جديدة حالياً.</p>
               </div>
           ) : (
               registrations.map(reg => (
                   <Card key={reg.id} className="border-r-4 border-r-blue-500 hover:border-slate-700 transition-all bg-slate-900 shadow-lg group">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                           <div>
                               <h4 className="font-bold text-lg text-slate-100 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                                   {reg.name} 
                                   <span className="text-[10px] bg-blue-900/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded animate-pulse">جديد</span>
                               </h4>
                               <div className="flex flex-wrap gap-3 text-sm text-slate-400 mt-2">
                                   <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800"><Phone size={14} className="text-blue-500"/> {reg.phone}</span>
                                   <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800"><MapPin size={14} className="text-yellow-500"/> {reg.address}</span>
                                   <span className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800"><Calendar size={14} className="text-emerald-500"/> {formatDate(reg.dob)}</span>
                               </div>
                           </div>
                           <div className="flex gap-2 w-full md:w-auto">
                               <Button onClick={() => openConfirm(reg)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm flex-1 md:flex-none shadow-lg shadow-emerald-500/20 border-none">
                                   <Check size={18} className="ml-1"/> اعتماد كطالب
                               </Button>
                               <button 
                                   onClick={() => {if(confirm('حذف الطلب؟')) registrationsCollection.remove(reg.id)}} 
                                   className="text-red-400 p-2.5 hover:bg-red-900/20 rounded-xl border border-slate-700 hover:border-red-500/50 transition-colors"
                                   title="حذف الطلب"
                               >
                                   <Trash2 size={18}/>
                               </button>
                           </div>
                       </div>
                   </Card>
               ))
           )}
       </div>

       {/* --- نافذة التأكيد (المشكلة تم حلها هنا) --- */}
       {confirmModal && (
           <div className="fixed inset-0 z-[200] overflow-y-auto">
               <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                   {/* الخلفية المعتمة */}
                   <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={() => setConfirmModal(null)}></div>

                   {/* جسم النافذة - تم تعديل الارتفاع والتمركز لضمان عدم خروجها عن الشاشة */}
                   <div className="relative transform overflow-hidden rounded-2xl bg-slate-900 text-right shadow-2xl transition-all sm:my-8 w-full max-w-2xl border border-slate-700 flex flex-col max-h-[calc(100dvh-40px)] animate-in zoom-in-95 duration-200">
                       
                       {/* 1. الرأس (ثابت) */}
                       <div className="flex justify-between items-center p-5 border-b border-slate-800 bg-slate-950">
                           <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                               <UserPlus size={20} className="text-emerald-500"/> إكمال بيانات الطالب الجديد
                           </h3>
                           <button onClick={() => setConfirmModal(null)} className="text-slate-500 hover:text-red-500 transition-colors bg-slate-900 p-1 rounded-full hover:bg-slate-800">
                               <X size={20}/>
                           </button>
                       </div>

                       {/* 2. المحتوى (قابل للتمرير) */}
                       <div className="p-6 overflow-y-auto custom-scrollbar">
                           <form id="confirmForm" onSubmit={confirmStudent} className="space-y-5">
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                   {/* الاسم */}
                                   <div>
                                       <label className="block text-xs mb-2 font-bold text-slate-400">الاسم</label>
                                       <input className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-400 cursor-not-allowed font-bold" value={formData.name} readOnly />
                                   </div>
                                   {/* الهاتف */}
                                   <div>
                                       <label className="block text-xs mb-2 font-bold text-slate-400">الهاتف</label>
                                       <input className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-slate-400 font-mono cursor-not-allowed" value={formData.phone} readOnly />
                                   </div>
                                   {/* العائلة */}
                                   <div className="md:col-span-2">
                                       <label className="block text-xs mb-2 font-bold text-blue-400">العائلة (للربط المالي)</label>
                                       <select 
                                           className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none cursor-pointer"
                                           value={formData.linkFamily} 
                                           onChange={e => setFormData({...formData, linkFamily: e.target.value})}
                                       >
                                           <option value="new">تسجيل كعائلة جديدة</option>
                                           {uniqueFamilies.map(([id, name]) => <option key={id} value={id}>انضمام لـ {name}</option>)}
                                       </select>
                                   </div>
                                   {/* الحزام */}
                                   <div>
                                       <label className="block text-xs mb-2 font-bold text-slate-400">الحزام</label>
                                       <select 
                                           className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none"
                                           value={formData.belt} 
                                           onChange={e=>setFormData({...formData, belt:e.target.value})}
                                       >
                                           {BELTS.map(b=><option key={b} value={b}>{b}</option>)}
                                       </select>
                                   </div>
                                   {/* تاريخ الالتحاق */}
                                   <div>
                                       <label className="block text-xs mb-2 font-bold text-slate-400">تاريخ الالتحاق</label>
                                       <input type="date" className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none" value={formData.joinDate} onChange={e=>setFormData({...formData, joinDate:e.target.value})} />
                                   </div>
                                   {/* نهاية الاشتراك */}
                                   <div>
                                       <label className="block text-xs mb-2 font-bold text-emerald-400">نهاية الاشتراك</label>
                                       <input type="date" className="w-full bg-emerald-900/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl focus:border-emerald-500 outline-none" value={formData.subEnd} onChange={e=>setFormData({...formData, subEnd:e.target.value})} />
                                   </div>
                                   {/* الرصيد */}
                                   <div>
                                       <label className="block text-xs mb-2 text-red-400 font-bold">رصيد مستحق (JOD)</label>
                                       <input type="number" className="w-full bg-red-900/10 border border-red-500/30 text-red-300 p-3 rounded-xl focus:border-red-500 outline-none placeholder-red-700" value={formData.balance} onChange={e=>setFormData({...formData, balance:e.target.value})} />
                                   </div>
                               </div>
                           </form>
                       </div>

                       {/* 3. التذييل (ثابت) */}
                       <div className="p-5 border-t border-slate-800 bg-slate-950/50 flex justify-end gap-3">
                           <Button variant="ghost" onClick={() => setConfirmModal(null)} className="text-slate-400 hover:text-white hover:bg-slate-800">إلغاء</Button>
                           <Button type="submit" form="confirmForm" className="bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 border-none shadow-lg shadow-yellow-500/20 px-8">
                               تأكيد وإضافة
                           </Button>
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
}
// src/views/dashboard/RegistrationsManager.jsx
import React, { useState } from 'react';
import { Inbox, Trash2, Phone, MapPin, Calendar, Check, UserPlus } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

// نسخ دالة التوليد لاستخدامها هنا أيضاً
const generateCredentials = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const username = `student${randomNum}`;
    let password = ""; 
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    for (let i = 0; i < 8; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    return { username, password };
};

// --- Helper: Date Formatter (dd/mm/yyyy) ---
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
       <div className="grid gap-4">
           {registrations.length === 0 ? (
               <div className="text-center py-16 bg-slate-900 rounded-2xl border-2 border-dashed border-slate-800">
                   <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Inbox size={32} className="text-slate-500"/>
                   </div>
                   <p className="text-slate-500 font-bold">لا توجد طلبات جديدة حالياً.</p>
               </div>
           ) : (
               registrations.map(reg => (
                   <Card key={reg.id} className="border-r-4 border-r-blue-500 hover:border-slate-700 transition-all bg-slate-900 shadow-lg">
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                           <div>
                               <h4 className="font-bold text-lg text-slate-100 flex items-center gap-2">
                                   {reg.name} 
                                   <span className="text-[10px] bg-blue-900/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded animate-pulse">جديد</span>
                               </h4>
                               <div className="flex flex-wrap gap-4 text-sm text-slate-400 mt-2">
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

       {confirmModal && (
           <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
               {/* ✅ FIX APPLIED HERE:
                  - Added max-h-[85vh] to restrict height
                  - Added overflow-y-auto to enable scrolling
                  - Added my-auto to ensure proper vertical centering behavior
               */}
               <Card 
                  className="w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-in fade-in zoom-in-95 bg-slate-900 border border-slate-700 shadow-2xl custom-scrollbar" 
                  title="إكمال بيانات الطالب الجديد" 
                  icon={UserPlus}
               >
                   <form onSubmit={confirmStudent} className="space-y-4 mt-4">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs mb-2 font-bold text-slate-400">الاسم</label>
                               <input className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-400 cursor-not-allowed" value={formData.name} readOnly />
                           </div>
                           <div>
                               <label className="block text-xs mb-2 font-bold text-slate-400">الهاتف</label>
                               <input className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-slate-400 font-mono cursor-not-allowed" value={formData.phone} readOnly />
                           </div>
                           <div>
                               <label className="block text-xs mb-2 font-bold text-blue-400">العائلة (للربط المالي)</label>
                               <select 
                                   className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-blue-500 outline-none"
                                   value={formData.linkFamily} 
                                   onChange={e => setFormData({...formData, linkFamily: e.target.value})}
                               >
                                   <option value="new">عائلة جديدة</option>
                                   {uniqueFamilies.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                               </select>
                           </div>
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
                           <div>
                               <label className="block text-xs mb-2 font-bold text-slate-400">تاريخ الالتحاق</label>
                               <input type="date" className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none" value={formData.joinDate} onChange={e=>setFormData({...formData, joinDate:e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-xs mb-2 font-bold text-emerald-400">نهاية الاشتراك</label>
                               <input type="date" className="w-full bg-emerald-900/10 border border-emerald-500/30 text-emerald-300 p-3 rounded-xl focus:border-emerald-500 outline-none" value={formData.subEnd} onChange={e=>setFormData({...formData, subEnd:e.target.value})} />
                           </div>
                           <div>
                               <label className="block text-xs mb-2 text-red-400 font-bold">رصيد مستحق (JOD)</label>
                               <input type="number" className="w-full bg-red-900/10 border border-red-500/30 text-red-300 p-3 rounded-xl focus:border-red-500 outline-none placeholder-red-700" value={formData.balance} onChange={e=>setFormData({...formData, balance:e.target.value})} />
                           </div>
                       </div>
                       <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
                           <Button variant="ghost" onClick={() => setConfirmModal(null)} className="text-slate-400 hover:text-white hover:bg-slate-800">إلغاء</Button>
                           <Button type="submit" className="bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 border-none shadow-lg shadow-yellow-500/20 px-6">تأكيد وإضافة</Button>
                       </div>
                   </form>
               </Card>
           </div>
       )}
    </div>
  );
}
import React, { useState } from 'react';
import { Inbox, Trash2, Phone, MapPin, Calendar } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

// نسخ دالة التوليد لاستخدامها هنا أيضاً
const generateCredentials = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const username = `student${randomNum}`;
    let password = ""; const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    for (let i = 0; i < 8; i++) password += chars.charAt(Math.floor(Math.random() * chars.length));
    return { username, password };
};

export default function RegistrationsManager({ registrations, students, registrationsCollection, studentsCollection, selectedBranch, logActivity }) {
  const [confirmModal, setConfirmModal] = useState(null); 
  const [formData, setFormData] = useState({});
  const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];
  
  const openConfirm = (reg) => { 
      const today = new Date().toISOString().split('T')[0]; 
      const nextMonth = new Date(); nextMonth.setMonth(nextMonth.getMonth()+1); 
      setFormData({ name: reg.name, phone: reg.phone, dob: reg.dob, address: reg.address, belt: 'أبيض', joinDate: today, subEnd: nextMonth.toISOString().split('T')[0], balance: 0, linkFamily: 'new' }); 
      setConfirmModal(reg); 
  };
  
  const confirmStudent = async (e) => {
    e.preventDefault(); const { username, password } = generateCredentials();
    let finalFamilyId, finalFamilyName;
    if (formData.linkFamily === 'new') { finalFamilyId = Math.floor(Date.now() / 1000); finalFamilyName = `عائلة ${formData.name.split(' ').slice(-1)[0]}`; } 
    else { finalFamilyId = parseInt(formData.linkFamily); finalFamilyName = students.find(s => s.familyId === finalFamilyId)?.familyName || "عائلة"; }
    
    const newStudent = { branch: selectedBranch, status: 'active', notes: [], internalNotes: [], attendance: {}, username, password, familyId: finalFamilyId, familyName: finalFamilyName, customOrder: Date.now(), ...formData };
    delete newStudent.linkFamily; // Remove temporary field

    await studentsCollection.add(newStudent); 
    await registrationsCollection.remove(confirmModal.id); 
    logActivity("تسجيل طالب", `تم قبول الطالب ${formData.name}`); 
    alert(`تم إضافة الطالب بنجاح!\nUser: ${username}\nPass: ${password}`); 
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6">
       <div className="grid gap-4">{registrations.length === 0 ? <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200"><Inbox size={48} className="mx-auto text-gray-300 mb-2"/><p className="text-gray-500">لا توجد طلبات جديدة حالياً.</p></div> : registrations.map(reg => (<Card key={reg.id} className="border-r-4 border-blue-500"><div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"><div><h4 className="font-bold text-lg flex items-center gap-2">{reg.name} <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">جديد</span></h4><div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1"><span className="flex items-center gap-1"><Phone size={14}/> {reg.phone}</span><span className="flex items-center gap-1"><MapPin size={14}/> {reg.address}</span><span className="flex items-center gap-1"><Calendar size={14}/> {reg.dob}</span></div></div><div className="flex gap-2 w-full md:w-auto"><Button onClick={() => openConfirm(reg)} className="bg-green-600 hover:bg-green-700 text-white text-sm flex-1 md:flex-none">اعتماد كطالب</Button><button onClick={() => {if(confirm('حذف الطلب؟')) registrationsCollection.remove(reg.id)}} className="text-red-500 p-2 hover:bg-red-50 rounded border border-red-200"><Trash2 size={18}/></button></div></div></Card>))}</div>
       {confirmModal && (<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 backdrop-blur-sm"><Card className="w-full max-w-2xl animate-fade-in" title="إكمال بيانات الطالب الجديد"><form onSubmit={confirmStudent} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-xs mb-1 font-bold">الاسم</label><input className="w-full border p-2 bg-gray-100 rounded text-gray-500" value={formData.name} readOnly /></div><div><label className="block text-xs mb-1 font-bold">الهاتف</label><input className="w-full border p-2 bg-gray-100 rounded text-gray-500" value={formData.phone} readOnly /></div><div><label className="block text-xs mb-1 font-bold">العائلة</label><select className="w-full border p-2 rounded" value={formData.linkFamily} onChange={e => setFormData({...formData, linkFamily: e.target.value})}><option value="new">عائلة جديدة</option>{uniqueFamilies.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></div><div><label className="block text-xs mb-1 font-bold">الحزام</label><select className="w-full border p-2 rounded" value={formData.belt} onChange={e=>setFormData({...formData, belt:e.target.value})}>{BELTS.map(b=><option key={b}>{b}</option>)}</select></div><div><label className="block text-xs mb-1 font-bold">تاريخ الالتحاق</label><input type="date" className="w-full border p-2 rounded" value={formData.joinDate} onChange={e=>setFormData({...formData, joinDate:e.target.value})} /></div><div><label className="block text-xs mb-1 font-bold text-green-600">نهاية الاشتراك</label><input type="date" className="w-full border p-2 rounded bg-green-50" value={formData.subEnd} onChange={e=>setFormData({...formData, subEnd:e.target.value})} /></div><div><label className="block text-xs mb-1 text-red-600 font-bold">رصيد مستحق (JOD)</label><input type="number" className="w-full border p-2 rounded focus:ring-2 ring-red-500 outline-none" value={formData.balance} onChange={e=>setFormData({...formData, balance:e.target.value})} /></div></div><div className="flex justify-end gap-2 mt-4 pt-4 border-t"><Button variant="ghost" onClick={() => setConfirmModal(null)}>إلغاء</Button><Button type="submit">تأكيد وإضافة</Button></div></form></Card></div>)}
    </div>
  );
}
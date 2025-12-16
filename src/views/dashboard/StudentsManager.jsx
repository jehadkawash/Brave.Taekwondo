// src/views/dashboard/StudentsManager.js
import React, { useState } from 'react';
import { UserPlus, Edit, Trash2, Archive, ArrowUp, MessageCircle } from 'lucide-react';
import { Button, Card, StudentSearch, StatusBadge } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

// دالة مساعدة لتوليد يوزر وباسورد
const generateCredentials = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const username = `student${randomNum}`;
  let password = "";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; 
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return { username, password };
};

// دالة مساعدة لحالة الاشتراك
const calculateStatus = (dateString) => {
    if (!dateString) return 'expired';
    const today = new Date();
    const end = new Date(dateString);
    today.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'near_end';
    return 'active';
};

const StudentsManager = ({ students, studentsCollection, archiveCollection, selectedBranch, logActivity }) => {
  const [search, setSearch] = useState(''); 
  const [showModal, setShowModal] = useState(false); 
  const [editingStudent, setEditingStudent] = useState(null); 
  const [createdCreds, setCreatedCreds] = useState(null);
  const [newS, setNewS] = useState({ name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0 });
  const [linkFamily, setLinkFamily] = useState('new');
  
  const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];
  const filtered = students.filter(s => s.name.includes(search));

  const addStudent = async (e) => {
    e.preventDefault(); 
    const { username, password } = generateCredentials();
    let finalFamilyId, finalFamilyName;
    if (linkFamily === 'new') { 
        finalFamilyId = Math.floor(Date.now() / 1000); 
        finalFamilyName = `عائلة ${newS.name.split(' ').slice(-1)[0]}`; 
    } else { 
        finalFamilyId = parseInt(linkFamily); 
        finalFamilyName = students.find(s => s.familyId === finalFamilyId)?.familyName || "عائلة"; 
    }
    const joinDateObj = new Date(newS.joinDate || new Date()); 
    const subEndDateObj = new Date(joinDateObj); 
    subEndDateObj.setMonth(subEndDateObj.getMonth() + 1); 
    const subEnd = subEndDateObj.toISOString().split('T')[0];
    
    const student = { branch: selectedBranch, status: 'active', subEnd: subEnd, notes: [], internalNotes: [], attendance: {}, username, password, familyId: finalFamilyId, familyName: finalFamilyName, customOrder: Date.now(), ...newS };
    await studentsCollection.add(student); 
    // logActivity("إضافة طالب", `تم إضافة الطالب ${student.name}`); // تحتاج تمرير دالة logActivity
    setCreatedCreds({ name: student.name, username, password }); 
    setShowModal(false); 
    setNewS({ name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0 }); 
    setLinkFamily('new');
  };

  const openEditModal = (student) => { 
      setEditingStudent(student); 
      setNewS({ name: student.name, phone: student.phone, belt: student.belt, joinDate: student.joinDate, dob: student.dob, address: student.address || '', subEnd: student.subEnd, balance: student.balance }); 
      setLinkFamily(student.familyId); 
      setShowModal(true); 
  };

  const handleSaveEdit = async (e) => { 
      e.preventDefault(); 
      await studentsCollection.update(editingStudent.id, newS); 
      setShowModal(false); 
      setEditingStudent(null); 
  };

  const promoteBelt = async (student) => { 
      const currentIdx = BELTS.indexOf(student.belt); 
      if(currentIdx < BELTS.length - 1) { 
          await studentsCollection.update(student.id, { belt: BELTS[currentIdx + 1] }); 
      } 
  };

  // هذا التعديل يضمن نقل الرصيد والبيانات المالية للأرشيف
    const archiveStudent = async (student) => { 
        if(confirm(`هل أنت متأكد من أرشفة الطالب ${student.name}؟\nسيتم نقله إلى سجل الأرشيف.`)) { 
            // 1. نسخ الطالب للأرشيف مع تاريخ اليوم
            await archiveCollection.add({ 
                ...student, 
                archivedAt: new Date().toISOString().split('T')[0], // تاريخ الأرشفة
                originalId: student.id // نحتفظ بالرقم القديم عشان نجيب الوصلات تبعته
            }); 
            // 2. حذفه من القائمة النشطة
            await studentsCollection.remove(student.id); 
            logActivity("أرشفة", `أرشفة الطالب ${student.name} ورصيده ${student.balance} دينار`); 
        } 
    };

  const openWhatsApp = (phone) => {
    if (!phone) return;
    let cleanPhone = phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    const url = `https://wa.me/962${cleanPhone}`;
    window.open(url, '_blank');
  };
   
  return (
    <div className="space-y-6 animate-fade-in">
      {createdCreds && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"><Card className="w-full max-w-md bg-green-50 border-green-500 border-2 text-center p-8" title="تم إنشاء الحساب بنجاح"><p className="mb-4">الطالب: <strong>{createdCreds.name}</strong></p><div className="bg-white p-4 border rounded mb-4"><p>User: {createdCreds.username}</p><p>Pass: {createdCreds.password}</p></div><Button onClick={() => setCreatedCreds(null)} className="w-full">إغلاق</Button></Card></div>}
      
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
          <div className="w-1/2"><input className="border p-2 rounded w-full" placeholder="بحث..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <Button onClick={()=>{setEditingStudent(null); setShowModal(true)}}><UserPlus size={18}/> طالب جديد</Button>
      </div>

      <Card className="overflow-x-auto border-none shadow-md rounded-xl">
          <table className="w-full text-sm text-right">
              <thead className="bg-gray-50"><tr><th className="p-4">الطالب</th><th className="p-4">بيانات الدخول</th><th className="p-4">الهاتف</th><th className="p-4">الحزام</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead>
              <tbody className="divide-y">
                  {filtered.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50">
                          <td className="p-4 font-bold">{s.name}</td>
                          <td className="p-4 text-xs font-mono bg-gray-50 rounded p-2"><div className="flex flex-col gap-1"><span>U: <span className="font-bold select-all">{s.username}</span></span><span>P: <span className="font-bold text-red-500 select-all">{s.password}</span></span></div></td>
                          <td className="p-4 flex items-center gap-2"><a href={`tel:${s.phone}`} className="text-gray-900 hover:text-blue-600 transition">{s.phone}</a><button onClick={() => openWhatsApp(s.phone)} className="text-green-600 hover:bg-green-50 p-1 rounded-full"><MessageCircle size={18}/></button></td>
                          <td className="p-4">{s.belt}</td>
                          <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                          <td className="p-4 flex gap-2">
                              <button onClick={() => promoteBelt(s)} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition flex items-center gap-1 font-bold" title="ترفيع"><ArrowUp size={16}/> ترفيع</button>
                              <button onClick={() => openEditModal(s)} className="text-blue-600 bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                              <button onClick={() => archiveStudent(s)} className="text-red-600 bg-red-50 p-2 rounded"><Archive size={16}/></button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl" title={editingStudent ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}>
                <form onSubmit={editingStudent ? handleSaveEdit : addStudent} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2"><label className="block text-xs mb-1">الاسم</label><input required className="w-full border p-2 rounded" value={newS.name} onChange={e=>setNewS({...newS, name:e.target.value})} /></div>
                        {!editingStudent && (<div className="md:col-span-2 bg-blue-50 p-2 rounded border"><label className="block text-xs mb-1">العائلة</label><select className="w-full border p-2 rounded" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}><option value="new">عائلة جديدة</option>{uniqueFamilies.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></div>)}
                        <div><label className="block text-xs mb-1">الهاتف</label><input required className="w-full border p-2 rounded" value={newS.phone} onChange={e=>setNewS({...newS, phone:e.target.value})} /></div>
                        <div><label className="block text-xs mb-1">الحزام</label><select className="w-full border p-3 rounded-lg bg-white" value={newS.belt} onChange={e=>setNewS({...newS, belt:e.target.value})}>{BELTS.map(b=><option key={b}>{b}</option>)}</select></div>
                        <div><label className="block text-xs mb-1 font-bold text-red-600">الرصيد المستحق (JOD)</label><input type="number" className="w-full border p-2 rounded" value={newS.balance} onChange={e=>setNewS({...newS, balance:e.target.value})} /></div>
                        <div><label className="block text-xs mb-1">الميلاد</label><input type="date" className="w-full border p-2 rounded" value={newS.dob} onChange={e=>setNewS({...newS, dob:e.target.value})} /></div>
                        <div><label className="block text-xs mb-1">الالتحاق</label><input type="date" className="w-full border p-2 rounded" value={newS.joinDate} onChange={e=>setNewS({...newS, joinDate:e.target.value})} /></div>
                        <div><label className="block text-xs mb-1 font-bold text-green-600">نهاية الاشتراك</label><input type="date" className="w-full border p-2 rounded bg-green-50" value={newS.subEnd} onChange={e=>setNewS({...newS, subEnd:e.target.value})} /></div>
                        <div className="md:col-span-2"><label className="block text-xs mb-1">العنوان</label><input className="w-full border p-2 rounded" value={newS.address} onChange={e=>setNewS({...newS, address:e.target.value})} /></div>
                    </div>
                    <div className="flex gap-2 justify-end mt-4">
                        <Button variant="ghost" onClick={()=>setShowModal(false)}>إلغاء</Button>
                        <Button type="submit">حفظ</Button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default StudentsManager;




// src/views/dashboard/StudentsManager.jsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, Edit, Archive, ArrowUp, MessageCircle, X } from 'lucide-react'; // تأكدت من الاستيرادات
import { Button, Card, StatusBadge } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

// --- دوال مساعدة ---
const generateCredentials = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const username = `student${randomNum}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; 
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return { username, password };
};

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

// --- مكون النافذة المنبثقة (Modal) ---
const ModalOverlay = ({ children, onClose }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" onClick={e => e.stopPropagation()}>
           {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

const StudentsManager = ({ students, studentsCollection, archiveCollection, selectedBranch, logActivity }) => {
  const [search, setSearch] = useState(''); 
  const [showModal, setShowModal] = useState(false); 
  const [editingStudent, setEditingStudent] = useState(null); 
  const [createdCreds, setCreatedCreds] = useState(null);
  
  // الحالة الافتراضية
  const defaultForm = { name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0, subEnd: '', username: '', password: '' };
  const [newS, setNewS] = useState(defaultForm);
  const [linkFamily, setLinkFamily] = useState('new');
  
  const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];
  const filtered = students.filter(s => s.name.includes(search));

  const addStudent = async (e) => {
    e.preventDefault(); 
    // إذا لم يقم الأدمن بإدخال يوزر وباسورد يدوياً، نقوم بتوليدهم تلقائياً
    let finalUser = newS.username;
    let finalPass = newS.password;
    
    if (!finalUser || !finalPass) {
        const creds = generateCredentials();
        finalUser = creds.username;
        finalPass = creds.password;
    }

    let finalFamilyId, finalFamilyName;
    if (linkFamily === 'new') { 
        finalFamilyId = Math.floor(Date.now() / 1000); 
        finalFamilyName = `عائلة ${newS.name.split(' ').slice(-1)[0]}`; 
    } else { 
        finalFamilyId = parseInt(linkFamily); 
        finalFamilyName = students.find(s => s.familyId === finalFamilyId)?.familyName || "عائلة"; 
    }

    let subEnd = newS.subEnd;
    if (!subEnd) {
        const joinDateObj = new Date(newS.joinDate || new Date()); 
        const subEndDateObj = new Date(joinDateObj); 
        subEndDateObj.setMonth(subEndDateObj.getMonth() + 1); 
        subEnd = subEndDateObj.toISOString().split('T')[0];
    }
    
    const student = { 
        branch: selectedBranch, 
        status: 'active', 
        subEnd: subEnd, 
        notes: [], 
        internalNotes: [], 
        attendance: {}, 
        username: finalUser, 
        password: finalPass, 
        familyId: finalFamilyId, 
        familyName: finalFamilyName, 
        customOrder: Date.now(), 
        ...newS 
    };
    
    await studentsCollection.add(student); 
    if(logActivity) logActivity("إضافة طالب", `تم إضافة الطالب ${student.name}`);
    
    setCreatedCreds({ name: student.name, username: finalUser, password: finalPass }); 
    closeModal();
  };

  const openEditModal = (student) => { 
      setEditingStudent(student); 
      setNewS({ 
          name: student.name, 
          phone: student.phone, 
          belt: student.belt, 
          joinDate: student.joinDate, 
          dob: student.dob, 
          address: student.address || '', 
          subEnd: student.subEnd, 
          balance: student.balance,
          // هنا نضيف البيانات الموجودة مسبقاً للفورم
          username: student.username,
          password: student.password
      }); 
      setLinkFamily(student.familyId); 
      setShowModal(true); 
  };

  const closeModal = () => {
      setShowModal(false);
      setEditingStudent(null);
      setNewS(defaultForm);
      setLinkFamily('new');
  };

  const handleSaveEdit = async (e) => { 
      e.preventDefault(); 
      await studentsCollection.update(editingStudent.id, newS); 
      closeModal();
  };

  const promoteBelt = async (student) => { 
      const currentIdx = BELTS.indexOf(student.belt); 
      if(currentIdx < BELTS.length - 1) { 
          await studentsCollection.update(student.id, { belt: BELTS[currentIdx + 1] }); 
      } 
  };

  const archiveStudent = async (student) => { 
      if(confirm(`هل أنت متأكد من أرشفة الطالب ${student.name}؟`)) { 
          await archiveCollection.add({ ...student, archivedAt: new Date().toISOString().split('T')[0], originalId: student.id }); 
          await studentsCollection.remove(student.id); 
          if(logActivity) logActivity("أرشفة", `أرشفة الطالب ${student.name}`);
      } 
  };

  const openWhatsApp = (phone) => {
    if (!phone) return;
    let cleanPhone = phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    window.open(`https://wa.me/962${cleanPhone}`, '_blank');
  };
   
  return (
    <div className="space-y-6 animate-fade-in">
      {/* نافذة النجاح */}
      {createdCreds && (
        <ModalOverlay onClose={() => setCreatedCreds(null)}>
            <Card className="bg-green-50 border-green-500 border-2 text-center p-8 w-full" title="تم إنشاء الحساب بنجاح">
                <p className="mb-4">الطالب: <strong>{createdCreds.name}</strong></p>
                <div className="bg-white p-4 border rounded mb-4 dir-ltr text-left">
                    <p>User: <strong>{createdCreds.username}</strong></p>
                    <p>Pass: <strong className="text-red-600">{createdCreds.password}</strong></p>
                </div>
                <Button onClick={() => setCreatedCreds(null)} className="w-full">إغلاق</Button>
            </Card>
        </ModalOverlay>
      )}
      
      {/* البحث وزر الإضافة */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="w-1/2"><input className="border p-2 rounded w-full outline-none focus:border-yellow-500" placeholder="بحث..." value={search} onChange={e=>setSearch(e.target.value)} /></div>
          <Button onClick={()=>{setEditingStudent(null); setShowModal(true)}} className="flex items-center gap-2"><UserPlus size={18}/> طالب جديد</Button>
      </div>

      {/* الجدول */}
      <Card className="overflow-hidden border-none shadow-md rounded-xl p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-100"><tr><th className="p-4">الطالب</th><th className="p-4">بيانات الدخول</th><th className="p-4">الهاتف</th><th className="p-4">الحزام</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead>
                <tbody className="divide-y bg-white">
                    {filtered.map(s => (
                        <tr key={s.id} className="hover:bg-yellow-50">
                            <td className="p-4 font-bold">{s.name}</td>
                            <td className="p-4"><div className="bg-gray-50 p-2 rounded text-xs font-mono w-fit"><div>U: {s.username}</div><div>P: <span className="text-red-500 font-bold">{s.password}</span></div></div></td>
                            <td className="p-4 flex items-center gap-2">{s.phone} <button onClick={() => openWhatsApp(s.phone)} className="text-green-500"><MessageCircle size={16}/></button></td>
                            <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded font-bold">{s.belt}</span></td>
                            <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                            <td className="p-4 flex gap-2">
                                <button onClick={() => promoteBelt(s)} className="text-green-600 bg-green-50 p-2 rounded"><ArrowUp size={16}/></button>
                                <button onClick={() => openEditModal(s)} className="text-blue-600 bg-blue-50 p-2 rounded"><Edit size={16}/></button>
                                <button onClick={() => archiveStudent(s)} className="text-red-600 bg-red-50 p-2 rounded"><Archive size={16}/></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
          </div>
      </Card>

      {/* نافذة الإضافة/التعديل (تم إضافة حقول اليوزر والباسورد هنا) */}
      {showModal && (
        <ModalOverlay onClose={closeModal}>
            <Card className="w-full relative" title={editingStudent ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}>
                <button onClick={closeModal} className="absolute top-4 left-4 text-gray-400"><X size={24}/></button>
                <form onSubmit={editingStudent ? handleSaveEdit : addStudent} className="space-y-4 mt-4 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* --- القسم الجديد: بيانات الدخول --- */}
                        <div className="md:col-span-2 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                            <p className="text-xs font-bold text-yellow-700 mb-2">بيانات تسجيل الدخول (اتركها فارغة للتوليد التلقائي عند الإضافة)</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">اسم المستخدم</label>
                                    <input className="w-full border p-2 rounded bg-white font-mono text-left dir-ltr" value={newS.username} onChange={e=>setNewS({...newS, username:e.target.value})} placeholder="username" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">كلمة المرور</label>
                                    <input className="w-full border p-2 rounded bg-white font-mono text-left dir-ltr" value={newS.password} onChange={e=>setNewS({...newS, password:e.target.value})} placeholder="password" />
                                </div>
                            </div>
                        </div>
                        {/* ---------------------------------- */}

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الرباعي</label>
                            <input required className="w-full border p-2 rounded" value={newS.name} onChange={e=>setNewS({...newS, name:e.target.value})} />
                        </div>
                        {!editingStudent && (
                            <div className="md:col-span-2 bg-blue-50 p-2 rounded border border-blue-100">
                                <label className="block text-xs font-bold text-blue-800 mb-1">العائلة</label>
                                <select className="w-full border p-2 rounded bg-white" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}>
                                    <option value="new">عائلة جديدة</option>
                                    {uniqueFamilies.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                                </select>
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف</label>
                            <input required className="w-full border p-2 rounded" value={newS.phone} onChange={e=>setNewS({...newS, phone:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">الحزام</label>
                            <select className="w-full border p-2 rounded bg-white" value={newS.belt} onChange={e=>setNewS({...newS, belt:e.target.value})}>
                                {BELTS.map(b=><option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-red-600 mb-1">الرصيد (دينار)</label>
                            <input type="number" className="w-full border p-2 rounded bg-red-50" value={newS.balance} onChange={e=>setNewS({...newS, balance:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الميلاد</label>
                            <input type="date" className="w-full border p-2 rounded" value={newS.dob} onChange={e=>setNewS({...newS, dob:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الالتحاق</label>
                            <input type="date" className="w-full border p-2 rounded" value={newS.joinDate} onChange={e=>setNewS({...newS, joinDate:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-green-600 mb-1">نهاية الاشتراك</label>
                            <input type="date" className="w-full border p-2 rounded bg-green-50" value={newS.subEnd} onChange={e=>setNewS({...newS, subEnd:e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">العنوان</label>
                            <input className="w-full border p-2 rounded" value={newS.address} onChange={e=>setNewS({...newS, address:e.target.value})} />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end mt-4 border-t pt-4">
                        <Button type="button" variant="ghost" onClick={closeModal}>إلغاء</Button>
                        <Button type="submit">{editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}</Button>
                    </div>
                </form>
            </Card>
        </ModalOverlay>
      )}
    </div>
  );
};

export default StudentsManager;
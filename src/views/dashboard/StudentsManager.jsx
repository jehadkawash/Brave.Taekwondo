// src/views/dashboard/StudentsManager.jsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom'; // 1. استيراد البوابة
import { UserPlus, Edit, Trash2, Archive, ArrowUp, MessageCircle, X } from 'lucide-react';
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

// --- مكون النافذة المنبثقة (Modal) لترتيب الكود ---
const ModalOverlay = ({ children, onClose }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* الخلفية المعتمة */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* حاوية المحتوى لضمان التوسط والسكرول */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl" onClick={e => e.stopPropagation()}>
           {children}
        </div>
      </div>
    </div>,
    document.body // الرسم المباشر على الـ body
  );
};

const StudentsManager = ({ students, studentsCollection, archiveCollection, selectedBranch, logActivity }) => {
  const [search, setSearch] = useState(''); 
  const [showModal, setShowModal] = useState(false); 
  const [editingStudent, setEditingStudent] = useState(null); 
  const [createdCreds, setCreatedCreds] = useState(null);
  
  // الحالة الافتراضية للنموذج
  const defaultForm = { name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0, subEnd: '' };
  const [newS, setNewS] = useState(defaultForm);
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

    // حساب نهاية الاشتراك تلقائياً إذا لم يدخلها
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
        username, 
        password, 
        familyId: finalFamilyId, 
        familyName: finalFamilyName, 
        customOrder: Date.now(), 
        ...newS 
    };
    
    await studentsCollection.add(student); 
    if(logActivity) logActivity("إضافة طالب", `تم إضافة الطالب ${student.name}`);
    
    setCreatedCreds({ name: student.name, username, password }); 
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
          balance: student.balance 
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
      if(confirm(`هل أنت متأكد من أرشفة الطالب ${student.name}؟\nسيتم نقله إلى سجل الأرشيف.`)) { 
          await archiveCollection.add({ 
              ...student, 
              archivedAt: new Date().toISOString().split('T')[0], 
              originalId: student.id 
          }); 
          await studentsCollection.remove(student.id); 
          if(logActivity) logActivity("أرشفة", `أرشفة الطالب ${student.name}`);
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
      
      {/* نافذة نجاح الإنشاء (Success Modal) */}
      {createdCreds && (
        <ModalOverlay onClose={() => setCreatedCreds(null)}>
            <Card className="bg-green-50 border-green-500 border-2 text-center p-8 w-full" title="تم إنشاء الحساب بنجاح">
                <p className="mb-4 text-gray-700">تم تسجيل الطالب: <strong className="text-xl block mt-2">{createdCreds.name}</strong></p>
                <div className="bg-white p-4 border rounded-xl mb-6 shadow-sm text-left dir-ltr">
                    <p className="flex justify-between border-b pb-2 mb-2"><span>Username:</span> <span className="font-mono font-bold">{createdCreds.username}</span></p>
                    <p className="flex justify-between"><span>Password:</span> <span className="font-mono font-bold text-red-600">{createdCreds.password}</span></p>
                </div>
                <Button onClick={() => setCreatedCreds(null)} className="w-full bg-green-600 hover:bg-green-700 text-white">إغلاق</Button>
            </Card>
        </ModalOverlay>
      )}
      
      {/* شريط البحث وزر الإضافة */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="w-1/2 relative">
             <input className="border-2 border-gray-100 focus:border-yellow-500 p-2 pr-4 rounded-lg w-full outline-none transition-colors" placeholder="بحث عن طالب..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <Button onClick={()=>{setEditingStudent(null); setShowModal(true)}} className="flex items-center gap-2 bg-black text-white hover:bg-yellow-500 hover:text-black transition-colors"><UserPlus size={18}/> طالب جديد</Button>
      </div>

      {/* جدول الطلاب */}
      <Card className="overflow-hidden border-none shadow-md rounded-xl p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-100 text-gray-600"><tr><th className="p-4">الطالب</th><th className="p-4">بيانات الدخول</th><th className="p-4">الهاتف</th><th className="p-4">الحزام</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {filtered.map(s => (
                        <tr key={s.id} className="hover:bg-yellow-50 transition-colors">
                            <td className="p-4 font-bold text-gray-800">{s.name}</td>
                            <td className="p-4">
                                <div className="bg-gray-50 rounded-lg p-2 text-xs font-mono border border-gray-100 w-fit">
                                    <div className="flex gap-2"><span>U:</span><span className="font-bold">{s.username}</span></div>
                                    <div className="flex gap-2"><span>P:</span><span className="font-bold text-red-500">{s.password}</span></div>
                                </div>
                            </td>
                            <td className="p-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono dir-ltr text-gray-600">{s.phone}</span>
                                    <button onClick={() => openWhatsApp(s.phone)} className="text-[#25D366] hover:bg-green-50 p-1.5 rounded-full transition-colors"><MessageCircle size={18}/></button>
                                </div>
                            </td>
                            <td className="p-4"><span className="px-2 py-1 rounded bg-gray-100 font-bold text-xs">{s.belt}</span></td>
                            <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                            <td className="p-4 flex gap-2">
                                <button onClick={() => promoteBelt(s)} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition flex items-center gap-1 font-bold text-xs" title="ترفيع"><ArrowUp size={14}/> ترفيع</button>
                                <button onClick={() => openEditModal(s)} className="text-blue-600 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition"><Edit size={16}/></button>
                                <button onClick={() => archiveStudent(s)} className="text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition"><Archive size={16}/></button>
                            </td>
                        </tr>
                    ))}
                    {filtered.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-gray-400">لا يوجد طلاب مطابقين للبحث</td></tr>}
                </tbody>
            </table>
          </div>
      </Card>

      {/* نافذة الإضافة/التعديل (Main Modal) */}
      {showModal && (
        <ModalOverlay onClose={closeModal}>
            <Card className="w-full relative" title={editingStudent ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}>
                <button onClick={closeModal} className="absolute top-4 left-4 text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
                
                <form onSubmit={editingStudent ? handleSaveEdit : addStudent} className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الرباعي</label>
                            <input required className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2 rounded-lg outline-none transition-colors" value={newS.name} onChange={e=>setNewS({...newS, name:e.target.value})} placeholder="الاسم الكامل" />
                        </div>
                        
                        {!editingStudent && (
                            <div className="md:col-span-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <label className="block text-xs font-bold text-blue-800 mb-1">ربط العائلة (للخصومات)</label>
                                <select className="w-full border border-blue-200 p-2 rounded-lg bg-white" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}>
                                    <option value="new">تسجيل كعائلة جديدة</option>
                                    {uniqueFamilies.map(([id, name]) => <option key={id} value={id}>انضمام لـ {name}</option>)}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف</label>
                            <input required className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2 rounded-lg outline-none" value={newS.phone} onChange={e=>setNewS({...newS, phone:e.target.value})} placeholder="079xxxxxxx" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">الحزام الحالي</label>
                            <select className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2 rounded-lg bg-white outline-none" value={newS.belt} onChange={e=>setNewS({...newS, belt:e.target.value})}>
                                {BELTS.map(b=><option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-red-600 mb-1">الرصيد الافتتاحي (دينار)</label>
                            <input type="number" className="w-full border-2 border-red-50 focus:border-red-500 p-2 rounded-lg outline-none bg-red-50/50" value={newS.balance} onChange={e=>setNewS({...newS, balance:e.target.value})} placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الميلاد</label>
                            <input type="date" className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2 rounded-lg outline-none" value={newS.dob} onChange={e=>setNewS({...newS, dob:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الالتحاق</label>
                            <input type="date" className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2 rounded-lg outline-none" value={newS.joinDate} onChange={e=>setNewS({...newS, joinDate:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-green-600 mb-1">نهاية الاشتراك (اختياري)</label>
                            <input type="date" className="w-full border-2 border-green-50 focus:border-green-500 p-2 rounded-lg outline-none bg-green-50/50" value={newS.subEnd} onChange={e=>setNewS({...newS, subEnd:e.target.value})} />
                            <p className="text-[10px] text-gray-400 mt-1">اتركه فارغاً للحساب التلقائي (شهر واحد)</p>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">العنوان</label>
                            <input className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2 rounded-lg outline-none" value={newS.address} onChange={e=>setNewS({...newS, address:e.target.value})} placeholder="المنطقة - الشارع" />
                        </div>
                    </div>
                    
                    <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-gray-100">
                        <Button type="button" variant="ghost" onClick={closeModal} className="text-gray-500 hover:bg-gray-100">إلغاء</Button>
                        <Button type="submit" className="bg-yellow-500 text-black font-bold hover:bg-yellow-400 px-8 shadow-lg shadow-yellow-500/20">
                            {editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}
                        </Button>
                    </div>
                </form>
            </Card>
        </ModalOverlay>
      )}
    </div>
  );
};

export default StudentsManager;
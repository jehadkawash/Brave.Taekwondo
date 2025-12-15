// src/views/dashboard/StudentsManager.js
import React, { useState, useMemo } from 'react';
import { UserPlus, Edit, Trash2, Archive, ArrowUp, MessageCircle, X, Save, User, Phone, MapPin, CreditCard, Calendar, Users } from 'lucide-react';
import { Button, Card, StatusBadge } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

// --- Helpers ---
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
  
  // Form State
  const [newS, setNewS] = useState({ name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0 });
  const [linkFamily, setLinkFamily] = useState('new');
  
  // Logic
  const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];
  const filtered = students.filter(s => s.name.includes(search));

  // --- Handlers ---
  const addStudent = async (e) => {
    e.preventDefault(); 
    const { username, password } = generateCredentials();
    let finalFamilyId, finalFamilyName;
    
    // --- منطق اسم العائلة الذكي ---
    if (linkFamily === 'new') { 
        finalFamilyId = Math.floor(Date.now() / 1000); 
        const nameParts = newS.name.trim().split(/\s+/);
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : newS.name;
        finalFamilyName = `عائلة ${lastName}`; 
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
    
    if(logActivity) logActivity("إضافة طالب", `تم إضافة الطالب ${student.name}`);
    
    setCreatedCreds({ name: student.name, username, password, familyName: finalFamilyName }); 
    closeModal();
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
      if(logActivity) logActivity("تعديل طالب", `تم تعديل بيانات ${newS.name}`);
      closeModal();
  };

  const closeModal = () => {
      setShowModal(false);
      setEditingStudent(null);
      setNewS({ name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0 }); 
      setLinkFamily('new');
  };

  const promoteBelt = async (student) => { 
      const currentIdx = BELTS.indexOf(student.belt); 
      if(currentIdx < BELTS.length - 1) { 
          await studentsCollection.update(student.id, { belt: BELTS[currentIdx + 1] }); 
          if(logActivity) logActivity("ترفيع", `ترفيع الطالب ${student.name}`);
      } 
  };

  const archiveStudent = async (student) => { 
      if(window.confirm(`هل أنت متأكد من أرشفة الطالب ${student.name}؟\nسيتم نقله إلى سجل الأرشيف.`)) { 
          await archiveCollection.add({ 
              ...student, 
              archivedAt: new Date().toISOString().split('T')[0], 
              originalId: student.id 
          }); 
          await studentsCollection.remove(student.id); 
          if(logActivity) logActivity("أرشفة", `أرشفة الطالب ${student.name} ورصيده ${student.balance} دينار`); 
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
      {/* Modal: بيانات الحساب الجديد */}
      {createdCreds && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
              <Card className="w-full max-w-md bg-green-50 border-green-500 border-2 text-center p-8" title="تم إنشاء الحساب بنجاح">
                  <p className="mb-2">الطالب: <strong>{createdCreds.name}</strong></p>
                  <p className="mb-4 text-sm text-gray-600">تم ضمه إلى: <strong>{createdCreds.familyName}</strong></p>
                  <div className="bg-white p-4 border rounded-xl mb-6 shadow-sm">
                      <p className="text-gray-500 text-xs mb-1">اسم المستخدم</p>
                      <p className="font-mono font-bold text-lg mb-2 select-all">{createdCreds.username}</p>
                      <p className="text-gray-500 text-xs mb-1">كلمة المرور</p>
                      <p className="font-mono font-bold text-lg text-red-600 select-all">{createdCreds.password}</p>
                  </div>
                  <Button onClick={() => setCreatedCreds(null)} className="w-full">إغلاق</Button>
              </Card>
          </div>
      )}
      
      {/* شريط البحث وزر الإضافة */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="relative w-1/2 md:w-1/3">
              <input className="w-full border p-2 pr-10 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none" placeholder="بحث عن طالب..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <Button onClick={() => { setEditingStudent(null); setShowModal(true); }} className="shadow-lg shadow-yellow-200 hover:scale-105 transition-transform">
              <UserPlus size={18}/> طالب جديد
          </Button>
      </div>

      {/* جدول الطلاب */}
      <Card className="overflow-x-auto border-none shadow-md rounded-xl" noPadding>
          <table className="w-full text-sm text-right">
              <thead className="bg-gray-50 text-gray-700 font-bold">
                  <tr>
                      <th className="p-4">الطالب</th>
                      <th className="p-4">بيانات الدخول</th>
                      <th className="p-4">الهاتف</th>
                      <th className="p-4">الحزام</th>
                      <th className="p-4">الحالة</th>
                      <th className="p-4 text-center">إجراءات</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {filtered.map(s => (
                      <tr key={s.id} className="hover:bg-yellow-50/30 transition-colors group">
                          <td className="p-4">
                              <p className="font-bold text-gray-800">{s.name}</p>
                              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{s.familyName}</span>
                          </td>
                          <td className="p-4 text-xs font-mono">
                              <div className="flex flex-col gap-1 bg-gray-50 p-2 rounded border border-gray-100 w-fit">
                                  <span>U: <span className="font-bold select-all text-black">{s.username}</span></span>
                                  <span>P: <span className="font-bold select-all text-red-500">{s.password}</span></span>
                              </div>
                          </td>
                          <td className="p-4">
                              <div className="flex items-center gap-2">
                                  <a href={`tel:${s.phone}`} className="text-gray-600 hover:text-blue-600 font-medium dir-ltr">{s.phone}</a>
                                  <button onClick={() => openWhatsApp(s.phone)} className="text-green-500 hover:bg-green-100 p-1 rounded-full"><MessageCircle size={16}/></button>
                              </div>
                          </td>
                          <td className="p-4"><span className="px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">{s.belt}</span></td>
                          <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                          <td className="p-4">
                              <div className="flex justify-center gap-2">
                                  <button onClick={() => promoteBelt(s)} className="bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-100 transition" title="ترفيع"><ArrowUp size={16}/></button>
                                  <button onClick={() => openEditModal(s)} className="text-blue-600 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition" title="تعديل"><Edit size={16}/></button>
                                  <button onClick={() => archiveStudent(s)} className="text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition" title="أرشفة"><Archive size={16}/></button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-gray-400 py-8">لا يوجد طلاب مطابقين للبحث</p>}
      </Card>

      {/* --- التصميم الجديد والواسع للنافذة (MODAL) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            {/* جعلنا العرض 4xl ليكون أوسع ومريحاً أكثر */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in my-4">
                
                {/* رأس النافذة */}
                <div className="bg-gray-50 px-8 py-5 border-b flex justify-between items-center sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        {editingStudent ? <Edit className="text-blue-500"/> : <UserPlus className="text-green-500"/>}
                        {editingStudent ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
                    </h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition p-1 bg-white rounded-full border shadow-sm"><X size={20}/></button>
                </div>

                {/* جسم النموذج */}
                <form onSubmit={editingStudent ? handleSaveEdit : addStudent} className="p-8 bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* العمود الأول: البيانات الشخصية */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                                <User size={16}/> البيانات الشخصية
                            </h4>
                            
                            {/* الاسم الكامل */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الرباعي</label>
                                <div className="relative">
                                    <input 
                                        required 
                                        className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:outline-none transition-all" 
                                        value={newS.name} 
                                        onChange={e=>setNewS({...newS, name:e.target.value})} 
                                        placeholder="مثال: محمد كمال محمد..." 
                                    />
                                    <User className="absolute right-3 top-3.5 text-gray-400" size={20}/>
                                </div>
                            </div>

                            {/* العائلة */}
                            {!editingStudent && (
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                        <Users size={16}/> العائلة (لضم الأخوة)
                                    </label>
                                    <select 
                                        className="w-full border border-blue-200 p-3 rounded-lg bg-white focus:ring-2 focus:ring-blue-300 outline-none" 
                                        value={linkFamily} 
                                        onChange={e => setLinkFamily(e.target.value)}
                                    >
                                        <option value="new">-- عائلة جديدة (تسمية تلقائية حسب الاسم الأخير) --</option>
                                        {uniqueFamilies.map(([id, name]) => <option key={id} value={id}>ضم إلى: {name}</option>)}
                                    </select>
                                    <p className="text-xs text-blue-600 mt-2">سيقوم النظام بتسمية العائلة تلقائياً في حال اخترت "عائلة جديدة".</p>
                                </div>
                            )}

                            {/* الهاتف والعنوان */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                                    <div className="relative">
                                        <input 
                                            required 
                                            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none dir-ltr text-right" 
                                            value={newS.phone} 
                                            onChange={e=>setNewS({...newS, phone:e.target.value})} 
                                        />
                                        <Phone className="absolute right-3 top-3.5 text-gray-400" size={20}/>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label>
                                    <div className="relative">
                                        <input 
                                            className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" 
                                            value={newS.address} 
                                            onChange={e=>setNewS({...newS, address:e.target.value})} 
                                        />
                                        <MapPin className="absolute right-3 top-3.5 text-gray-400" size={20}/>
                                    </div>
                                </div>
                            </div>

                            {/* تاريخ الميلاد */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الميلاد</label>
                                <input 
                                    type="date" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" 
                                    value={newS.dob} 
                                    onChange={e=>setNewS({...newS, dob:e.target.value})} 
                                />
                            </div>
                        </div>

                        {/* العمود الثاني: بيانات الاشتراك والمالية */}
                        <div className="space-y-6">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
                                <CreditCard size={16}/> بيانات الاشتراك
                            </h4>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">الحزام</label>
                                    <select 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-yellow-400 outline-none" 
                                        value={newS.belt} 
                                        onChange={e=>setNewS({...newS, belt:e.target.value})}
                                    >
                                        {BELTS.map(b=><option key={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الالتحاق</label>
                                    <input 
                                        type="date" 
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-400 outline-none" 
                                        value={newS.joinDate} 
                                        onChange={e=>setNewS({...newS, joinDate:e.target.value})} 
                                    />
                                </div>
                            </div>

                            {/* قسم المالية المميز */}
                            <div className="bg-red-50 p-5 rounded-xl border-2 border-red-100">
                                <label className="block text-sm font-bold text-red-800 mb-2">الرصيد المستحق (ذمم)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="w-full pl-12 pr-4 py-3 border border-red-200 rounded-xl text-red-600 font-bold text-lg focus:ring-2 focus:ring-red-400 outline-none" 
                                        value={newS.balance} 
                                        onChange={e=>setNewS({...newS, balance:e.target.value})} 
                                    />
                                    <span className="absolute left-4 top-3.5 text-red-400 font-bold text-sm">JOD</span>
                                </div>
                                <p className="text-xs text-red-500 mt-2">* المبلغ الذي يدين به الطالب للأكاديمية حالياً.</p>
                            </div>

                            <div className="bg-green-50 p-5 rounded-xl border-2 border-green-100">
                                <label className="block text-sm font-bold text-green-800 mb-2">تاريخ نهاية الاشتراك</label>
                                <input 
                                    type="date" 
                                    className="w-full px-4 py-3 border border-green-200 rounded-xl bg-white text-green-700 font-bold focus:ring-2 focus:ring-green-400 outline-none" 
                                    value={newS.subEnd} 
                                    onChange={e=>setNewS({...newS, subEnd:e.target.value})} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                        <Button variant="ghost" onClick={closeModal} className="px-6 hover:bg-gray-100 text-gray-600 h-12">إلغاء</Button>
                        <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 h-12 shadow-lg flex items-center gap-2 font-bold text-lg">
                            <Save size={20}/> {editingStudent ? "حفظ التعديلات" : "إضافة الطالب"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default StudentsManager;
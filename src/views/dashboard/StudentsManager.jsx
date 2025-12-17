// src/views/dashboard/StudentsManager.jsx
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  UserPlus, Edit, Archive, ArrowUp, MessageCircle, Phone, 
  X, Search, Filter, SortAsc, SortDesc, Send, Sparkles 
} from 'lucide-react';
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

const isNewStudent = (joinDate) => {
    if (!joinDate) return false;
    const today = new Date();
    const join = new Date(joinDate);
    const diffTime = Math.abs(today - join);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7; // يعتبر جديد إذا له أسبوع أو أقل
};

// --- مكون النافذة المنبثقة (Modal) ---
const ModalOverlay = ({ children, onClose }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl text-right shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl bg-white" onClick={e => e.stopPropagation()}>
           {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

const StudentsManager = ({ students, studentsCollection, archiveCollection, selectedBranch, logActivity }) => {
  // States for Search & Filter
  const [search, setSearch] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, near_end, expired
  const [sortOption, setSortOption] = useState('joinDateDesc'); // joinDateDesc, beltDesc, balanceDesc

  // States for Modals
  const [showModal, setShowModal] = useState(false); 
  const [editingStudent, setEditingStudent] = useState(null); 
  const [createdCreds, setCreatedCreds] = useState(null);
  
  // Default Form
  const defaultForm = { name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0, subEnd: '', username: '', password: '' };
  const [newS, setNewS] = useState(defaultForm);
  const [linkFamily, setLinkFamily] = useState('new');
  
  const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];

  // --- منطق الفلترة والبحث الذكي والترتيب ---
  const processedStudents = useMemo(() => {
      let result = [...students];

      // 1. البحث (Smart Search)
      if (search) {
          const lowerSearch = search.toLowerCase();
          result = result.filter(s => 
              s.name.toLowerCase().includes(lowerSearch) || 
              s.phone.includes(lowerSearch) ||
              s.username.toLowerCase().includes(lowerSearch)
          );
      }

      // 2. فلترة الحالة (Filter)
      if (statusFilter !== 'all') {
          result = result.filter(s => calculateStatus(s.subEnd) === statusFilter);
      }

      // 3. الترتيب (Sorting)
      result.sort((a, b) => {
          switch (sortOption) {
              case 'joinDateDesc': // الأحدث التحاقاً (الافتراضي)
                  return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
              case 'joinDateAsc': 
                  return new Date(a.joinDate || 0) - new Date(b.joinDate || 0);
              case 'beltDesc': // الحزام: من الأعلى للأسفل
                  return BELTS.indexOf(b.belt) - BELTS.indexOf(a.belt);
              case 'beltAsc': 
                  return BELTS.indexOf(a.belt) - BELTS.indexOf(b.belt);
              case 'balanceDesc': // الأكثر مديونية أولاً
                  return b.balance - a.balance;
              default:
                  return 0;
          }
      });

      return result;
  }, [students, search, statusFilter, sortOption]);

  // --- العمليات ---
  const addStudent = async (e) => {
    e.preventDefault(); 
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
    
    setCreatedCreds({ name: student.name, username: finalUser, password: finalPass, phone: student.phone }); 
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

  // --- واتساب ---
  const openWhatsAppChat = (phone) => {
    if (!phone) return;
    let cleanPhone = phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    window.open(`https://wa.me/962${cleanPhone}`, '_blank');
  };

  const sendCredentialsWhatsApp = (student) => {
    if (!student.phone) return;
    let cleanPhone = student.phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    
    const message = `مرحباً ${student.name} 🥋\n\nأهلاً بك في أكاديمية Brave Taekwondo!\nإليك بيانات الدخول الخاصة بك للتطبيق:\n\n👤 اسم المستخدم: ${student.username}\n🔑 كلمة المرور: ${student.password}\n\nنتمنى لك التوفيق يا بطل! 💪`;
    
    window.open(`https://wa.me/962${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };
   
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* نافذة نجاح الإنشاء */}
      {createdCreds && (
        <ModalOverlay onClose={() => setCreatedCreds(null)}>
            <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Sparkles size={32}/>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">تم تسجيل البطل بنجاح!</h2>
                <p className="text-gray-600 mb-6">الطالب: <strong>{createdCreds.name}</strong></p>
                
                <div className="bg-gray-50 p-4 border rounded-xl mb-6 dir-ltr text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-yellow-400 text-xs font-bold text-black rounded-bl-lg">Credentials</div>
                    <p className="font-mono text-sm mb-1">User: <strong className="text-lg text-blue-900 select-all">{createdCreds.username}</strong></p>
                    <p className="font-mono text-sm">Pass: <strong className="text-lg text-red-600 select-all">{createdCreds.password}</strong></p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => sendCredentialsWhatsApp(createdCreds)} className="bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2">
                        <Send size={18}/> إرسال واتساب
                    </Button>
                    <Button variant="outline" onClick={() => setCreatedCreds(null)}>إغلاق</Button>
                </div>
            </div>
        </ModalOverlay>
      )}
      
      {/* --- شريط الأدوات (بحث + فلترة) --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* البحث الذكي */}
          <div className="relative w-full md:w-1/3">
             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search size={18} className="text-gray-400"/>
             </div>
             <input 
                className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-100 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all" 
                placeholder="ابحث عن اسم، هاتف، يوزر..." 
                value={search} 
                onChange={e=>setSearch(e.target.value)} 
                list="students-suggestions" // ربط بالقائمة المنسدلة
             />
             {/* القائمة المقترحة */}
             <datalist id="students-suggestions">
                {students.map(s => <option key={s.id} value={s.name} />)}
             </datalist>
          </div>

          {/* الفلاتر */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
             
             {/* فلتر الحالة */}
             <div className="relative">
                 <select 
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pr-8 pl-8 rounded-xl focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-bold"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                 >
                    <option value="all">كل الحالات</option>
                    <option value="active">🟢 فعال</option>
                    <option value="near_end">🟡 قارب الانتهاء</option>
                    <option value="expired">🔴 منتهي</option>
                 </select>
                 <Filter size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 pointer-events-none"/>
             </div>

             {/* ترتيب */}
             <div className="relative">
                 <select 
                    className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pr-8 pl-8 rounded-xl focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-bold"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                 >
                    <option value="joinDateDesc">📅 الأحدث التحاقاً</option>
                    <option value="joinDateAsc">📅 الأقدم التحاقاً</option>
                    <option value="beltDesc">🥋 أعلى حزام</option>
                    <option value="balanceDesc">💰 الأكثر مديونية</option>
                 </select>
                 {sortOption.includes('Desc') ? 
                    <SortDesc size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 pointer-events-none"/> :
                    <SortAsc size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 pointer-events-none"/>
                 }
             </div>

             <Button onClick={()=>{setEditingStudent(null); setShowModal(true)}} className="whitespace-nowrap flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                <UserPlus size={18}/> طالب جديد
             </Button>
          </div>
      </div>

      {/* الجدول */}
      <Card className="overflow-hidden border-none shadow-md rounded-2xl p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                    <tr>
                        <th className="p-4 font-bold">الطالب</th>
                        <th className="p-4 font-bold">معلومات الاتصال</th>
                        <th className="p-4 font-bold">بيانات الدخول</th>
                        <th className="p-4 font-bold">الحزام</th>
                        <th className="p-4 font-bold">الحالة المالية</th>
                        <th className="p-4 font-bold">الاشتراك</th>
                        <th className="p-4 font-bold">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {processedStudents.map(s => {
                        const isNew = isNewStudent(s.joinDate);
                        return (
                            <tr key={s.id} className="hover:bg-yellow-50/50 transition-colors group">
                                
                                {/* الاسم + شارة جديد */}
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-gray-800 text-base">{s.name}</div>
                                        {isNew && (
                                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold border border-red-200 animate-pulse">
                                                NEW
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{s.joinDate}</div>
                                </td>

                                {/* الهاتف + اتصال + شات */}
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <a href={`tel:${s.phone}`} className="font-mono text-gray-600 hover:text-blue-600 font-bold flex items-center gap-1" title="اتصال">
                                            {s.phone} <Phone size={12} className="opacity-50"/>
                                        </a>
                                        <button 
                                            onClick={() => openWhatsAppChat(s.phone)} 
                                            className="w-8 h-8 rounded-full bg-green-50 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                                            title="محادثة واتساب"
                                        >
                                            <MessageCircle size={16}/>
                                        </button>
                                    </div>
                                </td>

                                {/* بيانات الدخول + زر الإرسال السريع */}
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-50 p-1.5 rounded-lg text-xs font-mono border border-gray-100">
                                            <div className="text-blue-900">U: {s.username}</div>
                                            <div className="text-red-600 font-bold">P: {s.password}</div>
                                        </div>
                                        <button 
                                            onClick={() => sendCredentialsWhatsApp(s)}
                                            className="text-gray-400 hover:text-[#25D366] transition-colors"
                                            title="إرسال البيانات عبر واتساب"
                                        >
                                            <Send size={16}/>
                                        </button>
                                    </div>
                                </td>

                                <td className="p-4">
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold text-xs border border-gray-200">{s.belt}</span>
                                </td>
                                
                                <td className="p-4">
                                    {s.balance > 0 ? 
                                        <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs">عليه {s.balance}</span> : 
                                        <span className="text-green-600 font-bold text-xs">خالص</span>
                                    }
                                </td>

                                <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                                
                                <td className="p-4">
                                    <div className="flex gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => promoteBelt(s)} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-600 hover:text-white transition" title="ترفيع"><ArrowUp size={16}/></button>
                                        <button onClick={() => openEditModal(s)} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition" title="تعديل"><Edit size={16}/></button>
                                        <button onClick={() => archiveStudent(s)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition" title="أرشفة"><Archive size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {processedStudents.length === 0 && (
                        <tr>
                            <td colSpan="7" className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                <Search size={48} className="mb-4 opacity-20"/>
                                <p>لا يوجد طلاب مطابقين للبحث</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
          </div>
      </Card>

      {/* نافذة الإضافة/التعديل */}
      {showModal && (
        <ModalOverlay onClose={closeModal}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800">{editingStudent ? "تعديل بيانات الطالب" : "إضافة بطل جديد"}</h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
                </div>
                
                <form onSubmit={editingStudent ? handleSaveEdit : addStudent} className="space-y-4 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* قسم بيانات الدخول */}
                        <div className="md:col-span-2 bg-gradient-to-r from-yellow-50 to-white p-4 rounded-xl border border-yellow-200 mb-2">
                            <p className="text-xs font-bold text-yellow-700 mb-3 flex items-center gap-1">
                                <Sparkles size={12}/> بيانات تسجيل الدخول (اتركها فارغة للتوليد التلقائي)
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Username</label>
                                    <input className="w-full border border-gray-200 p-2 rounded-lg bg-white font-mono text-left dir-ltr focus:border-yellow-500 outline-none" value={newS.username} onChange={e=>setNewS({...newS, username:e.target.value})} placeholder="Auto-generated" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">Password</label>
                                    <input className="w-full border border-gray-200 p-2 rounded-lg bg-white font-mono text-left dir-ltr focus:border-yellow-500 outline-none" value={newS.password} onChange={e=>setNewS({...newS, password:e.target.value})} placeholder="Auto-generated" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">الاسم الرباعي</label>
                            <input required className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2.5 rounded-xl outline-none transition-all" value={newS.name} onChange={e=>setNewS({...newS, name:e.target.value})} placeholder="مثال: أحمد محمد علي" />
                        </div>

                        {!editingStudent && (
                            <div className="md:col-span-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <label className="block text-xs font-bold text-blue-800 mb-1">العائلة (للخصومات)</label>
                                <select className="w-full border border-blue-200 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}>
                                    <option value="new">تسجيل كعائلة جديدة</option>
                                    {uniqueFamilies.map(([id, name]) => <option key={id} value={id}>انضمام لـ {name}</option>)}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">رقم الهاتف</label>
                            <input required className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.phone} onChange={e=>setNewS({...newS, phone:e.target.value})} placeholder="079xxxxxxx" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">الحزام الحالي</label>
                            <select className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2.5 rounded-xl bg-white outline-none" value={newS.belt} onChange={e=>setNewS({...newS, belt:e.target.value})}>
                                {BELTS.map(b=><option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-red-600 mb-1">الرصيد الافتتاحي (دينار)</label>
                            <input type="number" className="w-full border-2 border-red-50 focus:border-red-500 p-2.5 rounded-xl outline-none bg-red-50/30" value={newS.balance} onChange={e=>setNewS({...newS, balance:e.target.value})} placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الميلاد</label>
                            <input type="date" className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.dob} onChange={e=>setNewS({...newS, dob:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">تاريخ الالتحاق</label>
                            <input type="date" className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.joinDate} onChange={e=>setNewS({...newS, joinDate:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-green-600 mb-1">نهاية الاشتراك</label>
                            <input type="date" className="w-full border-2 border-green-50 focus:border-green-500 p-2.5 rounded-xl outline-none bg-green-50/30" value={newS.subEnd} onChange={e=>setNewS({...newS, subEnd:e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1">العنوان</label>
                            <input className="w-full border-2 border-gray-100 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.address} onChange={e=>setNewS({...newS, address:e.target.value})} placeholder="المدينة - المنطقة - الشارع" />
                        </div>
                    </div>
                    
                    <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-gray-100">
                        <Button type="button" variant="ghost" onClick={closeModal} className="text-gray-500 hover:bg-gray-100">إلغاء</Button>
                        <Button type="submit" className="bg-yellow-500 text-black font-bold hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 px-8">
                            {editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب'}
                        </Button>
                    </div>
                </form>
            </div>
        </ModalOverlay>
      )}
    </div>
  );
};

export default StudentsManager;
// src/views/dashboard/StudentsManager.jsx
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  UserPlus, Edit, Archive, ArrowUp, MessageCircle, Phone, 
  X, Search, Filter, SortAsc, SortDesc, Send, Sparkles, 
  Lock, Bell, FileWarning, Trash2, CheckCircle, Megaphone, CheckSquare, CalendarClock 
} from 'lucide-react';
import { Button, Card, StatusBadge } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';
import { writeBatch, doc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';

// --- Helper Functions ---
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

// --- Helper: Date Formatter (dd/mm/yyyy) ---
const formatDate = (dateString) => {
  if (!dateString) return '-';
  // Check if it's a Date object
  const d = new Date(dateString);
  // Check if date is valid
  if (isNaN(d.getTime())) return dateString;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
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
    return diffDays <= 7;
};

// --- Modal Components ---
const ModalOverlay = ({ children, onClose }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto" role="dialog">
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

// --- 1. Broadcast Modal ---
const BroadcastModal = ({ isOpen, onClose, groups, allStudents, onSend }) => {
    const [target, setTarget] = useState('all'); 
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedStudentIds, setSelectedStudentIds] = useState([]); 
    const [studentSearch, setStudentSearch] = useState(''); 
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const filteredStudentsForSelect = allStudents.filter(s => 
        s.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const toggleStudentSelect = (id) => {
        if (selectedStudentIds.includes(id)) {
            setSelectedStudentIds(prev => prev.filter(sid => sid !== id));
        } else {
            setSelectedStudentIds(prev => [...prev, id]);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) return alert("الرجاء كتابة الرسالة");
        
        if (target === 'custom' && selectedStudentIds.length === 0) return alert("الرجاء اختيار طالب واحد على الأقل");

        setLoading(true);
        await onSend(target, selectedGroup, message, selectedStudentIds);
        setLoading(false);
        setMessage('');
        setSelectedStudentIds([]);
        onClose();
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">
                    <Megaphone size={24}/> إرسال تعميم / إعلان
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">لمن تريد إرسال الإعلان؟</label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200">
                                <input type="radio" name="target" value="all" checked={target === 'all'} onChange={() => setTarget('all')} />
                                <span>الكل (جميع الطلاب)</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200">
                                <input type="radio" name="target" value="group" checked={target === 'group'} onChange={() => { setTarget('group'); if(groups.length > 0) setSelectedGroup(groups[0]); }} />
                                <span>فترة / مجموعة محددة</span>
                            </label>

                            {target === 'group' && (
                                <div className="mr-6 mb-2">
                                    <select className="w-full border-2 border-gray-200 p-2 rounded-xl outline-none" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                                        {groups.map((g, i) => <option key={i} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            )}

                            <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-200">
                                <input type="radio" name="target" value="custom" checked={target === 'custom'} onChange={() => setTarget('custom')} />
                                <span>تحديد طلاب (يدوياً)</span>
                            </label>

                            {target === 'custom' && (
                                <div className="mr-6 p-3 border border-gray-200 rounded-xl bg-white">
                                    <input 
                                        className="w-full border-b border-gray-100 p-2 mb-2 text-sm outline-none"
                                        placeholder="ابحث عن طالب..."
                                        value={studentSearch}
                                        onChange={e => setStudentSearch(e.target.value)}
                                    />
                                    <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                        {filteredStudentsForSelect.map(s => (
                                            <label key={s.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedStudentIds.includes(s.id)}
                                                    onChange={() => toggleStudentSelect(s.id)}
                                                />
                                                <span className="text-sm">{s.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs text-blue-600 font-bold">
                                        تم اختيار: {selectedStudentIds.length} طالب
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">نص الإعلان</label>
                        <textarea 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl outline-none h-32 focus:border-blue-500"
                            placeholder="اكتب الإعلان هنا... (سيظهر في صفحة الطلاب)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button variant="ghost" onClick={onClose}>إلغاء</Button>
                        <Button onClick={handleSend} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700">
                            {loading ? 'جاري الإرسال...' : 'نشر الإعلان'}
                        </Button>
                    </div>
                </div>
            </div>
        </ModalOverlay>
    );
};

// --- 2. Notes Manager Modal (Updated with Legacy Support) ---
const NotesManagerModal = ({ student, onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState('private'); 
    const [noteText, setNoteText] = useState('');

    const handleAdd = () => {
        if (!noteText.trim()) return;
        const newNote = {
            id: Date.now().toString(),
            text: noteText,
            date: formatDate(new Date()), // Use formatDate here for dd/mm/yyyy
            timestamp: new Date().toISOString()
        };
        onSave(student.id, activeTab, 'add', newNote);
        setNoteText('');
    };

    const handleDelete = (noteId, isLegacy) => {
        if (!confirm("حذف الملاحظة؟")) return;
        onSave(student.id, activeTab, 'delete', { id: noteId, isLegacy });
    };

    // ✅ دمج الملاحظات القديمة (note) مع الجديدة (internalNotes) للملاحظات الخاصة
    const notesList = useMemo(() => {
        if (activeTab === 'private') {
            let list = student.internalNotes || [];
            // إذا وجدنا ملاحظة قديمة نصية، نضيفها للقائمة
            if (student.note && student.note.trim() !== '') {
                list = [...list, {
                    id: 'legacy_note',
                    text: student.note,
                    date: 'سجل قديم',
                    isLegacy: true // علامة لتمييزها
                }];
            }
            return list;
        } else {
            return student.notes || []; // الإعلانات العامة كما هي
        }
    }, [student, activeTab]);

    return (
        <ModalOverlay onClose={onClose}>
            <div className="p-0 overflow-hidden flex flex-col h-[500px]">
                <div className={`p-4 text-white flex justify-between items-center ${activeTab === 'private' ? 'bg-red-600' : 'bg-blue-600'}`}>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        {activeTab === 'private' ? <Lock size={20}/> : <Bell size={20}/>}
                        {activeTab === 'private' ? `ملاحظات خاصة: ${student.name}` : `إعلانات للطالب: ${student.name}`}
                    </h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>

                <div className="flex border-b">
                    <button 
                        onClick={() => setActiveTab('private')} 
                        className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'private' ? 'text-red-600 border-b-2 border-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Lock size={16}/> ملاحظات خاصة (للإدارة)
                    </button>
                    <button 
                        onClick={() => setActiveTab('public')} 
                        className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 ${activeTab === 'public' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Bell size={16}/> إعلانات (للطالب)
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {notesList.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            {activeTab === 'private' ? <Lock size={48} className="mb-2 opacity-20"/> : <Bell size={48} className="mb-2 opacity-20"/>}
                            <p>لا يوجد ملاحظات مسجلة</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notesList.map((note, idx) => (
                                <div key={note.id || idx} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm relative group">
                                    <p className="text-gray-800 text-sm whitespace-pre-wrap">{note.text}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="flex gap-1">
                                            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{note.date}</span>
                                            {note.isLegacy && <span className="text-[10px] text-red-600 bg-red-100 px-2 py-1 rounded-full font-bold">قديم</span>}
                                        </div>
                                        <button onClick={() => handleDelete(note.id, note.isLegacy)} className="text-red-400 hover:text-red-600 p-1">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white border-t">
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
                            placeholder={activeTab === 'private' ? "اكتب ملاحظة سرية..." : "اكتب إعلاناً للطالب..."}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <Button onClick={handleAdd} className={activeTab === 'private' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}>
                            <Send size={18}/>
                        </Button>
                    </div>
                </div>
            </div>
        </ModalOverlay>
    );
};

// --- 3. Quick Renewal Modal ---
const SubscriptionModal = ({ student, onClose, onSave }) => {
    const [date, setDate] = useState(student.subEnd || new Date().toISOString().split('T')[0]);

    const addMonths = (months) => {
        const d = new Date(date);
        d.setMonth(d.getMonth() + months);
        setDate(d.toISOString().split('T')[0]);
    };

    return (
        <ModalOverlay onClose={onClose}>
            <div className="p-6 text-right">
                <h3 className="text-xl font-bold mb-4 text-green-700 flex items-center gap-2">
                    <CalendarClock size={24}/> تجديد اشتراك: {student.name}
                </h3>
                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ انتهاء الاشتراك الجديد</label>
                    <input 
                        type="date" 
                        className="w-full border-2 border-green-100 focus:border-green-500 p-3 rounded-xl outline-none text-lg font-bold text-center bg-green-50/20"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <label className="block text-xs font-bold text-gray-400 mb-2">إضافة سريعة:</label>
                <div className="flex gap-2 mb-6">
                    <button onClick={() => addMonths(1)} className="flex-1 bg-white hover:bg-green-50 text-green-700 border border-green-200 py-3 rounded-xl font-bold text-sm transition shadow-sm hover:shadow-md">+ شهر</button>
                    <button onClick={() => addMonths(2)} className="flex-1 bg-white hover:bg-green-50 text-green-700 border border-green-200 py-3 rounded-xl font-bold text-sm transition shadow-sm hover:shadow-md">+ شهرين</button>
                    <button onClick={() => addMonths(3)} className="flex-1 bg-white hover:bg-green-50 text-green-700 border border-green-200 py-3 rounded-xl font-bold text-sm transition shadow-sm hover:shadow-md">+ 3 شهور</button>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                    <Button variant="ghost" onClick={onClose}>إلغاء</Button>
                    <Button onClick={() => onSave(student.id, date)} className="flex-1 bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20">حفظ التجديد</Button>
                </div>
            </div>
        </ModalOverlay>
    );
};


const StudentsManager = ({ students, studentsCollection, archiveCollection, selectedBranch, logActivity, groups }) => {
  const [search, setSearch] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [sortOption, setSortOption] = useState('joinDateDesc'); 

  const [showModal, setShowModal] = useState(false); 
  const [editingStudent, setEditingStudent] = useState(null); 
  const [createdCreds, setCreatedCreds] = useState(null);
  
  // States for Modals
  const [studentForNotes, setStudentForNotes] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [renewingStudent, setRenewingStudent] = useState(null); 

  // استخراج المجموعات
  const availableGroups = useMemo(() => {
      return groups ? groups.map(g => g.name) : [];
  }, [groups]);

  const defaultForm = { 
      name: '', phone: '', belt: 'أبيض', group: '', 
      joinDate: new Date().toISOString().split('T')[0], 
      dob: '', address: '', balance: 0, subEnd: '', username: '', password: '' 
  };
  
  const [newS, setNewS] = useState(defaultForm);
  const [linkFamily, setLinkFamily] = useState('new');
  
  // --- التعديل الذكي: تجميع العائلات + استنتاج الاسم المفقود ---
  const uniqueFamilies = useMemo(() => {
      const familiesMap = {};
      
      students.forEach(s => {
          if (s.familyId && s.familyId !== 'new') { 
              if (!familiesMap[s.familyId]) {
                  familiesMap[s.familyId] = {
                      name: s.familyName, // نبدأ بالاسم المسجل
                      members: [],
                      lastNames: {} // لتتبع الألقاب الأكثر تكراراً لاستنتاج اسم العائلة
                  };
              }
              
              // تقسيم الاسم للحصول على الاسم الأول واللقب
              const nameParts = s.name.trim().split(/\s+/);
              const firstName = nameParts[0];
              const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

              // إضافة اسم العضو للقائمة (بحد أقصى 3 أسماء)
              if (familiesMap[s.familyId].members.length < 3) {
                   familiesMap[s.familyId].members.push(firstName); 
              }
              
              // تسجيل اللقب لتصحيح اسم العائلة لاحقاً إذا لزم الأمر
              if (lastName) {
                  familiesMap[s.familyId].lastNames[lastName] = (familiesMap[s.familyId].lastNames[lastName] || 0) + 1;
              }
          }
      });

      return Object.entries(familiesMap).map(([id, data]) => {
          let finalName = data.name || 'عائلة';
          
          // إذا كان الاسم المسجل "عائلة" أو "Family" أو فارغ، نستنتج الاسم من ألقاب الطلاب
          const isGenericName = !finalName || finalName.trim() === 'عائلة' || finalName.trim().toLowerCase() === 'family';
          
          if (isGenericName) {
              // نجد اللقب الأكثر تكراراً في هذه العائلة
              const entries = Object.entries(data.lastNames);
              if (entries.length > 0) {
                  // ترتيب تنازلي حسب التكرار وأخذ الأول
                  const bestLastName = entries.sort((a,b) => b[1] - a[1])[0][0];
                  finalName = `عائلة ${bestLastName}`;
              }
          }

          return {
              id,
              // النص النهائي الذي سيظهر في القائمة
              displayName: `${finalName} (يشمل: ${data.members.join('، ')}...)`
          };
      });
  }, [students]);

  const processedStudents = useMemo(() => {
      let result = [...students];

      if (search) {
          const lowerSearch = search.toLowerCase();
          result = result.filter(s => 
              s.name.toLowerCase().includes(lowerSearch) || 
              s.phone.includes(lowerSearch) ||
              s.username.toLowerCase().includes(lowerSearch)
          );
      }

      if (statusFilter !== 'all') {
          result = result.filter(s => calculateStatus(s.subEnd) === statusFilter);
      }

      result.sort((a, b) => {
          switch (sortOption) {
              case 'joinDateDesc': return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
              case 'joinDateAsc': return new Date(a.joinDate || 0) - new Date(b.joinDate || 0);
              case 'beltDesc': return BELTS.indexOf(b.belt) - BELTS.indexOf(a.belt);
              case 'beltAsc': return BELTS.indexOf(a.belt) - BELTS.indexOf(b.belt);
              case 'balanceDesc': return b.balance - a.balance;
              default: return 0;
          }
      });

      return result;
  }, [students, search, statusFilter, sortOption]);

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
        // --- إصلاح توليد اسم العائلة للطلاب الجدد ---
        finalFamilyName = `عائلة ${newS.name.trim().split(/\s+/).pop()}`; 
    } else { 
        finalFamilyId = parseInt(linkFamily); 
        // هنا نستخدم الاسم من القائمة المحسنة إذا أمكن، أو نبقيه كما هو
        const existingFamily = uniqueFamilies.find(f => f.id === linkFamily.toString());
        // نأخذ الجزء الأول من الاسم المحسن (قبل القوس) ليكون هو اسم العائلة الرسمي في الداتابيز
        if (existingFamily) {
             finalFamilyName = existingFamily.displayName.split(' (')[0];
        } else {
             finalFamilyName = students.find(s => s.familyId === finalFamilyId)?.familyName || "عائلة"; 
        }
    }

    let subEnd = newS.subEnd;
    if (!subEnd) {
        const joinDateObj = new Date(newS.joinDate || new Date()); 
        const subEndDateObj = new Date(joinDateObj); 
        subEndDateObj.setMonth(subEndDateObj.getMonth() + 1); 
        subEnd = subEndDateObj.toISOString().split('T')[0];
    }
    
    const finalGroup = newS.group || (availableGroups.length > 0 ? availableGroups[0] : "الكل");

    const student = { 
        ...newS, 
        branch: selectedBranch, 
        status: 'active', 
        subEnd: subEnd, 
        notes: [], 
        internalNotes: [],
        attendance: {}, 
        familyId: finalFamilyId, 
        familyName: finalFamilyName, 
        customOrder: Date.now(), 
        group: finalGroup,
        username: finalUser, 
        password: finalPass 
    };
    
    const success = await studentsCollection.add(student); 
    
    if (success) {
        if(logActivity) logActivity("إضافة طالب", `تم إضافة الطالب ${student.name}`);
        setCreatedCreds({ name: student.name, username: finalUser, password: finalPass, phone: student.phone }); 
        closeModal();
    }
  };

  const openEditModal = (student) => { 
      setEditingStudent(student); 
      setNewS({ 
          name: student.name, 
          phone: student.phone, 
          belt: student.belt, 
          group: student.group || '', 
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

  // --- ✅ التعامل مع الملاحظات (إضافة وحذف) ---
  const handleNoteAction = async (studentId, type, action, noteObj) => {
      const student = students.find(s => s.id === studentId);
      if (!student) return;

      // ✅ التعامل مع حذف الملاحظة القديمة
      if (action === 'delete' && noteObj.isLegacy) {
          await studentsCollection.update(studentId, { note: "" }); 
          // تحديث الحالة المحلية للمودال إذا لزم الأمر (عادةً يتم عبر إعادة التصيير)
          return;
      }

      const field = type === 'private' ? 'internalNotes' : 'notes';
      let currentNotes = student[field] || [];

      let updatedNotes;
      if (action === 'add') {
          updatedNotes = [noteObj, ...currentNotes];
      } else {
          updatedNotes = currentNotes.filter(n => n.id !== noteObj.id);
      }

      await studentsCollection.update(studentId, { [field]: updatedNotes });
  };

  const handleBroadcast = async (target, groupName, text, customIds = []) => {
      let targets = [];
      
      if (target === 'all') {
          targets = students;
      } else if (target === 'group') {
          targets = students.filter(s => s.group === groupName);
      } else if (target === 'custom') {
          targets = students.filter(s => customIds.includes(s.id));
      }

      if (targets.length === 0) return alert("لا يوجد طلاب مستهدفين");

      if (!confirm(`سيتم إرسال الإعلان لـ ${targets.length} طالب. هل أنت متأكد؟`)) return;

      const newNote = {
          id: Date.now().toString(),
          text: text,
          date: formatDate(new Date()), // Use formatDate here
          timestamp: new Date().toISOString()
      };

      try {
          const batch = writeBatch(db);
          let count = 0;
          
          targets.forEach(s => {
              const sRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', s.id);
              const currentNotes = s.notes || [];
              batch.update(sRef, { notes: [newNote, ...currentNotes] });
              count++;
          });

          if (count > 0) {
              await batch.commit();
              alert("تم نشر الإعلان بنجاح!");
          }
      } catch (e) {
          console.error("Broadcast Error:", e);
          alert("حدث خطأ أثناء النشر الجماعي. تأكد من الصلاحيات.");
      }
  };

  // --- حفظ التجديد السريع ---
  const handleRenewSave = async (studentId, newDate) => {
      await studentsCollection.update(studentId, { subEnd: newDate });
      
      if(logActivity && renewingStudent) {
          logActivity("تجديد اشتراك", `تجديد اشتراك للطالب ${renewingStudent.name} (تاريخ جديد: ${formatDate(newDate)})`);
      }
      
      setRenewingStudent(null);
  };

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
    
    const message = `مرحباً ${student.name} 🔥

أهلاً بك في أكاديمية الشجاع للتايكواندو !
إليك بيانات الدخول الخاصة بك بالموقع :

👤 اسم المستخدم: ${student.username}
🔑 كلمة المرور: ${student.password}

موقعنا الالكتروني :
https://bravetkd.bar/

نتمنى لك التوفيق يا بطل! 🥋

📍 فروعنا :
✅ الفرع الأول: شفابدران – شارع رفعت شموط
📞 0795629606

✅ الفرع الثاني: أبو نصير – دوار البحرية - مجمع الفرّا التجاري
📞 0790368603`;
    
    window.open(`https://wa.me/962${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };
   
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Broadcast Modal */}
      <BroadcastModal 
         isOpen={showBroadcast}
         onClose={() => setShowBroadcast(false)}
         groups={availableGroups}
         allStudents={students} 
         onSend={handleBroadcast}
      />

      {/* Single Student Notes Modal */}
      {studentForNotes && (
          <NotesManagerModal 
              student={studentForNotes}
              onClose={() => setStudentForNotes(null)}
              onSave={handleNoteAction}
          />
      )}

      {/* Quick Renewal Modal */}
      {renewingStudent && (
          <SubscriptionModal 
              student={renewingStudent}
              onClose={() => setRenewingStudent(null)}
              onSave={handleRenewSave}
          />
      )}

      {/* Credential Success Modal */}
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
      
      {/* --- Filter Toolbar --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-20">
          <div className="relative w-full md:w-1/3">
             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search size={18} className="text-gray-400"/>
             </div>
             <input 
                className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-100 rounded-xl focus:border-yellow-500 focus:ring-4 focus:ring-yellow-500/10 outline-none transition-all" 
                placeholder="ابحث عن اسم، هاتف، يوزر..." 
                value={search} 
                onChange={e=>setSearch(e.target.value)} 
                list="students-suggestions"
             />
             <datalist id="students-suggestions">
                {students.map(s => <option key={s.id} value={s.name} />)}
             </datalist>
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
             <Button onClick={() => setShowBroadcast(true)} className="bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100 whitespace-nowrap flex items-center gap-2">
                 <Megaphone size={18}/> <span className="hidden sm:inline">إعلان للكل</span>
             </Button>

             <div className="relative min-w-[120px]">
                 <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pr-8 pl-8 rounded-xl focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-bold"
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

             <div className="relative min-w-[140px]">
                 <select 
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pr-8 pl-8 rounded-xl focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-bold"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                 >
                    <option value="joinDateDesc">📅 الأحدث</option>
                    <option value="joinDateAsc">📅 الأقدم</option>
                    <option value="beltDesc">🥋 أعلى حزام</option>
                    <option value="balanceDesc">💰 المديونية</option>
                 </select>
                 {sortOption.includes('Desc') ? 
                    <SortDesc size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 pointer-events-none"/> :
                    <SortAsc size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 pointer-events-none"/>
                 }
             </div>

             <Button onClick={()=>{setEditingStudent(null); setShowModal(true)}} className="whitespace-nowrap flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                <UserPlus size={18}/> <span className="hidden sm:inline">طالب جديد</span><span className="inline sm:hidden">جديد</span>
             </Button>
          </div>
      </div>

      {/* 1. DESKTOP VIEW (Table) */}
      <Card className="hidden md:block overflow-hidden border-none shadow-md rounded-2xl p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-100">
                    <tr>
                        <th className="p-4 font-bold">الطالب</th>
                        <th className="p-4 font-bold">الفترة</th>
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
                        
                        // ✅ التحقق من الملاحظات (القديمة والجديدة) لظهور الأيقونة
                        const hasPrivateNotes = (s.internalNotes && s.internalNotes.length > 0) || (s.note && s.note.trim() !== '');
                        const hasPublicNotes = s.notes && s.notes.length > 0;

                        return (
                            <tr key={s.id} className="hover:bg-yellow-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {hasPrivateNotes && (
                                            <button 
                                                onClick={() => setStudentForNotes(s)} 
                                                className="text-red-500 hover:scale-110 transition-transform" 
                                                title="يوجد ملاحظات خاصة!"
                                            >
                                                <FileWarning size={20} fill="currentColor" className="text-red-100"/>
                                            </button>
                                        )}
                                        <div className="font-bold text-gray-800 text-base cursor-pointer hover:text-blue-600" onClick={() => setStudentForNotes(s)}>
                                            {s.name}
                                        </div>
                                        {isNew && (
                                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold border border-red-200 animate-pulse">NEW</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">{formatDate(s.joinDate)}</div>
                                </td>
                                
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold border border-blue-100">
                                        {s.group || 'غير محدد'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <a href={`tel:${s.phone}`} className="font-mono text-gray-600 hover:text-blue-600 font-bold flex items-center gap-1" title="اتصال">
                                            {s.phone} <Phone size={12} className="opacity-50"/>
                                        </a>
                                        <button onClick={() => openWhatsAppChat(s.phone)} className="w-8 h-8 rounded-full bg-green-50 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm">
                                            <MessageCircle size={16}/>
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-gray-50 p-1.5 rounded-lg text-xs font-mono border border-gray-100">
                                            <div className="text-blue-900">U: {s.username}</div>
                                            <div className="text-red-600 font-bold">P: {s.password}</div>
                                        </div>
                                        <button onClick={() => sendCredentialsWhatsApp(s)} className="text-gray-400 hover:text-[#25D366] transition-colors"><Send size={16}/></button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-gray-100 rounded-lg font-bold text-xs border border-gray-200">{s.belt}</span>
                                </td>
                                <td className="p-4">
                                    {s.balance > 0 ? 
                                        <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-xs">عليه {s.balance}</span> : 
                                        <span className="text-green-600 font-bold text-xs">مدفوع</span>
                                    }
                                </td>
                                <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                                <td className="p-4">
                                    <div className="flex gap-1">
                                        <button onClick={() => setRenewingStudent(s)} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-600 hover:text-white transition" title="تجديد الاشتراك">
                                            <CalendarClock size={16}/>
                                        </button>

                                        <button onClick={() => setStudentForNotes(s)} className={`p-2 rounded-lg transition ${hasPublicNotes || hasPrivateNotes ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-50 text-gray-400 hover:text-yellow-600'}`} title="الملاحظات">
                                            <Lock size={16}/>
                                        </button>
                                        
                                        <button onClick={() => promoteBelt(s)} className="bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition" title="ترفيع"><ArrowUp size={16}/></button>
                                        <button onClick={() => openEditModal(s)} className="bg-gray-100 text-gray-600 p-2 rounded-lg hover:bg-gray-600 hover:text-white transition" title="تعديل"><Edit size={16}/></button>
                                        <button onClick={() => archiveStudent(s)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-600 hover:text-white transition" title="أرشفة"><Archive size={16}/></button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
          </div>
      </Card>

      {/* 2. MOBILE VIEW (Cards) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {processedStudents.map(s => {
             const isNew = isNewStudent(s.joinDate);
             const status = calculateStatus(s.subEnd);
             const hasPrivateNotes = (s.internalNotes && s.internalNotes.length > 0) || (s.note && s.note.trim() !== '');

             return (
                 <div key={s.id} className={`bg-white p-4 rounded-xl shadow-sm border ${hasPrivateNotes ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-100'} flex flex-col gap-3 relative`}>
                     {hasPrivateNotes && (
                         <div className="absolute top-4 left-14 animate-pulse">
                             <FileWarning size={20} className="text-red-500 fill-red-100"/>
                         </div>
                     )}

                     {/* Header: Name and Status */}
                     <div className="flex justify-between items-start">
                         <div>
                             <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-800 text-lg">{s.name}</h3>
                                {isNew && <span className="text-[10px] bg-red-100 text-red-600 px-2 rounded-full animate-pulse">NEW</span>}
                             </div>
                             <p className="text-xs text-gray-400 mt-0.5">منذ: {formatDate(s.joinDate)}</p>
                             <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                                 {s.group || 'غير محدد'}
                             </span>
                         </div>
                         <StatusBadge status={status} />
                     </div>

                     {/* Details Grid */}
                     <div className="grid grid-cols-2 gap-3 text-sm">
                         <div className="bg-gray-50 p-2 rounded-lg">
                             <span className="text-gray-500 text-xs block">الحزام</span>
                             <span className="font-bold text-gray-800">{s.belt}</span>
                         </div>
                         <div className={`p-2 rounded-lg ${s.balance > 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                             <span className="text-xs block opacity-70">الرصيد</span>
                             <span className="font-bold">{s.balance > 0 ? `عليه ${s.balance}` : 'مدفوع'}</span>
                         </div>
                     </div>

                     {/* Credentials Box */}
                     <div className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100 border-dashed">
                         <div className="text-xs font-mono text-gray-600">
                             <div className="mb-1"><span className="font-bold text-blue-800">U:</span> {s.username}</div>
                             <div><span className="font-bold text-red-600">P:</span> {s.password}</div>
                         </div>
                         <button onClick={() => sendCredentialsWhatsApp(s)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                             <Send size={16} />
                         </button>
                     </div>

                     {/* Footer: Actions */}
                     <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-1">
                         <div className="flex gap-2">
                             <a href={`tel:${s.phone}`} className="p-2 bg-gray-100 rounded-full text-gray-600"><Phone size={16}/></a>
                             <button onClick={() => openWhatsAppChat(s.phone)} className="p-2 bg-green-100 rounded-full text-[#25D366]"><MessageCircle size={16}/></button>
                         </div>
                         <div className="flex gap-2">
                             <button onClick={() => setRenewingStudent(s)} className="p-2 bg-green-100 text-green-700 rounded-lg">
                                 <CalendarClock size={16}/>
                             </button>

                             <button onClick={() => setStudentForNotes(s)} className={`p-2 rounded-lg ${hasPrivateNotes ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                 <Lock size={16}/>
                             </button>

                             <button onClick={() => promoteBelt(s)} className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ArrowUp size={16}/></button>
                             <button onClick={() => openEditModal(s)} className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Edit size={16}/></button>
                             <button onClick={() => archiveStudent(s)} className="p-2 bg-red-50 text-red-600 rounded-lg"><Archive size={16}/></button>
                         </div>
                     </div>
                 </div>
             )
        })}
        {processedStudents.length === 0 && (
            <div className="text-center p-8 text-gray-400">لا يوجد نتائج</div>
        )}
      </div>

      {/* --- Add/Edit Modal --- */}
      {showModal && (
        <ModalOverlay onClose={closeModal}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold text-gray-800">{editingStudent ? "تعديل بيانات الطالب" : "إضافة 'طالب' جديد"}</h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors"><X size={24}/></button>
                </div>
                
                <form onSubmit={editingStudent ? handleSaveEdit : addStudent} className="space-y-4 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-blue-800 mb-1">الفترة / المجموعة</label>
                             <select 
                                className="w-full border-2 border-blue-100 focus:border-blue-500 p-2.5 rounded-xl bg-blue-50/50 outline-none"
                                value={newS.group}
                                onChange={e=>setNewS({...newS, group:e.target.value})}
                             >
                                <option value="">بدون تحديد</option>
                                {availableGroups.map((g, idx) => (
                                    <option key={idx} value={g}>{g}</option>
                                ))}
                             </select>
                        </div>

                        {/* --- القائمة الجديدة للعائلات --- */}
                        {!editingStudent && (
                            <div className="md:col-span-2 bg-blue-50 p-3 rounded-xl border border-blue-100">
                                <label className="block text-xs font-bold text-blue-800 mb-1">العائلة (للخصومات)</label>
                                <select className="w-full border border-blue-200 p-2 rounded-lg bg-white focus:ring-2 focus:ring-blue-200 outline-none" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}>
                                    <option value="new">تسجيل كعائلة جديدة</option>
                                    {uniqueFamilies.map((f) => (
                                        <option key={f.id} value={f.id}>
                                            انضمام لـ {f.displayName}
                                        </option>
                                    ))}
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
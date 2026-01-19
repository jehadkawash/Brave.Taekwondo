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
  const d = new Date(dateString);
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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl text-right shadow-2xl shadow-black/50 transition-all sm:my-8 sm:w-full sm:max-w-2xl bg-slate-900 border border-slate-700" onClick={e => e.stopPropagation()}>
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
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-400">
                    <Megaphone size={24}/> إرسال تعميم / إعلان
                </h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">لمن تريد إرسال الإعلان؟</label>
                        <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                                <input type="radio" name="target" value="all" checked={target === 'all'} onChange={() => setTarget('all')} className="accent-blue-500"/>
                                <span className="text-slate-200">الكل (جميع الطلاب)</span>
                            </label>
                            
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                                <input type="radio" name="target" value="group" checked={target === 'group'} onChange={() => { setTarget('group'); if(groups.length > 0) setSelectedGroup(groups[0]); }} className="accent-blue-500"/>
                                <span className="text-slate-200">فترة / مجموعة محددة</span>
                            </label>

                            {target === 'group' && (
                                <div className="mr-6 mb-2">
                                    <select className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-blue-500" value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                                        {groups.map((g, i) => <option key={i} value={g}>{g}</option>)}
                                    </select>
                                </div>
                            )}

                            <label className="flex items-center gap-2 cursor-pointer bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                                <input type="radio" name="target" value="custom" checked={target === 'custom'} onChange={() => setTarget('custom')} className="accent-blue-500"/>
                                <span className="text-slate-200">تحديد طلاب (يدوياً)</span>
                            </label>

                            {target === 'custom' && (
                                <div className="mr-6 p-3 border border-slate-700 rounded-xl bg-slate-950">
                                    <input 
                                        className="w-full bg-transparent border-b border-slate-800 p-2 mb-2 text-sm outline-none text-slate-200 placeholder-slate-600"
                                        placeholder="ابحث عن طالب..."
                                        value={studentSearch}
                                        onChange={e => setStudentSearch(e.target.value)}
                                    />
                                    <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                        {filteredStudentsForSelect.map(s => (
                                            <label key={s.id} className="flex items-center gap-2 p-2 hover:bg-slate-800 rounded cursor-pointer transition-colors">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedStudentIds.includes(s.id)}
                                                    onChange={() => toggleStudentSelect(s.id)}
                                                    className="accent-blue-500"
                                                />
                                                <span className="text-sm text-slate-300">{s.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-2 text-xs text-blue-400 font-bold">
                                        تم اختيار: {selectedStudentIds.length} طالب
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-300 mb-2">نص الإعلان</label>
                        <textarea 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl outline-none h-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
                            placeholder="اكتب الإعلان هنا... (سيظهر في صفحة الطلاب)"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                        <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">إلغاء</Button>
                        <Button onClick={handleSend} disabled={loading} className="bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20">
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
            if (student.note && student.note.trim() !== '') {
                list = [...list, {
                    id: 'legacy_note',
                    text: student.note,
                    date: 'سجل قديم',
                    isLegacy: true 
                }];
            }
            return list;
        } else {
            return student.notes || []; 
        }
    }, [student, activeTab]);

    return (
        <ModalOverlay onClose={onClose}>
            <div className="p-0 overflow-hidden flex flex-col h-[500px]">
                <div className={`p-4 text-white flex justify-between items-center ${activeTab === 'private' ? 'bg-red-900/80 border-b border-red-700' : 'bg-blue-900/80 border-b border-blue-700'}`}>
                    <h3 className="text-lg font-bold flex items-center gap-2 text-white">
                        {activeTab === 'private' ? <Lock size={20}/> : <Bell size={20}/>}
                        {activeTab === 'private' ? `ملاحظات خاصة: ${student.name}` : `إعلانات للطالب: ${student.name}`}
                    </h3>
                    <button onClick={onClose} className="hover:text-red-300"><X size={20}/></button>
                </div>

                <div className="flex border-b border-slate-700 bg-slate-900">
                    <button 
                        onClick={() => setActiveTab('private')} 
                        className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'private' ? 'text-red-400 border-b-2 border-red-500 bg-red-500/10' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                    >
                        <Lock size={16}/> ملاحظات خاصة (للإدارة)
                    </button>
                    <button 
                        onClick={() => setActiveTab('public')} 
                        className={`flex-1 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'public' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                    >
                        <Bell size={16}/> إعلانات (للطالب)
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
                    {notesList.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            {activeTab === 'private' ? <Lock size={48} className="mb-2 opacity-20"/> : <Bell size={48} className="mb-2 opacity-20"/>}
                            <p>لا يوجد ملاحظات مسجلة</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notesList.map((note, idx) => (
                                <div key={note.id || idx} className="bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm relative group">
                                    <p className="text-slate-300 text-sm whitespace-pre-wrap">{note.text}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="flex gap-1">
                                            <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded-full">{note.date}</span>
                                            {note.isLegacy && <span className="text-[10px] text-red-400 bg-red-900/20 px-2 py-1 rounded-full font-bold">قديم</span>}
                                        </div>
                                        <button onClick={() => handleDelete(note.id, note.isLegacy)} className="text-red-400/50 hover:text-red-500 p-1 transition-colors">
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-900 border-t border-slate-700">
                    <div className="flex gap-2">
                        <input 
                            className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500 placeholder-slate-600"
                            placeholder={activeTab === 'private' ? "اكتب ملاحظة سرية..." : "اكتب إعلاناً للطالب..."}
                            value={noteText}
                            onChange={(e) => setNoteText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <Button onClick={handleAdd} className={activeTab === 'private' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}>
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
                <h3 className="text-xl font-bold mb-4 text-emerald-400 flex items-center gap-2">
                    <CalendarClock size={24}/> تجديد اشتراك: {student.name}
                </h3>
                <div className="mb-6">
                    <label className="block text-sm font-bold text-slate-400 mb-2">تاريخ انتهاء الاشتراك الجديد</label>
                    <input 
                        type="date" 
                        className="w-full bg-emerald-900/10 border border-emerald-500/30 focus:border-emerald-500 p-3 rounded-xl outline-none text-lg font-bold text-center text-emerald-300"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <label className="block text-xs font-bold text-slate-500 mb-2">إضافة سريعة:</label>
                <div className="flex gap-2 mb-6">
                    <button onClick={() => addMonths(1)} className="flex-1 bg-slate-800 hover:bg-emerald-900/20 text-emerald-500 border border-slate-700 hover:border-emerald-500/50 py-3 rounded-xl font-bold text-sm transition-all">+ شهر</button>
                    <button onClick={() => addMonths(2)} className="flex-1 bg-slate-800 hover:bg-emerald-900/20 text-emerald-500 border border-slate-700 hover:border-emerald-500/50 py-3 rounded-xl font-bold text-sm transition-all">+ شهرين</button>
                    <button onClick={() => addMonths(3)} className="flex-1 bg-slate-800 hover:bg-emerald-900/20 text-emerald-500 border border-slate-700 hover:border-emerald-500/50 py-3 rounded-xl font-bold text-sm transition-all">+ 3 شهور</button>
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white hover:bg-slate-800">إلغاء</Button>
                    <Button onClick={() => onSave(student.id, date)} className="flex-1 bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/20">حفظ التجديد</Button>
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
                      name: s.familyName, 
                      members: [],
                      lastNames: {} 
                  };
              }
              
              const nameParts = s.name.trim().split(/\s+/);
              const firstName = nameParts[0];
              const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

              if (familiesMap[s.familyId].members.length < 3) {
                    familiesMap[s.familyId].members.push(firstName); 
              }
              
              if (lastName) {
                  familiesMap[s.familyId].lastNames[lastName] = (familiesMap[s.familyId].lastNames[lastName] || 0) + 1;
              }
          }
      });

      return Object.entries(familiesMap).map(([id, data]) => {
          let finalName = data.name || 'عائلة';
          
          const isGenericName = !finalName || finalName.trim() === 'عائلة' || finalName.trim().toLowerCase() === 'family';
          
          if (isGenericName) {
              const entries = Object.entries(data.lastNames);
              if (entries.length > 0) {
                  const bestLastName = entries.sort((a,b) => b[1] - a[1])[0][0];
                  finalName = `عائلة ${bestLastName}`;
              }
          }

          return {
              id,
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
        finalFamilyName = `عائلة ${newS.name.trim().split(/\s+/).pop()}`; 
    } else { 
        finalFamilyId = parseInt(linkFamily); 
        const existingFamily = uniqueFamilies.find(f => f.id === linkFamily.toString());
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

      if (action === 'delete' && noteObj.isLegacy) {
          await studentsCollection.update(studentId, { note: "" }); 
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
          date: formatDate(new Date()), 
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
                <div className="w-16 h-16 bg-emerald-900/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce border border-emerald-500/30">
                    <Sparkles size={32}/>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">تم تسجيل البطل بنجاح!</h2>
                <p className="text-slate-400 mb-6">الطالب: <strong>{createdCreds.name}</strong></p>
                <div className="bg-slate-950 p-4 border border-slate-700 rounded-xl mb-6 dir-ltr text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 bg-yellow-500 text-xs font-bold text-slate-900 rounded-bl-lg">Credentials</div>
                    <p className="font-mono text-sm mb-1 text-slate-400">User: <strong className="text-lg text-blue-400 select-all">{createdCreds.username}</strong></p>
                    <p className="font-mono text-sm text-slate-400">Pass: <strong className="text-lg text-red-400 select-all">{createdCreds.password}</strong></p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => sendCredentialsWhatsApp(createdCreds)} className="bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 border-none">
                        <Send size={18}/> إرسال واتساب
                    </Button>
                    <Button variant="outline" onClick={() => setCreatedCreds(null)} className="border-slate-600 text-slate-300 hover:bg-slate-800">إغلاق</Button>
                </div>
            </div>
        </ModalOverlay>
      )}
      
      {/* --- Filter Toolbar --- */}
      <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-black/20 border border-slate-800/60 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
          <div className="relative w-full md:w-1/3">
             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search size={18} className="text-slate-500"/>
             </div>
             <input 
                className="w-full bg-slate-950 text-slate-200 pl-4 pr-10 py-2.5 border border-slate-700 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all placeholder-slate-600" 
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
             <Button onClick={() => setShowBroadcast(true)} className="bg-blue-900/20 text-blue-400 border border-blue-500/30 hover:bg-blue-900/40 whitespace-nowrap flex items-center gap-2">
                 <Megaphone size={18}/> <span className="hidden sm:inline">إعلان للكل</span>
             </Button>

             <div className="relative min-w-[120px]">
                 <select 
                    className="w-full appearance-none bg-slate-950 border border-slate-700 text-slate-300 py-2.5 pr-8 pl-8 rounded-xl focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-bold"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                 >
                    <option value="all">كل الحالات</option>
                    <option value="active">🟢 فعال</option>
                    <option value="near_end">🟡 قارب الانتهاء</option>
                    <option value="expired">🔴 منتهي</option>
                 </select>
                 <Filter size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-500 pointer-events-none"/>
             </div>

             <div className="relative min-w-[140px]">
                 <select 
                    className="w-full appearance-none bg-slate-950 border border-slate-700 text-slate-300 py-2.5 pr-8 pl-8 rounded-xl focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-bold"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                 >
                    <option value="joinDateDesc">📅 الأحدث</option>
                    <option value="joinDateAsc">📅 الأقدم</option>
                    <option value="beltDesc">🥋 أعلى حزام</option>
                    <option value="balanceDesc">💰 المديونية</option>
                 </select>
                 {sortOption.includes('Desc') ? 
                    <SortDesc size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-500 pointer-events-none"/> :
                    <SortAsc size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-500 pointer-events-none"/>
                 }
             </div>

             <Button onClick={()=>{setEditingStudent(null); setShowModal(true)}} className="whitespace-nowrap flex items-center gap-2 shadow-lg shadow-yellow-500/20 text-slate-900 bg-yellow-500 hover:bg-yellow-400 border-none font-bold">
                <UserPlus size={18}/> <span className="hidden sm:inline">طالب جديد</span><span className="inline sm:hidden">جديد</span>
             </Button>
          </div>
      </div>

      {/* 1. DESKTOP VIEW (Table) */}
      <Card className="hidden md:block overflow-hidden border border-slate-800 shadow-xl rounded-2xl p-0 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
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
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                    {processedStudents.map(s => {
                        const isNew = isNewStudent(s.joinDate);
                        
                        const hasPrivateNotes = (s.internalNotes && s.internalNotes.length > 0) || (s.note && s.note.trim() !== '');
                        const hasPublicNotes = s.notes && s.notes.length > 0;

                        return (
                            <tr key={s.id} className="hover:bg-slate-800/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        {hasPrivateNotes && (
                                            <button 
                                                onClick={() => setStudentForNotes(s)} 
                                                className="text-red-500 hover:scale-110 transition-transform" 
                                                title="يوجد ملاحظات خاصة!"
                                            >
                                                <FileWarning size={20} fill="currentColor" className="text-red-900/50"/>
                                            </button>
                                        )}
                                        <div className="font-bold text-slate-200 text-base cursor-pointer hover:text-yellow-500 transition-colors" onClick={() => setStudentForNotes(s)}>
                                            {s.name}
                                        </div>
                                        {isNew && (
                                            <span className="px-2 py-0.5 rounded-full bg-red-900/30 text-red-400 text-[10px] font-bold border border-red-500/30 animate-pulse">NEW</span>
                                        )}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1">{formatDate(s.joinDate)}</div>
                                </td>
                                
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-blue-900/20 text-blue-400 rounded text-xs font-bold border border-blue-500/20">
                                        {s.group || 'غير محدد'}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <a href={`tel:${s.phone}`} className="font-mono text-slate-400 hover:text-blue-400 font-bold flex items-center gap-1" title="اتصال">
                                            {s.phone} <Phone size={12} className="opacity-50"/>
                                        </a>
                                        <button onClick={() => openWhatsAppChat(s.phone)} className="w-8 h-8 rounded-full bg-green-900/20 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm border border-green-500/20">
                                            <MessageCircle size={16}/>
                                        </button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-slate-950 p-1.5 rounded-lg text-xs font-mono border border-slate-800">
                                            <div className="text-blue-400">U: {s.username}</div>
                                            <div className="text-red-400 font-bold">P: {s.password}</div>
                                        </div>
                                        <button onClick={() => sendCredentialsWhatsApp(s)} className="text-slate-600 hover:text-[#25D366] transition-colors"><Send size={16}/></button>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-slate-800 rounded-lg font-bold text-xs border border-slate-700 text-slate-300">{s.belt}</span>
                                </td>
                                <td className="p-4">
                                    {s.balance > 0 ? 
                                        <span className="text-red-400 font-bold bg-red-900/20 px-2 py-1 rounded text-xs border border-red-500/20">عليه {s.balance}</span> : 
                                        <span className="text-emerald-400 font-bold text-xs">مدفوع</span>
                                    }
                                </td>
                                <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                                <td className="p-4">
                                    <div className="flex gap-1">
                                        <button onClick={() => setRenewingStudent(s)} className="bg-emerald-900/20 text-emerald-500 border border-emerald-500/20 p-2 rounded-lg hover:bg-emerald-600 hover:text-white transition" title="تجديد الاشتراك">
                                            <CalendarClock size={16}/>
                                        </button>

                                        <button onClick={() => setStudentForNotes(s)} className={`p-2 rounded-lg transition border ${hasPublicNotes || hasPrivateNotes ? 'bg-yellow-900/20 text-yellow-500 border-yellow-500/20' : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-yellow-500 hover:border-yellow-500/50'}`} title="الملاحظات">
                                            <Lock size={16}/>
                                        </button>
                                        
                                        <button onClick={() => promoteBelt(s)} className="bg-blue-900/20 text-blue-400 border border-blue-500/20 p-2 rounded-lg hover:bg-blue-600 hover:text-white transition" title="ترفيع"><ArrowUp size={16}/></button>
                                        <button onClick={() => openEditModal(s)} className="bg-slate-800 text-slate-400 border border-slate-700 p-2 rounded-lg hover:bg-slate-700 hover:text-white transition" title="تعديل"><Edit size={16}/></button>
                                        <button onClick={() => archiveStudent(s)} className="bg-red-900/20 text-red-400 border border-red-500/20 p-2 rounded-lg hover:bg-red-600 hover:text-white transition" title="أرشفة"><Archive size={16}/></button>
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
                 <div key={s.id} className={`bg-slate-900 p-4 rounded-xl shadow-lg border ${hasPrivateNotes ? 'border-red-900/50 ring-1 ring-red-900/30' : 'border-slate-800'} flex flex-col gap-3 relative`}>
                     {hasPrivateNotes && (
                         <div className="absolute top-4 left-14 animate-pulse">
                             <FileWarning size={20} className="text-red-500 fill-red-900"/>
                         </div>
                     )}

                     {/* Header: Name and Status */}
                     <div className="flex justify-between items-start">
                         <div>
                             <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-100 text-lg">{s.name}</h3>
                                {isNew && <span className="text-[10px] bg-red-900/40 text-red-400 px-2 rounded-full border border-red-500/40 animate-pulse">NEW</span>}
                             </div>
                             <p className="text-xs text-slate-500 mt-0.5">منذ: {formatDate(s.joinDate)}</p>
                             <span className="text-[10px] bg-blue-900/20 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded font-bold mt-1 inline-block">
                                 {s.group || 'غير محدد'}
                             </span>
                         </div>
                         <StatusBadge status={status} />
                     </div>

                     {/* Details Grid */}
                     <div className="grid grid-cols-2 gap-3 text-sm">
                         <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                             <span className="text-slate-500 text-xs block">الحزام</span>
                             <span className="font-bold text-slate-200">{s.belt}</span>
                         </div>
                         <div className={`p-2 rounded-lg border ${s.balance > 0 ? 'bg-red-900/20 text-red-400 border-red-500/20' : 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20'}`}>
                             <span className="text-xs block opacity-70">الرصيد</span>
                             <span className="font-bold">{s.balance > 0 ? `عليه ${s.balance}` : 'مدفوع'}</span>
                         </div>
                     </div>

                     {/* Credentials Box */}
                     <div className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800 border-dashed">
                         <div className="text-xs font-mono text-slate-400">
                             <div className="mb-1"><span className="font-bold text-blue-500">U:</span> {s.username}</div>
                             <div><span className="font-bold text-red-500">P:</span> {s.password}</div>
                         </div>
                         <button onClick={() => sendCredentialsWhatsApp(s)} className="p-2 bg-green-900/20 text-green-500 border border-green-500/20 rounded-lg hover:bg-green-600 hover:text-white">
                             <Send size={16} />
                         </button>
                     </div>

                     {/* Footer: Actions */}
                     <div className="flex items-center justify-between pt-3 border-t border-slate-800 mt-1">
                         <div className="flex gap-2">
                             <a href={`tel:${s.phone}`} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:bg-slate-700 border border-slate-700"><Phone size={16}/></a>
                             <button onClick={() => openWhatsAppChat(s.phone)} className="p-2 bg-green-900/20 rounded-full text-[#25D366] border border-green-500/20"><MessageCircle size={16}/></button>
                         </div>
                         <div className="flex gap-2">
                             <button onClick={() => setRenewingStudent(s)} className="p-2 bg-emerald-900/20 text-emerald-500 border border-emerald-500/20 rounded-lg">
                                 <CalendarClock size={16}/>
                             </button>

                             <button onClick={() => setStudentForNotes(s)} className={`p-2 rounded-lg border ${hasPrivateNotes ? 'bg-red-900/20 text-red-500 border-red-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                 <Lock size={16}/>
                             </button>

                             <button onClick={() => promoteBelt(s)} className="p-2 bg-blue-900/20 text-blue-500 border border-blue-500/20 rounded-lg"><ArrowUp size={16}/></button>
                             <button onClick={() => openEditModal(s)} className="p-2 bg-slate-800 text-slate-400 border border-slate-700 rounded-lg"><Edit size={16}/></button>
                             <button onClick={() => archiveStudent(s)} className="p-2 bg-red-900/20 text-red-500 border border-red-500/20 rounded-lg"><Archive size={16}/></button>
                         </div>
                     </div>
                 </div>
             )
        })}
        {processedStudents.length === 0 && (
            <div className="text-center p-8 text-slate-600">لا يوجد نتائج</div>
        )}
      </div>

      {/* --- Add/Edit Modal --- */}
      {showModal && (
        <ModalOverlay onClose={closeModal}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                    <h3 className="text-xl font-bold text-white">{editingStudent ? "تعديل بيانات الطالب" : "إضافة 'طالب' جديد"}</h3>
                    <button onClick={closeModal} className="text-slate-500 hover:text-red-500 transition-colors"><X size={24}/></button>
                </div>
                
                <form onSubmit={editingStudent ? handleSaveEdit : addStudent} className="space-y-4 text-right">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 bg-gradient-to-r from-yellow-900/20 to-slate-900 p-4 rounded-xl border border-yellow-500/20 mb-2">
                            <p className="text-xs font-bold text-yellow-500 mb-3 flex items-center gap-1">
                                <Sparkles size={12}/> بيانات تسجيل الدخول (اتركها فارغة للتوليد التلقائي)
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Username</label>
                                    <input className="w-full border border-slate-700 p-2 rounded-lg bg-slate-950 text-slate-200 font-mono text-left dir-ltr focus:border-yellow-500 outline-none placeholder-slate-600" value={newS.username} onChange={e=>setNewS({...newS, username:e.target.value})} placeholder="Auto-generated" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Password</label>
                                    <input className="w-full border border-slate-700 p-2 rounded-lg bg-slate-950 text-slate-200 font-mono text-left dir-ltr focus:border-yellow-500 outline-none placeholder-slate-600" value={newS.password} onChange={e=>setNewS({...newS, password:e.target.value})} placeholder="Auto-generated" />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 mb-1">الاسم الرباعي</label>
                            <input required className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-yellow-500 p-2.5 rounded-xl outline-none transition-all" value={newS.name} onChange={e=>setNewS({...newS, name:e.target.value})} placeholder="مثال: أحمد محمد علي" />
                        </div>

                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-blue-400 mb-1">الفترة / المجموعة</label>
                             <select 
                                 className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-blue-500 p-2.5 rounded-xl outline-none"
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
                            <div className="md:col-span-2 bg-blue-900/10 p-3 rounded-xl border border-blue-500/20">
                                <label className="block text-xs font-bold text-blue-400 mb-1">العائلة (للخصومات)</label>
                                <select className="w-full border border-slate-700 p-2 rounded-lg bg-slate-950 text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}>
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
                            <label className="block text-xs font-bold text-slate-400 mb-1">رقم الهاتف</label>
                            <input required className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.phone} onChange={e=>setNewS({...newS, phone:e.target.value})} placeholder="079xxxxxxx" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">الحزام الحالي</label>
                            <select className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.belt} onChange={e=>setNewS({...newS, belt:e.target.value})}>
                                {BELTS.map(b=><option key={b} value={b}>{b}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-red-400 mb-1">الرصيد الافتتاحي (دينار)</label>
                            <input type="number" className="w-full bg-red-900/10 border border-red-500/30 text-red-200 focus:border-red-500 p-2.5 rounded-xl outline-none placeholder-red-900/50" value={newS.balance} onChange={e=>setNewS({...newS, balance:e.target.value})} placeholder="0" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">تاريخ الميلاد</label>
                            <input type="date" className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.dob} onChange={e=>setNewS({...newS, dob:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-1">تاريخ الالتحاق</label>
                            <input type="date" className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.joinDate} onChange={e=>setNewS({...newS, joinDate:e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-emerald-400 mb-1">نهاية الاشتراك</label>
                            <input type="date" className="w-full bg-emerald-900/10 border border-emerald-500/30 text-emerald-200 focus:border-emerald-500 p-2.5 rounded-xl outline-none" value={newS.subEnd} onChange={e=>setNewS({...newS, subEnd:e.target.value})} />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 mb-1">العنوان</label>
                            <input className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-yellow-500 p-2.5 rounded-xl outline-none" value={newS.address} onChange={e=>setNewS({...newS, address:e.target.value})} placeholder="المدينة - المنطقة - الشارع" />
                        </div>
                    </div>
                    
                    <div className="flex gap-3 justify-end mt-8 pt-4 border-t border-slate-700">
                        <Button type="button" variant="ghost" onClick={closeModal} className="text-slate-400 hover:bg-slate-800 hover:text-white">إلغاء</Button>
                        <Button type="submit" className="bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 px-8 border-none">
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
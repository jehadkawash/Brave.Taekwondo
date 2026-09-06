import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  UserPlus, Edit, Archive, ArrowUp, MessageCircle, Phone,
  X, Search, MoreHorizontal, KeyRound, Send, Sparkles,
  Lock, Bell, FileWarning, Trash2, CheckCircle, Megaphone, CheckSquare, CalendarClock, Printer, RefreshCw,
  User
} from 'lucide-react';
import { Button, Card, StatusBadge } from '../../components/UIComponents';
import { BELTS, IMAGES } from '../../lib/constants';
import { writeBatch, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, appId } from '../../lib/firebase';
import StudentProfile from './StudentProfile';
import NotesManager from './NotesManager';
import { formatDate, calculateStatus } from '../../lib/utils';
import { toast } from '../../lib/toast';

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
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog">
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
        if (!message.trim()) return toast("الرجاء كتابة الرسالة", 'error');
        if (target === 'custom' && selectedStudentIds.length === 0) return toast("الرجاء اختيار طالب واحد على الأقل", 'error');

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


const StudentsManager = ({ initialStudentId, students, studentsCollection, archiveCollection, selectedBranch, logActivity, groups, debts = [], onNavigateToDebts, onNavigateToWeights, onNavigateToFinance }) => {
  const [profileStudent, setProfileStudent] = useState(() => students.find(s => s.id === initialStudentId) || null);
  const [credentialsStudentId, setCredentialsStudentId] = useState(null);
  const credentialsStudent = students.find(student => student.id === credentialsStudentId);
  const [search, setSearch] = useState(''); 
  const [groupFilter, setGroupFilter] = useState('all');
  const [beltFilter, setBeltFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [sortOption, setSortOption] = useState('joinDateDesc'); 

  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [createdCreds, setCreatedCreds] = useState(null);
  // FIX: loading state to prevent double-submit and show feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [studentForNotes, setStudentForNotes] = useState(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [renewingStudent, setRenewingStudent] = useState(null);

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
  
  // ✅ دالة مساعدة لتنظيف عرض المجموعة (تمنع الفواصل والـ Arrays)
  const formatGroupName = (group) => {
      if (!group) return 'غير محدد';
      if (Array.isArray(group)) {
          return group.length > 0 ? group[0] : 'الكل';
      }
      return group;
  };

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
              
              // FIX: Add type check — s.name might be undefined, null, or not a string
              const nameStr = (s.name && typeof s.name === 'string' ? s.name.trim() : '');
              if (!nameStr) return; // Skip if name is invalid
              
              const nameParts = nameStr.split(/\s+/);
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
          
          // FIX: Ensure finalName is a string before calling trim()
const finalNameStr = (finalName && typeof finalName === 'string' ? finalName.trim() : 'عائلة');
const isGenericName = !finalNameStr || finalNameStr === 'عائلة' || finalNameStr.toLowerCase() === 'family';
          
         let displayName = finalNameStr;
if (isGenericName) {
    const entries = Object.entries(data.lastNames);
    if (entries.length > 0) {
        const bestLastName = entries.sort((a,b) => b[1] - a[1])[0][0];
        displayName = `عائلة ${bestLastName}`;
    }
}

return { id, displayName: `${displayName} (يشمل: ${data.members.join('، ')}...)` };
      });
  }, [students]);

  const summary = useMemo(() => students.reduce((counts, student) => {
      counts[calculateStatus(student.subEnd)]++;
      return counts;
  }, { active: 0, near_end: 0, expired: 0 }), [students]);

  const debtTotals = useMemo(() => debts.reduce((totals, debt) => {
      totals[debt.studentId] = (totals[debt.studentId] || 0) + Math.max(0, Number(debt.totalAmount || 0) - Number(debt.paidAmount || 0));
      return totals;
  }, {}), [debts]);
  const filterGroups = [...new Set([...availableGroups, ...students.map(s => formatGroupName(s.group))])].filter(Boolean);
  const hasFilters = Boolean(search || statusFilter !== 'all' || groupFilter !== 'all' || beltFilter !== 'all');
  const resetFilters = () => { setSearch(''); setStatusFilter('all'); setGroupFilter('all'); setBeltFilter('all'); };
  const subscriptionTiming = (value) => {
      if (!value) return 'تاريخ الانتهاء غير محدد';
      const end = new Date(value);
      if (Number.isNaN(end.getTime())) return 'تحقق من تاريخ الانتهاء';
      const today = new Date();
      const days = Math.round((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) / 86400000);
      if (days < 0) return `منتهي منذ ${Math.abs(days)} يوم`;
      if (days === 0) return 'ينتهي اليوم';
      if (days === 1) return 'ينتهي غداً';
      return `ينتهي خلال ${days} يوم`;
  };

  const processedStudents = useMemo(() => {
      let result = [...students];

      if (search.trim()) {
          const lowerSearch = search.trim().toLowerCase();
          result = result.filter(s => 
            (s.name || '').toLowerCase().includes(lowerSearch) || 
            (s.phone || '').includes(lowerSearch) ||
            (s.username || '').toLowerCase().includes(lowerSearch)
                );
      }

      if (statusFilter !== 'all') {
          result = result.filter(s => calculateStatus(s.subEnd) === statusFilter);
      }

      if (groupFilter !== 'all') result = result.filter(s => formatGroupName(s.group) === groupFilter);
      if (beltFilter !== 'all') result = result.filter(s => s.belt === beltFilter);

      result.sort((a, b) => {
          switch (sortOption) {
              case 'joinDateDesc': return new Date(b.joinDate || 0) - new Date(a.joinDate || 0);
              case 'joinDateAsc': return new Date(a.joinDate || 0) - new Date(b.joinDate || 0);
              case 'beltDesc': return BELTS.indexOf(b.belt) - BELTS.indexOf(a.belt);
              case 'beltAsc': return BELTS.indexOf(a.belt) - BELTS.indexOf(b.belt);
              case 'balanceDesc': return (debtTotals[b.id] || 0) - (debtTotals[a.id] || 0);
              case 'nameAsc': return (a.name || '').localeCompare(b.name || '', 'ar');
              default: return 0;
          }
      });

      return result;
  }, [students, search, statusFilter, sortOption, groupFilter, beltFilter, debtTotals]);

  const handlePrintStudents = () => {
    const printWin = window.open('', 'PRINT', 'height=800,width=1100');
    const logoUrl = window.location.origin + IMAGES.LOGO;
    const dateNow = new Date().toLocaleDateString('en-GB');

    let rowsHtml = '';
    processedStudents.forEach((s, i) => {
        let displayName = s.name ? s.name.trim() : "-";
        
        // تم الإصلاح: تنظيف عرض المجموعة في الطباعة
        let groupDisplay = formatGroupName(s.group);

        const status = calculateStatus(s.subEnd);
        let statusText = 'فعال';
        let statusColor = '#166534';
        let statusBg = '#dcfce7';

        if (status === 'expired') {
            statusText = 'منتهي';
            statusColor = '#991b1b';
            statusBg = '#fee2e2';
        } else if (status === 'near_end') {
            statusText = 'قارب الانتهاء';
            statusColor = '#854d0e';
            statusBg = '#fef08a';
        }

        // FIX: نحسب الذمم من collection الذمم الجديد بدل الحقل القديم s.balance
        const studentDebts = debts.filter(d => d.studentId === s.id);
        const totalDebt    = studentDebts.reduce((acc, d) =>
            acc + Math.max(0, Number(d.totalAmount) - Number(d.paidAmount || 0)), 0);
        const balanceText  = totalDebt > 0
            ? `<span style="color:#991b1b; font-weight:bold;">عليه ${totalDebt}</span>`
            : '<span style="color:#166534;">خالص</span>';

        rowsHtml += `
            <tr>
                <td style="border:1px solid #000; padding:6px; text-align:center; font-size:12px;">${i + 1}</td>
                <td style="border:1px solid #000; padding:6px; font-weight:bold; font-size:13px;">${displayName}</td>
                <td style="border:1px solid #000; padding:6px; text-align:center; font-size:12px;">${s.belt || '-'}</td>
                <td style="border:1px solid #000; padding:6px; text-align:center; font-size:12px;">${groupDisplay}</td>
                <td style="border:1px solid #000; padding:6px; text-align:center; font-size:12px; font-family:monospace;">${s.phone || '-'}</td>
                <td style="border:1px solid #000; padding:6px; text-align:center; font-size:12px; background-color:${totalDebt > 0 ? '#fee2e2' : 'transparent'};">${balanceText}</td>
                <td style="border:1px solid #000; padding:6px; text-align:center; font-size:12px; font-family:monospace;">${formatDate(s.subEnd)}</td>
                <td style="border:1px solid #000; padding:6px; text-align:center; font-size:12px; font-weight:bold; color:${statusColor}; background-color:${statusBg};">${statusText}</td>
            </tr>
        `;
    });

    if (processedStudents.length === 0) {
        rowsHtml = `<tr><td colspan="8" style="text-align:center; padding:20px;">لا يوجد طلاب مطابقين لخيارات البحث.</td></tr>`;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>كشف بيانات الطلاب - ${selectedBranch || 'عام'}</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                @page { size: A4 landscape; margin: 10mm; }
                body { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; background: #fff; color: #000; }
                .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                .header-info h1 { margin: 0; font-size: 20px; color: #000; font-weight: 900; }
                .header-info p { margin: 5px 0 0 0; font-size: 13px; font-weight: bold; color: #444; }
                .logo { height: 60px; object-fit: contain; }
                table { width: 100%; border-collapse: collapse; font-size: 12px; }
                th { background-color: #f3f4f6; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: center; }
                td { border: 1px solid #000; }
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    th, td { border: 1px solid #000 !important; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="header-info">
                    <h1>كشف سجلات الطلاب الشامل</h1>
                    <p>الفرع: ${selectedBranch || 'عام'} | تاريخ الطباعة: ${dateNow} | العدد: ${processedStudents.length}</p>
                </div>
                <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style="width: 30px;">#</th>
                        <th style="width: 180px;">اسم الطالب</th>
                        <th style="width: 80px;">الحزام</th>
                        <th style="width: 100px;">المجموعة / الفترة</th>
                        <th style="width: 120px;">رقم الهاتف</th>
                        <th style="width: 100px;">الرصيد/المديونية</th>
                        <th style="width: 120px;">نهاية الاشتراك</th>
                        <th style="width: 100px;">حالة الاشتراك</th>
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            <div style="font-size:10px; color:#666; text-align:left; margin-top:15px;">
                تم الإنشاء بواسطة نظام إدارة أكاديمية الشجاع للتايكواندو
            </div>
            <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
        </html>
    `;
    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  const addStudent = async (e) => {
    e.preventDefault();
    // FIX: prevent double-submit
    if (isSubmitting) return;

    // تحقق بسيط
    if (!newS.name.trim()) { setSubmitError('الرجاء إدخال اسم الطالب'); return; }
    if (!newS.phone.trim()) { setSubmitError('الرجاء إدخال رقم الهاتف'); return; }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      let finalUser = newS.username;
      let finalPass = newS.password;

      if (!finalUser || !finalPass) {
        const creds = generateCredentials();
        finalUser = creds.username;
        finalPass = creds.password;
      }

      let finalFamilyId, finalFamilyName, linkedFamilyAccount = null;
      if (linkFamily === 'new') {
        finalFamilyId  = Math.floor(Date.now() / 1000);
        finalFamilyName = `عائلة ${newS.name.trim().split(/\s+/).pop()}`;
      } else {
        finalFamilyId = parseInt(linkFamily);
        const familyAccount = students.find(s => String(s.familyId) === String(linkFamily));
        linkedFamilyAccount = familyAccount || null;
        const existingFamily = uniqueFamilies.find(f => f.id === linkFamily.toString());
        if (existingFamily) {
          finalFamilyName = existingFamily.displayName.split(' (')[0];
        } else {
          finalFamilyName = students.find(s => s.familyId === finalFamilyId)?.familyName || 'عائلة';
        }
        if (familyAccount) {
          finalUser = familyAccount.username || finalUser;
          finalPass = familyAccount.password || finalPass;
        }
      }

      let subEnd = newS.subEnd;
      if (!subEnd) {
        const joinDateObj  = new Date(newS.joinDate || new Date());
        const subEndDateObj = new Date(joinDateObj);
        subEndDateObj.setMonth(subEndDateObj.getMonth() + 1);
        subEnd = subEndDateObj.toISOString().split('T')[0];
      }

      const finalGroup = newS.group || (availableGroups.length > 0 ? availableGroups[0] : 'الكل');

      const student = {
        ...newS,
        branch:          selectedBranch,
        status:          'active',
        subEnd:          subEnd,
        notes:           [],
        internalNotes:   [],
        attendance:      {},
        familyId:        finalFamilyId,
        familyName:      finalFamilyName,
        customOrder:     Date.now(),
        group:           finalGroup,
        username:        finalUser,
        password:        finalPass,
        isPasswordHashed: linkedFamilyAccount?.isPasswordHashed === true,
        ...(linkedFamilyAccount?.familyUid
          ? { familyUid: linkedFamilyAccount.familyUid,
              familyAuthEmail: linkedFamilyAccount.familyAuthEmail || null }
          : {}),
      };

      const result = await studentsCollection.add(student);

      // FIX: useCollection.add() returns DocumentReference on success, null on failure
      if (!result) {
        setSubmitError('فشل الحفظ في قاعدة البيانات. تحقق من الاتصال بالإنترنت وأذونات النظام.');
        return;
      }

      if (logActivity) logActivity('إضافة طالب', `تم إضافة الطالب ${student.name}`);
      setCreatedCreds({ name: student.name, username: finalUser, password: finalPass, phone: student.phone });
      closeModal();

    } catch (err) {
      console.error('addStudent error:', err);
      setSubmitError(`حدث خطأ غير متوقع: ${err.message || 'تحقق من الاتصال'}`);
    } finally {
      setIsSubmitting(false);
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
      setSubmitError('');
      setIsSubmitting(false);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError('');
    try {
      const ok = await studentsCollection.update(editingStudent.id, newS);
      if (ok === false) {
        setSubmitError('فشل التحديث. تحقق من الاتصال بالإنترنت.');
        return;
      }
      closeModal();
    } catch (err) {
      console.error('handleSaveEdit error:', err);
      setSubmitError(`حدث خطأ: ${err.message || 'تحقق من الاتصال'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const promoteBelt = async (student) => { 
      const currentIdx = BELTS.indexOf(student.belt); 
      if(currentIdx < BELTS.length - 1) { 
          await studentsCollection.update(student.id, { belt: BELTS[currentIdx + 1] }); 
      } 
  };

  const archiveStudent = async (student) => {
    if (!confirm(`هل أنت متأكد من أرشفة الطالب ${student.name}؟`)) return;

    // FIX BUG-3: use a Firestore batch so both operations succeed or both fail.
    // Previously: two separate awaits — if the second failed, student appeared in both collections.
    try {
      const batch = writeBatch(db);

      const archivePath = doc(db, 'artifacts', appId, 'public', 'data', 'archive', student.id);
      batch.set(archivePath, {
        ...student,
        archivedAt: new Date().toISOString().split('T')[0],
        originalId: student.id,
      });

      const studentPath = doc(db, 'artifacts', appId, 'public', 'data', 'students', student.id);
      batch.delete(studentPath);

      await batch.commit();
      if (logActivity) logActivity("أرشفة", `أرشفة الطالب ${student.name}`);
    } catch (err) {
      console.error("Archive error:", err);
      toast("حدث خطأ أثناء الأرشفة. الطالب لم يُحذف.", 'error');
    }
  };

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
      if (target === 'all') targets = students;
      else if (target === 'group') targets = students.filter(s => s.group === groupName);
      else if (target === 'custom') targets = students.filter(s => customIds.includes(s.id));

      if (targets.length === 0) return toast("لا يوجد طلاب مستهدفين", 'error');
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
              toast("تم نشر الإعلان بنجاح!", 'success');
          }
      } catch (e) {
          console.error("Broadcast Error:", e);
          toast("حدث خطأ أثناء النشر الجماعي. تأكد من الصلاحيات.", 'error');
      }
  };

  const handleRenewSave = async (studentId, newDate) => {
      if (!newDate) return toast('حدد تاريخ انتهاء الاشتراك', 'error');
      const saved = await studentsCollection.update(studentId, { subEnd: newDate });
      if (!saved) return toast('تعذر حفظ التجديد. حاول مرة أخرى.', 'error');
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

  const resetStudentPassword = async (student) => {
    if(confirm(`هل أنت متأكد من توليد كلمة مرور جديدة للطالب ${student.name}؟\nسيتم مسح كلمة مروره المشفرة القديمة.`)) {
        const newPass = Math.floor(100000 + Math.random() * 900000).toString(); 
        await studentsCollection.update(student.id, {
            password: newPass,
            isPasswordHashed: false 
        });
        if(logActivity) logActivity("إعادة تعيين كلمة مرور", `تم توليد كلمة مرور جديدة للطالب ${student.name}`);
        toast(`تم تعيين كلمة مرور جديدة للطالب: ${newPass}`, 'success');
    }
  };

  const sendCredentialsWhatsApp = (student) => {
    if (!student.phone) return;

    if (student.isPasswordHashed || (student.password && student.password.length > 30)) {
        toast("لا يمكن إرسال كلمة المرور لأنها مشفرة وسرية. الطالب يعرف كلمة مروره، وإذا نسيها يمكنك استخدام زر (Reset) لتوليد واحدة جديدة.", 'info');
        return;
    }

    let cleanPhone = student.phone.replace(/\D/g, ''); 
    if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
    
    const message = `مرحباً ${student.name} 🔥\n\nأهلاً بك في أكاديمية الشجاع للتايكواندو !\nإليك بيانات الدخول الخاصة بك بالموقع :\n\n👤 اسم المستخدم: ${student.username}\n🔑 كلمة المرور: ${student.password}\n\nموقعنا الالكتروني :\nhttps://bravetkd.bar/\n\nنتمنى لك التوفيق يا بطل! 🥋\n\n📍 فروعنا :\n✅ الفرع الأول: شفابدران – شارع رفعت شموط\n📞 0795629606\n\n✅ الفرع الثاني: أبو نصير – دوار البحرية - مجمع الفرّا التجاري\n📞 0790368603`;
    window.open(`https://wa.me/962${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };
    
  const renderActions = (student) => (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setProfileStudent(student)} className="min-h-11 flex items-center justify-center gap-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 hover:border-yellow-500 font-bold text-xs"><User size={16}/> عرض الملف</button>
        <button onClick={() => setRenewingStudent(student)} className="min-h-11 flex items-center justify-center gap-2 px-3 rounded-xl bg-emerald-900/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40 font-bold text-xs"><CalendarClock size={16}/> تجديد الاشتراك</button>
      </div>
      <details className="group/actions" onKeyDown={e => { if (e.key === 'Escape') { e.currentTarget.open = false; e.currentTarget.querySelector('summary').focus(); } }}>
        <summary className="min-h-11 cursor-pointer flex items-center gap-2 rounded-lg px-2 text-xs text-slate-400 hover:bg-slate-800 focus-visible:outline-yellow-500" aria-label={`المزيد من الإجراءات للطالب ${student.name}`}><MoreHorizontal size={18}/> المزيد</summary>
        <div className="grid grid-cols-1 gap-1 rounded-xl bg-slate-950 border border-slate-700 p-2 mt-1" onClick={e => { if (e.target.closest('button')) e.currentTarget.closest('details').open = false; }}>
          {[
            [Edit, 'تعديل البيانات', () => openEditModal(student)],
            [Lock, 'الملاحظات والإعلانات', () => setStudentForNotes(student)],
            [ArrowUp, 'ترفيع الحزام', () => promoteBelt(student)],
            [KeyRound, 'بيانات الدخول', () => setCredentialsStudentId(student.id)],
            [Archive, 'أرشفة الطالب', () => archiveStudent(student)],
          ].map(([Icon, label, action]) => <button key={label} onClick={action} className={`min-h-11 flex items-center gap-2 text-right px-3 rounded-lg hover:bg-slate-800 text-sm ${Icon === Archive ? 'text-red-400 border-t border-slate-800' : 'text-slate-300'}`}><Icon size={16}/>{label}</button>)}
        </div>
      </details>
    </div>
  );
  const renderSubscription = (student) => {
    const status = calculateStatus(student.subEnd);
    return <div className="space-y-2"><StatusBadge status={status}/><p className={`text-xs font-bold ${status === 'expired' ? 'text-red-400' : status === 'near_end' ? 'text-orange-400' : 'text-slate-300'}`}>{subscriptionTiming(student.subEnd)}</p><p className="text-xs text-slate-400">{formatDate(student.subEnd)}</p></div>;
  };
  const renderDebt = (student) => {
    const amount = debtTotals[student.id] || 0;
    return amount > 0 ? <button disabled={!onNavigateToDebts} onClick={() => onNavigateToDebts?.()} className="text-red-400 font-bold text-sm min-h-11 disabled:cursor-default" title="عرض الذمم">عليه {amount.toLocaleString('ar-JO', { maximumFractionDigits: 2 })} د.أ</button> : <span className="text-slate-300 font-bold text-sm">لا توجد ذمم</span>;
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans" dir="rtl">
      
      {credentialsStudent && <ModalOverlay onClose={() => setCredentialsStudentId(null)}>
        <div className="p-6 space-y-5" dir="rtl">
          <div className="flex justify-between items-start gap-3"><div><h2 className="text-xl font-bold text-slate-100">بيانات الدخول</h2><p className="text-sm text-slate-400 mt-1">{credentialsStudent.name}</p></div><button onClick={() => setCredentialsStudentId(null)} aria-label="إغلاق بيانات الدخول" className="p-3 text-slate-400 rounded-lg hover:bg-slate-800"><X size={20}/></button></div>
          <div className="bg-slate-950 rounded-xl border border-slate-700 p-4 space-y-4"><div><p className="text-xs text-slate-400 mb-1">اسم المستخدم</p><p dir="ltr" className="text-right text-slate-200 font-mono break-all select-all">{credentialsStudent.username || 'غير محدد'}</p></div><div><p className="text-xs text-slate-400 mb-1">كلمة المرور</p><p className="text-slate-400 tracking-widest">••••••••</p></div></div>
          <p className="text-sm text-slate-400">كلمة المرور مخفية. يمكنك إعادة تعيينها عند الحاجة أو فتح واتساب لإرسال بيانات الدخول المتاحة.</p>
          <div className="flex flex-wrap gap-2"><Button variant="secondary" onClick={() => resetStudentPassword(credentialsStudent)} className="bg-slate-800 text-slate-200 border border-slate-700 min-h-11"><RefreshCw size={16}/> إعادة تعيين كلمة المرور</Button><button type="button" disabled={!credentialsStudent.phone} onClick={() => sendCredentialsWhatsApp(credentialsStudent)} className="px-4 py-2 rounded-xl flex items-center gap-2 bg-emerald-900/20 text-emerald-400 border border-emerald-500/30 min-h-11 disabled:opacity-50"><MessageCircle size={16}/> فتح واتساب</button></div>
        </div>
      </ModalOverlay>}

      <BroadcastModal isOpen={showBroadcast} onClose={() => setShowBroadcast(false)} groups={availableGroups} allStudents={students} onSend={handleBroadcast} />

      {studentForNotes && <ModalOverlay onClose={() => setStudentForNotes(null)}><div className="p-4 max-h-[85vh] overflow-y-auto"><button onClick={() => setStudentForNotes(null)} aria-label="إغلاق الملاحظات" className="p-3 text-slate-400"><X size={20}/></button><NotesManager key={studentForNotes.id} embedded initialStudentId={studentForNotes.id} students={students} studentsCollection={studentsCollection} selectedBranch={selectedBranch} logActivity={logActivity}/></div></ModalOverlay>}

      {renewingStudent && <SubscriptionModal student={renewingStudent} onClose={() => setRenewingStudent(null)} onSave={handleRenewSave} />}

      {/* ── Student Profile (full-screen modal) ── */}
      {profileStudent && (
        <StudentProfile
          key={profileStudent.id}
          student={students.find(s => s.id === profileStudent.id) || profileStudent}
          onSelectStudent={setProfileStudent}
          onRenew={() => { setRenewingStudent(students.find(s => s.id === profileStudent.id) || profileStudent); setProfileStudent(null); }}
          allStudents={students}
          studentsCollection={studentsCollection}
          archiveCollection={archiveCollection}
          selectedBranch={selectedBranch}
          logActivity={logActivity}
          onClose={() => setProfileStudent(null)}
          onOpenDebts={onNavigateToDebts ? () => { setProfileStudent(null); onNavigateToDebts(profileStudent.id); } : null}
          onOpenWeights={onNavigateToWeights ? () => { setProfileStudent(null); onNavigateToWeights(profileStudent.id); } : null}
          onOpenFinance={onNavigateToFinance ? () => { setProfileStudent(null); onNavigateToFinance(profileStudent.id); } : null}
        />
      )}

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
      
      <section dir="rtl" className="space-y-5" aria-label="إدارة الطلاب">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-100">الطلاب</h2>
            <p className="text-sm text-slate-400 mt-1">تابع الاشتراكات واعثر على الطالب بسرعة · {selectedBranch}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handlePrintStudents} className="bg-slate-800 text-slate-300 border border-slate-700"><Printer size={16}/> طباعة النتائج</Button>
            <Button variant="secondary" onClick={() => setShowBroadcast(true)} className="bg-slate-800 text-slate-300 border border-slate-700"><Megaphone size={16}/> إرسال إعلان</Button>
            <Button onClick={() => {setEditingStudent(null); setShowModal(true);}} className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-bold"><UserPlus size={18}/> طالب جديد</Button>
          </div>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {[
            { id: 'all', label: 'جميع الطلاب', count: students.length, hint: 'طلاب الفرع', color: 'text-slate-200' },
            { id: 'active', label: 'اشتراكات نشطة', count: summary.active, hint: 'أكثر من ٧ أيام متبقية', color: 'text-emerald-400' },
            { id: 'near_end', label: 'قرب الانتهاء', count: summary.near_end, hint: 'تنتهي خلال ٧ أيام أو اليوم', color: 'text-orange-400' },
            { id: 'expired', label: 'اشتراكات منتهية', count: summary.expired, hint: 'تشمل غير محددة التاريخ', color: 'text-red-400' },
          ].map(item => (
            <button key={item.id} type="button" aria-pressed={statusFilter === item.id} onClick={() => setStatusFilter(item.id)} className={`text-right rounded-2xl border p-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-yellow-500 ${statusFilter === item.id ? 'bg-slate-800 border-yellow-500' : 'bg-slate-900 border-slate-800 hover:border-slate-500'}`}>
              <div className="flex items-center justify-between gap-2"><span className={`text-sm font-bold ${item.color}`}>{item.label}</span>{statusFilter === item.id && <CheckCircle size={16} className="text-yellow-500 shrink-0"/>}</div>
              <div className="text-3xl font-black text-slate-100 my-2 tabular-nums">{item.count}</div>
              <p className="text-xs text-slate-400">{item.hint}</p>
            </button>
          ))}
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
            <label className="sm:col-span-2 xl:col-span-1 text-xs font-bold text-slate-400">
              البحث عن طالب
              <div className="relative mt-2"><Search size={17} className="absolute right-3 top-3 text-slate-500"/>
                <input type="search" className="w-full min-h-11 bg-slate-950 text-slate-200 pr-10 pl-3 border border-slate-700 rounded-xl focus:outline-yellow-500" placeholder="الاسم، الهاتف، اسم المستخدم" value={search} onChange={e => setSearch(e.target.value)}/>
              </div>
            </label>
            {[
              { label: 'حالة الاشتراك', value: statusFilter, onChange: setStatusFilter, options: [['all', 'كل الحالات'], ['active', 'نشط'], ['near_end', 'قرب الانتهاء'], ['expired', 'منتهي']] },
              { label: 'المجموعة', value: groupFilter, onChange: setGroupFilter, options: [['all', 'كل المجموعات'], ...filterGroups.map(g => [g, g])] },
              { label: 'الحزام', value: beltFilter, onChange: setBeltFilter, options: [['all', 'كل الأحزمة'], ...BELTS.map(b => [b, b])] },
              { label: 'ترتيب الطلاب', value: sortOption, onChange: setSortOption, options: [['joinDateDesc', 'الأحدث انضماماً'], ['joinDateAsc', 'الأقدم انضماماً'], ['nameAsc', 'الاسم أبجدياً'], ['beltDesc', 'أعلى حزام'], ['balanceDesc', 'الأعلى مديونية']] },
            ].map(field => (
              <label key={field.label} className="text-xs font-bold text-slate-400">{field.label}
                <select className="mt-2 w-full min-h-11 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 focus:outline-yellow-500" value={field.value} onChange={e => field.onChange(e.target.value)}>{field.options.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
              </label>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 pt-3">
            <p role="status" className="text-sm text-slate-400">عرض <strong className="text-slate-100">{processedStudents.length}</strong> من {students.length} طالب</p>
            {hasFilters && <button onClick={resetFilters} className="flex items-center gap-1 text-sm text-yellow-500 min-h-11 px-2 rounded-lg hover:bg-slate-800"><X size={16}/> مسح البحث والفلاتر</button>}
          </div>
        </div>
      </section>

      {processedStudents.length === 0 && <div className="text-center bg-slate-900 border border-slate-800 rounded-2xl p-10" dir="rtl"><Search size={28} className="mx-auto text-slate-500 mb-3"/><h3 className="font-bold text-slate-200">{students.length ? 'لا يوجد طلاب مطابقون للبحث' : 'لا يوجد طلاب في هذا الفرع بعد'}</h3><p className="text-sm text-slate-400 mt-2">{students.length ? 'جرّب تغيير كلمة البحث أو توسيع الفلاتر.' : 'ابدأ بإضافة طالب جديد من الزر أعلى الصفحة.'}</p>{hasFilters && <button onClick={resetFilters} className="text-yellow-500 mt-4 p-2">عرض جميع الطلاب</button>}</div>}

      {/* Desktop table and mobile cards share the same actions and status details. */}
      {processedStudents.length > 0 && <>
        <Card noPadding className="hidden xl:block overflow-hidden border border-slate-800 rounded-2xl p-0 bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <caption className="sr-only">قائمة الطلاب واشتراكاتهم وإجراءات المتابعة</caption>
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800"><tr>{['الطالب والمجموعة', 'التواصل', 'الحزام', 'الذمم', 'الاشتراك', 'الإجراءات'].map(label => <th scope="col" key={label} className="p-4 font-bold">{label}</th>)}</tr></thead>
              <tbody className="divide-y divide-slate-800">
                {processedStudents.map(student => <tr key={student.id} className="hover:bg-slate-800/50 transition-colors align-top">
                  <td className="p-4"><button onClick={() => setProfileStudent(student)} className="text-right text-base font-bold text-slate-200 hover:text-yellow-500">{student.name}</button><p className="text-xs text-slate-400 mt-2">{formatGroupName(student.group)}</p><div className="flex flex-wrap gap-2 mt-2">{isNewStudent(student.joinDate) && <span className="text-xs text-blue-400">طالب جديد</span>}{(student.internalNotes?.length > 0 || student.note?.trim()) && <button onClick={() => setStudentForNotes(student)} className="text-xs text-orange-400 flex items-center gap-1"><FileWarning size={14}/> ملاحظات خاصة</button>}</div></td>
                  <td className="p-4"><div className="flex flex-col items-start gap-2">{student.phone ? <><a dir="ltr" href={`tel:${student.phone}`} className="text-slate-300 font-mono min-h-11 inline-flex items-center gap-2"><Phone size={14}/>{student.phone}</a><button onClick={() => openWhatsAppChat(student.phone)} className="text-emerald-400 text-xs flex items-center gap-2 min-h-11"><MessageCircle size={16}/> واتساب</button></> : <span className="text-slate-500">غير محدد</span>}</div></td>
                  <td className="p-4"><span className="inline-block px-3 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 whitespace-nowrap">{student.belt || 'غير محدد'}</span></td>
                  <td className="p-4 whitespace-nowrap">{renderDebt(student)}</td>
                  <td className="p-4 whitespace-nowrap">{renderSubscription(student)}</td>
                  <td className="p-4">{renderActions(student)}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
        </Card>
        <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4">
          {processedStudents.map(student => <article key={student.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 min-w-0">
            <div><button onClick={() => setProfileStudent(student)} className="text-right font-bold text-lg text-slate-100 hover:text-yellow-500 break-words">{student.name}</button><p className="text-sm text-slate-400 mt-1">{formatGroupName(student.group)} · الحزام {student.belt || 'غير محدد'}</p>{(student.internalNotes?.length > 0 || student.note?.trim()) && <button onClick={() => setStudentForNotes(student)} className="text-xs text-orange-400 mt-2 min-h-8 flex items-center gap-1"><FileWarning size={14}/> توجد ملاحظات خاصة</button>}</div>
            <div className="grid grid-cols-2 gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3"><div><p className="text-xs text-slate-400 mb-2">الاشتراك</p>{renderSubscription(student)}</div><div><p className="text-xs text-slate-400 mb-2">الذمم المالية</p>{renderDebt(student)}</div></div>
            {student.phone && <div className="flex flex-wrap items-center justify-between gap-2"><a dir="ltr" href={`tel:${student.phone}`} className="min-h-11 flex items-center gap-2 text-sm text-slate-300 font-mono"><Phone size={16}/>{student.phone}</a><button onClick={() => openWhatsAppChat(student.phone)} className="min-h-11 px-3 rounded-lg text-emerald-400 bg-emerald-900/20 flex items-center gap-2 text-sm"><MessageCircle size={16}/> واتساب</button></div>}
            <div className="border-t border-slate-800 pt-3 mt-auto">{renderActions(student)}</div>
          </article>)}
        </div>
      </>}

      {/* --- Add/Edit Modal --- */}
      {showModal && (() => {
         const isEditingHashed = editingStudent && (editingStudent.isPasswordHashed || (editingStudent.password && editingStudent.password.length > 30));

         return (
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
                                        <input 
                                            className={`w-full border border-slate-700 p-2 rounded-lg bg-slate-950 text-slate-200 font-mono text-left dir-ltr focus:border-yellow-500 outline-none placeholder-slate-600 ${isEditingHashed ? 'opacity-50 cursor-not-allowed text-red-400' : ''}`} 
                                            value={isEditingHashed ? '********' : newS.password} 
                                            onChange={e => !isEditingHashed && setNewS({...newS, password:e.target.value})} 
                                            disabled={isEditingHashed}
                                            placeholder={isEditingHashed ? "مشفرة (استخدم Reset)" : "Auto-generated"} 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-400 mb-1">الاسم الرباعي</label>
                                <input required className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-yellow-500 p-2.5 rounded-xl outline-none transition-all" value={newS.name} onChange={e=>setNewS({...newS, name:e.target.value})} placeholder="مثال: أحمد محمد علي" />
                            </div>

                            <div className="md:col-span-2">
                                 <label className="block text-xs font-bold text-blue-400 mb-1">الفترة / المجموعة</label>
                                 <select className="w-full bg-slate-950 border border-slate-700 text-slate-200 focus:border-blue-500 p-2.5 rounded-xl outline-none" value={newS.group} onChange={e=>setNewS({...newS, group:e.target.value})}>
                                     <option value="">بدون تحديد</option>
                                     {availableGroups.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
                                 </select>
                            </div>

                            {!editingStudent && (
                                <div className="md:col-span-2 bg-blue-900/10 p-3 rounded-xl border border-blue-500/20">
                                    <label className="block text-xs font-bold text-blue-400 mb-1">العائلة (للخصومات)</label>
                                    <select className="w-full border border-slate-700 p-2 rounded-lg bg-slate-950 text-slate-200 focus:ring-1 focus:ring-blue-500 outline-none" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}>
                                        <option value="new">تسجيل كعائلة جديدة</option>
                                        {uniqueFamilies.map((f) => (
                                            <option key={f.id} value={f.id}>انضمام لـ {f.displayName}</option>
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
                        
                        {/* FIX: error message shown inside modal */}
                        {submitError && (
                          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm font-bold flex items-center gap-2 mt-4">
                            <FileWarning size={16} className="shrink-0"/> {submitError}
                          </div>
                        )}

                        <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-slate-700">
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={closeModal}
                              disabled={isSubmitting}
                              className="text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-50"
                            >
                              إلغاء
                            </Button>
                            {/* FIX: disabled + loading text while submitting */}
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 px-8 border-none disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isSubmitting
                                ? (editingStudent ? '⏳ جاري الحفظ...' : '⏳ جاري الإضافة...')
                                : (editingStudent ? 'حفظ التعديلات' : 'إضافة الطالب')}
                            </Button>
                        </div>
                    </form>
                </div>
            </ModalOverlay>
         );
      })()}
    </div>
  );
};

export default StudentsManager;

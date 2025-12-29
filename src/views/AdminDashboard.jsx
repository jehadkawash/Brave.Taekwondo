// src/views/AdminDashboard.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Users, DollarSign, CheckCircle, Inbox, Clock, Archive, 
  Shield, Menu, LogOut, Megaphone, Database, FileText, MapPin, 
  Award, Calendar, ChevronDown, X, MessageSquare 
} from 'lucide-react'; // ✅ تمت إضافة MessageSquare لأيقونة الملاحظات
import { addDoc, collection } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';
import { useCollection } from '../hooks/useCollection'; 
import { IMAGES } from '../lib/constants'; // ✅ استيراد الصور

// Import Managers
import AdminNotesManager from './dashboard/AdminNotesManager';
import { DashboardStats } from './dashboard/DashboardStats';
import StudentsManager from './dashboard/StudentsManager';
import ArchiveManager from './dashboard/ArchiveManager';
import FinanceManager from './dashboard/FinanceManager';
import AttendanceManager from './dashboard/AttendanceManager';
import RegistrationsManager from './dashboard/RegistrationsManager';
import ScheduleManager from './dashboard/ScheduleManager';
import CaptainsManager from './dashboard/CaptainsManager';
import NewsManager from './dashboard/NewsManager';
import BeltTestsManager from './dashboard/BeltTestsManager';
import ReportsManager from './dashboard/ReportsManager'; 
import SubscriptionsManager from './dashboard/SubscriptionsManager';
import NotesManager from './dashboard/NotesManager'; // ✅ استيراد صفحة الملاحظات الجديدة

// --- دوال مساعدة ---
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

const logActivity = async (action, details, branch, user) => {
  try {
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'activity_logs'), {
      action, details, branch, performedBy: user.name || 'Admin', role: user.role || 'admin', timestamp: new Date().toISOString()
    });
  } catch (e) { console.error("Log error", e); }
};

// --- مكون القائمة المنسدلة ---
const NavDropdown = ({ title, icon: Icon, items, activeTab, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const isActive = items.some(item => item.id === activeTab);

    return (
        <div className="relative" ref={wrapperRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-sm 
                    ${isActive ? 'text-yellow-400 bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
            >
                <Icon size={18}/>
                <span>{title}</span>
                <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                    {items.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => { 
                                if (item.action) item.action(); 
                                else onSelect(item.id); 
                                setIsOpen(false); 
                            }}
                            className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-colors text-sm font-bold border-b border-gray-50 last:border-0
                                ${activeTab === item.id ? 'bg-yellow-50 text-yellow-700' : 'text-gray-600 hover:bg-gray-50'}
                                ${item.special ? 'text-green-600 bg-green-50 hover:bg-green-100' : ''}
                            `}
                        >
                            <item.icon size={16} className={activeTab === item.id ? 'text-yellow-600' : item.special ? 'text-green-600' : 'text-gray-400'}/>
                            {item.label}
                            {item.badge > 0 && <span className="mr-auto bg-red-500 text-white text-[10px] px-1.5 rounded-full">{item.badge}</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const AdminDashboard = ({ user, selectedBranch, studentsCollection, scheduleCollection, handleLogout, onSwitchBranch }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // جلب البيانات
  const paymentsCollection = useCollection('payments');
  const expensesCollection = useCollection('expenses');
  const archiveCollection = useCollection('archive');
  const registrationsCollection = useCollection('registrations');
  const captainsCollection = useCollection('captains');
  const groupsCollection = useCollection('groups');
  const newsCollection = useCollection('news');
  const financeReasonsCollection = useCollection('finance_reasons');
  const activityLogsCollection = useCollection('activity_logs');
  const adminNotesCollection = useCollection('admin_notes');

  const students = studentsCollection?.data || [];
  const payments = paymentsCollection?.data || [];
  const expenses = expensesCollection?.data || [];
  const registrations = registrationsCollection?.data || [];
  const schedule = scheduleCollection?.data || [];
  const captains = captainsCollection?.data || [];
  const groupsData = groupsCollection?.data || [];
  const newsData = newsCollection?.data || [];
  const financeReasonsData = financeReasonsCollection?.data || [];
  const activityLogsData = activityLogsCollection?.data || [];
  const adminNotesData = adminNotesCollection?.data || [];

  const branchStudents = useMemo(() => students.filter(s => s.branch === selectedBranch), [students, selectedBranch]);
  const branchPayments = useMemo(() => payments.filter(p => p.branch === selectedBranch), [payments, selectedBranch]);
  const branchExpenses = useMemo(() => expenses.filter(e => e.branch === selectedBranch), [expenses, selectedBranch]);
  const branchRegistrations = useMemo(() => registrations.filter(r => r.branch === selectedBranch), [registrations, selectedBranch]);
  const branchGroups = useMemo(() => groupsData.filter(g => g.branch === selectedBranch), [groupsData, selectedBranch]);
  const branchFinanceReasons = useMemo(() => financeReasonsData.filter(r => r.branch === selectedBranch), [financeReasonsData, selectedBranch]);
  const branchAdminNotes = adminNotesData; 

  const branchActivityLogs = useMemo(() => {
      return activityLogsData
        .filter(l => l.branch === selectedBranch)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [activityLogsData, selectedBranch]);

  const totalIncome = branchPayments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalExpense = branchExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const netProfit = totalIncome - totalExpense;
  const activeStudentsCount = branchStudents.filter(s => calculateStatus(s.subEnd) === 'active').length;
  const nearEndCount = branchStudents.filter(s => calculateStatus(s.subEnd) === 'near_end').length;
  const expiredCount = branchStudents.filter(s => calculateStatus(s.subEnd) === 'expired').length;
  const totalStudents = branchStudents.length;

  const today = new Date();
  const currentMonthPrefix = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}`;
  const totalAttendance = branchStudents.reduce((acc, s) => {
     if(!s.attendance) return acc;
     return acc + Object.keys(s.attendance).filter(k => k.startsWith(currentMonthPrefix)).length;
  }, 0);

  const handleLog = (action, details) => logActivity(action, details, selectedBranch, user);

  // دالة النسخ الاحتياطي
  const handleBackup = () => {
    if (!confirm("هل تريد تحميل نسخة كاملة من قاعدة البيانات؟")) return;
    const backupData = {
      date: new Date().toISOString(),
      branch: selectedBranch,
      students: branchStudents,
      payments: branchPayments,
      expenses: branchExpenses,
      registrations: branchRegistrations,
      schedule: schedule,
      news: newsData,
      groups: branchGroups,
      captains: captains,
      activityLogs: branchActivityLogs,
      adminNotes: branchAdminNotes
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `brave_backup_${selectedBranch}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- تعريف المجموعات الجديدة ---
  
  // المجموعة الأولى: طلاب
  const studentGroups = [
      {id:'students', icon:Users, label:'الطلاب'}, 
      {id:'student_notes', icon:MessageSquare, label:'الملاحظات والرسائل'}, // ✅ الصفحة الجديدة هنا
      {id:'subscriptions', icon:Calendar, label:'اشتراكات'},
      {id:'tests', icon:Award, label:'فحص'},
      {id:'finance', icon:DollarSign, label:'وصولات'},
      {id:'archive', icon:Archive, label:'الأرشيف'},
  ];

  // المجموعة الثانية: الإدارة
  const adminGroups = [
      {id:'registrations', icon:Inbox, label:'طلبات التسجيل', badge: branchRegistrations.length},
      {id:'schedule', icon:Clock, label:'جدول الحصص'},
      {id:'notes', label: 'ملاحظات الإدارة', icon: FileText },
      {id:'news', icon:Megaphone, label:'الاخبار والعروض'},
      {id:'reports', icon:FileText, label:'التقارير الشاملة'},
      {id:'captains', icon:Shield, label:'الكباتن والصلاحيات', role: 'admin'},
      // زر الباك اب كخيار في القائمة
      {id:'backup', icon:Database, label:'باك اب داتابيس', role: 'admin', action: handleBackup, special: true}, 
  ].filter(i => !i.role || i.role === user.role);

  return (
    <div className="min-h-screen bg-gray-50 text-right font-sans flex flex-col" dir="rtl">
      
      {/* --- الشريط العلوي --- */}
      <header className="bg-black text-white shadow-lg sticky top-0 z-40">
          <div className="container mx-auto px-4 h-16 flex justify-between items-center">
              
              {/* الشعار */}
              <div className="flex items-center gap-4">
                  {/* ✅ تم استبدال حرف B بالصورة */}
                  <img 
                      src={IMAGES.LOGO} 
                      alt="Logo" 
                      className="w-10 h-10 rounded-lg object-contain bg-white"
                      onError={(e) => {e.target.style.display='none';}} // إخفاء إذا لم توجد الصورة
                  />
                  <div>
                      <h1 className="font-bold text-lg hidden md:block">أكاديمية الشجاع</h1>
                      <div className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                          {user.name} 
                          <span className="text-gray-500">|</span> 
                          {selectedBranch === 'شفا بدران' ? 'فرع شفا بدران' : 'فرع أبو نصير'}
                      </div>
                  </div>
              </div>

              {/* القائمة الرئيسية (لابتوب) */}
              <nav className="hidden md:flex items-center gap-2">
                  <button 
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-sm ${activeTab === 'dashboard' ? 'text-yellow-400 bg-gray-800' : 'text-gray-300 hover:text-white hover:bg-gray-800'}`}
                  >
                      <Activity size={18}/> الرئيسية
                  </button>

                  <div className="w-px h-6 bg-gray-700 mx-2"></div>

                  <NavDropdown 
                      title="طلاب" 
                      icon={Users} 
                      items={studentGroups} 
                      activeTab={activeTab} 
                      onSelect={setActiveTab}
                  />

                  {/* زر الحضور والغياب (أساسي) */}
                  <button 
                      onClick={() => setActiveTab('attendance')}
                      className={`flex items-center gap-2 px-4 py-2 mx-2 rounded-xl transition-all font-bold text-sm border-2 border-yellow-500 ${activeTab === 'attendance' ? 'bg-yellow-500 text-black' : 'text-yellow-500 hover:bg-yellow-500 hover:text-black'}`}
                  >
                      <CheckCircle size={22}/> حضور وغياب
                  </button>

                  <NavDropdown 
                      title="الادارة" 
                      icon={Shield} 
                      items={adminGroups} 
                      activeTab={activeTab} 
                      onSelect={setActiveTab}
                  />
              </nav>

              {/* أدوات إضافية (موبايل + خروج) */}
              <div className="flex items-center gap-3">
                  {onSwitchBranch && (
                      <div className="hidden md:block relative group">
                          <MapPin size={20} className="text-gray-400 group-hover:text-yellow-500 cursor-pointer"/>
                          <select 
                              value={selectedBranch} 
                              onChange={(e) => onSwitchBranch(e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                          >
                              <option value="شفا بدران">شفا بدران</option>
                              <option value="أبو نصير">أبو نصير</option>
                          </select>
                      </div>
                  )}
                  
                  <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors" title="خروج">
                      <LogOut size={20}/>
                  </button>

                  <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                      {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                  </button>
              </div>
          </div>

          {/* --- قائمة الموبايل --- */}
          {mobileMenuOpen && (
              <div className="md:hidden bg-gray-900 border-t border-gray-800 p-4 space-y-4 animate-fade-in absolute w-full left-0 z-50 shadow-2xl h-[calc(100vh-64px)] overflow-y-auto">
                  
                  {onSwitchBranch && (
                      <div className="bg-gray-800 p-3 rounded-xl flex items-center justify-between mb-4">
                          <span className="text-gray-400 text-sm">الفرع الحالي:</span>
                          <select 
                              value={selectedBranch} 
                              onChange={(e) => onSwitchBranch(e.target.value)}
                              className="bg-black text-yellow-500 font-bold p-2 rounded-lg outline-none text-sm"
                          >
                              <option value="شفا بدران">شفا بدران</option>
                              <option value="أبو نصير">أبو نصير</option>
                          </select>
                      </div>
                  )}

                  <button onClick={() => {setActiveTab('dashboard'); setMobileMenuOpen(false);}} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-800 text-white font-bold">
                      <Activity size={20} className="text-yellow-500"/> الرئيسية
                  </button>

                  <button onClick={() => {setActiveTab('attendance'); setMobileMenuOpen(false);}} className="w-full flex items-center gap-3 p-3 rounded-xl bg-yellow-600 text-white font-bold shadow-lg shadow-yellow-900/20">
                      <CheckCircle size={20}/> حضور وغياب
                  </button>

                  {/* مجموعة الطلاب (موبايل) */}
                  <div>
                      <h3 className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase">طلاب</h3>
                      <div className="grid grid-cols-2 gap-2">
                          {studentGroups.map(item => (
                              <button key={item.id} onClick={() => {setActiveTab(item.id); setMobileMenuOpen(false);}} className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold border transition-all ${activeTab === item.id ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-gray-800 text-gray-300 border-gray-700'}`}>
                                  <item.icon size={20}/> {item.label}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* مجموعة الإدارة (موبايل) */}
                  <div>
                      <h3 className="text-xs font-bold text-gray-500 mb-2 px-2 uppercase">الادارة</h3>
                      <div className="grid grid-cols-2 gap-2">
                          {adminGroups.map(item => (
                              <button 
                                  key={item.id} 
                                  onClick={() => { 
                                      if (item.action) item.action();
                                      else setActiveTab(item.id); 
                                      setMobileMenuOpen(false);
                                  }} 
                                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl text-xs font-bold border transition-all 
                                      ${item.special ? 'text-green-400 border-green-900 bg-green-900/20' : 
                                        activeTab === item.id ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-gray-800 text-gray-300 border-gray-700'}`}
                              >
                                  <item.icon size={20}/> {item.label}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </header>

      {/* --- المحتوى الرئيسي (تم تعديل القياسات هنا لإصلاح اللابتوب) --- */}
      {/* تم تغيير container mx-auto max-w-7xl إلى w-full px-4 md:px-8 */}
      <main className="flex-1 w-full px-4 md:px-8 py-6 animate-fade-in mx-auto">
         {activeTab === 'dashboard' && <DashboardStats 
             user={user} 
             selectedBranch={selectedBranch} 
             branchStudents={branchStudents} 
             netProfit={netProfit} 
             totalAttendance={totalAttendance} 
             expiredCount={expiredCount} 
             activeStudentsCount={activeStudentsCount} 
             nearEndCount={nearEndCount} 
             totalStudents={totalStudents} 
             branchRegistrations={branchRegistrations} 
             branchPayments={branchPayments} 
             activityLogs={branchActivityLogs}
         />}

         {activeTab === 'students' && <StudentsManager 
             students={branchStudents} 
             groups={branchGroups} 
             studentsCollection={studentsCollection} 
             archiveCollection={archiveCollection} 
             selectedBranch={selectedBranch} 
             logActivity={handleLog}
         />}
         
         {activeTab === 'tests' && <BeltTestsManager 
             students={branchStudents}
             studentsCollection={studentsCollection}
             logActivity={handleLog}
         />}

         {activeTab === 'reports' && <ReportsManager 
            students={branchStudents}
            payments={branchPayments}
            expenses={branchExpenses}
            activityLogs={branchActivityLogs}
            registrations={branchRegistrations}
            adminNotes={branchAdminNotes}
            selectedBranch={selectedBranch}
         />}

         {activeTab === 'subscriptions' && <SubscriptionsManager 
            students={branchStudents} 
            studentsCollection={studentsCollection} 
            logActivity={handleLog} 
            selectedBranch={selectedBranch}
         />}

         {activeTab === 'finance' && <FinanceManager 
             students={branchStudents} 
             payments={branchPayments} 
             expenses={branchExpenses} 
             paymentsCollection={paymentsCollection} 
             expensesCollection={expensesCollection} 
             financeReasons={branchFinanceReasons}
             financeReasonsCollection={financeReasonsCollection}
             selectedBranch={selectedBranch} 
             logActivity={handleLog} 
         />}

         {activeTab === 'attendance' && <AttendanceManager 
             students={branchStudents} 
             groups={branchGroups} 
             groupsCollection={groupsCollection}
             studentsCollection={studentsCollection}
             selectedBranch={selectedBranch}
         />}

         {activeTab === 'registrations' && <RegistrationsManager registrations={branchRegistrations} students={students} registrationsCollection={registrationsCollection} studentsCollection={studentsCollection} selectedBranch={selectedBranch} logActivity={handleLog} />}

         {activeTab === 'schedule' && <ScheduleManager schedule={schedule} scheduleCollection={scheduleCollection} />}

         {activeTab === 'archive' && <ArchiveManager archiveCollection={archiveCollection} studentsCollection={studentsCollection} payments={payments} logActivity={handleLog} />}
         
         {activeTab === 'captains' && <CaptainsManager captains={captains} captainsCollection={captainsCollection} />}

         {activeTab === 'news' && <NewsManager news={newsData} newsCollection={newsCollection} selectedBranch={selectedBranch} />}

         {activeTab === 'notes' && <AdminNotesManager />}

         {/* ✅ عرض صفحة الملاحظات عند اختيارها */}
         {activeTab === 'student_notes' && <NotesManager students={branchStudents} studentsCollection={studentsCollection} logActivity={handleLog} selectedBranch={selectedBranch} />}
      </main>
    </div>
  );
};

export default AdminDashboard;
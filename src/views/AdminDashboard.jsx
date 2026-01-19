// src/views/AdminDashboard.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Users, DollarSign, CheckCircle, Inbox, Clock, Archive, 
  Shield, Menu, LogOut, Megaphone, Database, FileText, MapPin, 
  Award, Calendar, ChevronDown, X, MessageSquare 
} from 'lucide-react'; 
import { addDoc, collection } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';
import { useCollection } from '../hooks/useCollection'; 
import { IMAGES } from '../lib/constants'; 

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
import NotesManager from './dashboard/NotesManager'; 

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

// --- مكون القائمة المنسدلة (Updated for Dark/Pro Theme) ---
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-bold text-sm border border-transparent
                    ${isActive 
                        ? 'text-yellow-400 bg-slate-800 border-slate-700 shadow-lg shadow-black/20' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
                <Icon size={18} className={isActive ? "animate-pulse" : ""}/>
                <span>{title}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-yellow-500' : ''}`}/>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 rounded-xl shadow-2xl shadow-black border border-slate-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {items.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => { 
                                if (item.action) item.action(); 
                                else onSelect(item.id); 
                                setIsOpen(false); 
                            }}
                            className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-all duration-200 text-sm font-bold border-b border-slate-800 last:border-0 group
                                ${activeTab === item.id 
                                    ? 'bg-gradient-to-r from-yellow-500/10 to-transparent text-yellow-400 border-r-4 border-r-yellow-500' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'}
                                ${item.special ? 'text-emerald-400 bg-emerald-900/10 hover:bg-emerald-900/20' : ''}
                            `}
                        >
                            <item.icon size={16} className={`transition-colors duration-200 ${activeTab === item.id ? 'text-yellow-400' : item.special ? 'text-emerald-400' : 'text-slate-500 group-hover:text-slate-300'}`}/>
                            {item.label}
                            {item.badge > 0 && <span className="mr-auto bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full shadow-sm shadow-red-900/50">{item.badge}</span>}
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
      {id:'student_notes', icon:MessageSquare, label:'الملاحظات والرسائل'}, 
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
    // ✨ Changed to Dark Mode (Slate-950) with refined typography
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-yellow-500/30" dir="rtl">
      
      {/* --- الشريط العلوي (Pro Header) --- */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white shadow-lg sticky top-0 z-40 transition-all duration-300">
          <div className="container mx-auto px-4 h-16 flex justify-between items-center">
              
              {/* الشعار */}
              <div className="flex items-center gap-4 group cursor-default">
                  <div className="relative">
                    <img 
                        src={IMAGES.LOGO} 
                        alt="Logo" 
                        className="w-10 h-10 rounded-xl object-contain bg-white shadow-lg shadow-yellow-500/20 transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {e.target.style.display='none';}} 
                    />
                    <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10"></div>
                  </div>
                  <div>
                      <h1 className="font-bold text-lg hidden md:block bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">أكاديمية الشجاع</h1>
                      <div className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                          {user.name} 
                          <span className="text-slate-600">|</span> 
                          <span className="text-slate-400">{selectedBranch === 'شفا بدران' ? 'فرع شفا بدران' : 'فرع أبو نصير'}</span>
                      </div>
                  </div>
              </div>

              {/* القائمة الرئيسية (لابتوب) */}
              <nav className="hidden md:flex items-center gap-2">
                  <button 
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 font-bold text-sm border border-transparent
                          ${activeTab === 'dashboard' 
                            ? 'text-yellow-400 bg-slate-800 border-slate-700 shadow-lg shadow-black/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                  >
                      <Activity size={18}/> الرئيسية
                  </button>

                  <div className="w-px h-6 bg-slate-800 mx-2"></div>

                  <NavDropdown 
                      title="طلاب" 
                      icon={Users} 
                      items={studentGroups} 
                      activeTab={activeTab} 
                      onSelect={setActiveTab}
                  />

                  {/* زر الحضور والغياب (أساسي) - High Visibility Style */}
                  <button 
                      onClick={() => setActiveTab('attendance')}
                      className={`flex items-center gap-2 px-4 py-2 mx-2 rounded-xl transition-all duration-300 font-bold text-sm border 
                          ${activeTab === 'attendance' 
                            ? 'bg-yellow-500 text-slate-900 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-105' 
                            : 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]'}`}
                  >
                      <CheckCircle size={20} className={activeTab === 'attendance' ? 'animate-bounce-short' : ''}/> 
                      حضور وغياب
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
                          <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 group-hover:border-yellow-500/50 transition-colors">
                            <MapPin size={20} className="text-slate-400 group-hover:text-yellow-500 cursor-pointer transition-colors"/>
                          </div>
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
                  
                  <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors border border-transparent hover:border-red-500/20" title="خروج">
                      <LogOut size={20}/>
                  </button>

                  <button className="md:hidden p-2 text-slate-200 hover:bg-slate-800 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                      {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                  </button>
              </div>
          </div>

          {/* --- قائمة الموبايل (Pro Mobile Menu) --- */}
          {mobileMenuOpen && (
              <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 p-4 space-y-4 animate-in slide-in-from-top-5 duration-300 absolute w-full left-0 z-50 shadow-2xl h-[calc(100vh-64px)] overflow-y-auto">
                  
                  {onSwitchBranch && (
                      <div className="bg-slate-800/50 border border-slate-700 p-3 rounded-xl flex items-center justify-between mb-4">
                          <span className="text-slate-400 text-sm font-medium">الفرع الحالي:</span>
                          <select 
                              value={selectedBranch} 
                              onChange={(e) => onSwitchBranch(e.target.value)}
                              className="bg-slate-950 text-yellow-500 font-bold p-2 px-4 rounded-lg outline-none text-sm border border-slate-700 focus:border-yellow-500"
                          >
                              <option value="شفا بدران">شفا بدران</option>
                              <option value="أبو نصير">أبو نصير</option>
                          </select>
                      </div>
                  )}

                  <button onClick={() => {setActiveTab('dashboard'); setMobileMenuOpen(false);}} className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-800 text-white font-bold border border-slate-700 hover:border-yellow-500/50 transition-all">
                      <Activity size={20} className="text-yellow-500"/> الرئيسية
                  </button>

                  <button onClick={() => {setActiveTab('attendance'); setMobileMenuOpen(false);}} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-900 font-bold shadow-lg shadow-yellow-500/20">
                      <CheckCircle size={20}/> حضور وغياب
                  </button>

                  {/* مجموعة الطلاب (موبايل) */}
                  <div className="space-y-2">
                      <h3 className="text-[10px] font-black text-slate-500 px-2 uppercase tracking-wider">الطلاب</h3>
                      <div className="grid grid-cols-2 gap-3">
                          {studentGroups.map(item => (
                              <button key={item.id} onClick={() => {setActiveTab(item.id); setMobileMenuOpen(false);}} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-xs font-bold border transition-all duration-200 
                                  ${activeTab === item.id 
                                    ? 'bg-yellow-500 text-slate-900 border-yellow-500 shadow-md' 
                                    : 'bg-slate-800/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}`}>
                                  <item.icon size={22} className={activeTab === item.id ? 'scale-110' : ''}/> {item.label}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* مجموعة الإدارة (موبايل) */}
                  <div className="space-y-2">
                      <h3 className="text-[10px] font-black text-slate-500 px-2 uppercase tracking-wider">الادارة</h3>
                      <div className="grid grid-cols-2 gap-3">
                          {adminGroups.map(item => (
                              <button 
                                  key={item.id} 
                                  onClick={() => { 
                                      if (item.action) item.action();
                                      else setActiveTab(item.id); 
                                      setMobileMenuOpen(false);
                                  }} 
                                  className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl text-xs font-bold border transition-all duration-200
                                      ${item.special 
                                        ? 'text-emerald-400 border-emerald-900/50 bg-emerald-900/10 hover:bg-emerald-900/20' 
                                        : activeTab === item.id 
                                            ? 'bg-yellow-500 text-slate-900 border-yellow-500 shadow-md' 
                                            : 'bg-slate-800/50 text-slate-400 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}`}
                              >
                                  <item.icon size={22}/> {item.label}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </header>

      {/* --- المحتوى الرئيسي --- */}
      <main className="flex-1 w-full px-4 md:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 mx-auto">
         <div className="bg-slate-900/0 rounded-2xl min-h-[500px]"> {/* Container for content */}
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

             {activeTab === 'student_notes' && <NotesManager students={branchStudents} studentsCollection={studentsCollection} logActivity={handleLog} selectedBranch={selectedBranch} />}
         </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
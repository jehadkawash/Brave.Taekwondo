// src/views/AdminDashboard.jsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Activity, Users, DollarSign, CheckCircle, Inbox, Clock, Archive, 
  Shield, Menu, LogOut, Megaphone, Database, FileText, MapPin, 
  Award, Calendar, ChevronDown, X, MessageSquare, LayoutDashboard 
} from 'lucide-react';
import { addDoc, collection } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';
import { useCollection } from '../hooks/useCollection'; 
import { IMAGES } from '../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';

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
const logActivity = async (action, details, branch, user) => {
  try {
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'activity_logs'), {
      action, details, branch, performedBy: user.name || 'Admin', role: user.role || 'admin', timestamp: new Date().toISOString()
    });
  } catch (e) { console.error("Log error", e); }
};

// --- مكون القائمة المنسدلة (محسن) ---
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-sm border 
                    ${isActive 
                        ? 'text-black bg-yellow-500 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                        : 'text-gray-300 border-transparent hover:bg-white/10 hover:border-white/10'}`}
            >
                <Icon size={18}/>
                <span>{title}</span>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}/>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-[#151515] rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50 backdrop-blur-xl"
                    >
                        <div className="py-2">
                            {items.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { 
                                        if (item.action) item.action(); 
                                        else onSelect(item.id); 
                                        setIsOpen(false); 
                                    }}
                                    className={`w-full text-right px-5 py-3.5 flex items-center gap-3 transition-colors text-sm font-bold border-b border-white/5 last:border-0
                                        ${activeTab === item.id ? 'bg-yellow-500/10 text-yellow-500' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                                        ${item.special ? 'text-green-400 hover:bg-green-500/10' : ''}
                                    `}
                                >
                                    <item.icon size={18} className={activeTab === item.id ? 'text-yellow-500' : item.special ? 'text-green-400' : 'text-gray-500'}/>
                                    {item.label}
                                    {item.badge > 0 && <span className="mr-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow-lg shadow-red-500/20">{item.badge}</span>}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
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
  const activeStudentsCount = branchStudents.filter(s => {
      if (!s.subEnd) return false;
      const diff = new Date(s.subEnd) - new Date();
      return diff > 0;
  }).length;
  const nearEndCount = branchStudents.filter(s => {
      if (!s.subEnd) return false;
      const diff = Math.ceil((new Date(s.subEnd) - new Date()) / (1000 * 60 * 60 * 24));
      return diff >= 0 && diff <= 7;
  }).length;
  const expiredCount = branchStudents.filter(s => {
      if (!s.subEnd) return true;
      return new Date(s.subEnd) < new Date();
  }).length;
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

  // --- تعريف المجموعات ---
  const studentGroups = [
      {id:'students', icon:Users, label:'إدارة الطلاب'}, 
      {id:'student_notes', icon:MessageSquare, label:'الملاحظات والرسائل'},
      {id:'subscriptions', icon:Calendar, label:'الاشتراكات والتجديد'},
      {id:'tests', icon:Award, label:'اختبارات الأحزمة'},
      {id:'finance', icon:DollarSign, label:'السجلات المالية'},
      {id:'archive', icon:Archive, label:'أرشيف الطلاب'},
  ];

  const adminGroups = [
      {id:'registrations', icon:Inbox, label:'طلبات التسجيل الجديدة', badge: branchRegistrations.length},
      {id:'schedule', icon:Clock, label:'جدول الحصص'},
      {id:'notes', label: 'المفكرة الإدارية', icon: FileText },
      {id:'news', icon:Megaphone, label:'الأخبار والإعلانات'},
      {id:'reports', icon:FileText, label:'التقارير والإحصائيات'},
      {id:'captains', icon:Shield, label:'صلاحيات الكباتن', role: 'admin'},
      {id:'backup', icon:Database, label:'نسخ احتياطي (Backup)', role: 'admin', action: handleBackup, special: true}, 
  ].filter(i => !i.role || i.role === user.role);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col selection:bg-yellow-500 selection:text-black" dir="rtl">
      
      {/* --- الشريط العلوي الاحترافي --- */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl sticky top-0 z-50">
          <div className="container mx-auto px-4 md:px-6 h-20 flex justify-between items-center">
              
              {/* القسم الأيمن: الشعار والترحيب */}
              <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                      <div className="absolute inset-0 bg-yellow-500/20 rounded-xl blur-lg group-hover:bg-yellow-500/30 transition-all duration-500"></div>
                      <img 
                          src={IMAGES.LOGO} 
                          alt="Logo" 
                          className="w-12 h-12 relative z-10 object-contain drop-shadow-xl"
                          onError={(e) => {e.target.style.display='none';}} 
                      />
                  </div>
                  <div className="hidden md:block">
                      <h1 className="font-black text-xl tracking-tight text-white">لوحة القيادة</h1>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                          <span className="text-yellow-500">{user.name}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          <span>{selectedBranch}</span>
                      </div>
                  </div>
              </div>

              {/* القسم الأوسط: القائمة الرئيسية (لابتوب) */}
              <nav className="hidden lg:flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
                  <button 
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-sm 
                          ${activeTab === 'dashboard' ? 'text-black bg-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                  >
                      <LayoutDashboard size={18}/> الرئيسية
                  </button>

                  <div className="w-px h-6 bg-white/10 mx-1"></div>

                  <NavDropdown 
                      title="شؤون الطلاب" 
                      icon={Users} 
                      items={studentGroups} 
                      activeTab={activeTab} 
                      onSelect={setActiveTab}
                  />

                  <button 
                      onClick={() => setActiveTab('attendance')}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all font-bold text-sm border
                          ${activeTab === 'attendance' ? 'text-black bg-yellow-500 border-yellow-500' : 'text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10'}`}
                  >
                      <CheckCircle size={18}/> الحضور
                  </button>

                  <NavDropdown 
                      title="الإدارة العامة" 
                      icon={Shield} 
                      items={adminGroups} 
                      activeTab={activeTab} 
                      onSelect={setActiveTab}
                  />
              </nav>

              {/* القسم الأيسر: الأدوات */}
              <div className="flex items-center gap-3">
                  {onSwitchBranch && (
                      <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:border-yellow-500/50 transition-colors relative group">
                          <MapPin size={16} className="text-yellow-500"/>
                          <span className="text-sm font-bold">{selectedBranch}</span>
                          <select 
                              value={selectedBranch} 
                              onChange={(e) => onSwitchBranch(e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          >
                              <option value="شفا بدران">شفا بدران</option>
                              <option value="أبو نصير">أبو نصير</option>
                          </select>
                          <ChevronDown size={14} className="text-gray-500"/>
                      </div>
                  )}
                  
                  <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 p-2.5 rounded-xl border border-red-500/20 transition-all" title="تسجيل خروج">
                      <LogOut size={20}/>
                  </button>

                  <button className="lg:hidden p-2.5 text-white bg-white/10 rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                      {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                  </button>
              </div>
          </div>

          {/* --- قائمة الموبايل (Drawer) --- */}
          <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-[#111] shadow-2xl z-[60] border-l border-white/10 overflow-y-auto"
                >
                    <div className="p-6 space-y-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-black text-white">القائمة</h2>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/10 rounded-full"><X size={20}/></button>
                        </div>

                        {onSwitchBranch && (
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 relative">
                                <span className="text-gray-400 text-xs font-bold block mb-2">تغيير الفرع</span>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-yellow-500 flex items-center gap-2"><MapPin size={16}/> {selectedBranch}</span>
                                    <ChevronDown size={16} className="text-gray-500"/>
                                </div>
                                <select 
                                    value={selectedBranch} 
                                    onChange={(e) => onSwitchBranch(e.target.value)}
                                    className="absolute inset-0 opacity-0 w-full h-full"
                                >
                                    <option value="شفا بدران">شفا بدران</option>
                                    <option value="أبو نصير">أبو نصير</option>
                                </select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <button onClick={() => {setActiveTab('dashboard'); setMobileMenuOpen(false);}} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-300'}`}>
                                <LayoutDashboard size={20}/> لوحة القيادة
                            </button>
                            <button onClick={() => {setActiveTab('attendance'); setMobileMenuOpen(false);}} className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${activeTab === 'attendance' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 text-gray-300'}`}>
                                <CheckCircle size={20}/> الحضور والغياب
                            </button>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-gray-500 mb-3 px-2 uppercase tracking-widest">الطلاب</h3>
                            <div className="space-y-2">
                                {studentGroups.map(item => (
                                    <button key={item.id} onClick={() => {setActiveTab(item.id); setMobileMenuOpen(false);}} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold border transition-all ${activeTab === item.id ? 'bg-white/10 text-yellow-500 border-yellow-500/30' : 'text-gray-400 border-transparent hover:bg-white/5'}`}>
                                        <item.icon size={18}/> {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xs font-black text-gray-500 mb-3 px-2 uppercase tracking-widest">الإدارة</h3>
                            <div className="space-y-2">
                                {adminGroups.map(item => (
                                    <button key={item.id} onClick={() => { 
                                        if (item.action) item.action();
                                        else setActiveTab(item.id); 
                                        setMobileMenuOpen(false);
                                    }} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold border transition-all 
                                        ${item.special ? 'text-green-400 bg-green-900/10 border-green-500/20' : activeTab === item.id ? 'bg-white/10 text-yellow-500 border-yellow-500/30' : 'text-gray-400 border-transparent hover:bg-white/5'}`}>
                                        <item.icon size={18}/> {item.label}
                                        {item.badge > 0 && <span className="mr-auto bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{item.badge}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>
      </header>

      {/* --- منطقة المحتوى --- */}
      <main className="flex-1 w-full max-w-[1920px] mx-auto p-4 md:p-8 animate-fade-in">
         <div className="max-w-7xl mx-auto">
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
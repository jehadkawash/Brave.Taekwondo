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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all font-bold text-sm border 
                    ${isActive 
                        ? 'bg-yellow-500 text-black border-yellow-500 shadow-md' 
                        : 'text-gray-300 hover:text-white hover:bg-white/10 border-transparent'}`}
            >
                <Icon size={18}/>
                <span>{title}</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}/>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full right-0 mt-2 w-64 bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 overflow-hidden z-50"
                    >
                        <div className="py-1">
                            {items.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { 
                                        if (item.action) item.action(); 
                                        else onSelect(item.id); 
                                        setIsOpen(false); 
                                    }}
                                    className={`w-full text-right px-4 py-3 flex items-center gap-3 transition-colors text-sm font-bold border-b border-white/5 last:border-0
                                        ${activeTab === item.id ? 'bg-yellow-600/20 text-yellow-500' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
                                        ${item.special ? 'text-green-400 hover:text-green-300' : ''}
                                    `}
                                >
                                    <item.icon size={18} className={activeTab === item.id ? 'text-yellow-500' : item.special ? 'text-green-400' : 'text-gray-400'}/>
                                    {item.label}
                                    {item.badge > 0 && <span className="mr-auto bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>}
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

  // --- تعريف المجموعات (الأسماء الأصلية) ---
  const studentGroups = [
      {id:'students', icon:Users, label:'الطلاب'}, 
      {id:'student_notes', icon:MessageSquare, label:'الملاحظات والرسائل'},
      {id:'subscriptions', icon:Calendar, label:'اشتراكات'},
      {id:'tests', icon:Award, label:'فحص'},
      {id:'finance', icon:DollarSign, label:'وصولات'},
      {id:'archive', icon:Archive, label:'الأرشيف'},
  ];

  const adminGroups = [
      {id:'registrations', icon:Inbox, label:'طلبات التسجيل', badge: branchRegistrations.length},
      {id:'schedule', icon:Clock, label:'جدول الحصص'},
      {id:'notes', label: 'ملاحظات الإدارة', icon: FileText },
      {id:'news', icon:Megaphone, label:'الاخبار والعروض'},
      {id:'reports', icon:FileText, label:'التقارير الشاملة'},
      {id:'captains', icon:Shield, label:'الكباتن والصلاحيات', role: 'admin'},
      {id:'backup', icon:Database, label:'باك اب داتابيس', role: 'admin', action: handleBackup, special: true}, 
  ].filter(i => !i.role || i.role === user.role);

  return (
    // الخلفية رمادية فاتحة لكي تظهر البطاقات البيضاء بشكل صحيح
    <div className="min-h-screen bg-gray-100 font-sans flex flex-col text-right text-gray-900" dir="rtl">
      
      {/* --- الشريط العلوي (أسود ليعطي الطابع الاحترافي) --- */}
      <header className="bg-[#111] text-white shadow-lg sticky top-0 z-50 h-16 border-b border-gray-800">
          <div className="container mx-auto px-4 h-full flex justify-between items-center w-full">
              
              {/* الشعار */}
              <div className="flex items-center gap-3">
                  <div className="relative cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                      <img 
                          src={IMAGES.LOGO} 
                          alt="Logo" 
                          className="w-10 h-10 object-contain bg-white rounded-lg p-0.5"
                          onError={(e) => {e.target.style.display='none';}} 
                      />
                  </div>
                  <div className="hidden md:block">
                      <h1 className="font-bold text-base text-white">أكاديمية الشجاع</h1>
                      <div className="text-xs text-yellow-500 font-bold flex items-center gap-1">
                          {user.name} <span className="text-gray-600">|</span> {selectedBranch}
                      </div>
                  </div>
              </div>

              {/* القائمة الرئيسية (لابتوب) */}
              <nav className="hidden lg:flex items-center gap-2 bg-white/5 px-2 py-1 rounded-xl border border-white/5">
                  <button 
                      onClick={() => setActiveTab('dashboard')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-bold text-sm 
                          ${activeTab === 'dashboard' ? 'bg-yellow-500 text-black shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
                  >
                      <LayoutDashboard size={18}/> الرئيسية
                  </button>

                  <div className="w-px h-5 bg-white/10 mx-1"></div>

                  <NavDropdown 
                      title="طلاب" 
                      icon={Users} 
                      items={studentGroups} 
                      activeTab={activeTab} 
                      onSelect={setActiveTab}
                  />

                  <button 
                      onClick={() => setActiveTab('attendance')}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all font-bold text-sm border
                          ${activeTab === 'attendance' ? 'bg-yellow-500 text-black border-yellow-500' : 'text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/10'}`}
                  >
                      <CheckCircle size={18}/> الحضور
                  </button>

                  <NavDropdown 
                      title="الادارة" 
                      icon={Shield} 
                      items={adminGroups} 
                      activeTab={activeTab} 
                      onSelect={setActiveTab}
                  />
              </nav>

              {/* الأدوات (موبايل + خروج) */}
              <div className="flex items-center gap-3">
                  {onSwitchBranch && (
                      <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:border-yellow-500/50 transition-colors relative group">
                          <MapPin size={16} className="text-yellow-500"/>
                          <span className="text-xs font-bold text-gray-200">{selectedBranch}</span>
                          <select 
                              value={selectedBranch} 
                              onChange={(e) => onSwitchBranch(e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          >
                              <option value="شفا بدران">شفا بدران</option>
                              <option value="أبو نصير">أبو نصير</option>
                          </select>
                      </div>
                  )}
                  
                  <button onClick={handleLogout} className="p-2 text-red-400 hover:bg-white/5 rounded-lg transition-colors" title="خروج">
                      <LogOut size={20}/>
                  </button>

                  <button className="lg:hidden p-2 text-white bg-white/10 rounded-lg" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                      {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                  </button>
              </div>
          </div>

          {/* --- قائمة الموبايل --- */}
          <AnimatePresence>
            {mobileMenuOpen && (
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "tween", duration: 0.3 }}
                    className="fixed inset-y-0 right-0 w-[85%] max-w-xs bg-[#151515] shadow-2xl z-[100] border-l border-gray-800 overflow-y-auto"
                >
                    <div className="p-5 space-y-6">
                        <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-4">
                            <h2 className="text-lg font-bold text-white">القائمة</h2>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white"><X size={20}/></button>
                        </div>

                        {onSwitchBranch && (
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 relative mb-4">
                                <span className="text-gray-500 text-xs font-bold block mb-2">تغيير الفرع</span>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-yellow-500 flex items-center gap-2 text-sm"><MapPin size={16}/> {selectedBranch}</span>
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
                            <button onClick={() => {setActiveTab('dashboard'); setMobileMenuOpen(false);}} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'dashboard' ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-300'}`}>
                                <Activity size={18}/> الرئيسية
                            </button>
                            <button onClick={() => {setActiveTab('attendance'); setMobileMenuOpen(false);}} className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'attendance' ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-300'}`}>
                                <CheckCircle size={18}/> حضور وغياب
                            </button>
                        </div>

                        <div className="pt-2">
                            <h3 className="text-xs font-bold text-gray-500 mb-3 px-1 uppercase">طلاب</h3>
                            <div className="space-y-2">
                                {studentGroups.map(item => (
                                    <button key={item.id} onClick={() => {setActiveTab(item.id); setMobileMenuOpen(false);}} className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-bold border transition-all ${activeTab === item.id ? 'bg-white/10 text-yellow-500 border-yellow-500/30' : 'text-gray-400 border-transparent hover:bg-white/5'}`}>
                                        <item.icon size={18}/> {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <h3 className="text-xs font-bold text-gray-500 mb-3 px-1 uppercase">الادارة</h3>
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
      {/* هنا الإصلاح: العرض الكامل والخلفية الرمادية لتناسب البطاقات البيضاء */}
      <main className="flex-1 w-full px-4 md:px-8 py-6 animate-fade-in text-gray-800 bg-gray-100">
         <div className="container mx-auto">
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
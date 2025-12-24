// src/views/AdminDashboard.jsx
import React, { useState, useMemo } from 'react';
import { Activity, Users, DollarSign, CheckCircle, Inbox, Clock, Archive, Shield, Menu, LogOut, Megaphone, Database } from 'lucide-react';
import { addDoc, collection } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';
import { useCollection } from '../hooks/useCollection';
import { IMAGES, BRANCHES } from '../lib/constants';

// Import Managers
import DashboardStats from './dashboard/DashboardStats';
import StudentsManager from './dashboard/StudentsManager';
import ArchiveManager from './dashboard/ArchiveManager';
import FinanceManager from './dashboard/FinanceManager';
import AttendanceManager from './dashboard/AttendanceManager';
import RegistrationsManager from './dashboard/RegistrationsManager';
import ScheduleManager from './dashboard/ScheduleManager';
import CaptainsManager from './dashboard/CaptainsManager';
import NewsManager from './dashboard/NewsManager';

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

const AdminDashboard = ({ 
    user, selectedBranch, onSwitchBranch, handleLogout,
    // استلام البيانات من App.jsx
    studentsCollection, paymentsCollection, expensesCollection, 
    scheduleCollection, archiveCollection, registrationsCollection, 
    captainsCollection, newsCollection,
    // ✅ استلام البيانات الجديدة
    productsCollection, extraIncomeCollection, monthlyNotesCollection, financeReasonsCollection
}) => {
  const [activeView, setActiveView] = useState('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 1. استخراج البيانات (Data Extraction)
  const students = studentsCollection?.data || [];
  const payments = paymentsCollection?.data || [];
  const expenses = expensesCollection?.data || [];
  const registrations = registrationsCollection?.data || [];
  const schedule = scheduleCollection?.data || [];
  const captains = captainsCollection?.data || [];
  
  // بيانات المجموعات والنشاطات (يتم جلبها داخلياً هنا)
  const groupsCollection = useCollection('groups');
  const groupsData = groupsCollection?.data || [];
  const activityLogsCollection = useCollection('activity_logs');
  const activityLogsData = activityLogsCollection?.data || [];

  // ✅ تجهيز بيانات المالية الجديدة للتمرير
  const products = productsCollection?.data || [];
  const extraIncome = extraIncomeCollection?.data || [];
  const monthlyNotes = monthlyNotesCollection?.data || [];
  const financeReasons = financeReasonsCollection?.data || [];

  // 3. فلترة البيانات حسب الفرع
  const branchStudents = useMemo(() => students.filter(s => s.branch === selectedBranch), [students, selectedBranch]);
  const branchPayments = useMemo(() => payments.filter(p => p.branch === selectedBranch), [payments, selectedBranch]);
  const branchExpenses = useMemo(() => expenses.filter(e => e.branch === selectedBranch), [expenses, selectedBranch]);
  const branchRegistrations = useMemo(() => registrations.filter(r => r.branch === selectedBranch), [registrations, selectedBranch]);
  const branchGroups = useMemo(() => groupsData.filter(g => g.branch === selectedBranch), [groupsData, selectedBranch]);
  
  // فلترة سجل النشاطات
  const branchActivityLogs = useMemo(() => {
      return activityLogsData
        .filter(l => l.branch === selectedBranch)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 50);
  }, [activityLogsData, selectedBranch]);

  // الحسابات السريعة للوحة التحكم
  const totalIncome = branchPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = branchExpenses.reduce((acc, curr) => acc + curr.amount, 0);
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

  // --- Backup Function ---
  const handleBackup = () => {
    if (!confirm("تحميل نسخة احتياطية؟")) return;
    const backupData = { date: new Date().toISOString(), branch: selectedBranch, students: branchStudents, payments: branchPayments, expenses: branchExpenses, registrations: branchRegistrations, schedule: schedule, news: newsCollection?.data, groups: branchGroups, captains: captains, activityLogs: branchActivityLogs };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const a = document.createElement('a'); a.setAttribute("href", dataStr); a.setAttribute("download", `brave_backup_${selectedBranch}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a); a.click(); a.remove();
  };

  const menuItems = [
    { id: 'stats', label: 'الإحصائيات', icon: <Shield size={20}/> },
    { id: 'students', label: 'إدارة الطلاب', icon: <Users size={20}/> },
    { id: 'finance', label: 'المالية والمتجر', icon: <DollarSign size={20}/> },
    { id: 'attendance', label: 'الحضور', icon: <CheckCircle size={20}/> },
    { id: 'schedule', label: 'البرنامج', icon: <Clock size={20}/> },
    { id: 'registrations', label: 'الطلبات', icon: <Inbox size={20}/>, badge: branchRegistrations.length },
    { id: 'news', label: 'الأخبار', icon: <Megaphone size={20}/> },
    { id: 'captains', label: 'المشرفين', icon: <Shield size={20}/>, adminOnly: true },
    { id: 'archive', label: 'الأرشيف', icon: <Archive size={20}/>, adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans text-right" dir="rtl">
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`fixed md:sticky top-0 right-0 h-screen w-64 bg-black text-yellow-500 shadow-2xl z-30 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-6 border-b border-gray-800 flex flex-col items-center">
           <img src={IMAGES.LOGO} className="w-20 h-20 mb-3 bg-white rounded-full p-1"/>
           <h2 className="font-bold text-lg text-white">لوحة التحكم</h2>
           <p className="text-xs text-gray-400">{user.name}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
           {menuItems.map(item => {
              if (item.adminOnly && user.role !== 'admin') return null;
              return (
                <button key={item.id} onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${activeView === item.id ? 'bg-yellow-500 text-black font-bold' : 'hover:bg-gray-800'}`}>
                    <div className="relative">{item.icon}{item.badge > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{item.badge}</span>}</div>
                    <span>{item.label}</span>
                </button>
              );
           })}
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-800">
             {user.role === 'admin' && <button onClick={handleBackup} className="w-full flex items-center gap-3 p-3 text-green-500 hover:bg-gray-900 rounded"><Database size={20}/> نسخ احتياطي</button>}
             <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 hover:bg-red-900/50 text-red-400 rounded"><LogOut size={20}/> خروج</button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <header className="bg-white p-4 shadow-sm flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 bg-gray-100 rounded-lg"><Menu size={24}/></button>
                <h1 className="font-bold text-xl text-gray-800">{menuItems.find(i => i.id === activeView)?.label}</h1>
            </div>
            
            {onSwitchBranch && (
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button onClick={() => onSwitchBranch(BRANCHES.SHAFA)} className={`px-4 py-2 rounded-md text-sm font-bold ${selectedBranch === BRANCHES.SHAFA ? 'bg-black text-yellow-500 shadow' : 'text-gray-500'}`}>شفا بدران</button>
                    <button onClick={() => onSwitchBranch(BRANCHES.ABU_NSEIR)} className={`px-4 py-2 rounded-md text-sm font-bold ${selectedBranch === BRANCHES.ABU_NSEIR ? 'bg-black text-yellow-500 shadow' : 'text-gray-500'}`}>أبو نصير</button>
                </div>
            )}
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {activeView === 'stats' && <DashboardStats user={user} selectedBranch={selectedBranch} branchStudents={branchStudents} netProfit={netProfit} totalAttendance={totalAttendance} expiredCount={expiredCount} activeStudentsCount={activeStudentsCount} nearEndCount={nearEndCount} totalStudents={totalStudents} branchRegistrations={branchRegistrations} branchPayments={branchPayments} activityLogs={branchActivityLogs} />}
            
            {activeView === 'students' && <StudentsManager students={branchStudents} groups={branchGroups} studentsCollection={studentsCollection} archiveCollection={archiveCollection} selectedBranch={selectedBranch} logActivity={handleLog} user={user} />}
            
            {/* ✅ تمرير البيانات بشكل صحيح للمالية */}
            {activeView === 'finance' && (
                <FinanceManager 
                    user={user} // 👈 هذا كان ناقصاً ويسبب اختفاء التبويبات
                    students={branchStudents}
                    payments={branchPayments} paymentsCollection={paymentsCollection}
                    expenses={branchExpenses} expensesCollection={expensesCollection}
                    products={products} // 👈 تمرير المنتجات
                    extraIncome={extraIncome} 
                    monthlyNotes={monthlyNotes} 
                    financeReasons={financeReasons}
                    selectedBranch={selectedBranch}
                    logActivity={handleLog}
                />
            )}

            {activeView === 'attendance' && <AttendanceManager students={branchStudents} groups={branchGroups} groupsCollection={groupsCollection} studentsCollection={studentsCollection} selectedBranch={selectedBranch} />}
            
            {activeView === 'schedule' && <ScheduleManager schedule={schedule} scheduleCollection={scheduleCollection} selectedBranch={selectedBranch} user={user} />}
            
            {activeView === 'registrations' && <RegistrationsManager registrations={branchRegistrations} students={students} registrationsCollection={registrationsCollection} studentsCollection={studentsCollection} selectedBranch={selectedBranch} logActivity={handleLog} />}
            
            {activeView === 'news' && <NewsManager user={user} news={newsCollection?.data || []} newsCollection={newsCollection} selectedBranch={selectedBranch} />}
            
            {activeView === 'captains' && user.role === 'admin' && <CaptainsManager captains={captains} captainsCollection={captainsCollection} selectedBranch={selectedBranch} />}
            
            {activeView === 'archive' && user.role === 'admin' && <ArchiveManager archive={archiveCollection?.data || []} archiveCollection={archiveCollection} selectedBranch={selectedBranch} />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
// src/views/AdminDashboard.jsx
import React, { useState, useMemo } from 'react';
import { Activity, Users, DollarSign, CheckCircle, Inbox, Clock, Archive, Shield, Menu, LogOut, Megaphone, Download, Database, FileText, MapPin, Award } from 'lucide-react';
import { addDoc, collection } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';
import { useCollection } from '../hooks/useCollection'; 

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

const AdminDashboard = ({ user, selectedBranch, studentsCollection, scheduleCollection, handleLogout, onSwitchBranch }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
  // ✅ 1. جلب ملاحظات الإدارة لتمريرها للتقرير
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

  // فلترة البيانات حسب الفرع المختار
  const branchStudents = useMemo(() => students.filter(s => s.branch === selectedBranch), [students, selectedBranch]);
  const branchPayments = useMemo(() => payments.filter(p => p.branch === selectedBranch), [payments, selectedBranch]);
  const branchExpenses = useMemo(() => expenses.filter(e => e.branch === selectedBranch), [expenses, selectedBranch]);
  const branchRegistrations = useMemo(() => registrations.filter(r => r.branch === selectedBranch), [registrations, selectedBranch]);
  const branchGroups = useMemo(() => groupsData.filter(g => g.branch === selectedBranch), [groupsData, selectedBranch]);
  const branchFinanceReasons = useMemo(() => financeReasonsData.filter(r => r.branch === selectedBranch), [financeReasonsData, selectedBranch]);
  // لا توجد فلترة لملاحظات الإدارة عادة لأنها عامة، لكن يمكن فلترتها إذا كان لها فرع
  const branchAdminNotes = adminNotesData; 

  const branchActivityLogs = useMemo(() => {
      return activityLogsData
        .filter(l => l.branch === selectedBranch)
        .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [activityLogsData, selectedBranch]);

  // الحسابات
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

  const navItems = [
    {id:'dashboard',icon:Activity,label:'نظرة عامة'},
    {id:'registrations',icon:Inbox,label:'الطلبات', badge: branchRegistrations.length},
    {id:'students',icon:Users,label:'الطلاب'},
    {id:'finance',icon:DollarSign,label:'المالية'},
    {id:'attendance',icon:CheckCircle,label:'الحضور'},
    {id:'tests',icon:Award,label:'فحوصات الترفيع'},
    {id: 'notes', label: 'ملاحظات الإدارة', icon: FileText }, 
    {id:'archive',icon:Archive,label:'الأرشيف'},
    {id:'news',icon:Megaphone,label:'الأخبار والعروض'},
    {id:'schedule',icon:Clock,label:'الجدول'},
    {id:'reports', icon: FileText, label: 'التقارير الشاملة'}, 

    {id:'captains',icon:Shield,label:'الكباتن', role: 'admin'}, 
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 text-right font-sans" dir="rtl">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-gray-300 transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-40`}>
        <div className="p-6 flex justify-between border-b border-gray-800">
            {sidebarOpen && <h2 className="font-black text-yellow-500 text-xl">لوحة التحكم</h2>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20}/></button>
        </div>
        <div className="p-4 border-b border-gray-800">
            <p className="text-white font-bold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role === 'admin' ? 'مدير عام' : 'كابتن'}</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3 custom-scrollbar">
          {navItems.filter(i => !i.role || i.role === user.role).map(item => (
            <button key={item.id} onClick={() => {setActiveTab(item.id); setSidebarOpen(false);}} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-yellow-500 text-black font-bold' : 'hover:bg-gray-800'}`}>
              <div className="relative"><item.icon size={20}/>{item.badge > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{item.badge}</span>}</div>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-800">
             {user.role === 'admin' && (
                <button onClick={handleBackup} className={`w-full flex items-center gap-4 px-4 py-3 text-green-500 hover:bg-gray-900 rounded transition-colors ${!sidebarOpen && 'justify-center'}`} title="تحميل نسخة احتياطية">
                    <Database size={20}/> {sidebarOpen && "نسخ احتياطي"}
                </button>
             )}
             
             <button onClick={handleLogout} className={`w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-gray-900 rounded transition-colors ${!sidebarOpen && 'justify-center'}`} title="تسجيل الخروج">
                 <LogOut size={20}/> {sidebarOpen && "خروج"}
             </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 w-full overflow-x-hidden">
         <div className="md:hidden mb-4 flex justify-between items-center">
            <button onClick={()=>setSidebarOpen(true)} className="p-2 bg-white rounded shadow"><Menu/></button>
            <h2 className="font-bold text-gray-800">أكاديمية الشجاع</h2>
         </div>
         
         {onSwitchBranch && (
            <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-yellow-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <MapPin className="text-yellow-600" />
                    <span className="font-bold text-gray-700">أنت تشاهد بيانات فرع:</span>
                </div>
                <select 
                    value={selectedBranch} 
                    onChange={(e) => onSwitchBranch(e.target.value)}
                    className="bg-yellow-50 border-2 border-yellow-400 text-yellow-900 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block p-2.5 font-bold outline-none cursor-pointer"
                >
                    <option value="شفا بدران">شفا بدران</option>
                    <option value="أبو نصير">أبو نصير</option>
                </select>
            </div>
         )}
         
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

         {/* ✅ 2. تمرير adminNotes للتقرير */}
         {activeTab === 'reports' && <ReportsManager 
            students={branchStudents}
            payments={branchPayments}
            expenses={branchExpenses}
            activityLogs={branchActivityLogs}
            registrations={branchRegistrations}
            adminNotes={branchAdminNotes}
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
      </main>
    </div>
  );
};

export default AdminDashboard;
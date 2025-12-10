// src/views/dashboard/DashboardStats.js
import React from 'react';
import { Users, TrendingUp, Activity, AlertTriangle, ArrowUp, UserPlus, DollarSign, Star, Trophy } from 'lucide-react';
import { Card } from '../../components/UIComponents';

export const DashboardStats = ({ user, selectedBranch, branchStudents, netProfit, totalAttendance, expiredCount, activeStudentsCount, nearEndCount, totalStudents, branchRegistrations, branchPayments }) => {
  return (
    <div className="space-y-8 animate-fade-in">
       {/* بطاقة الترحيب */}
       <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">مرحباً بك يا {user.name}! 👋</h2>
            <p className="opacity-90">نظرة سريعة على أداء فرع {selectedBranch}</p>
         </div>
         <div className="relative z-10 bg-white/20 p-4 rounded-xl backdrop-blur-sm text-center">
            <span className="block text-4xl font-bold">{new Date().getDate()}</span>
            <span className="uppercase text-sm tracking-wider">{new Date().toLocaleString('en-us', { month: 'short' })}</span>
         </div>
         <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Trophy size={200} />
         </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
               <div><p className="text-gray-500 text-sm mb-1">إجمالي الطلاب</p><h3 className="text-3xl font-bold text-gray-800">{branchStudents.length}</h3></div>
               <div className="bg-blue-100 p-2 rounded-lg"><Users className="text-blue-600" size={24}/></div>
            </div>
            <div className="mt-4 text-xs text-gray-400 flex items-center gap-1"><ArrowUp size={12} className="text-green-500"/> <span className="text-green-500 font-bold">+3</span> هذا الشهر</div>
         </Card>
         <Card className="border-l-4 border-green-500">
            <div className="flex justify-between items-start">
               <div><p className="text-gray-500 text-sm mb-1">صافي الأرباح</p><h3 className="text-3xl font-bold text-gray-800">{netProfit} <span className="text-sm text-gray-400">JOD</span></h3></div>
               <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="text-green-600" size={24}/></div>
            </div>
         </Card>
         <Card className="border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
               <div><p className="text-gray-500 text-sm mb-1">حضور الشهر</p><h3 className="text-3xl font-bold text-gray-800">{totalAttendance}</h3></div>
               <div className="bg-purple-100 p-2 rounded-lg"><Activity className="text-purple-600" size={24}/></div>
            </div>
         </Card>
         <Card className="border-l-4 border-red-500">
            <div className="flex justify-between items-start">
               <div><p className="text-gray-500 text-sm mb-1">اشتراكات منتهية</p><h3 className="text-3xl font-bold text-gray-800">{expiredCount}</h3></div>
               <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle className="text-red-600" size={24}/></div>
            </div>
         </Card>
      </div>

      {/* الرسوم البيانية والسجلات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <Card title="توزيع الاشتراكات" className="lg:col-span-1">
            <div className="flex items-center justify-center py-6">
               <div className="relative w-48 h-48 rounded-full bg-gray-100 border-8 border-white shadow-inner flex items-center justify-center" style={{background: `conic-gradient(#22c55e 0% ${activeStudentsCount/totalStudents*100 || 0}%, #eab308 ${activeStudentsCount/totalStudents*100 || 0}% ${(activeStudentsCount+nearEndCount)/totalStudents*100 || 0}%, #ef4444 ${(activeStudentsCount+nearEndCount)/totalStudents*100 || 0}% 100%)`}}>
                  <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center z-10 shadow-sm"><span className="text-3xl font-bold text-gray-800">{totalStudents}</span><span className="text-xs text-gray-400">طالب كلي</span></div>
               </div>
            </div>
            <div className="flex justify-around text-xs mt-4">
               <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-full"></div> فعال ({activeStudentsCount})</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div> قارب ({nearEndCount})</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-full"></div> منتهي ({expiredCount})</div>
            </div>
         </Card>
         <Card title="سجل النشاطات الأخير" className="lg:col-span-2">
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
               {branchRegistrations.length > 0 && <div className="flex gap-3 items-start p-3 bg-blue-50 rounded-lg border border-blue-100"><div className="bg-blue-500 text-white p-2 rounded-full"><UserPlus size={16}/></div><div><p className="text-sm font-bold text-gray-800">طلب تسجيل جديد</p><p className="text-xs text-gray-500">وصل {branchRegistrations.length} طلبات</p></div><span className="mr-auto text-xs text-blue-600 font-bold">الآن</span></div>}
               {branchPayments.slice(-3).reverse().map(pay => (<div key={pay.id} className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-lg transition"><div className="bg-green-100 text-green-600 p-2 rounded-full"><DollarSign size={16}/></div><div><p className="text-sm font-bold text-gray-800">دفعة مالية</p><p className="text-xs text-gray-500">استلام {pay.amount} من {pay.name}</p></div><span className="mr-auto text-xs text-gray-400">{pay.date}</span></div>))}
               {branchStudents.slice(-2).map(s => (<div key={s.id} className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-lg transition"><div className="bg-yellow-100 text-yellow-600 p-2 rounded-full"><Star size={16}/></div><div><p className="text-sm font-bold text-gray-800">انضمام طالب</p><p className="text-xs text-gray-500">انضم {s.name}</p></div><span className="mr-auto text-xs text-gray-400">{s.joinDate}</span></div>))}
            </div>
         </Card>
      </div>
    </div>
  );
};
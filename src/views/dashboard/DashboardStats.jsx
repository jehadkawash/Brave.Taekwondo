// src/views/dashboard/DashboardStats.jsx
import React from 'react';
import { Users, TrendingUp, Activity, AlertTriangle, ArrowUp, Trophy, User, Clock, Zap } from 'lucide-react';
import { Card } from '../../components/UIComponents';

export const DashboardStats = ({ user, selectedBranch, branchStudents, netProfit, totalAttendance, expiredCount, activeStudentsCount, nearEndCount, totalStudents, activityLogs = [] }) => {
  
  // دالة لتنسيق الوقت والتاريخ
  const formatDateTime = (isoString) => {
     if (!isoString) return { date: '-', time: '-' };
     const dateObj = new Date(isoString);
     return {
         date: dateObj.toLocaleDateString('ar-JO'),
         time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
     };
  };

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
         <Card className="border-l-4 border-blue-500 transform hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
               <div><p className="text-gray-500 text-sm mb-1">إجمالي الطلاب</p><h3 className="text-3xl font-bold text-gray-800">{branchStudents.length}</h3></div>
               <div className="bg-blue-100 p-2 rounded-lg"><Users className="text-blue-600" size={24}/></div>
            </div>
            <div className="mt-4 text-xs text-gray-400 flex items-center gap-1"><ArrowUp size={18} className="text-green-500"/> <span className="text-green-500 font-bold">+100</span> هذا الشهر</div>
         </Card>
         <Card className="border-l-4 border-green-500 transform hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
               <div><p className="text-gray-500 text-sm mb-1">صافي الأرباح</p><h3 className="text-3xl font-bold text-gray-800">{netProfit} <span className="text-sm text-gray-400">JOD</span></h3></div>
               <div className="bg-green-100 p-2 rounded-lg"><TrendingUp className="text-green-600" size={24}/></div>
            </div>
         </Card>
         <Card className="border-l-4 border-purple-500 transform hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
               <div><p className="text-gray-500 text-sm mb-1">حضور الشهر</p><h3 className="text-3xl font-bold text-gray-800">{totalAttendance}</h3></div>
               <div className="bg-purple-100 p-2 rounded-lg"><Activity className="text-purple-600" size={24}/></div>
            </div>
         </Card>
         <Card className="border-l-4 border-red-500 transform hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
               <div><p className="text-gray-500 text-sm mb-1">اشتراكات منتهية</p><h3 className="text-3xl font-bold text-gray-800">{expiredCount}</h3></div>
               <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle className="text-red-600" size={24}/></div>
            </div>
         </Card>
      </div>

      {/* الرسوم البيانية والسجلات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* الرسم البياني */}
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
         
         {/* سجل النشاطات الحقيقي */}
         <Card title="سجل النشاطات الأخير (Live Log)" className="lg:col-span-2">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {activityLogs.length === 0 ? (
                  <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                      <Zap size={32} className="mb-2 opacity-30"/>
                      <p>لا يوجد نشاطات مسجلة حديثاً</p>
                  </div>
               ) : (
                  activityLogs.map((log, index) => {
                      const { date, time } = formatDateTime(log.timestamp);
                      return (
                         <div key={index} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-xl transition border border-gray-100 shadow-sm bg-white">
                            {/* أيقونة المستخدم */}
                            <div className="bg-blue-50 text-blue-600 p-2 rounded-full mt-1 shrink-0">
                                <User size={18}/>
                            </div>
                            
                            {/* التفاصيل */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-bold text-gray-900">{log.action}</p>
                                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                                       <Clock size={10}/> {time}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                                <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-2">
                                   <p className="text-[10px] font-bold text-blue-800">بواسطة: {log.performedBy}</p>
                                   <p className="text-[10px] text-gray-400">{date}</p>
                                </div>
                            </div>
                         </div>
                      );
                  })
               )}
            </div>
         </Card>
      </div>
    </div>
  );
};
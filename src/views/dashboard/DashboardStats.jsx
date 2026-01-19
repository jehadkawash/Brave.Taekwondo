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
       <div className="bg-gradient-to-br from-yellow-600 to-orange-700 rounded-2xl p-8 text-white shadow-2xl shadow-orange-900/20 flex justify-between items-center relative overflow-hidden border border-white/10">
         <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">مرحباً بك يا {user.name}! 👋</h2>
            <p className="text-orange-100 font-medium">نظرة سريعة على أداء فرع {selectedBranch}</p>
         </div>
         <div className="relative z-10 bg-black/20 backdrop-blur-md p-4 rounded-2xl text-center border border-white/10 shadow-lg">
            <span className="block text-4xl font-bold text-yellow-300 drop-shadow-md">{new Date().getDate()}</span>
            <span className="uppercase text-xs tracking-widest font-bold text-orange-100">{new Date().toLocaleString('en-us', { month: 'short' })}</span>
         </div>
         <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10">
            <Trophy size={200} />
         </div>
      </div>

      {/* الإحصائيات الرئيسية */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Total Students */}
         <Card className="border-l-4 border-l-blue-500 hover:shadow-blue-900/20">
            <div className="flex justify-between items-start">
               <div><p className="text-slate-400 text-sm mb-1 font-bold">إجمالي الطلاب</p><h3 className="text-3xl font-black text-slate-100">{branchStudents.length}</h3></div>
               <div className="bg-blue-500/10 p-3 rounded-xl"><Users className="text-blue-400" size={24}/></div>
            </div>
            <div className="mt-4 text-xs text-slate-500 flex items-center gap-1"><ArrowUp size={14} className="text-emerald-400"/> <span className="text-emerald-400 font-bold">+100</span> هذا الشهر</div>
         </Card>

         {/* Net Profit */}
         <Card className="border-l-4 border-l-emerald-500 hover:shadow-emerald-900/20">
            <div className="flex justify-between items-start">
               <div><p className="text-slate-400 text-sm mb-1 font-bold">صافي الأرباح</p><h3 className="text-3xl font-black text-slate-100">{netProfit} <span className="text-sm text-slate-500 font-normal">JOD</span></h3></div>
               <div className="bg-emerald-500/10 p-3 rounded-xl"><TrendingUp className="text-emerald-400" size={24}/></div>
            </div>
         </Card>

         {/* Attendance */}
         <Card className="border-l-4 border-l-purple-500 hover:shadow-purple-900/20">
            <div className="flex justify-between items-start">
               <div><p className="text-slate-400 text-sm mb-1 font-bold">حضور الشهر</p><h3 className="text-3xl font-black text-slate-100">{totalAttendance}</h3></div>
               <div className="bg-purple-500/10 p-3 rounded-xl"><Activity className="text-purple-400" size={24}/></div>
            </div>
         </Card>

         {/* Expired */}
         <Card className="border-l-4 border-l-red-500 hover:shadow-red-900/20">
            <div className="flex justify-between items-start">
               <div><p className="text-slate-400 text-sm mb-1 font-bold">اشتراكات منتهية</p><h3 className="text-3xl font-black text-slate-100">{expiredCount}</h3></div>
               <div className="bg-red-500/10 p-3 rounded-xl"><AlertTriangle className="text-red-400" size={24}/></div>
            </div>
         </Card>
      </div>

      {/* الرسوم البيانية والسجلات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* الرسم البياني */}
         <Card title="توزيع الاشتراكات" className="lg:col-span-1">
            <div className="flex items-center justify-center py-6">
               <div className="relative w-48 h-48 rounded-full bg-slate-800 border-8 border-slate-900 shadow-2xl flex items-center justify-center" style={{background: `conic-gradient(#10b981 0% ${activeStudentsCount/totalStudents*100 || 0}%, #eab308 ${activeStudentsCount/totalStudents*100 || 0}% ${(activeStudentsCount+nearEndCount)/totalStudents*100 || 0}%, #ef4444 ${(activeStudentsCount+nearEndCount)/totalStudents*100 || 0}% 100%)`}}>
                  {/* Center of Donut Chart */}
                  <div className="w-32 h-32 bg-slate-900 rounded-full flex flex-col items-center justify-center z-10 shadow-inner border border-slate-800">
                      <span className="text-3xl font-black text-slate-100">{totalStudents}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">طالب كلي</span>
                  </div>
               </div>
            </div>
            <div className="flex justify-around text-xs mt-4 font-bold text-slate-400">
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]"></div> فعال ({activeStudentsCount})</div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-yellow-500 rounded-full shadow-[0_0_8px_#eab308]"></div> قارب ({nearEndCount})</div>
               <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]"></div> منتهي ({expiredCount})</div>
            </div>
         </Card>
         
         {/* سجل النشاطات الحقيقي */}
         <Card title="سجل النشاطات الأخير (Live Log)" className="lg:col-span-2">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
               {activityLogs.length === 0 ? (
                  <div className="text-center text-slate-600 py-10 flex flex-col items-center">
                      <Zap size={32} className="mb-2 opacity-20"/>
                      <p>لا يوجد نشاطات مسجلة حديثاً</p>
                  </div>
               ) : (
                  activityLogs.map((log, index) => {
                      const { date, time } = formatDateTime(log.timestamp);
                      return (
                         <div key={index} className="flex gap-4 items-start p-3 hover:bg-slate-800/50 rounded-xl transition-all duration-200 border border-slate-800 group">
                            {/* أيقونة المستخدم */}
                            <div className="bg-slate-800 text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-400 p-2.5 rounded-full mt-1 shrink-0 transition-colors">
                                <User size={16}/>
                            </div>
                            
                            {/* التفاصيل */}
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-bold text-slate-200 group-hover:text-yellow-500 transition-colors">{log.action}</p>
                                    <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-md font-mono flex items-center gap-1 border border-slate-700">
                                       <Clock size={10}/> {time}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{log.details}</p>
                                <div className="flex justify-between items-center mt-2 border-t border-slate-800 pt-2">
                                   <p className="text-[10px] font-bold text-slate-500">بواسطة: <span className="text-slate-300">{log.performedBy}</span></p>
                                   <p className="text-[10px] text-slate-600">{date}</p>
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
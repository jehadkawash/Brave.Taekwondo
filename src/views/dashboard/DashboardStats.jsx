// src/views/dashboard/DashboardStats.jsx
import React, { useMemo } from 'react';
import { 
  Users, TrendingUp, TrendingDown, DollarSign, Activity, 
  CalendarCheck, AlertCircle, PieChart as PieIcon, BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

// --- مكون البطاقة الإحصائية ---
const StatCard = ({ title, value, icon: Icon, color, subText }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-bold mb-1">{title}</p>
          <h3 className="text-3xl font-black text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${color} bg-opacity-20 text-white shadow-inner`}>
          <Icon size={24} />
        </div>
      </div>
      {subText && <p className="text-xs text-slate-500 font-bold">{subText}</p>}
    </div>
  </div>
);

export const DashboardStats = ({ 
  user, selectedBranch, branchStudents, netProfit, 
  activeStudentsCount, nearEndCount, expiredCount, 
  branchPayments, branchRegistrations 
}) => {

  // 1. تحضير بيانات الرسم البياني (توزيع الأحزمة)
  const beltData = useMemo(() => {
    const belts = {};
    branchStudents.forEach(s => {
      belts[s.belt] = (belts[s.belt] || 0) + 1;
    });
    return Object.keys(belts).map(key => ({ name: key, value: belts[key] }));
  }, [branchStudents]);

  // ألوان الأحزمة للرسم
  const COLORS = ['#eab308', '#3b82f6', '#22c55e', '#ef4444', '#a855f7', '#f97316', '#64748b'];

  // 2. تحضير بيانات المالية (آخر 6 أشهر)
  const financeData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthName = d.toLocaleDateString('ar-JO', { month: 'short' });
      
      const income = branchPayments
        .filter(p => p.date.startsWith(monthKey))
        .reduce((acc, curr) => acc + Number(curr.amount), 0);
        
      data.push({ name: monthName, دخل: income });
    }
    return data;
  }, [branchPayments]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Message */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-black text-white">لوحة القيادة</h2>
          <p className="text-slate-400 text-sm">نظرة عامة على أداء {selectedBranch}</p>
        </div>
        <div className="hidden md:block text-left">
           <p className="text-xs text-slate-500 font-bold">{new Date().toLocaleDateString('ar-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* --- Top Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="الطلاب النشطين" 
          value={activeStudentsCount} 
          icon={Users} 
          color="bg-emerald-500" 
          subText={`${branchStudents.length} طالب مسجل كلياً`}
        />
        <StatCard 
          title="صافي الدخل (تقريبي)" 
          value={`${netProfit} JD`} 
          icon={DollarSign} 
          color="bg-yellow-500" 
          subText="بناءً على المقبوضات والمصاريف"
        />
        <StatCard 
          title="اشتراكات تنتهي قريباً" 
          value={nearEndCount} 
          icon={AlertCircle} 
          color="bg-orange-500" 
          subText="خلال 7 أيام"
        />
        <StatCard 
          title="طلبات التسجيل" 
          value={branchRegistrations.length} 
          icon={Activity} 
          color="bg-blue-500" 
          subText="طلبات جديدة بانتظار الموافقة"
        />
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* 1. الرسم البياني المالي (Bar Chart) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-yellow-500"/> الأداء المالي (آخر 6 أشهر)
            </h3>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={financeData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}JD`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px' }}
                  itemStyle={{ color: '#eab308' }}
                />
                <Area type="monotone" dataKey="دخل" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. توزيع الأحزمة (Pie Chart) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <PieIcon className="text-blue-500"/> توزيع الطلاب (الأحزمة)
          </h3>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={beltData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {beltData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <div className="text-center">
                 <span className="block text-2xl font-black text-white">{branchStudents.length}</span>
                 <span className="text-[10px] text-slate-500 uppercase tracking-widest">طالب</span>
               </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {beltData.slice(0, 4).map((entry, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name}
              </div>
            ))}
             {beltData.length > 4 && <span className="text-xs text-slate-500 mt-1">...و المزيد</span>}
          </div>
        </div>

      </div>
    </div>
  );
};
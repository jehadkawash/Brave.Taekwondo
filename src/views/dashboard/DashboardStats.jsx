// src/views/dashboard/DashboardStats.jsx
import React, { useState, useMemo } from 'react';
import { 
  Users, TrendingUp, DollarSign, Activity, 
  CalendarCheck, AlertCircle, PieChart as PieIcon, BarChart3,
  Clock, UserPlus, Award, UserX, ChevronLeft, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { useCollection } from '../../hooks/useCollection'; // لجلب الفحوصات

// --- تعريف ألوان الأحزمة بدقة ---
const BELT_COLORS_MAP = {
    'أبيض': '#f8fafc',       // Slate-50
    'أصفر': '#facc15',       // Yellow-400
    'أصفر أخضر': '#bef264',  // Lime-400
    'أخضر': '#22c55e',       // Green-500
    'أخضر أزرق': '#2dd4bf',  // Teal-400
    'أزرق': '#3b82f6',       // Blue-500
    'أزرق أحمر': '#6366f1',  // Indigo-500
    'أحمر': '#ef4444',       // Red-500
    'أحمر أسود': '#9f1239',  // Rose-800
    'أسود': '#171717',       // Neutral-900
    'بوم': '#ea580c'         // Orange-600
};

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

// --- مكون القائمة المصغرة ---
const ListCard = ({ title, icon: Icon, children, colorClass = "text-yellow-500" }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col h-full">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Icon size={20} className={colorClass}/> {title}
        </h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 max-h-[250px]">
            {children}
        </div>
    </div>
);

export const DashboardStats = ({ 
  user, selectedBranch, branchStudents, netProfit, 
  activeStudentsCount, nearEndCount, activityLogs, 
  branchPayments, branchRegistrations 
}) => {
  
  // States for filters
  const [financialRange, setFinancialRange] = useState('6M'); // 1M, 3M, 6M, 9M, 1Y

  // Fetch Tests Data (للفحوصات القريبة)
  const { data: beltTests } = useCollection('belt_tests');

  // --- 1. توزيع الأحزمة (Data & Colors) ---
  const { beltData, beltColors } = useMemo(() => {
    const belts = {};
    branchStudents.forEach(s => {
        // تنظيف اسم الحزام لإزالة المسافات الزائدة
        const beltName = s.belt ? s.belt.trim() : 'أبيض';
        belts[beltName] = (belts[beltName] || 0) + 1;
    });
    
    const data = Object.keys(belts).map(key => ({ name: key, value: belts[key] }));
    // تعيين الألوان بناءً على الاسم، أو لون افتراضي إذا لم يوجد
    const colors = data.map(d => BELT_COLORS_MAP[d.name] || '#94a3b8');
    
    return { beltData: data, beltColors: colors };
  }, [branchStudents]);

  // --- 2. البيانات المالية (Financial Logic) ---
  const financeData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    if (financialRange === '1M') {
        // عرض بالأيام للشهر الحالي
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const income = branchPayments
                .filter(p => p.date === dateStr)
                .reduce((acc, curr) => acc + Number(curr.amount), 0);
            data.push({ name: `${i}`, دخل: income, fullDate: dateStr });
        }
    } else {
        // عرض بالأشهر
        let monthsBack = 6;
        if (financialRange === '3M') monthsBack = 3;
        if (financialRange === '9M') monthsBack = 9;
        if (financialRange === '1Y') monthsBack = 12;

        for (let i = monthsBack - 1; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            // تسمية الأشهر كما طلب المستخدم
            const monthName = `شهر ${d.getMonth() + 1}`; 
            
            const income = branchPayments
                .filter(p => p.date && p.date.startsWith(monthKey))
                .reduce((acc, curr) => acc + Number(curr.amount), 0);
                
            data.push({ name: monthName, دخل: income });
        }
    }
    return data;
  }, [branchPayments, financialRange]);

  // --- 3. القوائم الذكية (Smart Lists) ---
  
  // أ. الطلاب الجدد (أقل من 7 أيام)
  const newStudents = useMemo(() => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return branchStudents.filter(s => new Date(s.joinDate) >= oneWeekAgo).slice(0, 5);
  }, [branchStudents]);

  // ب. الطلاب الغائبين (أكثر من 5 أيام)
  const absentStudents = useMemo(() => {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      const fiveDaysStr = fiveDaysAgo.toISOString().split('T')[0];

      return branchStudents.filter(s => {
          if (!s.attendance) return true; // لم يحضر أبداً
          // نأخذ كل تواريخ الحضور، نرتبها، ونأخذ آخر تاريخ
          const dates = Object.keys(s.attendance).sort();
          const lastAtt = dates[dates.length - 1];
          return !lastAtt || lastAtt < fiveDaysStr;
      }).slice(0, 5);
  }, [branchStudents]);

  // ج. الفحوصات القريبة
  const upcomingTests = useMemo(() => {
      if (!beltTests) return [];
      const today = new Date().toISOString().split('T')[0];
      return beltTests
        .filter(t => t.date >= today && t.branch === selectedBranch)
        .sort((a,b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
  }, [beltTests, selectedBranch]);

  // د. آخر الحركات
  const recentLogs = useMemo(() => {
      return (activityLogs || []).slice(0, 5);
  }, [activityLogs]);


  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-black text-white">لوحة القيادة</h2>
          <p className="text-slate-400 text-sm">نظرة عامة على أداء {selectedBranch}</p>
        </div>
        <div className="hidden md:block text-left bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
           <p className="text-xs text-slate-500 font-bold">{new Date().toLocaleDateString('ar-JO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* --- Top Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="الطلاب النشطين" value={activeStudentsCount} icon={Users} color="bg-emerald-500" subText={`${branchStudents.length} طالب مسجل كلياً`}/>
        <StatCard title="صافي الدخل" value={`${netProfit} JD`} icon={DollarSign} color="bg-yellow-500" subText="الإيرادات - المصاريف"/>
        <StatCard title="اشتراكات تنتهي قريباً" value={nearEndCount} icon={AlertCircle} color="bg-orange-500" subText="خلال 7 أيام"/>
        <StatCard title="طلبات التسجيل" value={branchRegistrations.length} icon={Activity} color="bg-blue-500" subText="طلبات جديدة بانتظار الموافقة"/>
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* 1. الرسم البياني المالي */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-yellow-500"/> الأداء المالي
            </h3>
            
            {/* أزرار الفلترة */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
                {['1M', '3M', '6M', '9M', '1Y'].map(range => (
                    <button 
                        key={range}
                        onClick={() => setFinancialRange(range)}
                        className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${financialRange === range ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
                    >
                        {range === '1M' ? 'شهر' : range === '1Y' ? 'سنة' : range}
                    </button>
                ))}
            </div>
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
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '10px' }}
                  itemStyle={{ color: '#eab308' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="دخل" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. توزيع الأحزمة (بالألوان الحقيقية) */}
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
                    <Cell key={`cell-${index}`} fill={beltColors[index]} stroke="rgba(0,0,0,0)" />
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
          <div className="mt-4 flex flex-wrap gap-2 justify-center max-h-[100px] overflow-y-auto custom-scrollbar">
            {beltData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-slate-300 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <div className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: beltColors[index] }}></div>
                {entry.name} <span className="text-[10px] text-slate-500">({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- Bottom Grid (Smart Lists) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          {/* 1. آخر الحركات (Activity Log) */}
          <ListCard title="آخر الحركات" icon={Clock} colorClass="text-slate-400">
              {recentLogs.length > 0 ? recentLogs.map((log, i) => (
                  <div key={i} className="text-sm border-b border-slate-800/50 pb-2 last:border-0">
                      <p className="text-slate-200 font-bold">{log.action}</p>
                      <p className="text-slate-500 text-xs truncate">{log.details}</p>
                      <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-blue-400 bg-blue-900/10 px-1.5 py-0.5 rounded">{log.performedBy}</span>
                          <span className="text-[10px] text-slate-600">{new Date(log.timestamp).toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'})}</span>
                      </div>
                  </div>
              )) : <p className="text-center text-slate-600 text-xs py-4">لا يوجد حركات حديثة</p>}
          </ListCard>

          {/* 2. طلاب جدد (New Students) */}
          <ListCard title="طلاب جدد (أسبوع)" icon={UserPlus} colorClass="text-emerald-500">
              {newStudents.length > 0 ? newStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-emerald-900/10 border border-emerald-500/10">
                      <div>
                          <p className="text-emerald-100 text-sm font-bold">{s.name}</p>
                          <p className="text-[10px] text-emerald-500/70">{s.joinDate}</p>
                      </div>
                      <span className="text-xs bg-emerald-500 text-slate-900 font-bold px-2 py-0.5 rounded-full">جديد</span>
                  </div>
              )) : <p className="text-center text-slate-600 text-xs py-4">لا يوجد طلاب جدد هذا الأسبوع</p>}
          </ListCard>

          {/* 3. فحوصات قادمة (Upcoming Tests) */}
          <ListCard title="أقرب الفحوصات" icon={Award} colorClass="text-blue-500">
              {upcomingTests.length > 0 ? upcomingTests.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-blue-900/10 border border-blue-500/10">
                      <div>
                          <p className="text-blue-100 text-sm font-bold">{t.title}</p>
                          <p className="text-[10px] text-blue-500/70">{t.date} • {t.time}</p>
                      </div>
                      <div className="text-center bg-slate-900 px-2 py-1 rounded border border-slate-700">
                          <span className="block text-[10px] text-slate-500">التكلفة</span>
                          <span className="text-xs text-yellow-500 font-bold">{t.price} JD</span>
                      </div>
                  </div>
              )) : <p className="text-center text-slate-600 text-xs py-4">لا يوجد فحوصات مجدولة قريباً</p>}
          </ListCard>

          {/* 4. الغياب (Absent Students) */}
          <ListCard title="غياب > 5 أيام" icon={UserX} colorClass="text-red-500">
              {absentStudents.length > 0 ? absentStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-red-900/10 border border-red-500/10">
                      <div>
                          <p className="text-red-100 text-sm font-bold">{s.name}</p>
                          <p className="text-[10px] text-red-500/70">{s.phone}</p>
                      </div>
                      <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-slate-600 transition-colors">
                          تواصل
                      </button>
                  </div>
              )) : <p className="text-center text-slate-600 text-xs py-4">الالتزام ممتاز! لا يوجد غياب طويل</p>}
          </ListCard>

      </div>
    </div>
  );
};
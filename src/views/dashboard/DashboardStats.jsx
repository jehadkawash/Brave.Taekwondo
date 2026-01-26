// src/views/dashboard/DashboardStats.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Users, DollarSign, Activity, 
  AlertCircle, PieChart as PieIcon, BarChart3,
  Clock, UserPlus, Award, UserX, Phone, MessageCircle, 
  X, List, Calendar, ChevronLeft, ChevronRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';
import { useCollection } from '../../hooks/useCollection'; 

// --- ترتيب الأحزمة الثابت ---
const BELT_ORDER = [
    'أبيض', 
    'أصفر', 
    'أخضر 1', 'أخضر 2', 'أخضر',
    'أزرق 1', 'أزرق 2', 'أزرق',
    'بني 1', 'بني 2', 'بني', 
    'أحمر 1', 'أحمر 2', 'أحمر',
    'أسود', 'بوم'
];

// --- ألوان الأحزمة ---
const BELT_COLORS_MAP = {
    'أبيض': '#f8fafc',       
    'أصفر': '#facc15',       
    'أخضر 1': '#4ade80', 'أخضر 2': '#22c55e', 'أخضر': '#16a34a',
    'أزرق 1': '#60a5fa', 'أزرق 2': '#3b82f6', 'أزرق': '#2563eb',
    'بني 1': '#c084fc', 'بني 2': '#a855f7', 'بني': '#9333ea',
    'أحمر 1': '#f87171', 'أحمر 2': '#ef4444', 'أحمر': '#dc2626',
    'أسود': '#171717', 'بوم': '#ea580c'
};

// --- دالة تنسيق التاريخ الآمنة ---
const safeDate = (dateStr) => {
    try {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        return d;
    } catch { return null; }
};

// --- مودال سجل الحركات الكامل ---
const LogsModal = ({ isOpen, onClose, logs }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-2xl h-[80vh] flex flex-col animate-fade-in">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <List size={24} className="text-blue-500"/> سجل العمليات الكامل
                    </h3>
                    <button onClick={onClose}><X size={24} className="text-slate-500 hover:text-red-500"/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-2">
                    {logs.map((log, i) => {
                        const dateObj = safeDate(log.timestamp);
                        return (
                            <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                                <div>
                                    <p className="text-slate-200 font-bold text-sm">{log.action}</p>
                                    <p className="text-slate-500 text-xs mt-1">{log.details}</p>
                                </div>
                                <div className="text-left min-w-[80px]">
                                    <span className="block text-[10px] text-blue-400 bg-blue-900/10 px-2 py-1 rounded mb-1 text-center">{log.performedBy || 'System'}</span>
                                    <span className="text-[10px] text-slate-600 dir-ltr block text-center">
                                        {dateObj ? dateObj.toLocaleDateString('en-GB') : '-'}
                                    </span>
                                    <span className="text-[10px] text-slate-600 dir-ltr block text-center">
                                        {dateObj ? dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- مكون البطاقة الإحصائية ---
const StatCard = ({ title, value, icon: Icon, color, subText }) => (
  <div className="bg-slate-900 border border-slate-800 p-5 md:p-6 rounded-3xl shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all">
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-slate-400 text-sm font-bold mb-1">{title}</p>
          <h3 className="text-2xl md:text-3xl font-black text-white">{value}</h3>
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
const ListCard = ({ title, icon: Icon, children, colorClass = "text-yellow-500", extraHeader }) => (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col h-full min-h-[280px]">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Icon size={20} className={colorClass}/> {title}
            </h3>
            {extraHeader}
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {children}
        </div>
    </div>
);

export const DashboardStats = ({ 
  user, selectedBranch, branchStudents = [], netProfit, 
  activeStudentsCount, nearEndCount, activityLogs = [], 
  branchPayments = [], branchRegistrations = [], totalAttendance = 0 
}) => {
  
  // States
  const [financialYear, setFinancialYear] = useState(new Date().getFullYear());
  const [time, setTime] = useState(new Date());
  const [showLogsModal, setShowLogsModal] = useState(false);

  // تحديث الوقت كل ثانية
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Tests Data
  const { data: beltTests } = useCollection('belt_tests');

  // --- 1. توزيع الأحزمة (مرتب حسب الطلب) ---
  const { beltData, beltColors } = useMemo(() => {
    const belts = {};
    branchStudents.forEach(s => {
        let beltName = s.belt ? s.belt.trim() : 'أبيض';
        belts[beltName] = (belts[beltName] || 0) + 1;
    });
    
    // تحويل البيانات لمصفوفة
    let data = Object.keys(belts).map(key => ({ name: key, value: belts[key] }));
    
    // الترتيب حسب المصفوفة الثابتة
    data.sort((a, b) => {
        let indexA = BELT_ORDER.indexOf(a.name);
        let indexB = BELT_ORDER.indexOf(b.name);
        // إذا الحزام مش موجود بالقائمة، حطه بالآخر
        if (indexA === -1) indexA = 999;
        if (indexB === -1) indexB = 999;
        return indexA - indexB;
    });

    const colors = data.map(d => BELT_COLORS_MAP[d.name] || '#94a3b8');
    
    return { beltData: data, beltColors: colors };
  }, [branchStudents]);

  // --- 2. البيانات المالية (حسب السنة المختارة) ---
  const financeData = useMemo(() => {
    const data = [];
    for (let i = 0; i < 12; i++) {
        const monthIndex = i + 1;
        const monthKey = `${financialYear}-${String(monthIndex).padStart(2, '0')}`;
        
        const income = branchPayments
            .filter(p => p.date && p.date.startsWith(monthKey))
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
            
        data.push({ name: `${monthIndex}`, دخل: income });
    }
    return data;
  }, [branchPayments, financialYear]);

  // --- 3. القوائم الذكية (المنطق المصحح) ---
  
  const newStudents = useMemo(() => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return branchStudents.filter(s => {
          const join = safeDate(s.joinDate);
          return join && join >= oneWeekAgo;
      }).slice(0, 5);
  }, [branchStudents]);

  // ✅ تصحيح منطق الغياب
  const absentStudents = useMemo(() => {
      const today = new Date();
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(today.getDate() - 5);
      
      // توحيد الوقت للمقارنة العادلة
      fiveDaysAgo.setHours(23, 59, 59, 999);

      return branchStudents.filter(s => {
          // 1. إذا كان الطالب جديداً (انضم خلال آخر 5 أيام) لا نعتبره غائباً
          const joinDate = safeDate(s.joinDate);
          if (joinDate && joinDate > fiveDaysAgo) return false;

          // 2. إذا لم يكن لديه سجل حضور نهائياً، وانضم من فترة طويلة -> يعتبر غائب
          if (!s.attendance || Object.keys(s.attendance).length === 0) return true;
          
          // 3. نأخذ آخر تاريخ حضور
          const dates = Object.keys(s.attendance).map(d => new Date(d)).sort((a,b) => b - a); // تنازلي
          const lastAttDate = dates[0]; // أحدث تاريخ

          // إذا كان آخر حضور أقدم من 5 أيام -> يعتبر غائب
          return lastAttDate < fiveDaysAgo;
      }).slice(0, 10); 
  }, [branchStudents]);

  // ✅ تصحيح منطق الفحوصات (مقارنة تواريخ صحيحة)
  const upcomingTests = useMemo(() => {
      if (!beltTests) return [];
      
      // تاريخ اليوم مصفر الوقت (00:00:00)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return beltTests
        .filter(t => {
            const testDate = safeDate(t.date);
            // إذا التاريخ غير صالح أو قديم، نستبعده
            // إذا كان التاريخ أكبر من أو يساوي اليوم
            return testDate && testDate >= today && t.branch === selectedBranch;
        })
        .sort((a,b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
  }, [beltTests, selectedBranch]);

  const recentLogs = useMemo(() => {
      return (activityLogs || []).slice(0, 5);
  }, [activityLogs]);

  // --- Helpers for Actions ---
  const openWhatsApp = (phone) => {
      if (!phone) return;
      let cleanPhone = phone.replace(/\D/g, ''); 
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
      window.open(`https://wa.me/962${cleanPhone}`, '_blank');
  };

  const callPhone = (phone) => {
      window.open(`tel:${phone}`, '_self');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans pb-20 md:pb-0">
      
      {/* Modal for All Logs */}
      <LogsModal isOpen={showLogsModal} onClose={() => setShowLogsModal(false)} logs={activityLogs || []} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-black text-white">اللوحة الرئيسية</h2>
          <p className="text-slate-400 text-sm">نظرة عامة على أداء {selectedBranch}</p>
        </div>
        
        {/* Date & Time Widget */}
        <div className="bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-lg w-full md:w-auto justify-between md:justify-start">
           <div className="text-left">
               <p className="text-lg font-black text-white dir-ltr leading-none">
                   {time.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit', second: '2-digit', hour12: true})}
               </p>
           </div>
           <div className="h-8 w-px bg-slate-700"></div>
           <div className="text-right">
               <p className="text-xs text-slate-400 font-bold mb-0.5">
                   {time.toLocaleDateString('ar-JO', { weekday: 'long' })}
               </p>
               <p className="text-sm font-bold text-yellow-500 dir-ltr">
                   {time.toLocaleDateString('en-GB')} {/* يعرض 26/01/2026 */}
               </p>
           </div>
        </div>
      </div>

      {/* --- Top Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="الطلاب النشطين" value={activeStudentsCount} icon={Users} color="bg-emerald-500" subText={`${branchStudents.length} طالب مسجل كلياً`}/>
        <StatCard title="حضور الشهر الحالي" value={totalAttendance} icon={Clock} color="bg-blue-500" subText="مجموع الحصص المحضورة"/>
        <StatCard title="صافي الدخل" value={`${netProfit} JD`} icon={DollarSign} color="bg-yellow-500" subText="الإيرادات - المصاريف"/>
        <StatCard title="اشتراكات تنتهي قريباً" value={nearEndCount} icon={AlertCircle} color="bg-orange-500" subText="خلال 7 أيام"/>
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* 1. الرسم البياني المالي */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg">
          <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="text-yellow-500"/> الأداء المالي
            </h3>
            
            {/* Year Selector */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 items-center">
                <button onClick={() => setFinancialYear(y => y - 1)} className="p-1 hover:text-white text-slate-500"><ChevronLeft size={16}/></button>
                <span className="px-3 font-bold text-slate-200 text-sm">{financialYear}</span>
                <button onClick={() => setFinancialYear(y => y + 1)} className="p-1 hover:text-white text-slate-500"><ChevronRight size={16}/></button>
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
                  formatter={(value) => [`${value} JD`, 'الدخل']}
                />
                <Area type="monotone" dataKey="دخل" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. توزيع الأحزمة (مرتبة بالألوان الصحيحة) */}
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
                  paddingAngle={2}
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
                 <span className="block text-3xl font-black text-white">{branchStudents.length}</span>
                 <span className="text-[10px] text-slate-500 uppercase tracking-widest">طالب</span>
               </div>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center max-h-[100px] overflow-y-auto custom-scrollbar">
            {beltData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1 text-[10px] text-slate-300 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                <div className="w-2 h-2 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: beltColors[index] }}></div>
                {entry.name} <span className="font-bold text-slate-500">({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- Bottom Grid (Smart Lists) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          
          {/* 1. آخر الحركات */}
          <ListCard 
            title="آخر العمليات" 
            icon={Activity} 
            colorClass="text-slate-400"
            extraHeader={
                <button onClick={() => setShowLogsModal(true)} className="text-[10px] text-blue-400 hover:text-white underline">عرض الكل</button>
            }
          >
              {recentLogs.length > 0 ? recentLogs.map((log, i) => (
                  <div key={i} className="text-sm border-b border-slate-800/50 pb-2 last:border-0 group">
                      <div className="flex justify-between">
                          <p className="text-slate-200 font-bold text-xs">{log.action}</p>
                          <span className="text-[9px] text-slate-600 dir-ltr">
                              {safeDate(log.timestamp) ? safeDate(log.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '-'}
                          </span>
                      </div>
                      <p className="text-slate-500 text-[10px] truncate">{log.details}</p>
                  </div>
              )) : <p className="text-center text-slate-600 text-xs py-4">لا يوجد حركات حديثة</p>}
          </ListCard>

          {/* 2. طلاب جدد (أسبوع) */}
          <ListCard title="طلاب جدد (أسبوع)" icon={UserPlus} colorClass="text-emerald-500">
              {newStudents.length > 0 ? newStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-emerald-900/10 border border-emerald-500/10">
                      <div>
                          <p className="text-emerald-100 text-xs font-bold">{s.name}</p>
                          <p className="text-[10px] text-emerald-500/70">{s.joinDate}</p>
                      </div>
                      <span className="text-[10px] bg-emerald-500 text-slate-900 font-bold px-1.5 py-0.5 rounded">NEW</span>
                  </div>
              )) : <p className="text-center text-slate-600 text-xs py-4">لا يوجد طلاب جدد هذا الأسبوع</p>}
          </ListCard>

          {/* 3. أقرب الفحوصات (مستقبلاً) */}
          <ListCard title="أقرب الفحوصات" icon={Award} colorClass="text-blue-500">
              {upcomingTests.length > 0 ? upcomingTests.map(t => (
                  <div key={t.id} className="flex items-center justify-between p-2 rounded-lg bg-blue-900/10 border border-blue-500/10">
                      <div>
                          <p className="text-blue-100 text-xs font-bold">{t.title}</p>
                          <p className="text-[10px] text-blue-500/70 dir-ltr text-right">{t.date}</p>
                      </div>
                      <div className="text-center bg-slate-900 px-2 py-1 rounded border border-slate-700">
                          <span className="block text-[8px] text-slate-500">سعر</span>
                          <span className="text-xs text-yellow-500 font-bold">{t.price} JD</span>
                      </div>
                  </div>
              )) : <p className="text-center text-slate-600 text-xs py-4">لا يوجد فحوصات قادمة</p>}
          </ListCard>

          {/* 4. الغياب (> 5 أيام) - أزرار تواصل فعلية */}
          <ListCard title="غياب > 5 أيام" icon={UserX} colorClass="text-red-500">
              {absentStudents.length > 0 ? absentStudents.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-red-900/10 border border-red-500/10">
                      <div className="flex-1 min-w-0">
                          <p className="text-red-100 text-xs font-bold truncate">{s.name}</p>
                          <p className="text-[10px] text-red-500/70">{s.phone}</p>
                      </div>
                      <div className="flex gap-1">
                          <button onClick={() => callPhone(s.phone)} className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-1.5 rounded border border-slate-600" title="اتصال">
                              <Phone size={12}/>
                          </button>
                          <button onClick={() => openWhatsApp(s.phone)} className="bg-green-600 hover:bg-green-500 text-white p-1.5 rounded border border-green-500 shadow-sm" title="واتساب">
                              <MessageCircle size={12}/>
                          </button>
                      </div>
                  </div>
              )) : <p className="text-center text-slate-600 text-xs py-4">الالتزام ممتاز! لا يوجد غياب طويل</p>}
          </ListCard>

      </div>
    </div>
  );
};
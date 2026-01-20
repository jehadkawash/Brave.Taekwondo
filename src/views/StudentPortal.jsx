import React, { useState, useMemo } from 'react';
import { 
  Clock, LogOut, ChevronLeft, ChevronRight, Settings, Megaphone, 
  Calendar, CreditCard, User, Wallet, ArrowDownLeft, X 
} from 'lucide-react';
import { Button, StatusBadge } from '../components/UIComponents';
import { IMAGES } from '../lib/constants';
import { updateDoc, doc } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';
import { useCollection } from '../hooks/useCollection';
import { motion, AnimatePresence } from 'framer-motion';

const StudentPortal = ({ user, students, schedule, news, handleLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const changeMonth = (inc) => { const d = new Date(currentDate); d.setMonth(d.getMonth() + inc); setCurrentDate(d); };
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const paymentsCollection = useCollection('payments');
  const payments = paymentsCollection.data || [];

  const currentUserData = students.find(s => s.id === user.id) || user;
  const myStudents = students.filter(s => s.familyId === user.familyId);
  
  const displayFamilyName = useMemo(() => {
    let name = currentUserData.familyName || 'عائلة';
    if (name.trim() === 'عائلة' || name.trim().toLowerCase() === 'family') {
        const lastNames = {};
        myStudents.forEach(s => {
            const parts = s.name.trim().split(/\s+/);
            if (parts.length > 1) {
                const last = parts[parts.length - 1];
                lastNames[last] = (lastNames[last] || 0) + 1;
            }
        });
        const entries = Object.entries(lastNames).sort((a,b) => b[1] - a[1]);
        if (entries.length > 0) name = `عائلة ${entries[0][0]}`;
    }
    return name;
  }, [currentUserData, myStudents]);

  const myPayments = useMemo(() => payments
    .filter(p => myStudents.some(s => s.id === p.studentId))
    .sort((a, b) => new Date(b.date) - new Date(a.date)), [payments, myStudents]);
  
  const relevantNews = useMemo(() => {
    const studentBranches = [...new Set(myStudents.map(s => s.branch))];
    return (news || [])
      .filter(n => !n.branch || n.branch === 'الكل' || studentBranches.includes(n.branch))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [news, myStudents]);

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

  const [showSettings, setShowSettings] = useState(false);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!creds.username || !creds.password) return alert("الرجاء تعبئة جميع الحقول");
    setIsUpdating(true);
    try {
      const studentRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUserData.id);
      await updateDoc(studentRef, { username: creds.username, password: creds.password });
      const updatedUserLocal = { ...user, username: creds.username, password: creds.password };
      localStorage.setItem('braveUser', JSON.stringify(updatedUserLocal));
      alert("تم تحديث بيانات الدخول بنجاح!");
      setShowSettings(false);
    } catch (error) { console.error(error); alert("حدث خطأ أثناء التحديث"); } 
    finally { setIsUpdating(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-right text-slate-200 selection:bg-yellow-500/30 selection:text-white" dir="rtl">
      
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-40">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-lg animate-pulse"></div>
                <img src={IMAGES.LOGO} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 relative z-10 bg-slate-900 rounded-full p-1 border border-yellow-500/20 object-contain" />
             </div>
             <div>
                 <h1 className="font-black text-lg md:text-xl text-slate-100 tracking-wide">أهلاً <span className="text-yellow-500">{displayFamilyName}</span></h1>
                 <p className="text-[10px] md:text-xs text-slate-500 font-bold uppercase tracking-widest">بوابة العائلة</p>
             </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
                onClick={() => {
                    setCreds({ username: currentUserData.username, password: currentUserData.password });
                    setShowSettings(true);
                }} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm font-bold flex items-center gap-2 transition-all"
            >
                <Settings size={18}/> <span className="hidden md:inline">الإعدادات</span>
            </Button>
            <Button onClick={handleLogout} className="bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/20 rounded-xl px-3 py-2 text-xs md:text-sm font-bold flex items-center gap-2 transition-all">
                <LogOut size={18}/> <span className="hidden md:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-10">
        
        {/* --- Top Dashboard Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* 1. News Slider */}
            <div className="lg:col-span-2 space-y-4">
                 <div className="flex items-center gap-2 mb-2">
                    <Megaphone size={20} className="text-yellow-500"/>
                    <h2 className="text-xl font-black text-slate-100">آخر المستجدات</h2>
                </div>
                {relevantNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                         {relevantNews.slice(0, 2).map((n, idx) => (
                            <motion.div 
                               initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                               key={n.id} 
                               className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-yellow-500/20 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-lg"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/10 transition-colors"></div>
                                
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-[10px] font-bold bg-yellow-500 text-slate-900 px-2 py-0.5 rounded-lg">{n.branch || 'عام'}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">{new Date(n.createdAt).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-100 mb-2 line-clamp-2">{n.title}</h3>
                                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">{n.desc}</p>
                                </div>
                            </motion.div>
                         ))}
                    </div>
                ) : (
                    <div className="bg-slate-900 rounded-3xl p-8 flex items-center justify-center text-slate-600 h-[180px] border border-slate-800 border-dashed">لا يوجد أخبار حالياً</div>
                )}
            </div>

            {/* 2. Wallet */}
            <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <Wallet size={20} className="text-emerald-500"/>
                    <h2 className="text-xl font-black text-slate-100">المحفظة المالية</h2>
                </div>
                
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] p-6 relative overflow-hidden h-full min-h-[220px] shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>

                    {myPayments.length > 0 ? (
                        <div className="relative z-10 h-full flex flex-col">
                            <p className="text-slate-500 text-xs font-bold mb-4">آخر 3 حركات مالية</p>
                            <div className="space-y-3 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                                {myPayments.slice(0, 3).map(p => (
                                    <div key={p.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-700 hover:border-emerald-500/30 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center text-emerald-500 shrink-0">
                                            <ArrowDownLeft size={16}/>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold text-slate-200 truncate">{p.reason}</h4>
                                            <p className="text-[10px] text-slate-500 truncate">{p.name} • {p.date}</p>
                                        </div>
                                        <span className="text-emerald-400 font-bold font-mono text-sm">{p.amount} JD</span>
                                    </div>
                                ))}
                            </div>
                            {myPayments.length > 3 && (
                                <div className="mt-3 pt-3 border-t border-slate-800 text-center">
                                    <span className="text-[10px] text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">عرض كل السجل</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            <CreditCard size={40} className="opacity-20 mb-3"/>
                            <p className="text-sm">لا يوجد دفعات مسجلة</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- Students Section --- */}
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-2 bg-blue-900/20 rounded-lg text-blue-500"><User size={24}/></div>
                <h2 className="text-2xl font-black text-slate-100">الأبطال المسجلين</h2>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {myStudents.map((s, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                        key={s.id} 
                        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                    >
                        {/* Student Card Header */}
                        <div className="h-28 bg-slate-950 border-b border-slate-800 p-6 flex justify-between items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                            <div className="relative z-10 flex items-center gap-4">
                                <div className={`w-3 h-12 rounded-full ${s.balance > 0 ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-emerald-500 shadow-[0_0_15px_#10b981]'}`}></div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-100 mb-1">{s.name}</h3>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">{s.branch}</span>
                                </div>
                            </div>
                            <div className="relative z-10 text-center">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">الحزام</p>
                                <p className="text-xl font-black text-yellow-500">{s.belt}</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-6 md:p-8">
                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4 mb-8">
                                <div className="bg-slate-950 flex-1 min-w-[120px] rounded-2xl p-4 border border-slate-800">
                                    <p className="text-[10px] text-slate-500 font-bold mb-2">الاشتراك</p>
                                    <div className="flex items-center gap-2 mb-1">
                                        <StatusBadge status={calculateStatus(s.subEnd)}/>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-mono">{s.subEnd}</p>
                                </div>
                                <div className="bg-slate-950 flex-1 min-w-[120px] rounded-2xl p-4 border border-slate-800">
                                    <p className="text-[10px] text-slate-500 font-bold mb-2">الرصيد</p>
                                    <p className={`text-xl font-black ${s.balance > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{s.balance} JD</p>
                                    <p className="text-[10px] text-slate-400 mt-1">{s.balance > 0 ? 'مستحق للدفع' : 'مدفوع'}</p>
                                </div>
                            </div>

                            {/* Attendance Calendar */}
                            <div className="bg-slate-950/50 rounded-3xl p-5 border border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-slate-300 text-sm flex items-center gap-2"><Calendar size={16} className="text-blue-500"/> الحضور</h4>
                                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
                                        <Button variant="ghost" onClick={()=>changeMonth(-1)} className="text-slate-500 hover:text-white p-0.5"><ChevronRight size={14}/></Button>
                                        <span className="text-xs font-bold font-mono dir-ltr text-slate-300">{monthNames[month]} {year}</span>
                                        <Button variant="ghost" onClick={()=>changeMonth(1)} className="text-slate-500 hover:text-white p-0.5"><ChevronLeft size={14}/></Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {[...Array(daysInMonth)].map((_,i)=>{
                                        const d=i+1; 
                                        const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; 
                                        const isPresent = s.attendance && s.attendance[dateStr];
                                        return (
                                            <div key={d} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all
                                                ${isPresent ? 'bg-emerald-500 text-slate-900 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
                                                {d}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* --- Schedule Section --- */}
        <div className="space-y-6 pb-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Clock size={24}/></div>
                <h2 className="text-2xl font-black text-slate-100">جدول الحصص</h2>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 relative overflow-hidden shadow-xl">
                {schedule && schedule.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                        {schedule.map(cls => (
                            <div key={cls.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 hover:border-yellow-500/30 transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">{cls.branch}</span>
                                    <Clock size={16} className="text-slate-600 group-hover:text-yellow-500 transition-colors"/>
                                </div>
                                <h4 className="text-lg font-black text-slate-200 mb-2">{cls.level}</h4>
                                <div className="flex flex-col gap-1 text-xs text-slate-500 font-medium">
                                    <p>{cls.days}</p>
                                    <p className="text-yellow-500">{cls.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 text-slate-600">لا يوجد جدول معلن حالياً</div>
                )}
            </div>
        </div>

      </div>

      {/* Settings Modal (Dark Theme) */}
      <AnimatePresence>
          {showSettings && (
            <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-slate-950 p-6 text-center border-b border-slate-800">
                        <h3 className="text-xl font-black text-slate-100">تحديث بيانات الدخول</h3>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="absolute top-4 left-4 text-slate-500 hover:text-red-500 transition-colors"><X size={24}/></button>
                    
                    <form onSubmit={handleUpdateCredentials} className="p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2">اسم المستخدم الجديد</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-4 rounded-xl focus:border-yellow-500 outline-none transition-colors font-bold dir-ltr text-left"
                                value={creds.username}
                                onChange={(e) => setCreds({...creds, username: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2">كلمة المرور الجديدة</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-4 rounded-xl focus:border-yellow-500 outline-none transition-colors font-bold dir-ltr text-left"
                                value={creds.password}
                                onChange={(e) => setCreds({...creds, password: e.target.value})}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isUpdating} className="w-full py-4 bg-yellow-500 text-slate-900 font-black hover:bg-yellow-400 rounded-xl shadow-lg shadow-yellow-500/20 border-none">
                            {isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </Button>
                    </form>
                </motion.div>
            </div>
          )}
      </AnimatePresence>
    </div>
  );
};

export default StudentPortal;
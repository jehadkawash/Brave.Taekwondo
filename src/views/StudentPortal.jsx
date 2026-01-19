// src/views/StudentPortal.jsx
import React, { useState, useMemo } from 'react';
import { 
  Clock, LogOut, ChevronLeft, ChevronRight, Settings, X, Megaphone, 
  Calendar, CreditCard, User, TrendingUp, AlertCircle, CheckCircle2 
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

  // جلب الدفعات
  const paymentsCollection = useCollection('payments');
  const payments = paymentsCollection.data || [];

  const currentUserData = students.find(s => s.id === user.id) || user;
  const myStudents = students.filter(s => s.familyId === user.familyId);
  
  // استنتاج اسم العائلة
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

  // ترتيب الدفعات
  const myPayments = useMemo(() => payments
    .filter(p => myStudents.some(s => s.id === p.studentId))
    .sort((a, b) => new Date(b.date) - new Date(a.date)), [payments, myStudents]);
  
  // فلترة الأخبار
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

  // إعدادات المستخدم
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
    <div className="min-h-screen bg-[#0a0a0a] font-sans text-right text-white selection:bg-yellow-500 selection:text-black" dir="rtl">
      
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-lg animate-pulse"></div>
                <img src={IMAGES.LOGO} alt="Logo" className="w-12 h-12 relative z-10 bg-black rounded-full p-1 border border-yellow-500/30 object-contain" />
             </div>
             <div>
                 <h1 className="font-black text-xl text-white tracking-wide">مرحباً <span className="text-yellow-500">{displayFamilyName}</span></h1>
                 <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">بوابة العائلة</p>
             </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
                onClick={() => {
                    setCreds({ username: currentUserData.username, password: currentUserData.password });
                    setShowSettings(true);
                }} 
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all"
            >
                <Settings size={18}/> <span className="hidden md:inline">الإعدادات</span>
            </Button>
            <Button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl px-4 py-2 text-sm font-bold flex items-center gap-2 transition-all">
                <LogOut size={18}/> <span className="hidden md:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-6 md:p-8 max-w-7xl space-y-12">
        
        {/* News & Announcements (Modern Slider Look) */}
        {relevantNews.length > 0 && (
            <div className="grid gap-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Megaphone size={24}/></div>
                    <h2 className="text-2xl font-black text-white">آخر المستجدات</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {relevantNews.slice(0, 3).map((n, idx) => (
                        <motion.div 
                           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                           key={n.id} 
                           className="bg-white/5 border border-white/10 rounded-3xl p-5 hover:bg-white/10 transition-colors group cursor-default"
                        >
                            <div className="flex gap-4 items-start">
                                {n.image ? (
                                    <img src={n.image} alt="News" className="w-20 h-20 object-cover rounded-2xl border border-white/10" />
                                ) : (
                                    <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center text-gray-500 group-hover:text-yellow-500 transition-colors">
                                        <Megaphone size={24}/>
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-bold bg-yellow-500 text-black px-2 py-0.5 rounded-md mb-2 inline-block">{n.branch || 'عام'}</span>
                                        <span className="text-[10px] text-gray-500">{new Date(n.createdAt).toLocaleDateString('ar-EG')}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-white mb-1 truncate">{n.title}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{n.desc}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        )}

        {/* Students Section */}
        <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-white/10 pb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><User size={24}/></div>
                <h2 className="text-2xl font-black text-white">الأبطال المسجلين ({myStudents.length})</h2>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {myStudents.map((s, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
                        key={s.id} 
                        className="bg-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
                    >
                        {/* Header Banner */}
                        <div className="h-32 bg-gradient-to-r from-gray-900 to-black border-b border-white/5 p-8 flex justify-between items-start relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-black text-white mb-1">{s.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400 font-bold">
                                    <span className={`w-2 h-2 rounded-full ${s.balance > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                    {s.branch}
                                </div>
                            </div>
                            <div className="relative z-10 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">الحزام الحالي</p>
                                <p className="text-xl font-black text-yellow-500">{s.belt}</p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-xs text-gray-500 font-bold mb-2">حالة الاشتراك</p>
                                    <div className="flex items-center gap-2">
                                        <StatusBadge status={calculateStatus(s.subEnd)}/>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 font-mono">{s.subEnd}</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-xs text-gray-500 font-bold mb-2">الرصيد المستحق</p>
                                    <p className={`text-xl font-black ${s.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>{s.balance} JD</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{s.balance > 0 ? 'يرجى التسديد' : 'مدفوع بالكامل'}</p>
                                </div>
                                <div className="bg-white/5 rounded-2xl p-4 border border-white/5 col-span-2 md:col-span-1">
                                    <p className="text-xs text-gray-500 font-bold mb-2">عدد الحصص المتبقية</p>
                                    <p className="text-xl font-black text-white">{12} <span className="text-sm font-medium text-gray-500">/ 12</span></p>
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-yellow-500 h-full rounded-full" style={{width: '100%'}}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Attendance Calendar (Compact) */}
                            <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                    <h4 className="font-bold text-white flex items-center gap-2"><Calendar size={18} className="text-blue-500"/> سجل الحضور</h4>
                                    <div className="flex items-center gap-4 bg-black/30 px-3 py-1 rounded-full">
                                        <Button variant="ghost" onClick={()=>changeMonth(-1)} className="text-gray-400 hover:text-white p-1"><ChevronRight size={16}/></Button>
                                        <span className="text-sm font-bold font-mono dir-ltr">{monthNames[month]} {year}</span>
                                        <Button variant="ghost" onClick={()=>changeMonth(1)} className="text-gray-400 hover:text-white p-1"><ChevronLeft size={16}/></Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                                    {[...Array(daysInMonth)].map((_,i)=>{
                                        const d=i+1; 
                                        const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; 
                                        const isPresent = s.attendance && s.attendance[dateStr];
                                        return (
                                            <div key={d} className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs font-bold transition-all
                                                ${isPresent ? 'bg-green-500/20 text-green-500 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 'bg-white/5 text-gray-600 border border-transparent'}`}>
                                                {d}
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className="mt-4 flex gap-4 text-xs font-bold text-gray-500 justify-end">
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded"></div> حاضر</div>
                                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white/5 rounded"></div> غائب</div>
                                </div>
                            </div>
                        </div>

                        {/* Admin Notes */}
                        {s.notes && s.notes.length > 0 && (
                            <div className="bg-blue-900/10 border-t border-blue-500/20 p-6">
                                <h4 className="font-bold text-blue-400 text-sm mb-3 flex items-center gap-2"><AlertCircle size={16}/> ملاحظات الإدارة</h4>
                                <ul className="space-y-2">
                                    {s.notes.map((n, i) => (
                                        <li key={i} className="text-sm text-blue-200 flex items-start gap-2 bg-blue-500/5 p-3 rounded-xl border border-blue-500/10">
                                            <span className="mt-1 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                                            <div className="flex-1">
                                                <p>{n.text}</p>
                                                <span className="text-[10px] opacity-50 mt-1 block font-mono">{n.date}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Schedule Section */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Clock size={24}/></div>
                    <h2 className="text-2xl font-black text-white">جدول الحصص الأسبوعي</h2>
                </div>
                
                <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl"></div>
                    {schedule && schedule.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                            {schedule.map(cls => (
                                <div key={cls.id} className="bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-colors group">
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="text-xs font-bold text-gray-500 bg-black/30 px-2 py-1 rounded-md">{cls.branch}</span>
                                        <Clock size={18} className="text-gray-600 group-hover:text-yellow-500 transition-colors"/>
                                    </div>
                                    <h4 className="text-xl font-black text-white mb-2">{cls.level}</h4>
                                    <div className="flex flex-col gap-1 text-sm text-gray-400 font-medium">
                                        <p>{cls.days}</p>
                                        <p className="text-yellow-500">{cls.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">لا يوجد جدول معلن حالياً</div>
                    )}
                </div>
            </div>

            {/* Payments History (Sidebar style) */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg text-green-500"><CreditCard size={24}/></div>
                    <h2 className="text-2xl font-black text-white">آخر الدفعات</h2>
                </div>

                <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 h-[400px] overflow-y-auto relative">
                    {myPayments.length > 0 ? (
                        <div className="space-y-4">
                            {myPayments.map(p => (
                                <div key={p.id} className="flex gap-4 items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 font-bold shrink-0">
                                        <CheckCircle2 size={18}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white text-sm truncate">{p.reason}</h4>
                                        <p className="text-xs text-gray-500">{p.name} • <span className="font-mono">{p.date}</span></p>
                                    </div>
                                    <div className="text-green-500 font-black font-mono text-lg">{p.amount}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <CreditCard size={48} className="opacity-20 mb-4"/>
                            <p>لا يوجد سجل دفعات</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

      </div>

      {/* Settings Modal (Dark Theme) */}
      <AnimatePresence>
          {showSettings && (
            <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm relative bg-[#151515] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-yellow-500 p-6 text-center">
                        <h3 className="text-xl font-black text-black">تحديث بيانات الدخول</h3>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="absolute top-4 left-4 text-black/50 hover:text-black transition-colors"><X size={24}/></button>
                    
                    <form onSubmit={handleUpdateCredentials} className="p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2">اسم المستخدم الجديد</label>
                            <input 
                                className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl focus:border-yellow-500 outline-none transition-colors font-bold dir-ltr text-left"
                                value={creds.username}
                                onChange={(e) => setCreds({...creds, username: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2">كلمة المرور الجديدة</label>
                            <input 
                                className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl focus:border-yellow-500 outline-none transition-colors font-bold dir-ltr text-left"
                                value={creds.password}
                                onChange={(e) => setCreds({...creds, password: e.target.value})}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={isUpdating} className="w-full py-4 bg-yellow-500 text-black font-black hover:bg-yellow-400 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.2)]">
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
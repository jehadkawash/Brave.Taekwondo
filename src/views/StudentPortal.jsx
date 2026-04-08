// src/views/StudentPortal.jsx
import React, { useState, useMemo, useEffect } from 'react';
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

// --- استيراد مكتبات Capacitor للإشعارات ---
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

// ✅ استيراد دالة التشفير من ملف App.jsx
// دالة التشفير الخاصة ببوابة الطالب
const hashPassword = async (password) => {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

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
  
  // --- منطق إعداد الإشعارات ---
  const setupNotifications = async () => {
    if (Capacitor.getPlatform() === 'web') return;

    try {
      await PushNotifications.createChannel({
        id: 'attendance_notifications',
        name: 'تنبيهات الحضور',
        description: 'إشعارات وصول الأبطال للأكاديمية',
        importance: 5, 
        visibility: 1,
        sound: 'default',
        vibration: true,
      });
    } catch (e) {
      console.error("Error creating channel:", e);
    }

    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') return;

    await PushNotifications.register();

    PushNotifications.addListener('registration', async (token) => {
      const studentRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUserData.id);
      try {
        await updateDoc(studentRef, { 
          fcmToken: token.value,
          lastTokenSync: new Date().toISOString()
        });
      } catch (e) {}
    });
  };

  useEffect(() => {
    setupNotifications();
    return () => {
      if (Capacitor.getPlatform() !== 'web') {
        PushNotifications.removeAllListeners();
      }
    };
  }, [currentUserData.id]);

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
        const entries = Object.entries(lastNames).sort((a,b) => b - a);
        if (entries.length > 0) name = `عائلة ${entries}`;
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

  // --- دالة تحديث بيانات الدخول (تم إضافة التشفير هنا) ---
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!creds.username || !creds.password) return alert("الرجاء تعبئة جميع الحقول");
    
    // التحقق من قوة الباسورد
    if (creds.password.length < 6) return alert("يجب أن تكون كلمة المرور 6 أحرف أو أكثر");

    setIsUpdating(true);
    try {
      // ✅ 1. تشفير الباسورد الجديد
      const hashedNewPassword = await hashPassword(creds.password);

      // ✅ 2. حفظ الباسورد المشفر في قاعدة البيانات، وإزالة الباسورد المكشوف القديم إن وجد
      const studentRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUserData.id);
      
      await updateDoc(studentRef, { 
          username: creds.username.trim(), 
          password: hashedNewPassword, // نخزن المشفر
          isPasswordHashed: true // علامة للإدارة إن الباسورد صار مشفر ومحمي
      });
      
      // ✅ 3. تحديث الجلسة المحلية (عشان يضل عامل تسجيل دخول)
      const updatedUserLocal = { ...user, username: creds.username.trim(), password: hashedNewPassword };
      localStorage.setItem('braveUser', JSON.stringify(updatedUserLocal));
      
      alert("تم تحديث وحماية بيانات الدخول بنجاح!");
      setShowSettings(false);
    } catch (error) { 
        console.error(error); 
        alert("حدث خطأ أثناء التحديث"); 
    } finally { 
        setIsUpdating(false); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-right text-slate-200" dir="rtl">
      
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
                    // إذا الباسورد مشفر ما بنظهره بالمربع، بنخليه فاضي يكتب واحد جديد
                    const isHashed = currentUserData.isPasswordHashed || (currentUserData.password && currentUserData.password.length > 30);
                    setCreds({ 
                        username: currentUserData.username, 
                        password: isHashed ? '' : currentUserData.password 
                    });
                    setShowSettings(true);
                }} 
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl px-3 py-2 text-xs md:text-sm font-bold flex items-center gap-2"
            >
                <Settings size={18}/> <span className="hidden md:inline">الإعدادات</span>
            </Button>
            <Button onClick={handleLogout} className="bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-500/20 rounded-xl px-3 py-2 text-xs md:text-sm font-bold flex items-center gap-2">
                <LogOut size={18}/> <span className="hidden md:inline">خروج</span>
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto p-4 md:p-8 max-w-7xl space-y-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
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
                               className="bg-slate-900 border border-slate-800 rounded-3xl p-5 hover:border-yellow-500/20 group relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-lg"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
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

            <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <Wallet size={20} className="text-emerald-500"/>
                    <h2 className="text-xl font-black text-slate-100">المحفظة المالية</h2>
                </div>
                
                <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-[2rem] p-6 relative overflow-hidden h-full min-h-[220px] shadow-xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent"></div>
                    {myPayments.length > 0 ? (
                        <div className="relative z-10 h-full flex flex-col">
                            <p className="text-slate-500 text-xs font-bold mb-4">آخر حركات مالية</p>
                            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                                {myPayments.slice(0, 3).map(p => (
                                    <div key={p.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-2xl border border-slate-700">
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
                        <div className="h-28 bg-slate-950 border-b border-slate-800 p-6 flex justify-between items-center relative">
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

                        <div className="p-6 md:p-8">
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
                                </div>
                            </div>

                            <div className="bg-slate-950/50 rounded-3xl p-5 border border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-slate-300 text-sm flex items-center gap-2"><Calendar size={16} className="text-blue-500"/> الحضور</h4>
                                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-full border border-slate-800">
                                        <Button variant="ghost" onClick={()=>changeMonth(-1)} className="text-slate-500 p-0.5"><ChevronRight size={14}/></Button>
                                        <span className="text-xs font-bold font-mono text-slate-300">{monthNames[month]} {year}</span>
                                        <Button variant="ghost" onClick={()=>changeMonth(1)} className="text-slate-500 p-0.5"><ChevronLeft size={14}/></Button>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {[...Array(daysInMonth)].map((_,i)=>{
                                        const d=i+1; 
                                        const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; 
                                        const isPresent = s.attendance && s.attendance[dateStr];
                                        return (
                                            <div key={d} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold
                                                ${isPresent ? 'bg-emerald-500 text-slate-900 shadow-lg' : 'bg-slate-900 text-slate-600 border border-slate-800'}`}>
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

        <div className="space-y-6 pb-10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><Clock size={24}/></div>
                <h2 className="text-2xl font-black text-slate-100">جدول الحصص</h2>
            </div>
            
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 shadow-xl">
                {schedule && schedule.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {schedule.map(cls => (
                            <div key={cls.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 group">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">{cls.branch}</span>
                                    <Clock size={16} className="text-slate-600 group-hover:text-yellow-500"/>
                                </div>
                                <h4 className="text-lg font-black text-slate-200 mb-2">{cls.level}</h4>
                                <div className="flex flex-col gap-1 text-xs text-slate-500">
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

      {/* Settings Modal */}
      <AnimatePresence>
          {showSettings && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm relative bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-slate-950 p-6 text-center border-b border-slate-800">
                        <h3 className="text-xl font-black text-slate-100">بيانات الدخول</h3>
                    </div>
                    <button onClick={() => setShowSettings(false)} className="absolute top-4 left-4 text-slate-500 hover:text-red-500"><X size={24}/></button>
                    
                    <form onSubmit={handleUpdateCredentials} className="p-8 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 text-right">اسم المستخدم</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-4 rounded-xl focus:border-yellow-500 outline-none text-right font-bold dir-ltr"
                                value={creds.username}
                                onChange={(e) => setCreds({...creds, username: e.target.value.toLowerCase()})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 mb-2 text-right">كلمة المرور الجديدة</label>
                            <input 
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-4 rounded-xl focus:border-yellow-500 outline-none text-left font-mono dir-ltr placeholder-slate-600"
                                value={creds.password}
                                placeholder={currentUserData.isPasswordHashed ? "كلمة المرور الحالية مشفرة ومحمية" : "أدخل كلمة المرور الجديدة"}
                                onChange={(e) => setCreds({...creds, password: e.target.value})}
                                required
                            />
                            {currentUserData.isPasswordHashed && (
                                <p className="text-[10px] text-emerald-500 mt-2 font-bold text-right">
                                    ✓ حسابك محمي والتشفير مفعل.
                                </p>
                            )}
                        </div>
                        <Button type="submit" disabled={isUpdating} className="w-full py-4 bg-yellow-500 text-slate-900 font-black hover:bg-yellow-400 rounded-xl shadow-lg shadow-yellow-500/20">
                            {isUpdating ? 'جاري الحفظ...' : 'تحديث وحماية البيانات'}
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
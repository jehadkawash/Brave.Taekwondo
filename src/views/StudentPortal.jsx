// src/views/StudentPortal.jsx
import React, { useState } from 'react';
import { LogOut, User, Calendar, DollarSign, Settings, Save, X } from 'lucide-react';
import { Button, Card, StatusBadge } from '../components/UIComponents';
import { updateDoc, doc } from "firebase/firestore";
import { db, appId } from '../lib/firebase';

// دالة مساعدة لحساب الحالة
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

const StudentPortal = ({ user, students, schedule, payments, handleLogout }) => {
  // نبحث عن بيانات الطالب المحدثة من القائمة القادمة من الداتابيز لضمان أننا نملك أحدث نسخة
  // user هو الكائن الذي تم تخزينه عند تسجيل الدخول، لكن students تحتوي البيانات الحية
  const studentData = students.find(s => s.id === user.id) || user;
  
  const mySchedule = schedule.filter(s => s.branch === studentData.branch);
  const myPayments = payments.filter(p => p.studentId === studentData.id);

  // --- حالات خاصة بتغيير كلمة المرور ---
  const [showSettings, setShowSettings] = useState(false);
  const [creds, setCreds] = useState({ 
    username: studentData.username || '', 
    password: studentData.password || '' 
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // دالة الحفظ
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!creds.username || !creds.password) return alert("الرجاء تعبئة جميع الحقول");

    setIsUpdating(true);
    try {
      // 1. تحديث قاعدة البيانات
      const studentRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', studentData.id);
      await updateDoc(studentRef, {
        username: creds.username,
        password: creds.password
      });

      // 2. تحديث التخزين المحلي عشان ما يطلع من الحساب
      const updatedUserLocal = { ...user, username: creds.username, password: creds.password };
      localStorage.setItem('braveUser', JSON.stringify(updatedUserLocal));

      alert("تم تحديث بيانات الدخول بنجاح!");
      setShowSettings(false);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-right pb-20" dir="rtl">
      {/* Header */}
      <header className="bg-black text-white p-6 sticky top-0 z-30 shadow-lg border-b-4 border-yellow-500">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-xl font-bold text-yellow-500">مرحباً يا بطل!</h1>
                <p className="text-sm text-gray-400">{studentData.name}</p>
            </div>
            <div className="flex gap-2">
                {/* زر الإعدادات الجديد */}
                <button 
                  onClick={() => {
                    setCreds({ username: studentData.username, password: studentData.password });
                    setShowSettings(true);
                  }} 
                  className="bg-gray-800 p-2 rounded-full text-white hover:text-yellow-500 transition"
                >
                    <Settings size={20}/>
                </button>
                <button onClick={handleLogout} className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition">
                    <LogOut size={20}/>
                </button>
            </div>
        </div>
      </header>

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Status Card */}
        <Card className="border-t-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2"><User size={20}/> ملف اللاعب</h2>
                <StatusBadge status={calculateStatus(studentData.subEnd)}/>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-gray-50 rounded"><span>الحزام:</span><span className="font-bold">{studentData.belt}</span></div>
                <div className="flex justify-between p-2 bg-gray-50 rounded"><span>نهاية الاشتراك:</span><span className="font-bold dir-ltr">{studentData.subEnd}</span></div>
                <div className="flex justify-between p-2 bg-gray-50 rounded"><span>الفرع:</span><span className="font-bold">{studentData.branch}</span></div>
                {/* عرض بيانات الدخول الحالية للطالب */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">بيانات دخولك الحالية</p>
                    <p className="font-mono text-sm font-bold text-blue-800">{studentData.username} / {studentData.password}</p>
                </div>
            </div>
        </Card>

        {/* Schedule */}
        <Card title="مواعيد التدريب">
            {mySchedule.length > 0 ? (
                <div className="space-y-3">
                    {mySchedule.map(s => (
                        <div key={s.id} className="bg-gray-800 text-white p-3 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="font-bold text-yellow-500">{s.days}</p>
                                <p className="text-xs text-gray-300">{s.level}</p>
                            </div>
                            <div className="flex items-center gap-1 text-sm font-bold"><Calendar size={16}/> {s.time}</div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-gray-500 text-center">لا يوجد جدول متاح حالياً</p>}
        </Card>

        {/* Payments History */}
        <Card title="سجل الدفعات">
             {myPayments.length > 0 ? (
                <div className="space-y-2">
                    {myPayments.map(p => (
                        <div key={p.id} className="flex justify-between items-center p-3 border-b last:border-0">
                            <div>
                                <p className="font-bold text-gray-800">{p.reason}</p>
                                <p className="text-xs text-gray-500">{p.date}</p>
                            </div>
                            <span className="font-bold text-green-600 flex items-center gap-1">{p.amount} <DollarSign size={12}/></span>
                        </div>
                    ))}
                </div>
             ) : <p className="text-gray-500 text-center">لا يوجد دفعات مسجلة</p>}
        </Card>
      </div>

      {/* نافذة الإعدادات (Modal) */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <Card className="w-full max-w-sm relative">
                <button onClick={() => setShowSettings(false)} className="absolute top-4 left-4 text-gray-400 hover:text-black"><X size={24}/></button>
                <h3 className="text-xl font-bold mb-6 text-center">تحديث بيانات الدخول</h3>
                
                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">اسم المستخدم الجديد</label>
                        <input 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors"
                            value={creds.username}
                            onChange={(e) => setCreds({...creds, username: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">كلمة المرور الجديدة</label>
                        <input 
                            className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors"
                            value={creds.password} // لاحظ: هنا تظهر كلمة المرور كنص عادي كما طلبت
                            onChange={(e) => setCreds({...creds, password: e.target.value})}
                            required
                        />
                    </div>
                    
                    <div className="pt-4">
                        <Button type="submit" disabled={isUpdating} className="w-full py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400">
                            {isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
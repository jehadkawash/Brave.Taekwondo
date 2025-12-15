// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth"; 
import { getDoc, doc } from "firebase/firestore"; // نحتاج هذه لجلب اسم الأدمن المخصص
import { auth, db } from './lib/firebase';
import { useCollection } from './hooks/useCollection';

// Import Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import StudentPortal from './views/StudentPortal';
import AdminDashboard from './views/AdminDashboard';
import { BRANCHES } from './lib/constants';

const appId = 'brave-academy-live-data'; // تأكد أن هذا المتغير موجود أو مستورد

export default function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(() => { const saved = localStorage.getItem('braveUser'); return saved ? JSON.parse(saved) : null; });
  const [dashboardBranch, setDashboardBranch] = useState(BRANCHES.SHAFA); // للتحكم بالفرع المعروض للأدمن
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Collections Hooks
  const studentsCollection = useCollection('students'); 
  const paymentsCollection = useCollection('payments');
  const expensesCollection = useCollection('expenses');
  const scheduleCollection = useCollection('schedule');
  const archiveCollection = useCollection('archive');
  const registrationsCollection = useCollection('registrations'); 
  const captainsCollection = useCollection('captains'); 

  // --- 1. المنطق الهجين لتسجيل الدخول (الطلاب + الكباتن + الأدمن) ---
  const handleLogin = async (username, password) => {
    // A. البحث في سجلات الطلاب أولاً
    const studentUser = studentsCollection.data.find(s => s.username === username && s.password === password);
    if (studentUser) {
      const userData = { role: 'student', familyId: studentUser.familyId, name: studentUser.familyName, id: studentUser.id };
      setUser(userData); 
      localStorage.setItem('braveUser', JSON.stringify(userData)); 
      setView('student_portal');
      return;
    }

    // B. البحث في سجلات الكباتن ثانياً
    const cap = captainsCollection.data.find(c => c.username === username && c.password === password);
    if(cap) {
       const u = { role: 'captain', ...cap };
       setUser(u); 
       localStorage.setItem('braveUser', JSON.stringify(u)); 
       setDashboardBranch(cap.branch); 
       setView('admin_dashboard');
       return;
    }

    // C. محاولة دخول الأدمن (Firebase Auth)
    if (username.includes('@') || username === 'admin1') {
      try {
        // تحديد الإيميل الصحيح
        let email = username;
        if (username === 'admin1') email = 'admin@brave.com';
        
        await signInWithEmailAndPassword(auth, email, password);
        // ملاحظة: لن نقوم بـ setUser هنا يدوياً، لأن useEffect بالأسفل سيلتقط التغيير تلقائياً
        return;

      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    }
    
    alert('بيانات الدخول خاطئة! تأكد من اسم المستخدم وكلمة المرور.');
  };

  // --- 2. مراقبة حالة فايربيس (للأدمن فقط) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email;
        let userData = { email };

        // تحديد الصلاحيات والفرع
        if (email === 'admin@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: true, name: 'المدير العام', branch: BRANCHES.SHAFA };
        } else if (email === 'shafa@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: false, name: 'مدير شفا بدران', branch: BRANCHES.SHAFA };
        } else if (email === 'abunseir@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: false, name: 'مدير أبو نصير', branch: BRANCHES.ABU_NSEIR };
        }

        // محاولة جلب الاسم المخصص من قاعدة البيانات (اختياري)
        try {
            const profileRef = doc(db, 'artifacts', appId, 'public', 'data', 'admin_profiles', email);
            const profileSnap = await getDoc(profileRef);
            if (profileSnap.exists() && profileSnap.data().name) {
                userData.name = profileSnap.data().name;
            }
        } catch (err) { console.log("Profile fetch warning"); }

        setUser(userData);
        setDashboardBranch(userData.branch);
        localStorage.setItem('braveUser', JSON.stringify(userData));
        setView('admin_dashboard');
        
      } else {
        // إذا قام فايربيس بتسجيل الخروج، نتأكد هل المستخدم كان طالباً؟
        // إذا لم يكن هناك مستخدم محفوظ في LocalStorage، نقوم بتصفير الحالة
        const saved = localStorage.getItem('braveUser');
        if (!saved) {
            setUser(null);
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth); // خروج من فايربيس
    localStorage.removeItem('braveUser'); // مسح التخزين المحلي
    setUser(null);
    setView('home');
  };

  if (loadingAuth && !user) return <div className="flex h-screen items-center justify-center font-bold text-xl">جاري تحميل النظام...</div>;

  return (
    <>
      {view === 'home' && <HomeView setView={setView} schedule={scheduleCollection.data} registrationsCollection={registrationsCollection} />}
      
      {/* هنا التعديل المهم: تمرير handleLogin */}
      {view === 'login' && <LoginView setView={setView} handleLogin={handleLogin} />}
      
      {view === 'student_portal' && user && <StudentPortal user={user} students={studentsCollection.data} schedule={scheduleCollection.data} payments={paymentsCollection.data} handleLogout={handleLogout} />}
      
      {view === 'admin_dashboard' && user && (
        <AdminDashboard 
          user={user} 
          selectedBranch={dashboardBranch} 
          onSwitchBranch={user.isSuper ? setDashboardBranch : null} // السماح للمدير العام فقط بالتبديل
          studentsCollection={studentsCollection} 
          paymentsCollection={paymentsCollection} 
          expensesCollection={expensesCollection} 
          scheduleCollection={scheduleCollection} 
          archiveCollection={archiveCollection} 
          registrationsCollection={registrationsCollection} 
          captainsCollection={captainsCollection}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
}
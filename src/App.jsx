// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth"; 
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore"; 
import { auth, db } from './lib/firebase';
import { useCollection } from './hooks/useCollection';

// Import Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import StudentPortal from './views/StudentPortal';
import AdminDashboard from './views/AdminDashboard';
import { BRANCHES } from './lib/constants';

const appId = 'brave-academy-live-data'; 

export default function App() {
  // 1. الحالة الأولية (تعتمد على الذاكرة)
  const [user, setUser] = useState(() => { 
      const saved = localStorage.getItem('braveUser'); 
      return saved ? JSON.parse(saved) : null; 
  });

  const [view, setView] = useState(() => {
      if (typeof window !== 'undefined' && localStorage.getItem('braveUser')) {
          const u = JSON.parse(localStorage.getItem('braveUser'));
          return u.role === 'student' ? 'student_portal' : 'admin_dashboard';
      }
      return 'home';
  });

  const [dashboardBranch, setDashboardBranch] = useState(() => {
      if (user && user.branch) return user.branch;
      return BRANCHES.SHAFA;
  });
  
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Collections Hooks
  const studentsCollection = useCollection('students'); 
  const paymentsCollection = useCollection('payments');
  const expensesCollection = useCollection('expenses');
  const scheduleCollection = useCollection('schedule');
  const archiveCollection = useCollection('archive');
  const registrationsCollection = useCollection('registrations'); 
  const captainsCollection = useCollection('captains'); 

  // --- 🔥 الجديد: دالة التنقل الذكي (تدعم زر الرجوع) ---
  const navigateTo = (newView) => {
     setView(newView);
     // إضافة "حالة" جديدة لتاريخ المتصفح
     window.history.pushState({ view: newView }, '', '');
  };

  // --- 🔥 الجديد: الاستماع لزر الرجوع في المتصفح/الهاتف ---
  useEffect(() => {
    // عند تحميل الموقع، نثبت الحالة الحالية
    window.history.replaceState({ view: view }, '', '');

    const handleBackButton = (event) => {
       if (event.state && event.state.view) {
         // إذا ضغط المستخدم رجوع، نذهب للصفحة المحفوظة في التاريخ
         setView(event.state.view);
       } else {
         // إذا لم يكن هناك تاريخ (وصل للبداية)، نذهب للرئيسية
         setView('home');
       }
    };

    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, []); // يعمل مرة واحدة عند التشغيل


  // --- تسجيل الدخول ---
  const handleLogin = async (username, password) => {
    try {
      // A. البحث في سجلات الطلاب
      const studentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');
      const qStudent = query(studentsRef, where("username", "==", username), where("password", "==", password));
      const studentSnap = await getDocs(qStudent);

      if (!studentSnap.empty) {
        const studentDoc = studentSnap.docs[0];
        const studentData = studentDoc.data();
        const userData = { 
            role: 'student', 
            familyId: studentData.familyId, 
            name: studentData.familyName || studentData.name,
            id: studentDoc.id 
        };
        
        setUser(userData); 
        localStorage.setItem('braveUser', JSON.stringify(userData)); 
        navigateTo('student_portal'); // استخدمنا navigateTo بدلاً من setView
        return;
      }

      // B. البحث في سجلات الكباتن
      const captainsRef = collection(db, 'artifacts', appId, 'public', 'data', 'captains');
      const qCaptain = query(captainsRef, where("username", "==", username), where("password", "==", password));
      const captainSnap = await getDocs(qCaptain);

      if(!captainSnap.empty) {
         const captainDoc = captainSnap.docs[0];
         const capData = captainDoc.data();
         const u = { role: 'captain', ...capData, id: captainDoc.id };
         
         setUser(u); 
         localStorage.setItem('braveUser', JSON.stringify(u)); 
         setDashboardBranch(capData.branch); 
         navigateTo('admin_dashboard'); // استخدمنا navigateTo
         return;
      }

      // C. محاولة دخول الأدمن
      if (username.includes('@') || username === 'admin1') {
          let email = username;
          if (username === 'admin1') email = 'admin@brave.com';
          await signInWithEmailAndPassword(auth, email, password);
          return;
      }
      
      alert('بيانات الدخول خاطئة! تأكد من اسم المستخدم وكلمة المرور.');

    } catch (error) {
      console.error("Login Error:", error);
      alert("حدث خطأ أثناء تسجيل الدخول.");
    }
  };

  // --- مراقبة حالة فايربيس ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email;
        let userData = { email };

        if (email === 'admin@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: true, name: 'المدير العام', branch: BRANCHES.SHAFA };
        } else if (email === 'shafa@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: false, name: 'مدير شفا بدران', branch: BRANCHES.SHAFA };
        } else if (email === 'abunseir@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: false, name: 'مدير أبو نصير', branch: BRANCHES.ABU_NSEIR };
        }

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
        // هنا لا نستخدم navigateTo لتجنب تكرار التاريخ عند التحديث التلقائي
        setView('admin_dashboard'); 
        
      } else {
        if (!localStorage.getItem('braveUser')) {
            setUser(null);
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth); 
    localStorage.removeItem('braveUser'); 
    setUser(null);
    navigateTo('home'); // استخدمنا navigateTo للعودة للرئيسية
  };

  if (loadingAuth && user) return <div className="flex h-screen items-center justify-center font-bold text-xl text-yellow-600 bg-gray-50">جاري التأكد من البيانات...</div>;

  return (
    <>
      {/* مررنا navigateTo كـ prop بدلاً من setView ليعمل التاريخ في كل الصفحات */}
      {view === 'home' && <HomeView setView={navigateTo} schedule={scheduleCollection.data} registrationsCollection={registrationsCollection} />}
      
      {view === 'login' && <LoginView setView={navigateTo} handleLogin={handleLogin} />}
      
      {view === 'student_portal' && user && <StudentPortal user={user} students={studentsCollection.data} schedule={scheduleCollection.data} payments={paymentsCollection.data} handleLogout={handleLogout} />}
      
      {view === 'admin_dashboard' && user && (
        <AdminDashboard 
          user={user} 
          selectedBranch={dashboardBranch} 
          onSwitchBranch={user.isSuper ? setDashboardBranch : null} 
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
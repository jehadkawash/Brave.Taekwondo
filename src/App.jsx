// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth"; 
// قمنا بإضافة collection, query, where, getDocs هنا من أجل البحث الآمن
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
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(() => { const saved = localStorage.getItem('braveUser'); return saved ? JSON.parse(saved) : null; });
  const [dashboardBranch, setDashboardBranch] = useState(BRANCHES.SHAFA); 
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Collections Hooks
  // ملاحظة: لا نزال نحتاج هذه البيانات للصفحات الداخلية، لكن لن نعتمد عليها في تسجيل الدخول
  const studentsCollection = useCollection('students'); 
  const paymentsCollection = useCollection('payments');
  const expensesCollection = useCollection('expenses');
  const scheduleCollection = useCollection('schedule');
  const archiveCollection = useCollection('archive');
  const registrationsCollection = useCollection('registrations'); 
  const captainsCollection = useCollection('captains'); 

  // --- 1. المنطق الهجين لتسجيل الدخول (الطلاب + الكباتن + الأدمن) ---
  const handleLogin = async (username, password) => {
    try {
      // A. البحث الآمن في سجلات الطلاب (Server-side Query)
      // بدلاً من البحث في المصفوفة المحملة، نسأل قاعدة البيانات مباشرة
      const studentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');
      const qStudent = query(studentsRef, where("username", "==", username), where("password", "==", password));
      const studentSnap = await getDocs(qStudent);

      if (!studentSnap.empty) {
        // وجدنا الطالب
        const studentDoc = studentSnap.docs[0];
        const studentData = studentDoc.data();
        const userData = { 
            role: 'student', 
            familyId: studentData.familyId, 
            name: studentData.familyName || studentData.name, // تحسين بسيط للاسم
            id: studentDoc.id 
        };
        
        setUser(userData); 
        localStorage.setItem('braveUser', JSON.stringify(userData)); 
        setView('student_portal');
        return;
      }

      // B. البحث الآمن في سجلات الكباتن
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
         setView('admin_dashboard');
         return;
      }

      // C. محاولة دخول الأدمن (Firebase Auth)
      if (username.includes('@') || username === 'admin1') {
          // تحديد الإيميل الصحيح
          let email = username;
          if (username === 'admin1') email = 'admin@brave.com';
          
          await signInWithEmailAndPassword(auth, email, password);
          // ملاحظة: useEffect سيلتقط التغيير
          return;
      }
      
      // إذا وصلنا هنا، يعني لم نجد أي مستخدم مطابق
      alert('بيانات الدخول خاطئة! تأكد من اسم المستخدم وكلمة المرور.');

    } catch (error) {
      console.error("Login Error:", error);
      alert("حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة مرة أخرى.");
    }
  };

  // --- 2. مراقبة حالة فايربيس (للأدمن فقط) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const email = firebaseUser.email;
        let userData = { email };

        // تحديد الصلاحيات والفرع
        // (يمكننا لاحقاً نقل هذه الصلاحيات لقاعدة البيانات لجعلها ديناميكية أكثر)
        if (email === 'admin@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: true, name: 'المدير العام', branch: BRANCHES.SHAFA };
        } else if (email === 'shafa@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: false, name: 'مدير شفا بدران', branch: BRANCHES.SHAFA };
        } else if (email === 'abunseir@brave.com') {
          userData = { ...userData, role: 'admin', isSuper: false, name: 'مدير أبو نصير', branch: BRANCHES.ABU_NSEIR };
        }

        // محاولة جلب الاسم المخصص
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
    await signOut(auth); 
    localStorage.removeItem('braveUser'); 
    setUser(null);
    setView('home');
  };

  if (loadingAuth && !user) return <div className="flex h-screen items-center justify-center font-bold text-xl">جاري تحميل النظام...</div>;

  return (
    <>
      {view === 'home' && <HomeView setView={setView} schedule={scheduleCollection.data} registrationsCollection={registrationsCollection} />}
      
      {view === 'login' && <LoginView setView={setView} handleLogin={handleLogin} />}
      
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
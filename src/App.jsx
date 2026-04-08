// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth"; 
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore"; 
import { auth, db, appId } from './lib/firebase';
import { useCollection } from './hooks/useCollection';

// Import Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import StudentPortal from './views/StudentPortal';
import AdminDashboard from './views/AdminDashboard';
import { BRANCHES } from './lib/constants';

export default function App() {
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

  const [dashboardBranch, setDashboardBranch] = useState(BRANCHES.SHAFA);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  const studentsCollection = useCollection('students'); 
  const scheduleCollection = useCollection('schedule');
  const newsCollection = useCollection('news'); 
  
  const navigateTo = (newView) => {
     setView(newView);
     window.history.pushState({ view: newView }, '', '');
  };

  useEffect(() => {
    window.history.replaceState({ view: view }, '', '');
    const handleBackButton = (event) => {
       if (event.state && event.state.view) setView(event.state.view);
       else setView('home');
    };
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [view]); 

  const handleLogin = async (username, password) => {
    try {
      // 1. نظام الطلاب (Legacy - سيتم تحديثه لاحقاً)
      const studentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');
      const qStudent = query(studentsRef, where("username", "==", username), where("password", "==", password));
      const studentSnap = await getDocs(qStudent);

      if (!studentSnap.empty) {
        const studentDoc = studentSnap.docs;
        const studentData = studentDoc.data();
        const userData = { 
            role: 'student', 
            familyId: studentData.familyId, 
            name: studentData.familyName || studentData.name,
            id: studentDoc.id 
        };
        setUser(userData); 
        localStorage.setItem('braveUser', JSON.stringify(userData)); 
        navigateTo('student_portal');
        return;
      }

      // 2. نظام الإدارة والكباتن (Firebase Auth الاحترافي)
      let email = username;
      if (username === 'admin1') email = 'admin@brave.com'; // اختصار للمدير
      
      if (email.includes('@')) {
          await signInWithEmailAndPassword(auth, email, password);
          return;
      }
      
      alert('بيانات الدخول خاطئة!');
    } catch (error) {
      console.error("Login Error:", error);
      alert("خطأ في الدخول: " + error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
            // جلب بيانات المستخدم من جدول users في الفايربيس بناءً على إيميله
            const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', firebaseUser.email);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = { ...userSnap.data(), email: firebaseUser.email, id: firebaseUser.uid };
                
                setUser(userData);
                setDashboardBranch(userData.branch || BRANCHES.SHAFA);
                localStorage.setItem('braveUser', JSON.stringify(userData));
                setView('admin_dashboard');
            } else {
                // إذا لم يجد ملف تعريف، نعتبره مستخدم جديد بدون صلاحيات
                alert("حسابك غير مسجل في نظام الصلاحيات. تواصل مع السوبر أدمن.");
                await signOut(auth);
            }
        } catch (err) {
            console.error("Error fetching user profile:", err);
        }
      } else {
        if (!localStorage.getItem('braveUser')) setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth); 
    localStorage.removeItem('braveUser'); 
    setUser(null);
    navigateTo('home'); 
  };

  if (loadingAuth && user) return <div className="flex h-screen items-center justify-center font-bold text-xl text-yellow-600 bg-gray-50">جاري التأكد من الصلاحيات...</div>;

  return (
    <>
      {view === 'home' && <HomeView setView={navigateTo} schedule={scheduleCollection.data} />}
      {view === 'login' && <LoginView setView={navigateTo} handleLogin={handleLogin} />}
      {view === 'student_portal' && user && <StudentPortal user={user} students={studentsCollection.data} schedule={scheduleCollection.data} news={newsCollection.data} handleLogout={handleLogout} />}
      {view === 'admin_dashboard' && user && (
        <AdminDashboard 
          user={user} 
          selectedBranch={dashboardBranch} 
          onSwitchBranch={user.isSuper ? setDashboardBranch : null} 
          studentsCollection={studentsCollection} 
          scheduleCollection={scheduleCollection} 
          handleLogout={handleLogout}
        />
      )}
    </>
  );
}
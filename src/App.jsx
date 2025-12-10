// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth"; 
import { auth } from './lib/firebase';
import { useCollection } from './hooks/useCollection';

// Import Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import StudentPortal from './views/StudentPortal';
import AdminDashboard from './views/AdminDashboard';
import { BRANCHES } from './lib/constants';

export default function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // Collections Hooks
  const studentsCollection = useCollection('students'); 
  const paymentsCollection = useCollection('payments');
  const expensesCollection = useCollection('expenses');
  const scheduleCollection = useCollection('schedule');
  const archiveCollection = useCollection('archive');
  const registrationsCollection = useCollection('registrations'); 
  const captainsCollection = useCollection('captains'); 

  // هذا الكود يستمع لأي تغيير في حالة تسجيل الدخول تلقائياً
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // تحديد الصلاحيات بناءً على الإيميل
        let userData = null;
        const email = firebaseUser.email;

        if (email === 'admin@brave.com') {
          userData = { role: 'admin', name: 'Admin', branch: BRANCHES.SHAFA, email }; // Super Admin
        } else if (email === 'shafa@brave.com') {
          userData = { role: 'admin', name: 'Shafa Admin', branch: BRANCHES.SHAFA, email };
        } else if (email === 'abunseir@brave.com') {
          userData = { role: 'admin', name: 'Abu Nseir Admin', branch: BRANCHES.ABU_NSEIR, email };
        } else {
          // يمكن هنا إضافة منطق دخول الطلاب لاحقاً
          userData = { role: 'student', email }; 
        }

        setUser(userData);
        if (userData && userData.role === 'admin') setView('admin_dashboard');
        else if (userData) setView('student_portal');
        
      } else {
        setUser(null);
        // لا نغير الـ view هنا قسراً لنسمح للمستخدم بالتصفح كزائر
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setView('home');
  };

  if (loadingAuth) return <div className="flex h-screen items-center justify-center">جاري التحميل...</div>;

  return (
    <>
      {view === 'home' && <HomeView setView={setView} schedule={scheduleCollection.data} registrationsCollection={registrationsCollection} />}
      {view === 'login' && <LoginView setView={setView} />}
      {view === 'student_portal' && user && <StudentPortal user={user} students={studentsCollection.data} schedule={scheduleCollection.data} payments={paymentsCollection.data} handleLogout={handleLogout} />}
      {view === 'admin_dashboard' && user && (
        <AdminDashboard 
          user={user} 
          selectedBranch={user.branch} 
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
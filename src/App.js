// src/App.js
import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app"; 
import { signInAnonymously } from "firebase/auth"; 
import { auth } from './lib/firebase';
import { useCollection } from './hooks/useCollection';

// Import Views
import HomeView from './views/HomeView'; // (عليك إنشاء هذا الملف وفصله)
import LoginView from './views/LoginView'; // (عليك إنشاء هذا الملف وفصله)
import StudentPortal from './views/StudentPortal'; // (عليك إنشاء هذا الملف وفصله)
import AdminDashboard from './views/AdminDashboard';

export default function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(() => { 
      const saved = localStorage.getItem('braveUser'); 
      return saved ? JSON.parse(saved) : null; 
  });
  
  // Collections Hooks - Centralized Data Fetching
  const studentsCollection = useCollection('students'); 
  const paymentsCollection = useCollection('payments');
  const expensesCollection = useCollection('expenses');
  const scheduleCollection = useCollection('schedule');
  const archiveCollection = useCollection('archive');
  const registrationsCollection = useCollection('registrations'); 
  const captainsCollection = useCollection('captains'); 

  useEffect(() => { 
      signInAnonymously(auth); 
      if (user) { 
          if (user.role === 'admin' || user.role === 'captain') setView('admin_dashboard'); 
          else setView('student_portal'); 
      } 
  }, [user]);

  const handleLogin = (username, password) => {
     // Admin Check
     if (username === 'admin1' && password === '123') {
        const u = { role: 'admin', name: 'Admin', branch: 'شفا بدران', username };
        setUser(u); localStorage.setItem('braveUser', JSON.stringify(u)); setView('admin_dashboard');
        return;
     }
     // Captain Check
     const cap = captainsCollection.data.find(c => c.username === username && c.password === password);
     if(cap) {
        const u = { role: 'captain', ...cap };
        setUser(u); localStorage.setItem('braveUser', JSON.stringify(u)); setView('admin_dashboard');
        return;
     }
     // Student Check
     const studentUser = studentsCollection.data.find(s => s.username === username && s.password === password);
     if (studentUser) {
        const userData = { role: 'student', familyId: studentUser.familyId, name: studentUser.familyName, id: studentUser.id };
        setUser(userData); localStorage.setItem('braveUser', JSON.stringify(userData)); setView('student_portal');
        return;
     }
     alert('بيانات خاطئة!');
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem('braveUser'); setView('home'); };

  return (
    <>
      {view === 'home' && <HomeView setView={setView} schedule={scheduleCollection.data} registrationsCollection={registrationsCollection} />}
      {view === 'login' && <LoginView setView={setView} handleLogin={handleLogin} loginError="" />}
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
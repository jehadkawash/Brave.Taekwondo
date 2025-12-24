// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// --- مكون الحماية (Protected Route) ---
const ProtectedRoute = ({ user, allowedRoles, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
     return <Navigate to="/" replace />; 
  }
  return children;
};

export default function App() {
  const [user, setUser] = useState(() => { 
      const saved = localStorage.getItem('braveUser'); 
      return saved ? JSON.parse(saved) : null; 
  });

  const [dashboardBranch, setDashboardBranch] = useState(() => {
      if (user && user.branch) return user.branch;
      return BRANCHES.SHAFA;
  });
  
  const [loadingAuth, setLoadingAuth] = useState(true);
  
  // ✅ Collections Hooks
  const studentsCollection = useCollection('students'); 
  const scheduleCollection = useCollection('schedule');
  const newsCollection = useCollection('news'); 
  
  const handleLogin = async (username, password) => {
    try {
      // 1. فحص حسابات الطلاب
      const studentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');
      const qStudent = query(studentsRef, where("username", "==", username), where("password", "==", password));
      const studentSnap = await getDocs(qStudent);

      if (!studentSnap.empty) {
        const studentDoc = studentSnap.docs[0];
        const studentData = studentDoc.data();
        const userData = { role: 'student', familyId: studentData.familyId, name: studentData.familyName || studentData.name, id: studentDoc.id };
        setUser(userData); 
        localStorage.setItem('braveUser', JSON.stringify(userData)); 
        return;
      }

      // 2. فحص حسابات الكباتن
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
         return;
      }

      // 3. فحص حسابات الأدمن (Firebase Auth)
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
  };

  if (loadingAuth) return <div className="flex h-screen items-center justify-center font-bold text-xl text-yellow-600 bg-gray-50">جاري التأكد من البيانات...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView setView={()=>{}} schedule={scheduleCollection.data} />} />
        
        <Route path="/login" element={
            !user ? <LoginView setView={()=>{}} handleLogin={handleLogin} /> : <Navigate to={user.role === 'student' ? '/portal' : '/admin'} replace />
        } />
        
        <Route path="/portal" element={
            <ProtectedRoute user={user} allowedRoles={['student']}>
              <StudentPortal user={user} students={studentsCollection.data} schedule={scheduleCollection.data} news={newsCollection.data} handleLogout={handleLogout} />
            </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
            <ProtectedRoute user={user} allowedRoles={['admin', 'captain']}>
              <AdminDashboard user={user} selectedBranch={dashboardBranch} onSwitchBranch={user.isSuper ? setDashboardBranch : null} studentsCollection={studentsCollection} scheduleCollection={scheduleCollection} handleLogout={handleLogout} />
            </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, appId } from './lib/firebase';
import { useCollection } from './hooks/useCollection';
import { hashPassword } from './lib/utils';

// Import Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import StudentPortal from './views/StudentPortal';
import AdminDashboard from './views/AdminDashboard';
import { BRANCHES } from './lib/constants';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('braveUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem('braveUser');
      return null;
    }
  });

  const [view, setView] = useState(() => {
    try {
      if (typeof window !== 'undefined' && localStorage.getItem('braveUser')) {
        const u = JSON.parse(localStorage.getItem('braveUser'));
        return u.role === 'student' ? 'student_portal' : 'admin_dashboard';
      }
    } catch {
      localStorage.removeItem('braveUser');
    }
    return 'home';
  });

  const [dashboardBranch, setDashboardBranch] = useState(BRANCHES.SHAFA);
  const [loadingAuth, setLoadingAuth]         = useState(true);
  // FIX: loginError state so the UI shows it inside the card (not just alert)
  const [loginError, setLoginError]           = useState('');

  const studentsCollection = useCollection('students');
  const scheduleCollection = useCollection('schedule');
  const newsCollection     = useCollection('news');

  const navigateTo = (newView) => {
    setView(newView);
    window.history.pushState({ view: newView }, '', '');
  };

  useEffect(() => {
    window.history.replaceState({ view }, '', '');
    const handleBackButton = (event) => {
      if (event.state && event.state.view) setView(event.state.view);
      else setView('home');
    };
    window.addEventListener('popstate', handleBackButton);
    return () => window.removeEventListener('popstate', handleBackButton);
  }, [view]);

  const handleLogin = async (username, password) => {
    // Clear previous errors
    setLoginError('');
    try {
      // 1. Student login via Firestore query
      const hashedPassword = await hashPassword(password);
      const studentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');

      const qStudent = query(
        studentsRef,
        where("username", "==", username),
        // Check both plain and hashed — supports legacy plain-text passwords
        where("password", "in", [password, hashedPassword])
      );

      const studentSnap = await getDocs(qStudent);

      if (!studentSnap.empty) {
        const studentDoc  = studentSnap.docs[0];
        const studentData = studentDoc.data();
        const userData = {
          role:     'student',
          familyId: studentData.familyId,
          name:     studentData.familyName || studentData.name,
          id:       studentDoc.id,
        };
        setUser(userData);
        localStorage.setItem('braveUser', JSON.stringify(userData));
        navigateTo('student_portal');
        return;
      }

      // 2. Admin / Captain login via Firebase Auth
      let cleanUsername = username.trim().toLowerCase();
      let email = cleanUsername;

      if (cleanUsername === 'admin1') email = 'admin@brave.com';
      if (!email.includes('@')) email = `${email}@brave.com`;

      await signInWithEmailAndPassword(auth, email, password);
      return;

    } catch (error) {
      console.error("Login Error:", error);
      // FIX: set state error so LoginView shows it inside the card UI
      setLoginError('بيانات الدخول خاطئة أو كلمة المرور غير صحيحة!');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userEmail = firebaseUser.email.toLowerCase().trim();
          const userRef   = doc(db, 'artifacts', appId, 'public', 'data', 'users', userEmail);
          const userSnap  = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = { ...userSnap.data(), email: userEmail, id: firebaseUser.uid };
            setUser(userData);
            setDashboardBranch(userData.branch || BRANCHES.SHAFA);
            localStorage.setItem('braveUser', JSON.stringify(userData));
            setView('admin_dashboard');
          } else {
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

  if (loadingAuth && user) return (
    <div className="flex h-screen items-center justify-center font-bold text-xl text-yellow-600 bg-gray-50">
      جاري التأكد من الصلاحيات...
    </div>
  );

  return (
    <>
      {view === 'home' && (
        <HomeView setView={navigateTo} schedule={scheduleCollection.data} />
      )}
      {view === 'login' && (
        <LoginView
          setView={navigateTo}
          handleLogin={handleLogin}
          loginError={loginError}        // FIX: now properly passed
          setLoginError={setLoginError}  // so LoginView can clear it on change
        />
      )}
      {view === 'student_portal' && user && (
        <StudentPortal
          user={user}
          students={studentsCollection.data}
          schedule={scheduleCollection.data}
          news={newsCollection.data}
          handleLogout={handleLogout}
        />
      )}
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

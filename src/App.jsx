// src/App.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, signInWithCustomToken } from "firebase/auth";
import { getDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { httpsCallable } from 'firebase/functions';
import { auth, db, appId, functions } from './lib/firebase';
import { useCollection } from './hooks/useCollection';

// Import Views
import HomeView from './views/HomeView';
import LoginView from './views/LoginView';
import StudentPortal from './views/StudentPortal';
import AdminDashboard from './views/AdminDashboard';
import { BRANCHES } from './lib/constants';
import ToastContainer from './components/ToastContainer';
import { toast } from './lib/toast';
import ErrorBoundary from './components/ErrorBoundary';

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
    // Read hash first — preserves correct page on browser refresh
    const hash = window.location.hash.slice(1).split('/')[0];
    const validViews = ['home', 'login', 'student_portal', 'admin_dashboard'];
    if (hash && validViews.includes(hash)) return hash;
    // Fall back to localStorage
    try {
      if (localStorage.getItem('braveUser')) {
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
  const [authUid, setAuthUid]                 = useState(null);

  const isFamily = user?.role === 'student';
  const studentsCollection = useCollection('students', {
    enabled: Boolean(authUid),
    where: isFamily ? [['familyUid', '==', authUid]] :
      (user && !user.isSuper ? [['branch', '==', dashboardBranch]] : []),
  });
  const scheduleCollection = useCollection('schedule');
  const newsCollection     = useCollection('news');

  const navigateTo = (newView) => {
    setView(newView);
    window.location.hash = newView;
  };

  // Back/Forward button support via hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1).split('/')[0];
      const validViews = ['home', 'login', 'student_portal', 'admin_dashboard'];
      if (validViews.includes(hash)) setView(hash);
      else if (!hash) setView('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirect to home if unauthenticated user lands on a protected view
  useEffect(() => {
    if (!loadingAuth && !user && (view === 'admin_dashboard' || view === 'student_portal')) {
      setView('home');
      window.location.hash = 'home';
    }
  }, [loadingAuth, user, view]);

  const handleLogin = async (username, password) => {
    // Clear previous errors
    setLoginError('');
    try {
      // 1. Family login is verified server-side; the students collection is no
      // longer queried publicly from the browser.
      try {
        const familyLogin = httpsCallable(functions, 'familyLogin');
        const result = await familyLogin({ username: username.trim().toLowerCase(), password });
        if (result.data?.email) await signInWithEmailAndPassword(auth, result.data.email, password);
        else if (result.data?.customToken) await signInWithCustomToken(auth, result.data.customToken);
        else throw new Error('Missing family authentication result');
        return;
      } catch (familyError) {
        if (!['functions/unauthenticated', 'functions/invalid-argument'].includes(familyError.code)) {
          console.warn('Family login unavailable, trying staff login:', familyError.code);
        }
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
          setAuthUid(firebaseUser.uid);
          const token = await firebaseUser.getIdTokenResult(true);
          if (token.claims.role === 'family') {
            const studentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');
            const familySnap = await getDocs(query(studentsRef, where('familyUid', '==', firebaseUser.uid)));
            if (familySnap.empty) throw new Error('Family has no linked students');
            const first = familySnap.docs[0];
            const studentData = first.data();
            const familyUser = {
              role: 'student', familyId: studentData.familyId,
              name: studentData.familyName || studentData.name,
              id: first.id, familyUid: firebaseUser.uid,
            };
            setUser(familyUser);
            localStorage.setItem('braveUser', JSON.stringify(familyUser));
            setView('student_portal');
            setLoadingAuth(false);
            return;
          }
          const userEmail = firebaseUser.email.toLowerCase().trim();
          const userRef   = doc(db, 'artifacts', appId, 'public', 'data', 'users', userEmail);
          const userSnap  = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = {
              ...userSnap.data(),
              email: userEmail,
              id: firebaseUser.uid,
              emailVerified: firebaseUser.emailVerified,  // ← هل الإيميل مُفعّل
            };
            setUser(userData);
            setDashboardBranch(userData.branch || BRANCHES.SHAFA);
            localStorage.setItem('braveUser', JSON.stringify(userData));
            setView('admin_dashboard');
          } else {
            toast("حسابك غير مسجل في نظام الصلاحيات. تواصل مع السوبر أدمن.", 'error');
            await signOut(auth);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setAuthUid(null);
        // Local storage is only a UI cache; Firebase Auth is now required for
        // both staff and families. Old legacy-only sessions are signed out once.
        localStorage.removeItem('braveUser');
        setUser(null);
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

  // FIX: also show spinner when landing directly on a protected route with no
  // cached session yet — avoids a blank screen flash before the redirect-home effect fires
  if (loadingAuth && (user || view === 'admin_dashboard' || view === 'student_portal')) return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-950 gap-5">
      <img src="/logo.jpg" alt="Brave Academy" className="w-20 h-20 rounded-2xl shadow-2xl shadow-black/50" />
      <div className="w-9 h-9 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      <p className="text-slate-400 font-bold text-sm tracking-wide">الرجاء الانتظار PLEASE WAIT ...</p>
    </div>
  );

  return (
    <>
      <ToastContainer />
      <ErrorBoundary>
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
      </ErrorBoundary>
    </>
  );
}

// src/App.jsx
import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
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
const ManagementView = lazy(() => import('./views/ManagementView'));
import { BRANCHES } from './lib/constants';
import ToastContainer from './components/ToastContainer';
import { toast } from './lib/toast';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const portalRef=useRef(sessionStorage.getItem('bravePortal') || 'coach');
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
    const validViews = ['home', 'login', 'student_portal', 'admin_dashboard', 'management_portal'];
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
    enabled: Boolean(authUid && user && user.portal !== 'management'),
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
      const validViews = ['home', 'login', 'student_portal', 'admin_dashboard', 'management_portal'];
      if (validViews.includes(hash)) setView(hash);
      else if (!hash) setView('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Redirect to home if unauthenticated user lands on a protected view
  useEffect(() => {
    if (!loadingAuth && !user && (view === 'admin_dashboard' || view === 'student_portal' || view === 'management_portal')) {
      setView('home');
      window.location.hash = 'home';
    }
  }, [loadingAuth, user, view]);

  const handleLogin = async (username, password, portal = 'student') => {
    portalRef.current=portal; sessionStorage.setItem('bravePortal',portal);
    // Clear previous errors
    setLoginError('');
    try {
      if(auth.currentUser) await signOut(auth);
      // 1. Family login is verified server-side; the students collection is no
      // longer queried publicly from the browser.
      if (portal === 'student') {
        const familyLogin = httpsCallable(functions, 'familyLogin');
        const result = await familyLogin({ username: username.trim().toLowerCase(), password });
        if (result.data?.email) await signInWithEmailAndPassword(auth, result.data.email, password);
        else if (result.data?.customToken) await signInWithCustomToken(auth, result.data.customToken);
        else throw new Error('Missing family authentication result');
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
          setLoadingAuth(true);
          const requested=portalRef.current;
          const token = await firebaseUser.getIdTokenResult(true);
          if (token.claims.role === 'family') {
            if(requested !== 'student' && sessionStorage.getItem('bravePortal')) throw new Error('هذا الحساب مخصص لبوابة الطالب والأهل.');
            const studentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'students');
            const familySnap = await getDocs(query(studentsRef, where('familyUid', '==', firebaseUser.uid)));
            if (familySnap.empty) throw new Error('Family has no linked students');
            const first = familySnap.docs[0];
            const studentData = first.data();
            const familyUser = {
              role: 'student', portal: 'student', familyId: studentData.familyId,
              name: studentData.familyName || studentData.name,
              id: first.id, familyUid: firebaseUser.uid,
            };
            setAuthUid(firebaseUser.uid);
            setUser(familyUser);
            localStorage.setItem('braveUser', JSON.stringify(familyUser));
            navigateTo('student_portal');
            setLoadingAuth(false);
            return;
          }
          const userEmail = firebaseUser.email.toLowerCase().trim();
          const userRef   = doc(db, 'artifacts', appId, 'public', 'data', 'users', userEmail);
          const userSnap  = await getDoc(userRef);

          if(requested === 'student') throw new Error('اختر مدرب أو إدارة لهذا الحساب.');
          let userData;
          if(requested === 'management') {
            const director=userSnap.data()?.isSuper===true || ['admin@brave.com','jehad234kawash@yahoo.com'].includes(userEmail);
            const manager=director?null:await getDoc(doc(db,'artifacts',appId,'public','data','management_users',userEmail));
            if(!director && !(manager?.exists() && manager.data().active===true)) throw new Error('هذا الحساب غير مخوّل لدخول الإدارة العامة.');
            userData={...(manager?.data()||{}),role:'management',portal:'management',isSuper:director,email:userEmail,id:firebaseUser.uid};
          } else {
            if(!userSnap.exists()) throw new Error('حساب المدرب غير مسجل في نظام الصلاحيات.');
            userData={...userSnap.data(),portal:'coach',email:userEmail,id:firebaseUser.uid,emailVerified:firebaseUser.emailVerified};
          }
          setAuthUid(firebaseUser.uid);
          setUser(userData);
          setDashboardBranch(userData.branch || BRANCHES.SHAFA);
          localStorage.setItem('braveUser',JSON.stringify(userData));
          const target=userData.portal==='management'?'management_portal':'admin_dashboard';
          const current=window.location.hash.slice(1).split('/')[0];
          if(current!==target) navigateTo(target); else setView(target);
        } catch (err) {
          setLoginError(err.code === 'permission-denied' ? 'تعذر التحقق من صلاحيات هذه البوابة؛ يلزم تفعيل قواعد الإدارة الجديدة.' : err.message || 'تعذر التحقق من الحساب.');
          await signOut(auth); setUser(null); setAuthUid(null); navigateTo('login');
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

  useEffect(()=>{
    if(loadingAuth || !user) return;
    const target=user.portal==='management'?'management_portal':user.role==='student'?'student_portal':'admin_dashboard';
    if(['management_portal','student_portal','admin_dashboard'].includes(view)&&view!==target) navigateTo(target);
  },[loadingAuth,user,view]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('braveUser');
    setUser(null);
    sessionStorage.removeItem('bravePortal');
    navigateTo('login');
  };

  // FIX: also show spinner when landing directly on a protected route with no
  // cached session yet — avoids a blank screen flash before the redirect-home effect fires
  if (loadingAuth && (user || view === 'admin_dashboard' || view === 'student_portal' || view === 'management_portal')) return (
    <div className="flex flex-col h-screen items-center justify-center bg-slate-950 gap-5">
      <img src="/logo.jpg" alt="Brave Taekwondo" className="w-20 h-20 rounded-2xl shadow-2xl shadow-black/50" />
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
        {view === 'student_portal' && user?.role === 'student' && (
          <StudentPortal
            user={user}
            students={studentsCollection.data}
            schedule={scheduleCollection.data}
            news={newsCollection.data}
            handleLogout={handleLogout}
          />
        )}
        {view === 'admin_dashboard' && user?.portal === 'coach' && (
          <AdminDashboard
            user={user}
            selectedBranch={dashboardBranch}
            onSwitchBranch={user.isSuper ? setDashboardBranch : null}
            studentsCollection={studentsCollection}
            scheduleCollection={scheduleCollection}
            handleLogout={handleLogout}
          />
        )}
        {view === 'management_portal' && user?.portal === 'management' && <Suspense fallback={<p>جارٍ تحميل الإدارة العامة…</p>}><ManagementView account={user} onLogout={handleLogout}/></Suspense>}
      </ErrorBoundary>
    </>
  );
}

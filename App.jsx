import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Calendar, Trophy, DollarSign, Menu, X, 
  LogOut, UserPlus, CheckCircle, Activity, Phone, 
  MapPin, Search, FileText, Edit, 
  Trash2, Archive, ArrowRight, ArrowUp, ArrowDown, AlertTriangle, ChevronLeft, ChevronRight as ChevronRightIcon,
  Lock, UserCheck, Star, Clock, Facebook, Instagram, Youtube, Printer, MessageCircle, TrendingUp, TrendingDown, Plus, ClipboardList, ShieldAlert, FileSearch, ArrowDownAZ, Filter, Inbox
} from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from "firebase/firestore";

// --- Firebase Configuration (Live Keys) ---
const firebaseConfig = {
  apiKey: "AIzaSyCKMrH2E_GP_MYZJrhF4LbxC1LmtVGx3Co",
  authDomain: "brave-academy.firebaseapp.com",
  projectId: "brave-academy",
  storageBucket: "brave-academy.firebasestorage.app",
  messagingSenderId: "862804404676",
  appId: "1:862804404676:web:871e3bb0796c354f1f5c91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const appId = 'brave-academy-live-data';

// --- صور النظام ---
const IMAGES = {
  LOGO: "/logo.jpg",           
  HERO_BG: "/hero.jpg",        
  BRANCH_SHAFA: "/shafa.jpg",  
  BRANCH_ABU_NSEIR: "/abunseir.jpg" 
};

// --- جدول الحصص الافتراضي ---
const INITIAL_SCHEDULE = [
  { id: 1, days: "السبت / الاثنين / الأربعاء", time: "4:00 م - 5:00 م", level: "مبتدئين (أبيض - أصفر)", branch: "مشترك" },
  { id: 2, days: "السبت / الاثنين / الأربعاء", time: "5:00 م - 6:30 م", level: "أحزمة ملونة (أخضر - أزرق)", branch: "مشترك" },
  { id: 3, days: "الأحد / الثلاثاء / الخميس", time: "5:00 م - 6:30 م", level: "متقدم (أحمر - أسود)", branch: "مشترك" },
  { id: 4, days: "الجمعة", time: "9:00 ص - 11:00 ص", level: "فريق المنتخبات", branch: "الفرع الرئيسي" },
];

// --- Custom Hook for Firestore ---
const useCollection = (collectionName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const path = collection(db, 'artifacts', appId, 'public', 'data', collectionName);
    const q = query(path);
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData(items);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching ${collectionName}:`, error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [collectionName]);

  const add = async (item) => {
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', collectionName), item);
      return true;
    } catch (e) {
      console.error(e);
      alert("خطأ في الحفظ، تأكد من الاتصال بالإنترنت");
      return false;
    }
  };

  const update = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id), updates);
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id) => {
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id));
    } catch (e) {
      console.error(e);
    }
  };

  return { data, loading, add, update, remove };
};

// --- Constants ---
const BRANCHES = { SHAFA: 'شفا بدران', ABU_NSEIR: 'أبو نصير' };
const BELTS = ["أبيض", "أصفر", "أخضر 1", "أخضر 2", "أزرق 1", "أزرق 2", "بني 1", "بني 2", "أحمر 1", "أحمر 2", "أسود"];

// --- Helpers ---
const calculateStatus = (dateString) => {
  if (!dateString) return 'expired';
  const today = new Date();
  const end = new Date(dateString);
  
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'near_end';
  return 'active';
};

const generateCredentials = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const username = `student${randomNum}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"; 
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return { username, password };
};

const printReceipt = (payment, branch) => {
  const receiptWindow = window.open('', 'PRINT', 'height=600,width=800');
  const logoUrl = window.location.origin + IMAGES.LOGO;
  
  receiptWindow.document.write(`
    <html>
      <head>
        <title>سند قبض - ${payment.id.slice(0,8)}</title>
        <style>
          body { font-family: 'Courier New', sans-serif; direction: rtl; padding: 20px; text-align: center; border: 2px solid #000; max-width: 600px; margin: 20px auto; position: relative; overflow: hidden; }
          .header { margin-bottom: 20px; border-bottom: 2px dashed #000; padding-bottom: 10px; position: relative; z-index: 2; }
          .logo { width: 80px; height: auto; margin-bottom: 10px; }
          .title { font-size: 24px; margin: 10px 0; background: #eee; display: inline-block; padding: 5px 20px; border-radius: 5px; position: relative; z-index: 2; }
          .content { text-align: right; margin: 20px 0; font-size: 18px; line-height: 2; position: relative; z-index: 2; }
          .amount { font-weight: bold; font-size: 22px; }
          .footer { margin-top: 40px; border-top: 2px dashed #000; padding-top: 10px; font-size: 12px; position: relative; z-index: 2; }
          .watermark {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
            opacity: 0.1; width: 60%; z-index: 1; pointer-events: none;
          }
        </style>
      </head>
      <body>
        <img src="${logoUrl}" class="watermark" />
        <div class="header">
          <img src="${logoUrl}" class="logo" alt="Logo" />
          <div>Brave Taekwondo Academy</div>
          <div>فرع: ${branch}</div>
        </div>
        <div class="title">سند قبض</div>
        <div class="content">
          <div><strong>التاريخ:</strong> ${payment.date}</div>
          <div><strong>رقم السند:</strong> #${payment.id.slice(0,8)}</div>
          <div><strong>استلمنا من السيد/ة:</strong> ${payment.name}</div>
          <div><strong>مبلغ وقدره:</strong> <span class="amount">${payment.amount} JOD</span></div>
          <div><strong>وذلك عن:</strong> ${payment.reason} ${payment.details ? '(${payment.details})' : ''}</div>
        </div>
        <div class="footer"><p>توقيع المستلم: __________________</p><p>شكراً لثقتكم بنا | هاتف: 0791234567</p></div>
      </body>
    </html>
  `);
  receiptWindow.document.close();
  receiptWindow.focus();
  setTimeout(() => {
      receiptWindow.print();
      receiptWindow.close();
  }, 500);
  return true;
};

const openWhatsApp = (phone) => {
  if (!phone) return;
  let cleanPhone = phone.replace(/\D/g, ''); 
  if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
  const url = `https://wa.me/962${cleanPhone}`;
  window.open(url, '_blank');
};

const openLocation = (url) => {
  window.open(url, '_blank');
};

// --- UI Components ---
const StudentSearch = ({ students, onSelect, placeholder = "بحث عن طالب...", showAllOption = false, onClear }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const filtered = useMemo(() => {
    if (!query) return students;
    return students.filter(s => s.name.includes(query));
  }, [students, query]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          className="w-full border p-2 pr-8 rounded focus:ring-2 focus:ring-yellow-500 outline-none"
          placeholder={placeholder}
          value={query}
          onChange={e => {
             setQuery(e.target.value);
             setIsOpen(true);
             if(e.target.value === '' && onClear) onClear();
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
        />
        <Search className="absolute left-2 top-2.5 text-gray-400" size={16}/>
        {query && (
           <button onClick={() => { setQuery(''); if(onClear) onClear(); }} className="absolute left-8 top-2.5 text-gray-400 hover:text-red-500">
             <X size={16}/>
           </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-48 overflow-y-auto mt-1">
          {showAllOption && (
             <div className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b font-bold text-blue-600" onClick={() => { setQuery(''); if(onClear) onClear(); setIsOpen(false); }}>
               عرض الكل
             </div>
          )}
          {filtered.length > 0 ? filtered.map(s => (
              <div
                key={s.id}
                className="p-2 hover:bg-yellow-50 cursor-pointer text-sm border-b last:border-0 flex justify-between items-center"
                onClick={() => { setQuery(s.name); onSelect(s); setIsOpen(false); }}
              >
                <span className="font-bold">{s.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{s.belt}</span>
              </div>
            )) : <div className="p-2 text-gray-500 text-sm text-center">لا توجد نتائج</div>}
        </div>
      )}
    </div>
  );
};

const Button = ({ children, onClick, variant = "primary", className = "", type="button" }) => {
  const variants = {
    primary: "bg-yellow-500 text-black hover:bg-yellow-400 border border-yellow-600 font-bold",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };
  return (
    <button type={type} onClick={onClick} className={`px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-sm ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", title, action }) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden ${className}`}>
    {(title || action) && (
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        {title && <h3 className="font-bold text-gray-800 text-lg">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

const StatusBadge = ({ status }) => {
  const map = {
    active: { text: "فعال", style: "bg-green-100 text-green-800 border-green-200" },
    near_end: { text: "قارب الانتهاء", style: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    expired: { text: "منتهي", style: "bg-red-100 text-red-800 border-red-200" },
  };
  const current = map[status] || map.active;
  return <span className={`px-3 py-1 rounded-full text-xs font-bold border ${current.style}`}>{current.text}</span>;
};

// --- Views ---

const HomeView = ({ setView, schedule, registrationsCollection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '', dob: '', address: '', branch: BRANCHES.SHAFA });

  const handleRegister = async (e) => {
    e.preventDefault();
    const success = await registrationsCollection.add({ ...regForm, date: new Date().toLocaleDateString('ar-JO') });
    if (success) {
        alert("تم إرسال طلب التسجيل بنجاح! سنتواصل معك قريباً.");
        setShowRegModal(false);
        setRegForm({ name: '', phone: '', dob: '', address: '', branch: BRANCHES.SHAFA });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl">
      <header className="bg-black text-yellow-500 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <img src={IMAGES.LOGO} alt="Logo" className="w-12 h-12 rounded-full bg-white p-1 object-contain" />
            <div>
              <h1 className="text-lg font-extrabold leading-none">أكاديمية الشجاع</h1>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase">Brave Taekwondo</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 font-medium text-sm">
            {['الرئيسية', 'من نحن', 'جدول الحصص', 'الفروع'].map((item) => (
              <button key={item} className="hover:text-white transition-colors duration-300" onClick={() => {
                if (item === 'جدول الحصص') document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'});
                if (item === 'الفروع') document.getElementById('branches')?.scrollIntoView({behavior: 'smooth'});
                if (item === 'الرئيسية') window.scrollTo(0,0);
              }}>{item}</button>
            ))}
          </nav>
          <div className="flex gap-2">
            <Button onClick={() => setView('login')} className="px-4 py-2 text-sm hidden md:block">بوابة الأعضاء</Button>
            <button className="md:hidden p-2 text-yellow-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
           <div className="md:hidden bg-gray-900 border-t border-gray-800 p-4 flex flex-col gap-4">
             {['الرئيسية', 'من نحن', 'جدول الحصص', 'الفروع'].map((item) => (
                <button key={item} className="text-right py-2 hover:text-white border-b border-gray-800" onClick={() => {
                  setMobileMenuOpen(false);
                  if (item === 'جدول الحصص') document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'});
                  if (item === 'الفروع') document.getElementById('branches')?.scrollIntoView({behavior: 'smooth'});
                }}>{item}</button>
             ))}
             <Button onClick={() => { setMobileMenuOpen(false); setView('login'); }} className="w-full py-3">بوابة الأعضاء</Button>
           </div>
        )}
      </header>

      <div className="relative bg-gray-900 text-white h-[600px] flex items-center">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img src={IMAGES.HERO_BG} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container mx-auto px-6 relative z-20 flex flex-col items-start">
          <span className="bg-yellow-500 text-black font-bold px-3 py-1 rounded mb-4 text-sm">التسجيل مفتوح الآن</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            اصنع قوتك ..<br/><span className="text-yellow-500">ابنِ مستقبلك</span>
          </h2>
          <div className="flex gap-4">
            <Button onClick={() => setShowRegModal(true)} className="px-8 py-4 text-lg">ابدأ رحلتك معنا</Button>
            <Button variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-black" onClick={() => document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'})}>جدول الحصص</Button>
          </div>
        </div>
      </div>
      
      <section id="branches" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16"><h2 className="text-4xl font-bold text-gray-900 mb-4">فروعنا</h2><p className="text-gray-500">اختر الفرع الأقرب إليك وابدأ رحلتك</p></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group">
              <div className="h-64 bg-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition z-10"></div>
                  <img src={IMAGES.BRANCH_SHAFA} alt="Shafa Badran" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-4 right-4 text-white z-20"><h3 className="text-2xl font-bold">فرع شفا بدران</h3></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-start gap-4"><MapPin className="text-yellow-600 mt-1" /><div><p className="font-bold text-gray-900">شفا بدران - شارع رفعت شموط</p><p className="text-gray-500 text-sm">بجانب مشاتل ربيع الأردن</p></div></div>
                <div className="flex items-center gap-4"><Phone className="text-yellow-600" /><div className="flex items-center gap-2"><a href="tel:0795629606" className="font-bold text-gray-900 hover:text-yellow-600 transition" dir="ltr">07 9562 9606</a></div></div>
                <div className="flex items-center gap-4"><Clock className="text-yellow-600" /><p className="text-gray-600 text-sm">يومياً من 3:00 م - 9:00 م (ما عدا الجمعة)</p></div>
                <Button variant="outline" className="w-full mt-4" onClick={() => openLocation('https://share.google/PGRNQACVSiOhXkmbj')}>موقعنا على الخريطة</Button>
              </div>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group">
              <div className="h-64 bg-gray-800 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition z-10"></div>
                  <img src={IMAGES.BRANCH_ABU_NSEIR} alt="Abu Nseir" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-4 right-4 text-white z-20"><h3 className="text-2xl font-bold">فرع أبو نصير</h3></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-start gap-4"><MapPin className="text-yellow-600 mt-1" /><div><p className="font-bold text-gray-900">أبو نصير - دوار البحرية</p><p className="text-gray-500 text-sm">مجمع الفرا</p></div></div>
                <div className="flex items-center gap-4"><Phone className="text-yellow-600" /><div className="flex items-center gap-2"><a href="tel:0790368603" className="font-bold text-gray-900 hover:text-yellow-600 transition" dir="ltr">07 9036 8603</a></div></div>
                <div className="flex items-center gap-4"><Clock className="text-yellow-600" /><p className="text-gray-600 text-sm">يومياً من 3:00 م - 9:00 م (ما عدا الجمعة)</p></div>
                <Button variant="outline" className="w-full mt-4" onClick={() => openLocation('https://share.google/6rSHFxa03RG6n9WH0')}>موقعنا على الخريطة</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="schedule" className="py-20 container mx-auto px-6">
        <div className="text-center mb-12"><h2 className="text-4xl font-bold text-gray-900 mb-4">جدول الحصص الأسبوعي</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(schedule && schedule.length > 0 ? schedule : INITIAL_SCHEDULE).map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-yellow-500">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mb-4"><Clock className="text-gray-800" size={24}/></div>
              <h3 className="font-bold text-lg mb-2">{cls.level}</h3>
              <p className="text-gray-600 text-sm mb-4">{cls.branch}</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500"><Calendar size={16} className="text-yellow-500"/><span>{cls.days}</span></div>
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800"><Activity size={16} className="text-yellow-500"/><span>{cls.time}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-yellow-500"><div className="container mx-auto px-6 text-center text-sm text-gray-500"><p>© 2023 جميع الحقوق محفوظة لأكاديمية الشجاع للتايكوندو.</p></div></footer>

      {/* Modal Registration Form */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <Card className="w-full max-w-lg animate-fade-in" title="طلب تسجيل جديد">
             <form onSubmit={handleRegister} className="space-y-4">
               <div><label className="block text-xs font-bold mb-1">اسم الطالب الرباعي</label><input required className="w-full border p-2 rounded" value={regForm.name} onChange={e=>setRegForm({...regForm, name:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1">تاريخ الميلاد</label><input type="date" required className="w-full border p-2 rounded" value={regForm.dob} onChange={e=>setRegForm({...regForm, dob:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1">رقم هاتف ولي الأمر</label><input required className="w-full border p-2 rounded" value={regForm.phone} onChange={e=>setRegForm({...regForm, phone:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1">العنوان</label><input required className="w-full border p-2 rounded" value={regForm.address} onChange={e=>setRegForm({...regForm, address:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1">الفرع المطلوب</label><select className="w-full border p-2 rounded" value={regForm.branch} onChange={e=>setRegForm({...regForm, branch:e.target.value})}>
                 <option value={BRANCHES.SHAFA}>{BRANCHES.SHAFA}</option>
                 <option value={BRANCHES.ABU_NSEIR}>{BRANCHES.ABU_NSEIR}</option>
               </select></div>
               <div className="flex justify-end gap-2 mt-4">
                 <Button variant="ghost" onClick={()=>setShowRegModal(false)}>إلغاء</Button>
                 <Button type="submit">إرسال الطلب</Button>
               </div>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};

const LoginView = ({ setView, handleLogin, loginError }) => {
  const [u, setU] = useState(''); 
  const [p, setP] = useState('');
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden" dir="rtl">
      <Card className="w-full max-w-md relative z-10 border-t-4 border-yellow-500">
        <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg p-2">
                <img src={IMAGES.LOGO} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
        </div>
        {loginError && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{loginError}</div>}
        <form className="space-y-5" onSubmit={(e)=>{e.preventDefault(); handleLogin(u,p)}}>
          <input className="w-full border p-3 rounded-lg" placeholder="اسم المستخدم" value={u} onChange={e=>setU(e.target.value)} />
          <input className="w-full border p-3 rounded-lg" type="password" placeholder="كلمة المرور" value={p} onChange={e=>setP(e.target.value)} />
          <Button type="submit" className="w-full py-3 text-lg shadow-lg shadow-yellow-500/30">دخول</Button>
        </form>
        <div className="mt-8 text-center border-t pt-4"><button onClick={()=>setView('home')} className="text-gray-500 hover:text-gray-800 text-sm font-medium flex items-center justify-center gap-2 w-full"><ChevronRightIcon size={16}/> العودة للصفحة الرئيسية</button></div>
      </Card>
    </div>
  );
};

const StudentPortal = ({ user, students, schedule, payments, handleLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const changeMonth = (inc) => { const d = new Date(currentDate); d.setMonth(d.getMonth() + inc); setCurrentDate(d); };
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const myStudents = students.filter(s => s.familyId === user.familyId);
  const myPayments = payments.filter(p => myStudents.some(s => s.id === p.studentId));

  return (
    <div className="min-h-screen bg-gray-100 font-sans" dir="rtl">
      <header className="bg-black text-yellow-500 p-4 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src={IMAGES.LOGO} alt="Logo" className="w-10 h-10 bg-white rounded-full p-1" />
             <div><h1 className="font-bold text-lg">مرحباً {user.name}</h1><p className="text-xs text-gray-400">بوابة العائلة</p></div>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="text-sm"><LogOut size={16}/> خروج</Button>
        </div>
      </header>
      <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-yellow-500"/> مواعيد الحصص</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{schedule && schedule.length > 0 ? schedule.map(s=><div key={s.id} className="bg-white/10 p-4 rounded-lg"><p className="font-bold text-yellow-400 mb-1">{s.level}</p><p className="text-sm">{s.days} | {s.time}</p></div>) : <p className="text-gray-400">لا يوجد جدول حصص معلن حالياً</p>}</div>
        </div>

        {/* Financial History Section */}
        <Card title="كشف الحساب (الدفعات السابقة)">
           {myPayments.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-right">
                 <thead className="bg-gray-100"><tr><th className="p-3">التاريخ</th><th className="p-3">الطالب</th><th className="p-3">البيان</th><th className="p-3">المبلغ</th></tr></thead>
                 <tbody>{myPayments.map(p=>(
                    <tr key={p.id} className="border-b">
                        <td className="p-3">{p.date}</td>
                        <td className="p-3 font-bold">{p.name}</td>
                        <td className="p-3">{p.reason} {p.details && <span className="block text-xs text-gray-400 mt-1">({p.details})</span>}</td>
                        <td className="p-3 text-green-600 font-bold">{p.amount} JOD</td>
                    </tr>
                 ))}</tbody>
               </table>
             </div>
           ) : <p className="text-gray-500 text-center py-4">لا توجد دفعات مسجلة</p>}
        </Card>

        {myStudents.map(s => (
          <Card key={s.id} className="mb-8 border-t-4 border-yellow-500" title={s.name}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
              <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الحزام الحالي</p><p className="font-bold text-xl">{s.belt}</p></div>
              <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-gray-500 text-xs mb-1">حالة الاشتراك</p>
                  <StatusBadge status={calculateStatus(s.subEnd)}/>
                  <p className="text-xs text-gray-400 mt-1">ينتهي: {s.subEnd}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الرصيد المستحق</p><p className={`font-bold text-xl ${s.balance>0?"text-red-600":"text-green-600"}`}>{s.balance} JOD</p></div>
              <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الفرع</p><p className="font-bold text-lg">{s.branch}</p></div>
            </div>
            {s.notes && s.notes.length > 0 && (<div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100"><h4 className="font-bold text-blue-800 text-sm mb-2">ملاحظات الإدارة:</h4><ul className="list-disc list-inside text-sm text-blue-900">{s.notes.map(n=><li key={n.id}>{n.text} ({n.date})</li>)}</ul></div>)}
            
            <div className="border-t pt-6">
               <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-gray-700">سجل الحضور: {monthNames[month]} {year}</h4>
                  <div className="flex gap-2"><Button variant="ghost" onClick={()=>changeMonth(-1)}><ChevronRightIcon size={16}/></Button><Button variant="ghost" onClick={()=>changeMonth(1)}><ChevronLeft size={16}/></Button></div>
               </div>
               <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                 {[...Array(daysInMonth)].map((_,i)=>{
                   const d=i+1; const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; 
                   const isP=s.attendance && s.attendance[dateStr]; 
                   return <div key={d} className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border ${isP?'bg-green-500 text-white':'bg-gray-100 text-gray-400'}`}>{d}</div>
                 })}
               </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AdminDashboard = ({ user, selectedBranch, studentsCollection, paymentsCollection, expensesCollection, scheduleCollection, archiveCollection, registrationsCollection, handleLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const students = studentsCollection.data;
  const payments = paymentsCollection.data;
  const expenses = expensesCollection.data;
  const schedule = scheduleCollection.data;
  const registrations = registrationsCollection.data;
  const archivedStudents = archiveCollection.data;

  const branchStudents = useMemo(() => students.filter(s => s.branch === selectedBranch), [students, selectedBranch]);
  const branchPayments = useMemo(() => payments.filter(p => p.branch === selectedBranch), [payments, selectedBranch]);
  const branchExpenses = useMemo(() => expenses.filter(e => e.branch === selectedBranch), [expenses, selectedBranch]);
  const branchRegistrations = useMemo(() => registrations.filter(r => r.branch === selectedBranch), [registrations, selectedBranch]);

  const totalIncome = branchPayments.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = branchExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  const DashboardStats = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <Card className="bg-gray-800 text-white border-none"><h3 className="text-gray-400 text-sm mb-1">الطلاب</h3><p className="text-4xl font-bold">{branchStudents.length}</p></Card>
         <Card className="bg-blue-600 text-white border-none"><h3 className="text-blue-200 text-sm mb-1">الإيرادات</h3><p className="text-4xl font-bold">{totalIncome}</p></Card>
         <Card className="bg-red-600 text-white border-none"><h3 className="text-red-200 text-sm mb-1">المصاريف</h3><p className="text-4xl font-bold">{totalExpense}</p></Card>
         <Card className={`border-none text-white ${totalIncome-totalExpense >= 0 ? 'bg-green-600' : 'bg-orange-600'}`}><h3 className="text-white/70 text-sm mb-1">صافي الربح</h3><p className="text-4xl font-bold">{totalIncome-totalExpense}</p></Card>
      </div>
      {/* Tables here... */}
    </div>
  );

  const RegistrationManager = () => {
    const [confirmModal, setConfirmModal] = useState(null); 
    const [formData, setFormData] = useState({});
    const [linkFamily, setLinkFamily] = useState('new');
    const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];

    const openConfirm = (reg) => {
        const today = new Date().toISOString().split('T')[0];
        const nextMonth = new Date(); nextMonth.setMonth(nextMonth.getMonth()+1);
        setFormData({
            name: reg.name, phone: reg.phone, dob: reg.dob, address: reg.address,
            belt: 'أبيض', joinDate: today, subEnd: nextMonth.toISOString().split('T')[0], balance: 0
        });
        setLinkFamily('new');
        setConfirmModal(reg);
    };

    const confirmStudent = async (e) => {
        e.preventDefault();
        const { username, password } = generateCredentials();
        let finalFamilyId, finalFamilyName;
        if (linkFamily === 'new') {
            finalFamilyId = Math.floor(Date.now() / 1000);
            finalFamilyName = `عائلة ${formData.name.split(' ').slice(-1)[0]}`;
        } else {
            finalFamilyId = parseInt(linkFamily);
            finalFamilyName = students.find(s => s.familyId === finalFamilyId)?.familyName || "عائلة";
        }

        const newStudent = {
            branch: selectedBranch, status: 'active', notes: [], internalNotes: [], attendance: {},
            username, password, familyId: finalFamilyId, familyName: finalFamilyName, customOrder: Date.now(),
            ...formData
        };

        await studentsCollection.add(newStudent); 
        await registrationsCollection.remove(confirmModal.id); 
        alert(`تم إضافة الطالب بنجاح!\nUser: ${username}\nPass: ${password}`);
        setConfirmModal(null);
    };

    return (
       <div className="space-y-6">
         <h3 className="font-bold text-xl flex items-center gap-2"><Inbox/> طلبات التسجيل الجديدة ({branchRegistrations.length})</h3>
         <div className="grid gap-4">
            {branchRegistrations.length === 0 ? <p className="text-gray-500">لا توجد طلبات جديدة.</p> : branchRegistrations.map(reg => (
                <Card key={reg.id} className="border-r-4 border-blue-500">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="font-bold text-lg">{reg.name}</h4>
                            <p className="text-sm text-gray-600"><Phone size={14} className="inline ml-1"/>{reg.phone} | <MapPin size={14} className="inline ml-1"/>{reg.address}</p>
                            <p className="text-xs text-gray-400 mt-1">تاريخ الطلب: {reg.date} | الميلاد: {reg.dob}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => openConfirm(reg)} className="bg-green-600 hover:bg-green-700 text-white text-sm">اعتماد كطالب</Button>
                            <button onClick={() => {if(confirm('حذف الطلب؟')) registrationsCollection.remove(reg.id)}} className="text-red-500 p-2 hover:bg-red-50 rounded"><Trash2 size={18}/></button>
                        </div>
                    </div>
                </Card>
            ))}
         </div>
         {confirmModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
                <Card className="w-full max-w-2xl" title="إكمال بيانات الطالب الجديد">
                    <form onSubmit={confirmStudent} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div><label className="block text-xs mb-1">الاسم</label><input className="w-full border p-2 bg-gray-100 rounded" value={formData.name} readOnly /></div>
                            <div><label className="block text-xs mb-1">الهاتف</label><input className="w-full border p-2 bg-gray-100 rounded" value={formData.phone} readOnly /></div>
                            <div><label className="block text-xs mb-1">العائلة</label><select className="w-full border p-2 rounded" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}><option value="new">عائلة جديدة</option>{uniqueFamilies.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></div>
                            <div><label className="block text-xs mb-1">الحزام</label><select className="w-full border p-2 rounded" value={formData.belt} onChange={e=>setFormData({...formData, belt:e.target.value})}>{BELTS.map(b=><option key={b}>{b}</option>)}</select></div>
                            <div><label className="block text-xs mb-1">تاريخ الالتحاق</label><input type="date" className="w-full border p-2 rounded" value={formData.joinDate} onChange={e=>setFormData({...formData, joinDate:e.target.value})} /></div>
                            <div><label className="block text-xs mb-1">نهاية الاشتراك</label><input type="date" className="w-full border p-2 rounded" value={formData.subEnd} onChange={e=>setFormData({...formData, subEnd:e.target.value})} /></div>
                            <div><label className="block text-xs mb-1 text-red-600 font-bold">رصيد مستحق (JOD)</label><input type="number" className="w-full border p-2 rounded" value={formData.balance} onChange={e=>setFormData({...formData, balance:e.target.value})} /></div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4"><Button variant="ghost" onClick={() => setConfirmModal(null)}>إلغاء</Button><Button type="submit">تأكيد وإضافة</Button></div>
                    </form>
                </Card>
            </div>
         )}
       </div>
    );
  };

  const StudentsManager = () => {
    const [search, setSearch] = useState(''); const [showModal, setShowModal] = useState(false); const [editingStudent, setEditingStudent] = useState(null); const [createdCreds, setCreatedCreds] = useState(null);
    const [newS, setNewS] = useState({ name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0 });
    const [linkFamily, setLinkFamily] = useState('new');
    const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];
    const filtered = branchStudents.filter(s => s.name.includes(search));

    const addStudent = async (e) => {
      e.preventDefault(); const { username, password } = generateCredentials();
      let finalFamilyId, finalFamilyName;
      if (linkFamily === 'new') { finalFamilyId = Math.floor(Date.now() / 1000); finalFamilyName = `عائلة ${newS.name.split(' ').slice(-1)[0]}`; } else { finalFamilyId = parseInt(linkFamily); finalFamilyName = students.find(s => s.familyId === finalFamilyId)?.familyName || "عائلة"; }
      const joinDateObj = new Date(newS.joinDate || new Date()); const subEndDateObj = new Date(joinDateObj); subEndDateObj.setMonth(subEndDateObj.getMonth() + 1); const subEnd = subEndDateObj.toISOString().split('T')[0];
      const student = { branch: selectedBranch, status: 'active', subEnd: subEnd, notes: [], internalNotes: [], attendance: {}, username, password, familyId: finalFamilyId, familyName: finalFamilyName, customOrder: Date.now(), ...newS };
      await studentsCollection.add(student); setCreatedCreds({ name: student.name, username, password }); setShowModal(false); setNewS({ name: '', phone: '', belt: 'أبيض', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0 }); setLinkFamily('new');
    };

    const openEditModal = (student) => { setEditingStudent(student); setNewS({ name: student.name, phone: student.phone, belt: student.belt, joinDate: student.joinDate, dob: student.dob, address: student.address || '', subEnd: student.subEnd, balance: student.balance }); setLinkFamily(student.familyId); setShowModal(true); };
    const handleSaveEdit = async (e) => { e.preventDefault(); await studentsCollection.update(editingStudent.id, newS); setShowModal(false); setEditingStudent(null); };
    const promoteBelt = async (student) => { const currentIdx = BELTS.indexOf(student.belt); if(currentIdx < BELTS.length - 1) { await studentsCollection.update(student.id, { belt: BELTS[currentIdx + 1] }); } };
    const archiveStudent = async (student) => { if(confirm('أرشفة الطالب؟')) { await archiveCollection.add({ ...student, archiveDate: new Date().toLocaleDateString() }); await studentsCollection.remove(student.id); } };
    
    return (
      <div className="space-y-6">
        {createdCreds && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4"><Card className="w-full max-w-md bg-green-50 border-green-500 border-2 text-center p-8" title="تم إنشاء الحساب بنجاح"><p className="mb-4">الطالب: <strong>{createdCreds.name}</strong></p><div className="bg-white p-4 border rounded mb-4"><p>User: {createdCreds.username}</p><p>Pass: {createdCreds.password}</p></div><Button onClick={() => setCreatedCreds(null)} className="w-full">إغلاق</Button></Card></div>}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm"><div className="w-1/2"><input className="border p-2 rounded w-full" placeholder="بحث..." value={search} onChange={e=>setSearch(e.target.value)} /></div><Button onClick={()=>{setEditingStudent(null); setShowModal(true)}}><UserPlus size={18}/> طالب جديد</Button></div>
        <Card className="overflow-x-auto border-none shadow-md rounded-xl"><table className="w-full text-sm text-right"><thead className="bg-gray-50"><tr><th className="p-4">الطالب</th><th className="p-4">بيانات الدخول</th><th className="p-4">الهاتف</th><th className="p-4">الحزام</th><th className="p-4">الحالة</th><th className="p-4">إجراءات</th></tr></thead><tbody className="divide-y">{filtered.map(s => (<tr key={s.id} className="hover:bg-gray-50"><td className="p-4 font-bold">{s.name}</td><td className="p-4 text-xs font-mono bg-gray-50 rounded p-2"><div className="flex flex-col gap-1"><span>U: <span className="font-bold select-all">{s.username}</span></span><span>P: <span className="font-bold text-red-500 select-all">{s.password}</span></span></div></td><td className="p-4 flex items-center gap-2"><a href={`tel:${s.phone}`} className="text-gray-900 hover:text-blue-600 transition">{s.phone}</a><button onClick={() => openWhatsApp(s.phone)} className="text-green-600 hover:bg-green-50 p-1 rounded-full"><MessageCircle size={18}/></button></td><td className="p-4">{s.belt}</td><td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td><td className="p-4 flex gap-2"><button onClick={() => promoteBelt(s)} className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition flex items-center gap-1 font-bold" title="ترفيع"><ArrowUp size={16}/> ترفيع</button><button onClick={() => openEditModal(s)} className="text-blue-600 bg-blue-50 p-2 rounded"><Edit size={16}/></button><button onClick={() => archiveStudent(s)} className="text-red-600 bg-red-50 p-2 rounded"><Archive size={16}/></button></td></tr>))}</tbody></table></Card>
        {showModal && <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"><Card className="w-full max-w-2xl" title={editingStudent ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}><form onSubmit={editingStudent ? handleSaveEdit : addStudent} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="md:col-span-2"><label className="block text-xs mb-1">الاسم</label><input required className="w-full border p-2 rounded" value={newS.name} onChange={e=>setNewS({...newS, name:e.target.value})} /></div>{!editingStudent && (<div className="md:col-span-2 bg-blue-50 p-2 rounded border"><label className="block text-xs mb-1">العائلة</label><select className="w-full border p-2 rounded" value={linkFamily} onChange={e => setLinkFamily(e.target.value)}><option value="new">عائلة جديدة</option>{uniqueFamilies.map(([id, name]) => <option key={id} value={id}>{name}</option>)}</select></div>)}<div><label className="block text-xs mb-1">الهاتف</label><input required className="w-full border p-2 rounded" value={newS.phone} onChange={e=>setNewS({...newS, phone:e.target.value})} /></div><div><label className="block text-xs mb-1">الحزام</label><select className="w-full border p-3 rounded-lg bg-white" value={newS.belt} onChange={e=>setNewS({...newS, belt:e.target.value})}>{BELTS.map(b=><option key={b}>{b}</option>)}</select></div><div><label className="block text-xs mb-1 font-bold text-red-600">الرصيد المستحق (JOD)</label><input type="number" className="w-full border p-2 rounded" value={newS.balance} onChange={e=>setNewS({...newS, balance:e.target.value})} /></div><div><label className="block text-xs mb-1">الميلاد</label><input type="date" className="w-full border p-2 rounded" value={newS.dob} onChange={e=>setNewS({...newS, dob:e.target.value})} /></div><div><label className="block text-xs mb-1">الالتحاق</label><input type="date" className="w-full border p-2 rounded" value={newS.joinDate} onChange={e=>setNewS({...newS, joinDate:e.target.value})} /></div><div><label className="block text-xs mb-1 font-bold text-green-600">نهاية الاشتراك</label><input type="date" className="w-full border p-2 rounded bg-green-50" value={newS.subEnd} onChange={e=>setNewS({...newS, subEnd:e.target.value})} /></div><div className="md:col-span-2"><label className="block text-xs mb-1">العنوان</label><input className="w-full border p-2 rounded" value={newS.address} onChange={e=>setNewS({...newS, address:e.target.value})} /></div></div><div className="flex gap-2 justify-end mt-4"><Button variant="ghost" onClick={()=>setShowModal(false)}>إلغاء</Button><Button type="submit">حفظ</Button></div></form></Card></div>}
      </div>
    );
  };

  const AttendanceManager = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterId, setFilterId] = useState(null);
    const [sortOption, setSortOption] = useState('manual'); 
    const changeMonth = (inc) => { const d = new Date(currentDate); d.setMonth(d.getMonth() + inc); setCurrentDate(d); };
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    const sorted = useMemo(() => { let base = [...branchStudents]; if (sortOption === 'name') base.sort((a, b) => a.name.localeCompare(b.name)); else if (sortOption === 'belt') base.sort((a, b) => BELTS.indexOf(b.belt) - BELTS.indexOf(a.belt)); else if (sortOption === 'status') base.sort((a, b) => a.status === 'active' ? -1 : 1); else base.sort((a, b) => (a.customOrder || 0) - (b.customOrder || 0)); return base; }, [branchStudents, sortOption]);
    const displayedStudents = filterId ? sorted.filter(s => s.id === filterId) : sorted;
    const toggleCheck = async (sid, day) => { const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; const student = students.find(s => s.id === sid); const newAtt = { ...(student.attendance || {}) }; if (newAtt[dateStr]) delete newAtt[dateStr]; else newAtt[dateStr] = true; await studentsCollection.update(sid, { attendance: newAtt }); };
    const moveStudent = async (index, direction) => { if (sortOption !== 'manual') return alert("الرجاء اختيار الترتيب اليدوي أولاً"); const otherIndex = direction === 'up' ? index - 1 : index + 1; if (otherIndex < 0 || otherIndex >= displayedStudents.length) return; const currentStudent = displayedStudents[index]; const otherStudent = displayedStudents[otherIndex]; const currentOrder = currentStudent.customOrder || Date.now(); const otherOrder = otherStudent.customOrder || Date.now() + 1; await studentsCollection.update(currentStudent.id, { customOrder: otherOrder }); await studentsCollection.update(otherStudent.id, { customOrder: currentOrder }); };

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm flex-wrap gap-4">
          <div className="flex items-center gap-4"><Button variant="ghost" onClick={()=>changeMonth(-1)}><ChevronRightIcon/></Button><span className="font-bold">{monthNames[month]} {year}</span><Button variant="ghost" onClick={()=>changeMonth(1)}><ChevronLeft/></Button></div>
          <div className="flex gap-2"><button onClick={() => setSortOption('manual')} className={`px-3 py-1 text-xs rounded border ${sortOption==='manual'?'bg-black text-white':''}`}>يدوي (ترتيبي)</button><button onClick={() => setSortOption('name')} className={`px-3 py-1 text-xs rounded border ${sortOption==='name'?'bg-black text-white':''}`}>أبجدي</button><button onClick={() => setSortOption('belt')} className={`px-3 py-1 text-xs rounded border ${sortOption==='belt'?'bg-black text-white':''}`}>حزام</button></div>
          <div className="w-64 relative"><StudentSearch students={branchStudents} onSelect={s => setFilterId(s.id)} onClear={() => setFilterId(null)} placeholder="بحث سريع..." showAllOption={true} /></div>
        </div>
        <Card className="overflow-x-auto"><table className="w-full text-xs border-collapse"><thead className="bg-gray-800 text-white sticky top-0 z-20"><tr><th className="p-3 sticky right-0 bg-gray-800 z-30 text-right">الطالب</th><th className="p-3 text-center">ترتيب</th>{[...Array(daysInMonth)].map((_,i)=><th key={i} className="p-2 border-gray-700 text-center">{i+1}</th>)}</tr></thead><tbody>{displayedStudents.map((s, idx) => (<tr key={s.id} className="hover:bg-yellow-50"><td className="p-3 sticky right-0 bg-white font-bold border-l shadow-sm">{s.name}</td><td className="p-3 text-center border flex flex-col gap-1">{sortOption === 'manual' && <><button onClick={()=>moveStudent(idx, 'up')} className="text-gray-500 hover:text-black">⬆️</button><button onClick={()=>moveStudent(idx, 'down')} className="text-gray-500 hover:text-black">⬇️</button></>}</td>{[...Array(daysInMonth)].map((_,i)=>{const d=i+1;const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const checked=!!s.attendance?.[dateStr];return<td key={i} className="border text-center p-0"><input type="checkbox" checked={checked} onChange={()=>toggleCheck(s.id,d)} className="w-4 h-4 accent-green-600 cursor-pointer"/></td>})}</tr>))}</tbody></table></Card>
      </div>
    );
  };

  const InternalNotesManager = () => {
    const [noteTxt, setNoteTxt] = useState(''); const [noteType, setNoteType] = useState('general'); const [targetId, setTargetId] = useState(''); const [filteredStudent, setFilteredStudent] = useState(null); 
    const addInternalNote = async (e) => { e.preventDefault(); if(!targetId || !noteTxt) return; const student = branchStudents.find(s => s.id === targetId); const newNote = { id: Date.now(), text: noteTxt, type: noteType, date: new Date().toLocaleDateString('ar-JO') }; await studentsCollection.update(targetId, { internalNotes: [...(student.internalNotes || []), newNote] }); setNoteTxt(''); alert("تم حفظ الملاحظة الداخلية بنجاح"); };
    const deleteInternalNote = async (sid, nid) => { if(confirm('حذف؟')) { const student = branchStudents.find(s => s.id === sid); await studentsCollection.update(sid, { internalNotes: student.internalNotes.filter(n => n.id !== nid) }); } };

    return (
      <div className="space-y-6">
         <Card title="تسجيل ملاحظة إدارية (داخلية)"><form onSubmit={addInternalNote} className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-xs font-bold mb-1">الطالب</label><StudentSearch students={branchStudents} onSelect={(s) => setTargetId(s.id)} placeholder="ابحث لاختيار طالب..." /></div><div><label className="block text-xs font-bold mb-1">تصنيف الملاحظة</label><select className="w-full border p-2 rounded" value={noteType} onChange={e=>setNoteType(e.target.value)}><option value="finance">💰 ذمم مالية / حساب</option><option value="behavior">⚠️ سلوك وانضباط</option><option value="exam">🆓 فحص مجاني / منحة</option><option value="general">📝 ملاحظة عامة</option></select></div></div><textarea className="w-full border p-2 rounded" rows="3" placeholder="اكتب تفاصيل الملاحظة هنا (لن تظهر للأهل)..." value={noteTxt} onChange={e=>setNoteTxt(e.target.value)} required></textarea><div className="flex justify-end"><Button type="submit" className="bg-gray-800 text-white hover:bg-gray-700">حفظ في السجل الداخلي</Button></div></form></Card>
         <div className="flex items-center gap-2 mb-4"><div className="w-64"><StudentSearch students={branchStudents} onSelect={(s) => setFilteredStudent(s.id)} onClear={() => setFilteredStudent(null)} placeholder="فلترة الملاحظات حسب الطالب..." showAllOption={true}/></div></div>
         <div className="grid grid-cols-1 gap-4">{branchStudents.filter(s => (filteredStudent ? s.id === filteredStudent : true) && s.internalNotes && s.internalNotes.length > 0).map(s => (<Card key={s.id} title={s.name} className="border-r-4 border-gray-800"><div className="space-y-2">{s.internalNotes.map((note) => (<div key={note.id} className="p-3 rounded border flex justify-between items-start bg-gray-50"><div><span className="font-bold text-xs bg-gray-200 px-1 rounded ml-2">{note.type}</span><span className="text-sm text-gray-700">{note.text}</span></div><button onClick={() => deleteInternalNote(s.id, note.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button></div>))}</div></Card>))}</div>
      </div>
    );
  };

  const FinanceManager = () => {
    const [viewMode, setViewMode] = useState('income'); const [payForm, setPayForm] = useState({ sid: '', amount: '', reason: 'اشتراك شهري', customReason: '', details: '' }); const [expForm, setExpForm] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); const [incomeFilterStudent, setIncomeFilterStudent] = useState(null);
    const handleAddPayment = async (e) => { e.preventDefault(); if(!payForm.studentObjId) return alert('اختر طالباً'); const selectedStudent = branchStudents.find(s => s.id === payForm.studentObjId); if(!selectedStudent) return alert('طالب غير موجود'); const finalReason = payForm.reason === 'أخرى' ? payForm.customReason : payForm.reason; const newPay = { id: Date.now().toString(), studentId: selectedStudent.id, name: selectedStudent.name, amount: Number(payForm.amount), reason: finalReason, details: payForm.details, date: new Date().toISOString().split('T')[0], branch: selectedBranch }; await paymentsCollection.add(newPay); setPayForm({ sid: '', amount: '', reason: 'اشتراك شهري', customReason: '', details: '' }); };
    const handleAddExpense = async (e) => { e.preventDefault(); await expensesCollection.add({ id: Date.now().toString(), title: expForm.title, amount: Number(expForm.amount), date: expForm.date, branch: selectedBranch }); setExpForm({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); };
    const deletePayment = async (id) => { if(confirm('حذف السند؟')) await paymentsCollection.remove(id); };
    const deleteExpense = async (id) => { if(confirm('حذف المصروف؟')) await expensesCollection.remove(id); };
    const filteredPayments = incomeFilterStudent ? branchPayments.filter(p => p.studentId === incomeFilterStudent) : branchPayments;

    return (
      <div className="space-y-6">
        <div className="flex gap-4 mb-6"><button onClick={() => setViewMode('income')} className={`flex-1 py-3 rounded-xl font-bold ${viewMode === 'income' ? 'bg-green-600 text-white' : 'bg-white'}`}>الإيرادات</button><button onClick={() => setViewMode('expense')} className={`flex-1 py-3 rounded-xl font-bold ${viewMode === 'expense' ? 'bg-red-600 text-white' : 'bg-white'}`}>المصاريف</button></div>
        {viewMode === 'income' ? (
          <>
            <Card title="سند قبض جديد"><form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"><div className="relative"><label className="text-xs block mb-1 font-bold text-gray-700">اسم الطالب</label><StudentSearch students={branchStudents} onSelect={(s) => setPayForm({...payForm, sid: s.name, studentObjId: s.id})} placeholder="ابحث..." /></div><div><label className="text-xs block mb-1">المبلغ</label><input type="number" className="w-full border p-2 rounded" value={payForm.amount} onChange={e=>setPayForm({...payForm, amount:e.target.value})} required /></div><div><label className="text-xs block mb-1">السبب</label><select className="w-full border p-2 rounded" value={payForm.reason} onChange={e=>setPayForm({...payForm, reason:e.target.value})}><option>اشتراك شهري</option><option>عرض الاشتراك 3 شهور</option><option>رسوم فحص</option><option>أخرى</option></select></div>{payForm.reason === 'أخرى' && <div><label className="text-xs block mb-1">وضح السبب</label><input className="w-full border p-2 rounded" value={payForm.customReason} onChange={e=>setPayForm({...payForm, customReason:e.target.value})} required /></div>}<div className="md:col-span-2"><label className="text-xs block mb-1">تفاصيل</label><input className="w-full border p-2 rounded" value={payForm.details} onChange={e=>setPayForm({...payForm, details:e.target.value})} /></div><Button type="submit">حفظ وقبض</Button></form></Card>
            <div className="flex items-center gap-2 mb-2 w-64"><StudentSearch students={branchStudents} onSelect={(s) => setIncomeFilterStudent(s.id)} onClear={() => setIncomeFilterStudent(null)} placeholder="فلترة حسب الطالب..." showAllOption={true} /></div>
            <Card><table className="w-full text-sm text-right"><thead className="bg-gray-100"><tr><th className="p-3">#</th><th className="p-3">الطالب</th><th className="p-3">السبب</th><th className="p-3">المبلغ</th><th className="p-3">طباعة</th><th className="p-3">حذف</th></tr></thead><tbody>{filteredPayments.map(p=><tr key={p.id} className="hover:bg-gray-50"><td className="p-3">{p.id.slice(0,8)}</td><td className="p-3 font-bold">{p.name}</td><td className="p-3">{p.reason} <span className="text-xs text-gray-400">{p.details}</span></td><td className="p-3 text-green-600">{p.amount}</td><td className="p-3"><button onClick={()=>printReceipt(p, selectedBranch)}><Printer size={16}/></button></td><td className="p-3"><button onClick={()=>deletePayment(p.id)} className="text-red-500"><Trash2 size={16}/></button></td></tr>)}</tbody></table></Card>
          </>
        ) : (
          <>
            <Card title="تسجيل مصروف"><form onSubmit={handleAddExpense} className="flex gap-4 items-end"><div className="flex-1"><label className="text-xs block mb-1">البند</label><input className="w-full border p-2 rounded" value={expForm.title} onChange={e=>setExpForm({...expForm, title:e.target.value})} required /></div><div className="w-32"><label className="text-xs block mb-1">المبلغ</label><input type="number" className="w-full border p-2 rounded" value={expForm.amount} onChange={e=>setExpForm({...expForm, amount:e.target.value})} required /></div><Button type="submit">حفظ</Button></form></Card>
            <Card><table className="w-full text-sm text-right"><thead><tr><th className="p-3">البند</th><th className="p-3">المبلغ</th><th className="p-3">حذف</th></tr></thead><tbody>{branchExpenses.map(e=><tr key={e.id}><td className="p-3">{e.title}</td><td className="p-3 text-red-600">{e.amount}</td><td className="p-3"><button onClick={()=>deleteExpense(e.id)} className="text-red-500"><Trash2 size={16}/></button></td></tr>)}</tbody></table></Card>
          </>
        )}
      </div>
    );
  };

  const ScheduleManager = () => {
    const [form, setForm] = useState({ level: '', days: '', time: '', branch: '' });
    const addClass = async (e) => { e.preventDefault(); await scheduleCollection.add({ ...form }); setForm({ level: '', days: '', time: '', branch: '' }); };
    const deleteClass = async (id) => { if (confirm('حذف؟')) await scheduleCollection.remove(id); };
    return (
      <div className="space-y-6">
        <Card title="إضافة حصة"><form onSubmit={addClass} className="grid grid-cols-2 gap-4 items-end"><div><label className="text-xs block mb-1">المستوى</label><input className="w-full border p-2 rounded" value={form.level} onChange={e=>setForm({...form, level:e.target.value})} required /></div><div><label className="text-xs block mb-1">الأيام</label><input className="w-full border p-2 rounded" value={form.days} onChange={e=>setForm({...form, days:e.target.value})} required /></div><div><label className="text-xs block mb-1">الوقت</label><input className="w-full border p-2 rounded" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} required /></div><div><label className="text-xs block mb-1">الفرع</label><input className="w-full border p-2 rounded" value={form.branch} onChange={e=>setForm({...form, branch:e.target.value})} required /></div><Button type="submit">إضافة</Button></form></Card>
        <div className="grid md:grid-cols-2 gap-4">{schedule.map(c=><div key={c.id} className="bg-white p-4 rounded border flex justify-between"><div><h4 className="font-bold">{c.level}</h4><p className="text-xs text-gray-500">{c.days} | {c.time}</p></div><button onClick={()=>deleteClass(c.id)} className="text-red-500"><Trash2 size={16}/></button></div>)}</div>
      </div>
    );
  };

  const NotesManager = () => {
    const [noteTxt, setNoteTxt] = useState(''); const [selectedTargets, setSelectedTargets] = useState([]); const [selectAll, setSelectAll] = useState(false);
    const toggleSelectAll = () => { if (selectAll) setSelectedTargets([]); else setSelectedTargets(branchStudents.map(s => s.id)); setSelectAll(!selectAll); };
    const toggleTarget = (id) => { if (selectedTargets.includes(id)) setSelectedTargets(selectedTargets.filter(t => t !== id)); else setSelectedTargets([...selectedTargets, id]); };
    const sendNotes = async () => { if(selectedTargets.length === 0 || !noteTxt) return alert("اختر طلاباً"); const newNote = { id: Date.now(), text: noteTxt, date: new Date().toLocaleDateString('ar-JO') }; for (const sid of selectedTargets) { const student = students.find(s => s.id === sid); await studentsCollection.update(sid, { notes: [...(student.notes || []), newNote] }); } setNoteTxt(''); setSelectedTargets([]); setSelectAll(false); alert("تم الإرسال"); };
    const deleteNote = async (sid, nid) => { if(confirm('حذف؟')) { const student = students.find(s => s.id === sid); await studentsCollection.update(sid, { notes: student.notes.filter(n => n.id !== nid) }); } };

    return (
      <div className="space-y-6">
        <div className="flex gap-4 h-[300px]"><div className="w-1/3 bg-white rounded border flex flex-col"><div className="p-2 border-b flex justify-between"><span className="font-bold">تحديد</span><button onClick={toggleSelectAll} className="text-xs text-blue-600">{selectAll ? 'إلغاء' : 'الكل'}</button></div><div className="overflow-y-auto p-2">{branchStudents.map(s=><div key={s.id} onClick={()=>toggleTarget(s.id)} className={`p-2 cursor-pointer flex justify-between ${selectedTargets.includes(s.id)?'bg-yellow-100':''}`}><span>{s.name}</span>{selectedTargets.includes(s.id)&&<CheckCircle size={14}/>}</div>)}</div></div><div className="flex-1 flex flex-col gap-4"><Card className="flex-1 flex flex-col"><textarea className="flex-1 w-full border p-2 rounded" value={noteTxt} onChange={e=>setNoteTxt(e.target.value)} placeholder="نص الملاحظة..."></textarea><Button onClick={sendNotes} className="mt-2">إرسال</Button></Card></div></div>
        <div className="grid gap-4">{branchStudents.filter(s=>s.notes && s.notes.length>0).map(s=><Card key={s.id} title={s.name}>{s.notes.map(n=><div key={n.id} className="flex justify-between border-b p-2 last:border-0"><span>{n.text}</span><button onClick={()=>deleteNote(s.id,n.id)} className="text-red-500"><Trash2 size={14}/></button></div>)}</Card>)}</div>
      </div>
    );
  };

  const SubsManager = () => {
    const [quickRenewId, setQuickRenewId] = useState(''); const [filterId, setFilterId] = useState('');
    const updateSub = async (id, date) => { await studentsCollection.update(id, { subEnd: date }); };
    const displayedStudents = filterId ? branchStudents.filter(s => s.id === filterId) : branchStudents;

    return (
      <div className="space-y-4">
        <Card>
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-6 flex gap-4 items-end"><div className="flex-1"><label className="block text-xs font-bold mb-1">تجديد سريع لطالب</label><StudentSearch students={branchStudents} onSelect={(s) => setQuickRenewId(s.id)} placeholder="ابحث عن طالب لتجديد اشتراكه..." /></div><Button onClick={() => { if(!quickRenewId) return; const date = prompt("تاريخ الانتهاء الجديد (YYYY-MM-DD):", new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]); if(date) updateSub(quickRenewId, date); }}>تجديد الاشتراك</Button></div>
          <div className="mb-4 w-64"><label className="block text-xs font-bold mb-1">فلترة الجدول</label><StudentSearch students={branchStudents} onSelect={(s) => setFilterId(s.id)} onClear={() => setFilterId(null)} placeholder="بحث في القائمة..." showAllOption={true} /></div>
          <table className="w-full text-sm text-right"><thead className="bg-gray-50"><tr><th className="p-3">الطالب</th><th className="p-3">الانتهاء</th><th className="p-3">الحالة</th><th className="p-3">تجديد</th></tr></thead><tbody>{displayedStudents.map(s=><tr key={s.id} className="border-b"><td className="p-3 font-bold">{s.name}</td><td className="p-3">{s.subEnd}</td><td className="p-3"><StatusBadge status={calculateStatus(s.subEnd)}/></td><td className="p-3"><input type="date" className="border rounded text-xs" onChange={(e)=>updateSub(s.id, e.target.value)}/></td></tr>)}</tbody></table>
        </Card>
      </div>
    );
  };

  const ArchiveManager = () => {
    const [selectedStudent, setSelectedStudent] = useState(null); const [editingArchived, setEditingArchived] = useState(null); const [formData, setFormData] = useState({});
    const openEditArchived = (student) => { setEditingArchived(student); setFormData({ name: student.name, phone: student.phone, belt: student.belt, address: student.address || '' }); };
    const saveArchivedEdit = async (e) => { e.preventDefault(); await archiveCollection.update(editingArchived.id, formData); setEditingArchived(null); };
    const studentPayments = selectedStudent ? payments.filter(p => p.studentId === selectedStudent.id) : []; const studentNotes = selectedStudent ? selectedStudent.internalNotes || [] : [];

    return (
      <div className="space-y-6">
        {selectedStudent && (<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"><Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto" title={`الملف الشامل: ${selectedStudent.name}`}><div className="grid md:grid-cols-2 gap-6"><div><h4 className="font-bold border-b pb-2 mb-2 text-red-600">الملاحظات الإدارية</h4>{studentNotes.length > 0 ? (<ul className="space-y-2 text-sm">{studentNotes.map(n => <li key={n.id} className="bg-red-50 p-2 rounded border border-red-100">{n.text} <span className="text-xs text-gray-400 block">{n.date}</span></li>)}</ul>) : <p className="text-gray-400 text-sm">لا توجد ملاحظات مسجلة.</p>}</div><div><h4 className="font-bold border-b pb-2 mb-2 text-green-600">السجل المالي</h4>{studentPayments.length > 0 ? (<div className="space-y-2 text-sm max-h-60 overflow-y-auto">{studentPayments.map(p => <div key={p.id} className="flex justify-between bg-green-50 p-2 rounded border border-green-100"><span>{p.reason}</span><span className="font-bold">{p.amount} JOD</span></div>)}</div>) : <p className="text-gray-400 text-sm">لا توجد دفعات مسجلة.</p>}</div></div><div className="mt-6 flex justify-end"><Button onClick={() => setSelectedStudent(null)}>إغلاق</Button></div></Card></div>)}
        {editingArchived && (<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4"><Card className="w-full max-w-lg" title="تعديل بيانات الأرشيف"><form onSubmit={saveArchivedEdit} className="space-y-4"><div><label className="text-xs block mb-1">الاسم</label><input className="w-full border p-2 rounded" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} /></div><div><label className="text-xs block mb-1">الهاتف</label><input className="w-full border p-2 rounded" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} /></div><div><label className="text-xs block mb-1">العنوان</label><input className="w-full border p-2 rounded" value={formData.address} onChange={e=>setFormData({...formData, address:e.target.value})} /></div><div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditingArchived(null)}>إلغاء</Button><Button type="submit">حفظ التعديلات</Button></div></form></Card></div>)}
        <Card title="سجل الأرشيف">{archivedStudents.length === 0 ? <p className="text-center py-8 text-gray-400">الأرشيف فارغ</p> : <table className="w-full text-right text-sm"><thead className="bg-gray-50"><tr><th className="p-3">الاسم</th><th className="p-3">تاريخ الأرشفة</th><th className="p-3">خيارات</th></tr></thead><tbody className="divide-y">{archivedStudents.map(s => (<tr key={s.id} className="hover:bg-gray-50"><td className="p-3">{s.name}</td><td className="p-3 text-gray-500">{s.archiveDate}</td><td className="p-3 flex gap-2"><Button variant="outline" className="py-1 px-2 text-xs" onClick={() => setSelectedStudent(s)}><FileSearch size={14} className="ml-1"/> الملف المالي</Button><button onClick={() => openEditArchived(s)} className="bg-blue-50 text-blue-600 p-1 rounded border border-blue-200" title="تعديل بيانات"><Edit size={14}/></button><button onClick={async () => { await studentsCollection.add(s); await archiveCollection.remove(s.id); }} className="bg-green-50 text-green-600 p-1 rounded border border-green-200" title="استعادة"><ArrowRight size={14}/></button></td></tr>))}</tbody></table>}</Card>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-right font-sans" dir="rtl">
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-black text-gray-300 transition-all duration-300 flex flex-col sticky top-0 h-screen shadow-2xl z-40`}>
        <div className="p-6 flex justify-between border-b border-gray-800">{sidebarOpen && <h2 className="font-black text-yellow-500 text-xl">لوحة التحكم</h2>}<button onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={20}/></button></div>
        <nav className="flex-1 overflow-y-auto py-6 space-y-2 px-3 custom-scrollbar">
          {[
            {id:'dashboard',icon:Activity,label:'نظرة عامة'},
            {id:'registrations',icon:Inbox,label:'طلبات التسجيل', badge: branchRegistrations.length}, // New Item
            {id:'schedule',icon:Clock,label:'إدارة الجدول'},
            {id:'students',icon:Users,label:'إدارة الطلاب'},
            {id:'subs',icon:Calendar,label:'الاشتراكات'},
            {id:'attendance',icon:CheckCircle,label:'الحضور'},
            {id:'payments',icon:DollarSign,label:'المالية'},
            {id:'notes',icon:MessageCircle,label:'مراسلات الأهل'},
            {id:'internal_notes',icon:ClipboardList,label:'سجل المتابعة'},
            {id:'archive',icon:Archive,label:'الأرشيف'}
          ].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-yellow-500 text-black font-bold' : 'hover:bg-gray-800'}`}>
              <div className="relative"><item.icon size={22} />{item.badge > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{item.badge}</span>}</div>{sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800"><button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-900/10 rounded-xl"><LogOut size={20} />{sidebarOpen && <span>خروج</span>}</button></div>
      </aside>
      <main className="flex-1 p-6 md:p-10 overflow-y-auto w-full">
         {activeTab === 'dashboard' && <DashboardStats />}
         {activeTab === 'registrations' && <RegistrationManager />}
         {activeTab === 'schedule' && <ScheduleManager />}
         {activeTab === 'students' && <StudentsManager />}
         {activeTab === 'attendance' && <AttendanceManager />}
         {activeTab === 'payments' && <FinanceManager />}
         {activeTab === 'notes' && <NotesManager />}
         {activeTab === 'internal_notes' && <InternalNotesManager />}
         {activeTab === 'subs' && <SubsManager />}
         {activeTab === 'archive' && <ArchiveManager />}
      </main>
    </div>
  );
};

// --- Root Component ---
export default function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(() => { const saved = localStorage.getItem('braveUser'); return saved ? JSON.parse(saved) : null; });
  
  useEffect(() => { if (user) { if (user.role === 'admin') setView('admin_dashboard'); else setView('student_portal'); } }, []);

  const studentsCollection = useCollection('students', true); 
  const paymentsCollection = useCollection('payments', true);
  const expensesCollection = useCollection('expenses', true);
  const scheduleCollection = useCollection('schedule', true);
  const archiveCollection = useCollection('archive', true);
  const registrationsCollection = useCollection('registrations', true); // New Collection

  const handleLogin = (username, password) => {
    if (username.startsWith('admin') && password === '123') {
      const userData = { role: 'admin', name: 'المدير العام', username, branch: username === 'admin1' ? BRANCHES.SHAFA : BRANCHES.ABU_NSEIR };
      setUser(userData);
      localStorage.setItem('braveUser', JSON.stringify(userData));
      setView('admin_dashboard');
    } else {
      const studentUser = studentsCollection.data.find(s => s.username === username && s.password === password);
      if (studentUser) {
        const userData = { role: 'student', familyId: studentUser.familyId, name: studentUser.familyName, id: studentUser.id };
        setUser(userData);
        localStorage.setItem('braveUser', JSON.stringify(userData));
        setView('student_portal');
      } else {
        alert('بيانات خاطئة! جرب admin1/123');
      }
    }
  };

  const handleLogout = () => { setUser(null); localStorage.removeItem('braveUser'); setView('home'); };

  useEffect(() => { signInAnonymously(auth); }, []);

  if (studentsCollection.loading) return <div>Loading...</div>;

  return (
    <>
      {view === 'home' && <HomeView setView={setView} schedule={scheduleCollection.data} registrationsCollection={registrationsCollection} />}
      {view === 'login' && <LoginView setView={setView} handleLogin={handleLogin} />}
      {view === 'student_portal' && user && <StudentPortal user={user} students={studentsCollection.data} schedule={scheduleCollection.data} payments={paymentsCollection.data} handleLogout={handleLogout} />}
      {view === 'admin_dashboard' && user && (
        <AdminDashboard 
          user={user} selectedBranch={user.branch} 
          studentsCollection={studentsCollection} paymentsCollection={paymentsCollection} expensesCollection={expensesCollection} scheduleCollection={scheduleCollection} archiveCollection={archiveCollection} registrationsCollection={registrationsCollection}
          handleLogout={handleLogout}
        />
      )}
    </>
  );
}
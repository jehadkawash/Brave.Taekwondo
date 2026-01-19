// src/views/HomeView.jsx
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Menu, X, MapPin, Phone, Clock, Calendar, Activity, Trophy, Shield, Users, MessageCircle, Megaphone, ChevronRight, ChevronLeft, Navigation, Play, Star, CheckCircle } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { IMAGES, BRANCHES, INITIAL_SCHEDULE } from '../lib/constants';
import { useCollection } from '../hooks/useCollection'; 
import { collection, addDoc } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';

// --- المكتبات ---
import { motion, AnimatePresence } from 'framer-motion';

// ✅ التحميل الكسول لمكتبة 3D
const Spline = lazy(() => import('@splinetool/react-spline'));

const HomeView = ({ setView, schedule }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '', dob: '', address: '', branch: BRANCHES.SHAFA });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // --- Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- News Logic ---
  const { data: newsItems } = useCollection('news');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    if (!newsItems || newsItems.length === 0) return;
    const interval = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 6000); 
    return () => clearInterval(interval);
  }, [newsItems]);

  const formatDate = (dateInput) => {
    if (!dateInput) return '';
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return dateInput;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'registrations'), {
        ...regForm,
        dob: formatDate(regForm.dob),
        date: formatDate(new Date()),
        status: 'new',
        createdAt: new Date().toISOString()
      });
      alert("تم إرسال طلب التسجيل بنجاح! سنتواصل معك قريباً.");
      setShowRegModal(false);
      setRegForm({ name: '', phone: '', dob: '', address: '', branch: BRANCHES.SHAFA });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("حدث خطأ أثناء الإرسال.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLocation = (url) => window.open(url, '_blank');
  const openWhatsApp = () => window.open('https://wa.me/962795629606', '_blank');

  // --- Animations Variants ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen font-sans text-right relative bg-gray-50 overflow-x-hidden selection:bg-yellow-500 selection:text-black" dir="rtl">
      
      {/* --- Navbar --- */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="relative">
                <img src={IMAGES.LOGO} alt="Logo" className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm p-1 object-contain border border-white/20 transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none text-white tracking-tight group-hover:text-yellow-400 transition-colors">أكاديمية الشجاع</h1>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase font-bold">Brave Taekwondo</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 items-center bg-white/5 backdrop-blur-md px-2 py-1.5 rounded-full border border-white/10">
            {['الرئيسية', 'من نحن', 'جدول الحصص', 'الفروع'].map((item) => (
              <button key={item} className="px-6 py-2 rounded-full text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all relative overflow-hidden group" onClick={() => {
                if (item === 'جدول الحصص') document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'});
                if (item === 'الفروع') document.getElementById('branches')?.scrollIntoView({behavior: 'smooth'});
                if (item === 'الرئيسية') window.scrollTo(0,0);
              }}>
                <span className="relative z-10">{item}</span>
              </button>
            ))}
          </nav>

          <div className="flex gap-3">
            <Button onClick={() => setView('login')} className="bg-yellow-500 text-black hover:bg-yellow-400 font-black px-6 rounded-full border-none hidden md:block hover:shadow-[0_0_20px_rgba(234,179,8,0.6)] transition-all">بوابة الأعضاء</Button>
            <button className="md:hidden p-2 text-white bg-white/10 rounded-full backdrop-blur-md" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="md:hidden bg-black/95 backdrop-blur-xl border-t border-gray-800 overflow-hidden"
             >
               <div className="p-6 flex flex-col gap-4">
                 {['الرئيسية', 'من نحن', 'جدول الحصص', 'الفروع'].map((item) => (
                    <button key={item} className="text-right text-lg font-bold text-gray-300 hover:text-yellow-500 border-b border-gray-800 pb-2">{item}</button>
                 ))}
                 <Button onClick={() => { setMobileMenuOpen(false); setView('login'); }} className="w-full py-4 bg-yellow-500 text-black font-black rounded-xl mt-2">بوابة الأعضاء</Button>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* --- Hero Section --- */}
      <div className="relative min-h-[100vh] flex items-center overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-600/10 via-gray-900 to-black z-0"></div>
        
        {/* 3D Scene / Image */}
        <div className="absolute inset-0 z-10 opacity-60 md:opacity-100 pointer-events-none md:pointer-events-auto">
           <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-yellow-600/30 font-black text-4xl animate-pulse">BRAVE TKD...</div>}>
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <motion.img 
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 20, ease: "linear" }}
                src={IMAGES.HERO_BG} 
                alt="Hero" 
                className="w-full h-full object-cover" 
              />
           </Suspense>
        </div>

        <div className="container mx-auto px-6 relative z-20 pt-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full mb-8">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-gray-300 text-xs font-bold tracking-widest uppercase">التسجيل لموسم 2026 مفتوح</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-6xl md:text-9xl font-black mb-6 leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
              اصنع <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500">مجدك</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg md:text-2xl mb-10 font-medium leading-relaxed max-w-xl border-r-4 border-yellow-500 pr-6 pl-10 bg-gradient-to-l from-black/60 to-transparent py-4 rounded-l-2xl backdrop-blur-sm">
              نحن لا نعلمك القتال فقط، نحن نبني شخصية القائد بداخلك. انضم لنخبة أبطال الأردن.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
              <Button onClick={() => setShowRegModal(true)} className="px-12 py-5 text-xl bg-yellow-500 text-black font-black hover:bg-yellow-400 rounded-2xl shadow-[0_0_40px_rgba(234,179,8,0.4)] hover:shadow-[0_0_60px_rgba(234,179,8,0.6)] transition-all transform hover:-translate-y-1 flex items-center gap-3">
                سجل الآن مجاناً <ChevronLeft strokeWidth={3} />
              </Button>
              <button onClick={() => document.getElementById('branches')?.scrollIntoView({behavior: 'smooth'})} className="px-8 py-5 text-lg text-white font-bold border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-2xl transition-all">
                اكتشف الفروع
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* --- News Ticker --- */}
      {newsItems && newsItems.length > 0 && (
        <section className="relative z-30 -mt-20 px-4 md:px-0">
           <div className="container mx-auto">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row h-auto md:h-[180px]"
              >
                  <div className="bg-yellow-500 p-6 flex flex-col justify-center items-center md:w-[220px] shrink-0 text-black text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/5"></div>
                      <Megaphone size={36} className="mb-2 relative z-10"/>
                      <span className="font-black text-xl relative z-10">آخر الأخبار</span>
                  </div>
                  <div className="flex-1 relative bg-white p-6 md:p-0 flex items-center">
                      <AnimatePresence mode='wait'>
                        <motion.div 
                          key={currentNewsIndex}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="w-full px-8 flex flex-col md:flex-row items-center gap-6"
                        >
                            <span className="text-xs font-black bg-black text-white px-4 py-2 rounded-xl shadow-lg shadow-black/20 shrink-0">{newsItems[currentNewsIndex].branch}</span>
                            <div className="flex-1 text-center md:text-right border-r-2 border-gray-100 pr-6 mr-2">
                                <h3 className="font-black text-2xl text-gray-900 mb-2">{newsItems[currentNewsIndex].title}</h3>
                                <p className="text-gray-500 text-base line-clamp-1 font-medium">{newsItems[currentNewsIndex].desc}</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><ChevronRight/></button>
                                <button onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)} className="p-3 hover:bg-gray-100 rounded-full transition-colors"><ChevronLeft/></button>
                            </div>
                        </motion.div>
                      </AnimatePresence>
                  </div>
              </motion.div>
           </div>
        </section>
      )}

      {/* --- Why Choose Us (Textured Background) --- */}
      <section className="py-32 bg-gray-50 relative">
         <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")'}}></div>
         <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
                <span className="text-yellow-600 font-bold tracking-widest text-sm uppercase bg-yellow-100/50 px-6 py-3 rounded-full border border-yellow-200">لماذا أكاديمية الشجاع؟</span>
                <h2 className="text-5xl md:text-6xl font-black text-gray-900 mt-8 mb-6 tracking-tight">نصنع <span className="relative inline-block text-yellow-500">الأبطال<span className="absolute bottom-1 left-0 w-full h-3 bg-yellow-200/50 -z-10 rounded-full"></span></span> باحترافية</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                  {icon: Trophy, title: "منهج عالمي", text: "تدريب معتمد دولياً يركز على المهارات الفنية والتكتيكية الحديثة."},
                  {icon: Users, title: "نخبة المدربين", text: "فريق من أبطال المنتخب الوطني السابقين بخبرات تدريبية عالية."},
                  {icon: Shield, title: "أمان وتربية", text: "بيئة آمنة تعزز القيم الأخلاقية، الانضباط، والثقة بالنفس."}
                ].map((item, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.2 }}
                     className="group p-10 rounded-[2.5rem] bg-white hover:bg-black transition-all duration-500 cursor-default border border-gray-100 hover:border-black hover:shadow-2xl hover:-translate-y-2"
                   >
                       <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center text-black mb-8 shadow-inner group-hover:bg-yellow-500 transition-colors">
                           <item.icon size={36} strokeWidth={1.5}/>
                       </div>
                       <h3 className="text-2xl font-black text-gray-900 group-hover:text-white mb-4 transition-colors">{item.title}</h3>
                       <p className="text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed font-medium">{item.text}</p>
                   </motion.div>
                ))}
            </div>
         </div>
      </section>

      {/* --- Schedule (Large Cards & Dark Theme) --- */}
      <section id="schedule" className="py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-900/10 via-black to-black opacity-50"></div>
        <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
        
        <div className="container mx-auto px-6 relative z-10">
           <motion.div 
             initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
             className="flex flex-col items-center mb-20 text-center"
           >
             <h2 className="text-5xl md:text-7xl font-black mb-6 text-white tracking-tight">جدول الحصص</h2>
             <p className="text-gray-400 text-xl max-w-2xl">اختر الوقت المناسب وانطلق في رحلة التدريب</p>
           </motion.div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {(schedule && schedule.length > 0 ? schedule : INITIAL_SCHEDULE).map((cls, idx) => (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 key={cls.id} 
                 className="relative group bg-gray-900/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/5 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(234,179,8,0.1)] hover:-translate-y-3 overflow-hidden"
               >
                 {/* Card Background Gradient */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="relative z-10">
                    <div className="flex justify-between items-start mb-10">
                       <div className="w-16 h-16 rounded-3xl bg-gray-800 flex items-center justify-center text-white group-hover:bg-yellow-500 group-hover:text-black transition-all shadow-lg">
                          <Clock size={32}/>
                       </div>
                       <span className="text-sm font-black text-gray-300 bg-white/10 px-4 py-2 rounded-xl border border-white/5">{cls.branch}</span>
                    </div>
                    
                    <h4 className="text-3xl font-black text-white mb-6 leading-tight group-hover:text-yellow-400 transition-colors">{cls.level}</h4>
                    
                    <div className="space-y-4 border-t border-white/10 pt-6">
                       <div className="flex items-center gap-4 text-gray-400">
                          <div className="p-2 bg-white/5 rounded-lg"><Calendar size={20} className="text-yellow-500"/></div>
                          <span className="text-lg font-medium">{cls.days}</span>
                       </div>
                       <div className="flex items-center gap-4 text-white">
                          <div className="p-2 bg-white/5 rounded-lg"><Activity size={20} className="text-green-400"/></div>
                          <span className="text-xl font-bold tracking-wide">{cls.time}</span>
                       </div>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* --- Branches (Black Theme with Huge Images) --- */}
      <section id="branches" className="py-32 bg-black text-white relative">
        <div className="container mx-auto px-6">
           <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div>
                 <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase mb-4 block">مواقعنا</span>
                 <h2 className="text-6xl font-black text-white">فروع الأكاديمية</h2>
              </div>
              <Button onClick={() => window.open('https://wa.me/962795629606', '_blank')} className="bg-white text-black hover:bg-yellow-500 border-none font-bold rounded-full px-10 py-4 text-lg transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]">تواصل معنا</Button>
           </div>

           <div className="grid md:grid-cols-2 gap-10">
              {[
                { name: 'شفا بدران', sub: 'الفرع الرئيسي', img: IMAGES.BRANCH_SHAFA, loc: 'https://maps.app.goo.gl/mTqvZD4Ftor3NALJ8?g_st=ic', phone: '0795629606' },
                { name: 'أبو نصير', sub: 'الفرع الثاني', img: IMAGES.BRANCH_ABU_NSEIR, loc: 'https://maps.app.goo.gl/yqu6tWBiqrRWGCMJ8?g_st=ic', phone: '0790368603' }
              ].map((branch, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="relative h-[600px] rounded-[3rem] overflow-hidden group cursor-pointer border border-white/10 shadow-2xl"
                >
                   <img src={branch.img} alt={branch.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                   
                   <div className="absolute bottom-0 left-0 right-0 p-12">
                      <div className="bg-yellow-500 text-black text-xs font-black px-4 py-2 rounded-full inline-block mb-6 shadow-lg">{branch.sub}</div>
                      <h3 className="text-6xl font-black mb-4">{branch.name}</h3>
                      
                      <div className="flex gap-4 mt-8 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                         <button onClick={() => openLocation(branch.loc)} className="flex-1 bg-white text-black py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors"><Navigation size={20}/> الموقع</button>
                         <button onClick={() => window.open(`tel:${branch.phone}`)} className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-colors border border-white/20"><Phone size={24}/></button>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
         <div className="container mx-auto px-6 text-center">
            <div className="mb-10">
               <img src={IMAGES.LOGO} alt="Logo" className="w-20 h-20 mx-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110" />
            </div>
            <p className="text-gray-500 text-sm font-medium tracking-wide">© 2024 أكاديمية الشجاع للتايكواندو. جميع الحقوق محفوظة.</p>
         </div>
      </footer>

      {/* --- Floating WhatsApp --- */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openWhatsApp}
        className="fixed bottom-8 right-8 z-40 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] flex items-center justify-center group border-4 border-white/10 backdrop-blur-sm"
      >
        <MessageCircle size={32} className="relative z-10" />
        <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:animate-ping"></div>
      </motion.button>

      {/* --- Registration Modal (Clean Design) --- */}
      <AnimatePresence>
        {showRegModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
            onClick={() => setShowRegModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-yellow-500 p-8 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-3xl font-black text-black relative z-10">طلب تسجيل جديد</h3>
                 <p className="text-black/70 text-sm font-bold mt-2 relative z-10">انضم لعائلة الأبطال وابدأ رحلتك</p>
              </div>
              
              <form onSubmit={handleRegister} className="p-8 space-y-6">
                  {[
                    { label: 'اسم الطالب الرباعي', type: 'text', key: 'name', ph: 'الاسم الكامل' },
                    { label: 'رقم ولي الأمر', type: 'text', key: 'phone', ph: '079xxxxxxx' },
                    { label: 'العنوان', type: 'text', key: 'address', ph: 'المنطقة - الشارع' }
                  ].map((field) => (
                    <div key={field.key}>
                       <label className="block text-xs font-bold text-gray-500 mb-2">{field.label}</label>
                       <input 
                         required 
                         type={field.type}
                         className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:bg-white focus:border-yellow-500 outline-none transition-colors font-bold text-gray-800"
                         placeholder={field.ph}
                         value={regForm[field.key]}
                         onChange={e=>setRegForm({...regForm, [field.key]:e.target.value})}
                       />
                    </div>
                  ))}
                  
                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-2">تاريخ الميلاد</label>
                     <input type="date" required className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl p-4 focus:bg-white focus:border-yellow-500 outline-none font-bold text-gray-800" value={regForm.dob} onChange={e=>setRegForm({...regForm, dob:e.target.value})}/>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-gray-500 mb-2">الفرع المطلوب</label>
                     <div className="grid grid-cols-2 gap-4">
                        {[BRANCHES.SHAFA, BRANCHES.ABU_NSEIR].map((br) => (
                           <button 
                             key={br} 
                             type="button" 
                             onClick={() => setRegForm({...regForm, branch: br})}
                             className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${regForm.branch === br ? 'border-yellow-500 bg-yellow-50 text-black' : 'border-gray-100 text-gray-400 hover:border-gray-300'}`}
                           >
                             {br}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button type="button" onClick={()=>setShowRegModal(false)} className="flex-1 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">إلغاء</button>
                    <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 rounded-2xl font-bold bg-black text-white hover:bg-gray-800 transition-colors shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        {isSubmitting ? 'جاري الإرسال...' : 'تأكيد التسجيل'}
                    </button>
                  </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeView;
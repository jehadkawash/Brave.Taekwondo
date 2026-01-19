// src/views/HomeView.jsx
import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, Clock, Calendar, Activity, Trophy, Shield, Users, MessageCircle, Megaphone, ChevronRight, ChevronLeft, Navigation, Play } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { IMAGES, BRANCHES, INITIAL_SCHEDULE } from '../lib/constants';
import { useCollection } from '../hooks/useCollection'; 
import { collection, addDoc } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';

// --- استيراد مكاتب الأنيميشن والـ 3D ---
import { motion, AnimatePresence } from 'framer-motion';
import Spline from '@splinetool/react-spline';

const HomeView = ({ setView, schedule }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '', dob: '', address: '', branch: BRANCHES.SHAFA });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- منطق شريط الأخبار ---
  const { data: newsItems } = useCollection('news');
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  useEffect(() => {
    if (!newsItems || newsItems.length === 0) return;
    const interval = setInterval(() => {
        setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length);
    }, 8000); 
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

  // --- إعدادات الحركات (Animation Variants) ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen font-sans text-right relative bg-white overflow-x-hidden" dir="rtl">
      
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/90 backdrop-blur-md text-white shadow-2xl sticky top-0 z-50 border-b border-yellow-500/30"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="relative">
                <img src={IMAGES.LOGO} alt="Logo" className="w-12 h-12 rounded-full bg-white p-1 object-contain" />
                <div className="absolute inset-0 rounded-full border-2 border-yellow-500 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-none text-yellow-500">أكاديمية الشجاع</h1>
              <p className="text-[10px] text-gray-400 tracking-wider uppercase font-bold">Brave Taekwondo</p>
            </div>
          </div>
          <nav className="hidden md:flex gap-8 font-bold text-sm">
            {['الرئيسية', 'من نحن', 'جدول الحصص', 'الفروع'].map((item) => (
              <button key={item} className="hover:text-yellow-500 transition-colors duration-300 relative group" onClick={() => {
                if (item === 'جدول الحصص') document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'});
                if (item === 'الفروع') document.getElementById('branches')?.scrollIntoView({behavior: 'smooth'});
                if (item === 'الرئيسية') window.scrollTo(0,0);
              }}>
                {item}
                <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-yellow-500 transition-all group-hover:w-full"></span>
              </button>
            ))}
          </nav>
          <div className="flex gap-2">
            <Button onClick={() => setView('login')} className="bg-yellow-500 text-black hover:bg-yellow-400 font-black px-6 border-none hidden md:block transform hover:-translate-y-1 transition-transform shadow-[0_0_15px_rgba(234,179,8,0.4)]">بوابة الأعضاء</Button>
            <button className="md:hidden p-2 text-yellow-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
               className="md:hidden bg-gray-900 border-t border-gray-800 overflow-hidden"
             >
               <div className="p-4 flex flex-col gap-4">
                 <Button onClick={() => { setMobileMenuOpen(false); setView('login'); }} className="w-full py-3 bg-yellow-500 text-black font-bold">بوابة الأعضاء</Button>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section with 3D or Animated Background */}
      <div className="relative bg-gray-900 text-white h-[650px] flex items-center overflow-hidden">
        
        {/* الخلفية: يمكنك اختيار إما صورة عادية أو مشهد 3D */}
        
        {/* خيار 1: صورة مع تأثير Parallax بسيط (مفعل حالياً) */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "linear" }}
        >
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
           <img src={IMAGES.HERO_BG} alt="Hero" className="w-full h-full object-cover opacity-60" />
        </motion.div>

        {/* خيار 2: مشهد 3D (إلغاء التعليق لتفعيله إذا كان لديك رابط Spline) */}
        {/* <div className="absolute inset-0 z-0 hidden md:block">
           <Spline scene="https://prod.spline.design/YOUR_SCENE_URL/scene.splinecode" />
        </div> 
        */}
        
        <div className="container mx-auto px-6 relative z-20 pt-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start max-w-2xl"
          >
            <motion.div variants={fadeInUp} className="inline-block bg-yellow-500 text-black font-black px-4 py-1 skew-x-[-10deg] mb-6 shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                <span className="block skew-x-[10deg] text-sm tracking-wider uppercase">Future Champions</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-6xl md:text-8xl font-black mb-6 leading-tight drop-shadow-2xl">
              اصنع <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">قوتك</span><br/>
              ابنِ مستقبلك
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-gray-300 text-lg md:text-xl mb-8 font-medium leading-relaxed border-r-4 border-yellow-500 pr-4">
              انضم إلى نخبة أبطال الأردن في التايكوندو. تدريب احترافي، بيئة آمنة، ومستقبل واعد بانتظارك.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex gap-4">
              <Button onClick={() => setShowRegModal(true)} className="px-10 py-4 text-xl bg-yellow-500 text-black font-black hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(234,179,8,0.4)] border-none rounded-xl flex items-center gap-2">
                ابدأ رحلتك <ChevronLeft className="mr-1" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-10 hidden md:block text-yellow-500/20"
        >
           <Trophy size={180} />
        </motion.div>
      </div>

      {/* News Section (Animated Slider) */}
      {newsItems && newsItems.length > 0 && (
        <section className="relative -mt-24 z-30 mb-24">
           <div className="container mx-auto px-6">
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-6xl mx-auto h-[500px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row group hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-shadow duration-500"
              >
                  <AnimatePresence mode='wait'>
                    <motion.div 
                      key={currentNewsIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex flex-col md:flex-row"
                    >
                        <div className="w-full md:w-3/5 h-1/2 md:h-full relative overflow-hidden">
                           {newsItems[currentNewsIndex].image ? (
                               <motion.img 
                                 initial={{ scale: 1.1 }}
                                 animate={{ scale: 1 }}
                                 transition={{ duration: 10 }}
                                 src={newsItems[currentNewsIndex].image} 
                                 alt={newsItems[currentNewsIndex].title} 
                                 className="w-full h-full object-cover" 
                               />
                           ) : (
                               <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Megaphone size={64} className="text-gray-300"/></div>
                           )}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r"></div>
                           <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 shadow-md rounded-full">
                               {newsItems[currentNewsIndex].branch}
                           </div>
                        </div>
                        <div className="w-full md:w-2/5 h-1/2 md:h-full bg-white p-8 md:p-12 flex flex-col justify-center text-right relative z-10">
                            <div className="flex items-center gap-2 text-yellow-600 font-bold mb-4 text-sm uppercase tracking-wide">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                <span>أحدث الأخبار</span>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 mb-6 leading-tight">{newsItems[currentNewsIndex].title}</h3>
                            <p className="text-gray-500 leading-relaxed text-base">{newsItems[currentNewsIndex].desc}</p>
                            
                            <div className="flex gap-3 mt-auto pt-8">
                                <button onClick={() => setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)} className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all"><ChevronRight size={24}/></button>
                                <button onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)} className="w-12 h-12 rounded-full border-2 border-gray-100 flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all"><ChevronLeft size={24}/></button>
                            </div>
                        </div>
                    </motion.div>
                  </AnimatePresence>
              </motion.div>
           </div>
        </section>
      )}
      
      {/* Branches Section (3D Tilt Effect Cards) */}
      <section id="branches" className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">فروع الأكاديمية</h2>
            <div className="w-24 h-2 bg-yellow-500 rounded-full"></div>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Shafa Badran */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl cursor-default transform transition-transform hover:-translate-y-2"
            >
              <img src={IMAGES.BRANCH_SHAFA} alt="Shafa" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                 <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="inline-block bg-yellow-500 text-black text-xs font-black px-4 py-1.5 rounded-full mb-4 shadow-lg">الفرع الرئيسي</span>
                    <h3 className="text-5xl font-black text-white leading-none mb-3">شفا بدران</h3>
                    <p className="text-gray-300 text-lg flex items-center gap-2 mb-6">
                       <MapPin className="text-yellow-500" size={20}/> شارع رفعت شموط
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                       <button onClick={() => openLocation('https://maps.app.goo.gl/mTqvZD4Ftor3NALJ8?g_st=ic')} className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-4 rounded-2xl hover:bg-white hover:text-black transition-all duration-300">
                          <Navigation size={20}/> الموقع
                       </button>
                       <button onClick={() => window.open('https://wa.me/962795629606', '_blank')} className="flex items-center justify-center gap-2 bg-[#25D366]/90 backdrop-blur-md text-white font-bold py-4 rounded-2xl hover:bg-[#25D366] transition-all duration-300">
                          <MessageCircle size={20}/> واتساب
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>

            {/* Abu Nseir */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="group relative h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl cursor-default transform transition-transform hover:-translate-y-2"
            >
              <img src={IMAGES.BRANCH_ABU_NSEIR} alt="Abu Nseir" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
              
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                 <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="inline-block bg-gray-800 text-white text-xs font-black px-4 py-1.5 rounded-full mb-4 shadow-lg border border-gray-600">الفرع الثاني</span>
                    <h3 className="text-5xl font-black text-white leading-none mb-3">أبو نصير</h3>
                    <p className="text-gray-300 text-lg flex items-center gap-2 mb-6">
                       <MapPin className="text-yellow-500" size={20}/> دوار البحرية - مجمع الفرا
                    </p>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                       <button onClick={() => openLocation('https://maps.app.goo.gl/yqu6tWBiqrRWGCMJ8?g_st=ic')} className="flex items-center justify-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold py-4 rounded-2xl hover:bg-white hover:text-black transition-all duration-300">
                          <Navigation size={20}/> الموقع
                       </button>
                       <button onClick={() => window.open('https://wa.me/962790368603', '_blank')} className="flex items-center justify-center gap-2 bg-[#25D366]/90 backdrop-blur-md text-white font-bold py-4 rounded-2xl hover:bg-[#25D366] transition-all duration-300">
                          <MessageCircle size={20}/> واتساب
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Why Choose Us (Staggered Animation) */}
      <section className="py-24 relative overflow-hidden bg-gray-50">
         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center mb-16 text-center">
              <motion.span 
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} 
                className="text-yellow-500 font-bold tracking-widest text-sm uppercase mb-2"
              >
                لماذا نحن؟
              </motion.span>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black text-gray-900 mb-4"
              >
                أكثر من مجرد <span className="text-yellow-500">رياضة</span>
              </motion.h2>
            </div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
                {[
                  {icon: Trophy, title: "صناعة الأبطال", text: "منهج تدريبي احترافي يهدف للوصول باللاعبين لمنصات التتويج المحلية والدولية."},
                  {icon: Users, title: "كادر محترف", text: "نخبة من المدربين الوطنيين والدوليين المعتمدين ذوي الخبرة العالية."},
                  {icon: Shield, title: "بيئة آمنة", text: "نهتم بالجانب التربوي والأخلاقي قبل الجانب البدني، في بيئة عائلية آمنة."}
                ].map((feature, i) => (
                   <motion.div 
                     variants={fadeInUp}
                     key={i} 
                     className="bg-white p-10 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 relative group overflow-hidden hover:-translate-y-2"
                   >
                       <div className="absolute top-0 left-0 w-2 h-full bg-yellow-500 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500"></div>
                       <div className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center text-yellow-600 mb-8 group-hover:bg-yellow-500 group-hover:text-black transition-colors duration-300">
                           <feature.icon size={40} strokeWidth={1.5} />
                       </div>
                       <h3 className="text-2xl font-black mb-4 text-gray-900">{feature.title}</h3>
                       <p className="text-gray-500 leading-relaxed font-medium">{feature.text}</p>
                   </motion.div>
                ))}
            </motion.div>
         </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        {/* Animated Background Dots */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#FDE047 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
        
        <div className="container mx-auto px-6 relative z-10">
           <motion.div 
             initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
             className="flex flex-col items-center mb-16"
           >
             <h2 className="text-4xl md:text-5xl font-black mb-6">جدول الحصص</h2>
             <div className="w-20 h-2 bg-yellow-500 rounded-full"></div>
           </motion.div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {(schedule && schedule.length > 0 ? schedule : INITIAL_SCHEDULE).map((cls, idx) => (
               <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 key={cls.id} 
                 className="bg-gray-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:bg-gray-800 group"
               >
                 <div className="flex items-center justify-between mb-8">
                     <div className="w-12 h-12 rounded-2xl bg-gray-700 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors shadow-lg"><Clock size={24}/></div>
                     <span className="text-xs font-black text-gray-300 bg-black/50 px-3 py-1.5 rounded-lg border border-gray-600">{cls.branch}</span>
                 </div>
                 <h3 className="font-bold text-2xl mb-2 text-white">{cls.level}</h3>
                 <div className="space-y-4 mt-8 border-t border-gray-700/50 pt-6">
                   <div className="flex items-start gap-3 text-sm text-gray-400 font-medium"><Calendar size={18} className="text-yellow-500 mt-0.5"/><span>{cls.days}</span></div>
                   <div className="flex items-center gap-3 text-sm font-bold text-white"><Activity size={18} className="text-yellow-500"/><span>{cls.time}</span></div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-20 pb-10 border-t border-gray-900 relative z-10">
        <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center items-center gap-4 mb-8">
                <div className="p-2 bg-white rounded-full"><img src={IMAGES.LOGO} alt="Logo" className="w-12 h-12" /></div>
                <span className="font-black text-2xl text-gray-200 tracking-tight">أكاديمية الشجاع</span>
            </div>
            <p className="text-gray-500 font-medium">© 2024 جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button (Pulse Effect) */}
      <motion.button 
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
        onClick={openWhatsApp}
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] hover:bg-[#20bd5a] transition-all hover:scale-110 flex items-center justify-center group"
      >
        <div className="absolute inset-0 rounded-full border-2 border-white animate-ping opacity-75"></div>
        <MessageCircle size={32} fill="white" className="text-transparent relative z-10" />
      </motion.button>

      {/* Modal Registration Form */}
      <AnimatePresence>
        {showRegModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg"
            >
              <Card className="border-t-8 border-yellow-500 shadow-2xl" title="طلب تسجيل جديد">
                <form onSubmit={handleRegister} className="space-y-5 mt-4">
                  <div><label className="block text-xs font-bold mb-2 text-gray-600">اسم الطالب الرباعي</label><input required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-0 outline-none transition-colors font-bold bg-gray-50 focus:bg-white" placeholder="الاسم الكامل" value={regForm.name} onChange={e=>setRegForm({...regForm, name:e.target.value})}/></div>
                  <div><label className="block text-xs font-bold mb-2 text-gray-600">تاريخ الميلاد</label><input type="date" required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-0 outline-none transition-colors font-bold bg-gray-50 focus:bg-white" value={regForm.dob} onChange={e=>setRegForm({...regForm, dob:e.target.value})}/></div>
                  <div><label className="block text-xs font-bold mb-2 text-gray-600">رقم هاتف ولي الأمر</label><input required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-0 outline-none transition-colors font-bold bg-gray-50 focus:bg-white" placeholder="079xxxxxxx" value={regForm.phone} onChange={e=>setRegForm({...regForm, phone:e.target.value})}/></div>
                  <div><label className="block text-xs font-bold mb-2 text-gray-600">العنوان</label><input required className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-0 outline-none transition-colors font-bold bg-gray-50 focus:bg-white" placeholder="المنطقة - الشارع" value={regForm.address} onChange={e=>setRegForm({...regForm, address:e.target.value})}/></div>
                  <div><label className="block text-xs font-bold mb-2 text-gray-600">الفرع المطلوب</label><select className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 focus:ring-0 outline-none transition-colors bg-gray-50 focus:bg-white font-bold cursor-pointer" value={regForm.branch} onChange={e=>setRegForm({...regForm, branch:e.target.value})}>
                    <option value={BRANCHES.SHAFA}>{BRANCHES.SHAFA}</option>
                    <option value={BRANCHES.ABU_NSEIR}>{BRANCHES.ABU_NSEIR}</option>
                  </select></div>
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                    <Button variant="ghost" type="button" className="text-gray-500 hover:text-black font-bold rounded-xl" onClick={()=>setShowRegModal(false)}>إلغاء</Button>
                    <Button type="submit" disabled={isSubmitting} className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-3 font-black rounded-xl shadow-lg shadow-yellow-500/20">
                        {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeView;
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Menu, X, MapPin, Phone, Clock, Calendar, Activity, Trophy, Shield, Users, MessageCircle, Megaphone, ChevronRight, ChevronLeft, Navigation, Play, Star, CheckCircle, ArrowDown } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { IMAGES, BRANCHES, INITIAL_SCHEDULE } from '../lib/constants';
import { useCollection } from '../hooks/useCollection'; 
import { collection, addDoc } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';

const HomeView = ({ setView, schedule }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRegModal, setShowRegModal] = useState(false);
  const [regForm, setRegForm] = useState({ name: '', phone: '', dob: '', address: '', branch: BRANCHES.SHAFA });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="min-h-screen font-sans text-right relative bg-slate-950 overflow-x-hidden selection:bg-yellow-500/30 selection:text-white" dir="rtl">
      
      {/* Navbar */}
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800 py-3 shadow-lg' 
            : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="relative">
                <img src={IMAGES.LOGO} alt="Logo" className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/50 backdrop-blur-sm p-1 object-contain border border-slate-700 transition-transform group-hover:rotate-12" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-black leading-none text-slate-100 tracking-tight group-hover:text-yellow-500 transition-colors">أكاديمية الشجاع</h1>
              <p className="text-[9px] md:text-[10px] text-slate-500 tracking-[0.2em] uppercase font-bold">Brave Taekwondo</p>
            </div>
          </div>

          <nav className="hidden md:flex gap-1 items-center bg-slate-900/50 backdrop-blur-md px-2 py-1.5 rounded-full border border-slate-800">
            {['الرئيسية', 'من نحن', 'الفروع', 'جدول الحصص'].map((item) => (
              <button key={item} className="px-5 py-2 rounded-full text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all relative overflow-hidden group" onClick={() => {
                if (item === 'جدول الحصص') document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'});
                if (item === 'الفروع') document.getElementById('branches')?.scrollIntoView({behavior: 'smooth'});
                if (item === 'الرئيسية') window.scrollTo(0,0);
              }}>
                <span className="relative z-10">{item}</span>
              </button>
            ))}
          </nav>

          <div className="flex gap-3">
            <Button onClick={() => setView('login')} className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-black px-4 md:px-6 rounded-full border-none hidden md:block text-sm md:text-base shadow-lg shadow-yellow-500/20">بوابة الأعضاء</Button>
            <button className="md:hidden p-2 text-slate-200 bg-slate-900 rounded-full backdrop-blur-md border border-slate-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               {mobileMenuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
             <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: 'auto', opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               className="md:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 overflow-hidden"
             >
               <div className="p-6 flex flex-col gap-4">
                 {['الرئيسية', 'من نحن', 'الفروع', 'جدول الحصص'].map((item) => (
                    <button key={item} 
                      onClick={() => {
                        setMobileMenuOpen(false);
                        if (item === 'جدول الحصص') document.getElementById('schedule')?.scrollIntoView({behavior: 'smooth'});
                        if (item === 'الفروع') document.getElementById('branches')?.scrollIntoView({behavior: 'smooth'});
                        if (item === 'الرئيسية') window.scrollTo(0,0);
                      }}
                      className="text-right text-lg font-bold text-slate-300 hover:text-yellow-500 border-b border-slate-900 pb-3 last:border-0"
                    >
                      {item}
                    </button>
                 ))}
                 <Button onClick={() => { setMobileMenuOpen(false); setView('login'); }} className="w-full py-3.5 bg-yellow-500 text-slate-900 font-black rounded-xl mt-2 border-none">بوابة الأعضاء</Button>
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <div className="relative min-h-[100vh] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-slate-950 to-black z-0"></div>
        
        {/* Background Image */}
        <div className="absolute inset-0 z-10 opacity-60 md:opacity-100 pointer-events-none md:pointer-events-auto">
           <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-slate-700 font-black text-2xl animate-pulse">LOADING...</div>}>
              <div className="absolute inset-0 bg-slate-950/50 z-10 mix-blend-multiply"></div>
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

        <div className="container mx-auto px-4 md:px-6 relative z-20 pt-20 md:pt-0">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start max-w-full md:max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 px-3 py-1.5 rounded-full mb-6 md:mb-8 shadow-2xl">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-slate-300 text-[10px] md:text-xs font-bold tracking-widest uppercase">التسجيل لموسم 2026 مفتوح</span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-5xl md:text-9xl font-black mb-4 md:mb-6 leading-[0.9] tracking-tighter text-white drop-shadow-2xl">
              اصنع <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500">مجدك</span>
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-slate-300 text-base md:text-2xl mb-8 md:mb-10 font-medium leading-relaxed max-w-xl border-r-4 border-yellow-500 pr-4 md:pr-6 pl-0 md:pl-10 bg-gradient-to-l from-slate-950/80 to-transparent py-2 md:py-4 rounded-l-2xl backdrop-blur-sm">
              نحن لا نعلمك القتال فقط، نحن نبني شخصية القائد بداخلك. انضم لنخبة أبطال الأردن.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <Button onClick={() => setShowRegModal(true)} className="w-full md:w-auto justify-center px-8 md:px-12 py-4 md:py-5 text-lg md:text-xl bg-yellow-500 text-slate-900 font-black hover:bg-yellow-400 rounded-xl md:rounded-2xl shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all flex items-center gap-2 border-none">
                سجل الآن <ChevronLeft strokeWidth={3} size={20} />
              </Button>
              <button onClick={() => document.getElementById('branches')?.scrollIntoView({behavior: 'smooth'})} className="w-full md:w-auto px-8 py-4 md:py-5 text-lg text-slate-200 font-bold border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 rounded-xl md:rounded-2xl transition-all">
                اكتشف الفروع
              </button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1, y: [0, 10, 0] }} 
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 hidden md:flex flex-col items-center gap-2"
        >
           <span className="text-[10px] uppercase tracking-widest">تصفح المزيد</span>
           <ArrowDown size={20}/>
        </motion.div>
      </div>

      {/* News Ticker */}
      {newsItems && newsItems.length > 0 && (
        <section className="relative z-30 -mt-10 md:-mt-20 px-4 md:px-0">
           <div className="container mx-auto">
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="bg-slate-900 rounded-2xl md:rounded-[2rem] shadow-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row h-auto md:h-[180px]"
              >
                  <div className="bg-yellow-500 p-4 md:p-6 flex flex-row md:flex-col justify-between md:justify-center items-center md:w-[220px] shrink-0 text-slate-900 text-center relative overflow-hidden">
                      <div className="flex items-center gap-2 md:block">
                         <Megaphone size={24} className="md:w-9 md:h-9 md:mb-2 md:mx-auto"/>
                         <span className="font-black text-base md:text-xl">آخر الأخبار</span>
                      </div>
                      <div className="flex gap-2 md:hidden">
                         <button onClick={() => setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)} className="p-1 bg-black/10 rounded-full"><ChevronRight size={16}/></button>
                         <button onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)} className="p-1 bg-black/10 rounded-full"><ChevronLeft size={16}/></button>
                      </div>
                  </div>
                  <div className="flex-1 relative bg-slate-900 p-5 md:p-0 flex items-center">
                      <AnimatePresence mode='wait'>
                        <motion.div 
                          key={currentNewsIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full px-2 md:px-8 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6"
                        >
                            <span className="text-[10px] md:text-xs font-black bg-slate-950 text-yellow-500 px-3 py-1 rounded-lg shrink-0 border border-slate-800">{newsItems[currentNewsIndex].branch}</span>
                            <div className="flex-1 text-right md:border-r-2 md:border-slate-800 md:pr-6">
                                <h3 className="font-black text-lg md:text-2xl text-slate-100 mb-1">{newsItems[currentNewsIndex].title}</h3>
                                <p className="text-slate-400 text-xs md:text-base line-clamp-2 md:line-clamp-1 font-medium">{newsItems[currentNewsIndex].desc}</p>
                            </div>
                            <div className="hidden md:flex gap-2 shrink-0">
                                <button onClick={() => setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)} className="p-3 hover:bg-slate-800 rounded-full transition-colors text-slate-400"><ChevronRight/></button>
                                <button onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)} className="p-3 hover:bg-slate-800 rounded-full transition-colors text-slate-400"><ChevronLeft/></button>
                            </div>
                        </motion.div>
                      </AnimatePresence>
                  </div>
              </motion.div>
           </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-20 md:py-32 bg-slate-950 relative">
         <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center mb-12 md:mb-20">
                <span className="text-yellow-600 font-bold tracking-widest text-[10px] md:text-sm uppercase bg-yellow-900/10 px-4 py-2 rounded-full border border-yellow-500/20">لماذا أكاديمية الشجاع؟</span>
                <h2 className="text-3xl md:text-6xl font-black text-slate-100 mt-6 mb-4 tracking-tight">نصنع <span className="text-yellow-500">الأبطال</span> باحترافية</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
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
                     className="group p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] bg-slate-900 hover:bg-slate-800 transition-all duration-500 cursor-default border border-slate-800 hover:border-slate-700 hover:shadow-2xl"
                   >
                       <div className="w-14 h-14 md:w-20 md:h-20 bg-slate-950 rounded-2xl md:rounded-3xl flex items-center justify-center text-slate-300 mb-6 md:mb-8 shadow-inner group-hover:bg-yellow-500 group-hover:text-slate-900 transition-colors border border-slate-800">
                           <item.icon size={28} className="md:w-9 md:h-9" strokeWidth={1.5}/>
                       </div>
                       <h3 className="text-xl md:text-2xl font-black text-slate-100 mb-3 transition-colors">{item.title}</h3>
                       <p className="text-sm md:text-base text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed font-medium">{item.text}</p>
                   </motion.div>
                ))}
            </div>
         </div>
      </section>

      {/* Branches */}
      <section id="branches" className="py-20 md:py-32 bg-black text-white relative">
        <div className="container mx-auto px-4 md:px-6">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6">
              <div>
                 <span className="text-yellow-500 font-bold tracking-widest text-xs uppercase mb-2 block">مواقعنا</span>
                 <h2 className="text-4xl md:text-6xl font-black text-white">فروع الأكاديمية</h2>
              </div>
              <Button onClick={() => window.open('https://wa.me/962795629606', '_blank')} className="w-full md:w-auto bg-slate-100 text-slate-900 hover:bg-yellow-500 border-none font-bold rounded-xl md:rounded-full px-8 py-3 md:py-4 transition-colors">تواصل معنا</Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
              {[
                { 
                  name: 'شفا بدران', 
                  sub: 'الفرع الرئيسي', 
                  img: IMAGES.BRANCH_SHAFA, 
                  loc: 'https://maps.app.goo.gl/mTqvZD4Ftor3NALJ8?g_st=ic', 
                  phone: '0795629606',
                  desc: 'شارع رفعت شموط - بجانب مشاتل ربيع الاردن' 
                },
                { 
                  name: 'أبو نصير', 
                  sub: 'الفرع الثاني', 
                  img: IMAGES.BRANCH_ABU_NSEIR, 
                  loc: 'https://maps.app.goo.gl/yqu6tWBiqrRWGCMJ8?g_st=ic', 
                  phone: '0790368603',
                  desc: 'دوار البحرية - مجمع الفرّا (الطابق الثاني)'
                }
              ].map((branch, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -5 }}
                  className="relative h-[450px] md:h-[600px] rounded-3xl md:rounded-[3rem] overflow-hidden group cursor-pointer border border-white/10 shadow-2xl"
                >
                   <img src={branch.img} alt={branch.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-50" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                   
                   <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                      <div className="bg-yellow-500 text-slate-900 text-[10px] md:text-xs font-black px-3 py-1 md:px-4 md:py-2 rounded-lg md:rounded-full inline-block mb-4 shadow-lg">{branch.sub}</div>
                      <h3 className="text-4xl md:text-6xl font-black mb-2">{branch.name}</h3>
                      <p className="text-gray-300 text-sm md:text-lg mb-6 flex items-center gap-2">
                        <MapPin size={16} className="text-yellow-500"/> {branch.desc}
                      </p>
                      
                      <div className="flex gap-3 mt-4">
                         <button onClick={() => openLocation(branch.loc)} className="flex-1 bg-white text-black py-3 md:py-4 rounded-xl md:rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors text-sm md:text-base border-none">
                            <Navigation size={18}/> الموقع
                         </button>
                         <button onClick={() => window.open(`tel:${branch.phone}`)} className="w-14 h-14 md:w-16 md:h-16 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-white hover:text-black transition-colors border border-white/20">
                            <Phone size={20} className="md:w-6 md:h-6"/>
                         </button>
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule" className="py-20 md:py-32 bg-[#080808] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-yellow-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
           <motion.div 
             initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
             className="flex flex-col items-center mb-16 text-center"
           >
             <h2 className="text-4xl md:text-6xl font-black mb-4 text-white tracking-tight">جدول الحصص</h2>
             <p className="text-gray-400 text-base md:text-xl max-w-2xl">اختر الوقت المناسب وانطلق في رحلة التدريب</p>
           </motion.div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
             {(schedule && schedule.length > 0 ? schedule : INITIAL_SCHEDULE).map((cls, idx) => (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 key={cls.id} 
                 className="relative group bg-slate-900/50 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:bg-slate-900/80 hover:-translate-y-2 overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform border border-white/5">
                       <Clock size={28}/>
                    </div>
                    <span className="text-xs font-bold text-white/80 bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">{cls.branch}</span>
                 </div>
                 
                 <h4 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">{cls.level}</h4>
                 
                 <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-gray-400">
                       <Calendar size={20} className="text-yellow-500"/>
                       <span className="text-base font-medium">{cls.days}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white">
                       <Activity size={20} className="text-green-400"/>
                       <span className="text-lg font-bold tracking-wide">{cls.time}</span>
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
         <div className="container mx-auto px-6 text-center">
            <div className="mb-10">
               <img src={IMAGES.LOGO} alt="Logo" className="w-20 h-20 mx-auto opacity-50 grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110" />
            </div>
            <p className="text-gray-500 text-sm font-medium tracking-wide">© 2024 أكاديمية الشجاع للتايكواندو. جميع الحقوق محفوظة.</p>
         </div>
      </footer>

      {/* Floating WhatsApp */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 bg-[#25D366] text-white p-3 md:p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] flex items-center justify-center group border-4 border-white/10 backdrop-blur-sm"
      >
        <MessageCircle size={28} className="relative z-10 md:w-8 md:h-8" />
        <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:animate-ping"></div>
      </motion.button>

      {/* Registration Modal (Dark) */}
      <AnimatePresence>
        {showRegModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-end md:items-center justify-center p-0 md:p-4"
            onClick={() => setShowRegModal(false)}
          >
            <motion.div 
              initial={{ y: "100%" }} 
              animate={{ y: 0 }} 
              exit={{ y: "100%" }} 
              className="w-full md:w-full md:max-w-lg bg-slate-900 border border-slate-700 rounded-t-[2rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-yellow-500 p-6 md:p-8 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-black/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                 <h3 className="text-2xl md:text-3xl font-black text-slate-900 relative z-10">طلب تسجيل جديد</h3>
                 <p className="text-slate-900/70 text-sm font-bold mt-2 relative z-10">انضم لعائلة الأبطال وابدأ رحلتك</p>
              </div>
              
              <form onSubmit={handleRegister} className="p-6 md:p-8 space-y-4 md:space-y-6 max-h-[80vh] overflow-y-auto">
                  {[
                    { label: 'اسم الطالب الرباعي', type: 'text', key: 'name', ph: 'الاسم الكامل' },
                    { label: 'رقم ولي الأمر', type: 'text', key: 'phone', ph: '079xxxxxxx' },
                    { label: 'العنوان', type: 'text', key: 'address', ph: 'المنطقة - الشارع' }
                  ].map((field) => (
                    <div key={field.key}>
                       <label className="block text-xs font-bold text-slate-400 mb-2">{field.label}</label>
                       <input 
                         required 
                         type={field.type}
                         className="w-full bg-slate-950 border border-slate-700 rounded-xl md:rounded-2xl p-3 md:p-4 focus:bg-slate-900 focus:border-yellow-500 outline-none transition-colors font-bold text-slate-200 text-sm md:text-base placeholder-slate-600"
                         placeholder={field.ph}
                         value={regForm[field.key]}
                         onChange={e=>setRegForm({...regForm, [field.key]:e.target.value})}
                       />
                    </div>
                  ))}
                  
                  <div>
                     <label className="block text-xs font-bold text-slate-400 mb-2">تاريخ الميلاد</label>
                     <input type="date" required className="w-full bg-slate-950 border border-slate-700 rounded-xl md:rounded-2xl p-3 md:p-4 focus:bg-slate-900 focus:border-yellow-500 outline-none font-bold text-slate-200 text-sm md:text-base" value={regForm.dob} onChange={e=>setRegForm({...regForm, dob:e.target.value})}/>
                  </div>

                  <div>
                     <label className="block text-xs font-bold text-slate-400 mb-2">الفرع المطلوب</label>
                     <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {[BRANCHES.SHAFA, BRANCHES.ABU_NSEIR].map((br) => (
                           <button 
                             key={br} 
                             type="button" 
                             onClick={() => setRegForm({...regForm, branch: br})}
                             className={`py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm transition-all border-2 ${regForm.branch === br ? 'border-yellow-500 bg-yellow-900/20 text-yellow-500' : 'border-slate-800 text-slate-500 hover:border-slate-600 bg-slate-950'}`}
                           >
                             {br}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-4 flex gap-3 md:gap-4 pb-4 md:pb-0">
                    <button type="button" onClick={()=>setShowRegModal(false)} className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-slate-500 hover:bg-slate-800 transition-colors">إلغاء</button>
                    <button type="submit" disabled={isSubmitting} className="flex-[2] py-3 md:py-4 rounded-xl md:rounded-2xl font-bold bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors shadow-xl">
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
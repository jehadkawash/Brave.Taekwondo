// src/views/HomeView.jsx
import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Phone, Clock, Calendar, Activity, Trophy, Shield, Users, MessageCircle, Megaphone, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { IMAGES, BRANCHES, INITIAL_SCHEDULE } from '../lib/constants';
import { useCollection } from '../hooks/useCollection'; 

// --- استيرادات فايربيس ---
import { collection, addDoc } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';
// -------------------------

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
  // -------------------------

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'registrations'), {
        ...regForm,
        date: new Date().toLocaleDateString('ar-JO'),
        status: 'new',
        createdAt: new Date().toISOString()
      });
      alert("تم إرسال طلب التسجيل بنجاح! سنتواصل معك قريباً.");
      setShowRegModal(false);
      setRegForm({ name: '', phone: '', dob: '', address: '', branch: BRANCHES.SHAFA });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openLocation = (url) => window.open(url, '_blank');
  const openWhatsApp = () => window.open('https://wa.me/962795629606', '_blank');

  return (
    <div className="min-h-screen font-sans text-right relative bg-white" dir="rtl">
      
      {/* Header */}
      <header className="bg-black text-white shadow-lg sticky top-0 z-50 border-b-2 border-yellow-500">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo(0,0)}>
            <div className="relative">
                <img src={IMAGES.LOGO} alt="Logo" className="w-12 h-12 rounded-full bg-white p-1 object-contain transition-transform group-hover:scale-110" />
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
            <Button onClick={() => setView('login')} className="bg-yellow-500 text-black hover:bg-yellow-400 font-black px-6 border-none hidden md:block transform hover:-translate-y-1 transition-transform">بوابة الأعضاء</Button>
            <button className="md:hidden p-2 text-yellow-500" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
               {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
           <div className="md:hidden bg-gray-900 border-t border-gray-800 p-4 flex flex-col gap-4">
             <Button onClick={() => { setMobileMenuOpen(false); setView('login'); }} className="w-full py-3 bg-yellow-500 text-black font-bold">بوابة الأعضاء</Button>
           </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white h-[600px] flex items-center shadow-2xl overflow-hidden">
        {/* Abstract shapes in hero background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-yellow-500/10 -skew-x-12 transform origin-top translate-x-20"></div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <img src={IMAGES.HERO_BG} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        
        <div className="container mx-auto px-6 relative z-20 flex flex-col items-start pt-10">
          <div className="inline-block bg-yellow-500 text-black font-black px-4 py-1 rounded-none skew-x-[-10deg] mb-6 animate-fade-in-up">
              <span className="block skew-x-[10deg] text-sm tracking-wider">التسجيل مفتوح الآن</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-black mb-6 leading-tight drop-shadow-lg">
            اصنع <span className="text-yellow-500">قوتك</span><br/>ابنِ مستقبلك
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-lg font-medium">انضم إلى نخبة أبطال الأردن في التايكوندو. تدريب احترافي، بيئة آمنة، ومستقبل واعد.</p>
          <div className="flex gap-4">
            <Button onClick={() => setShowRegModal(true)} className="px-10 py-4 text-xl bg-yellow-500 text-black font-black hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(234,179,8,0.5)] border-none">ابدأ رحلتك</Button>
          </div>
        </div>
      </div>

      {/* News Section */}
      {newsItems && newsItems.length > 0 && (
        <section className="relative -mt-16 z-30 mb-20">
           <div className="container mx-auto px-6">
              <div className="relative w-full max-w-5xl mx-auto h-[450px] bg-white rounded-2xl overflow-hidden shadow-2xl border-t-8 border-yellow-500 flex flex-col md:flex-row">
                  {/* News Content Slider */}
                  {newsItems.map((item, index) => (
                      <div 
                        key={item.id}
                        className={`absolute inset-0 flex flex-col md:flex-row transition-all duration-700 ease-in-out ${index === currentNewsIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      >
                          {/* Image Side */}
                          <div className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden">
                             {item.image ? (
                                 <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear transform scale-100 hover:scale-110" />
                             ) : (
                                 <div className="w-full h-full bg-gray-100 flex items-center justify-center"><Megaphone size={64} className="text-gray-300"/></div>
                             )}
                             <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs font-bold px-3 py-1 shadow-md">
                                 {item.branch}
                             </div>
                          </div>

                          {/* Text Side */}
                          <div className="w-full md:w-1/2 h-1/2 md:h-full bg-white p-8 flex flex-col justify-center text-right relative">
                              <div className="flex items-center gap-2 text-yellow-600 font-bold mb-2 text-sm uppercase tracking-wide">
                                  <Activity size={16}/>
                                  <span>أحدث الأخبار</span>
                              </div>
                              <h3 className="text-2xl md:text-4xl font-black text-gray-900 mb-4 leading-tight">{item.title}</h3>
                              <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.desc}</p>
                              
                              {/* Controls within text area */}
                              <div className="flex gap-2 mt-8">
                                  <button onClick={() => setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"><ChevronRight size={20}/></button>
                                  <button onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white transition-colors"><ChevronLeft size={20}/></button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
           </div>
        </section>
      )}
      
      {/* Branches Section */}
      <section id="branches" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-2">فروع الأكاديمية</h2>
            <div className="w-20 h-1.5 bg-yellow-500 rounded-full"></div>
            <p className="text-gray-500 mt-4 max-w-lg text-center">ننتشر في مواقع استراتيجية لخدمتكم بأحدث التجهيزات الرياضية</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-10">
            {/* Shafa Branch Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
              <div className="h-72 relative overflow-hidden">
                  <img src={IMAGES.BRANCH_SHAFA} alt="Shafa" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-0 left-0 bg-yellow-500 text-black px-6 py-2 font-bold rounded-tr-xl">الفرع الرئيسي</div>
              </div>
              <div className="p-8 border-t-4 border-yellow-500">
                <h3 className="text-2xl font-black text-gray-900 mb-4">فرع شفا بدران</h3>
                <div className="space-y-4 text-gray-600">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-yellow-600"><MapPin size={18}/></div><span className="font-bold">شارع رفعت شموط</span></div>
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-yellow-600"><Phone size={18}/></div><a href="tel:0795629606" className="font-bold hover:text-black transition">07 9562 9606</a></div>
                </div>
                <Button variant="secondary" className="w-full mt-8 bg-gray-900 text-white hover:bg-black" onClick={() => openLocation('https://share.google/PGRNQACVSiOhXkmbj')}>موقعنا على الخريطة</Button>
              </div>
            </div>

            {/* Abu Nseir Branch Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
              <div className="h-72 relative overflow-hidden">
                  <img src={IMAGES.BRANCH_ABU_NSEIR} alt="Abu Nseir" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-8 border-t-4 border-yellow-500">
                <h3 className="text-2xl font-black text-gray-900 mb-4">فرع أبو نصير</h3>
                <div className="space-y-4 text-gray-600">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-yellow-600"><MapPin size={18}/></div><span className="font-bold">دوار البحرية</span></div>
                    <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-yellow-600"><Phone size={18}/></div><a href="tel:0790368603" className="font-bold hover:text-black transition">07 9036 8603</a></div>
                </div>
                <Button variant="secondary" className="w-full mt-8 bg-gray-900 text-white hover:bg-black" onClick={() => openLocation('https://share.google/6rSHFxa03RG6n9WH0')}>موقعنا على الخريطة</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section (With Abstract Background) */}
      <section className="py-24 relative overflow-hidden bg-white">
         {/* Background Shapes */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-0 w-96 h-96 bg-yellow-50 rounded-full blur-3xl opacity-60"></div>
            <div className="absolute bottom-20 left-0 w-72 h-72 bg-gray-50 rounded-full blur-3xl opacity-60"></div>
            {/* Slanted Line */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-yellow-50/30"></div>
         </div>

         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col items-center mb-16 text-center">
              <span className="text-yellow-500 font-bold tracking-widest text-sm uppercase mb-2">لماذا نحن؟</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">أكثر من مجرد <span className="text-yellow-500">رياضة</span></h2>
              <p className="text-gray-500 max-w-xl">نحن نبني شخصية طفلك، نعزز ثقته بنفسه، ونعده ليكون قائداً في المستقبل.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
                {[
                  {icon: Trophy, title: "صناعة الأبطال", text: "منهج تدريبي احترافي يهدف للوصول باللاعبين لمنصات التتويج المحلية والدولية."},
                  {icon: Users, title: "كادر محترف", text: "نخبة من المدربين الوطنيين والدوليين المعتمدين ذوي الخبرة العالية."},
                  {icon: Shield, title: "بيئة آمنة", text: "نهتم بالجانب التربوي والأخلاقي قبل الجانب البدني، في بيئة عائلية آمنة."}
                ].map((feature, i) => (
                   <div key={i} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 relative group overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-200 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                       <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-6 group-hover:scale-110 transition-transform group-hover:bg-yellow-500 group-hover:text-black">
                           <feature.icon size={32} strokeWidth={2} />
                       </div>
                       <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                       <p className="text-gray-500 leading-relaxed text-sm">{feature.text}</p>
                   </div>
                ))}
            </div>
         </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 bg-gray-900 text-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#FDE047 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        
        <div className="container mx-auto px-6 relative z-10">
           <div className="flex flex-col items-center mb-16">
              <h2 className="text-4xl font-black mb-4">جدول الحصص الأسبوعي</h2>
              <div className="w-20 h-1.5 bg-yellow-500 rounded-full"></div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {(schedule && schedule.length > 0 ? schedule : INITIAL_SCHEDULE).map((cls) => (
               <div key={cls.id} className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:-translate-y-2 group">
                 <div className="flex items-center justify-between mb-6">
                     <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-colors"><Clock size={20}/></div>
                     <span className="text-xs font-bold text-gray-400 bg-black/30 px-2 py-1 rounded">{cls.branch}</span>
                 </div>
                 <h3 className="font-bold text-xl mb-2 text-white">{cls.level}</h3>
                 <div className="space-y-3 mt-6 border-t border-gray-700 pt-4">
                   <div className="flex items-start gap-2 text-sm text-gray-400"><Calendar size={16} className="text-yellow-500 mt-0.5"/><span>{cls.days}</span></div>
                   <div className="flex items-center gap-2 text-sm font-bold text-white"><Activity size={16} className="text-yellow-500"/><span>{cls.time}</span></div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-24 md:pb-8 border-t border-gray-800 relative z-10">
        <div className="container mx-auto px-6 text-center">
            <div className="flex justify-center items-center gap-3 mb-6">
                <img src={IMAGES.LOGO} alt="Logo" className="w-10 h-10 rounded-full grayscale opacity-80" />
                <span className="font-bold text-lg text-gray-400">أكاديمية الشجاع للتايكوندو</span>
            </div>
            <p className="text-sm text-gray-600">© 2023 جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button 
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20bd5a] transition-transform hover:scale-110 flex items-center justify-center animate-bounce-slow border-4 border-white"
        title="تواصل معنا عبر واتساب"
      >
        <MessageCircle size={28} fill="white" className="text-transparent" />
      </button>

      {/* Modal Registration Form */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg animate-fade-in border-t-8 border-yellow-500" title="طلب تسجيل جديد">
             <form onSubmit={handleRegister} className="space-y-4">
               <div><label className="block text-xs font-bold mb-1 text-gray-600">اسم الطالب الرباعي</label><input required className="w-full border-2 border-gray-100 p-3 rounded-lg focus:border-yellow-500 focus:ring-0 outline-none transition-colors" placeholder="الاسم الكامل" value={regForm.name} onChange={e=>setRegForm({...regForm, name:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1 text-gray-600">تاريخ الميلاد</label><input type="date" required className="w-full border-2 border-gray-100 p-3 rounded-lg focus:border-yellow-500 focus:ring-0 outline-none transition-colors" value={regForm.dob} onChange={e=>setRegForm({...regForm, dob:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1 text-gray-600">رقم هاتف ولي الأمر</label><input required className="w-full border-2 border-gray-100 p-3 rounded-lg focus:border-yellow-500 focus:ring-0 outline-none transition-colors" placeholder="079xxxxxxx" value={regForm.phone} onChange={e=>setRegForm({...regForm, phone:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1 text-gray-600">العنوان</label><input required className="w-full border-2 border-gray-100 p-3 rounded-lg focus:border-yellow-500 focus:ring-0 outline-none transition-colors" placeholder="المنطقة - الشارع" value={regForm.address} onChange={e=>setRegForm({...regForm, address:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1 text-gray-600">الفرع المطلوب</label><select className="w-full border-2 border-gray-100 p-3 rounded-lg focus:border-yellow-500 focus:ring-0 outline-none transition-colors bg-white" value={regForm.branch} onChange={e=>setRegForm({...regForm, branch:e.target.value})}>
                 <option value={BRANCHES.SHAFA}>{BRANCHES.SHAFA}</option>
                 <option value={BRANCHES.ABU_NSEIR}>{BRANCHES.ABU_NSEIR}</option>
               </select></div>
               <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                 <Button variant="ghost" className="text-gray-500 hover:text-black" onClick={()=>setShowRegModal(false)}>إلغاء</Button>
                 <Button type="submit" disabled={isSubmitting} className="bg-black text-white hover:bg-gray-800 px-8">
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                 </Button>
               </div>
             </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HomeView;
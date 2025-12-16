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
    // ✨✨ التعديل هنا: خطوط أعرض (150px) ولون أصفر أقوى (#FDE047) ✨✨
    <div 
      className="min-h-screen font-sans text-right relative" 
      dir="rtl"
      style={{
        // أبيض 150 بكسل، ثم أصفر قوي 150 بكسل (المجموع 300 بكسل للتكرار)
        backgroundImage: 'repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 150px, #FDE047 150px, #FDE047 300px)'
      }}
    >
      {/* Header */}
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
             <Button onClick={() => { setMobileMenuOpen(false); setView('login'); }} className="w-full py-3">بوابة الأعضاء</Button>
           </div>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white h-[600px] flex items-center shadow-xl border-b-4 border-yellow-500">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <img src={IMAGES.HERO_BG} alt="Hero" className="absolute inset-0 w-full h-full object-cover" />
        <div className="container mx-auto px-6 relative z-20 flex flex-col items-start">
          <span className="bg-yellow-500 text-black font-bold px-3 py-1 rounded mb-4 text-sm animate-pulse">التسجيل مفتوح الآن</span>
          <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            اصنع قوتك ..<br/><span className="text-yellow-500">ابنِ مستقبلك</span>
          </h2>
          <div className="flex gap-4">
            <Button onClick={() => setShowRegModal(true)} className="px-8 py-4 text-lg shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all">ابدأ رحلتك معنا</Button>
          </div>
        </div>
      </div>

      {/* News Section */}
      {newsItems && newsItems.length > 0 && (
        <section className="py-16 relative">
           <div className="container mx-auto px-6">
              <div className="text-center mb-10">
                 <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2 bg-white px-8 py-3 rounded-full shadow-lg border-2 border-yellow-400 inline-block">
                    <Megaphone className="text-yellow-600"/>
                    أحدث الأخبار والإعلانات
                 </h2>
              </div>
              
              <div className="relative w-full max-w-4xl mx-auto h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-white border-4 border-yellow-500">
                  {newsItems.map((item, index) => (
                      <div 
                        key={item.id}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${index === currentNewsIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                      >
                          <div className="absolute inset-0 h-full w-full">
                             {item.image ? (
                                 <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                             ) : (
                                 <div className="w-full h-full bg-gray-200 flex items-center justify-center"><Megaphone size={64} className="text-gray-400"/></div>
                             )}
                             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                              <span className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold mb-3 inline-block shadow-sm">{item.branch}</span>
                              <h3 className="text-2xl md:text-3xl font-bold mb-2">{item.title}</h3>
                              <p className="text-gray-200 line-clamp-2">{item.desc}</p>
                          </div>
                      </div>
                  ))}

                  <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                      <button onClick={() => setCurrentNewsIndex((prev) => (prev + 1) % newsItems.length)} className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition"><ChevronRight size={20}/></button>
                      <button onClick={() => setCurrentNewsIndex((prev) => (prev - 1 + newsItems.length) % newsItems.length)} className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition"><ChevronLeft size={20}/></button>
                  </div>
              </div>
           </div>
        </section>
      )}
      
      {/* Branches Section */}
      <section id="branches" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-white px-8 py-2 rounded-full shadow-lg border-2 border-yellow-400 inline-block">فروعنا</h2>
            <div className="w-24 h-1 bg-black mx-auto rounded mt-2"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Shafa Branch */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-300 group border-2 border-yellow-400">
              <div className="h-64 bg-gray-800 relative overflow-hidden">
                  <img src={IMAGES.BRANCH_SHAFA} alt="Shafa Badran" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 text-white z-20"><h3 className="text-2xl font-bold">فرع شفا بدران</h3></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-start gap-4"><MapPin className="text-yellow-600 mt-1 shrink-0" /><div><p className="font-bold text-gray-900">شفا بدران - شارع رفعت شموط</p></div></div>
                <div className="flex items-center gap-4"><Phone className="text-yellow-600 shrink-0" /><div className="flex items-center gap-2"><a href="tel:0795629606" className="font-bold text-gray-900 hover:text-yellow-600 transition" dir="ltr">07 9562 9606</a></div></div>
                <Button variant="outline" className="w-full mt-4" onClick={() => openLocation('https://share.google/PGRNQACVSiOhXkmbj')}>موقعنا على الخريطة</Button>
              </div>
            </div>
            {/* Abu Nseir Branch */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-all duration-300 group border-2 border-yellow-400">
              <div className="h-64 bg-gray-800 relative overflow-hidden">
                  <img src={IMAGES.BRANCH_ABU_NSEIR} alt="Abu Nseir" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-4 right-4 text-white z-20"><h3 className="text-2xl font-bold">فرع أبو نصير</h3></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-start gap-4"><MapPin className="text-yellow-600 mt-1 shrink-0" /><div><p className="font-bold text-gray-900">أبو نصير - دوار البحرية</p></div></div>
                <div className="flex items-center gap-4"><Phone className="text-yellow-600 shrink-0" /><div className="flex items-center gap-2"><a href="tel:0790368603" className="font-bold text-gray-900 hover:text-yellow-600 transition" dir="ltr">07 9036 8603</a></div></div>
                <Button variant="outline" className="w-full mt-4" onClick={() => openLocation('https://share.google/6rSHFxa03RG6n9WH0')}>موقعنا على الخريطة</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 relative overflow-hidden">
         <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-white px-8 py-2 rounded-full shadow-lg border-2 border-yellow-400 inline-block">لماذا أكاديمية الشجاع؟</h2>
              <p className="text-gray-900 font-bold max-w-2xl mx-auto bg-white/90 p-3 rounded-lg border border-yellow-400 shadow">نحن لا ندرب التايكوندو فحسب، نحن نبني شخصيات قيادية قوية.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-2xl bg-white shadow-xl hover:-translate-y-2 transition duration-300 border-2 border-yellow-400">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yellow-400"><Trophy size={32}/></div>
                    <h3 className="text-xl font-bold mb-3">صناعة الأبطال</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-semibold">سجل حافل بالإنجازات المحلية والدولية، ومنهج تدريبي يهدف للوصول باللاعبين لمنصات التتويج.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white shadow-xl hover:-translate-y-2 transition duration-300 border-2 border-yellow-400">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yellow-400"><Users size={32}/></div>
                    <h3 className="text-xl font-bold mb-3">كادر تدريبي محترف</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-semibold">نخبة من المدربين المعتمدين ذوي الخبرة العالية في التعامل مع مختلف الفئات العمرية.</p>
                </div>
                <div className="p-6 rounded-2xl bg-white shadow-xl hover:-translate-y-2 transition duration-300 border-2 border-yellow-400">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-yellow-400"><Shield size={32}/></div>
                    <h3 className="text-xl font-bold mb-3">بيئة آمنة وتربوية</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-semibold">نحرص على توفير بيئة تدريبية آمنة تعزز القيم الأخلاقية، الانضباط، والثقة بالنفس.</p>
                </div>
            </div>
         </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-20 container mx-auto px-6">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-white px-8 py-2 rounded-full shadow-lg border-2 border-yellow-400 inline-block">جدول الحصص الأسبوعي</h2>
           <div className="w-24 h-1 bg-black mx-auto rounded mt-2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {(schedule && schedule.length > 0 ? schedule : INITIAL_SCHEDULE).map((cls) => (
            <div key={cls.id} className="bg-white rounded-2xl p-6 shadow-xl border-t-8 border-yellow-500 hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 border border-gray-300"><Clock className="text-gray-800" size={24}/></div>
              <h3 className="font-bold text-lg mb-2">{cls.level}</h3>
              <p className="text-gray-600 text-sm mb-4 font-semibold">{cls.branch}</p>
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-bold"><Calendar size={16} className="text-yellow-600"/><span>{cls.days}</span></div>
                <div className="flex items-center gap-2 text-sm font-black text-gray-900"><Activity size={16} className="text-yellow-600"/><span>{cls.time}</span></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white pt-16 pb-24 md:pb-8 border-t-4 border-yellow-500 relative z-10 shadow-2xl">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
            <div className="flex justify-center items-center gap-2 mb-4 opacity-50">
                <img src={IMAGES.LOGO} alt="Logo" className="w-8 h-8 rounded-full grayscale" />
                <span className="font-bold">أكاديمية الشجاع للتايكوندو</span>
            </div>
            <p>© 2023 جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <button 
        onClick={openWhatsApp}
        className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-2xl hover:bg-green-600 transition-transform hover:scale-110 flex items-center justify-center animate-bounce-slow border-2 border-white"
        title="تواصل معنا عبر واتساب"
      >
        <MessageCircle size={32} />
      </button>

      {/* Modal Registration Form */}
      {showRegModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg animate-fade-in border-4 border-yellow-500" title="طلب تسجيل جديد">
             <form onSubmit={handleRegister} className="space-y-4">
               <div><label className="block text-xs font-bold mb-1">اسم الطالب الرباعي</label><input required className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none" value={regForm.name} onChange={e=>setRegForm({...regForm, name:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1">تاريخ الميلاد</label><input type="date" required className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none" value={regForm.dob} onChange={e=>setRegForm({...regForm, dob:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1">رقم هاتف ولي الأمر</label><input required className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none" value={regForm.phone} onChange={e=>setRegForm({...regForm, phone:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1">العنوان</label><input required className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none" value={regForm.address} onChange={e=>setRegForm({...regForm, address:e.target.value})}/></div>
               <div><label className="block text-xs font-bold mb-1">الفرع المطلوب</label><select className="w-full border p-2 rounded focus:ring-2 focus:ring-yellow-500 outline-none bg-white" value={regForm.branch} onChange={e=>setRegForm({...regForm, branch:e.target.value})}>
                 <option value={BRANCHES.SHAFA}>{BRANCHES.SHAFA}</option>
                 <option value={BRANCHES.ABU_NSEIR}>{BRANCHES.ABU_NSEIR}</option>
               </select></div>
               <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                 <Button variant="ghost" onClick={()=>setShowRegModal(false)}>إلغاء</Button>
                 <Button type="submit" disabled={isSubmitting}>
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
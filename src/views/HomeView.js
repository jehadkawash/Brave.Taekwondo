// src/views/HomeView.js
import React, { useState } from 'react';
import { Menu, X, MapPin, Phone, Clock, Calendar, Activity } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { IMAGES, BRANCHES, INITIAL_SCHEDULE } from '../lib/constants';

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

  const openLocation = (url) => window.open(url, '_blank');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-right" dir="rtl">
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
          </div>
        </div>
      </div>
      
      {/* Branches Section */}
      <section id="branches" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16"><h2 className="text-4xl font-bold text-gray-900 mb-4">فروعنا</h2></div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Shafa Branch */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group">
              <div className="h-64 bg-gray-800 relative overflow-hidden">
                  <img src={IMAGES.BRANCH_SHAFA} alt="Shafa Badran" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-4 right-4 text-white z-20"><h3 className="text-2xl font-bold">فرع شفا بدران</h3></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-start gap-4"><MapPin className="text-yellow-600 mt-1" /><div><p className="font-bold text-gray-900">شفا بدران - شارع رفعت شموط</p></div></div>
                <div className="flex items-center gap-4"><Phone className="text-yellow-600" /><div className="flex items-center gap-2"><a href="tel:0795629606" className="font-bold text-gray-900" dir="ltr">07 9562 9606</a></div></div>
                <Button variant="outline" className="w-full mt-4" onClick={() => openLocation('https://share.google/PGRNQACVSiOhXkmbj')}>موقعنا على الخريطة</Button>
              </div>
            </div>
            {/* Abu Nseir Branch */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition group">
              <div className="h-64 bg-gray-800 relative overflow-hidden">
                  <img src={IMAGES.BRANCH_ABU_NSEIR} alt="Abu Nseir" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute bottom-4 right-4 text-white z-20"><h3 className="text-2xl font-bold">فرع أبو نصير</h3></div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex items-start gap-4"><MapPin className="text-yellow-600 mt-1" /><div><p className="font-bold text-gray-900">أبو نصير - دوار البحرية</p></div></div>
                <div className="flex items-center gap-4"><Phone className="text-yellow-600" /><div className="flex items-center gap-2"><a href="tel:0790368603" className="font-bold text-gray-900" dir="ltr">07 9036 8603</a></div></div>
                <Button variant="outline" className="w-full mt-4" onClick={() => openLocation('https://share.google/6rSHFxa03RG6n9WH0')}>موقعنا على الخريطة</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
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

      {/* Footer */}
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

export default HomeView;
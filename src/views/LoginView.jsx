// src/views/LoginView.jsx
import React, { useState } from 'react';
import { ChevronRight, User, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Send, Phone, AlertCircle } from 'lucide-react';
import { IMAGES } from '../lib/constants'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { collection, addDoc } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';

const LoginView = ({ setView, handleLogin, loginError }) => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // حالة إظهار كلمة المرور
  const [focusedField, setFocusedField] = useState(null);
  
  // --- حالات نسيان كلمة المرور ---
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotForm, setForgotForm] = useState({ studentName: '', phone: '' });
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  // --- دالة إرسال طلب استعادة كلمة المرور ---
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingForgot(true);
    try {
      // نرسل الطلب مباشرة إلى "ملاحظات الإدارة" ليظهر لك في الداشبورد
      const currentDate = new Date();
      const monthKey = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
      
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'admin_notes'), {
        text: `🔴 طلب استعادة كلمة مرور:\n- الطالب: ${forgotForm.studentName}\n- هاتف: ${forgotForm.phone}`,
        type: 'note',
        transactionType: 'expense', // قيمة افتراضية
        date: currentDate.toLocaleDateString('ar-JO'),
        monthKey: monthKey,
        createdAt: currentDate.toISOString(),
        isUrgent: true
      });

      alert("تم إرسال الطلب للإدارة! سيتم التواصل معك وتزويدك بالبيانات.");
      setShowForgotModal(false);
      setForgotForm({ studentName: '', phone: '' });
    } catch (error) {
      console.error("Error sending request:", error);
      alert("حدث خطأ، حاول مرة أخرى.");
    } finally {
      setIsSubmittingForgot(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden font-sans" dir="rtl">
      
      {/* --- خلفية وتأثيرات --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-600/5 rounded-full blur-[100px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
         <div className="absolute inset-0 opacity-[0.05]" style={{backgroundImage: 'radial-gradient(#FDE047 1px, transparent 1px)', backgroundSize: '40px 40px'}}></div>
      </div>

      {/* --- بطاقة الدخول --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* عنصر جمالي: حزام أسود 3D يلتف حول البطاقة */}
        <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute -top-6 -right-6 w-32 h-32 z-20 pointer-events-none hidden md:block"
        >
            <div className="w-full h-8 bg-gradient-to-r from-gray-900 via-black to-gray-800 shadow-2xl transform rotate-45 border-y border-gray-700/50 flex items-center justify-center">
                <div className="w-full h-[1px] bg-white/10"></div>
            </div>
        </motion.div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
            
            {/* إضاءة علوية */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>

            {/* اللوجو والعنوان */}
            <div className="text-center mb-10 relative">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative w-24 h-24 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
                >
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
                    <img src={IMAGES.LOGO} alt="Logo" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </motion.div>
                
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-black text-white tracking-wide"
                >
                  بوابة <span className="text-yellow-500">الأهل والإدارة</span>
                </motion.h2>
                <p className="text-gray-400 text-xs md:text-sm mt-2 font-medium">سجل دخولك لمتابعة الأبطال</p>
            </div>

            {/* رسالة الخطأ */}
            {loginError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-xs font-bold flex items-center justify-center gap-2"
                >
                    <ShieldCheck size={16}/> {loginError}
                </motion.div>
            )}
            
            {/* النموذج */}
            <form className="space-y-5" onSubmit={onSubmit}>
                
                {/* حقل اسم المستخدم */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className={`relative group/input`}
                >
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'user' ? 'text-yellow-500' : 'text-gray-500'}`}>
                        <User size={20} />
                    </div>
                    <input 
                        className={`w-full bg-black/30 border-2 text-white p-4 pr-12 rounded-2xl outline-none placeholder-gray-600 font-medium text-sm md:text-base transition-all duration-300
                        ${focusedField === 'user' ? 'border-yellow-500/50 bg-black/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/5 hover:border-white/10'}`}
                        type="text"
                        placeholder="اسم المستخدم أو الإيميل" 
                        value={username} 
                        onChange={e=>setUsername(e.target.value)} 
                        onFocus={() => setFocusedField('user')}
                        onBlur={() => setFocusedField(null)}
                        required
                    />
                </motion.div>

                {/* حقل كلمة المرور */}
                <motion.div 
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`relative group/input`}
                >
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'pass' ? 'text-yellow-500' : 'text-gray-500'}`}>
                        <Lock size={20} />
                    </div>
                    <input 
                        className={`w-full bg-black/30 border-2 text-white p-4 pr-12 pl-12 rounded-2xl outline-none placeholder-gray-600 font-medium text-sm md:text-base transition-all duration-300
                        ${focusedField === 'pass' ? 'border-yellow-500/50 bg-black/50 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/5 hover:border-white/10'}`}
                        type={showPassword ? "text" : "password"}
                        placeholder="كلمة المرور" 
                        value={password} 
                        onChange={e=>setPassword(e.target.value)} 
                        onFocus={() => setFocusedField('pass')}
                        onBlur={() => setFocusedField(null)}
                        required
                    />
                    {/* زر إظهار/إخفاء الباسورد */}
                    <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                    </button>
                </motion.div>

                {/* زر نسيان كلمة المرور */}
                <div className="flex justify-end">
                    <button 
                        type="button" 
                        onClick={() => setShowForgotModal(true)}
                        className="text-xs text-gray-400 hover:text-yellow-500 transition-colors font-medium flex items-center gap-1"
                    >
                        نسيت كلمة المرور؟
                    </button>
                </div>

                {/* زر الدخول */}
                <motion.button 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-lg font-black rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.2)] hover:shadow-[0_0_50px_rgba(234,179,8,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                    دخول
                    <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform"/>
                </motion.button>
            </form>
            
            {/* زر العودة */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8 text-center border-t border-white/5 pt-6"
            >
                <button onClick={()=>setView('home')} className="text-gray-500 hover:text-white text-sm font-bold flex items-center justify-center gap-2 w-full transition-colors group">
                    <ChevronRight size={16} className="group-hover:text-yellow-500 transition-colors"/> العودة للصفحة الرئيسية
                </button>
            </motion.div>
        </div>
      </motion.div>

      {/* --- نافذة نسيان كلمة المرور (Modal) --- */}
      <AnimatePresence>
        {showForgotModal && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowForgotModal(false)}
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
                >
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-yellow-500">
                            <AlertCircle size={24}/>
                        </div>
                        <h3 className="text-xl font-bold text-white">استعادة البيانات</h3>
                        <p className="text-xs text-gray-400 mt-1">أدخل بياناتك وسيتم إرسالها للإدارة للتحقق</p>
                    </div>

                    <form onSubmit={handleForgotSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">اسم الطالب</label>
                            <div className="relative">
                                <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                                <input 
                                    required
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pr-9 text-white text-sm focus:border-yellow-500 outline-none transition-colors"
                                    placeholder="الاسم الرباعي"
                                    value={forgotForm.studentName}
                                    onChange={(e) => setForgotForm({...forgotForm, studentName: e.target.value})}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1.5">رقم الهاتف</label>
                            <div className="relative">
                                <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                                <input 
                                    required
                                    type="tel"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 pr-9 text-white text-sm focus:border-yellow-500 outline-none transition-colors"
                                    placeholder="079xxxxxxx"
                                    value={forgotForm.phone}
                                    onChange={(e) => setForgotForm({...forgotForm, phone: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button 
                                type="button" 
                                onClick={() => setShowForgotModal(false)}
                                className="flex-1 py-3 rounded-xl text-gray-400 font-bold text-sm hover:bg-white/5 transition-colors"
                            >
                                إلغاء
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmittingForgot}
                                className="flex-[2] py-3 bg-yellow-500 hover:bg-yellow-400 text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                {isSubmittingForgot ? 'جاري الإرسال...' : <><Send size={16}/> إرسال الطلب</>}
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

export default LoginView;
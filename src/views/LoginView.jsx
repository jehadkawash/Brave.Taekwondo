// src/views/LoginView.jsx
import React, { useState } from 'react';
import { ChevronRight, User, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { IMAGES } from '../lib/constants'; 
import { motion } from 'framer-motion'; // استيراد الأنيميشن

const LoginView = ({ setView, handleLogin, loginError }) => {
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null); // لمعرفة الحقل النشط وتلوينه

  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };
  
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden font-sans" dir="rtl">
      
      {/* --- خلفية متحركة فخمة --- */}
      <div className="absolute inset-0 z-0">
         {/* تدرج لوني ذهبي خافت في الخلفية */}
         <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-900/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
         {/* شبكة خفيفة */}
         <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#FDE047 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
      </div>

      {/* --- بطاقة الدخول --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden group">
            
            {/* تأثير إضاءة علوي */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

            {/* اللوجو والعنوان */}
            <div className="text-center mb-10">
                <motion.div 
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative w-28 h-28 mx-auto mb-6"
                >
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
                    <img src={IMAGES.LOGO} alt="Logo" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-black text-white tracking-tight"
                >
                  بوابة <span className="text-yellow-500">الأبطال</span>
                </motion.h2>
                <p className="text-gray-400 text-sm mt-2 font-medium">سجل دخولك لمتابعة التقدم</p>
            </div>

            {/* رسالة الخطأ */}
            {loginError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center font-bold flex items-center justify-center gap-2"
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
                  className={`relative transition-all duration-300 ${focusedField === 'user' ? 'scale-105' : 'scale-100'}`}
                >
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'user' ? 'text-yellow-500' : 'text-gray-500'}`}>
                        <User size={20} />
                    </div>
                    <input 
                        className={`w-full bg-black/20 border-2 text-white p-4 pr-12 rounded-2xl outline-none placeholder-gray-500 font-bold transition-all duration-300
                        ${focusedField === 'user' ? 'border-yellow-500 bg-black/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/5 hover:border-white/10'}`}
                        type="text"
                        placeholder="اسم المستخدم" 
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
                  className={`relative transition-all duration-300 ${focusedField === 'pass' ? 'scale-105' : 'scale-100'}`}
                >
                    <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${focusedField === 'pass' ? 'text-yellow-500' : 'text-gray-500'}`}>
                        <Lock size={20} />
                    </div>
                    <input 
                        className={`w-full bg-black/20 border-2 text-white p-4 pr-12 rounded-2xl outline-none placeholder-gray-500 font-bold transition-all duration-300
                        ${focusedField === 'pass' ? 'border-yellow-500 bg-black/40 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-white/5 hover:border-white/10'}`}
                        type="password" 
                        placeholder="كلمة المرور" 
                        value={password} 
                        onChange={e=>setPassword(e.target.value)} 
                        onFocus={() => setFocusedField('pass')}
                        onBlur={() => setFocusedField(null)}
                        required
                    />
                </motion.div>

                {/* زر الدخول */}
                <motion.button 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    className="w-full py-4 mt-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-lg font-black rounded-2xl shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:shadow-[0_0_50px_rgba(234,179,8,0.5)] transition-all flex items-center justify-center gap-2 group"
                >
                    تسجيل الدخول
                    <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform"/>
                </motion.button>
            </form>
            
            {/* زر العودة */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 text-center border-t border-white/10 pt-6"
            >
                <button onClick={()=>setView('home')} className="text-gray-500 hover:text-white text-sm font-bold flex items-center justify-center gap-2 w-full transition-colors group">
                    <ChevronRight size={16} className="group-hover:text-yellow-500 transition-colors"/> العودة للصفحة الرئيسية
                </button>
            </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginView;
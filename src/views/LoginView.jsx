// src/views/LoginView.jsx
import React, { useState } from 'react';
import { ChevronRight, User, Lock, ArrowRight, ShieldCheck, Eye, EyeOff, Send, Phone, AlertCircle } from 'lucide-react';
import { IMAGES } from '../lib/constants';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, addDoc } from "firebase/firestore";
import { db, appId } from '../lib/firebase';

// FIX: loginError and setLoginError are now received from App.jsx
const LoginView = ({ setView, handleLogin, loginError, setLoginError }) => {
  const [username, setUsername]         = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Forgot password modal ---
  const [showForgotModal, setShowForgotModal]   = useState(false);
  const [forgotForm, setForgotForm]             = useState({ studentName: '', phone: '' });
  const [isSubmittingForgot, setIsSubmittingForgot] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    await handleLogin(username, password);
    setIsSubmitting(false);
  };

  // Clear error as user types so old message disappears
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (setLoginError) setLoginError('');
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (setLoginError) setLoginError('');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingForgot(true);
    try {
      const currentDate = new Date();
      const monthKey = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'admin_notes'), {
        text: `🔴 طلب استعادة كلمة مرور:\n- الطالب: ${forgotForm.studentName}\n- هاتف: ${forgotForm.phone}`,
        type: 'note',
        transactionType: 'expense',
        date: currentDate.toLocaleDateString('en-GB'),
        monthKey: monthKey,
        createdAt: currentDate.toISOString(),
        isUrgent: true,
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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden font-sans selection:bg-yellow-500/30" dir="rtl">

      {/* Background effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#FDE047 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Decorative belt element */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute -top-6 -right-6 w-32 h-32 z-20 pointer-events-none hidden md:block"
        >
          <div className="w-full h-8 bg-gradient-to-r from-slate-800 via-slate-950 to-slate-900 shadow-2xl transform rotate-45 border-y border-slate-700/50 flex items-center justify-center">
            <div className="w-full h-[1px] bg-yellow-500/20"></div>
          </div>
        </motion.div>

        <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/80 rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-black relative overflow-hidden group">

          {/* Top glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>

          {/* Logo & Title */}
          <div className="text-center mb-10 relative">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="relative w-24 h-24 mx-auto mb-6 group-hover:scale-105 transition-transform duration-500"
            >
              <div className="absolute inset-0 bg-yellow-500/10 rounded-full blur-xl animate-pulse"></div>
              <img src={IMAGES.LOGO} alt="Logo" className="w-full h-full object-contain relative z-10 drop-shadow-2xl" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-black text-slate-100 tracking-wide"
            >
              بوابة <span className="text-yellow-500">الأهل والإدارة</span>
            </motion.h2>
            <p className="text-slate-400 text-xs md:text-sm mt-2 font-medium">سجل دخولك لمتابعة الأبطال</p>
          </div>

          {/* FIX: Error message shown inside card — now works because loginError prop is passed */}
          <AnimatePresence>
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-xl mb-6 text-xs font-bold flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} /> {loginError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form className="space-y-5" onSubmit={onSubmit}>

            {/* Username */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative group/input"
            >
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'user' ? 'text-yellow-500' : 'text-slate-500'}`}>
                <User size={20} />
              </div>
              <input
                className={`w-full bg-slate-950/60 border-2 text-slate-200 p-4 pr-12 rounded-2xl outline-none placeholder-slate-600 font-medium text-sm md:text-base transition-all duration-300
                  ${focusedField === 'user' ? 'border-yellow-500/50 bg-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}
                type="text"
                placeholder="اسم المستخدم أو الإيميل"
                value={username}
                onChange={handleUsernameChange}
                onFocus={() => setFocusedField('user')}
                onBlur={() => setFocusedField(null)}
                autoComplete="username"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative group/input"
            >
              <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'pass' ? 'text-yellow-500' : 'text-slate-500'}`}>
                <Lock size={20} />
              </div>
              <input
                className={`w-full bg-slate-950/60 border-2 text-slate-200 p-4 pr-12 pl-12 rounded-2xl outline-none placeholder-slate-600 font-medium text-sm md:text-base transition-all duration-300
                  ${focusedField === 'pass' ? 'border-yellow-500/50 bg-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.1)]' : 'border-slate-800 hover:border-slate-700'}`}
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                value={password}
                onChange={handlePasswordChange}
                onFocus={() => setFocusedField('pass')}
                onBlur={() => setFocusedField(null)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs text-slate-400 hover:text-yellow-500 transition-colors font-medium"
              >
                نسيت كلمة المرور؟
              </button>
            </div>

            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-slate-950 text-lg font-black rounded-2xl shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'جاري التحقق...' : 'دخول'}
              {!isSubmitting && <ArrowRight size={20} className="group-hover:-translate-x-1 transition-transform" />}
            </motion.button>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center border-t border-slate-800 pt-6"
          >
            <button
              onClick={() => setView('home')}
              className="text-slate-500 hover:text-slate-300 text-sm font-bold flex items-center justify-center gap-2 w-full transition-colors group"
            >
              <ChevronRight size={16} className="group-hover:text-yellow-500 transition-colors" /> العودة للصفحة الرئيسية
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowForgotModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-3 text-yellow-500 border border-yellow-500/20">
                  <AlertCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-100">استعادة البيانات</h3>
                <p className="text-xs text-slate-400 mt-1">أدخل بياناتك وسيتم إرسالها للإدارة للتحقق</p>
              </div>

              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">اسم الطالب</label>
                  <div className="relative">
                    <User size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pr-9 text-slate-200 text-sm focus:border-yellow-500 outline-none transition-colors placeholder-slate-600"
                      placeholder="الاسم الرباعي"
                      value={forgotForm.studentName}
                      onChange={(e) => setForgotForm({ ...forgotForm, studentName: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">رقم الهاتف</label>
                  <div className="relative">
                    <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      required
                      type="tel"
                      pattern="[0-9]{10}"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pr-9 text-slate-200 text-sm focus:border-yellow-500 outline-none transition-colors placeholder-slate-600"
                      placeholder="079xxxxxxx"
                      value={forgotForm.phone}
                      onChange={(e) => setForgotForm({ ...forgotForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-3 rounded-xl text-slate-400 font-bold text-sm hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingForgot}
                    className="flex-[2] py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-yellow-500/20 disabled:opacity-60"
                  >
                    {isSubmittingForgot ? 'جاري الإرسال...' : <><Send size={16} /> إرسال الطلب</>}
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

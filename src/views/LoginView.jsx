// src/views/LoginView.jsx
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { IMAGES } from '../lib/constants';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../lib/firebase'; // تأكد أن المسار صحيح

const LoginView = ({ setView }) => {
  const [email, setEmail] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleFirebaseLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // هذا السطر هو الذي يتصل بفايربيس ويتحقق من المستخدم
      await signInWithEmailAndPassword(auth, email, password);
      // ملاحظة: لن نقوم بـ setView هنا، لأن App.js سيستمع للتغيير تلقائياً
    } catch (err) {
      console.error(err);
      setError("البيانات غير صحيحة أو لا تملك صلاحية");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden" dir="rtl">
      <Card className="w-full max-w-md relative z-10 border-t-4 border-yellow-500">
        <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg p-2">
                <img src={IMAGES.LOGO} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
        </div>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{error}</div>}
        <form className="space-y-5" onSubmit={handleFirebaseLogin}>
          <input 
            className="w-full border p-3 rounded-lg" 
            placeholder="البريد الإلكتروني (مثال: admin@brave.com)" 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            type="email"
            required
          />
          <input 
            className="w-full border p-3 rounded-lg" 
            type="password" 
            placeholder="كلمة المرور" 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required
          />
          <Button type="submit" className="w-full py-3 text-lg shadow-lg shadow-yellow-500/30">
            {loading ? "جاري التحقق..." : "دخول"}
          </Button>
        </form>
        <div className="mt-8 text-center border-t pt-4">
            <button onClick={()=>setView('home')} className="text-gray-500 hover:text-gray-800 text-sm font-medium flex items-center justify-center gap-2 w-full">
                <ChevronRight size={16}/> العودة للصفحة الرئيسية
            </button>
        </div>
      </Card>
    </div>
  );
};

export default LoginView;
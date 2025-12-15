// src/views/LoginView.jsx
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button, Card } from '../components/UIComponents'; // تأكد من مسار المكونات عندك
import { IMAGES } from '../lib/constants'; // تأكد من مسار الثوابت

const LoginView = ({ setView, handleLogin, loginError }) => {
  // غيرنا الاسم من email إلى username ليكون أدق
  const [username, setUsername] = useState(''); 
  const [password, setPassword] = useState('');
  
  // دالة الإرسال أصبحت بسيطة جداً، فقط تمرر البيانات للأب (App.js)
  const onSubmit = (e) => {
    e.preventDefault();
    handleLogin(username, password);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden" dir="rtl">
      <Card className="w-full max-w-md relative z-10 border-t-4 border-yellow-500">
        <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg p-2">
                {/* تأكد أن مسار الصورة صحيح */}
                <img src={IMAGES.LOGO} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
        </div>

        {/* عرض رسالة الخطأ القادمة من App.js */}
        {loginError && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{loginError}</div>}
        
        <form className="space-y-5" onSubmit={onSubmit}>
          <input 
            className="w-full border p-3 rounded-lg" 
            // التغيير هنا: type="text" ليقبل اسم المستخدم أو الإيميل
            type="text"
            placeholder="اسم المستخدم أو البريد الإلكتروني" 
            value={username} 
            onChange={e=>setUsername(e.target.value)} 
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
            دخول
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
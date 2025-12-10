// src/views/LoginView.js
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button, Card } from '../components/UIComponents';
import { IMAGES } from '../lib/constants';

const LoginView = ({ setView, handleLogin, loginError }) => {
  const [u, setU] = useState(''); 
  const [p, setP] = useState('');
  
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 relative overflow-hidden" dir="rtl">
      <Card className="w-full max-w-md relative z-10 border-t-4 border-yellow-500">
        <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg p-2">
                <img src={IMAGES.LOGO} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">تسجيل الدخول</h2>
        </div>
        {loginError && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">{loginError}</div>}
        <form className="space-y-5" onSubmit={(e)=>{e.preventDefault(); handleLogin(u,p)}}>
          <input className="w-full border p-3 rounded-lg" placeholder="اسم المستخدم" value={u} onChange={e=>setU(e.target.value)} />
          <input className="w-full border p-3 rounded-lg" type="password" placeholder="كلمة المرور" value={p} onChange={e=>setP(e.target.value)} />
          <Button type="submit" className="w-full py-3 text-lg shadow-lg shadow-yellow-500/30">دخول</Button>
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
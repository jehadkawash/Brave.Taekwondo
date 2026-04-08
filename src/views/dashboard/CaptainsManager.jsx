// src/views/dashboard/CaptainsManager.jsx
import React, { useState } from 'react';
import { Edit, Trash2, User, Lock, MapPin, DollarSign, Shield, Check, Loader2 } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { BRANCHES } from '../../lib/constants';

// استيرادات فايربيس الجديدة
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, appId, firebaseConfig } from '../../lib/firebase';

export default function CaptainsManager({ captains, captainsCollection }) {
    const [form, setForm] = useState({ name: '', branch: BRANCHES.SHAFA, username: '', password: '', salary: '', holidays: [], withdrawals: [] });
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // حالة التحميل

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // تجهيز الإيميل (إذا أدخل اسم مستخدم عادي، نحوله لإيميل ليتوافق مع فايربيس)
            const emailToUse = form.username.includes('@') ? form.username : `${form.username}@brave.com`;

            if (editingId) { 
                // 1. حالة التعديل
                await captainsCollection.update(editingId, { ...form, username: emailToUse }); 
                
                // تحديث الفرع والصلاحية في جدول users الأساسي أيضاً
                const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', emailToUse);
                await setDoc(userRef, {
                    name: form.name,
                    role: 'captain',
                    branch: form.branch
                }, { merge: true });

                setEditingId(null); 
                alert("تم تعديل بيانات الكابتن بنجاح!");
            } else { 
                // 2. حالة إضافة كابتن جديد (استخدام Secondary App لمنع خروج المدير)
                const secondaryAppName = "SecondaryApp_" + Date.now(); // اسم فريد لتجنب التكرار
                const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
                const secondaryAuth = getAuth(secondaryApp);

                // إنشاء الحساب في Firebase Auth
                await createUserWithEmailAndPassword(secondaryAuth, emailToUse, form.password);

                // إضافة الصلاحيات في جدول users
                const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', emailToUse);
                await setDoc(userRef, {
                    name: form.name,
                    role: 'captain',
                    isSuper: false,
                    branch: form.branch,
                    createdAt: new Date().toISOString()
                });

                // إضافة الكابتن لجدول الكباتن عشان يظهر في الداشبورد
                await captainsCollection.add({ ...form, username: emailToUse, role: 'captain' }); 

                // تسجيل الخروج من النسخة المؤقتة
                await signOut(secondaryAuth);
                
                alert("تم إضافة الكابتن وحسابه بنجاح!");
            }
            
            // تصفير الحقول بعد الانتهاء
            setForm({ name: '', branch: BRANCHES.SHAFA, username: '', password: '', salary: '', holidays: [], withdrawals: [] });
        } catch (error) {
            console.error("Error saving captain:", error);
            if (error.code === 'auth/email-already-in-use') {
                alert("اسم المستخدم أو الإيميل هذا مستخدم مسبقاً لكابتن آخر!");
            } else if (error.code === 'auth/weak-password') {
                alert("كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف أو أرقام على الأقل).");
            } else {
                alert("حدث خطأ أثناء حفظ البيانات: " + error.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in font-sans pb-20 md:pb-0">
            
            {/* --- Form Section --- */}
            <Card title={editingId ? 'تعديل بيانات الكابتن' : 'إضافة كابتن جديد'} icon={Shield} className="bg-slate-900 border-slate-800">
                <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-end">
                    
                    {/* Name */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                            <User size={12}/> الاسم الكامل
                        </label>
                        <input 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors placeholder-slate-600" 
                            placeholder="اسم الكابتن" 
                            value={form.name} 
                            onChange={e=>setForm({...form, name:e.target.value})} 
                            required
                        />
                    </div>

                    {/* Branch */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                            <MapPin size={12}/> الفرع المسؤول عنه
                        </label>
                        <select 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors" 
                            value={form.branch} 
                            onChange={e=>setForm({...form, branch:e.target.value})}
                        >
                            <option value={BRANCHES.SHAFA}>شفا بدران</option>
                            <option value={BRANCHES.ABU_NSEIR}>أبو نصير</option>
                        </select>
                    </div>

                    {/* Salary */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                            <DollarSign size={12}/> الراتب الأساسي
                        </label>
                        <input 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors placeholder-slate-600" 
                            type="number" 
                            placeholder="0.00" 
                            value={form.salary} 
                            onChange={e=>setForm({...form, salary:e.target.value})} 
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                            <Shield size={12}/> اسم المستخدم (للدخول)
                        </label>
                        <input 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors placeholder-slate-600 font-mono text-left dir-ltr" 
                            placeholder="مثال: ahmad أو ahmad@brave.com" 
                            value={form.username} 
                            onChange={e=>setForm({...form, username:e.target.value})} 
                            disabled={!!editingId} // لا يمكن تغيير اسم المستخدم أثناء التعديل
                            required
                        />
                        {/* تلميح صغير للإدارة */}
                        {!editingId && <span className="text-[10px] text-slate-500 mt-1 block">سيتم إضافة @brave.com تلقائياً إذا لم تكتبها</span>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                            <Lock size={12}/> كلمة المرور
                        </label>
                        <input 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors placeholder-slate-600 font-mono text-left dir-ltr" 
                            placeholder="••••••" 
                            value={form.password} 
                            onChange={e=>setForm({...form, password:e.target.value})} 
                            disabled={!!editingId} // تغيير الباسورد يتم من الفايربيس حالياً للأمان
                            required={!editingId}
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <Button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`w-full font-bold shadow-lg py-3 rounded-xl transition-all
                                ${isSubmitting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-yellow-500/20'}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2 justify-center"><Loader2 size={18} className="animate-spin"/> جاري الحفظ...</span>
                            ) : editingId ? (
                                <span className="flex items-center gap-2 justify-center"><Check size={18}/> حفظ التعديلات</span>
                            ) : (
                                'إضافة كابتن'
                            )}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* --- List Section --- */}
            <div>
                <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <User size={24} className="text-blue-500"/> طاقم المدربين
                </h3>
                
                {captains.length === 0 ? (
                    <div className="text-center p-12 bg-slate-900 rounded-2xl border border-slate-800 border-dashed text-slate-500">
                        لا يوجد كباتن مسجلين حالياً
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {captains.map(cap => (
                            <div key={cap.id} className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden group hover:border-slate-700 transition-all relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-500 to-yellow-700"></div>
                                
                                <div className="p-5 pl-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center text-yellow-500 font-bold text-xl border border-slate-700 shadow-inner uppercase">
                                                {cap.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-100">{cap.name}</h4>
                                                <span className="text-xs text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                                    {cap.branch}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={()=>{setEditingId(cap.id); setForm(cap);}} 
                                                className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all"
                                                title="تعديل"
                                            >
                                                <Edit size={16}/>
                                            </button>
                                            <button 
                                                onClick={async () => {
                                                    if(window.confirm('هل أنت متأكد من حذف الكابتن؟ (سيتم حذفه من القائمة فقط)')) {
                                                        await captainsCollection.remove(cap.id);
                                                    }
                                                }} 
                                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all"
                                                title="حذف"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 mb-2">
                                            <span className="text-slate-500 flex items-center gap-1"><DollarSign size={14}/> الراتب:</span>
                                            <span className="font-mono font-bold text-emerald-400">{cap.salary} JD</span>
                                        </div>
                                        <div className="text-xs">
                                            <span className="text-slate-600 block mb-0.5">تسجيل الدخول (Login ID)</span>
                                            <span className="font-mono text-slate-300 bg-slate-900 px-2 py-1 rounded block truncate border border-slate-800">
                                                {cap.username}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
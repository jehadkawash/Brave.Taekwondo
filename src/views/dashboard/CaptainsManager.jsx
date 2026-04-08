// src/views/dashboard/CaptainsManager.jsx
import React, { useState } from 'react';
import { Edit, Trash2, User, Lock, MapPin, DollarSign, Shield, Check, Loader2, Key, Crown } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { BRANCHES } from '../../lib/constants';

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, appId, firebaseConfig } from '../../lib/firebase';

// قائمة جميع الصلاحيات المتاحة في النظام مقسمة لمجموعات
const PERMISSIONS_LIST = [
    { id: 'dashboard', label: 'الإحصائيات الرئيسية', category: 'الأساسيات' },
    { id: 'attendance', label: 'تسجيل الحضور والغياب', category: 'الأساسيات' },
    
    { id: 'students', label: 'إدارة وتعديل الطلاب', category: 'شؤون الطلاب' },
    { id: 'subscriptions', label: 'الاشتراكات وتجديدها', category: 'شؤون الطلاب' },
    
    { id: 'tests', label: 'فحوصات الأحزمة', category: 'الرياضة والتدريب' },
    { id: 'events', label: 'إدارة التدريبات والفعاليات', category: 'الرياضة والتدريب' },
    { id: 'weight', label: 'متابعة الأوزان', category: 'الرياضة والتدريب' },
    
    { id: 'finance', label: 'الوصولات والمالية', category: 'المالية والتقارير' },
    { id: 'reports', label: 'التقارير الشاملة', category: 'المالية والتقارير' },
    { id: 'archive', label: 'الأرشيف', category: 'المالية والتقارير' },
    
    { id: 'registrations', label: 'طلبات التسجيل الجديدة', category: 'الإدارة والتواصل' },
    { id: 'student_notes', label: 'ملاحظات ورسائل الطلاب', category: 'الإدارة والتواصل' },
    { id: 'notes', label: 'ملاحظات الإدارة الداخلية', category: 'الإدارة والتواصل' },
    { id: 'news', label: 'الأخبار والعروض', category: 'الإدارة والتواصل' },
    { id: 'schedule', label: 'جدول الحصص', category: 'الإدارة والتواصل' }
];

export default function CaptainsManager({ captains, captainsCollection }) {
    // تم إضافة isSuper للحالة الافتراضية
    const [form, setForm] = useState({ name: '', branch: BRANCHES.SHAFA, username: '', password: '', salary: '', permissions: [], isSuper: false });
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // دالة للتحكم باختيار الصلاحيات
    const togglePermission = (permId) => {
        const currentPerms = form.permissions || [];
        if (currentPerms.includes(permId)) {
            setForm({ ...form, permissions: currentPerms.filter(p => p !== permId) });
        } else {
            setForm({ ...form, permissions: [...currentPerms, permId] });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const emailToUse = form.username.includes('@') ? form.username : `${form.username}@brave.com`;
            
            // تجهيز البيانات للحفظ بناءً على هل هو سوبر أدمن أم لا
            const roleToSave = form.isSuper ? 'admin' : 'captain';
            // السوبر أدمن يحصل على كل الصلاحيات برمجياً، لذلك نخزنها كاملة له للتأكيد
            const permsToSave = form.isSuper ? PERMISSIONS_LIST.map(p => p.id) : (form.permissions || []);

            if (editingId) { 
                await captainsCollection.update(editingId, { 
                    ...form, 
                    username: emailToUse,
                    role: roleToSave,
                    permissions: permsToSave
                }); 
                
                const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', emailToUse);
                await setDoc(userRef, {
                    name: form.name,
                    role: roleToSave,
                    isSuper: form.isSuper,
                    branch: form.branch,
                    permissions: permsToSave
                }, { merge: true });

                setEditingId(null); 
                alert("تم تعديل بيانات وصلاحيات المستخدم بنجاح!");
            } else { 
                const secondaryAppName = "SecondaryApp_" + Date.now();
                const secondaryApp = initializeApp(firebaseConfig, secondaryAppName);
                const secondaryAuth = getAuth(secondaryApp);

                await createUserWithEmailAndPassword(secondaryAuth, emailToUse, form.password);

                const userRef = doc(db, 'artifacts', appId, 'public', 'data', 'users', emailToUse);
                await setDoc(userRef, {
                    name: form.name,
                    role: roleToSave,
                    isSuper: form.isSuper,
                    branch: form.branch,
                    permissions: permsToSave,
                    createdAt: new Date().toISOString()
                });

                await captainsCollection.add({ 
                    ...form, 
                    username: emailToUse, 
                    role: roleToSave,
                    permissions: permsToSave 
                }); 
                
                await signOut(secondaryAuth);
                
                alert("تم إضافة المستخدم وحسابه بنجاح!");
            }
            
            // تصفير النموذج
            setForm({ name: '', branch: BRANCHES.SHAFA, username: '', password: '', salary: '', permissions: [], isSuper: false });
        } catch (error) {
            console.error("Error saving user:", error);
            if (error.code === 'auth/email-already-in-use') alert("اسم المستخدم أو الإيميل هذا مستخدم مسبقاً لشخص آخر!");
            else if (error.code === 'auth/weak-password') alert("كلمة المرور ضعيفة جداً (يجب أن تكون 6 أحرف أو أرقام على الأقل).");
            else alert("حدث خطأ أثناء حفظ البيانات: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const groupedPermissions = PERMISSIONS_LIST.reduce((acc, perm) => {
        if (!acc[perm.category]) acc[perm.category] = [];
        acc[perm.category].push(perm);
        return acc;
    }, {});

    return (
        <div className="space-y-8 animate-fade-in font-sans pb-20 md:pb-0">
            
            <Card title={editingId ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'} icon={Shield} className="bg-slate-900 border-slate-800">
                <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 items-start">
                    
                    {/* الحقول الأساسية */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1"><User size={12}/> الاسم الكامل</label>
                            <input className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors" placeholder="اسم المستخدم" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1"><MapPin size={12}/> الفرع الأساسي</label>
                            <select className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors" value={form.branch} onChange={e=>setForm({...form, branch:e.target.value})}>
                                <option value={BRANCHES.SHAFA}>شفا بدران</option>
                                <option value={BRANCHES.ABU_NSEIR}>أبو نصير</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1"><DollarSign size={12}/> الراتب الأساسي (اختياري)</label>
                            <input className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors" type="number" placeholder="0.00" value={form.salary} onChange={e=>setForm({...form, salary:e.target.value})} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1"><Shield size={12}/> اسم المستخدم (للدخول)</label>
                            <input className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors font-mono text-left dir-ltr" placeholder="مثال: ahmad أو ahmad@brave.com" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} disabled={!!editingId} required />
                            {!editingId && <span className="text-[10px] text-slate-500 mt-1 block">سيتم إضافة @brave.com تلقائياً</span>}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1"><Lock size={12}/> كلمة المرور</label>
                            <input className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors font-mono text-left dir-ltr" placeholder="••••••" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} disabled={!!editingId} required={!editingId} />
                        </div>
                        
                        {/* زر الترقية لمدير عام (Super Admin) */}
                        <div className="pt-2">
                            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${form.isSuper ? 'bg-amber-500/10 border-amber-500/50' : 'bg-slate-950 border-slate-700 hover:border-slate-500'}`}>
                                <div className="relative flex items-center justify-center">
                                    <input 
                                        type="checkbox" 
                                        className="peer appearance-none w-6 h-6 border-2 border-slate-600 rounded bg-slate-900 checked:bg-amber-500 checked:border-amber-500 transition-all cursor-pointer"
                                        checked={form.isSuper}
                                        onChange={(e) => setForm({...form, isSuper: e.target.checked})}
                                    />
                                    <Crown size={14} className="absolute text-slate-900 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity font-bold"/>
                                </div>
                                <div>
                                    <span className={`block font-bold ${form.isSuper ? 'text-amber-500' : 'text-slate-300'}`}>مدير عام (شريك)</span>
                                    <span className="text-[10px] text-slate-500 block">يمتلك كافة الصلاحيات بدون قيود</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* --- قسم الصلاحيات المتقدم --- */}
                    <div className="md:col-span-2 lg:col-span-1 bg-slate-950/50 p-4 rounded-xl border border-slate-800 h-full flex flex-col">
                        <label className="text-sm font-bold text-yellow-500 block mb-4 flex items-center gap-2 border-b border-slate-800 pb-2">
                            <Key size={16}/> تخصيص الصلاحيات للشاشة
                        </label>
                        
                        {form.isSuper ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5">
                                <Crown size={48} className="text-amber-500/50 mb-4 animate-pulse"/>
                                <h4 className="text-amber-500 font-bold mb-2">صلاحيات مطلقة</h4>
                                <p className="text-xs text-amber-500/70 leading-relaxed">
                                    هذا المستخدم هو "مدير عام"، ويمتلك صلاحية الوصول إلى جميع الشاشات والإعدادات والتقارير لجميع الفروع تلقائياً.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-1 space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                                        <div key={category} className="mb-3">
                                            <h4 className="text-xs font-black text-slate-500 mb-2">{category}</h4>
                                            <div className="space-y-2">
                                                {perms.map(perm => (
                                                    <label key={perm.id} className="flex items-center gap-3 cursor-pointer group hover:bg-slate-800/50 p-1.5 rounded-lg transition-colors">
                                                        <div className="relative flex items-center justify-center">
                                                            <input 
                                                                type="checkbox" 
                                                                className="peer appearance-none w-5 h-5 border-2 border-slate-600 rounded bg-slate-900 checked:bg-yellow-500 checked:border-yellow-500 transition-all cursor-pointer"
                                                                checked={form.permissions?.includes(perm.id) || false}
                                                                onChange={() => togglePermission(perm.id)}
                                                            />
                                                            <Check size={14} className="absolute text-slate-900 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity font-bold"/>
                                                        </div>
                                                        <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{perm.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-between gap-2 text-xs pt-3 border-t border-slate-800">
                                    <button type="button" onClick={() => setForm({...form, permissions: PERMISSIONS_LIST.map(p=>p.id)})} className="text-blue-400 hover:text-blue-300">تحديد الكل</button>
                                    <button type="button" onClick={() => setForm({...form, permissions: []})} className="text-red-400 hover:text-red-300">إلغاء الكل</button>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="md:col-span-2 lg:col-span-3 mt-2">
                        <Button type="submit" disabled={isSubmitting} className={`w-full font-bold shadow-lg py-4 rounded-xl transition-all text-lg ${isSubmitting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400 shadow-yellow-500/20'}`}>
                            {isSubmitting ? <span className="flex items-center gap-2 justify-center"><Loader2 size={24} className="animate-spin"/> جاري الحفظ...</span> : editingId ? <span className="flex items-center gap-2 justify-center"><Check size={24}/> حفظ التعديلات</span> : 'حفظ المستخدم الجديد'}
                        </Button>
                    </div>
                </form>
            </Card>

            {/* --- List Section --- */}
            <div>
                <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
                    <User size={24} className="text-blue-500"/> طاقم الإدارة والمدربين
                </h3>
                
                {captains.length === 0 ? (
                    <div className="text-center p-12 bg-slate-900 rounded-2xl border border-slate-800 border-dashed text-slate-500">لا يوجد مستخدمين مسجلين حالياً</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {captains.map(cap => (
                            <div key={cap.id} className={`rounded-2xl border shadow-lg overflow-hidden group transition-all relative ${cap.isSuper ? 'bg-slate-900 border-amber-500/30 hover:border-amber-500' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                                <div className={`absolute top-0 left-0 w-1 h-full ${cap.isSuper ? 'bg-gradient-to-b from-amber-400 to-amber-600' : 'bg-gradient-to-b from-yellow-500 to-yellow-700'}`}></div>
                                <div className="p-5 pl-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border shadow-inner uppercase ${cap.isSuper ? 'bg-amber-900/20 text-amber-500 border-amber-500/30' : 'bg-slate-800 text-yellow-500 border-slate-700'}`}>
                                                {cap.isSuper ? <Crown size={24}/> : cap.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-lg ${cap.isSuper ? 'text-amber-400' : 'text-slate-100'}`}>{cap.name}</h4>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{cap.branch}</span>
                                                    {cap.isSuper && <span className="text-[10px] text-amber-900 bg-amber-400 font-bold px-2 py-0.5 rounded">مدير عام</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <button onClick={()=>{setEditingId(cap.id); setForm(cap); window.scrollTo({top: 0, behavior: 'smooth'});}} className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all" title="تعديل"><Edit size={16}/></button>
                                            <button onClick={async () => { if(window.confirm('هل أنت متأكد من حذف المستخدم؟ (سيتم حذفه من القائمة فقط)')) await captainsCollection.remove(cap.id); }} className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all" title="حذف"><Trash2 size={16}/></button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                                        <div className="flex justify-between items-center text-sm border-b border-slate-800 pb-2 mb-2">
                                            <span className="text-slate-500 flex items-center gap-1"><DollarSign size={14}/> الراتب:</span>
                                            <span className="font-mono font-bold text-emerald-400">{cap.salary || 0} JD</span>
                                        </div>
                                        <div className="text-xs flex justify-between items-center">
                                            <span className="text-slate-600 block mb-0.5">تسجيل الدخول: <span className="font-mono text-slate-300 bg-slate-900 px-1 py-0.5 rounded">{cap.username}</span></span>
                                            {cap.isSuper ? (
                                                <span className="font-bold text-amber-500 flex items-center gap-1"><Crown size={12}/> شامل</span>
                                            ) : (
                                                <span className="font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">
                                                    {cap.permissions?.length || 0} شاشات
                                                </span>
                                            )}
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
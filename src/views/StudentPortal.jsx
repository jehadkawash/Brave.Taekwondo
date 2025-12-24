// src/views/StudentPortal.jsx
import React, { useState } from 'react';
import { Clock, LogOut, ChevronLeft, ChevronRight, Settings, X, Megaphone, Banknote, CreditCard, ShoppingBag, Home } from 'lucide-react';
import { Button, Card, StatusBadge } from '../components/UIComponents';
import { IMAGES } from '../lib/constants';
import { updateDoc, doc } from "firebase/firestore"; 
import { db, appId } from '../lib/firebase';

const StudentPortal = ({ user, students, schedule, payments, news, products = [], handleLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'store'
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const changeMonth = (inc) => { const d = new Date(currentDate); d.setMonth(d.getMonth() + inc); setCurrentDate(d); };
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const currentUserData = students.find(s => s.id === user.id) || user;
  const myStudents = students.filter(s => s.familyId === user.familyId);
  
  // Sorting Payments
  const myPayments = payments
    .filter(p => myStudents.some(s => s.id === p.studentId))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Filtering News
  const studentBranches = [...new Set(myStudents.map(s => s.branch))];
  const relevantNews = (news || [])
    .filter(n => !n.branch || n.branch === 'الكل' || studentBranches.includes(n.branch))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const calculateStatus = (dateString) => {
    if (!dateString) return 'expired';
    const today = new Date();
    const end = new Date(dateString);
    today.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'near_end';
    return 'active';
  };

  const [showSettings, setShowSettings] = useState(false);
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    if (!creds.username || !creds.password) return alert("الرجاء تعبئة جميع الحقول");

    setIsUpdating(true);
    try {
      const studentRef = doc(db, 'artifacts', appId, 'public', 'data', 'students', currentUserData.id);
      await updateDoc(studentRef, {
        username: creds.username,
        password: creds.password
      });
      const updatedUserLocal = { ...user, username: creds.username, password: creds.password };
      localStorage.setItem('braveUser', JSON.stringify(updatedUserLocal));
      alert("تم تحديث بيانات الدخول بنجاح!");
      setShowSettings(false);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء التحديث");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-right" dir="rtl">
      {/* HEADER */}
      <header className="bg-black text-yellow-500 p-4 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src={IMAGES.LOGO} alt="Logo" className="w-10 h-10 bg-white rounded-full p-1" />
             <div><h1 className="font-bold text-lg">مرحباً {user.name}</h1><p className="text-xs text-gray-400">بوابة العائلة</p></div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => { setCreds({ username: currentUserData.username, password: currentUserData.password }); setShowSettings(true); }} className="text-sm bg-gray-800 hover:bg-gray-700 text-yellow-500 border border-gray-700">
                <Settings size={16}/> <span className="hidden md:inline">إعدادات</span>
            </Button>
            <Button variant="secondary" onClick={handleLogout} className="text-sm"><LogOut size={16}/></Button>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS (Mobile & Desktop) */}
      <div className="bg-white border-b shadow-sm sticky top-[72px] z-30">
        <div className="container mx-auto flex justify-center md:justify-start">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 font-bold transition-all border-b-4 ${activeTab === 'dashboard' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
            >
                <Home size={20}/> لوحة التحكم
            </button>
            <button 
                onClick={() => setActiveTab('store')}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 font-bold transition-all border-b-4 ${activeTab === 'store' ? 'border-yellow-500 text-yellow-600 bg-yellow-50' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}
            >
                <ShoppingBag size={20}/> المتجر
            </button>
        </div>
      </div>
      
      <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8">
        
        {/* === VIEW 1: DASHBOARD === */}
        {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
                {/* News Section */}
                {relevantNews.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg border-r-4 border-yellow-500 overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-white border-b border-yellow-100 flex items-center gap-2">
                            <div className="bg-yellow-500 text-white p-2 rounded-full shadow-sm animate-pulse"><Megaphone size={20}/></div>
                            <h3 className="text-lg font-bold text-gray-800">آخر الأخبار والإعلانات</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {relevantNews.slice(0, 4).map(n => (
                                    <div key={n.id} className="flex gap-4 items-start p-3 bg-gray-50 rounded-xl hover:shadow-md transition-all border border-gray-100">
                                        {n.image ? (<img src={n.image} alt="News" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />) : (<div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400"><Megaphone size={24}/></div>)}
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900 mb-1">{n.title}</h4>
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{n.desc}</p>
                                            <div className="mt-2 flex items-center gap-2"><span className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-500">{n.branch || 'عام'}</span></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Schedule */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-yellow-500"/> مواعيد الحصص</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{schedule && schedule.length > 0 ? schedule.map(s=><div key={s.id} className="bg-white/10 p-4 rounded-lg"><p className="font-bold text-yellow-400 mb-1">{s.level}</p><p className="text-sm">{s.days} | {s.time}</p></div>) : <p className="text-gray-400">لا يوجد جدول حصص معلن حالياً</p>}</div>
                </div>

                {/* Financial History */}
                <Card title="كشف الحساب (الدفعات السابقة)">
                    {myPayments.length > 0 ? (
                        <div className="overflow-x-auto">
                        <table className="w-full text-sm text-right">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3">التاريخ</th>
                                    <th className="p-3">الطالب</th>
                                    <th className="p-3">البيان</th>
                                    <th className="p-3">الدفع</th>
                                    <th className="p-3">المبلغ</th>
                                </tr>
                            </thead>
                            <tbody>{myPayments.map(p=>(
                                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-gray-500 font-mono">{p.date}</td>
                                    <td className="p-3 font-bold text-gray-800">{p.name}</td>
                                    <td className="p-3 text-gray-700">{p.reason} {p.details && <span className="block text-xs text-gray-400 mt-1">({p.details})</span>}</td>
                                    <td className="p-3">
                                        {p.method === 'cliq' ? (
                                            <span className="flex items-center gap-1 text-purple-600 bg-purple-50 px-2 py-1 rounded text-xs w-fit font-bold"><CreditCard size={12}/> Cliq</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded text-xs w-fit font-bold"><Banknote size={12}/> نقداً</span>
                                        )}
                                    </td>
                                    <td className="p-3 text-green-600 font-bold" dir="ltr">{p.amount} JD</td>
                                </tr>
                            ))}</tbody>
                        </table>
                        </div>
                    ) : <p className="text-gray-500 text-center py-4">لا توجد دفعات مسجلة</p>}
                </Card>

                {/* Student Cards (Info & Attendance) */}
                {myStudents.map(s => (
                    <Card key={s.id} className="mb-8 border-t-4 border-yellow-500" title={s.name}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الحزام الحالي</p><p className="font-bold text-xl">{s.belt}</p></div>
                            <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">حالة الاشتراك</p><StatusBadge status={calculateStatus(s.subEnd)}/><p className="text-xs text-gray-400 mt-1">ينتهي: {s.subEnd}</p></div>
                            <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الرصيد المستحق</p><p className={`font-bold text-xl ${s.balance>0?"text-red-600":"text-green-600"}`}>{s.balance} JOD</p></div>
                            <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الفرع</p><p className="font-bold text-lg">{s.branch}</p></div>
                        </div>
                        {s.notes && s.notes.length > 0 && (<div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100"><h4 className="font-bold text-blue-800 text-sm mb-2">ملاحظات الإدارة:</h4><ul className="list-disc list-inside text-sm text-blue-900">{s.notes.map(n=><li key={n.id}>{n.text} ({n.date})</li>)}</ul></div>)}
                        
                        <div className="border-t pt-6">
                            <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-gray-700">سجل الحضور: {monthNames[month]} {year}</h4><div className="flex gap-2"><Button variant="ghost" onClick={()=>changeMonth(-1)}><ChevronRight size={16}/></Button><Button variant="ghost" onClick={()=>changeMonth(1)}><ChevronLeft size={16}/></Button></div></div>
                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">{[...Array(daysInMonth)].map((_,i)=>{const d=i+1; const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; const isP=s.attendance && s.attendance[dateStr]; return <div key={d} className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border ${isP?'bg-green-500 text-white':'bg-gray-100 text-gray-400'}`}>{d}</div>})}</div>
                        </div>
                    </Card>
                ))}
            </div>
        )}

        {/* === VIEW 2: STORE (CATALOG) === */}
        {activeTab === 'store' && (
            <div className="animate-fade-in">
                <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-yellow-500 text-center mb-8">
                    <h2 className="text-2xl font-black text-gray-800 mb-2">متجر الأكاديمية 🥋</h2>
                    <p className="text-gray-600">تصفح معدات التدريب والملابس الرسمية المتوفرة لدينا.</p>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group">
                                <div className="h-64 overflow-hidden bg-gray-50 relative">
                                    {product.image ? (
                                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <ShoppingBag size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-sm shadow-md">
                                        {product.price} JD
                                    </div>
                                </div>
                                <div className="p-5 text-center">
                                    <h3 className="font-bold text-xl text-gray-800 mb-2">{product.name}</h3>
                                    <p className="text-sm text-gray-500 line-clamp-2">{product.description || 'معدات عالية الجودة معتمدة من الأكاديمية'}</p>
                                    <button className="mt-4 w-full py-2 bg-black text-yellow-500 font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm">
                                        اطلب الآن من الاستقبال
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4"/>
                        <p className="text-gray-500 text-lg">لا يوجد منتجات معروضة حالياً</p>
                    </div>
                )}
            </div>
        )}

      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="w-full max-w-sm relative bg-white rounded-2xl shadow-2xl">
                <button onClick={() => setShowSettings(false)} className="absolute top-4 left-4 text-gray-400 hover:text-black transition-colors"><X size={24}/></button>
                <h3 className="text-xl font-bold mb-6 text-center text-gray-800">تحديث بيانات الدخول</h3>
                <form onSubmit={handleUpdateCredentials} className="space-y-4">
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">اسم المستخدم الجديد</label><input className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors font-mono text-left dir-ltr" value={creds.username} onChange={(e) => setCreds({...creds, username: e.target.value})} required /></div>
                    <div><label className="block text-xs font-bold text-gray-600 mb-1">كلمة المرور الجديدة</label><input className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors font-mono text-left dir-ltr" value={creds.password} onChange={(e) => setCreds({...creds, password: e.target.value})} required /></div>
                    <div className="pt-4"><Button type="submit" disabled={isUpdating} className="w-full py-3 bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-yellow-500/20">{isUpdating ? 'جاري الحفظ...' : 'حفظ التغييرات'}</Button></div>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
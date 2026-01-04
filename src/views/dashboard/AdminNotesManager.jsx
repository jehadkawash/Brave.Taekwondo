// src/views/dashboard/AdminNotesManager.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, StickyNote, DollarSign, 
  Trash2, TrendingUp, TrendingDown, Wallet, Calendar 
} from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';

const AdminNotesManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'accounts'
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const [newItem, setNewItem] = useState({ text: '', amount: '', type: 'note', transactionType: 'expense' });

  const monthKey = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
  
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  useEffect(() => {
    fetchItems();
  }, [monthKey]);

  // ✅ 1. تصحيح المسار في جلب البيانات
  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'artifacts', appId, 'public', 'data', 'admin_notes'), // تم التعديل هنا
        where('monthKey', '==', monthKey),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
    setLoading(false);
  };

  // ✅ 2. تصحيح المسار في الإضافة
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.text) return;

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'admin_notes'), { // تم التعديل هنا
        ...newItem,
        monthKey,
        createdAt: new Date().toISOString(),
        date: new Date().toLocaleDateString('ar-JO')
      });
      setShowModal(false);
      setNewItem({ text: '', amount: '', type: 'note', transactionType: 'expense' });
      fetchItems();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("حدث خطأ أثناء الحفظ. تأكد من الصلاحيات.");
    }
  };

  // ✅ 3. تصحيح المسار في الحذف
  const handleDelete = async (id) => {
    if(!confirm("هل أنت متأكد من الحذف؟")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'admin_notes', id)); // تم التعديل هنا
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const changeMonth = (inc) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + inc);
    setCurrentDate(newDate);
  };

  const financials = useMemo(() => {
    const accounts = items.filter(i => i.type === 'account');
    const income = accounts.filter(i => i.transactionType === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const expense = accounts.filter(i => i.transactionType === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
    return { income, expense, total: income - expense };
  }, [items]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* --- الهيدر والتحكم بالشهر --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl">
          <Button variant="ghost" onClick={() => changeMonth(-1)}><ChevronRight /></Button>
          <div className="text-center min-w-[150px]">
            <h2 className="text-xl font-bold text-gray-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <p className="text-xs text-gray-500">سجل الإدارة</p>
          </div>
          <Button variant="ghost" onClick={() => changeMonth(1)}><ChevronLeft /></Button>
        </div>

        <div className="flex gap-2">
           <Button onClick={() => { setNewItem({...newItem, type: 'note'}); setShowModal(true); }} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 gap-2">
             <StickyNote size={18}/> إضافة ملاحظة
           </Button>
           <Button onClick={() => { setNewItem({...newItem, type: 'account'}); setShowModal(true); }} className="bg-green-100 text-green-700 hover:bg-green-200 gap-2">
             <DollarSign size={18}/> حركة مالية
           </Button>
        </div>
      </div>

      {/* --- ملخص مالي --- */}
      <div className="grid grid-cols-3 gap-4">
         <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center">
            <span className="text-green-600 text-xs font-bold mb-1 flex items-center gap-1"><TrendingUp size={12}/> الدخل</span>
            <span className="text-xl font-bold text-green-800">{financials.income}</span>
         </div>
         <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col items-center">
            <span className="text-red-600 text-xs font-bold mb-1 flex items-center gap-1"><TrendingDown size={12}/> المصاريف</span>
            <span className="text-xl font-bold text-red-800">{financials.expense}</span>
         </div>
         <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center">
            <span className="text-blue-600 text-xs font-bold mb-1 flex items-center gap-1"><Wallet size={12}/> الصافي</span>
            <span className="text-xl font-bold text-blue-800">{financials.total}</span>
         </div>
      </div>

      {/* --- التبويبات --- */}
      <div className="flex border-b border-gray-200 mb-4">
        <button 
          onClick={() => setActiveTab('notes')}
          className={`px-6 py-3 font-bold transition-all ${activeTab === 'notes' ? 'border-b-2 border-yellow-500 text-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          📝 الملاحظات ({items.filter(i => i.type === 'note').length})
        </button>
        <button 
          onClick={() => setActiveTab('accounts')}
          className={`px-6 py-3 font-bold transition-all ${activeTab === 'accounts' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
        >
          💰 الحسابات ({items.filter(i => i.type === 'account').length})
        </button>
      </div>

      {/* --- المحتوى --- */}
      <div className="min-h-[300px]">
        {loading ? (
           <p className="text-center text-gray-400 py-10">جاري التحميل...</p>
        ) : items.length === 0 ? (
           <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
             <p className="text-gray-400">لا يوجد بيانات لهذا الشهر</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.filter(i => i.type === activeTab).map(item => (
               <div key={item.id} className={`p-4 rounded-xl border shadow-sm relative group transition-all hover:-translate-y-1 ${
                 item.type === 'note' ? 'bg-yellow-50/50 border-yellow-100' : 'bg-white border-gray-100'
               }`}>
                  <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-gray-400 bg-white px-2 py-1 rounded-full border">{item.date}</span>
                      {item.type === 'account' && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.transactionType === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {item.transactionType === 'income' ? 'دخل +' : 'صرف -'}
                        </span>
                      )}
                  </div>
                  
                  <p className="text-gray-800 font-bold mb-2 whitespace-pre-wrap">{item.text}</p>
                  
                  {item.type === 'account' && (
                    <div className="text-xl font-bold text-gray-900 dir-ltr text-right mb-2">
                      {item.amount} JD
                    </div>
                  )}

                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-4 left-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16}/>
                  </button>
               </div>
            ))}
          </div>
        )}
      </div>

      {/* --- Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all" onClick={e => e.stopPropagation()}>
              <h3 className="text-xl font-bold mb-4 border-b pb-2">
                {newItem.type === 'note' ? 'إضافة ملاحظة جديدة' : 'إضافة حركة مالية'}
              </h3>
              
              <form onSubmit={handleAddItem} className="space-y-4">
                 
                 {newItem.type === 'account' && (
                   <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                      <button type="button" onClick={() => setNewItem({...newItem, transactionType: 'expense'})} className={`flex-1 py-2 rounded-md font-bold text-sm transition-colors ${newItem.transactionType === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}>مصروفات</button>
                      <button type="button" onClick={() => setNewItem({...newItem, transactionType: 'income'})} className={`flex-1 py-2 rounded-md font-bold text-sm transition-colors ${newItem.transactionType === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}>إيرادات</button>
                   </div>
                 )}

                 <div>
                   <label className="block text-sm font-bold text-gray-700 mb-1">
                     {newItem.type === 'note' ? 'نص الملاحظة' : 'الوصف / البيان'}
                   </label>
                   <textarea 
                     className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 outline-none h-24"
                     placeholder="اكتب هنا..."
                     value={newItem.text}
                     onChange={e => setNewItem({...newItem, text: e.target.value})}
                     autoFocus
                   />
                 </div>

                 {newItem.type === 'account' && (
                   <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">المبلغ (JD)</label>
                     <input 
                       type="number"
                       className="w-full border-2 border-gray-200 p-3 rounded-xl focus:border-yellow-500 outline-none font-bold text-lg"
                       value={newItem.amount}
                       onChange={e => setNewItem({...newItem, amount: e.target.value})}
                       placeholder="0.00"
                     />
                   </div>
                 )}

                 <div className="flex gap-2 pt-2">
                    <Button variant="ghost" onClick={() => setShowModal(false)} type="button">إلغاء</Button>
                    <Button type="submit" className="flex-1 bg-black text-yellow-500 hover:bg-gray-800">حفظ</Button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotesManager;
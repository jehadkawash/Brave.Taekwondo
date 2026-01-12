// src/views/dashboard/AdminNotesManager.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, StickyNote, DollarSign, 
  Trash2, TrendingUp, TrendingDown, Wallet, Edit, Printer, X, Save, 
  Calendar, FileText, ArrowUpCircle, ArrowDownCircle
} from 'lucide-react';
import { Button } from '../../components/UIComponents';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy, updateDoc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';

const AdminNotesManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // الحالة الافتراضية لعرض الملاحظات
  const [activeTab, setActiveTab] = useState('note'); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); 
  const [newItem, setNewItem] = useState({ 
    text: '', 
    amount: '', 
    type: 'note', 
    transactionType: 'expense' 
  });

  const monthKey = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  useEffect(() => {
    fetchItems();
  }, [monthKey]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'artifacts', appId, 'public', 'data', 'admin_notes'),
        where('monthKey', '==', monthKey),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
    setLoading(false);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.text) return;

    try {
      const dataToSave = {
        ...newItem,
        monthKey,
        createdAt: editId ? newItem.createdAt : new Date().toISOString(),
        date: editId ? newItem.date : new Date().toLocaleDateString('ar-JO'),
        lastUpdated: new Date().toISOString()
      };

      if (editId) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'admin_notes', editId), dataToSave);
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'admin_notes'), dataToSave);
      }

      closeModal();
      fetchItems();
    } catch (error) {
      console.error("Error saving item:", error);
      alert("حدث خطأ أثناء الحفظ.");
    }
  };

  const handleDelete = async (id) => {
    if(!confirm("هل أنت متأكد من الحذف نهائياً؟")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'admin_notes', id));
      setItems(items.filter(i => i.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const openAddModal = (type) => {
    setEditId(null);
    setNewItem({ text: '', amount: '', type, transactionType: 'expense' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditId(item.id);
    setNewItem({ ...item });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
  };

  const changeMonth = (inc) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + inc);
    setCurrentDate(newDate);
  };

  const financials = useMemo(() => {
    const accounts = items.filter(i => i.type === 'account');
    const income = accounts.filter(i => i.transactionType === 'income').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const expense = accounts.filter(i => i.transactionType === 'expense').reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    return { income, expense, total: income - expense };
  }, [items]);

  const handlePrint = () => {
    const printWin = window.open('', 'PRINT', 'height=800,width=1000');
    const notesList = items.filter(i => i.type === 'note');
    const accountsList = items.filter(i => i.type === 'account');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير الإدارة - ${monthNames[currentDate.getMonth()]}</title>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: right; }
          th { background: #f0f0f0; }
          .income { color: green; }
          .expense { color: red; }
          .total-box { margin-top: 20px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; font-weight: bold; display: flex; justify-content: space-around; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>سجل الإدارة والمالية</h2>
          <p>${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}</p>
        </div>

        <h3>أولاً: الحركات المالية</h3>
        <table>
          <thead><tr><th>التاريخ</th><th>النوع</th><th>البيان</th><th>المبلغ</th></tr></thead>
          <tbody>
            ${accountsList.map(i => `
              <tr>
                <td>${i.date}</td>
                <td>${i.transactionType === 'income' ? 'إيراد' : 'مصروف'}</td>
                <td>${i.text}</td>
                <td class="${i.transactionType === 'income' ? 'income' : 'expense'}">${i.amount}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total-box">
           <span>دخل: ${financials.income}</span>
           <span>صرف: ${financials.expense}</span>
           <span>صافي: ${financials.total}</span>
        </div>

        <h3>ثانياً: الملاحظات</h3>
        <ul>
          ${notesList.map(n => `<li><b>${n.date}:</b> ${n.text}</li>`).join('')}
        </ul>
      </body>
      </html>
    `;
    printWin.document.write(htmlContent);
    printWin.document.close();
    printWin.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* --- الهيدر والتحكم بالشهر --- */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
          <Button variant="ghost" onClick={() => changeMonth(-1)} className="hover:bg-white hover:shadow-sm rounded-xl"><ChevronRight /></Button>
          <div className="text-center min-w-[160px]">
            <h2 className="text-2xl font-black text-gray-800">{monthNames[currentDate.getMonth()]}</h2>
            <p className="text-xs font-bold text-gray-400">{currentDate.getFullYear()}</p>
          </div>
          <Button variant="ghost" onClick={() => changeMonth(1)} className="hover:bg-white hover:shadow-sm rounded-xl"><ChevronLeft /></Button>
        </div>

        <div className="flex gap-2">
           <Button onClick={() => openAddModal('note')} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-2 border-yellow-200 gap-2 font-bold shadow-sm rounded-xl">
             <StickyNote size={18}/> إضافة ملاحظة
           </Button>
           <Button onClick={() => openAddModal('account')} className="bg-black text-white hover:bg-gray-800 gap-2 font-bold shadow-lg shadow-gray-200 rounded-xl">
             <DollarSign size={18}/> حركة مالية
           </Button>
           <Button onClick={handlePrint} variant="outline" className="gap-2 border-gray-200 text-gray-500 hover:text-black rounded-xl">
             <Printer size={18}/>
           </Button>
        </div>
      </div>

      {/* --- ملخص المالية (يظهر دائماً) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-green-200 transition-all">
            <div>
               <span className="text-green-600 text-xs font-bold mb-1 block">الدخل الشهري</span>
               <span className="text-2xl font-black text-gray-800">{financials.income} <span className="text-sm font-medium text-gray-400">JD</span></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform"><TrendingUp size={20}/></div>
         </div>
         <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-red-200 transition-all">
            <div>
               <span className="text-red-600 text-xs font-bold mb-1 block">المصروفات</span>
               <span className="text-2xl font-black text-gray-800">{financials.expense} <span className="text-sm font-medium text-gray-400">JD</span></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform"><TrendingDown size={20}/></div>
         </div>
         <div className="bg-blue-600 p-5 rounded-3xl shadow-lg shadow-blue-200 flex items-center justify-between text-white relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full"></div>
            <div>
               <span className="text-blue-100 text-xs font-bold mb-1 block">الصافي النهائي</span>
               <span className="text-3xl font-black">{financials.total} <span className="text-base font-medium opacity-70">JD</span></span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"><Wallet size={20}/></div>
         </div>
      </div>

      {/* --- التبويبات والمحتوى --- */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
        
        {/* شريط التبويب */}
        <div className="flex border-b border-gray-100 p-2 gap-2 bg-gray-50/50">
          <button 
            onClick={() => setActiveTab('note')}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2
              ${activeTab === 'note' ? 'bg-white shadow-sm text-yellow-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <StickyNote size={18}/> 
            الملاحظات ({items.filter(i => i.type === 'note').length})
          </button>
          
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2
              ${activeTab === 'account' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
          >
            <DollarSign size={18}/> 
            سجل الحسابات ({items.filter(i => i.type === 'account').length})
          </button>
        </div>

        {/* منطقة المحتوى */}
        <div className="p-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-300">
               <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
               <p>جاري التحميل...</p>
             </div>
          ) : items.length === 0 ? (
             <div className="text-center py-20 text-gray-300">
               <StickyNote size={48} className="mx-auto mb-2 opacity-50"/>
               <p>لا يوجد بيانات لعرضها في هذا القسم</p>
             </div>
          ) : (
            <>
              {/* عرض الملاحظات (قصاصات) */}
              {activeTab === 'note' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items.filter(i => i.type === 'note').map(item => (
                     <div key={item.id} className="p-5 rounded-2xl bg-yellow-50 border border-yellow-100 relative group transition-all hover:shadow-md hover:-translate-y-1">
                        <span className="text-[10px] text-yellow-600 font-bold mb-2 block opacity-70">{item.date}</span>
                        <p className="text-gray-800 font-bold whitespace-pre-wrap leading-relaxed text-sm">{item.text}</p>
                        
                        <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 p-1 rounded-lg">
                          <button onClick={() => openEditModal(item)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><Edit size={14}/></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"><Trash2 size={14}/></button>
                        </div>
                     </div>
                  ))}
                </div>
              )}

              {/* عرض الحسابات (جدول) */}
              {activeTab === 'account' && (
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-right">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase">
                      <tr>
                        <th className="px-6 py-4 rounded-tr-xl">التاريخ</th>
                        <th className="px-6 py-4">النوع</th>
                        <th className="px-6 py-4 w-1/2">البيان / الوصف</th>
                        <th className="px-6 py-4">المبلغ</th>
                        <th className="px-6 py-4 rounded-tl-xl text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.filter(i => i.type === 'account').map(item => (
                        <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4 text-sm font-bold text-gray-600">{item.date}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${item.transactionType === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                              {item.transactionType === 'income' ? <ArrowUpCircle size={12}/> : <ArrowDownCircle size={12}/>}
                              {item.transactionType === 'income' ? 'إيراد' : 'مصروف'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-800">{item.text}</td>
                          <td className={`px-6 py-4 text-sm font-black dir-ltr text-right ${item.transactionType === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                            {item.amount} JD
                          </td>
                          <td className="px-6 py-4 flex justify-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(item)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit size={16}/></button>
                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* --- شاشة الإضافة (Modal) المحسنة --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
           <div className={`rounded-3xl w-full max-w-md shadow-2xl transform transition-all overflow-hidden ${newItem.type === 'note' ? 'bg-[#fffbeb]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              
              {/* رأس المودال */}
              <div className={`px-6 py-5 border-b flex justify-between items-center ${newItem.type === 'note' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-100 bg-gray-50'}`}>
                 <h3 className={`text-lg font-black flex items-center gap-2 ${newItem.type === 'note' ? 'text-yellow-800' : 'text-gray-800'}`}>
                   {editId ? 'تعديل السجل' : (newItem.type === 'note' ? '📝 ملاحظة جديدة' : '💰 حركة مالية')}
                 </h3>
                 <button onClick={closeModal} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 transition-colors"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSaveItem} className="p-6 space-y-5">
                 
                 {/* خيارات النوع (للحسابات فقط) */}
                 {newItem.type === 'account' && (
                   <div className="flex bg-gray-100 p-1 rounded-xl">
                      <button 
                        type="button" 
                        onClick={() => setNewItem({...newItem, transactionType: 'expense'})} 
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 
                        ${newItem.transactionType === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'}`}
                      >
                        <ArrowDownCircle size={16}/> مصروف
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setNewItem({...newItem, transactionType: 'income'})} 
                        className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 
                        ${newItem.transactionType === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
                      >
                        <ArrowUpCircle size={16}/> إيراد
                      </button>
                   </div>
                 )}

                 {/* حقل النص */}
                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-2">
                     {newItem.type === 'note' ? 'محتوى الملاحظة' : 'الوصف / البيان'}
                   </label>
                   <textarea 
                     className={`w-full p-4 rounded-2xl outline-none font-bold text-gray-700 resize-none h-32 transition-colors border-2
                       ${newItem.type === 'note' 
                         ? 'bg-white border-yellow-200 focus:border-yellow-400 placeholder-yellow-300/50' 
                         : 'bg-gray-50 border-gray-100 focus:bg-white focus:border-blue-500'}`}
                     placeholder="اكتب هنا..."
                     value={newItem.text}
                     onChange={e => setNewItem({...newItem, text: e.target.value})}
                     autoFocus
                   />
                 </div>

                 {/* حقل المبلغ (للحسابات فقط) */}
                 {newItem.type === 'account' && (
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-2">المبلغ (JD)</label>
                     <div className="relative">
                       <input 
                         type="number"
                         className="w-full bg-gray-50 border-2 border-gray-100 p-4 pl-12 rounded-2xl focus:border-blue-500 focus:bg-white outline-none font-black text-xl dir-ltr"
                         value={newItem.amount}
                         onChange={e => setNewItem({...newItem, amount: e.target.value})}
                         placeholder="0.00"
                       />
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">JD</span>
                     </div>
                   </div>
                 )}

                 {/* أزرار الحفظ */}
                 <div className="flex gap-3 pt-4 border-t border-gray-50">
                    <Button variant="ghost" onClick={closeModal} type="button" className="flex-1 rounded-xl">إلغاء</Button>
                    <Button type="submit" className={`flex-[2] rounded-xl py-3 shadow-lg ${newItem.type === 'note' ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-black text-white hover:bg-gray-800'}`}>
                      <Save size={18} className="ml-2"/> حفظ
                    </Button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotesManager;
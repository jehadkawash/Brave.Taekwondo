// src/views/dashboard/AdminNotesManager.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, StickyNote, DollarSign, 
  Trash2, TrendingUp, TrendingDown, Wallet, Edit, Printer, X, Save
} from 'lucide-react';
import { Button } from '../../components/UIComponents';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, orderBy, updateDoc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';

const AdminNotesManager = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  // ✅ تم إصلاح التسمية لتطابق قاعدة البيانات (note مفرد)
  const [activeTab, setActiveTab] = useState('note'); 
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null); // لتحديد هل نحن في وضع تعديل أم إضافة
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

  // --- حفظ (إضافة أو تعديل) ---
  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.text) return;

    try {
      const dataToSave = {
        ...newItem,
        monthKey,
        // نحافظ على تاريخ الإنشاء القديم عند التعديل، أو ننشئ جديد عند الإضافة
        createdAt: editId ? newItem.createdAt : new Date().toISOString(),
        date: editId ? newItem.date : new Date().toLocaleDateString('ar-JO'),
        lastUpdated: new Date().toISOString()
      };

      if (editId) {
        // تعديل
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'admin_notes', editId), dataToSave);
      } else {
        // إضافة جديد
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

  // --- فتح المودال للإضافة ---
  const openAddModal = (type) => {
    setEditId(null);
    setNewItem({ text: '', amount: '', type, transactionType: 'expense' });
    setShowModal(true);
  };

  // --- فتح المودال للتعديل ---
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

  // --- طباعة التقرير الشهري ---
  const handlePrint = () => {
    const printWin = window.open('', 'PRINT', 'height=800,width=1000');
    const notesList = items.filter(i => i.type === 'note');
    const accountsList = items.filter(i => i.type === 'account');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>تقرير الإدارة - ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
          body { font-family: 'Cairo', sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; border-bottom: 3px solid #fbbf24; padding-bottom: 20px; margin-bottom: 30px; }
          h2 { margin: 0; color: #1f2937; }
          .meta { color: #6b7280; font-size: 14px; margin-top: 5px; }
          
          .section-title { font-size: 18px; font-weight: bold; margin: 30px 0 15px 0; border-right: 4px solid #fbbf24; padding-right: 10px; }
          
          table { wudth: 100%; width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
          th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: right; }
          th { background-color: #f9fafb; font-weight: bold; }
          .amount-col { font-weight: bold; direction: ltr; text-align: left; }
          .income { color: #166534; }
          .expense { color: #991b1b; }
          
          .summary-box { display: flex; justify-content: space-between; background: #f3f4f6; padding: 15px; border-radius: 8px; font-weight: bold; margin-top: 10px; }
          .note-item { background: #fffbeb; border: 1px solid #fcd34d; padding: 10px; margin-bottom: 8px; border-radius: 6px; }
          .note-date { font-size: 12px; color: #9ca3af; margin-bottom: 4px; }

          @media print {
            .no-print { display: none; }
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>تقرير سجل الإدارة والمالية</h2>
          <div class="meta">عن شهر: ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}</div>
        </div>

        <div class="section-title">📊 الحركات المالية</div>
        ${accountsList.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th width="15%">التاريخ</th>
                <th width="15%">النوع</th>
                <th>البيان / الوصف</th>
                <th width="20%">المبلغ</th>
              </tr>
            </thead>
            <tbody>
              ${accountsList.map(item => `
                <tr>
                  <td>${item.date}</td>
                  <td>${item.transactionType === 'income' ? 'إيراد +' : 'مصروف -'}</td>
                  <td>${item.text}</td>
                  <td class="amount-col ${item.transactionType === 'income' ? 'income' : 'expense'}">
                    ${item.amount} JD
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="summary-box">
             <span class="income">المجموع المقبوض: ${financials.income} JD</span>
             <span class="expense">المجموع المصروف: ${financials.expense} JD</span>
             <span style="color: #1e3a8a">الصافي النهائي: ${financials.total} JD</span>
          </div>
        ` : '<p style="text-align:center; color:#999;">لا يوجد حركات مالية مسجلة لهذا الشهر.</p>'}

        <div class="section-title">📝 الملاحظات الإدارية</div>
        ${notesList.length > 0 ? `
          <div>
            ${notesList.map(item => `
              <div class="note-item">
                <div class="note-date">${item.date}</div>
                <div>${item.text}</div>
              </div>
            `).join('')}
          </div>
        ` : '<p style="text-align:center; color:#999;">لا يوجد ملاحظات مسجلة لهذا الشهر.</p>'}
        
        <script>window.onload = function() { window.print(); }</script>
      </body>
      </html>
    `;
    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* --- Header Control --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Month Selector */}
        <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-xl border border-gray-200">
          <Button variant="ghost" onClick={() => changeMonth(-1)} className="hover:bg-white hover:shadow-sm"><ChevronRight /></Button>
          <div className="text-center min-w-[160px]">
            <h2 className="text-xl font-black text-gray-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Admin Log</p>
          </div>
          <Button variant="ghost" onClick={() => changeMonth(1)} className="hover:bg-white hover:shadow-sm"><ChevronLeft /></Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-2">
           <Button onClick={() => openAddModal('note')} className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border border-yellow-200 gap-2 font-bold shadow-sm">
             <StickyNote size={18}/> إضافة ملاحظة
           </Button>
           <Button onClick={() => openAddModal('account')} className="bg-green-100 text-green-700 hover:bg-green-200 border border-green-200 gap-2 font-bold shadow-sm">
             <DollarSign size={18}/> حركة مالية
           </Button>
           <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>
           <Button onClick={handlePrint} variant="outline" className="gap-2 border-gray-300 text-gray-600 hover:text-black hover:border-black">
             <Printer size={18}/> طباعة التقرير
           </Button>
        </div>
      </div>

      {/* --- Financial Summary Widget --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-gradient-to-br from-green-50 to-white p-5 rounded-2xl border border-green-100 shadow-sm flex flex-col items-center justify-center">
            <span className="text-green-600 text-xs font-black mb-2 flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg"><TrendingUp size={12}/> الدخل الشهري</span>
            <span className="text-2xl font-black text-green-800 tracking-tight">{financials.income} <span className="text-sm font-medium">JD</span></span>
         </div>
         <div className="bg-gradient-to-br from-red-50 to-white p-5 rounded-2xl border border-red-100 shadow-sm flex flex-col items-center justify-center">
            <span className="text-red-600 text-xs font-black mb-2 flex items-center gap-1 bg-red-100 px-2 py-1 rounded-lg"><TrendingDown size={12}/> المصروفات</span>
            <span className="text-2xl font-black text-red-800 tracking-tight">{financials.expense} <span className="text-sm font-medium">JD</span></span>
         </div>
         <div className="bg-gradient-to-br from-blue-50 to-white p-5 rounded-2xl border border-blue-100 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
            <span className="text-blue-600 text-xs font-black mb-2 flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-lg"><Wallet size={12}/> الصافي</span>
            <span className="text-3xl font-black text-blue-900 tracking-tight">{financials.total} <span className="text-sm font-medium">JD</span></span>
         </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px]">
        
        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button 
            onClick={() => setActiveTab('note')}
            className={`flex-1 py-4 font-bold text-sm transition-all flex items-center justify-center gap-2 relative
              ${activeTab === 'note' ? 'text-yellow-600 bg-yellow-50/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <StickyNote size={18} className={activeTab === 'note' ? 'fill-yellow-600' : ''}/> 
            سجل الملاحظات 
            <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{items.filter(i => i.type === 'note').length}</span>
            {activeTab === 'note' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-yellow-500"></div>}
          </button>
          
          <div className="w-px bg-gray-100"></div>
          
          <button 
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-4 font-bold text-sm transition-all flex items-center justify-center gap-2 relative
              ${activeTab === 'account' ? 'text-green-600 bg-green-50/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            <DollarSign size={18} className={activeTab === 'account' ? 'fill-green-600' : ''}/> 
            سجل الحسابات
            <span className="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded-full">{items.filter(i => i.type === 'account').length}</span>
            {activeTab === 'account' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500"></div>}
          </button>
        </div>

        {/* List */}
        <div className="p-6">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 text-gray-400">
               <div className="w-8 h-8 border-4 border-yellow-200 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
               <p>جاري تحديث البيانات...</p>
             </div>
          ) : items.length === 0 ? (
             <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 mx-auto max-w-lg">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                 <StickyNote size={32}/>
               </div>
               <h3 className="font-bold text-gray-800">لا يوجد بيانات لهذا الشهر</h3>
               <p className="text-gray-400 text-sm mt-1">ابدأ بإضافة ملاحظات أو حركات مالية</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.filter(i => i.type === activeTab).map(item => (
                 <div key={item.id} className={`p-5 rounded-2xl border shadow-sm relative group transition-all duration-300 hover:shadow-md hover:-translate-y-1 ${
                   item.type === 'note' ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
                 }`}>
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] text-gray-500 font-bold bg-white/60 px-2 py-1 rounded-lg border border-black/5">{item.date}</span>
                        
                        {item.type === 'account' && (
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1 ${item.transactionType === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {item.transactionType === 'income' ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                            {item.transactionType === 'income' ? 'دخل' : 'صرف'}
                          </span>
                        )}
                    </div>
                    
                    {/* Content */}
                    <div className="min-h-[60px]">
                      <p className={`text-gray-800 font-bold whitespace-pre-wrap leading-relaxed ${item.type === 'account' ? 'text-sm' : 'text-base'}`}>
                        {item.text}
                      </p>
                    </div>
                    
                    {/* Amount (If Account) */}
                    {item.type === 'account' && (
                      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                        <span className="text-xl font-black text-gray-900 dir-ltr">{item.amount} <span className="text-xs text-gray-400">JD</span></span>
                      </div>
                    )}

                    {/* Actions Overlay */}
                    <div className="absolute top-3 left-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-lg backdrop-blur-sm shadow-sm">
                      <button 
                        onClick={() => openEditModal(item)}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                        title="تعديل"
                      >
                        <Edit size={16}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                 </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- Add/Edit Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in" onClick={closeModal}>
           <div className="bg-white rounded-3xl w-full max-w-md p-0 shadow-2xl transform transition-all overflow-hidden" onClick={e => e.stopPropagation()}>
              
              {/* Modal Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                   {editId ? <Edit size={20} className="text-blue-500"/> : (newItem.type === 'note' ? <StickyNote size={20} className="text-yellow-500"/> : <DollarSign size={20} className="text-green-500"/>)}
                   {editId ? 'تعديل السجل' : (newItem.type === 'note' ? 'ملاحظة جديدة' : 'حركة مالية جديدة')}
                 </h3>
                 <button onClick={closeModal} className="text-gray-400 hover:text-red-500 transition-colors"><X size={20}/></button>
              </div>
              
              <form onSubmit={handleSaveItem} className="p-6 space-y-5">
                 
                 {newItem.type === 'account' && (
                   <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl">
                      <button type="button" onClick={() => setNewItem({...newItem, transactionType: 'expense'})} className={`py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${newItem.transactionType === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                        <TrendingDown size={16}/> مصروفات
                      </button>
                      <button type="button" onClick={() => setNewItem({...newItem, transactionType: 'income'})} className={`py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${newItem.transactionType === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                        <TrendingUp size={16}/> إيرادات
                      </button>
                   </div>
                 )}

                 <div>
                   <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-1">
                     {newItem.type === 'note' ? 'نص الملاحظة' : 'الوصف / البيان'}
                   </label>
                   <textarea 
                     className="w-full border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl focus:border-black focus:bg-white outline-none h-32 text-sm font-medium transition-colors resize-none"
                     placeholder="اكتب التفاصيل هنا..."
                     value={newItem.text}
                     onChange={e => setNewItem({...newItem, text: e.target.value})}
                     autoFocus
                   />
                 </div>

                 {newItem.type === 'account' && (
                   <div>
                     <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-1">المبلغ (JD)</label>
                     <div className="relative">
                       <input 
                         type="number"
                         className="w-full border-2 border-gray-100 bg-gray-50 p-4 pl-12 rounded-2xl focus:border-black focus:bg-white outline-none font-black text-xl dir-ltr"
                         value={newItem.amount}
                         onChange={e => setNewItem({...newItem, amount: e.target.value})}
                         placeholder="0.00"
                       />
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">JD</span>
                     </div>
                   </div>
                 )}

                 <div className="flex gap-3 pt-2">
                    <Button variant="ghost" onClick={closeModal} type="button" className="flex-1">إلغاء</Button>
                    <Button type="submit" className="flex-[2] bg-black text-white hover:bg-gray-800 py-3 rounded-xl shadow-lg shadow-gray-200">
                      <Save size={18}/> {editId ? 'حفظ التعديلات' : 'إضافة للسجل'}
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
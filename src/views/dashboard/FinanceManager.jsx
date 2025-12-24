// src/views/dashboard/FinanceManager.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, TrendingUp, Save, Printer, FileText, Calendar, Trash2 } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { addDoc, deleteDoc, doc, collection, setDoc, getDoc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';
import { IMAGES } from '../../lib/constants';

const FinanceManager = ({ selectedBranch, logActivity }) => {
  // 1. جلب البيانات
  const paymentsCollection = useCollection('payments');
  const expensesCollection = useCollection('expenses');
  
  const payments = (paymentsCollection.data || []).filter(p => p.branch === selectedBranch);
  const expenses = (expensesCollection.data || []).filter(e => e.branch === selectedBranch);

  // حسابات الشهر الحالي
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  const filteredPayments = payments.filter(p => p.date.startsWith(selectedMonth));
  const filteredExpenses = expenses.filter(e => e.date.startsWith(selectedMonth));

  const monthlyIncome = filteredPayments.reduce((a, b) => a + Number(b.amount), 0);
  const monthlyExpense = filteredExpenses.reduce((a, b) => a + Number(b.amount), 0);
  const netProfit = monthlyIncome - monthlyExpense;

  // إدارة الملاحظات
  const [monthNote, setMonthNote] = useState('');
  const [loadingNote, setLoadingNote] = useState(false);

  useEffect(() => {
    const fetchNote = async () => {
        try {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'finance_notes', `${selectedBranch}_${selectedMonth}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setMonthNote(docSnap.data().text);
            else setMonthNote('');
        } catch (e) { console.error(e); }
    };
    fetchNote();
  }, [selectedBranch, selectedMonth]);

  const saveNote = async () => {
    setLoadingNote(true);
    try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'finance_notes', `${selectedBranch}_${selectedMonth}`), {
            text: monthNote,
            updatedAt: new Date().toISOString()
        });
        alert("تم حفظ الملاحظات");
    } catch (e) { alert("خطأ في الحفظ"); }
    setLoadingNote(false);
  };

  // إضافة مصروف جديد
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.title) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'expenses'), {
        ...newExpense,
        reason: newExpense.title, // توحيد التسمية
        amount: Number(newExpense.amount),
        branch: selectedBranch,
        createdAt: new Date().toISOString()
    });
    setNewExpense({ title: '', amount: '', date: new Date().toISOString().split('T')[0] });
    logActivity('add_expense', `مصروف: ${newExpense.title}`, selectedBranch, {role: 'admin'});
  };

  const handleDeleteExpense = async (id) => {
      if(confirm("حذف هذا المصروف؟")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'expenses', id));
  };

  // --- 🖨️ دالة طباعة التقرير الشهري (إبداعية) ---
  const printMonthlyReport = () => {
    const reportWindow = window.open('', 'PRINT', 'height=800,width=1000');
    const logoUrl = window.location.origin + IMAGES.LOGO;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>تقرير مالي - ${selectedMonth}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
            body { font-family: 'Cairo', sans-serif; padding: 20px; background: white; }
            .header { text-align: center; border-bottom: 2px solid #b45309; padding-bottom: 10px; margin-bottom: 20px; }
            .header img { height: 80px; }
            .title { font-size: 24px; font-weight: 900; color: #333; margin: 10px 0; }
            .subtitle { color: #666; font-size: 14px; }
            .summary-box { display: flex; justify-content: space-between; margin-bottom: 30px; background: #f9fafb; padding: 20px; border-radius: 10px; border: 1px solid #ddd; }
            .stat { text-align: center; width: 30%; }
            .stat-label { font-size: 14px; color: #555; font-weight: bold; }
            .stat-value { font-size: 24px; font-weight: 900; margin-top: 5px; direction: ltr; }
            .green { color: #16a34a; } .red { color: #dc2626; } .blue { color: #2563eb; }
            
            table { w-full; border-collapse: collapse; margin-bottom: 20px; width: 100%; font-size: 14px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
            th { background-color: #f3f4f6; font-weight: bold; }
            
            .notes-section { margin-top: 30px; padding: 15px; border: 1px dashed #aaa; background: #fffbeb; border-radius: 8px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUrl}" onerror="this.style.display='none'"/>
            <div class="title">التقرير المالي الشهري</div>
            <div class="subtitle">الفرع: ${selectedBranch} | الفترة: ${selectedMonth}</div>
          </div>

          <div class="summary-box">
             <div class="stat">
                <div class="stat-label">مجموع الإيرادات</div>
                <div class="stat-value green">+${monthlyIncome} JD</div>
             </div>
             <div class="stat">
                <div class="stat-label">مجموع المصاريف</div>
                <div class="stat-value red">-${monthlyExpense} JD</div>
             </div>
             <div class="stat">
                <div class="stat-label">صافي الأرباح</div>
                <div class="stat-value blue">${netProfit} JD</div>
             </div>
          </div>

          <h3 style="border-right: 4px solid #dc2626; padding-right: 10px;">تفاصيل المصاريف</h3>
          ${filteredExpenses.length > 0 ? `
            <table>
              <thead><tr><th>التاريخ</th><th>البند</th><th>المبلغ</th></tr></thead>
              <tbody>
                ${filteredExpenses.map(e => `<tr><td>${e.date}</td><td>${e.reason || e.title}</td><td class="red">-${e.amount}</td></tr>`).join('')}
              </tbody>
            </table>
          ` : '<p style="text-align:center; color:#999">لا توجد مصاريف مسجلة هذا الشهر</p>'}

          <div class="notes-section">
            <strong>📝 ملاحظات الإدارة:</strong><br/>
            <p>${monthNote || 'لا توجد ملاحظات مسجلة.'}</p>
          </div>

          <div class="footer">
            تم استخراج هذا التقرير بتاريخ ${new Date().toLocaleDateString('ar-JO')} <br/>
            نظام أكاديمية الشجاع للإدارة
          </div>
        </body>
      </html>
    `;

    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
    reportWindow.onload = () => { reportWindow.focus(); setTimeout(() => { reportWindow.print(); reportWindow.close(); }, 500); };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. الشريط العلوي (اختيار الشهر + زر الطباعة) */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
         <div className="flex items-center gap-3">
             <Calendar className="text-yellow-600"/>
             <span className="font-bold text-gray-700">التقرير المالي لشهر:</span>
             <input 
                type="month" 
                className="border-2 border-gray-200 rounded-lg px-3 py-1 font-bold text-gray-700 focus:border-yellow-500 outline-none"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
             />
         </div>
         <Button onClick={printMonthlyReport} className="bg-gray-900 text-white shadow-lg flex items-center gap-2">
             <Printer size={18}/> طباعة التقرير
         </Button>
      </div>

      {/* 2. بطاقات الملخص (Dashboard Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-green-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                  <h3 className="text-gray-500 font-bold mb-1 flex items-center gap-2"><TrendingUp size={18} className="text-green-600"/> الإيرادات</h3>
                  <p className="text-3xl font-black text-gray-800" dir="ltr">+{monthlyIncome} <span className="text-sm text-gray-400 font-normal">JD</span></p>
                  <p className="text-xs text-gray-400 mt-2">إجمالي المقبوضات (اشتراكات + مبيعات)</p>
              </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-red-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                  <h3 className="text-gray-500 font-bold mb-1 flex items-center gap-2"><TrendingDown size={18} className="text-red-600"/> المصاريف</h3>
                  <p className="text-3xl font-black text-gray-800" dir="ltr">-{monthlyExpense} <span className="text-sm text-gray-400 font-normal">JD</span></p>
                  <p className="text-xs text-gray-400 mt-2">فواتير، رواتب، مشتريات بضاعة...</p>
              </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                  <h3 className="text-yellow-500 font-bold mb-1 flex items-center gap-2"><DollarSign size={18}/> الصافي (Net Profit)</h3>
                  <p className={`text-4xl font-black ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`} dir="ltr">
                      {netProfit} <span className="text-lg opacity-50 font-normal">JD</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">الربح النهائي لهذا الشهر</p>
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3. قسم المصاريف (إبداعي) */}
          <Card title="إدارة المصاريف" className="border-red-100 shadow-red-50/50">
              <form onSubmit={handleAddExpense} className="flex gap-2 mb-6 bg-red-50/50 p-3 rounded-xl border border-red-100">
                  <div className="flex-1">
                      <input className="w-full border p-2 rounded-lg text-sm outline-none focus:border-red-400" placeholder="بيان المصروف (مثلاً: كهرباء)" value={newExpense.title} onChange={e=>setNewExpense({...newExpense, title:e.target.value})} required/>
                  </div>
                  <div className="w-24">
                      <input type="number" className="w-full border p-2 rounded-lg text-sm outline-none focus:border-red-400" placeholder="المبلغ" value={newExpense.amount} onChange={e=>setNewExpense({...newExpense, amount:e.target.value})} required/>
                  </div>
                  <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-4 rounded-lg shadow-md shadow-red-600/20">إضافة</Button>
              </form>

              <div className="max-h-80 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                  {filteredExpenses.length > 0 ? filteredExpenses.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(ex => (
                      <div key={ex.id} className="flex justify-between items-center p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-red-200 transition-all group">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold"><TrendingDown size={18}/></div>
                              <div>
                                  <p className="font-bold text-gray-800 text-sm">{ex.reason || ex.title}</p>
                                  <p className="text-[10px] text-gray-400">{ex.date}</p>
                              </div>
                          </div>
                          <div className="flex items-center gap-3">
                              <span className="font-bold text-red-600">-{ex.amount} JD</span>
                              <button onClick={()=>handleDeleteExpense(ex.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                          </div>
                      </div>
                  )) : (
                      <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed">لا يوجد مصاريف لهذا الشهر</div>
                  )}
              </div>
          </Card>

          {/* 4. دفتر الملاحظات (Notepad Style) */}
          <Card title="ملاحظات الشهر" className="border-yellow-200 shadow-yellow-50 bg-yellow-50/30">
              <div className="relative">
                  <div className="absolute top-0 left-4 w-4 h-full border-r-2 border-red-200/50"></div>
                  <textarea 
                      className="w-full h-80 bg-transparent border-none outline-none resize-none p-4 pl-8 text-gray-700 leading-8"
                      style={{ backgroundImage: 'linear-gradient(transparent 95%, #e5e7eb 95%)', backgroundSize: '100% 2rem' }}
                      placeholder="اكتب ملاحظاتك المالية والمهام لهذا الشهر هنا..."
                      value={monthNote}
                      onChange={e=>setMonthNote(e.target.value)}
                  />
              </div>
              <div className="mt-4 flex justify-end border-t pt-4">
                  <Button onClick={saveNote} disabled={loadingNote} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold shadow-lg shadow-yellow-500/20 flex gap-2">
                      <Save size={18}/> {loadingNote ? 'جاري الحفظ...' : 'حفظ الملاحظات'}
                  </Button>
              </div>
          </Card>
      </div>
    </div>
  );
};

export default FinanceManager;
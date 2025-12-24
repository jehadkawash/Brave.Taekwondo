// src/views/dashboard/FinanceManager.jsx
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, TrendingUp, Save } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { addDoc, deleteDoc, doc, collection, setDoc, getDoc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';

const FinanceManager = ({ selectedBranch, logActivity }) => {
  // 1. جلب البيانات (Lazy Loading)
  const paymentsCollection = useCollection('payments');
  const expensesCollection = useCollection('expenses');
  
  const payments = (paymentsCollection.data || []).filter(p => p.branch === selectedBranch);
  const expenses = (expensesCollection.data || []).filter(e => e.branch === selectedBranch);

  // حسابات الشهر الحالي
  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
  const monthlyIncome = payments.filter(p => p.date.startsWith(currentMonth)).reduce((a, b) => a + Number(b.amount), 0);
  const monthlyExpense = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((a, b) => a + Number(b.amount), 0);
  
  // إدارة الملاحظات الشهرية
  const [monthNote, setMonthNote] = useState('');
  const [loadingNote, setLoadingNote] = useState(false);

  useEffect(() => {
    // جلب ملاحظة الشهر
    const fetchNote = async () => {
        try {
            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'finance_notes', `${selectedBranch}_${currentMonth}`);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) setMonthNote(docSnap.data().text);
            else setMonthNote('');
        } catch (e) { console.error(e); }
    };
    fetchNote();
  }, [selectedBranch, currentMonth]);

  const saveNote = async () => {
    setLoadingNote(true);
    try {
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'finance_notes', `${selectedBranch}_${currentMonth}`), {
            text: monthNote,
            updatedAt: new Date().toISOString()
        });
        alert("تم حفظ الملاحظات");
    } catch (e) { alert("خطأ في الحفظ"); }
    setLoadingNote(false);
  };

  // إدارة المصاريف (إضافة فقط، العرض في الجدول)
  const [newExpense, setNewExpense] = useState({ reason: '', amount: '' });
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.amount || !newExpense.reason) return;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'expenses'), {
        ...newExpense,
        amount: Number(newExpense.amount),
        branch: selectedBranch,
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
    });
    setNewExpense({ reason: '', amount: '' });
    logActivity('add_expense', `مصروف: ${newExpense.reason}`, selectedBranch, {role: 'admin'});
  };

  const handleDeleteExpense = async (id) => {
      if(confirm("حذف هذا المصروف؟")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'expenses', id));
  };

  return (
    <div className="space-y-6">
      {/* 1. لوحة القيادة (Dashboard) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
              <h3 className="text-green-800 font-bold mb-2 flex justify-center gap-2"><TrendingUp/> واردات {currentMonth}</h3>
              <p className="text-3xl font-black text-green-600" dir="ltr">{monthlyIncome} JD</p>
          </div>
          <div className="bg-red-50 p-6 rounded-2xl border border-red-100 text-center">
              <h3 className="text-red-800 font-bold mb-2 flex justify-center gap-2"><TrendingDown/> مصاريف {currentMonth}</h3>
              <p className="text-3xl font-black text-red-600" dir="ltr">{monthlyExpense} JD</p>
          </div>
          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
              <h3 className="text-blue-800 font-bold mb-2 flex justify-center gap-2"><DollarSign/> الصافي (Net Profit)</h3>
              <p className={`text-3xl font-black ${monthlyIncome - monthlyExpense >= 0 ? 'text-blue-600' : 'text-red-600'}`} dir="ltr">
                  {monthlyIncome - monthlyExpense} JD
              </p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 2. قسم المصاريف */}
          <Card title="سجل المصاريف الشهرية">
              <form onSubmit={handleAddExpense} className="flex gap-2 mb-4 bg-gray-50 p-3 rounded-lg">
                  <input className="border p-2 rounded flex-1" placeholder="البيان (كهرباء، صيانة...)" value={newExpense.reason} onChange={e=>setNewExpense({...newExpense, reason:e.target.value})} required/>
                  <input type="number" className="border p-2 rounded w-24" placeholder="المبلغ" value={newExpense.amount} onChange={e=>setNewExpense({...newExpense, amount:e.target.value})} required/>
                  <Button type="submit" variant="danger">إضافة</Button>
              </form>
              <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                      <thead className="bg-gray-100 text-gray-500"><tr><th className="p-2 text-right">المبلغ</th><th className="p-2 text-right">السبب</th><th className="p-2 text-right">التاريخ</th><th></th></tr></thead>
                      <tbody>
                          {expenses.sort((a,b)=>new Date(b.date)-new Date(a.date)).map(ex => (
                              <tr key={ex.id} className="border-b">
                                  <td className="p-2 font-bold text-red-600">{ex.amount}</td>
                                  <td className="p-2">{ex.reason}</td>
                                  <td className="p-2 text-gray-500 text-xs">{ex.date}</td>
                                  <td className="p-2"><button onClick={()=>handleDeleteExpense(ex.id)} className="text-red-400 hover:text-red-600"><TrendingDown size={14}/></button></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </Card>

          {/* 3. دفتر الملاحظات */}
          <Card title="دفتر الملاحظات المالية">
              <textarea 
                  className="w-full h-48 border-2 border-yellow-100 rounded-xl p-4 focus:border-yellow-500 outline-none resize-none bg-yellow-50/30"
                  placeholder="اكتب ملاحظاتك المالية لهذا الشهر هنا..."
                  value={monthNote}
                  onChange={e=>setMonthNote(e.target.value)}
              />
              <div className="mt-4 flex justify-end">
                  <Button onClick={saveNote} disabled={loadingNote}><Save size={18}/> {loadingNote ? 'جاري الحفظ...' : 'حفظ الملاحظات'}</Button>
              </div>
          </Card>
      </div>
    </div>
  );
};

export default FinanceManager;
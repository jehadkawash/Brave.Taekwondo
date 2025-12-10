import React, { useState } from 'react';
import { DollarSign, Printer, Trash2 } from 'lucide-react';
import { Button, Card, StudentSearch } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

export default function FinanceManager({ students, payments, expenses, paymentsCollection, expensesCollection, selectedBranch, logActivity }) {
  const [viewMode, setViewMode] = useState('income'); 
  const [payForm, setPayForm] = useState({ sid: '', amount: '', reason: 'اشتراك شهري', customReason: '', details: '' }); 
  const [expForm, setExpForm] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); 
  const [incomeFilterStudent, setIncomeFilterStudent] = useState(null);

  const branchPayments = payments.filter(p => p.branch === selectedBranch);
  const branchExpenses = expenses.filter(e => e.branch === selectedBranch);
  const filteredPayments = incomeFilterStudent ? branchPayments.filter(p => p.studentId === incomeFilterStudent) : branchPayments;

  const handleAddPayment = async (e) => { 
    e.preventDefault(); 
    if(!payForm.studentObjId) return alert('اختر طالباً'); 
    const selectedStudent = students.find(s => s.id === payForm.studentObjId); 
    if(!selectedStudent) return alert('طالب غير موجود'); 
    
    const finalReason = payForm.reason === 'أخرى' ? payForm.customReason : payForm.reason; 
    const newPay = { id: Date.now().toString(), studentId: selectedStudent.id, name: selectedStudent.name, amount: Number(payForm.amount), reason: finalReason, details: payForm.details, date: new Date().toISOString().split('T')[0], branch: selectedBranch }; 
    
    await paymentsCollection.add(newPay); 
    logActivity("قبض مالي", `استلام ${payForm.amount} من ${selectedStudent.name}`); 
    setPayForm({ sid: '', amount: '', reason: 'اشتراك شهري', customReason: '', details: '' }); 
  };

  const handleAddExpense = async (e) => { 
    e.preventDefault(); 
    await expensesCollection.add({ id: Date.now().toString(), title: expForm.title, amount: Number(expForm.amount), date: expForm.date, branch: selectedBranch }); 
    logActivity("مصروف", `صرف ${expForm.amount} لـ ${expForm.title}`); 
    setExpForm({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); 
  };

  const deletePayment = async (id) => { if(confirm('حذف السند؟')) await paymentsCollection.remove(id); };
  const deleteExpense = async (id) => { if(confirm('حذف المصروف؟')) await expensesCollection.remove(id); };

  const printReceipt = (payment) => {
    const receiptWindow = window.open('', 'PRINT', 'height=600,width=800');
    const logoUrl = window.location.origin + IMAGES.LOGO;
    receiptWindow.document.write(`<html><head><title>سند قبض</title><style>body{font-family:'Courier New';direction:rtl;text-align:center;border:2px solid #000;padding:20px;max-width:600px;margin:20px auto;}.header{border-bottom:2px dashed #000;padding-bottom:10px;margin-bottom:20px;}.amount{font-size:22px;font-weight:bold;}</style></head><body><div class="header"><img src="${logoUrl}" width="60"/><h3>أكاديمية الشجاع</h3><p>فرع: ${selectedBranch}</p></div><h2>سند قبض</h2><div style="text-align:right;line-height:2"><div><strong>التاريخ:</strong> ${payment.date}</div><div><strong>رقم السند:</strong> #${payment.id.slice(0,8)}</div><div><strong>استلمنا من:</strong> ${payment.name}</div><div><strong>مبلغ:</strong> <span class="amount">${payment.amount} JOD</span></div><div><strong>وذلك عن:</strong> ${payment.reason} ${payment.details}</div></div><br/><p>توقيع المستلم: ________________</p></body></html>`);
    receiptWindow.document.close();
    receiptWindow.focus();
    setTimeout(() => { receiptWindow.print(); receiptWindow.close(); }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6"><button onClick={() => setViewMode('income')} className={`flex-1 py-3 rounded-xl font-bold ${viewMode === 'income' ? 'bg-green-600 text-white' : 'bg-white'}`}>الإيرادات</button><button onClick={() => setViewMode('expense')} className={`flex-1 py-3 rounded-xl font-bold ${viewMode === 'expense' ? 'bg-red-600 text-white' : 'bg-white'}`}>المصاريف</button></div>
      
      {viewMode === 'income' ? (
        <>
          <Card title="سند قبض جديد"><form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"><div className="relative"><label className="text-xs block mb-1 font-bold text-gray-700">اسم الطالب</label><StudentSearch students={students} onSelect={(s) => setPayForm({...payForm, sid: s.name, studentObjId: s.id})} placeholder="ابحث..." /></div><div><label className="text-xs block mb-1">المبلغ</label><input type="number" className="w-full border p-2 rounded" value={payForm.amount} onChange={e=>setPayForm({...payForm, amount:e.target.value})} required /></div><div><label className="text-xs block mb-1">السبب</label><select className="w-full border p-2 rounded" value={payForm.reason} onChange={e=>setPayForm({...payForm, reason:e.target.value})}><option>اشتراك شهري</option><option>عرض الاشتراك 3 شهور</option><option>رسوم فحص</option><option>أخرى</option></select></div>{payForm.reason === 'أخرى' && <div><label className="text-xs block mb-1">وضح السبب</label><input className="w-full border p-2 rounded" value={payForm.customReason} onChange={e=>setPayForm({...payForm, customReason:e.target.value})} required /></div>}<div className="md:col-span-2"><label className="text-xs block mb-1">تفاصيل</label><input className="w-full border p-2 rounded" value={payForm.details} onChange={e=>setPayForm({...payForm, details:e.target.value})} /></div><Button type="submit">حفظ وقبض</Button></form></Card>
          <div className="flex items-center gap-2 mb-2 w-64"><StudentSearch students={students} onSelect={(s) => setIncomeFilterStudent(s.id)} onClear={() => setIncomeFilterStudent(null)} placeholder="فلترة حسب الطالب..." showAllOption={true} /></div>
          <Card><table className="w-full text-sm text-right"><thead className="bg-gray-100"><tr><th className="p-3">#</th><th className="p-3">الطالب</th><th className="p-3">البيان</th><th className="p-3">المبلغ</th><th className="p-3">طباعة</th><th className="p-3">حذف</th></tr></thead><tbody>{filteredPayments.map(p=><tr key={p.id} className="hover:bg-gray-50"><td className="p-3">{p.id.slice(0,8)}</td><td className="p-3 font-bold">{p.name}</td><td className="p-3">{p.reason} <span className="text-xs text-gray-400">{p.details}</span></td><td className="p-3 text-green-600">{p.amount}</td><td className="p-3"><button onClick={()=>printReceipt(p)}><Printer size={16}/></button></td><td className="p-3"><button onClick={()=>deletePayment(p.id)} className="text-red-500"><Trash2 size={16}/></button></td></tr>)}</tbody></table></Card>
        </>
      ) : (
        <>
          <Card title="تسجيل مصروف"><form onSubmit={handleAddExpense} className="flex gap-4 items-end"><div className="flex-1"><label className="text-xs block mb-1">البند</label><input className="w-full border p-2 rounded" value={expForm.title} onChange={e=>setExpForm({...expForm, title:e.target.value})} required /></div><div className="w-32"><label className="text-xs block mb-1">المبلغ</label><input type="number" className="w-full border p-2 rounded" value={expForm.amount} onChange={e=>setExpForm({...expForm, amount:e.target.value})} required /></div><Button type="submit">حفظ</Button></form></Card>
          <Card><table className="w-full text-sm text-right"><thead><tr><th className="p-3">البند</th><th className="p-3">المبلغ</th><th className="p-3">حذف</th></tr></thead><tbody>{branchExpenses.map(e=><tr key={e.id}><td className="p-3">{e.title}</td><td className="p-3 text-red-600">{e.amount}</td><td className="p-3"><button onClick={()=>deleteExpense(e.id)} className="text-red-500"><Trash2 size={16}/></button></td></tr>)}</tbody></table></Card>
        </>
      )}
    </div>
  );
}
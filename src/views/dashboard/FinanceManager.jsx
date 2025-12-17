// src/views/dashboard/FinanceManager.jsx
import React, { useState } from 'react';
import { DollarSign, Printer, Trash2, Calendar, FileText, User } from 'lucide-react';
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
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      
      {/* Top Toggle Switch */}
      <div className="flex gap-4 mb-6 bg-gray-100 p-1 rounded-2xl">
        <button onClick={() => setViewMode('income')} className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-sm ${viewMode === 'income' ? 'bg-green-600 text-white shadow-green-200' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
           الإيرادات (القبض)
        </button>
        <button onClick={() => setViewMode('expense')} className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-sm ${viewMode === 'expense' ? 'bg-red-600 text-white shadow-red-200' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
           المصاريف
        </button>
      </div>
      
      {viewMode === 'income' ? (
        <>
          {/* Add Payment Form */}
          <Card title="سند قبض جديد" className="border-green-100 shadow-green-50">
            <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="relative col-span-1 md:col-span-1">
                 <label className="text-xs block mb-1 font-bold text-gray-700">اسم الطالب</label>
                 <StudentSearch students={students} onSelect={(s) => setPayForm({...payForm, sid: s.name, studentObjId: s.id})} placeholder="ابحث..." />
              </div>
              <div>
                 <label className="text-xs block mb-1 font-bold text-gray-700">المبلغ</label>
                 <input type="number" className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-green-500 outline-none" value={payForm.amount} onChange={e=>setPayForm({...payForm, amount:e.target.value})} required placeholder="0.00" />
              </div>
              <div>
                 <label className="text-xs block mb-1 font-bold text-gray-700">السبب</label>
                 <select className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-green-500 outline-none bg-white" value={payForm.reason} onChange={e=>setPayForm({...payForm, reason:e.target.value})}>
                    <option>اشتراك شهري</option>
                    <option>عرض الاشتراك 3 شهور</option>
                    <option>رسوم فحص</option>
                    <option>زي رسمي</option>
                    <option>أخرى</option>
                 </select>
              </div>
              {payForm.reason === 'أخرى' && (
                 <div className="col-span-1 md:col-span-3">
                    <label className="text-xs block mb-1 font-bold text-gray-700">وضح السبب</label>
                    <input className="w-full border-2 border-gray-100 p-2 rounded-xl outline-none" value={payForm.customReason} onChange={e=>setPayForm({...payForm, customReason:e.target.value})} required />
                 </div>
              )}
              <div className="col-span-1 md:col-span-3">
                 <label className="text-xs block mb-1 font-bold text-gray-700">تفاصيل إضافية (اختياري)</label>
                 <input className="w-full border-2 border-gray-100 p-2 rounded-xl outline-none" value={payForm.details} onChange={e=>setPayForm({...payForm, details:e.target.value})} placeholder="مثال: عن شهر 12 + 1" />
              </div>
              <div className="col-span-1 md:col-span-3 mt-2">
                 <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 py-3">حفظ وقبض</Button>
              </div>
            </form>
          </Card>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-2 w-full md:w-64">
             <StudentSearch students={students} onSelect={(s) => setIncomeFilterStudent(s.id)} onClear={() => setIncomeFilterStudent(null)} placeholder="فلترة حسب الطالب..." showAllOption={true} />
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
          <div className="hidden md:block">
            <Card>
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="p-3 rounded-r-lg">#</th>
                            <th className="p-3">الطالب</th>
                            <th className="p-3">البيان</th>
                            <th className="p-3">التاريخ</th>
                            <th className="p-3">المبلغ</th>
                            <th className="p-3">طباعة</th>
                            <th className="p-3 rounded-l-lg">حذف</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredPayments.map(p => (
                            <tr key={p.id} className="hover:bg-green-50 transition-colors">
                                <td className="p-3 text-gray-400 font-mono text-xs">{p.id.slice(-6)}</td>
                                <td className="p-3 font-bold text-gray-800">{p.name}</td>
                                <td className="p-3 text-gray-600">
                                    <span className="block font-bold text-xs">{p.reason}</span>
                                    <span className="text-[10px] text-gray-400">{p.details}</span>
                                </td>
                                <td className="p-3 text-xs text-gray-500">{p.date}</td>
                                <td className="p-3 font-bold text-green-600">+{p.amount}</td>
                                <td className="p-3"><button onClick={()=>printReceipt(p)} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600"><Printer size={16}/></button></td>
                                <td className="p-3"><button onClick={()=>deletePayment(p.id)} className="p-2 bg-red-50 rounded-lg hover:bg-red-100 text-red-500"><Trash2 size={16}/></button></td>
                            </tr>
                        ))}
                         {filteredPayments.length === 0 && <tr><td colSpan="7" className="p-8 text-center text-gray-400">لا يوجد سندات</td></tr>}
                    </tbody>
                </table>
            </Card>
          </div>

          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="md:hidden grid gap-4">
              {filteredPayments.map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                      <div className="flex justify-between items-start pl-2">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <User size={14} className="text-gray-400"/>
                                  <span className="font-bold text-gray-800">{p.name}</span>
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                  <Calendar size={12}/> {p.date}
                              </div>
                          </div>
                          <div className="text-green-600 font-bold text-lg bg-green-50 px-2 py-1 rounded-lg">
                              +{p.amount}
                          </div>
                      </div>
                      
                      <div className="bg-gray-50 p-2 rounded-lg text-sm text-gray-600 flex items-start gap-2">
                          <FileText size={14} className="mt-1 text-gray-400 shrink-0"/>
                          <div>
                             <span className="font-bold block text-xs text-gray-700">{p.reason}</span>
                             <span className="text-[10px]">{p.details}</span>
                          </div>
                      </div>

                      <div className="flex justify-end gap-2 mt-1 border-t pt-3 border-gray-100">
                          <button onClick={()=>printReceipt(p)} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-bold">
                              <Printer size={14}/> طباعة
                          </button>
                          <button onClick={()=>deletePayment(p.id)} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold">
                              <Trash2 size={14}/> حذف
                          </button>
                      </div>
                  </div>
              ))}
              {filteredPayments.length === 0 && <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed">لا يوجد سندات</div>}
          </div>
        </>
      ) : (
        <>
          {/* Expenses Form */}
          <Card title="تسجيل مصروف" className="border-red-100 shadow-red-50">
             <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="col-span-1 md:col-span-2">
                    <label className="text-xs block mb-1 font-bold text-gray-700">البند (سبب الصرف)</label>
                    <input className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-red-500 outline-none" value={expForm.title} onChange={e=>setExpForm({...expForm, title:e.target.value})} required placeholder="مثال: فاتورة كهرباء" />
                </div>
                <div>
                    <label className="text-xs block mb-1 font-bold text-gray-700">المبلغ</label>
                    <input type="number" className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-red-500 outline-none" value={expForm.amount} onChange={e=>setExpForm({...expForm, amount:e.target.value})} required placeholder="0.00" />
                </div>
                <div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20 py-2.5">حفظ</Button>
                </div>
             </form>
          </Card>
          
          {/* --- DESKTOP VIEW (Expenses Table) --- */}
          <div className="hidden md:block">
            <Card>
                <table className="w-full text-sm text-right">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-3 rounded-r-lg">البند</th>
                            <th className="p-3">التاريخ</th>
                            <th className="p-3">المبلغ</th>
                            <th className="p-3 rounded-l-lg">حذف</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {branchExpenses.map(e=>(
                            <tr key={e.id} className="hover:bg-red-50 transition-colors">
                                <td className="p-3 font-bold text-gray-700">{e.title}</td>
                                <td className="p-3 text-gray-500 text-xs">{e.date}</td>
                                <td className="p-3 text-red-600 font-bold">-{e.amount}</td>
                                <td className="p-3"><button onClick={()=>deleteExpense(e.id)} className="text-red-500 p-2 bg-red-50 rounded-lg hover:bg-red-100"><Trash2 size={16}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
          </div>

          {/* --- MOBILE VIEW (Expenses Cards) --- */}
          <div className="md:hidden grid gap-4">
              {branchExpenses.map(e => (
                  <div key={e.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                      <div className="pl-3">
                          <h4 className="font-bold text-gray-800">{e.title}</h4>
                          <span className="text-xs text-gray-400 block mt-1">{e.date}</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-red-600 text-lg">-{e.amount}</span>
                          <button onClick={()=>deleteExpense(e.id)} className="text-red-400 hover:text-red-600 bg-red-50 p-1.5 rounded-lg">
                              <Trash2 size={16}/>
                          </button>
                      </div>
                  </div>
              ))}
              {branchExpenses.length === 0 && <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed">لا يوجد مصاريف</div>}
          </div>
        </>
      )}
    </div>
  );
}
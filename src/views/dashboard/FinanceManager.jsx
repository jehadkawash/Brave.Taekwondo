// src/views/dashboard/FinanceManager.jsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { DollarSign, Printer, Trash2, Calendar, FileText, User, Settings, Plus, X } from 'lucide-react';
import { Button, Card, StudentSearch } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';
import { addDoc, deleteDoc, doc } from "firebase/firestore"; // استيراد دوال فايربيس
import { db } from '../../lib/firebase';

// --- مكون النافذة المنبثقة لإدارة الأسباب ---
const ReasonsModal = ({ isOpen, onClose, reasons, onAdd, onDelete }) => {
    const [newReason, setNewReason] = useState("");
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Settings size={20} className="text-gray-600"/> إدارة بنود الدفع
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
                </div>
                
                {/* إضافة سبب جديد */}
                <div className="flex gap-2 mb-6">
                    <input 
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-green-500 outline-none"
                        placeholder="اسم البند الجديد..."
                        value={newReason}
                        onChange={(e) => setNewReason(e.target.value)}
                    />
                    <button 
                        onClick={() => { if(newReason) { onAdd(newReason); setNewReason(""); } }}
                        className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700"
                    >
                        <Plus size={20}/>
                    </button>
                </div>

                {/* قائمة الأسباب الحالية */}
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                    {reasons.map((r, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="font-bold text-gray-700">{r.title}</span>
                            <button onClick={() => onDelete(r)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ))}
                    {reasons.length === 0 && <p className="text-center text-gray-400 text-sm">لا يوجد بنود مضافة، استخدم القائمة لإضافة بنود</p>}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default function FinanceManager({ 
    students, payments, expenses, 
    paymentsCollection, expensesCollection, 
    selectedBranch, logActivity,
    financeReasons = [], financeReasonsCollection // استقبال البروبس الجديدة
}) {
  const [viewMode, setViewMode] = useState('income'); 
  const [payForm, setPayForm] = useState({ sid: '', amount: '', reason: '', customReason: '', details: '' }); 
  const [expForm, setExpForm] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); 
  const [incomeFilterStudent, setIncomeFilterStudent] = useState(null);
  const [showReasonsModal, setShowReasonsModal] = useState(false); // حالة إظهار المودال

  const branchPayments = payments.filter(p => p.branch === selectedBranch);
  const branchExpenses = expenses.filter(e => e.branch === selectedBranch);
  const filteredPayments = incomeFilterStudent ? branchPayments.filter(p => p.studentId === incomeFilterStudent) : branchPayments;

  // --- دوال إدارة الأسباب (Firebase) ---
  const handleAddReason = async (title) => {
      // التحقق من التكرار
      if (financeReasons.some(r => r.title === title)) return alert("هذا البند موجود مسبقاً");
      
      await financeReasonsCollection.add({
          title: title,
          branch: selectedBranch,
          createdAt: new Date().toISOString()
      });
  };

  const handleDeleteReason = async (reasonObj) => {
      if (!confirm(`حذف البند "${reasonObj.title}"؟`)) return;
      await financeReasonsCollection.remove(reasonObj.id);
  };

  const handleAddPayment = async (e) => { 
    e.preventDefault(); 
    if(!payForm.studentObjId) return alert('اختر طالباً'); 
    const selectedStudent = students.find(s => s.id === payForm.studentObjId); 
    if(!selectedStudent) return alert('طالب غير موجود'); 
    
    // إذا لم يتم اختيار سبب (مثلاً القائمة فارغة)، نستخدم "أخرى" كافتراضي أو نطلب من المستخدم الاختيار
    if (!payForm.reason && financeReasons.length > 0) {
        return alert("الرجاء اختيار سبب الدفع");
    }

    const finalReason = payForm.reason === 'أخرى' ? payForm.customReason : payForm.reason; 
    
    const newPay = { id: Date.now().toString(), studentId: selectedStudent.id, name: selectedStudent.name, amount: Number(payForm.amount), reason: finalReason, details: payForm.details, date: new Date().toISOString().split('T')[0], branch: selectedBranch }; 
    
    await paymentsCollection.add(newPay); 
    logActivity("قبض مالي", `استلام ${payForm.amount} من ${selectedStudent.name}`); 
    setPayForm({ sid: '', amount: '', reason: '', customReason: '', details: '' }); 
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
    const logoUrl = window.location.origin + IMAGES.LOGO; // تأكد أن رابط اللوجو صحيح

    const htmlContent = `
      <html>
        <head>
          <title>سند قبض - ${payment.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
            
            body {
              font-family: 'Cairo', sans-serif;
              direction: rtl;
              padding: 20px;
              background-color: #fff;
              -webkit-print-color-adjust: exact;
            }

            .receipt-box {
              border: 3px double #333;
              padding: 25px;
              max-width: 800px;
              margin: 0 auto;
              position: relative;
              background: white;
            }

            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid #eee;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }

            .academy-info {
              text-align: right;
            }
            .academy-name {
              font-size: 22px;
              font-weight: 900;
              color: #b45309; /* لون برتقالي/ذهبي */
              margin-bottom: 5px;
            }
            .branch-name {
              font-size: 14px;
              color: #555;
              font-weight: bold;
            }

            .logo img {
              height: 90px;
              max-width: 150px;
            }

            .receipt-meta {
              text-align: left;
              font-size: 14px;
            }
            .receipt-meta div {
              margin-bottom: 5px;
            }

            .title {
              text-align: center;
              font-size: 32px;
              font-weight: 900;
              margin: 10px 0 30px 0;
              text-decoration: underline;
              text-underline-offset: 8px;
              color: #222;
            }

            .content {
              font-size: 18px;
              line-height: 2.2;
            }

            .row {
              display: flex;
              align-items: baseline;
              margin-bottom: 10px;
            }
            
            .label {
              font-weight: bold;
              width: 130px;
              color: #444;
            }
            
            .value {
              flex: 1;
              border-bottom: 1px dotted #999;
              padding-right: 10px;
              font-weight: 700;
              color: #000;
            }

            .amount-box {
              margin: 30px auto;
              border: 3px solid #000;
              padding: 10px 40px;
              font-size: 28px;
              font-weight: 900;
              width: fit-content;
              border-radius: 8px;
              background: #f9f9f9;
              box-shadow: 2px 2px 0px #ccc;
            }

            .footer {
              display: flex;
              justify-content: space-between;
              margin-top: 60px;
              padding: 0 40px;
            }

            .signature {
              text-align: center;
              width: 200px;
              border-top: 2px solid #333;
              padding-top: 10px;
              font-weight: bold;
            }

            .notes {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #777;
              border-top: 1px solid #eee;
              padding-top: 10px;
            }

            @media print {
              .receipt-box { box-shadow: none; border: 2px solid #000; }
              body { margin: 0; padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            
            <div class="header">
              <div class="academy-info">
                <div class="academy-name">أكاديمية الشجاع للتايكواندو</div>
                <div class="branch-name">📍 فرع: ${selectedBranch}</div>
                <div class="branch-name">📞 هاتف: 0795629606</div>
              </div>
              
              <div class="logo">
                <img src="${logoUrl}" alt="شعار الأكاديمية" onerror="this.style.display='none'"/>
              </div>

              <div class="receipt-meta">
                <div>رقم السند: <strong>#${payment.id.slice(-6)}</strong></div>
                <div>التاريخ: <strong>${payment.date}</strong></div>
              </div>
            </div>

            <div class="title">سند قبض مالي</div>

            <div class="content">
              <div class="row">
                <span class="label">استلمنا من السيد/ة:</span>
                <span class="value">${payment.name}</span>
              </div>
              
              <div class="row">
                <span class="label">مبلغ وقدره:</span>
                <span class="value">${payment.amount} دينار أردني</span>
              </div>

              <div class="row">
                <span class="label">وذلك عن:</span>
                <span class="value">${payment.reason} ${payment.details ? ` - ${payment.details}` : ''}</span>
              </div>
            </div>

            <div class="amount-box">
              JD ${payment.amount}
            </div>

            <div class="footer">
              <div class="signature">المحاسب</div>
              <div class="signature">المستلم</div>
            </div>

            <div class="notes">
              شكراً لثقتكم بنا! | المبالغ المدفوعة لا تُسترد بعد بدء الاشتراك
            </div>

          </div>
        </body>
      </html>
    `;

    receiptWindow.document.write(htmlContent);
    receiptWindow.document.close();
    
    // انتظار تحميل الصور (اللوجو) قبل الطباعة
    receiptWindow.onload = () => {
        receiptWindow.focus();
        setTimeout(() => {
            receiptWindow.print();
            receiptWindow.close();
        }, 500);
    };
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      
      {/* نافذة إدارة الأسباب */}
      <ReasonsModal 
        isOpen={showReasonsModal} 
        onClose={() => setShowReasonsModal(false)} 
        reasons={financeReasons}
        onAdd={handleAddReason}
        onDelete={handleDeleteReason}
      />

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
              
              {/* --- (تعديل) قائمة الأسباب مع زر الإعدادات --- */}
              <div className="relative">
                 <label className="text-xs block mb-1 font-bold text-gray-700 flex justify-between">
                     السبب
                     <button type="button" onClick={() => setShowReasonsModal(true)} className="text-green-600 hover:text-green-800 text-[10px] flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded cursor-pointer">
                         <Settings size={10}/> تعديل القائمة
                     </button>
                 </label>
                 <select 
                    className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-green-500 outline-none bg-white cursor-pointer" 
                    value={payForm.reason} 
                    onChange={e=>setPayForm({...payForm, reason:e.target.value})}
                 >
                    <option value="" disabled>اختر السبب...</option>
                    {financeReasons.map((r, idx) => (
                        <option key={idx} value={r.title}>{r.title}</option>
                    ))}
                    <option value="أخرى">أخرى (كتابة يدوية)</option>
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
// src/views/dashboard/FinanceManager.jsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { DollarSign, Printer, Trash2, Calendar, FileText, User, Settings, Plus, X, PieChart } from 'lucide-react';
import { Button, Card, StudentSearch } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';
import { addDoc, deleteDoc, doc } from "firebase/firestore"; 
import { db } from '../../lib/firebase';

// --- مكون النافذة المنبثقة لإدارة الأسباب ---
const ReasonsModal = ({ isOpen, onClose, reasons, onAdd, onDelete }) => {
    const [newReason, setNewReason] = useState("");
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-slate-100">
                        <Settings size={20} className="text-slate-400"/> إدارة بنود الدفع
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-red-500"/></button>
                </div>
                
                <div className="flex gap-2 mb-6">
                    <input 
                        className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-4 py-2 focus:border-green-500 outline-none placeholder-slate-600"
                        placeholder="اسم البند الجديد..."
                        value={newReason}
                        onChange={(e) => setNewReason(e.target.value)}
                    />
                    <button 
                        onClick={() => { if(newReason) { onAdd(newReason); setNewReason(""); } }}
                        className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-500 shadow-lg shadow-green-900/20"
                    >
                        <Plus size={20}/>
                    </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                    {reasons.map((r, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                            <span className="font-bold text-slate-300">{r.title}</span>
                            <button onClick={() => onDelete(r)} className="text-red-400 hover:bg-red-900/20 p-2 rounded-lg transition-colors">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ))}
                    {reasons.length === 0 && <p className="text-center text-slate-500 text-sm">لا يوجد بنود مضافة</p>}
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- مكون نافذة التقرير المالي (الجديد) ---
const ReportModal = ({ isOpen, onClose, onGenerate }) => {
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2 text-blue-400">
                        <PieChart size={24}/> التقرير المالي المفصل
                    </h3>
                    <button onClick={onClose}><X size={20} className="text-slate-500 hover:text-red-500"/></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-1">من تاريخ</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-1">إلى تاريخ</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500"/>
                    </div>
                    
                    <div className="pt-4">
                        <Button onClick={() => onGenerate(startDate, endDate)} className="w-full bg-blue-600 text-white hover:bg-blue-500 py-3 shadow-lg shadow-blue-600/20 border-none">
                            <Printer size={18} className="ml-2"/> استخراج وطباعة التقرير
                        </Button>
                    </div>
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
    financeReasons = [], financeReasonsCollection 
}) {
  const [viewMode, setViewMode] = useState('income'); 
  // ✅ أضفنا extraName للحالة
  const [payForm, setPayForm] = useState({ sid: '', amount: '', reason: '', customReason: '', details: '', method: 'cash', extraName: '' }); 
  const [expForm, setExpForm] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); 
  const [incomeFilterStudent, setIncomeFilterStudent] = useState(null);
  const [showReasonsModal, setShowReasonsModal] = useState(false); 
  const [showReportModal, setShowReportModal] = useState(false);

  const branchPayments = payments.filter(p => p.branch === selectedBranch);
  const branchExpenses = expenses.filter(e => e.branch === selectedBranch);
  
  const filteredPayments = (incomeFilterStudent ? branchPayments.filter(p => p.studentId === incomeFilterStudent) : branchPayments)
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  const sortedExpenses = [...branchExpenses].sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleAddReason = async (title) => {
      if (financeReasons.some(r => r.title === title)) return alert("هذا البند موجود مسبقاً");
      await financeReasonsCollection.add({ title: title, branch: selectedBranch, createdAt: new Date().toISOString() });
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
    
    if (!payForm.reason && financeReasons.length > 0) return alert("الرجاء اختيار سبب الدفع");

    const finalReason = payForm.reason === 'أخرى' ? payForm.customReason : payForm.reason; 
    
    // ✅ منطق دمج الأسماء: إذا وجد اسم إضافي، ندمجه مع اسم الطالب
    const paymentName = payForm.extraName 
        ? `${selectedStudent.name} و ${payForm.extraName}` 
        : selectedStudent.name;

    const newPay = { 
        id: Date.now().toString(), 
        studentId: selectedStudent.id, 
        name: paymentName, // نستخدم الاسم المدمج هنا
        amount: Number(payForm.amount), 
        reason: finalReason, 
        details: payForm.details, 
        method: payForm.method || 'cash', 
        date: new Date().toISOString().split('T')[0], 
        branch: selectedBranch 
    }; 
    
    await paymentsCollection.add(newPay); 
    logActivity("قبض مالي", `استلام ${payForm.amount} من ${paymentName}`); 
    
    // تصفير النموذج
    setPayForm({ sid: '', amount: '', reason: '', customReason: '', details: '', method: 'cash', extraName: '' }); 
  };

  const handleAddExpense = async (e) => { 
    e.preventDefault(); 
    await expensesCollection.add({ id: Date.now().toString(), title: expForm.title, amount: Number(expForm.amount), date: expForm.date, branch: selectedBranch }); 
    logActivity("مصروف", `صرف ${expForm.amount} لـ ${expForm.title}`); 
    setExpForm({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); 
  };

  const deletePayment = async (id) => { if(confirm('حذف السند؟')) await paymentsCollection.remove(id); };
  const deleteExpense = async (id) => { if(confirm('حذف المصروف؟')) await expensesCollection.remove(id); };

  // --- دالة طباعة التقرير المالي المجمع ---
  const handlePrintReport = (startDate, endDate) => {
    // 1. تصفية البيانات حسب التاريخ
    const reportData = branchPayments.filter(p => {
        const pDate = new Date(p.date); // assuming date is YYYY-MM-DD
        const start = new Date(startDate);
        const end = new Date(endDate);
        return pDate >= start && pDate <= end;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 2. حساب المجموعات
    const totalCash = reportData.filter(p => !p.method || p.method === 'cash').reduce((acc, curr) => acc + curr.amount, 0);
    const totalCliq = reportData.filter(p => p.method === 'cliq').reduce((acc, curr) => acc + curr.amount, 0);
    const grandTotal = totalCash + totalCliq;

    // 3. إنشاء نافذة الطباعة
    const printWin = window.open('', 'REPORT', 'height=800,width=1000');
    const logoUrl = window.location.origin + IMAGES.LOGO;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>تقرير مالي - ${selectedBranch}</title>
          <style>
             @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
             body { font-family: 'Cairo', sans-serif; padding: 20px; }
             .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
             .logo { height: 80px; margin-bottom: 10px; }
             .stats-box { display: flex; gap: 20px; margin-bottom: 30px; justify-content: center; }
             .stat { border: 1px solid #ddd; padding: 15px; border-radius: 10px; width: 200px; text-align: center; }
             .stat-title { font-size: 14px; color: #666; font-weight: bold; }
             .stat-value { font-size: 24px; font-weight: bold; margin-top: 5px; }
             .cash { border-color: #16a34a; background: #f0fdf4; color: #16a34a; }
             .cliq { border-color: #2563eb; background: #eff6ff; color: #2563eb; }
             .total { border-color: #000; background: #fafafa; color: #000; }
             
             table { width: 100%; border-collapse: collapse; font-size: 14px; }
             th, td { border: 1px solid #ddd; padding: 10px; text-align: right; }
             th { background-color: #f3f4f6; }
             tr:nth-child(even) { background-color: #f9fafb; }
             
             @media print {
                button { display: none; }
                body { padding: 0; }
             }
          </style>
        </head>
        <body>
            <div class="header">
                <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                <h2>تقرير المقبوضات المالي</h2>
                <p>الفرع: ${selectedBranch}</p>
                <p>الفترة: من <strong>${startDate}</strong> إلى <strong>${endDate}</strong></p>
            </div>

            <div class="stats-box">
                <div class="stat cash">
                    <div class="stat-title">مجموع الكاش</div>
                    <div class="stat-value">${totalCash} JD</div>
                </div>
                <div class="stat cliq">
                    <div class="stat-title">مجموع كليك (CliQ)</div>
                    <div class="stat-value">${totalCliq} JD</div>
                </div>
                <div class="stat total">
                    <div class="stat-title">الإجمالي الكلي</div>
                    <div class="stat-value">${grandTotal} JD</div>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>التاريخ</th>
                        <th>الطالب</th>
                        <th>المبلغ</th>
                        <th>طريقة الدفع</th>
                        <th>البيان</th>
                    </tr>
                </thead>
                <tbody>
                    ${reportData.map((p, i) => `
                        <tr>
                            <td>${i + 1}</td>
                            <td>${p.date}</td>
                            <td>${p.name}</td>
                            <td style="font-weight:bold">${p.amount}</td>
                            <td>${p.method === 'cliq' ? 'كليك (CliQ)' : 'كاش'}</td>
                            <td>${p.reason} ${p.details ? `(${p.details})` : ''}</td>
                        </tr>
                    `).join('')}
                    ${reportData.length === 0 ? '<tr><td colspan="6" style="text-align:center">لا يوجد بيانات في هذه الفترة</td></tr>' : ''}
                </tbody>
            </table>

            <div style="margin-top: 40px; display: flex; justify-content: space-between; padding: 0 50px;">
                <div> </div>
                <div>توقيع الإدارة</div>
            </div>
            
            <script>
               window.onload = function() { window.print(); }
            </script>
        </body>
      </html>
    `;

    printWin.document.write(htmlContent);
    printWin.document.close();
    setShowReportModal(false);
  };

  const printReceipt = (payment) => {
    const receiptWindow = window.open('', 'PRINT', 'height=800,width=1000');
    const logoUrl = window.location.origin + IMAGES.LOGO;
    const methodText = payment.method === 'cliq' ? 'كليك (CliQ)' : 'نقدًا (Cash)';

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>سند قبض - ${payment.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
            @page { size: A5 landscape; margin: 0; }
            body { font-family: 'Cairo', sans-serif; margin: 0; padding: 10mm; background-color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; height: 100vh; box-sizing: border-box; }
            .receipt-border { border: 3px double #444; height: 96%; position: relative; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
            .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); width: 50%; opacity: 0.08; z-index: 0; pointer-events: none; filter: grayscale(100%); }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b45309; padding-bottom: 10px; margin-bottom: 15px; position: relative; z-index: 2; }
            .company-info h1 { margin: 0; font-size: 22px; color: #b45309; font-weight: 900; }
            .company-info p { margin: 2px 0; font-size: 12px; font-weight: bold; color: #555; }
            .logo img { height: 70px; object-fit: contain; }
            .meta-info { text-align: left; font-size: 12px; border-right: 2px solid #eee; padding-right: 10px; }
            .meta-info div { margin-bottom: 3px; }
            .content { position: relative; z-index: 2; flex-grow: 1; }
            .title { text-align: center; font-size: 24px; font-weight: 900; margin: 10px 0 20px; text-decoration: underline; text-decoration-color: #b45309; text-underline-offset: 5px; }
            .row { display: flex; align-items: baseline; margin-bottom: 12px; font-size: 16px; }
            .label { font-weight: bold; width: 110px; color: #333; }
            .value { flex: 1; border-bottom: 1px dotted #888; font-weight: 700; padding: 0 5px; }
            .amount-container { position: absolute; left: 20px; top: 40px; border: 2px solid #333; padding: 5px 15px; border-radius: 8px; background: #f9f9f9; transform: rotate(-5deg); box-shadow: 2px 2px 0 #ccc; }
            .amount-number { font-size: 20px; font-weight: 900; direction: ltr; }
            .footer { margin-top: 20px; position: relative; z-index: 2; }
            .signatures { display: flex; justify-content: space-between; padding: 0 40px; margin-bottom: 15px; }
            .sign-box { text-align: center; width: 150px; }
            .sign-line { border-top: 1px solid #333; margin-bottom: 5px; }
            .sign-title { font-size: 12px; font-weight: bold; color: #555; }
            .branches-box { border-top: 2px solid #b45309; padding-top: 8px; font-size: 10px; display: flex; justify-content: space-between; background: #fff; }
            .branch { display: flex; flex-direction: column; width: 48%; }
            .branch span { display: block; margin-bottom: 2px; }
            .phone { direction: ltr; text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt-border">
            <img src="${logoUrl}" class="watermark" onerror="this.style.display='none'"/>
            <div class="header">
              <div class="company-info">
                <h1>أكاديمية الشجاع للتايكواندو</h1>
                <p>فرع: ${selectedBranch}</p>
              </div>
              <div class="logo">
                <img src="${logoUrl}" onerror="this.style.display='none'"/>
              </div>
              <div class="meta-info">
                <div>رقم السند: <strong>${payment.id.slice(-6)}</strong></div>
                <div>التاريخ: <strong>${payment.date}</strong></div>
              </div>
            </div>
            <div class="content">
              <div class="title">سند قبض</div>
              <div class="amount-container">
                <div class="amount-number">${payment.amount} JD</div>
              </div>
              <div class="row">
                <span class="label">استلمنا من:</span>
                <span class="value">${payment.name}</span>
              </div>
              <div class="row">
                <span class="label">مبلغ وقدره:</span>
                <span class="value">${payment.amount} دينار أردني</span>
              </div>
              <div class="row">
                <span class="label">طريقة الدفع:</span>
                <span class="value">${methodText}</span>
              </div>
              <div class="row">
                <span class="label">وذلك عن:</span>
                <span class="value">${payment.reason} ${payment.details ? `(${payment.details})` : ''}</span>
              </div>
            </div>
            <div class="footer">
              <div class="signatures">
                <div class="sign-box">
                  <div class="sign-line"></div>
                  <div class="sign-title">توقيع الادارة</div>
                </div>
                <div class="sign-box">
                  <div class="sign-line"></div>
                  <div class="sign-title">توقيع المستلم</div>
                </div>
              </div>
              <div class="branches-box">
                <div class="branch">
                  <span style="font-weight:bold; color:#b45309">الفرع الأول: شفابدران</span>
                  <span>شارع رفعت شموط</span>
                  <span class="phone">079 5629 606</span>
                </div>
                <div class="branch">
                  <span style="font-weight:bold; color:#b45309">الفرع الثاني: أبو نصير</span>
                  <span>دوار البحرية - مجمع الفرّا</span>
                  <span class="phone">079 0368 603</span>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    receiptWindow.document.write(htmlContent);
    receiptWindow.document.close();
    
    receiptWindow.onload = () => {
        receiptWindow.focus();
        setTimeout(() => {
            receiptWindow.print();
            receiptWindow.close();
        }, 500);
    };
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0 font-sans">
      
      {/* نافذة إدارة الأسباب */}
      <ReasonsModal 
        isOpen={showReasonsModal} 
        onClose={() => setShowReasonsModal(false)} 
        reasons={financeReasons}
        onAdd={handleAddReason}
        onDelete={handleDeleteReason}
      />

      {/* نافذة التقرير المالي */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onGenerate={handlePrintReport}
      />

      {/* Top Toggle Switch */}
      <div className="flex gap-4 mb-6 bg-slate-900 p-1 rounded-2xl border border-slate-800">
        <button onClick={() => setViewMode('income')} className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-sm ${viewMode === 'income' ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'bg-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
           الإيرادات (القبض)
        </button>
        <button onClick={() => setViewMode('expense')} className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-sm ${viewMode === 'expense' ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' : 'bg-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
           المصاريف
        </button>
      </div>
      
      {viewMode === 'income' ? (
        <>
           {/* زر التقرير المالي */}
           <div className="flex justify-end mb-4">
              <Button onClick={() => setShowReportModal(true)} className="bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20 shadow-lg flex items-center gap-2 border-none">
                 <PieChart size={18} /> التقارير المالية
              </Button>
           </div>

          {/* Add Payment Form */}
          <Card title="سند قبض جديد" className="border-green-500/20 shadow-lg shadow-green-900/10 bg-slate-900">
            <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="relative col-span-1 md:col-span-1">
                  <label className="text-xs block mb-1 font-bold text-slate-400">اسم الطالب</label>
                  <StudentSearch students={students} onSelect={(s) => setPayForm({...payForm, sid: s.name, studentObjId: s.id})} placeholder="ابحث..." />
              </div>
              
              {/* ✅ الحقل الجديد: اسم إضافي */}
              <div className="col-span-1">
                  <label className="text-xs block mb-1 font-bold text-slate-400">اسم الاخ (اختياري)</label>
                  <input 
                    className="w-full bg-slate-950 border border-slate-700 p-2 rounded-xl focus:border-green-500 outline-none placeholder-slate-600 text-slate-200 text-xs h-[45px]" 
                    value={payForm.extraName} 
                    onChange={e=>setPayForm({...payForm, extraName:e.target.value})} 
                    placeholder="اكتب الاسم الثاني هنا" 
                  />
              </div>

              <div>
                  <label className="text-xs block mb-1 font-bold text-slate-400">المبلغ</label>
                  <input type="number" className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl focus:border-green-500 outline-none placeholder-slate-600" value={payForm.amount} onChange={e=>setPayForm({...payForm, amount:e.target.value})} required placeholder="0.00" />
              </div>
              
              <div>
                  <label className="text-xs block mb-1 font-bold text-slate-400">طريقة الدفع</label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl focus:border-green-500 outline-none h-[45px]"
                    value={payForm.method}
                    onChange={e => setPayForm({...payForm, method: e.target.value})}
                  >
                    <option value="cash">كاش (Cash)</option>
                    <option value="cliq">كليك (CliQ)</option>
                  </select>
              </div>

              {/* قائمة الأسباب مع زر الإعدادات */}
              <div className="relative">
                  <label className="text-xs block mb-1 font-bold text-slate-400 flex justify-between">
                      السبب
                      <button type="button" onClick={() => setShowReasonsModal(true)} className="text-green-500 hover:text-green-400 text-[10px] flex items-center gap-1 bg-green-900/20 px-2 py-0.5 rounded cursor-pointer border border-green-500/20">
                          <Settings size={10}/> تعديل القائمة
                      </button>
                  </label>
                  <select 
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl focus:border-green-500 outline-none cursor-pointer h-[45px]" 
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
                  <div className="col-span-1 md:col-span-4">
                     <label className="text-xs block mb-1 font-bold text-slate-400">وضح السبب</label>
                     <input className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-green-500" value={payForm.customReason} onChange={e=>setPayForm({...payForm, customReason:e.target.value})} required />
                  </div>
              )}
              <div className="col-span-1 md:col-span-4">
                  <label className="text-xs block mb-1 font-bold text-slate-400">تفاصيل إضافية (اختياري)</label>
                  <input className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-green-500 placeholder-slate-600" value={payForm.details} onChange={e=>setPayForm({...payForm, details:e.target.value})} placeholder="مثال: عن شهر 12 + 1" />
              </div>
              <div className="col-span-1 md:col-span-4 mt-2">
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-600/20 py-3 border-none">حفظ وقبض</Button>
              </div>
            </form>
          </Card>

          {/* Filter */}
          <div className="flex items-center gap-2 mb-2 w-full md:w-64">
             <StudentSearch students={students} onSelect={(s) => setIncomeFilterStudent(s.id)} onClear={() => setIncomeFilterStudent(null)} placeholder="فلترة حسب الطالب..." showAllOption={true} />
          </div>

          {/* --- DESKTOP VIEW (Table) --- */}
          <div className="hidden md:block">
            <Card noPadding className="bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th className="p-3">#</th>
                            <th className="p-3">الطالب</th>
                            <th className="p-3">البيان</th>
                            <th className="p-3">طريقة الدفع</th>
                            <th className="p-3">التاريخ</th>
                            <th className="p-3">المبلغ</th>
                            <th className="p-3">طباعة</th>
                            <th className="p-3">حذف</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900">
                        {filteredPayments.map(p => (
                            <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="p-3 text-slate-600 font-mono text-xs">{p.id.slice(-6)}</td>
                                <td className="p-3 font-bold text-slate-200">{p.name}</td>
                                <td className="p-3 text-slate-400">
                                    <span className="block font-bold text-xs text-slate-300">{p.reason}</span>
                                    <span className="text-[10px] text-slate-500">{p.details}</span>
                                </td>
                                <td className="p-3">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${p.method === 'cliq' ? 'bg-blue-900/20 text-blue-400 border-blue-500/20' : 'bg-green-900/20 text-green-400 border-green-500/20'}`}>
                                        {p.method === 'cliq' ? 'كليك' : 'كاش'}
                                    </span>
                                </td>
                                <td className="p-3 text-xs text-slate-500">{p.date}</td>
                                <td className="p-3 font-bold text-green-400">+{p.amount}</td>
                                <td className="p-3"><button onClick={()=>printReceipt(p)} className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 text-slate-400 border border-slate-700"><Printer size={16}/></button></td>
                                <td className="p-3"><button onClick={()=>deletePayment(p.id)} className="p-2 bg-red-900/20 rounded-lg hover:bg-red-900/30 text-red-400 border border-red-500/20"><Trash2 size={16}/></button></td>
                            </tr>
                        ))}
                         {filteredPayments.length === 0 && <tr><td colSpan="8" className="p-8 text-center text-slate-600">لا يوجد سندات</td></tr>}
                    </tbody>
                </table>
            </Card>
          </div>

          {/* --- MOBILE VIEW (Cards) --- */}
          <div className="md:hidden grid gap-4">
              {filteredPayments.map(p => (
                  <div key={p.id} className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 flex flex-col gap-3 relative overflow-hidden">
                      <div className={`absolute top-0 left-0 w-1 h-full ${p.method === 'cliq' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
                      <div className="flex justify-between items-start pl-2">
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <User size={14} className="text-slate-500"/>
                                  <span className="font-bold text-slate-200">{p.name}</span>
                              </div>
                              <div className="text-xs text-slate-500 flex items-center gap-2">
                                  <Calendar size={12}/> {p.date}
                              </div>
                          </div>
                          <div className="text-green-400 font-bold text-lg bg-green-900/20 px-2 py-1 rounded-lg border border-green-500/20">
                              +{p.amount}
                          </div>
                      </div>
                      
                      <div className="bg-slate-950 p-2 rounded-lg text-sm text-slate-400 border border-slate-800">
                          <div className="flex justify-between items-center mb-1">
                             <div className="flex items-center gap-2">
                                <FileText size={14} className="text-slate-500"/>
                                <span className="font-bold text-xs text-slate-300">{p.reason}</span>
                             </div>
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.method === 'cliq' ? 'bg-blue-900/20 text-blue-400 border-blue-500/20' : 'bg-green-900/20 text-green-400 border-green-500/20'}`}>
                                {p.method === 'cliq' ? 'كليك' : 'كاش'}
                             </span>
                          </div>
                          <span className="text-[10px] pr-6 block text-slate-500">{p.details}</span>
                      </div>

                      <div className="flex justify-end gap-2 mt-1 border-t pt-3 border-slate-800">
                          <button onClick={()=>printReceipt(p)} className="flex items-center gap-1 text-xs bg-blue-900/20 text-blue-400 px-3 py-2 rounded-lg font-bold border border-blue-500/20 hover:bg-blue-900/30">
                              <Printer size={14}/> طباعة
                          </button>
                          <button onClick={()=>deletePayment(p.id)} className="flex items-center gap-1 text-xs bg-red-900/20 text-red-400 px-3 py-2 rounded-lg font-bold border border-red-500/20 hover:bg-red-900/30">
                              <Trash2 size={14}/> حذف
                          </button>
                      </div>
                  </div>
              ))}
              {filteredPayments.length === 0 && <div className="text-center p-8 text-slate-600 bg-slate-900 rounded-xl border border-slate-800 border-dashed">لا يوجد سندات</div>}
          </div>
        </>
      ) : (
        <>
          {/* Expenses Form */}
          <Card title="تسجيل مصروف" className="border-red-500/20 shadow-lg shadow-red-900/10 bg-slate-900">
              <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="col-span-1 md:col-span-2">
                    <label className="text-xs block mb-1 font-bold text-slate-400">البند (سبب الصرف)</label>
                    <input className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl focus:border-red-500 outline-none placeholder-slate-600" value={expForm.title} onChange={e=>setExpForm({...expForm, title:e.target.value})} required placeholder="مثال: فاتورة كهرباء" />
                </div>
                <div>
                    <label className="text-xs block mb-1 font-bold text-slate-400">المبلغ</label>
                    <input type="number" className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl focus:border-red-500 outline-none placeholder-slate-600" value={expForm.amount} onChange={e=>setExpForm({...expForm, amount:e.target.value})} required placeholder="0.00" />
                </div>
                <div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 py-2.5 border-none">حفظ</Button>
                </div>
              </form>
          </Card>
          
          {/* --- DESKTOP VIEW (Expenses Table) --- */}
          <div className="hidden md:block">
            <Card noPadding className="bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th className="p-3">البند</th>
                            <th className="p-3">التاريخ</th>
                            <th className="p-3">المبلغ</th>
                            <th className="p-3">حذف</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900">
                        {sortedExpenses.map(e=>(
                            <tr key={e.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="p-3 font-bold text-slate-300">{e.title}</td>
                                <td className="p-3 text-slate-500 text-xs">{e.date}</td>
                                <td className="p-3 text-red-400 font-bold">-{e.amount}</td>
                                <td className="p-3"><button onClick={()=>deleteExpense(e.id)} className="text-red-400 p-2 bg-red-900/20 rounded-lg hover:bg-red-900/30 border border-red-500/20"><Trash2 size={16}/></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
          </div>

          {/* --- MOBILE VIEW (Expenses Cards) --- */}
          <div className="md:hidden grid gap-4">
              {sortedExpenses.map(e => (
                  <div key={e.id} className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                      <div className="pl-3">
                          <h4 className="font-bold text-slate-200">{e.title}</h4>
                          <span className="text-xs text-slate-500 block mt-1">{e.date}</span>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                          <span className="font-bold text-red-400 text-lg">-{e.amount}</span>
                          <button onClick={()=>deleteExpense(e.id)} className="text-red-400 hover:text-red-300 bg-red-900/20 p-1.5 rounded-lg border border-red-500/20">
                              <Trash2 size={16}/>
                          </button>
                      </div>
                  </div>
              ))}
              {sortedExpenses.length === 0 && <div className="text-center p-8 text-slate-600 bg-slate-900 rounded-xl border border-slate-800 border-dashed">لا يوجد مصاريف</div>}
          </div>
        </>
      )}
    </div>
  );
}
// src/views/dashboard/FinanceManager.jsx
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { DollarSign, Printer, Trash2, Calendar, FileText, User, Settings, Plus, X, CreditCard, Banknote, LayoutDashboard, ShoppingBag, TrendingUp, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Button, Card, StudentSearch } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

// --- Reasons Modal (Unchanged) ---
const ReasonsModal = ({ isOpen, onClose, reasons, onAdd, onDelete }) => {
    const [newReason, setNewReason] = useState("");
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Settings size={20} className="text-gray-600"/> إدارة بنود الدفع</h3>
                    <button onClick={onClose}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
                </div>
                <div className="flex gap-2 mb-6">
                    <input className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-green-500 outline-none" placeholder="اسم البند الجديد..." value={newReason} onChange={(e) => setNewReason(e.target.value)} />
                    <button onClick={() => { if(newReason) { onAdd(newReason); setNewReason(""); } }} className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700"><Plus size={20}/></button>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto mb-4 custom-scrollbar">
                    {reasons.map((r, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100"><span className="font-bold text-gray-700">{r.title}</span><button onClick={() => onDelete(r)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"><Trash2 size={18}/></button></div>
                    ))}
                </div>
            </div>
        </div>, document.body
    );
};

export default function FinanceManager({ 
    students, payments, expenses, 
    paymentsCollection, expensesCollection, 
    // NEW PROPS (Pass these from main layout)
    products = [], productsCollection,
    extraIncome = [], extraIncomeCollection, 
    // ---------
    selectedBranch, logActivity,
    financeReasons = [], financeReasonsCollection 
}) {
  // Main Tab State: 'reception', 'admin', 'store'
  const [activeTab, setActiveTab] = useState('reception');

  // Reception State
  const [payForm, setPayForm] = useState({ sid: '', amount: '', reason: '', customReason: '', details: '', method: 'cash' }); 
  const [incomeFilterStudent, setIncomeFilterStudent] = useState(null);
  const [showReasonsModal, setShowReasonsModal] = useState(false); 
  
  // Admin Dashboard State
  const [dashboardMonth, setDashboardMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [expForm, setExpForm] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); 
  const [extraIncomeForm, setExtraIncomeForm] = useState({ title: '', amount: '', date: new Date().toISOString().split('T')[0] });
  
  // Bank Statement Date Range State
  const [calcDates, setCalcDates] = useState({ 
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], 
    end: new Date().toISOString().split('T')[0] 
  });

  // Store Admin State
  const [productForm, setProductForm] = useState({ name: '', price: '', image: '' });

  // --- DATA FILTERING ---
  const branchPayments = payments.filter(p => p.branch === selectedBranch);
  const branchExpenses = expenses.filter(e => e.branch === selectedBranch);
  const branchExtraIncome = extraIncome.filter(i => i.branch === selectedBranch);
  const branchProducts = products; 

  // 1. Reception Table (Recent payments)
  const filteredPayments = (incomeFilterStudent ? branchPayments.filter(p => p.studentId === incomeFilterStudent) : branchPayments)
      .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));

  // 2. Dashboard Calculations (Based on Selected Month)
  const dashboardStats = useMemo(() => {
    const [year, month] = dashboardMonth.split('-');
    const filterFn = (item) => {
        const itemDate = new Date(item.date);
        return itemDate.getFullYear() === parseInt(year) && itemDate.getMonth() === parseInt(month) - 1;
    };

    const monthlyPayments = branchPayments.filter(filterFn);
    const monthlyExpenses = branchExpenses.filter(filterFn);
    const monthlyExtraIncome = branchExtraIncome.filter(filterFn);

    const totalStudents = monthlyPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalExtra = monthlyExtraIncome.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalExp = monthlyExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const cashPayments = monthlyPayments.filter(p => p.method !== 'cliq').reduce((sum, p) => sum + Number(p.amount), 0);
    const cliqPayments = monthlyPayments.filter(p => p.method === 'cliq').reduce((sum, p) => sum + Number(p.amount), 0);

    return {
        totalIncome: totalStudents + totalExtra,
        totalStudents,
        totalExtra,
        totalExpenses: totalExp,
        netProfit: (totalStudents + totalExtra) - totalExp,
        cash: cashPayments,
        cliq: cliqPayments,
        paymentsCount: monthlyPayments.length
    };
  }, [branchPayments, branchExpenses, branchExtraIncome, dashboardMonth]);


  // --- HANDLERS ---

  // 1. Add Payment (Reception)
  const handleAddPayment = async (e) => { 
    e.preventDefault(); 
    if(!payForm.studentObjId) return alert('اختر طالباً'); 
    const selectedStudent = students.find(s => s.id === payForm.studentObjId); 
    if(!selectedStudent) return alert('طالب غير موجود'); 
    if (!payForm.reason && financeReasons.length > 0) return alert("الرجاء اختيار سبب الدفع");

    const finalReason = payForm.reason === 'أخرى' ? payForm.customReason : payForm.reason; 
    const newPay = { 
        id: Date.now().toString(), studentId: selectedStudent.id, name: selectedStudent.name, 
        amount: Number(payForm.amount), reason: finalReason, details: payForm.details, 
        method: payForm.method, date: new Date().toISOString().split('T')[0], branch: selectedBranch 
    }; 
    await paymentsCollection.add(newPay); 
    logActivity("قبض مالي", `استلام ${payForm.amount} (${payForm.method === 'cliq' ? 'Cliq' : 'نقداً'}) من ${selectedStudent.name}`); 
    setPayForm({ sid: '', amount: '', reason: '', customReason: '', details: '', method: 'cash' }); 
  };

  const deletePayment = async (id) => { if(confirm('حذف السند؟')) await paymentsCollection.remove(id); };

  // 2. Add Expense (Admin)
  const handleAddExpense = async (e) => { 
    e.preventDefault(); 
    await expensesCollection.add({ id: Date.now().toString(), title: expForm.title, amount: Number(expForm.amount), date: expForm.date, branch: selectedBranch }); 
    setExpForm({ title: '', amount: '', date: new Date().toISOString().split('T')[0] }); 
  };
  const deleteExpense = async (id) => { if(confirm('حذف المصروف؟')) await expensesCollection.remove(id); };

  // 3. Add Extra Income (Admin)
  const handleAddExtraIncome = async (e) => {
    e.preventDefault();
    if (!extraIncomeCollection) return alert("خطأ: لم يتم ربط قاعدة بيانات الدخل الإضافي");
    await extraIncomeCollection.add({ id: Date.now().toString(), title: extraIncomeForm.title, amount: Number(extraIncomeForm.amount), date: extraIncomeForm.date, branch: selectedBranch });
    setExtraIncomeForm({ title: '', amount: '', date: new Date().toISOString().split('T')[0] });
  };
  const deleteExtraIncome = async (id) => { if(confirm('حذف هذا الدخل؟')) await extraIncomeCollection.remove(id); };

  // 4. Add Product (Store)
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if(!productsCollection) return alert("خطأ: لم يتم ربط قاعدة بيانات المنتجات");
    await productsCollection.add({ id: Date.now().toString(), ...productForm });
    setProductForm({ name: '', price: '', image: '' });
  };
  const deleteProduct = async (id) => { if(confirm('حذف المنتج من المتجر؟')) await productsCollection.remove(id); };


  // --- PRINT LOGIC 1: BANK STATEMENT ---
  const printStatement = () => {
    const start = new Date(calcDates.start);
    const end = new Date(calcDates.end);
    start.setHours(0,0,0,0);
    end.setHours(23,59,59,999);

    const reportPayments = branchPayments.filter(p => {
        const pDate = new Date(p.date);
        return pDate >= start && pDate <= end;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    const totals = reportPayments.reduce((acc, curr) => {
        if(curr.method === 'cliq') acc.cliq += Number(curr.amount);
        else acc.cash += Number(curr.amount);
        return acc;
    }, { cash: 0, cliq: 0 });

    const logoUrl = window.location.origin + IMAGES.LOGO;
    const printWindow = window.open('', 'PRINT', 'height=800,width=1000');

    const htmlContent = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><title>كشف حساب مالي</title><style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'); body { font-family: 'Cairo', sans-serif; padding: 20px; background: #fff; } .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; } .logo { width: 80px; height: 80px; object-fit: contain; display: block; margin: 0 auto 10px; } h1 { margin: 5px 0; color: #b45309; } .meta { font-size: 14px; color: #555; display: flex; justify-content: space-between; margin-top: 15px; } table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; } th { background: #f3f4f6; padding: 10px; border: 1px solid #ddd; font-weight: bold; } td { padding: 8px; border: 1px solid #ddd; } .amount { font-weight: bold; direction: ltr; text-align: left; } .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; } .cash { background: #dcfce7; color: #166534; } .cliq { background: #f3e8ff; color: #6b21a8; } .summary-box { margin-top: 30px; border: 2px solid #333; padding: 15px; background: #f9fafb; page-break-inside: avoid; } .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 16px; border-bottom: 1px dashed #ccc; padding-bottom: 5px; } .total-row { font-size: 20px; font-weight: 900; color: #b45309; border-top: 2px solid #333; padding-top: 10px; border-bottom: none; } @media print { @page { size: A4; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }</style></head><body><div class="header"><img src="${logoUrl}" class="logo" /><h1>أكاديمية الشجاع للتايكواندو</h1><h3>كشف حساب مالي وتفصيلي</h3><div class="meta"><div><strong>الفرع:</strong> ${selectedBranch}</div><div><strong>الفترة:</strong> من ${calcDates.start} إلى ${calcDates.end}</div><div><strong>تاريخ الطباعة:</strong> ${new Date().toLocaleDateString('ar-EG')}</div></div></div><table><thead><tr><th width="5%">#</th><th width="15%">التاريخ</th><th width="25%">الطالب</th><th width="25%">البيان</th><th width="10%">الطريقة</th><th width="15%">المبلغ</th></tr></thead><tbody>${reportPayments.map((p, i) => `<tr><td>${i + 1}</td><td>${p.date}</td><td><strong>${p.name}</strong></td><td>${p.reason} <span style="font-size:10px; color:#666">${p.details ? `(${p.details})` : ''}</span></td><td style="text-align:center"><span class="badge ${p.method === 'cliq' ? 'cliq' : 'cash'}">${p.method === 'cliq' ? 'CLIQ' : 'CASH'}</span></td><td class="amount">${p.amount} JD</td></tr>`).join('')}${reportPayments.length === 0 ? '<tr><td colspan="6" style="text-align:center; padding:20px;">لا يوجد حركات في هذه الفترة</td></tr>' : ''}</tbody></table><div class="summary-box"><div class="summary-row"><span>مجموع المقبوضات النقدية (CASH):</span><strong>${totals.cash} JD</strong></div><div class="summary-row"><span>مجموع المحافظ الإلكترونية (CLIQ):</span><strong>${totals.cliq} JD</strong></div><div class="summary-row total-row"><span>المجموع الكلي (الإيرادات):</span><span>${totals.cash + totals.cliq} JD</span></div></div><div style="margin-top:50px; display:flex; justify-content:space-between; padding:0 50px;"><div>توقيع المحاسب</div><div>توقيع الإدارة</div></div></body></html>`;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.focus(); setTimeout(() => { printWindow.print(); }, 500); };
  };

  // --- PRINT LOGIC 2: RECEIPT ---
  const printReceipt = (payment) => {
    const receiptWindow = window.open('', 'PRINT', 'height=800,width=1000');
    const logoUrl = window.location.origin + IMAGES.LOGO;
    const paymentMethodText = payment.method === 'cliq' ? 'محفظة إلكترونية (Cliq)' : 'نقداً (Cash)';
    const htmlContent = `<!DOCTYPE html><html lang="ar" dir="rtl"><head><title>سند قبض - ${payment.name}</title><style>@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap'); @page { size: A5 landscape; margin: 0; } body { font-family: 'Cairo', sans-serif; margin: 0; padding: 10mm; background-color: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; height: 100vh; box-sizing: border-box; } .receipt-border { border: 3px double #444; height: 96%; position: relative; padding: 20px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; } .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-25deg); width: 50%; opacity: 0.08; z-index: 0; pointer-events: none; filter: grayscale(100%); } .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #b45309; padding-bottom: 10px; margin-bottom: 15px; position: relative; z-index: 2; } .company-info h1 { margin: 0; font-size: 22px; color: #b45309; font-weight: 900; } .company-info p { margin: 2px 0; font-size: 12px; font-weight: bold; color: #555; } .logo img { height: 70px; object-fit: contain; } .meta-info { text-align: left; font-size: 12px; border-right: 2px solid #eee; padding-right: 10px; } .meta-info div { margin-bottom: 3px; } .content { position: relative; z-index: 2; flex-grow: 1; } .title { text-align: center; font-size: 24px; font-weight: 900; margin: 10px 0 20px; text-decoration: underline; text-decoration-color: #b45309; text-underline-offset: 5px; } .row { display: flex; align-items: baseline; margin-bottom: 12px; font-size: 16px; } .label { font-weight: bold; width: 110px; color: #333; } .value { flex: 1; border-bottom: 1px dotted #888; font-weight: 700; padding: 0 5px; } .amount-container { position: absolute; left: 20px; top: 40px; border: 2px solid #333; padding: 5px 15px; border-radius: 8px; background: #f9f9f9; transform: rotate(-5deg); box-shadow: 2px 2px 0 #ccc; } .amount-number { font-size: 20px; font-weight: 900; direction: ltr; } .footer { margin-top: 20px; position: relative; z-index: 2; } .signatures { display: flex; justify-content: space-between; padding: 0 40px; margin-bottom: 15px; } .sign-box { text-align: center; width: 150px; } .sign-line { border-top: 1px solid #333; margin-bottom: 5px; } .sign-title { font-size: 12px; font-weight: bold; color: #555; } .branches-box { border-top: 2px solid #b45309; padding-top: 8px; font-size: 10px; display: flex; justify-content: space-between; background: #fff; } .branch { display: flex; flex-direction: column; width: 48%; } .branch span { display: block; margin-bottom: 2px; } .phone { direction: ltr; text-align: right; font-weight: bold; } </style></head><body><div class="receipt-border"><img src="${logoUrl}" class="watermark" onerror="this.style.display='none'"/><div class="header"><div class="company-info"><h1>أكاديمية الشجاع للتايكواندو</h1><p>فرع: ${selectedBranch}</p></div><div class="logo"><img src="${logoUrl}" onerror="this.style.display='none'"/></div><div class="meta-info"><div>رقم السند: <strong>${payment.id.slice(-6)}</strong></div><div>التاريخ: <strong>${payment.date}</strong></div></div></div><div class="content"><div class="title">سند قبض</div><div class="amount-container"><div class="amount-number">${payment.amount} JD</div></div><div class="row"><span class="label">استلمنا من:</span><span class="value">${payment.name}</span></div><div class="row"><span class="label">مبلغ وقدره:</span><span class="value">${payment.amount} دينار أردني</span></div><div class="row"><span class="label">طريقة الدفع:</span><span class="value">${paymentMethodText}</span></div><div class="row"><span class="label">وذلك عن:</span><span class="value">${payment.reason} ${payment.details ? `(${payment.details})` : ''}</span></div></div><div class="footer"><div class="signatures"><div class="sign-box"><div class="sign-line"></div><div class="sign-title">توقيع المحاسب</div></div><div class="sign-box"><div class="sign-line"></div><div class="sign-title">توقيع المستلم</div></div></div><div class="branches-box"><div class="branch"><span style="font-weight:bold; color:#b45309">الفرع الأول: شفابدران</span><span>شارع رفعت شموط</span><span class="phone">079 5629 606</span></div><div class="branch"><span style="font-weight:bold; color:#b45309">الفرع الثاني: أبو نصير</span><span>دوار البحرية - مجمع الفرّا</span><span class="phone">079 0368 603</span></div></div></div></div></body></html>`;
    receiptWindow.document.write(htmlContent); receiptWindow.document.close();
    receiptWindow.onload = () => { receiptWindow.focus(); setTimeout(() => { receiptWindow.print(); receiptWindow.close(); }, 500); };
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
      
      <ReasonsModal isOpen={showReasonsModal} onClose={() => setShowReasonsModal(false)} reasons={financeReasons} onAdd={handleAddReason} onDelete={handleDeleteReason} />

      {/* --- MASTER TABS --- */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 flex flex-wrap gap-2">
        <button onClick={() => setActiveTab('reception')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'reception' ? 'bg-black text-yellow-500 shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
            <User size={20}/> الاستقبال (Reception)
        </button>
        <button onClick={() => setActiveTab('admin')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'admin' ? 'bg-black text-yellow-500 shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
            <LayoutDashboard size={20}/> إدارة الحسابات (Admin)
        </button>
        <button onClick={() => setActiveTab('store')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${activeTab === 'store' ? 'bg-black text-yellow-500 shadow-lg' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
            <ShoppingBag size={20}/> المتجر (Store)
        </button>
      </div>


      {/* ================================================================================= */}
      {/* TAB 1: RECEPTION (FAST PAYMENTS) */}
      {/* ================================================================================= */}
      {activeTab === 'reception' && (
        <div className="animate-fade-in space-y-6">
             {/* Form */}
             <Card title="استلام دفعة جديدة (قسط / زي / بطولة)" className="border-green-100 shadow-green-50">
                <form onSubmit={handleAddPayment} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div className="relative"><label className="text-xs block mb-1 font-bold text-gray-700">اسم الطالب</label><StudentSearch students={students} onSelect={(s) => setPayForm({...payForm, sid: s.name, studentObjId: s.id})} placeholder="ابحث..." /></div>
                    <div><label className="text-xs block mb-1 font-bold text-gray-700">المبلغ</label><input type="number" className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-green-500 outline-none" value={payForm.amount} onChange={e=>setPayForm({...payForm, amount:e.target.value})} required placeholder="0.00" /></div>
                    <div>
                        <label className="text-xs block mb-1 font-bold text-gray-700">طريقة الدفع</label>
                        <div className="flex gap-2 bg-gray-50 p-1 rounded-xl border border-gray-100">
                            <button type="button" onClick={()=>setPayForm({...payForm, method:'cash'})} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${payForm.method==='cash'?'bg-white text-green-600 shadow-sm ring-1 ring-green-200':'text-gray-400 hover:text-gray-600'}`}><Banknote size={14}/> نقداً</button>
                            <button type="button" onClick={()=>setPayForm({...payForm, method:'cliq'})} className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-sm font-bold transition-colors ${payForm.method==='cliq'?'bg-white text-purple-600 shadow-sm ring-1 ring-purple-200':'text-gray-400 hover:text-gray-600'}`}><CreditCard size={14}/> Cliq</button>
                        </div>
                    </div>
                    <div className="relative">
                        <label className="text-xs block mb-1 font-bold text-gray-700 flex justify-between">السبب <button type="button" onClick={() => setShowReasonsModal(true)} className="text-green-600 text-[10px] flex items-center gap-1 bg-green-50 px-2 rounded"><Settings size={10}/> تعديل</button></label>
                        <select className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-green-500 outline-none bg-white" value={payForm.reason} onChange={e=>setPayForm({...payForm, reason:e.target.value})}>
                            <option value="" disabled>اختر السبب...</option>
                            {financeReasons.map((r, idx) => <option key={idx} value={r.title}>{r.title}</option>)}
                            <option value="أخرى">أخرى (كتابة يدوية)</option>
                        </select>
                    </div>
                    {payForm.reason === 'أخرى' && (<div className="col-span-1 md:col-span-3"><label className="text-xs block mb-1 font-bold text-gray-700">وضح السبب</label><input className="w-full border-2 border-gray-100 p-2 rounded-xl outline-none" value={payForm.customReason} onChange={e=>setPayForm({...payForm, customReason:e.target.value})} required /></div>)}
                    <div className="col-span-1 md:col-span-3"><label className="text-xs block mb-1 font-bold text-gray-700">تفاصيل إضافية</label><input className="w-full border-2 border-gray-100 p-2 rounded-xl outline-none" value={payForm.details} onChange={e=>setPayForm({...payForm, details:e.target.value})} placeholder="مثال: عن شهر 12 + 1" /></div>
                    <div className="col-span-1 md:col-span-3 mt-2"><Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20 py-3">حفظ وقبض</Button></div>
                </form>
            </Card>

            {/* Daily History Table */}
            <Card title="سجل المقبوضات اليومي">
                <div className="flex items-center gap-2 mb-4 w-full md:w-64"><StudentSearch students={students} onSelect={(s) => setIncomeFilterStudent(s.id)} onClear={() => setIncomeFilterStudent(null)} placeholder="فلترة حسب الطالب..." showAllOption={true} /></div>
                
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr><th className="p-3 rounded-r-lg">#</th><th className="p-3">الطالب</th><th className="p-3">البيان</th><th className="p-3">الطريقة</th><th className="p-3">التاريخ</th><th className="p-3">المبلغ</th><th className="p-3 rounded-l-lg">أدوات</th></tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredPayments.map(p => (
                                <tr key={p.id} className="hover:bg-green-50 transition-colors">
                                    <td className="p-3 text-gray-400 font-mono text-xs">{p.id.slice(-6)}</td>
                                    <td className="p-3 font-bold text-gray-800">{p.name}</td>
                                    <td className="p-3 text-gray-600"><span className="block font-bold text-xs">{p.reason}</span><span className="text-[10px] text-gray-400">{p.details}</span></td>
                                    <td className="p-3">{p.method === 'cliq' ? <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Cliq</span> : <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">Cash</span>}</td>
                                    <td className="p-3 text-xs text-gray-500">{p.date}</td>
                                    <td className="p-3 font-bold text-green-600">+{p.amount}</td>
                                    <td className="p-3 flex gap-2">
                                        <button onClick={()=>printReceipt(p)} className="p-2 bg-gray-100 rounded-lg text-gray-600"><Printer size={16}/></button>
                                        <button onClick={()=>deletePayment(p.id)} className="p-2 bg-red-50 rounded-lg text-red-500"><Trash2 size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                             {filteredPayments.length === 0 && <tr><td colSpan="7" className="p-8 text-center text-gray-400">لا يوجد سندات</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden grid gap-4">
                  {filteredPayments.map(p => (
                      <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 relative overflow-hidden">
                          <div className={`absolute top-0 left-0 w-1 h-full ${p.method==='cliq' ? 'bg-purple-500' : 'bg-green-500'}`}></div>
                          <div className="flex justify-between items-start pl-2">
                              <div>
                                  <div className="flex items-center gap-2 mb-1">
                                      <User size={14} className="text-gray-400"/>
                                      <span className="font-bold text-gray-800">{p.name}</span>
                                  </div>
                                  <div className="text-xs text-gray-500 flex items-center gap-2"><Calendar size={12}/> {p.date}</div>
                              </div>
                              <div className="text-green-600 font-bold text-lg bg-green-50 px-2 py-1 rounded-lg">+{p.amount}</div>
                          </div>
                          <div className="bg-gray-50 p-2 rounded-lg text-sm text-gray-600 flex items-start gap-2">
                              <FileText size={14} className="mt-1 text-gray-400 shrink-0"/>
                              <div className="flex-1"><span className="font-bold block text-xs text-gray-700">{p.reason}</span><span className="text-[10px]">{p.details}</span></div>
                              {p.method === 'cliq' ? <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Cliq</span> : <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Cash</span>}
                          </div>
                          <div className="flex justify-end gap-2 mt-1 border-t pt-3 border-gray-100">
                              <button onClick={()=>printReceipt(p)} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-bold"><Printer size={14}/> طباعة</button>
                              <button onClick={()=>deletePayment(p.id)} className="flex items-center gap-1 text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg font-bold"><Trash2 size={14}/> حذف</button>
                          </div>
                      </div>
                  ))}
                  {filteredPayments.length === 0 && <div className="text-center p-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed">لا يوجد سندات</div>}
                </div>
            </Card>
        </div>
      )}

      {/* ================================================================================= */}
      {/* TAB 2: ADMIN DASHBOARD (ACCOUNTS) */}
      {/* ================================================================================= */}
      {activeTab === 'admin' && (
        <div className="animate-fade-in space-y-6">
            {/* 1. Month Selector & Summary */}
            <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2"><TrendingUp className="text-yellow-500"/> الملخص المالي الشهري</h2>
                    <input type="month" value={dashboardMonth} onChange={(e) => setDashboardMonth(e.target.value)} className="bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-2 outline-none focus:border-yellow-500"/>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">مجموع وصولات الطلاب</p>
                        <p className="text-2xl font-bold text-green-400">+{dashboardStats.totalStudents} JD</p>
                        <p className="text-[10px] text-gray-500 mt-1">{dashboardStats.paymentsCount} وصل</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">دخل إضافي (متجر/بطولات)</p>
                        <p className="text-2xl font-bold text-blue-400">+{dashboardStats.totalExtra} JD</p>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700">
                        <p className="text-gray-400 text-xs mb-1">المصاريف</p>
                        <p className="text-2xl font-bold text-red-400">-{dashboardStats.totalExpenses} JD</p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 rounded-2xl shadow-lg transform scale-105">
                        <p className="text-black/60 text-xs mb-1 font-bold">صافي الربح</p>
                        <p className="text-3xl font-black text-black">{dashboardStats.netProfit} JD</p>
                    </div>
                </div>

                <div className="flex gap-4 text-xs font-mono text-gray-400 bg-black/20 p-3 rounded-xl">
                    <span>💵 كاش: <span className="text-green-400">{dashboardStats.cash}</span></span>
                    <span>📱 كليك: <span className="text-purple-400">{dashboardStats.cliq}</span></span>
                </div>
            </div>

            {/* Reports Section */}
            <Card title="التقارير">
                 <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-500">الفترة من:</span>
                        <input type="date" value={calcDates.start} onChange={e=>setCalcDates({...calcDates, start: e.target.value})} className="bg-gray-50 border rounded-lg px-3 py-2 outline-none"/>
                        <span className="text-sm font-bold text-gray-500">إلى:</span>
                        <input type="date" value={calcDates.end} onChange={e=>setCalcDates({...calcDates, end: e.target.value})} className="bg-gray-50 border rounded-lg px-3 py-2 outline-none"/>
                    </div>
                    <button onClick={printStatement} className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-black transition-colors shadow-lg"><Printer size={18}/> طباعة كشف الحساب</button>
                 </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 2. Extra Income Manager */}
                <Card title="إضافة دخل زائد (ربح بدلات / بطولات)">
                    <form onSubmit={handleAddExtraIncome} className="flex gap-2 mb-4">
                        <input className="flex-1 border p-2 rounded-lg text-sm" placeholder="البيان (مثال: ربح بطولة)" value={extraIncomeForm.title} onChange={e=>setExtraIncomeForm({...extraIncomeForm, title: e.target.value})} required/>
                        <input className="w-24 border p-2 rounded-lg text-sm" type="number" placeholder="المبلغ" value={extraIncomeForm.amount} onChange={e=>setExtraIncomeForm({...extraIncomeForm, amount: e.target.value})} required/>
                        <button className="bg-blue-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
                    </form>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {branchExtraIncome.map(i => (
                            <div key={i.id} className="flex justify-between items-center bg-blue-50 p-2 rounded border border-blue-100 text-sm">
                                <span>{i.title} ({i.date})</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-blue-700">+{i.amount}</span>
                                    <button onClick={()=>deleteExtraIncome(i.id)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* 3. Expenses Manager */}
                <Card title="إدارة المصاريف">
                    <form onSubmit={handleAddExpense} className="flex gap-2 mb-4">
                        <input className="flex-1 border p-2 rounded-lg text-sm" placeholder="بند المصروف" value={expForm.title} onChange={e=>setExpForm({...expForm, title: e.target.value})} required/>
                        <input className="w-24 border p-2 rounded-lg text-sm" type="number" placeholder="المبلغ" value={expForm.amount} onChange={e=>setExpForm({...expForm, amount: e.target.value})} required/>
                        <button className="bg-red-600 text-white p-2 rounded-lg"><Plus size={18}/></button>
                    </form>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {branchExpenses.map(e => (
                            <div key={e.id} className="flex justify-between items-center bg-red-50 p-2 rounded border border-red-100 text-sm">
                                <span>{e.title} ({e.date})</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-red-700">-{e.amount}</span>
                                    <button onClick={()=>deleteExpense(e.id)} className="text-red-500"><Trash2 size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
      )}

      {/* ================================================================================= */}
      {/* TAB 3: STORE ADMIN */}
      {/* ================================================================================= */}
      {activeTab === 'store' && (
        <div className="animate-fade-in space-y-6">
            <Card title="إدارة منتجات المتجر (تظهر للطلاب)">
                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 mb-6 flex items-start gap-3">
                    <AlertCircle className="text-yellow-600 shrink-0 mt-1"/>
                    <div className="text-sm text-yellow-800">
                        <p className="font-bold">كيف تضيف صورة؟</p>
                        <p>انسخ رابط الصورة من جوجل أو أي موقع وضع الرابط في حقل "رابط الصورة".</p>
                    </div>
                </div>

                <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="md:col-span-2">
                        <label className="text-xs font-bold text-gray-500 block mb-1">اسم المنتج</label>
                        <input className="w-full p-2 rounded-lg border outline-none" placeholder="مثال: بدلة تايكواندو Adidas" value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} required/>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">السعر (JD)</label>
                        <input className="w-full p-2 rounded-lg border outline-none" type="number" placeholder="25" value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} required/>
                    </div>
                    <div className="md:col-span-3">
                        <label className="text-xs font-bold text-gray-500 block mb-1">رابط الصورة (URL)</label>
                        <input className="w-full p-2 rounded-lg border outline-none font-mono text-left dir-ltr" placeholder="https://..." value={productForm.image} onChange={e=>setProductForm({...productForm, image: e.target.value})} />
                    </div>
                    <div className="flex items-end">
                        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">إضافة للمتجر</Button>
                    </div>
                </form>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {branchProducts.map(prod => (
                        <div key={prod.id} className="border rounded-xl p-3 flex gap-3 items-center bg-white shadow-sm relative group">
                            <img src={prod.image || 'https://via.placeholder.com/50'} className="w-16 h-16 object-cover rounded-lg bg-gray-200"/>
                            <div>
                                <h4 className="font-bold text-gray-800">{prod.name}</h4>
                                <p className="text-yellow-600 font-bold">{prod.price} JD</p>
                            </div>
                            <button onClick={()=>deleteProduct(prod.id)} className="absolute top-2 left-2 bg-red-100 text-red-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    ))}
                    {branchProducts.length === 0 && <p className="text-gray-400 col-span-3 text-center py-4">لا يوجد منتجات في المتجر</p>}
                </div>
            </Card>
        </div>
      )}

    </div>
  );
}
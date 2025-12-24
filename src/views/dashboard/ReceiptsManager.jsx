// src/views/dashboard/ReceiptsManager.jsx
import React, { useState } from 'react';
import { DollarSign, Printer, Search, ShoppingBag, User, Calendar, FileText, CheckCircle } from 'lucide-react';
import { Button, Card, StudentSearch } from '../../components/UIComponents';
import { addDoc, collection, updateDoc, doc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { IMAGES } from '../../lib/constants';

const ReceiptsManager = ({ students, productsCollection, selectedBranch, logActivity }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // بيانات الفاتورة
  const [subAmount, setSubAmount] = useState(''); // مبلغ الاشتراك
  const [subNote, setSubNote] = useState('اشتراك شهري');
  const [selectedProduct, setSelectedProduct] = useState(''); // ID المنتج المختار
  
  // جلب المنتجات
  const products = productsCollection?.data || [];
  const availableProducts = products.filter(p => (p.branch === selectedBranch || p.branch === 'مشترك') && p.stock > 0);

  // --- دالة الطباعة (نسختُ إبداعك حرفياً هنا) ---
  const printReceipt = (payment) => {
    const receiptWindow = window.open('', 'PRINT', 'height=800,width=1000');
    const logoUrl = window.location.origin + IMAGES.LOGO;

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
            .phone { direction: ltr; text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="receipt-border">
            <img src="${logoUrl}" class="watermark" onerror="this.style.display='none'"/>
            <div class="header">
              <div class="company-info"><h1>أكاديمية الشجاع للتايكواندو</h1><p>فرع: ${selectedBranch}</p></div>
              <div class="logo"><img src="${logoUrl}" onerror="this.style.display='none'"/></div>
              <div class="meta-info"><div>رقم السند: <strong>${payment.id ? payment.id.slice(-6) : 'جديد'}</strong></div><div>التاريخ: <strong>${payment.date}</strong></div></div>
            </div>
            <div class="content">
              <div class="title">سند قبض</div>
              <div class="amount-container"><div class="amount-number">${payment.amount} JD</div></div>
              <div class="row"><span class="label">استلمنا من:</span><span class="value">${payment.name}</span></div>
              <div class="row"><span class="label">مبلغ وقدره:</span><span class="value">${payment.amount} دينار أردني</span></div>
              <div class="row"><span class="label">وذلك عن:</span><span class="value">${payment.reason} ${payment.details ? `(${payment.details})` : ''}</span></div>
            </div>
            <div class="footer">
              <div class="signatures">
                <div class="sign-box"><div class="sign-line"></div><div class="sign-title">توقيع المحاسب</div></div>
                <div class="sign-box"><div class="sign-line"></div><div class="sign-title">توقيع المستلم</div></div>
              </div>
              <div class="branches-box">
                <div class="branch"><span style="font-weight:bold; color:#b45309">الفرع الأول: شفابدران</span><span>شارع رفعت شموط</span><span class="phone">079 5629 606</span></div>
                <div class="branch"><span style="font-weight:bold; color:#b45309">الفرع الثاني: أبو نصير</span><span>دوار البحرية - مجمع الفرّا</span><span class="phone">079 0368 603</span></div>
              </div>
            </div>
          </div>
        </body>
      </html>`;
    receiptWindow.document.write(htmlContent);
    receiptWindow.document.close();
    receiptWindow.onload = () => { receiptWindow.focus(); setTimeout(() => { receiptWindow.print(); receiptWindow.close(); }, 500); };
  };

  const handleSale = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("اختر الطالب أولاً");
    if (!subAmount && !selectedProduct) return alert("يجب إضافة اشتراك أو منتج على الأقل");
    if(!confirm("هل أنت متأكد من حفظ العملية؟")) return;

    try {
        let total = 0;
        let reasonsList = [];
        const date = new Date().toISOString().split('T')[0];

        // 1. معالجة الاشتراك
        if (subAmount) {
            const amount = Number(subAmount);
            total += amount;
            reasonsList.push(subNote);
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'payments'), {
                id: Date.now().toString(),
                amount: amount,
                studentId: selectedStudent.id,
                name: selectedStudent.name,
                branch: selectedBranch,
                reason: 'اشتراك',
                details: subNote,
                date: date,
                createdAt: new Date().toISOString()
            });
        }

        // 2. معالجة المنتج
        if (selectedProduct) {
            const product = products.find(p => p.id === selectedProduct);
            if (product) {
                total += Number(product.price);
                reasonsList.push(product.name);
                
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'payments'), {
                    id: (Date.now() + 1).toString(),
                    amount: Number(product.price),
                    studentId: selectedStudent.id,
                    name: selectedStudent.name,
                    branch: selectedBranch,
                    reason: 'مبيعات',
                    details: product.name,
                    date: date,
                    createdAt: new Date().toISOString()
                });

                // 🔻 خصم الكمية من المخزون 🔻
                const productRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', product.id);
                await updateDoc(productRef, { stock: Number(product.stock) - 1 });
            }
        }

        const paymentObjForPrint = {
            id: Date.now().toString(),
            name: selectedStudent.name,
            amount: total,
            reason: reasonsList.join(' + '),
            details: 'دفعة شاملة',
            date: date
        };

        logActivity('new_receipt', `وصل بقيمة ${total} للطالب ${selectedStudent.name}`, selectedBranch, {role: 'user'});
        
        // طباعة الوصل فوراً
        printReceipt(paymentObjForPrint);
        
        // تصفير الحقول
        setSubAmount('');
        setSelectedProduct('');
        setSelectedStudent(null);
        alert(`تم الحفظ بنجاح! المجموع: ${total} دينار`);

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* 1. قائمة اختيار الطالب */}
      <Card className="lg:col-span-1 h-fit border-yellow-100 shadow-yellow-50">
        <h3 className="font-bold mb-4 flex gap-2 text-yellow-700"><Search size={20}/> ابحث عن الطالب</h3>
        <StudentSearch students={students} onSelect={(s) => setSelectedStudent(s)} placeholder="اسم الطالب..." />
        
        {selectedStudent && (
             <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center animate-fade-in">
                 <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2 text-yellow-700"><User size={32}/></div>
                 <h3 className="font-bold text-lg">{selectedStudent.name}</h3>
                 <p className="text-sm text-gray-500">{selectedStudent.belt}</p>
             </div>
        )}
      </Card>

      {/* 2. نموذج الفاتورة */}
      <Card className="lg:col-span-2 relative overflow-hidden" title={selectedStudent ? `فاتورة جديدة: ${selectedStudent.name}` : "تفاصيل الوصل"}>
        {!selectedStudent && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm"><p className="bg-white px-6 py-2 rounded-full shadow-lg border text-gray-500 flex items-center gap-2"><User size={16}/> يرجى اختيار طالب من القائمة أولاً</p></div>}
        
        <form onSubmit={handleSale} className="space-y-6">
            {/* قسم الاشتراك */}
            <div className="bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 relative group hover:border-green-400 transition-colors">
                <div className="absolute -top-3 right-4 bg-white px-2 text-xs font-bold text-gray-500 group-hover:text-green-600 transition-colors">1. رسوم الاشتراك/التدريب</div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs block mb-1 font-bold">المبلغ (دينار)</label>
                        <input type="number" className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-green-500 outline-none" value={subAmount} onChange={e=>setSubAmount(e.target.value)} placeholder="0" />
                    </div>
                    <div>
                        <label className="text-xs block mb-1 font-bold">البيان</label>
                        <input type="text" className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-green-500 outline-none" value={subNote} onChange={e=>setSubNote(e.target.value)} />
                    </div>
                </div>
            </div>

            {/* قسم المتجر */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-dashed border-blue-200 relative group hover:border-blue-400 transition-colors">
                <div className="absolute -top-3 right-4 bg-white px-2 text-xs font-bold text-blue-500 group-hover:text-blue-600 transition-colors flex items-center gap-1"><ShoppingBag size={12}/> 2. إضافة منتج من المتجر</div>
                <select 
                    className="w-full border-2 border-blue-100 p-3 rounded-xl bg-white focus:border-blue-500 outline-none cursor-pointer" 
                    value={selectedProduct} 
                    onChange={e=>setSelectedProduct(e.target.value)}
                >
                    <option value="">-- اختياري: إضافة منتج --</option>
                    {availableProducts.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.name} ({p.price} JD) - متوفر: {p.stock}
                        </option>
                    ))}
                </select>
                {selectedProduct && <div className="mt-2 text-xs text-blue-600 flex items-center gap-1"><CheckCircle size={12}/> سيتم خصم قطعة واحدة من المخزون تلقائياً</div>}
            </div>

            {/* المجموع والزر */}
            <div className="pt-4 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xl font-bold text-gray-800 bg-gray-100 px-6 py-2 rounded-xl">
                    المجموع الكلي: <span className="text-green-600 font-black text-2xl mx-2">
                        { (Number(subAmount) || 0) + (selectedProduct ? Number(products.find(p=>p.id===selectedProduct)?.price || 0) : 0) } 
                    </span> JD
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto px-8 py-3 shadow-xl shadow-green-600/20 bg-green-600 hover:bg-green-700 text-white font-bold flex items-center justify-center gap-2">
                    <Printer size={20}/> حفظ وطباعة الوصل
                </Button>
            </div>
        </form>
      </Card>
    </div>
  );
};

export default ReceiptsManager;
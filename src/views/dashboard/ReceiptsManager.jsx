// src/views/dashboard/ReceiptsManager.jsx
import React, { useState } from 'react';
import { DollarSign, Printer, Search, ShoppingBag } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { addDoc, collection, updateDoc, doc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';

const ReceiptsManager = ({ students, productsCollection, selectedBranch, logActivity }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // بيانات الفاتورة
  const [subAmount, setSubAmount] = useState(''); // مبلغ الاشتراك
  const [subNote, setSubNote] = useState('اشتراك شهري');
  const [selectedProduct, setSelectedProduct] = useState(''); // ID المنتج المختار
  
  // جلب المنتجات
  const products = productsCollection?.data || [];
  const availableProducts = products.filter(p => (p.branch === selectedBranch || p.branch === 'مشترك') && p.stock > 0);

  // البحث عن طالب
  const filteredStudents = students.filter(s => 
    (s.branch === selectedBranch) && 
    (s.name.includes(searchTerm) || (s.phone && s.phone.includes(searchTerm)))
  );

  const handleSale = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("اختر الطالب أولاً");
    if (!subAmount && !selectedProduct) return alert("يجب إضافة اشتراك أو منتج على الأقل");

    if(!confirm("هل أنت متأكد من حفظ العملية؟")) return;

    try {
        let total = 0;
        let details = [];

        // 1. معالجة الاشتراك
        if (subAmount) {
            const amount = Number(subAmount);
            total += amount;
            details.push(`${subNote}: ${amount} JD`);
            // تسجيل دفعة الاشتراك
            await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'payments'), {
                amount: amount,
                studentId: selectedStudent.id,
                name: selectedStudent.name,
                branch: selectedBranch,
                reason: 'اشتراك',
                details: subNote,
                date: new Date().toISOString().split('T')[0],
                createdAt: new Date().toISOString()
            });
        }

        // 2. معالجة المنتج (إذا تم اختياره)
        if (selectedProduct) {
            const product = products.find(p => p.id === selectedProduct);
            if (product) {
                total += Number(product.price);
                details.push(`${product.name}: ${product.price} JD`);
                
                // تسجيل دفعة المنتج
                await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'payments'), {
                    amount: Number(product.price),
                    studentId: selectedStudent.id,
                    name: selectedStudent.name,
                    branch: selectedBranch,
                    reason: 'مبيعات',
                    details: product.name,
                    date: new Date().toISOString().split('T')[0],
                    createdAt: new Date().toISOString()
                });

                // 🔻 خصم الكمية من المخزون 🔻
                const productRef = doc(db, 'artifacts', appId, 'public', 'data', 'products', product.id);
                await updateDoc(productRef, {
                    stock: Number(product.stock) - 1
                });
            }
        }

        logActivity('new_receipt', `وصل بقيمة ${total} للطالب ${selectedStudent.name}`, selectedBranch, {role: 'user'}); // قم بتمرير المستخدم الحقيقي إذا أمكن
        
        alert(`تم الحفظ بنجاح! المجموع: ${total} دينار`);
        
        // تصفير الحقول
        setSubAmount('');
        setSelectedProduct('');
        setSelectedStudent(null);
        setSearchTerm('');

    } catch (error) {
        console.error(error);
        alert("حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. قائمة اختيار الطالب */}
      <Card className="lg:col-span-1 h-fit">
        <h3 className="font-bold mb-4 flex gap-2"><Search size={20}/> ابحث عن الطالب</h3>
        <input 
            className="w-full border p-3 rounded-lg mb-4" 
            placeholder="ابحث بالاسم..." 
            value={searchTerm}
            onChange={e=>setSearchTerm(e.target.value)}
        />
        <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredStudents.map(s => (
                <div key={s.id} 
                    onClick={() => setSelectedStudent(s)}
                    className={`p-3 rounded-lg cursor-pointer border transition-colors ${selectedStudent?.id === s.id ? 'bg-yellow-100 border-yellow-500' : 'hover:bg-gray-50 border-gray-100'}`}
                >
                    <p className="font-bold">{s.name}</p>
                    <p className="text-xs text-gray-500">{s.belt}</p>
                </div>
            ))}
        </div>
      </Card>

      {/* 2. نموذج الفاتورة */}
      <Card className="lg:col-span-2" title={selectedStudent ? `فاتورة جديدة: ${selectedStudent.name}` : "يرجى اختيار طالب"}>
        {selectedStudent ? (
            <form onSubmit={handleSale} className="space-y-6">
                {/* قسم الاشتراك */}
                <div className="bg-gray-50 p-4 rounded-xl border">
                    <h4 className="font-bold text-gray-700 mb-3 border-b pb-2">1. رسوم الاشتراك/التدريب</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs block mb-1">المبلغ (دينار)</label>
                            <input type="number" className="w-full border p-2 rounded" value={subAmount} onChange={e=>setSubAmount(e.target.value)} placeholder="0" />
                        </div>
                        <div>
                            <label className="text-xs block mb-1">البيان</label>
                            <input type="text" className="w-full border p-2 rounded" value={subNote} onChange={e=>setSubNote(e.target.value)} />
                        </div>
                    </div>
                </div>

                {/* قسم المتجر */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2 flex gap-2"><ShoppingBag size={18}/> 2. إضافة منتج من المتجر</h4>
                    <select 
                        className="w-full border p-3 rounded bg-white" 
                        value={selectedProduct} 
                        onChange={e=>setSelectedProduct(e.target.value)}
                    >
                        <option value="">-- لا يوجد شراء منتجات --</option>
                        {availableProducts.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name} ({p.price} JD) - متوفر: {p.stock}
                            </option>
                        ))}
                    </select>
                </div>

                {/* المجموع والزر */}
                <div className="pt-4 border-t flex justify-between items-center">
                    <div className="text-xl font-bold text-gray-800">
                        المجموع الكلي: <span className="text-green-600">
                            { (Number(subAmount) || 0) + (selectedProduct ? Number(products.find(p=>p.id===selectedProduct)?.price || 0) : 0) } JD
                        </span>
                    </div>
                    <Button type="submit" size="lg" className="px-8 shadow-xl shadow-yellow-500/20"><Printer size={20}/> حفظ وطباعة الوصل</Button>
                </div>
            </form>
        ) : (
            <div className="text-center py-10 text-gray-400">
                <Search size={48} className="mx-auto mb-2 opacity-20"/>
                <p>اختر طالباً من القائمة الجانبية للبدء</p>
            </div>
        )}
      </Card>
    </div>
  );
};

export default ReceiptsManager;
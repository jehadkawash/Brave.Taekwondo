// src/views/dashboard/MultiItemReceipt.jsx
// مودال الوصل المركّب — بنود متعددة + خصم + دفع جزئي + ربط مخزون/ذمم
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Plus, Trash2, CalendarClock, Package, DollarSign,
    Gift, Receipt, AlertCircle, CheckCircle, Users
} from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { StudentSearch } from '../../components/UIComponents';
import { toast } from '../../lib/toast';

const todayStr = () => new Date().toISOString().split('T')[0];

// إضافة شهور لتاريخ
const addMonths = (dateStr, months) => {
    if (!dateStr) dateStr = todayStr();
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + Number(months));
    return d.toISOString().split('T')[0];
};

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function MultiItemReceipt({ students, selectedBranch, paymentsCollection, studentsCollection, logActivity, onClose }) {

    // Collections
    const productsCol  = useCollection('products');
    const packagesCol  = useCollection('packages');
    const debtsCol     = useCollection('debts');
    const inventoryLog = useCollection('inventory_log');

    const products = useMemo(() =>
        productsCol.data.filter(p => !p.branch || p.branch === selectedBranch),
    [productsCol.data, selectedBranch]);

    const packages = useMemo(() =>
        packagesCol.data.filter(p => !p.branch || p.branch === selectedBranch),
    [packagesCol.data, selectedBranch]);

    // ── State ─────────────────────────────────────────────────────────────────
    const [primaryStudent, setPrimaryStudent] = useState(null);     // الطالب الرئيسي
    const [extraNames,     setExtraNames]     = useState([]);       // أسماء الإخوة
    const [newExtraName,   setNewExtraName]   = useState('');
    const [items,          setItems]          = useState([]);       // بنود الوصل
    const [discount,       setDiscount]       = useState(0);
    const [paidAmount,     setPaidAmount]     = useState('');
    const [method,         setMethod]         = useState('cash');
    const [date,           setDate]           = useState(todayStr());
    const [details,        setDetails]        = useState('');
    const [saving,         setSaving]         = useState(false);

    // مودالات اختيار
    const [showProductPicker, setShowProductPicker] = useState(false);
    const [showSubModal,      setShowSubModal]      = useState(false);
    const [showCustomModal,   setShowCustomModal]   = useState(false);
    const [showPackagePicker, setShowPackagePicker] = useState(false);

    // ── حسابات ───────────────────────────────────────────────────────────────
    const subtotal = items.reduce((a, it) => a + Number(it.amount || 0), 0);
    const total    = Math.max(0, subtotal - Number(discount || 0));
    // الافتراضي: المدفوع = الإجمالي (دفع كامل)
    const effectivePaid = paidAmount === '' ? total : Number(paidAmount);
    const remaining     = Math.max(0, total - effectivePaid);

    // ── إضافة بنود ───────────────────────────────────────────────────────────
    const addProduct = (product, variant) => {
        setItems([...items, {
            type:        'product',
            productId:   product.id,
            variantSize: variant.size,
            title:       `${product.name} م.${variant.size}`,
            amount:      Number(product.price) || 0,
            _stockCheck: true,
        }]);
        setShowProductPicker(false);
    };

    const addSubscription = (months, amount) => {
        setItems([...items, {
            type:   'subscription',
            months: Number(months),
            title:  `اشتراك ${months === 1 ? 'شهر' : months === 2 ? 'شهرين' : `${months} شهور`}`,
            amount: Number(amount),
        }]);
        setShowSubModal(false);
    };

    const addCustom = (title, amount) => {
        setItems([...items, {
            type:   'custom',
            title:  title.trim(),
            amount: Number(amount),
        }]);
        setShowCustomModal(false);
    };

    const addPackage = (pkg) => {
        const pkgItems = (pkg.items || []).map(it => {
            // إذا منتج: نتحقق من المنتج وبدون مقاس (يختاره لاحقاً)
            if (it.type === 'product') {
                const prod = products.find(p => p.id === it.productId);
                return {
                    type: 'product',
                    productId: it.productId,
                    variantSize: '',        // فاضي — يختار المقاس
                    title: prod ? prod.name : (it.title || 'منتج'),
                    amount: Number(it.price) || 0,
                    _needsSize: true,
                };
            }
            if (it.type === 'subscription') {
                return {
                    type: 'subscription',
                    months: Number(it.months) || 1,
                    title: it.title || `اشتراك ${it.months} شهر`,
                    amount: Number(it.price) || 0,
                };
            }
            return {
                type: 'custom',
                title: it.title || 'بند',
                amount: Number(it.price) || 0,
            };
        });
        setItems([...items, ...pkgItems]);
        setShowPackagePicker(false);
    };

    const updateItem = (i, field, value) => {
        setItems(items.map((it, x) => x === i ? { ...it, [field]: value } : it));
    };
    const removeItem = (i) => setItems(items.filter((_, x) => x !== i));

    // ── إخوة ─────────────────────────────────────────────────────────────────
    const addExtraName = () => {
        const t = newExtraName.trim();
        if (!t) return;
        setExtraNames([...extraNames, t]);
        setNewExtraName('');
    };

    // ── الحفظ ────────────────────────────────────────────────────────────────
    const handleSave = async (e) => {
        e.preventDefault();
        if (!primaryStudent) return toast('اختر الطالب الرئيسي', 'error');
        if (items.length === 0) return toast('أضف بنداً واحداً على الأقل', 'error');

        // تحقق من المنتجات اللي بدون مقاس
        const missingSize = items.some(it => it.type === 'product' && !it.variantSize);
        if (missingSize) return toast('يرجى اختيار المقاس لكل منتج', 'error');

        setSaving(true);
        try {
            // اسم الوصل (الرئيسي + الإخوة)
            const allNames = [primaryStudent.name, ...extraNames];
            const displayName = allNames.join('، ');

            // أسباب الوصل (مدمجة)
            const reasonsList = items.map(it => it.title).join(' | ');

            // إنشاء الوصل
            const paymentDoc = {
                studentId:   primaryStudent.id,
                name:        displayName,
                primaryName: primaryStudent.name,
                extraNames:  extraNames,
                amount:      effectivePaid,          // المدفوع فعلياً (للتقارير المالية)
                subtotal,
                discount:    Number(discount) || 0,
                totalAmount: total,
                paidAmount:  effectivePaid,
                remainingDebt: remaining,
                items,                                // بنود مفصّلة
                reason:      reasonsList,             // للتوافق
                details:     details.trim(),
                method,
                date,
                createdAt:   new Date().toISOString(),
                branch:      selectedBranch,
                _multiItem:  true,                    // علامة للوصل المركّب
            };

            const paymentRef = await paymentsCollection.add(paymentDoc);

            // ─── ربط مع المخزون: ينقص الكميات ─────────────────────────────────
            const productItems = items.filter(it => it.type === 'product');
            for (const it of productItems) {
                const product = products.find(p => p.id === it.productId);
                if (!product) continue;
                const newVariants = (product.variants || []).map(v =>
                    v.size === it.variantSize ? { ...v, stock: Math.max(0, v.stock - 1) } : v
                );
                await productsCol.update(product.id, { variants: newVariants });
                await inventoryLog.add({
                    productId: product.id,
                    productName: product.name,
                    variantSize: it.variantSize,
                    type: 'out',
                    quantity: 1,
                    reason: `بيع — وصل ${primaryStudent.name}`,
                    relatedPaymentId: paymentRef?.id,
                    branch: selectedBranch,
                    createdAt: new Date().toISOString(),
                });
            }

            // ─── الاشتراك: تمديد subEnd ───────────────────────────────────────
            const subItems = items.filter(it => it.type === 'subscription');
            const totalMonths = subItems.reduce((a, it) => a + Number(it.months || 0), 0);
            if (totalMonths > 0) {
                const currentEnd = primaryStudent.subEnd;
                const baseDate = (currentEnd && new Date(currentEnd) > new Date()) ? currentEnd : todayStr();
                const newSubEnd = addMonths(baseDate, totalMonths);
                await studentsCollection.update(primaryStudent.id, { subEnd: newSubEnd });
            }

            // ─── الذمم: لو في متبقي → دين جديد ────────────────────────────────
            if (remaining > 0) {
                await debtsCol.add({
                    studentId:   primaryStudent.id,
                    studentName: primaryStudent.name,
                    phone:       primaryStudent.phone || '',
                    reason:      `متبقي من وصل ${reasonsList.slice(0, 60)}`,
                    totalAmount: remaining,
                    paidAmount:  0,
                    payments:    [],
                    dueDate:     '',
                    notes:       `وصل مركّب • ${displayName}`,
                    branch:      selectedBranch,
                    relatedPaymentId: paymentRef?.id,
                    createdAt:   new Date().toISOString(),
                });
            }

            // log
            if (logActivity) {
                logActivity('وصل مركّب', `${displayName} • ${items.length} بند • ${total} JD${remaining > 0 ? ` (دين: ${remaining})` : ''}`);
            }

            onClose();
        } catch (err) {
            console.error(err);
            toast('خطأ في الحفظ: ' + err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Render ────────────────────────────────────────────────────────────────
    return createPortal(
        <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md overflow-y-auto" onClick={onClose}>
            <div className="min-h-screen p-2 md:p-6" onClick={e => e.stopPropagation()}>
                <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-950/30 to-slate-900 border-b border-slate-800 px-5 py-4 flex justify-between items-center sticky top-0 z-10">
                        <h2 className="font-black text-lg text-emerald-300 flex items-center gap-2">
                            <Receipt size={20}/> وصل مركّب جديد
                        </h2>
                        <button onClick={onClose} className="text-slate-500 hover:text-red-400">
                            <X size={20}/>
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="p-5 space-y-5">

                        {/* ── الطالب الرئيسي ── */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                            <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                                <Users size={12}/> الطالب الرئيسي
                            </label>
                            <StudentSearch
                                students={students}
                                onSelect={s => setPrimaryStudent(s)}
                                onClear={() => setPrimaryStudent(null)}
                                placeholder="ابحث عن الطالب..."
                            />
                            {primaryStudent && (
                                <div className="mt-2 flex items-center gap-2 bg-emerald-900/15 border border-emerald-500/30 rounded-xl px-3 py-2">
                                    <CheckCircle size={13} className="text-emerald-400"/>
                                    <span className="text-sm font-bold text-emerald-300">{primaryStudent.name}</span>
                                    <span className="text-[10px] text-slate-500">• {primaryStudent.belt}</span>
                                </div>
                            )}

                            {/* أسماء إضافية (إخوة) */}
                            <div className="mt-3">
                                <label className="text-[10px] font-bold text-slate-500 block mb-1.5">أسماء الإخوة (اختياري)</label>
                                <div className="flex gap-1.5">
                                    <input
                                        className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded-lg outline-none focus:border-blue-500 text-xs"
                                        placeholder="اكتب اسم الأخ..."
                                        value={newExtraName}
                                        onChange={e => setNewExtraName(e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addExtraName(); }}}
                                    />
                                    <button type="button" onClick={addExtraName}
                                        className="px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold">
                                        <Plus size={12}/>
                                    </button>
                                </div>
                                {extraNames.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {extraNames.map((n, i) => (
                                            <span key={i} className="flex items-center gap-1 bg-blue-900/30 text-blue-300 border border-blue-500/30 rounded-lg px-2 py-1 text-[11px] font-bold">
                                                {n}
                                                <button type="button" onClick={() => setExtraNames(extraNames.filter((_, x) => x !== i))}
                                                    className="hover:text-red-400">
                                                    <X size={10}/>
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── البنود ── */}
                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                                <label className="text-xs font-bold text-slate-400">
                                    البنود ({items.length})
                                </label>
                                <div className="flex gap-1.5 flex-wrap">
                                    {packages.length > 0 && (
                                        <button type="button" onClick={() => setShowPackagePicker(true)}
                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-yellow-500/20 hover:bg-yellow-500 hover:text-slate-900 text-yellow-400 border border-yellow-500/30 rounded-lg text-[10px] font-bold transition-colors">
                                            <Gift size={11}/> باقة
                                        </button>
                                    )}
                                    <button type="button" onClick={() => setShowSubModal(true)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-500/20 hover:bg-blue-500 hover:text-white text-blue-400 border border-blue-500/30 rounded-lg text-[10px] font-bold transition-colors">
                                        <CalendarClock size={11}/> اشتراك
                                    </button>
                                    {products.length > 0 && (
                                        <button type="button" onClick={() => setShowProductPicker(true)}
                                            className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/20 hover:bg-emerald-500 hover:text-white text-emerald-400 border border-emerald-500/30 rounded-lg text-[10px] font-bold transition-colors">
                                            <Package size={11}/> منتج
                                        </button>
                                    )}
                                    <button type="button" onClick={() => setShowCustomModal(true)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] font-bold transition-colors">
                                        <DollarSign size={11}/> بند مخصص
                                    </button>
                                </div>
                            </div>

                            {items.length === 0 ? (
                                <p className="text-[11px] text-slate-600 text-center py-8 bg-slate-900 rounded-xl border border-slate-800 border-dashed">
                                    لا يوجد بنود — اضغط الأزرار أعلاه لإضافة
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    {items.map((it, i) => {
                                        const cfg = it.type === 'subscription'
                                            ? { bg: 'bg-blue-900/20', border: 'border-blue-500/30', color: 'text-blue-400', icon: CalendarClock, label: 'اشتراك' }
                                            : it.type === 'product'
                                            ? { bg: 'bg-emerald-900/20', border: 'border-emerald-500/30', color: 'text-emerald-400', icon: Package, label: 'منتج' }
                                            : { bg: 'bg-slate-800/50', border: 'border-slate-700', color: 'text-slate-400', icon: DollarSign, label: 'بند' };

                                        // منتج بدون مقاس (من باقة) — يحتاج اختيار مقاس
                                        if (it.type === 'product' && it._needsSize) {
                                            const product = products.find(p => p.id === it.productId);
                                            const availableVariants = (product?.variants || []).filter(v => v.stock > 0);
                                            return (
                                                <div key={i} className={`${cfg.bg} border ${cfg.border} rounded-xl p-3`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`flex items-center gap-1 ${cfg.color} text-xs font-bold`}>
                                                            <cfg.icon size={11}/> {it.title} (اختر مقاس)
                                                        </span>
                                                        <button type="button" onClick={() => removeItem(i)} className="text-red-400 hover:bg-red-900/20 p-1 rounded">
                                                            <Trash2 size={11}/>
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {availableVariants.length === 0 ? (
                                                            <span className="text-[10px] text-red-400">لا يوجد مقاسات متوفرة</span>
                                                        ) : availableVariants.map(v => (
                                                            <button key={v.size} type="button"
                                                                onClick={() => {
                                                                    updateItem(i, 'variantSize', v.size);
                                                                    updateItem(i, 'title', `${product.name} م.${v.size}`);
                                                                    updateItem(i, '_needsSize', false);
                                                                }}
                                                                className="px-2.5 py-1 bg-slate-900 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-900/20 rounded-lg text-[10px] font-bold text-slate-300">
                                                                {v.size} <span className="opacity-50">({v.stock})</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={i} className={`${cfg.bg} border ${cfg.border} rounded-xl p-3 flex items-center gap-2`}>
                                                <span className={`flex items-center gap-1 ${cfg.color} shrink-0 text-[10px] font-bold`}>
                                                    <cfg.icon size={11}/>
                                                </span>
                                                <input
                                                    className="flex-1 bg-transparent text-slate-200 outline-none text-sm font-bold"
                                                    value={it.title}
                                                    onChange={e => updateItem(i, 'title', e.target.value)}
                                                />
                                                <input type="number" min="0" step="0.5"
                                                    className="w-20 bg-slate-900 border border-slate-700 text-emerald-300 p-1.5 rounded-lg outline-none focus:border-emerald-500 text-sm font-bold text-center"
                                                    value={it.amount}
                                                    onChange={e => updateItem(i, 'amount', Number(e.target.value) || 0)}
                                                />
                                                <span className="text-[10px] text-slate-500">JD</span>
                                                <button type="button" onClick={() => removeItem(i)}
                                                    className="text-red-400 hover:bg-red-900/20 p-1.5 rounded shrink-0">
                                                    <Trash2 size={12}/>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* ── الحسابات ── */}
                        {items.length > 0 && (
                            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">المجموع</span>
                                    <span className="font-bold text-slate-200">{subtotal} JD</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-orange-400 flex items-center gap-1">خصم</span>
                                    <div className="flex items-center gap-1">
                                        <input type="number" min="0" step="0.5" max={subtotal}
                                            className="w-20 bg-orange-950/20 border border-orange-500/30 text-orange-300 p-1.5 rounded-lg outline-none focus:border-orange-500 text-sm font-bold text-center"
                                            value={discount} onChange={e => setDiscount(Number(e.target.value) || 0)}
                                        />
                                        <span className="text-[10px] text-slate-500">JD</span>
                                    </div>
                                </div>
                                <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                                    <span className="font-black text-slate-100">الإجمالي</span>
                                    <span className="text-2xl font-black text-emerald-400">{total} <span className="text-xs text-slate-500 font-normal">JD</span></span>
                                </div>

                                {/* المدفوع */}
                                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-800">
                                    <span className="text-blue-400">المدفوع الآن</span>
                                    <div className="flex items-center gap-1">
                                        <input type="number" min="0" max={total} step="0.5"
                                            className="w-24 bg-blue-950/20 border border-blue-500/30 text-blue-300 p-1.5 rounded-lg outline-none focus:border-blue-500 text-sm font-bold text-center"
                                            placeholder={String(total)}
                                            value={paidAmount} onChange={e => setPaidAmount(e.target.value)}
                                        />
                                        <span className="text-[10px] text-slate-500">JD</span>
                                    </div>
                                </div>

                                {/* المتبقي (دين) */}
                                {remaining > 0 && (
                                    <div className="bg-red-900/15 border border-red-500/30 rounded-xl px-3 py-2 flex items-center justify-between">
                                        <span className="text-red-400 font-bold text-sm flex items-center gap-1">
                                            <AlertCircle size={12}/> متبقي — سيُسجّل دين تلقائياً
                                        </span>
                                        <span className="font-black text-red-400 text-base">{remaining} JD</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ── طريقة الدفع + تاريخ ── */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">طريقة الدفع</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => setMethod('cash')}
                                        className={`py-2 rounded-xl text-xs font-bold border transition-colors
                                            ${method === 'cash' ? 'bg-green-600 text-white border-green-500' : 'bg-slate-950 text-slate-400 border-slate-700'}`}>
                                        💵 كاش
                                    </button>
                                    <button type="button" onClick={() => setMethod('cliq')}
                                        className={`py-2 rounded-xl text-xs font-bold border transition-colors
                                            ${method === 'cliq' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-700'}`}>
                                        📱 كليك
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 block mb-1">التاريخ</label>
                                <input type="date" max={todayStr()}
                                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-emerald-500 text-sm"
                                    value={date} onChange={e => setDate(e.target.value)}/>
                            </div>
                        </div>

                        {/* تفاصيل إضافية */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">تفاصيل إضافية (اختياري)</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-slate-500 placeholder-slate-600 text-sm"
                                placeholder="أي ملاحظة على الوصل..."
                                value={details} onChange={e => setDetails(e.target.value)}/>
                        </div>

                        {/* أزرار */}
                        <div className="flex gap-3 sticky bottom-0 bg-slate-900 pt-3 -mx-5 px-5 pb-1 border-t border-slate-800">
                            <button type="button" onClick={onClose}
                                className="flex-1 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl text-sm font-bold">
                                إلغاء
                            </button>
                            <button type="submit" disabled={saving || !primaryStudent || items.length === 0}
                                className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/30 disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? 'جاري الحفظ...' : `✅ حفظ الوصل (${total} JD)`}
                            </button>
                        </div>
                    </form>

                    {/* ── Pickers (Modals) ── */}
                    {showProductPicker && (
                        <ProductPicker products={products} onClose={() => setShowProductPicker(false)} onPick={addProduct}/>
                    )}
                    {showSubModal && (
                        <SubscriptionPicker onClose={() => setShowSubModal(false)} onAdd={addSubscription}/>
                    )}
                    {showCustomModal && (
                        <CustomFeePicker onClose={() => setShowCustomModal(false)} onAdd={addCustom}/>
                    )}
                    {showPackagePicker && (
                        <PackagePicker packages={packages} onClose={() => setShowPackagePicker(false)} onPick={addPackage}/>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Sub-modals ──────────────────────────────────────────────────────────────

const ProductPicker = ({ products, onClose, onPick }) => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState('');
    const filtered = products.filter(p => p.name.includes(search));
    return createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="bg-emerald-950/40 border-b border-emerald-900/30 px-4 py-3 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-sm text-emerald-300 flex items-center gap-2">
                        <Package size={15}/> اختر منتجاً ومقاساً
                    </h3>
                    <button onClick={onClose}><X size={16} className="text-slate-500 hover:text-red-400"/></button>
                </div>
                {!selectedProduct ? (
                    <>
                        <input
                            className="m-3 bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-emerald-500 text-sm"
                            placeholder="ابحث عن منتج..."
                            value={search} onChange={e => setSearch(e.target.value)}/>
                        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1.5">
                            {filtered.map(p => (
                                <button key={p.id} type="button" onClick={() => setSelectedProduct(p)}
                                    className="w-full text-right p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                                    <span className="font-bold text-sm text-slate-200">{p.name}</span>
                                    <span className="text-xs text-emerald-400 font-bold">{p.price} JD</span>
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="p-4 space-y-3">
                        <p className="text-sm font-bold text-slate-300">المقاسات المتوفرة لـ {selectedProduct.name}:</p>
                        <div className="grid grid-cols-3 gap-2">
                            {(selectedProduct.variants || []).map(v => (
                                <button key={v.size} type="button"
                                    disabled={v.stock <= 0}
                                    onClick={() => onPick(selectedProduct, v)}
                                    className={`p-3 rounded-xl border text-center transition-colors
                                        ${v.stock <= 0
                                            ? 'bg-red-900/10 border-red-500/20 text-red-400 cursor-not-allowed opacity-50'
                                            : 'bg-slate-950 border-slate-800 hover:border-emerald-500 hover:bg-emerald-900/20 text-slate-200'}`}>
                                    <p className="font-black text-base">{v.size}</p>
                                    <p className="text-[10px] text-slate-500">{v.stock <= 0 ? '🔴 نفد' : `${v.stock} متوفر`}</p>
                                </button>
                            ))}
                        </div>
                        <button type="button" onClick={() => setSelectedProduct(null)}
                            className="w-full py-2 text-slate-500 hover:text-slate-300 text-xs font-bold">← رجوع</button>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
};

const SubscriptionPicker = ({ onClose, onAdd }) => {
    const [months, setMonths] = useState(1);
    const [price, setPrice]   = useState('');
    return createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-blue-950/40 border-b border-blue-900/30 px-4 py-3 flex justify-between items-center">
                    <h3 className="font-black text-sm text-blue-300 flex items-center gap-2">
                        <CalendarClock size={15}/> إضافة اشتراك
                    </h3>
                    <button onClick={onClose}><X size={16} className="text-slate-500 hover:text-red-400"/></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (!price || price <= 0) return; onAdd(months, price); }} className="p-4 space-y-3">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1.5">المدة (شهور)</label>
                        <div className="grid grid-cols-4 gap-1.5">
                            {[1, 2, 3, 6].map(m => (
                                <button key={m} type="button" onClick={() => setMonths(m)}
                                    className={`py-2 rounded-lg text-xs font-bold border transition-colors
                                        ${months === m ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-950 text-slate-400 border-slate-700 hover:bg-slate-800'}`}>
                                    {m} شهر
                                </button>
                            ))}
                        </div>
                        <input type="number" min="1" max="24"
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none mt-2 text-xs"
                            placeholder="مدة مخصصة..."
                            value={months} onChange={e => setMonths(Number(e.target.value) || 1)}/>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-blue-400 block mb-1.5">السعر (JD)</label>
                        <input autoFocus required type="number" min="0" step="0.5"
                            className="w-full bg-blue-950/20 border border-blue-500/30 text-blue-200 p-2.5 rounded-xl outline-none focus:border-blue-500 text-lg font-bold text-center"
                            placeholder="0"
                            value={price} onChange={e => setPrice(e.target.value)}/>
                    </div>
                    <button type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm">
                        إضافة
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

const CustomFeePicker = ({ onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    return createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-slate-950 border-b border-slate-800 px-4 py-3 flex justify-between items-center">
                    <h3 className="font-black text-sm text-slate-200 flex items-center gap-2">
                        <DollarSign size={15}/> بند مخصص
                    </h3>
                    <button onClick={onClose}><X size={16} className="text-slate-500 hover:text-red-400"/></button>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); if (!title.trim() || !price) return; onAdd(title, price); }} className="p-4 space-y-3">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1.5">البيان</label>
                        <input autoFocus required
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 text-sm"
                            placeholder="مثال: رسوم انتساب، فحص حزام..."
                            value={title} onChange={e => setTitle(e.target.value)}/>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-emerald-400 block mb-1.5">السعر (JD)</label>
                        <input required type="number" min="0" step="0.5"
                            className="w-full bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 text-lg font-bold text-center"
                            placeholder="0"
                            value={price} onChange={e => setPrice(e.target.value)}/>
                    </div>
                    <button type="submit"
                        className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-sm">
                        إضافة
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

const PackagePicker = ({ packages, onClose, onPick }) => {
    return createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="bg-yellow-950/40 border-b border-yellow-900/30 px-4 py-3 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-sm text-yellow-300 flex items-center gap-2">
                        <Gift size={15}/> اختر باقة
                    </h3>
                    <button onClick={onClose}><X size={16} className="text-slate-500 hover:text-red-400"/></button>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                    {packages.length === 0 ? (
                        <p className="text-center text-slate-600 py-8">لا يوجد باقات بعد</p>
                    ) : packages.map(p => {
                        const total = (p.items || []).reduce((a, it) => a + Number(it.price || 0), 0);
                        return (
                            <button key={p.id} type="button" onClick={() => onPick(p)}
                                className="w-full text-right p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500/50 rounded-xl">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-bold text-sm text-yellow-300">{p.name}</span>
                                    <span className="text-xs text-yellow-400 font-bold">{total} JD</span>
                                </div>
                                <p className="text-[10px] text-slate-500">{(p.items || []).length} بند</p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>,
        document.body
    );
};

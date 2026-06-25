// src/views/dashboard/PackagesManager.jsx
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Gift, Plus, Trash2, Edit3, X, Package, Save,
    CalendarClock, Receipt, DollarSign, ShoppingBag, Boxes
} from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { toast } from '../../lib/toast';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const calcTotal = (items) =>
    (items || []).reduce((a, it) => a + Number(it.price || 0), 0);

// ─── مودال: إضافة/تعديل باقة ─────────────────────────────────────────────────
const PackageModal = ({ editing, products, onClose, onSave }) => {
    const [name, setName] = useState(editing?.name || '');
    const [items, setItems] = useState(editing?.items || []);
    const [saving, setSaving] = useState(false);

    // إضافة بند
    const addCustomFee = () => {
        setItems([...items, { type: 'fee', title: '', price: 0 }]);
    };
    const addSubscription = () => {
        setItems([...items, { type: 'subscription', title: 'اشتراك', months: 1, price: 0 }]);
    };
    const addProduct = () => {
        if (products.length === 0) return toast('لا يوجد منتجات في المخزون', 'error');
        const p = products[0];
        setItems([...items, {
            type: 'product',
            productId: p.id,
            title: p.name,
            price: p.price || 0,
            askSize: true,
        }]);
    };

    const updateItem = (i, field, value) => {
        setItems(items.map((it, x) => x === i ? { ...it, [field]: value } : it));
    };
    const removeItem = (i) => setItems(items.filter((_, x) => x !== i));

    const submit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return toast('أدخل اسم الباقة', 'error');
        if (items.length === 0) return toast('أضف بنداً واحداً على الأقل', 'error');
        setSaving(true);
        try {
            await onSave({ name: name.trim(), items });
            onClose();
        } finally { setSaving(false); }
    };

    const total = calcTotal(items);

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6" onClick={e => e.stopPropagation()}>
                <div className="bg-yellow-950/40 border-b border-yellow-900/30 px-5 py-3 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-base text-yellow-300 flex items-center gap-2">
                        <Gift size={17}/> {editing ? 'تعديل باقة' : 'باقة جديدة'}
                    </h3>
                    <button onClick={onClose}><X size={18} className="text-slate-500 hover:text-red-400"/></button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">اسم الباقة</label>
                        <input autoFocus required
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-yellow-500 text-sm"
                            placeholder="مثال: باقة طالب جديد"
                            value={name} onChange={e => setName(e.target.value)}/>
                    </div>

                    {/* البنود */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="text-[10px] font-bold text-slate-400">البنود ({items.length})</label>
                            <div className="flex gap-1.5">
                                <button type="button" onClick={addSubscription}
                                    className="flex items-center gap-1 px-2 py-1 bg-blue-900/20 hover:bg-blue-600 hover:text-white text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-bold transition-colors">
                                    <CalendarClock size={10}/> اشتراك
                                </button>
                                <button type="button" onClick={addProduct}
                                    className="flex items-center gap-1 px-2 py-1 bg-emerald-900/20 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold transition-colors">
                                    <Package size={10}/> منتج
                                </button>
                                <button type="button" onClick={addCustomFee}
                                    className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] font-bold transition-colors">
                                    <DollarSign size={10}/> بند مخصص
                                </button>
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <p className="text-[11px] text-slate-600 text-center py-6 bg-slate-950 rounded-xl border border-slate-800 border-dashed">
                                لا يوجد بنود — اضغط على الأزرار أعلاه لإضافة
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {items.map((it, i) => (
                                    <div key={i} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0
                                                ${it.type === 'subscription' ? 'bg-blue-900/30 text-blue-400 border-blue-500/20' :
                                                  it.type === 'product' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/20' :
                                                  'bg-slate-800 text-slate-300 border-slate-700'}`}>
                                                {it.type === 'subscription' ? '📅 اشتراك' : it.type === 'product' ? '📦 منتج' : '💰 بند'}
                                            </span>
                                            <button type="button" onClick={() => removeItem(i)}
                                                className="ml-auto text-red-400 hover:bg-red-900/20 p-1 rounded">
                                                <Trash2 size={12}/>
                                            </button>
                                        </div>

                                        {/* المنتج: dropdown */}
                                        {it.type === 'product' ? (
                                            <select
                                                className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded-lg outline-none focus:border-emerald-500 text-sm"
                                                value={it.productId || ''}
                                                onChange={e => {
                                                    const p = products.find(x => x.id === e.target.value);
                                                    if (p) {
                                                        updateItem(i, 'productId', p.id);
                                                        updateItem(i, 'title', p.name);
                                                        updateItem(i, 'price', p.price || 0);
                                                    }
                                                }}>
                                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                            </select>
                                        ) : (
                                            <input
                                                className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-2 rounded-lg outline-none text-sm"
                                                placeholder={it.type === 'subscription' ? 'مثال: اشتراك شهري' : 'البيان'}
                                                value={it.title}
                                                onChange={e => updateItem(i, 'title', e.target.value)}/>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                            {it.type === 'subscription' && (
                                                <div>
                                                    <label className="text-[9px] text-slate-500 font-bold block mb-0.5">مدة الاشتراك (شهور)</label>
                                                    <input type="number" min="1"
                                                        className="w-full bg-slate-900 border border-slate-700 text-slate-200 p-1.5 rounded-lg outline-none text-sm text-center"
                                                        value={it.months || 1}
                                                        onChange={e => updateItem(i, 'months', Number(e.target.value) || 1)}/>
                                                </div>
                                            )}
                                            <div className={it.type === 'subscription' ? '' : 'col-span-2'}>
                                                <label className="text-[9px] text-slate-500 font-bold block mb-0.5">السعر (JD)</label>
                                                <input type="number" min="0" step="0.5"
                                                    className="w-full bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 p-1.5 rounded-lg outline-none font-bold text-sm text-center"
                                                    value={it.price}
                                                    onChange={e => updateItem(i, 'price', Number(e.target.value) || 0)}/>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* المجموع */}
                    {items.length > 0 && (
                        <div className="bg-yellow-900/15 border border-yellow-500/30 rounded-xl px-4 py-3 flex items-center justify-between">
                            <span className="font-black text-yellow-300">مجموع الباقة</span>
                            <span className="text-xl font-black text-yellow-400">{total} <span className="text-xs">JD</span></span>
                        </div>
                    )}

                    <button type="submit" disabled={saving}
                        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl text-sm shadow-lg shadow-yellow-500/30 disabled:opacity-50">
                        <Save size={14} className="inline ml-1"/> {saving ? 'جاري الحفظ...' : 'حفظ الباقة'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function PackagesManager({ selectedBranch, logActivity }) {

    const packagesCol = useCollection('packages');
    const productsCol = useCollection('products');

    const [showAdd, setShowAdd] = useState(false);
    const [editing, setEditing] = useState(null);

    const packages = useMemo(() =>
        packagesCol.data
            .filter(p => !p.branch || p.branch === selectedBranch)
            .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    [packagesCol.data, selectedBranch]);

    const products = useMemo(() =>
        productsCol.data.filter(p => !p.branch || p.branch === selectedBranch),
    [productsCol.data, selectedBranch]);

    const savePackage = async (data) => {
        const payload = { ...data, branch: selectedBranch, createdAt: new Date().toISOString() };
        if (editing) {
            await packagesCol.update(editing.id, payload);
            if (logActivity) logActivity('تعديل باقة', data.name);
            setEditing(null);
        } else {
            await packagesCol.add(payload);
            if (logActivity) logActivity('باقة جديدة', data.name);
        }
    };

    const deletePackage = async (p) => {
        if (!confirm(`حذف الباقة "${p.name}"؟`)) return;
        await packagesCol.remove(p.id);
        if (logActivity) logActivity('حذف باقة', p.name);
    };

    return (
        <div className="space-y-5 animate-fade-in font-sans pb-20 md:pb-0">

            {showAdd && <PackageModal editing={null} products={products} onClose={() => setShowAdd(false)} onSave={savePackage}/>}
            {editing && <PackageModal editing={editing} products={products} onClose={() => setEditing(null)} onSave={savePackage}/>}

            {/* Header */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                        <Gift size={22} className="text-yellow-400"/>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-100">الباقات الجاهزة</h2>
                        <p className="text-xs text-slate-500">جمّع البنود الشائعة في باقة واحدة للوصل السريع</p>
                    </div>
                </div>
                <button onClick={() => setShowAdd(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-xl text-xs font-bold shadow-lg shadow-yellow-500/30">
                    <Plus size={14}/> باقة جديدة
                </button>
            </div>

            {/* قائمة الباقات */}
            {packages.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
                    <ShoppingBag size={42} className="mx-auto text-slate-700 mb-3 opacity-40"/>
                    <p className="text-slate-500 font-bold text-sm">لا يوجد باقات بعد</p>
                    <p className="text-xs text-slate-600 mt-1">الباقات تسرّع تسجيل الوصولات للحالات الشائعة</p>
                    <button onClick={() => setShowAdd(true)}
                        className="mt-4 px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl text-sm">
                        <Plus size={14} className="inline ml-1"/> أنشئ أول باقة
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {packages.map(p => {
                        const total = calcTotal(p.items);
                        return (
                            <div key={p.id} className="bg-slate-900 border border-yellow-900/30 rounded-2xl shadow-lg overflow-hidden hover:border-yellow-500/50 transition-colors">
                                <div className="bg-yellow-950/30 px-4 py-3 border-b border-yellow-900/30 flex items-center justify-between">
                                    <h3 className="font-black text-yellow-300 flex items-center gap-2">
                                        <Gift size={15}/> {p.name}
                                    </h3>
                                    <span className="text-base font-black text-yellow-400">{total} <span className="text-[10px] text-slate-500 font-normal">JD</span></span>
                                </div>
                                <div className="p-4 space-y-2">
                                    {(p.items || []).map((it, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className={`text-[10px] shrink-0
                                                    ${it.type === 'subscription' ? 'text-blue-400' : it.type === 'product' ? 'text-emerald-400' : 'text-slate-500'}`}>
                                                    {it.type === 'subscription' ? '📅' : it.type === 'product' ? '📦' : '•'}
                                                </span>
                                                <span className="text-slate-300 truncate">
                                                    {it.title}
                                                    {it.type === 'subscription' && it.months > 1 && <span className="text-[10px] text-slate-500"> × {it.months} شهر</span>}
                                                </span>
                                            </div>
                                            <span className="text-slate-200 font-bold shrink-0">{it.price} JD</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-slate-800 px-4 py-2 bg-slate-950 flex items-center justify-end gap-2">
                                    <button onClick={() => setEditing(p)}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] font-bold">
                                        <Edit3 size={11}/> تعديل
                                    </button>
                                    <button onClick={() => deletePackage(p)}
                                        className="flex items-center gap-1 px-2.5 py-1 bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-[10px] font-bold border border-red-500/20">
                                        <Trash2 size={11}/> حذف
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

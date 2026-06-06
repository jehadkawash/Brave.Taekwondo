// src/views/dashboard/InventoryManager.jsx
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Package, Plus, Trash2, Edit3, X, AlertCircle, Search,
    ChevronRight, ChevronDown, Settings, Tag, Boxes, Save,
    TrendingUp, TrendingDown, History, Printer, RefreshCw
} from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { IMAGES } from '../../lib/constants';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const nowIso = () => new Date().toISOString();
const fmtDate = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    if (isNaN(d.getTime())) return '-';
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
};

// تنبيهات المخزون
const stockBadge = (qty, lowAlert = 3) => {
    if (qty <= 0)         return { txt: '🔴 نفد', cls: 'bg-red-900/30 text-red-400 border-red-500/30' };
    if (qty <= lowAlert)  return { txt: `⚠️ ${qty}`, cls: 'bg-orange-900/30 text-orange-400 border-orange-500/30' };
    return                       { txt: `${qty}`, cls: 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' };
};

// ─── الفئات الافتراضية (تُضاف تلقائياً لو الـ collection فاضية) ─────────────
const DEFAULT_CATEGORIES = [
    { name: 'ملابس', icon: '👕' },
    { name: 'معدات', icon: '🥊' },
    { name: 'أحذية', icon: '👟' },
];

// ─── مودال: إضافة/تعديل فئة ──────────────────────────────────────────────────
const CategoryModal = ({ editing, onClose, onSave }) => {
    const [name, setName] = useState(editing?.name || '');
    const [icon, setIcon] = useState(editing?.icon || '📦');
    const submit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;
        await onSave({ name: name.trim(), icon: icon || '📦' });
        onClose();
    };
    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-blue-950/40 border-b border-blue-900/30 px-5 py-3 flex justify-between items-center">
                    <h3 className="font-black text-base text-blue-300 flex items-center gap-2">
                        <Tag size={17}/> {editing ? 'تعديل فئة' : 'فئة جديدة'}
                    </h3>
                    <button onClick={onClose}><X size={18} className="text-slate-500 hover:text-red-400"/></button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-3">
                    <div className="grid grid-cols-[80px_1fr] gap-3">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">رمز</label>
                            <input className="w-full bg-slate-950 border border-slate-700 text-2xl text-center p-2 rounded-xl outline-none focus:border-blue-500"
                                value={icon} onChange={e => setIcon(e.target.value)} maxLength={2}/>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">اسم الفئة</label>
                            <input autoFocus required
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 text-sm"
                                placeholder="مثال: ملابس"
                                value={name} onChange={e => setName(e.target.value)}/>
                        </div>
                    </div>
                    <button type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm">
                        حفظ
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── مودال: إضافة/تعديل منتج ─────────────────────────────────────────────────
const ProductModal = ({ editing, categories, defaultCategoryId, onClose, onSave }) => {
    const [name, setName]         = useState(editing?.name || '');
    const [categoryId, setCategoryId] = useState(editing?.categoryId || defaultCategoryId || '');
    const [price, setPrice]       = useState(editing?.price ?? '');
    const [lowAlert, setLowAlert] = useState(editing?.lowStockAlert ?? 3);
    const [variants, setVariants] = useState(editing?.variants || []);
    const [newSize, setNewSize]   = useState('');
    const [newStock, setNewStock] = useState('');

    const addVariant = () => {
        const sz = newSize.trim();
        if (!sz) return;
        if (variants.some(v => v.size === sz)) return alert('هذا المقاس موجود مسبقاً');
        setVariants([...variants, { size: sz, stock: Number(newStock) || 0 }]);
        setNewSize(''); setNewStock('');
    };
    const removeVariant = (i) => setVariants(variants.filter((_, x) => x !== i));
    const updateVariantStock = (i, val) => setVariants(variants.map((v, x) => x === i ? { ...v, stock: Number(val) || 0 } : v));

    const submit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return alert('أدخل اسم المنتج');
        if (!categoryId) return alert('اختر فئة');
        if (!price || Number(price) <= 0) return alert('أدخل سعراً صحيحاً');
        await onSave({
            name: name.trim(),
            categoryId,
            price: Number(price),
            lowStockAlert: Number(lowAlert) || 3,
            variants,
        });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
            <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6" onClick={e => e.stopPropagation()}>
                <div className="bg-emerald-950/40 border-b border-emerald-900/30 px-5 py-3 flex justify-between items-center">
                    <h3 className="font-black text-base text-emerald-300 flex items-center gap-2">
                        <Package size={17}/> {editing ? 'تعديل منتج' : 'منتج جديد'}
                    </h3>
                    <button onClick={onClose}><X size={18} className="text-slate-500 hover:text-red-400"/></button>
                </div>
                <form onSubmit={submit} className="p-5 space-y-3 max-h-[75vh] overflow-y-auto">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">اسم المنتج</label>
                            <input required autoFocus
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 text-sm"
                                placeholder="مثال: بدلة تايكواندو"
                                value={name} onChange={e => setName(e.target.value)}/>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 block mb-1">الفئة</label>
                            <select required
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 text-sm"
                                value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                                <option value="">اختر فئة...</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-emerald-400 block mb-1">السعر (JD)</label>
                            <input required type="number" min="0" step="0.5"
                                className="w-full bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 text-sm font-bold text-center"
                                placeholder="20"
                                value={price} onChange={e => setPrice(e.target.value)}/>
                        </div>
                        <div className="md:col-span-2">
                            <label className="text-[10px] font-bold text-orange-400 block mb-1">تنبيه عند كمية أقل من:</label>
                            <input type="number" min="0"
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-orange-500 text-sm"
                                placeholder="3"
                                value={lowAlert} onChange={e => setLowAlert(e.target.value)}/>
                        </div>
                    </div>

                    {/* المقاسات والكميات */}
                    <div>
                        <label className="text-[10px] font-bold text-blue-400 block mb-2 flex items-center gap-1">
                            <Boxes size={11}/> المقاسات والكميات
                        </label>

                        {/* إضافة مقاس */}
                        <div className="flex gap-2 mb-2">
                            <input
                                className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-blue-500 text-sm"
                                placeholder="المقاس (مثل: 130 أو M)"
                                value={newSize} onChange={e => setNewSize(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVariant(); }}}
                            />
                            <input type="number" min="0"
                                className="w-20 bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-blue-500 text-sm text-center"
                                placeholder="الكمية"
                                value={newStock} onChange={e => setNewStock(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVariant(); }}}
                            />
                            <button type="button" onClick={addVariant}
                                className="px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl">
                                <Plus size={16}/>
                            </button>
                        </div>

                        {variants.length === 0 ? (
                            <p className="text-[11px] text-slate-600 text-center py-3 bg-slate-950 rounded-lg border border-slate-800 border-dashed">
                                لا يوجد مقاسات بعد
                            </p>
                        ) : (
                            <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar">
                                {variants.map((v, i) => (
                                    <div key={i} className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                                        <span className="font-bold text-slate-200 text-sm w-16">{v.size}</span>
                                        <input type="number" min="0"
                                            className="flex-1 bg-slate-900 border border-slate-700 text-slate-200 p-1.5 rounded-lg outline-none focus:border-blue-500 text-sm text-center"
                                            value={v.stock}
                                            onChange={e => updateVariantStock(i, e.target.value)}/>
                                        <span className="text-[10px] text-slate-500">قطعة</span>
                                        <button type="button" onClick={() => removeVariant(i)}
                                            className="p-1 text-red-400 hover:bg-red-900/20 rounded">
                                            <Trash2 size={13}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button type="submit"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/30">
                        <Save size={14} className="inline ml-1"/> حفظ المنتج
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── مودال: تعديل سريع للكمية ────────────────────────────────────────────────
const StockAdjustModal = ({ product, variantIndex, onClose, onSave }) => {
    const v = product.variants[variantIndex];
    const [delta, setDelta]   = useState('');
    const [reason, setReason] = useState('');
    const [mode, setMode]     = useState('in'); // in | out

    const submit = async (e) => {
        e.preventDefault();
        const qty = Number(delta);
        if (!qty || qty <= 0) return alert('أدخل كمية صحيحة');
        const newStock = mode === 'in' ? v.stock + qty : Math.max(0, v.stock - qty);
        await onSave(newStock, { type: mode, quantity: qty, reason: reason.trim() || (mode === 'in' ? 'إضافة' : 'تعديل') });
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="w-full max-w-xs bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="bg-slate-950 border-b border-slate-800 px-5 py-3">
                    <h3 className="font-black text-sm text-slate-200">
                        {product.name} — مقاس {v.size}
                    </h3>
                    <p className="text-[10px] text-slate-500 mt-0.5">الكمية الحالية: <span className="font-bold text-slate-300">{v.stock}</span></p>
                </div>
                <form onSubmit={submit} className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setMode('in')}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-colors
                                ${mode === 'in' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-700'}`}>
                            <TrendingUp size={13} className="inline ml-1"/> دخول (شحنة)
                        </button>
                        <button type="button" onClick={() => setMode('out')}
                            className={`py-2.5 rounded-xl text-xs font-bold border transition-colors
                                ${mode === 'out' ? 'bg-red-600 text-white border-red-500' : 'bg-slate-950 text-slate-400 border-slate-700'}`}>
                            <TrendingDown size={13} className="inline ml-1"/> خروج (نقص)
                        </button>
                    </div>
                    <input required type="number" min="1" autoFocus
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-2xl font-bold text-center"
                        placeholder="الكمية"
                        value={delta} onChange={e => setDelta(e.target.value)}/>
                    <input
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2 rounded-xl outline-none focus:border-blue-500 text-sm"
                        placeholder="السبب (اختياري)"
                        value={reason} onChange={e => setReason(e.target.value)}/>
                    <button type="submit"
                        className={`w-full py-2.5 text-white font-bold rounded-xl text-sm
                            ${mode === 'in' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'}`}>
                        تأكيد
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function InventoryManager({ selectedBranch, logActivity }) {

    const categoriesCol = useCollection('product_categories');
    const productsCol   = useCollection('products');
    const logsCol       = useCollection('inventory_log');

    const [activeCategory, setActiveCategory] = useState('all');
    const [search, setSearch] = useState('');
    const [expandedProduct, setExpandedProduct] = useState(null);

    // مودالات
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingCategory, setEditingCategory]     = useState(null);
    const [showProductModal, setShowProductModal]   = useState(false);
    const [editingProduct, setEditingProduct]       = useState(null);
    const [adjustStock, setAdjustStock]             = useState(null); // { product, variantIndex }
    const [showLogs, setShowLogs]                   = useState(false);

    // إنشاء الفئات الافتراضية أول مرة
    React.useEffect(() => {
        if (!categoriesCol.loading && categoriesCol.data.length === 0) {
            DEFAULT_CATEGORIES.forEach(c => categoriesCol.add(c));
        }
    }, [categoriesCol.loading, categoriesCol.data.length]);

    // الفئات والمنتجات للفرع الحالي
    const categories = categoriesCol.data;
    const products = useMemo(() =>
        productsCol.data.filter(p => !p.branch || p.branch === selectedBranch),
    [productsCol.data, selectedBranch]);

    const filteredProducts = useMemo(() => {
        let result = products;
        if (activeCategory !== 'all') result = result.filter(p => p.categoryId === activeCategory);
        if (search.trim()) result = result.filter(p => p.name.includes(search.trim()));
        return result;
    }, [products, activeCategory, search]);

    // إحصائيات
    const stats = useMemo(() => {
        let totalQty = 0, outOfStock = 0, lowStock = 0, totalValue = 0;
        products.forEach(p => {
            (p.variants || []).forEach(v => {
                totalQty += v.stock || 0;
                if (v.stock === 0) outOfStock++;
                else if (v.stock <= (p.lowStockAlert || 3)) lowStock++;
                totalValue += (v.stock || 0) * (p.price || 0);
            });
        });
        return { totalQty, outOfStock, lowStock, totalValue, products: products.length };
    }, [products]);

    // ─── handlers ─────────────────────────────────────────────────────────────
    const saveCategory = async (data) => {
        if (editingCategory) {
            await categoriesCol.update(editingCategory.id, data);
            setEditingCategory(null);
        } else {
            await categoriesCol.add(data);
        }
    };

    const deleteCategory = async (cat) => {
        const used = products.some(p => p.categoryId === cat.id);
        if (used) return alert('لا يمكن حذف فئة فيها منتجات');
        if (!confirm(`حذف الفئة "${cat.name}"؟`)) return;
        await categoriesCol.remove(cat.id);
    };

    const saveProduct = async (data) => {
        const payload = { ...data, branch: selectedBranch };
        if (editingProduct) {
            await productsCol.update(editingProduct.id, payload);
            if (logActivity) logActivity('تعديل منتج', data.name);
            setEditingProduct(null);
        } else {
            await productsCol.add(payload);
            if (logActivity) logActivity('منتج جديد', data.name);
        }
    };

    const deleteProduct = async (p) => {
        if (!confirm(`حذف المنتج "${p.name}" وكل مقاساته؟`)) return;
        await productsCol.remove(p.id);
        if (logActivity) logActivity('حذف منتج', p.name);
    };

    const handleStockAdjust = async (newStock, logEntry) => {
        const product = adjustStock.product;
        const idx     = adjustStock.variantIndex;
        const newVariants = product.variants.map((v, i) => i === idx ? { ...v, stock: newStock } : v);
        await productsCol.update(product.id, { variants: newVariants });
        await logsCol.add({
            productId:   product.id,
            productName: product.name,
            variantSize: product.variants[idx].size,
            type:        logEntry.type,
            quantity:    logEntry.quantity,
            reason:      logEntry.reason,
            branch:      selectedBranch,
            createdAt:   nowIso(),
        });
        if (logActivity) logActivity(
            logEntry.type === 'in' ? 'دخول مخزون' : 'خروج مخزون',
            `${product.name} م.${product.variants[idx].size}: ${logEntry.quantity} قطعة`
        );
    };

    // طباعة كشف المخزون
    const printInventory = () => {
        const logoUrl = window.location.origin + IMAGES.LOGO;
        let rows = '';
        products.forEach((p, pi) => {
            const cat = categories.find(c => c.id === p.categoryId);
            (p.variants || []).forEach((v, vi) => {
                rows += `<tr>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;">${vi === 0 ? pi + 1 : ''}</td>
                    <td style="border:1px solid #ddd;padding:5px;font-weight:bold;">${vi === 0 ? p.name : ''}</td>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;">${vi === 0 ? (cat ? cat.icon + ' ' + cat.name : '-') : ''}</td>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;font-weight:bold;">${v.size}</td>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;font-weight:bold;color:${v.stock <= 0 ? '#991b1b' : v.stock <= (p.lowStockAlert || 3) ? '#9a3412' : '#166534'};">${v.stock}</td>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;">${vi === 0 ? p.price + ' JD' : ''}</td>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;font-weight:bold;">${v.stock * p.price} JD</td>
                </tr>`;
            });
        });

        const win = window.open('', 'INV', 'height=800,width=1100');
        win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>كشف المخزون</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page{size:A4 landscape;margin:10mm}
            body{font-family:'Cairo',sans-serif;color:#000;background:#fff;-webkit-print-color-adjust:exact}
            .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #000;padding-bottom:10px;margin-bottom:15px}
            .logo{height:55px}
            table{width:100%;border-collapse:collapse;font-size:12px}
            th{background:#1e293b;color:#fff;border:1px solid #000;padding:7px;text-align:center;font-weight:bold}
            .stats{display:flex;gap:10px;margin-bottom:15px}
            .st{flex:1;border:1px solid #e5e7eb;border-radius:6px;padding:8px;text-align:center}
        </style></head>
        <body>
            <div class="hdr">
                <div>
                    <h1 style="margin:0;font-size:18px;font-weight:900">كشف المخزون — فرع ${selectedBranch}</h1>
                    <p style="margin:4px 0 0;font-size:11px;color:#555;font-weight:bold">تاريخ الطباعة: ${new Date().toLocaleDateString('en-GB')}</p>
                </div>
                <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
            </div>
            <div class="stats">
                <div class="st"><div style="font-size:10px;color:#555;font-weight:bold">المنتجات</div><div style="font-size:18px;font-weight:900">${stats.products}</div></div>
                <div class="st"><div style="font-size:10px;color:#555;font-weight:bold">إجمالي القطع</div><div style="font-size:18px;font-weight:900">${stats.totalQty}</div></div>
                <div class="st"><div style="font-size:10px;color:#555;font-weight:bold">نفد</div><div style="font-size:18px;font-weight:900;color:#991b1b">${stats.outOfStock}</div></div>
                <div class="st"><div style="font-size:10px;color:#555;font-weight:bold">قارب على النفاد</div><div style="font-size:18px;font-weight:900;color:#9a3412">${stats.lowStock}</div></div>
                <div class="st"><div style="font-size:10px;color:#555;font-weight:bold">قيمة المخزون</div><div style="font-size:18px;font-weight:900;color:#166534">${stats.totalValue} JD</div></div>
            </div>
            <table>
                <thead><tr>
                    <th style="width:30px">#</th>
                    <th>المنتج</th>
                    <th style="width:100px">الفئة</th>
                    <th style="width:60px">المقاس</th>
                    <th style="width:60px">الكمية</th>
                    <th style="width:70px">السعر</th>
                    <th style="width:90px">القيمة</th>
                </tr></thead>
                <tbody>${rows || '<tr><td colspan="7" style="text-align:center;padding:20px;color:#666">لا يوجد منتجات</td></tr>'}</tbody>
            </table>
            <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close()},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-5 animate-fade-in font-sans pb-20 md:pb-0">

            {showCategoryModal && <CategoryModal editing={null} onClose={() => setShowCategoryModal(false)} onSave={saveCategory}/>}
            {editingCategory && <CategoryModal editing={editingCategory} onClose={() => setEditingCategory(null)} onSave={saveCategory}/>}
            {showProductModal && <ProductModal editing={null} categories={categories} defaultCategoryId={activeCategory !== 'all' ? activeCategory : ''} onClose={() => setShowProductModal(false)} onSave={saveProduct}/>}
            {editingProduct && <ProductModal editing={editingProduct} categories={categories} onClose={() => setEditingProduct(null)} onSave={saveProduct}/>}
            {adjustStock && <StockAdjustModal product={adjustStock.product} variantIndex={adjustStock.variantIndex} onClose={() => setAdjustStock(null)} onSave={handleStockAdjust}/>}

            {/* مودال: سجل الحركات */}
            {showLogs && createPortal(
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowLogs(false)}>
                    <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
                        <div className="bg-purple-950/40 border-b border-purple-900/30 px-5 py-3 flex justify-between items-center shrink-0">
                            <h3 className="font-black text-base text-purple-300 flex items-center gap-2">
                                <History size={17}/> سجل حركات المخزون
                            </h3>
                            <button onClick={() => setShowLogs(false)}><X size={18} className="text-slate-500 hover:text-red-400"/></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {logsCol.data.length === 0 ? (
                                <p className="text-center text-slate-600 py-8">لا يوجد حركات مسجّلة</p>
                            ) : [...logsCol.data].sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || '')).slice(0, 100).map(log => (
                                <div key={log.id} className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${log.type === 'in' ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20' : 'bg-red-900/20 text-red-400 border border-red-500/20'}`}>
                                            {log.type === 'in' ? <TrendingUp size={13}/> : <TrendingDown size={13}/>}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-200 text-sm truncate">{log.productName} <span className="text-slate-500">— م.{log.variantSize}</span></p>
                                            <p className="text-[10px] text-slate-500">{log.reason} • {fmtDate(log.createdAt)}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-black ${log.type === 'in' ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {log.type === 'in' ? '+' : '−'}{log.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* ── Header ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-500/10 rounded-xl border border-blue-500/30">
                        <Package size={22} className="text-blue-400"/>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-100">المخزون</h2>
                        <p className="text-xs text-slate-500">إدارة المنتجات والمقاسات والكميات</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={() => setShowLogs(true)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors">
                        <History size={14}/> السجل
                    </button>
                    <button onClick={printInventory}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors">
                        <Printer size={14}/> طباعة
                    </button>
                    <button onClick={() => setShowProductModal(true)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-900/30">
                        <Plus size={14}/> منتج جديد
                    </button>
                </div>
            </div>

            {/* ── إحصائيات ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-blue-900/10 border border-blue-900/30 rounded-2xl p-4">
                    <p className="text-[10px] text-blue-500/70 font-bold mb-1">المنتجات</p>
                    <p className="text-2xl font-black text-blue-400">{stats.products}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <p className="text-[10px] text-slate-500 font-bold mb-1">إجمالي القطع</p>
                    <p className="text-2xl font-black text-slate-200">{stats.totalQty}</p>
                </div>
                <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-4">
                    <p className="text-[10px] text-red-500/70 font-bold mb-1">نفد</p>
                    <p className="text-2xl font-black text-red-400">{stats.outOfStock}</p>
                </div>
                <div className="bg-orange-900/10 border border-orange-900/30 rounded-2xl p-4">
                    <p className="text-[10px] text-orange-500/70 font-bold mb-1">قارب على النفاد</p>
                    <p className="text-2xl font-black text-orange-400">{stats.lowStock}</p>
                </div>
                <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-2xl p-4 col-span-2 md:col-span-1">
                    <p className="text-[10px] text-emerald-500/70 font-bold mb-1">قيمة المخزون</p>
                    <p className="text-2xl font-black text-emerald-400">{stats.totalValue} <span className="text-xs">JD</span></p>
                </div>
            </div>

            {/* ── شريط الفئات ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                    <button onClick={() => setActiveCategory('all')}
                        className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border whitespace-nowrap transition-colors
                            ${activeCategory === 'all' ? 'bg-blue-500 text-white border-blue-400' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>
                        📦 الكل ({products.length})
                    </button>
                    <div className="h-6 w-px bg-slate-800 shrink-0"/>
                    {categories.map(cat => {
                        const count = products.filter(p => p.categoryId === cat.id).length;
                        const isActive = activeCategory === cat.id;
                        return (
                            <div key={cat.id} className={`shrink-0 flex items-center rounded-xl border transition-colors
                                ${isActive ? 'bg-blue-500/15 border-blue-500/50' : 'bg-slate-950 border-slate-800 hover:bg-slate-800'}`}>
                                <button onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold whitespace-nowrap ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                                    {cat.icon} {cat.name} <span className="opacity-60">({count})</span>
                                </button>
                                {isActive && (
                                    <>
                                        <button onClick={() => setEditingCategory(cat)} title="تعديل"
                                            className="p-1.5 text-slate-500 hover:text-blue-400">
                                            <Edit3 size={11}/>
                                        </button>
                                        <button onClick={() => deleteCategory(cat)} title="حذف"
                                            className="p-1.5 text-slate-500 hover:text-red-400 ml-1">
                                            <Trash2 size={11}/>
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                    <button onClick={() => setShowCategoryModal(true)}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-xl text-xs font-bold hover:bg-blue-500/20 transition-colors">
                        <Plus size={12}/> فئة جديدة
                    </button>
                </div>
            </div>

            {/* ── بحث ── */}
            <div className="relative">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                <input
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 p-2.5 pr-9 rounded-xl outline-none focus:border-blue-500 placeholder-slate-600 text-sm"
                    placeholder="ابحث في المنتجات..."
                    value={search} onChange={e => setSearch(e.target.value)}/>
            </div>

            {/* ── قائمة المنتجات ── */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
                    <Package size={42} className="mx-auto text-slate-700 mb-3 opacity-40"/>
                    <p className="text-slate-500 font-bold text-sm">
                        {search || activeCategory !== 'all' ? 'لا يوجد نتائج' : 'لا يوجد منتجات بعد'}
                    </p>
                    {!search && activeCategory === 'all' && (
                        <button onClick={() => setShowProductModal(true)}
                            className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm">
                            <Plus size={14} className="inline ml-1"/> أضف أول منتج
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredProducts.map(p => {
                        const cat = categories.find(c => c.id === p.categoryId);
                        const totalQty = (p.variants || []).reduce((a, v) => a + v.stock, 0);
                        const hasOut   = (p.variants || []).some(v => v.stock <= 0);
                        const hasLow   = (p.variants || []).some(v => v.stock > 0 && v.stock <= (p.lowStockAlert || 3));
                        const isExpanded = expandedProduct === p.id;
                        return (
                            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
                                <div className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-800/40"
                                    onClick={() => setExpandedProduct(isExpanded ? null : p.id)}>
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                        <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0">
                                            {cat?.icon || '📦'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-black text-slate-100 truncate">{p.name}</h3>
                                                {hasOut && <span className="text-[9px] font-bold bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded border border-red-500/20">🔴 نفد بعض المقاسات</span>}
                                                {!hasOut && hasLow && <span className="text-[9px] font-bold bg-orange-900/30 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20">⚠️ منخفض</span>}
                                            </div>
                                            <p className="text-[10px] text-slate-500 mt-0.5">
                                                {cat?.name || '—'} • {(p.variants || []).length} مقاس • إجمالي: {totalQty}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-base font-black text-emerald-400">{p.price} <span className="text-[10px] text-slate-500 font-normal">JD</span></span>
                                        {isExpanded ? <ChevronDown size={16} className="text-slate-500"/> : <ChevronRight size={16} className="text-slate-500"/>}
                                    </div>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-slate-800 bg-slate-950/50 p-4 space-y-3">
                                        {/* المقاسات */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {(p.variants || []).length === 0 ? (
                                                <p className="col-span-full text-center text-slate-600 text-xs py-4">لا يوجد مقاسات</p>
                                            ) : (p.variants || []).map((v, i) => {
                                                const badge = stockBadge(v.stock, p.lowStockAlert);
                                                return (
                                                    <button key={i} onClick={() => setAdjustStock({ product: p, variantIndex: i })}
                                                        className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 hover:border-blue-500/40 transition-colors text-right">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className="font-bold text-slate-200 text-sm">{v.size}</span>
                                                            <RefreshCw size={11} className="text-slate-600"/>
                                                        </div>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>
                                                            {badge.txt}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* أزرار الإدارة */}
                                        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                                            <button onClick={() => setEditingProduct(p)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold">
                                                <Edit3 size={12}/> تعديل
                                            </button>
                                            <button onClick={() => deleteProduct(p)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs font-bold border border-red-500/20">
                                                <Trash2 size={12}/> حذف
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// src/views/dashboard/DebtManager.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    DollarSign, Plus, Trash2, CheckCircle, Clock,
    AlertCircle, User, Calendar, ChevronDown, ChevronUp,
    Printer, Search, Filter, Send, X, CreditCard,
    TrendingDown, TrendingUp, Wallet, Phone, MessageCircle
} from 'lucide-react';
import { StudentSearch, Button } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';
import { useCollection } from '../../hooks/useCollection';

// ─── مساعدات ────────────────────────────────────────────────────────────────

const formatDate = (val) => {
    if (!val) return '-';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

const todayStr = () => new Date().toISOString().split('T')[0];

const getStatus = (totalAmount, paidAmount) => {
    const remaining = Number(totalAmount) - Number(paidAmount || 0);
    if (remaining <= 0)                      return 'paid';
    if (Number(paidAmount || 0) > 0)         return 'partial';
    return 'unpaid';
};

const STATUS_CONFIG = {
    unpaid:  { label: 'غير مدفوع',    color: 'text-red-400',    bg: 'bg-red-900/20',    border: 'border-red-500/30',    dot: 'bg-red-500'     },
    partial: { label: 'مدفوع جزئياً', color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/30', dot: 'bg-orange-500'  },
    paid:    { label: 'مسدَّد كاملاً', color: 'text-emerald-400',bg: 'bg-emerald-900/20',border: 'border-emerald-500/30',dot: 'bg-emerald-500' },
};

// ─── مكوّن: بحث عن طالب (نشط + مؤرشف) ──────────────────────────────────────
const CombinedStudentSearch = ({ students, archivedStudents, onSelect, onClear }) => {
    const [query, setQuery]   = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const allStudents = useMemo(() => [
        ...students.map(s => ({ ...s, _archived: false })),
        ...archivedStudents.map(s => ({ ...s, _archived: true,
            id: s.originalId || s.id  // نستخدم الـ ID الأصلي
        })),
    ], [students, archivedStudents]);

    const filtered = useMemo(() => {
        if (!query.trim()) return allStudents.slice(0, 10);
        return allStudents.filter(s => s.name?.includes(query));
    }, [allStudents, query]);

    return (
        <div className="relative">
            <input
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-red-500 placeholder-slate-600 text-sm"
                placeholder="ابحث عن الطالب (نشط أو مؤرشف)..."
                value={query}
                onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            />
            {isOpen && filtered.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-52 overflow-y-auto custom-scrollbar">
                    {filtered.map(s => (
                        <div key={s.id + (s._archived ? '_arc' : '')}
                            className="flex items-center justify-between px-3 py-2.5 hover:bg-slate-800 cursor-pointer border-b border-slate-800/50 last:border-0"
                            onClick={() => { setQuery(s.name); setIsOpen(false); onSelect(s); }}
                        >
                            <span className="text-sm font-bold text-slate-200">{s.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500">{s.belt}</span>
                                {s._archived && (
                                    <span className="text-[10px] font-bold bg-orange-900/30 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                                        📦 مؤرشف
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── مودال: إضافة دين جديد ───────────────────────────────────────────────────
const AddDebtModal = ({ onClose, students, archivedStudents, onSave }) => {
    const [form, setForm] = useState({
        studentId: '', studentName: '', phone: '',
        reason: '', totalAmount: '', dueDate: '', notes: '',
        isArchived: false,
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.studentId) return alert('اختر طالباً');
        if (!form.reason.trim()) return alert('أدخل سبب الدين');
        if (!Number(form.totalAmount) || Number(form.totalAmount) <= 0) return alert('أدخل مبلغاً صحيحاً');
        setSaving(true);
        try {
            await onSave({
                studentId:   form.studentId,
                studentName: form.studentName,
                phone:       form.phone,
                isArchived:  form.isArchived,
                reason:      form.reason.trim(),
                totalAmount: Number(form.totalAmount),
                paidAmount:  0,
                dueDate:     form.dueDate || '',
                notes:       form.notes.trim(),
                payments:    [],
                createdAt:   new Date().toISOString(),
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert('حدث خطأ أثناء الحفظ');
        } finally {
            setSaving(false);
        }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-red-950/40 border-b border-red-900/30 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-black text-lg text-red-300 flex items-center gap-2">
                        <Plus size={20}/> تسجيل دين جديد
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">الطالب</label>
                        <CombinedStudentSearch
                            students={students}
                            archivedStudents={archivedStudents}
                            onSelect={(s) => setForm({
                                ...form,
                                studentId:   s.id,
                                studentName: s.name,
                                phone:       s.phone || '',
                                isArchived:  s._archived || false,
                            })}
                            onClear={() => setForm({ ...form, studentId: '', studentName: '', phone: '', isArchived: false })}
                        />
                        {form.studentName && (
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-[11px] text-emerald-400 font-bold">✓ {form.studentName}</p>
                                {form.isArchived && (
                                    <span className="text-[10px] font-bold bg-orange-900/20 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                                        📦 طالب مؤرشف
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">سبب الدين</label>
                        <input
                            required
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-red-500 placeholder-slate-600 text-sm"
                            placeholder="مثال: اشتراك شهر مايو، معدات تدريب..."
                            value={form.reason}
                            onChange={e => setForm({ ...form, reason: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-red-400 block mb-1.5">المبلغ (JD)</label>
                            <input
                                required
                                type="number"
                                min="0.5"
                                step="0.5"
                                className="w-full bg-red-950/20 border border-red-500/30 text-red-200 p-2.5 rounded-xl outline-none focus:border-red-500 placeholder-red-900/50 text-sm"
                                placeholder="0"
                                value={form.totalAmount}
                                onChange={e => setForm({ ...form, totalAmount: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1.5">تاريخ الاستحقاق</label>
                            <input
                                type="date"
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-red-500 text-sm"
                                value={form.dueDate}
                                onChange={e => setForm({ ...form, dueDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">ملاحظات (اختياري)</label>
                        <textarea
                            rows={2}
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-red-500 placeholder-slate-600 text-sm resize-none"
                            placeholder="أي تفاصيل إضافية..."
                            value={form.notes}
                            onChange={e => setForm({ ...form, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-slate-400 hover:bg-slate-800">إلغاء</Button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-[2] py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm shadow-lg shadow-red-900/20"
                        >
                            {saving ? 'جاري الحفظ...' : 'تسجيل الدين'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── مودال: تسجيل دفعة ──────────────────────────────────────────────────────
const PaymentModal = ({ debt, onClose, onSave }) => {
    const remaining = Number(debt.totalAmount) - Number(debt.paidAmount || 0);
    const [amount, setAmount]     = useState('');
    const [note, setNote]         = useState('');
    const [date, setDate]         = useState(todayStr());
    const [saving, setSaving]     = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const amt = Number(amount);
        if (!amt || amt <= 0)  return alert('أدخل مبلغاً صحيحاً');
        if (amt > remaining)   return alert(`المبلغ المدخل (${amt} JD) أكبر من المتبقي (${remaining} JD)`);
        setSaving(true);
        try {
            const newPaidAmount = Number(debt.paidAmount || 0) + amt;
            const newPayments   = [...(debt.payments || []), { amount: amt, date, note: note.trim() }];
            await onSave(debt.id, { paidAmount: newPaidAmount, payments: newPayments });
            onClose();
        } finally {
            setSaving(false);
        }
    };

    const payAll = () => setAmount(String(remaining));

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-emerald-950/40 border-b border-emerald-900/30 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-black text-lg text-emerald-300 flex items-center gap-2">
                        <CreditCard size={20}/> تسجيل دفعة
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400"><X size={20}/></button>
                </div>
                <div className="p-6">
                    <div className="bg-slate-950 rounded-xl p-4 mb-5 border border-slate-800">
                        <p className="text-xs text-slate-500 font-bold mb-1">{debt.studentName} — {debt.reason}</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-400">المتبقي للسداد:</span>
                            <span className="text-xl font-black text-red-400">{remaining} JD</span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (Number(debt.paidAmount||0)/Number(debt.totalAmount))*100)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                            <span>مدفوع: {debt.paidAmount||0} JD</span>
                            <span>الكلي: {debt.totalAmount} JD</span>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-xs font-bold text-emerald-400">المبلغ المدفوع (JD)</label>
                                <button type="button" onClick={payAll}
                                    className="text-[10px] text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-500/20 hover:bg-emerald-900/40 font-bold">
                                    سداد كامل ({remaining} JD)
                                </button>
                            </div>
                            <input
                                required type="number" min="0.5" step="0.5" max={remaining}
                                className="w-full bg-emerald-950/20 border border-emerald-500/30 text-emerald-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 placeholder-emerald-900/50 text-lg font-bold text-center"
                                placeholder="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1.5">التاريخ</label>
                            <input type="date" max={todayStr()}
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 text-sm"
                                value={date} onChange={e => setDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1.5">ملاحظة (اختياري)</label>
                            <input
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-emerald-500 placeholder-slate-600 text-sm"
                                placeholder="مثال: دفع نص الشهر..."
                                value={note} onChange={e => setNote(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={onClose} className="flex-1 text-slate-400 hover:bg-slate-800">إلغاء</Button>
                            <button type="submit" disabled={saving}
                                className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm shadow-lg shadow-emerald-900/20">
                                {saving ? 'جاري الحفظ...' : 'تسجيل الدفعة'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ─── بطاقة الدين ─────────────────────────────────────────────────────────────
const DebtCard = ({ debt, onPay, onDelete, onPrint }) => {
    const [expanded, setExpanded] = useState(false);
    const remaining    = Number(debt.totalAmount) - Number(debt.paidAmount || 0);
    const percent      = Math.min(100, Math.round((Number(debt.paidAmount||0) / Number(debt.totalAmount)) * 100));
    const status       = getStatus(debt.totalAmount, debt.paidAmount);
    const cfg          = STATUS_CONFIG[status];
    const isOverdue    = debt.dueDate && new Date(debt.dueDate) < new Date() && status !== 'paid';

    const openWhatsApp = () => {
        if (!debt.phone) return;
        let clean = debt.phone.replace(/\D/g, '');
        if (clean.startsWith('0')) clean = clean.substring(1);
        const msg =
            `السلام عليكم ${debt.studentName} 👋\n\n` +
            `نودّ تذكيركم بوجود مبلغ مستحق لدى أكاديمية الشجاع للتايكواندو:\n\n` +
            `📋 البيان: ${debt.reason}\n` +
            `💰 المبلغ الكلي: ${debt.totalAmount} JD\n` +
            `✅ المدفوع: ${debt.paidAmount || 0} JD\n` +
            `🔴 المتبقي: ${remaining} JD\n` +
            (debt.dueDate ? `📅 تاريخ الاستحقاق: ${formatDate(debt.dueDate)}\n` : '') +
            `\nنرجو التكرم بالتسوية في أقرب وقت 🙏\n` +
            `📞 شفابدران: 0795629606\n📞 أبو نصير: 0790368603`;
        window.open(`https://wa.me/962${clean}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    return (
        <div className={`bg-slate-900 border rounded-2xl overflow-hidden shadow-lg transition-all
            ${status === 'paid' ? 'border-emerald-900/30 opacity-75' : isOverdue ? 'border-red-500/40 shadow-red-900/10' : 'border-slate-800'}`}>

            {/* شريط الحالة العلوي */}
            <div className={`h-1 w-full ${status === 'paid' ? 'bg-emerald-500' : status === 'partial' ? 'bg-orange-500' : 'bg-red-500'}`}
                 style={{ width: `${percent}%`, transition: 'width 0.5s' }}
            />

            <div className="p-5">
                {/* الرأس */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border
                            ${status === 'paid' ? 'bg-emerald-900/20 border-emerald-500/20 text-emerald-400' :
                              status === 'partial' ? 'bg-orange-900/20 border-orange-500/20 text-orange-400' :
                              'bg-red-900/20 border-red-500/20 text-red-400'}`}>
                            {debt.studentName?.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-100">{debt.studentName}</h4>
                                {debt.isArchived && (
                                    <span className="text-[9px] font-bold bg-orange-900/20 text-orange-400 px-1.5 py-0.5 rounded border border-orange-500/20">
                                        📦 مؤرشف
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500">{debt.reason}</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                            <span className={`inline-block w-1.5 h-1.5 rounded-full ${cfg.dot} mr-1`}></span>
                            {cfg.label}
                        </span>
                        {isOverdue && (
                            <span className="text-[10px] font-bold text-red-400 bg-red-900/20 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">
                                ⏰ متأخر
                            </span>
                        )}
                    </div>
                </div>

                {/* المبالغ */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-950 rounded-xl p-3 text-center border border-slate-800">
                        <p className="text-[10px] text-slate-500 font-bold mb-1">الكلي</p>
                        <p className="font-black text-slate-200 text-lg">{debt.totalAmount}</p>
                        <p className="text-[10px] text-slate-600">JD</p>
                    </div>
                    <div className="bg-emerald-950/20 rounded-xl p-3 text-center border border-emerald-900/20">
                        <p className="text-[10px] text-emerald-500/70 font-bold mb-1">مدفوع</p>
                        <p className="font-black text-emerald-400 text-lg">{debt.paidAmount || 0}</p>
                        <p className="text-[10px] text-emerald-600/50">JD</p>
                    </div>
                    <div className={`rounded-xl p-3 text-center border ${remaining > 0 ? 'bg-red-950/20 border-red-900/20' : 'bg-emerald-950/20 border-emerald-900/20'}`}>
                        <p className={`text-[10px] font-bold mb-1 ${remaining > 0 ? 'text-red-500/70' : 'text-emerald-500/70'}`}>متبقي</p>
                        <p className={`font-black text-lg ${remaining > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{remaining}</p>
                        <p className={`text-[10px] ${remaining > 0 ? 'text-red-600/50' : 'text-emerald-600/50'}`}>JD</p>
                    </div>
                </div>

                {/* شريط التقدم */}
                <div className="mb-4">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1.5">
                        <span>نسبة السداد</span>
                        <span className="font-bold text-slate-400">{percent}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-700
                                ${status === 'paid' ? 'bg-emerald-500' : status === 'partial' ? 'bg-gradient-to-r from-orange-500 to-emerald-500' : 'bg-red-600'}`}
                            style={{ width: `${percent}%` }}
                        />
                    </div>
                </div>

                {/* تاريخ الاستحقاق */}
                {debt.dueDate && (
                    <div className={`text-xs flex items-center gap-1.5 mb-4 ${isOverdue && status !== 'paid' ? 'text-red-400' : 'text-slate-500'}`}>
                        <Calendar size={12}/>
                        <span className="font-bold">تاريخ الاستحقاق: {formatDate(debt.dueDate)}</span>
                    </div>
                )}

                {/* الأزرار */}
                <div className="flex gap-2">
                    {status !== 'paid' && (
                        <>
                            <button onClick={() => onPay(debt)}
                                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/20">
                                <CheckCircle size={14}/> تسجيل دفعة
                            </button>
                            {debt.phone && (
                                <button onClick={openWhatsApp}
                                    className="p-2 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white rounded-xl transition-colors border border-[#25D366]/20"
                                    title="تذكير واتساب">
                                    <MessageCircle size={16}/>
                                </button>
                            )}
                        </>
                    )}
                    <button onClick={() => setExpanded(!expanded)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-colors border border-slate-700"
                        title="سجل الدفعات">
                        {expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    <button onClick={() => onPrint(debt)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition-colors border border-slate-700"
                        title="طباعة كشف الدين">
                        <Printer size={16}/>
                    </button>
                    <button onClick={() => onDelete(debt)}
                        className="p-2 bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-colors border border-red-500/20"
                        title="حذف الدين">
                        <Trash2 size={16}/>
                    </button>
                </div>

                {/* سجل الدفعات */}
                {expanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <p className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-1">
                            <CreditCard size={12}/> سجل الدفعات ({(debt.payments||[]).length})
                        </p>
                        {(debt.payments || []).length === 0 ? (
                            <p className="text-xs text-slate-600 text-center py-3">لا يوجد دفعات مسجلة بعد</p>
                        ) : (
                            <div className="space-y-2">
                                {[...(debt.payments || [])].reverse().map((p, i) => (
                                    <div key={i} className="flex items-center justify-between bg-slate-950 rounded-xl px-3 py-2 border border-slate-800">
                                        <div>
                                            <span className="text-emerald-400 font-bold text-sm">+{p.amount} JD</span>
                                            {p.note && <span className="text-xs text-slate-500 mr-2">— {p.note}</span>}
                                        </div>
                                        <span className="text-[10px] text-slate-600 font-mono">{formatDate(p.date)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        {debt.notes && (
                            <div className="mt-3 bg-slate-950 rounded-xl p-3 border border-slate-800">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">ملاحظات</p>
                                <p className="text-xs text-slate-400">{debt.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function DebtManager({ students, archivedStudents = [], selectedBranch, logActivity }) {
    const debtsCollection = useCollection('debts');
    const branchDebts     = useMemo(() =>
        debtsCollection.data.filter(d => d.branch === selectedBranch),
        [debtsCollection.data, selectedBranch]
    );

    const [showAddModal, setShowAddModal]     = useState(false);
    const [payingDebt, setPayingDebt]         = useState(null);
    const [statusFilter, setStatusFilter]     = useState('all');
    const [search, setSearch]                 = useState('');

    // ── إحصائيات ──────────────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const active = branchDebts.filter(d => getStatus(d.totalAmount, d.paidAmount) !== 'paid');
        const totalRemaining  = active.reduce((a, d) => a + (Number(d.totalAmount) - Number(d.paidAmount||0)), 0);
        const totalDebtors    = new Set(active.map(d => d.studentId)).size;
        const overdue         = active.filter(d => d.dueDate && new Date(d.dueDate) < new Date()).length;

        const thisMonth = new Date().toISOString().slice(0, 7);
        const paidThisMonth = branchDebts.reduce((acc, d) =>
            acc + (d.payments || [])
                .filter(p => (p.date || '').startsWith(thisMonth))
                .reduce((a, p) => a + Number(p.amount), 0),
            0
        );
        return { totalRemaining, totalDebtors, overdue, paidThisMonth };
    }, [branchDebts]);

    // ── فلترة ─────────────────────────────────────────────────────────────────
    const filtered = useMemo(() => {
        let result = [...branchDebts];
        if (search) result = result.filter(d => d.studentName?.includes(search) || d.reason?.includes(search));
        if (statusFilter !== 'all') result = result.filter(d => getStatus(d.totalAmount, d.paidAmount) === statusFilter);
        // الأحدث أولاً، المتأخرات أعلى
        return result.sort((a, b) => {
            const sa = getStatus(a.totalAmount, a.paidAmount);
            const sb = getStatus(b.totalAmount, b.paidAmount);
            if (sa === 'paid' && sb !== 'paid') return 1;
            if (sa !== 'paid' && sb === 'paid') return -1;
            const ao = a.dueDate && new Date(a.dueDate) < new Date() ? 1 : 0;
            const bo = b.dueDate && new Date(b.dueDate) < new Date() ? 1 : 0;
            if (ao !== bo) return bo - ao;
            return (b.createdAt || '').localeCompare(a.createdAt || '');
        });
    }, [branchDebts, search, statusFilter]);

    // ── حفظ دين جديد ──────────────────────────────────────────────────────────
    const handleAddDebt = async (data) => {
        await debtsCollection.add({ ...data, branch: selectedBranch });
        if (logActivity) logActivity('دين جديد', `تسجيل دين ${data.totalAmount} JD على ${data.studentName} — ${data.reason}`);
    };

    // ── تسجيل دفعة ────────────────────────────────────────────────────────────
    const handlePayment = async (debtId, updates) => {
        await debtsCollection.update(debtId, updates);
        const debt = branchDebts.find(d => d.id === debtId);
        if (logActivity && debt) logActivity('دفعة دين', `دفعة على دين ${debt.studentName} — ${debt.reason}`);
    };

    // ── حذف دين ───────────────────────────────────────────────────────────────
    const handleDelete = async (debt) => {
        if (!confirm(`حذف دين "${debt.reason}" للطالب ${debt.studentName}؟\nلا يمكن التراجع عن هذا الإجراء.`)) return;
        await debtsCollection.remove(debt.id);
        if (logActivity) logActivity('حذف دين', `حذف دين ${debt.studentName}`);
    };

    // ── طباعة كشف الدين ───────────────────────────────────────────────────────
    const handlePrint = (debt) => {
        const logoUrl   = window.location.origin + IMAGES.LOGO;
        const remaining = Number(debt.totalAmount) - Number(debt.paidAmount || 0);
        const status    = getStatus(debt.totalAmount, debt.paidAmount);
        const percent   = Math.round(((debt.paidAmount||0) / debt.totalAmount) * 100);

        let paymentsRows = '';
        if ((debt.payments || []).length > 0) {
            debt.payments.forEach((p, i) => {
                paymentsRows += `<tr>
                    <td style="border:1px solid #eee;padding:6px;text-align:center;font-size:12px;">${i+1}</td>
                    <td style="border:1px solid #eee;padding:6px;text-align:center;font-family:monospace;font-size:12px;">${formatDate(p.date)}</td>
                    <td style="border:1px solid #eee;padding:6px;text-align:center;font-weight:bold;color:#166534;font-size:13px;">+${p.amount} JD</td>
                    <td style="border:1px solid #eee;padding:6px;font-size:11px;color:#555;">${p.note || '-'}</td>
                </tr>`;
            });
        } else {
            paymentsRows = '<tr><td colspan="4" style="text-align:center;padding:15px;color:#666;">لا يوجد دفعات مسجلة</td></tr>';
        }

        const win = window.open('', 'DEBT_PRINT', 'height=800,width=900');
        win.document.write(`<!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>كشف دين — ${debt.studentName}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page { size: A4 portrait; margin: 15mm; }
            body { font-family: 'Cairo', sans-serif; margin: 0; background: #fff; color: #000;
                   -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .header { display:flex; justify-content:space-between; align-items:center;
                      border-bottom:3px solid #b45309; padding-bottom:12px; margin-bottom:20px; }
            .logo { height:65px; object-fit:contain; }
            .co h1 { margin:0; font-size:20px; color:#b45309; font-weight:900; }
            .co p  { margin:3px 0 0; font-size:12px; color:#555; font-weight:bold; }
            .card  { border:1px solid #e5e7eb; border-radius:8px; padding:20px; margin-bottom:20px; }
            .card-title { font-size:14px; font-weight:bold; color:#374151; margin-bottom:12px; border-bottom:1px solid #f3f4f6; padding-bottom:8px; }
            .grid3 { display:flex; gap:15px; margin-bottom:20px; }
            .stat  { flex:1; border:1px solid #e5e7eb; border-radius:8px; padding:12px; text-align:center; }
            .stat-title { font-size:11px; color:#555; margin-bottom:4px; font-weight:bold; }
            .stat-val   { font-size:20px; font-weight:900; }
            .progress-wrap { background:#f3f4f6; border-radius:20px; height:12px; margin:10px 0; overflow:hidden; }
            .progress-fill { background:${status==='paid'?'#10b981':status==='partial'?'#f97316':'#ef4444'};
                             height:100%; border-radius:20px; width:${percent}%; }
            table { width:100%; border-collapse:collapse; font-size:12px; margin-top:10px; }
            th { background:#f9fafb; border:1px solid #e5e7eb; padding:8px; font-weight:bold; text-align:center; }
            td { border:1px solid #e5e7eb; padding:6px; vertical-align:middle; }
            .footer { margin-top:30px; text-align:center; font-size:10px; color:#9ca3af; border-top:1px solid #e5e7eb; padding-top:12px; }
            .status-badge { display:inline-block; padding:3px 10px; border-radius:20px; font-weight:bold; font-size:12px;
                            background:${status==='paid'?'#d1fae5':status==='partial'?'#ffedd5':'#fee2e2'};
                            color:${status==='paid'?'#065f46':status==='partial'?'#9a3412':'#991b1b'}; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="co">
              <h1>أكاديمية الشجاع للتايكواندو</h1>
              <p>فرع: ${debt.branch} | كشف حساب دين</p>
            </div>
            <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
          </div>

          <div class="card">
            <div class="card-title">معلومات الدين</div>
            <table style="margin:0;">
              <tbody>
                <tr>
                  <td style="font-weight:bold;width:150px;background:#f9fafb;">الطالب</td>
                  <td>${debt.studentName}</td>
                  <td style="font-weight:bold;width:150px;background:#f9fafb;">تاريخ التسجيل</td>
                  <td>${formatDate(debt.createdAt)}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;background:#f9fafb;">سبب الدين</td>
                  <td>${debt.reason}</td>
                  <td style="font-weight:bold;background:#f9fafb;">تاريخ الاستحقاق</td>
                  <td>${debt.dueDate ? formatDate(debt.dueDate) : 'غير محدد'}</td>
                </tr>
                <tr>
                  <td style="font-weight:bold;background:#f9fafb;">الحالة</td>
                  <td colspan="3"><span class="status-badge">${STATUS_CONFIG[status].label}</span></td>
                </tr>
                ${debt.notes ? `<tr><td style="font-weight:bold;background:#f9fafb;">ملاحظات</td><td colspan="3">${debt.notes}</td></tr>` : ''}
              </tbody>
            </table>
          </div>

          <div class="grid3">
            <div class="stat">
              <div class="stat-title">المبلغ الكلي</div>
              <div class="stat-val" style="color:#000">${debt.totalAmount} JD</div>
            </div>
            <div class="stat">
              <div class="stat-title">المدفوع</div>
              <div class="stat-val" style="color:#065f46">${debt.paidAmount || 0} JD</div>
            </div>
            <div class="stat" style="border-color:${remaining>0?'#fca5a5':'#6ee7b7'}">
              <div class="stat-title">المتبقي</div>
              <div class="stat-val" style="color:${remaining>0?'#991b1b':'#065f46'}">${remaining} JD</div>
            </div>
          </div>

          <div class="progress-wrap"><div class="progress-fill"></div></div>
          <p style="text-align:center;font-size:12px;color:#555;margin-bottom:20px;">نسبة السداد: ${percent}%</p>

          <div class="card">
            <div class="card-title">سجل الدفعات</div>
            <table>
              <thead><tr>
                <th style="width:30px">#</th>
                <th>التاريخ</th>
                <th>المبلغ</th>
                <th>ملاحظة</th>
              </tr></thead>
              <tbody>${paymentsRows}</tbody>
            </table>
          </div>

          <div class="footer">
            تم استخراج هذا الكشف من نظام إدارة أكاديمية الشجاع للتايكواندو — ${new Date().toLocaleDateString('ar-JO')}
          </div>

          <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close();},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ── طباعة كشف شامل لكل الديون ────────────────────────────────────────────
    const handlePrintAll = () => {
        const logoUrl = window.location.origin + IMAGES.LOGO;
        let rows = '';
        filtered.forEach((d, i) => {
            const remaining = Number(d.totalAmount) - Number(d.paidAmount || 0);
            const status    = getStatus(d.totalAmount, d.paidAmount);
            const cfg       = STATUS_CONFIG[status];
            const colors    = { paid: '#dcfce7|#166534', partial: '#ffedd5|#9a3412', unpaid: '#fee2e2|#991b1b' };
            const [bg, col] = colors[status].split('|');
            rows += `<tr>
                <td style="border:1px solid #eee;padding:5px;text-align:center;">${i+1}</td>
                <td style="border:1px solid #eee;padding:5px;font-weight:bold;">${d.studentName}</td>
                <td style="border:1px solid #eee;padding:5px;">${d.reason}</td>
                <td style="border:1px solid #eee;padding:5px;text-align:center;font-weight:bold;">${d.totalAmount} JD</td>
                <td style="border:1px solid #eee;padding:5px;text-align:center;color:#166534;font-weight:bold;">${d.paidAmount||0} JD</td>
                <td style="border:1px solid #eee;padding:5px;text-align:center;font-weight:900;color:${remaining>0?'#991b1b':'#166534'};">${remaining} JD</td>
                <td style="border:1px solid #eee;padding:5px;text-align:center;direction:ltr;">${formatDate(d.dueDate)}</td>
                <td style="border:1px solid #eee;padding:5px;text-align:center;background:${bg};color:${col};font-weight:bold;">${cfg.label}</td>
            </tr>`;
        });

        const win = window.open('', 'ALL_DEBTS', 'height=800,width=1200');
        win.document.write(`<!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>كشف الذمم الشامل</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page { size: A4 landscape; margin: 10mm; }
            body { font-family:'Cairo',sans-serif; margin:0; background:#fff; color:#000;
                   -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .hdr { display:flex; justify-content:space-between; align-items:center;
                   border-bottom:3px solid #000; padding-bottom:10px; margin-bottom:15px; }
            .logo { height:55px; object-fit:contain; }
            .stats { display:flex; gap:10px; margin-bottom:15px; }
            .stat { flex:1; border:1px solid #e5e7eb; border-radius:6px; padding:8px; text-align:center; }
            .sv { font-size:18px; font-weight:900; }
            .st { font-size:10px; color:#555; font-weight:bold; margin-bottom:2px; }
            table { width:100%; border-collapse:collapse; font-size:12px; }
            th { background:#1e293b; color:#fff; border:1px solid #000; padding:7px; text-align:center; font-weight:bold; }
            @media print { body{-webkit-print-color-adjust:exact} th,td{border:1px solid #eee!important} }
          </style>
        </head>
        <body>
          <div class="hdr">
            <div>
              <h1 style="margin:0;font-size:18px;font-weight:900">كشف الذمم والأقساط الشامل — فرع ${selectedBranch}</h1>
              <p style="margin:4px 0 0;font-size:11px;color:#555;font-weight:bold">
                تاريخ الطباعة: ${new Date().toLocaleDateString('ar-JO')} | العدد: ${filtered.length}
              </p>
            </div>
            <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
          </div>
          <div class="stats">
            <div class="stat"><div class="st">إجمالي الديون النشطة</div><div class="sv" style="color:#991b1b">${stats.totalRemaining} JD</div></div>
            <div class="stat"><div class="st">عدد المدينين</div><div class="sv">${stats.totalDebtors}</div></div>
            <div class="stat"><div class="st">المتأخرون</div><div class="sv" style="color:#dc2626">${stats.overdue}</div></div>
            <div class="stat"><div class="st">محصّل هذا الشهر</div><div class="sv" style="color:#166534">${stats.paidThisMonth} JD</div></div>
          </div>
          <table>
            <thead><tr>
              <th style="width:25px">#</th>
              <th style="width:150px">الطالب</th>
              <th>سبب الدين</th>
              <th style="width:80px">الكلي</th>
              <th style="width:80px">المدفوع</th>
              <th style="width:80px">المتبقي</th>
              <th style="width:90px">الاستحقاق</th>
              <th style="width:100px">الحالة</th>
            </tr></thead>
            <tbody>${rows || '<tr><td colspan="8" style="text-align:center;padding:20px;color:#666;">لا يوجد ديون</td></tr>'}</tbody>
          </table>
          <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close();},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-fade-in font-sans pb-20 md:pb-0">

            {showAddModal && (
                <AddDebtModal
                    students={students}
                    archivedStudents={archivedStudents}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddDebt}
                />
            )}
            {payingDebt && (
                <PaymentModal
                    debt={payingDebt}
                    onClose={() => setPayingDebt(null)}
                    onSave={handlePayment}
                />
            )}

            {/* ── إحصائيات ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'إجمالي الديون المتبقية', value: `${stats.totalRemaining} JD`, icon: TrendingDown, color: 'text-red-400',    bg: 'bg-red-900/10',    border: 'border-red-900/20' },
                    { label: 'عدد المدينين',           value: stats.totalDebtors,           icon: User,          color: 'text-orange-400', bg: 'bg-orange-900/10', border: 'border-orange-900/20' },
                    { label: 'ديون متأخرة الاستحقاق', value: stats.overdue,                icon: AlertCircle,   color: 'text-red-500',    bg: 'bg-red-900/10',    border: 'border-red-900/20', blink: stats.overdue > 0 },
                    { label: 'محصّل هذا الشهر',       value: `${stats.paidThisMonth} JD`,  icon: TrendingUp,    color: 'text-emerald-400',bg: 'bg-emerald-900/10',border: 'border-emerald-900/20' },
                ].map((s, i) => (
                    <div key={i} className={`${s.bg} border ${s.border} rounded-2xl p-5 flex items-center gap-4 shadow-lg`}>
                        <div className={`p-3 rounded-xl bg-slate-900/50 ${s.color}`}>
                            <s.icon size={22} className={s.blink ? 'animate-pulse' : ''}/>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold leading-tight mb-1">{s.label}</p>
                            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── شريط الأدوات ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* بحث */}
                <div className="relative w-full md:w-72">
                    <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                    <input
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 pr-9 rounded-xl outline-none focus:border-red-500 placeholder-slate-600 text-sm"
                        placeholder="بحث باسم الطالب أو السبب..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* فلتر الحالة */}
                <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                    {[
                        { key: 'all',     label: 'الكل',            cls: 'bg-slate-700 text-white'         },
                        { key: 'unpaid',  label: '🔴 غير مدفوع',   cls: 'bg-red-600 text-white'            },
                        { key: 'partial', label: '🟠 جزئي',         cls: 'bg-orange-600 text-white'         },
                        { key: 'paid',    label: '🟢 مسدَّد',       cls: 'bg-emerald-600 text-white'        },
                    ].map(f => (
                        <button key={f.key}
                            onClick={() => setStatusFilter(f.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all
                                ${statusFilter === f.key ? f.cls : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* أزرار الإجراءات */}
                <div className="flex gap-2 shrink-0">
                    <button onClick={handlePrintAll}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors">
                        <Printer size={15}/> <span className="hidden sm:inline">كشف شامل</span>
                    </button>
                    <button onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-red-900/20">
                        <Plus size={15}/> تسجيل دين
                    </button>
                </div>
            </div>

            {/* ── قائمة الديون ── */}
            {debtsCollection.loading ? (
                <div className="text-center py-16 text-slate-500">
                    <div className="w-10 h-10 border-2 border-slate-700 border-t-red-500 rounded-full animate-spin mx-auto mb-3"/>
                    جاري التحميل...
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
                    <DollarSign size={48} className="mx-auto text-slate-700 mb-3 opacity-30"/>
                    <p className="text-slate-500 font-bold">
                        {search || statusFilter !== 'all' ? 'لا يوجد نتائج مطابقة' : 'لا يوجد ديون مسجّلة لهذا الفرع'}
                    </p>
                    {!search && statusFilter === 'all' && (
                        <button onClick={() => setShowAddModal(true)}
                            className="mt-4 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-sm transition-colors inline-flex items-center gap-2">
                            <Plus size={16}/> سجّل أول دين
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map(debt => (
                        <DebtCard
                            key={debt.id}
                            debt={debt}
                            onPay={setPayingDebt}
                            onDelete={handleDelete}
                            onPrint={handlePrint}
                        />
                    ))}
                </div>
            )}

            {/* عداد النتائج */}
            {filtered.length > 0 && (
                <p className="text-center text-xs text-slate-600 pb-4">
                    عرض {filtered.length} دين من أصل {branchDebts.length}
                </p>
            )}
        </div>
    );
}

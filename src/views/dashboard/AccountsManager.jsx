// src/views/dashboard/AccountsManager.jsx
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Wallet, TrendingUp, TrendingDown, Plus, Trash2,
    ChevronRight, ChevronLeft, Printer, X, Calendar,
    DollarSign, Receipt, FileText, AlertCircle
} from 'lucide-react';
import { useCollection } from '../../hooks/useCollection';
import { IMAGES } from '../../lib/constants';
import { toast } from '../../lib/toast';

// ─── helpers ─────────────────────────────────────────────────────────────────
const monthNames = [
    'يناير - 1','فبراير - 2','مارس - 3','أبريل - 4','مايو - 5','يونيو - 6',
    'يوليو - 7','أغسطس - 8','سبتمبر - 9','أكتوبر - 10','نوفمبر - 11','ديسمبر - 12'
];
const todayStr = () => new Date().toISOString().split('T')[0];

const toDateStr = (v) => {
    if (!v) return '';
    if (Array.isArray(v))      return v[0] || '';
    if (v?.toDate)             return v.toDate().toISOString().split('T')[0];
    if (typeof v === 'string') return v.split('T')[0];
    if (v instanceof Date)     return v.toISOString().split('T')[0];
    return String(v);
};

const fmtMoney = (n) => Number(n || 0).toLocaleString('en-US');
const fmtDate = (v) => {
    const s = toDateStr(v);
    if (!s) return '-';
    const d = new Date(s);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

// ─── مودال إضافة دخل/مصروف ─────────────────────────────────────────────────
const EntryModal = ({ type, monthKey, onClose, onSave }) => {
    const [title, setTitle]   = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate]     = useState(todayStr());
    const [note, setNote]     = useState('');
    const [method, setMethod] = useState('cash'); // ← طريقة الدفع
    const [saving, setSaving] = useState(false);

    const isIncome = type === 'income';
    // FIX: استخدام classes كاملة بدل ديناميكية حتى تعمل في build
    const cfg = isIncome
        ? {
            label: 'دخل إضافي', icon: TrendingUp,
            headerBg: 'bg-emerald-950/40', headerBorder: 'border-emerald-900/30', headerText: 'text-emerald-300',
            inputBg: 'bg-emerald-950/20', inputBorder: 'border-emerald-500/30', inputText: 'text-emerald-200', inputFocus: 'focus:border-emerald-500',
            labelText: 'text-emerald-400',
            btnBg: 'bg-emerald-600', btnHover: 'hover:bg-emerald-500',
        }
        : {
            label: 'مصروف', icon: TrendingDown,
            headerBg: 'bg-red-950/40', headerBorder: 'border-red-900/30', headerText: 'text-red-300',
            inputBg: 'bg-red-950/20', inputBorder: 'border-red-500/30', inputText: 'text-red-200', inputFocus: 'focus:border-red-500',
            labelText: 'text-red-400',
            btnBg: 'bg-red-600', btnHover: 'hover:bg-red-500',
        };
    const Icon = cfg.icon;

    const submit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return toast('أدخل البيان', 'error');
        const amt = Number(amount);
        if (!amt || amt <= 0) return toast('أدخل مبلغاً صحيحاً', 'error');
        setSaving(true);
        try {
            await onSave({ title: title.trim(), amount: amt, date, note: note.trim(), method });
            onClose();
        } finally { setSaving(false); }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className={`${cfg.headerBg} border-b ${cfg.headerBorder} px-6 py-4 flex justify-between items-center`}>
                    <h3 className={`font-black text-lg ${cfg.headerText} flex items-center gap-2`}>
                        <Icon size={20}/> تسجيل {cfg.label}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400"><X size={20}/></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-3">
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">البيان (السبب)</label>
                        <input autoFocus required
                            className={`w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none ${cfg.inputFocus} placeholder-slate-600 text-sm`}
                            placeholder={isIncome ? 'مثال: بطولة الأمل، فحص حزام...' : 'مثال: راتب الكابتن، فاتورة كهرباء...'}
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`text-xs font-bold ${cfg.labelText} block mb-1.5`}>المبلغ (JD)</label>
                            <input type="number" step="0.1" min="0" required
                                className={`w-full ${cfg.inputBg} border ${cfg.inputBorder} ${cfg.inputText} p-2.5 rounded-xl outline-none ${cfg.inputFocus} text-lg font-bold text-center`}
                                placeholder="0"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 block mb-1.5">التاريخ</label>
                            <input type="date" required
                                className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-slate-500 text-sm"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">طريقة الدفع</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button type="button" onClick={() => setMethod('cash')}
                                className={`py-2.5 rounded-xl text-xs font-bold border transition-all
                                    ${method === 'cash'
                                        ? 'bg-green-600 text-white border-green-500 shadow-md shadow-green-900/30'
                                        : 'bg-slate-950 text-slate-400 border-slate-700 hover:bg-slate-800'}`}>
                                💵 كاش (Cash)
                            </button>
                            <button type="button" onClick={() => setMethod('cliq')}
                                className={`py-2.5 rounded-xl text-xs font-bold border transition-all
                                    ${method === 'cliq'
                                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                                        : 'bg-slate-950 text-slate-400 border-slate-700 hover:bg-slate-800'}`}>
                                📱 كليك (CliQ)
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">ملاحظة (اختياري)</label>
                        <input
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-slate-500 placeholder-slate-600 text-sm"
                            placeholder="تفاصيل إضافية..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl text-sm font-bold transition-colors">
                            إلغاء
                        </button>
                        <button type="submit" disabled={saving}
                            className={`flex-[2] py-2.5 ${cfg.btnBg} ${cfg.btnHover} text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm shadow-lg`}>
                            {saving ? 'جاري الحفظ...' : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── سطر دخل أو مصروف ────────────────────────────────────────────────────────
const EntryRow = ({ entry, isIncome, onDelete, isAuto }) => {
    // FIX: classes كاملة بدل ديناميكية
    const bgClass     = isIncome ? 'bg-emerald-900/20' : 'bg-red-900/20';
    const borderClass = isIncome ? 'border-emerald-500/20' : 'border-red-500/20';
    const textClass   = isIncome ? 'text-emerald-400' : 'text-red-400';
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-800/40 group transition-colors">
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgClass} border ${borderClass} shrink-0`}>
                    {isAuto
                        ? <Receipt size={15} className={textClass}/>
                        : (isIncome ? <TrendingUp size={15} className={textClass}/> : <TrendingDown size={15} className={textClass}/>)}
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-slate-200 text-sm truncate">{entry.title}</p>
                        {isAuto && (
                            <span className="text-[9px] font-bold text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-500/20 shrink-0">
                                تلقائي
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span><Calendar size={9} className="inline ml-0.5"/> {fmtDate(entry.date)}</span>
                        {entry.method && (
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] border
                                ${entry.method === 'cliq'
                                    ? 'bg-blue-900/30 text-blue-400 border-blue-500/20'
                                    : 'bg-green-900/30 text-green-400 border-green-500/20'}`}>
                                {entry.method === 'cliq' ? '📱 كليك' : '💵 كاش'}
                            </span>
                        )}
                        {entry.note && <span>— {entry.note}</span>}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className={`font-black ${textClass} text-base`}>
                    {isIncome ? '+' : '−'}{fmtMoney(entry.amount)} <span className="text-[10px] text-slate-500 font-normal">JD</span>
                </span>
                {!isAuto && onDelete && (
                    <button onClick={() => onDelete(entry)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all">
                        <Trash2 size={13}/>
                    </button>
                )}
            </div>
        </div>
    );
};

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function AccountsManager({ selectedBranch, logActivity }) {

    // الوصولات والمصاريف (تلقائي + يدوي)
    const paymentsCol     = useCollection('payments');
    const expensesCol     = useCollection('expenses');
    const incomeExtraCol  = useCollection('income_extra');

    // الشهر المختار
    const today = new Date();
    const [year,  setYear]  = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());

    const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const isInMonth = (dateVal) => toDateStr(dateVal).startsWith(monthPrefix);

    // فلترة كل البيانات للفرع + الشهر
    const branchPayments = useMemo(() =>
        paymentsCol.data.filter(p => p.branch === selectedBranch && isInMonth(p.date)),
    [paymentsCol.data, selectedBranch, monthPrefix]);

    const branchExpenses = useMemo(() =>
        expensesCol.data.filter(e => e.branch === selectedBranch && isInMonth(e.date))
            .sort((a, b) => toDateStr(b.date).localeCompare(toDateStr(a.date))),
    [expensesCol.data, selectedBranch, monthPrefix]);

    const branchIncomeExtra = useMemo(() =>
        incomeExtraCol.data.filter(i => i.branch === selectedBranch && isInMonth(i.date))
            .sort((a, b) => toDateStr(b.date).localeCompare(toDateStr(a.date))),
    [incomeExtraCol.data, selectedBranch, monthPrefix]);

    // مجاميع — وصولات مقسمة كاش/كليك
    const cashPayments  = branchPayments.filter(p => !p.method || p.method === 'cash');
    const cliqPayments  = branchPayments.filter(p => p.method === 'cliq');
    const totalCash     = cashPayments.reduce((a, p) => a + Number(p.amount || 0), 0);
    const totalCliq     = cliqPayments.reduce((a, p) => a + Number(p.amount || 0), 0);
    const totalReceipts = totalCash + totalCliq;

    // المصاريف مقسمة كاش/كليك
    const cashExpenses     = branchExpenses.filter(e => !e.method || e.method === 'cash');
    const cliqExpenses     = branchExpenses.filter(e => e.method === 'cliq');
    const totalCashExp     = cashExpenses.reduce((a, e) => a + Number(e.amount || 0), 0);
    const totalCliqExp     = cliqExpenses.reduce((a, e) => a + Number(e.amount || 0), 0);

    const totalExtraIncome = branchIncomeExtra.reduce((a, p) => a + Number(p.amount || 0), 0);
    const totalIncome      = totalReceipts + totalExtraIncome;
    const totalExpenses    = branchExpenses.reduce((a, e) => a + Number(e.amount || 0), 0);
    const netResult        = totalIncome - totalExpenses;
    const isProfit         = netResult >= 0;

    // ـ مودال
    const [modalType, setModalType] = useState(null); // 'income' | 'expense' | null

    // ـ Navigation
    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    // ـ Save handlers
    const saveIncome = async (data) => {
        await incomeExtraCol.add({ ...data, branch: selectedBranch });
        if (logActivity) logActivity('دخل إضافي', `+${data.amount} JD — ${data.title}`);
    };
    const saveExpense = async (data) => {
        await expensesCol.add({ ...data, branch: selectedBranch, createdAt: new Date().toISOString() });
        if (logActivity) logActivity('مصروف', `-${data.amount} JD — ${data.title}`);
    };

    const deleteIncome = async (entry) => {
        if (!confirm(`حذف "${entry.title}" بمبلغ ${entry.amount} JD؟`)) return;
        await incomeExtraCol.remove(entry.id);
    };
    const deleteExpense = async (entry) => {
        if (!confirm(`حذف "${entry.title}" بمبلغ ${entry.amount} JD؟`)) return;
        await expensesCol.remove(entry.id);
    };

    // ─── طباعة الكشف الشهري ─────────────────────────────────────────────────
    const printReport = () => {
        const logoUrl = window.location.origin + IMAGES.LOGO;

        const incomeRows = [
            ...branchPayments.map(p => ({ ...p, _src: 'receipt', _label: p.name || '-' })),
            ...branchIncomeExtra.map(i => ({ ...i, _src: 'extra', _label: i.title })),
        ];
        const expenseRows = branchExpenses;

        let incomeHtml = '';
        // الوصولات مقسومة كاش/كليك
        let row = 1;
        if (totalCash > 0) {
            incomeHtml += `<tr>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;">${row++}</td>
                <td style="border:1px solid #e5e7eb;padding:8px;font-weight:bold;">وصولات كاش (${cashPayments.length} وصل)</td>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;font-size:10px;background:#f0fdf4;color:#166534;font-weight:bold;">💵 كاش — تلقائي</td>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;font-weight:900;color:#166534;">${fmtMoney(totalCash)} JD</td>
            </tr>`;
        }
        if (totalCliq > 0) {
            incomeHtml += `<tr>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;">${row++}</td>
                <td style="border:1px solid #e5e7eb;padding:8px;font-weight:bold;">وصولات كليك (${cliqPayments.length} وصل)</td>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;font-size:10px;background:#eff6ff;color:#1e40af;font-weight:bold;">📱 كليك — تلقائي</td>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;font-weight:900;color:#166534;">${fmtMoney(totalCliq)} JD</td>
            </tr>`;
        }
        branchIncomeExtra.forEach(e => {
            const m = e.method === 'cliq' ? '📱 كليك' : '💵 كاش';
            const mbg = e.method === 'cliq' ? '#eff6ff' : '#f0fdf4';
            incomeHtml += `<tr>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;">${row++}</td>
                <td style="border:1px solid #e5e7eb;padding:8px;font-weight:bold;">${e.title}</td>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;font-size:10px;background:${mbg};">${m} — ${fmtDate(e.date)}</td>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;font-weight:bold;color:#166534;">${fmtMoney(e.amount)} JD</td>
            </tr>`;
        });
        if (!incomeHtml) incomeHtml = `<tr><td colspan="4" style="text-align:center;padding:15px;color:#666;">لا يوجد دخل مسجل</td></tr>`;

        let expenseHtml = '';
        expenseRows.forEach((e, i) => {
            const m = e.method === 'cliq' ? '📱 كليك' : '💵 كاش';
            const mbg = e.method === 'cliq' ? '#eff6ff' : '#f0fdf4';
            expenseHtml += `<tr>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;">${i + 1}</td>
                <td style="border:1px solid #e5e7eb;padding:8px;font-weight:bold;">${e.title}</td>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;font-size:10px;background:${mbg};">${m} — ${fmtDate(e.date)}</td>
                <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;font-weight:bold;color:#991b1b;">${fmtMoney(e.amount)} JD</td>
            </tr>`;
        });
        if (!expenseHtml) expenseHtml = `<tr><td colspan="4" style="text-align:center;padding:15px;color:#666;">لا يوجد مصاريف مسجلة</td></tr>`;

        // ملخّص كاش/كليك للطباعة
        const summaryRowHtml = `
            <div style="display:flex;gap:10px;margin-top:15px;margin-bottom:5px">
                <div style="flex:1;border:1px solid #16a34a;border-radius:6px;padding:8px;text-align:center;background:#f0fdf4">
                    <div style="font-size:10px;font-weight:bold;color:#15803d">💵 إجمالي الكاش (دخل − مصروف)</div>
                    <div style="font-size:14px;font-weight:900;color:#166534">${fmtMoney(totalCash - totalCashExp)} JD</div>
                </div>
                <div style="flex:1;border:1px solid #2563eb;border-radius:6px;padding:8px;text-align:center;background:#eff6ff">
                    <div style="font-size:10px;font-weight:bold;color:#1e40af">📱 إجمالي الكليك (دخل − مصروف)</div>
                    <div style="font-size:14px;font-weight:900;color:#1e40af">${fmtMoney(totalCliq - totalCliqExp)} JD</div>
                </div>
            </div>`;

        const win = window.open('', 'ACC', 'height=900,width=900');
        win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>كشف حسابات ${monthNames[month]} ${year}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page{size:A4 portrait;margin:12mm}
            body{font-family:'Cairo',sans-serif;color:#000;background:#fff;-webkit-print-color-adjust:exact}
            .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #b45309;padding-bottom:12px;margin-bottom:20px}
            .logo{height:65px;object-fit:contain}
            .co h1{margin:0;font-size:20px;color:#b45309;font-weight:900}
            .co p{margin:4px 0 0;font-size:12px;color:#555;font-weight:bold}
            h2{font-size:14px;color:#000;border-bottom:2px solid #1e293b;padding-bottom:5px;margin:25px 0 10px}
            table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:15px}
            th{background:#1e293b;color:#fff;border:1px solid #000;padding:8px;text-align:center;font-weight:bold}
            .summary{margin-top:25px;border:2px solid #000;border-radius:8px;overflow:hidden}
            .summary-row{display:flex;justify-content:space-between;padding:10px 18px;border-bottom:1px solid #e5e7eb;font-weight:bold}
            .summary-row:last-child{border-bottom:0}
            .summary-final{background:${isProfit ? '#dcfce7' : '#fee2e2'};color:${isProfit ? '#166534' : '#991b1b'};font-size:16px;padding:14px 18px}
            .footer{margin-top:30px;text-align:center;font-size:10px;color:#666;border-top:1px solid #e5e7eb;padding-top:10px}
        </style></head>
        <body>
            <div class="hdr">
                <div class="co">
                    <h1>كشف الحسابات الشهري</h1>
                    <p>أكاديمية الشجاع للتايكواندو — فرع ${selectedBranch}</p>
                    <p>الفترة: ${monthNames[month]} ${year}</p>
                </div>
                <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
            </div>

            <h2 style="color:#166534">💰 الدخل</h2>
            <table>
                <thead><tr>
                    <th style="width:30px">#</th>
                    <th>البيان</th>
                    <th style="width:130px">المصدر / التاريخ</th>
                    <th style="width:120px">المبلغ</th>
                </tr></thead>
                <tbody>${incomeHtml}</tbody>
                <tfoot><tr>
                    <td colspan="3" style="border:2px solid #000;padding:10px;text-align:left;font-weight:900;background:#f0fdf4">إجمالي الدخل</td>
                    <td style="border:2px solid #000;padding:10px;text-align:center;font-weight:900;color:#166534;font-size:14px;background:#f0fdf4">${fmtMoney(totalIncome)} JD</td>
                </tr></tfoot>
            </table>

            <h2 style="color:#991b1b">💸 المصاريف</h2>
            <table>
                <thead><tr>
                    <th style="width:30px">#</th>
                    <th>البند</th>
                    <th style="width:130px">التاريخ</th>
                    <th style="width:120px">المبلغ</th>
                </tr></thead>
                <tbody>${expenseHtml}</tbody>
                <tfoot><tr>
                    <td colspan="3" style="border:2px solid #000;padding:10px;text-align:left;font-weight:900;background:#fef2f2">إجمالي المصاريف</td>
                    <td style="border:2px solid #000;padding:10px;text-align:center;font-weight:900;color:#991b1b;font-size:14px;background:#fef2f2">${fmtMoney(totalExpenses)} JD</td>
                </tr></tfoot>
            </table>

            ${summaryRowHtml}

            <div class="summary">
                <div class="summary-row" style="background:#f0fdf4;color:#166534">
                    <span>إجمالي الدخل</span><span>${fmtMoney(totalIncome)} JD</span>
                </div>
                <div class="summary-row" style="background:#fef2f2;color:#991b1b">
                    <span>إجمالي المصاريف</span><span>${fmtMoney(totalExpenses)} JD</span>
                </div>
                <div class="summary-row summary-final">
                    <span>${isProfit ? '✓ صافي الربح' : '✗ العجز'}</span>
                    <span>${isProfit ? '+' : '−'}${fmtMoney(Math.abs(netResult))} JD</span>
                </div>
            </div>

            <div style="display:flex;justify-content:space-between;margin-top:50px;padding:0 30px">
                <div style="text-align:center;width:160px">
                    <div style="border-top:1px solid #000;padding-top:5px;font-size:11px;font-weight:bold;color:#555">المحاسب</div>
                </div>
                <div style="text-align:center;width:160px">
                    <div style="border-top:1px solid #000;padding-top:5px;font-size:11px;font-weight:bold;color:#555">الإدارة</div>
                </div>
            </div>

            <div class="footer">
                تم استخراج هذا الكشف من نظام إدارة أكاديمية الشجاع — ${new Date().toLocaleDateString('en-GB')}
            </div>
            <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close()},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-5 animate-fade-in font-sans pb-20 md:pb-0">

            {/* مودال */}
            {modalType && (
                <EntryModal
                    type={modalType}
                    monthKey={monthPrefix}
                    onClose={() => setModalType(null)}
                    onSave={modalType === 'income' ? saveIncome : saveExpense}
                />
            )}

            {/* ── شريط اختيار الشهر ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-4 justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-yellow-500/10 rounded-xl border border-yellow-500/30">
                        <Wallet size={22} className="text-yellow-400"/>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-100">حسابات النادي</h2>
                        <p className="text-xs text-slate-500">فرع {selectedBranch}</p>
                    </div>
                </div>

                {/* Navigator */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                    <button onClick={prevMonth}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronRight size={16}/>
                    </button>
                    <div className="px-4 py-1 text-center min-w-[140px]">
                        <p className="text-xs text-slate-500 font-bold">{monthNames[month]}</p>
                        <p className="text-lg font-black text-yellow-400">{year}</p>
                    </div>
                    <button onClick={nextMonth}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft size={16}/>
                    </button>
                </div>

                <button onClick={printReport}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors">
                    <Printer size={15}/> طباعة الكشف
                </button>
            </div>

            {/* ── ملخّص علوي ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-emerald-400"/>
                        <p className="text-xs text-emerald-500/70 font-bold">إجمالي الدخل</p>
                    </div>
                    <p className="text-2xl font-black text-emerald-400">{fmtMoney(totalIncome)} <span className="text-xs font-normal text-emerald-600">JD</span></p>
                    <p className="text-[10px] text-slate-600 mt-1">{branchPayments.length} وصل + {branchIncomeExtra.length} يدوي</p>
                </div>
                <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown size={16} className="text-red-400"/>
                        <p className="text-xs text-red-500/70 font-bold">إجمالي المصاريف</p>
                    </div>
                    <p className="text-2xl font-black text-red-400">{fmtMoney(totalExpenses)} <span className="text-xs font-normal text-red-600">JD</span></p>
                    <p className="text-[10px] text-slate-600 mt-1">{branchExpenses.length} مصروف</p>
                </div>
                <div className={`rounded-2xl p-5 border md:col-span-2
                    ${isProfit ? 'bg-emerald-900/15 border-emerald-500/40' : 'bg-red-900/15 border-red-500/40'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        {isProfit
                            ? <DollarSign size={16} className="text-emerald-400"/>
                            : <AlertCircle size={16} className="text-red-400"/>}
                        <p className={`text-xs font-bold ${isProfit ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                            {isProfit ? '✓ صافي الربح' : '✗ العجز'}
                        </p>
                    </div>
                    <p className={`text-3xl font-black ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isProfit ? '+' : '−'}{fmtMoney(Math.abs(netResult))} <span className="text-sm font-normal text-slate-500">JD</span>
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1">
                        {monthNames[month]} {year}
                    </p>
                </div>
            </div>

            {/* ── العمودين: دخل ومصاريف ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* الدخل */}
                <div className="bg-slate-900 border border-emerald-900/30 rounded-2xl overflow-hidden shadow-lg">
                    <div className="bg-emerald-950/30 border-b border-emerald-900/30 px-5 py-4 flex items-center justify-between">
                        <h3 className="font-black text-base text-emerald-300 flex items-center gap-2">
                            <TrendingUp size={18}/> الدخل
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                                {branchPayments.length + branchIncomeExtra.length}
                            </span>
                        </h3>
                        <button onClick={() => setModalType('income')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-900/30">
                            <Plus size={13}/> دخل إضافي
                        </button>
                    </div>

                    {/* صف ملخّص الوصولات — مقسّم كاش/كليك */}
                    {totalReceipts > 0 && (
                        <div className="bg-blue-950/15 border-b border-slate-800/50">
                            {/* كاش */}
                            <div className="px-4 py-2.5 flex items-center justify-between gap-3 border-b border-slate-800/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-900/30 border border-green-500/30 flex items-center justify-center">
                                        <Receipt size={13} className="text-green-400"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">وصولات كاش</p>
                                        <p className="text-[10px] text-green-400/80">تلقائي • {cashPayments.length} وصل</p>
                                    </div>
                                </div>
                                <span className="font-black text-emerald-400 text-sm">
                                    +{fmtMoney(totalCash)} <span className="text-[10px] text-slate-500 font-normal">JD</span>
                                </span>
                            </div>
                            {/* كليك */}
                            <div className="px-4 py-2.5 flex items-center justify-between gap-3 border-b border-slate-800/30">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-900/30 border border-blue-500/30 flex items-center justify-center">
                                        <Receipt size={13} className="text-blue-400"/>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">وصولات كليك (CliQ)</p>
                                        <p className="text-[10px] text-blue-400/80">تلقائي • {cliqPayments.length} وصل</p>
                                    </div>
                                </div>
                                <span className="font-black text-emerald-400 text-sm">
                                    +{fmtMoney(totalCliq)} <span className="text-[10px] text-slate-500 font-normal">JD</span>
                                </span>
                            </div>
                            {/* المجموع */}
                            <div className="px-4 py-2 flex items-center justify-between gap-3 bg-emerald-950/30">
                                <span className="text-xs font-black text-emerald-300">مجموع الوصولات</span>
                                <span className="font-black text-emerald-400 text-sm">
                                    {fmtMoney(totalReceipts)} <span className="text-[10px] text-slate-500 font-normal">JD</span>
                                </span>
                            </div>
                        </div>
                    )}

                    {/* الدخل الإضافي اليدوي */}
                    {branchIncomeExtra.length > 0 ? (
                        <div className="divide-y divide-slate-800/50">
                            {branchIncomeExtra.map(e => (
                                <EntryRow key={e.id} entry={e} isIncome={true}
                                    onDelete={deleteIncome} isAuto={false}/>
                            ))}
                        </div>
                    ) : (
                        branchPayments.length === 0 && (
                            <div className="text-center py-10 text-slate-600">
                                <TrendingUp size={32} className="mx-auto mb-2 opacity-30"/>
                                <p className="text-sm font-bold">لا يوجد دخل في هذا الشهر</p>
                                <p className="text-xs mt-1">اضغط "دخل إضافي" لإضافة دخل يدوي</p>
                            </div>
                        )
                    )}
                </div>

                {/* المصاريف */}
                <div className="bg-slate-900 border border-red-900/30 rounded-2xl overflow-hidden shadow-lg">
                    <div className="bg-red-950/30 border-b border-red-900/30 px-5 py-4 flex items-center justify-between">
                        <h3 className="font-black text-base text-red-300 flex items-center gap-2">
                            <TrendingDown size={18}/> المصاريف
                            <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">
                                {branchExpenses.length}
                            </span>
                        </h3>
                        <button onClick={() => setModalType('expense')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold shadow-md shadow-red-900/30">
                            <Plus size={13}/> إضافة مصروف
                        </button>
                    </div>

                    {branchExpenses.length > 0 ? (
                        <>
                            {/* ملخّص كاش/كليك للمصاريف */}
                            <div className="bg-red-950/15 border-b border-slate-800/50">
                                <div className="px-4 py-2 grid grid-cols-3 gap-2 text-center">
                                    <div>
                                        <p className="text-[10px] text-green-400/70 font-bold">كاش</p>
                                        <p className="text-sm font-black text-red-400">−{fmtMoney(totalCashExp)}</p>
                                    </div>
                                    <div className="border-x border-slate-800">
                                        <p className="text-[10px] text-blue-400/70 font-bold">كليك</p>
                                        <p className="text-sm font-black text-red-400">−{fmtMoney(totalCliqExp)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold">المجموع</p>
                                        <p className="text-sm font-black text-red-400">−{fmtMoney(totalExpenses)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="divide-y divide-slate-800/50">
                                {branchExpenses.map(e => (
                                    <EntryRow key={e.id} entry={e} isIncome={false}
                                        onDelete={deleteExpense} isAuto={false}/>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 text-slate-600">
                            <TrendingDown size={32} className="mx-auto mb-2 opacity-30"/>
                            <p className="text-sm font-bold">لا يوجد مصاريف في هذا الشهر</p>
                            <p className="text-xs mt-1">اضغط "إضافة مصروف" للبدء</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

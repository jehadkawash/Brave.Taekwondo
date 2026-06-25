// src/views/dashboard/ReportsManager.jsx
import React, { useState, useMemo } from 'react';
import {
    Printer, Calendar, DollarSign, Users,
    TrendingUp, TrendingDown, CheckCircle, XCircle,
    AlertCircle, BarChart3, FileText, ChevronLeft, ChevronRight,
    Download
} from 'lucide-react';
import { IMAGES } from '../../lib/constants';
import * as XLSX from 'xlsx';

// ─── مساعدات ────────────────────────────────────────────────────────────────
const toDateStr = (v) => {
    if (!v) return '';
    if (Array.isArray(v))       return v[0] || '';
    if (v?.toDate)              return v.toDate().toISOString().split('T')[0];
    if (typeof v === 'string')  return v.split('T')[0];
    if (v instanceof Date)      return v.toISOString().split('T')[0];
    return String(v);
};

const fmt = (v) => {
    const s = toDateStr(v);
    if (!s) return '-';
    const d = new Date(s);
    if (isNaN(d.getTime())) return '-';
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

const calcStatus = (subEnd) => {
    if (!subEnd) return 'expired';
    const today = new Date(); today.setHours(0,0,0,0);
    const end   = new Date(subEnd); end.setHours(0,0,0,0);
    const diff  = Math.ceil((end - today) / 86400000);
    if (diff < 0)  return 'expired';
    if (diff <= 7) return 'near_end';
    return 'active';
};

const logoUrl = () => window.location.origin + IMAGES.LOGO;

// ─── StatBox مصغر ────────────────────────────────────────────────────────────
const Box = ({ label, value, color = 'text-slate-100', bg = 'bg-slate-800', border = 'border-slate-700' }) => (
    <div className={`${bg} border ${border} rounded-2xl p-5 flex flex-col gap-1`}>
        <p className="text-xs text-slate-500 font-bold">{label}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
);

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function ReportsManager({ students = [], payments = [], expenses = [], selectedBranch }) {

    // ── فترة التقرير ──────────────────────────────────────────────────────────
    const today     = new Date();
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstOfMonth);
    const [endDate,   setEndDate]   = useState(today.toISOString().split('T')[0]);
    const [tab,       setTab]       = useState('finance'); // 'finance' | 'students'

    const inRange = (v) => {
        const s = toDateStr(v);
        return s && s >= startDate && s <= endDate;
    };

    // ── أرقام مالية ────────────────────────────────────────────────────────────
    const { income, outgo, totalIn, totalOut, net } = useMemo(() => {
        const income = payments.filter(p => inRange(p.date));
        const outgo  = expenses.filter(e => inRange(e.date));
        const totalIn  = income.reduce((a, p) => a + Number(p.amount || 0), 0);
        const totalOut = outgo.reduce((a, e)  => a + Number(e.amount || 0), 0);
        return { income, outgo, totalIn, totalOut, net: totalIn - totalOut };
    }, [payments, expenses, startDate, endDate]);

    // ── أرقام الطلاب ─────────────────────────────────────────────────────────
    const { active, nearEnd, expired, withDebt } = useMemo(() => {
        const active  = students.filter(s => calcStatus(s.subEnd) === 'active').length;
        const nearEnd = students.filter(s => calcStatus(s.subEnd) === 'near_end').length;
        const expired = students.filter(s => calcStatus(s.subEnd) === 'expired').length;
        const withDebt = students.filter(s => Number(s.balance || 0) > 0).length;
        return { active, nearEnd, expired, withDebt };
    }, [students]);

    // ── دخل هذا الشهر لكل طالب ────────────────────────────────────────────────
    const studentRows = useMemo(() => {
        return students.map(s => {
            const sPayments   = payments.filter(p => p.studentId === s.id && inRange(p.date));
            const totalPaid   = sPayments.reduce((a, p) => a + Number(p.amount || 0), 0);
            const lastPayDate = [...payments.filter(p => p.studentId === s.id)]
                .sort((a,b) => toDateStr(b.date).localeCompare(toDateStr(a.date)))[0]?.date || '';
            const attInRange  = s.attendance
                ? Object.keys(s.attendance).filter(k => toDateStr(k) >= startDate && toDateStr(k) <= endDate).length
                : 0;
            return { ...s, totalPaid, lastPayDate, attInRange };
        }).sort((a, b) => b.totalPaid - a.totalPaid);
    }, [students, payments, startDate, endDate]);

    // ── اختصار الفترة ─────────────────────────────────────────────────────────
    const prevMonth = () => {
        const d = new Date(startDate);
        d.setMonth(d.getMonth() - 1);
        const first = new Date(d.getFullYear(), d.getMonth(), 1);
        const last  = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        setStartDate(first.toISOString().split('T')[0]);
        setEndDate(last.toISOString().split('T')[0]);
    };
    const nextMonth = () => {
        const d = new Date(startDate);
        d.setMonth(d.getMonth() + 1);
        const first = new Date(d.getFullYear(), d.getMonth(), 1);
        const last  = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        setStartDate(first.toISOString().split('T')[0]);
        setEndDate(last.toISOString().split('T')[0]);
    };

    // ── طباعة التقرير المالي ──────────────────────────────────────────────────
    const printFinance = () => {
        let rows = income.map((p, i) => `
            <tr>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;">${i+1}</td>
                <td style="border:1px solid #e5e7eb;padding:5px;font-weight:bold;">${p.name || '-'}</td>
                <td style="border:1px solid #e5e7eb;padding:5px;">${p.reason || '-'}</td>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;font-family:monospace;">${fmt(p.date)}</td>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;">${p.method === 'cliq' ? 'كليك' : 'كاش'}</td>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;font-weight:bold;color:#166534;">${p.amount} JD</td>
            </tr>`).join('');

        const win = window.open('', 'RPT', 'height=800,width=1100');
        win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>التقرير المالي</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page{size:A4 portrait;margin:12mm}
            body{font-family:'Cairo',sans-serif;color:#000;background:#fff;-webkit-print-color-adjust:exact}
            .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #000;padding-bottom:12px;margin-bottom:20px}
            .logo{height:60px;object-fit:contain}
            .stats{display:flex;gap:12px;margin-bottom:20px}
            .stat{flex:1;border:1px solid #e5e7eb;border-radius:8px;padding:12px;text-align:center}
            .st{font-size:11px;font-weight:bold;color:#555;margin-bottom:4px}
            .sv{font-size:20px;font-weight:900}
            table{width:100%;border-collapse:collapse;font-size:12px}
            th{background:#1e293b;color:#fff;border:1px solid #000;padding:8px;text-align:center;font-weight:bold}
            @media print{body{-webkit-print-color-adjust:exact}}
        </style></head>
        <body>
        <div class="hdr">
            <div>
                <h1 style="margin:0;font-size:20px;font-weight:900">التقرير المالي — فرع ${selectedBranch}</h1>
                <p style="margin:4px 0 0;font-size:12px;color:#555;font-weight:bold">الفترة: من ${fmt(startDate)} إلى ${fmt(endDate)}</p>
            </div>
            <img src="${logoUrl()}" class="logo" onerror="this.style.display='none'"/>
        </div>
        <div class="stats">
            <div class="stat"><div class="st">إجمالي الإيرادات</div><div class="sv" style="color:#166534">${totalIn} JD</div></div>
            <div class="stat"><div class="st">إجمالي المصاريف</div><div class="sv" style="color:#991b1b">${totalOut} JD</div></div>
            <div class="stat" style="border:2px solid #000"><div class="st">صافي الأرباح</div><div class="sv">${net} JD</div></div>
            <div class="stat"><div class="st">عدد الوصولات</div><div class="sv">${income.length}</div></div>
        </div>
        <table>
            <thead><tr>
                <th style="width:25px">#</th><th style="width:160px">الاسم</th>
                <th>البيان</th><th style="width:90px">التاريخ</th>
                <th style="width:70px">الطريقة</th><th style="width:80px">المبلغ</th>
            </tr></thead>
            <tbody>${rows || '<tr><td colspan="6" style="text-align:center;padding:20px;color:#666">لا يوجد وصولات في هذه الفترة</td></tr>'}</tbody>
        </table>
        <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close();},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ── طباعة تقرير الطلاب ───────────────────────────────────────────────────
    const printStudents = () => {
        let rows = studentRows.map((s, i) => {
            const st = calcStatus(s.subEnd);
            const [sbg, scol] = st === 'active'
                ? ['#dcfce7','#166534'] : st === 'near_end'
                ? ['#fef08a','#854d0e'] : ['#fee2e2','#991b1b'];
            return `<tr>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;">${i+1}</td>
                <td style="border:1px solid #e5e7eb;padding:5px;font-weight:bold;">${s.name}</td>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;">${s.belt||'-'}</td>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;background:${sbg};color:${scol};font-weight:bold;">
                    ${st === 'active' ? 'نشط' : st === 'near_end' ? 'قرب الانتهاء' : 'منتهي'}
                </td>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;">${s.attInRange} يوم</td>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;font-weight:bold;color:#166534;">${s.totalPaid} JD</td>
                <td style="border:1px solid #e5e7eb;padding:5px;text-align:center;font-family:monospace;">${fmt(s.lastPayDate)}</td>
            </tr>`;
        }).join('');

        const win = window.open('', 'RPT2', 'height=800,width=1200');
        win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>تقرير الطلاب</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page{size:A4 landscape;margin:10mm}
            body{font-family:'Cairo',sans-serif;color:#000;background:#fff;-webkit-print-color-adjust:exact}
            .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #000;padding-bottom:10px;margin-bottom:15px}
            .logo{height:55px;object-fit:contain}
            table{width:100%;border-collapse:collapse;font-size:12px}
            th{background:#1e293b;color:#fff;border:1px solid #000;padding:7px;text-align:center;font-weight:bold}
            @media print{body{-webkit-print-color-adjust:exact}}
        </style></head>
        <body>
        <div class="hdr">
            <div>
                <h1 style="margin:0;font-size:18px;font-weight:900">تقرير الطلاب — فرع ${selectedBranch}</h1>
                <p style="margin:4px 0 0;font-size:11px;color:#555;font-weight:bold">
                    الفترة: ${fmt(startDate)} → ${fmt(endDate)} | العدد: ${students.length}
                </p>
            </div>
            <img src="${logoUrl()}" class="logo" onerror="this.style.display='none'"/>
        </div>
        <table>
            <thead><tr>
                <th style="width:25px">#</th><th style="width:180px">الطالب</th>
                <th style="width:80px">الحزام</th><th style="width:90px">حالة الاشتراك</th>
                <th style="width:70px">الحضور</th><th style="width:80px">مدفوع</th>
                <th style="width:90px">آخر دفعة</th>
            </tr></thead>
            <tbody>${rows || '<tr><td colspan="7" style="text-align:center;padding:20px;color:#666">لا يوجد طلاب</td></tr>'}</tbody>
        </table>
        <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close();},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ── تصدير الوصولات لملف Excel ─────────────────────────────────────────────
    const exportFinanceExcel = () => {
        const rows = income.map((p, i) => ({
            '#': i + 1,
            'الاسم': p.name || '-',
            'البيان': p.reason || '-',
            'التاريخ': fmt(p.date),
            'الطريقة': p.method === 'cliq' ? 'كليك' : 'كاش',
            'المبلغ (JD)': Number(p.amount || 0),
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'الوصولات');
        XLSX.writeFile(wb, `التقرير_المالي_${selectedBranch}_${startDate}_${endDate}.xlsx`);
    };

    // ── تصدير تقرير الطلاب لملف Excel ─────────────────────────────────────────
    const exportStudentsExcel = () => {
        const rows = studentRows.map((s, i) => {
            const st = calcStatus(s.subEnd);
            return {
                '#': i + 1,
                'الطالب': s.name,
                'الحزام': s.belt || '-',
                'حالة الاشتراك': st === 'active' ? 'نشط' : st === 'near_end' ? 'قرب الانتهاء' : 'منتهي',
                'الحضور': s.attInRange,
                'مدفوع (JD)': s.totalPaid,
                'آخر دفعة': fmt(s.lastPayDate),
            };
        });
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'الطلاب');
        XLSX.writeFile(wb, `تقرير_الطلاب_${selectedBranch}_${startDate}_${endDate}.xlsx`);
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 animate-fade-in font-sans pb-20 md:pb-0">

            {/* ── شريط اختيار الفترة ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center gap-4 justify-between">
                <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                    <FileText size={20} className="text-yellow-500"/> التقارير الشاملة
                </h2>

                <div className="flex items-center gap-3 bg-slate-950 border border-slate-800 rounded-xl p-2">
                    <button onClick={prevMonth} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronRight size={16}/>
                    </button>
                    <div className="flex items-center gap-2">
                        <input type="date" value={startDate} max={endDate}
                            onChange={e => setStartDate(e.target.value)}
                            className="bg-transparent text-slate-300 text-sm font-bold outline-none w-32"/>
                        <span className="text-slate-600">←</span>
                        <input type="date" value={endDate} min={startDate} max={today.toISOString().split('T')[0]}
                            onChange={e => setEndDate(e.target.value)}
                            className="bg-transparent text-slate-300 text-sm font-bold outline-none w-32"/>
                    </div>
                    <button onClick={nextMonth} className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft size={16}/>
                    </button>
                </div>

                {/* تبويبات */}
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                    {[
                        { key: 'finance',  label: 'مالي',    icon: DollarSign },
                        { key: 'students', label: 'طلاب',    icon: Users      },
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold transition-colors
                                ${tab === t.key ? 'bg-yellow-500 text-slate-900' : 'text-slate-400 hover:bg-slate-800'}`}>
                            <t.icon size={14}/> {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── التقرير المالي ── */}
            {tab === 'finance' && (
                <div className="space-y-6">
                    {/* إحصائيات */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Box label="إجمالي الإيرادات"  value={`${totalIn} JD`}   color="text-emerald-400" bg="bg-emerald-900/10"  border="border-emerald-900/30"/>
                        <Box label="إجمالي المصاريف"   value={`${totalOut} JD`}  color="text-red-400"     bg="bg-red-900/10"      border="border-red-900/30"/>
                        <Box label="صافي الأرباح"       value={`${net} JD`}       color={net >= 0 ? "text-emerald-400" : "text-red-400"}/>
                        <Box label="عدد الوصولات"       value={income.length}     color="text-blue-400"    bg="bg-blue-900/10"     border="border-blue-900/30"/>
                    </div>

                    {/* جدول الوصولات */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                            <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                <TrendingUp size={18} className="text-emerald-500"/> الوصولات ({income.length})
                            </h3>
                            <div className="flex items-center gap-2">
                                <button onClick={exportFinanceExcel}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors">
                                    <Download size={14}/> تصدير Excel
                                </button>
                                <button onClick={printFinance}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors">
                                    <Printer size={14}/> طباعة التقرير
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-slate-950 text-slate-400">
                                    <tr>
                                        <th className="p-3 font-bold">#</th>
                                        <th className="p-3 font-bold">الاسم</th>
                                        <th className="p-3 font-bold">البيان</th>
                                        <th className="p-3 font-bold">طريقة الدفع</th>
                                        <th className="p-3 font-bold">التاريخ</th>
                                        <th className="p-3 font-bold">المبلغ</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {income.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center p-10 text-slate-600">لا يوجد وصولات في هذه الفترة</td></tr>
                                    ) : income.map((p, i) => (
                                        <tr key={p.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="p-3 text-slate-600 font-mono text-xs">{i+1}</td>
                                            <td className="p-3 font-bold text-slate-200">{p.name}</td>
                                            <td className="p-3 text-slate-400 text-xs">{p.reason}</td>
                                            <td className="p-3">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${p.method === 'cliq' ? 'bg-blue-900/20 text-blue-400 border-blue-500/20' : 'bg-green-900/20 text-green-400 border-green-500/20'}`}>
                                                    {p.method === 'cliq' ? 'كليك' : 'كاش'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-slate-500 font-mono text-xs">{fmt(p.date)}</td>
                                            <td className="p-3 font-bold text-emerald-400">+{p.amount} JD</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* جدول المصاريف */}
                    {outgo.length > 0 && (
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                                <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                    <TrendingDown size={18} className="text-red-500"/> المصاريف ({outgo.length})
                                </h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-right">
                                    <thead className="bg-slate-950 text-slate-400">
                                        <tr>
                                            <th className="p-3 font-bold">البند</th>
                                            <th className="p-3 font-bold">التاريخ</th>
                                            <th className="p-3 font-bold">المبلغ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {outgo.map(e => (
                                            <tr key={e.id} className="hover:bg-slate-800/50">
                                                <td className="p-3 font-bold text-slate-300">{e.title}</td>
                                                <td className="p-3 text-slate-500 font-mono text-xs">{fmt(e.date)}</td>
                                                <td className="p-3 font-bold text-red-400">-{e.amount} JD</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── تقرير الطلاب ── */}
            {tab === 'students' && (
                <div className="space-y-6">
                    {/* إحصائيات الطلاب */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Box label="إجمالي الطلاب"         value={students.length} color="text-blue-400"    bg="bg-blue-900/10"    border="border-blue-900/30"/>
                        <Box label="اشتراك نشط"             value={active}          color="text-emerald-400" bg="bg-emerald-900/10" border="border-emerald-900/30"/>
                        <Box label="قرب الانتهاء"           value={nearEnd}         color="text-orange-400"  bg="bg-orange-900/10" border="border-orange-900/30"/>
                        <Box label="انتهى اشتراكهم"         value={expired}         color="text-red-400"     bg="bg-red-900/10"    border="border-red-900/30"/>
                    </div>

                    {/* جدول الطلاب */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                            <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                <Users size={18} className="text-blue-500"/> سجل الطلاب ({students.length})
                            </h3>
                            <div className="flex items-center gap-2">
                                <button onClick={exportStudentsExcel}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-colors">
                                    <Download size={14}/> تصدير Excel
                                </button>
                                <button onClick={printStudents}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors">
                                    <Printer size={14}/> طباعة التقرير
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-slate-950 text-slate-400">
                                    <tr>
                                        <th className="p-3 font-bold">الطالب</th>
                                        <th className="p-3 font-bold">الحزام</th>
                                        <th className="p-3 font-bold">حالة الاشتراك</th>
                                        <th className="p-3 font-bold text-center">الحضور (الفترة)</th>
                                        <th className="p-3 font-bold text-center">مدفوع (الفترة)</th>
                                        <th className="p-3 font-bold">آخر دفعة</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {students.length === 0 ? (
                                        <tr><td colSpan="6" className="text-center p-10 text-slate-600">لا يوجد طلاب</td></tr>
                                    ) : studentRows.map(s => {
                                        const st = calcStatus(s.subEnd);
                                        return (
                                            <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="p-3 font-bold text-slate-200">{s.name}</td>
                                                <td className="p-3 text-xs">
                                                    <span className="bg-slate-800 border border-slate-700 text-slate-300 px-2 py-0.5 rounded font-bold">{s.belt}</span>
                                                </td>
                                                <td className="p-3">
                                                    <span className={`text-xs font-bold px-2 py-1 rounded border
                                                        ${st === 'active'   ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20' :
                                                          st === 'near_end' ? 'bg-orange-900/20 text-orange-400 border-orange-500/20'  :
                                                          'bg-red-900/20 text-red-400 border-red-500/20'}`}>
                                                        {st === 'active' ? '✅ نشط' : st === 'near_end' ? '⚠️ قرب الانتهاء' : '🔴 منتهي'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-center font-bold text-blue-400">{s.attInRange} يوم</td>
                                                <td className="p-3 text-center font-bold text-emerald-400">{s.totalPaid} JD</td>
                                                <td className="p-3 text-slate-500 font-mono text-xs">{fmt(s.lastPayDate)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// src/views/dashboard/StudentProfile.jsx
import React, { useState, useMemo, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import {
    X, User, Phone, MapPin, Calendar, Award, Scale, DollarSign,
    AlertTriangle, MessageCircle, Lock, Bell, Users, CheckCircle,
    Printer, Edit3, Plus, Clock, TrendingUp, TrendingDown, Minus,
    Send, Trash2, RefreshCw, ChevronLeft, ChevronRight,
    FileText, ArrowUp, CalendarClock, CreditCard, Receipt, Archive
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useCollection } from '../../hooks/useCollection';
import { BELTS, IMAGES } from '../../lib/constants';
import { toast } from '../../lib/toast';
import NotesManager from './NotesManager';
import AttendanceHistory from '../../components/AttendanceHistory';

// ─── helpers ─────────────────────────────────────────────────────────────────
const fmtDate = (v) => {
    if (!v) return '-';
    const d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};
const fmtTime = (v) => {
    if (!v) return '';
    const d = new Date(v);
    return d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:true });
};
const todayStr = () => new Date().toISOString().split('T')[0];
const calcStatus = (subEnd) => {
    if (!subEnd) return 'expired';
    const t = new Date(); t.setHours(0,0,0,0);
    const e = new Date(subEnd); e.setHours(0,0,0,0);
    const d = Math.ceil((e - t) / 86400000);
    if (d < 0)  return 'expired';
    if (d <= 7) return 'near_end';
    return 'active';
};
const openWhatsApp = (phone, msg = '') => {
    if (!phone) return;
    let c = phone.replace(/\D/g,'');
    if (c.startsWith('0')) c = c.substring(1);
    const url = msg
        ? `https://wa.me/962${c}?text=${encodeURIComponent(msg)}`
        : `https://wa.me/962${c}`;
    window.open(url, '_blank');
};

const ProfileTab = createContext('overview');
const sectionTabs = { info:'overview', family:'overview', subscription:'overview', 'membership-history':'overview', login:'overview', payments:'finance', debts:'finance', weights:'progress', belt:'progress', attendance:'attendance', notes:'notes' };

// ─── Section Card ────────────────────────────────────────────────────────────
const Section = ({ id, icon: Icon, title, color, count, action, children }) => {
    const tab = useContext(ProfileTab);
    if (sectionTabs[id] !== tab) return null;
    return (
    <section id={id} className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
            <h3 className={`font-black flex items-center gap-2 ${color}`}>
                <Icon size={17}/> {title}
                {count != null && (
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                        {count}
                    </span>
                )}
            </h3>
            {action}
        </div>
        <div className="p-4">{children}</div>
    </section>
);
};

// ─── Stat Pill ───────────────────────────────────────────────────────────────
const StatPill = ({ label, value, color }) => (
    <div className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 min-w-[90px]">
        <p className="text-[10px] text-slate-500 font-bold mb-1">{label}</p>
        <p className={`text-base font-black ${color || 'text-slate-200'}`}>{value}</p>
    </div>
);

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function StudentProfile({ student, allStudents = [], studentsCollection, archiveCollection, selectedBranch, logActivity, onClose, onOpenWeights, onOpenDebts, onOpenFinance, onRenew, onSelectStudent }) {

    // إذا الطالب null، ما نعرض شي
    if (!student) return null;

    // ─── Collections ──────────────────────────────────────────────────────────
    const paymentsCol = useCollection('payments', { enabled: Boolean(onOpenFinance), where: [['studentId', '==', student.id], ['branch', '==', selectedBranch]] });
    const debtsCol    = useCollection('debts', { enabled: Boolean(onOpenDebts), where: [['studentId', '==', student.id], ['branch', '==', selectedBranch]] });
    const weightsCol  = useCollection('weights', { where: [['studentId', '==', student.id], ['branch', '==', selectedBranch]] });
    const [activeSection, setActiveSection] = useState('overview');

    // ─── حالات تحرير ──────────────────────────────────────────────────────────
    const [editMode, setEditMode]     = useState(false);
    const [editForm, setEditForm]     = useState({ ...student });
    const [savingEdit, setSavingEdit] = useState(false);

    // ─── Computed ─────────────────────────────────────────────────────────────
    const status = calcStatus(student.subEnd);

    // الإخوة (نفس العائلة)
    const siblings = useMemo(() =>
        allStudents.filter(s => student.familyId && student.familyId !== 'new' && s.familyId === student.familyId && s.id !== student.id),
    [allStudents, student]);

    // الوصولات
    const studentPayments = useMemo(() =>
        paymentsCol.data
            .filter(p => p.studentId === student.id)
            .sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    [paymentsCol.data, student.id]);

    const totalPaid = studentPayments.reduce((a, p) => a + Number(p.amount || 0), 0);

    // الذمم
    const studentDebts = useMemo(() =>
        debtsCol.data.filter(d => d.studentId === student.id),
    [debtsCol.data, student.id]);
    const totalDebt = studentDebts.reduce((a, d) =>
        a + Math.max(0, Number(d.totalAmount) - Number(d.paidAmount || 0)), 0);

    // الأوزان
    const studentWeights = useMemo(() =>
        weightsCol.data
            .filter(w => w.studentId === student.id && !w._isTarget)
            .sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    [weightsCol.data, student.id]);
    const targetWeight  = weightsCol.data.find(w => w.studentId === student.id && w._isTarget)?.weight;
    const currentWeight = studentWeights[0]?.weight;
    const chartData = useMemo(() =>
        [...studentWeights].reverse().map(w => ({
            label: fmtDate(w.createdAt),
            fullDate: `${fmtDate(w.createdAt)} ${fmtTime(w.createdAt)}`,
            weight: Number(w.weight),
            note: w.note || '',
        })),
    [studentWeights]);

    // الحضور — احسب لهذا الشهر
    const now = new Date();
    const monthPrefix = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
    const attendanceThisMonth = student.attendance
        ? Object.keys(student.attendance).filter(k => k.startsWith(monthPrefix) && student.attendance[k]).length
        : 0;
    const attendanceTotal = student.attendance
        ? Object.keys(student.attendance).filter(k => student.attendance[k]).length
        : 0;

    // الملاحظات
    const publicNotes  = student.notes || [];
    const privateNotes = student.internalNotes || [];

    // فحص الحزام
    const beltIndex = BELTS.indexOf(student.belt);
    const nextBelt  = beltIndex >= 0 && beltIndex < BELTS.length - 1 ? BELTS[beltIndex + 1] : null;

    // ─── Handlers ─────────────────────────────────────────────────────────────
    const saveEdit = async () => {
        setSavingEdit(true);
        try {
            const fields = Object.fromEntries(['name', 'phone', 'dob', 'joinDate', 'address'].map(key => [key, editForm[key] || '']));
            if (!fields.name.trim()) return toast('اسم الطالب مطلوب', 'error');
            if (!await studentsCollection.update(student.id, fields)) throw new Error('Save failed');
            if (logActivity) logActivity('تعديل طالب', `تعديل بيانات ${student.name}`);
            setEditMode(false);
            toast('تم حفظ بيانات الطالب', 'success');
        } catch { toast('تعذر حفظ التعديلات. حاول مرة أخرى.', 'error'); } finally { setSavingEdit(false); }
    };

    const promoteBelt = async () => {
        if (!nextBelt) return toast('الطالب في أعلى حزام', 'error');
        if (!confirm(`ترقية ${student.name} من ${student.belt} إلى ${nextBelt}؟`)) return;
        if (!await studentsCollection.update(student.id, { belt: nextBelt })) return toast('تعذر حفظ ترقية الحزام', 'error');
        if (logActivity) logActivity('ترقية حزام', `${student.name}: ${student.belt} → ${nextBelt}`);
    };

    // ─── طباعة البروفايل كامل ─────────────────────────────────────────────────
    const printProfile = () => {
        const logoUrl = window.location.origin + IMAGES.LOGO;

        const paymentsRows = studentPayments.length === 0
            ? '<tr><td colspan="4" style="text-align:center;padding:10px;color:#666">لا يوجد دفعات</td></tr>'
            : studentPayments.map(p => `<tr>
                <td style="border:1px solid #ddd;padding:5px;font-family:monospace;font-size:11px;">${fmtDate(p.date)}</td>
                <td style="border:1px solid #ddd;padding:5px;">${p.reason || '-'}</td>
                <td style="border:1px solid #ddd;padding:5px;text-align:center;">${p.method === 'cliq' ? 'كليك' : 'كاش'}</td>
                <td style="border:1px solid #ddd;padding:5px;text-align:center;font-weight:bold;color:#166534;">${p.amount} JD</td>
            </tr>`).join('');

        const debtsRows = studentDebts.length === 0
            ? '<tr><td colspan="4" style="text-align:center;padding:10px;color:#666">لا يوجد ديون</td></tr>'
            : studentDebts.map(d => {
                const rem = Number(d.totalAmount) - Number(d.paidAmount || 0);
                return `<tr>
                    <td style="border:1px solid #ddd;padding:5px;">${d.reason}</td>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;">${d.totalAmount} JD</td>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;color:#166534;">${d.paidAmount || 0} JD</td>
                    <td style="border:1px solid #ddd;padding:5px;text-align:center;font-weight:bold;color:${rem>0?'#991b1b':'#166534'};">${rem} JD</td>
                </tr>`;
            }).join('');

        const weightsRows = studentWeights.length === 0
            ? '<tr><td colspan="3" style="text-align:center;padding:10px;color:#666">لا يوجد قياسات</td></tr>'
            : studentWeights.slice(0, 10).map(w => `<tr>
                <td style="border:1px solid #ddd;padding:5px;font-family:monospace;font-size:11px;">${fmtDate(w.createdAt)} ${fmtTime(w.createdAt)}</td>
                <td style="border:1px solid #ddd;padding:5px;text-align:center;font-weight:bold;">${w.weight} kg</td>
                <td style="border:1px solid #ddd;padding:5px;font-size:11px;color:#555;">${w.note || '-'}</td>
            </tr>`).join('');

        const notesHtml = [...privateNotes.map(n => ({...n, _t:'خاصة'})), ...publicNotes.map(n => ({...n, _t:'عامة'}))]
            .map(n => `<div style="border:1px solid #e5e7eb;border-radius:6px;padding:8px 12px;margin-bottom:8px;border-right:4px solid ${n._t==='خاصة'?'#dc2626':'#10b981'};">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="font-weight:bold;font-size:10px;color:${n._t==='خاصة'?'#991b1b':'#166534'};">${n._t}</span>
                    <span style="font-size:10px;color:#666;">${n.date || ''}</span>
                </div>
                <div style="font-size:12px;">${n.text}</div>
            </div>`).join('') || '<p style="text-align:center;color:#666;padding:10px;">لا يوجد ملاحظات</p>';

        const win = window.open('', 'PROFILE', 'height=900,width=900');
        win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>بروفايل — ${student.name}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page{size:A4 portrait;margin:12mm}
            body{font-family:'Cairo',sans-serif;color:#000;background:#fff;-webkit-print-color-adjust:exact}
            .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #b45309;padding-bottom:12px;margin-bottom:20px}
            .logo{height:65px}
            h1{margin:0;font-size:20px;color:#b45309;font-weight:900}
            h2{font-size:14px;margin:20px 0 8px;color:#000;border-bottom:2px solid #1e293b;padding-bottom:5px}
            .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px 20px;margin-bottom:15px;font-size:12px}
            .info-grid div{padding:5px 0;border-bottom:1px dotted #ddd}
            .info-grid b{color:#555;font-weight:bold;margin-left:8px}
            table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:10px}
            th{background:#1e293b;color:#fff;border:1px solid #000;padding:6px;text-align:center;font-weight:bold}
            .summary{display:flex;gap:10px;margin-bottom:15px}
            .sb{flex:1;border:1px solid #ddd;border-radius:6px;padding:8px;text-align:center}
        </style></head>
        <body>
        <div class="hdr">
            <div>
                <h1>بروفايل الطالب — ${student.name}</h1>
                <p style="margin:4px 0 0;font-size:12px;color:#555;font-weight:bold">أكاديمية الشجاع — فرع ${selectedBranch}</p>
            </div>
            <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
        </div>

        <h2>📋 المعلومات الشخصية</h2>
        <div class="info-grid">
            <div><b>الاسم:</b> ${student.name}</div>
            <div><b>الهاتف:</b> ${student.phone || '-'}</div>
            <div><b>الحزام:</b> ${student.belt || '-'}</div>
            <div><b>الفرع:</b> ${student.branch || '-'}</div>
            <div><b>تاريخ الالتحاق:</b> ${fmtDate(student.joinDate)}</div>
            <div><b>تاريخ الميلاد:</b> ${fmtDate(student.dob)}</div>
            <div><b>نهاية الاشتراك:</b> ${fmtDate(student.subEnd)}</div>
            <div><b>المجموعة:</b> ${student.group || '-'}</div>
            <div style="grid-column:1/-1"><b>العنوان:</b> ${student.address || '-'}</div>
        </div>

        <h2>💰 المالية</h2>
        <div class="summary">
            <div class="sb"><div style="font-size:10px;color:#555">إجمالي المدفوع</div><div style="font-size:16px;font-weight:900;color:#166534">${totalPaid} JD</div></div>
            <div class="sb"><div style="font-size:10px;color:#555">عدد الوصولات</div><div style="font-size:16px;font-weight:900">${studentPayments.length}</div></div>
            <div class="sb"><div style="font-size:10px;color:#555">الذمم المتبقية</div><div style="font-size:16px;font-weight:900;color:${totalDebt>0?'#991b1b':'#166534'}">${totalDebt} JD</div></div>
        </div>

        <h2>📄 سجل الوصولات</h2>
        <table><thead><tr><th>التاريخ</th><th>البيان</th><th style="width:70px">طريقة</th><th style="width:80px">المبلغ</th></tr></thead><tbody>${paymentsRows}</tbody></table>

        <h2>🔴 الذمم</h2>
        <table><thead><tr><th>السبب</th><th style="width:80px">الكلي</th><th style="width:80px">المدفوع</th><th style="width:80px">المتبقي</th></tr></thead><tbody>${debtsRows}</tbody></table>

        <h2>⚖️ آخر قياسات الوزن</h2>
        <table><thead><tr><th>التاريخ والوقت</th><th style="width:80px">الوزن</th><th>ملاحظة</th></tr></thead><tbody>${weightsRows}</tbody></table>

        <h2>📅 الحضور</h2>
        <p style="font-size:12px;color:#555">حضور هذا الشهر: <b>${attendanceThisMonth} يوم</b> • إجمالي الحضور: <b>${attendanceTotal} يوم</b></p>

        <h2>📝 الملاحظات</h2>
        ${notesHtml}

        <div style="margin-top:30px;text-align:center;font-size:10px;color:#666;border-top:1px solid #eee;padding-top:10px">
            تم استخراج هذا التقرير من نظام إدارة أكاديمية الشجاع — ${new Date().toLocaleDateString('en-GB')}
        </div>
        <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close()},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    const statusCfg = {
        active:   { label: '✅ نشط',          cls: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' },
        near_end: { label: '⚠️ قرب الانتهاء', cls: 'bg-orange-900/30 text-orange-400 border-orange-500/30'   },
        expired:  { label: '🔴 منتهي',         cls: 'bg-red-900/30 text-red-400 border-red-500/30'           },
    }[status];

    return createPortal(
        <ProfileTab.Provider value={activeSection}>
        <div role="dialog" aria-modal="true" aria-label={`ملف الطالب ${student.name}`} dir="rtl" className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md overflow-y-auto" onClick={onClose}>
            <div className="min-h-screen p-2 md:p-6" onClick={e => e.stopPropagation()}>
                <div className="max-w-5xl mx-auto space-y-5">

                    {/* ── Header ── */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-yellow-900/20 via-slate-900 to-slate-900 p-5 md:p-6 flex items-center justify-between flex-wrap gap-3 border-b border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-yellow-500/15 border border-yellow-500/40 flex items-center justify-center">
                                    <span className="text-3xl font-black text-yellow-400">{student.name?.charAt(0)}</span>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-slate-100">{student.name}</h2>
                                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${statusCfg.cls}`}>{statusCfg.label}</span>
                                        <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">🥋 {student.belt}</span>
                                        <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">{student.branch}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={printProfile} title="طباعة كامل البروفايل"
                                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition-colors">
                                    <Printer size={18}/>
                                </button>
                                <button onClick={onClose} aria-label="إغلاق ملف الطالب"
                                    className="p-2.5 bg-red-900/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 rounded-xl transition-colors">
                                    <X size={18}/>
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
                            <StatPill label="حضور هذا الشهر" value={`${attendanceThisMonth}`} color="text-blue-400"/>
                            <StatPill label="إجمالي المدفوع" value={`${totalPaid} JD`} color="text-emerald-400"/>
                            <StatPill label="عدد الوصولات" value={studentPayments.length} color="text-cyan-400"/>
                            <StatPill label="الذمم المتبقية" value={`${totalDebt} JD`} color={totalDebt > 0 ? "text-red-400" : "text-emerald-400"}/>
                            <StatPill label="آخر حضور" value={fmtDate(Object.keys(student.attendance || {}).filter(day => student.attendance[day]).sort().at(-1))}/><StatPill label="آخر دفعة" value={onOpenFinance ? (paymentsCol.loading ? "..." : fmtDate(studentPayments[0]?.date)) : "غير متاح"}/>
                            <StatPill label="القياسات" value={studentWeights.length} color="text-purple-400"/>
                            <StatPill label="الوزن الحالي" value={currentWeight ? `${currentWeight} kg` : '-'} color="text-yellow-400"/>
                        </div>
                    </div>

                    <nav aria-label="أقسام ملف الطالب" className="flex flex-wrap gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2">
                        {[['overview','الملخص'], ...(onOpenFinance || onOpenDebts ? [['finance','المالية']] : []), ['attendance','الحضور'], ['progress','التقدم'], ['notes','الملاحظات']].map(([id,label]) => <button key={id} aria-pressed={activeSection === id} onClick={() => setActiveSection(id)} className={`min-h-11 px-4 rounded-lg text-sm font-bold ${activeSection === id ? 'bg-yellow-500 text-slate-900' : 'text-slate-300 hover:bg-slate-800'}`}>{label}</button>)}
                    </nav>
                    {((activeSection === 'finance' && (paymentsCol.loading || debtsCol.loading)) || (activeSection === 'progress' && weightsCol.loading)) && <p role="status" className="text-slate-400 text-center">جاري تحميل السجلات...</p>}
                    {((activeSection === 'finance' && (paymentsCol.error || debtsCol.error)) || (activeSection === 'progress' && weightsCol.error)) && <p role="alert" className="text-red-400 text-center">تعذر تحميل بعض السجلات. تحقق من الاتصال والصلاحيات.</p>}

                    {/* ── 1. المعلومات الشخصية ── */}
                    <Section id="info" icon={User} title="المعلومات الشخصية" color="text-blue-400"
                        action={
                            <button onClick={() => { if (editMode) saveEdit(); else { setEditForm({ ...student }); setEditMode(true); } }} disabled={savingEdit}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors
                                    ${editMode
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
                                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'}`}>
                                {editMode ? <><CheckCircle size={13}/> {savingEdit ? 'جاري الحفظ...' : 'حفظ'}</> : <><Edit3 size={13}/> تعديل</>}
                            </button>
                        }>
                        {!editMode ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <Phone size={14} className="text-blue-400 shrink-0"/>
                                    <span className="text-slate-500 font-bold">الهاتف:</span>
                                    <a href={`tel:${student.phone}`} className="text-slate-200 font-mono ml-auto hover:text-blue-400">{student.phone || '-'}</a>
                                    {student.phone && (
                                        <button onClick={() => openWhatsApp(student.phone)} className="text-green-500 hover:bg-green-900/20 p-1 rounded">
                                            <MessageCircle size={14}/>
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <Calendar size={14} className="text-emerald-400 shrink-0"/>
                                    <span className="text-slate-500 font-bold">تاريخ الميلاد:</span>
                                    <span className="text-slate-200 ml-auto font-mono">{fmtDate(student.dob)}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <Calendar size={14} className="text-purple-400 shrink-0"/>
                                    <span className="text-slate-500 font-bold">تاريخ الالتحاق:</span>
                                    <span className="text-slate-200 ml-auto font-mono">{fmtDate(student.joinDate)}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <Users size={14} className="text-yellow-400 shrink-0"/>
                                    <span className="text-slate-500 font-bold">المجموعة:</span>
                                    <span className="text-slate-200 ml-auto">{student.group || 'غير محدد'}</span>
                                </div>
                                <div className="md:col-span-2 flex items-start gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                                    <MapPin size={14} className="text-red-400 shrink-0 mt-0.5"/>
                                    <span className="text-slate-500 font-bold">العنوان:</span>
                                    <span className="text-slate-200 flex-1">{student.address || '-'}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                {[
                                    { k:'name',    l:'الاسم',          type:'text' },
                                    { k:'phone',   l:'الهاتف',         type:'tel' },
                                    { k:'dob',     l:'تاريخ الميلاد',  type:'date' },
                                    { k:'joinDate',l:'تاريخ الالتحاق', type:'date' },
                                    { k:'address', l:'العنوان',        type:'text', full:true },
                                ].map(f => (
                                    <div key={f.k} className={f.full ? 'md:col-span-2' : ''}>
                                        <label className="text-[10px] font-bold text-slate-500 mb-1 block">{f.l}</label>
                                        <input type={f.type}
                                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-yellow-500 text-sm"
                                            value={editForm[f.k] || ''}
                                            onChange={e => setEditForm({ ...editForm, [f.k]: e.target.value })}
                                        />
                                    </div>
                                ))}
                                <button onClick={() => { setEditMode(false); setEditForm({ ...student }); }}
                                    className="text-xs text-slate-500 hover:text-red-400 self-end">إلغاء</button>
                            </div>
                        )}
                    </Section>

                    {/* ── 2. الإخوة (نفس العائلة) ── */}
                    {siblings.length > 0 && (
                        <Section id="family" icon={Users} title="الإخوة في العائلة" color="text-emerald-400" count={siblings.length}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {siblings.map(sib => (
                                    <button onClick={() => onSelectStudent?.(sib)} key={sib.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
                                            {sib.name?.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-200 truncate text-sm">{sib.name}</p>
                                            <p className="text-[10px] text-slate-500">🥋 {sib.belt}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ── 3. الاشتراك ── */}
                    <Section id="subscription" icon={CalendarClock} title="الاشتراك" color="text-emerald-400"
                        action={
                            <button onClick={onRenew} disabled={!onRenew}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold">
                                <RefreshCw size={13}/> تجديد
                            </button>
                        }>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">نهاية الاشتراك</p>
                                <p className="text-base font-black text-emerald-400">{fmtDate(student.subEnd)}</p>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">الحالة</p>
                                <p className={`text-base font-black ${status === 'active' ? 'text-emerald-400' : status === 'near_end' ? 'text-orange-400' : 'text-red-400'}`}>
                                    {statusCfg.label}
                                </p>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 col-span-2">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">منذ الالتحاق</p>
                                <p className="text-base font-black text-blue-400">
                                    {student.joinDate ? `${Math.floor((new Date() - new Date(student.joinDate)) / (86400000 * 30))} شهر` : '-'}
                                </p>
                            </div>
                        </div>
                    </Section>

                    {Array.isArray(student.membershipHistory) && student.membershipHistory.length > 0 && (
                        <Section id="membership-history" icon={Archive} title="سجل العضويات والعودة" color="text-cyan-400" count={student.membershipHistory.length}>
                            <div className="space-y-2">
                                {[...student.membershipHistory].reverse().map((entry, index) => (
                                    <div key={`${entry.sourceArchiveId || 'history'}-${index}`} className="bg-slate-950 border border-slate-800 rounded-xl p-3 grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                                        <div><p className="text-[10px] text-slate-500 font-bold">تاريخ الأرشفة</p><p className="font-bold text-slate-300">{fmtDate(entry.archivedAt)}</p></div>
                                        <div><p className="text-[10px] text-slate-500 font-bold">تاريخ العودة</p><p className="font-bold text-cyan-400">{fmtDate(entry.restoredAt)}</p></div>
                                        <div><p className="text-[10px] text-slate-500 font-bold">بداية الاشتراك</p><p className="font-bold text-slate-300">{fmtDate(entry.subStart)}</p></div>
                                        <div><p className="text-[10px] text-slate-500 font-bold">نهاية الاشتراك</p><p className="font-bold text-slate-300">{fmtDate(entry.subEnd)}</p></div>
                                        <div><p className="text-[10px] text-slate-500 font-bold">المجموعة</p><p className="font-bold text-slate-300">{entry.group || '-'}</p></div>
                                    </div>
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ── 4. الحزام والفحوصات ── */}
                    <Section id="belt" icon={Award} title="الحزام والفحص" color="text-yellow-400"
                        action={nextBelt && (
                            <button onClick={promoteBelt}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg text-xs font-bold">
                                <ArrowUp size={13}/> ترقية إلى {nextBelt}
                            </button>
                        )}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-xl p-4 text-center">
                                <p className="text-[10px] text-yellow-500/70 font-bold mb-1">الحزام الحالي</p>
                                <p className="text-2xl font-black text-yellow-400">{student.belt || '-'}</p>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">الحزام القادم</p>
                                <p className="text-2xl font-black text-slate-300">{nextBelt || '🏆'}</p>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">موعد الفحص</p>
                                <p className="text-base font-black text-blue-400">{fmtDate(student.nextTestDate) || 'غير محدد'}</p>
                            </div>
                        </div>
                    </Section>

                    {/* ── 5. الوصولات ── */}
                    <Section id="payments" icon={DollarSign} title="الوصولات" color="text-emerald-400" count={studentPayments.length}
                        action={
                            <button disabled={!onOpenFinance} onClick={() => onOpenFinance?.()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold">
                                <Plus size={13}/> وصل جديد
                            </button>
                        }>
                        {studentPayments.length === 0 ? (
                            <p className="text-center text-slate-600 text-sm py-6">لا يوجد دفعات مسجّلة</p>
                        ) : (
                            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                                {studentPayments.map(p => (
                                    <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                                <Receipt size={14} className="text-emerald-400"/>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-200 text-sm truncate">{p.reason || '-'}</p>
                                                <p className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                                                    <span>{fmtDate(p.date)}</span>
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${p.method === 'cliq' ? 'bg-blue-900/30 text-blue-400' : 'bg-green-900/30 text-green-400'}`}>
                                                        {p.method === 'cliq' ? 'كليك' : 'كاش'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-black text-emerald-400 text-base shrink-0">+{p.amount} JD</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>

                    {/* ── 6. الذمم ── */}
                    <Section id="debts" icon={AlertTriangle} title="الذمم والأقساط" color="text-red-400" count={studentDebts.length}
                        action={
                            <button disabled={!onOpenDebts} onClick={() => onOpenDebts?.()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold">
                                <Plus size={13}/> دين جديد
                            </button>
                        }>
                        {studentDebts.length === 0 ? (
                            <p className="text-center text-emerald-400 text-sm py-6 font-bold">✓ خالٍ من الديون</p>
                        ) : (
                            <div className="space-y-2">
                                {studentDebts.map(d => {
                                    const rem = Number(d.totalAmount) - Number(d.paidAmount || 0);
                                    const percent = Math.round(((d.paidAmount || 0) / d.totalAmount) * 100);
                                    return (
                                        <div key={d.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <p className="font-bold text-slate-200 text-sm">{d.reason}</p>
                                                <span className={`text-sm font-black ${rem > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {rem} JD
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
                                                <div className={`h-full rounded-full ${rem > 0 ? 'bg-orange-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${percent}%` }}/>
                                            </div>
                                            <p className="text-[10px] text-slate-500">
                                                {d.paidAmount || 0} / {d.totalAmount} JD ({percent}%)
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Section>

                    {/* ── 7. الأوزان ── */}
                    <Section id="weights" icon={Scale} title="تتبع الوزن" color="text-blue-400" count={studentWeights.length}
                        action={
                            <button disabled={!onOpenWeights} onClick={() => onOpenWeights?.()}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold">
                                <Plus size={13}/> قياس جديد
                            </button>
                        }>
                        {studentWeights.length === 0 ? (
                            <p className="text-center text-slate-600 text-sm py-6">لا يوجد قياسات</p>
                        ) : (
                            <>
                                <div className="flex gap-3 mb-3">
                                    <StatPill label="الوزن الحالي" value={`${currentWeight} kg`} color="text-blue-400"/>
                                    {targetWeight && <StatPill label="الهدف" value={`${targetWeight} kg`} color="text-emerald-400"/>}
                                </div>
                                {chartData.length > 1 && (
                                    <div style={{ height: 200, width: '100%' }} className="min-w-0 mb-3">
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                                                <XAxis dataKey="label" stroke="#64748b" fontSize={9} tickLine={false}/>
                                                <YAxis stroke="#64748b" fontSize={10} tickLine={false} domain={['dataMin - 2', 'dataMax + 2']}/>
                                                <Tooltip
                                                    contentStyle={{ background:'#0f172a', border:'1px solid #3b82f6', borderRadius:8, fontSize:11 }}
                                                    formatter={(v) => [`${v} kg`, 'الوزن']}
                                                />
                                                <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={2.5}
                                                    dot={{ fill:'#3b82f6', r:4 }} activeDot={{ r:6 }}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                                <div className="space-y-1.5 max-h-44 overflow-y-auto custom-scrollbar">
                                    {studentWeights.slice(0, 5).map(w => (
                                        <div key={w.id} className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 flex items-center justify-between">
                                            <span className="font-black text-slate-200 text-sm">{w.weight} <span className="text-[10px] text-slate-500">kg</span></span>
                                            <span className="text-[10px] text-slate-500 font-mono">{fmtDate(w.createdAt)} {fmtTime(w.createdAt)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </Section>

                    <Section id="attendance" icon={Calendar} title="سجل الحضور" color="text-blue-400">
                        <AttendanceHistory key={student.id} attendance={student.attendance}/>
                    </Section>

                    <Section id="notes" icon={FileText} title="الملاحظات والرسائل" color="text-purple-400">
                        <NotesManager key={student.id} embedded initialStudentId={student.id} students={allStudents} studentsCollection={studentsCollection} selectedBranch={selectedBranch} logActivity={logActivity}/>
                    </Section>

                    {/* ── 10. بيانات الدخول ── */}
                    <Section id="login" icon={Lock} title="بيانات الدخول" color="text-yellow-400">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">اسم المستخدم</p>
                                <p className="text-slate-200 font-mono dir-ltr text-right">{student.username || '-'}</p>
                            </div>
                            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
                                <p className="text-[10px] text-slate-500 font-bold mb-1">كلمة المرور</p>
                                <p className="text-slate-200 font-mono">
                                    ••••••••
                                </p>
                            </div>
                        </div>
                    </Section>

                </div>
            </div>
        </div>
        </ProfileTab.Provider>,
        document.body
    );
}

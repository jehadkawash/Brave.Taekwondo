// src/views/dashboard/ReportsManager.jsx
import React, { useState, useMemo } from 'react';
import { 
    FileText, Printer, TrendingUp, TrendingDown, Users, 
    AlertCircle, Calendar, DollarSign, ChevronRight, 
    PieChart, Activity, ClipboardList 
} from 'lucide-react';
import { Card } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

// FIX #2: دالة مساعدة مركزية تحول أي نوع تاريخ إلى string آمن
const toDateString = (value) => {
    if (!value) return '';
    // إذا كان Array (مشكلة split('T') القديمة بدون [0])
    if (Array.isArray(value)) return value[0] || '';
    // إذا كان Firebase Timestamp
    if (value?.toDate) return value.toDate().toISOString().split('T')[0];
    // إذا كان string
    if (typeof value === 'string') return value.split('T')[0];
    // إذا كان Date object
    if (value instanceof Date) return value.toISOString().split('T')[0];
    return String(value);
};

export default function ReportsManager({ 
    students, payments, expenses, adminNotes, selectedBranch 
}) {
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(
        new Date().toISOString().split('T')[0]
    );
    const [activeTab, setActiveTab] = useState('overview');

    // --- Helpers ---
    const formatDate = (dateVal) => {
        // FIX #2: استخدام toDateString أولاً لتحويل أي نوع بشكل آمن
        const dateStr = toDateString(dateVal);
        if (!dateStr || dateStr === '-') return '-';
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('ar-JO', { 
            day: '2-digit', month: '2-digit', year: 'numeric' 
        });
    };

    // FIX #2: isInRange الآن تستخدم toDateString بدلاً من new Date(dateStr) مباشرة
    // هذا يمنع NaN عندما dateStr يكون Array أو undefined
    const isInRange = (dateVal) => {
        if (!dateVal) return false;
        const dateStr = toDateString(dateVal);
        if (!dateStr) return false;
        // مقارنة string مباشرة - أسرع وأأمن من Date comparison
        return dateStr >= startDate && dateStr <= endDate;
    };

    // --- Data Processing ---
    const financialData = useMemo(() => {
        const income = payments.filter(p => 
            p.branch === selectedBranch && isInRange(p.date)
        );
        const outgo = expenses.filter(e => 
            e.branch === selectedBranch && isInRange(e.date)
        );
        const totalIn = income.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        const totalOut = outgo.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        return { income, outgo, totalIn, totalOut, net: totalIn - totalOut };
    }, [payments, expenses, startDate, endDate, selectedBranch]);

    const studentReport = useMemo(() => {
        return students.filter(s => s.branch === selectedBranch).map(s => {
            // FIX #2: استخدام toDateString على مفاتيح الحضور أيضاً
            let attCount = 0;
            if (s.attendance) {
                attCount = Object.keys(s.attendance).filter(d => {
                    const safeD = toDateString(d);
                    return safeD >= startDate && safeD <= endDate;
                }).length;
            }

            const sPayments = payments
                .filter(p => p.studentId === s.id)
                .sort((a, b) => {
                    const da = toDateString(a.date);
                    const db = toDateString(b.date);
                    return db.localeCompare(da);
                });
            
            return {
                ...s,
                attCount,
                lastPay: sPayments[0]?.date || '-',
                allNotes: [
                    s.note && `[سجل]: ${s.note}`,
                    ...(s.notes || []).map(n => n.text),
                    ...(s.internalNotes || []).map(n => `[خاص]: ${n.text}`)
                ].filter(Boolean).join(' | ')
            };
        });
    }, [students, payments, startDate, endDate, selectedBranch]);

    // --- Print Logic ---
    const handlePrint = () => {
        const printWin = window.open('', 'PRINT');
        const logoUrl = window.location.origin + IMAGES.LOGO;

        printWin.document.write(`
            <html>
                <head>
                    <title>تقرير أكاديمية الشجاع</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap');
                        body { font-family: 'Cairo', sans-serif; direction: rtl; padding: 40px; color: #333; }
                        .report-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e293b; padding-bottom: 20px; }
                        .logo-container img { height: 80px; }
                        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 30px 0; }
                        .stat-card { border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; text-align: center; }
                        .stat-card.main { background: #1e293b; color: white; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
                        th { background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; text-align: right; }
                        td { border: 1px solid #cbd5e1; padding: 8px; }
                        .footer { margin-top: 50px; display: flex; justify-content: space-between; font-size: 12px; border-top: 1px solid #eee; }
                        .sig-box { text-align: center; width: 150px; border-top: 1px solid #000; margin-top: 40px; padding-top: 5px; }
                        @page { size: A4; margin: 10mm; }
                        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
                    </style>
                </head>
                <body>
                    <div class="report-header">
                        <div>
                            <h1 style="margin:0">التقرير الإداري</h1>
                            <p>الفترة: من ${formatDate(startDate)} إلى ${formatDate(endDate)}</p>
                            <p>الفرع: ${selectedBranch}</p>
                        </div>
                        <div class="logo-container">
                            <img src="${logoUrl}" onerror="this.style.display='none'">
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card">
                            إجمالي الواردات<br>
                            <strong>${financialData.totalIn} JD</strong>
                        </div>
                        <div class="stat-card">
                            إجمالي المصاريف<br>
                            <strong>${financialData.totalOut} JD</strong>
                        </div>
                        <div class="stat-card main">
                            صافي الأرباح<br>
                            <strong style="font-size:20px">${financialData.net} JD</strong>
                        </div>
                    </div>

                    <h3>سجل الطلاب والتحصيل العلمي</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>الطالب</th>
                                <th>الحزام</th>
                                <th>المالية</th>
                                <th>الحضور</th>
                                <th>آخر دفع</th>
                                <th>الملاحظات الإدارية</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${studentReport.map(s => `
                                <tr>
                                    <td>${s.name}</td>
                                    <td>${s.belt}</td>
                                    <td>${Number(s.balance) > 0 ? `مدين ${s.balance}` : 'خالص'}</td>
                                    <td>${s.attCount} أيام</td>
                                    <td>${formatDate(s.lastPay)}</td>
                                    <td style="font-size:9px">${s.allNotes || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="footer">
                        <div>طبع بواسطة: النظام الإداري الموحد</div>
                        <div style="display:flex; gap:40px">
                            <div class="sig-box">توقيع المحاسب</div>
                            <div class="sig-box">توقيع الإدارة</div>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWin.document.close();
        printWin.print();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-24">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <div className="p-3 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/20">
                            <ClipboardList className="text-slate-900" size={28}/>
                        </div>
                        مركز التقارير والتحليل
                    </h1>
                    <p className="text-slate-500 font-medium">
                        مراقبة الأداء المالي والأكاديمي لفرع {selectedBranch}
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-slate-900 p-2 rounded-2xl border border-slate-800">
                    <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={e => setStartDate(e.target.value)} 
                            className="bg-transparent text-white text-xs p-2 outline-none cursor-pointer" 
                        />
                        <div className="w-[1px] bg-slate-800 my-2"></div>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={e => setEndDate(e.target.value)} 
                            className="bg-transparent text-white text-xs p-2 outline-none cursor-pointer" 
                        />
                    </div>
                    <button 
                        onClick={handlePrint} 
                        className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                    >
                        <Printer size={18}/> تصدير
                    </button>
                </div>
            </div>

            {/* Top KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard title="السيولة الواردة" value={financialData.totalIn} icon={<TrendingUp/>} color="emerald" />
                <KPICard title="المصاريف التشغيلية" value={financialData.totalOut} icon={<TrendingDown/>} color="red" />
                <KPICard title="صافي الربح" value={financialData.net} icon={<DollarSign/>} color="blue" isMain />
                <KPICard title="إجمالي الأبطال" value={studentReport.length} icon={<Users/>} color="yellow" />
            </div>

            {/* Main Tabs */}
            <div className="flex gap-4 border-b border-slate-800">
                {['overview', 'financial', 'students', 'notes'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 px-2 font-bold text-sm transition-all relative ${
                            activeTab === tab ? 'text-yellow-500' : 'text-slate-500 hover:text-slate-300'
                        }`}
                    >
                        {tab === 'overview' && 'نظرة عامة'}
                        {tab === 'financial' && 'الحركة المالية'}
                        {tab === 'students' && 'سجل الأبطال'}
                        {tab === 'notes' && 'ملاحظات الإدارة'}
                        {activeTab === tab && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-500 rounded-t-full shadow-[0_-4px_10px_rgba(234,179,8,0.3)]"></div>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
                        <Card className="lg:col-span-2 bg-slate-900/50 backdrop-blur">
                            <h3 className="text-slate-100 font-bold mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-blue-500"/> ملخص النشاط
                            </h3>
                            <div className="h-64 flex items-center justify-center border border-dashed border-slate-800 rounded-2xl">
                                <div className="text-center text-slate-600">
                                    <PieChart size={48} className="mx-auto mb-2 opacity-20"/>
                                    <p className="text-sm">مساحة مخصصة للرسم البياني</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-950">
                            <h3 className="text-slate-100 font-bold mb-4 flex items-center gap-2">
                                <PieChart size={18} className="text-yellow-500"/> التوزيـع
                            </h3>
                            <div className="space-y-4">
                                <ProgressBar 
                                    label="الإيرادات" 
                                    current={financialData.totalIn} 
                                    total={financialData.totalIn + financialData.totalOut} 
                                    color="bg-emerald-500" 
                                />
                                <ProgressBar 
                                    label="المصاريف" 
                                    current={financialData.totalOut} 
                                    total={financialData.totalIn + financialData.totalOut} 
                                    color="bg-red-500" 
                                />
                            </div>
                        </Card>
                    </div>
                )}

                {activeTab === 'financial' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        <FinancialList title="الواردات" data={financialData.income} type="in" />
                        <FinancialList title="المصاريف" data={financialData.outgo} type="out" />
                    </div>
                )}

                {activeTab === 'students' && (
                    <Card className="bg-slate-900 p-0 overflow-hidden border-slate-800">
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-sm">
                                <thead className="bg-slate-950 text-slate-500">
                                    <tr>
                                        <th className="p-4">البطل</th>
                                        <th className="p-4">الحزام</th>
                                        <th className="p-4">الحضور</th>
                                        <th className="p-4">المالية</th>
                                        <th className="p-4">الملاحظات</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {studentReport.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                                            <td className="p-4 font-bold text-slate-200">{s.name}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
                                                    {s.belt}
                                                </span>
                                            </td>
                                            <td className="p-4 font-mono text-blue-400">{s.attCount} يوم</td>
                                            <td className="p-4">
                                                {Number(s.balance) > 0 
                                                    ? <span className="text-red-400 font-bold underline">مدين {s.balance}</span> 
                                                    : <span className="text-emerald-500">خالص</span>
                                                }
                                            </td>
                                            <td className="p-4 text-xs text-slate-500 max-w-xs truncate">
                                                {s.allNotes}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

// --- Sub-components ---
function KPICard({ title, value, icon, color, isMain }) {
    const colors = {
        emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        red: "text-red-500 bg-red-500/10 border-red-500/20",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        yellow: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    };

    return (
        <Card className={`${isMain ? 'ring-2 ring-blue-500 shadow-2xl shadow-blue-500/10' : ''} bg-slate-900 border-slate-800`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl border ${colors[color]}`}>{icon}</div>
                <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</p>
                    <p className="text-2xl font-black text-white">
                        {value} <span className="text-xs font-normal text-slate-600">JD</span>
                    </p>
                </div>
            </div>
        </Card>
    );
}

function ProgressBar({ label, current, total, color }) {
    const percent = total > 0 ? (current / total) * 100 : 0;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>{label}</span>
                <span>{percent.toFixed(1)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} transition-all duration-1000`} 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
}

function FinancialList({ title, data, type }) {
    // FIX #2: عرض التاريخ بشكل آمن
    const formatSafe = (val) => {
        const s = toDateString(val);
        if (!s) return '-';
        const d = new Date(s);
        if (isNaN(d.getTime())) return '-';
        return d.toLocaleDateString('ar-JO');
    };

    return (
        <Card className="bg-slate-900 p-0 overflow-hidden border-slate-800">
            <div className={`p-4 font-bold border-b border-slate-800 flex justify-between ${
                type === 'in' 
                    ? 'text-emerald-400 bg-emerald-500/5' 
                    : 'text-red-400 bg-red-500/5'
            }`}>
                {title}
                <span>{data.length} حركة</span>
            </div>
            <div className="max-h-80 overflow-y-auto p-2 space-y-2">
                {data.length === 0 && (
                    <div className="text-center py-8 text-slate-600 text-sm">
                        لا توجد حركات في هذه الفترة
                    </div>
                )}
                {data.map((item, i) => (
                    <div 
                        key={i} 
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center group hover:border-slate-700 transition-all"
                    >
                        <div>
                            <p className="text-sm font-bold text-slate-200">
                                {item.name || item.title}
                            </p>
                            <p className="text-[10px] text-slate-600">
                                {formatSafe(item.date)}
                            </p>
                        </div>
                        <p className={`font-black ${type === 'in' ? 'text-emerald-500' : 'text-red-500'}`}>
                            {item.amount} JD
                        </p>
                    </div>
                ))}
            </div>
        </Card>
    );
}
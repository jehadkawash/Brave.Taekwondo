// src/views/dashboard/ReportsManager.jsx
import React, { useState } from 'react';
import { FileText, Printer, TrendingUp, TrendingDown, Users, AlertCircle } from 'lucide-react';
import { Card } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

export default function ReportsManager({ 
    students, payments, expenses, activityLogs, 
    registrations, adminNotes, selectedBranch 
}) {
    // الفترة الافتراضية: من أول الشهر الحالي إلى اليوم
    const date = new Date();
    // Keep these as YYYY-MM-DD for logic and input values
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const currentDay = new Date().toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(currentDay);

    // --- HELPER: Date Formatter (dd/mm/yyyy) ---
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const d = new Date(dateString);
        // Check if date is valid
        if (isNaN(d.getTime())) return dateString; 
        
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    // --- دالة التحقق من التاريخ (للمالية والحضور فقط) ---
    const isInRange = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr); d.setHours(0,0,0,0);
        const start = new Date(startDate); start.setHours(0,0,0,0);
        const end = new Date(endDate); end.setHours(0,0,0,0);
        return d >= start && d <= end;
    };

    // --- دالة تحديد حالة الاشتراك ---
    const getSubStatus = (dateString) => {
        if (!dateString) return { label: 'منتهي', color: '#fee2e2', text: '#991b1b' };
        const today = new Date();
        const end = new Date(dateString);
        today.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { label: 'منتهي', color: '#fee2e2', text: '#991b1b' };
        if (diffDays <= 7) return { label: 'قارب الانتهاء', color: '#ffedd5', text: '#9a3412' };
        return { label: 'فعال', color: '#dcfce7', text: '#166534' };
    };

    // --- 1. البيانات المالية (مرتبطة بالتاريخ) ---
    const filteredIncome = payments.filter(p => p.branch === selectedBranch && isInRange(p.date));
    const filteredExpenses = expenses.filter(e => e.branch === selectedBranch && isInRange(e.date));
    
    const totalIncome = filteredIncome.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalExpense = filteredExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const netProfit = totalIncome - totalExpense;

    // --- 2. ملاحظات الإدارة (الكل - بدون فلتر تاريخ) ---
    const finalAdminNotes = adminNotes || [];

    // --- 3. بيانات الطلاب (الملاحظات كاملة بدون فلتر) ---
    const studentReportData = students.filter(s => s.branch === selectedBranch).map(s => {
        // أ. عدد أيام الحضور (مرتبط بالتاريخ المختار)
        let attendanceCount = 0;
        if (s.attendance) {
            Object.keys(s.attendance).forEach(dateKey => {
                if (isInRange(dateKey)) attendanceCount++;
            });
        }

        // ب. آخر وصل مالي
        const studentPayments = payments
            .filter(p => p.studentId === s.id || p.name === s.name)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastPaymentDate = studentPayments.length > 0 ? studentPayments[0].date : '-';

        // ج. تجميع الملاحظات
        let allNotes = [];
        if (s.note) allNotes.push(`[قديم: ${s.note}]`);
        if (s.notes && s.notes.length > 0) s.notes.forEach(n => allNotes.push(n.text));
        if (s.internalNotes && s.internalNotes.length > 0) s.internalNotes.forEach(n => allNotes.push(`(خاص: ${n.text})`));
        
        const notesString = allNotes.join(' | ');

        return {
            ...s,
            attendanceCount,
            lastPaymentDate,
            notesString: notesString || '-',
            statusInfo: getSubStatus(s.subEnd)
        };
    });

    // --- دالة الطباعة ---
    const handlePrintFullReport = () => {
        const printWin = window.open('', 'PRINT', 'height=800,width=1000');
        const logoUrl = window.location.origin + IMAGES.LOGO;

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>التقرير الشامل - ${selectedBranch}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                    body { font-family: 'Cairo', sans-serif; padding: 15px; color: #1f2937; font-size: 10px; }
                    .header { text-align: center; border-bottom: 2px solid #fbbf24; padding-bottom: 10px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
                    .header-content { text-align: center; flex: 1; }
                    .logo { height: 60px; object-fit: contain; }
                    h1 { margin: 0; color: #000; font-size: 18px; }
                    h2 { font-size: 14px; background: #f3f4f6; padding: 6px 10px; margin-top: 20px; border-right: 4px solid #000; font-weight: 700; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    th, td { border: 1px solid #ccc; padding: 5px; text-align: right; vertical-align: middle; }
                    th { background-color: #f9fafb; font-weight: 700; white-space: nowrap; font-size: 10px; }
                    td { font-size: 10px; }
                    
                    .financial-grid { display: flex; gap: 15px; }
                    .box { flex: 1; border: 1px solid #ddd; padding: 8px; text-align: center; border-radius: 5px; }
                    .amount { font-size: 14px; font-weight: bold; display: block; margin-bottom: 2px; }
                    
                    .status-badge { padding: 2px 6px; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 9px; }
                    
                    @media print {
                        @page { size: A4 landscape; margin: 10mm; }
                        body { -webkit-print-color-adjust: exact; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div style="font-size:10px; text-align:right;">
                        التاريخ: ${formatDate(new Date())}<br>
                        الفرع: <strong>${selectedBranch}</strong>
                    </div>
                    <div class="header-content">
                        <h1>التقرير الإداري والمالي الشامل</h1>
                        <p style="margin:2px 0 0 0; color:#666;">الفترة: من ${formatDate(startDate)} إلى ${formatDate(endDate)}</p>
                    </div>
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                </div>

                <h2>أولاً: الوضع المالي (خلال الفترة المحددة)</h2>
                <div class="financial-grid">
                    <div class="box" style="background:#f0fdf4; border-color:#86efac;">
                        <span class="amount" style="color:#166534;">${totalIncome} JD</span>
                        <span>مجموع الإيرادات</span>
                    </div>
                    <div class="box" style="background:#fef2f2; border-color:#fca5a5;">
                        <span class="amount" style="color:#991b1b;">${totalExpense} JD</span>
                        <span>مجموع المصاريف</span>
                    </div>
                    <div class="box" style="background:#eff6ff; border-color:#93c5fd;">
                        <span class="amount" style="color:#1e40af;">${netProfit} JD</span>
                        <span>صافي الربح</span>
                    </div>
                </div>

                <div class="financial-grid" style="margin-top:10px;">
                    <div style="flex:1;">
                        <h3 style="margin:5px 0; font-size:11px; color:green;">تفاصيل الوصولات (الواردات)</h3>
                        <table>
                            <thead><tr><th>التاريخ</th><th>الطالب</th><th>المبلغ</th><th>البيان</th></tr></thead>
                            <tbody>
                                ${filteredIncome.map(p => `<tr><td>${formatDate(p.date)}</td><td>${p.name}</td><td>${p.amount}</td><td>${p.reason || '-'}</td></tr>`).join('')}
                                ${filteredIncome.length === 0 ? '<tr><td colspan="4" style="text-align:center">-</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                    <div style="flex:1;">
                        <h3 style="margin:5px 0; font-size:11px; color:red;">تفاصيل المصاريف</h3>
                        <table>
                            <thead><tr><th>التاريخ</th><th>البند</th><th>المبلغ</th></tr></thead>
                            <tbody>
                                ${filteredExpenses.map(e => `<tr><td>${formatDate(e.date)}</td><td>${e.title}</td><td>${e.amount}</td></tr>`).join('')}
                                ${filteredExpenses.length === 0 ? '<tr><td colspan="3" style="text-align:center">-</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2>ثانياً: ملاحظات الإدارة (النشطة حالياً)</h2>
                <table>
                    <thead><tr><th width="15%">تاريخ الإضافة</th><th>الملاحظة</th></tr></thead>
                    <tbody>
                        ${finalAdminNotes.map(n => `<tr><td>${formatDate(n.date)}</td><td>${n.text || n.content}</td></tr>`).join('')}
                        ${finalAdminNotes.length === 0 ? '<tr><td colspan="2" style="text-align:center">لا يوجد ملاحظات إدارية</td></tr>' : ''}
                    </tbody>
                </table>

                <h2>ثالثاً: سجل الطلاب الشامل (الوضع الحالي)</h2>
                <table>
                    <thead>
                        <tr>
                            <th width="2%">#</th>
                            <th width="12%">اسم الطالب</th>
                            <th width="6%">الحزام</th>
                            <th width="8%">حالة الاشتراك</th>
                            <th width="8%">ينتهي في</th>
                            <th width="8%">الوضع المالي</th>
                            <th width="8%">آخر وصل</th>
                            <th width="5%">حضور*</th>
                            <th width="8%">فحص قادم</th>
                            <th>الملاحظات (كل الأنواع)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentReportData.map((s, i) => `
                            <tr>
                                <td>${i + 1}</td>
                                <td style="font-weight:bold;">${s.name}</td>
                                <td>${s.belt}</td>
                                <td style="text-align:center;">
                                    <span class="status-badge" style="background:${s.statusInfo.color}; color:${s.statusInfo.text};">
                                        ${s.statusInfo.label}
                                    </span>
                                </td>
                                <td>${formatDate(s.subEnd)}</td>
                                <td>
                                    ${Number(s.balance) > 0 
                                        ? `<span style="color:red; font-weight:bold;">عليه ${s.balance}</span>` 
                                        : '<span style="color:green;">مدفوع</span>'}
                                </td>
                                <td>${formatDate(s.lastPaymentDate)}</td>
                                <td style="text-align:center; font-weight:bold;">${s.attendanceCount}</td>
                                <td>${formatDate(s.nextTestDate)}</td>
                                <td style="font-size:9px; color:#555;">${s.notesString}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p style="font-size:9px; margin-top:5px;">* عدد أيام الحضور يتم حسابه بناءً على الفترة المختارة في التقرير فقط.</p>

                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `;

        printWin.document.write(htmlContent);
        printWin.document.close();
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
            {/* Control Panel */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-20">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div>
                        <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                            <FileText className="text-yellow-500"/> التقارير الشاملة
                        </h2>
                        <p className="text-gray-500 text-xs mt-1">يظهر التقرير جميع الملاحظات الحالية، بينما يتم فلترة البيانات المالية والحضور حسب التاريخ.</p>
                    </div>
                    <button 
                        onClick={handlePrintFullReport}
                        className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-black shadow-lg hover:shadow-xl transition-all w-full md:w-auto justify-center"
                    >
                        <Printer size={18}/> طباعة التقرير (PDF)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">من تاريخ (للمالية والحضور)</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            className="w-full p-2 rounded-lg border-2 border-gray-200 outline-none focus:border-yellow-500 font-bold text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">إلى تاريخ (للمالية والحضور)</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="w-full p-2 rounded-lg border-2 border-gray-200 outline-none focus:border-yellow-500 font-bold text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* 1. Dashboard Summaries */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-green-100 bg-green-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp size={20}/></div>
                        <h3 className="font-bold text-gray-600 text-sm">الإيرادات</h3>
                    </div>
                    <p className="text-2xl font-black text-green-700">{totalIncome} JD</p>
                </Card>

                <Card className="border-red-100 bg-red-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown size={20}/></div>
                        <h3 className="font-bold text-gray-600 text-sm">المصاريف</h3>
                    </div>
                    <p className="text-2xl font-black text-red-700">{totalExpense} JD</p>
                </Card>

                <Card className="border-blue-100 bg-blue-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp size={20}/></div>
                        <h3 className="font-bold text-gray-600 text-sm">صافي الربح</h3>
                    </div>
                    <p className="text-2xl font-black text-blue-700">{netProfit} JD</p>
                </Card>

                <Card className="border-yellow-100 bg-yellow-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Users size={20}/></div>
                        <h3 className="font-bold text-gray-600 text-sm">الطلاب (الفرع)</h3>
                    </div>
                    <p className="text-2xl font-black text-yellow-700">{studentReportData.length}</p>
                </Card>
            </div>

            {/* 2. On-Screen Details Sections */}
            
            {/* Financial Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-green-700 flex items-center gap-2"><TrendingUp size={18}/> الإيرادات</h3>
                        <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded-full">{filteredIncome.length} وصل</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-xs text-right">
                            <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                <tr>
                                    <th className="p-3">التاريخ</th>
                                    <th className="p-3">الطالب</th>
                                    <th className="p-3">المبلغ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredIncome.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="p-3 text-gray-500">{formatDate(p.date)}</td>
                                        <td className="p-3 font-bold text-gray-700">{p.name}</td>
                                        <td className="p-3 font-bold text-green-600">{p.amount}</td>
                                    </tr>
                                ))}
                                {filteredIncome.length === 0 && <tr><td colSpan="3" className="p-4 text-center text-gray-400">لا يوجد إيرادات</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-red-700 flex items-center gap-2"><TrendingDown size={18}/> المصاريف</h3>
                        <span className="text-xs font-bold bg-red-100 text-red-800 px-2 py-1 rounded-full">{filteredExpenses.length} حركة</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        <table className="w-full text-xs text-right">
                            <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                <tr>
                                    <th className="p-3">التاريخ</th>
                                    <th className="p-3">البند</th>
                                    <th className="p-3">المبلغ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredExpenses.map(e => (
                                    <tr key={e.id} className="hover:bg-gray-50">
                                        <td className="p-3 text-gray-500">{formatDate(e.date)}</td>
                                        <td className="p-3 font-bold text-gray-700">{e.title}</td>
                                        <td className="p-3 font-bold text-red-600">{e.amount}</td>
                                    </tr>
                                ))}
                                {filteredExpenses.length === 0 && <tr><td colSpan="3" className="p-4 text-center text-gray-400">لا يوجد مصاريف</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Admin Notes Section (No Filter) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-yellow-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-yellow-800 flex items-center gap-2"><AlertCircle size={18}/> ملاحظات الإدارة (الكل)</h3>
                    <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{finalAdminNotes.length} ملاحظة</span>
                </div>
                <div className="max-h-48 overflow-y-auto custom-scrollbar p-0">
                    <table className="w-full text-xs text-right">
                        <thead className="bg-gray-50 text-gray-500 sticky top-0">
                            <tr>
                                <th className="p-3 w-32">التاريخ</th>
                                <th className="p-3">الملاحظة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {finalAdminNotes.map((n, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-3 text-gray-500">{formatDate(n.date)}</td>
                                    <td className="p-3 text-gray-700">{n.text || n.content}</td>
                                </tr>
                            ))}
                            {finalAdminNotes.length === 0 && <tr><td colSpan="2" className="p-4 text-center text-gray-400">لا يوجد ملاحظات إدارية</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-blue-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-blue-800 flex items-center gap-2"><Users size={18}/> سجل الطلاب الشامل</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-right">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-3">#</th>
                                <th className="p-3">الطالب</th>
                                <th className="p-3">الحزام</th>
                                <th className="p-3">الاشتراك</th>
                                <th className="p-3">الانتهاء</th>
                                <th className="p-3">المالية</th>
                                <th className="p-3">آخر وصل</th>
                                <th className="p-3">الحضور</th>
                                <th className="p-3">ملاحظات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {studentReportData.map((s, i) => (
                                <tr key={s.id} className="hover:bg-gray-50">
                                    <td className="p-3 text-gray-400">{i + 1}</td>
                                    <td className="p-3 font-bold text-gray-800">{s.name}</td>
                                    <td className="p-3 text-gray-600">{s.belt}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.statusInfo.color} ${s.statusInfo.text}`}>
                                            {s.statusInfo.label}
                                        </span>
                                    </td>
                                    <td className="p-3 dir-ltr text-right text-gray-500">{formatDate(s.subEnd)}</td>
                                    <td className="p-3">
                                        {Number(s.balance) > 0 
                                            ? <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded">عليه {s.balance}</span> 
                                            : <span className="text-green-600">مدفوع</span>}
                                    </td>
                                    <td className="p-3 text-gray-500">{formatDate(s.lastPaymentDate)}</td>
                                    <td className="p-3 font-bold text-center">{s.attendanceCount}</td>
                                    <td className="p-3 text-gray-500 max-w-xs truncate" title={s.notesString}>{s.notesString !== '-' ? s.notesString : ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
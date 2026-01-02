// src/views/dashboard/ReportsManager.jsx
import React, { useState } from 'react';
import { FileText, Printer, TrendingUp, TrendingDown, Users, Calendar } from 'lucide-react';
import { Card } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

export default function ReportsManager({ 
    students, payments, expenses, activityLogs, 
    registrations, adminNotes, selectedBranch 
}) {
    // تحديد الفترة الافتراضية (الشهر الحالي)
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
    const currentDay = new Date().toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(currentDay);

    // --- Helper: Date Filtering ---
    const isInRange = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr); d.setHours(0,0,0,0);
        const start = new Date(startDate); start.setHours(0,0,0,0);
        const end = new Date(endDate); end.setHours(0,0,0,0);
        return d >= start && d <= end;
    };

    // --- Helper: Get Subscription Status ---
    const getSubStatus = (dateString) => {
        if (!dateString) return { label: 'منتهي', color: '#fee2e2', text: '#991b1b' }; // Red
        const today = new Date();
        const end = new Date(dateString);
        today.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) return { label: 'منتهي', color: '#fee2e2', text: '#991b1b' };
        if (diffDays <= 7) return { label: 'قارب الانتهاء', color: '#ffedd5', text: '#9a3412' }; // Orange
        return { label: 'فعال', color: '#dcfce7', text: '#166534' }; // Green
    };

    // --- 1. Processing Financial Data ---
    const filteredIncome = payments.filter(p => p.branch === selectedBranch && isInRange(p.date));
    const filteredExpenses = expenses.filter(e => e.branch === selectedBranch && isInRange(e.date));
    
    const totalIncome = filteredIncome.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalExpense = filteredExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const netProfit = totalIncome - totalExpense;

    // --- 2. Processing Admin Notes ---
    const filteredNotes = adminNotes ? adminNotes.filter(n => isInRange(n.date) || isInRange(n.createdAt)) : [];

    // --- 3. Processing Students Data (Complex Logic) ---
    const studentReportData = students.filter(s => s.branch === selectedBranch).map(s => {
        // A. Attendance Count within Range
        let attendanceCount = 0;
        if (s.attendance) {
            Object.keys(s.attendance).forEach(dateKey => {
                if (isInRange(dateKey)) attendanceCount++;
            });
        }

        // B. Last Payment Date
        // نبحث في كل الدفعات عن دفعات هذا الطالب ونرتبها تنازلياً لنأخذ الأحدث
        const studentPayments = payments
            .filter(p => p.studentId === s.id || p.name === s.name) // Check ID or Name matches
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const lastPaymentDate = studentPayments.length > 0 ? studentPayments[0].date : '-';

        // C. Combined Notes
        // دمج كل أنواع الملاحظات في نص واحد للتقرير
        let notesString = "";
        if (s.note) notesString += `[قديم: ${s.note}] `;
        if (s.notes && s.notes.length > 0) notesString += s.notes.map(n => n.text).join(', ');
        if (s.internalNotes && s.internalNotes.length > 0) notesString += s.internalNotes.map(n => `(خاص: ${n.text})`).join(', ');

        return {
            ...s,
            attendanceCount,
            lastPaymentDate,
            notesString: notesString || '-',
            statusInfo: getSubStatus(s.subEnd)
        };
    });

    // --- Print Function ---
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
                    .logo { height: 50px; }
                    h1 { margin: 0; color: #000; font-size: 18px; }
                    h2 { font-size: 14px; background: #eee; padding: 5px 10px; margin-top: 15px; border-right: 4px solid #000; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    th, td { border: 1px solid #ccc; padding: 4px; text-align: right; vertical-align: top; }
                    th { background-color: #f3f4f6; font-weight: 700; white-space: nowrap; }
                    
                    .financial-grid { display: flex; gap: 15px; }
                    .box { flex: 1; border: 1px solid #ddd; padding: 10px; text-align: center; border-radius: 5px; }
                    .amount { font-size: 14px; font-weight: bold; display: block; margin-bottom: 2px; }
                    
                    .status-badge { padding: 2px 4px; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 9px; }
                    
                    @media print {
                        @page { size: A4 landscape; margin: 10mm; }
                        body { -webkit-print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div style="font-size:10px; text-align:right;">
                        التاريخ: ${new Date().toLocaleDateString('ar-EG')}<br>
                        الفرع: <strong>${selectedBranch}</strong>
                    </div>
                    <div class="header-content">
                        <h1>التقرير الإداري والمالي الشامل</h1>
                        <p style="margin:2px 0 0 0; color:#666;">من ${startDate} إلى ${endDate}</p>
                    </div>
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                </div>

                <h2>أولاً: الوضع المالي (Financial Status)</h2>
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
                            <thead><tr><th>التاريخ</th><th>الطالب</th><th>المبلغ</th><th>البيان/الطريقة</th></tr></thead>
                            <tbody>
                                ${filteredIncome.map(p => `<tr><td>${p.date}</td><td>${p.name}</td><td>${p.amount}</td><td>${p.reason || '-'}</td></tr>`).join('')}
                                ${filteredIncome.length === 0 ? '<tr><td colspan="4" style="text-align:center">-</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                    <div style="flex:1;">
                        <h3 style="margin:5px 0; font-size:11px; color:red;">تفاصيل المصاريف</h3>
                        <table>
                            <thead><tr><th>التاريخ</th><th>البند</th><th>المبلغ</th></tr></thead>
                            <tbody>
                                ${filteredExpenses.map(e => `<tr><td>${e.date}</td><td>${e.title}</td><td>${e.amount}</td></tr>`).join('')}
                                ${filteredExpenses.length === 0 ? '<tr><td colspan="3" style="text-align:center">-</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2>ثانياً: ملاحظات الإدارة (Admin Notes)</h2>
                <table>
                    <thead><tr><th>التاريخ</th><th>الملاحظة</th></tr></thead>
                    <tbody>
                        ${filteredNotes.map(n => `<tr><td style="width:80px;">${n.date}</td><td>${n.text}</td></tr>`).join('')}
                        ${filteredNotes.length === 0 ? '<tr><td colspan="2" style="text-align:center">لا يوجد ملاحظات إدارية في هذه الفترة</td></tr>' : ''}
                    </tbody>
                </table>

                <h2>ثالثاً: سجل الطلاب الشامل (Students Record)</h2>
                <table>
                    <thead>
                        <tr>
                            <th width="2%">#</th>
                            <th width="15%">اسم الطالب</th>
                            <th width="8%">الحزام</th>
                            <th width="10%">حالة الاشتراك</th>
                            <th width="8%">ينتهي في</th>
                            <th width="8%">الوضع المالي</th>
                            <th width="8%">آخر وصل</th>
                            <th width="5%">حضور</th>
                            <th width="8%">تاريخ الفحص</th>
                            <th>الملاحظات</th>
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
                                <td>${s.subEnd || '-'}</td>
                                <td>
                                    ${Number(s.balance) > 0 
                                        ? `<span style="color:red; font-weight:bold;">عليه ${s.balance}</span>` 
                                        : '<span style="color:green;">خالص</span>'}
                                </td>
                                <td>${s.lastPaymentDate}</td>
                                <td style="text-align:center; font-weight:bold;">${s.attendanceCount}</td>
                                <td>${s.nextTestDate || '-'}</td>
                                <td style="font-size:9px; color:#555;">${s.notesString}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <FileText className="text-yellow-500"/> التقارير الشاملة
                    </h2>
                    <button 
                        onClick={handlePrintFullReport}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black shadow-lg hover:shadow-xl transition-all w-full md:w-auto justify-center"
                    >
                        <Printer size={20}/> طباعة التقرير (PDF)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">من تاريخ</label>
                        <input 
                            type="date" 
                            value={startDate} 
                            onChange={(e) => setStartDate(e.target.value)} 
                            className="w-full p-3 rounded-lg border-2 border-gray-200 outline-none focus:border-yellow-500 font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">إلى تاريخ</label>
                        <input 
                            type="date" 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="w-full p-3 rounded-lg border-2 border-gray-200 outline-none focus:border-yellow-500 font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-green-100 bg-green-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp size={20}/></div>
                        <h3 className="font-bold text-gray-600">الإيرادات</h3>
                    </div>
                    <p className="text-2xl font-black text-green-700">{totalIncome} JD</p>
                </Card>

                <Card className="border-red-100 bg-red-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown size={20}/></div>
                        <h3 className="font-bold text-gray-600">المصاريف</h3>
                    </div>
                    <p className="text-2xl font-black text-red-700">{totalExpense} JD</p>
                </Card>

                <Card className="border-blue-100 bg-blue-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp size={20}/></div>
                        <h3 className="font-bold text-gray-600">صافي الربح</h3>
                    </div>
                    <p className="text-2xl font-black text-blue-700">{netProfit} JD</p>
                </Card>

                <Card className="border-yellow-100 bg-yellow-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Users size={20}/></div>
                        <h3 className="font-bold text-gray-600">الطلاب (الفرع)</h3>
                    </div>
                    <p className="text-2xl font-black text-yellow-700">{studentReportData.length}</p>
                </Card>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-start gap-3">
                <Calendar className="text-blue-500 mt-1" size={24}/>
                <div>
                    <h4 className="font-bold text-blue-800 text-sm">ملاحظة هامة:</h4>
                    <p className="text-blue-700 text-xs mt-1">
                        البيانات المالية (الإيرادات والمصاريف) وعدد أيام الحضور يتم حسابها بناءً على <strong>الفترة الزمنية المختارة</strong> في الأعلى.
                        أما حالة الاشتراك والديون فهي تعكس <strong>الوضع الحالي</strong> للطالب بغض النظر عن التاريخ.
                    </p>
                </div>
            </div>
        </div>
    );
}
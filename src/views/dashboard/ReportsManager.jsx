// src/views/dashboard/ReportsManager.jsx
import React, { useState } from 'react';
import { FileText, Printer, TrendingUp, TrendingDown, Users, Activity, Award, CheckCircle } from 'lucide-react';
import { Card } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

export default function ReportsManager({ 
    students, payments, expenses, activityLogs, 
    registrations, adminNotes, selectedBranch 
}) {
    const [startDate, setStartDate] = useState(new Date().getFullYear() + '-01-01');
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    // --- Helper: Date Filtering ---
    const isInRange = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr); d.setHours(0,0,0,0);
        const start = new Date(startDate); start.setHours(0,0,0,0);
        const end = new Date(endDate); end.setHours(0,0,0,0);
        return d >= start && d <= end;
    };

    // --- Helper: Status ---
    const getSubStatus = (dateString) => {
        if (!dateString) return { label: 'منتهي', color: 'red' };
        const today = new Date();
        const end = new Date(dateString);
        today.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 0) return { label: 'منتهي', color: 'red' };
        if (diffDays <= 7) return { label: 'قارب على الانتهاء', color: 'orange' };
        return { label: 'فعال', color: 'green' };
    };

    // --- 1. Financials ---
    const filteredIncome = payments.filter(p => p.branch === selectedBranch && isInRange(p.date));
    const filteredExpenses = expenses.filter(e => e.branch === selectedBranch && isInRange(e.date));
    const totalIncome = filteredIncome.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const totalExpense = filteredExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const netProfit = totalIncome - totalExpense;

    // --- 2. Admin Notes (Filtered by Date if they have dates, otherwise show all) ---
    // Assuming admin notes might store createdAt. If not, we show all current notes.
    const filteredNotes = adminNotes ? adminNotes.filter(n => isInRange(n.createdAt) || isInRange(n.date)) : [];
    // If no date field exists in notes, show all (fallback)
    const finalNotes = filteredNotes.length > 0 ? filteredNotes : (adminNotes || []);

    // --- 3. Students Data Processing ---
    // We want attendance count within the selected period for EACH student
    const studentReportData = students.map(s => {
        let attendanceCount = 0;
        if (s.attendance) {
            Object.keys(s.attendance).forEach(dateKey => {
                if (isInRange(dateKey)) attendanceCount++;
            });
        }
        return { ...s, attendanceCount };
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
                    body { font-family: 'Cairo', sans-serif; padding: 20px; color: #333; -webkit-print-color-adjust: exact; font-size: 12px; }
                    .header { text-align: center; border-bottom: 3px solid #b45309; padding-bottom: 10px; margin-bottom: 20px; }
                    .logo { height: 60px; margin-bottom: 5px; }
                    h1 { font-size: 20px; color: #b45309; margin: 5px 0; }
                    h2 { font-size: 16px; background: #fff7ed; padding: 8px; border-right: 4px solid #b45309; margin-top: 20px; page-break-after: avoid; }
                    
                    table { width: 100%; border-collapse: collapse; margin-bottom: 15px; font-size: 11px; page-break-inside: auto; }
                    th, td { border: 1px solid #ccc; padding: 6px; text-align: right; }
                    th { background-color: #f3f4f6; font-weight: 700; }
                    tr { page-break-inside: avoid; page-break-after: auto; }
                    
                    .summary-box { display: flex; gap: 10px; margin-bottom: 15px; }
                    .box { flex: 1; border: 1px solid #ddd; padding: 10px; text-align: center; border-radius: 6px; background: #fff; }
                    .val { font-size: 16px; font-weight: bold; display: block; }
                    
                    .status-green { color: green; font-weight: bold; }
                    .status-red { color: red; font-weight: bold; }
                    .status-orange { color: orange; font-weight: bold; }

                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                    <h1>سجل الأكاديمية الشامل</h1>
                    <p>الفرع: <strong>${selectedBranch}</strong> | الفترة: من <strong>${startDate}</strong> إلى <strong>${endDate}</strong></p>
                </div>

                <h2>1. الملخص المالي (Finance Summary)</h2>
                <div class="summary-box">
                    <div class="box" style="border-color: green; background: #f0fdf4;">
                        <span class="val" style="color:green">${totalIncome} JD</span>
                        <span>مجموع الإيرادات</span>
                    </div>
                    <div class="box" style="border-color: red; background: #fef2f2;">
                        <span class="val" style="color:red">${totalExpense} JD</span>
                        <span>مجموع المصاريف</span>
                    </div>
                    <div class="box" style="border-color: blue; background: #eff6ff;">
                        <span class="val" style="color:blue">${netProfit} JD</span>
                        <span>صافي الربح</span>
                    </div>
                </div>

                <div style="display: flex; gap: 10px;">
                    <div style="flex: 1;">
                        <h3 style="font-size:12px; margin-bottom:5px; color:green;">جدول الإيرادات (Income)</h3>
                        <table>
                            <thead><tr><th>التاريخ</th><th>الاسم</th><th>البيان</th><th>المبلغ</th></tr></thead>
                            <tbody>
                                ${filteredIncome.map(p => `<tr><td>${p.date}</td><td>${p.name}</td><td>${p.reason}</td><td>${p.amount}</td></tr>`).join('')}
                                ${filteredIncome.length === 0 ? '<tr><td colspan="4" style="text-align:center">-</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                    <div style="flex: 1;">
                        <h3 style="font-size:12px; margin-bottom:5px; color:red;">جدول المصاريف (Expenses)</h3>
                        <table>
                            <thead><tr><th>التاريخ</th><th>البند</th><th>المبلغ</th></tr></thead>
                            <tbody>
                                ${filteredExpenses.map(e => `<tr><td>${e.date}</td><td>${e.title}</td><td>${e.amount}</td></tr>`).join('')}
                                ${filteredExpenses.length === 0 ? '<tr><td colspan="3" style="text-align:center">-</td></tr>' : ''}
                            </tbody>
                        </table>
                    </div>
                </div>

                <h2>2. ملاحظات الإدارة (Administration Notes)</h2>
                <table>
                    <thead><tr><th>محتوى الملاحظة</th><th>التاريخ (إن وجد)</th></tr></thead>
                    <tbody>
                        ${finalNotes.map(n => `
                            <tr>
                                <td>${n.text || n.content || n.note || 'ملاحظة نصية'}</td>
                                <td style="width:100px">${n.date || n.createdAt?.split('T')[0] || '-'}</td>
                            </tr>
                        `).join('')}
                        ${finalNotes.length === 0 ? '<tr><td colspan="2" style="text-align:center">لا يوجد ملاحظات في هذه الفترة</td></tr>' : ''}
                    </tbody>
                </table>

                <h2>3. سجل الطلاب الشامل (All Students Info)</h2>
                <p style="font-size:10px; color:#666;">يشمل: الحضور في الفترة المحددة، حالة الاشتراك، تاريخ الفحص، والملاحظات الخاصة.</p>
                <table>
                    <thead>
                        <tr>
                            <th style="width:20px">#</th>
                            <th>اسم الطالب</th>
                            <th>الحزام</th>
                            <th>حالة الاشتراك</th>
                            <th>نهاية الاشتراك</th>
                            <th>الحضور (أيام)</th>
                            <th>فحص الحزام القادم</th>
                            <th>ملاحظات الطالب</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${studentReportData.map((s, i) => {
                            const status = getSubStatus(s.subEnd);
                            return `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td style="font-weight:bold">${s.name}</td>
                                    <td>${s.belt}</td>
                                    <td class="status-${status.color}">${status.label}</td>
                                    <td>${s.subEnd || '-'}</td>
                                    <td style="text-align:center; font-weight:bold">${s.attendanceCount}</td>
                                    <td>${s.nextTestDate || '-'}</td>
                                    <td style="color:#555; font-style:italic">${s.note || '-'}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>

                <div style="margin-top: 30px; text-align: left; font-weight: bold;">
                    تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}
                </div>
                
                <script>
                    window.onload = function() { window.print(); }
                </script>
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
                        <FileText className="text-yellow-500"/> أرشيف وسجلات الأكاديمية
                    </h2>
                    <button 
                        onClick={handlePrintFullReport}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black shadow-lg hover:shadow-xl transition-all w-full md:w-auto justify-center"
                    >
                        <Printer size={20}/> طباعة التقرير الشامل (PDF)
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

            {/* Preview Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-green-100 bg-green-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600"><TrendingUp size={20}/></div>
                        <h3 className="font-bold text-gray-600">الإيرادات</h3>
                    </div>
                    <p className="text-3xl font-black text-green-700">{totalIncome} JD</p>
                </Card>

                <Card className="border-red-100 bg-red-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 rounded-lg text-red-600"><TrendingDown size={20}/></div>
                        <h3 className="font-bold text-gray-600">المصاريف</h3>
                    </div>
                    <p className="text-3xl font-black text-red-700">{totalExpense} JD</p>
                </Card>

                <Card className="border-blue-100 bg-blue-50/50">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users size={20}/></div>
                        <h3 className="font-bold text-gray-600">الطلاب في التقرير</h3>
                    </div>
                    <p className="text-3xl font-black text-blue-700">{students.length}</p>
                </Card>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 text-yellow-800 text-sm text-center font-bold">
                اضغط على زر "طباعة التقرير" أعلاه لعرض ملف PDF يحتوي على: الجداول المالية، ملاحظات الإدارة، وسجل الطلاب (الحضور، الاشتراكات، الفحوصات، الملاحظات) بالتفصيل.
            </div>
        </div>
    );
}
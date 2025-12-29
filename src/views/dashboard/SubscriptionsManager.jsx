// src/views/dashboard/SubscriptionsManager.jsx
import React, { useState, useMemo } from 'react';
import { Search, CheckCircle, AlertCircle, XCircle, Clock, Edit3, Printer } from 'lucide-react';
import { Card, StatusBadge, StudentSearch, Button } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

const calculateStatus = (dateString) => {
    if (!dateString) return 'expired';
    const today = new Date();
    const end = new Date(dateString);
    today.setHours(0, 0, 0, 0); end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'expired';
    if (diffDays <= 7) return 'near_end';
    return 'active';
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'active': return 'فعال (Working)';
        case 'near_end': return 'قارب على الانتهاء (About to finish)';
        case 'expired': return 'منتهي (Finished)';
        default: return '-';
    }
};

export default function SubscriptionsManager({ students, studentsCollection, logActivity, selectedBranch }) {
    const [filterStudentId, setFilterStudentId] = useState(null); 
    const [statusFilter, setStatusFilter] = useState('all'); 
    const [editingId, setEditingId] = useState(null);
    const [editDate, setEditDate] = useState('');

    // --- Fast Update Function (تم التعديل: يضيف بناءً على التاريخ الموجود فقط) ---
    const addMonths = async (student, months) => {
        // نأخذ تاريخ انتهاء الطالب الحالي. إذا لم يوجد (طالب جديد)، نأخذ تاريخ اليوم.
        const currentEnd = student.subEnd ? new Date(student.subEnd) : new Date();
        
        // نقوم بإنشاء كائن تاريخ جديد بناءً على التاريخ الحالي للاشتراك
        const newDateObj = new Date(currentEnd);
        
        // نضيف الأشهر للتاريخ الموجود (سواء كان في الماضي أو المستقبل)
        newDateObj.setMonth(newDateObj.getMonth() + months);
        
        // تنسيق التاريخ للنص (YYYY-MM-DD)
        const newDateString = newDateObj.toISOString().split('T')[0];

        if (window.confirm(`تجديد اشتراك ${student.name} لمدة ${months} شهر؟\nمن: ${student.subEnd || 'اليوم'}\nإلى: ${newDateString}`)) {
            await studentsCollection.update(student.id, { subEnd: newDateString });
            
            // تسجيل النشاط باسم الطالب
            if (logActivity) logActivity("تجديد سريع", `تجديد اشتراك للطالب ${student.name} (+${months} شهر) ليصبح ${newDateString}`);
        }
    };

    // --- Manual Save Function ---
    const saveManualDate = async (studentId) => {
        if (!editDate) return;
        
        // البحث عن اسم الطالب لإضافته للسجل
        const student = students.find(s => s.id === studentId);
        const studentName = student ? student.name : 'طالب غير معروف';

        await studentsCollection.update(studentId, { subEnd: editDate });
        
        // تسجيل النشاط
        if (logActivity) logActivity("تعديل اشتراك", `تعديل تاريخ اشتراك للطالب ${studentName} يدوياً إلى ${editDate}`);
        
        setEditingId(null);
    };

    const startEditing = (student) => {
        setEditingId(student.id);
        setEditDate(student.subEnd || new Date().toISOString().split('T')[0]);
    };

    // --- Filtering ---
    const filteredStudents = useMemo(() => {
        return students.filter(s => {
            const matchesStudent = filterStudentId ? s.id === filterStudentId : true;
            const status = calculateStatus(s.subEnd);
            const matchesStatus = statusFilter === 'all' || status === statusFilter;
            return matchesStudent && matchesStatus;
        }).sort((a, b) => new Date(a.subEnd || 0) - new Date(b.subEnd || 0)); 
    }, [students, filterStudentId, statusFilter]);

    // --- Print Report Function ---
    const handlePrintReport = () => {
        const printWin = window.open('', 'PRINT', 'height=800,width=1000');
        const logoUrl = window.location.origin + IMAGES.LOGO;
        const dateNow = new Date().toLocaleDateString('ar-EG');

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>تقرير الاشتراكات - ${selectedBranch || ''}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
                    body { font-family: 'Cairo', sans-serif; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                    .logo { height: 80px; margin-bottom: 10px; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
                    th { background-color: #f3f4f6; }
                    .status-active { color: green; font-weight: bold; }
                    .status-near_end { color: orange; font-weight: bold; }
                    .status-expired { color: red; font-weight: bold; }
                    @media print { button { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                    <h2>تقرير متابعة الاشتراكات</h2>
                    <p>التاريخ: ${dateNow}</p>
                    <p>عدد الطلاب في القائمة: ${filteredStudents.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>الطالب</th>
                            <th>الحزام</th>
                            <th>تاريخ الانتهاء</th>
                            <th>الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredStudents.map((s, i) => {
                            const status = calculateStatus(s.subEnd);
                            const statusText = getStatusLabel(status);
                            const statusClass = `status-${status}`;
                            return `
                                <tr>
                                    <td>${i + 1}</td>
                                    <td>${s.name}</td>
                                    <td>${s.belt}</td>
                                    <td style="direction:ltr; text-align:right">${s.subEnd || '-'}</td>
                                    <td class="${statusClass}">${statusText}</td>
                                </tr>
                            `;
                        }).join('')}
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
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-end sticky top-0 z-20">
                
                {/* 1. Search Dropdown */}
                <div className="relative w-full md:w-1/3">
                    <label className="text-xs font-bold text-gray-500 mb-1 block">بحث عن طالب (Thinker Search)</label>
                    <StudentSearch 
                        students={students} 
                        onSelect={(s) => setFilterStudentId(s.id)} 
                        onClear={() => setFilterStudentId(null)}
                        placeholder="اكتب اسم الطالب..."
                        showAllOption={true}
                    />
                </div>

                {/* 2. Filters */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <button onClick={() => setStatusFilter('all')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        الكل
                    </button>
                    <button onClick={() => setStatusFilter('active')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === 'active' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-600'}`}>
                        ساري المفعول
                    </button>
                    <button onClick={() => setStatusFilter('near_end')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === 'near_end' ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600'}`}>
                        قرب ينتهي
                    </button>
                    <button onClick={() => setStatusFilter('expired')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${statusFilter === 'expired' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-600'}`}>
                        منتهي
                    </button>
                </div>

                {/* 3. Print Button */}
                <Button onClick={handlePrintReport} className="bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200">
                    <Printer size={18} className="ml-2"/> طباعة القائمة
                </Button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Card noPadding>
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="p-4">الطالب</th>
                                <th className="p-4">الحالة</th>
                                <th className="p-4">تاريخ الانتهاء الحالي</th>
                                <th className="p-4 text-center">تجديد سريع</th>
                                <th className="p-4 text-center">تعديل يدوي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredStudents.map(s => (
                                <tr key={s.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-bold text-gray-800">{s.name}</td>
                                    <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                                    
                                    <td className="p-4 font-mono text-gray-600 dir-ltr text-right">
                                        {s.subEnd || 'غير محدد'}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => addMonths(s, 1)} className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold transition border border-green-200">+1 شهر</button>
                                            <button onClick={() => addMonths(s, 2)} className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold transition border border-blue-200">+2 شهر</button>
                                            <button onClick={() => addMonths(s, 3)} className="bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-bold transition border border-purple-200">+3 شهر</button>
                                        </div>
                                    </td>

                                    <td className="p-4 text-center">
                                        {editingId === s.id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <input 
                                                    type="date" 
                                                    className="border rounded p-1 text-xs" 
                                                    value={editDate} 
                                                    onChange={e => setEditDate(e.target.value)}
                                                />
                                                <button onClick={() => saveManualDate(s.id)} className="text-green-600 hover:bg-green-50 p-1 rounded"><CheckCircle size={18}/></button>
                                                <button onClick={() => setEditingId(null)} className="text-red-500 hover:bg-red-50 p-1 rounded"><XCircle size={18}/></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => startEditing(s)} className="text-gray-400 hover:text-blue-600 flex items-center justify-center gap-1 mx-auto">
                                                <Edit3 size={16}/> 
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center p-8 text-gray-400">لا يوجد طلاب مطابقين للبحث</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4">
                {filteredStudents.map(s => {
                    const status = calculateStatus(s.subEnd);
                    return (
                        <div key={s.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-1 h-full ${status === 'active' ? 'bg-green-500' : status === 'near_end' ? 'bg-orange-500' : 'bg-red-500'}`}></div>
                            
                            <div className="flex justify-between items-start mb-4 pl-2">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{s.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
                                        <Clock size={12}/> ينتهي: {s.subEnd || 'غير محدد'}
                                    </div>
                                </div>
                                <StatusBadge status={status}/>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <button onClick={() => addMonths(s, 1)} className="bg-green-50 text-green-700 py-2 rounded-lg text-xs font-bold border border-green-100 hover:bg-green-100">+ شهر</button>
                                <button onClick={() => addMonths(s, 2)} className="bg-blue-50 text-blue-700 py-2 rounded-lg text-xs font-bold border border-blue-100 hover:bg-blue-100">+ شهرين</button>
                                <button onClick={() => addMonths(s, 3)} className="bg-purple-50 text-purple-700 py-2 rounded-lg text-xs font-bold border border-purple-100 hover:bg-purple-100">+ 3 شهور</button>
                            </div>

                            <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500 whitespace-nowrap">تعديل يدوي:</span>
                                <input 
                                    type="date" 
                                    className="flex-1 bg-white border border-gray-200 rounded p-1 text-xs outline-none focus:border-blue-500"
                                    defaultValue={s.subEnd}
                                    onBlur={(e) => {
                                        if (e.target.value !== s.subEnd) {
                                            if(window.confirm("حفظ التاريخ الجديد؟")) {
                                                studentsCollection.update(s.id, { subEnd: e.target.value });
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
                {filteredStudents.length === 0 && (
                    <div className="text-center p-10 text-gray-400 bg-white rounded-xl border border-dashed">
                        لا يوجد نتائج
                    </div>
                )}
            </div>
        </div>
    );
}
// src/views/dashboard/SubscriptionsManager.jsx
import React, { useState, useMemo } from 'react';
import { Search, CheckCircle, AlertCircle, XCircle, Clock, Edit3, Printer, Calendar, Save, RefreshCw } from 'lucide-react';
import { Card, StatusBadge, StudentSearch, Button } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

// --- Helper: Date Formatter (dd/mm/yyyy) ---
const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    return `${day}/${month}/${year}`;
};

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

    // --- Fast Update Function ---
    const addMonths = async (student, months) => {
        const currentEnd = student.subEnd ? new Date(student.subEnd) : new Date();
        const newDateObj = new Date(currentEnd);
        newDateObj.setMonth(newDateObj.getMonth() + months);
        const newDateString = newDateObj.toISOString().split('T')[0];

        const displayCurrentEnd = student.subEnd ? formatDate(student.subEnd) : 'اليوم';
        const displayNewEnd = formatDate(newDateString);

        if (window.confirm(`تجديد اشتراك ${student.name} لمدة ${months} شهر؟\nمن: ${displayCurrentEnd}\nإلى: ${displayNewEnd}`)) {
            await studentsCollection.update(student.id, { subEnd: newDateString });
            if (logActivity) logActivity("تجديد سريع", `تجديد اشتراك للطالب ${student.name} (+${months} شهر) ليصبح ${displayNewEnd}`);
        }
    };

    // --- Manual Save Function ---
    const saveManualDate = async (studentId) => {
        if (!editDate) return;
        const student = students.find(s => s.id === studentId);
        const studentName = student ? student.name : 'طالب غير معروف';

        await studentsCollection.update(studentId, { subEnd: editDate });
        if (logActivity) logActivity("تعديل اشتراك", `تعديل تاريخ اشتراك للطالب ${studentName} يدوياً إلى ${formatDate(editDate)}`);
        
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
        const dateNow = formatDate(new Date());

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
                                    <td style="direction:ltr; text-align:right">${formatDate(s.subEnd)}</td>
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
        <div className="space-y-6 animate-fade-in pb-20 md:pb-0 font-sans">
            {/* Toolbar */}
            <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-black/20 border border-slate-800/60 flex flex-col md:flex-row gap-4 justify-between items-end sticky top-0 z-20 backdrop-blur-md bg-opacity-90">
                
                {/* 1. Search Dropdown */}
                <div className="relative w-full md:w-1/3">
                    <label className="text-xs font-bold text-slate-400 mb-1 block flex items-center gap-1">
                        <Search size={12}/> بحث عن طالب (Smart Search)
                    </label>
                    <StudentSearch 
                        students={students} 
                        onSelect={(s) => setFilterStudentId(s.id)} 
                        onClear={() => setFilterStudentId(null)}
                        placeholder="اكتب اسم الطالب..."
                        showAllOption={true}
                    />
                </div>

                {/* 2. Filters */}
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
                    <button onClick={() => setStatusFilter('all')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${statusFilter === 'all' ? 'bg-slate-700 text-white border-slate-600' : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>
                        الكل
                    </button>
                    <button onClick={() => setStatusFilter('active')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${statusFilter === 'active' ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-950 text-emerald-500 border-slate-800 hover:bg-emerald-900/20'}`}>
                        ساري المفعول
                    </button>
                    <button onClick={() => setStatusFilter('near_end')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${statusFilter === 'near_end' ? 'bg-yellow-500 text-slate-900 border-yellow-500 shadow-lg shadow-yellow-500/20' : 'bg-slate-950 text-yellow-500 border-slate-800 hover:bg-yellow-900/20'}`}>
                        قرب ينتهي
                    </button>
                    <button onClick={() => setStatusFilter('expired')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${statusFilter === 'expired' ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-500/20' : 'bg-slate-950 text-red-500 border-slate-800 hover:bg-red-900/20'}`}>
                        منتهي
                    </button>
                </div>

                {/* 3. Print Button */}
                <Button onClick={handlePrintReport} className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 border-none">
                    <Printer size={18} className="ml-2"/> طباعة القائمة
                </Button>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block">
                <Card noPadding className="bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="p-4 font-bold">الطالب</th>
                                <th className="p-4 font-bold">الحالة</th>
                                <th className="p-4 font-bold">تاريخ الانتهاء الحالي</th>
                                <th className="p-4 text-center">تجديد سريع</th>
                                <th className="p-4 text-center">تعديل يدوي</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900">
                            {filteredStudents.map(s => (
                                <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-bold text-slate-200">{s.name}</td>
                                    <td className="p-4"><StatusBadge status={calculateStatus(s.subEnd)}/></td>
                                    
                                    <td className="p-4 font-mono text-slate-400 dir-ltr text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {formatDate(s.subEnd)} <Calendar size={14} className="opacity-50"/>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button onClick={() => addMonths(s, 1)} className="bg-emerald-900/20 hover:bg-emerald-600 hover:text-white text-emerald-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-emerald-500/20">+1 شهر</button>
                                            <button onClick={() => addMonths(s, 2)} className="bg-blue-900/20 hover:bg-blue-600 hover:text-white text-blue-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-blue-500/20">+2 شهر</button>
                                            <button onClick={() => addMonths(s, 3)} className="bg-purple-900/20 hover:bg-purple-600 hover:text-white text-purple-500 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-purple-500/20">+3 شهر</button>
                                        </div>
                                    </td>

                                    <td className="p-4 text-center">
                                        {editingId === s.id ? (
                                            <div className="flex items-center justify-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-700 animate-in fade-in zoom-in-95">
                                                <input 
                                                    type="date" 
                                                    className="bg-transparent border-none text-slate-200 text-xs outline-none font-mono" 
                                                    value={editDate} 
                                                    onChange={e => setEditDate(e.target.value)}
                                                />
                                                <button onClick={() => saveManualDate(s.id)} className="text-emerald-500 hover:bg-emerald-900/30 p-1 rounded transition-colors"><CheckCircle size={16}/></button>
                                                <button onClick={() => setEditingId(null)} className="text-red-500 hover:bg-red-900/30 p-1 rounded transition-colors"><XCircle size={16}/></button>
                                            </div>
                                        ) : (
                                            <button onClick={() => startEditing(s)} className="text-slate-500 hover:text-yellow-500 flex items-center justify-center gap-1 mx-auto transition-colors p-2 hover:bg-slate-800 rounded-lg">
                                                <Edit3 size={16}/> 
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center p-12 text-slate-500">لا يوجد طلاب مطابقين للبحث</td>
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
                        <div key={s.id} className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden group">
                            <div className={`absolute top-0 left-0 w-1 h-full ${status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : status === 'near_end' ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-red-600 shadow-[0_0_10px_#dc2626]'}`}></div>
                            
                            <div className="flex justify-between items-start mb-4 pl-2">
                                <div>
                                    <h3 className="font-bold text-slate-100 text-lg group-hover:text-yellow-500 transition-colors">{s.name}</h3>
                                    <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs font-mono">
                                        <Clock size={12}/> ينتهي: {formatDate(s.subEnd)}
                                    </div>
                                </div>
                                <StatusBadge status={status}/>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-3">
                                <button onClick={() => addMonths(s, 1)} className="bg-emerald-900/10 text-emerald-500 py-2.5 rounded-lg text-xs font-bold border border-emerald-500/20 hover:bg-emerald-900/30 transition-all">+ شهر</button>
                                <button onClick={() => addMonths(s, 2)} className="bg-blue-900/10 text-blue-500 py-2.5 rounded-lg text-xs font-bold border border-blue-500/20 hover:bg-blue-900/30 transition-all">+ شهرين</button>
                                <button onClick={() => addMonths(s, 3)} className="bg-purple-900/10 text-purple-500 py-2.5 rounded-lg text-xs font-bold border border-purple-500/20 hover:bg-purple-900/30 transition-all">+ 3 شهور</button>
                            </div>

                            <div className="bg-slate-950 p-3 rounded-lg flex items-center gap-3 border border-slate-800">
                                <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1"><RefreshCw size={12}/> تعديل:</span>
                                <input 
                                    type="date" 
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded p-1.5 text-xs outline-none focus:border-yellow-500 text-slate-300 font-mono text-center"
                                    defaultValue={s.subEnd}
                                    onBlur={(e) => {
                                        if (e.target.value !== s.subEnd) {
                                            if(window.confirm(`حفظ التاريخ الجديد (${formatDate(e.target.value)})؟`)) {
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
                    <div className="text-center p-10 text-slate-500 bg-slate-900 rounded-xl border border-slate-800 border-dashed">
                        لا يوجد نتائج
                    </div>
                )}
            </div>
        </div>
    );
}
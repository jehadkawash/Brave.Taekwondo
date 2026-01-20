// src/views/dashboard/BeltTestsManager.jsx
import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUp, Calendar, CheckCircle, Award, Edit3 } from 'lucide-react';
import { Card } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants'; 

// دالة مساعدة لتلوين الأحزمة
const getBeltColor = (beltName) => {
    if (!beltName) return 'bg-slate-800 text-slate-300 border-slate-700';
    if (beltName.includes('أبيض')) return 'bg-slate-200 text-slate-900 border-slate-300';
    if (beltName.includes('أصفر')) return 'bg-yellow-400 text-yellow-900 border-yellow-500';
    if (beltName.includes('أخضر')) return 'bg-green-600 text-white border-green-700';
    if (beltName.includes('أزرق')) return 'bg-blue-600 text-white border-blue-700';
    if (beltName.includes('بني')) return 'bg-[#8B4513] text-white border-[#5D2906]'; 
    if (beltName.includes('أحمر')) return 'bg-red-600 text-white border-red-700';
    if (beltName.includes('أسود')) return 'bg-black text-white border-slate-700';
    return 'bg-slate-800 text-slate-300';
};

export default function BeltTestsManager({ students, studentsCollection, logActivity }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('dateAsc'); 

    // --- العمليات ---
    
    // 1. ترفيع الطالب للحزام التالي (الزر الذكي)
    const handlePromote = async (student) => {
        const currentIdx = BELTS.indexOf(student.belt);
        if (currentIdx === -1 || currentIdx >= BELTS.length - 1) return alert("هذا الطالب في أعلى حزام مسجل أو الحزام غير معروف");
        
        const nextBelt = BELTS[currentIdx + 1];
        if (confirm(`هل أنت متأكد من ترفيع ${student.name} إلى الحزام (${nextBelt})؟`)) {
            await studentsCollection.update(student.id, { belt: nextBelt });
            if (logActivity) logActivity("ترفيع حزام", `تم ترفيع ${student.name} إلى ${nextBelt}`);
        }
    };

    // 2. تغيير الحزام يدوياً (للتصحيح)
    const handleManualBeltChange = async (student, newBelt) => {
        if(student.belt === newBelt) return;
        
        if (confirm(`تغيير حزام الطالب ${student.name} يدوياً إلى ${newBelt}؟`)) {
            await studentsCollection.update(student.id, { belt: newBelt });
            if (logActivity) logActivity("تعديل حزام يدوي", `تغيير حزام ${student.name} من ${student.belt} إلى ${newBelt}`);
        }
    };

    // 3. تحديث تاريخ الفحص القادم (الطريقة الأصلية المستقرة)
    const handleDateChange = async (studentId, newDate) => {
        // newDate تأتي مباشرة من الـ input بصيغة yyyy-mm-dd أو نص فارغ
        await studentsCollection.update(studentId, { nextTestDate: newDate });
    };

    // --- الفلترة والترتيب ---
    const processedStudents = useMemo(() => {
        let result = [...students];

        if (searchTerm) {
            result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        result.sort((a, b) => {
            if (sortOption === 'dateAsc' || sortOption === 'dateDesc') {
                const dateA = a.nextTestDate ? new Date(a.nextTestDate) : new Date('2099-12-31');
                const dateB = b.nextTestDate ? new Date(b.nextTestDate) : new Date('2099-12-31');
                return sortOption === 'dateAsc' ? dateA - dateB : dateB - dateA;
            }
            if (sortOption === 'beltAsc') return BELTS.indexOf(a.belt) - BELTS.indexOf(b.belt); 
            if (sortOption === 'beltDesc') return BELTS.indexOf(b.belt) - BELTS.indexOf(a.belt); 
            return 0;
        });

        return result;
    }, [students, searchTerm, sortOption]);

    return (
        <div className="space-y-6 animate-fade-in pb-20 md:pb-0 font-sans">
            {/* شريط الأدوات العلوي */}
            <div className="bg-slate-900 p-4 rounded-2xl shadow-lg shadow-black/20 border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-20 backdrop-blur-md bg-opacity-95">
                {/* البحث */}
                <div className="relative w-full md:w-1/3">
                    <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-500 pointer-events-none"/>
                    <input 
                        className="w-full bg-slate-950 text-slate-200 pl-4 pr-10 py-2.5 border border-slate-700 rounded-xl focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50 outline-none transition-all placeholder-slate-600"
                        placeholder="ابحث عن اسم الطالب..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* الفرز */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <select 
                            className="w-full appearance-none bg-slate-950 border border-slate-700 text-slate-300 py-2.5 pr-10 pl-4 rounded-xl focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-bold"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="dateAsc">📅 تاريخ الفحص (الأقرب أولاً)</option>
                            <option value="dateDesc">📅 تاريخ الفحص (الأبعد أولاً)</option>
                            <option value="beltDesc">🥋 ترتيب الأحزمة (من الأعلى)</option>
                            <option value="beltAsc">🥋 ترتيب الأحزمة (من المبتدئ)</option>
                        </select>
                        <Filter size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-slate-500 pointer-events-none"/>
                    </div>
                </div>
            </div>

            {/* --- عرض الجدول (للحواسيب) --- */}
            <div className="hidden md:block">
                <Card className="p-0 overflow-hidden bg-slate-900 border border-slate-800 shadow-xl">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="p-4">الطالب</th>
                                <th className="p-4">الحزام الحالي (تعديل يدوي)</th>
                                <th className="p-4">تاريخ الفحص القادم</th>
                                <th className="p-4 text-center">إجراءات سريعة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 bg-slate-900">
                            {processedStudents.map(student => {
                                const beltIdx = BELTS.indexOf(student.belt);
                                const isMaxBelt = beltIdx >= BELTS.length - 1;
                                
                                return (
                                    <tr key={student.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 font-bold text-slate-200">{student.name}</td>
                                        
                                        <td className="p-4">
                                            {/* القائمة المنسدلة للتعديل اليدوي */}
                                            <div className="relative w-fit">
                                                <select 
                                                    className={`appearance-none pl-8 pr-3 py-1.5 rounded-lg font-bold text-xs shadow-sm border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 focus:ring-yellow-500 ${getBeltColor(student.belt)}`}
                                                    value={student.belt}
                                                    onChange={(e) => handleManualBeltChange(student, e.target.value)}
                                                >
                                                    {BELTS.map((b) => (
                                                        <option key={b} value={b} className="bg-slate-800 text-slate-200">{b}</option>
                                                    ))}
                                                </select>
                                                <Edit3 size={12} className="absolute top-1/2 -translate-y-1/2 left-2 opacity-50 pointer-events-none text-slate-700 mix-blend-difference"/>
                                            </div>
                                        </td>

                                        <td className="p-4">
                                            {/* ✅ منتقي التاريخ الأصلي (Native Picker) */}
                                            <div className="flex items-center gap-2 bg-slate-950 w-fit p-1 rounded-lg border border-slate-700 hover:border-yellow-500/50 transition-colors">
                                                <Calendar size={16} className="text-slate-500 mr-1"/>
                                                <input 
                                                    type="date" 
                                                    className="bg-transparent outline-none text-slate-300 font-mono text-xs cursor-pointer focus:text-white"
                                                    value={student.nextTestDate || ''}
                                                    onChange={(e) => handleDateChange(student.id, e.target.value)}
                                                />
                                            </div>
                                        </td>

                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handlePromote(student)}
                                                disabled={isMaxBelt}
                                                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all mx-auto
                                                    ${isMaxBelt 
                                                        ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700' 
                                                        : 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/20'
                                                    }`}
                                                title="ترفيع للحزام التالي مباشرة"
                                            >
                                                {isMaxBelt ? <CheckCircle size={14}/> : <ArrowUp size={14}/>}
                                                {isMaxBelt ? 'أعلى رتبة' : 'ترفيع تلقائي'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* --- عرض البطاقات (للموبايل) --- */}
            <div className="md:hidden grid gap-4">
                {processedStudents.map(student => {
                      const beltIdx = BELTS.indexOf(student.belt);
                      const isMaxBelt = beltIdx >= BELTS.length - 1;

                      return (
                        <div key={student.id} className="bg-slate-900 p-4 rounded-xl shadow-lg border border-slate-800 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-200 text-lg">{student.name}</h3>
                                    
                                    {/* تعديل يدوي للموبايل */}
                                    <div className="mt-2 relative inline-block">
                                         <select 
                                            className={`appearance-none pl-8 pr-4 py-1 rounded text-[10px] font-bold border w-full ${getBeltColor(student.belt)}`}
                                            value={student.belt}
                                            onChange={(e) => handleManualBeltChange(student, e.target.value)}
                                        >
                                            {BELTS.map((b) => (
                                                <option key={b} value={b} className="bg-slate-800 text-slate-200">{b}</option>
                                            ))}
                                        </select>
                                        <Edit3 size={10} className="absolute top-1/2 -translate-y-1/2 left-2 opacity-50 pointer-events-none text-slate-800 mix-blend-difference"/>
                                    </div>
                                </div>
                                <div className="text-slate-500 bg-slate-950 p-2 rounded-full border border-slate-800">
                                    <Award size={20}/>
                                </div>
                            </div>

                            {/* ✅ منتقي التاريخ للموبايل (الأصلي) */}
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                <label className="text-[10px] font-bold text-slate-500 mb-1 block">تاريخ الفحص القادم</label>
                                <div className="flex items-center gap-2">
                                    <Calendar size={16} className="text-slate-600"/>
                                    <input 
                                        type="date" 
                                        className="bg-transparent w-full outline-none text-slate-200 font-bold text-sm"
                                        value={student.nextTestDate || ''}
                                        onChange={(e) => handleDateChange(student.id, e.target.value)}
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={() => handlePromote(student)}
                                disabled={isMaxBelt}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                    ${isMaxBelt 
                                        ? 'bg-slate-800 text-slate-600 border border-slate-700' 
                                        : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
                                    }`}
                            >
                                {isMaxBelt ? <CheckCircle size={18}/> : <ArrowUp size={18}/>}
                                {isMaxBelt ? 'وصل لأعلى رتبة' : 'ترفيع للحزام التالي'}
                            </button>
                        </div>
                      );
                })}
            </div>
            
            {processedStudents.length === 0 && (
                <div className="text-center py-10 text-slate-600">لا يوجد طلاب مطابقين للبحث</div>
            )}
        </div>
    );
}
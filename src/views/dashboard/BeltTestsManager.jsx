// src/views/dashboard/BeltTestsManager.jsx
import React, { useState, useMemo, forwardRef } from 'react';
import { Search, Filter, ArrowUp, Calendar, CheckCircle, Award, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

// --- Imports for the new Date Picker ---
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ar } from 'date-fns/locale'; // Import Arabic locale
registerLocale('ar', ar); // Register it

// --- Styles for the DatePicker to match your Yellow Theme ---
// Add this CSS to your global css file or keep it here if using styled-components/embedded styles
const datePickerStyles = `
  .react-datepicker {
    font-family: inherit;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  .react-datepicker__header {
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding-top: 10px;
  }
  .react-datepicker__current-month {
    font-weight: 800;
    color: #1f2937;
    margin-bottom: 5px;
  }
  .react-datepicker__day-name {
    color: #9ca3af;
    font-weight: 700;
  }
  .react-datepicker__day {
    margin: 0.2rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s;
  }
  .react-datepicker__day--selected {
    background-color: #fbbf24 !important; /* Yellow-400 */
    color: #1f2937 !important;
    font-weight: bold;
  }
  .react-datepicker__day--keyboard-selected {
    background-color: #fef3c7 !important;
    color: #1f2937 !important;
  }
  .react-datepicker__day:hover {
    background-color: #fef3c7 !important;
    border-radius: 8px;
  }
  .react-datepicker__triangle {
    display: none;
  }
`;

// Helper for Belt Colors
const getBeltColor = (beltName) => {
    if (!beltName) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (beltName.includes('أبيض')) return 'bg-white text-gray-800 border-gray-200 border';
    if (beltName.includes('أصفر')) return 'bg-yellow-300 text-yellow-900 border-yellow-400';
    if (beltName.includes('أخضر')) return 'bg-green-600 text-white border-green-700';
    if (beltName.includes('أزرق')) return 'bg-blue-600 text-white border-blue-700';
    if (beltName.includes('بني')) return 'bg-[#8B4513] text-white border-[#5D2906]'; 
    if (beltName.includes('أحمر')) return 'bg-red-600 text-white border-red-700';
    if (beltName.includes('أسود')) return 'bg-black text-white border-gray-800';
    return 'bg-gray-100 text-gray-800';
};

// --- Custom Input Component for the Date Picker ---
const CustomDateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
    <button 
        className="flex items-center gap-2 bg-white border border-gray-200 hover:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition-all rounded-lg px-3 py-1.5 w-full group"
        onClick={onClick}
        ref={ref}
    >
        <Calendar size={15} className="text-gray-400 group-hover:text-yellow-500 transition-colors" />
        <span className={`text-xs font-bold font-mono ${value ? 'text-gray-700' : 'text-gray-400'}`}>
            {value || placeholder || "اختر التاريخ"}
        </span>
    </button>
));

export default function BeltTestsManager({ students, studentsCollection, logActivity }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('dateAsc'); 

    // Inject Styles
    React.useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = datePickerStyles;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // --- Actions ---
    const handlePromote = async (student) => {
        const currentIdx = BELTS.indexOf(student.belt);
        if (currentIdx === -1 || currentIdx >= BELTS.length - 1) return alert("هذا الطالب في أعلى حزام مسجل أو الحزام غير معروف");
        
        const nextBelt = BELTS[currentIdx + 1];
        if (confirm(`هل أنت متأكد من ترفيع ${student.name} إلى الحزام (${nextBelt})؟`)) {
            await studentsCollection.update(student.id, { belt: nextBelt });
            if (logActivity) logActivity("ترفيع حزام", `تم ترفيع ${student.name} إلى ${nextBelt}`);
        }
    };

    const handleManualBeltChange = async (student, newBelt) => {
        if(student.belt === newBelt) return;
        if (confirm(`تغيير حزام الطالب ${student.name} يدوياً إلى ${newBelt}؟`)) {
            await studentsCollection.update(student.id, { belt: newBelt });
            if (logActivity) logActivity("تعديل حزام يدوي", `تغيير حزام ${student.name} من ${student.belt} إلى ${newBelt}`);
        }
    };

    // Updated Date Handler for DatePicker
    const handleDateChange = async (studentId, date) => {
        // Convert JS Date object to YYYY-MM-DD string for storage
        const dateString = date ? date.toISOString().split('T')[0] : '';
        await studentsCollection.update(studentId, { nextTestDate: dateString });
    };

    const processedStudents = useMemo(() => {
        let result = [...students];
        if (searchTerm) result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
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
        <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
            {/* Toolbar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center sticky top-0 z-20">
                <div className="relative w-full md:w-1/3">
                    <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400 pointer-events-none"/>
                    <input 
                        className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-100 rounded-xl focus:border-yellow-500 outline-none transition-all"
                        placeholder="ابحث عن اسم الطالب..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-64">
                        <select 
                            className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-2.5 pr-10 pl-4 rounded-xl focus:outline-none focus:border-yellow-500 cursor-pointer text-sm font-bold"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="dateAsc">📅 تاريخ الفحص (الأقرب أولاً)</option>
                            <option value="dateDesc">📅 تاريخ الفحص (الأبعد أولاً)</option>
                            <option value="beltDesc">🥋 ترتيب الأحزمة (من الأعلى)</option>
                            <option value="beltAsc">🥋 ترتيب الأحزمة (من المبتدئ)</option>
                        </select>
                        <Filter size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 pointer-events-none"/>
                    </div>
                </div>
            </div>

            {/* --- DESKTOP VIEW --- */}
            <div className="hidden md:block">
                <Card className="p-0 overflow-hidden">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-gray-50 text-gray-600 border-b">
                            <tr>
                                <th className="p-4">الطالب</th>
                                <th className="p-4">الحزام الحالي</th>
                                <th className="p-4 w-64">تاريخ الفحص القادم</th>
                                <th className="p-4 text-center">إجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {processedStudents.map(student => {
                                const beltIdx = BELTS.indexOf(student.belt);
                                const isMaxBelt = beltIdx >= BELTS.length - 1;
                                
                                return (
                                    <tr key={student.id} className="hover:bg-yellow-50/30 transition-colors">
                                        <td className="p-4 font-bold text-gray-800">{student.name}</td>
                                        <td className="p-4">
                                            <div className="relative w-fit">
                                                <select 
                                                    className={`appearance-none pl-8 pr-3 py-1.5 rounded-lg font-bold text-xs shadow-sm border cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 focus:ring-yellow-400 ${getBeltColor(student.belt)}`}
                                                    value={student.belt}
                                                    onChange={(e) => handleManualBeltChange(student, e.target.value)}
                                                >
                                                    {BELTS.map((b) => (
                                                        <option key={b} value={b} className="bg-white text-gray-800">{b}</option>
                                                    ))}
                                                </select>
                                                <Edit3 size={12} className="absolute top-1/2 -translate-y-1/2 left-2 opacity-50 pointer-events-none"/>
                                            </div>
                                        </td>
                                        
                                        {/* New Date Picker Desktop */}
                                        <td className="p-4">
                                            <DatePicker 
                                                selected={student.nextTestDate ? new Date(student.nextTestDate) : null}
                                                onChange={(date) => handleDateChange(student.id, date)}
                                                dateFormat="yyyy/MM/dd"
                                                locale="ar"
                                                placeholderText="حدد موعد الفحص"
                                                customInput={<CustomDateInput />}
                                                popperPlacement="bottom-start"
                                                isClearable
                                                showPopperArrow={false}
                                            />
                                        </td>

                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handlePromote(student)}
                                                disabled={isMaxBelt}
                                                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all mx-auto
                                                    ${isMaxBelt 
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                        : 'bg-green-100 text-green-700 hover:bg-green-600 hover:text-white hover:shadow-lg hover:shadow-green-500/20'
                                                    }`}
                                            >
                                                {isMaxBelt ? <CheckCircle size={14}/> : <ArrowUp size={14}/>}
                                                {isMaxBelt ? 'أعلى رتبة' : 'ترفيع'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </Card>
            </div>

            {/* --- MOBILE VIEW --- */}
            <div className="md:hidden grid gap-4">
                {processedStudents.map(student => {
                      const beltIdx = BELTS.indexOf(student.belt);
                      const isMaxBelt = beltIdx >= BELTS.length - 1;

                      return (
                        <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{student.name}</h3>
                                    <div className="mt-2 relative inline-block">
                                         <select 
                                            className={`appearance-none pl-8 pr-4 py-1 rounded text-[10px] font-bold border w-full ${getBeltColor(student.belt)}`}
                                            value={student.belt}
                                            onChange={(e) => handleManualBeltChange(student, e.target.value)}
                                        >
                                            {BELTS.map((b) => (
                                                <option key={b} value={b} className="bg-white text-gray-800">{b}</option>
                                            ))}
                                        </select>
                                        <Edit3 size={10} className="absolute top-1/2 -translate-y-1/2 left-2 opacity-50 pointer-events-none"/>
                                    </div>
                                </div>
                                <div className="text-gray-400 bg-gray-50 p-2 rounded-full">
                                    <Award size={20}/>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <label className="text-[10px] font-bold text-gray-500 mb-1 block">تاريخ الفحص القادم</label>
                                {/* New Date Picker Mobile */}
                                <div className="w-full">
                                    <DatePicker 
                                        selected={student.nextTestDate ? new Date(student.nextTestDate) : null}
                                        onChange={(date) => handleDateChange(student.id, date)}
                                        dateFormat="yyyy/MM/dd"
                                        locale="ar"
                                        placeholderText="--/--/----"
                                        customInput={<CustomDateInput />}
                                        withPortal // Opens as a modal on mobile for better UX
                                        isClearable
                                        portalId="root-portal" 
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={() => handlePromote(student)}
                                disabled={isMaxBelt}
                                className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                    ${isMaxBelt 
                                        ? 'bg-gray-100 text-gray-400' 
                                        : 'bg-green-600 text-white shadow-lg shadow-green-600/20 active:scale-95'
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
                <div className="text-center py-10 text-gray-400">لا يوجد طلاب مطابقين للبحث</div>
            )}
        </div>
    );
}
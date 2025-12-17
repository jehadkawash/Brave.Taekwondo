// src/views/dashboard/AttendanceManager.jsx
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, UserCheck, X, 
  Search, ArrowUp, ArrowDown, Save, Layers, Calendar 
} from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';

export default function AttendanceManager({ students, studentsCollection }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayForMobile, setSelectedDayForMobile] = useState(new Date().getDate());
  
  // --- States for Search & Pagination & Reordering ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isReordering, setIsReordering] = useState(false);

  // --- دوال التاريخ والفلترة الزمنية ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
  
  // توليد قائمة سنوات (مثلاً من 2023 إلى 2030)
  const yearsRange = Array.from({length: 8}, (_, i) => 2023 + i);

  const updateDate = (newYear, newMonth) => {
      const d = new Date(currentDate);
      if (newYear !== null) d.setFullYear(newYear);
      if (newMonth !== null) d.setMonth(newMonth);
      setCurrentDate(d);
      setSelectedDayForMobile(1); // إعادة تعيين اليوم عند تغيير التاريخ
  };

  const changeDayMobile = (inc) => {
      const daysInM = new Date(year, month + 1, 0).getDate();
      let newDay = selectedDayForMobile + inc;
      if (newDay > daysInM) newDay = daysInM; if (newDay < 1) newDay = 1;
      setSelectedDayForMobile(newDay);
  };

  // --- 1. منطق المعالجة والبحث والترتيب ---
  const processedStudents = useMemo(() => {
      let result = [...students];

      // أ) الترتيب
      result.sort((a, b) => {
          const orderA = a.customOrder !== undefined ? a.customOrder : 999999;
          const orderB = b.customOrder !== undefined ? b.customOrder : 999999;
          return orderA - orderB;
      });

      // ب) البحث الذكي
      if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          result = result.filter(s => s.name.toLowerCase().includes(lowerTerm));
      }

      return result;
  }, [students, searchTerm]);

  // --- 2. منطق الصفحات ---
  const totalPages = Math.ceil(processedStudents.length / itemsPerPage);
  const displayedStudents = isReordering 
      ? processedStudents 
      : processedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- دوال التفاعل ---
  const toggleCheck = async (sid, day) => { 
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; 
      const student = students.find(s => s.id === sid); 
      const newAtt = { ...(student.attendance || {}) }; 
      if (newAtt[dateStr]) delete newAtt[dateStr]; else newAtt[dateStr] = true; 
      await studentsCollection.update(sid, { attendance: newAtt }); 
  };

  const moveStudent = async (index, direction) => {
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= processedStudents.length) return;
      const studentA = processedStudents[index];
      const studentB = processedStudents[newIndex];
      const orderA = studentA.customOrder || index;
      const orderB = studentB.customOrder || newIndex;
      await studentsCollection.update(studentA.id, { customOrder: orderB });
      await studentsCollection.update(studentB.id, { customOrder: orderA });
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* --- شريط الأدوات العلوي (محسن) --- */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-4">
        
        {/* 1. فلترة التاريخ (سنة / شهر) */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 w-full xl:w-auto justify-center xl:justify-start">
            <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-500"/>
                <span className="text-sm font-bold text-gray-700 hidden sm:inline">السجل الزمني:</span>
            </div>
            
            {/* اختيار الشهر */}
            <select 
                className="bg-white border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block p-2 font-bold cursor-pointer hover:bg-gray-50"
                value={month}
                onChange={(e) => updateDate(null, parseInt(e.target.value))}
            >
                {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>

            {/* اختيار السنة */}
            <select 
                className="bg-white border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-yellow-500 focus:border-yellow-500 block p-2 font-bold cursor-pointer hover:bg-gray-50"
                value={year}
                onChange={(e) => updateDate(parseInt(e.target.value), null)}
            >
                {yearsRange.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>

            {/* أزرار تنقل سريع */}
            <div className="flex gap-1 mr-2 border-r pr-2 border-gray-300">
                <button onClick={() => updateDate(null, month - 1)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="الشهر السابق"><ChevronRight size={16}/></button>
                <button onClick={() => updateDate(null, month + 1)} className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-600" title="الشهر القادم"><ChevronLeft size={16}/></button>
            </div>
        </div>

        {/* 2. البحث والتحكم */}
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="ابحث عن طالب..." 
                    className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-100 rounded-xl focus:border-yellow-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    list="student-names"
                />
                <datalist id="student-names">
                    {students.map(s => <option key={s.id} value={s.name} />)}
                </datalist>
            </div>

            <Button 
                variant={isReordering ? "default" : "outline"}
                onClick={() => setIsReordering(!isReordering)}
                className={`gap-2 whitespace-nowrap ${isReordering ? "bg-blue-600 text-white hover:bg-blue-700" : ""}`}
            >
                {isReordering ? <Save size={18}/> : <Layers size={18}/>}
                {isReordering ? "حفظ" : "ترتيب"}
            </Button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: MOBILE CARD VIEW
         ========================================================================= */}
      <div className="md:hidden space-y-4">
          <div className="bg-yellow-500 text-black p-4 rounded-xl shadow-lg flex justify-between items-center">
              <button onClick={() => changeDayMobile(-1)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30"><ChevronRight/></button>
              <div className="text-center">
                  <div className="text-xs opacity-75 font-bold">اليوم</div>
                  <div className="text-xl font-bold">{selectedDayForMobile} {monthNames[month]} {year}</div>
              </div>
              <button onClick={() => changeDayMobile(1)} className="p-2 bg-white/20 rounded-lg hover:bg-white/30"><ChevronLeft/></button>
          </div>

          <div className="grid gap-3">
              {displayedStudents.map((s, index) => {
                  const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDayForMobile).padStart(2,'0')}`;
                  const isPresent = !!s.attendance?.[dateStr];
                  const isFri = new Date(year, month, selectedDayForMobile).getDay() === 5;
                  
                  return (
                      <div key={s.id} className={`p-4 rounded-xl border flex justify-between items-center ${isPresent ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                          <div className="flex items-center gap-3">
                             {isReordering && (
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => moveStudent(index, 'up')} className="bg-gray-100 p-1 rounded hover:bg-blue-100"><ArrowUp size={14}/></button>
                                    <button onClick={() => moveStudent(index, 'down')} className="bg-gray-100 p-1 rounded hover:bg-blue-100"><ArrowDown size={14}/></button>
                                </div>
                             )}
                             <div>
                                  <h4 className="font-bold text-gray-800">{s.name}</h4>
                                  <p className="text-xs text-gray-400">#{index + 1}</p>
                             </div>
                          </div>
                          
                          {!isReordering && (
                             isFri ? <span className="text-xs font-bold text-red-400 bg-red-50 px-2 py-1 rounded-lg">عطلة</span> :
                              <button 
                                onClick={() => toggleCheck(s.id, selectedDayForMobile)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isPresent ? 'bg-green-500 text-white shadow-lg shadow-green-200' : 'bg-gray-100 text-gray-400'}`}
                              >
                                {isPresent ? <UserCheck size={20}/> : <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                              </button>
                          )}
                      </div>
                  )
              })}
          </div>
      </div>

      {/* =========================================================================
          VIEW 2: DESKTOP TABLE VIEW
         ========================================================================= */}
      <Card className="hidden md:block overflow-x-auto p-0 border-none shadow-md rounded-2xl">
        <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-800 text-white sticky top-0 z-20">
                <tr>
                    <th className="p-4 sticky right-0 bg-gray-800 z-30 text-right min-w-[200px] font-bold text-base">
                        الطلاب ({processedStudents.length})
                    </th>
                    {!isReordering && [...Array(daysInMonth)].map((_, i) => {
                        const d = i + 1;
                        const isFri = new Date(year, month, d).getDay() === 5;
                        return (
                            <th key={i} className={`p-2 border-l border-gray-700 text-center min-w-[40px] ${isFri ? 'bg-red-900/30 text-red-200' : ''}`}>
                                <div className="flex flex-col gap-1">
                                    <span className="opacity-75 text-[10px] font-normal">{daysOfWeek[new Date(year, month, d).getDay()]}</span>
                                    <span className="font-bold text-lg">{d}</span>
                                </div>
                            </th>
                        );
                    })}
                    {isReordering && <th className="p-4 text-center text-base">تحكم بالترتيب</th>}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {displayedStudents.map((s, index) => (
                    <tr key={s.id} className="hover:bg-yellow-50 transition-colors group">
                        <td className="p-3 sticky right-0 bg-white group-hover:bg-yellow-50 font-bold border-l border-gray-100 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.1)] z-10 text-gray-800 text-sm flex items-center justify-between">
                            <span>{s.name}</span>
                            {isReordering && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{(currentPage - 1) * itemsPerPage + index + 1}</span>}
                        </td>
                        {!isReordering && [...Array(daysInMonth)].map((_, i) => {
                            const d = i + 1;
                            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                            const checked = !!s.attendance?.[dateStr];
                            const isFri = new Date(year, month, d).getDay() === 5;
                            return (
                                <td key={i} className={`border-l border-gray-100 text-center p-0 h-12 ${isFri ? 'bg-gray-50/50' : ''}`}>
                                    {isFri ? <div className="w-full h-full flex items-center justify-center opacity-20"><X size={12}/></div> :
                                        <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-50">
                                            <input type="checkbox" checked={checked} onChange={() => toggleCheck(s.id, d)} className="hidden" />
                                            <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${checked ? 'bg-green-500 text-white scale-110' : 'bg-gray-100 hover:bg-gray-200'}`}><UserCheck size={14} /></div>
                                        </label>
                                    }
                                </td>
                            );
                        })}
                        {isReordering && (
                            <td className="p-3 text-center">
                                <div className="flex justify-center gap-2">
                                    <button onClick={() => moveStudent((currentPage - 1) * itemsPerPage + index, 'up')} className="p-2 bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-lg"><ArrowUp size={20}/></button>
                                    <button onClick={() => moveStudent((currentPage - 1) * itemsPerPage + index, 'down')} className="p-2 bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-lg"><ArrowDown size={20}/></button>
                                </div>
                            </td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
      </Card>

      {/* --- Paginator (أزرار التنقل بين الصفحات) --- */}
      {!isReordering && totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>عرض</span>
                  <select className="bg-gray-50 border border-gray-200 rounded-lg p-1 focus:outline-none" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                      <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={processedStudents.length}>الكل</option>
                  </select>
                  <span>من أصل {processedStudents.length} طالب</span>
              </div>
              <div className="flex gap-2">
                  <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>السابق</Button>
                  <div className="flex gap-1">{[...Array(totalPages)].map((_, i) => (<button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-yellow-500 text-black shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}>{i + 1}</button>))}</div>
                  <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>التالي</Button>
              </div>
          </div>
      )}
    </div>
  );
}
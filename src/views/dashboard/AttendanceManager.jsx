// src/views/dashboard/AttendanceManager.jsx
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, UserCheck, X, 
  Search, Save, Layers, Calendar, Users 
} from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';

export default function AttendanceManager({ students, studentsCollection }) {
  // --- إعدادات التاريخ ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayForMobile, setSelectedDayForMobile] = useState(new Date().getDate());
  
  // --- حالات النظام (States) ---
  const [searchTerm, setSearchTerm] = useState(''); // نص البحث
  const [currentPage, setCurrentPage] = useState(1); // رقم الصفحة الحالية
  const [itemsPerPage, setItemsPerPage] = useState(10); // عدد الطلاب في الصفحة
  const [isReordering, setIsReordering] = useState(false); // تفعيل وضع الترتيب
  
  // --- المجموعات / الفترات ---
  // يمكنك تعديل هذه القائمة لتناسب الفئات الموجودة لديك في الأكاديمية
  const groupsList = ["الكل", "فترة 4:00 - 5:00", "فترة 5:00 - 6:00", "فترة 6:00 - 7:00", "فريق الناشئين", "فريق الرجال"];
  const [selectedGroup, setSelectedGroup] = useState("الكل");

  // --- ثوابت ودوال التاريخ ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
  // توليد قائمة سنوات من 2023 لغاية 8 سنوات قدام
  const yearsRange = Array.from({length: 8}, (_, i) => 2023 + i);

  // تحديث السنة أو الشهر
  const updateDate = (newYear, newMonth) => {
      const d = new Date(currentDate);
      if (newYear !== null) d.setFullYear(newYear);
      if (newMonth !== null) d.setMonth(newMonth);
      setCurrentDate(d);
      setSelectedDayForMobile(1); // إعادة لليوم الأول عند تغيير الشهر
  };

  // تغيير اليوم في وضع الموبايل
  const changeDayMobile = (inc) => {
      const daysInM = new Date(year, month + 1, 0).getDate();
      let newDay = selectedDayForMobile + inc;
      if (newDay > daysInM) newDay = daysInM; if (newDay < 1) newDay = 1;
      setSelectedDayForMobile(newDay);
  };

  // --- 1. معالجة البيانات (فلترة، ترتيب، بحث) ---
  const processedStudents = useMemo(() => {
      let result = [...students];

      // أ) فلترة المجموعة
      if (selectedGroup !== "الكل") {
          // ملاحظة: يفترض وجود حقل group في بيانات الطالب. إذا لم يوجد لن تظهر نتائج.
          // يمكنك إزالة هذا الشرط إذا لم تقم بإضافة الحقل لقاعدة البيانات بعد.
          result = result.filter(s => s.group === selectedGroup);
      }

      // ب) الترتيب حسب customOrder
      result.sort((a, b) => {
          const orderA = a.customOrder !== undefined ? a.customOrder : 999999;
          const orderB = b.customOrder !== undefined ? b.customOrder : 999999;
          return orderA - orderB;
      });

      // ج) البحث الذكي
      if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          result = result.filter(s => s.name.toLowerCase().includes(lowerTerm));
      }

      return result;
  }, [students, searchTerm, selectedGroup]);

  // --- 2. نظام الصفحات (Pagination Logic) ---
  const totalPages = Math.ceil(processedStudents.length / itemsPerPage);
  
  // إذا كنا في وضع الترتيب، نعرض القائمة كاملة ليسهل النقل، وإلا نقسمها صفحات
  const displayedStudents = isReordering 
      ? processedStudents 
      : processedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- 3. الأكشن (تسجيل الحضور، الترتيب) ---
  
  // تسجيل الحضور والغياب
  const toggleCheck = async (sid, day) => { 
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; 
      const student = students.find(s => s.id === sid); 
      const newAtt = { ...(student.attendance || {}) }; 
      
      if (newAtt[dateStr]) delete newAtt[dateStr]; // حذف الحضور (إلغاء)
      else newAtt[dateStr] = true; // تسجيل حضور
      
      await studentsCollection.update(sid, { attendance: newAtt }); 
  };

  // الترتيب المباشر (عند كتابة رقم في الخانة)
  const handleDirectSort = async (oldIndexInDisplayedList, newDisplayRank) => {
      // oldIndexInDisplayedList: موقع الطالب الحالي في القائمة الظاهرة
      // بما أننا في وضع الترتيب نعرض القائمة كاملة، فالاندكس هو نفسه في processedStudents
      
      let newIndex = newDisplayRank - 1; // تحويل الرقم المدخل (1) إلى اندكس (0)
      
      // حماية من الأرقام الخطأ
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= processedStudents.length) newIndex = processedStudents.length - 1;
      if (newIndex === oldIndexInDisplayedList) return; // لم يتغير مكانه

      // نأخذ نسخة من المصفوفة
      const newOrderList = [...processedStudents];
      
      // 1. حذف العنصر من مكانه القديم
      const [movedItem] = newOrderList.splice(oldIndexInDisplayedList, 1);
      
      // 2. إدخاله في المكان الجديد
      newOrderList.splice(newIndex, 0, movedItem);

      // 3. تحديث قاعدة البيانات لكل الطلاب
      // نعيد كتابة الـ customOrder للجميع لضمان التسلسل الصحيح
      const updates = newOrderList.map((s, index) => {
          return studentsCollection.update(s.id, { customOrder: index + 1 });
      });

      await Promise.all(updates);
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* =========================================================================
          HEADER: أدوات التحكم العلوية
         ========================================================================= */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-4">
        
        {/* 1. التاريخ (شهر / سنة) */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 justify-center w-full md:w-auto">
            <Calendar size={18} className="text-gray-500 ml-1"/>
            <select 
                className="bg-white border-gray-300 text-gray-700 text-sm rounded-lg p-2 font-bold cursor-pointer hover:bg-gray-50 outline-none"
                value={month}
                onChange={(e) => updateDate(null, parseInt(e.target.value))}
            >
                {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select 
                className="bg-white border-gray-300 text-gray-700 text-sm rounded-lg p-2 font-bold cursor-pointer hover:bg-gray-50 outline-none"
                value={year}
                onChange={(e) => updateDate(parseInt(e.target.value), null)}
            >
                {yearsRange.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
        </div>

        {/* 2. فلتر المجموعات/الفترات */}
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-xl border border-blue-100 w-full md:w-auto">
            <Users size={18} className="text-blue-500 ml-1"/>
            <span className="text-xs font-bold text-blue-800 ml-1 hidden sm:inline">الفترة:</span>
            <select 
                className="bg-white text-blue-900 text-sm rounded-lg p-2 font-bold cursor-pointer outline-none w-full md:w-48"
                value={selectedGroup}
                onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }}
            >
                {groupsList.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
        </div>

        {/* 3. البحث وزر الترتيب */}
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            {/* مربع البحث */}
            <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="ابحث عن طالب..." 
                    className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-100 rounded-xl focus:border-yellow-500 outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            {/* زر تفعيل الترتيب */}
            <Button 
                variant={isReordering ? "default" : "outline"}
                onClick={() => setIsReordering(!isReordering)}
                className={`gap-2 whitespace-nowrap ${isReordering ? "bg-yellow-500 text-black hover:bg-yellow-400 border-none" : ""}`}
            >
                {isReordering ? <Save size={18}/> : <Layers size={18}/>}
                {isReordering ? "حفظ الترتيب" : "ترتيب"}
            </Button>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: MOBILE CARD VIEW (للشاشات الصغيرة)
         ========================================================================= */}
      <div className="md:hidden space-y-4">
          {/* شريط التنقل اليومي */}
          <div className="bg-yellow-500 text-black p-4 rounded-xl shadow-lg flex justify-between items-center">
              <button onClick={() => changeDayMobile(-1)} className="p-2 bg-white/20 rounded-lg active:scale-95 transition-transform"><ChevronRight/></button>
              <div className="text-center">
                  <div className="text-xs opacity-75 font-bold mb-1">تسجيل الحضور</div>
                  <div className="text-xl font-bold flex flex-col">
                      <span>{selectedDayForMobile} {monthNames[month]}</span>
                      <span className="text-xs font-normal opacity-80">{daysOfWeek[new Date(year, month, selectedDayForMobile).getDay()]}</span>
                  </div>
              </div>
              <button onClick={() => changeDayMobile(1)} className="p-2 bg-white/20 rounded-lg active:scale-95 transition-transform"><ChevronLeft/></button>
          </div>

          {/* قائمة الطلاب */}
          <div className="grid gap-3">
              {displayedStudents.map((s, index) => {
                  const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDayForMobile).padStart(2,'0')}`;
                  const isPresent = !!s.attendance?.[dateStr];
                  const dayOfWeek = new Date(year, month, selectedDayForMobile).getDay();
                  const isFriday = dayOfWeek === 5; // الجمعة

                  return (
                      <div key={s.id} className={`p-4 rounded-xl border flex justify-between items-center transition-colors ${isPresent ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'}`}>
                          <div className="flex items-center gap-3">
                             {/* رقم التسلسل */}
                             <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                             </div>
                             <div>
                                  <h4 className="font-bold text-gray-800">{s.name}</h4>
                                  <p className="text-xs text-gray-400">{s.belt || 'غير محدد'}</p>
                             </div>
                          </div>
                          
                          {/* زر التسجيل أو علامة العطلة */}
                          {!isReordering && (
                              isFriday ? 
                              <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-lg border border-red-100">عطلة</span> 
                              :
                              <button 
                                onClick={() => toggleCheck(s.id, selectedDayForMobile)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm ${isPresent ? 'bg-green-500 text-white shadow-green-200' : 'bg-gray-100 text-gray-300'}`}
                              >
                                {isPresent ? <UserCheck size={22}/> : <div className="w-3 h-3 bg-gray-300 rounded-full"></div>}
                              </button>
                          )}
                      </div>
                  )
              })}
              {displayedStudents.length === 0 && <div className="text-center p-8 text-gray-400 border-2 border-dashed rounded-xl">لا يوجد طلاب مطابقين</div>}
          </div>
      </div>

      {/* =========================================================================
          VIEW 2: DESKTOP TABLE VIEW (للشاشات الكبيرة)
         ========================================================================= */}
      <Card className="hidden md:block overflow-visible p-0 border-none shadow-md rounded-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-800 text-white sticky top-0 z-20">
                    <tr>
                        <th className="p-4 sticky right-0 bg-gray-800 z-30 text-right min-w-[240px] font-bold text-base shadow-lg">
                            قائمة الطلاب {selectedGroup !== "الكل" && <span className="text-yellow-400 text-sm">({selectedGroup})</span>}
                        </th>
                        
                        {/* عرض أيام الشهر فقط إذا لم نكن نرتب */}
                        {!isReordering && [...Array(daysInMonth)].map((_, i) => {
                            const d = i + 1;
                            const isFri = new Date(year, month, d).getDay() === 5;
                            return (
                                <th key={i} className={`p-2 border-l border-gray-700 text-center min-w-[40px] ${isFri ? 'bg-red-900/40 text-red-100' : ''}`}>
                                    <div className="flex flex-col gap-1">
                                        <span className="opacity-60 text-[10px] font-normal">{daysOfWeek[new Date(year, month, d).getDay()]}</span>
                                        <span className="font-bold text-lg">{d}</span>
                                    </div>
                                </th>
                            );
                        })}
                        
                        {/* عمود الترتيب يظهر فقط عند التفعيل */}
                        {isReordering && <th className="p-4 text-center w-64 text-base bg-yellow-600/90 text-white">تغيير الترتيب</th>}
                    </tr>
                </thead>
                
                <tbody className="divide-y divide-gray-100 bg-white">
                    {displayedStudents.map((s, index) => {
                         const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                         return (
                        <tr key={s.id} className="hover:bg-yellow-50 transition-colors group">
                            
                            {/* اسم الطالب (Sticky Column) */}
                            <td className="p-3 sticky right-0 bg-white group-hover:bg-yellow-50 font-bold border-l border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10 text-gray-800 text-sm flex items-center justify-between h-[50px]">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-mono ${isReordering ? 'bg-yellow-100 text-yellow-800 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                                        {globalIndex}
                                    </span>
                                    <span>{s.name}</span>
                                </div>
                            </td>
                            
                            {/* خلايا أيام الشهر */}
                            {!isReordering && [...Array(daysInMonth)].map((_, i) => {
                                const d = i + 1;
                                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                                const checked = !!s.attendance?.[dateStr];
                                const isFri = new Date(year, month, d).getDay() === 5;

                                return (
                                    <td key={i} className={`border-l border-gray-100 text-center p-0 ${isFri ? 'bg-gray-50' : ''}`}>
                                        {isFri ? (
                                            <div className="w-full h-full flex items-center justify-center opacity-20 pointer-events-none" title="عطلة"><X size={12}/></div>
                                        ) : (
                                            <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-100 transition-colors">
                                                <input type="checkbox" checked={checked} onChange={() => toggleCheck(s.id, d)} className="hidden" />
                                                <div className={`w-6 h-6 rounded flex items-center justify-center transition-all duration-200 ${checked ? 'bg-green-500 text-white scale-110 shadow-sm' : 'bg-gray-100 hover:bg-gray-300'}`}>
                                                    <UserCheck size={14} />
                                                </div>
                                            </label>
                                        )}
                                    </td>
                                );
                            })}

                            {/* خانة الترتيب المباشر */}
                            {isReordering && (
                                <td className="p-2 text-center bg-yellow-50/20 border-l border-yellow-100">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-gray-400 text-xs font-bold">رقم:</span>
                                        <input 
                                            type="number"
                                            className="w-20 p-2 text-center border-2 border-yellow-300 rounded-lg focus:border-yellow-600 focus:ring-4 focus:ring-yellow-500/20 outline-none font-bold text-lg transition-all"
                                            placeholder={globalIndex}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleDirectSort(index, parseInt(e.target.value));
                                                    e.target.value = ''; // تفريغ الخانة بعد النقل
                                                    e.target.blur();
                                                }
                                            }}
                                            onBlur={(e) => {
                                                if(e.target.value) {
                                                    handleDirectSort(index, parseInt(e.target.value));
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                    </div>
                                </td>
                            )}
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
      </Card>

      {/* =========================================================================
          FOOTER: شريط الصفحات (Pagination)
         ========================================================================= */}
      {!isReordering && totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
              
              {/* اختيار عدد العناصر */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>عرض</span>
                  <select 
                    className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 focus:outline-none font-bold text-gray-700 cursor-pointer"
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={processedStudents.length}>الكل</option>
                  </select>
                  <span>من أصل {processedStudents.length} طالب</span>
              </div>

              {/* أزرار التنقل */}
              <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="px-4 text-sm"
                  >
                      السابق
                  </Button>
                  
                  {/* أرقام الصفحات */}
                  <div className="flex gap-1 overflow-x-auto hide-scrollbar max-w-[150px] md:max-w-none px-1">
                      {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                                currentPage === i + 1 
                                ? 'bg-yellow-500 text-black shadow-md scale-105' 
                                : 'bg-gray-50 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                              {i + 1}
                          </button>
                      ))}
                  </div>

                  <Button 
                    variant="outline" 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="px-4 text-sm"
                  >
                      التالي
                  </Button>
              </div>
          </div>
      )}
    </div>
  );
}
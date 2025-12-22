// src/views/dashboard/AttendanceManager.jsx
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, UserCheck, X, 
  Search, Save, Layers, Calendar, Users, Settings, Plus, Trash2, Edit3, Printer 
} from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { createPortal } from 'react-dom';
import { IMAGES } from '../../lib/constants';

// --- Groups Management Modal ---
const GroupsModal = ({ isOpen, onClose, groups, onAdd, onDelete }) => {
    const [newGroup, setNewGroup] = useState("");
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Settings size={20} className="text-gray-600"/> إدارة الفترات والمجموعات
                </h3>
                
                <div className="flex gap-2 mb-6">
                    <input 
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 outline-none"
                        placeholder="اسم الفترة الجديدة..."
                        value={newGroup}
                        onChange={(e) => setNewGroup(e.target.value)}
                    />
                    <button 
                        onClick={() => { if(newGroup) { onAdd(newGroup); setNewGroup(""); } }}
                        className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700"
                    >
                        <Plus size={20}/>
                    </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                    {groups.map((g, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <span className="font-bold text-gray-700">{g.name}</span>
                            <button onClick={() => onDelete(g)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                                <Trash2 size={18}/>
                            </button>
                        </div>
                    ))}
                    {groups.length === 0 && <p className="text-center text-gray-400 text-sm">لا يوجد فترات مضافة</p>}
                </div>
                
                <Button onClick={onClose} variant="outline" className="w-full">إغلاق</Button>
            </div>
        </div>,
        document.body
    );
};

export default function AttendanceManager({ students, studentsCollection, groups = [], groupsCollection, selectedBranch }) {
  // --- Date Settings ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayForMobile, setSelectedDayForMobile] = useState(new Date().getDate());
  
  // --- System States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isReordering, setIsReordering] = useState(false);
  const [showGroupsModal, setShowGroupsModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("الكل");

  const groupsList = useMemo(() => {
      return groups ? groups.map(g => g.name) : [];
  }, [groups]);

  const handleAddGroup = async (name) => {
      if (groupsList.includes(name)) return alert("هذه الفترة موجودة مسبقاً");
      await groupsCollection.add({
          name: name,
          branch: selectedBranch || (students[0]?.branch || 'عام')
      });
  };

  const handleDeleteGroup = async (groupObj) => {
      if (!confirm(`حذف الفترة "${groupObj.name}"؟`)) return;
      await groupsCollection.remove(groupObj.id);
      if (selectedGroup === groupObj.name) setSelectedGroup("الكل");
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  const daysOfWeek = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
  const yearsRange = Array.from({length: 8}, (_, i) => 2023 + i);

  const updateDate = (newYear, newMonth) => {
      const d = new Date(currentDate);
      if (newYear !== null) d.setFullYear(newYear);
      if (newMonth !== null) d.setMonth(newMonth);
      setCurrentDate(d);
      setSelectedDayForMobile(1);
  };

  const changeDayMobile = (inc) => {
      const daysInM = new Date(year, month + 1, 0).getDate();
      let newDay = selectedDayForMobile + inc;
      if (newDay > daysInM) newDay = daysInM; if (newDay < 1) newDay = 1;
      setSelectedDayForMobile(newDay);
  };

  const processedStudents = useMemo(() => {
      let result = Array.isArray(students) ? [...students] : [];
      if (selectedGroup !== "الكل") {
          result = result.filter(s => s.group === selectedGroup);
      }
      result.sort((a, b) => (a.customOrder || 999999) - (b.customOrder || 999999));
      if (searchTerm) {
          result = result.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      return result;
  }, [students, searchTerm, selectedGroup]);

  const totalPages = Math.ceil(processedStudents.length / itemsPerPage);
  const displayedStudents = isReordering 
      ? processedStudents 
      : processedStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleCheck = async (sid, day) => { 
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; 
      const student = students.find(s => s.id === sid); 
      const newAtt = { ...(student.attendance || {}) }; 
      if (newAtt[dateStr]) delete newAtt[dateStr]; else newAtt[dateStr] = true; 
      await studentsCollection.update(sid, { attendance: newAtt }); 
  };

  const handleDirectSort = async (oldIndex, newDisplayRank) => {
      let newIndex = newDisplayRank - 1;
      if (newIndex < 0) newIndex = 0;
      if (newIndex >= processedStudents.length) newIndex = processedStudents.length - 1;
      if (newIndex === oldIndex) return;

      const newOrderList = [...processedStudents];
      const [movedItem] = newOrderList.splice(oldIndex, 1);
      newOrderList.splice(newIndex, 0, movedItem);

      const updates = newOrderList.map((s, index) => studentsCollection.update(s.id, { customOrder: index + 1 }));
      await Promise.all(updates);
  };

  const changeStudentGroup = async (studentId, newGroup) => {
      if (!confirm("هل أنت متأكد من نقل الطالب لهذه الفترة؟")) return;
      await studentsCollection.update(studentId, { group: newGroup });
  };

  // --- Print Report Function ---
  const printReport = () => {
    const printWindow = window.open('', 'PRINT', 'height=800,width=1200');
    const logoUrl = window.location.origin + IMAGES.LOGO;
    
    // Generate Headers (Days)
    let daysHeaders = '';
    for(let i=1; i<=daysInMonth; i++) {
        daysHeaders += `<th style="font-size:10px; width:20px; border:1px solid #ccc; background:#f9f9f9;">${i}</th>`;
    }

    // Generate Rows (Students)
    let rowsHtml = '';
    processedStudents.forEach((s, idx) => {
        let cells = '';
        for(let i=1; i<=daysInMonth; i++) {
            const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
            const isPresent = s.attendance?.[dateStr];
            const isFriday = new Date(year, month, i).getDay() === 5;
            
            let content = '';
            let bg = '';
            
            if (isFriday) {
                bg = '#eee';
            } else if (isPresent) {
                content = '✓';
                bg = '#dcfce7'; // green-100
            }
            
            cells += `<td style="border:1px solid #ccc; background:${bg}; text-align:center; font-size:12px; color:#166534; font-weight:bold;">${content}</td>`;
        }
        
        rowsHtml += `
            <tr>
                <td style="border:1px solid #ccc; padding:5px; font-weight:bold; text-align:center;">${idx + 1}</td>
                <td style="border:1px solid #ccc; padding:5px; text-align:right;">${s.name}</td>
                <td style="border:1px solid #ccc; padding:5px; text-align:center; font-size:11px;">${s.group || '-'}</td>
                ${cells}
            </tr>
        `;
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
        <head>
          <title>كشف الحضور - ${monthNames[month]} ${year}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
            body { font-family: 'Cairo', sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            h1 { text-align: center; color: #b45309; margin-bottom: 5px; }
            .header-info { text-align: center; margin-bottom: 20px; font-weight:bold; color:#555; }
            @page { size: A4 landscape; margin: 10mm; }
          </style>
        </head>
        <body>
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #b45309; padding-bottom:10px;">
                <div>
                    <h1>أكاديمية الشجاع للتايكواندو</h1>
                    <div style="font-size:12px;">فرع: ${selectedBranch}</div>
                </div>
                <img src="${logoUrl}" style="height:60px;" onerror="this.style.display='none'"/>
            </div>

            <div class="header-info">
                سجل الحضور والغياب | شهر: ${monthNames[month]} ${year} | المجموعة: ${selectedGroup}
            </div>

            <table>
                <thead>
                    <tr>
                        <th style="border:1px solid #ccc; background:#eee; width:30px;">#</th>
                        <th style="border:1px solid #ccc; background:#eee; width:200px;">اسم الطالب</th>
                        <th style="border:1px solid #ccc; background:#eee; width:80px;">المجموعة</th>
                        ${daysHeaders}
                    </tr>
                </thead>
                <tbody>
                    ${rowsHtml}
                </tbody>
            </table>
            
            <div style="margin-top:20px; font-size:10px; text-align:left; color:#777;">
                تاريخ الطباعة: ${new Date().toLocaleDateString('ar-JO')}
            </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.onload = () => {
        printWindow.focus();
        setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
    };
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      <GroupsModal 
        isOpen={showGroupsModal} 
        onClose={() => setShowGroupsModal(false)}
        groups={groups || []}
        onAdd={handleAddGroup}
        onDelete={handleDeleteGroup}
      />

      {/* HEADER */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row justify-between items-center gap-4">
        
        {/* Date Selection */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200 justify-center w-full md:w-auto">
            <Calendar size={18} className="text-gray-500 ml-1"/>
            <select className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer" value={month} onChange={(e) => updateDate(null, parseInt(e.target.value))}>
                {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer" value={year} onChange={(e) => updateDate(parseInt(e.target.value), null)}>
                {yearsRange.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
        </div>

        {/* --- Group Management --- */}
        <div className="flex items-center gap-2 bg-blue-50 p-2 pl-3 rounded-xl border border-blue-100 w-full md:w-auto">
            <Users size={18} className="text-blue-500 ml-1"/>
            <span className="text-xs font-bold text-blue-800 ml-1 hidden sm:inline">الفترة:</span>
            
            <div className="relative group">
                <select 
                    className="bg-transparent text-blue-900 font-bold outline-none w-full md:w-40 cursor-pointer appearance-none pr-4"
                    value={selectedGroup}
                    onChange={(e) => { setSelectedGroup(e.target.value); setCurrentPage(1); }}
                >
                    <option value="الكل">الكل (جميع الطلاب)</option>
                    {groupsList.map((name, idx) => <option key={idx} value={name}>{name}</option>)}
                </select>
            </div>
            <button 
                onClick={() => setShowGroupsModal(true)}
                className="bg-white p-1.5 rounded-lg text-blue-500 hover:text-blue-700 hover:shadow-sm border border-transparent hover:border-blue-200 transition-all"
                title="إضافة/حذف فترات"
            >
                <Settings size={16}/>
            </button>
        </div>

        {/* Search, Sort, Print */}
        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
            <div className="relative w-full md:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" placeholder="بحث..." 
                    className="w-full pl-4 pr-10 py-2.5 border-2 border-gray-100 rounded-xl focus:border-yellow-500 outline-none"
                    value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>
            
            <div className="flex gap-2">
                <Button 
                    variant={isReordering ? "default" : "outline"}
                    onClick={() => setIsReordering(!isReordering)}
                    className={`gap-2 whitespace-nowrap ${isReordering ? "bg-yellow-500 text-black border-none" : ""}`}
                >
                    {isReordering ? <Save size={18}/> : <Layers size={18}/>}
                    {isReordering ? "حفظ الترتيب" : "ترتيب"}
                </Button>
                
                {/* زر الطباعة الجديد */}
                <Button 
                    onClick={printReport}
                    className="bg-gray-800 text-white gap-2 hover:bg-black"
                    title="طباعة الكشف"
                >
                    <Printer size={18}/> <span className="hidden md:inline">طباعة</span>
                </Button>
            </div>
        </div>
      </div>

      {/* MOBILE VIEW */}
      <div className="md:hidden space-y-4">
          <div className="bg-yellow-500 text-black p-4 rounded-xl shadow-lg flex justify-between items-center">
              <button onClick={() => changeDayMobile(-1)} className="p-2 bg-white/20 rounded-lg"><ChevronRight/></button>
              <div className="text-center">
                  <div className="text-xs opacity-75 font-bold mb-1">تسجيل الحضور</div>
                  <div className="text-xl font-bold flex flex-col">
                      <span>{selectedDayForMobile} {monthNames[month]}</span>
                  </div>
              </div>
              <button onClick={() => changeDayMobile(1)} className="p-2 bg-white/20 rounded-lg"><ChevronLeft/></button>
          </div>

          <div className="grid gap-3">
              {displayedStudents.map((s, index) => {
                  const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(selectedDayForMobile).padStart(2,'0')}`;
                  const isPresent = !!s.attendance?.[dateStr];
                  const isFriday = new Date(year, month, selectedDayForMobile).getDay() === 5;
                  return (
                      <div key={s.id} className="p-4 rounded-xl border border-gray-100 bg-white shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{s.name}</h4>
                                        <div className="relative mt-1">
                                            <select 
                                                className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md outline-none border-none font-bold w-full appearance-none"
                                                value={s.group || (groupsList.length > 0 ? groupsList[0] : "")}
                                                onChange={(e) => changeStudentGroup(s.id, e.target.value)}
                                            >
                                                {groupsList.map((name, idx) => <option key={idx} value={name}>{name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                {!isReordering && (
                                    isFriday ? <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">عطلة</span> :
                                    <button onClick={() => toggleCheck(s.id, selectedDayForMobile)} className={`w-10 h-10 rounded-full flex items-center justify-center ${isPresent ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                                        {isPresent ? <UserCheck size={20}/> : <span className="w-3 h-3 bg-gray-300 rounded-full"></span>}
                                    </button>
                                )}
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>

      {/* DESKTOP VIEW */}
      <Card className="hidden md:block overflow-visible p-0 border-none shadow-md rounded-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
                <thead className="bg-gray-800 text-white sticky top-0 z-20">
                    <tr>
                        <th className="p-4 sticky right-0 bg-gray-800 z-30 text-right min-w-[280px] font-bold text-base shadow-lg">
                            الطلاب {selectedGroup !== "الكل" && <span className="text-yellow-400 text-sm">({selectedGroup})</span>}
                        </th>
                        {!isReordering && [...Array(daysInMonth)].map((_, i) => {
                            const d = i + 1;
                            const isFri = new Date(year, month, d).getDay() === 5;
                            return (
                                <th key={i} className={`p-2 border-l border-gray-700 text-center min-w-[40px] ${isFri ? 'bg-red-900/40 text-red-100' : ''}`}>
                                    <div className="flex flex-col gap-1">
                                        <span className="opacity-60 text-[10px]">{daysOfWeek[new Date(year, month, d).getDay()]}</span>
                                        <span>{d}</span>
                                    </div>
                                </th>
                            );
                        })}
                        {isReordering && <th className="p-4 text-center w-64 bg-yellow-600/90 text-white">الترتيب</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {displayedStudents.map((s, index) => {
                         const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
                         return (
                        <tr key={s.id} className="hover:bg-yellow-50 transition-colors group">
                            <td className="p-3 sticky right-0 bg-white group-hover:bg-yellow-50 font-bold border-l border-gray-100 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] z-10 text-gray-800 text-sm flex items-center justify-between h-[50px]">
                                <div className="flex items-center gap-3 w-full">
                                    <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-mono ${isReordering ? 'bg-yellow-100 text-yellow-800 font-bold' : 'bg-gray-100 text-gray-500'}`}>
                                        {globalIndex}
                                    </span>
                                    
                                    <div className="flex flex-col flex-1">
                                        <span className="truncate">{s.name}</span>
                                        <div className="flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Edit3 size={10} className="text-gray-400"/>
                                            <select 
                                                className="bg-transparent text-[10px] text-gray-500 outline-none cursor-pointer hover:text-blue-600 w-full"
                                                value={s.group || (groupsList.length > 0 ? groupsList[0] : "")}
                                                onChange={(e) => changeStudentGroup(s.id, e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <option value="" disabled>نقل إلى...</option>
                                                {groupsList.map((name, idx) => <option key={idx} value={name}>{name}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            
                            {!isReordering && [...Array(daysInMonth)].map((_, i) => {
                                const d = i + 1;
                                const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                                const checked = !!s.attendance?.[dateStr];
                                const isFri = new Date(year, month, d).getDay() === 5;
                                return (
                                    <td key={i} className={`border-l border-gray-100 text-center p-0 ${isFri ? 'bg-gray-50' : ''}`}>
                                        {isFri ? <div className="w-full h-full flex items-center justify-center opacity-20 pointer-events-none"><X size={12}/></div> :
                                            <label className="cursor-pointer w-full h-full flex items-center justify-center hover:bg-gray-100">
                                                <input type="checkbox" checked={checked} onChange={() => toggleCheck(s.id, d)} className="hidden" />
                                                <div className={`w-6 h-6 rounded flex items-center justify-center transition-all ${checked ? 'bg-green-500 text-white scale-110' : 'bg-gray-100 hover:bg-gray-300'}`}><UserCheck size={14} /></div>
                                            </label>
                                        }
                                    </td>
                                );
                            })}

                            {isReordering && (
                                <td className="p-2 text-center bg-yellow-50/20 border-l border-yellow-100">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="text-gray-400 text-xs">رقم:</span>
                                        <input 
                                            type="number" className="w-20 p-2 text-center border-2 border-yellow-300 rounded-lg focus:border-yellow-600 outline-none font-bold text-lg"
                                            placeholder={globalIndex}
                                            onKeyDown={(e) => { if(e.key==='Enter'){ handleDirectSort(index, parseInt(e.target.value)); e.target.value=''; e.target.blur(); }}}
                                            onBlur={(e) => { if(e.target.value){ handleDirectSort(index, parseInt(e.target.value)); e.target.value=''; }}}
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

      {!isReordering && totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>عرض</span>
                  <select className="bg-gray-50 border border-gray-200 rounded-lg p-1.5 focus:outline-none font-bold cursor-pointer" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                      <option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option><option value={processedStudents.length}>الكل</option>
                  </select>
                  <span>من أصل {processedStudents.length} طالب</span>
              </div>
              <div className="flex gap-2">
                  <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 text-sm">السابق</Button>
                  <div className="flex gap-1 overflow-x-auto hide-scrollbar max-w-[150px] md:max-w-none px-1">
                      {[...Array(totalPages)].map((_, i) => (
                          <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-yellow-500 text-black shadow-md scale-105' : 'bg-gray-50 text-gray-600 hover:bg-gray-200'}`}>{i + 1}</button>
                      ))}
                  </div>
                  <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 text-sm">التالي</Button>
              </div>
          </div>
      )}
    </div>
  );
}
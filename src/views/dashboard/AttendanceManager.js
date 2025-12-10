import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, StudentSearch } from '../../components/UIComponents';

export default function AttendanceManager({ students, studentsCollection }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterId, setFilterId] = useState(null);
  
  const changeMonth = (inc) => { const d = new Date(currentDate); d.setMonth(d.getMonth() + inc); setCurrentDate(d); };
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  
  const displayedStudents = filterId ? students.filter(s => s.id === filterId) : students;
  
  const toggleCheck = async (sid, day) => { 
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`; 
      const student = students.find(s => s.id === sid); 
      const newAtt = { ...(student.attendance || {}) }; 
      if (newAtt[dateStr]) delete newAtt[dateStr]; else newAtt[dateStr] = true; 
      await studentsCollection.update(sid, { attendance: newAtt }); 
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm flex-wrap gap-4">
        <div className="flex items-center gap-4"><Button variant="ghost" onClick={()=>changeMonth(-1)}><ChevronRight/></Button><span className="font-bold">{monthNames[month]} {year}</span><Button variant="ghost" onClick={()=>changeMonth(1)}><ChevronLeft/></Button></div>
        <div className="w-64 relative"><StudentSearch students={students} onSelect={s => setFilterId(s.id)} onClear={() => setFilterId(null)} placeholder="بحث سريع..." showAllOption={true} /></div>
      </div>
      <Card className="overflow-x-auto"><table className="w-full text-xs border-collapse"><thead className="bg-gray-800 text-white sticky top-0 z-20"><tr><th className="p-3 sticky right-0 bg-gray-800 z-30 text-right">الطالب</th>{[...Array(daysInMonth)].map((_,i)=><th key={i} className="p-2 border-gray-700 text-center">{i+1}</th>)}</tr></thead><tbody>{displayedStudents.map((s) => (<tr key={s.id} className="hover:bg-yellow-50"><td className="p-3 sticky right-0 bg-white font-bold border-l shadow-sm">{s.name}</td>{[...Array(daysInMonth)].map((_,i)=>{const d=i+1;const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;const checked=!!s.attendance?.[dateStr];return<td key={i} className="border text-center p-0"><input type="checkbox" checked={checked} onChange={()=>toggleCheck(s.id,d)} className="w-4 h-4 accent-green-600 cursor-pointer"/></td>})}</tr>))}</tbody></table></Card>
    </div>
  );
}
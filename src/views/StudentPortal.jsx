// src/views/StudentPortal.js
import React, { useState } from 'react';
import { Clock, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Card, StatusBadge } from '../components/UIComponents';
import { IMAGES } from '../lib/constants';

const StudentPortal = ({ user, students, schedule, payments, handleLogout }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const changeMonth = (inc) => { const d = new Date(currentDate); d.setMonth(d.getMonth() + inc); setCurrentDate(d); };
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

  const myStudents = students.filter(s => s.familyId === user.familyId);
  const myPayments = payments.filter(p => myStudents.some(s => s.id === p.studentId));
  
  // Helper Helper
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

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-right" dir="rtl">
      <header className="bg-black text-yellow-500 p-4 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <img src={IMAGES.LOGO} alt="Logo" className="w-10 h-10 bg-white rounded-full p-1" />
             <div><h1 className="font-bold text-lg">مرحباً {user.name}</h1><p className="text-xs text-gray-400">بوابة العائلة</p></div>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="text-sm"><LogOut size={16}/> خروج</Button>
        </div>
      </header>
      <div className="container mx-auto p-4 md:p-8 max-w-5xl space-y-8">
        {/* Schedule */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Clock className="text-yellow-500"/> مواعيد الحصص</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{schedule && schedule.length > 0 ? schedule.map(s=><div key={s.id} className="bg-white/10 p-4 rounded-lg"><p className="font-bold text-yellow-400 mb-1">{s.level}</p><p className="text-sm">{s.days} | {s.time}</p></div>) : <p className="text-gray-400">لا يوجد جدول حصص معلن حالياً</p>}</div>
        </div>

        {/* Financial History */}
        <Card title="كشف الحساب (الدفعات السابقة)">
           {myPayments.length > 0 ? (
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-right">
                 <thead className="bg-gray-100"><tr><th className="p-3">التاريخ</th><th className="p-3">الطالب</th><th className="p-3">البيان</th><th className="p-3">المبلغ</th></tr></thead>
                 <tbody>{myPayments.map(p=>(
                    <tr key={p.id} className="border-b">
                        <td className="p-3">{p.date}</td>
                        <td className="p-3 font-bold">{p.name}</td>
                        <td className="p-3">{p.reason} {p.details && <span className="block text-xs text-gray-400 mt-1">({p.details})</span>}</td>
                        <td className="p-3 text-green-600 font-bold">{p.amount} JOD</td>
                    </tr>
                 ))}</tbody>
               </table>
             </div>
           ) : <p className="text-gray-500 text-center py-4">لا توجد دفعات مسجلة</p>}
        </Card>

        {/* Student Cards */}
        {myStudents.map(s => (
          <Card key={s.id} className="mb-8 border-t-4 border-yellow-500" title={s.name}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-6">
                <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الحزام الحالي</p><p className="font-bold text-xl">{s.belt}</p></div>
                <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">حالة الاشتراك</p><StatusBadge status={calculateStatus(s.subEnd)}/><p className="text-xs text-gray-400 mt-1">ينتهي: {s.subEnd}</p></div>
                <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الرصيد المستحق</p><p className={`font-bold text-xl ${s.balance>0?"text-red-600":"text-green-600"}`}>{s.balance} JOD</p></div>
                <div className="bg-gray-50 p-4 rounded-xl"><p className="text-gray-500 text-xs mb-1">الفرع</p><p className="font-bold text-lg">{s.branch}</p></div>
            </div>
            {s.notes && s.notes.length > 0 && (<div className="mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100"><h4 className="font-bold text-blue-800 text-sm mb-2">ملاحظات الإدارة:</h4><ul className="list-disc list-inside text-sm text-blue-900">{s.notes.map(n=><li key={n.id}>{n.text} ({n.date})</li>)}</ul></div>)}
            
            {/* Attendance Calendar */}
            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4"><h4 className="font-bold text-gray-700">سجل الحضور: {monthNames[month]} {year}</h4><div className="flex gap-2"><Button variant="ghost" onClick={()=>changeMonth(-1)}><ChevronRight size={16}/></Button><Button variant="ghost" onClick={()=>changeMonth(1)}><ChevronLeft size={16}/></Button></div></div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">{[...Array(daysInMonth)].map((_,i)=>{const d=i+1; const dateStr=`${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; const isP=s.attendance && s.attendance[dateStr]; return <div key={d} className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold border ${isP?'bg-green-500 text-white':'bg-gray-100 text-gray-400'}`}>{d}</div>})}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentPortal;
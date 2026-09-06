import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const monthKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

export default function AttendanceHistory({ attendance = {} }) {
    const currentMonth = monthKey(new Date());
    const [month, setMonth] = useState(currentMonth);
    const [year, monthNumber] = month.split('-').map(Number);
    const monthLabel = new Date(year, monthNumber - 1, 1).toLocaleDateString('ar-JO', { month: 'long', year: 'numeric' });
    const days = Object.keys(attendance || {}).filter(date => /^\d{4}-\d{2}-\d{2}$/.test(date) && date.startsWith(`${month}-`) && attendance[date]).sort();
    const moveMonth = offset => setMonth(monthKey(new Date(year, monthNumber - 1 + offset, 1)));

    return <div className="space-y-4" dir="rtl">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <button type="button" aria-label="الشهر السابق" onClick={() => moveMonth(-1)} className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-yellow-500"><ChevronRight size={18}/></button>
                <span className="font-bold text-slate-200 min-w-28 text-center">{monthLabel}</span>
                <button type="button" aria-label="الشهر التالي" disabled={month >= currentMonth} onClick={() => moveMonth(1)} className="p-3 rounded-xl bg-slate-800 text-slate-300 hover:text-yellow-500 disabled:opacity-30"><ChevronLeft size={18}/></button>
            </div>
            <button type="button" disabled={month === currentMonth} onClick={() => setMonth(currentMonth)} className="min-h-11 px-4 rounded-xl border border-slate-700 text-yellow-500 text-sm disabled:opacity-40">هذا الشهر</button>
        </div>
        <p role="status" className="text-sm text-slate-400">حضور {monthLabel}: <strong className="text-emerald-400">{days.length}</strong> مرة</p>
        {days.length ? <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {days.map(date => {
                const [y, m, d] = date.split('-').map(Number);
                return <li key={date} className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-300"><CheckCircle size={17} className="text-emerald-400 shrink-0"/><time dateTime={date}>{new Date(y, m - 1, d).toLocaleDateString('ar-JO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</time></li>;
            })}
        </ul> : <p className="text-center text-slate-400 border border-dashed border-slate-700 rounded-xl p-6 text-sm">لا توجد أيام حضور مسجلة في هذا الشهر.</p>}
        <p className="text-xs text-slate-500">يعرض أيام الحضور المسجلة فقط؛ الأيام الأخرى لا تُحسب غياباً تلقائياً.</p>
    </div>;
}

// src/components/QuickSearch.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, User } from 'lucide-react';

/**
 * QuickSearch — Cmd/Ctrl+F modal that opens a selected student profile
 *
 * Props:
 *   - students:        active students array
 *   - archivedStudents: archived students array
 *   - payments:        all receipts
 *   - debts:           all debts
 *   - onNavigate(tab, studentId?): switch the dashboard tab + optional select
 */
// نُعرّض دالة open globally على window للوصول من زر الـ header
export default function QuickSearch({
    students = [], onNavigate
}) {
    const [open, setOpen]   = useState(false);

    // نُعرّض الدالة على window حتى أي زر يقدر يفتحها
    useEffect(() => {
        window.__openQuickSearch = () => setOpen(true);
        return () => { delete window.__openQuickSearch; };
    }, []);
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    // Cmd/Ctrl + F to open — يستخدم e.code علشان يشتغل مع اللوحة العربية أيضاً
    useEffect(() => {
        const handler = (e) => {
            // e.code = 'KeyK' بغض النظر عن لغة لوحة المفاتيح (عربي/إنجليزي)
            if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && (e.code === 'KeyF' || e.code === 'KeyK' || ['f', 'F', 'k', 'K'].includes(e.key))) {
                e.preventDefault();
                setOpen(true);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) {
            inputRef.current.focus();
        } else {
            setQuery('');
        }
    }, [open]);

    // Combined search results
    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return null;

        const items = [];

        // طلاب نشطين
        students.forEach(s => {
            if (s.name?.toLowerCase().includes(q) ||
                s.phone?.includes(q) ||
                s.username?.toLowerCase().includes(q)) {
                items.push({ type: 'student', icon: User, color: 'text-blue-400', bg: 'bg-blue-900/20', border: 'border-blue-500/20',
                    title: s.name, subtitle: `${s.belt || '—'} • ${s.phone || ''}`,
                    badge: 'طالب', badgeBg: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/20',
                    target: { tab: 'students', studentId: s.id } });
            }
        });

        // ترتيب: ابحث الأكثر تطابقاً أولاً (بدأ بالنص أولاً)
        items.sort((a, b) => {
            const aStarts = a.title?.toLowerCase().startsWith(q) ? -1 : 0;
            const bStarts = b.title?.toLowerCase().startsWith(q) ? -1 : 0;
            return aStarts - bStarts;
        });

        return items.slice(0, 30); // كحد أقصى
    }, [query, students]);

    const handleSelect = (item) => {
        if (onNavigate && item.target?.tab) onNavigate(item.target.tab, item.target.studentId);
        setOpen(false);
    };

    if (!open) return null;

    return createPortal(
        <div role="dialog" aria-modal="true" aria-label="بحث عن طالب" dir="rtl" className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[10vh] bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}>
            <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
                onClick={e => e.stopPropagation()}>

                {/* حقل البحث */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950">
                    <Search size={18} className="text-yellow-500 shrink-0"/>
                    <input ref={inputRef} aria-label="بحث عن طالب" onKeyDown={e => { if (e.key === "Enter" && results?.length) { e.preventDefault(); handleSelect(results[0]); } }}
                        className="flex-1 min-w-0 bg-transparent text-slate-100 outline-none placeholder-slate-600 text-base"
                        placeholder="اسم الطالب، الهاتف، أو اسم المستخدم"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <kbd className="hidden md:inline-flex items-center px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[10px] font-mono text-slate-500">
                        ESC
                    </kbd>
                    <button onClick={() => setOpen(false)} className="md:hidden text-slate-500 hover:text-red-400">
                        <X size={18}/>
                    </button>
                </div>

                {/* النتائج */}
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {!query.trim() ? (
                        <div className="p-8 text-center text-slate-600">
                            <Search size={32} className="mx-auto mb-3 opacity-30"/>
                            <p className="text-sm font-bold">ابحث عن طالب وافتح ملفه مباشرة</p>
                            <p className="text-xs mt-1">طلاب الفرع الحالي • حسب صلاحيات حسابك</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-slate-600">
                            <p className="text-sm font-bold">لا يوجد نتائج لـ "{query}"</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {results.map((item, i) => (
                                <button key={i} onClick={() => handleSelect(item)}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 group transition-colors text-right">
                                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.bg} border ${item.border}`}>
                                        <item.icon size={15} className={item.color}/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-200 truncate group-hover:text-yellow-400">{item.title}</p>
                                        <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border shrink-0 ${item.badgeBg}`}>
                                        {item.badge}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-600">
                    <span>{results ? `${results.length} نتيجة` : 'اكتب للبحث'}</span>
                    <span>
                        <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono">Ctrl</kbd>
                        +
                        <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono">F</kbd>
                        {' '}للفتح بأي وقت
                    </span>
                </div>
            </div>
        </div>,
        document.body
    );
}

// src/components/QuickSearch.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, User, DollarSign, AlertTriangle, Archive, Phone } from 'lucide-react';

/**
 * QuickSearch — Cmd/Ctrl+K modal that searches everything at once
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
    students = [], archivedStudents = [], payments = [], debts = [], onNavigate
}) {
    const [open, setOpen]   = useState(false);

    // نُعرّض الدالة على window حتى أي زر يقدر يفتحها
    useEffect(() => {
        window.__openQuickSearch = () => setOpen(true);
        return () => { delete window.__openQuickSearch; };
    }, []);
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    // Cmd/Ctrl + K to open — يستخدم e.code علشان يشتغل مع اللوحة العربية أيضاً
    useEffect(() => {
        const handler = (e) => {
            // e.code = 'KeyK' بغض النظر عن لغة لوحة المفاتيح (عربي/إنجليزي)
            if ((e.metaKey || e.ctrlKey) && (e.code === 'KeyK' || e.key === 'k' || e.key === 'K' || e.key === 'لا')) {
                e.preventDefault();
                setOpen(o => !o);
            }
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) {
            setTimeout(() => inputRef.current.focus(), 50);
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
                    badge: 'نشط', badgeBg: 'bg-emerald-900/30 text-emerald-400 border-emerald-500/20',
                    target: { tab: 'students' } });
            }
        });

        // طلاب مؤرشفين
        archivedStudents.forEach(s => {
            if (s.name?.toLowerCase().includes(q) || s.phone?.includes(q)) {
                items.push({ type: 'archived', icon: Archive, color: 'text-orange-400', bg: 'bg-orange-900/20', border: 'border-orange-500/20',
                    title: s.name, subtitle: `${s.belt || '—'} • مؤرشف ${s.archivedAt || ''}`,
                    badge: '📦 مؤرشف', badgeBg: 'bg-orange-900/30 text-orange-400 border-orange-500/20',
                    target: { tab: 'archive' } });
            }
        });

        // وصولات (بحث بالاسم أو السبب أو المبلغ)
        payments.forEach(p => {
            if (p.name?.toLowerCase().includes(q) ||
                p.reason?.toLowerCase().includes(q) ||
                String(p.amount).includes(q)) {
                items.push({ type: 'payment', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-500/20',
                    title: `${p.name} — ${p.amount} JD`, subtitle: `${p.reason || '-'} • ${p.date || ''}`,
                    badge: p.method === 'cliq' ? 'كليك' : 'كاش',
                    badgeBg: p.method === 'cliq' ? 'bg-blue-900/30 text-blue-400 border-blue-500/20' : 'bg-green-900/30 text-green-400 border-green-500/20',
                    target: { tab: 'finance' } });
            }
        });

        // ذمم
        debts.forEach(d => {
            const remaining = Number(d.totalAmount) - Number(d.paidAmount || 0);
            if (d.studentName?.toLowerCase().includes(q) ||
                d.reason?.toLowerCase().includes(q)) {
                items.push({ type: 'debt', icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-900/20', border: 'border-red-500/20',
                    title: `${d.studentName} — ${remaining} JD`, subtitle: `${d.reason || ''} • متبقي`,
                    badge: remaining > 0 ? 'غير مدفوع' : 'مسدّد',
                    badgeBg: remaining > 0 ? 'bg-red-900/30 text-red-400 border-red-500/20' : 'bg-emerald-900/30 text-emerald-400 border-emerald-500/20',
                    target: { tab: 'debts' } });
            }
        });

        // ترتيب: ابحث الأكثر تطابقاً أولاً (بدأ بالنص أولاً)
        items.sort((a, b) => {
            const aStarts = a.title?.toLowerCase().startsWith(q) ? -1 : 0;
            const bStarts = b.title?.toLowerCase().startsWith(q) ? -1 : 0;
            return aStarts - bStarts;
        });

        return items.slice(0, 30); // كحد أقصى
    }, [query, students, archivedStudents, payments, debts]);

    const handleSelect = (item) => {
        if (onNavigate && item.target?.tab) onNavigate(item.target.tab);
        setOpen(false);
    };

    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-[10vh] bg-black/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}>
            <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
                onClick={e => e.stopPropagation()}>

                {/* حقل البحث */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-800 bg-slate-950">
                    <Search size={18} className="text-yellow-500 shrink-0"/>
                    <input ref={inputRef}
                        className="flex-1 bg-transparent text-slate-100 outline-none placeholder-slate-600 text-base"
                        placeholder="ابحث في الطلاب، الوصولات، الذمم..."
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
                            <p className="text-sm font-bold">ابحث في كل البيانات بضغطة زر</p>
                            <p className="text-xs mt-1">الطلاب • الوصولات • الذمم • الأرشيف</p>
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
                        <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded font-mono">K</kbd>
                        {' '}للفتح بأي وقت
                    </span>
                </div>
            </div>
        </div>,
        document.body
    );
}

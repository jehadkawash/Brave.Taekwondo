// src/views/dashboard/NotesManager.jsx
import React, { useState, useMemo } from 'react';
import {
    Lock, MessageCircle, Send, Trash2, Printer,
    User, Edit3, X, CheckCircle, AlertTriangle,
    ChevronLeft, FileText, Bell
} from 'lucide-react';
import { StudentSearch } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

// ─────────────────────────────────────────────────────────────────────────────
//  نظام الملاحظات:
//   🔒 خاصة  →  internalNotes[]   (إدارة فقط — لا تظهر للأهل أبداً)
//   📢 عامة  →  notes[]            (تظهر في بوابة الأهل)
// ─────────────────────────────────────────────────────────────────────────────

export default function NotesManager({ students, studentsCollection, logActivity, selectedBranch }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeTab, setActiveTab]             = useState('private'); // 'private' | 'public'
    const [noteText, setNoteText]               = useState('');
    const [editingNote, setEditingNote]         = useState(null);
    const [isSaving, setIsSaving]               = useState(false);

    // ─── استخراج الملاحظات حسب النوع ─────────────────────────────────────────

    const getPrivateNotes = (s) => {
        if (!s) return [];
        const result = [];
        if (s.note && s.note.trim())
            result.push({ id: 'legacy', text: s.note, date: 'سجل قديم', isLegacy: true });
        (s.internalNotes || []).forEach(n => result.push(n));
        // ملاحظات خاصة محفوظة غلط في notes[] (من نظام قديم)
        (s.notes || []).filter(n => n.type === 'private').forEach(n =>
            result.push({ ...n, _wrongPlace: true })
        );
        return result.sort((a, b) => a.isLegacy ? 1 : b.isLegacy ? -1 : b.id > a.id ? 1 : -1);
    };

    const getPublicNotes = (s) => {
        if (!s) return [];
        return (s.notes || [])
            .filter(n => n.type !== 'private')
            .sort((a, b) => b.id > a.id ? 1 : -1);
    };

    // ─── قائمة الطلاب الذين عندهم ملاحظات ─────────────────────────────────────
    const studentsWithNotes = useMemo(() => students.filter(s =>
        (s.note && s.note.trim()) ||
        (s.internalNotes && s.internalNotes.length > 0) ||
        (s.notes && s.notes.length > 0)
    ), [students]);

    const privateNotes = useMemo(() => getPrivateNotes(selectedStudent), [selectedStudent]);
    const publicNotes  = useMemo(() => getPublicNotes(selectedStudent),  [selectedStudent]);

    // ─── حفظ ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!selectedStudent || !noteText.trim() || isSaving) return;
        setIsSaving(true);

        try {
            let updatedData = {};

            if (editingNote) {
                if (editingNote.isLegacy) {
                    updatedData = { note: noteText };
                } else if (activeTab === 'private') {
                    const current = selectedStudent.internalNotes || [];
                    updatedData = { internalNotes: current.map(n => n.id === editingNote.id ? { ...n, text: noteText } : n) };
                } else {
                    const current = selectedStudent.notes || [];
                    updatedData = { notes: current.map(n => n.id === editingNote.id ? { ...n, text: noteText } : n) };
                }
                logActivity('تعديل ملاحظة', `تعديل ملاحظة للطالب ${selectedStudent.name}`);
            } else {
                const newNote = {
                    id:     Date.now().toString(),
                    text:   noteText.trim(),
                    type:   activeTab,
                    date:   new Date().toLocaleDateString('en-GB'),
                    branch: selectedBranch,
                };
                if (activeTab === 'private') {
                    const current = selectedStudent.internalNotes || [];
                    updatedData = { internalNotes: [newNote, ...current] };
                } else {
                    const current = selectedStudent.notes || [];
                    updatedData = { notes: [newNote, ...current] };
                }
                logActivity('ملاحظة جديدة', `إضافة ملاحظة ${activeTab === 'private' ? 'خاصة' : 'عامة'} للطالب ${selectedStudent.name}`);
            }

            await studentsCollection.update(selectedStudent.id, updatedData);
            setSelectedStudent(prev => ({ ...prev, ...updatedData }));
            setNoteText('');
            setEditingNote(null);
        } finally {
            setIsSaving(false);
        }
    };

    // ─── حذف ─────────────────────────────────────────────────────────────────
    const handleDelete = async (note, tab) => {
        if (!confirm('حذف هذه الملاحظة نهائياً؟')) return;
        let updatedData = {};

        if (note.isLegacy) {
            updatedData = { note: '' };
        } else if (tab === 'private') {
            const current = selectedStudent.internalNotes || [];
            updatedData = { internalNotes: current.filter(n => n.id !== note.id) };
            if (note._wrongPlace) {
                updatedData.notes = (selectedStudent.notes || []).filter(n => n.id !== note.id);
            }
        } else {
            updatedData = { notes: (selectedStudent.notes || []).filter(n => n.id !== note.id) };
        }

        await studentsCollection.update(selectedStudent.id, updatedData);
        logActivity('حذف ملاحظة', `حذف ملاحظة للطالب ${selectedStudent.name}`);
        setSelectedStudent(prev => ({ ...prev, ...updatedData }));
        if (editingNote?.id === note.id) { setEditingNote(null); setNoteText(''); }
    };

    const startEdit = (note) => {
        setEditingNote(note);
        setNoteText(note.text);
    };

    const cancelEdit = () => { setEditingNote(null); setNoteText(''); };

    const selectStudent = (s) => {
        setSelectedStudent(s);
        setEditingNote(null);
        setNoteText('');
    };

    // ─── طباعة شاملة ─────────────────────────────────────────────────────────
    const printAll = () => {
        const win    = window.open('', 'PRINT', 'height=800,width=1100');
        const logo   = window.location.origin + IMAGES.LOGO;
        let rows     = '';
        let i        = 1;

        studentsWithNotes.forEach(s => {
            [...getPrivateNotes(s), ...getPublicNotes(s)].forEach(n => {
                rows += `<tr>
                    <td style="border:1px solid #ddd;padding:6px;text-align:center;font-size:12px;">${i++}</td>
                    <td style="border:1px solid #ddd;padding:6px;font-weight:bold;">${s.name}</td>
                    <td style="border:1px solid #ddd;padding:6px;text-align:center;font-size:11px;">${s.belt||'-'}</td>
                    <td style="border:1px solid #ddd;padding:6px;text-align:center;direction:ltr;font-size:11px;">${n.date}</td>
                    <td style="border:1px solid #ddd;padding:6px;text-align:center;font-weight:bold;color:${n.type==='private'||n.isLegacy?'#991b1b':'#166534'}">
                        ${n.type === 'private' || n.isLegacy ? '🔒 خاصة' : '📢 عامة'}
                    </td>
                    <td style="border:1px solid #ddd;padding:6px;font-size:12px;">${n.text}</td>
                </tr>`;
            });
        });

        win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl">
        <head><meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page{size:A4 landscape;margin:10mm}
            body{font-family:'Cairo',sans-serif;color:#000;background:#fff}
            table{width:100%;border-collapse:collapse;font-size:12px;margin-top:15px}
            th{background:#f3f4f6;border:1px solid #ddd;padding:8px;text-align:center;font-weight:bold}
            @media print{body{-webkit-print-color-adjust:exact}}
        </style></head>
        <body>
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #000;padding-bottom:10px;margin-bottom:15px">
            <div>
                <h1 style="margin:0;font-size:20px;font-weight:900">التقرير الإداري — سجل الملاحظات</h1>
                <p style="margin:4px 0 0;font-size:12px;color:#555;font-weight:bold">الفرع: ${selectedBranch} | ${new Date().toLocaleDateString('en-GB')}</p>
            </div>
            <img src="${logo}" style="height:55px;object-fit:contain" onerror="this.style.display='none'"/>
        </div>
        <table>
            <thead><tr>
                <th style="width:30px">#</th><th style="width:160px">الطالب</th>
                <th style="width:80px">الحزام</th><th style="width:100px">التاريخ</th>
                <th style="width:90px">النوع</th><th>الملاحظة</th>
            </tr></thead>
            <tbody>${rows || '<tr><td colspan="6" style="text-align:center;padding:20px">لا يوجد ملاحظات</td></tr>'}</tbody>
        </table>
        <script>window.onload=()=>{window.print();window.close()}</script>
        </body></html>`);
        win.document.close();
    };

    // ─── مكوّن بطاقة الملاحظة ────────────────────────────────────────────────
    const NoteCard = ({ note, tab }) => (
        <div className={`group relative rounded-2xl border p-4 transition-all
            ${tab === 'private'
                ? 'bg-red-950/20 border-red-900/30 hover:border-red-500/40'
                : 'bg-emerald-950/20 border-emerald-900/30 hover:border-emerald-500/40'}
            ${editingNote?.id === note.id ? 'ring-2 ring-yellow-500/50 border-yellow-500/30' : ''}
        `}>
            {note._wrongPlace && (
                <div className="flex items-center gap-2 text-[10px] text-orange-400 bg-orange-900/20 px-3 py-1.5 rounded-lg mb-3 border border-orange-500/20">
                    <AlertTriangle size={12}/> محفوظة في مكان غير صحيح — احذفها وأعد كتابتها
                </div>
            )}
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">{note.text}</p>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                <span className={`text-[10px] font-bold font-mono ${tab === 'private' ? 'text-red-500/60' : 'text-emerald-500/60'}`}>
                    {note.date} {note.isLegacy && '• سجل قديم'}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!note.isLegacy && (
                        <button onClick={() => startEdit(note)}
                            className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors">
                            <Edit3 size={13}/>
                        </button>
                    )}
                    <button onClick={() => handleDelete(note, tab)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 size={13}/>
                    </button>
                </div>
            </div>
        </div>
    );

    // ─── مكوّن حقل الكتابة ────────────────────────────────────────────────────
    const NoteInput = ({ tab }) => (
        <div className={`rounded-2xl border p-4 mt-4
            ${tab === 'private' ? 'bg-red-950/10 border-red-900/20' : 'bg-emerald-950/10 border-emerald-900/20'}`}>
            {editingNote && activeTab === tab && (
                <div className="flex items-center justify-between bg-yellow-900/20 px-3 py-2 rounded-xl mb-3 border border-yellow-500/30">
                    <span className="text-xs text-yellow-400 font-bold flex items-center gap-1">
                        <Edit3 size={12}/> وضع التعديل
                    </span>
                    <button onClick={cancelEdit} className="text-slate-500 hover:text-red-400 transition-colors">
                        <X size={14}/>
                    </button>
                </div>
            )}
            <div className="flex gap-2 items-end">
                <textarea
                    className={`flex-1 bg-slate-950/50 border rounded-xl p-3 text-sm text-slate-200 outline-none transition-all resize-none placeholder-slate-600 min-h-[44px] max-h-[100px]
                        ${tab === 'private'
                            ? 'border-red-900/40 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
                            : 'border-emerald-900/40 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20'}`}
                    placeholder={tab === 'private' ? 'اكتب ملاحظة سرية للإدارة...' : 'اكتب إعلاناً للأهل...'}
                    value={activeTab === tab ? noteText : ''}
                    onChange={e => { if (activeTab !== tab) setActiveTab(tab); setNoteText(e.target.value); }}
                    onFocus={() => { if (activeTab !== tab) { setActiveTab(tab); setNoteText(''); setEditingNote(null); }}}
                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey && activeTab === tab) handleSave(); }}
                    rows={1}
                />
                <button
                    onClick={() => { setActiveTab(tab); setTimeout(handleSave, 0); }}
                    disabled={!noteText.trim() || isSaving || activeTab !== tab}
                    className={`p-3 rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed shrink-0
                        ${tab === 'private'
                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/30'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'}`}
                >
                    {editingNote && activeTab === tab ? <CheckCircle size={16}/> : <Send size={16}/>}
                </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-1.5">Ctrl+Enter للإرسال</p>
        </div>
    );

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col gap-6 animate-fade-in font-sans pb-20 md:pb-0" dir="rtl">

            {/* ── شريط علوي ── */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                        <FileText size={20} className="text-yellow-500"/>
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-100">سجل الملاحظات</h2>
                        <p className="text-xs text-slate-500">{studentsWithNotes.length} طالب لديهم ملاحظات</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex-1 md:w-72">
                        <StudentSearch
                            students={students}
                            onSelect={selectStudent}
                            onClear={() => setSelectedStudent(null)}
                            placeholder="ابحث عن طالب..."
                        />
                    </div>
                    <button onClick={printAll}
                        className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold transition-colors">
                        <Printer size={15}/> <span className="hidden sm:inline">طباعة الكل</span>
                    </button>
                </div>
            </div>

            {/* ── المحتوى الرئيسي ── */}
            <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">

                {/* ─ العمود الأيمن: قائمة الطلاب ─ */}
                <div className="w-full lg:w-72 shrink-0">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">طلاب لديهم ملاحظات</p>
                        </div>
                        <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: 520 }}>
                            {studentsWithNotes.length === 0 ? (
                                <div className="text-center py-12 text-slate-600">
                                    <FileText size={32} className="mx-auto mb-2 opacity-30"/>
                                    <p className="text-xs">لا يوجد ملاحظات</p>
                                </div>
                            ) : studentsWithNotes.map(s => {
                                const priv = getPrivateNotes(s).length;
                                const pub  = getPublicNotes(s).length;
                                const isSelected = selectedStudent?.id === s.id;
                                return (
                                    <button key={s.id} onClick={() => selectStudent(s)}
                                        className={`w-full text-right px-4 py-3.5 border-b border-slate-800/50 last:border-0 transition-all flex items-center justify-between gap-2
                                            ${isSelected
                                                ? 'bg-yellow-500/10 border-r-2 border-r-yellow-500'
                                                : 'hover:bg-slate-800/50'}`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0
                                                ${isSelected ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                {s.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`font-bold text-sm truncate ${isSelected ? 'text-yellow-400' : 'text-slate-300'}`}>
                                                    {s.name}
                                                </p>
                                                <p className="text-[10px] text-slate-600 truncate">{s.belt}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            {priv > 0 && (
                                                <span className="text-[10px] font-black bg-red-900/30 text-red-400 px-1.5 py-0.5 rounded-md border border-red-500/20">
                                                    🔒{priv}
                                                </span>
                                            )}
                                            {pub > 0 && (
                                                <span className="text-[10px] font-black bg-emerald-900/30 text-emerald-400 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                                                    📢{pub}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ─ العمود الأيسر: منطقة العمل ─ */}
                <div className="flex-1 min-w-0">
                    {!selectedStudent ? (
                        /* حالة: لم يُختر طالب */
                        <div className="h-full flex flex-col items-center justify-center bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl py-20">
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 border border-slate-700">
                                <User size={28} className="text-slate-500"/>
                            </div>
                            <p className="font-bold text-slate-400 mb-1">اختر طالباً من القائمة</p>
                            <p className="text-xs text-slate-600">أو ابحث باسمه في الأعلى</p>
                        </div>
                    ) : (
                        /* حالة: طالب مختار */
                        <div className="flex flex-col gap-5">

                            {/* بطاقة معلومات الطالب */}
                            <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 shadow-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center border border-yellow-500/20">
                                        <span className="text-xl font-black text-yellow-500">{selectedStudent.name.charAt(0)}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-slate-100">{selectedStudent.name}</h3>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{selectedStudent.belt}</span>
                                            <span className="text-[10px] text-slate-600">|</span>
                                            <span className="text-[10px] font-bold text-red-400">🔒 {privateNotes.length} خاصة</span>
                                            <span className="text-[10px] font-bold text-emerald-400">📢 {publicNotes.length} عامة</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedStudent(null)}
                                    className="p-2 text-slate-600 hover:text-slate-300 hover:bg-slate-800 rounded-xl transition-colors">
                                    <X size={18}/>
                                </button>
                            </div>

                            {/* قسمان: خاصة وعامة جنباً لجنب */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                                {/* ── 🔒 الملاحظات الخاصة ── */}
                                <div className="flex flex-col bg-slate-900 border border-red-900/30 rounded-2xl overflow-hidden shadow-lg">
                                    {/* رأس القسم */}
                                    <div className="flex items-center justify-between px-5 py-4 bg-red-950/30 border-b border-red-900/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-red-900/30 rounded-xl flex items-center justify-center border border-red-500/20">
                                                <Lock size={16} className="text-red-400"/>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-sm text-red-300">ملاحظات خاصة</h4>
                                                <p className="text-[10px] text-red-500/60">للإدارة فقط • لا تظهر للأهل</p>
                                            </div>
                                        </div>
                                        {privateNotes.length > 0 && (
                                            <span className="text-xs font-black bg-red-900/30 text-red-400 px-2.5 py-1 rounded-lg border border-red-500/20">
                                                {privateNotes.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* قائمة الملاحظات */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3" style={{ maxHeight: 320 }}>
                                        {privateNotes.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-slate-700">
                                                <Lock size={28} className="mb-2 opacity-20"/>
                                                <p className="text-xs">لا يوجد ملاحظات خاصة</p>
                                            </div>
                                        ) : privateNotes.map((n, i) => (
                                            <NoteCard key={n.id || i} note={n} tab="private"/>
                                        ))}
                                    </div>

                                    {/* حقل الكتابة */}
                                    <div className="p-4 border-t border-red-900/20 bg-red-950/10">
                                        <NoteInput tab="private"/>
                                    </div>
                                </div>

                                {/* ── 📢 الإعلانات العامة ── */}
                                <div className="flex flex-col bg-slate-900 border border-emerald-900/30 rounded-2xl overflow-hidden shadow-lg">
                                    {/* رأس القسم */}
                                    <div className="flex items-center justify-between px-5 py-4 bg-emerald-950/30 border-b border-emerald-900/20">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-emerald-900/30 rounded-xl flex items-center justify-center border border-emerald-500/20">
                                                <Bell size={16} className="text-emerald-400"/>
                                            </div>
                                            <div>
                                                <h4 className="font-black text-sm text-emerald-300">إعلانات للأهل</h4>
                                                <p className="text-[10px] text-emerald-500/60">تظهر في بوابة الأهل</p>
                                            </div>
                                        </div>
                                        {publicNotes.length > 0 && (
                                            <span className="text-xs font-black bg-emerald-900/30 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                                {publicNotes.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* قائمة الملاحظات */}
                                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3" style={{ maxHeight: 320 }}>
                                        {publicNotes.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center py-10 text-slate-700">
                                                <Bell size={28} className="mb-2 opacity-20"/>
                                                <p className="text-xs">لا يوجد إعلانات للأهل</p>
                                            </div>
                                        ) : publicNotes.map((n, i) => (
                                            <NoteCard key={n.id || i} note={n} tab="public"/>
                                        ))}
                                    </div>

                                    {/* حقل الكتابة */}
                                    <div className="p-4 border-t border-emerald-900/20 bg-emerald-950/10">
                                        <NoteInput tab="public"/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

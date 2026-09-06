import React, { useMemo, useRef, useState } from 'react';
import { Search, Edit3, Trash2, Lock, Bell, X, Printer } from 'lucide-react';
import { toast } from '../../lib/toast';

const noteTime = note => {
    const direct = Date.parse(note.timestamp || note.createdAt || '');
    if (Number.isFinite(direct)) return direct;
    const parts = String(note.date || '').match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
    return parts ? new Date(Number(parts[3]), Number(parts[2]) - 1, Number(parts[1])).getTime() : 0;
};

// Keep each legacy note's source so editing never changes its audience or storage field.
export const studentNotes = student => [
    ...(student?.note?.trim() ? [{ text: student.note, date: 'سجل قديم', source: 'note', key: 'legacy', audience: 'private' }] : []),
    ...(student?.internalNotes || []).map((note, index) => ({ ...note, source: 'internalNotes', index, key: `internal-${note.id || index}`, audience: 'private' })),
    ...(student?.notes || []).map((note, index) => ({ ...note, source: 'notes', index, key: `notes-${note.id || index}`, audience: note.type === 'private' ? 'private' : 'public' })),
].sort((a,b) => noteTime(b) - noteTime(a));

export default function NotesManager({ students = [], studentsCollection, logActivity, selectedBranch, initialStudentId = null, embedded = false }) {
    const [selectedId, setSelectedId] = useState(initialStudentId);
    const [search, setSearch] = useState('');
    const [audience, setAudience] = useState('private');
    const [filter, setFilter] = useState('all');
    const [text, setText] = useState('');
    const [editing, setEditing] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const busyRef = useRef(false);
    const selected = students.find(student => student.id === selectedId);
    const notes = useMemo(() => studentNotes(selected), [selected]);
    const visibleNotes = notes.filter(note => filter === 'all' || note.audience === filter);
    const matches = students.filter(student => [student.name, student.phone, student.username].some(value => String(value || '').toLowerCase().includes(search.trim().toLowerCase())));
    const cancel = () => { setText(''); setEditing(null); setAudience('private'); setError(''); };
    const select = id => {
        if (busyRef.current) return;
        if (text.trim() && !confirm('لديك نص غير محفوظ. الانتقال لطالب آخر؟')) return;
        cancel(); setSelectedId(id); setSearch(''); setFilter('all');
    };
    const patchNote = (note, replacement) => {
        const latest = studentNotes(selected).find(item => item.key === note.key);
        if (!latest || latest.text !== note.text) throw new Error('تغيرت الملاحظة أثناء العمل. افتحها مجدداً قبل التعديل.');
        if (latest.source === 'note') return { note: replacement ?? '' };
        const array = selected[latest.source] || [];
        return { [latest.source]: replacement === null ? array.filter((_, i) => i !== latest.index) : array.map((item, i) => i === latest.index ? { ...item, text: replacement, updatedAt: new Date().toISOString() } : item) };
    };
    const persist = async (patch, action) => {
        const saved = await studentsCollection.update(selected.id, patch);
        if (!saved) throw new Error('تعذر الحفظ. بقي النص كما هو؛ حاول مرة أخرى.');
        if (logActivity) { try { await logActivity(action, `${action} للطالب ${selected.name}`); } catch { /* The note was saved even if activity logging is unavailable. */ } }
    };
    const save = async event => {
        event.preventDefault();
        if (!selected || !text.trim() || busyRef.current) return;
        busyRef.current = true; setBusy(true); setError('');
        try {
            let patch;
            if (editing) patch = patchNote(editing, text.trim());
            else {
                const field = audience === 'private' ? 'internalNotes' : 'notes';
                const note = { id: crypto.randomUUID(), text: text.trim(), type: audience, timestamp: new Date().toISOString(), date: new Date().toLocaleDateString('en-GB'), branch: selectedBranch || selected.branch || '' };
                patch = { [field]: [note, ...(selected[field] || [])] };
            }
            await persist(patch, editing ? 'تعديل ملاحظة' : 'إضافة ملاحظة');
            cancel(); toast('تم حفظ الملاحظة', 'success');
        } catch (err) { setError(err.message || 'تعذر الحفظ'); }
        finally { setBusy(false); busyRef.current = false; }
    };
    const remove = async note => {
        if (busyRef.current || !confirm('حذف هذه الملاحظة نهائياً؟')) return;
        busyRef.current = true; setBusy(true); setError('');
        try { await persist(patchNote(note, null), 'حذف ملاحظة'); if (editing?.key === note.key) cancel(); toast('تم حذف الملاحظة', 'success'); }
        catch (err) { setError(err.message || 'تعذر الحذف'); }
        finally { setBusy(false); busyRef.current = false; }
    };
    const startEdit = note => {
        if (text.trim() && !confirm('استبدال النص غير المحفوظ بالملاحظة المختارة؟')) return;
        setEditing(note); setText(note.text); setAudience(note.audience); setError(''); inputRef.current?.focus();
    };
    const print = () => {
        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) return toast('اسمح بفتح نافذة الطباعة', 'error');
        const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
        win.document.write(`<html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>ملاحظات الطالب</title><style>body{font-family:Arial;padding:24px}article{border-bottom:1px solid #ddd;padding:16px 0}p{white-space:pre-wrap}</style></head><body><h1>${escape(selected.name)}</h1><p>${escape(selectedBranch)} — سجل الملاحظات</p>${visibleNotes.map(note => `<article><small>${escape(note.date)} · ${note.audience === 'private' ? 'للإدارة' : 'تظهر للأهل'}</small><p>${escape(note.text)}</p></article>`).join('')}</body></html>`);
        win.document.close(); win.focus(); win.print();
    };
    return <div dir="rtl" className="space-y-4">
        {!embedded && <header><h2 className="text-2xl font-black text-slate-100">الملاحظات والرسائل</h2><p className="text-sm text-slate-400 mt-2">اختر الطالب، اكتب الملاحظة، واحفظها في سجله.</p></header>}
        {!embedded && <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <label className="block text-sm text-slate-300">البحث عن طالب<div className="relative mt-2"><Search size={18} className="absolute right-3 top-3 text-slate-500"/><input disabled={busy} value={search} onChange={event => setSearch(event.target.value)} placeholder="الاسم أو الهاتف أو اسم المستخدم" className="w-full min-h-11 rounded-xl bg-slate-950 border border-slate-700 pr-10 pl-3 text-slate-200"/></div></label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">{matches.map(student => <button key={student.id} disabled={busy} onClick={() => select(student.id)} aria-pressed={selectedId === student.id} className={`min-h-11 px-3 py-2 rounded-xl border text-sm text-right ${selectedId === student.id ? 'bg-yellow-500 text-slate-900 border-yellow-500' : 'bg-slate-950 text-slate-300 border-slate-700'}`}>{student.name}<span className="opacity-70 mr-2">({studentNotes(student).length})</span></button>)}{!matches.length && <p className="text-sm text-slate-400">لا يوجد طلاب مطابقون للبحث.</p>}</div>
        </section>}
        {!selected ? <div className="text-center rounded-2xl border border-dashed border-slate-700 p-10 text-slate-400">اختر طالباً لعرض سجله أو إضافة أول ملاحظة.</div> : <>
            <form onSubmit={save} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-lg text-slate-100">{editing ? 'تعديل ملاحظة' : 'ملاحظة جديدة'} · {selected.name}</h3>{editing && <button type="button" disabled={busy} onClick={cancel} className="min-h-11 px-3 text-slate-400 flex items-center gap-1"><X size={16}/> إلغاء التعديل</button>}</div>
                <div className="flex flex-wrap gap-2">{[['private','للإدارة',Lock],['public','تظهر للأهل',Bell]].map(([value,label,Icon]) => <button key={value} type="button" disabled={busy || Boolean(editing)} aria-pressed={audience === value} onClick={() => setAudience(value)} className={`min-h-11 px-4 rounded-xl border flex items-center gap-2 text-sm ${audience === value ? 'border-yellow-500 text-yellow-500 bg-slate-800' : 'border-slate-700 text-slate-400'}`}><Icon size={16}/>{label}</button>)}</div>
                <p className="text-xs text-slate-400">{audience === 'public' ? 'هذه الملاحظة ستظهر في بوابة أهل الطالب بعد الحفظ.' : 'ملاحظة للمتابعة الإدارية.'}</p>
                <label className="block text-sm text-slate-300">نص الملاحظة<textarea ref={inputRef} disabled={busy} value={text} onChange={event => setText(event.target.value)} rows={4} placeholder="اكتب الملاحظة هنا..." className="mt-2 w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 resize-y focus:outline-yellow-500"/></label>
                {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
                <button disabled={busy || !text.trim()} className="min-h-11 px-6 rounded-xl bg-yellow-500 text-slate-900 font-bold disabled:opacity-40">{busy ? 'جاري الحفظ...' : editing ? 'حفظ التعديل' : audience === 'public' ? 'حفظ وإظهار للأهل' : 'حفظ الملاحظة'}</button>
            </form>
            <section className="space-y-3"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-slate-200">سجل {selected.name} ({notes.length})</h3><button onClick={print} disabled={!visibleNotes.length} className="min-h-11 px-3 text-slate-400 flex items-center gap-2 text-sm disabled:opacity-40"><Printer size={16}/> طباعة المعروض</button></div>
                <div className="flex gap-2">{[['all','الكل'],['private','للإدارة'],['public','للأهل']].map(([value,label]) => <button key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={`min-h-11 px-4 rounded-xl text-sm ${filter === value ? 'bg-slate-800 text-yellow-500' : 'text-slate-400'}`}>{label}</button>)}</div>
                {!visibleNotes.length && <p className="p-6 text-center text-slate-400 border border-dashed border-slate-700 rounded-xl">لا توجد ملاحظات في هذا القسم.</p>}
                {visibleNotes.map(note => <article key={note.key} className="bg-slate-900 border border-slate-800 rounded-xl p-4"><div className="flex flex-wrap justify-between gap-2 text-xs text-slate-400"><span>{note.audience === 'private' ? 'للإدارة' : 'تظهر للأهل'}</span><span>{note.date || 'تاريخ غير محدد'}{note.updatedAt ? ' · معدّلة' : ''}</span></div><p className="text-slate-200 text-sm leading-7 whitespace-pre-wrap break-words my-3">{note.text}</p><div className="flex gap-2"><button disabled={busy} onClick={() => startEdit(note)} className="min-h-11 px-3 rounded-lg text-slate-300 bg-slate-800 flex items-center gap-2 text-sm"><Edit3 size={15}/> تعديل</button><button disabled={busy} onClick={() => remove(note)} className="min-h-11 px-3 rounded-lg text-red-400 flex items-center gap-2 text-sm"><Trash2 size={15}/> حذف</button></div></article>)}
            </section>
        </>}
    </div>;
}

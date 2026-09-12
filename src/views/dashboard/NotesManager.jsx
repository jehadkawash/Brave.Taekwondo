import React, { useMemo, useRef, useState } from 'react';
import { Search, Edit3, Trash2, Lock, Bell, X, Printer, Plus, ArrowRight, ChevronDown } from 'lucide-react';
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
    const [filter, setFilter] = useState('private');
    const [composing, setComposing] = useState(false);
    const [recordSearch, setRecordSearch] = useState('');
    const [limit, setLimit] = useState(30);
    const [overviewFilter, setOverviewFilter] = useState('all');
    const [text, setText] = useState('');
    const [editing, setEditing] = useState(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const busyRef = useRef(false);
    const selected = students.find(student => student.id === selectedId);
    const notes = useMemo(() => studentNotes(selected), [selected]);
    const visibleNotes = notes.filter(note => note.audience === filter && String(note.text || '').toLowerCase().includes(recordSearch.trim().toLowerCase()));
    const matches = useMemo(() => students.filter(student => [student.name, student.phone, student.secondaryPhone, student.username].some(value => String(value || '').toLowerCase().includes(search.trim().toLowerCase()))).sort((a,b) => noteTime(studentNotes(b)[0] || {}) - noteTime(studentNotes(a)[0] || {}) || String(a.name || '').localeCompare(b.name || '', 'ar')), [students, search]);
    const listedStudents = matches.filter(student => {
        const entries = studentNotes(student);
        return (search.trim() || entries.length > 0) && (overviewFilter === 'all' || entries.some(note => note.audience === overviewFilter));
    });
    const cancel = () => { setText(''); setEditing(null); setAudience('private'); setError(''); setComposing(false); };
    const select = id => {
        if (busyRef.current) return;
        if (text.trim() && !confirm('لديك نص غير محفوظ. الانتقال لطالب آخر؟')) return;
        cancel(); setSelectedId(id); setRecordSearch('');
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
        setComposing(true); setEditing(note); setText(note.text); setAudience(note.audience); setError(''); setTimeout(() => { inputRef.current?.focus(); inputRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 0);
    };
    const print = () => {
        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) return toast('اسمح بفتح نافذة الطباعة', 'error');
        const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
        win.document.write(`<html lang="ar" dir="rtl"><head><meta charset="UTF-8"><title>ملاحظات الطالب</title><style>body{font-family:Arial;padding:24px}article{border-bottom:1px solid #ddd;padding:16px 0}p{white-space:pre-wrap}</style></head><body><h1>${escape(selected.name)}</h1><p>${escape(selectedBranch)} — سجل الملاحظات</p>${visibleNotes.map(note => `<article><small>${escape(note.date)} · ${note.audience === 'private' ? 'للإدارة' : 'تظهر للأهل'}</small><p>${escape(note.text)}</p></article>`).join('')}</body></html>`);
        win.document.close(); win.focus(); win.print();
    };
    const begin = () => { cancel(); setAudience(filter); setComposing(true); setTimeout(() => inputRef.current?.focus(), 0); };
    const switchSection = value => {
        if (busyRef.current || (text.trim() && !confirm('لديك نص غير محفوظ. تغيير القسم وإلغاء المسودة؟'))) return;
        cancel(); setFilter(value); setRecordSearch('');
    };
    return <div dir="rtl" className="space-y-5">
        {!embedded && <header><h2 className="text-2xl font-black text-slate-100">الملاحظات والرسائل</h2><p className="text-sm text-slate-400 mt-2">سجل واضح لكل طالب · {selectedBranch}</p></header>}
        <div>
            <main className="min-w-0">{!selected ? <div className="space-y-4">
                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"><label className="block text-slate-200 font-bold">البحث عن طالب<div className="relative mt-3"><Search size={20} className="absolute right-3 top-3.5 text-slate-500"/><input value={search} onChange={event => { setSearch(event.target.value); setLimit(30); setOverviewFilter('all'); }} placeholder="اسم الطالب أو رقم التواصل…" className="w-full min-h-12 rounded-xl bg-slate-950 border border-slate-700 pr-11 pl-3 text-sm text-slate-200"/></div></label><p className="text-xs text-slate-400">هنا الطلاب الذين لديهم ملاحظات أو رسائل فقط. لإضافة سجل لطالب آخر، ابحث عن اسمه واضغط +.</p></section>
                <div className="flex flex-wrap items-center justify-between gap-3"><div className="flex flex-wrap gap-2">{[['all','الكل'],['private','لديهم ملاحظات داخلية'],['public','لديهم رسائل للأهل']].map(([value,label]) => <button key={value} onClick={() => { setOverviewFilter(value); setLimit(30); }} aria-pressed={overviewFilter === value} className={`min-h-11 px-4 rounded-xl text-sm ${overviewFilter === value ? 'bg-yellow-500 text-slate-900 font-bold' : 'bg-slate-900 text-slate-400'}`}>{label}</button>)}</div><span className="text-xs text-slate-400">{listedStudents.length} طالب</span></div>
                <div className="space-y-3">{listedStudents.slice(0,limit).map(student => { const entries = studentNotes(student); const privateCount = entries.filter(note => note.audience === 'private').length; return <article key={student.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3"><button onClick={() => { select(student.id); setFilter(overviewFilter === 'all' ? (privateCount ? 'private' : entries.length ? 'public' : 'private') : overviewFilter); }} className="flex-1 min-w-0 text-right min-h-12"><h3 className="font-bold text-slate-100 break-words">{student.name}</h3><p className="text-xs text-slate-400 mt-2">{entries.length ? `${privateCount} ملاحظات داخلية · ${entries.length - privateCount} رسائل للأهل` : 'لا توجد ملاحظات بعد'}{entries[0]?.date ? ` · ${entries[0].date}` : ''}</p></button><button aria-label={`إضافة ملاحظة أو رسالة للطالب ${student.name}`} title="إضافة ملاحظة أو رسالة" onClick={() => { select(student.id); setFilter('private'); setAudience('private'); setComposing(true); setTimeout(() => inputRef.current?.focus(), 0); }} className="shrink-0 w-11 h-11 rounded-xl bg-yellow-500 text-slate-900 flex items-center justify-center"><Plus size={22}/></button></article>; })}</div>
                {!listedStudents.length && <div className="rounded-2xl border border-dashed border-slate-700 p-8 text-center text-slate-400">{search.trim() ? 'لا يوجد طالب مطابق للبحث أو الفلتر.' : 'لا يوجد طلاب لديهم سجلات في هذا القسم. ابحث عن طالب لإضافة ملاحظة.'}</div>}
                {listedStudents.length > limit && <button onClick={() => setLimit(limit + 30)} className="min-h-11 w-full text-yellow-500 bg-slate-900 rounded-xl">عرض المزيد من الطلاب</button>}
            </div> : <div className="space-y-4">
                <section className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="p-5">{!embedded && <button disabled={busy} onClick={() => select(null)} className="flex items-center gap-2 text-slate-400 text-sm min-h-11 mb-2"><ArrowRight size={16}/> العودة لقائمة الطلاب</button>}<h3 className="text-xl font-bold text-slate-100">{selected.name}</h3><p className="text-sm text-slate-400 mt-1">{selected.group || 'دون مجموعة'} · {notes.length} سجل</p></div>
                    <div className="grid grid-cols-2 border-t border-slate-800">{[['private','ملاحظات داخلية',Lock],['public','رسائل للأهل',Bell]].map(([value,label,Icon]) => <button key={value} disabled={busy} onClick={() => switchSection(value)} aria-pressed={filter === value} className={`min-h-14 px-2 py-4 flex items-center justify-center gap-2 text-sm border-b-2 ${filter === value ? 'border-yellow-500 bg-yellow-500/5 text-yellow-500 font-bold' : 'border-transparent text-slate-400'}`}><Icon size={16}/>{label}<span className="text-xs">({notes.filter(note => note.audience === value).length})</span></button>)}</div>
                </section>
                <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-xs text-slate-400">{filter === 'private' ? 'للإدارة فقط — لا تظهر في بوابة الأهل.' : 'تظهر في بوابة أهل الطالب؛ لا تُرسل عبر واتساب أو SMS.'}</p>{!composing && <button disabled={busy} onClick={begin} className="min-h-11 px-4 rounded-xl bg-yellow-500 text-slate-900 font-bold text-sm inline-flex items-center gap-2"><Plus size={17}/>{filter === 'private' ? 'إضافة ملاحظة' : 'كتابة رسالة للأهل'}</button>}</div>
                {composing && <form onSubmit={save} className="bg-slate-900 border border-yellow-500/40 rounded-2xl p-5 space-y-3"><div className="flex items-center justify-between gap-2"><h4 className="font-bold text-slate-100">{editing ? 'تعديل السجل' : audience === 'private' ? 'ملاحظة داخلية جديدة' : 'رسالة جديدة للأهل'}</h4><button type="button" disabled={busy} onClick={() => { if (!text.trim() || confirm('إلغاء المسودة غير المحفوظة؟')) cancel(); }} className="min-h-11 px-2 flex items-center gap-1 text-sm text-slate-400"><X size={16}/> إلغاء</button></div>{!editing && <div className="flex flex-wrap gap-2">{[['private','ملاحظة داخلية'],['public','رسالة للأهل']].map(([value,label]) => <button key={value} type="button" disabled={busy} aria-pressed={audience === value} onClick={() => { setAudience(value); setFilter(value); }} className={`min-h-11 px-4 rounded-xl border text-sm ${audience === value ? 'border-yellow-500 text-yellow-500' : 'border-slate-700 text-slate-400'}`}>{label}</button>)}</div>}<label className="block text-sm text-slate-300">{audience === 'private' ? 'نص الملاحظة' : 'نص الرسالة'}<textarea ref={inputRef} disabled={busy} value={text} onChange={event => setText(event.target.value)} rows={5} placeholder={audience === 'private' ? 'اكتب ما تحتاج الإدارة لمتابعته مع الطالب…' : 'اكتب الرسالة التي سيقرؤها أهل الطالب…'} className="mt-2 w-full bg-slate-950 text-slate-200 border border-slate-700 rounded-xl p-3 resize-y focus:outline-yellow-500"/></label><p className="text-xs text-slate-400">{audience === 'private' ? 'تبقى هذه الملاحظة داخل الإدارة.' : `ستظهر هذه الرسالة لأهل ${selected.name} بعد الحفظ.`}</p><button disabled={busy || !text.trim()} className="min-h-11 px-5 rounded-xl bg-yellow-500 text-slate-900 font-bold disabled:opacity-40">{busy ? 'جاري الحفظ…' : editing ? 'حفظ التعديل' : audience === 'public' ? 'حفظ وإظهار للأهل' : 'حفظ الملاحظة'}</button></form>}
                {error && <p role="alert" className="text-red-400 bg-red-900/10 border border-red-500/30 rounded-xl p-3 text-sm">{error}</p>}
                <section className="space-y-3"><div className="flex items-center gap-3"><label className="relative flex-1"><span className="sr-only">البحث داخل السجل</span><Search size={16} className="absolute right-3 top-3.5 text-slate-500"/><input value={recordSearch} onChange={event => setRecordSearch(event.target.value)} placeholder="بحث داخل هذا السجل" className="w-full min-h-11 bg-slate-900 border border-slate-800 rounded-xl pr-9 pl-3 text-sm text-slate-200"/></label><button onClick={print} disabled={!visibleNotes.length} className="min-h-11 px-3 text-slate-400 flex items-center gap-2 text-sm disabled:opacity-40"><Printer size={16}/> طباعة</button></div>
                    {!visibleNotes.length && <div className="p-8 text-center text-slate-400 border border-dashed border-slate-700 rounded-xl"><p>{recordSearch ? 'لا توجد نتائج لهذا البحث.' : filter === 'private' ? 'لا توجد ملاحظات داخلية لهذا الطالب بعد.' : 'لا توجد رسائل للأهل بعد.'}</p>{!recordSearch && !composing && <button onClick={begin} className="min-h-11 text-yellow-500 text-sm mt-2">{filter === 'private' ? 'اكتب أول ملاحظة' : 'اكتب أول رسالة'}</button>}</div>}
                    {visibleNotes.map(note => <article key={note.key} className="bg-slate-900 border border-slate-800 rounded-xl p-4"><div className="flex items-start justify-between gap-3"><div className="text-xs text-slate-400"><span>{note.date || 'تاريخ غير محدد'}</span>{note.updatedAt && <span className="mr-2">· معدّلة</span>}</div><details className="relative shrink-0"><summary className="cursor-pointer text-xs text-slate-400 min-h-8 list-none flex items-center gap-1">خيارات<ChevronDown size={14}/></summary><div className="absolute left-0 top-9 z-10 rounded-xl border border-slate-700 bg-slate-800 shadow-xl p-1 w-32"><button disabled={busy} onClick={event => { event.currentTarget.closest('details').open = false; startEdit(note); }} className="w-full min-h-11 px-3 rounded-lg text-slate-200 flex items-center gap-2 text-sm"><Edit3 size={15}/> تعديل</button><button disabled={busy} onClick={event => { event.currentTarget.closest('details').open = false; remove(note); }} className="w-full min-h-11 px-3 rounded-lg text-red-400 flex items-center gap-2 text-sm"><Trash2 size={15}/> حذف</button></div></details></div><p className="text-slate-200 text-sm leading-7 whitespace-pre-wrap break-words mt-2">{note.text}</p></article>)}
                </section>
            </div>}</main>
        </div>
    </div>;
}

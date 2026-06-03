// src/views/dashboard/WeightsManager.jsx
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Scale, Plus, Trash2, Edit3, X, CheckCircle, TrendingUp, TrendingDown,
    Minus, Trophy, Users, ChevronLeft, Calendar, Search, Target,
    Archive as ArchiveIcon, Printer
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useCollection } from '../../hooks/useCollection';
import { IMAGES } from '../../lib/constants';

// ─── helpers ────────────────────────────────────────────────────────────────
const nowIso = () => new Date().toISOString();
const fmtDate = (iso) => {
    if (!iso) return '-';
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};
const fmtTime = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// نوع التغيّر بين قراءتين
const diffType = (curr, prev) => {
    if (prev == null) return 'first';
    const d = Number(curr) - Number(prev);
    if (d > 0)  return 'up';
    if (d < 0)  return 'down';
    return 'same';
};

const DIFF_CFG = {
    up:    { color: 'text-red-400',     bg: 'bg-red-900/20',     border: 'border-red-500/20',     icon: TrendingUp,   label: 'زيادة' },
    down:  { color: 'text-emerald-400', bg: 'bg-emerald-900/20', border: 'border-emerald-500/20', icon: TrendingDown, label: 'نزول'  },
    same:  { color: 'text-slate-400',   bg: 'bg-slate-800',      border: 'border-slate-700',      icon: Minus,        label: 'ثبات'  },
    first: { color: 'text-blue-400',    bg: 'bg-blue-900/20',    border: 'border-blue-500/20',    icon: Scale,        label: 'بداية' },
};

// ─── مودال: إضافة/تعديل قياس وزن ─────────────────────────────────────────────
const WeightEntryModal = ({ student, editing, onClose, onSave }) => {
    const [weight, setWeight] = useState(editing?.weight || '');
    const [note, setNote]     = useState(editing?.note || '');
    const [saving, setSaving] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        const w = Number(weight);
        if (!w || w <= 0 || w > 300) return alert('أدخل وزناً صحيحاً بين 1 و 300 كغم');
        setSaving(true);
        try {
            await onSave({ weight: w, note: note.trim() });
            onClose();
        } finally { setSaving(false); }
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-blue-950/40 border-b border-blue-900/30 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-black text-lg text-blue-300 flex items-center gap-2">
                        <Scale size={20}/> {editing ? 'تعديل قياس' : 'تسجيل قياس وزن'}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400"><X size={20}/></button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="bg-slate-950 rounded-xl p-3 border border-slate-800">
                        <p className="text-xs text-slate-500 font-bold">الطالب</p>
                        <p className="text-base font-bold text-slate-200">{student.name}</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">الوزن (كغم)</label>
                        <input
                            type="number" step="0.1" min="1" max="300" autoFocus required
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl outline-none focus:border-blue-500 text-xl font-bold text-center"
                            placeholder="مثال: 65.5"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">ملاحظة (اختياري)</label>
                        <input
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-blue-500 placeholder-slate-600 text-sm"
                            placeholder="مثال: قبل التدريب..."
                            value={note}
                            onChange={e => setNote(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-2.5 text-slate-400 hover:bg-slate-800 rounded-xl text-sm font-bold transition-colors">
                            إلغاء
                        </button>
                        <button type="submit" disabled={saving}
                            className="flex-[2] py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm shadow-lg shadow-blue-900/20">
                            {saving ? 'جاري الحفظ...' : (editing ? 'حفظ التعديل' : 'تسجيل القياس')}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── مودال: تعديل/تعيين الهدف ────────────────────────────────────────────────
const TargetModal = ({ student, currentTarget, onClose, onSave }) => {
    const [target, setTarget] = useState(currentTarget || '');
    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-emerald-950/40 border-b border-emerald-900/30 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-black text-lg text-emerald-300 flex items-center gap-2">
                        <Target size={20}/> تعيين الوزن الهدف
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400"><X size={20}/></button>
                </div>
                <form onSubmit={e => { e.preventDefault(); onSave(Number(target) || null); onClose(); }} className="p-6 space-y-4">
                    <p className="text-sm text-slate-400">{student.name}</p>
                    <input
                        type="number" step="0.1" min="0" max="300" autoFocus
                        className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl outline-none focus:border-emerald-500 text-xl font-bold text-center"
                        placeholder="الوزن الهدف بالكغم"
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                    />
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => { onSave(null); onClose(); }}
                            className="flex-1 py-2.5 text-red-400 hover:bg-red-900/20 rounded-xl text-sm font-bold transition-colors">
                            إزالة الهدف
                        </button>
                        <button type="submit"
                            className="flex-[2] py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-900/20">
                            حفظ
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── مودال: إنشاء/تعديل بطولة ────────────────────────────────────────────────
const EventModal = ({ editing, onClose, onSave }) => {
    const [title, setTitle] = useState(editing?.title || '');
    const [eventDate, setEventDate] = useState(editing?.eventDate || '');

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                <div className="bg-yellow-950/40 border-b border-yellow-900/30 px-6 py-4 flex justify-between items-center">
                    <h3 className="font-black text-lg text-yellow-300 flex items-center gap-2">
                        <Trophy size={20}/> {editing ? 'تعديل بطولة' : 'بطولة جديدة'}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400"><X size={20}/></button>
                </div>
                <form onSubmit={e => { e.preventDefault(); if (title.trim()) { onSave({ title: title.trim(), eventDate }); onClose(); } }}
                    className="p-6 space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">اسم البطولة</label>
                        <input autoFocus required
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-yellow-500 placeholder-slate-600 text-sm"
                            placeholder="مثال: بطولة الأمل 2026"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1.5">تاريخ البطولة (اختياري)</label>
                        <input type="date"
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl outline-none focus:border-yellow-500 text-sm"
                            value={eventDate}
                            onChange={e => setEventDate(e.target.value)}
                        />
                    </div>
                    <button type="submit"
                        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl text-sm shadow-lg shadow-yellow-500/20">
                        {editing ? 'حفظ التعديل' : 'إنشاء البطولة'}
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
};

// ─── مودال: اختيار طلاب للبطولة ──────────────────────────────────────────────
const PickStudentsModal = ({ event, allStudents, currentIds, onClose, onSave }) => {
    const [selected, setSelected] = useState(new Set(currentIds));
    const [search, setSearch] = useState('');

    const filtered = useMemo(() =>
        allStudents.filter(s => s.name?.toLowerCase().includes(search.toLowerCase())),
    [allStudents, search]);

    const toggle = (id) => {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelected(next);
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="bg-yellow-950/40 border-b border-yellow-900/30 px-6 py-4 flex justify-between items-center shrink-0">
                    <h3 className="font-black text-base text-yellow-300 flex items-center gap-2">
                        <Users size={18}/> طلاب {event.title}
                    </h3>
                    <button onClick={onClose} className="text-slate-500 hover:text-red-400"><X size={20}/></button>
                </div>
                <div className="p-4 border-b border-slate-800 shrink-0">
                    <div className="relative">
                        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                        <input
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 pr-9 rounded-xl outline-none focus:border-yellow-500 placeholder-slate-600 text-sm"
                            placeholder="ابحث عن طالب..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <p className="text-[10px] text-yellow-400 mt-2 font-bold">
                        تم اختيار {selected.size} طالب
                    </p>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
                    {filtered.map(s => {
                        const isSel = selected.has(s.id);
                        return (
                            <button key={s.id} type="button" onClick={() => toggle(s.id)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all text-right
                                    ${isSel
                                        ? 'bg-yellow-900/20 border-yellow-500/40 text-yellow-300'
                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'}`}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center
                                        ${isSel ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 border border-slate-700'}`}>
                                        {isSel && <CheckCircle size={12}/>}
                                    </div>
                                    <span className="font-bold text-sm">{s.name}</span>
                                </div>
                                <span className="text-[10px] text-slate-500">{s.belt}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="p-4 border-t border-slate-800 shrink-0">
                    <button onClick={() => { onSave([...selected]); onClose(); }}
                        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-bold rounded-xl text-sm shadow-lg shadow-yellow-500/20">
                        حفظ ({selected.size} طالب)
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// ─── بطاقة طالب في القائمة ───────────────────────────────────────────────────
const StudentRow = ({ student, entries, target, isSelected, onClick, isArchived }) => {
    const sorted = useMemo(() =>
        [...entries].sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    [entries]);

    const latest = sorted[0];
    const prev   = sorted[1];
    const dt     = latest ? diffType(latest.weight, prev?.weight) : null;

    return (
        <button onClick={onClick}
            className={`w-full text-right p-3 rounded-xl border transition-all flex items-center justify-between gap-2
                ${isSelected
                    ? 'bg-blue-900/20 border-blue-500/50 shadow-md shadow-blue-900/20'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800 hover:border-slate-700'}`}>
            <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black shrink-0
                    ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {student.name?.charAt(0)}
                </div>
                <div className="min-w-0 text-right">
                    <div className="flex items-center gap-1.5">
                        <p className={`font-bold text-sm truncate ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                            {student.name}
                        </p>
                        {isArchived && (
                            <span className="text-[9px] font-bold text-orange-400 bg-orange-900/20 px-1.5 py-0.5 rounded border border-orange-500/20 shrink-0">📦</span>
                        )}
                    </div>
                    <p className="text-[10px] text-slate-600">{student.belt}</p>
                </div>
            </div>
            <div className="text-left shrink-0">
                {latest ? (
                    <>
                        <p className="text-sm font-black text-slate-200">{latest.weight} <span className="text-[9px] text-slate-500">kg</span></p>
                        {dt && dt !== 'first' && (() => {
                            const cfg = DIFF_CFG[dt];
                            const diff = Math.abs(Number(latest.weight) - Number(prev.weight)).toFixed(1);
                            return (
                                <span className={`text-[10px] font-bold ${cfg.color}`}>
                                    {dt === 'up' ? '↑' : dt === 'down' ? '↓' : '='} {diff}
                                </span>
                            );
                        })()}
                    </>
                ) : (
                    <span className="text-[10px] text-slate-600">لا قياس</span>
                )}
                {target && <p className="text-[9px] text-emerald-500 font-bold">🎯 {target}</p>}
            </div>
        </button>
    );
};

// ─── المكوّن الرئيسي ──────────────────────────────────────────────────────────
export default function WeightsManager({ students = [], archivedStudents = [], selectedBranch, logActivity }) {

    const weightsCol  = useCollection('weights');
    const eventsCol   = useCollection('weight_events');

    const [activeView, setActiveView]     = useState('all');        // 'all' | eventId
    const [selectedId, setSelectedId]     = useState(null);
    const [search, setSearch]             = useState('');
    const [showAddWeight, setShowAddWeight] = useState(false);
    const [editingWeight, setEditingWeight] = useState(null);
    const [showTarget, setShowTarget]     = useState(false);
    const [showNewEvent, setShowNewEvent] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [pickingEvent, setPickingEvent] = useState(null);

    // كل الطلاب: النشطون أولاً (مرتّبين حسب تاريخ الالتحاق — الأقدم أولاً)،
    // ثم المؤرشفون بالأسفل (مرتّبين حسب تاريخ الالتحاق أيضاً)
    const allStudents = useMemo(() => {
        const sortByJoin = (a, b) => {
            const ja = a.joinDate || a.createdAt || '';
            const jb = b.joinDate || b.createdAt || '';
            return ja.localeCompare(jb); // الأقدم أولاً
        };
        const activeSorted = students
            .map(s => ({ ...s, _archived: false }))
            .sort(sortByJoin);
        const existingIds = new Set(students.map(s => s.id));
        const archivedSorted = archivedStudents
            .map(s => ({ ...s, id: s.originalId || s.id, _archived: true }))
            .filter(s => !existingIds.has(s.id))
            .sort(sortByJoin);
        return [...activeSorted, ...archivedSorted];
    }, [students, archivedStudents]);

    // الفعاليات (البطولات) للفرع الحالي
    const branchEvents = useMemo(() =>
        eventsCol.data.filter(e => e.branch === selectedBranch)
            .sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || '')),
    [eventsCol.data, selectedBranch]);

    // الطلاب الظاهرين حسب التبويب — نحافظ على ترتيب allStudents
    // (نشط أولاً حسب الالتحاق، ثم المؤرشف بالأسفل)
    const displayedStudents = useMemo(() => {
        if (activeView === 'all') return allStudents;
        const ev = branchEvents.find(e => e.id === activeView);
        if (!ev) return [];
        const ids = new Set(ev.studentIds || []);
        return allStudents.filter(s => ids.has(s.id));
    }, [activeView, allStudents, branchEvents]);

    const filteredStudents = useMemo(() =>
        search.trim()
            ? displayedStudents.filter(s => s.name?.toLowerCase().includes(search.toLowerCase()))
            : displayedStudents,
    [displayedStudents, search]);

    // ـ كل القياسات تُخزّن في collection weights (مرتبطة بـ studentId)
    const allWeights = weightsCol.data;
    const getEntries = (sid) => allWeights.filter(w => w.studentId === sid);

    // الطالب الحالي
    const selectedStudent = useMemo(() =>
        allStudents.find(s => s.id === selectedId),
    [allStudents, selectedId]);

    const selectedEntries = useMemo(() =>
        selectedStudent
            ? [...getEntries(selectedStudent.id)].sort((a,b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
            : [],
    [selectedStudent, allWeights]);

    // بيانات الرسم البياني (مرتبة تصاعدياً للزمن — الأقدم يسار، الأحدث يمين)
    const chartData = useMemo(() => {
        return [...selectedEntries].filter(e => !e._isTarget).reverse().map((e, i) => ({
            label:    fmtDate(e.createdAt),       // التاريخ على المحور
            fullDate: `${fmtDate(e.createdAt)} ${fmtTime(e.createdAt)}`,  // عرض كامل في Tooltip
            weight:   Number(e.weight),
            note:     e.note || '',
            idx:      i + 1,
        }));
    }, [selectedEntries]);

    // ─── الـ handlers ──────────────────────────────────────────────────────────

    const handleSaveWeight = async (data) => {
        if (editingWeight) {
            await weightsCol.update(editingWeight.id, data);
            if (logActivity) logActivity('تعديل وزن', `تعديل وزن ${selectedStudent.name} → ${data.weight} كغم`);
            setEditingWeight(null);
        } else {
            await weightsCol.add({
                studentId: selectedStudent.id,
                studentName: selectedStudent.name,
                branch: selectedBranch,
                weight: data.weight,
                note: data.note,
                createdAt: nowIso(),
            });
            if (logActivity) logActivity('قياس وزن', `${selectedStudent.name} → ${data.weight} كغم`);
        }
    };

    const handleDeleteWeight = async (entry) => {
        if (!confirm('حذف هذا القياس؟')) return;
        await weightsCol.remove(entry.id);
        if (logActivity) logActivity('حذف قياس', `حذف قياس وزن للطالب ${selectedStudent?.name}`);
    };

    const handleSaveTarget = async (target) => {
        // نخزّن الهدف في collection منفصلة أو نُضيفه كحقل في weights كـ "نوع: target"
        // الأبسط: نخزّنه في وثيقة بنوع 'target' خاص بالطالب — نُحدّث أو ننشئ
        const existing = allWeights.find(w => w.studentId === selectedStudent.id && w._isTarget);
        if (existing) {
            if (target == null) await weightsCol.remove(existing.id);
            else await weightsCol.update(existing.id, { weight: target });
        } else if (target != null) {
            await weightsCol.add({
                studentId: selectedStudent.id,
                studentName: selectedStudent.name,
                branch: selectedBranch,
                weight: target,
                _isTarget: true,
                createdAt: nowIso(),
            });
        }
    };

    const getTarget = (sid) => allWeights.find(w => w.studentId === sid && w._isTarget)?.weight;

    // ─── الفعاليات ──────────────────────────────────────────────────────────
    const handleSaveEvent = async (data) => {
        if (editingEvent) {
            await eventsCol.update(editingEvent.id, data);
        } else {
            await eventsCol.add({
                ...data,
                branch: selectedBranch,
                studentIds: [],
                createdAt: nowIso(),
            });
        }
        setEditingEvent(null);
    };

    const handleDeleteEvent = async (ev) => {
        if (!confirm(`حذف بطولة "${ev.title}"؟\nملاحظة: الأوزان المسجّلة لن تُحذف.`)) return;
        await eventsCol.remove(ev.id);
        if (activeView === ev.id) setActiveView('all');
    };

    const handlePickStudents = async (ids) => {
        if (pickingEvent) await eventsCol.update(pickingEvent.id, { studentIds: ids });
    };

    // ─── طباعة سجل الوزن لطالب ─────────────────────────────────────────────
    const printStudentLog = () => {
        if (!selectedStudent || !selectedEntries.length) return;
        const logoUrl = window.location.origin + IMAGES.LOGO;
        const records = selectedEntries.filter(e => !e._isTarget);
        const target  = getTarget(selectedStudent.id);

        let rows = '';
        records.forEach((e, i) => {
            const next = records[i + 1];
            const dt   = next ? diffType(e.weight, next.weight) : 'first';
            const cfg  = DIFF_CFG[dt];
            const diff = next ? Math.abs(Number(e.weight) - Number(next.weight)).toFixed(1) : '-';
            const colorMap = { up: '#dc2626', down: '#16a34a', same: '#64748b', first: '#3b82f6' };
            rows += `<tr>
                <td style="border:1px solid #e5e7eb;padding:6px;text-align:center;font-size:11px;">${records.length - i}</td>
                <td style="border:1px solid #e5e7eb;padding:6px;text-align:center;font-family:monospace;font-size:11px;">${fmtDate(e.createdAt)} ${fmtTime(e.createdAt)}</td>
                <td style="border:1px solid #e5e7eb;padding:6px;text-align:center;font-weight:900;font-size:14px;">${e.weight} kg</td>
                <td style="border:1px solid #e5e7eb;padding:6px;text-align:center;font-weight:bold;color:${colorMap[dt]};">${cfg.label} ${diff !== '-' ? `(${diff})` : ''}</td>
                <td style="border:1px solid #e5e7eb;padding:6px;font-size:11px;">${e.note || '-'}</td>
            </tr>`;
        });

        const win = window.open('', 'W', 'height=800,width=900');
        win.document.write(`<!DOCTYPE html><html lang="ar" dir="rtl">
        <head><meta charset="UTF-8"><title>سجل الوزن — ${selectedStudent.name}</title>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page{size:A4 portrait;margin:15mm}
            body{font-family:'Cairo',sans-serif;color:#000;background:#fff;-webkit-print-color-adjust:exact}
            .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #b45309;padding-bottom:10px;margin-bottom:20px}
            .logo{height:60px;object-fit:contain}
            .info{background:#f9fafb;border:1px solid #e5e7eb;padding:15px;border-radius:8px;margin-bottom:20px;display:flex;justify-content:space-between}
            table{width:100%;border-collapse:collapse;font-size:12px}
            th{background:#1e293b;color:#fff;border:1px solid #000;padding:8px;text-align:center;font-weight:bold}
        </style></head>
        <body>
            <div class="hdr">
                <div>
                    <h1 style="margin:0;font-size:18px;font-weight:900;color:#b45309">سجل تتبع الوزن</h1>
                    <p style="margin:4px 0 0;font-size:12px;color:#555;font-weight:bold">أكاديمية الشجاع للتايكواندو — فرع ${selectedBranch}</p>
                </div>
                <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
            </div>
            <div class="info">
                <div>
                    <p style="font-size:16px;font-weight:900;color:#b45309;margin:0">${selectedStudent.name}</p>
                    <p style="font-size:12px;color:#555;font-weight:bold;margin:4px 0 0">الحزام: ${selectedStudent.belt || '-'}</p>
                </div>
                <div style="text-align:left;font-size:11px;color:#555">
                    <p style="margin:0"><b>عدد القياسات:</b> ${records.length}</p>
                    ${target ? `<p style="margin:4px 0 0"><b>الوزن الهدف:</b> ${target} كغم</p>` : ''}
                    <p style="margin:4px 0 0"><b>تاريخ الطباعة:</b> ${new Date().toLocaleDateString('ar-JO')}</p>
                </div>
            </div>
            <table>
                <thead><tr>
                    <th style="width:30px">#</th><th>التاريخ والوقت</th>
                    <th style="width:90px">الوزن</th><th style="width:100px">التغيّر</th>
                    <th>ملاحظة</th>
                </tr></thead>
                <tbody>${rows}</tbody>
            </table>
            <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close()},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ─── Render ─────────────────────────────────────────────────────────────
    const records  = selectedEntries.filter(e => !e._isTarget);
    const target   = getTarget(selectedId);

    return (
        <div className="space-y-5 animate-fade-in font-sans pb-20 md:pb-0">

            {/* مودالات */}
            {showAddWeight && selectedStudent && (
                <WeightEntryModal student={selectedStudent} editing={null}
                    onClose={() => setShowAddWeight(false)} onSave={handleSaveWeight}/>
            )}
            {editingWeight && selectedStudent && (
                <WeightEntryModal student={selectedStudent} editing={editingWeight}
                    onClose={() => setEditingWeight(null)} onSave={handleSaveWeight}/>
            )}
            {showTarget && selectedStudent && (
                <TargetModal student={selectedStudent} currentTarget={target}
                    onClose={() => setShowTarget(false)} onSave={handleSaveTarget}/>
            )}
            {showNewEvent && (
                <EventModal editing={null} onClose={() => setShowNewEvent(false)} onSave={handleSaveEvent}/>
            )}
            {editingEvent && (
                <EventModal editing={editingEvent} onClose={() => setEditingEvent(null)} onSave={handleSaveEvent}/>
            )}
            {pickingEvent && (
                <PickStudentsModal event={pickingEvent} allStudents={allStudents}
                    currentIds={pickingEvent.studentIds || []}
                    onClose={() => setPickingEvent(null)} onSave={handlePickStudents}/>
            )}

            {/* ── شريط التبويبات (الكل + بطولات) ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-lg">
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
                    <button onClick={() => setActiveView('all')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all shrink-0
                            ${activeView === 'all'
                                ? 'bg-blue-500 text-white border-blue-400 shadow-md shadow-blue-900/30'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'}`}>
                        <Users size={14}/> الكل ({allStudents.length})
                    </button>

                    <div className="h-6 w-px bg-slate-800 shrink-0"/>

                    {branchEvents.map(ev => (
                        <div key={ev.id} className={`group flex items-center rounded-xl border transition-all shrink-0
                            ${activeView === ev.id
                                ? 'bg-yellow-500/15 border-yellow-500/50'
                                : 'bg-slate-950 border-slate-800 hover:bg-slate-800'}`}>
                            <button onClick={() => setActiveView(ev.id)}
                                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold whitespace-nowrap
                                    ${activeView === ev.id ? 'text-yellow-400' : 'text-slate-400'}`}>
                                <Trophy size={13}/> {ev.title}
                                <span className="text-[10px] opacity-60">({(ev.studentIds || []).length})</span>
                            </button>
                            {activeView === ev.id && (
                                <>
                                    <button onClick={() => setPickingEvent(ev)} title="إدارة الطلاب"
                                        className="p-1.5 text-slate-500 hover:text-yellow-400 hover:bg-yellow-900/20 rounded transition-colors">
                                        <Users size={12}/>
                                    </button>
                                    <button onClick={() => setEditingEvent(ev)} title="تعديل البطولة"
                                        className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-900/20 rounded transition-colors">
                                        <Edit3 size={12}/>
                                    </button>
                                    <button onClick={() => handleDeleteEvent(ev)} title="حذف البطولة"
                                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors ml-1">
                                        <Trash2 size={12}/>
                                    </button>
                                </>
                            )}
                        </div>
                    ))}

                    <button onClick={() => setShowNewEvent(true)}
                        className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/20 transition-colors whitespace-nowrap shrink-0">
                        <Plus size={14}/> بطولة جديدة
                    </button>
                </div>
            </div>

            {/* ── شريط الإجراءات للبطولة المختارة ── */}
            {activeView !== 'all' && (() => {
                const ev = branchEvents.find(e => e.id === activeView);
                if (!ev) return null;
                return (
                    <div className="bg-yellow-900/10 border border-yellow-500/20 rounded-2xl p-3 flex items-center justify-between">
                        <div className="text-sm text-slate-300">
                            <Trophy size={14} className="inline text-yellow-400 ml-1"/>
                            بطولة <span className="font-bold text-yellow-400">{ev.title}</span>
                            {ev.eventDate && <span className="text-xs text-slate-500 mr-2">— {fmtDate(ev.eventDate)}</span>}
                            <span className="text-xs text-slate-500 mr-2">— {(ev.studentIds || []).length} طالب مشارك</span>
                        </div>
                        <button onClick={() => setPickingEvent(ev)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 rounded-lg text-xs font-bold">
                            <Plus size={13}/> إضافة/تعديل الطلاب
                        </button>
                    </div>
                );
            })()}

            {/* ── المحتوى الرئيسي: قائمة + تفاصيل طالب ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* عمود القائمة */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="relative">
                        <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                        <input
                            className="w-full bg-slate-900 border border-slate-800 text-slate-200 p-2.5 pr-9 rounded-xl outline-none focus:border-blue-500 placeholder-slate-600 text-sm"
                            placeholder="ابحث عن طالب..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5 max-h-[600px] overflow-y-auto custom-scrollbar pr-1">
                        {filteredStudents.length === 0 ? (
                            <div className="text-center py-10 bg-slate-900/30 border border-slate-800 border-dashed rounded-xl text-slate-600 text-sm">
                                {search ? 'لا يوجد نتائج' : 'لا يوجد طلاب'}
                            </div>
                        ) : filteredStudents.map(s => (
                            <StudentRow
                                key={s.id}
                                student={s}
                                entries={getEntries(s.id).filter(e => !e._isTarget)}
                                target={getTarget(s.id)}
                                isArchived={s._archived}
                                isSelected={selectedId === s.id}
                                onClick={() => setSelectedId(s.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* عمود التفاصيل */}
                <div className="lg:col-span-2">
                    {!selectedStudent ? (
                        <div className="h-full flex flex-col items-center justify-center bg-slate-900/30 border border-slate-800 border-dashed rounded-2xl py-20">
                            <Scale size={48} className="text-slate-700 mb-4 opacity-40"/>
                            <p className="text-slate-500 font-bold">اختر طالباً لعرض سجل وزنه</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* رأس */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-lg">
                                            {selectedStudent.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-lg text-slate-100">{selectedStudent.name}</h3>
                                                {selectedStudent._archived && (
                                                    <span className="text-[10px] font-bold text-orange-400 bg-orange-900/20 px-2 py-0.5 rounded border border-orange-500/20 flex items-center gap-1">
                                                        <ArchiveIcon size={10}/> مؤرشف
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500">{selectedStudent.belt}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setShowTarget(true)}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-900/20 hover:bg-emerald-600 text-emerald-400 hover:text-white rounded-xl text-xs font-bold border border-emerald-500/20 transition-colors">
                                            <Target size={13}/> {target ? `الهدف: ${target} kg` : 'تعيين هدف'}
                                        </button>
                                        {records.length > 0 && (
                                            <button onClick={printStudentLog}
                                                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                                                title="طباعة السجل">
                                                <Printer size={14}/>
                                            </button>
                                        )}
                                        <button onClick={() => setShowAddWeight(true)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-900/20">
                                            <Plus size={13}/> قياس جديد
                                        </button>
                                    </div>
                                </div>

                                {/* أرقام سريعة */}
                                {records.length > 0 && (() => {
                                    const latest = records[0];
                                    const first  = records[records.length - 1];
                                    const totalDiff = Number(latest.weight) - Number(first.weight);
                                    return (
                                        <div className="grid grid-cols-3 gap-3 mt-4">
                                            <div className="bg-slate-950 rounded-xl p-3 text-center border border-slate-800">
                                                <p className="text-[10px] text-slate-500 font-bold mb-1">الوزن الحالي</p>
                                                <p className="text-xl font-black text-blue-400">{latest.weight}</p>
                                                <p className="text-[10px] text-slate-600">kg</p>
                                            </div>
                                            <div className="bg-slate-950 rounded-xl p-3 text-center border border-slate-800">
                                                <p className="text-[10px] text-slate-500 font-bold mb-1">عدد القياسات</p>
                                                <p className="text-xl font-black text-slate-200">{records.length}</p>
                                                <p className="text-[10px] text-slate-600">قياس</p>
                                            </div>
                                            <div className={`rounded-xl p-3 text-center border
                                                ${totalDiff > 0 ? 'bg-red-950/20 border-red-900/30'
                                                : totalDiff < 0 ? 'bg-emerald-950/20 border-emerald-900/30'
                                                : 'bg-slate-950 border-slate-800'}`}>
                                                <p className="text-[10px] text-slate-500 font-bold mb-1">إجمالي التغيّر</p>
                                                <p className={`text-xl font-black
                                                    ${totalDiff > 0 ? 'text-red-400'
                                                    : totalDiff < 0 ? 'text-emerald-400'
                                                    : 'text-slate-400'}`}>
                                                    {totalDiff > 0 ? '+' : ''}{totalDiff.toFixed(1)}
                                                </p>
                                                <p className="text-[10px] text-slate-600">kg</p>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* رسم بياني */}
                            {chartData.length > 1 && (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                                    <p className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                                        <TrendingUp size={14} className="text-blue-400"/> تطوّر الوزن عبر الزمن
                                        <span className="text-[10px] text-slate-500 mr-2 font-normal">— اضغط على أي نقطة لرؤية التفاصيل</span>
                                    </p>
                                    <div style={{ height: 260 }}>
                                        <ResponsiveContainer width="100%" height={260}>
                                            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -10, bottom: 5 }}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false}/>
                                                <XAxis dataKey="label" stroke="#64748b" fontSize={10} tickLine={false}
                                                    angle={-15} textAnchor="end" height={50}/>
                                                <YAxis stroke="#64748b" fontSize={11} tickLine={false}
                                                    domain={['dataMin - 2', 'dataMax + 2']}
                                                    label={{ value:'كغم', angle:-90, position:'insideLeft', fill:'#64748b', fontSize:11 }}/>
                                                <Tooltip
                                                    content={({ active, payload }) => {
                                                        if (!active || !payload?.length) return null;
                                                        const d = payload[0].payload;
                                                        return (
                                                            <div style={{
                                                                background:'#0f172a', border:'1px solid #3b82f6',
                                                                borderRadius:10, padding:'10px 14px',
                                                                boxShadow:'0 8px 24px rgba(0,0,0,0.5)',
                                                                fontFamily:'Cairo,sans-serif', direction:'rtl'
                                                            }}>
                                                                <div style={{ fontSize:18, fontWeight:900, color:'#3b82f6' }}>
                                                                    {d.weight} <span style={{ fontSize:10, color:'#94a3b8', fontWeight:'normal' }}>كغم</span>
                                                                </div>
                                                                <div style={{ fontSize:11, color:'#cbd5e1', marginTop:4, fontWeight:'bold' }}>
                                                                    📅 {d.fullDate}
                                                                </div>
                                                                {d.note && (
                                                                    <div style={{ fontSize:10, color:'#94a3b8', marginTop:3, maxWidth:200 }}>
                                                                        💬 {d.note}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    }}
                                                />
                                                <Line type="monotone" dataKey="weight"
                                                    stroke="#3b82f6" strokeWidth={2.5}
                                                    dot={{ fill:'#3b82f6', r:5, strokeWidth:2, stroke:'#0f172a' }}
                                                    activeDot={{ r:7, fill:'#60a5fa', strokeWidth:3, stroke:'#fff' }}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}

                            {/* سجل القياسات */}
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
                                <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                                    <p className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                        <Calendar size={14} className="text-blue-400"/> سجل القياسات ({records.length})
                                    </p>
                                </div>
                                {records.length === 0 ? (
                                    <div className="text-center py-12 text-slate-600">
                                        <Scale size={32} className="mx-auto mb-2 opacity-30"/>
                                        <p className="text-sm font-bold">لا يوجد قياسات بعد</p>
                                        <p className="text-xs mt-1">اضغط "قياس جديد" لتسجيل أول قياس</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-800">
                                        {records.map((entry, i) => {
                                            const next = records[i + 1];
                                            const dt   = next ? diffType(entry.weight, next.weight) : 'first';
                                            const cfg  = DIFF_CFG[dt];
                                            const diff = next ? Math.abs(Number(entry.weight) - Number(next.weight)).toFixed(1) : null;
                                            return (
                                                <div key={entry.id}
                                                    className="px-5 py-3 hover:bg-slate-800/30 group flex items-center justify-between gap-3 transition-colors">
                                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                                        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${cfg.bg} ${cfg.border}`}>
                                                            <cfg.icon size={15} className={cfg.color}/>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="flex items-baseline gap-2 flex-wrap">
                                                                <span className="text-lg font-black text-slate-100">{entry.weight}</span>
                                                                <span className="text-[10px] text-slate-500">kg</span>
                                                                {diff && (
                                                                    <span className={`text-[10px] font-bold ${cfg.color}`}>
                                                                        {dt === 'up' ? '↑' : dt === 'down' ? '↓' : '='} {diff}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                                                                {fmtDate(entry.createdAt)} • {fmtTime(entry.createdAt)}
                                                                {entry.note && <span className="text-slate-600 mr-2">— {entry.note}</span>}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                        <button onClick={() => setEditingWeight(entry)}
                                                            className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors">
                                                            <Edit3 size={13}/>
                                                        </button>
                                                        <button onClick={() => handleDeleteWeight(entry)}
                                                            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                                                            <Trash2 size={13}/>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

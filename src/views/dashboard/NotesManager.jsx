// src/views/dashboard/NotesManager.jsx
import React, { useState, useMemo } from 'react';
import { 
    FileText, MessageCircle, Lock, Send, Trash2, 
    Printer, Search, User, Edit3, MoreVertical, 
    AlertCircle, CheckCircle, X
} from 'lucide-react';
import { StudentSearch, Button } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

export default function NotesManager({ students, studentsCollection, logActivity, selectedBranch }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [noteType, setNoteType] = useState('private'); // 'private' | 'public'
    const [editingNote, setEditingNote] = useState(null); // لتحديد الملاحظة قيد التعديل

    // --- 1. دمج الملاحظات (القديمة والجديدة) ---
    const getCombinedNotes = (student) => {
        if (!student) return [];
        let allNotes = [];

        // أ: الملاحظة القديمة (من صفحة الطلاب)
        if (student.note && student.note.trim() !== "") {
            allNotes.push({
                id: 'legacy_note', // معرف ثابت للملاحظة القديمة
                text: student.note,
                type: 'private', // نفترض أنها خاصة لأنها من النظام القديم
                date: 'ملاحظة الملف الرئيسي',
                isLegacy: true // علامة لتمييزها
            });
        }

        // ب: الملاحظات الجديدة
        if (student.notes && Array.isArray(student.notes)) {
            allNotes = [...allNotes, ...student.notes];
        }

        // ترتيب حسب التاريخ (الأحدث أولاً إذا كان هناك تواريخ)
        return allNotes.sort((a, b) => (b.id > a.id ? 1 : -1));
    };

    // --- 2. تصفية القائمة الجانبية ---
    const studentsWithNotes = useMemo(() => {
        return students.filter(s => {
            const hasLegacy = s.note && s.note.trim().length > 0;
            const hasModern = s.notes && s.notes.length > 0;
            return hasLegacy || hasModern;
        });
    }, [students]);

    // --- 3. الحفظ (إضافة أو تعديل) ---
    const handleSaveNote = async () => {
        if (!selectedStudent || !noteText.trim()) return;

        let updatedData = {};

        // حالة أ: تعديل ملاحظة موجودة
        if (editingNote) {
            if (editingNote.isLegacy) {
                // تعديل الملاحظة القديمة (تحديث حقل note مباشرة)
                updatedData = { note: noteText };
                logActivity('تعديل ملاحظة', `تعديل الملاحظة الرئيسية للطالب ${selectedStudent.name}`);
            } else {
                // تعديل ملاحظة جديدة (تحديث المصفوفة)
                const newNotesArray = selectedStudent.notes.map(n => 
                    n.id === editingNote.id ? { ...n, text: noteText, type: noteType } : n
                );
                updatedData = { notes: newNotesArray };
                logActivity('تعديل ملاحظة', `تعديل ملاحظة في السجل للطالب ${selectedStudent.name}`);
            }
        } 
        // حالة ب: إنشاء ملاحظة جديدة
        else {
            const newNoteObj = {
                id: Date.now().toString(),
                text: noteText,
                type: noteType,
                date: new Date().toISOString().split('T')[0],
                branch: selectedBranch
            };
            const currentNotes = selectedStudent.notes || [];
            updatedData = { notes: [...currentNotes, newNoteObj] };
            logActivity('ملاحظة جديدة', `إضافة ملاحظة (${noteType === 'private' ? 'خاصة' : 'عامة'}) للطالب ${selectedStudent.name}`);
        }

        // تنفيذ التحديث في قاعدة البيانات
        await studentsCollection.update(selectedStudent.id, updatedData);

        // تحديث الواجهة فوراً
        setSelectedStudent(prev => ({ ...prev, ...updatedData }));
        setNoteText('');
        setEditingNote(null);
        setNoteType('private');
    };

    // --- 4. الحذف ---
    const handleDelete = async (note) => {
        if (!confirm("هل أنت متأكد من حذف هذه الملاحظة نهائياً؟")) return;

        let updatedData = {};
        if (note.isLegacy) {
            // حذف الملاحظة القديمة = تفريغ النص
            updatedData = { note: "" };
        } else {
            // حذف من المصفوفة
            const newNotesArray = selectedStudent.notes.filter(n => n.id !== note.id);
            updatedData = { notes: newNotesArray };
        }

        await studentsCollection.update(selectedStudent.id, updatedData);
        logActivity('حذف ملاحظة', `حذف ملاحظة للطالب ${selectedStudent.name}`);
        setSelectedStudent(prev => ({ ...prev, ...updatedData }));
        
        // إذا كنا نعدل هذه الملاحظة وحذفناها، نلغي وضع التعديل
        if (editingNote?.id === note.id) {
            setEditingNote(null);
            setNoteText('');
        }
    };

    // --- 5. التحضير للتعديل ---
    const startEdit = (note) => {
        setEditingNote(note);
        setNoteText(note.text);
        setNoteType(note.type);
    };

    // --- 6. الطباعة ---
    const handlePrint = () => {
        const printWin = window.open('', 'PRINT', 'height=800,width=1000');
        const logoUrl = window.location.origin + IMAGES.LOGO;
        
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>سجل الملاحظات - ${selectedBranch}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
                    body { font-family: 'Cairo', sans-serif; padding: 20px; font-size: 12px; color: #333; }
                    .header { text-align: center; border-bottom: 3px solid #fbbf24; padding-bottom: 20px; margin-bottom: 30px; }
                    .logo { height: 70px; margin-bottom: 10px; }
                    .student-box { border: 1px solid #eee; margin-bottom: 20px; border-radius: 8px; overflow: hidden; page-break-inside: avoid; }
                    .student-header { background: #f9fafb; padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; display: flex; justify-content: space-between; }
                    .note-row { padding: 10px 15px; border-bottom: 1px solid #f0f0f0; display: flex; gap: 15px; align-items: flex-start; }
                    .note-label { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; min-width: 80px; text-align: center; }
                    .label-private { background: #fee2e2; color: #991b1b; }
                    .label-public { background: #dcfce7; color: #166534; }
                    .note-text { flex: 1; line-height: 1.5; }
                    .note-date { color: #999; font-size: 10px; margin-top: 4px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                    <h2>سجل الملاحظات والرسائل</h2>
                    <p>الفرع: ${selectedBranch} | التاريخ: ${new Date().toLocaleDateString('ar-EG')}</p>
                </div>
                ${studentsWithNotes.map(s => {
                    const notes = getCombinedNotes(s);
                    return `
                    <div class="student-box">
                        <div class="student-header">
                            <span>${s.name}</span>
                            <span style="color:#666; font-size:11px;">${s.belt}</span>
                        </div>
                        ${notes.map(n => `
                            <div class="note-row">
                                <div>
                                    <div class="note-label ${n.type === 'private' ? 'label-private' : 'label-public'}">
                                        ${n.type === 'private' ? 'إدارية' : 'عامة'}
                                    </div>
                                    <div class="note-date">${n.date}</div>
                                </div>
                                <div class="note-text">${n.text}</div>
                            </div>
                        `).join('')}
                    </div>
                    `;
                }).join('')}
                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `;
        printWin.document.write(htmlContent);
        printWin.document.close();
    };

    const displayNotes = getCombinedNotes(selectedStudent);

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fade-in">
            
            {/* القسم الأيمن: القائمة والبحث */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-black text-gray-800 flex items-center gap-2 mb-4">
                        <FileText className="text-yellow-500"/> سجل الملاحظات
                    </h2>
                    <StudentSearch 
                        students={students} 
                        onSelect={setSelectedStudent} 
                        onClear={() => setSelectedStudent(null)}
                        placeholder="ابحث عن طالب..." 
                    />
                    <Button onClick={handlePrint} variant="outline" className="w-full mt-3 text-xs">
                        <Printer size={16}/> طباعة تقرير الملاحظات
                    </Button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                    <div className="p-3 bg-gray-50 border-b border-gray-100 font-bold text-gray-500 text-xs">
                        طلاب لديهم ملاحظات مسجلة ({studentsWithNotes.length})
                    </div>
                    <div className="overflow-y-auto custom-scrollbar p-2 space-y-1 flex-1">
                        {studentsWithNotes.length > 0 ? studentsWithNotes.map(s => (
                            <button 
                                key={s.id} 
                                onClick={() => setSelectedStudent(s)}
                                className={`w-full text-right p-3 rounded-xl border transition-all flex justify-between items-center group
                                    ${selectedStudent?.id === s.id ? 'bg-yellow-50 border-yellow-400 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudent?.id === s.id ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-100 text-gray-500'}`}>
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-800">{s.name}</p>
                                        <p className="text-[10px] text-gray-400">{s.belt}</p>
                                    </div>
                                </div>
                                {(s.note || (s.notes && s.notes.length > 0)) && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
                            </button>
                        )) : (
                            <div className="text-center py-10 text-gray-400 text-xs">لا يوجد ملاحظات مسجلة</div>
                        )}
                    </div>
                </div>
            </div>

            {/* القسم الأيسر: منطقة العمل (الشات) */}
            <div className="w-full md:w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                {selectedStudent ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-black text-yellow-500 rounded-xl flex items-center justify-center font-bold text-lg">
                                    <User size={20}/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">{selectedStudent.name}</h3>
                                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded text-[10px]">{selectedStudent.belt}</span>
                                </div>
                            </div>
                            <div className="text-xs text-gray-400 font-mono">ID: {selectedStudent.id.substring(0,6)}</div>
                        </div>

                        {/* Notes Feed (Area) */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-gray-50/30">
                            {displayNotes.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                                    <FileText size={48} className="mb-2"/>
                                    <p>لا يوجد ملاحظات لهذا الطالب</p>
                                </div>
                            )}
                            
                            {displayNotes.map((note, index) => (
                                <div 
                                    key={note.id || index} 
                                    className={`relative group p-4 rounded-2xl border transition-all hover:shadow-md
                                        ${note.type === 'private' ? 'bg-white border-red-100 border-r-4 border-r-red-400' : 'bg-white border-green-100 border-r-4 border-r-green-400'}
                                        ${editingNote?.id === note.id ? 'ring-2 ring-yellow-400' : ''}
                                    `}
                                >
                                    {/* Header of Note */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {note.type === 'private' ? (
                                                <span className="bg-red-100 text-red-700 text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                                                    <Lock size={10}/> إدارية (خاص)
                                                </span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                                                    <MessageCircle size={10}/> عامة (للطالب)
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-400 font-bold">{note.date}</span>
                                            {note.isLegacy && <span className="bg-gray-200 text-gray-600 text-[9px] px-1.5 py-0.5 rounded">سجل الطلاب</span>}
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(note)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="تعديل">
                                                <Edit3 size={14}/>
                                            </button>
                                            <button onClick={() => handleDelete(note)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="حذف">
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed pl-2 border-r-2 border-gray-100 mr-1">
                                        {note.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            {editingNote && (
                                <div className="flex justify-between items-center bg-yellow-50 px-3 py-2 rounded-lg mb-2 text-xs text-yellow-800 border border-yellow-200">
                                    <span>جاري تعديل ملاحظة...</span>
                                    <button onClick={() => {setEditingNote(null); setNoteText('');}}><X size={14}/></button>
                                </div>
                            )}
                            
                            <div className="flex gap-2 mb-2">
                                <button 
                                    onClick={() => setNoteType('private')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1
                                        ${noteType === 'private' ? 'bg-red-100 text-red-700 ring-1 ring-red-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <Lock size={12}/> خاصة
                                </button>
                                <button 
                                    onClick={() => setNoteType('public')}
                                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1
                                        ${noteType === 'public' ? 'bg-green-100 text-green-700 ring-1 ring-green-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                                >
                                    <MessageCircle size={12}/> عامة
                                </button>
                            </div>

                            <div className="relative">
                                <textarea 
                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl p-3 pr-4 pl-12 text-sm outline-none focus:border-yellow-400 focus:bg-white transition-all min-h-[50px] max-h-[120px]"
                                    placeholder="اكتب الملاحظة هنا..."
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                />
                                <button 
                                    onClick={handleSaveNote}
                                    disabled={!noteText.trim()}
                                    className="absolute left-2 bottom-2 bg-black text-yellow-500 p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {editingNote ? <CheckCircle size={18}/> : <Send size={18}/>}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Search size={32} />
                        </div>
                        <p className="font-bold">اختر طالباً للبدء</p>
                    </div>
                )}
            </div>
        </div>
    );
}
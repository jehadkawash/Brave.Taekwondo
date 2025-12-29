// src/views/dashboard/NotesManager.jsx
import React, { useState, useMemo } from 'react';
import { FileText, MessageCircle, Lock, Plus, Trash2, Printer, Search, User, AlertCircle } from 'lucide-react';
import { Button, StudentSearch } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

export default function NotesManager({ students, studentsCollection, logActivity, selectedBranch }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [noteType, setNoteType] = useState('private'); // 'private' = إدارية, 'public' = للطالب

    // --- دالة مساعدة لدمج الملاحظات القديمة والجديدة ---
    const getStudentNotes = (student) => {
        let allNotes = student.notes || [];
        
        // إذا كان هناك ملاحظة قديمة (نصية)، نعرضها كملاحظة إدارية
        if (student.note && typeof student.note === 'string' && student.note.trim() !== '') {
            allNotes = [...allNotes, {
                id: 'legacy',
                text: student.note,
                type: 'private',
                date: 'سجل قديم',
                isLegacy: true // علامة لتمييزها
            }];
        }
        return allNotes;
    };

    // --- تصفية الطلاب الذين لديهم أي نوع من الملاحظات ---
    const studentsWithNotes = useMemo(() => {
        return students.filter(s => {
            const hasNewNotes = s.notes && s.notes.length > 0;
            const hasOldNote = s.note && s.note.trim().length > 0;
            return hasNewNotes || hasOldNote;
        });
    }, [students]);

    // --- إضافة ملاحظة جديدة ---
    const handleAddNote = async () => {
        if (!selectedStudent || !noteText) return;

        const newNote = {
            id: Date.now().toString(),
            text: noteText,
            type: noteType,
            date: new Date().toISOString().split('T')[0],
            branch: selectedBranch
        };

        const updatedNotes = [...(selectedStudent.notes || []), newNote];
        
        // تحديث قاعدة البيانات
        await studentsCollection.update(selectedStudent.id, { notes: updatedNotes });
        
        logActivity('ملاحظة جديدة', `إضافة ملاحظة (${noteType === 'private' ? 'خاصة' : 'عامة'}) للطالب ${selectedStudent.name}`);
        
        // تحديث الواجهة
        setSelectedStudent({ ...selectedStudent, notes: updatedNotes });
        setNoteText('');
    };

    // --- حذف ملاحظة ---
    const handleDeleteNote = async (noteId, isLegacy) => {
        if (!confirm("هل أنت متأكد من حذف الملاحظة؟")) return;
        
        if (isLegacy) {
            // حذف الملاحظة القديمة (تصفير الحقل)
            await studentsCollection.update(selectedStudent.id, { note: "" });
            setSelectedStudent({ ...selectedStudent, note: "" });
        } else {
            // حذف من المصفوفة الجديدة
            const updatedNotes = selectedStudent.notes.filter(n => n.id !== noteId);
            await studentsCollection.update(selectedStudent.id, { notes: updatedNotes });
            setSelectedStudent({ ...selectedStudent, notes: updatedNotes });
        }
        logActivity('حذف ملاحظة', `حذف ملاحظة للطالب ${selectedStudent.name}`);
    };

    // --- طباعة التقرير ---
    const handlePrintNotes = () => {
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
                    body { font-family: 'Cairo', sans-serif; padding: 20px; font-size: 12px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                    .logo { height: 70px; margin-bottom: 10px; }
                    .student-card { border: 1px solid #ddd; margin-bottom: 15px; padding: 10px; border-radius: 8px; page-break-inside: avoid; }
                    .student-name { font-weight: bold; font-size: 14px; margin-bottom: 5px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #b45309; }
                    .note-row { display: flex; gap: 10px; padding: 4px 0; border-bottom: 1px dotted #eee; }
                    .note-type { font-weight: bold; min-width: 80px; }
                    .type-private { color: #991b1b; }
                    .type-public { color: #166534; }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                    <h2>سجل الملاحظات والرسائل</h2>
                    <p>الفرع: ${selectedBranch}</p>
                </div>
                ${studentsWithNotes.map(s => {
                    const allNotes = getStudentNotes(s);
                    return `
                    <div class="student-card">
                        <div class="student-name">${s.name} (${s.belt})</div>
                        ${allNotes.map(n => `
                            <div class="note-row">
                                <span class="note-type ${n.type === 'private' ? 'type-private' : 'type-public'}">
                                    [${n.type === 'private' ? 'إدارية' : 'للطالب'}]
                                </span>
                                <span style="color:#666; font-size:10px;">${n.date}:</span>
                                <span>${n.text}</span>
                            </div>
                        `).join('')}
                    </div>
                    `;
                }).join('')}
            </body>
            </html>
        `;
        printWin.document.write(htmlContent);
        printWin.document.close();
    };

    const currentStudentNotes = selectedStudent ? getStudentNotes(selectedStudent) : [];

    return (
        <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div className="flex-1 w-full md:w-auto">
                    <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 mb-2">
                        <FileText className="text-yellow-500"/> الملاحظات والرسائل
                    </h2>
                    <div className="w-full md:w-96">
                        <StudentSearch 
                            students={students} 
                            onSelect={setSelectedStudent} 
                            onClear={() => setSelectedStudent(null)}
                            placeholder="ابحث عن طالب..." 
                        />
                    </div>
                </div>
                <Button onClick={handlePrintNotes} className="bg-gray-800 text-white w-full md:w-auto">
                    <Printer size={18} className="ml-2"/> طباعة السجل
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedStudent ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-200 animate-fade-in">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    <User size={20} className="text-blue-600"/> {selectedStudent.name}
                                </h3>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{selectedStudent.belt}</span>
                            </div>

                            {/* Add Note Form */}
                            <div className="bg-gray-50 p-4 rounded-xl mb-6">
                                <label className="text-xs font-bold text-gray-600 mb-2 block">إضافة ملاحظة جديدة</label>
                                <div className="flex gap-2 mb-2">
                                    <button 
                                        onClick={() => setNoteType('private')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
                                            ${noteType === 'private' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white border border-gray-200 text-gray-500'}`}
                                    >
                                        <Lock size={14}/> خاصة (إدارية)
                                    </button>
                                    <button 
                                        onClick={() => setNoteType('public')}
                                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2
                                            ${noteType === 'public' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-white border border-gray-200 text-gray-500'}`}
                                    >
                                        <MessageCircle size={14}/> عامة (للطالب)
                                    </button>
                                </div>
                                <textarea 
                                    className="w-full border p-3 rounded-xl outline-none focus:border-yellow-500 text-sm min-h-[80px]"
                                    placeholder={noteType === 'private' ? "ملاحظة للإدارة فقط..." : "رسالة ستظهر في تطبيق الطالب..."}
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                />
                                <div className="mt-2 flex justify-end">
                                    <Button onClick={handleAddNote} className="bg-yellow-500 text-black text-xs">
                                        <Plus size={16}/> حفظ
                                    </Button>
                                </div>
                            </div>

                            {/* Notes List */}
                            <div className="space-y-3">
                                {currentStudentNotes.length > 0 ? (
                                    currentStudentNotes.slice().reverse().map((note, index) => (
                                        <div key={index} className={`p-4 rounded-xl border-r-4 flex justify-between items-start ${note.type === 'private' ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'}`}>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${note.type === 'private' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                                        {note.type === 'private' ? 'إدارية' : 'للطالب'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-bold">{note.date}</span>
                                                    {note.isLegacy && <span className="text-[10px] bg-gray-200 text-gray-600 px-1 rounded">قديم</span>}
                                                </div>
                                                <p className="text-gray-800 text-sm font-medium">{note.text}</p>
                                            </div>
                                            <button onClick={() => handleDeleteNote(note.id, note.isLegacy)} className="text-gray-400 hover:text-red-500">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">لا يوجد ملاحظات</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-gray-400">
                            <Search size={48} className="mb-4 text-gray-200"/>
                            <p>اختر طالباً لعرض ملاحظاته</p>
                        </div>
                    )}
                </div>

                {/* 2. Sidebar List */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-fit">
                    <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 flex justify-between items-center">
                        <span>طلاب لديهم ملاحظات</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">{studentsWithNotes.length}</span>
                    </h3>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                        {studentsWithNotes.length > 0 ? studentsWithNotes.map(s => (
                            <button 
                                key={s.id} 
                                onClick={() => setSelectedStudent(s)}
                                className={`w-full text-right p-3 rounded-xl border transition-all flex justify-between items-center
                                    ${selectedStudent?.id === s.id ? 'bg-yellow-50 border-yellow-400' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                            >
                                <span className="font-bold text-sm text-gray-700">{s.name}</span>
                                {s.note && <AlertCircle size={14} className="text-gray-400"/>}
                            </button>
                        )) : (
                            <p className="text-center text-xs text-gray-400 py-4">القائمة فارغة</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
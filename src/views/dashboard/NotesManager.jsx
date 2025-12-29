// src/views/dashboard/NotesManager.jsx
import React, { useState, useMemo } from 'react';
import { FileText, MessageCircle, Lock, Plus, Trash2, Printer, Search, User } from 'lucide-react';
import { Card, Button, StudentSearch } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

export default function NotesManager({ students, studentsCollection, logActivity, selectedBranch }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [noteType, setNoteType] = useState('private'); // 'private' or 'public'

    // --- تصفية الطلاب الذين لديهم ملاحظات فقط ---
    const studentsWithNotes = useMemo(() => {
        return students.filter(s => s.notes && s.notes.length > 0);
    }, [students]);

    // --- إضافة ملاحظة ---
    const handleAddNote = async () => {
        if (!selectedStudent || !noteText) return;

        const newNote = {
            id: Date.now().toString(),
            text: noteText,
            type: noteType, // 'private' = إدارية, 'public' = للطالب
            date: new Date().toISOString().split('T')[0],
            branch: selectedBranch
        };

        const updatedNotes = [...(selectedStudent.notes || []), newNote];
        
        await studentsCollection.update(selectedStudent.id, { notes: updatedNotes });
        
        logActivity('ملاحظة جديدة', `إضافة ملاحظة (${noteType === 'private' ? 'خاصة' : 'عامة'}) للطالب ${selectedStudent.name}`);
        
        // تحديث الحالة المحلية
        setSelectedStudent({ ...selectedStudent, notes: updatedNotes });
        setNoteText('');
    };

    // --- حذف ملاحظة ---
    const handleDeleteNote = async (noteId) => {
        if (!confirm("هل أنت متأكد من حذف الملاحظة؟")) return;
        
        const updatedNotes = selectedStudent.notes.filter(n => n.id !== noteId);
        await studentsCollection.update(selectedStudent.id, { notes: updatedNotes });
        
        logActivity('حذف ملاحظة', `حذف ملاحظة للطالب ${selectedStudent.name}`);
        setSelectedStudent({ ...selectedStudent, notes: updatedNotes });
    };

    // --- طباعة التقرير (فقط للطلاب الذين لديهم ملاحظات) ---
    const handlePrintNotes = () => {
        const printWin = window.open('', 'PRINT', 'height=800,width=1000');
        const logoUrl = window.location.origin + IMAGES.LOGO;
        
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>سجل الملاحظات والرسائل</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');
                    body { font-family: 'Cairo', sans-serif; padding: 20px; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 20px; }
                    .logo { height: 80px; margin-bottom: 10px; }
                    .student-block { border: 1px solid #ddd; margin-bottom: 20px; padding: 15px; border-radius: 8px; page-break-inside: avoid; }
                    .student-header { background: #f9fafb; padding: 10px; font-weight: bold; font-size: 16px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; }
                    .note-item { padding: 8px 0; border-bottom: 1px solid #f0f0f0; display: flex; gap: 10px; font-size: 14px; }
                    .tag { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
                    .tag-private { background: #fee2e2; color: #991b1b; } /* أحمر للخاص */
                    .tag-public { background: #dcfce7; color: #166534; } /* أخضر للعام */
                    @media print { button { display: none; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                    <h2>سجل الملاحظات والرسائل (فرع ${selectedBranch})</h2>
                    <p>عدد الطلاب في القائمة: ${studentsWithNotes.length}</p>
                </div>

                ${studentsWithNotes.map(s => `
                    <div class="student-block">
                        <div class="student-header">
                            <span>${s.name} (${s.belt})</span>
                            <span style="font-size:12px; color:#666">عدد الملاحظات: ${s.notes.length}</span>
                        </div>
                        <div>
                            ${s.notes.map(n => `
                                <div class="note-item">
                                    <span class="tag ${n.type === 'private' ? 'tag-private' : 'tag-public'}">
                                        ${n.type === 'private' ? 'إدارية (خاص)' : 'رسالة للطالب'}
                                    </span>
                                    <span style="font-weight:bold; color:#555;">${n.date}:</span>
                                    <span>${n.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}

                ${studentsWithNotes.length === 0 ? '<p style="text-align:center">لا يوجد ملاحظات مسجلة.</p>' : ''}

                <script>window.onload = function() { window.print(); }</script>
            </body>
            </html>
        `;
        printWin.document.write(htmlContent);
        printWin.document.close();
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20 md:pb-0">
            {/* Header & Search */}
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
                            placeholder="ابحث عن طالب لإضافة/عرض ملاحظاته..." 
                        />
                    </div>
                </div>
                <Button onClick={handlePrintNotes} className="bg-gray-800 text-white w-full md:w-auto">
                    <Printer size={18} className="ml-2"/> طباعة سجل الملاحظات
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. إضافة وعرض ملاحظات الطالب المحدد */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedStudent ? (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-200 animate-fade-in">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                    <User size={20} className="text-blue-600"/> {selectedStudent.name}
                                </h3>
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{selectedStudent.belt}</span>
                            </div>

                            {/* نموذج الإضافة */}
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
                                    placeholder={noteType === 'private' ? "اكتب ملاحظة سرية للإدارة فقط..." : "اكتب رسالة ستظهر للطالب في تطبيقه..."}
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                />
                                <div className="mt-2 flex justify-end">
                                    <Button onClick={handleAddNote} className="bg-yellow-500 text-black text-xs">
                                        <Plus size={16}/> حفظ الملاحظة
                                    </Button>
                                </div>
                            </div>

                            {/* قائمة الملاحظات */}
                            <div className="space-y-3">
                                {selectedStudent.notes && selectedStudent.notes.length > 0 ? (
                                    selectedStudent.notes.slice().reverse().map((note, index) => (
                                        <div key={note.id || index} className={`p-4 rounded-xl border-r-4 flex justify-between items-start ${note.type === 'private' ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'}`}>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${note.type === 'private' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                                        {note.type === 'private' ? 'إدارية' : 'للطالب'}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-bold">{note.date}</span>
                                                </div>
                                                <p className="text-gray-800 text-sm font-medium">{note.text}</p>
                                            </div>
                                            <button onClick={() => handleDeleteNote(note.id)} className="text-gray-400 hover:text-red-500">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-gray-400">لا يوجد ملاحظات لهذا الطالب</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-gray-400">
                            <Search size={48} className="mb-4 text-gray-200"/>
                            <p>اختر طالباً من البحث في الأعلى لعرض ملفه وإضافة الملاحظات</p>
                        </div>
                    )}
                </div>

                {/* 2. القائمة الجانبية: طلاب لديهم ملاحظات */}
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
                                <div className="flex gap-1">
                                    {s.notes.some(n => n.type === 'private') && <div className="w-2 h-2 rounded-full bg-red-500" title="يوجد ملاحظات خاصة"></div>}
                                    {s.notes.some(n => n.type === 'public') && <div className="w-2 h-2 rounded-full bg-green-500" title="يوجد رسائل للطالب"></div>}
                                </div>
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
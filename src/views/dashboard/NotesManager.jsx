// src/views/dashboard/NotesManager.jsx
import React, { useState, useMemo } from 'react';
import { 
    FileText, MessageCircle, Lock, Send, Trash2, 
    Printer, Search, User, Edit3, X, CheckCircle 
} from 'lucide-react';
import { StudentSearch, Button } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

export default function NotesManager({ students, studentsCollection, logActivity, selectedBranch }) {
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [noteText, setNoteText] = useState('');
    const [noteType, setNoteType] = useState('private'); // 'private' | 'public'
    const [editingNote, setEditingNote] = useState(null); 

    // --- 1. دمج الملاحظات (القديمة والجديدة) ---
    const getCombinedNotes = (student) => {
        if (!student) return [];
        let allNotes = [];

        if (student.note && typeof student.note === 'string' && student.note.trim() !== "") {
            allNotes.push({
                id: 'legacy_note', 
                text: student.note,
                type: 'private', 
                date: 'سجل قديم',
                isLegacy: true 
            });
        }

        const modernNotes = student.notes || []; 
        const internalNotes = student.internalNotes || []; 
        
        if (Array.isArray(modernNotes)) {
            allNotes = [...allNotes, ...modernNotes];
        }
        
        if (Array.isArray(internalNotes)) {
             const existingIds = new Set(allNotes.map(n => n.id));
             internalNotes.forEach(n => {
                 if (!existingIds.has(n.id)) {
                     allNotes.push({ ...n, type: 'private' }); 
                 }
             });
        }

        return allNotes.sort((a, b) => {
            if (a.isLegacy) return 1; 
            if (b.isLegacy) return -1; 
            return (b.id > a.id ? 1 : -1);
        });
    };

    // --- 2. تصفية القائمة الجانبية ---
    const studentsWithNotes = useMemo(() => {
        return students.filter(s => {
            const hasLegacy = s.note && s.note.trim().length > 0;
            const hasModern = (s.notes && s.notes.length > 0) || (s.internalNotes && s.internalNotes.length > 0);
            return hasLegacy || hasModern;
        });
    }, [students]);

    // --- 3. الحفظ (إضافة أو تعديل) ---
    const handleSaveNote = async () => {
        if (!selectedStudent || !noteText.trim()) return;

        let updatedData = {};

        if (editingNote) {
            if (editingNote.isLegacy) {
                updatedData = { note: noteText };
                logActivity('تعديل ملاحظة', `تعديل الملاحظة الرئيسية للطالب ${selectedStudent.name}`);
            } else {
                const currentNotes = selectedStudent.notes || [];
                const newNotesArray = currentNotes.map(n => 
                    n.id === editingNote.id ? { ...n, text: noteText, type: noteType } : n
                );
                updatedData = { notes: newNotesArray };
                logActivity('تعديل ملاحظة', `تعديل ملاحظة في السجل للطالب ${selectedStudent.name}`);
            }
        } 
        else {
            const newNoteObj = {
                id: Date.now().toString(),
                text: noteText,
                type: noteType,
                date: new Date().toISOString().split('T')[0],
                branch: selectedBranch
            };
            const currentNotes = selectedStudent.notes || [];
            updatedData = { notes: [newNoteObj, ...currentNotes] };
            logActivity('ملاحظة جديدة', `إضافة ملاحظة (${noteType === 'private' ? 'خاصة' : 'عامة'}) للطالب ${selectedStudent.name}`);
        }

        await studentsCollection.update(selectedStudent.id, updatedData);

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
            updatedData = { note: "" };
        } else {
            const currentNotes = selectedStudent.notes || [];
            const newNotesArray = currentNotes.filter(n => n.id !== note.id);
            updatedData = { notes: newNotesArray };
            
            if (selectedStudent.internalNotes) {
                 const newInternal = selectedStudent.internalNotes.filter(n => n.id !== note.id);
                 if (newInternal.length !== selectedStudent.internalNotes.length) {
                     updatedData.internalNotes = newInternal;
                 }
            }
        }

        await studentsCollection.update(selectedStudent.id, updatedData);
        logActivity('حذف ملاحظة', `حذف ملاحظة للطالب ${selectedStudent.name}`);
        
        setSelectedStudent(prev => ({ ...prev, ...updatedData }));
        
        if (editingNote?.id === note.id) {
            setEditingNote(null);
            setNoteText('');
        }
    };

    const startEdit = (note) => {
        setEditingNote(note);
        setNoteText(note.text);
        setNoteType(note.type || 'private');
    };

    // --- 5. طباعة التقرير الإداري المجمع (جدول لجميع الطلاب) ---
    const handlePrintAll = () => {
        const printWin = window.open('', 'PRINT', 'height=800,width=1000');
        const logoUrl = window.location.origin + IMAGES.LOGO;
        
        let rowsHtml = '';
        let counter = 1;

        studentsWithNotes.forEach(s => {
            const notes = getCombinedNotes(s);
            notes.forEach(n => {
                rowsHtml += `
                    <tr>
                        <td style="border:1px solid #000; padding:6px; text-align:center;">${counter++}</td>
                        <td style="border:1px solid #000; padding:6px; font-weight:bold; white-space:nowrap;">${s.name}</td>
                        <td style="border:1px solid #000; padding:6px; text-align:center; font-size:11px;">${s.belt || '-'}</td>
                        <td style="border:1px solid #000; padding:6px; text-align:center; white-space:nowrap; direction:ltr;">${n.date}</td>
                        <td style="border:1px solid #000; padding:6px; text-align:center; font-weight:bold; color:${n.type === 'private' ? '#991b1b' : '#166534'}">${n.type === 'private' ? 'إدارية (خاص)' : 'عامة'}</td>
                        <td style="border:1px solid #000; padding:6px; text-align:right;">${n.text}</td>
                    </tr>
                `;
            });
        });

        if (studentsWithNotes.length === 0) {
            rowsHtml = `<tr><td colspan="6" style="text-align:center; padding:20px;">لا يوجد ملاحظات مسجلة لأي طالب حالياً.</td></tr>`;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>التقرير الإداري للملاحظات - ${selectedBranch}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                    @page { size: A4 landscape; margin: 10mm; }
                    body { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; background: #fff; color: #000; }
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                    .header-info h1 { margin: 0; font-size: 20px; color: #000; font-weight: 900; }
                    .header-info p { margin: 5px 0 0 0; font-size: 13px; font-weight: bold; color: #444; }
                    .logo { height: 60px; object-fit: contain; }
                    table { width: 100%; border-collapse: collapse; font-size: 12px; }
                    th { background-color: #f3f4f6; font-weight: bold; border: 1px solid #000; padding: 8px; text-align: center; }
                    td { border: 1px solid #000; vertical-align: top; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                        th, td { border: 1px solid #000 !important; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="header-info">
                        <h1>التقرير الإداري لسجل الملاحظات</h1>
                        <p>الفرع: ${selectedBranch || 'عام'} | تاريخ الطباعة: ${new Date().toLocaleDateString('ar-JO')}</p>
                    </div>
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 30px;">#</th>
                            <th style="width: 180px;">اسم الطالب</th>
                            <th style="width: 80px;">الحزام</th>
                            <th style="width: 100px;">تاريخ الإضافة</th>
                            <th style="width: 100px;">النوع</th>
                            <th>نص الملاحظة</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
                <div style="font-size:10px; color:#666; text-align:left; margin-top:15px;">
                    تم الإنشاء بواسطة نظام إدارة أكاديمية الشجاع للتايكواندو
                </div>
                <script>window.onload = function() { window.print(); window.close(); }</script>
            </body>
            </html>
        `;
        printWin.document.write(htmlContent);
        printWin.document.close();
    };

    // --- 6. طباعة تقرير طالب محدد (لأولياء الأمور) ---
    const handlePrintStudentNotes = () => {
        if (!selectedStudent) return;
        const notesToPrint = getCombinedNotes(selectedStudent);
        const printWin = window.open('', 'PRINT', 'height=800,width=800');
        const logoUrl = window.location.origin + IMAGES.LOGO;

        let rowsHtml = notesToPrint.map((n, i) => `
            <div class="note-card">
                <div class="note-header">
                    <span class="note-type ${n.type === 'private' ? 'type-private' : 'type-public'}">
                        ${n.type === 'private' ? 'ملاحظة إدارية' : 'ملاحظة عامة'}
                    </span>
                    <span class="note-date">${n.date}</span>
                </div>
                <div class="note-content">${n.text}</div>
            </div>
        `).join('');

        if (notesToPrint.length === 0) {
            rowsHtml = `<div style="text-align:center; padding: 40px; color:#666;">لا توجد ملاحظات مسجلة لهذا الطالب.</div>`;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>تقرير ملاحظات - ${selectedStudent.name}</title>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                    @page { size: A4 portrait; margin: 15mm; }
                    body { font-family: 'Cairo', sans-serif; margin: 0; padding: 0; background: #fff; color: #111; }
                    
                    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #b45309; padding-bottom: 15px; margin-bottom: 30px; }
                    .company-info h1 { margin: 0 0 5px 0; font-size: 22px; color: #b45309; font-weight: 900; }
                    .logo { height: 70px; object-fit: contain; }
                    
                    .student-info { background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px 20px; border-radius: 8px; margin-bottom: 30px; display: flex; justify-content: space-between; font-size: 14px; }
                    .student-info .name { font-size: 18px; font-weight: 900; color: #b45309; }
                    
                    .section-title { font-size: 18px; font-weight: bold; border-bottom: 2px solid #eee; padding-bottom: 5px; margin-bottom: 20px; }
                    
                    .note-card { border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 15px; overflow: hidden; page-break-inside: avoid; }
                    .note-header { background: #f3f4f6; padding: 8px 15px; display: flex; justify-content: space-between; border-bottom: 1px solid #e5e7eb; }
                    .note-content { padding: 15px; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }
                    .note-type { font-weight: bold; font-size: 12px; padding: 2px 8px; border-radius: 4px; }
                    .type-private { background: #fee2e2; color: #991b1b; }
                    .type-public { background: #dcfce7; color: #166534; }
                    .note-date { font-size: 12px; color: #666; font-weight: bold; }
                    
                    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 15px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-info">
                        <h1>أكاديمية الشجاع للتايكواندو</h1>
                        <div style="font-weight:bold; color:#555;">تقرير ملاحظات وسلوكيات الطالب</div>
                    </div>
                    <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
                </div>

                <div class="student-info">
                    <div>
                        <div class="name">${selectedStudent.name}</div>
                        <div style="margin-top:5px; color:#555; font-weight:bold;">الحزام: ${selectedStudent.belt || 'غير محدد'}</div>
                    </div>
                    <div style="text-align:left; color:#555;">
                        <div>تاريخ التقرير: ${new Date().toLocaleDateString('ar-JO')}</div>
                        <div style="margin-top:5px;">الفرع: ${selectedBranch}</div>
                    </div>
                </div>

                <div class="section-title">سجل الملاحظات (${notesToPrint.length})</div>
                
                <div class="notes-container">
                    ${rowsHtml}
                </div>

                <div class="footer">
                    تم استخراج هذا التقرير من نظام إدارة أكاديمية الشجاع للتايكواندو
                </div>
            </body>
            </html>
        `;

        printWin.document.write(htmlContent);
        printWin.document.close();
        printWin.onload = () => {
            printWin.focus();
            setTimeout(() => { printWin.print(); printWin.close(); }, 500);
        };
    };

    const displayNotes = getCombinedNotes(selectedStudent);

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fade-in font-sans pb-20 md:pb-0">
            
            {/* القسم الأيمن: القائمة والبحث */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-slate-900 p-4 rounded-2xl shadow-lg border border-slate-800/60">
                    <h2 className="text-lg font-black text-slate-100 flex items-center gap-2 mb-4">
                        <FileText className="text-yellow-500"/> سجل الملاحظات
                    </h2>
                    <StudentSearch 
                        students={students} 
                        onSelect={setSelectedStudent} 
                        onClear={() => setSelectedStudent(null)}
                        placeholder="ابحث عن طالب..." 
                    />
                    <Button onClick={handlePrintAll} variant="outline" className="w-full mt-3 text-xs border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800">
                        <Printer size={16}/> طباعة تقرير إداري للجميع
                    </Button>
                </div>

                <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 flex-1 overflow-hidden flex flex-col">
                    <div className="p-3 bg-slate-950 border-b border-slate-800 font-bold text-slate-500 text-xs">
                        طلاب لديهم ملاحظات مسجلة ({studentsWithNotes.length})
                    </div>
                    <div className="overflow-y-auto custom-scrollbar p-2 space-y-1 flex-1">
                        {studentsWithNotes.length > 0 ? studentsWithNotes.map(s => (
                            <button 
                                key={s.id} 
                                onClick={() => setSelectedStudent(s)}
                                className={`w-full text-right p-3 rounded-xl border transition-all flex justify-between items-center group
                                    ${selectedStudent?.id === s.id ? 'bg-yellow-900/10 border-yellow-500/50 shadow-sm' : 'bg-slate-900 border-transparent hover:bg-slate-800 hover:border-slate-700'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${selectedStudent?.id === s.id ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>
                                        {s.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${selectedStudent?.id === s.id ? 'text-yellow-500' : 'text-slate-300'}`}>{s.name}</p>
                                        <p className="text-[10px] text-slate-500">{s.belt}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    {getCombinedNotes(s).some(n=>n.type === 'private') && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_5px_#ef4444]"></div>}
                                    {getCombinedNotes(s).some(n=>n.type === 'public') && <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>}
                                </div>
                            </button>
                        )) : (
                            <div className="text-center py-10 text-slate-600 text-xs">لا يوجد ملاحظات مسجلة</div>
                        )}
                    </div>
                </div>
            </div>

            {/* القسم الأيسر: منطقة العمل (الشات) */}
            <div className="w-full md:w-2/3 bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col overflow-hidden">
                {selectedStudent ? (
                    <>
                        {/* Header with Print Button */}
                        <div className="p-4 border-b border-slate-800 bg-slate-950 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-800 text-yellow-500 rounded-xl flex items-center justify-center font-bold text-lg border border-slate-700">
                                    <User size={20}/>
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-100">{selectedStudent.name}</h3>
                                    <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded text-[10px] border border-slate-700">{selectedStudent.belt}</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handlePrintStudentNotes} 
                                    className="flex items-center gap-1 text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                                    title="طباعة ملاحظات هذا الطالب"
                                >
                                    <Printer size={14}/> 
                                    <span className="hidden sm:inline">طباعة للطالب</span>
                                </button>
                                <div className="text-xs text-slate-600 font-mono hidden sm:block">ID: {selectedStudent.id.substring(0,6)}</div>
                            </div>
                        </div>

                        {/* Notes Feed (Area) */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900">
                            {displayNotes.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50">
                                    <FileText size={48} className="mb-2"/>
                                    <p>لا يوجد ملاحظات لهذا الطالب</p>
                                </div>
                            )}
                            
                            {displayNotes.map((note, index) => (
                                <div 
                                    key={note.id || index} 
                                    className={`relative group p-4 rounded-2xl border transition-all hover:shadow-lg
                                        ${note.type === 'private' ? 'bg-red-900/5 border-red-900/20 border-r-4 border-r-red-500' : 'bg-emerald-900/5 border-emerald-900/20 border-r-4 border-r-emerald-500'}
                                        ${editingNote?.id === note.id ? 'ring-1 ring-yellow-500 bg-yellow-900/5' : ''}
                                    `}
                                >
                                    {/* Header of Note */}
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            {note.type === 'private' ? (
                                                <span className="bg-red-900/20 text-red-400 text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1 border border-red-500/20">
                                                    <Lock size={10}/> إدارية (خاص)
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-900/20 text-emerald-400 text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1 border border-emerald-500/20">
                                                    <MessageCircle size={10}/> عامة (للطالب)
                                                </span>
                                            )}
                                            <span className="text-[10px] text-slate-500 font-bold font-mono">{note.date}</span>
                                            {note.isLegacy && <span className="bg-slate-800 text-slate-400 text-[9px] px-1.5 py-0.5 rounded border border-slate-700">سجل قديم</span>}
                                        </div>
                                        
                                        {/* Actions */}
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => startEdit(note)} className="p-1.5 text-slate-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors" title="تعديل">
                                                <Edit3 size={14}/>
                                            </button>
                                            <button onClick={() => handleDelete(note)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors" title="حذف">
                                                <Trash2 size={14}/>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <p className="text-slate-300 text-sm whitespace-pre-line leading-relaxed pl-2 border-r-2 border-slate-700 mr-1">
                                        {note.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                            {editingNote && (
                                <div className="flex justify-between items-center bg-yellow-900/20 px-3 py-2 rounded-lg mb-2 text-xs text-yellow-500 border border-yellow-500/30">
                                    <span className="font-bold">جاري تعديل ملاحظة...</span>
                                    <button onClick={() => {setEditingNote(null); setNoteText('');}} className="hover:text-white"><X size={14}/></button>
                                </div>
                            )}
                            
                            <div className="flex gap-2 mb-2">
                                <button 
                                    onClick={() => setNoteType('private')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 border
                                        ${noteType === 'private' ? 'bg-red-900/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'}`}
                                >
                                    <Lock size={12}/> خاصة
                                </button>
                                <button 
                                    onClick={() => setNoteType('public')}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 border
                                        ${noteType === 'public' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'}`}
                                >
                                    <MessageCircle size={12}/> عامة
                                </button>
                            </div>

                            <div className="relative">
                                <textarea 
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 pr-4 pl-12 text-sm outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 text-slate-200 transition-all min-h-[50px] max-h-[120px] placeholder-slate-600"
                                    placeholder="اكتب الملاحظة هنا..."
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                />
                                <button 
                                    onClick={handleSaveNote}
                                    disabled={!noteText.trim()}
                                    className="absolute left-2 bottom-2 bg-yellow-500 text-slate-900 p-2 rounded-lg hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-yellow-500/20"
                                >
                                    {editingNote ? <CheckCircle size={18}/> : <Send size={18}/>}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                            <Search size={32} className="text-slate-500"/>
                        </div>
                        <p className="font-bold text-slate-500">اختر طالباً للبدء</p>
                    </div>
                )}
            </div>
        </div>
    );
}
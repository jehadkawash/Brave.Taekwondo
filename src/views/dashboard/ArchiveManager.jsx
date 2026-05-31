// src/views/dashboard/ArchiveManager.jsx
import React, { useState } from 'react';
import {
    Archive, DollarSign, Printer, MessageCircle,
    CheckCircle, FileText, ArrowRight, Trash2, Eye,
    User, Calendar, MapPin, Lock, Shield, Search, X
} from 'lucide-react';
import { Card, Button } from '../../components/UIComponents';
import { IMAGES } from '../../lib/constants';

// ─── مساعد: تنسيق التاريخ ────────────────────────────────────────────────────
const formatDate = (val) => {
    if (!val) return '-';
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
};

// ─── مساعد: WhatsApp ──────────────────────────────────────────────────────────
const openWhatsApp = (phone) => {
    if (!phone) return;
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.substring(1);
    window.open(`https://wa.me/962${clean}`, '_blank');
};

// ─────────────────────────────────────────────────────────────────────────────

const ArchiveManager = ({ archiveCollection, studentsCollection, payments, logActivity }) => {
    const [selectedStudentForFinance, setSelectedStudentForFinance] = useState(null);
    const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArchive = archiveCollection.data
        .filter(s => s.name?.includes(searchTerm))
        .sort((a, b) => new Date(b.archivedAt) - new Date(a.archivedAt));

    const getStudentPayments = (student) => {
        const targetId = student.originalId || student.id;
        return (payments || []).filter(p =>
            p.studentId === targetId ||
            (p.studentIds && p.studentIds.includes(targetId))
        ).sort((a, b) => {
            const ca = a.createdAt || '';
            const cb = b.createdAt || '';
            if (ca && cb) return cb.localeCompare(ca);
            return String(b.date || '').localeCompare(String(a.date || ''));
        });
    };

    const restoreStudent = async (archivedStudent) => {
        if (!window.confirm(`هل تريد إعادة تفعيل اشتراك الطالب ${archivedStudent.name}؟\n\n(سيتم الحفاظ على تاريخ الالتحاق الأصلي)`)) return;
        const { archivedAt, originalId, id, ...studentData } = archivedStudent;
        await studentsCollection.add({
            ...studentData,
            status: 'active',
            joinDate: studentData.joinDate || new Date().toISOString().split('T')[0],
        });
        await archiveCollection.remove(archivedStudent.id);
        if (logActivity) logActivity('استعادة', `تمت استعادة الطالب ${archivedStudent.name} من الأرشيف`);
    };

    // ─── طباعة وصل دفعة واحدة ────────────────────────────────────────────────
    const printReceipt = (payment, studentBranch) => {
        const branch      = studentBranch || payment.branch || '-';
        const displayDate = formatDate(payment.date);
        const methodText  = payment.method === 'cliq' ? 'كليك (CliQ)' : 'نقدًا (Cash)';
        const extra       = payment.details ? ` (${payment.details})` : '';
        const logoUrl     = window.location.origin + IMAGES.LOGO;

        const win = window.open('', 'RECEIPT', 'height=700,width=1000');
        win.document.write(`<!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>سند قبض - ${payment.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
            @page { size: A5 landscape; margin: 0; }
            body { font-family: 'Cairo', sans-serif; margin: 0; padding: 10mm; background: white;
                   -webkit-print-color-adjust: exact; print-color-adjust: exact; height: 100vh; box-sizing: border-box; }
            .wrap { border: 3px double #444; height: 96%; padding: 20px; box-sizing: border-box;
                    display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
            .wm   { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%) rotate(-25deg);
                    width: 50%; opacity: 0.07; filter: grayscale(100%); }
            .hdr  { display: flex; justify-content: space-between; align-items: center;
                    border-bottom: 2px solid #b45309; padding-bottom: 10px; margin-bottom: 15px; position: relative; z-index: 2; }
            .co h1 { margin:0; font-size:22px; color:#b45309; font-weight:900; }
            .co p  { margin:2px 0; font-size:12px; color:#555; font-weight:bold; }
            .logo img { height:70px; object-fit:contain; }
            .meta { text-align:left; font-size:12px; border-right:2px solid #eee; padding-right:10px; }
            .meta div { margin-bottom:3px; }
            .content { position: relative; z-index: 2; flex-grow: 1; }
            .title { text-align:center; font-size:24px; font-weight:900; margin:10px 0 20px;
                     text-decoration:underline; text-decoration-color:#b45309; text-underline-offset:5px; }
            .amtbox { position:absolute; left:20px; top:40px; border:2px solid #333; padding:5px 15px;
                      border-radius:8px; background:#f9f9f9; transform:rotate(-5deg); box-shadow:2px 2px 0 #ccc; }
            .amtnum { font-size:20px; font-weight:900; direction:ltr; }
            .row { display:flex; align-items:baseline; margin-bottom:12px; font-size:16px; }
            .lbl { font-weight:bold; width:110px; color:#333; }
            .val { flex:1; border-bottom:1px dotted #888; padding:0 5px; font-weight:700; }
            .foot { margin-top:20px; position:relative; z-index:2; }
            .sigs { display:flex; justify-content:space-between; padding:0 40px; margin-bottom:15px; }
            .sb   { text-align:center; width:150px; }
            .sl   { border-top:1px solid #333; margin-bottom:5px; height:25px; }
            .st   { font-size:12px; font-weight:bold; color:#555; }
            .brs  { border-top:2px solid #b45309; padding-top:8px; font-size:10px;
                    display:flex; justify-content:space-between; }
            @media print { body { -webkit-print-color-adjust:exact; print-color-adjust:exact; } }
          </style>
        </head>
        <body>
          <div class="wrap">
            <img src="${logoUrl}" class="wm" onerror="this.style.display='none'"/>
            <div class="hdr">
              <div class="co">
                <h1>أكاديمية الشجاع للتايكواندو</h1>
                <p>فرع: ${branch}</p>
              </div>
              <div class="logo"><img src="${logoUrl}" onerror="this.style.display='none'"/></div>
              <div class="meta">
                <div>رقم السند: <strong>${String(payment.id).slice(-6)}</strong></div>
                <div>التاريخ: <strong>${displayDate}</strong></div>
              </div>
            </div>
            <div class="content">
              <div class="title">سند قبض</div>
              <div class="amtbox"><div class="amtnum">${payment.amount} JD</div></div>
              <div class="row"><span class="lbl">استلمنا من:</span><span class="val">${payment.name}</span></div>
              <div class="row"><span class="lbl">مبلغ وقدره:</span><span class="val">${payment.amount} دينار أردني</span></div>
              <div class="row"><span class="lbl">طريقة الدفع:</span><span class="val">${methodText}</span></div>
              <div class="row"><span class="lbl">وذلك عن:</span><span class="val">${payment.reason || '-'}${extra}</span></div>
            </div>
            <div class="foot">
              <div class="sigs">
                <div class="sb"><div class="sl"></div><div class="st">توقيع الإدارة</div></div>
                <div class="sb"><div class="sl"></div><div class="st">توقيع المستلم</div></div>
              </div>
              <div class="brs">
                <div><span style="font-weight:bold;color:#b45309">شفابدران:</span> شارع رفعت شموط | 079 5629 606</div>
                <div><span style="font-weight:bold;color:#b45309">أبو نصير:</span> دوار البحرية - مجمع الفرّا | 079 0368 603</div>
              </div>
            </div>
          </div>
          <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close();},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ─── طباعة كشف الأرشيف الشامل (كل الطلاب) ──────────────────────────────
    const printFullArchive = () => {
        const logoUrl = window.location.origin + IMAGES.LOGO;
        const dateNow = formatDate(new Date());
        const data    = filteredArchive; // يطبع ما يظهر على الشاشة (مع الفلتر)

        let rowsHtml = '';
        data.forEach((s, i) => {
            const balance     = Number(s.balance || 0);
            const balanceText = balance > 0
                ? `<span style="color:#991b1b;font-weight:bold;">عليه ${balance} JD</span>`
                : `<span style="color:#166534;font-weight:bold;">✓ مدفوع</span>`;

            rowsHtml += `
                <tr style="page-break-inside:avoid;">
                    <td style="border:1px solid #ccc;padding:5px;text-align:center;font-size:12px;">${i + 1}</td>
                    <td style="border:1px solid #ccc;padding:5px;font-weight:bold;font-size:13px;">${s.name || '-'}</td>
                    <td style="border:1px solid #ccc;padding:5px;text-align:center;font-size:12px;">${s.belt || '-'}</td>
                    <td style="border:1px solid #ccc;padding:5px;text-align:center;font-size:12px;">${s.branch || '-'}</td>
                    <td style="border:1px solid #ccc;padding:5px;text-align:center;font-size:11px;font-family:monospace;">${s.phone || '-'}</td>
                    <td style="border:1px solid #ccc;padding:5px;text-align:center;font-size:11px;">${formatDate(s.joinDate)}</td>
                    <td style="border:1px solid #ccc;padding:5px;text-align:center;font-size:11px;">${formatDate(s.archivedAt)}</td>
                    <td style="border:1px solid #ccc;padding:5px;text-align:center;font-size:12px;background:${balance > 0 ? '#fee2e2' : 'transparent'};">${balanceText}</td>
                </tr>
            `;
        });

        if (data.length === 0) {
            rowsHtml = `<tr><td colspan="8" style="text-align:center;padding:20px;color:#666;">الأرشيف فارغ</td></tr>`;
        }

        const win = window.open('', 'ARCHIVE_PRINT', 'height=800,width=1200');
        win.document.write(`<!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>كشف الأرشيف الشامل - أكاديمية الشجاع</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
            @page { size: A4 landscape; margin: 8mm; }
            body { font-family: 'Cairo', sans-serif; margin: 0; background: #fff; color: #000;
                   -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .header { display:flex; justify-content:space-between; align-items:center;
                      border-bottom:3px solid #000; padding-bottom:10px; margin-bottom:15px; }
            .header-left h1 { margin:0; font-size:20px; font-weight:900; color:#000; }
            .header-left p  { margin:4px 0 0; font-size:12px; font-weight:bold; color:#444; }
            .logo { height:60px; object-fit:contain; }
            .stats { display:flex; gap:10px; margin-bottom:15px; }
            .stat { border:1px solid #ccc; border-radius:6px; padding:8px 16px; text-align:center; }
            .stat-title { font-size:11px; font-weight:bold; color:#555; margin-bottom:3px; }
            .stat-val   { font-size:18px; font-weight:900; color:#000; }
            table { width:100%; border-collapse:collapse; font-size:12px; }
            th { background:#1e293b; color:#fff; border:1px solid #000; padding:8px;
                 text-align:center; font-weight:bold; font-size:12px; }
            td { border:1px solid #ccc; vertical-align:middle; }
            tr:nth-child(even) { background:#f8fafc; }
            .footer { margin-top:12px; font-size:10px; color:#666; text-align:left;
                      border-top:1px solid #eee; padding-top:8px; }
            @media print {
              body { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
              th,td { border:1px solid #ccc !important; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="header-left">
              <h1>أكاديمية الشجاع للتايكواندو — كشف الأرشيف الشامل</h1>
              <p>تاريخ الطباعة: ${dateNow} &nbsp;|&nbsp; عدد الطلاب: ${data.length}
                 ${searchTerm ? ` &nbsp;|&nbsp; فلتر: "${searchTerm}"` : ''}
              </p>
            </div>
            <img src="${logoUrl}" class="logo" onerror="this.style.display='none'"/>
          </div>

          <div class="stats">
            <div class="stat">
              <div class="stat-title">إجمالي المؤرشفين</div>
              <div class="stat-val">${data.length}</div>
            </div>
            <div class="stat">
              <div class="stat-title">عليهم ذمم</div>
              <div class="stat-val" style="color:#991b1b">${data.filter(s => Number(s.balance) > 0).length}</div>
            </div>
            <div class="stat">
              <div class="stat-title">مدفوعون كاملاً</div>
              <div class="stat-val" style="color:#166534">${data.filter(s => Number(s.balance || 0) <= 0).length}</div>
            </div>
            <div class="stat">
              <div class="stat-title">إجمالي الذمم</div>
              <div class="stat-val" style="color:#991b1b">
                ${data.reduce((acc, s) => acc + Math.max(0, Number(s.balance || 0)), 0)} JD
              </div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:30px">#</th>
                <th style="width:180px">اسم الطالب</th>
                <th style="width:80px">الحزام</th>
                <th style="width:90px">الفرع</th>
                <th style="width:120px">الهاتف</th>
                <th style="width:100px">تاريخ الالتحاق</th>
                <th style="width:100px">تاريخ الأرشفة</th>
                <th style="width:110px">الذمم المالية</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>

          <div class="footer">
            تم استخراج هذا التقرير من نظام إدارة أكاديمية الشجاع للتايكواندو
          </div>

          <script>window.onload=()=>{window.focus();setTimeout(()=>{window.print();window.close();},600)}</script>
        </body></html>`);
        win.document.close();
    };

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6 font-sans">

            {/* ── مودال: بطاقة الطالب الكاملة ── */}
            {selectedStudentForDetails && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 shadow-2xl" title={`بطاقة الطالب المؤرشف: ${selectedStudentForDetails.name}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3 flex items-center gap-2">
                                    <User size={16} className="text-blue-500"/> البيانات الشخصية
                                </h4>
                                <div className="space-y-2 text-sm text-slate-400">
                                    <p><span className="text-slate-500 font-bold">الاسم:</span> <span className="text-slate-200">{selectedStudentForDetails.name}</span></p>
                                    <p><span className="text-slate-500 font-bold">الهاتف:</span> {selectedStudentForDetails.phone}</p>
                                    <p><span className="text-slate-500 font-bold">الحزام:</span> {selectedStudentForDetails.belt}</p>
                                    <p><span className="text-slate-500 font-bold">المجموعة:</span> {selectedStudentForDetails.group || 'غير محدد'}</p>
                                    <p><span className="text-slate-500 font-bold">تاريخ الميلاد:</span> {selectedStudentForDetails.dob || 'غير مدخل'}</p>
                                </div>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3 flex items-center gap-2">
                                    <Calendar size={16} className="text-emerald-500"/> التواريخ والعنوان
                                </h4>
                                <div className="space-y-2 text-sm text-slate-400">
                                    <p><span className="text-slate-500 font-bold">تاريخ الالتحاق:</span> {formatDate(selectedStudentForDetails.joinDate)}</p>
                                    <p><span className="text-slate-500 font-bold">تاريخ الأرشفة:</span> {formatDate(selectedStudentForDetails.archivedAt)}</p>
                                    <p><span className="text-slate-500 font-bold">نهاية الاشتراك:</span> {formatDate(selectedStudentForDetails.subEnd)}</p>
                                    <p><span className="text-slate-500 font-bold">العنوان:</span> {selectedStudentForDetails.address || 'لا يوجد'}</p>
                                </div>
                            </div>

                            <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20">
                                <h4 className="font-bold text-yellow-500 border-b border-yellow-500/20 pb-2 mb-3 flex items-center gap-2">
                                    <Lock size={16}/> بيانات الدخول
                                </h4>
                                <div className="text-sm font-mono dir-ltr text-right text-yellow-100/80 space-y-1">
                                    <p><span className="text-yellow-600 font-sans font-bold float-right ml-2">:Username</span> {selectedStudentForDetails.username}</p>
                                    <p><span className="text-yellow-600 font-sans font-bold float-right ml-2">:Password</span> ••••••••</p>
                                </div>
                            </div>

                            <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                                <h4 className="font-bold text-red-400 border-b border-red-500/20 pb-2 mb-3 flex items-center gap-2">
                                    <Shield size={16}/> ملاحظات إدارية
                                </h4>
                                <div className="max-h-32 overflow-y-auto custom-scrollbar text-sm text-slate-300">
                                    {selectedStudentForDetails.internalNotes?.length > 0 ? (
                                        <ul className="list-disc list-inside space-y-1">
                                            {selectedStudentForDetails.internalNotes.map((n, i) => (
                                                <li key={i}>{n.text} <span className="text-xs text-slate-500">({n.date})</span></li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-slate-500 italic">لا يوجد ملاحظات</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2 border-t border-slate-800 pt-4">
                            <Button onClick={() => setSelectedStudentForDetails(null)} variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">إغلاق</Button>
                            <Button
                                className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                                onClick={() => { restoreStudent(selectedStudentForDetails); setSelectedStudentForDetails(null); }}
                            >
                                <ArrowRight size={16} className="ml-2"/> استعادة الطالب
                            </Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* ── مودال: الملف المالي ── */}
            {selectedStudentForFinance && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
                    <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 shadow-2xl"
                          title={`الملف المالي: ${selectedStudentForFinance.name}`}>
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div className={`p-4 rounded-xl border-2 text-center ${Number(selectedStudentForFinance.balance) > 0 ? 'bg-red-900/20 border-red-500/50' : 'bg-emerald-900/20 border-emerald-500/50'}`}>
                                <p className="text-slate-400 text-sm mb-1">الرصيد المتبقي (ذمم)</p>
                                <p className={`text-2xl font-black ${Number(selectedStudentForFinance.balance) > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                    {selectedStudentForFinance.balance || 0} JD
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-slate-700 bg-slate-950 text-center">
                                <p className="text-slate-500 text-sm mb-1">تاريخ الأرشفة</p>
                                <p className="text-xl font-bold text-slate-200">{formatDate(selectedStudentForFinance.archivedAt)}</p>
                            </div>
                        </div>

                        <h4 className="font-bold border-b border-slate-700 pb-2 mb-4 text-slate-200 flex items-center gap-2">
                            <DollarSign size={18} className="text-emerald-500"/> سجل الوصولات السابقة
                        </h4>

                        {getStudentPayments(selectedStudentForFinance).length > 0 ? (
                            <div className="space-y-3">
                                {getStudentPayments(selectedStudentForFinance).map(p => (
                                    <div key={p.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all group">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-slate-300 text-sm">{p.reason || '-'}</p>
                                            <p className="text-xs text-slate-500">{formatDate(p.date)} — {p.branch || '-'}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="font-bold text-emerald-400">{p.amount} JD</span>
                                            {/* ── زر طباعة الوصل — مكتمل الآن ── */}
                                            <button
                                                onClick={() => printReceipt(p, selectedStudentForFinance.branch)}
                                                className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-500/20"
                                                title="طباعة الوصل"
                                            >
                                                <Printer size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 bg-slate-950 rounded-xl border border-slate-800 border-dashed">
                                <p className="text-slate-600">لا يوجد سجلات مالية لهذا الطالب</p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end pt-4 border-t border-slate-800">
                            <Button onClick={() => setSelectedStudentForFinance(null)} className="bg-slate-800 text-slate-300 hover:bg-slate-700">إغلاق الملف</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* ── شريط البحث والإجراءات ── */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg gap-4">
                <h2 className="text-2xl font-black text-slate-200 flex items-center gap-2">
                    <Archive className="text-red-500"/> أرشيف الطلاب
                    <span className="text-sm font-normal text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                        {filteredArchive.length} طالب
                    </span>
                </h2>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* بحث */}
                    <div className="relative flex-1 md:w-64">
                        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                        <input
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 pr-9 rounded-xl outline-none focus:border-red-500 placeholder-slate-600 text-sm"
                            placeholder="بحث في الأرشيف..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-red-400">
                                <X size={14}/>
                            </button>
                        )}
                    </div>

                    {/* طباعة الكشف الشامل */}
                    <button
                        onClick={printFullArchive}
                        disabled={filteredArchive.length === 0}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                        title="طباعة كشف الأرشيف الشامل"
                    >
                        <Printer size={16}/> <span className="hidden sm:inline">طباعة الكشف</span>
                    </button>
                </div>
            </div>

            {/* ── الجدول ── */}
            <Card noPadding className="bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
                {filteredArchive.length === 0 ? (
                    <div className="text-center py-16">
                        <Archive size={48} className="mx-auto text-slate-700 mb-3"/>
                        <p className="text-slate-500 font-bold">
                            {searchTerm ? 'لا يوجد نتائج مطابقة' : 'الأرشيف فارغ حالياً'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                                <tr>
                                    <th className="p-4 font-bold">اسم الطالب</th>
                                    <th className="p-4 font-bold">الهاتف</th>
                                    <th className="p-4 font-bold text-center">تاريخ الالتحاق</th>
                                    <th className="p-4 font-bold text-center">تاريخ الأرشفة</th>
                                    <th className="p-4 font-bold text-center">الذمم المالية</th>
                                    <th className="p-4 font-bold text-center">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 bg-slate-900">
                                {filteredArchive.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-800/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">{s.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5">{s.belt} — {s.branch}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-400 font-mono">
                                                <a href={`tel:${s.phone}`} className="hover:text-blue-400 transition-colors">{s.phone}</a>
                                                <button onClick={() => openWhatsApp(s.phone)} className="text-green-600 hover:text-green-400 transition-colors">
                                                    <MessageCircle size={15}/>
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center text-slate-500 font-mono text-xs">{formatDate(s.joinDate)}</td>
                                        <td className="p-4 text-center text-slate-500 font-mono text-xs">{formatDate(s.archivedAt)}</td>
                                        <td className="p-4 text-center">
                                            {Number(s.balance) > 0 ? (
                                                <span className="bg-red-900/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-bold text-xs">
                                                    عليه {s.balance} JD
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 w-fit mx-auto">
                                                    <CheckCircle size={12}/> مدفوع
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => setSelectedStudentForDetails(s)}
                                                    className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
                                                    title="عرض كافة المعلومات">
                                                    <Eye size={15}/>
                                                </button>
                                                <button onClick={() => setSelectedStudentForFinance(s)}
                                                    className="p-2 bg-emerald-900/20 text-emerald-500 rounded-lg hover:bg-emerald-600 hover:text-white border border-emerald-500/20 transition-colors"
                                                    title="الملف المالي">
                                                    <FileText size={15}/>
                                                </button>
                                                <button onClick={() => restoreStudent(s)}
                                                    className="p-2 bg-blue-900/20 text-blue-500 rounded-lg hover:bg-blue-600 hover:text-white border border-blue-500/20 transition-colors"
                                                    title="استعادة الطالب">
                                                    <ArrowRight size={15}/>
                                                </button>
                                                <button
                                                    onClick={async () => { if (window.confirm('حذف نهائي من السجلات؟ لا يمكن التراجع!')) await archiveCollection.remove(s.id); }}
                                                    className="p-2 bg-red-900/20 text-red-500 rounded-lg hover:bg-red-600 hover:text-white border border-red-500/20 transition-colors"
                                                    title="حذف نهائي">
                                                    <Trash2 size={15}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ArchiveManager;

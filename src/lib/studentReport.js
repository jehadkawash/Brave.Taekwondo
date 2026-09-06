import { calculateStatus, formatDate } from './utils';

const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const labels = { active: 'نشط', near_end: 'قرب الانتهاء', expired: 'منتهي' };

export function studentReportHtml({ students, selectedBranch, debtTotals = {}, filterDescription = '' }) {
    const counts = { active: 0, near_end: 0, expired: 0 };
    students.forEach(student => counts[calculateStatus(student.subEnd)]++);
    const rows = students.map((student, index) => {
        const status = calculateStatus(student.subEnd);
        return `<tr><td>${index + 1}</td><td class="name">${escape(student.name)}<small>${escape(student.familyName || '')}</small></td><td><bdi>${escape(student.phone || '—')}</bdi><small>${escape(student.phoneLabel || 'الأساسي')}</small>${student.secondaryPhone ? `<small><bdi>${escape(student.secondaryPhone)}</bdi> · ${escape(student.secondaryPhoneLabel || 'الثانوي')}</small>` : ''}</td><td>${escape(student.group || '—')}</td><td>${escape(student.belt || '—')}</td><td><bdi>${escape(formatDate(student.joinDate))}</bdi></td><td><bdi>${escape(formatDate(student.subEnd))}</bdi></td><td><span class="status ${status}">${labels[status]}</span></td><td><bdi>${Number(debtTotals[student.id] || 0).toFixed(2)}</bdi></td></tr>`;
    }).join('');
    return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>كشف الطلاب — ${escape(selectedBranch)} — ${new Date().toISOString().slice(0, 10)}</title><style>
    *{box-sizing:border-box}body{margin:0;background:#eef2f6;color:#172033;font:13px Tahoma,Arial,sans-serif;line-height:1.6}.sheet{max-width:1120px;margin:24px auto;background:white;padding:36px}header{border-bottom:3px solid #b88a23;padding-bottom:20px;display:flex;justify-content:space-between;align-items:center}h1{font-size:27px;margin:2px 0}.brand{letter-spacing:2px;font-size:11px;color:#64748b}p{margin:4px 0}.meta{color:#64748b;font-size:11px}.summary{display:flex;gap:16px;margin:22px 0}.summary div{flex:1;border:1px solid #dbe2ea;border-radius:8px;padding:12px}.summary strong{display:block;font-size:23px}.filters{padding:10px 0;color:#475569}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#172033;color:#fff;text-align:right;padding:11px 7px}td{padding:10px 7px;border-bottom:1px solid #e2e8f0;overflow-wrap:anywhere}tr:nth-child(even){background:#f8fafc}.name{font-weight:bold;min-width:130px}small{display:block;color:#64748b;font-weight:normal;font-size:10px}.status{white-space:nowrap;font-weight:bold}.active{color:#166534}.near_end{color:#92400e}.expired{color:#b91c1c}footer{border-top:1px solid #cbd5e1;margin-top:24px;padding-top:12px;color:#64748b;font-size:10px;display:flex;justify-content:space-between}.toolbar{padding:16px;text-align:center}.toolbar button{background:#172033;color:white;border:0;border-radius:8px;padding:12px 24px;cursor:pointer;font:inherit}.toolbar p{font-size:12px;color:#475569}@page{size:A4 landscape;margin:12mm}@media print{body{background:white}.sheet{margin:0;padding:0;max-width:none}.toolbar{display:none}thead{display:table-header-group}tr{break-inside:avoid}header,.summary,footer{break-inside:avoid}*{print-color-adjust:exact;-webkit-print-color-adjust:exact}}
    </style></head><body><div class="toolbar"><button onclick="window.print()">طباعة / حفظ PDF</button><p>لحفظ الملف اختر «حفظ بتنسيق PDF» من نافذة الطباعة.</p></div><main class="sheet"><header><div><div class="brand">BRAVE TAEKWONDO ACADEMY</div><h1>كشف الطلاب</h1><p>الفرع: ${escape(selectedBranch || 'جميع الفروع')}</p></div><div class="meta">تاريخ الإصدار<br>${escape(new Date().toLocaleString('ar-JO'))}</div></header><div class="summary"><div>إجمالي النتائج<strong>${students.length}</strong></div>${Object.entries(labels).map(([key, label]) => `<div>${label}<strong>${counts[key]}</strong></div>`).join('')}</div><p class="filters">${escape(filterDescription || 'جميع الطلاب دون تصفية')} · بنفس ترتيب القائمة المعروضة</p><table><thead><tr>${['#','اسم الطالب','التواصل','المجموعة','الحزام','الالتحاق','نهاية الاشتراك','الحالة','الدين (د.أ)'].map(label => `<th>${label}</th>`).join('')}</tr></thead><tbody>${rows || '<tr><td colspan="9">لا توجد نتائج مطابقة.</td></tr>'}</tbody></table><footer><span>أكاديمية بريف للتايكواندو · كشف إداري</span><span>عدد الطلاب: ${students.length} · بيانات التواصل للاستخدام الإداري</span></footer></main></body></html>`;
}

export function printStudentReport(options) {
    const popup = window.open('', '_blank');
    if (!popup) { window.alert('يرجى السماح بالنوافذ المنبثقة لفتح معاينة التقرير.'); return; }
    popup.opener = null;
    popup.document.open();
    popup.document.write(studentReportHtml(options));
    popup.document.close();
}

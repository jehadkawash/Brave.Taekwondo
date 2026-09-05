import React, { useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Copy, KeyRound, MessageCircle, Phone, ShieldAlert, Trash2, User } from 'lucide-react';
import { toast } from '../../lib/toast';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../lib/firebase';

const digits = (value = '') => String(value).replace(/\D/g, '');
const normalizePhone = (value = '') => {
  const clean = digits(value);
  return clean.startsWith('962') ? `0${clean.slice(3)}` : clean;
};

const requestDate = (value) => {
  const date = value?.toDate ? value.toDate() : value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString('ar-JO', { timeZone: 'Asia/Amman' })
    : 'الآن';
};

const createTemporaryPassword = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
};

export default function PasswordResetRequestsManager({
  requestsCollection,
  students = [],
  selectedBranch,
  user,
  logActivity,
}) {
  const [generated, setGenerated] = useState(null);
  const [workingId, setWorkingId] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const requests = useMemo(() => (requestsCollection.data || [])
    .filter(r => showCompleted || r.status !== 'completed')
    .sort((a, b) => {
      const av = a.createdAt?.toMillis?.() || new Date(a.createdAt || 0).getTime();
      const bv = b.createdAt?.toMillis?.() || new Date(b.createdAt || 0).getTime();
      return bv - av;
    }), [requestsCollection.data, showCompleted]);

  const findMatches = (request) => {
    const requestedPhone = normalizePhone(request.phone);
    const requestedName = String(request.studentName || '').trim().toLowerCase();
    return students.filter(student => {
      if (student.branch !== selectedBranch) return false;
      const samePhone = requestedPhone && normalizePhone(student.phone) === requestedPhone;
      const sameName = requestedName && String(student.name || '').trim().toLowerCase().includes(requestedName);
      return samePhone || sameName;
    });
  };

  const resetPassword = async (request, student) => {
    if (!student || workingId) return;
    if (!window.confirm(`سيتم إنشاء كلمة مؤقتة جديدة لـ ${student.name}. هل تأكدت من هوية مقدم الطلب؟`)) return;

    setWorkingId(request.id);
    try {
      const temporaryPassword = createTemporaryPassword();
      const adminReset = httpsCallable(functions, 'adminResetFamilyPassword');
      await adminReset({ studentId: student.id, requestId: request.id, password: temporaryPassword });

      setGenerated({ student, password: temporaryPassword });
      logActivity?.('إعادة تعيين كلمة مرور', `تم إصدار كلمة مؤقتة للطالب ${student.name}`);
      toast('تم إصدار كلمة مؤقتة. انسخها الآن لأنها لن تظهر مرة أخرى.', 'success');
    } catch (error) {
      console.error('Password reset failed:', error);
      toast('لم يتم تعيين كلمة المرور. حاول مرة أخرى.', 'error');
    } finally {
      setWorkingId(null);
    }
  };

  const openWhatsApp = (phone, message = '') => {
    const clean = normalizePhone(phone).replace(/^0/, '');
    if (clean) {
      const text = message ? `?text=${encodeURIComponent(message)}` : '';
      window.open(`https://wa.me/962${clean}${text}`, '_blank');
    }
  };

  const copyPassword = async () => {
    await navigator.clipboard.writeText(generated.password);
    toast('تم نسخ كلمة المرور', 'success');
  };

  return (
    <div className="space-y-5 pb-20 md:pb-0" dir="rtl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2"><KeyRound className="text-yellow-500" /> طلبات استعادة الدخول</h2>
          <p className="text-xs text-slate-500 mt-1">تأكد من هوية ولي الأمر قبل إصدار كلمة جديدة.</p>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-400">
          <input type="checkbox" checked={showCompleted} onChange={e => setShowCompleted(e.target.checked)} /> إظهار الطلبات المكتملة
        </label>
      </div>

      {generated && (
        <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-emerald-300">كلمة مؤقتة لـ {generated.student.name}</p>
              <p className="text-xs text-emerald-400/70 mt-1">تظهر هذه الكلمة الآن فقط.</p>
            </div>
            <button onClick={() => setGenerated(null)} className="text-slate-500 hover:text-white">×</button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <code className="flex-1 text-center text-xl tracking-widest bg-slate-950 p-3 rounded-xl text-white border border-slate-700" dir="ltr">{generated.password}</code>
            <button onClick={copyPassword} className="px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"><Copy size={17} /> نسخ</button>
            <button onClick={() => openWhatsApp(
              generated.student.phone,
              `مرحباً، تم إصدار بيانات دخول مؤقتة لحساب ${generated.student.name}.\nاسم المستخدم: ${generated.student.username}\nكلمة المرور: ${generated.password}`
            )} className="px-4 py-3 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2"><MessageCircle size={17} /> WhatsApp</button>
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div className="py-16 text-center bg-slate-900 border border-dashed border-slate-700 rounded-2xl text-slate-500">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-500/60" /> لا توجد طلبات معلقة
        </div>
      ) : requests.map(request => {
        const matches = findMatches(request);
        return (
          <div key={request.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
              <div>
                <h3 className="font-black text-slate-100 flex items-center gap-2"><User size={18} className="text-yellow-500" /> {request.studentName}</h3>
                <p className="text-sm text-slate-400 mt-2 flex items-center gap-2"><Phone size={15} /> {request.phone}</p>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-2"><Clock3 size={14} /> {requestDate(request.createdAt)}</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border ${request.status === 'completed' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/30' : 'text-yellow-400 border-yellow-500/30 bg-yellow-950/30'}`}>
                {request.status === 'completed' ? 'مكتمل' : 'جديد'}
              </span>
            </div>

            {request.status !== 'completed' && (
              <div className="border-t border-slate-800 pt-4">
                {matches.length === 0 ? (
                  <p className="text-sm text-red-300 flex items-center gap-2"><ShieldAlert size={17} /> لم يتم العثور على طالب مطابق في هذا الفرع.</p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-500">الحسابات المحتملة — تحقق من الهاتف قبل التعيين:</p>
                    {matches.map(student => (
                      <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 border border-slate-800 rounded-xl p-3">
                        <div><p className="font-bold text-slate-200">{student.name}</p><p className="text-xs text-slate-500">{student.phone} · {student.branch} · {student.username}</p></div>
                        <button disabled={workingId === request.id} onClick={() => resetPassword(request, student)} className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-sm disabled:opacity-50">
                          {workingId === request.id ? 'جاري الإصدار...' : 'إصدار كلمة مؤقتة'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button onClick={() => openWhatsApp(request.phone)} className="p-2 text-green-400 hover:bg-green-950/30 rounded-lg" title="WhatsApp"><MessageCircle size={18} /></button>
              <a href={`tel:${request.phone}`} className="p-2 text-blue-400 hover:bg-blue-950/30 rounded-lg" title="اتصال"><Phone size={18} /></a>
              <button onClick={() => window.confirm('حذف الطلب؟') && requestsCollection.remove(request.id)} className="p-2 text-red-400 hover:bg-red-950/30 rounded-lg" title="حذف"><Trash2 size={18} /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

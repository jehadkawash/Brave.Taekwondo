// src/views/dashboard/ArchiveManager.jsx
import React, { useState } from 'react';
import { Archive, DollarSign, Printer, MessageCircle, CheckCircle, FileText, ArrowRight, Trash2, Eye, User, Calendar, MapPin, Lock, Shield } from 'lucide-react';
import { Card, Button } from '../../components/UIComponents'; 

const ArchiveManager = ({ archiveCollection, studentsCollection, payments, logActivity }) => {
  const [selectedStudentForFinance, setSelectedStudentForFinance] = useState(null); 
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  // Filter archive by search
  const filteredArchive = archiveCollection.data.filter(s => s.name.includes(searchTerm));

  // Function to restore student
  const restoreStudent = async (archivedStudent) => {
      if(!window.confirm(`هل تريد إعادة تفعيل اشتراك الطالب ${archivedStudent.name}؟\n\n(سيتم الحفاظ على تاريخ الالتحاق الأصلي)`)) return;
      
      const { archivedAt, originalId, id, ...studentData } = archivedStudent;
      
      await studentsCollection.add({
          ...studentData,
          status: 'active',
          joinDate: studentData.joinDate || new Date().toISOString().split('T')[0]
      });

      await archiveCollection.remove(archivedStudent.id);
      logActivity("استعادة", `تمت استعادة الطالب ${archivedStudent.name} من الأرشيف`);
  };

  const printReceipt = (payment, branch) => {
      alert("Print functionality for: " + payment.id); 
  };

  const openWhatsApp = (phone) => {
      if (!phone) return;
      let cleanPhone = phone.replace(/\D/g, ''); 
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
      window.open(`https://wa.me/962${cleanPhone}`, '_blank');
  };

  const getStudentPayments = (student) => {
      const targetId = student.originalId || student.id; 
      return payments.filter(p => 
          p.studentId === targetId || 
          (p.studentIds && p.studentIds.includes(targetId))
      );
  };

  return (
    <div className="space-y-6 font-sans">

      {/* ✅ مودال عرض التفاصيل الكاملة للطالب المؤرشف */}
      {selectedStudentForDetails && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
              <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 shadow-2xl" title={`بطاقة الطالب المؤرشف: ${selectedStudentForDetails.name}`}>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {/* المعلومات الأساسية */}
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

                      {/* التواريخ والعناوين */}
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                          <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3 flex items-center gap-2">
                              <Calendar size={16} className="text-emerald-500"/> التواريخ والعنوان
                          </h4>
                          <div className="space-y-2 text-sm text-slate-400">
                              <p><span className="text-slate-500 font-bold">تاريخ الالتحاق الأصلي:</span> {selectedStudentForDetails.joinDate}</p>
                              <p><span className="text-slate-500 font-bold">تاريخ الأرشفة:</span> {selectedStudentForDetails.archivedAt}</p>
                              <p><span className="text-slate-500 font-bold">تاريخ انتهاء الاشتراك (عند الأرشفة):</span> {selectedStudentForDetails.subEnd}</p>
                              <div className="flex gap-1">
                                  <MapPin size={14} className="text-slate-600 mt-1"/>
                                  <span className="text-slate-300">{selectedStudentForDetails.address || 'لا يوجد عنوان مسجل'}</span>
                              </div>
                          </div>
                      </div>

                      {/* بيانات الدخول */}
                      <div className="bg-yellow-900/10 p-4 rounded-xl border border-yellow-500/20">
                          <h4 className="font-bold text-yellow-500 border-b border-yellow-500/20 pb-2 mb-3 flex items-center gap-2">
                              <Lock size={16}/> بيانات الدخول
                          </h4>
                          <div className="space-y-2 text-sm font-mono dir-ltr text-right text-yellow-100/80">
                              <p><span className="text-yellow-600 font-sans font-bold float-right ml-2">:Username</span> {selectedStudentForDetails.username}</p>
                              <p><span className="text-yellow-600 font-sans font-bold float-right ml-2">:Password</span> {selectedStudentForDetails.password}</p>
                          </div>
                      </div>

                      {/* الملاحظات */}
                      <div className="bg-red-900/10 p-4 rounded-xl border border-red-500/20">
                          <h4 className="font-bold text-red-400 border-b border-red-500/20 pb-2 mb-3 flex items-center gap-2">
                              <Shield size={16}/> ملاحظات إدارية
                          </h4>
                          <div className="max-h-32 overflow-y-auto custom-scrollbar text-sm text-slate-300">
                              {selectedStudentForDetails.internalNotes && selectedStudentForDetails.internalNotes.length > 0 ? (
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

                  <div className="mt-6 flex justify-end gap-2 border-t border-slate-800 pt-4">
                      <Button onClick={() => setSelectedStudentForDetails(null)} variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800">إغلاق</Button>
                      <Button 
                          className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20"
                          onClick={() => {
                              restoreStudent(selectedStudentForDetails);
                              setSelectedStudentForDetails(null);
                          }}
                      >
                          <ArrowRight size={16} className="ml-2"/> استعادة الطالب
                      </Button>
                  </div>
              </Card>
          </div>
      )}

      {/* Modal: Financial File */}
      {selectedStudentForFinance && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-900 border-slate-700 shadow-2xl" title={`الملف المالي: ${selectedStudentForFinance.name}`}>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className={`p-4 rounded-xl border-2 text-center ${selectedStudentForFinance.balance > 0 ? 'bg-red-900/20 border-red-500/50' : 'bg-emerald-900/20 border-emerald-500/50'}`}>
                          <p className="text-slate-400 text-sm">الرصيد المتبقي (ذمم)</p>
                          <p className={`text-2xl font-black ${selectedStudentForFinance.balance > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                              {selectedStudentForFinance.balance} JOD
                          </p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-700 bg-slate-950 text-center">
                          <p className="text-slate-500 text-sm">تاريخ الأرشفة</p>
                          <p className="text-xl font-bold text-slate-200">{selectedStudentForFinance.archivedAt || 'غير مسجل'}</p>
                      </div>
                  </div>

                  <h4 className="font-bold border-b border-slate-700 pb-2 mb-4 text-slate-200 flex items-center gap-2">
                      <DollarSign size={18} className="text-emerald-500"/> سجل الدفعات والوصلات السابقة
                  </h4>
                  
                  {getStudentPayments(selectedStudentForFinance).length > 0 ? (
                      <div className="space-y-3">
                          {getStudentPayments(selectedStudentForFinance).map(p => (
                              <div key={p.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-lg border border-slate-800 hover:border-slate-700 transition-all">
                                  <div>
                                      <p className="font-bold text-slate-300">{p.reason}</p>
                                      <p className="text-xs text-slate-500">{p.date} - {p.branch}</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <span className="font-bold text-emerald-400">{p.amount} JOD</span>
                                      <button onClick={()=>printReceipt(p, p.branch)} className="text-slate-600 hover:text-slate-300" title="طباعة نسخة"><Printer size={16}/></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-8 bg-slate-950 rounded border border-slate-800 border-dashed">
                          <p className="text-slate-600">لا يوجد سجلات مالية مؤرشفة لهذا الطالب</p>
                      </div>
                  )}
                  
                  <div className="mt-6 flex justify-end pt-4 border-t border-slate-800">
                      <Button onClick={() => setSelectedStudentForFinance(null)} className="bg-slate-800 text-slate-300 hover:bg-slate-700">إغلاق الملف</Button>
                  </div>
              </Card>
          </div>
      )}

      {/* Main Archive View */}
      <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
          <h2 className="text-2xl font-black text-slate-200 flex items-center gap-2"><Archive className="text-red-500"/> أرشيف الطلاب</h2>
          <div className="w-64">
              <input 
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 rounded-xl shadow-sm outline-none focus:border-red-500 placeholder-slate-600" 
                  placeholder="بحث في الأرشيف..." 
                  value={searchTerm}
                  onChange={e=>setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      <Card noPadding className="bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
          {filteredArchive.length === 0 ? (
              <div className="text-center py-16">
                  <Archive size={48} className="mx-auto text-slate-700 mb-2"/>
                  <p className="text-slate-500">الأرشيف فارغ حالياً</p>
              </div>
          ) : (
              <table className="w-full text-right text-sm">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                      <tr>
                          <th className="p-4">اسم الطالب</th>
                          <th className="p-4">الهاتف</th>
                          <th className="p-4">تاريخ الأرشفة</th>
                          <th className="p-4">الذمم المالية</th>
                          <th className="p-4">إجراءات</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900">
                      {filteredArchive.map(s => (
                          <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                              <td className="p-4 font-bold text-slate-200">{s.name} <br/><span className="text-xs font-normal text-slate-500">{s.belt}</span></td>
                              <td className="p-4">
                                  <div className="flex items-center gap-2 text-slate-400 font-mono">
                                      <a href={`tel:${s.phone}`} className="hover:text-blue-400">{s.phone}</a>
                                      <button onClick={() => openWhatsApp(s.phone)} className="text-green-600 hover:text-green-400"><MessageCircle size={16}/></button>
                                  </div>
                              </td>
                              <td className="p-4 text-slate-500 font-mono text-xs">{s.archivedAt}</td>
                              <td className="p-4">
                                  {Number(s.balance) > 0 ? (
                                      <span className="bg-red-900/20 text-red-400 border border-red-500/20 px-3 py-1 rounded-full font-bold text-xs">
                                          عليه {s.balance} JOD
                                      </span>
                                  ) : (
                                      <span className="bg-emerald-900/20 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 w-fit">
                                          <CheckCircle size={12}/> مدفوع
                                      </span>
                                  )}
                              </td>
                              <td className="p-4 flex gap-2">
                                  {/* ✅ زر عرض التفاصيل الجديد */}
                                  <button 
                                      onClick={() => setSelectedStudentForDetails(s)} 
                                      className="bg-slate-800 text-slate-400 p-2 rounded hover:bg-slate-700 hover:text-white border border-slate-700" 
                                      title="عرض كافة المعلومات"
                                  >
                                      <Eye size={16}/>
                                  </button>

                                  <Button 
                                      variant="outline" 
                                      className="py-1 px-3 text-xs border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-white"
                                      onClick={() => setSelectedStudentForFinance(s)}
                                  >
                                      <FileText size={14} className="ml-1"/> الملف المالي
                                  </Button>
                                  <button 
                                      onClick={() => restoreStudent(s)} 
                                      className="bg-blue-900/20 text-blue-500 p-2 rounded hover:bg-blue-600 hover:text-white border border-blue-500/20" 
                                      title="إعادة تفعيل الطالب (استرجاع)"
                                  >
                                      <ArrowRight size={16}/>
                                  </button>
                                  <button 
                                      onClick={async () => { if(window.confirm('حذف نهائي من السجلات؟ لا يمكن التراجع!')) await archiveCollection.remove(s.id); }} 
                                      className="bg-red-900/20 text-red-500 p-2 rounded hover:bg-red-600 hover:text-white border border-red-500/20" 
                                      title="حذف نهائي"
                                  >
                                      <Trash2 size={16}/>
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          )}
      </Card>
    </div>
  );
};

export default ArchiveManager;
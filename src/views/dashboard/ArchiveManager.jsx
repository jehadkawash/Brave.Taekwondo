// src/views/dashboard/ArchiveManager.js
import React, { useState } from 'react';
import { Archive, DollarSign, Printer, MessageCircle, CheckCircle, FileText, ArrowRight, Trash2 } from 'lucide-react';
// We assume your UI components are here based on your folder structure
import { Card, Button } from '../../components/UIComponents'; 

const ArchiveManager = ({ archiveCollection, studentsCollection, payments, logActivity }) => {
  const [selectedStudentForFinance, setSelectedStudentForFinance] = useState(null); 
  const [searchTerm, setSearchTerm] = useState('');

  // Filter archive by search
  const filteredArchive = archiveCollection.data.filter(s => s.name.includes(searchTerm));

  // Function to restore student
  const restoreStudent = async (archivedStudent) => {
      if(!window.confirm(`هل تريد إعادة تفعيل اشتراك الطالب ${archivedStudent.name}؟`)) return;
      
      // 1. Add back to active students
      const { archivedAt, originalId, id, ...studentData } = archivedStudent;
      await studentsCollection.add({
          ...studentData,
          status: 'active',
          joinDate: new Date().toISOString().split('T')[0]
      });

      // 2. Remove from archive
      await archiveCollection.remove(archivedStudent.id);
      logActivity("استعادة", `تمت استعادة الطالب ${archivedStudent.name} من الأرشيف`);
  };

  // Helper to print receipt
  const printReceipt = (payment, branch) => {
      // (You can copy your print logic here or import it if it's a shared helper)
      alert("Print functionality for: " + payment.id); 
  };

  // Helper for WhatsApp
  const openWhatsApp = (phone) => {
      if (!phone) return;
      let cleanPhone = phone.replace(/\D/g, ''); 
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
      window.open(`https://wa.me/962${cleanPhone}`, '_blank');
  };

  // Get past payments
  const getStudentPayments = (student) => {
      const targetId = student.originalId || student.id; 
      return payments.filter(p => 
          p.studentId === targetId || 
          (p.studentIds && p.studentIds.includes(targetId))
      );
  };

  return (
    <div className="space-y-6">
      {/* Modal: Financial File */}
      {selectedStudentForFinance && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-sm">
              <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto" title={`الملف المالي: ${selectedStudentForFinance.name}`}>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div className={`p-4 rounded-xl border-2 text-center ${selectedStudentForFinance.balance > 0 ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                          <p className="text-gray-600 text-sm">الرصيد المتبقي (ذمم)</p>
                          <p className={`text-2xl font-bold ${selectedStudentForFinance.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {selectedStudentForFinance.balance} JOD
                          </p>
                      </div>
                      <div className="p-4 rounded-xl border bg-gray-50 text-center">
                          <p className="text-gray-600 text-sm">تاريخ الأرشفة</p>
                          <p className="text-xl font-bold">{selectedStudentForFinance.archivedAt || 'غير مسجل'}</p>
                      </div>
                  </div>

                  <h4 className="font-bold border-b pb-2 mb-4 text-gray-800 flex items-center gap-2">
                      <DollarSign size={18} className="text-green-600"/> سجل الدفعات والوصلات السابقة
                  </h4>
                  
                  {getStudentPayments(selectedStudentForFinance).length > 0 ? (
                      <div className="space-y-3">
                          {getStudentPayments(selectedStudentForFinance).map(p => (
                              <div key={p.id} className="flex justify-between items-center bg-white p-3 rounded-lg border hover:shadow-sm">
                                  <div>
                                      <p className="font-bold text-gray-800">{p.reason}</p>
                                      <p className="text-xs text-gray-500">{p.date} - {p.branch}</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                      <span className="font-bold text-green-600">{p.amount} JOD</span>
                                      <button onClick={()=>printReceipt(p, p.branch)} className="text-gray-400 hover:text-black" title="طباعة نسخة"><Printer size={16}/></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-8 bg-gray-50 rounded border-2 border-dashed">
                          <p className="text-gray-400">لا يوجد سجلات مالية مؤرشفة لهذا الطالب</p>
                      </div>
                  )}
                  
                  <div className="mt-6 flex justify-end">
                      <Button onClick={() => setSelectedStudentForFinance(null)}>إغلاق الملف</Button>
                  </div>
              </Card>
          </div>
      )}

      {/* Main Archive View */}
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Archive className="text-red-500"/> أرشيف الطلاب</h2>
          <div className="w-64">
              <input 
                  className="w-full border p-2 rounded shadow-sm" 
                  placeholder="بحث في الأرشيف..." 
                  value={searchTerm}
                  onChange={e=>setSearchTerm(e.target.value)}
              />
          </div>
      </div>

      <Card noPadding>
          {filteredArchive.length === 0 ? (
              <div className="text-center py-12">
                  <Archive size={48} className="mx-auto text-gray-300 mb-2"/>
                  <p className="text-gray-500">الأرشيف فارغ حالياً</p>
              </div>
          ) : (
              <table className="w-full text-right text-sm">
                  <thead className="bg-gray-100 text-gray-600">
                      <tr>
                          <th className="p-4">اسم الطالب</th>
                          <th className="p-4">الهاتف</th>
                          <th className="p-4">تاريخ الأرشفة</th>
                          <th className="p-4">الذمم المالية</th>
                          <th className="p-4">إجراءات</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y">
                      {filteredArchive.map(s => (
                          <tr key={s.id} className="hover:bg-gray-50 transition">
                              <td className="p-4 font-bold text-gray-800">{s.name} <br/><span className="text-xs font-normal text-gray-500">{s.belt}</span></td>
                              <td className="p-4">
                                  <div className="flex items-center gap-2">
                                      <a href={`tel:${s.phone}`} className="hover:text-blue-600">{s.phone}</a>
                                      <button onClick={() => openWhatsApp(s.phone)} className="text-green-500 hover:bg-green-100 p-1 rounded-full"><MessageCircle size={16}/></button>
                                  </div>
                              </td>
                              <td className="p-4 text-gray-600">{s.archivedAt}</td>
                              <td className="p-4">
                                  {Number(s.balance) > 0 ? (
                                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-xs">
                                          عليه {s.balance} JOD
                                      </span>
                                  ) : (
                                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 w-fit">
                                          <CheckCircle size={12}/> خالص
                                      </span>
                                  )}
                              </td>
                              <td className="p-4 flex gap-2">
                                  <Button 
                                      variant="outline" 
                                      className="py-1 px-3 text-xs border-gray-300 hover:bg-gray-100 text-gray-700"
                                      onClick={() => setSelectedStudentForFinance(s)}
                                  >
                                      <FileText size={14} className="ml-1"/> الملف المالي
                                  </Button>
                                  <button 
                                      onClick={() => restoreStudent(s)} 
                                      className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100 border border-blue-200" 
                                      title="إعادة تفعيل الطالب (استرجاع)"
                                  >
                                      <ArrowRight size={16}/>
                                  </button>
                                  <button 
                                      onClick={async () => { if(window.confirm('حذف نهائي من السجلات؟ لا يمكن التراجع!')) await archiveCollection.remove(s.id); }} 
                                      className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100 border border-red-200" 
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
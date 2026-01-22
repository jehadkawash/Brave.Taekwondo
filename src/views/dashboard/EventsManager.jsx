// src/views/dashboard/EventsManager.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calendar, Plus, Trash2, Printer, Search, 
  CheckCircle, X, MessageCircle, Image as ImageIcon, Zap, User, 
  Download, DollarSign 
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../../lib/constants';
import html2canvas from 'html2canvas';

const EventsManager = ({ students, logActivity }) => {
  // --- States ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false); 
  const [cardData, setCardData] = useState(null); 
  const [isCreating, setIsCreating] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(false); 
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Create Form
  const [newEvent, setNewEvent] = useState({ 
      title: '', date: '', time: '', defaultPrice: '0', customMessage: '' 
  });
  
  // Add Participant Form
  const [addMode, setAddMode] = useState('existing');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [externalName, setExternalName] = useState('');
  const [externalPhone, setExternalPhone] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  
  // سعر الطالب الفردي
  const [participantPrice, setParticipantPrice] = useState('');

  useEffect(() => {
      if (selectedEvent) {
          setParticipantPrice(selectedEvent.defaultPrice || '0');
      }
  }, [selectedEvent]);

  // Fetch Events
  const { data: events } = useCollection('events');

  // --- Helpers ---
  const sortedEvents = useMemo(() => {
    return (events || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [events]);

  const filteredStudents = useMemo(() => {
    if (!students) return [];
    return students.filter(s => 
      s.name.includes(searchTerm) && 
      !selectedEvent?.participants?.some(p => p.studentId === s.id)
    );
  }, [students, searchTerm, selectedEvent]);

  // Stats
  const stats = useMemo(() => {
      if (!selectedEvent?.participants) return { total: 0, attended: 0, paidCount: 0, totalAmount: 0 };
      return {
          total: selectedEvent.participants.length,
          attended: selectedEvent.participants.filter(p => p.attended).length,
          paidCount: selectedEvent.participants.filter(p => p.paid).length,
          totalAmount: selectedEvent.participants.reduce((sum, p) => sum + (Number(p.amountPaid) || 0), 0)
      };
  }, [selectedEvent]);

  // --- Handlers ---

  // 1. Create Event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title) return alert("يجب كتابة اسم الفعالية");
    
    setIsCreating(true);
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'events'), {
        ...newEvent,
        participants: [],
        createdAt: new Date().toISOString()
      });
      setShowCreateModal(false);
      setNewEvent({ title: '', date: '', time: '', defaultPrice: '0', customMessage: '' });
      alert("تم إنشاء الفعالية بنجاح");
    } catch (err) { 
      alert("حدث خطأ: " + err.message);
    } finally {
      setIsCreating(false);
    }
  };

  // 2. Delete Event
  const handleDeleteEvent = async (id) => {
    if (!confirm("حذف هذه الفعالية نهائياً؟")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'events', id));
      if (selectedEvent?.id === id) setSelectedEvent(null);
    } catch (err) { console.error(err); }
  };

  // 3. Add Participant
  const handleAddParticipant = async () => {
    if (!selectedEvent) return;
    let newParticipant = null;
    const specificPrice = Number(participantPrice) || 0;

    if (addMode === 'existing') {
        if (!selectedStudentId) return alert("اختر طالباً");
        const student = students.find(s => s.id === selectedStudentId);
        newParticipant = {
            id: Date.now().toString(),
            studentId: student.id,
            name: student.name,
            phone: student.phone || '', 
            type: 'student',
            paid: false,
            requiredAmount: specificPrice,
            amountPaid: 0,
            attended: false,
            result: '-', 
            notes: ''
        };
    } else {
        if (!externalName) return alert("اكتب الاسم");
        newParticipant = {
            id: Date.now().toString(),
            name: externalName,
            phone: externalPhone || '', 
            type: 'external',
            paid: false,
            requiredAmount: specificPrice,
            amountPaid: 0,
            attended: false,
            result: '-',
            notes: ''
        };
    }

    try {
        const eventRef = doc(db, 'artifacts', appId, 'public', 'data', 'events', selectedEvent.id);
        const updatedParticipants = [...(selectedEvent.participants || []), newParticipant];
        await updateDoc(eventRef, { participants: updatedParticipants });
        setSelectedEvent({ ...selectedEvent, participants: updatedParticipants });
        
        setExternalName('');
        setExternalPhone('');
        setSelectedStudentId('');
        setSearchTerm('');
        setParticipantPrice(selectedEvent.defaultPrice || '0'); 
    } catch (err) { console.error(err); }
  };

  // 4. Update Participant
  const handleUpdateParticipant = async (participantId, field, value) => {
      const updatedParticipants = selectedEvent.participants.map(p => {
          if (p.id !== participantId) return p;
          let updates = { [field]: value };
          if (field === 'paid') {
              updates.amountPaid = value ? (Number(p.requiredAmount) || Number(selectedEvent.defaultPrice) || 0) : 0;
          }
          if (field === 'amountPaid') {
              updates.paid = Number(value) > 0;
          }
          return { ...p, ...updates };
      });

      setSelectedEvent({ ...selectedEvent, participants: updatedParticipants });
      try {
          const eventRef = doc(db, 'artifacts', appId, 'public', 'data', 'events', selectedEvent.id);
          await updateDoc(eventRef, { participants: updatedParticipants });
      } catch (err) { console.error(err); }
  };

  // 5. Remove Participant
  const handleRemoveParticipant = async (participant) => {
      if(!confirm("حذف الاسم؟")) return;
      const updatedParticipants = selectedEvent.participants.filter(p => p.id !== participant.id);
      setSelectedEvent({ ...selectedEvent, participants: updatedParticipants });
      try {
          const eventRef = doc(db, 'artifacts', appId, 'public', 'data', 'events', selectedEvent.id);
          await updateDoc(eventRef, { participants: updatedParticipants });
      } catch (err) { console.error(err); }
  };

  // 6. WhatsApp
  const sendWhatsApp = (participant) => {
      const student = students?.find(s => s.id === participant.studentId);
      let phone = student?.phone || participant.phone || '';
      
      if (!phone) {
          phone = prompt("أدخل رقم الهاتف:");
          if (!phone) return;
      }

      let cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('07')) cleanPhone = '962' + cleanPhone.substring(1);

      const siblings = selectedEvent.participants.filter(p => {
          const sPhone = students?.find(st => st.id === p.studentId)?.phone || p.phone;
          return sPhone && sPhone.replace(/\D/g, '') === cleanPhone;
      });

      const names = siblings.length > 0 ? siblings.map(s => s.name).join(' و ') : participant.name;
      const totalDue = siblings.reduce((acc, curr) => acc + (Number(curr.requiredAmount) || 0), 0);

      const message = `*أكاديمية الشجاع للتايكواندو* 🥋\n\nتحية طيبة،\nنود تذكيركم بفعالية: *${selectedEvent.title}*\nللمشاركة: *${names}*\n\n📅 التاريخ: ${selectedEvent.date || '-'}\n⏰ الساعة: ${selectedEvent.time || '-'}\n💰 المبلغ المطلوب: ${totalDue} دينار\n\n📝 ملاحظات: ${selectedEvent.customMessage || 'لا يوجد'}\n\nيرجى تأكيد الحضور.`;
      
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // 7. Card Generator
  const openCardGenerator = (participant) => {
      const student = students?.find(s => s.id === participant.studentId);
      let phone = student?.phone || participant.phone;
      let namesString = participant.name;
      
      if (phone) {
          const cleanP = phone.replace(/\D/g, '');
          const siblings = selectedEvent.participants.filter(p => {
              const sPhone = students?.find(st => st.id === p.studentId)?.phone || p.phone;
              return sPhone && sPhone.replace(/\D/g, '') === cleanP;
          });
          if (siblings.length > 0) {
              namesString = siblings.map(s => s.name).join(' و ');
          }
      }

      setCardData({
          name: namesString,
          eventTitle: selectedEvent.title,
          date: selectedEvent.date,
          time: selectedEvent.time,
          note: selectedEvent.customMessage
      });
      setShowCardModal(true);
  };

  // 8. Download Image
  const handleDownloadImage = async () => {
      const element = document.getElementById('invite-card-content');
      if (!element) return;
      try {
          const canvas = await html2canvas(element, { scale: 2, backgroundColor: null, useCORS: true });
          const image = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = image;
          link.download = `invite_${selectedEvent.title}.png`;
          link.click();
      } catch (err) { alert("حدث خطأ أثناء حفظ الصورة"); }
  };

  // 9. Print
  const handlePrint = () => { window.print(); };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
      
      {/* --- Sidebar --- */}
      <div className={`md:w-1/3 w-full bg-[#111] border border-white/10 rounded-3xl p-4 flex flex-col ${selectedEvent ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2"><Calendar className="text-yellow-500"/> الفعاليات</h2>
            <button onClick={() => setShowCreateModal(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-xl transition-colors"><Plus size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {sortedEvents.map(event => (
                <div key={event.id} onClick={() => { setSelectedEvent(event); setIsLiveMode(false); }} className={`p-4 rounded-2xl cursor-pointer border transition-all hover:bg-white/5 relative group ${selectedEvent?.id === event.id ? 'bg-white/10 border-yellow-500' : 'bg-white/5 border-transparent'}`}>
                    <h3 className="font-bold text-white text-lg">{event.title}</h3>
                    <div className="flex gap-3 text-sm text-gray-400 mt-1">
                        {event.date && <span>📅 {event.date}</span>}
                        {event.defaultPrice && Number(event.defaultPrice) > 0 && <span className="text-green-400">💰 {event.defaultPrice} JD</span>}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }} className="absolute top-4 left-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={18}/></button>
                </div>
            ))}
        </div>
      </div>

      {/* --- Main Area --- */}
      <div className={`md:w-2/3 w-full bg-[#111] border border-white/10 rounded-3xl flex flex-col ${selectedEvent ? 'flex' : 'hidden md:hidden'} overflow-hidden`}>
        {selectedEvent ? (
            <>
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#151515]">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <button onClick={() => setSelectedEvent(null)} className="md:hidden text-gray-400 mb-2 flex items-center gap-1 text-xs">رجوع</button>
                            <h2 className="text-3xl font-black text-white">{selectedEvent.title}</h2>
                            <p className="text-yellow-500 font-bold mt-1 text-sm">{selectedEvent.date} | {selectedEvent.time}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handlePrint} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10"><Printer size={20}/></button>
                            <button onClick={() => setIsLiveMode(!isLiveMode)} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${isLiveMode ? 'bg-red-500 text-white border-red-500' : 'bg-black text-gray-300 border-gray-700'}`}><Zap size={18}/> {isLiveMode ? 'إيقاف Live' : 'Live Mode'}</button>
                        </div>
                    </div>
                    {!isLiveMode && (
                        <div className="grid grid-cols-4 gap-4 text-xs font-bold text-gray-400 bg-black/30 p-3 rounded-xl border border-white/5">
                            <div className="flex flex-col items-center"><span className="text-white text-lg">{stats.total}</span><span>المسجلين</span></div>
                            <div className="flex flex-col items-center"><span className="text-green-400 text-lg">{stats.attended}</span><span>الحضور</span></div>
                            <div className="flex flex-col items-center"><span className="text-yellow-400 text-lg">{stats.paidCount}</span><span>دفعوا</span></div>
                            <div className="flex flex-col items-center"><span className="text-blue-400 text-lg">{stats.totalAmount} JD</span><span>المجموع</span></div>
                        </div>
                    )}
                </div>

                {isLiveMode ? (
                    <div className="flex-1 overflow-y-auto p-4 bg-black">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {selectedEvent.participants?.map(p => (
                                <button key={p.id} onClick={() => handleUpdateParticipant(p.id, 'attended', !p.attended)} className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all active:scale-95 ${p.attended ? 'bg-green-600 border-green-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>
                                    <span className="text-lg font-black text-center">{p.name}</span>
                                    {p.attended ? <CheckCircle size={32}/> : <div className="w-8 h-8 rounded-full border-2 border-gray-600"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Add Form */}
                        <div className="p-4 bg-white/5 border-b border-white/10">
                            <div className="flex gap-2 mb-3">
                                <button onClick={() => setAddMode('existing')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${addMode === 'existing' ? 'bg-yellow-500 text-black' : 'bg-black text-gray-400'}`}>طالب</button>
                                <button onClick={() => setAddMode('external')} className={`flex-1 py-2 rounded-lg text-sm font-bold ${addMode === 'external' ? 'bg-yellow-500 text-black' : 'bg-black text-gray-400'}`}>زائر</button>
                            </div>
                            <div className="flex gap-2 items-center">
                                {addMode === 'existing' ? (
                                    <div className="flex-[2] relative">
                                        <input className="w-full bg-black border border-white/20 text-white rounded-xl py-3 px-3 text-sm outline-none focus:border-yellow-500" placeholder="ابحث عن الطالب..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
                                        {searchTerm && (
                                            <div className="absolute top-full right-0 w-full bg-gray-900 border border-white/10 rounded-xl mt-1 max-h-40 overflow-y-auto z-20 shadow-xl">
                                                {filteredStudents.map(s => (
                                                    <div key={s.id} onClick={() => { setSelectedStudentId(s.id); setSearchTerm(s.name); }} className="p-3 hover:bg-white/10 cursor-pointer text-white border-b border-white/5">{s.name}</div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <input className="flex-[2] bg-black border border-white/20 text-white rounded-xl p-3 text-sm outline-none" placeholder="الاسم..." value={externalName} onChange={e => setExternalName(e.target.value)}/>
                                        <input className="flex-1 bg-black border border-white/20 text-white rounded-xl p-3 text-sm outline-none" placeholder="رقم الهاتف..." value={externalPhone} onChange={e => setExternalPhone(e.target.value)}/>
                                    </>
                                )}
                                <div className="flex-1 relative">
                                    <input type="number" className="w-full bg-black border border-white/20 text-white rounded-xl p-3 pl-8 text-sm outline-none font-bold text-center focus:border-yellow-500" placeholder="السعر" value={participantPrice} onChange={e => setParticipantPrice(e.target.value)}/>
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">JD</span>
                                </div>
                                <button onClick={handleAddParticipant} className="bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-xl font-bold"><Plus/></button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="grid grid-cols-12 gap-2 p-3 bg-white/5 text-gray-400 font-bold text-xs border-b border-white/10 text-center items-center">
                            <div className="col-span-3 text-right pr-2">الاسم</div>
                            <div className="col-span-2">المبلغ (JD)</div>
                            <div className="col-span-1">الحضور</div>
                            <div className="col-span-2">النتيجة</div>
                            <div className="col-span-2">إجراءات</div>
                            <div className="col-span-2">حذف</div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            {selectedEvent.participants?.map((p, idx) => (
                                <div key={p.id || idx} className="grid grid-cols-12 gap-2 items-center p-3 mb-2 bg-white/5 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors">
                                    <div className="col-span-3 text-white font-bold text-sm truncate pr-2">{p.name}</div>
                                    <div className="col-span-2 flex items-center gap-1 justify-center">
                                        <input type="checkbox" checked={p.paid} onChange={(e) => handleUpdateParticipant(p.id, 'paid', e.target.checked)} className="w-4 h-4 accent-green-500"/>
                                        <input type="number" className={`w-16 bg-black border border-white/10 rounded p-1 text-center text-xs outline-none ${p.paid ? 'text-green-400 font-bold' : 'text-gray-500'}`} value={p.amountPaid} onChange={(e) => handleUpdateParticipant(p.id, 'amountPaid', e.target.value)}/>
                                    </div>
                                    <div className="col-span-1 flex justify-center"><input type="checkbox" checked={p.attended} onChange={(e) => handleUpdateParticipant(p.id, 'attended', e.target.checked)} className="w-4 h-4 accent-yellow-500"/></div>
                                    <div className="col-span-2">
                                        <select value={p.result || '-'} onChange={(e) => handleUpdateParticipant(p.id, 'result', e.target.value)} className="w-full bg-black text-white text-[10px] p-1 rounded border border-white/10 outline-none">
                                            <option value="-">-</option><option value="ناجح">✅ ناجح</option><option value="راسب">❌ راسب</option><option value="ذهبية">🥇 ذهبية</option><option value="فضية">🥈 فضية</option><option value="برونزية">🥉 برونزية</option>
                                        </select>
                                    </div>
                                    <div className="col-span-2 flex justify-center gap-2">
                                        <button onClick={() => sendWhatsApp(p)} className="p-1.5 bg-green-500/10 text-green-500 rounded-lg"><MessageCircle size={16}/></button>
                                        <button onClick={() => openCardGenerator(p)} className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded-lg"><ImageIcon size={16}/></button>
                                    </div>
                                    <div className="col-span-2 flex justify-center"><button onClick={() => handleRemoveParticipant(p)} className="text-red-500 p-1.5 rounded-lg"><X size={16}/></button></div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500"><Calendar size={64} className="opacity-20 mb-4"/><p>اختر فعالية للبدء</p></div>
        )}
      </div>

      {/* --- Create Modal --- */}
      <AnimatePresence>
        {showCreateModal && (
            <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-4">إنشاء فعالية</h3>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                        <input required className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="اسم الفعالية"/>
                        <div className="flex gap-2">
                            <input type="date" className="flex-1 bg-black border border-white/20 p-3 rounded-xl text-white outline-none" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}/>
                            <input type="time" className="flex-1 bg-black border border-white/20 p-3 rounded-xl text-white outline-none" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">السعر الافتراضي (JD)</label>
                            <input type="number" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none" value={newEvent.defaultPrice} onChange={e => setNewEvent({...newEvent, defaultPrice: e.target.value})}/>
                        </div>
                        <textarea className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none h-20 text-sm" placeholder="ملاحظات للبطاقة والواتساب..." value={newEvent.customMessage} onChange={e => setNewEvent({...newEvent, customMessage: e.target.value})}/>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300">إلغاء</button>
                            <button type="submit" disabled={isCreating} className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold">{isCreating ? 'جاري...' : 'إنشاء'}</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Card Modal (Revised Design White/Gold) --- */}
      <AnimatePresence>
        {showCardModal && cardData && (
            <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 backdrop-blur-md">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative bg-white w-full max-w-sm overflow-hidden shadow-2xl rounded-xl">
                    <button onClick={() => setShowCardModal(false)} className="absolute top-2 right-2 z-10 bg-black/50 text-white p-1 rounded-full"><X size={20}/></button>
                    
                    {/* منطقة التصميم - أبيض وذهبي */}
                    <div id="invite-card-content" className="relative w-full aspect-[4/5] bg-white flex flex-col items-center justify-center p-6 border-8 border-[#d4af37]">
                        
                        <div className="relative z-10 w-full text-center">
                            {/* الشعار بدون دائرة */}
                            <div className="w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                                <img src={IMAGES.LOGO} className="w-full h-full object-contain" alt="Logo"/>
                            </div>
                            
                            <h2 className="text-[#d4af37] text-sm font-bold tracking-[0.4em] mb-4 uppercase">دعوة خاصة</h2>
                            
                            <div className="bg-[#d4af37] text-white text-xl font-black py-2 px-4 w-full mb-6 shadow-md rounded">
                                <span className="block leading-tight">{cardData.name}</span>
                            </div>

                            <h1 className="text-black text-3xl font-black mb-2">{cardData.eventTitle}</h1>
                            
                            <div className="flex justify-center gap-4 text-gray-600 text-sm mb-6 border-t border-b border-gray-200 py-3 mt-4">
                                <div className="font-bold">📅 {cardData.date || '---'}</div>
                                <div className="w-px bg-gray-300"></div>
                                <div className="font-bold">⏰ {cardData.time || '---'}</div>
                            </div>

                            {cardData.note && (
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <p className="text-[#d4af37] text-xs font-bold mb-1">ملاحظة هامة:</p>
                                    <p className="text-gray-800 text-xs font-bold">{cardData.note}</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="absolute bottom-4 text-[10px] text-gray-400 tracking-widest uppercase font-bold">Brave Taekwondo Academy</div>
                    </div>

                    <div className="bg-[#111] p-4">
                        <button onClick={handleDownloadImage} className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors">
                            <Download size={20}/> حفظ الصورة
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Print Styles (Fixed - White Only) --- */}
      <style>{`
          @media print {
            body { background: white !important; color: black !important; }
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { position: absolute; left: 0; top: 0; width: 100%; height: auto; background: white !important; z-index: 9999; padding: 20px; color: black !important; }
            .print-area table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .print-area th, .print-area td { border: 1px solid #000; padding: 8px; text-align: center; color: black !important; }
            .print-area th { background-color: #f0f0f0 !important; font-weight: bold; }
          }
      `}</style>

      {/* --- Print Layout --- */}
      {selectedEvent && (
          <div className="print-area hidden">
              <div className="text-center mb-8 border-b-2 border-black pb-4">
                  <h1 className="text-4xl font-black mb-2 text-black">أكاديمية الشجاع للتايكواندو</h1>
                  <h2 className="text-2xl font-bold text-black">كشف فعالية: {selectedEvent.title}</h2>
                  <div className="flex justify-center gap-6 mt-4 text-lg text-black">
                      <p>التاريخ: {selectedEvent.date || '-'}</p>
                      <p>الوقت: {selectedEvent.time || '-'}</p>
                  </div>
              </div>
              <table>
                  <thead><tr><th style={{width: '5%'}}>#</th><th style={{width: '30%'}}>الاسم</th><th style={{width: '10%'}}>الصفة</th><th style={{width: '10%'}}>المبلغ</th><th style={{width: '10%'}}>الدفع</th><th style={{width: '10%'}}>الحضور</th><th style={{width: '25%'}}>ملاحظات</th></tr></thead>
                  <tbody>
                      {selectedEvent.participants?.map((p, i) => (
                          <tr key={i}><td>{i + 1}</td><td style={{textAlign: 'right', fontWeight: 'bold'}}>{p.name}</td><td>{p.type === 'student' ? 'طالب' : 'زائر'}</td><td>{p.amountPaid}</td><td>{p.paid ? '✅' : ''}</td><td>{p.attended ? '✅' : ''}</td><td>{p.notes}</td></tr>
                      ))}
                  </tbody>
              </table>
              <div className="mt-8 flex justify-between text-sm font-bold text-black">
                  <p>العدد الكلي: {stats.total}</p>
                  <p>مجموع المبالغ: {stats.totalAmount} JD</p>
                  <p>التوقيع: .........................</p>
              </div>
          </div>
      )}
    </div>
  );
};

export default EventsManager;
// src/views/dashboard/EventsManager.jsx
import React, { useState, useMemo } from 'react';
import { 
  Calendar, Plus, Trash2, Printer, Search, 
  CheckCircle, X, MessageCircle, Image as ImageIcon, Zap, Download, User
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';
import { motion, AnimatePresence } from 'framer-motion';
import { IMAGES } from '../../lib/constants';

const EventsManager = ({ students, logActivity }) => {
  // --- States ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false); 
  const [cardData, setCardData] = useState(null); 
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', customMessage: '' });
  
  // ✅ حالة التحميل الجديدة (لمنع التعليق)
  const [isCreating, setIsCreating] = useState(false);

  // Modes
  const [isLiveMode, setIsLiveMode] = useState(false); 
  
  // Participant Form States
  const [addMode, setAddMode] = useState('existing');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [externalName, setExternalName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  // --- Handlers ---

  // 1. Create Event (Updated with Loading & Error Handling)
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!newEvent.title) return alert("يجب كتابة اسم الفعالية");
    
    setIsCreating(true); // ✅ تشغيل التحميل
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'events'), {
        ...newEvent,
        participants: [],
        createdAt: new Date().toISOString()
      });
      setShowCreateModal(false);
      setNewEvent({ title: '', date: '', time: '', customMessage: '' });
      alert("تم إنشاء الفعالية بنجاح");
    } catch (err) { 
      console.error("Error creating event:", err);
      alert("حدث خطأ أثناء الإنشاء: " + err.message); // ✅ عرض رسالة الخطأ
    } finally {
      setIsCreating(false); // ✅ إيقاف التحميل في كل الحالات
    }
  };

  // 2. Delete Event
  const handleDeleteEvent = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الفعالية؟")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'events', id));
      if (selectedEvent?.id === id) setSelectedEvent(null);
    } catch (err) { console.error(err); }
  };

  // 3. Add Participant
  const handleAddParticipant = async () => {
    if (!selectedEvent) return;
    let newParticipant = null;

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
            attended: false,
            result: '-', 
            notes: ''
        };
    } else {
        if (!externalName) return alert("اكتب الاسم");
        newParticipant = {
            id: Date.now().toString(),
            name: externalName,
            phone: '',
            type: 'external',
            paid: false,
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
        setSelectedStudentId('');
        setSearchTerm('');
    } catch (err) { console.error(err); }
  };

  // 4. Update Participant
  const handleUpdateParticipant = async (participantId, field, value) => {
      const updatedParticipants = selectedEvent.participants.map(p => 
          p.id === participantId ? { ...p, [field]: value } : p
      );
      setSelectedEvent({ ...selectedEvent, participants: updatedParticipants });
      try {
          const eventRef = doc(db, 'artifacts', appId, 'public', 'data', 'events', selectedEvent.id);
          await updateDoc(eventRef, { participants: updatedParticipants });
      } catch (err) { console.error(err); }
  };

  // 5. Remove Participant
  const handleRemoveParticipant = async (participant) => {
      if(!confirm("حذف هذا الاسم من القائمة؟")) return;
      const updatedParticipants = selectedEvent.participants.filter(p => p.id !== participant.id);
      setSelectedEvent({ ...selectedEvent, participants: updatedParticipants });
      try {
          const eventRef = doc(db, 'artifacts', appId, 'public', 'data', 'events', selectedEvent.id);
          await updateDoc(eventRef, { participants: updatedParticipants });
      } catch (err) { console.error(err); }
  };

  // 6. WhatsApp Smart Sender
  const sendWhatsApp = (participant) => {
      const student = students?.find(s => s.id === participant.studentId);
      let phone = student?.phone || participant.phone || '';
      
      if (!phone) {
          phone = prompt("لا يوجد رقم هاتف مسجل. الرجاء إدخال الرقم (مع مفتاح الدولة):");
          if (!phone) return;
      }

      let cleanPhone = phone.replace(/\D/g, '');
      if (cleanPhone.startsWith('07')) cleanPhone = '962' + cleanPhone.substring(1);
      
      const message = `*أكاديمية الشجاع للتايكواندو* 🥋\n\nمرحباً ${participant.name}،\nنود تذكيركم بفعالية: *${selectedEvent.title}*\n📅 التاريخ: ${selectedEvent.date || '-'}\n⏰ الساعة: ${selectedEvent.time || '-'}\n\n📝 ملاحظات: ${selectedEvent.customMessage || 'لا يوجد'}\n\nيرجى تأكيد الحضور.`;
      
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // 7. Open Card Modal
  const openCardGenerator = (participant) => {
      setCardData({
          name: participant.name,
          eventTitle: selectedEvent.title,
          date: selectedEvent.date,
          time: selectedEvent.time,
          location: 'أكاديمية الشجاع'
      });
      setShowCardModal(true);
  };

  // 8. Stats
  const stats = useMemo(() => {
      if (!selectedEvent?.participants) return { total: 0, attended: 0, paid: 0 };
      return {
          total: selectedEvent.participants.length,
          attended: selectedEvent.participants.filter(p => p.attended).length,
          paid: selectedEvent.participants.filter(p => p.paid).length
      };
  }, [selectedEvent]);

  // 9. Print
  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
      
      {/* --- Sidebar: Events List --- */}
      <div className={`md:w-1/3 w-full bg-[#111] border border-white/10 rounded-3xl p-4 flex flex-col ${selectedEvent ? 'hidden md:flex' : 'flex'}`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2"><Calendar className="text-yellow-500"/> الفعاليات</h2>
            <button onClick={() => setShowCreateModal(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-xl transition-colors">
                <Plus size={20}/>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {sortedEvents.map(event => (
                <div 
                    key={event.id}
                    onClick={() => { setSelectedEvent(event); setIsLiveMode(false); }}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all hover:bg-white/5 relative group
                        ${selectedEvent?.id === event.id ? 'bg-white/10 border-yellow-500' : 'bg-white/5 border-transparent'}
                    `}
                >
                    <h3 className="font-bold text-white text-lg">{event.title}</h3>
                    <div className="flex gap-3 text-sm text-gray-400 mt-1">
                        {event.date && <span>📅 {event.date}</span>}
                        {event.time && <span>⏰ {event.time}</span>}
                    </div>
                    {event.customMessage && <p className="text-xs text-gray-500 mt-1 truncate">📝 {event.customMessage}</p>}
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                        className="absolute top-4 left-4 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={18}/>
                    </button>
                </div>
            ))}
            {sortedEvents.length === 0 && <p className="text-gray-500 text-center mt-10">لا يوجد فعاليات، أضف واحدة!</p>}
        </div>
      </div>

      {/* --- Main Area: Event Details --- */}
      <div className={`md:w-2/3 w-full bg-[#111] border border-white/10 rounded-3xl flex flex-col ${selectedEvent ? 'flex' : 'hidden md:hidden'} overflow-hidden`}>
        {selectedEvent ? (
            <>
                {/* Header & Controls */}
                <div className="p-6 border-b border-white/10 bg-[#151515]">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <button onClick={() => setSelectedEvent(null)} className="md:hidden text-gray-400 mb-2 flex items-center gap-1 text-xs">رجوع للقائمة</button>
                            <h2 className="text-3xl font-black text-white">{selectedEvent.title}</h2>
                            <p className="text-yellow-500 font-bold mt-1 text-sm">
                                {selectedEvent.date || 'بدون تاريخ'} {selectedEvent.time && `| ${selectedEvent.time}`}
                            </p>
                        </div>
                        
                        <div className="flex gap-2">
                            <button onClick={handlePrint} className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10" title="طباعة">
                                <Printer size={20}/>
                            </button>
                            <button 
                                onClick={() => setIsLiveMode(!isLiveMode)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all border ${isLiveMode ? 'bg-red-500 text-white border-red-500 animate-pulse' : 'bg-black text-gray-300 border-gray-700 hover:border-white'}`}
                            >
                                <Zap size={18}/> {isLiveMode ? 'إيقاف Live' : 'وضع الحضور'}
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {!isLiveMode && (
                        <div className="flex gap-4 text-xs font-bold text-gray-400 bg-black/30 p-3 rounded-xl border border-white/5">
                            <div className="flex items-center gap-2"><User size={14}/> العدد: <span className="text-white">{stats.total}</span></div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-green-500"/> الحضور: <span className="text-green-400">{stats.attended}</span></div>
                            <div className="flex items-center gap-2"><CheckCircle size={14} className="text-yellow-500"/> الدفع: <span className="text-yellow-400">{stats.paid}</span></div>
                        </div>
                    )}
                </div>

                {/* --- LIVE MODE VIEW --- */}
                {isLiveMode ? (
                    <div className="flex-1 overflow-y-auto p-4 bg-black">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {selectedEvent.participants?.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => handleUpdateParticipant(p.id, 'attended', !p.attended)}
                                    className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all transform active:scale-95
                                        ${p.attended 
                                            ? 'bg-green-600 border-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)]' 
                                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600'}`}
                                >
                                    <span className="text-lg font-black text-center leading-tight">{p.name}</span>
                                    {p.attended ? <CheckCircle size={32} className="text-white"/> : <div className="w-8 h-8 rounded-full border-2 border-gray-600"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* --- NORMAL MODE: Add & List --- */}
                        <div className="p-4 bg-white/5 border-b border-white/10">
                            <div className="flex gap-2 mb-3">
                                <button onClick={() => setAddMode('existing')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${addMode === 'existing' ? 'bg-yellow-500 text-black' : 'bg-black text-gray-400'}`}>طالب</button>
                                <button onClick={() => setAddMode('external')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${addMode === 'external' ? 'bg-yellow-500 text-black' : 'bg-black text-gray-400'}`}>زائر خارجي</button>
                            </div>
                            
                            <div className="flex gap-2">
                                {addMode === 'existing' ? (
                                    <div className="flex-1 relative">
                                        <input 
                                            className="w-full bg-black border border-white/20 text-white rounded-xl py-3 px-3 text-sm focus:border-yellow-500 outline-none"
                                            placeholder="ابحث عن الطالب..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                        />
                                        {searchTerm && (
                                            <div className="absolute top-full right-0 w-full bg-gray-900 border border-white/10 rounded-xl mt-1 max-h-40 overflow-y-auto z-20 shadow-xl">
                                                {filteredStudents.map(s => (
                                                    <div 
                                                        key={s.id} 
                                                        onClick={() => { setSelectedStudentId(s.id); setSearchTerm(s.name); }}
                                                        className="p-3 hover:bg-white/10 cursor-pointer text-white border-b border-white/5"
                                                    >
                                                        {s.name}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <input 
                                        className="flex-1 bg-black border border-white/20 text-white rounded-xl p-3 text-sm focus:border-yellow-500 outline-none"
                                        placeholder="اسم الزائر..."
                                        value={externalName}
                                        onChange={e => setExternalName(e.target.value)}
                                    />
                                )}
                                <button onClick={handleAddParticipant} className="bg-green-600 hover:bg-green-500 text-white px-4 rounded-xl font-bold">
                                    <Plus/>
                                </button>
                            </div>
                        </div>

                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-2 p-3 bg-white/5 text-gray-400 font-bold text-xs border-b border-white/10 text-center">
                            <div className="col-span-3 text-right pr-2">الاسم</div>
                            <div className="col-span-1">الدفع</div>
                            <div className="col-span-1">الحضور</div>
                            <div className="col-span-2">النتيجة</div>
                            <div className="col-span-3">تواصل / بطاقة</div>
                            <div className="col-span-2">حذف</div>
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                            {selectedEvent.participants?.map((p, idx) => (
                                <div key={p.id || idx} className="grid grid-cols-12 gap-2 items-center p-3 mb-2 bg-white/5 rounded-xl border border-white/5 hover:border-yellow-500/30 transition-colors">
                                    <div className="col-span-3 text-white font-bold text-sm truncate pr-2">{p.name}</div>
                                    
                                    <div className="col-span-1 flex justify-center">
                                        <input type="checkbox" checked={p.paid} onChange={(e) => handleUpdateParticipant(p.id, 'paid', e.target.checked)} className="w-4 h-4 accent-green-500 cursor-pointer"/>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <input type="checkbox" checked={p.attended} onChange={(e) => handleUpdateParticipant(p.id, 'attended', e.target.checked)} className="w-4 h-4 accent-yellow-500 cursor-pointer"/>
                                    </div>
                                    
                                    <div className="col-span-2">
                                        <select 
                                            value={p.result || '-'} 
                                            onChange={(e) => handleUpdateParticipant(p.id, 'result', e.target.value)}
                                            className="w-full bg-black text-white text-[10px] p-1 rounded border border-white/10 outline-none"
                                        >
                                            <option value="-">-</option>
                                            <option value="ناجح">✅ ناجح</option>
                                            <option value="راسب">❌ راسب</option>
                                            <option value="ذهبية">🥇 ذهبية</option>
                                            <option value="فضية">🥈 فضية</option>
                                            <option value="برونزية">🥉 برونزية</option>
                                        </select>
                                    </div>

                                    <div className="col-span-3 flex justify-center gap-2">
                                        <button onClick={() => sendWhatsApp(p)} className="p-1.5 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors" title="واتساب">
                                            <MessageCircle size={16}/>
                                        </button>
                                        <button onClick={() => openCardGenerator(p)} className="p-1.5 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black rounded-lg transition-colors" title="بطاقة دعوة">
                                            <ImageIcon size={16}/>
                                        </button>
                                    </div>

                                    <div className="col-span-2 flex justify-center">
                                        <button onClick={() => handleRemoveParticipant(p)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg">
                                            <X size={16}/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Calendar size={64} className="opacity-20 mb-4"/>
                <p>اختر فعالية للبدء</p>
            </div>
        )}
      </div>

      {/* --- Modal: Create Event --- */}
      <AnimatePresence>
        {showCreateModal && (
            <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-md p-6 shadow-2xl"
                >
                    <h3 className="text-xl font-bold text-white mb-4">إنشاء فعالية جديدة</h3>
                    <form onSubmit={handleCreateEvent} className="space-y-4">
                        <input required className="w-full bg-black border border-white/20 p-3 rounded-xl text-white focus:border-yellow-500 outline-none" 
                            value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} placeholder="اسم الفعالية (مثال: فحص أحزمة)"/>
                        
                        <div className="flex gap-2">
                            <input type="date" className="flex-1 bg-black border border-white/20 p-3 rounded-xl text-white focus:border-yellow-500 outline-none" 
                                value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}/>
                            <input type="time" className="flex-1 bg-black border border-white/20 p-3 rounded-xl text-white focus:border-yellow-500 outline-none" 
                                value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})}/>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">ملاحظة عامة (تظهر في الواتساب)</label>
                            <textarea 
                                className="w-full bg-black border border-white/20 p-3 rounded-xl text-white focus:border-yellow-500 outline-none text-sm h-20"
                                placeholder="مثال: يرجى إحضار الهوية.. التجمع عند الدوار.."
                                value={newEvent.customMessage}
                                onChange={e => setNewEvent({...newEvent, customMessage: e.target.value})}
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 font-bold">إلغاء</button>
                            <button type="submit" disabled={isCreating} className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400 disabled:opacity-50">
                                {isCreating ? 'جاري الإنشاء...' : 'إنشاء'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Modal: Invitation Card Generator --- */}
      <AnimatePresence>
        {showCardModal && cardData && (
            <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 backdrop-blur-md">
                <motion.div 
                    initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                    className="relative bg-white rounded-none w-full max-w-sm overflow-hidden shadow-2xl"
                >
                    <button onClick={() => setShowCardModal(false)} className="absolute top-2 right-2 z-10 bg-black/50 text-white p-1 rounded-full"><X size={20}/></button>
                    
                    {/* Card Canvas Area (HTML representation for now) */}
                    <div id="invite-card" className="relative w-full aspect-square bg-black text-center flex flex-col justify-center items-center p-8 border-8 border-yellow-500/50">
                        {/* Background Effect */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800 via-black to-black opacity-80"></div>
                        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")'}}></div>
                        
                        <div className="relative z-10 w-full">
                            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center p-1">
                                <img src={IMAGES.LOGO} className="w-full h-full object-contain" alt="Logo"/>
                            </div>
                            <h2 className="text-yellow-500 text-xs font-bold tracking-[0.3em] mb-2 uppercase">Invitation</h2>
                            <h1 className="text-white text-3xl font-black mb-1">{cardData.eventTitle}</h1>
                            <p className="text-gray-400 text-xs mb-6">يسرنا دعوة البطل</p>
                            
                            <div className="bg-yellow-500 text-black text-2xl font-black py-2 px-6 transform -skew-x-12 inline-block mb-6 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                                <span className="block transform skew-x-12">{cardData.name}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-white text-sm border-t border-white/20 pt-4">
                                <div>
                                    <p className="text-gray-500 text-[10px]">التاريخ</p>
                                    <p className="font-bold">{cardData.date || '---'}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-[10px]">الوقت</p>
                                    <p className="font-bold">{cardData.time || '---'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111] p-4 flex gap-3">
                        <button onClick={() => alert("يرجى التقاط لقطة شاشة (Screenshot) للصورة لمشاركتها.")} className="flex-1 bg-yellow-500 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                            <Download size={18}/> حفظ الصورة
                        </button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Print Styles --- */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { 
                position: absolute; left: 0; top: 0; width: 100%; 
                background: white !important; color: black !important; 
                direction: rtl; padding: 20px;
            }
            .no-print { display: none !important; }
          }
        `}
      </style>

      {/* --- Print Layout --- */}
      {selectedEvent && (
          <div className="print-area hidden bg-white text-black p-8">
              <div className="text-center mb-8 border-b-2 border-black pb-4">
                  <h1 className="text-4xl font-black mb-2">أكاديمية الشجاع للتايكواندو</h1>
                  <h2 className="text-2xl font-bold">كشف مشاركين: {selectedEvent.title}</h2>
                  <p className="text-lg mt-2">
                      التاريخ: {selectedEvent.date || '-'} | الوقت: {selectedEvent.time || '-'}
                  </p>
              </div>
              <table className="w-full text-right border-collapse border border-black">
                  <thead>
                      <tr className="bg-gray-200">
                          <th className="border border-black p-2 text-center w-10">#</th>
                          <th className="border border-black p-2">الاسم</th>
                          <th className="border border-black p-2 text-center">الصفة</th>
                          <th className="border border-black p-2 text-center">الدفع</th>
                          <th className="border border-black p-2 text-center">الحضور</th>
                          <th className="border border-black p-2">ملاحظات</th>
                      </tr>
                  </thead>
                  <tbody>
                      {selectedEvent.participants?.map((p, i) => (
                          <tr key={i}>
                              <td className="border border-black p-2 text-center">{i + 1}</td>
                              <td className="border border-black p-2 font-bold">{p.name}</td>
                              <td className="border border-black p-2 text-center text-sm">{p.type === 'student' ? 'طالب' : 'زائر'}</td>
                              <td className="border border-black p-2 text-center">{p.paid ? '✅' : '❌'}</td>
                              <td className="border border-black p-2 text-center">{p.attended ? '✅' : '❌'}</td>
                              <td className="border border-black p-2 text-sm">{p.notes}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
              <div className="mt-8 flex justify-between text-sm font-bold">
                  <p>العدد الكلي: {selectedEvent.participants?.length}</p>
                  <p>توقيع المسؤول: .........................</p>
              </div>
          </div>
      )}

    </div>
  );
};

export default EventsManager;
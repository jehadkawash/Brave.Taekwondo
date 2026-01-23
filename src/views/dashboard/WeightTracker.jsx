// src/views/dashboard/WeightTracker.jsx
import React, { useState, useMemo } from 'react';
import { 
  Scale, Ruler, Activity, Plus, Search, Trash2, 
  ArrowUp, ArrowDown, Minus, ChevronRight, UserPlus, 
  Printer, Settings, Users, Filter, Briefcase, X, CheckCircle
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';
import { motion, AnimatePresence } from 'framer-motion';

const WeightTracker = ({ students, logActivity }) => {
  // --- States ---
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [activeTeam, setActiveTeam] = useState('All');

  // Forms
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkSearch, setBulkSearch] = useState('');
  const [selectedBulkIds, setSelectedBulkIds] = useState([]);
  const [targetTeamName, setTargetTeamName] = useState('فريق البطولة');

  const [newMeasure, setNewMeasure] = useState({ 
      date: new Date().toISOString().split('T')[0], 
      weight: '', 
      height: '', 
      note: '' 
  });

  const [targetSettings, setTargetSettings] = useState({ targetWeight: '', targetClass: '', team: '' });

  // Fetch Trackers
  const { data: trackers } = useCollection('fitness_tracking');

  // --- Helpers ---
  
  const distinctTeams = useMemo(() => {
      if (!trackers) return ['فريق البطولة'];
      const teams = trackers.map(t => t.team || 'عام');
      return ['All', ...new Set(teams)];
  }, [trackers]);

  // ✅ دالة ذكية لاستخراج سنة الميلاد (Fix)
  const getBirthYear = (tracker) => {
      // 1. محاولة جلبه من سجل المراقبة المحفوظ
      let dateVal = tracker.birthDate;

      // 2. إذا لم يوجد، ابحث عنه في قائمة الطلاب الرئيسية
      if (!dateVal && students) {
          const student = students.find(s => s.id === tracker.studentId);
          if (student) {
              // جرب كل الاحتمالات الشائعة لتسمية الحقل
              dateVal = student.birthDate || student.dob || student.dateOfBirth;
          }
      }

      if (!dateVal) return '---';

      try {
          const d = new Date(dateVal);
          if (!isNaN(d.getFullYear())) return d.getFullYear();
          // محاولة استخراج السنة من نص (مثلاً 2015-05-20)
          return dateVal.substring(0, 4); 
      } catch (e) { return '---'; }
  };

  const availableStudents = useMemo(() => {
      if (!students) return [];
      const trackedIds = trackers?.map(t => t.studentId) || [];
      return students.filter(s => !trackedIds.includes(s.id));
  }, [students, trackers]);

  const filteredTrackers = useMemo(() => {
      if (!trackers) return [];
      let filtered = trackers;
      if (activeTeam !== 'All') {
          filtered = filtered.filter(t => (t.team || 'عام') === activeTeam);
      }
      if (searchTerm) {
          filtered = filtered.filter(t => t.name.includes(searchTerm));
      }
      return filtered;
  }, [trackers, searchTerm, activeTeam]);

  const bulkList = useMemo(() => {
      return availableStudents.filter(s => s.name.includes(bulkSearch));
  }, [availableStudents, bulkSearch]);

  const calculateStats = (current, previous) => {
      let diff = 0;
      let trend = 'stable'; 
      
      if (previous) {
          diff = (Number(current.weight) - Number(previous.weight)).toFixed(1);
          if (diff > 0) trend = 'up';
          if (diff < 0) trend = 'down';
      }

      let bmi = null;
      if (current.height && current.weight) {
          const h = Number(current.height) / 100;
          bmi = (Number(current.weight) / (h * h)).toFixed(1);
      }

      return { diff, trend, bmi };
  };

  // --- Handlers ---

  // 1. Bulk Add (Updated to save correct birthDate)
  const handleBulkAdd = async () => {
      if (selectedBulkIds.length === 0) return;
      
      const batchPromises = selectedBulkIds.map(id => {
          const student = students.find(s => s.id === id);
          // ✅ حفظ تاريخ الميلاد الصحيح أياً كان اسمه
          const bDate = student.birthDate || student.dob || student.dateOfBirth || '';
          
          return addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking'), {
              studentId: student.id,
              name: student.name,
              belt: student.belt,
              birthDate: bDate, // Save it here
              team: targetTeamName, 
              records: [],
              targetWeight: '', 
              targetClass: '', 
              lastUpdated: new Date().toISOString()
          });
      });

      try {
          await Promise.all(batchPromises);
          setShowBulkAddModal(false);
          setSelectedBulkIds([]);
          setBulkSearch('');
          alert(`تم إضافة اللاعبين إلى ${targetTeamName}`);
      } catch (err) { console.error(err); }
  };

  // 2. Add Measure
  const handleAddMeasurement = async (e) => {
      e.preventDefault();
      if (!newMeasure.weight || !newMeasure.date) return alert("الوزن والتاريخ مطلوبان");

      const record = {
          id: Date.now().toString(),
          date: newMeasure.date,
          weight: Number(newMeasure.weight),
          height: newMeasure.height ? Number(newMeasure.height) : null,
          note: newMeasure.note || ''
      };

      try {
          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedTracker.id);
          const updatedRecords = [...(selectedTracker.records || []), record].sort((a,b) => new Date(b.date) - new Date(a.date));
          
          await updateDoc(docRef, { 
              records: updatedRecords,
              lastUpdated: new Date().toISOString()
          });
          
          setSelectedTracker({ ...selectedTracker, records: updatedRecords });
          setShowMeasureModal(false);
          setNewMeasure({ date: new Date().toISOString().split('T')[0], weight: '', height: '', note: '' });
      } catch (err) { console.error(err); }
  };

  // 3. Update Settings
  const handleUpdateSettings = async (e) => {
      e.preventDefault();
      try {
          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedTracker.id);
          await updateDoc(docRef, { 
              targetWeight: targetSettings.targetWeight,
              targetClass: targetSettings.targetClass,
              team: targetSettings.team
          });
          setSelectedTracker({ ...selectedTracker, ...targetSettings });
          setShowSettingsModal(false);
      } catch (err) { console.error(err); }
  };

  // 4. Delete Tracker
  const handleDeleteTracker = async (id) => {
      if(!confirm("إزالة اللاعب من قائمة المراقبة؟")) return;
      try {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', id));
          if(selectedTracker?.id === id) setSelectedTracker(null);
      } catch (err) { console.error(err); }
  };

  // 5. Delete Record
  const handleDeleteRecord = async (recordId) => {
      if(!confirm("حذف هذا القياس؟")) return;
      const updatedRecords = selectedTracker.records.filter(r => r.id !== recordId);
      setSelectedTracker({ ...selectedTracker, records: updatedRecords });
      try {
          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedTracker.id);
          await updateDoc(docRef, { records: updatedRecords });
      } catch (err) { console.error(err); }
  };

  const handlePrint = () => { window.print(); };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
      
      {/* --- Sidebar --- */}
      <div className={`md:w-1/3 w-full bg-[#111] border border-white/10 rounded-3xl p-4 flex flex-col ${selectedTracker ? 'hidden md:flex' : 'flex'}`}>
        
        {/* Header */}
        <div className="mb-4 space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-white flex items-center gap-2"><Scale className="text-yellow-500"/> المتابعة</h2>
                <div className="flex gap-2">
                    <button onClick={handlePrint} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl"><Printer size={20}/></button>
                    <button onClick={() => setShowBulkAddModal(true)} className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-xl font-bold flex items-center gap-1"><Users size={20}/></button>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {distinctTeams.map(team => (
                    <button 
                        key={team}
                        onClick={() => setActiveTeam(team)}
                        className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-bold transition-all border 
                            ${activeTeam === team 
                                ? 'bg-white text-black border-white' 
                                : 'bg-black text-gray-400 border-white/10 hover:border-white/30'}`}
                    >
                        {team === 'All' ? 'الكل' : team}
                    </button>
                ))}
            </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
            <input className="w-full bg-black border border-white/20 text-white rounded-xl py-2 pr-9 pl-3 text-sm outline-none focus:border-yellow-500" placeholder="بحث بالاسم..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {filteredTrackers.map(tracker => {
                const lastRecord = tracker.records?.[0];
                const prevRecord = tracker.records?.[1];
                const stats = lastRecord ? calculateStats(lastRecord, prevRecord) : null;
                const birthYear = getBirthYear(tracker); // ✅ استخدام الدالة المحدثة

                return (
                    <div key={tracker.id} onClick={() => setSelectedTracker(tracker)}
                        className={`p-4 rounded-2xl cursor-pointer border transition-all hover:bg-white/5 relative group
                            ${selectedTracker?.id === tracker.id ? 'bg-white/10 border-yellow-500' : 'bg-white/5 border-transparent'}
                        `}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-sm">{tracker.name}</h3>
                                    <span className="text-[10px] bg-white/10 text-gray-300 px-1.5 rounded">{birthYear}</span>
                                </div>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-[10px] text-blue-400 border border-blue-900 bg-blue-900/10 px-1 rounded">{tracker.team || 'عام'}</span>
                                    {tracker.targetClass && <span className="text-[10px] text-gray-500">هدف: {tracker.targetClass}</span>}
                                </div>
                            </div>
                            {lastRecord ? (
                                <div className="text-left">
                                    <p className="text-xl font-black text-white">{lastRecord.weight} <span className="text-[10px] text-gray-500">kg</span></p>
                                    {stats && stats.trend !== 'stable' && (
                                        <div className={`flex items-center justify-end text-[10px] font-bold ${stats.trend === 'up' ? 'text-red-400' : 'text-green-400'}`}>
                                            {stats.trend === 'up' ? <ArrowUp size={10}/> : <ArrowDown size={10}/>} {Math.abs(stats.diff)}
                                        </div>
                                    )}
                                </div>
                            ) : <span className="text-xs text-gray-600">--</span>}
                        </div>
                    </div>
                );
            })}
            {filteredTrackers.length === 0 && <p className="text-center text-gray-500 py-10">لا يوجد لاعبين</p>}
        </div>
      </div>

      {/* --- Main Area --- */}
      <div className={`md:w-2/3 w-full bg-[#111] border border-white/10 rounded-3xl flex flex-col ${selectedTracker ? 'flex' : 'hidden md:hidden'} overflow-hidden`}>
        {selectedTracker ? (
            <>
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#151515] flex justify-between items-start">
                    <div>
                        <button onClick={() => setSelectedTracker(null)} className="md:hidden text-gray-400 mb-2 flex items-center gap-1 text-xs">رجوع</button>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-white">{selectedTracker.name}</h2>
                            <span className="text-sm font-bold bg-yellow-500 text-black px-2 py-0.5 rounded">
                                مواليد {getBirthYear(selectedTracker)} {/* ✅ استخدام الدالة المحدثة */}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                            <span className="flex items-center gap-1 text-blue-400 font-bold bg-blue-900/20 px-2 rounded"><Briefcase size={12}/> {selectedTracker.team || 'عام'}</span>
                            
                            {selectedTracker.targetClass ? (
                                <span className="text-green-400 font-bold border border-green-500/30 px-2 rounded text-xs bg-green-900/10">الفئة: {selectedTracker.targetClass}</span>
                            ) : <span className="text-gray-600">لم تحدد الفئة</span>}

                            {selectedTracker.targetWeight && <span className="text-gray-300 text-xs">الهدف: {selectedTracker.targetWeight} kg</span>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => { setTargetSettings({ targetWeight: selectedTracker.targetWeight || '', targetClass: selectedTracker.targetClass || '', team: selectedTracker.team || '' }); setShowSettingsModal(true); }} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10"><Settings size={20}/></button>
                        <button onClick={() => setShowMeasureModal(true)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20"><Plus size={20}/> قياس</button>
                    </div>
                </div>

                {/* History */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    <h3 className="text-gray-500 text-xs font-bold mb-4 uppercase tracking-widest">سجل القياسات</h3>
                    {selectedTracker.records && selectedTracker.records.length > 0 ? (
                        <div className="space-y-3">
                            {selectedTracker.records.map((record, idx) => {
                                const prev = selectedTracker.records[idx + 1];
                                const stats = calculateStats(record, prev);

                                return (
                                    <div key={record.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group relative hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-black/40 px-3 py-2 rounded-lg text-center min-w-[60px]">
                                                <span className="block text-white font-bold text-sm">{record.date.split('-')[2]}/{record.date.split('-')[1]}</span>
                                                <span className="block text-gray-500 text-[10px]">{record.date.split('-')[0]}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl font-black text-white">{record.weight}</span>
                                                    <span className="text-xs text-gray-500">kg</span>
                                                    {stats.diff != 0 && (
                                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stats.trend === 'up' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                            {stats.diff > 0 ? '+' : ''}{stats.diff}
                                                        </span>
                                                    )}
                                                </div>
                                                {record.note && <p className="text-gray-400 text-xs mt-1">{record.note}</p>}
                                                {record.height && <p className="text-gray-600 text-[10px]">الطول: {record.height} cm</p>}
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteRecord(record.id)} className="text-red-500 opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={18}/></button>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-2xl">
                            <Activity size={40} className="opacity-20 mb-2"/>
                            <p>لا يوجد سجلات سابقة</p>
                        </div>
                    )}
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                <Scale size={64} className="opacity-20 mb-4"/>
                <p>اختر لاعباً من القائمة</p>
            </div>
        )}
      </div>

      {/* --- Bulk Add Modal --- */}
      <AnimatePresence>
        {showBulkAddModal && (
            <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-2xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><UserPlus className="text-yellow-500"/> إضافة لاعبين للمراقبة</h3>
                        <button onClick={() => setShowBulkAddModal(false)} className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10"><X size={20}/></button>
                    </div>
                    
                    <div className="p-4 bg-black/30 border-b border-white/10">
                        <label className="block text-xs font-bold text-gray-400 mb-1">تعيين إلى الفريق:</label>
                        <div className="relative">
                            <input 
                                className="w-full bg-black border border-white/20 text-white rounded-xl p-3 text-sm outline-none focus:border-yellow-500" 
                                placeholder="اكتب اسم الفريق (مثال: فريق السفر)..." 
                                value={targetTeamName} 
                                onChange={(e) => setTargetTeamName(e.target.value)}
                                list="teams-list"
                            />
                            <datalist id="teams-list">
                                {distinctTeams.filter(t => t !== 'All').map(t => <option key={t} value={t}/>)}
                            </datalist>
                        </div>
                    </div>

                    <div className="p-4 border-b border-white/10">
                        <input className="w-full bg-black border border-white/20 text-white rounded-xl py-3 px-3 text-sm outline-none focus:border-yellow-500" placeholder="ابحث بالاسم..." value={bulkSearch} onChange={(e) => setBulkSearch(e.target.value)}/>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {bulkList.map(s => {
                                const isSelected = selectedBulkIds.includes(s.id);
                                const bYear = s.birthDate || s.dob || s.dateOfBirth ? getBirthYear(s.birthDate || s.dob || s.dateOfBirth) : '---'; // تصحيح العرض هنا
                                return (
                                    <div key={s.id} onClick={() => isSelected ? setSelectedBulkIds(prev => prev.filter(id => id !== s.id)) : setSelectedBulkIds(prev => [...prev, s.id])}
                                        className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${isSelected ? 'bg-yellow-500/20 border-yellow-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'}`}>{isSelected && <CheckCircle size={14} className="text-black"/>}</div>
                                        <div><p className="text-white font-bold text-sm">{s.name}</p><p className="text-gray-400 text-xs">{bYear} - {s.belt}</p></div>
                                    </div>
                                );
                            })}
                            {bulkList.length === 0 && <p className="col-span-2 text-center text-gray-500 py-10">الكل مضاف أو لا توجد نتائج</p>}
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/10 bg-[#151515] flex justify-between items-center">
                        <span className="text-gray-400 text-sm">تم تحديد: <strong className="text-white">{selectedBulkIds.length}</strong></span>
                        <button onClick={handleBulkAdd} disabled={selectedBulkIds.length === 0} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold">إضافة إلى {targetTeamName}</button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Settings Modal --- */}
      <AnimatePresence>
        {showSettingsModal && (
            <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">إعدادات اللاعب</h3>
                    <form onSubmit={handleUpdateSettings} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">الفريق</label>
                            <input className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={targetSettings.team} onChange={e => setTargetSettings({...targetSettings, team: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">الوزن المستهدف (kg)</label>
                            <input type="number" step="0.1" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={targetSettings.targetWeight} onChange={e => setTargetSettings({...targetSettings, targetWeight: e.target.value})}/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">الفئة المستهدفة</label>
                            <input className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={targetSettings.targetClass} onChange={e => setTargetSettings({...targetSettings, targetClass: e.target.value})}/>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 font-bold">إلغاء</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400">حفظ</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Measure Modal --- */}
      <AnimatePresence>
        {showMeasureModal && (
            <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
                    <h3 className="text-xl font-bold text-white mb-6 text-center">قياس جديد</h3>
                    <form onSubmit={handleAddMeasurement} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">التاريخ</label>
                            <input type="date" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={newMeasure.date} onChange={e => setNewMeasure({...newMeasure, date: e.target.value})}/>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-400 mb-1">الوزن (kg) <span className="text-red-500">*</span></label>
                                <input type="number" step="0.1" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500 font-bold text-lg" value={newMeasure.weight} onChange={e => setNewMeasure({...newMeasure, weight: e.target.value})} autoFocus/>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-400 mb-1">الطول (cm)</label>
                                <input type="number" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={newMeasure.height} onChange={e => setNewMeasure({...newMeasure, height: e.target.value})}/>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-1">ملاحظات</label>
                            <textarea className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500 h-20 text-sm" value={newMeasure.note} onChange={e => setNewMeasure({...newMeasure, note: e.target.value})}/>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowMeasureModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 font-bold">إلغاء</button>
                            <button type="submit" className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400">حفظ</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Print Styles --- */}
      <style>{`
          @media print {
            body { background: white !important; color: black !important; }
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; height: auto; background: white !important; z-index: 9999; padding: 20px; color: black !important; }
            .print-area table { width: 100%; border-collapse: collapse; margin-top: 20px; direction: rtl; }
            .print-area th, .print-area td { border: 1px solid #000; padding: 8px; text-align: center; color: black !important; }
            .print-area th { background-color: #f0f0f0 !important; font-weight: bold; }
          }
      `}</style>

      {/* --- Print Layout --- */}
      <div className="print-area hidden">
          <div className="text-center mb-8 border-b-2 border-black pb-4">
              <h1 className="text-3xl font-black mb-2 text-black">أكاديمية الشجاع للتايكواندو</h1>
              <h2 className="text-xl font-bold text-black">
                  تقرير جاهزية الفريق {activeTeam !== 'All' ? `(${activeTeam})` : ''}
              </h2>
              <p className="text-sm mt-2">تاريخ التقرير: {new Date().toLocaleDateString('ar-JO')}</p>
          </div>
          <table>
              <thead>
                  <tr>
                      <th style={{width: '5%'}}>#</th>
                      <th style={{width: '25%'}}>الاسم</th>
                      <th style={{width: '10%'}}>الميلاد</th>
                      <th style={{width: '15%'}}>الفريق</th>
                      <th style={{width: '10%'}}>الوزن الحالي</th>
                      <th style={{width: '10%'}}>الوزن المطلوب</th>
                      <th style={{width: '15%'}}>الفئة</th>
                      <th style={{width: '10%'}}>الحالة</th>
                  </tr>
              </thead>
              <tbody>
                  {filteredTrackers.map((t, i) => {
                      const lastRec = t.records && t.records.length > 0 ? t.records[0] : null;
                      const currentW = lastRec ? Number(lastRec.weight) : 0;
                      const targetW = Number(t.targetWeight) || 0;
                      const diff = targetW > 0 ? (currentW - targetW).toFixed(1) : 0;
                      const status = targetW > 0 ? (diff > 0 ? `+${diff}` : (diff < 0 ? diff : '✅')) : '-';
                      
                      return (
                          <tr key={i}>
                              <td>{i + 1}</td>
                              <td style={{textAlign: 'right', fontWeight: 'bold'}}>{t.name}</td>
                              <td>{getBirthYear(t)}</td> {/* ✅ استخدام الدالة المحدثة للطباعة */}
                              <td>{t.team || 'عام'}</td>
                              <td>{currentW || '-'} kg</td>
                              <td>{targetW || '-'} kg</td>
                              <td>{t.targetClass || '-'}</td>
                              <td style={{direction: 'ltr', fontWeight: 'bold'}}>{status}</td>
                          </tr>
                      );
                  })}
              </tbody>
          </table>
          <div className="mt-8 flex justify-between text-sm font-bold text-black">
              <p>عدد اللاعبين: {filteredTrackers.length}</p>
              <p>توقيع المدرب: .........................</p>
          </div>
      </div>

    </div>
  );
};

export default WeightTracker;
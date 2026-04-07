import React, { useState, useMemo } from 'react';
import { 
  Scale, Plus, Search, Trash2, Edit2, ChevronRight, ChevronLeft, 
  Users, Printer, X, CheckCircle, PlusCircle, TrendingUp, Clock, 
  Calendar, ChevronDown, ArrowUpRight, ArrowDownRight, Activity
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeightTracker = ({ students }) => {
  // --- States ---
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTeam, setActiveTeam] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkSearch, setBulkSearch] = useState('');
  const [selectedBulkIds, setSelectedBulkIds] = useState([]);
  const [targetTeamName, setTargetTeamName] = useState(''); 
  const [editingRecord, setEditingRecord] = useState(null);
  const [printMode, setPrintMode] = useState(null);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  const [newMeasure, setNewMeasure] = useState({ 
      date: new Date().toISOString().split('T'), 
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      weight: '', height: '', note: '' 
  });

  // استدعاء البيانات - تأكد من اسم الكولكشن 'fitness_tracking'
  const { data: trackers } = useCollection('fitness_tracking');

  // ✅ الربط الصحيح والمضمون مع البيانات القديمة
  const combinedList = useMemo(() => {
      if (!students) return [];
      return students.map(student => {
          const tracker = trackers?.find(t => t.studentId === student.id);
          // نستخدم نفس مسمياتك القديمة بالضبط
          const records = tracker?.records || [];
          
          return {
              ...student,
              trackerId: tracker?.id || null, // مهم جداً للتحديث
              teams: tracker?.teams || (tracker?.team ? [tracker.team] : []),
              records: records,
              targetWeight: tracker?.targetWeight || '',
              targetClass: tracker?.targetClass || ''
          };
      });
  }, [students, trackers]);

  // استخراج الفرق للفلترة
  const allTeams = useMemo(() => {
      const teamsSet = new Set();
      trackers?.forEach(t => {
          if (t.teams && Array.isArray(t.teams)) t.teams.forEach(tm => teamsSet.add(tm));
          else if (t.team) teamsSet.add(t.team);
      });
      return Array.from(teamsSet);
  }, [trackers]);

  const filteredList = useMemo(() => {
      let filtered = combinedList;
      if (activeTeam !== 'الكل') filtered = filtered.filter(s => s.teams.includes(activeTeam));
      if (searchTerm) filtered = filtered.filter(s => s.name.includes(searchTerm));
      return filtered;
  }, [combinedList, searchTerm, activeTeam]);

  // ✅ دالة الحفظ المعدلة لتعمل مع الـ IDs القديمة والجديدة
  const handleSaveMeasurement = async (e) => {
      e.preventDefault();
      if (!newMeasure.weight) return;
      
      const recordData = { 
          id: editingRecord?.id || Date.now().toString(), 
          date: newMeasure.date, 
          time: newMeasure.time,
          weight: Number(newMeasure.weight), 
          height: newMeasure.height ? Number(newMeasure.height) : null, 
          note: newMeasure.note || '' 
      };

      try {
          if (selectedStudent.trackerId) {
              // طالب موجود مسبقاً -> تحديث
              const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedStudent.trackerId);
              let updatedRecords;
              if (editingRecord) {
                  updatedRecords = selectedStudent.records.map(r => r.id === editingRecord.id ? recordData : r);
              } else {
                  updatedRecords = [recordData, ...selectedStudent.records];
              }
              await updateDoc(docRef, { records: updatedRecords, lastUpdated: new Date().toISOString() });
          } else {
              // طالب جديد أول مرة -> إضافة وثيقة جديدة
              await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking'), {
                  studentId: selectedStudent.id,
                  name: selectedStudent.name,
                  belt: selectedStudent.belt || '',
                  teams: [],
                  records: [recordData],
                  targetWeight: '',
                  targetClass: '',
                  lastUpdated: new Date().toISOString()
              });
          }
          setShowMeasureModal(false);
          setEditingRecord(null);
          setNewMeasure({ date: new Date().toISOString().split('T'), time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), weight: '', height: '', note: '' });
      } catch (err) {
          console.error("Error saving:", err);
          alert("فشل في حفظ البيانات");
      }
  };

  return (
    <div className="h-screen flex bg-black text-right font-sans overflow-hidden" dir="rtl">
      
      {/* Sidebar */}
      <motion.div 
        animate={{ width: isSidebarOpen ? '350px' : '0px' }}
        className="bg-[#0f0f0f] border-l border-white/5 flex flex-col overflow-hidden relative"
      >
        <div className="p-6 space-y-4">
            <h2 className="text-2xl font-black text-white italic">الأبطال</h2>
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                <input className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pr-10 outline-none focus:border-yellow-500/50" placeholder="بحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {['الكل', ...allTeams].map(team => (
                    <button key={team} onClick={() => setActiveTeam(team)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${activeTeam === team ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400'}`}>{team}</button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-10 custom-scrollbar">
            {filteredList.map(s => (
                <div key={s.id} onClick={() => setSelectedStudent(s)} className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedStudent?.id === s.id ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white font-bold text-sm mb-1">{s.name}</p>
                            <p className="text-[10px] text-gray-500">{s.belt} • {s.branch}</p>
                        </div>
                        <div className="text-left font-black text-white text-lg">{s.records?.weight || '--'}</div>
                    </div>
                </div>
            ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-[#050505]">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-10 z-50 bg-yellow-500 text-black p-1 rounded-full shadow-lg">
            {isSidebarOpen ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>

        {selectedStudent ? (
            <>
                <div className="p-8 flex justify-between items-center border-b border-white/5">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">{selectedStudent.name}</h1>
                        <div className="flex gap-4 items-center">
                           <div className="flex gap-2">
                                {selectedStudent.teams.map(t => <span key={t} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">{t}</span>)}
                           </div>
                           {selectedStudent.records.length >= 2 && (
                               <div className={`flex items-center gap-1 text-sm font-black ${(selectedStudent.records.weight - selectedStudent.records.weight) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                   {(selectedStudent.records.weight - selectedStudent.records.weight) > 0 ? <ArrowUpRight size={16}/> : <ArrowDownRight size={16}/>}
                                   {Math.abs((selectedStudent.records.weight - selectedStudent.records.weight).toFixed(1))} kg
                               </div>
                           )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => handlePrint('individual')} className="bg-white/5 text-white px-5 py-3 rounded-xl border border-white/10 flex items-center gap-2 hover:bg-white/10"><Printer size={18}/> طباعة</button>
                        <button onClick={() => { setEditingRecord(null); setShowMeasureModal(true); }} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-transform"><Plus size={20}/> قياس جديد</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Chart */}
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[...selectedStudent.records].reverse()}>
                                <defs>
                                    <linearGradient id="colorW" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false}/>
                                <XAxis dataKey="date" hide />
                                <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                                <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}} />
                                <Area type="monotone" dataKey="weight" stroke="#eab308" strokeWidth={4} fill="url(#colorW)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* History */}
                    <div className="grid grid-cols-1 gap-3">
                        {selectedStudent.records.map((r) => (
                            <div key={r.id} className="group bg-white/5 p-5 rounded-2xl flex justify-between items-center hover:bg-white/10 border border-transparent hover:border-white/10 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="text-center bg-black px-4 py-2 rounded-xl min-w-[100px]">
                                        <p className="text-white font-black text-sm">{r.date}</p>
                                        <p className="text-[10px] text-yellow-500 font-mono">{r.time || '--:--'}</p>
                                    </div>
                                    <p className="text-2xl font-black text-white">{r.weight} <span className="text-[10px] text-gray-600">kg</span></p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingRecord(r); setNewMeasure({ weight: r.weight, height: r.height || '', date: r.date, time: r.time || '', note: r.note || '' }); setShowMeasureModal(true); }} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white"><Edit2 size={16}/></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <Scale size={100} />
                <p className="text-xl font-black mt-4 uppercase">اختر بطلاً للمراقبة</p>
            </div>
        )}
      </div>

      {/* Measure Modal */}
      <AnimatePresence>
        {showMeasureModal && (
            <div className="fixed inset-0 bg-black/90 z- flex items-center justify-center p-4">
                <motion.div initial={{scale: 0.95}} animate={{scale: 1}} className="bg-[#151515] border border-white/10 rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
                    <h3 className="text-xl font-black text-white mb-8 text-center">{editingRecord ? 'تعديل السجل' : 'تسجيل وزن جديد'}</h3>
                    <form onSubmit={handleSaveMeasurement} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase mr-2">الوزن (kg)</label>
                                <input type="number" step="0.1" className="w-full bg-black border border-white/10 p-5 rounded-xl text-white outline-none focus:border-yellow-500 text-2xl font-black text-center" value={newMeasure.weight} onChange={e => setNewMeasure({...newMeasure, weight: e.target.value})} autoFocus required/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase mr-2">الطول (cm)</label>
                                <input type="number" className="w-full bg-black border border-white/10 p-5 rounded-xl text-white outline-none focus:border-yellow-500 text-center" value={newMeasure.height} onChange={e => setNewMeasure({...newMeasure, height: e.target.value})}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs" value={newMeasure.date} onChange={e => setNewMeasure({...newMeasure, date: e.target.value})}/>
                            <input type="time" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs" value={newMeasure.time} onChange={e => setNewMeasure({...newMeasure, time: e.target.value})}/>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowMeasureModal(false)} className="flex-1 py-4 bg-white/5 text-gray-500 rounded-xl font-bold">إلغاء</button>
                            <button type="submit" className="flex-1 py-4 bg-yellow-500 text-black rounded-xl font-black shadow-lg">حفظ</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}

        {/* Bulk Add Modal */}
        {showBulkAddModal && (
            <div className="fixed inset-0 bg-black/95 z- flex items-center justify-center p-4 backdrop-blur-xl">
                <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-[#111] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-2xl font-black text-white italic">إدارة المجموعات</h3>
                        <button onClick={() => setShowBulkAddModal(false)} className="text-gray-500 hover:text-white"><X/></button>
                    </div>
                    <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto">
                        {/* Custom Dropdown الحل لمشكلة اللون */}
                        <div className="relative">
                            <div onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)} className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 flex justify-between items-center cursor-pointer">
                                {targetTeamName || "اختر مجموعة..."}
                                <ChevronDown size={18}/>
                            </div>
                            <AnimatePresence>
                                {isGroupDropdownOpen && (
                                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl z- shadow-2xl max-h-40 overflow-y-auto">
                                        {allTeams.map(t => (
                                            <div key={t} onClick={() => { setTargetTeamName(t); setIsGroupDropdownOpen(false); }} className="p-4 hover:bg-yellow-500 hover:text-black cursor-pointer text-white font-bold text-sm border-b border-white/5">
                                                {t}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <input className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 outline-none focus:border-yellow-500" placeholder="أو اكتب اسم مجموعة جديدة..." value={targetTeamName} onChange={e => setTargetTeamName(e.target.value)}/>
                        
                        <div className="grid grid-cols-2 gap-2">
                            {combinedList.filter(s => s.name.includes(bulkSearch)).map(s => (
                                <div key={s.id} onClick={() => setSelectedBulkIds(prev => prev.includes(s.id) ? prev.filter(i=>i!==s.id) : [...prev, s.id])} className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${selectedBulkIds.includes(s.id) ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-white'}`}>
                                    <span className="text-xs font-bold truncate">{s.name}</span>
                                    {selectedBulkIds.includes(s.id) ? <CheckCircle size={16}/> : <PlusCircle size={16} className="opacity-20"/>}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="p-8 border-t border-white/5 flex justify-end">
                        <button onClick={handleBulkUpdate} className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black shadow-lg">حفظ التغييرات</button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Print styles */}
      <style>{`
          @media print {
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; padding: 40px; background: white !important; color: black !important; }
            .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .print-table th, .print-table td { border: 1px solid #000; padding: 10px; text-align: center; }
          }
      `}</style>

      <div className="print-area hidden" dir="rtl">
          {selectedStudent && (
              <div>
                  <h1 className="text-3xl font-black text-center mb-8">تقرير متابعة الوزن - أكاديمية الشجاع</h1>
                  <div className="flex justify-between mb-10 border-b-2 border-black pb-4">
                      <p>اسم اللاعب: <strong>{selectedStudent.name}</strong></p>
                      <p>الحزام: <strong>{selectedStudent.belt}</strong></p>
                      <p>التاريخ: <strong>{new Date().toLocaleDateString('ar-JO')}</strong></p>
                  </div>
                  <table className="print-table">
                      <thead>
                          <tr><th>التاريخ</th><th>الساعة</th><th>الوزن (kg)</th><th>الطول (cm)</th><th>ملاحظات</th></tr>
                      </thead>
                      <tbody>
                          {selectedStudent.records.map(r => (
                              <tr key={r.id}><td>{r.date}</td><td>{r.time}</td><td>{r.weight}</td><td>{r.height || '--'}</td><td>{r.note || '--'}</td></tr>
                          ))}
                      </tbody>
                  </table>
                  <div className="mt-20 flex justify-between">
                      <p>توقيع المدرب: .......................</p>
                      <p>ختم الأكاديمية</p>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default WeightTracker;
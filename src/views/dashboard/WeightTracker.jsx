// src/views/dashboard/WeightTracker.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Scale, Plus, Search, Trash2, Edit2, ChevronRight, ChevronLeft, 
  Users, Printer, X, CheckCircle, PlusCircle, TrendingUp, Clock, Calendar
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeightTracker = ({ students, logActivity }) => {
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
  const [printMode, setPrintMode] = useState(null); // 'individual' or 'group'

  const [newMeasure, setNewMeasure] = useState({ 
      date: new Date().toISOString().split('T'), 
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      weight: '', height: '', note: '' 
  });

  const { data: trackers } = useCollection('fitness_tracking');

  const combinedList = useMemo(() => {
      if (!students) return [];
      return students.map(student => {
          const tracker = trackers?.find(t => t.studentId === student.id);
          return {
              ...student,
              trackerId: tracker?.id || null,
              teams: tracker?.teams || (tracker?.team ? [tracker.team] : []),
              records: tracker?.records?.sort((a,b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)) || [],
              targetWeight: tracker?.targetWeight || '',
          };
      });
  }, [students, trackers]);

  const allTeams = useMemo(() => {
      const teamsSet = new Set();
      trackers?.forEach(t => {
          if (t.teams) t.teams.forEach(tm => teamsSet.add(tm));
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

  // --- Functions ---
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
          let updatedRecords;
          if (editingRecord) {
              updatedRecords = selectedStudent.records.map(r => r.id === editingRecord.id ? recordData : r);
          } else {
              updatedRecords = [recordData, ...selectedStudent.records];
          }

          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedStudent.trackerId);
          await updateDoc(docRef, { records: updatedRecords, lastUpdated: new Date().toISOString() });
          
          setShowMeasureModal(false);
          setEditingRecord(null);
          setNewMeasure({ date: new Date().toISOString().split('T'), time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), weight: '', height: '', note: '' });
      } catch (err) { console.error(err); }
  };

  const handleBulkUpdate = async () => {
    if (selectedBulkIds.length === 0 || !targetTeamName) return;
    const promises = selectedBulkIds.map(async (id) => {
        const student = combinedList.find(s => s.id === id);
        if (student.trackerId) {
            return updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', student.trackerId), {
                teams: arrayUnion(targetTeamName)
            });
        } else {
            return addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking'), {
                studentId: student.id, name: student.name, belt: student.belt,
                teams: [targetTeamName], records: [], lastUpdated: new Date().toISOString()
            });
        }
    });
    await Promise.all(promises);
    setShowBulkAddModal(false);
    setSelectedBulkIds([]);
    setTargetTeamName('');
  };

  const openEdit = (record) => {
      setEditingRecord(record);
      setNewMeasure({ weight: record.weight, height: record.height || '', date: record.date, time: record.time, note: record.note });
      setShowMeasureModal(true);
  };

  return (
    <div className="h-screen flex bg-black text-right font-sans overflow-hidden" dir="rtl">
      
      {/* Sidebar */}
      <motion.div 
        animate={{ width: isSidebarOpen ? '350px' : '0px', opacity: isSidebarOpen ? 1 : 0 }}
        className="bg-[#0f0f0f] border-l border-white/5 flex flex-col overflow-hidden relative"
      >
        <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white italic">الأبطال</h2>
                <button onClick={() => setShowBulkAddModal(true)} className="p-2 bg-yellow-500 rounded-xl text-black hover:rotate-90 transition-transform"><Users size={20}/></button>
            </div>
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                <input className="w-full bg-white/5 border border-white/10 text-white rounded-xl py-3 pr-10 outline-none focus:border-yellow-500/50 text-sm" placeholder="بحث..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['الكل', ...allTeams].map(team => (
                    <button key={team} onClick={() => setActiveTeam(team)} className={`px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all ${activeTeam === team ? 'bg-white text-black' : 'bg-white/5 text-gray-400'}`}>{team}</button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-10">
            {filteredList.map(s => (
                <div key={s.id} onClick={() => setSelectedStudent(s)} className={`p-4 rounded-2xl cursor-pointer transition-all border ${selectedStudent?.id === s.id ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-white font-bold text-sm mb-1">{s.name}</p>
                            <p className="text-[10px] text-gray-500">{s.belt} • {s.teams || 'بدون مجموعة'}</p>
                        </div>
                        <div className="text-left font-black text-white text-lg">{s.records?.weight || '--'}</div>
                    </div>
                </div>
            ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-[#050505]">
        {/* Toggle Sidebar Button */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-3 top-1/2 z-50 bg-yellow-500 text-black p-1 rounded-full shadow-lg">
            {isSidebarOpen ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>

        {selectedStudent ? (
            <>
                <div className="p-8 flex justify-between items-center border-b border-white/5">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-2">{selectedStudent.name}</h1>
                        <div className="flex gap-2">
                            {selectedStudent.teams.map(t => <span key={t} className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">{t}</span>)}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        {activeTeam !== 'الكل' && (
                            <button onClick={() => { setPrintMode('group'); setTimeout(() => window.print(), 300); }} className="bg-white/5 text-white px-5 py-3 rounded-xl border border-white/10 flex items-center gap-2 hover:bg-white/10"><Users size={18}/> طباعة المجموعة</button>
                        )}
                        <button onClick={() => { setPrintMode('individual'); setTimeout(() => window.print(), 300); }} className="bg-white/5 text-white px-5 py-3 rounded-xl border border-white/10 flex items-center gap-2 hover:bg-white/10"><Printer size={18}/> تقرير فردي</button>
                        <button onClick={() => { setEditingRecord(null); setShowMeasureModal(true); }} className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:scale-105 transition-transform"><Plus size={20}/> قياس جديد</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Graph Section */}
                    <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 h-[400px] chart-container">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-bold text-gray-400 flex items-center gap-2"><TrendingUp className="text-yellow-500"/> مسار تطور الوزن</h3>
                            <div className="flex gap-4 text-[10px] text-gray-500 uppercase font-black">
                                <span>البداية: {selectedStudent.records[selectedStudent.records.length-1]?.weight || '--'} kg</span>
                                <span className="text-yellow-500">الحالي: {selectedStudent.records?.weight || '--'} kg</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[...selectedStudent.records].reverse().map(r => ({ name: r.date, weight: r.weight }))}>
                                <defs>
                                    <linearGradient id="colorW" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#111" vertical={false}/>
                                <XAxis dataKey="name" hide />
                                <YAxis domain={['dataMin - 2', 'dataMax + 2']} hide />
                                <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '12px'}} />
                                <Area type="monotone" dataKey="weight" stroke="#eab308" strokeWidth={4} fill="url(#colorW)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* History Table */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-500 px-2 flex items-center gap-2"><Clock size={16}/> سجل القياسات الزمني</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {selectedStudent.records.map((r) => (
                                <div key={r.id} className="group bg-white/5 p-5 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                                    <div className="flex items-center gap-6">
                                        <div className="text-center bg-black px-4 py-2 rounded-xl min-w-[100px]">
                                            <p className="text-white font-black text-sm">{r.date}</p>
                                            <p className="text-[10px] text-yellow-500 font-mono">{r.time}</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-black text-white">{r.weight} <span className="text-[10px] text-gray-600">kg</span></p>
                                            <p className="text-xs text-gray-500">{r.note || 'لا يوجد ملاحظات'}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(r)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white"><Edit2 size={16}/></button>
                                        <button className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                <Scale size={120} strokeWidth={1}/>
                <p className="text-2xl font-black mt-4 italic uppercase tracking-widest">Select an Athlete</p>
            </div>
        )}
      </div>

      {/* --- Modals (Simplified) --- */}
      <AnimatePresence>
        {showBulkAddModal && (
            <div className="fixed inset-0 bg-black/95 z- flex items-center justify-center p-4 backdrop-blur-xl">
                <motion.div initial={{y: 20}} animate={{y: 0}} className="bg-[#111] border border-white/10 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <h3 className="text-2xl font-black text-white">إدارة المجموعات</h3>
                        <button onClick={() => setShowBulkAddModal(false)} className="text-gray-500 hover:text-white"><X/></button>
                    </div>
                    <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-yellow-500 mr-2 uppercase">اسم المجموعة (جديدة أو موجودة)</label>
                                <select className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 outline-none focus:border-yellow-500 mb-2" value={targetTeamName} onChange={e => setTargetTeamName(e.target.value)}>
                                    <option value="">اختر مجموعة موجودة...</option>
                                    {allTeams.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <input className="w-full bg-white/5 border border-white/10 text-white rounded-xl p-4 outline-none focus:border-yellow-500" placeholder="أو اكتب اسم مجموعة جديدة..." value={targetTeamName} onChange={e => setTargetTeamName(e.target.value)}/>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                                <input className="w-full bg-black border border-white/10 text-white rounded-xl py-4 pr-12 outline-none" placeholder="بحث عن طلاب..." value={bulkSearch} onChange={e => setBulkSearch(e.target.value)}/>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {combinedList.filter(s => s.name.includes(bulkSearch)).map(s => (
                                    <div key={s.id} onClick={() => setSelectedBulkIds(prev => prev.includes(s.id) ? prev.filter(i=>i!==s.id) : [...prev, s.id])} className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${selectedBulkIds.includes(s.id) ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-white'}`}>
                                        <span className="text-xs font-bold truncate">{s.name}</span>
                                        {selectedBulkIds.includes(s.id) ? <CheckCircle size={16}/> : <PlusCircle size={16} className="opacity-20"/>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-8 border-t border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <span className="text-gray-500 text-sm font-bold">تحديد: {selectedBulkIds.length} طالب</span>
                        <button onClick={handleBulkUpdate} className="bg-yellow-500 text-black px-10 py-4 rounded-xl font-black shadow-lg shadow-yellow-500/10">تحديث المجموعة</button>
                    </div>
                </motion.div>
            </div>
        )}

        {showMeasureModal && (
            <div className="fixed inset-0 bg-black/90 z- flex items-center justify-center p-4">
                <motion.div initial={{scale: 0.95}} animate={{scale: 1}} className="bg-[#151515] border border-white/10 rounded-[2rem] w-full max-w-md p-8 shadow-2xl">
                    <h3 className="text-xl font-black text-white mb-8 text-center">{editingRecord ? 'تعديل القياس' : 'تسجيل وزن جديد'}</h3>
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
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 mr-2">التاريخ</label>
                                <input type="date" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs outline-none" value={newMeasure.date} onChange={e => setNewMeasure({...newMeasure, date: e.target.value})}/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 mr-2">الساعة</label>
                                <input type="time" className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-xs outline-none" value={newMeasure.time} onChange={e => setNewMeasure({...newMeasure, time: e.target.value})}/>
                            </div>
                        </div>
                        <input className="w-full bg-black border border-white/10 p-4 rounded-xl text-white text-sm outline-none" placeholder="ملاحظات (اختياري)..." value={newMeasure.note} onChange={e => setNewMeasure({...newMeasure, note: e.target.value})}/>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowMeasureModal(false)} className="flex-1 py-4 bg-white/5 text-gray-500 rounded-xl font-bold">إلغاء</button>
                            <button type="submit" className="flex-1 py-4 bg-yellow-500 text-black rounded-xl font-black shadow-lg">حفظ التغييرات</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Print Layouts --- */}
      <style>{`
          @media print {
            @page { size: A4; margin: 0; }
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; height: 100%; padding: 50px; background: white !important; color: black !important; }
            .chart-container { height: 300px !important; margin: 20px 0; border: 1px solid #eee; }
            .print-table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            .print-table th, .print-table td { border: 1px solid #000; padding: 12px; text-align: center; font-size: 14px; }
            .print-header { text-align: center; border-bottom: 4px double #000; padding-bottom: 20px; margin-bottom: 30px; }
            .stamp-box { border: 2px solid #000; padding: 10px; display: inline-block; transform: rotate(-10deg); color: #000; font-weight: bold; margin-top: 20px; }
          }
      `}</style>

      <div className="print-area hidden" dir="rtl">
          {printMode === 'individual' && selectedStudent && (
              <div className="w-full">
                  <div className="print-header">
                      <h1 className="text-4xl font-black">أكاديمية الشجاع للتايكواندو</h1>
                      <h3 className="text-xl font-bold mt-2 italic">Brave Academy - Weight Analysis Report</h3>
                  </div>
                  <div className="flex justify-between items-center mb-8 bg-gray-100 p-6 rounded-2xl">
                      <div><p className="text-sm">الاسم:</p><p className="text-2xl font-black">{selectedStudent.name}</p></div>
                      <div><p className="text-sm">الحزام:</p><p className="text-xl font-bold">{selectedStudent.belt}</p></div>
                      <div><p className="text-sm">تاريخ التقرير:</p><p className="font-mono">{new Date().toLocaleDateString('ar-JO')}</p></div>
                  </div>
                  
                  <div className="chart-container">
                      <p className="font-black mb-4">التسلسل الزمني لتغير الوزن:</p>
                      {/* Note: In real print, Recharts might need simple table fallback if browser blocks Canvas print */}
                  </div>

                  <table className="print-table">
                      <thead>
                          <tr className="bg-gray-200"><th>التاريخ</th><th>الساعة</th><th>الوزن</th><th>الطول</th><th>الملاحظات</th></tr>
                      </thead>
                      <tbody>
                          {selectedStudent.records.map(r => (
                              <tr key={r.id}><td>{r.date}</td><td>{r.time}</td><td className="font-bold">{r.weight} kg</td><td>{r.height || '--'}</td><td>{r.note}</td></tr>
                          ))}
                      </tbody>
                  </table>
                  <div className="mt-20 flex justify-between items-end px-10">
                      <div className="text-center font-bold border-t-2 border-black pt-2 w-48">توقيع المدرب</div>
                      <div className="stamp-box">معتمد من الأكاديمية</div>
                  </div>
              </div>
          )}

          {printMode === 'group' && (
              <div className="w-full">
                  <div className="print-header">
                      <h1 className="text-3xl font-black">كشف الأوزان الجماعي - {activeTeam}</h1>
                      <p className="mt-2">أكاديمية الشجاع للتايكواندو</p>
                  </div>
                  <table className="print-table">
                      <thead>
                          <tr className="bg-gray-200">
                              <th>م</th><th>اسم اللاعب</th><th>الحزام</th><th>آخر وزن</th><th>تاريخ القياس</th><th>الوقت</th><th>توقيع الاستلام</th>
                          </tr>
                      </thead>
                      <tbody>
                          {filteredList.map((s, i) => (
                              <tr key={s.id}>
                                  <td>{i+1}</td><td className="font-bold">{s.name}</td><td>{s.belt}</td>
                                  <td className="text-lg font-black">{s.records?.weight || '--'}</td>
                                  <td>{s.records?.date || '--'}</td>
                                  <td>{s.records?.time || '--'}</td>
                                  <td className="w-32"></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>
    </div>
  );
};

export default WeightTracker;
import React, { useState, useMemo, useEffect, useRef } from 'react';
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

  const { data: trackers } = useCollection('fitness_tracking');

  const combinedList = useMemo(() => {
      if (!students) return [];
      return students.map(student => {
          const tracker = trackers?.find(t => t.studentId === student.id);
          const rawRecords = tracker?.records || [];
          const sortedRecords = [...rawRecords].sort((a,b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
          
          // حساب الفرق عن آخر قياس
          let diff = 0;
          if (sortedRecords.length >= 2) {
            diff = (sortedRecords.weight - sortedRecords.weight).toFixed(1);
          }

          return {
              ...student,
              trackerId: tracker?.id || null,
              teams: tracker?.teams || (tracker?.team ? [tracker.team] : []),
              records: sortedRecords,
              targetWeight: tracker?.targetWeight || '',
              lastDiff: diff,
              lastDate: sortedRecords?.date || null
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
          await updateDoc(docRef, { records: updatedRecords });
          setShowMeasureModal(false);
          setEditingRecord(null);
      } catch (err) { console.error(err); }
  };

  const handlePrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => {
        window.print();
        setPrintMode(null);
    }, 500);
  };

  return (
    <div className="h-screen flex bg-[#050505] text-right font-sans overflow-hidden" dir="rtl">
      
      {/* Sidebar */}
      <motion.div 
        animate={{ width: isSidebarOpen ? '380px' : '0px' }}
        className="bg-[#0a0a0a] border-l border-white/5 flex flex-col overflow-hidden relative shadow-2xl z-20"
      >
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                        <Activity className="text-yellow-500" size={24}/>
                        المراقبة
                    </h2>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Brave Performance Tracker</p>
                </div>
                <button onClick={() => setShowBulkAddModal(true)} className="p-3 bg-yellow-500 rounded-2xl text-black hover:scale-110 transition-all shadow-lg shadow-yellow-500/20">
                    <Users size={20}/>
                </button>
            </div>

            <div className="relative group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-500 transition-colors" size={18}/>
                <input 
                    className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pr-12 outline-none focus:border-yellow-500/50 focus:bg-white/[0.08] transition-all text-sm" 
                    placeholder="ابحث عن اسم البطل..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {['الكل', ...allTeams].map(team => (
                    <button 
                        key={team} 
                        onClick={() => setActiveTeam(team)} 
                        className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${activeTeam === team ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/10' : 'bg-white/5 text-gray-500 border-white/5 hover:border-white/20'}`}
                    >
                        {team}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-3 pb-10 custom-scrollbar">
            {filteredList.map(s => (
                <motion.div 
                    key={s.id} 
                    whileHover={{ x: -5 }}
                    onClick={() => setSelectedStudent(s)} 
                    className={`p-5 rounded-[2rem] cursor-pointer transition-all border relative overflow-hidden group ${selectedStudent?.id === s.id ? 'bg-gradient-to-l from-yellow-500/20 to-transparent border-yellow-500/40' : 'bg-white/[0.03] border-transparent hover:bg-white/[0.06]'}`}
                >
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <p className="text-white font-black text-sm mb-1 group-hover:text-yellow-500 transition-colors">{s.name}</p>
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-gray-500 bg-black/40 px-2 py-0.5 rounded-lg border border-white/5">{s.belt}</span>
                                {s.lastDiff !== 0 && (
                                    <span className={`text-[9px] font-black flex items-center ${s.lastDiff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {s.lastDiff > 0 ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>}
                                        {Math.abs(s.lastDiff)}kg
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-xl font-black text-white tracking-tighter">{s.records?.weight || '--'}</p>
                            <p className="text-[8px] text-gray-600 font-bold uppercase">Weight KG</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative bg-[#050505]">
        {/* Toggle Sidebar Button */}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="absolute -right-4 top-10 z-50 bg-yellow-500 text-black p-2 rounded-full shadow-2xl hover:scale-110 transition-all">
            {isSidebarOpen ? <ChevronRight size={18}/> : <ChevronLeft size={18}/>}
        </button>

        {selectedStudent ? (
            <>
                {/* Dashboard Header */}
                <div className="p-8 md:p-12 border-b border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-3xl bg-yellow-500 flex items-center justify-center text-black shadow-2xl shadow-yellow-500/20">
                                    <Scale size={32} />
                                </div>
                                <div>
                                    <h1 className="text-5xl font-black text-white tracking-tighter mb-1">{selectedStudent.name}</h1>
                                    <div className="flex gap-2">
                                        {selectedStudent.teams.map(t => <span key={t} className="text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full uppercase">{t}</span>)}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Live Stats Row - الجديد والفخم */}
                            <div className="flex flex-wrap gap-8 pt-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">آخر وزن مسجل</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-white">{selectedStudent.records?.weight || '--'}</span>
                                        <span className="text-sm text-gray-600 font-bold">KG</span>
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-white/10 self-center"></div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">التغيير</p>
                                    <div className={`flex items-center gap-1 text-2xl font-black ${selectedStudent.lastDiff > 0 ? 'text-red-500' : selectedStudent.lastDiff < 0 ? 'text-green-500' : 'text-gray-400'}`}>
                                        {selectedStudent.lastDiff > 0 ? <ArrowUpRight /> : selectedStudent.lastDiff < 0 ? <ArrowDownRight /> : null}
                                        {selectedStudent.lastDiff === 0 ? 'ثابت' : `${Math.abs(selectedStudent.lastDiff)}kg`}
                                    </div>
                                </div>
                                <div className="w-px h-10 bg-white/10 self-center"></div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">تاريخ القياس</p>
                                    <div className="flex items-center gap-2 text-xl font-black text-gray-300">
                                        <Calendar size={18} className="text-yellow-500"/>
                                        {selectedStudent.lastDate || 'بلا تاريخ'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full md:w-auto">
                            <button onClick={() => handlePrint('individual')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 text-white px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-bold"><Printer size={20}/> طباعة التقرير</button>
                            <button onClick={() => { setEditingRecord(null); setShowMeasureModal(true); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black hover:scale-105 transition-all shadow-2xl shadow-yellow-500/20"><Plus size={24}/> إضافة قياس</button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 custom-scrollbar">
                    {/* Charts Section */}
                    <div className="grid grid-cols-1 gap-8">
                        <div className="bg-[#0c0c0c] p-8 rounded-[3rem] border border-white/5 shadow-inner">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-xl font-black text-white flex items-center gap-2">تحليل الأداء البدني</h3>
                                    <p className="text-xs text-gray-500 font-bold">تذبذب الوزن خلال الفترة الماضية</p>
                                </div>
                                <div className="bg-yellow-500/10 px-4 py-2 rounded-2xl border border-yellow-500/20">
                                    <span className="text-[10px] font-black text-yellow-500 uppercase">الهدف: {selectedStudent.targetWeight || '??'} KG</span>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={[...selectedStudent.records].reverse().map(r => ({ name: r.date, weight: r.weight }))}>
                                        <defs>
                                            <linearGradient id="colorW" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#eab308" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false}/>
                                        <XAxis dataKey="name" stroke="#333" fontSize={10} axisLine={false} tickLine={false} tick={{fill: '#444', fontWeight: 'bold'}} />
                                        <YAxis domain={['dataMin - 3', 'dataMax + 3']} hide />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '15px'}}
                                            itemStyle={{color: '#fff', fontWeight: '900'}}
                                        />
                                        <Area type="monotone" dataKey="weight" stroke="#eab308" strokeWidth={5} fill="url(#colorW)" animationDuration={2000} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Timeline List */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-4">
                            <h3 className="text-lg font-black text-white flex items-center gap-2"><Clock size={20} className="text-yellow-500"/> السجل الزمني</h3>
                            <span className="text-[10px] font-black text-gray-500 uppercase">إجمالي القياسات: {selectedStudent.records.length}</span>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {selectedStudent.records.map((r, idx) => {
                                const nextWeight = selectedStudent.records[idx + 1]?.weight;
                                const diff = nextWeight ? (r.weight - nextWeight).toFixed(1) : 0;
                                
                                return (
                                    <motion.div 
                                        key={r.id} 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group bg-white/[0.02] hover:bg-white/[0.05] p-6 rounded-[2.5rem] flex justify-between items-center transition-all border border-white/5 hover:border-white/10 shadow-sm"
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="flex flex-col items-center justify-center bg-black w-20 h-20 rounded-3xl border border-white/5 shadow-xl">
                                                <p className="text-white font-black text-lg leading-none">{r.date.split('-')}</p>
                                                <p className="text-[9px] text-yellow-500 font-black uppercase mt-1">{new Date(r.date).toLocaleString('ar-EG', {month: 'short'})}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <p className="text-3xl font-black text-white tracking-tighter">{r.weight} <span className="text-xs text-gray-600 uppercase">KG</span></p>
                                                    {diff !== 0 && (
                                                        <div className={`px-2 py-0.5 rounded-lg text-[10px] font-black flex items-center ${diff > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                            {diff > 0 ? '+' : ''}{diff}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-gray-500 text-[10px] font-bold uppercase">
                                                    <span className="flex items-center gap-1"><Clock size={12}/> {r.time}</span>
                                                    {r.height && <span className="flex items-center gap-1"><TrendingUp size={12}/> {r.height} CM</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                                            <button onClick={() => openEdit(r)} className="p-4 bg-white/5 text-white rounded-2xl hover:bg-yellow-500 hover:text-black transition-all shadow-xl"><Edit2 size={20}/></button>
                                            <button className="p-4 bg-white/5 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl"><Trash2 size={20}/></button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.05)_0%,transparent_70%)]"></div>
                <Scale size={160} strokeWidth={0.5} className="text-yellow-500 animate-pulse"/>
                <p className="text-3xl font-black mt-8 italic uppercase tracking-[0.3em] text-white">Brave Academy</p>
                <p className="text-xs text-gray-500 font-bold mt-2">CHOOSE A CHAMPION TO ANALYZE</p>
            </div>
        )}
      </div>

      {/* --- Custom Group Modal (The Fancy One) --- */}
      <AnimatePresence>
        {showBulkAddModal && (
            <div className="fixed inset-0 bg-black/95 z- flex items-center justify-center p-4 backdrop-blur-2xl">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0d0d0d] border border-white/10 rounded-[3.5rem] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <div className="p-10 border-b border-white/5 flex justify-between items-center">
                        <div>
                            <h3 className="text-3xl font-black text-white italic">Group Management</h3>
                            <p className="text-xs text-gray-500 font-bold">إضافة وتعديل المجموعات التدريبية</p>
                        </div>
                        <button onClick={() => setShowBulkAddModal(false)} className="p-4 bg-white/5 rounded-3xl text-gray-400 hover:bg-red-500/20 hover:text-red-500 transition-all"><X size={24}/></button>
                    </div>
                    
                    <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                        {/* Custom Dropdown for Groups */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest px-2">اختر المجموعة المستهدفة</label>
                            <div className="relative">
                                <div 
                                    onClick={() => setIsGroupDropdownOpen(!isGroupDropdownOpen)}
                                    className="w-full bg-white/[0.03] border border-white/10 text-white rounded-2xl p-5 flex justify-between items-center cursor-pointer hover:border-yellow-500/50 transition-all"
                                >
                                    <span className={targetTeamName ? 'text-white font-bold' : 'text-gray-500'}>
                                        {targetTeamName || "اختر مجموعة أو أنشئ واحدة..."}
                                    </span>
                                    <ChevronDown size={20} className={`transition-transform ${isGroupDropdownOpen ? 'rotate-180' : ''}`} />
                                </div>
                                
                                <AnimatePresence>
                                    {isGroupDropdownOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                            className="absolute top-full left-0 right-0 mt-2 bg-[#151515] border border-white/10 rounded-2xl overflow-hidden z-50 shadow-2xl"
                                        >
                                            <div className="p-2 max-h-48 overflow-y-auto">
                                                {allTeams.map(t => (
                                                    <div 
                                                        key={t} 
                                                        onClick={() => { setTargetTeamName(t); setIsGroupDropdownOpen(false); }}
                                                        className="p-4 hover:bg-yellow-500 hover:text-black rounded-xl cursor-pointer text-sm font-bold transition-colors text-white"
                                                    >
                                                        {t}
                                                    </div>
                                                ))}
                                                <div className="p-2 border-t border-white/5 mt-2">
                                                    <input 
                                                        className="w-full bg-black border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-yellow-500" 
                                                        placeholder="اسم مجموعة جديدة..." 
                                                        onKeyDown={(e) => { if(e.key === 'Enter') { setTargetTeamName(e.target.value); setIsGroupDropdownOpen(false); }}}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="relative group">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500" size={18}/>
                                <input className="w-full bg-black border border-white/10 text-white rounded-2xl py-4 pr-12 outline-none focus:border-yellow-500" placeholder="بحث سريع عن الطلاب..." value={bulkSearch} onChange={e => setBulkSearch(e.target.value)}/>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {combinedList.filter(s => s.name.includes(bulkSearch)).map(s => {
                                    const isSelected = selectedBulkIds.includes(s.id);
                                    return (
                                        <div 
                                            key={s.id} 
                                            onClick={() => setSelectedBulkIds(prev => isSelected ? prev.filter(i=>i!==s.id) : [...prev, s.id])} 
                                            className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${isSelected ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/10' : 'bg-white/5 border-white/10 text-white'}`}
                                        >
                                            <span className="text-[11px] font-black truncate">{s.name}</span>
                                            {isSelected ? <CheckCircle size={18}/> : <PlusCircle size={18} className="opacity-10"/>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-white/[0.02] border-t border-white/5 flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                            <span className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></span>
                            <span className="text-gray-400 font-black text-xs uppercase tracking-widest">تحديد: {selectedBulkIds.length} لاعب</span>
                        </div>
                        <button 
                            onClick={handleBulkUpdate} 
                            disabled={!targetTeamName || selectedBulkIds.length === 0}
                            className="bg-yellow-500 text-black px-12 py-5 rounded-[2rem] font-black hover:scale-105 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-2xl shadow-yellow-500/20 uppercase text-sm"
                        >
                            تأكيد الإضافة
                        </button>
                    </div>
                </motion.div>
            </div>
        )}

        {showMeasureModal && (
            <div className="fixed inset-0 bg-black/95 z- flex items-center justify-center p-4 backdrop-blur-xl">
                <motion.div initial={{scale: 0.9, opacity: 0}} animate={{scale: 1, opacity: 1}} className="bg-[#111] border border-white/10 rounded-[3.5rem] w-full max-w-md p-10 shadow-2xl">
                    <h3 className="text-2xl font-black text-white mb-10 text-center italic uppercase tracking-tighter">
                        {editingRecord ? 'Edit Metrics' : 'New Performance Entry'}
                    </h3>
                    <form onSubmit={handleSaveMeasurement} className="space-y-6 text-right">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 bg-white/[0.03] p-4 rounded-3xl border border-white/5 focus-within:border-yellow-500/50 transition-all">
                                <label className="text-[10px] font-black text-gray-500 uppercase">الوزن (KG)</label>
                                <input type="number" step="0.1" className="w-full bg-transparent text-white outline-none font-black text-3xl text-center" value={newMeasure.weight} onChange={e => setNewMeasure({...newMeasure, weight: e.target.value})} autoFocus required/>
                            </div>
                            <div className="space-y-2 bg-white/[0.03] p-4 rounded-3xl border border-white/5 focus-within:border-yellow-500/50 transition-all">
                                <label className="text-[10px] font-black text-gray-500 uppercase">الطول (CM)</label>
                                <input type="number" className="w-full bg-transparent text-white outline-none font-black text-3xl text-center" value={newMeasure.height} onChange={e => setNewMeasure({...newMeasure, height: e.target.value})}/>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 bg-white/[0.03] p-4 rounded-3xl border border-white/5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">التاريخ</label>
                                <input type="date" className="w-full bg-transparent text-white outline-none font-bold text-xs" value={newMeasure.date} onChange={e => setNewMeasure({...newMeasure, date: e.target.value})}/>
                            </div>
                            <div className="space-y-2 bg-white/[0.03] p-4 rounded-3xl border border-white/5">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">الساعة</label>
                                <input type="time" className="w-full bg-transparent text-white outline-none font-bold text-xs" value={newMeasure.time} onChange={e => setNewMeasure({...newMeasure, time: e.target.value})}/>
                            </div>
                        </div>
                        <textarea className="w-full bg-white/[0.03] border border-white/5 p-5 rounded-3xl text-white text-sm outline-none focus:border-yellow-500/50 h-24" placeholder="ملاحظات فنية عن حالة اللاعب..." value={newMeasure.note} onChange={e => setNewMeasure({...newMeasure, note: e.target.value})}/>
                        <div className="flex gap-4 pt-6">
                            <button type="button" onClick={() => setShowMeasureModal(false)} className="flex-1 py-5 bg-white/5 text-gray-500 rounded-[2rem] font-black uppercase text-xs">إلغاء</button>
                            <button type="submit" className="flex-1 py-5 bg-yellow-500 text-black rounded-[2rem] font-black uppercase text-xs shadow-xl shadow-yellow-500/10">حفظ البيانات</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Print Section (Superior Quality) --- */}
      <style>{`
          @media print {
            @page { size: A4; margin: 0; }
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { 
                display: block !important; 
                position: absolute; left: 0; top: 0; width: 100%; 
                padding: 60px; background: white !important; color: black !important; 
            }
            .print-header { border-bottom: 8px solid #000; padding-bottom: 30px; margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }
            .print-table { width: 100%; border-collapse: collapse; margin: 40px 0; }
            .print-table th { background: #000 !important; color: white !important; padding: 15px; border: 1px solid #000; font-size: 14px; }
            .print-table td { padding: 15px; border: 1px solid #eee; text-align: center; font-size: 14px; }
            .chart-placeholder { 
                width: 100%; height: 250px; border: 2px dashed #ccc; 
                display: flex; flex-direction: column; items-center justify-center;
                margin: 40px 0; border-radius: 20px;
            }
            .summary-box { display: grid; grid-template-cols: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
            .summary-item { background: #f9f9f9; padding: 20px; border-radius: 15px; border: 1px solid #eee; text-align: center; }
          }
      `}</style>

      <div className="print-area hidden" dir="rtl">
          {printMode === 'individual' && selectedStudent && (
              <div className="w-full">
                  <div className="print-header">
                      <div className="text-right">
                        <h1 className="text-5xl font-black mb-1">أكاديمية الشجاع</h1>
                        <p className="text-xl font-bold tracking-[0.2em]">BRAVE ACADEMY</p>
                      </div>
                      <div className="text-left">
                        <p className="font-black text-sm uppercase">Performance Report</p>
                        <p className="font-mono text-xs">{new Date().toLocaleDateString('ar-JO')}</p>
                      </div>
                  </div>

                  <div className="summary-box">
                      <div className="summary-item"><p className="text-xs text-gray-500 font-bold mb-1">اسم اللاعب</p><p className="text-xl font-black">{selectedStudent.name}</p></div>
                      <div className="summary-item"><p className="text-xs text-gray-500 font-bold mb-1">الحزام</p><p className="text-xl font-black">{selectedStudent.belt}</p></div>
                      <div className="summary-item"><p className="text-xs text-gray-500 font-bold mb-1">الوزن الحالي</p><p className="text-xl font-black">{selectedStudent.records?.weight || '--'} KG</p></div>
                  </div>

                  <div className="chart-placeholder">
                      <TrendingUp size={40} className="text-gray-300 mb-2"/>
                      <p className="text-xs font-black text-gray-400">رسم بياني لتحليل الأداء البدني</p>
                      <p className="text-[10px] text-gray-300">يظهر التغير من {selectedStudent.records[selectedStudent.records.length-1]?.weight}kg إلى {selectedStudent.records?.weight}kg</p>
                  </div>

                  <table className="print-table">
                      <thead>
                          <tr><th>التاريخ</th><th>الساعة</th><th>الوزن (KG)</th><th>الطول (CM)</th><th>ملاحظات الأداء</th></tr>
                      </thead>
                      <tbody>
                          {selectedStudent.records.map(r => (
                              <tr key={r.id}>
                                  <td className="font-bold">{r.date}</td>
                                  <td>{r.time}</td>
                                  <td className="font-black text-lg">{r.weight}</td>
                                  <td>{r.height || '--'}</td>
                                  <td className="text-right text-xs">{r.note || '-'}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>

                  <div className="mt-20 flex justify-between items-center">
                      <div className="text-center">
                          <div className="w-48 h-px bg-black mb-4"></div>
                          <p className="font-black text-sm uppercase">Coach Signature</p>
                          <p className="text-xs font-bold text-gray-500">توقيع المدرب الفني</p>
                      </div>
                      <div className="border-4 border-black p-4 rotate-12 opacity-50">
                          <p className="font-black text-lg">BRAVE OFFICIAL</p>
                          <p className="text-[8px] font-bold text-center">CERTIFIED DATA</p>
                      </div>
                  </div>
              </div>
          )}
      </div>
    </div>
  );
};

export default WeightTracker;
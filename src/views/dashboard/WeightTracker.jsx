// src/views/dashboard/WeightTracker.jsx
import React, { useState, useMemo } from 'react';
import { 
  Scale, Ruler, Activity, Plus, Search, Trash2, 
  ArrowUp, ArrowDown, ChevronRight, UserPlus, 
  Printer, Settings, Users, Briefcase, X, CheckCircle, Calendar as CalendarIcon, 
  PlusCircle, Tag, Clock, TrendingDown, TrendingUp
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const WeightTracker = ({ students, logActivity }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeTeam, setActiveTeam] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkSearch, setBulkSearch] = useState('');
  const [selectedBulkIds, setSelectedBulkIds] = useState([]);
  const [targetTeamName, setTargetTeamName] = useState(''); 
  const [newTeamInput, setNewTeamInput] = useState(''); 
  const [newMeasure, setNewMeasure] = useState({ 
      date: new Date().toISOString().split('T'), 
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      weight: '', height: '', note: '' 
  });
  const [targetSettings, setTargetSettings] = useState({ targetWeight: '', targetClass: '' });
  const [printMode, setPrintMode] = useState('team'); 

  const { data: trackers } = useCollection('fitness_tracking');

  const combinedList = useMemo(() => {
      if (!students) return [];
      return students.map(student => {
          const tracker = trackers?.find(t => t.studentId === student.id);
          return {
              ...student,
              trackerId: tracker?.id || null,
              teams: tracker?.teams || (tracker?.team ? [tracker.team] : []),
              records: tracker?.records || [],
              targetWeight: tracker?.targetWeight || '',
              targetClass: tracker?.targetClass || '',
              birthDate: student.birthDate || student.dob || tracker?.birthDate || ''
          };
      });
  }, [students, trackers]);

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

  const chartData = useMemo(() => {
    if (!selectedStudent?.records || selectedStudent.records.length === 0) return [];
    return [...selectedStudent.records]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map(r => ({
            name: r.date.split('-').slice(1).reverse().join('/'),
            weight: r.weight
        }));
  }, [selectedStudent]);

  // --- Handlers ---
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setTargetSettings({ targetWeight: student.targetWeight || '', targetClass: student.targetClass || '' });
  };

  const handleAddMeasurement = async (e) => {
      e.preventDefault();
      if (!newMeasure.weight) return;
      const record = { 
          id: Date.now().toString(), date: newMeasure.date, time: newMeasure.time,
          weight: Number(newMeasure.weight), height: newMeasure.height ? Number(newMeasure.height) : null, note: newMeasure.note || '' 
      };
      try {
          if (selectedStudent.trackerId) {
              const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedStudent.trackerId);
              const updatedRecords = [record, ...selectedStudent.records];
              await updateDoc(docRef, { records: updatedRecords, lastUpdated: new Date().toISOString() });
              setSelectedStudent({...selectedStudent, records: updatedRecords});
          } else {
              const newDoc = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking'), {
                  studentId: selectedStudent.id, name: selectedStudent.name, belt: selectedStudent.belt,
                  teams: [], records: [record], targetWeight: '', targetClass: '', lastUpdated: new Date().toISOString()
              });
              setSelectedStudent({...selectedStudent, trackerId: newDoc.id, records: [record]});
          }
          setShowMeasureModal(false);
          setNewMeasure({ date: new Date().toISOString().split('T'), time: '', weight: '', height: '', note: '' });
      } catch (err) { console.error(err); }
  };

  const handleBulkAdd = async () => {
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
                teams: [targetTeamName], records: [], targetWeight: '', targetClass: '', lastUpdated: new Date().toISOString()
            });
        }
    });
    await Promise.all(promises);
    setShowBulkAddModal(false);
    setSelectedBulkIds([]);
    alert("تمت إضافة الطلاب للمجموعة بنجاح ✅");
  };

  const handlePrint = (mode) => {
    setPrintMode(mode);
    setTimeout(() => window.print(), 200);
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 bg-black p-2 md:p-4 font-sans text-right" dir="rtl">
      
      {/* Sidebar - القائمة الجانبية */}
      <div className={`md:w-80 w-full flex flex-col bg-[#111] border border-white/5 rounded-[2rem] overflow-hidden ${selectedStudent ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-5 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-white">المراقبة</h2>
                <button onClick={() => setShowBulkAddModal(true)} className="p-2 bg-yellow-500 rounded-full text-black hover:scale-110 transition-transform"><Users size={20}/></button>
            </div>
            
            <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
                <input className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-3 pr-10 outline-none focus:border-yellow-500/50" placeholder="ابحث عن بطل..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['الكل', ...allTeams].map(team => (
                    <button key={team} onClick={() => setActiveTeam(team)} className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeTeam === team ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{team}</button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-2 pb-5">
            {filteredList.map(s => (
                <div key={s.id} onClick={() => handleSelectStudent(s)} className={`p-4 rounded-[1.5rem] cursor-pointer transition-all border ${selectedStudent?.id === s.id ? 'bg-yellow-500/10 border-yellow-500/50' : 'bg-white/5 border-transparent hover:border-white/10'}`}>
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{s.name}</span>
                            <span className="text-[10px] text-gray-500">{s.belt} - {s.branch}</span>
                        </div>
                        <div className="text-left">
                            <span className="text-lg font-black text-white">{s.records?.weight || '--'}</span>
                            <span className="text-[10px] text-gray-500 mr-1">kg</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Main Content - المحتوى الرئيسي */}
      <div className={`flex-1 bg-[#111] border border-white/5 rounded-[2rem] flex flex-col overflow-hidden ${!selectedStudent ? 'hidden md:flex items-center justify-center' : 'flex'}`}>
        {selectedStudent ? (
            <>
                <div className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedStudent(null)} className="md:hidden p-2 bg-white/5 rounded-full"><ChevronRight/></button>
                        <div>
                            <h2 className="text-3xl font-black text-white mb-1">{selectedStudent.name}</h2>
                            <div className="flex gap-2">
                                {selectedStudent.teams.map(t => <span key={t} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">{t}</span>)}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => handlePrint('individual')} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 text-white px-4 py-3 rounded-2xl border border-white/10 hover:bg-white/10"><Printer size={18}/> تقرير</button>
                        <button onClick={() => setShowMeasureModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-2xl font-black hover:bg-yellow-400 shadow-xl shadow-yellow-500/10"><Plus size={20}/> قياس جديد</button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'الوزن الحالي', val: selectedStudent.records?.weight, unit: 'kg', color: 'text-white' },
                            { label: 'الوزن المستهدف', val: selectedStudent.targetWeight || '--', unit: 'kg', color: 'text-yellow-500' },
                            { label: 'أعلى وزن', val: Math.max(...selectedStudent.records.map(r=>r.weight), 0) || '--', unit: 'kg', color: 'text-red-400' },
                            { label: 'أقل وزن', val: Math.min(...selectedStudent.records.map(r=>r.weight), Infinity) === Infinity ? '--' : Math.min(...selectedStudent.records.map(r=>r.weight)), unit: 'kg', color: 'text-green-400' },
                        ].map((s, i) => (
                            <div key={i} className="bg-white/5 p-5 rounded-[2rem] border border-white/5">
                                <p className="text-gray-500 text-xs font-bold mb-2">{s.label}</p>
                                <p className={`text-2xl font-black ${s.color}`}>{s.val} <span className="text-xs text-gray-600 font-normal">{s.unit}</span></p>
                            </div>
                        ))}
                    </div>

                    {/* Chart Area */}
                    <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5 h-80">
                        <h3 className="text-sm font-bold text-gray-400 mb-6 flex items-center gap-2"><TrendingUp size={16} className="text-yellow-500"/> تحليل تذبذب الوزن</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#444" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                                <Tooltip contentStyle={{backgroundColor: '#111', border: 'none', borderRadius: '15px', color: '#fff'}} />
                                <Area type="monotone" dataKey="weight" stroke="#eab308" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Records Table */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-400 px-2">السجلات التاريخية</h3>
                        {selectedStudent.records.map((r, i) => (
                            <div key={r.id} className="bg-white/5 p-4 rounded-2xl flex justify-between items-center hover:bg-white/10 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className="text-center bg-black rounded-xl p-2 min-w-[60px]">
                                        <span className="block text-white font-black text-xs">{r.date.split('-').reverse().slice(0,2).join('/')}</span>
                                        <span className="text-[9px] text-gray-500 font-mono">{r.time}</span>
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-white">{r.weight} <span className="text-[10px] text-gray-600 font-normal">kg</span></p>
                                        {r.note && <p className="text-xs text-gray-500">{r.note}</p>}
                                    </div>
                                </div>
                                <button onClick={() => {}} className="p-2 text-red-500 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        ) : (
            <div className="flex flex-col items-center gap-4 text-gray-600">
                <Scale size={80} className="opacity-10"/>
                <p className="font-bold">اختر بطلاً لبدء المراقبة</p>
            </div>
        )}
      </div>

      {/* Bulk Add Modal - إدارة المجموعات */}
      <AnimatePresence>
        {showBulkAddModal && (
            <div className="fixed inset-0 bg-black/95 z- flex items-center justify-center p-4 backdrop-blur-xl">
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#151515] border border-white/10 rounded-[3rem] w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center">
                        <h3 className="text-2xl font-black text-white">إنشاء مجموعة تتبع</h3>
                        <button onClick={() => setShowBulkAddModal(false)} className="p-2 bg-white/5 rounded-full text-white hover:bg-red-500/20 hover:text-red-500 transition-all"><X/></button>
                    </div>
                    
                    <div className="p-8 space-y-6 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-yellow-500 uppercase tracking-widest">اسم المجموعة الجديدة</label>
                            <input className="w-full bg-white/5 border border-white/10 text-white rounded-2xl p-4 outline-none focus:border-yellow-500" placeholder="مثال: أبطال المملكة 2026" value={targetTeamName} onChange={e => setTargetTeamName(e.target.value)}/>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">اختر الطلاب للمجموعة</label>
                            <div className="relative">
                                <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                                <input className="w-full bg-white/5 border border-white/10 text-white rounded-2xl py-4 pr-12 outline-none" placeholder="ابحث بالاسم..." value={bulkSearch} onChange={e => setBulkSearch(e.target.value)}/>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {combinedList.filter(s => s.name.includes(bulkSearch)).map(s => {
                                const isSelected = selectedBulkIds.includes(s.id);
                                return (
                                    <div key={s.id} onClick={() => isSelected ? setSelectedBulkIds(prev => prev.filter(id => id !== s.id)) : setSelectedBulkIds(prev => [...prev, s.id])} className={`p-4 rounded-2xl border cursor-pointer transition-all flex justify-between items-center ${isSelected ? 'bg-yellow-500 border-yellow-500 text-black' : 'bg-white/5 border-white/10 text-white'}`}>
                                        <span className="font-bold text-sm truncate ml-2">{s.name}</span>
                                        {isSelected ? <CheckCircle size={18}/> : <PlusCircle size={18} className="text-gray-600"/>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="p-8 bg-black/40 border-t border-white/5 flex justify-between items-center">
                        <span className="text-gray-500 font-bold">تم تحديد {selectedBulkIds.length} طالب</span>
                        <button onClick={handleBulkAdd} className="bg-yellow-500 text-black px-10 py-4 rounded-2xl font-black hover:bg-yellow-400 disabled:opacity-50 shadow-xl shadow-yellow-500/10">حفظ المجموعة</button>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Measure Modal - قياس جديد */}
      <AnimatePresence>
        {showMeasureModal && (
            <div className="fixed inset-0 bg-black/90 z- flex items-center justify-center p-4 backdrop-blur-md">
                <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#1a1a1a] border border-white/10 rounded-[2.5rem] w-full max-w-sm p-8 shadow-2xl text-right">
                    <h3 className="text-xl font-black text-white mb-8 text-center">تسجيل قياس جديد</h3>
                    <form onSubmit={handleAddMeasurement} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-right">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase pr-2">الوزن (kg)</label>
                                <input type="number" step="0.1" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 font-black text-2xl text-center" value={newMeasure.weight} onChange={e => setNewMeasure({...newMeasure, weight: e.target.value})} autoFocus required/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase pr-2">الطول (cm)</label>
                                <input type="number" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none focus:border-yellow-500 text-center" value={newMeasure.height} onChange={e => setNewMeasure({...newMeasure, height: e.target.value})}/>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase pr-2">التاريخ</label>
                            <input type="date" className="w-full bg-black border border-white/10 p-4 rounded-2xl text-white outline-none" value={newMeasure.date} onChange={e => setNewMeasure({...newMeasure, date: e.target.value})}/>
                        </div>
                        <div className="flex gap-3 pt-4">
                            <button type="button" onClick={() => setShowMeasureModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-bold">إلغاء</button>
                            <button type="submit" className="flex-1 py-4 rounded-2xl bg-yellow-500 text-black font-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20">حفظ</button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* --- Print Section (Improved Layout) --- */}
      <style>{`
          @media print {
            body { background: white !important; color: black !important; }
            body * { visibility: hidden; }
            .print-area, .print-area * { visibility: visible; }
            .print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; padding: 40px; background: white !important; }
            .print-card { border: 4px solid #000; padding: 30px; border-radius: 20px; position: relative; }
            .print-header { text-align: center; border-bottom: 2px solid #eee; margin-bottom: 30px; padding-bottom: 20px; }
            .print-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .print-table th { background: #f8f8f8 !important; padding: 12px; border: 1px solid #ddd; }
            .print-table td { padding: 12px; border: 1px solid #eee; text-align: center; }
            .stamp { position: absolute; bottom: 40px; left: 40px; opacity: 0.6; transform: rotate(-15deg); border: 3px solid red; color: red; padding: 10px; font-weight: bold; border-radius: 10px; }
          }
      `}</style>

      <div className="print-area hidden">
          {printMode === 'individual' && selectedStudent && (
            <div className="print-card" dir="rtl">
                <div className="print-header">
                    <h1 className="text-3xl font-black mb-2">أكاديمية الشجاع للتايكواندو</h1>
                    <h2 className="text-xl font-bold text-gray-600">تقرير المراقبة الصحية والبدنية</h2>
                    <p className="text-sm mt-4">اسم اللاعب: <span className="font-black text-lg">{selectedStudent.name}</span> | الحزام: {selectedStudent.belt}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8 text-center bg-gray-50 p-4 rounded-xl">
                    <div><p className="text-xs text-gray-500">الوزن الحالي</p><p className="text-xl font-black">{selectedStudent.records?.weight || '-'} kg</p></div>
                    <div><p className="text-xs text-gray-500">الوزن المستهدف</p><p className="text-xl font-black">{selectedStudent.targetWeight || '-'} kg</p></div>
                    <div><p className="text-xs text-gray-500">الحالة العامة</p><p className="text-sm font-bold">{selectedStudent.records?.weight > selectedStudent.targetWeight ? 'فوق الهدف' : 'وزن مثالي'}</p></div>
                </div>

                <table className="print-table">
                    <thead><tr><th>التاريخ</th><th>الوزن (kg)</th><th>الطول (cm)</th><th>الفرق</th><th>ملاحظات المدرب</th></tr></thead>
                    <tbody>
                        {selectedStudent.records.map((r, i) => {
                            const diff = selectedStudent.records[i+1] ? (r.weight - selectedStudent.records[i+1].weight).toFixed(1) : '-';
                            return (<tr key={i}><td>{r.date}</td><td className="font-bold">{r.weight}</td><td>{r.height || '-'}</td><td>{diff}</td><td>{r.note || '-'}</td></tr>);
                        })}
                    </tbody>
                </table>
                <div className="mt-20 flex justify-between items-end">
                    <div className="text-center"><div className="w-40 h-px bg-black mb-2"></div><p className="font-bold">توقيع المدير الفني</p></div>
                    <div className="stamp uppercase">Brave Academy<br/>Approved</div>
                    <div className="text-center font-bold"><p>تاريخ التقرير: {new Date().toLocaleDateString('ar-JO')}</p></div>
                </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default WeightTracker;
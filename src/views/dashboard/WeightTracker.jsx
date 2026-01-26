// src/views/dashboard/WeightTracker.jsx
import React, { useState, useMemo } from 'react';
import { 
  Scale, Ruler, Activity, Plus, Search, Trash2, 
  ArrowUp, ArrowDown, ChevronRight, UserPlus, 
  Printer, Settings, Users, Briefcase, X, CheckCircle, Calendar as CalendarIcon, 
  PlusCircle, Clock
} from 'lucide-react';
import { collection, addDoc, updateDoc, doc, deleteDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
import { db, appId } from '../../lib/firebase';
import { useCollection } from '../../hooks/useCollection';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WeightTracker = ({ students, logActivity }) => {
  // --- States ---
  const [selectedStudent, setSelectedStudent] = useState(null); // تم تغيير الاسم ليعكس أنه طالب قد يكون مراقباً أو لا
  const [showBulkAddModal, setShowBulkAddModal] = useState(false);
  const [showMeasureModal, setShowMeasureModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const [activeTeam, setActiveTeam] = useState('الكل');
  
  // Date Range
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [printMode, setPrintMode] = useState('team'); 

  // Forms
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkSearch, setBulkSearch] = useState('');
  const [selectedBulkIds, setSelectedBulkIds] = useState([]);
  
  // Team Management
  const [targetTeamName, setTargetTeamName] = useState(''); 
  const [newTeamInput, setNewTeamInput] = useState(''); 

  const [newMeasure, setNewMeasure] = useState({ 
      date: new Date().toISOString().split('T')[0], 
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      weight: '', height: '', note: '' 
  });

  const [targetSettings, setTargetSettings] = useState({ targetWeight: '', targetClass: '' });

  // Fetch Trackers
  const { data: trackers } = useCollection('fitness_tracking');

  // --- Helpers ---
  
  // ✅ 1. دمج الطلاب مع بيانات المراقبة (Merge Logic)
  // هذه الخطوة تضمن ظهور جميع طلاب الأكاديمية سواء كان لهم سجل وزن أم لا
  const combinedList = useMemo(() => {
      if (!students) return [];
      return students.map(student => {
          // البحث هل الطالب له ملف مراقبة؟
          const tracker = trackers?.find(t => t.studentId === student.id);
          
          return {
              ...student, // بيانات الطالب الأساسية من سجل الطلاب
              // بيانات المراقبة (إذا وجدت) أو قيم افتراضية
              trackerId: tracker?.id || null, // مهم جداً للتمييز هل هو جديد أم قديم
              teams: tracker?.teams || (tracker?.team ? [tracker.team] : []),
              records: tracker?.records || [],
              targetWeight: tracker?.targetWeight || '',
              targetClass: tracker?.targetClass || '',
              // استخدام تاريخ الميلاد من سجل الطالب الأصلي كأولوية
              birthDate: student.birthDate || student.dob || tracker?.birthDate || ''
          };
      });
  }, [students, trackers]);

  // استخراج الفرق الموجودة من البيانات
  const allTeams = useMemo(() => {
      const teamsSet = new Set();
      // teamsSet.add('عام'); 
      trackers?.forEach(t => {
          if (t.teams && Array.isArray(t.teams)) t.teams.forEach(tm => teamsSet.add(tm));
          else if (t.team) teamsSet.add(t.team);
      });
      return Array.from(teamsSet);
  }, [trackers]);

  const distinctTeamsForTabs = useMemo(() => ['الكل', ...allTeams], [allTeams]);

  // ✅ الفلترة بناءً على القائمة المدمجة (الكل موجود)
  const filteredList = useMemo(() => {
      let filtered = combinedList;

      // فلتر الفريق
      if (activeTeam !== 'الكل') {
          // هنا نعرض فقط الطلاب المنضمين للفريق المختار
          filtered = filtered.filter(s => s.teams.includes(activeTeam));
      }

      // فلتر البحث
      if (searchTerm) {
          filtered = filtered.filter(s => s.name.includes(searchTerm));
      }

      return filtered;
  }, [combinedList, searchTerm, activeTeam]);

  // تجهيز بيانات الطالب المختار عند النقر
  const handleSelectStudent = (student) => {
      setSelectedStudent(student);
      setTargetSettings({
          targetWeight: student.targetWeight || '',
          targetClass: student.targetClass || ''
      });
  };

  // Helper Functions
  const getBirthYear = (dateStr) => {
      if (!dateStr) return '---';
      try { return new Date(dateStr).getFullYear(); } catch { return '---'; }
  };

  const chartData = useMemo(() => {
      if (!selectedStudent?.records) return [];
      return [...selectedStudent.records].reverse().map(r => ({
          name: `${r.date.substring(5)} (${r.time || ''})`,
          weight: r.weight,
          fullDate: r.date
      }));
  }, [selectedStudent]);

  const calculateStats = (current, previous) => {
      let diff = 0; let trend = 'stable'; 
      if (previous) {
          diff = (Number(current.weight) - Number(previous.weight)).toFixed(1);
          if (diff > 0) trend = 'up'; if (diff < 0) trend = 'down';
      }
      return { diff, trend };
  };

  // --- Handlers ---

  // ✅ 1. إضافة قياس (وإنشاء ملف تتبع تلقائياً إذا لم يوجد)
  const handleAddMeasurement = async (e) => {
      e.preventDefault();
      if (!newMeasure.weight || !newMeasure.date) return alert("الوزن والتاريخ مطلوبان");
      
      const record = { 
          id: Date.now().toString(), 
          date: newMeasure.date, 
          time: newMeasure.time || '00:00',
          weight: Number(newMeasure.weight), 
          height: newMeasure.height ? Number(newMeasure.height) : null, 
          note: newMeasure.note || '' 
      };

      try {
          if (selectedStudent.trackerId) {
              // ✅ الحالة أ: الطالب مراقب سابقاً، نحدث ملفه
              const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedStudent.trackerId);
              const updatedRecords = [...selectedStudent.records, record].sort((a, b) => {
                  const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
                  const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
                  return dateB - dateA;
              });
              await updateDoc(docRef, { records: updatedRecords, lastUpdated: new Date().toISOString() });
              
              // تحديث محلي
              setSelectedStudent({...selectedStudent, records: updatedRecords});
          } else {
              // ✅ الحالة ب: الطالب غير مراقب، ننشئ له ملف جديد
              const newTrackerData = {
                  studentId: selectedStudent.id,
                  name: selectedStudent.name,
                  belt: selectedStudent.belt,
                  birthDate: selectedStudent.birthDate || '',
                  teams: [], // لا يوجد فريق افتراضي إلا إذا حددنا
                  records: [record],
                  targetWeight: '',
                  targetClass: '',
                  lastUpdated: new Date().toISOString()
              };
              const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking'), newTrackerData);
              // تحديث محلي ليصبح "مراقب" فوراً
              setSelectedStudent({ ...selectedStudent, trackerId: docRef.id, records: [record] });
          }

          setShowMeasureModal(false);
          setNewMeasure({ date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }), weight: '', height: '', note: '' });
      } catch (err) { console.error(err); }
  };

  // ✅ 2. تحديث الفرق والإعدادات (وإنشاء ملف تتبع إذا لم يوجد)
  const handleUpdateSettings = async (e) => {
      e.preventDefault();
      try {
          if (selectedStudent.trackerId) {
              // تحديث
              const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedStudent.trackerId);
              await updateDoc(docRef, { 
                  targetWeight: targetSettings.targetWeight, 
                  targetClass: targetSettings.targetClass 
              });
          } else {
              // إنشاء
              const newTrackerData = {
                  studentId: selectedStudent.id,
                  name: selectedStudent.name,
                  belt: selectedStudent.belt,
                  birthDate: selectedStudent.birthDate || '',
                  teams: [],
                  records: [],
                  targetWeight: targetSettings.targetWeight,
                  targetClass: targetSettings.targetClass,
                  lastUpdated: new Date().toISOString()
              };
              const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking'), newTrackerData);
              setSelectedStudent({ ...selectedStudent, trackerId: docRef.id });
          }
          
          setSelectedStudent(prev => ({ ...prev, ...targetSettings }));
          setShowSettingsModal(false);
      } catch (err) { console.error(err); }
  };

  const handleAddTeamToStudent = async () => {
      if(!newTeamInput) return;
      try {
          if (selectedStudent.trackerId) {
              const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedStudent.trackerId);
              await updateDoc(docRef, { teams: arrayUnion(newTeamInput) });
          } else {
              // إنشاء إذا لم يوجد
              const newTrackerData = {
                  studentId: selectedStudent.id, name: selectedStudent.name, belt: selectedStudent.belt, birthDate: selectedStudent.birthDate || '',
                  teams: [newTeamInput], records: [], targetWeight: '', targetClass: '', lastUpdated: new Date().toISOString()
              };
              const docRef = await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking'), newTrackerData);
              setSelectedStudent(prev => ({ ...prev, trackerId: docRef.id }));
          }
          // تحديث محلي
          const updatedTeams = [...(selectedStudent.teams || []), newTeamInput];
          setSelectedStudent(prev => ({ ...prev, teams: updatedTeams }));
          setNewTeamInput('');
      } catch(err) { console.error(err); }
  };

  const handleRemoveTeamFromStudent = async (teamToRemove) => {
      if(!selectedStudent.trackerId) return;
      if(!confirm(`إزالة من ${teamToRemove}؟`)) return;
      try {
          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedStudent.trackerId);
          await updateDoc(docRef, { teams: arrayRemove(teamToRemove) });
          const updatedTeams = selectedStudent.teams.filter(t => t !== teamToRemove);
          setSelectedStudent(prev => ({ ...prev, teams: updatedTeams }));
      } catch(err) { console.error(err); }
  };

  // ✅ 3. Bulk Add (لإضافة فرق لمجموعة طلاب دفعة واحدة)
  const handleBulkAdd = async () => {
      if (selectedBulkIds.length === 0) return;
      if (!targetTeamName) return alert("اختر الفريق");

      const promises = selectedBulkIds.map(async (id) => {
          const tracker = trackers?.find(t => t.studentId === id);
          if (tracker) {
              // إذا موجود: أضف الفريق
              const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', tracker.id);
              return updateDoc(docRef, { teams: arrayUnion(targetTeamName), team: targetTeamName });
          } else {
              // إذا غير موجود: أنشئ ملف
              const student = students.find(s => s.id === id);
              if (!student) return;
              return addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking'), {
                  studentId: student.id, name: student.name, belt: student.belt, birthDate: student.birthDate || '',
                  teams: [targetTeamName], team: targetTeamName,
                  records: [], targetWeight: '', targetClass: '', lastUpdated: new Date().toISOString()
              });
          }
      });

      try { await Promise.all(promises); setShowBulkAddModal(false); setSelectedBulkIds([]); setBulkSearch(''); alert("تمت العملية بنجاح"); } catch(err){ console.error(err); }
  };

  const handleDeleteRecord = async (recordId) => {
      if(!confirm("حذف القياس؟")) return;
      const updatedRecords = selectedStudent.records.filter(r => r.id !== recordId);
      setSelectedStudent(prev => ({ ...prev, records: updatedRecords }));
      try { await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', selectedStudent.trackerId), { records: updatedRecords }); } catch (err) { console.error(err); }
  };

  // حذف الطالب من "المتابعة" فقط (لا يحذف من الأكاديمية)
  const handleDeleteTracker = async (id) => {
      if(!confirm("⚠️ هل أنت متأكد من حذف سجلات أوزان هذا الطالب؟ (لن يتم حذف الطالب من الأكاديمية)")) return;
      try {
          await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'fitness_tracking', id));
          setSelectedStudent(null);
      } catch (err) { console.error(err); }
  };

  const handlePrintTeam = () => { setPrintMode('team'); setTimeout(() => window.print(), 100); };
  const handlePrintIndividual = () => { if(!selectedStudent) return; setPrintMode('individual'); setTimeout(() => window.print(), 100); };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 relative">
      
      {/* --- Sidebar (All Students) --- */}
      <div className={`md:w-1/3 w-full bg-[#111] border border-white/10 rounded-3xl p-4 flex flex-col ${selectedStudent ? 'hidden md:flex' : 'flex'}`}>
        <div className="mb-4 space-y-3">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-white flex items-center gap-2"><Scale className="text-yellow-500"/> مراقبة الوزن</h2>
                <div className="flex gap-2">
                    <button onClick={handlePrintTeam} className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-xl" title="طباعة القائمة"><Printer size={20}/></button>
                    {/* زر الإضافة للمجموعات */}
                    <button onClick={() => { setTargetTeamName(''); setShowBulkAddModal(true); }} className="bg-yellow-500 hover:bg-yellow-400 text-black p-2 rounded-xl font-bold flex items-center gap-1" title="إدارة المجموعات"><Users size={20}/></button>
                </div>
            </div>

            <div className="bg-white/5 p-2 rounded-xl border border-white/10 flex gap-2 items-center">
                <CalendarIcon size={16} className="text-gray-500"/>
                <input type="date" className="bg-transparent text-white text-[10px] w-24 outline-none" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})}/>
                <span className="text-gray-500 text-xs">إلى</span>
                <input type="date" className="bg-transparent text-white text-[10px] w-24 outline-none" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})}/>
                {(dateRange.from || dateRange.to) && <button onClick={() => setDateRange({from:'', to:''})} className="text-red-500 ml-auto"><X size={14}/></button>}
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                {distinctTeamsForTabs.map(team => (
                    <button key={team} onClick={() => setActiveTeam(team)} className={`whitespace-nowrap px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${activeTeam === team ? 'bg-white text-black border-white' : 'bg-black text-gray-400 border-white/10 hover:border-white/30'}`}>{team}</button>
                ))}
            </div>
        </div>

        <div className="relative mb-3">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={16}/>
            <input className="w-full bg-black border border-white/20 text-white rounded-xl py-2 pr-9 pl-3 text-sm outline-none focus:border-yellow-500" placeholder="بحث عن طالب..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}/>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {filteredList.map(student => {
                const lastRecord = student.records?.[0];
                const prevRecord = student.records?.[1];
                const stats = lastRecord ? calculateStats(lastRecord, prevRecord) : null;
                const birthYear = getBirthYear(student.birthDate);

                return (
                    <div key={student.id} onClick={() => handleSelectStudent(student)} className={`p-4 rounded-2xl cursor-pointer border transition-all hover:bg-white/5 relative group ${selectedStudent?.id === student.id ? 'bg-white/10 border-yellow-500' : 'bg-white/5 border-transparent'}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-white text-sm">{student.name}</h3>
                                    {/* علامة تبين إذا كان الطالب نشط في المتابعة */}
                                    {student.trackerId ? (
                                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" title="يتم متابعته"></div>
                                    ) : (
                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-700" title="غير مراقب"></div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-1 items-center">
                                    <span className="text-[10px] text-gray-500">{birthYear}</span>
                                    {/* عرض التاغات */}
                                    <div className="flex flex-wrap gap-1">
                                        {student.teams.slice(0, 2).map(team => (
                                            <span key={team} className="text-[9px] text-blue-300 border border-blue-500/30 bg-blue-900/20 px-1 rounded">{team}</span>
                                        ))}
                                        {student.teams.length > 2 && <span className="text-[9px] text-gray-500">+{student.teams.length - 2}</span>}
                                    </div>
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
        </div>
      </div>

      {/* --- Main Area --- */}
      <div className={`md:w-2/3 w-full bg-[#111] border border-white/10 rounded-3xl flex flex-col ${selectedStudent ? 'flex' : 'hidden md:hidden'} overflow-hidden`}>
        {selectedStudent ? (
            <>
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#151515] flex justify-between items-start">
                    <div>
                        <button onClick={() => setSelectedStudent(null)} className="md:hidden text-gray-400 mb-2 flex items-center gap-1 text-xs">رجوع</button>
                        <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-white">{selectedStudent.name}</h2>
                            <span className="text-sm font-bold bg-yellow-500 text-black px-2 py-0.5 rounded">{getBirthYear(selectedStudent.birthDate)}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                            {selectedStudent.teams.length > 0 ? selectedStudent.teams.map(team => (
                                <span key={team} className="flex items-center gap-1 text-blue-400 font-bold bg-blue-900/20 px-2 py-0.5 rounded text-xs border border-blue-500/20">
                                    <Briefcase size={10}/> {team}
                                </span>
                            )) : <span className="text-gray-500 text-xs">لا يوجد فرق مسجلة</span>}
                            <div className="w-px h-4 bg-gray-700 mx-2"></div>
                            {selectedStudent.targetClass && <span className="text-green-400 font-bold text-xs bg-green-900/10 px-2 py-0.5 rounded border border-green-500/20">هدف: {selectedStudent.targetClass}</span>}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* زر الحذف يظهر فقط إذا كان الطالب مراقباً (لديه trackerId) */}
                        {selectedStudent.trackerId && (
                            <button onClick={() => handleDeleteTracker(selectedStudent.trackerId)} className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all" title="حذف سجلات الوزن"><Trash2 size={20}/></button>
                        )}
                        <button onClick={handlePrintIndividual} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10"><Printer size={20}/></button>
                        <button onClick={() => { setShowSettingsModal(true); }} className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10"><Settings size={20}/></button>
                        <button onClick={() => setShowMeasureModal(true)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold shadow-lg shadow-yellow-500/20"><Plus size={20}/> قياس</button>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-48 w-full p-4 bg-black/20 border-b border-white/5">
                     {chartData.length > 1 ? (
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={chartData}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                 <XAxis dataKey="name" stroke="#666" fontSize={10} tick={{dy: 5}}/>
                                 <YAxis stroke="#666" fontSize={10} domain={['dataMin - 2', 'dataMax + 2']}/>
                                 <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333', color: '#fff'}} />
                                 <Line type="monotone" dataKey="weight" stroke="#eab308" strokeWidth={3} dot={{fill: '#eab308'}} activeDot={{r: 8}} />
                             </LineChart>
                         </ResponsiveContainer>
                     ) : (
                         <div className="h-full flex items-center justify-center text-gray-600 text-xs">سجل قياسات لإظهار الرسم البياني</div>
                     )}
                </div>

                {/* History */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    <h3 className="text-gray-500 text-xs font-bold mb-4 uppercase tracking-widest">سجل القياسات</h3>
                    {selectedStudent.records && selectedStudent.records.length > 0 ? (
                        <div className="space-y-3">
                            {selectedStudent.records.map((record, idx) => {
                                const prev = selectedStudent.records[idx + 1];
                                const stats = calculateStats(record, prev);
                                return (
                                    <div key={record.id} className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group relative hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-black/40 px-3 py-2 rounded-lg text-center min-w-[60px]">
                                                <span className="block text-white font-bold text-sm">{record.date.split('-')[2]}/{record.date.split('-')[1]}</span>
                                                <span className="block text-blue-400 font-mono text-[10px] mt-1">{record.time || '--:--'}</span>
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
                            <Activity size={40} className="opacity-20 mb-2"/><p>لا يوجد سجلات سابقة</p>
                        </div>
                    )}
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500"><Scale size={64} className="opacity-20 mb-4"/><p>اختر طالباً من القائمة (الكل)</p></div>
        )}
      </div>

      {/* --- Bulk Add Modal --- */}
      <AnimatePresence>
        {showBulkAddModal && (
            <div className="fixed inset-0 bg-black/90 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2"><Users className="text-yellow-500"/> إضافة طلاب للفرق</h3>
                        <button onClick={() => setShowBulkAddModal(false)} className="p-2 bg-white/5 rounded-full text-white hover:bg-white/10"><X size={20}/></button>
                    </div>
                    <div className="p-5 bg-black/20 border-b border-white/10">
                        <label className="block text-xs font-bold text-gray-400 mb-2">1. اكتب اسم الفريق:</label>
                        <div className="flex gap-2">
                            <input className="flex-1 bg-black border border-white/20 text-white rounded-xl p-3 text-sm outline-none focus:border-yellow-500" placeholder="اسم الفريق..." value={targetTeamName} onChange={(e) => setTargetTeamName(e.target.value)} list="teams-list"/>
                            <datalist id="teams-list">{allTeams.map(t => <option key={t} value={t}/>)}</datalist>
                        </div>
                    </div>
                    <div className="p-4 border-b border-white/10"><input className="w-full bg-black border border-white/20 text-white rounded-xl py-3 px-3 text-sm outline-none focus:border-yellow-500" placeholder="بحث..." value={bulkSearch} onChange={(e) => setBulkSearch(e.target.value)}/></div>
                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {filteredList.filter(s => s.name.includes(bulkSearch)).map(s => {
                                const isSelected = selectedBulkIds.includes(s.id);
                                return (
                                    <div key={s.id} onClick={() => isSelected ? setSelectedBulkIds(prev => prev.filter(id => id !== s.id)) : setSelectedBulkIds(prev => [...prev, s.id])} className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${isSelected ? 'bg-yellow-500/20 border-yellow-500' : 'bg-white/5 border-transparent hover:bg-white/10'}`}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-yellow-500 border-yellow-500' : 'border-gray-500'}`}>{isSelected && <CheckCircle size={14} className="text-black"/>}</div>
                                        <div><p className="text-white font-bold text-sm">{s.name}</p><p className="text-gray-400 text-xs">{getBirthYear(s.birthDate || s.dob)}</p></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="p-4 border-t border-white/10 bg-[#151515] flex justify-between items-center">
                        <span className="text-gray-400 text-sm">تم تحديد: <strong className="text-white">{selectedBulkIds.length}</strong></span>
                        <button onClick={handleBulkAdd} disabled={selectedBulkIds.length === 0 || !targetTeamName} className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold">إضافة للفريق</button>
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
                    <div className="mb-6 p-4 bg-black/30 rounded-xl border border-white/10">
                        <label className="block text-xs font-bold text-gray-400 mb-2">إدارة الفرق:</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {selectedStudent.teams.map(team => (
                                <span key={team} className="flex items-center gap-1 text-xs bg-blue-900/30 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-lg">
                                    {team} <button onClick={() => handleRemoveTeamFromStudent(team)} className="hover:text-red-400"><X size={12}/></button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2"><input className="flex-1 bg-black border border-white/20 p-2 rounded-lg text-xs text-white outline-none" placeholder="إضافة فريق جديد..." value={newTeamInput} onChange={e => setNewTeamInput(e.target.value)}/><button onClick={handleAddTeamToStudent} className="bg-green-600 text-white p-2 rounded-lg"><Plus size={14}/></button></div>
                    </div>
                    <form onSubmit={handleUpdateSettings} className="space-y-4">
                        <div><label className="block text-xs font-bold text-gray-400 mb-1">الوزن المستهدف (kg)</label><input type="number" step="0.1" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={targetSettings.targetWeight} onChange={e => setTargetSettings({...targetSettings, targetWeight: e.target.value})}/></div>
                        <div><label className="block text-xs font-bold text-gray-400 mb-1">الفئة المستهدفة</label><input className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={targetSettings.targetClass} onChange={e => setTargetSettings({...targetSettings, targetClass: e.target.value})} placeholder="مثال: -45kg"/></div>
                        <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowSettingsModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 font-bold">إلغاء</button><button type="submit" className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400">حفظ</button></div>
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
                        <div className="flex gap-3">
                            <div className="flex-1"><label className="block text-xs font-bold text-gray-400 mb-1">التاريخ</label><input type="date" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={newMeasure.date} onChange={e => setNewMeasure({...newMeasure, date: e.target.value})}/></div>
                            <div className="flex-1"><label className="block text-xs font-bold text-gray-400 mb-1">الوقت</label><input type="time" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={newMeasure.time} onChange={e => setNewMeasure({...newMeasure, time: e.target.value})}/></div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1"><label className="block text-xs font-bold text-gray-400 mb-1">الوزن (kg) <span className="text-red-500">*</span></label><input type="number" step="0.1" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500 font-bold text-lg" value={newMeasure.weight} onChange={e => setNewMeasure({...newMeasure, weight: e.target.value})} autoFocus/></div>
                            <div className="flex-1"><label className="block text-xs font-bold text-gray-400 mb-1">الطول (cm)</label><input type="number" className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500" value={newMeasure.height} onChange={e => setNewMeasure({...newMeasure, height: e.target.value})}/></div>
                        </div>
                        <div><label className="block text-xs font-bold text-gray-400 mb-1">ملاحظات</label><textarea className="w-full bg-black border border-white/20 p-3 rounded-xl text-white outline-none focus:border-yellow-500 h-20 text-sm" value={newMeasure.note} onChange={e => setNewMeasure({...newMeasure, note: e.target.value})}/></div>
                        <div className="flex gap-3 pt-4"><button type="button" onClick={() => setShowMeasureModal(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-300 font-bold">إلغاء</button><button type="submit" className="flex-1 py-3 rounded-xl bg-yellow-500 text-black font-bold hover:bg-yellow-400">حفظ</button></div>
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

      {/* --- Print Layouts --- */}
      <div className="print-area hidden">
          {printMode === 'team' && (
              <>
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-3xl font-black mb-2 text-black">أكاديمية الشجاع للتايكواندو</h1>
                    <h2 className="text-xl font-bold text-black">تقرير جاهزية الفريق {activeTeam !== 'الكل' ? `(${activeTeam})` : ''}</h2>
                    {dateRange.from && dateRange.to && <p className="text-sm mt-1">الفترة: من {dateRange.from} إلى {dateRange.to}</p>}
                </div>
                <table>
                    <thead><tr><th>#</th><th>الاسم</th><th>الميلاد</th>{dateRange.from ? <th>الوزن (بداية)</th> : null}<th>الوزن {dateRange.to ? '(نهاية)' : 'الحالي'}</th>{dateRange.from ? <th>التغيير</th> : null}<th>الفئة</th></tr></thead>
                    <tbody>
                        {filteredList.filter(s => s.trackerId).map((t, i) => { // فقط من لهم سجل
                            let startRec = null; let endRec = t.records?.[0]; 
                            if (dateRange.from && dateRange.to) {
                                const inRange = t.records?.filter(r => r.date >= dateRange.from && r.date <= dateRange.to);
                                if (inRange && inRange.length > 0) { startRec = inRange[inRange.length - 1]; endRec = inRange[0]; } else { startRec = null; endRec = null; }
                            }
                            const startW = startRec ? Number(startRec.weight) : '-';
                            const endW = endRec ? Number(endRec.weight) : '-';
                            const diff = (startW !== '-' && endW !== '-') ? (endW - startW).toFixed(1) : '-';
                            return (
                                <tr key={i}>
                                    <td>{i + 1}</td><td style={{textAlign: 'right', fontWeight: 'bold'}}>{t.name}</td><td>{getBirthYear(t.birthDate)}</td>
                                    {dateRange.from ? <td>{startW}</td> : null}<td>{endW}</td>{dateRange.from ? <td style={{direction: 'ltr', fontWeight: 'bold'}}>{diff > 0 ? `+${diff}` : diff}</td> : null}<td>{t.targetClass || '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
              </>
          )}
          {printMode === 'individual' && selectedStudent && (
             <>
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-3xl font-black mb-2 text-black">أكاديمية الشجاع للتايكواندو</h1>
                    <h2 className="text-xl font-bold text-black">سجل متابعة اللاعب: {selectedStudent.name}</h2>
                    <div className="flex justify-center gap-4 mt-2 font-bold text-sm"><span>الميلاد: {getBirthYear(selectedStudent.birthDate)}</span><span>|</span><span>الفريق: {selectedStudent.teams.join('، ')}</span><span>|</span><span>الهدف: {selectedStudent.targetClass || 'غير محدد'}</span></div>
                </div>
                <div style={{marginBottom: '20px', border: '1px solid #ccc', padding: '10px', textAlign: 'center'}}>
                    <p>ملخص الأداء</p>
                    <div style={{display: 'flex', justifyContent: 'space-around', marginTop: '10px'}}>
                         <div>الوزن الحالي: <strong>{selectedStudent.records?.[0]?.weight || '-'} kg</strong></div>
                         <div>الوزن المستهدف: <strong>{selectedStudent.targetWeight || '-'} kg</strong></div>
                         <div>عدد القياسات: <strong>{selectedStudent.records?.length || 0}</strong></div>
                    </div>
                </div>
                <table>
                    <thead><tr><th>التاريخ / الوقت</th><th>الوزن (kg)</th><th>الطول (cm)</th><th>التغيير</th><th>ملاحظات</th></tr></thead>
                    <tbody>
                        {selectedStudent.records?.map((r, i) => {
                            const prev = selectedStudent.records[i + 1];
                            const diff = prev ? (r.weight - prev.weight).toFixed(1) : '-';
                            return (<tr key={i}><td>{r.date} <span style={{fontSize:'10px'}}>({r.time})</span></td><td style={{fontWeight: 'bold'}}>{r.weight}</td><td>{r.height || '-'}</td><td style={{direction: 'ltr'}}>{diff > 0 ? `+${diff}` : diff}</td><td>{r.note}</td></tr>);
                        })}
                    </tbody>
                </table>
             </>
          )}
          <div className="mt-8 flex justify-between text-sm font-bold text-black"><p>تاريخ الطباعة: {new Date().toLocaleDateString('ar-JO')}</p><p>توقيع المدرب: .........................</p></div>
      </div>
    </div>
  );
};

export default WeightTracker;
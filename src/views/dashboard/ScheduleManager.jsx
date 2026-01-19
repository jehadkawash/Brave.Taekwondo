// src/views/dashboard/ScheduleManager.jsx
import React, { useState } from 'react';
import { Trash2, Plus, Calendar, Clock, MapPin, Layers } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';

export default function ScheduleManager({ schedule, scheduleCollection }) {
  const [form, setForm] = useState({ level: '', days: '', time: '', branch: '' });

  const addClass = async (e) => { 
      e.preventDefault(); 
      await scheduleCollection.add({ ...form }); 
      setForm({ level: '', days: '', time: '', branch: '' }); 
  };

  const deleteClass = async (id) => { 
      if (confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
          await scheduleCollection.remove(id); 
      }
  };
  
  return (
    <div className="space-y-8 animate-fade-in font-sans pb-20 md:pb-0">
      
      {/* --- Add Class Form --- */}
      <Card title="إضافة حصة جديدة" icon={Plus}>
          <form onSubmit={addClass} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                      <Layers size={12}/> المستوى / الفئة
                  </label>
                  <input 
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors placeholder-slate-600" 
                      value={form.level} 
                      onChange={e=>setForm({...form, level:e.target.value})} 
                      placeholder="مثال: حزام أبيض - أطفال"
                      required 
                  />
              </div>
              
              <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                      <Calendar size={12}/> الأيام
                  </label>
                  <input 
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors placeholder-slate-600" 
                      value={form.days} 
                      onChange={e=>setForm({...form, days:e.target.value})} 
                      placeholder="مثال: أحد - ثلاثاء - خميس"
                      required 
                  />
              </div>

              <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                      <Clock size={12}/> الوقت
                  </label>
                  <input 
                      type="text"
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors placeholder-slate-600 dir-ltr text-right" 
                      value={form.time} 
                      onChange={e=>setForm({...form, time:e.target.value})} 
                      placeholder="4:00 PM - 5:00 PM"
                      required 
                  />
              </div>

              <div>
                  <label className="text-xs font-bold text-slate-400 block mb-2 flex items-center gap-1">
                      <MapPin size={12}/> الفرع
                  </label>
                  <select 
                      className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors cursor-pointer"
                      value={form.branch}
                      onChange={e=>setForm({...form, branch:e.target.value})}
                      required
                  >
                      <option value="" disabled>اختر الفرع</option>
                      <option value="شفا بدران">شفا بدران</option>
                      <option value="أبو نصير">أبو نصير</option>
                  </select>
              </div>

              <Button type="submit" className="w-full bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 shadow-lg shadow-yellow-500/20 py-3 rounded-xl">
                  <Plus size={18}/> إضافة
              </Button>
          </form>
      </Card>

      {/* --- Schedule Grid --- */}
      <div>
          <h3 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-blue-500"/> جدول الحصص الحالي
          </h3>
          
          {schedule.length === 0 ? (
              <div className="text-center p-12 bg-slate-900 rounded-2xl border border-slate-800 border-dashed text-slate-500">
                  لا يوجد حصص مضافة حالياً
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {schedule.map(c => (
                      <div key={c.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg hover:border-slate-700 transition-all group relative overflow-hidden">
                          {/* Top Border Accent */}
                          <div className={`absolute top-0 left-0 w-full h-1 ${c.branch === 'شفا بدران' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                          
                          <div className="flex justify-between items-start mb-4">
                              <div>
                                  <h4 className="font-bold text-lg text-slate-100 group-hover:text-yellow-500 transition-colors">{c.level}</h4>
                                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${c.branch === 'شفا بدران' ? 'bg-blue-900/20 text-blue-400 border-blue-500/20' : 'bg-emerald-900/20 text-emerald-400 border-emerald-500/20'}`}>
                                      {c.branch}
                                  </span>
                              </div>
                              <button 
                                  onClick={()=>deleteClass(c.id)} 
                                  className="text-slate-600 hover:text-red-500 hover:bg-red-900/10 p-2 rounded-lg transition-all"
                                  title="حذف الحصة"
                              >
                                  <Trash2 size={18}/>
                              </button>
                          </div>
                          
                          <div className="space-y-2">
                              <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                                  <Calendar size={14} className="text-slate-500"/>
                                  <span>{c.days}</span>
                              </div>
                              <div className="flex items-center gap-2 text-slate-400 text-sm bg-slate-950/50 p-2 rounded-lg border border-slate-800/50">
                                  <Clock size={14} className="text-slate-500"/>
                                  <span dir="ltr">{c.time}</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
    </div>
  );
}
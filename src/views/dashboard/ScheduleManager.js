import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';

export default function ScheduleManager({ schedule, scheduleCollection }) {
  const [form, setForm] = useState({ level: '', days: '', time: '', branch: '' });
  const addClass = async (e) => { e.preventDefault(); await scheduleCollection.add({ ...form }); setForm({ level: '', days: '', time: '', branch: '' }); };
  const deleteClass = async (id) => { if (confirm('حذف؟')) await scheduleCollection.remove(id); };
  
  return (
    <div className="space-y-6">
      <Card title="إضافة حصة"><form onSubmit={addClass} className="grid grid-cols-2 gap-4 items-end"><div><label className="text-xs block mb-1">المستوى</label><input className="w-full border p-2 rounded" value={form.level} onChange={e=>setForm({...form, level:e.target.value})} required /></div><div><label className="text-xs block mb-1">الأيام</label><input className="w-full border p-2 rounded" value={form.days} onChange={e=>setForm({...form, days:e.target.value})} required /></div><div><label className="text-xs block mb-1">الوقت</label><input className="w-full border p-2 rounded" value={form.time} onChange={e=>setForm({...form, time:e.target.value})} required /></div><div><label className="text-xs block mb-1">الفرع</label><input className="w-full border p-2 rounded" value={form.branch} onChange={e=>setForm({...form, branch:e.target.value})} required /></div><Button type="submit">إضافة</Button></form></Card>
      <div className="grid md:grid-cols-2 gap-4">{schedule.map(c=><div key={c.id} className="bg-white p-4 rounded border flex justify-between"><div><h4 className="font-bold">{c.level}</h4><p className="text-xs text-gray-500">{c.days} | {c.time}</p></div><button onClick={()=>deleteClass(c.id)} className="text-red-500"><Trash2 size={16}/></button></div>)}</div>
    </div>
  );
}
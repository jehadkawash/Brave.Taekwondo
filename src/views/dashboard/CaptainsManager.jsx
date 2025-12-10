import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { BRANCHES } from '../../lib/constants';

export default function CaptainsManager({ captains, captainsCollection }) {
    const [form, setForm] = useState({ name: '', branch: BRANCHES.SHAFA, username: '', password: '', salary: '', holidays: [], withdrawals: [] });
    const [editingId, setEditingId] = useState(null);

    const handleSave = async (e) => {
        e.preventDefault();
        if(editingId) { await captainsCollection.update(editingId, form); setEditingId(null); } else { await captainsCollection.add({ ...form, role: 'captain' }); }
        setForm({ name: '', branch: BRANCHES.SHAFA, username: '', password: '', salary: '', holidays: [], withdrawals: [] });
    };

    return (
        <div className="space-y-6">
            <Card title="إدارة الكباتن"><form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2"><input className="border p-2 rounded" placeholder="الاسم" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/><select className="border p-2 rounded" value={form.branch} onChange={e=>setForm({...form, branch:e.target.value})}><option value={BRANCHES.SHAFA}>شفا بدران</option><option value={BRANCHES.ABU_NSEIR}>أبو نصير</option></select><input className="border p-2 rounded" placeholder="User" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required/><input className="border p-2 rounded" placeholder="Pass" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/><input className="border p-2 rounded" type="number" placeholder="الراتب الأساسي" value={form.salary} onChange={e=>setForm({...form, salary:e.target.value})} /><Button type="submit">{editingId ? 'حفظ التعديل' : 'إضافة كابتن'}</Button></form></Card>
            <div className="grid gap-4 md:grid-cols-2">{captains.map(cap => (<Card key={cap.id} className="border-l-4 border-purple-500"><div className="flex justify-between flex-wrap gap-2"><div><h4 className="font-bold">{cap.name}</h4><p className="text-xs text-gray-500">الراتب: {cap.salary} | User: {cap.username} | Pass: {cap.password}</p></div><div className="flex gap-2 items-start"><button onClick={()=>{setEditingId(cap.id); setForm(cap);}} className="text-blue-500"><Edit size={16}/></button><button onClick={()=>captainsCollection.remove(cap.id)} className="text-red-500"><Trash2 size={16}/></button></div></div></Card>))}</div>
        </div>
    );
}
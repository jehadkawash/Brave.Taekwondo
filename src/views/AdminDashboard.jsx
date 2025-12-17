// src/views/dashboard/StudentsManager.jsx
import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { UserPlus, Edit, Archive, ArrowUp, MessageCircle, Phone, X, Search, Filter, SortAsc, SortDesc, Send, Sparkles } from 'lucide-react';
import { Button, Card, StatusBadge } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

// ... (Helper Functions & ModalOverlay remain the same) ...
const ModalOverlay = ({ children, onClose }) => {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto"><div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div><div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0"><div className="relative transform overflow-hidden rounded-2xl text-right shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl bg-white" onClick={e => e.stopPropagation()}>{children}</div></div></div>, document.body
  );
};

const StudentsManager = ({ students, studentsCollection, archiveCollection, selectedBranch, logActivity, groups = [] }) => {
  const [search, setSearch] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('all'); 
  const [sortOption, setSortOption] = useState('joinDateDesc'); 
  const [showModal, setShowModal] = useState(false); 
  const [editingStudent, setEditingStudent] = useState(null); 
  const [createdCreds, setCreatedCreds] = useState(null);
  
  // استخراج أسماء المجموعات من البيانات الممررة من Firebase
  const availableGroups = useMemo(() => groups.map(g => g.name), [groups]);

  const defaultForm = { name: '', phone: '', belt: 'أبيض', group: '', joinDate: new Date().toISOString().split('T')[0], dob: '', address: '', balance: 0, subEnd: '', username: '', password: '' };
  const [newS, setNewS] = useState(defaultForm);
  const [linkFamily, setLinkFamily] = useState('new');
  
  const uniqueFamilies = [...new Map(students.map(item => [item.familyId, item.familyName])).entries()];

  const processedStudents = useMemo(() => {
      let result = [...students];
      if (search) { const lower = search.toLowerCase(); result = result.filter(s => s.name.toLowerCase().includes(lower) || s.phone.includes(lower) || s.username.toLowerCase().includes(lower)); }
      if (statusFilter !== 'all') { /* ... existing logic ... */ }
      result.sort((a, b) => { /* ... existing logic ... */ return 0; });
      return result;
  }, [students, search, statusFilter, sortOption]);

  const addStudent = async (e) => {
    e.preventDefault(); 
    // ... (Your existing add logic, ensure group is saved)
    const finalGroup = newS.group || (availableGroups.length > 0 ? availableGroups[0] : "الكل");
    const student = { /* ... */ ...newS, group: finalGroup, branch: selectedBranch, status: 'active', customOrder: Date.now() };
    // ... save to collection
    await studentsCollection.add(student);
    closeModal();
  };

  // ... (rest of functions: openEditModal, handleSaveEdit, etc.)

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      {/* ... (Creds Modal & Filter Toolbar) ... */}
      
      {/* ... (Table View & Mobile View) ... */}

      {showModal && (
        <ModalOverlay onClose={() => setShowModal(false)}>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4"><h3 className="text-xl font-bold">{editingStudent ? "تعديل" : "جديد"}</h3><button onClick={() => setShowModal(false)}><X/></button></div>
                <form onSubmit={editingStudent ? (() => {}) : addStudent}> {/* Add correct handler */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* ... other inputs ... */}
                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-blue-800 mb-1">الفترة / المجموعة</label>
                             <select className="w-full border p-2 rounded-xl" value={newS.group} onChange={e=>setNewS({...newS, group:e.target.value})}>
                                <option value="">بدون تحديد</option>
                                {availableGroups.map((g, idx) => <option key={idx} value={g}>{g}</option>)}
                             </select>
                        </div>
                        {/* ... rest of form ... */}
                    </div>
                    {/* ... buttons ... */}
                </form>
            </div>
        </ModalOverlay>
      )}
    </div>
  );
};

export default StudentsManager;
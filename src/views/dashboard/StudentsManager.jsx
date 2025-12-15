import React, { useState } from 'react';
import {
  UserPlus, Edit, Archive, ArrowUp, MessageCircle,
  X, Save, User, Phone, MapPin, CreditCard, Users
} from 'lucide-react';
import { Button, Card, StatusBadge } from '../../components/UIComponents';
import { BELTS } from '../../lib/constants';

/* ================== دوال مساعدة ================== */

// توليد بيانات الدخول
const generateCredentials = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const username = `student${randomNum}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return { username, password };
};

// استخراج الاسم الأخير (اسم العائلة)
const extractLastName = (fullName) => {
  if (!fullName) return "الجديدة";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : parts[0];
};

// حساب حالة الاشتراك
const calculateStatus = (dateString) => {
  if (!dateString) return 'expired';
  const today = new Date();
  const end = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'near_end';
  return 'active';
};

/* ================== المكون ================== */

const StudentsManager = ({
  students,
  studentsCollection,
  archiveCollection,
  selectedBranch,
  logActivity
}) => {

  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [createdCreds, setCreatedCreds] = useState(null);

  const [newS, setNewS] = useState({
    name: '',
    phone: '',
    belt: 'أبيض',
    joinDate: new Date().toISOString().split('T')[0],
    dob: '',
    address: '',
    balance: 0,
    subEnd: ''
  });

  const [linkFamily, setLinkFamily] = useState('new');

  // استخراج العائلات الحالية
  const uniqueFamilies = [
    ...new Map(students.map(s => [s.familyId, s.familyName])).entries()
  ];

  const filtered = students.filter(s => s.name.includes(search));

  /* ================== إضافة طالب ================== */

  const addStudent = async (e) => {
    e.preventDefault();

    const { username, password } = generateCredentials();
    const lastName = extractLastName(newS.name);

    let finalFamilyId;
    let finalFamilyName;

    if (linkFamily === 'new') {
      // هل يوجد إخوة بنفس الاسم الأخير؟
      const existingFamily = students.find(
        s => extractLastName(s.name) === lastName
      );

      if (existingFamily) {
        finalFamilyId = existingFamily.familyId;
        finalFamilyName = existingFamily.familyName;
      } else {
        finalFamilyId = Date.now();
        finalFamilyName = `عائلة ${lastName}`;
      }
    } else {
      finalFamilyId = Number(linkFamily);
      finalFamilyName =
        students.find(s => s.familyId === finalFamilyId)?.familyName
        || `عائلة ${lastName}`;
    }

    // حساب نهاية الاشتراك
    const joinDateObj = new Date(newS.joinDate);
    const subEndDateObj = new Date(joinDateObj);
    subEndDateObj.setMonth(subEndDateObj.getMonth() + 1);

    const student = {
      ...newS,
      balance: Number(newS.balance),
      branch: selectedBranch,
      familyId: finalFamilyId,
      familyName: finalFamilyName,
      username,
      password,
      status: 'active',
      subEnd: subEndDateObj.toISOString().split('T')[0],
      notes: [],
      internalNotes: [],
      attendance: {},
      customOrder: Date.now()
    };

    await studentsCollection.add(student);
    logActivity?.("إضافة طالب", `تم إضافة الطالب ${student.name}`);

    setCreatedCreds({
      name: student.name,
      username,
      password,
      familyName: finalFamilyName
    });

    closeModal();
  };

  /* ================== تعديل ================== */

  const openEditModal = (student) => {
    setEditingStudent(student);
    setNewS({
      name: student.name,
      phone: student.phone,
      belt: student.belt,
      joinDate: student.joinDate,
      dob: student.dob,
      address: student.address || '',
      balance: student.balance,
      subEnd: student.subEnd
    });
    setShowModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    await studentsCollection.update(editingStudent.id, {
      ...newS,
      balance: Number(newS.balance)
    });
    logActivity?.("تعديل طالب", `تم تعديل بيانات ${newS.name}`);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
    setLinkFamily('new');
    setNewS({
      name: '',
      phone: '',
      belt: 'أبيض',
      joinDate: new Date().toISOString().split('T')[0],
      dob: '',
      address: '',
      balance: 0,
      subEnd: ''
    });
  };

  /* ================== إجراءات ================== */

  const promoteBelt = async (student) => {
    const idx = BELTS.indexOf(student.belt);
    if (idx < BELTS.length - 1) {
      await studentsCollection.update(student.id, {
        belt: BELTS[idx + 1]
      });
      logActivity?.("ترفيع", `ترفيع ${student.name}`);
    }
  };

  const archiveStudent = async (student) => {
    if (!window.confirm(`أرشفة ${student.name}؟`)) return;

    await archiveCollection.add({
      ...student,
      archivedAt: new Date().toISOString().split('T')[0],
      originalId: student.id
    });

    await studentsCollection.remove(student.id);
    logActivity?.("أرشفة", `أرشفة ${student.name}`);
  };

  const openWhatsApp = (phone) => {
    if (!phone) return;
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = clean.slice(1);
    window.open(`https://wa.me/962${clean}`, '_blank');
  };

  /* ================== JSX ================== */

  return (
    <div className="space-y-6">

      {/* نافذة بيانات الدخول */}
      {createdCreds && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[200]">
          <Card className="max-w-md w-full p-6 text-center">
            <h3 className="font-bold mb-2">تم إنشاء الحساب</h3>
            <p className="text-sm mb-3">{createdCreds.familyName}</p>
            <div className="bg-gray-50 p-4 rounded">
              <p>U: <b>{createdCreds.username}</b></p>
              <p className="text-red-600">P: <b>{createdCreds.password}</b></p>
            </div>
            <Button className="mt-4 w-full" onClick={() => setCreatedCreds(null)}>
              إغلاق
            </Button>
          </Card>
        </div>
      )}

      {/* الشريط العلوي */}
      <div className="flex justify-between items-center">
        <input
          className="border p-2 rounded w-1/3"
          placeholder="بحث عن طالب..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <Button onClick={() => setShowModal(true)}>
          <UserPlus size={16}/> طالب جديد
        </Button>
      </div>

      {/* الجدول */}
      <Card noPadding>
        <table className="w-full text-right text-sm">
          <thead className="bg-gray-50 font-bold">
            <tr>
              <th className="p-3">الطالب</th>
              <th className="p-3">بيانات الدخول</th>
              <th className="p-3">الهاتف</th>
              <th className="p-3">الحزام</th>
              <th className="p-3">الحالة</th>
              <th className="p-3 text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-t">
                <td className="p-3">
                  <b>{s.name}</b>
                  <div className="text-xs text-blue-600">{s.familyName}</div>
                </td>
                <td className="p-3 font-mono text-xs">
                  U: {s.username}<br/>P: <span className="text-red-600">{s.password}</span>
                </td>
                <td className="p-3">
                  {s.phone}
                  <button onClick={() => openWhatsApp(s.phone)} className="ml-2 text-green-600">
                    <MessageCircle size={14}/>
                  </button>
                </td>
                <td className="p-3">{s.belt}</td>
                <td className="p-3">
                  <StatusBadge status={calculateStatus(s.subEnd)} />
                </td>
                <td className="p-3 flex gap-2 justify-center">
                  <button onClick={() => promoteBelt(s)}><ArrowUp size={16}/></button>
                  <button onClick={() => openEditModal(s)}><Edit size={16}/></button>
                  <button onClick={() => archiveStudent(s)}><Archive size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* نافذة الإضافة / التعديل */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150]">
          <Card className="max-w-2xl w-full p-6">
            <form onSubmit={editingStudent ? handleSaveEdit : addStudent}>
              <input
                required
                className="border p-2 w-full mb-3"
                placeholder="الاسم الرباعي"
                value={newS.name}
                onChange={e => setNewS({...newS, name: e.target.value})}
              />

              {!editingStudent && (
                <select
                  className="border p-2 w-full mb-3"
                  value={linkFamily}
                  onChange={e => setLinkFamily(e.target.value)}
                >
                  <option value="new">تلقائي حسب الاسم الأخير</option>
                  {uniqueFamilies.map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              )}

              <Button type="submit" className="w-full">
                <Save size={16}/> حفظ
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudentsManager;

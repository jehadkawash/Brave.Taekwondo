// src/views/dashboard/NewsManager.jsx
import React, { useState } from 'react';
import { Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { addDoc, deleteDoc, doc, collection } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // استيراد دوال التخزين
import { db, appId, storage } from '../../lib/firebase'; // استيراد storage

const NewsManager = ({ news, newsCollection, selectedBranch }) => {
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', desc: '', image: '', branch: selectedBranch });
  const [imageFile, setImageFile] = useState(null); // لحفظ ملف الصورة المختار
  const [loading, setLoading] = useState(false);

  // دالة اختيار الصورة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // نحفظ الملف لنرفعه لاحقاً
      // عرض معاينة فقط للمستخدم
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem({ ...newItem, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // دالة الحفظ
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        let imageUrl = '';
        
        // 1. إذا اختار المستخدم صورة، نرفعها إلى Firebase Storage
        if (imageFile) {
            // ننشئ مساراً فريداً للصورة: news/التوقيت_اسم-الملف
            const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            // نحصل على الرابط العلني للصورة
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // 2. نحفظ البيانات في Firestore (مع الرابط بدلاً من الصورة الكاملة)
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'news'), {
            title: newItem.title,
            desc: newItem.desc,
            branch: newItem.branch,
            image: imageUrl, // الرابط القصير
            createdAt: new Date().toISOString()
        });

        alert("تم نشر الخبر بنجاح!");
        setShowModal(false);
        setNewItem({ title: '', desc: '', image: '', branch: selectedBranch });
        setImageFile(null);
    } catch (error) {
        console.error("Error adding news:", error);
        alert("حدث خطأ أثناء النشر، تأكد من الصلاحيات والاتصال.");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا الخبر؟")) {
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'news', id));
        // ملاحظة: يفضل مستقبلاً حذف الصورة من Storage أيضاً لتوفير المساحة
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
         <h2 className="font-bold text-lg">إدارة الأخبار والإعلانات</h2>
         <Button onClick={() => setShowModal(true)}><Plus size={18}/> خبر جديد</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {news.map(item => (
            <Card key={item.id} className="relative overflow-hidden group">
                <div className="aspect-video w-full bg-gray-100 relative">
                    {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300"><ImageIcon size={48}/></div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="danger" onClick={() => handleDelete(item.id)}><Trash2 size={18}/> حذف</Button>
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-2 inline-block">{item.branch}</span>
                </div>
            </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg" title="إضافة خبر جديد">
                <form onSubmit={handleAdd} className="space-y-4">
                    <div><label className="text-xs font-bold block mb-1">عنوان الخبر</label><input required className="w-full border p-2 rounded" value={newItem.title} onChange={e=>setNewItem({...newItem, title:e.target.value})} /></div>
                    <div><label className="text-xs font-bold block mb-1">التفاصيل</label><textarea required className="w-full border p-2 rounded h-24" value={newItem.desc} onChange={e=>setNewItem({...newItem, desc:e.target.value})} /></div>
                    <div>
                        <label className="text-xs font-bold block mb-1">صورة الخبر</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded bg-gray-50"/>
                        <p className="text-[10px] text-gray-400 mt-1">يفضل صور بالعرض (Landscape)</p>
                    </div>
                    {newItem.image && <img src={newItem.image} alt="preview" className="w-full h-32 object-cover rounded border" />}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={()=>setShowModal(false)}>إلغاء</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'جاري الرفع...' : 'نشر'}</Button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
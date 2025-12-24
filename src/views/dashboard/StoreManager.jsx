// src/views/dashboard/StoreManager.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Edit, Package } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { addDoc, deleteDoc, updateDoc, doc, collection } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, appId, storage } from '../../lib/firebase';

const StoreManager = ({ productsCollection, selectedBranch }) => {
  const products = productsCollection?.data || [];
  const myProducts = products.filter(p => p.branch === selectedBranch || p.branch === 'مشترك');

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: '', category: 'equipment' });
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'products'), {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: imageUrl,
        branch: selectedBranch,
        createdAt: new Date().toISOString()
      });

      alert("تمت إضافة المنتج بنجاح");
      setShowModal(false);
      setFormData({ name: '', price: '', stock: '', image: '', category: 'equipment' });
      setImageFile(null);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("حذف هذا المنتج؟")) {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
         <h2 className="font-bold text-lg flex items-center gap-2"><Package/> إدارة المخزون والمتجر</h2>
         <Button onClick={() => setShowModal(true)}><Plus size={18}/> منتج جديد</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {myProducts.map(item => (
            <Card key={item.id} className="relative group">
                <div className="h-40 bg-gray-100 rounded-t-xl overflow-hidden relative">
                    {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full"><Package size={40} className="text-gray-300"/></div>}
                </div>
                <div className="p-4">
                    <h3 className="font-bold">{item.name}</h3>
                    <div className="flex justify-between mt-2 text-sm">
                        <span className="font-bold text-green-600">{item.price} JD</span>
                        <span className={`px-2 rounded ${item.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>الكمية: {item.stock}</span>
                    </div>
                    <Button variant="danger" onClick={() => handleDelete(item.id)} className="w-full mt-3 text-xs">حذف المنتج</Button>
                </div>
            </Card>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md" title="إضافة منتج للمتجر">
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input placeholder="اسم المنتج (مثلاً: بدلة تايكواندو)" required className="w-full border p-2 rounded" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} />
                    <div className="flex gap-2">
                        <input type="number" placeholder="سعر البيع" required className="w-full border p-2 rounded" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} />
                        <input type="number" placeholder="الكمية المتوفرة" required className="w-full border p-2 rounded" value={formData.stock} onChange={e=>setFormData({...formData, stock:e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold block mb-1">صورة المنتج</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded bg-gray-50"/>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="ghost" onClick={()=>setShowModal(false)}>إلغاء</Button>
                        <Button type="submit" disabled={loading}>{loading ? 'جاري الحفظ...' : 'حفظ'}</Button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default StoreManager;
// src/views/dashboard/StoreManager.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Package, Tag, Layers, Image as ImageIcon } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { addDoc, deleteDoc, doc, collection } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, appId, storage } from '../../lib/firebase';

const StoreManager = ({ productsCollection, selectedBranch }) => {
  const products = productsCollection?.data || [];
  const myProducts = products.filter(p => p.branch === selectedBranch || p.branch === 'مشترك');

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', stock: '', image: '' });
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
      setFormData({ name: '', price: '', stock: '', image: '' });
      setImageFile(null);
    } catch (error) { console.error(error); alert("حدث خطأ"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("حذف هذا المنتج؟")) await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'products', id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
         <h2 className="font-bold text-lg flex items-center gap-2 text-gray-800"><Package className="text-yellow-500"/> إدارة المخزون والمتجر</h2>
         <Button onClick={() => setShowModal(true)} className="shadow-lg shadow-black/20"><Plus size={18}/> منتج جديد</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {myProducts.map(item => (
            <div key={item.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden">
                <div className="h-48 bg-gray-50 relative overflow-hidden">
                    {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
                    ) : (
                        <div className="flex items-center justify-center h-full"><Package size={48} className="text-gray-200"/></div>
                    )}
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                        {item.branch}
                    </div>
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-800 mb-1">{item.name}</h3>
                    <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-1 text-green-600 font-black text-lg bg-green-50 px-2 rounded-lg">
                            <span className="text-xs font-normal text-gray-400">JOD</span> {item.price}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1 ${item.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                            <Layers size={12}/> {item.stock} قطعة
                        </div>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="absolute top-2 left-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600 transform hover:scale-110">
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <Card className="w-full max-w-md animate-fade-in" title="إضافة منتج جديد">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">اسم المنتج</label>
                        <div className="relative">
                            <Tag size={18} className="absolute top-3 right-3 text-gray-400"/>
                            <input placeholder="مثلاً: بدلة تايكواندو" required className="w-full border-2 border-gray-100 p-2 pr-10 rounded-xl focus:border-yellow-500 outline-none" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 mb-1 block">السعر (JD)</label>
                            <input type="number" required className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-yellow-500 outline-none font-bold" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs font-bold text-gray-500 mb-1 block">الكمية</label>
                            <input type="number" required className="w-full border-2 border-gray-100 p-2 rounded-xl focus:border-yellow-500 outline-none font-bold" value={formData.stock} onChange={e=>setFormData({...formData, stock:e.target.value})} />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 mb-1 block">صورة المنتج</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer"/>
                            {formData.image ? (
                                <img src={formData.image} alt="Preview" className="h-32 mx-auto object-contain"/>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <ImageIcon size={32}/>
                                    <span className="text-xs mt-2">اضغط لرفع صورة</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="ghost" onClick={()=>setShowModal(false)}>إلغاء</Button>
                        <Button type="submit" disabled={loading} className="shadow-lg shadow-yellow-500/20">{loading ? 'جاري الحفظ...' : 'حفظ المنتج'}</Button>
                    </div>
                </form>
            </Card>
        </div>
      )}
    </div>
  );
};

export default StoreManager;
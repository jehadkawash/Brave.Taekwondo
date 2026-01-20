// src/views/dashboard/NewsManager.jsx
import React, { useState } from 'react';
import { Trash2, Plus, Image as ImageIcon, Megaphone, Loader2, X } from 'lucide-react';
import { Button, Card } from '../../components/UIComponents';
import { addDoc, deleteDoc, doc, collection } from "firebase/firestore"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { db, appId, storage } from '../../lib/firebase'; 

const NewsManager = ({ news, newsCollection, selectedBranch }) => {
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', desc: '', image: '', branch: selectedBranch });
  const [imageFile, setImageFile] = useState(null); 
  const [loading, setLoading] = useState(false);

  // دالة اختيار الصورة
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); 
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
        
        // 1. رفع الصورة
        if (imageFile) {
            const storageRef = ref(storage, `news/${Date.now()}_${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            imageUrl = await getDownloadURL(snapshot.ref);
        }

        // 2. حفظ البيانات
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'news'), {
            title: newItem.title,
            desc: newItem.desc,
            branch: newItem.branch,
            image: imageUrl, 
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
    }
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans pb-20 md:pb-0">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-2xl shadow-lg border border-slate-800">
         <h2 className="font-black text-xl text-slate-100 flex items-center gap-3">
             <Megaphone className="text-yellow-500"/> إدارة الأخبار والإعلانات
         </h2>
         <Button onClick={() => setShowModal(true)} className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-bold shadow-lg shadow-yellow-500/20 border-none">
             <Plus size={18}/> خبر جديد
         </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map(item => (
            <div key={item.id} className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden group hover:border-slate-700 transition-all">
                <div className="aspect-video w-full bg-slate-950 relative overflow-hidden">
                    {item.image ? (
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-700"><ImageIcon size={48}/></div>
                    )}
                    
                    {/* Delete Overlay */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                        <Button 
                            variant="danger" 
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 scale-90 group-hover:scale-100 transition-transform"
                        >
                            <Trash2 size={18}/> حذف الخبر
                        </Button>
                    </div>
                    
                    {/* Branch Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border backdrop-blur-md
                            ${item.branch === 'شفا بدران' 
                                ? 'bg-blue-900/40 text-blue-400 border-blue-500/30' 
                                : 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30'}`
                        }>
                            {item.branch}
                        </span>
                    </div>
                </div>
                
                <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-100 mb-2 line-clamp-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                        {item.desc}
                    </p>
                </div>
            </div>
        ))}
        {news.length === 0 && (
            <div className="col-span-full text-center py-16 bg-slate-900 rounded-2xl border border-slate-800 border-dashed text-slate-500">
                لا يوجد أخبار منشورة حالياً
            </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                    <h3 className="font-bold text-lg text-slate-100">إضافة خبر جديد</h3>
                    <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-red-500 transition-colors"><X size={24}/></button>
                </div>
                
                <form onSubmit={handleAdd} className="p-6 space-y-5">
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2">عنوان الخبر</label>
                        <input 
                            required 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors placeholder-slate-600" 
                            value={newItem.title} 
                            onChange={e=>setNewItem({...newItem, title:e.target.value})} 
                            placeholder="عنوان ملفت للانتباه..."
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2">التفاصيل</label>
                        <textarea 
                            required 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-3 rounded-xl focus:border-yellow-500 outline-none transition-colors h-32 placeholder-slate-600 resize-none" 
                            value={newItem.desc} 
                            onChange={e=>setNewItem({...newItem, desc:e.target.value})} 
                            placeholder="اكتب تفاصيل الخبر هنا..."
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2">صورة الخبر</label>
                        <div className="relative">
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="w-full text-sm text-slate-400
                                  file:mr-4 file:py-2.5 file:px-4
                                  file:rounded-xl file:border-0
                                  file:text-xs file:font-bold
                                  file:bg-slate-800 file:text-yellow-500
                                  hover:file:bg-slate-700
                                  cursor-pointer bg-slate-950 border border-slate-700 rounded-xl"
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-2 flex items-center gap-1">
                            <ImageIcon size={10}/> يفضل صور بالعرض (Landscape) لدقة أفضل
                        </p>
                    </div>

                    {newItem.image && (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-slate-700 group">
                            <img src={newItem.image} alt="preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs font-bold">معاينة الصورة</span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2 border-t border-slate-800 mt-4">
                        <Button variant="ghost" onClick={()=>setShowModal(false)} className="text-slate-400 hover:text-white hover:bg-slate-800">إلغاء</Button>
                        <Button type="submit" disabled={loading} className="bg-yellow-500 text-slate-900 font-bold hover:bg-yellow-400 border-none shadow-lg shadow-yellow-500/20 px-6">
                            {loading ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin"/> جاري الرفع...</span> : 'نشر الخبر'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default NewsManager;
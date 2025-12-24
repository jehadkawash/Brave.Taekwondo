// src/views/StudentStore.jsx
import React from 'react';
import { Package } from 'lucide-react';

export const StudentStore = ({ products }) => {
  const availableProducts = products.filter(p => p.stock > 0);

  if (availableProducts.length === 0) return <div className="text-center py-10 text-gray-400">لا توجد منتجات معروضة حالياً</div>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {availableProducts.map(item => (
        <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition-shadow">
           <div className="h-40 bg-gray-100 relative">
               {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover"/> : <div className="flex items-center justify-center h-full"><Package className="text-gray-300"/></div>}
           </div>
           <div className="p-3">
               <h4 className="font-bold text-gray-800 text-sm mb-1">{item.name}</h4>
               <p className="font-black text-yellow-600">{item.price} JD</p>
           </div>
        </div>
      ))}
    </div>
  );
};
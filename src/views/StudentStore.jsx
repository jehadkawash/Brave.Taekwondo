// src/views/StudentStore.jsx
import React from 'react';
import { Package, ShoppingBag } from 'lucide-react';

export const StudentStore = ({ products }) => {
  const availableProducts = products.filter(p => p.stock > 0);

  if (availableProducts.length === 0) return (
      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <ShoppingBag size={48} className="mx-auto text-gray-300 mb-2"/>
          <p className="text-gray-400">لا توجد منتجات معروضة حالياً في المتجر</p>
      </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {availableProducts.map(item => (
        <div key={item.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
           <div className="h-40 bg-gray-50 relative overflow-hidden">
               {item.image ? (
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
               ) : (
                   <div className="flex items-center justify-center h-full"><Package className="text-gray-200" size={40}/></div>
               )}
               {item.stock < 5 && (
                   <span className="absolute bottom-2 right-2 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full shadow-sm animate-pulse">
                       بقي {item.stock} فقط
                   </span>
               )}
           </div>
           <div className="p-4 text-center">
               <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-1">{item.name}</h4>
               <div className="inline-block bg-yellow-50 border border-yellow-200 text-yellow-800 font-black rounded-lg px-3 py-1 text-sm shadow-sm">
                   {item.price} JD
               </div>
           </div>
        </div>
      ))}
    </div>
  );
};
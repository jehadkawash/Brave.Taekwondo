// src/components/UIComponents.js
import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export const Button = ({ children, onClick, variant = "primary", className = "", type="button" }) => {
  const variants = {
    primary: "bg-yellow-500 text-black hover:bg-yellow-400 border border-yellow-600 font-bold",
    secondary: "bg-gray-800 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100"
  };
  return (
    <button type={type} onClick={onClick} className={`px-4 py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 shadow-sm ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", title, action, noPadding=false }) => (
  <div className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden ${className}`}>
    {(title || action) && (
      <div className="px-4 py-3 md:px-6 md:py-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50/50 gap-2">
        {title && <h3 className="font-bold text-gray-800 text-lg">{title}</h3>}
        {action && <div className="self-end md:self-auto">{action}</div>}
      </div>
    )}
    <div className={noPadding ? "" : "p-4 md:p-6"}>{children}</div>
  </div>
);

export const StatusBadge = ({ status }) => {
  const map = {
    active: { text: "فعال", style: "bg-green-100 text-green-800 border-green-200" },
    near_end: { text: "قارب الانتهاء", style: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    expired: { text: "منتهي", style: "bg-red-100 text-red-800 border-red-200" },
  };
  const current = map[status] || map.active;
  return <span className={`px-2 py-1 rounded-full text-xs font-bold border ${current.style}`}>{current.text}</span>;
};

export const StudentSearch = ({ students, onSelect, placeholder = "بحث عن طالب...", showAllOption = false, onClear }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const filtered = useMemo(() => {
    if (!query) return students;
    return students.filter(s => s.name.includes(query));
  }, [students, query]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          className="w-full border p-2 pr-8 rounded focus:ring-2 focus:ring-yellow-500 outline-none"
          placeholder={placeholder}
          value={query}
          onChange={e => {
             setQuery(e.target.value);
             setIsOpen(true);
             if(e.target.value === '' && onClear) onClear();
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
        />
        <Search className="absolute left-2 top-2.5 text-gray-400" size={16}/>
        {query && (
           <button onClick={() => { setQuery(''); if(onClear) onClear(); }} className="absolute left-8 top-2.5 text-gray-400 hover:text-red-500">
             <X size={16}/>
           </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-48 overflow-y-auto mt-1">
          {showAllOption && (
             <div className="p-2 hover:bg-gray-100 cursor-pointer text-sm border-b font-bold text-blue-600" onClick={() => { setQuery(''); if(onClear) onClear(); setIsOpen(false); }}>
               عرض الكل
             </div>
          )}
          {filtered.length > 0 ? filtered.map(s => (
             <div
               key={s.id}
               className="p-2 hover:bg-yellow-50 cursor-pointer text-sm border-b last:border-0 flex justify-between items-center"
               onClick={() => { setQuery(s.name); onSelect(s); setIsOpen(false); }}
             >
               <span className="font-bold">{s.name}</span>
               <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{s.belt}</span>
             </div>
           )) : <div className="p-2 text-gray-500 text-sm text-center">لا توجد نتائج</div>}
        </div>
      )}
    </div>
  );
};
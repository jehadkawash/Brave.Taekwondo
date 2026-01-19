// src/components/UIComponents.jsx
import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';

export const Button = ({ children, onClick, variant = "primary", className = "", type="button" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 hover:from-yellow-400 hover:to-yellow-500 border border-yellow-500 font-bold shadow-lg shadow-yellow-500/20",
    secondary: "bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700",
    danger: "bg-red-600/90 text-white hover:bg-red-500 shadow-lg shadow-red-900/20",
    outline: "border-2 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10",
    ghost: "bg-transparent text-slate-400 hover:text-white hover:bg-slate-800"
  };
  return (
    <button type={type} onClick={onClick} className={`px-4 py-2 rounded-xl transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", title, action, noPadding=false }) => (
  // ✅ Pro Dark Card Style: Slate-900 background, subtle border, and shadow
  <div className={`bg-slate-900 rounded-xl shadow-xl border border-slate-800/60 backdrop-blur-sm overflow-hidden transition-all hover:shadow-2xl hover:border-slate-700 ${className}`}>
    {(title || action) && (
      <div className="px-4 py-4 md:px-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/50 gap-2">
        {title && <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2 before:content-[''] before:w-1 before:h-5 before:bg-yellow-500 before:rounded-full before:mr-2">{title}</h3>}
        {action && <div className="self-end md:self-auto">{action}</div>}
      </div>
    )}
    <div className={noPadding ? "" : "p-4 md:p-6 text-slate-300"}>{children}</div>
  </div>
);

export const StatusBadge = ({ status }) => {
  const map = {
    active: { text: "فعال", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
    near_end: { text: "قارب الانتهاء", style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    expired: { text: "منتهي", style: "bg-red-500/10 text-red-400 border-red-500/20" },
  };
  const current = map[status] || map.active;
  return <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${current.style} shadow-sm`}>{current.text}</span>;
};

export const StudentSearch = ({ students, onSelect, placeholder = "بحث عن طالب...", showAllOption = false, onClear }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const filtered = useMemo(() => {
    if (!query) return students;
    return students.filter(s => s.name.includes(query));
  }, [students, query]);

  return (
    <div className="relative w-full group">
      <div className="relative">
        {/* ✅ Dark Input Styling */}
        <input
          type="text"
          className="w-full bg-slate-950 border border-slate-700 text-slate-200 p-2.5 pr-9 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none transition-all placeholder:text-slate-600"
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
        <Search className="absolute left-3 top-3 text-slate-500 group-focus-within:text-yellow-500 transition-colors" size={18}/>
        {query && (
           <button onClick={() => { setQuery(''); if(onClear) onClear(); }} className="absolute left-9 top-3 text-slate-500 hover:text-red-400">
             <X size={18}/>
           </button>
        )}
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-56 overflow-y-auto mt-2 custom-scrollbar">
          {showAllOption && (
             <div className="p-3 hover:bg-slate-800 cursor-pointer text-sm border-b border-slate-800 font-bold text-blue-400 transition-colors" onClick={() => { setQuery(''); if(onClear) onClear(); setIsOpen(false); }}>
               عرض الكل
             </div>
          )}
          {filtered.length > 0 ? filtered.map(s => (
             <div
               key={s.id}
               className="p-3 hover:bg-slate-800 cursor-pointer text-sm border-b border-slate-800/50 last:border-0 flex justify-between items-center transition-colors"
               onClick={() => { setQuery(s.name); onSelect(s); setIsOpen(false); }}
             >
               <span className="font-bold text-slate-200">{s.name}</span>
               <span className={`text-[10px] px-2 py-1 rounded border border-slate-700 ${s.belt?.includes('أحمر') || s.belt?.includes('أسود') ? 'bg-red-900/20 text-red-400' : 'bg-slate-800 text-slate-400'}`}>{s.belt}</span>
             </div>
           )) : <div className="p-4 text-slate-500 text-sm text-center">لا توجد نتائج</div>}
        </div>
      )}
    </div>
  );
};
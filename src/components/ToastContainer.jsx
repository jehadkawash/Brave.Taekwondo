// src/components/ToastContainer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import { subscribeToast } from '../lib/toast';

let idCounter = 0;

const STYLES = {
  success: { icon: CheckCircle, classes: 'bg-emerald-950/95 border-emerald-500/40 text-emerald-100' },
  error:   { icon: XCircle,     classes: 'bg-red-950/95 border-red-500/40 text-red-100' },
  info:    { icon: Info,        classes: 'bg-slate-900/95 border-slate-700 text-slate-100' },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  useEffect(() => subscribeToast(({ message, type }) => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => remove(id), 4500);
  }), [remove]);

  return createPortal(
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none"
      dir="rtl"
    >
      <AnimatePresence>
        {toasts.map(t => {
          const { icon: Icon, classes } = STYLES[t.type] || STYLES.info;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl shadow-black/40 ${classes}`}
            >
              <Icon size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-bold flex-1 leading-snug">{t.message}</p>
              <button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100 shrink-0">
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>,
    document.body
  );
}

// src/lib/toast.js
// Lightweight pub/sub so any component can fire a toast without prop drilling.
// ToastContainer (mounted once in App.jsx) is the only subscriber that renders them.

let listeners = [];

export const subscribeToast = (fn) => {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
};

/**
 * Show a toast notification.
 * @param {string} message
 * @param {'success'|'error'|'info'} [type='info']
 */
export const toast = (message, type = 'info') => {
  listeners.forEach(fn => fn({ message, type }));
};

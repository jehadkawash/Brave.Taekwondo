// src/lib/utils.js
// Shared utility functions — do NOT put component code here.

/**
 * Hash a password with SHA-256.
 * NOTE: SHA-256 without salt is acceptable for client-side lookup only.
 * For stronger security consider server-side hashing with bcrypt.
 */
export const hashPassword = async (password) => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Format a date string or Date object to dd/mm/yyyy.
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Return today's date as YYYY-MM-DD string.
 */
export const todayString = () => new Date().toISOString().split('T')[0];

/**
 * Calculate subscription status based on end date string.
 * @returns {'active'|'near_end'|'expired'}
 */
export const calculateStatus = (dateString) => {
  if (!dateString) return 'expired';
  const today = new Date();
  const end = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'expired';
  if (diffDays <= 7) return 'near_end';
  return 'active';
};

/**
 * Open WhatsApp chat for a Jordanian phone number.
 * Strips non-digits and leading 0.
 */
export const openWhatsAppChat = (phone) => {
  if (!phone) return;
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('0')) clean = clean.substring(1);
  window.open(`https://wa.me/962${clean}`, '_blank');
};

// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // 1. إضافة مكتبة التخزين

const firebaseConfig = {
  apiKey: "AIzaSyCKMrH2E_GP_MYZJrhF4LbxC1LmtVGx3Co",
  authDomain: "brave-academy.firebaseapp.com",
  projectId: "brave-academy",
  storageBucket: "brave-academy.firebasestorage.app", // تأكد أن هذا السطر موجود
  messagingSenderId: "862804404676",
  appId: "1:862804404676:web:871e3bb0796c354f1f5c91"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 2. تصدير المتغير لاستخدامه في باقي الملفات
export const appId = 'brave-academy-live-data';
// src/hooks/useCollection.js
import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { db, appId } from '../lib/firebase';

// ضفنا _queryConstraints عشان نقدر نفلتر البيانات
export const useCollection = (collectionName, _queryConstraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // الحل السحري: نستخدم JSON.stringify عشان نتأكد هل الشروط تغيرت فعلاً ولا لأ
  // هيك بنمنع التكرار (Loop) وبنحافظ على التحديث الفوري
  const queryConstraintsDep = JSON.stringify(_queryConstraints);

  useEffect(() => {
    let ref = collection(db, 'artifacts', appId, 'public', 'data', collectionName);
    let q;

    if (_queryConstraints && _queryConstraints.length > 0) {
       q = query(ref, ..._queryConstraints);
    } else {
       q = query(ref);
    }

    // onSnapshot: هي المسؤولة عن التحديث الفوري (Real-time)
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData(items);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching ${collectionName}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
    
    // هون السر: الـ useEffect رح يشتغل بس لما يتغير اسم الكولكشن أو تتغير الشروط فعلياً
  }, [collectionName, queryConstraintsDep]);

  const add = async (item) => {
    try {
      const itemWithTimestamp = { ...item, createdAt: new Date().toISOString() };
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', collectionName), itemWithTimestamp);
      return true;
    } catch (e) {
      console.error(e);
      alert("خطأ في الحفظ، تأكد من الاتصال");
      return false;
    }
  };

  const update = async (id, updates) => {
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id), updates);
    } catch (e) { console.error(e); }
  };

  const remove = async (id) => {
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', collectionName, id));
    } catch (e) { console.error(e); }
  };

  return { data, loading, add, update, remove };
};
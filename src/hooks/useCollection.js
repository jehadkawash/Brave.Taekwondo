// src/hooks/useCollection.js
import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { db, appId } from '../lib/firebase';

export const useCollection = (collectionName, _queryConstraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // نستخدم useRef لتجنب الدخول في حلقة لا نهائية (Infinite Loop) بسبب المصفوفة
  const queryConstraints = useRef(_queryConstraints).current;

  useEffect(() => {
    let ref = collection(db, 'artifacts', appId, 'public', 'data', collectionName);
    let q;

    // إذا تم تمرير شروط بحث، نستخدمها. وإلا نجلب الكل
    if (queryConstraints && queryConstraints.length > 0) {
       q = query(ref, ...queryConstraints);
    } else {
       q = query(ref);
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setData(items);
      setLoading(false);
    }, (error) => {
      console.error(`Error fetching ${collectionName}:`, error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionName, queryConstraints]);

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
// src/hooks/useCollection.js
import { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { db, appId } from '../lib/firebase';

// ✅ أضفنا isActive عشان نتحكم متى يشتغل الـ Hook (الـ Lazy Loading)
export const useCollection = (collectionName, _queryConstraints = [], isActive = true) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const queryConstraintsDep = JSON.stringify(_queryConstraints);

  useEffect(() => {
    // 🛑 التعديل السحري: إذا التاب مش شغال (isActive = false)، وقف التحميل ولا تتصل بقاعدة البيانات أبداً!
    if (!isActive) {
        setLoading(false);
        return;
    }

    setLoading(true);
    let ref = collection(db, 'artifacts', appId, 'public', 'data', collectionName);
    let q;

    if (_queryConstraints && _queryConstraints.length > 0) {
       q = query(ref, ..._queryConstraints);
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
  }, [collectionName, queryConstraintsDep, isActive]);

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
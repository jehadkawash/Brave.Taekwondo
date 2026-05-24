// src/hooks/useCollection.js
// FIX #9: لا تمسح البيانات عند انقطاع الاتصال — نحتفظ بآخر بيانات معروفة
import { useState, useEffect, useRef, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';

/**
 * useCollection
 * - يحتفظ بآخر بيانات معروفة عند انقطاع الاتصال
 * - يعرض مؤشر offline بدلاً من مسح البيانات
 * - يعيد المحاولة تلقائياً بـ exponential backoff
 */
export const useCollection = (collectionName, options = {}) => {
  const { orderByField = null, orderDirection = 'asc' } = options;

  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [isOffline, setIsOffline]   = useState(false);

  // FIX #9: نخزن آخر snapshot صالح هنا حتى لا نفقدها عند انقطاع الاتصال
  const lastGoodDataRef = useRef([]);
  const unsubscribeRef  = useRef(null);
  const retryTimerRef   = useRef(null);
  const retryCountRef   = useRef(0);
  const MAX_RETRIES     = 6;

  const subscribe = useCallback(() => {
    // نلغي أي اشتراك سابق قبل البدء
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    const ref = collection(db, 'artifacts', appId, 'public', 'data', collectionName);
    const q   = orderByField
      ? query(ref, orderBy(orderByField, orderDirection))
      : ref;

    const unsub = onSnapshot(
      q,
      // ✅ نجاح: استلمنا بيانات
      (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

        // FIX #9: نحدّث المرجع أولاً ثم الـ state
        lastGoodDataRef.current = docs;
        setData(docs);
        setLoading(false);
        setError(null);

        // الاتصال عاد — نصفّر العداد والحالة
        if (isOffline) setIsOffline(false);
        retryCountRef.current = 0;
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      },
      // ❌ خطأ: انقطع الاتصال أو رفضت القاعدة
      (err) => {
        console.error(`[useCollection] Error in "${collectionName}":`, err);
        setError(err.message);
        setLoading(false);

        // FIX #9: نبقي البيانات القديمة ظاهرة ونعرض offline indicator فقط
        if (lastGoodDataRef.current.length > 0) {
          setData(lastGoodDataRef.current);
          setIsOffline(true);
        }

        // إعادة المحاولة بـ exponential backoff
        scheduleRetry();
      }
    );

    unsubscribeRef.current = unsub;
  }, [collectionName, orderByField, orderDirection]);

  const scheduleRetry = useCallback(() => {
    if (retryCountRef.current >= MAX_RETRIES) {
      console.warn(`[useCollection] Max retries reached for "${collectionName}"`);
      return;
    }

    // Exponential backoff: 2s, 4s, 8s, 16s, 32s, 60s
    const delay = Math.min(2000 * Math.pow(2, retryCountRef.current), 60000);
    retryCountRef.current += 1;

    console.log(`[useCollection] Retrying "${collectionName}" in ${delay}ms (attempt ${retryCountRef.current})`);

    retryTimerRef.current = setTimeout(() => {
      subscribe();
    }, delay);
  }, [subscribe, collectionName]);

  useEffect(() => {
    subscribe();

    // مراقبة حالة الشبكة من المتصفح
    const handleOnline  = () => { retryCountRef.current = 0; subscribe(); };
    const handleOffline = () => { setIsOffline(true); };

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (unsubscribeRef.current)  unsubscribeRef.current();
      if (retryTimerRef.current)   clearTimeout(retryTimerRef.current);
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [subscribe]);

  return { data, loading, error, isOffline };
};

export default useCollection;
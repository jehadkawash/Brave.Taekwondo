// src/hooks/useCollection.js
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  collection, onSnapshot, query, orderBy,
  addDoc, updateDoc, deleteDoc, doc
} from 'firebase/firestore';
import { db, appId } from '../lib/firebase';

/**
 * useCollection
 * - Subscribes to a Firestore collection in real time
 * - Exposes add / update / remove helpers used throughout the app
 * - Preserves last-good data on disconnect and retries with exponential backoff
 *
 * @param {string}  collectionName
 * @param {object}  [options]
 * @param {string}  [options.orderByField]
 * @param {string}  [options.orderDirection='asc']
 * @param {boolean} [options.enabled=true]   Pass false to skip subscription (lazy load)
 */
export const useCollection = (collectionName, options = {}) => {
  const {
    orderByField = null,
    orderDirection = 'asc',
    enabled = true,
  } = typeof options === 'object' && options !== null ? options : {};

  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const lastGoodDataRef = useRef([]);
  const unsubscribeRef  = useRef(null);
  const retryTimerRef   = useRef(null);
  const retryCountRef   = useRef(0);
  const MAX_RETRIES     = 6;

  // ─── helpers ────────────────────────────────────────────────────────────────

  const collectionRef = useCallback(
    () => collection(db, 'artifacts', appId, 'public', 'data', collectionName),
    [collectionName]
  );

  /** Add a new document. Returns the new doc reference on success. */
  const add = useCallback(async (docData) => {
    try {
      const ref = await addDoc(collectionRef(), {
        ...docData,
        createdAt: docData.createdAt ?? new Date().toISOString(),
      });
      return ref;
    } catch (err) {
      console.error(`[useCollection] add error in "${collectionName}":`, err);
      return null;
    }
  }, [collectionName, collectionRef]);

  /** Update fields of an existing document by id. */
  const update = useCallback(async (id, updates) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, id);
      await updateDoc(docRef, updates);
      return true;
    } catch (err) {
      console.error(`[useCollection] update error in "${collectionName}":`, err);
      return false;
    }
  }, [collectionName]);

  /** Delete a document by id. */
  const remove = useCallback(async (id) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error(`[useCollection] remove error in "${collectionName}":`, err);
      return false;
    }
  }, [collectionName]);

  // ─── subscription ────────────────────────────────────────────────────────────

  const scheduleRetry = useCallback(() => {
    if (retryCountRef.current >= MAX_RETRIES) {
      console.warn(`[useCollection] max retries reached for "${collectionName}"`);
      return;
    }
    const delay = Math.min(2000 * Math.pow(2, retryCountRef.current), 60_000);
    retryCountRef.current += 1;
    console.log(`[useCollection] retrying "${collectionName}" in ${delay}ms (attempt ${retryCountRef.current})`);
    retryTimerRef.current = setTimeout(() => subscribe(), delay); // eslint-disable-line
  }, [collectionName]); // subscribe defined below — safe because it's stable

  const subscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!enabled) {
      setLoading(false);
      return;
    }

    const ref = collectionRef();
    const q   = orderByField
      ? query(ref, orderBy(orderByField, orderDirection))
      : ref;

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        lastGoodDataRef.current = docs;
        setData(docs);
        setLoading(false);
        setError(null);
        setIsOffline(false);
        retryCountRef.current = 0;
        if (retryTimerRef.current) {
          clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      },
      (err) => {
        console.error(`[useCollection] error in "${collectionName}":`, err);
        setError(err.message);
        setLoading(false);
        if (lastGoodDataRef.current.length > 0) {
          setData(lastGoodDataRef.current);
          setIsOffline(true);
        }
        scheduleRetry();
      }
    );

    unsubscribeRef.current = unsub;
  }, [collectionName, orderByField, orderDirection, enabled, collectionRef, scheduleRetry]);

  useEffect(() => {
    subscribe();

    const handleOnline  = () => { retryCountRef.current = 0; subscribe(); };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      if (unsubscribeRef.current)  unsubscribeRef.current();
      if (retryTimerRef.current)   clearTimeout(retryTimerRef.current);
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [subscribe]);

  return { data, loading, error, isOffline, add, update, remove };
};

export default useCollection;
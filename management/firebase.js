import {initializeApp} from 'firebase/app';
import {getAuth,browserSessionPersistence,setPersistence} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
const app=initializeApp({apiKey:import.meta.env.VITE_FIREBASE_API_KEY,authDomain:import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,projectId:import.meta.env.VITE_FIREBASE_PROJECT_ID,appId:import.meta.env.VITE_FIREBASE_APP_ID},'independent-management');
export const auth=getAuth(app);
export const persistenceReady=setPersistence(auth,browserSessionPersistence);
export const db=getFirestore(app);
export const path=['artifacts','brave-academy-live-data','public','data'];

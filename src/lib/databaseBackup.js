import {collection,getDocsFromServer,Timestamp,GeoPoint,DocumentReference,Bytes} from 'firebase/firestore';
import {db,appId} from './firebase';
export const BACKUP_COLLECTIONS=['students','payments','expenses','income_extra','debts','registrations','password_reset_requests','schedule','news','groups','captains','users','activity_logs','archive','finance_reasons','products','product_categories','inventory_log','packages','weights','weight_events','belt_tests','events','fitness_tracking','admin_notes','management_coaches','management_months','management_ledger','management_notes','management_users'];
export function encodeBackupValue(value){
 if(value instanceof Timestamp)return {$type:'timestamp',seconds:value.seconds,nanoseconds:value.nanoseconds};
 if(value instanceof GeoPoint)return {$type:'geopoint',latitude:value.latitude,longitude:value.longitude};
 if(value instanceof DocumentReference)return {$type:'reference',path:value.path};
 if(value instanceof Bytes)return {$type:'bytes',base64:value.toBase64()};
 if(Array.isArray(value))return value.map(encodeBackupValue);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,v])=>[key,encodeBackupValue(v)]));
 return value;
}
export async function downloadDatabaseBackup(){
 const collections={};
 // Fetch from the server: never export only the currently loaded page or cached branch.
 for(const name of BACKUP_COLLECTIONS){
  try{const snapshot=await getDocsFromServer(collection(db,'artifacts',appId,'public','data',name));collections[name]=snapshot.docs.map(d=>({id:d.id,data:encodeBackupValue(d.data())}));}
  catch{throw new Error(`لم يكتمل النسخ الاحتياطي: تعذر قراءة ${name}. لم يتم تنزيل ملف ناقص.`);}
 }
 const backup={format:'brave-firestore-documents',version:1,createdAt:new Date().toISOString(),appId,scope:'جميع الفروع — مجموعات بيانات التطبيق المدرجة',excludes:['Firebase Authentication accounts','Storage file contents','device_tokens','unknown collections and subcollections'],consistency:'sequential live reads; not a point-in-time snapshot',counts:Object.fromEntries(Object.entries(collections).map(([key,rows])=>[key,rows.length])),collections};
 const url=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));
 const link=document.createElement('a');link.href=url;link.download=`brave-all-branches-${new Date().toISOString().replace(/[:.]/g,'-')}.json`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
 return backup.counts;
}

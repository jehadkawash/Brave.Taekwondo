import {initializeApp,deleteApp} from 'firebase/app';
import {getFirestore,connectFirestoreEmulator,doc,setDoc,getDoc,getDocs,collection,updateDoc,runTransaction,query,where,setLogLevel} from 'firebase/firestore';
import assert from 'node:assert/strict';
setLogLevel('silent');
await fetch('http://127.0.0.1:8181/emulator/v1/projects/demo-brave-management/databases/(default)/documents',{method:'DELETE'});
const apps=[];const base=['artifacts','brave-academy-live-data','public','data'];
function client(name,claims){const app=initializeApp({projectId:'demo-brave-management',apiKey:'demo'},name);apps.push(app);const db=getFirestore(app);connectFirestoreEmulator(db,'127.0.0.1',8181,claims?{mockUserToken:{sub:name,email: name+'@test.local',...claims}}:{});return db;}
const admin=client('director',{email:'admin@brave.com'}),coach=client('coach',{}),family=client('family',{role:'family'}),anonymous=client('anonymous'),overview=client('overview',{}),pay=client('pay',{});
const ref=(db,name,id)=>doc(db,...base,name,id);
async function denied(p){await assert.rejects(p,e=>e.code==='permission-denied');}
try{
 await setDoc(ref(admin,'management_users','overview@test.local'),{active:true,permissions:['overview']});
 await setDoc(ref(admin,'management_users','pay@test.local'),{active:true,permissions:['payroll','attendance']});
 for(const name of ['management_coaches','management_months','management_ledger','management_notes','management_users']){
  await getDocs(collection(admin,...base,name));
  await denied(getDocs(collection(anonymous,...base,name)));
  await denied(getDocs(collection(coach,...base,name)));
  await denied(getDocs(collection(family,...base,name)));
 }
 await setDoc(ref(admin,'management_coaches','test'),{name:'Test coach',salary:520,branch:'شفا بدران'});
 const monthly=ref(pay,'management_months','test_2026-08');
 await setDoc(monthly,{coachId:'test',month:'2026-08',branch:'شفا بدران',salary:520,attendance:{},paid:0});
 const attendance=Object.fromEntries(Array.from({length:27},(_,i)=>['2026-08-'+String(i+1).padStart(2,'0'),true]));
 for(const [day,value] of Object.entries(attendance))await updateDoc(monthly,{['attendance.'+day]:value,attendanceDate:day});
 await denied(updateDoc(monthly,{'attendance.2026-09-01':true}));
 await denied(updateDoc(monthly,{'attendance.fake':true}));
 await denied(updateDoc(monthly,{salary:999}));
 await denied(setDoc(ref(overview,'management_coaches','forbidden'),{name:'X',salary:1,branch:'شفا بدران'}));
 await getDocs(collection(overview,...base,'management_months'));
 await denied(getDocs(collection(overview,...base,'management_notes')));
 const payment=async(id,amount,kind='salary')=>runTransaction(pay,async tx=>{const snap=await tx.get(monthly);tx.update(monthly,{paid:snap.data().paid+amount,lastPayment:id});tx.set(ref(pay,'management_ledger',id),{kind,coachId:'test',month:'2026-08',amount,date:'2026-08-31',branch:'شفا بدران',title:'Test payroll',createdBy:'pay@test.local'});});
 await payment('first',100,'advance');await payment('second',420);
 await denied(payment('over-cap',1));
 await denied(updateDoc(monthly,{paid:0}));
 await denied(updateDoc(monthly,{attendance:{}}));
 await updateDoc(monthly,{closed:true});
 await denied(updateDoc(monthly,{attendance:{'2026-08-01':true}}));
 await denied(updateDoc(monthly,{closed:false}));
 await getDocs(query(collection(pay,...base,'management_ledger'),where('kind','in',['salary','advance'])));
 await denied(getDocs(collection(pay,...base,'management_ledger')));
 // Existing club data still writable by the original director and family scoped reads remain intact.
 await setDoc(ref(admin,'students','existing'),{name:'Test student',branch:'شفا بدران',familyUid:'family'});
 await getDoc(ref(family,'students','existing'));
 const weightCoach=client('weight-coach',{});
 await setDoc(ref(admin,'users','weight-coach@test.local'),{permissions:['weight'],branch:'شفا بدران'});
 await getDocs(query(collection(weightCoach,...base,'students'),where('branch','==','شفا بدران')));
 await setDoc(ref(weightCoach,'weights','measurement'),{studentId:'existing',branch:'شفا بدران',weight:31,measuredAt:'2026-09-01T13:00:01Z'});
 await updateDoc(ref(weightCoach,'weights','measurement'),{weight:30.5});
 await getDocs(query(collection(weightCoach,...base,'weights'),where('branch','==','شفا بدران')));
 await denied(setDoc(ref(weightCoach,'weights','other-branch'),{branch:'أبو نصير',weight:31}));
 await denied(updateDoc(ref(weightCoach,'students','existing'),{name:'unauthorized'}));
 await denied(getDocs(query(collection(weightCoach,...base,'weights'),where('branch','==','أبو نصير'))));
 await denied(updateDoc(ref(family,'students','existing'),{name:'unauthorized'}));
 console.log('PASS: director reads all new collections; anonymous/family/coach denied; supervisor scopes; monthly salary; 26-day cap; advance/payment atomicity; closed month; existing student access.');
}finally{await Promise.all(apps.map(deleteApp));}

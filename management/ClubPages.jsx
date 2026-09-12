import React,{useLayoutEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {useCollection} from '../src/hooks/useCollection';
import ScheduleManager from '../src/views/dashboard/ScheduleManager';
import AccountsManager from '../src/views/dashboard/AccountsManager';
import InventoryManager from '../src/views/dashboard/InventoryManager';
import NewsManager from '../src/views/dashboard/NewsManager';
import ReportsManager from '../src/views/dashboard/ReportsManager';
import CaptainsManager from '../src/views/dashboard/CaptainsManager';
import clubStyles from '../src/index.css?inline';
export default function ClubPages({page,branch,user}){
 const schedule=useCollection('schedule',{enabled:page==='schedule'});
 const news=useCollection('news',{enabled:page==='news'});
 const captains=useCollection('captains',{enabled:page==='captains'&&user.isSuper===true});
 const students=useCollection('students',{enabled:page==='reports'});
 const payments=useCollection('payments',{enabled:page==='reports'});
 const expenses=useCollection('expenses',{enabled:page==='reports'});
 const income=useCollection('income_extra',{enabled:page==='reports'});
 const ledger=useCollection('management_ledger',{enabled:['accounts','reports'].includes(page)});
 const rows=list=>list.filter(r=>branch==='all'||r.branch===branch);
 const relevant=page==='schedule'?[schedule]:page==='news'?[news]:page==='captains'?[captains]:page==='reports'?[students,payments,expenses,income,ledger]:page==='accounts'?[ledger]:[];
 if(relevant.some(c=>c.error))return <p role="alert">تعذر تحميل بيانات الصفحة. تحقق من الصلاحيات قبل المتابعة.</p>;
 if(relevant.some(c=>c.loading))return <p>جارٍ تحميل بيانات الصفحة…</p>;
 if(branch==='all'&&['accounts','inventory','news'].includes(page))return <p className="notice">اختر فرعاً محدداً من الأعلى لإدارة هذه الصفحة.</p>;
 return <ClubPageShell><section dir="rtl" className="bg-slate-950 text-slate-200 p-4 rounded-2xl min-h-80">
 {page==='schedule'&&<ScheduleManager schedule={rows(schedule.data)} scheduleCollection={schedule}/>}
 {page==='accounts'&&<AccountsManager selectedBranch={branch} managementEntries={ledger.data}/>}
 {page==='inventory'&&<InventoryManager selectedBranch={branch}/>}
 {page==='news'&&<NewsManager news={rows(news.data)} newsCollection={news} selectedBranch={branch}/>}
 {page==='reports'&&<ReportsManager selectedBranch={branch==='all'?'جميع الفروع':branch} students={rows(students.data)} payments={rows([...payments.data,...income.data,...ledger.data.filter(r=>r.kind==='income')])} expenses={rows([...expenses.data,...ledger.data.filter(r=>r.kind!=='income')])}/>}
 {page==='captains'&&user.isSuper&&<CaptainsManager captains={captains.data} captainsCollection={captains}/>}
 </section></ClubPageShell>;
}

function ClubPageShell({children}){const host=useRef(null),[root,setRoot]=useState(null);useLayoutEffect(()=>{setRoot(host.current.shadowRoot||host.current.attachShadow({mode:'open'}));},[]);return <div ref={host}>{root&&createPortal(<><style>{clubStyles}</style>{children}</>,root)}</div>;}

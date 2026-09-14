import { compareWeightEntries, weightDateMillis } from './weightDates.js';

// Transcribed from the tournament chart supplied by the academy, not universal rules.
export const WEIGHT_CATEGORIES = [
 {id:'children6',label:'أطفال ذكور وإناث (6–8)',limits:[18,20,22,24,26,29,32,35],over:35},
 {id:'children9',label:'أطفال ذكور وإناث (9–11)',limits:[20,22,24,26,29,32,35,40,45],over:50},
 {id:'cadetM',label:'الأشبال (12–14)',limits:[33,37,41,45,49,53,57,61,65],over:65},
 {id:'cadetF',label:'الزهرات (12–14)',limits:[29,33,37,41,44,47,51,55,59],over:59},
 {id:'juniorM',label:'ناشئين ذكور (15–17)',limits:[45,48,51,55,59,63,68,73,78],over:78},
 {id:'juniorF',label:'ناشئين إناث (15–17)',limits:[42,44,46,49,52,55,59,63,68],over:68},
 {id:'seniorM',label:'الرجال / أسود',limits:[54,58,63,68,74,80,87],over:87},
 {id:'seniorF',label:'السيدات / أسود',limits:[46,49,53,57,62,67,73],over:73},
];
export const categoryLabel = id => WEIGHT_CATEGORIES.find(c=>c.id===id)?.label || 'الفئة غير محددة';
export const kg = value => Number.isFinite(Number(value)) ? String(Math.round(Number(value)*100)/100) : '—';
export const birthYear = student => {const ms=weightDateMillis(student.dob);return ms===null?'غير مسجلة':String(new Date(ms).getFullYear());};
export function measurementDate(entry){return entry.measuredAt || entry.createdAt;}
export function studentAge(student,year=new Date().getFullYear()) {const born=Number(birthYear(student));return Number.isInteger(born)&&born>1900&&born<=year?year-born:null;}
export function trackingGender(student,goal) {const value=student.gender||goal?.gender;return ['male','ذكر','M'].includes(value)?'male':['female','أنثى','F'].includes(value)?'female':goal?.categoryId?.endsWith('M')?'male':goal?.categoryId?.endsWith('F')?'female':'';}
export function automaticCategory(student,gender,year=new Date().getFullYear()) {const age=studentAge(student,year);if(age===null||age<6)return null;const id=age<=8?'children6':age<=11?'children9':!gender?null:age<=14?`cadet${gender==='male'?'M':'F'}`:age<=17?`junior${gender==='male'?'M':'F'}`:`senior${gender==='male'?'M':'F'}`;return WEIGHT_CATEGORIES.find(c=>c.id===id)||null;}
export function currentTrackingGoal(student,goal) {return {...goal,categoryId:automaticCategory(student,trackingGender(student,goal))?.id||''};}
export function displayWeightDate(value){const ms=weightDateMillis(value);return ms===null?'تاريخ غير متوفر':new Date(ms).toLocaleString('ar-JO',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});}
export function localDateInput(value=new Date()) {const ms=weightDateMillis(value);if(ms===null)return '';const d=new Date(ms);const z=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${z(d.getMonth()+1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`;}
export function studentWeightData(rows,id){const all=rows.filter(r=>r.studentId===id);return {entries:all.filter(r=>!r._isTarget).sort(compareWeightEntries),goal:all.filter(r=>r._isTarget).sort((a,b)=>(weightDateMillis(b.updatedAt||b.createdAt)||0)-(weightDateMillis(a.updatedAt||a.createdAt)||0)||String(a.id).localeCompare(String(b.id)))[0]||null};}
export function changeLabel(entry,previous){if(!previous)return 'أول قياس';const d=Math.round((Number(entry.weight)-Number(previous.weight))*100)/100;return d===0?'ثابت':`${d>0?'زيادة':'نقصان'} ${kg(Math.abs(d))} كغم`;}
export function goalLabel(goal){return Number(goal?.weight)>0?`${goal.direction==='over'?'فوق':'تحت'} ${kg(goal.weight)} كغم`:'لم يحدد الهدف';}
export function goalStatus(weight,goal){
 if(!Number(goal?.weight)||weight==null)return {text:'لم يحدد الهدف',gap:null,reached:false};
 const gap=Math.round((goal.direction==='over'?Number(goal.weight)-Number(weight):Number(weight)-Number(goal.weight))*100)/100;
 if(gap===0)return {text:'على الحد — لم يدخل الفئة بعد',gap:0,reached:false};
 return gap<0?{text:'ضمن الهدف',gap,reached:true}:{text:`متبقي ${kg(gap)} كغم لحد الفئة`,gap,reached:false};
}

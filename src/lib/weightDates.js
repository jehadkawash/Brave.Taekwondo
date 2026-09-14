// Normalize dates before sorting/rendering; Firestore timestamps are not strings.
export function weightDateMillis(value) {
 try {
  if (value == null || value === '') return null;
  let millis;
  if (typeof value?.toMillis === 'function') millis = value.toMillis();
  else if (typeof value?.toDate === 'function') millis = value.toDate().getTime();
  else if (value instanceof Date) millis = value.getTime();
  else if (typeof value === 'object' && Number.isFinite(value.seconds)) millis = value.seconds * 1000 + (Number(value.nanoseconds) || 0) / 1e6;
  else if (typeof value === 'string') millis = Date.parse(value);
  else if (typeof value === 'number') millis = value;
  return Number.isFinite(millis) && !Number.isNaN(new Date(millis).getTime()) ? millis : null;
 } catch { return null; }
}
export function compareWeightDates(a,b,direction=1) {
 const left=weightDateMillis(a),right=weightDateMillis(b);
 if(left===null) return right===null?0:1;
 if(right===null) return -1;
 return (left-right)*direction;
}
export const compareWeightEntries = (a,b) => compareWeightDates(a.measuredAt || a.createdAt,b.measuredAt || b.createdAt,-1) || String(a.id||'').localeCompare(String(b.id||''));
export const compareWeightStudents = (a,b) => compareWeightDates(weightDateMillis(a.joinDate) ?? a.createdAt,weightDateMillis(b.joinDate) ?? b.createdAt) || String(a.id||'').localeCompare(String(b.id||''));

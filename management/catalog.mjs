export function catalogUpdate(latest,values){
 const variants=latest.variants||[],known=new Set(variants.map(v=>v.size));
 const additions=(values.variants||[]).filter(v=>!known.has(v.size));
 if(additions.some(v=>!v.size.trim()||!Number.isInteger(Number(v.stock))||Number(v.stock)<0))throw Error('أدخل مقاسًا وكمية صحيحة.');
 if(new Set((values.variants||[]).map(v=>v.size)).size!==(values.variants||[]).length)throw Error('المقاسات مكررة.');
 const {variants:ignored,branch,...metadata}=values;
 return {...metadata,variants:[...variants,...additions]};
}

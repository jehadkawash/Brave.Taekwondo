// src/lib/constants.js

export const IMAGES = {
  LOGO: "/logo.jpg",            
  HERO_BG: "/hero.jpg",        
  BRANCH_SHAFA: "/shafa.jpg",  
  BRANCH_ABU_NSEIR: "/abunseir.jpg" 
};

export const BRANCHES = { SHAFA: 'شفا بدران', ABU_NSEIR: 'أبو نصير' };

export const BELTS = ["أبيض", "أصفر", "أخضر 1", "أخضر 2", "أزرق 1", "أزرق 2", "بني 1", "بني 2", "أحمر 1", "أحمر 2", "أسود"];

export const INITIAL_SCHEDULE = [
  { id: 1, days: "السبت / الاثنين / الأربعاء", time: "4:00 م - 5:00 م", level: "مبتدئين (أبيض - أصفر)", branch: "مشترك" },
  { id: 2, days: "السبت / الاثنين / الأربعاء", time: "5:00 م - 6:30 م", level: "أحزمة ملونة (أخضر - أزرق)", branch: "مشترك" },
  { id: 3, days: "الأحد / الثلاثاء / الخميس", time: "5:00 م - 6:30 م", level: "متقدم (أحمر - أسود)", branch: "مشترك" },
  { id: 4, days: "الجمعة", time: "9:00 ص - 11:00 ص", level: "فريق المنتخبات", branch: "الفرع الرئيسي" },
];
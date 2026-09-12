export const MANAGEMENT_CLUB_PAGES = {
 schedule: 'جدول الحصص', accounts: 'حسابات النادي', inventory: 'المخزون',
 news: 'الأخبار والعروض', reports: 'التقارير الشاملة', captains: 'الكباتن والصلاحيات',
};
export const isManagementClubPage = key => Object.hasOwn(MANAGEMENT_CLUB_PAGES,key);

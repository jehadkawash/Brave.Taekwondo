const timestamp = student => {
    const value = student.createdAt?.toDate ? student.createdAt.toDate() : student.createdAt;
    return Number.isFinite(Date.parse(value)) ? Date.parse(value) : 0;
};
const day = student => String(student.joinDate || '').slice(0, 10);
const family = student => student.familyId && student.familyId !== 'new' ? `family:${student.familyId}` : `student:${student.id}`;

export function registrationComparator(students, direction = -1) {
    const anchors = new Map();
    for (const student of students) {
        const key = `${day(student)}|${family(student)}`;
        const current = anchors.get(key);
        if (!current || timestamp(student) < timestamp(current) || (timestamp(student) === timestamp(current) && String(student.name || '').localeCompare(current.name || '', 'ar') < 0)) anchors.set(key, student);
    }
    const nameOrder = (a, b) => String(a.name || '').localeCompare(b.name || '', 'ar') || String(a.id).localeCompare(String(b.id));
    return (a, b) => {
        const dateOrder = day(a).localeCompare(day(b)) * direction;
        if (dateOrder) return dateOrder;
        if (family(a) !== family(b)) {
            const first = anchors.get(`${day(a)}|${family(a)}`);
            const second = anchors.get(`${day(b)}|${family(b)}`);
            return (timestamp(first) - timestamp(second)) * direction || nameOrder(first, second);
        }
        return (timestamp(a) - timestamp(b)) * direction || nameOrder(a, b);
    };
}

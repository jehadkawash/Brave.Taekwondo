// src/views/dashboard/AdvancedStats.jsx
import React, { useMemo, useState } from 'react';
import {
    TrendingUp, Users, Calendar, Award, Activity,
    BarChart3, Clock, UserCheck, AlertCircle, ChevronRight
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

const dayNames = ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];

const safeDate = (v) => {
    if (!v) return null;
    if (Array.isArray(v)) v = v[0];
    if (v?.toDate) return v.toDate();
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
};

const monthsBetween = (start, end) => {
    if (!start || !end) return 0;
    return Math.max(0, (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()));
};

export default function AdvancedStats({ students = [], archivedStudents = [], activityLogs = [], selectedBranch }) {

    // ─── 1. Retention Analysis ────────────────────────────────────────────────
    const retention = useMemo(() => {
        const all = [
            ...students.map(s => ({ ...s, _stillActive: true })),
            ...archivedStudents.map(s => ({ ...s, _stillActive: false })),
        ];

        const today = new Date();
        let buckets = { '<1':0, '1-3':0, '3-6':0, '6-12':0, '12+':0 };
        let totalMonths = 0;
        let validCount  = 0;
        let dropouts    = []; // {month, count}

        all.forEach(s => {
            const join = safeDate(s.joinDate);
            if (!join) return;
            const endDate = s._stillActive ? today : (safeDate(s.archivedAt) || today);
            const months  = monthsBetween(join, endDate);
            totalMonths += months;
            validCount++;

            if (months < 1)      buckets['<1']++;
            else if (months < 3) buckets['1-3']++;
            else if (months < 6) buckets['3-6']++;
            else if (months < 12) buckets['6-12']++;
            else                  buckets['12+']++;

            // Track dropouts (archive month)
            if (!s._stillActive && s.archivedAt) {
                const d = safeDate(s.archivedAt);
                if (d) {
                    const key = d.getMonth();
                    dropouts[key] = (dropouts[key] || 0) + 1;
                }
            }
        });

        const avgMonths = validCount > 0 ? (totalMonths / validCount).toFixed(1) : 0;
        const retentionRate = validCount > 0
            ? ((students.length / (students.length + archivedStudents.length)) * 100).toFixed(0)
            : 0;

        const bucketData = [
            { name: 'أقل من شهر',  value: buckets['<1'],   color: '#ef4444' },
            { name: '1–3 شهور',    value: buckets['1-3'],  color: '#f97316' },
            { name: '3–6 شهور',    value: buckets['3-6'],  color: '#eab308' },
            { name: '6–12 شهر',    value: buckets['6-12'], color: '#3b82f6' },
            { name: 'أكثر من سنة', value: buckets['12+'],  color: '#10b981' },
        ];

        const dropoutMonths = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
            .map((name, i) => ({ name, count: dropouts[i] || 0 }));

        const worstMonth = dropoutMonths.reduce((max, m) => m.count > max.count ? m : max, { count: 0 });

        return { buckets: bucketData, avgMonths, retentionRate, dropoutMonths, worstMonth };
    }, [students, archivedStudents]);

    // ─── 2. Attendance Heatmap (يوم الأسبوع / الشهر) ──────────────────────────
    const heatmap = useMemo(() => {
        const counts = Array(7).fill(0); // [Sun, Mon, ... Sat]

        students.forEach(s => {
            if (!s.attendance) return;
            Object.keys(s.attendance).forEach(dateStr => {
                if (s.attendance[dateStr]) {
                    const d = new Date(dateStr);
                    if (!isNaN(d.getTime())) counts[d.getDay()]++;
                }
            });
        });

        const total  = counts.reduce((a, c) => a + c, 0);
        const max    = Math.max(...counts);
        const peakDay = counts.indexOf(max);

        return {
            data: dayNames.map((name, i) => ({
                name,
                count: counts[i],
                percent: total > 0 ? ((counts[i]/total)*100).toFixed(0) : 0,
            })),
            peakDay: max > 0 ? dayNames[peakDay] : null,
            total,
        };
    }, [students]);

    // ─── 3. Captain Activity (من activity_logs) ───────────────────────────────
    const captainStats = useMemo(() => {
        const byPerson = {};
        activityLogs.forEach(log => {
            const who = log.performedBy || 'غير معروف';
            if (!byPerson[who]) byPerson[who] = { name: who, total: 0, actions: {} };
            byPerson[who].total++;
            byPerson[who].actions[log.action] = (byPerson[who].actions[log.action] || 0) + 1;
        });
        return Object.values(byPerson).sort((a, b) => b.total - a.total).slice(0, 10);
    }, [activityLogs]);

    // ─── 4. الأشهر الأنشط للتسجيل ─────────────────────────────────────────────
    const joinMonths = useMemo(() => {
        const all = [...students, ...archivedStudents];
        const counts = Array(12).fill(0);
        all.forEach(s => {
            const d = safeDate(s.joinDate);
            if (d) counts[d.getMonth()]++;
        });
        return ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
            .map((name, i) => ({ name, count: counts[i] }));
    }, [students, archivedStudents]);

    return (
        <div className="space-y-6 animate-fade-in font-sans pb-20 md:pb-0">

            {/* Header */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
                <div className="p-2.5 bg-purple-500/10 rounded-xl border border-purple-500/30">
                    <BarChart3 size={22} className="text-purple-400"/>
                </div>
                <div>
                    <h2 className="text-lg font-black text-slate-100">إحصائيات متقدمة</h2>
                    <p className="text-xs text-slate-500">تحليلات الاحتفاظ بالطلاب • الحضور • نشاط الكباتن — فرع {selectedBranch}</p>
                </div>
            </div>

            {/* ── 1. Retention Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-emerald-900/10 border border-emerald-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-emerald-400"/>
                        <p className="text-xs text-emerald-500/70 font-bold">معدل الاحتفاظ</p>
                    </div>
                    <p className="text-3xl font-black text-emerald-400">{retention.retentionRate}<span className="text-base">%</span></p>
                    <p className="text-[10px] text-slate-600 mt-1">من {students.length + archivedStudents.length} طالب</p>
                </div>

                <div className="bg-blue-900/10 border border-blue-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={16} className="text-blue-400"/>
                        <p className="text-xs text-blue-500/70 font-bold">متوسط البقاء</p>
                    </div>
                    <p className="text-3xl font-black text-blue-400">{retention.avgMonths}</p>
                    <p className="text-[10px] text-slate-600 mt-1">شهر/طالب</p>
                </div>

                <div className="bg-yellow-900/10 border border-yellow-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Activity size={16} className="text-yellow-400"/>
                        <p className="text-xs text-yellow-500/70 font-bold">أنشط يوم بالحضور</p>
                    </div>
                    <p className="text-2xl font-black text-yellow-400">{heatmap.peakDay || '-'}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{heatmap.total} حضور كلي</p>
                </div>

                <div className="bg-red-900/10 border border-red-900/30 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-red-400"/>
                        <p className="text-xs text-red-500/70 font-bold">أكثر شهر تسرّب</p>
                    </div>
                    <p className="text-xl font-black text-red-400">{retention.worstMonth.count > 0 ? retention.worstMonth.name : '-'}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{retention.worstMonth.count > 0 ? `${retention.worstMonth.count} طالب` : 'لا تسرّب'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                {/* ── Retention Pie ── */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Users size={16} className="text-emerald-400"/> توزيع مدة بقاء الطلاب
                    </h3>
                    <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height={240}>
                            <PieChart>
                                <Pie data={retention.buckets} dataKey="value" nameKey="name"
                                    cx="50%" cy="50%" outerRadius={85} innerRadius={50}>
                                    {retention.buckets.map((b, i) => <Cell key={i} fill={b.color}/>)}
                                </Pie>
                                <Tooltip contentStyle={{ background:'#0f172a', border:'1px solid #334155', borderRadius:8 }}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-3">
                        {retention.buckets.map((b, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs bg-slate-950 rounded-lg p-2 border border-slate-800">
                                <div className="w-3 h-3 rounded" style={{ backgroundColor: b.color }}></div>
                                <span className="text-slate-400 flex-1 truncate">{b.name}</span>
                                <span className="font-bold text-slate-200">{b.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Heatmap by Day ── */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Clock size={16} className="text-blue-400"/> الحضور حسب يوم الأسبوع
                    </h3>
                    <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={heatmap.data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={11}/>
                                <YAxis stroke="#64748b" fontSize={11}/>
                                <Tooltip contentStyle={{ background:'#0f172a', border:'1px solid #334155', borderRadius:8 }}
                                    formatter={(v, n, p) => [`${v} حضور (${p.payload.percent}%)`, 'العدد']}/>
                                <Bar dataKey="count" fill="#3b82f6" radius={[6,6,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── أنشط شهور التسجيل ── */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Award size={16} className="text-yellow-400"/> أنشط شهور التسجيل
                    </h3>
                    <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={joinMonths}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={9} angle={-30} textAnchor="end" height={50}/>
                                <YAxis stroke="#64748b" fontSize={11}/>
                                <Tooltip contentStyle={{ background:'#0f172a', border:'1px solid #334155', borderRadius:8 }}/>
                                <Bar dataKey="count" fill="#eab308" radius={[6,6,0,0]}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── شهور التسرّب ── */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <AlertCircle size={16} className="text-red-400"/> شهور التسرّب (الأرشفة)
                    </h3>
                    <div style={{ height: 240 }}>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={retention.dropoutMonths}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                                <XAxis dataKey="name" stroke="#64748b" fontSize={9} angle={-30} textAnchor="end" height={50}/>
                                <YAxis stroke="#64748b" fontSize={11}/>
                                <Tooltip contentStyle={{ background:'#0f172a', border:'1px solid #334155', borderRadius:8 }}/>
                                <Line type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2.5}
                                    dot={{ fill:'#ef4444', r:4 }}/>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ── 3. Captain Activity Table ── */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="px-5 py-4 bg-slate-950 border-b border-slate-800">
                    <h3 className="font-bold text-slate-200 flex items-center gap-2">
                        <UserCheck size={16} className="text-purple-400"/> نشاط الكباتن والإدارة (آخر العمليات)
                        <span className="text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 mr-2">
                            {captainStats.length}
                        </span>
                    </h3>
                </div>
                {captainStats.length === 0 ? (
                    <div className="p-10 text-center text-slate-600 text-sm">لا يوجد بيانات نشاط بعد</div>
                ) : (
                    <div className="divide-y divide-slate-800">
                        {captainStats.map((c, i) => {
                            const topAction = Object.entries(c.actions || {}).sort((a,b) => b[1]-a[1])[0];
                            return (
                                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-800/30 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-black text-purple-400 shrink-0">
                                        #{i+1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-200">{c.name}</p>
                                        <p className="text-[10px] text-slate-500">
                                            {topAction ? `أكثر إجراء: ${topAction[0]} (${topAction[1]} مرة)` : ''}
                                        </p>
                                    </div>
                                    <div className="text-left shrink-0">
                                        <p className="text-2xl font-black text-purple-400">{c.total}</p>
                                        <p className="text-[10px] text-slate-600">عملية</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

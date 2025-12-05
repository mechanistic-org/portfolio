import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import skillsData from '../../data/skills.json';

interface KPIDashboardProps {
    workHistory: any[];
    specs: any[];
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function KPIDashboard({ workHistory, specs }: KPIDashboardProps) {

    // 1. Career Velocity: Cumulative Skill Points over Time
    const velocityData = useMemo(() => {
        let cumulative = 0;
        // Sort oldest to newest for the line chart
        const sorted = [...skillsData].reverse();

        return sorted.map(project => {
            // Sum all skill values for this project
            const projectTotal = Object.values(project.skills).reduce((a: number, b: number) => a + b, 0);
            cumulative += projectTotal;
            return {
                name: project.name,
                date: project.start.split('/').slice(-1)[0], // Year
                total: Math.round(cumulative)
            };
        }).filter((_, i) => i % 5 === 0 || i === sorted.length - 1); // Sample to reduce density
    }, []);

    // 2. Skill Matrix: Top 6 Skills Aggregated
    const skillMatrixData = useMemo(() => {
        const totals: Record<string, number> = {};
        skillsData.forEach(p => {
            Object.entries(p.skills).forEach(([skill, val]) => {
                totals[skill] = (totals[skill] || 0) + (val as number);
            });
        });

        // Convert to array and sort
        return Object.entries(totals)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 6)
            .map(([subject, A]) => ({ subject, A: Math.round(A), fullMark: Math.round(A * 1.2) }));
    }, []);

    // 3. Role Distribution (Keep existing logic from workHistory)
    const roleData = useMemo(() => {
        const roles: Record<string, number> = {};
        workHistory.forEach(job => {
            const role = job.title.split(' ')[0]; // Simple grouping
            roles[role] = (roles[role] || 0) + 1;
        });
        return Object.entries(roles).map(([name, value]) => ({ name, value }));
    }, [workHistory]);

    return (
        <div className="space-y-8">

            {/* Row 1: Velocity & Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Career Velocity */}
                <div className="bg-surface-900 border border-surface-700 rounded-xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-accent-500">📈</span> Career Velocity
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={velocityData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="date" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Line type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-surface-400 mt-2 text-center">Cumulative Technical Impact (Skill Points x Duration)</p>
                </div>

                {/* Skill Matrix */}
                <div className="bg-surface-900 border border-surface-700 rounded-xl p-6 shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="text-purple-500">🕸️</span> Core Competencies
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillMatrixData}>
                                <PolarGrid stroke="#374151" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                                <Radar name="Skill Level" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-surface-400 mt-2 text-center">Top 6 Aggregated Skill Domains</p>
                </div>

            </div>

            {/* Row 2: Role Distribution */}
            <div className="bg-surface-900 border border-surface-700 rounded-xl p-6 shadow-xl">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-blue-500">🍰</span> Role Distribution
                </h3>
                <div className="h-[300px] w-full flex justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={roleData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {roleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
}

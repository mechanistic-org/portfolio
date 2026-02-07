import  { useState } from 'react';
import { PieChart, Pie, Cell,  ResponsiveContainer, Sector } from 'recharts';

interface PhaseData {
    Strategy: number;
    Design: number;
    Engineering: number;
    Production: number;
}

const COLORS = {
    Strategy: '#3b82f6',   // Blue
    Design: '#f59e0b',     // Amber/Orange
    Engineering: '#10b981',// Emerald
    Production: '#ef4444'  // Red
};

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;

    return (
        <g>
            <text x={cx} y={cy} dy={-10} textAnchor="middle" fill="#999" fontSize={10} fontWeight={600} className="uppercase tracking-widest">
                {payload.name}
            </text>
            <text x={cx} y={cy} dy={14} textAnchor="middle" fill="#fff" fontSize={18} fontWeight={700}>
                {value}%
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 6}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 8}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
        </g>
    );
};

export default function PhaseDonut({ data }: { data: PhaseData }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!data) return null;

    let processData = data;
    if (typeof data === 'string') {
        try {
            processData = JSON.parse(data);
        } catch (e) {
            console.error("PhaseDonut JSON parse error:", e);
        }
    }

    // Transform object to array
    const chartData = Object.entries(processData).map(([name, value]) => ({
        name,
        value: Number(value)
    })).filter(d => d.value > 0);

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    return (
        <div style={{ width: '100%', height: '100%', minWidth: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        // @ts-ignore
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius="60%"
                        outerRadius="80%"
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[entry.name as keyof typeof COLORS] || '#888'}
                            />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

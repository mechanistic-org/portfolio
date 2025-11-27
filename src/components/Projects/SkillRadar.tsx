import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SkillPoint {
  name: string;
  value: number;
}

export default function SkillRadar({ data }: { data: SkillPoint[] }) {
  // Safety check
  const safeData = (data || []).map(d => ({
    name: d.name,
    value: Number(d.value) || 0
  })).filter(d => d.value > 0);

  if (safeData.length < 3) return null;

  return (
    // Fixed height container
    <div style={{ width: '100%', height: '350px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={safeData}>
          <PolarGrid stroke="#404040" />
          <PolarAngleAxis 
            dataKey="name" 
            tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 500 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
          <Radar
            name="Intensity"
            dataKey="value"
            stroke="#20C20E"
            strokeWidth={3}
            fill="#20C20E"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
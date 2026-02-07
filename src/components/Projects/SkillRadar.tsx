
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SkillPoint {
  name: string;
  value: number;
  benchmark?: number;
}

export default function SkillRadar({ data }: { data: SkillPoint[] | string }) {
  let processData = data;
  if (typeof data === 'string') {
    try {
      processData = JSON.parse(data);
    } catch (e) {
      console.error("SkillRadar JSON parse error:", e);
    }
  }
  const safeArray = Array.isArray(processData) ? processData : [];

  // Safety check
  const safeData = safeArray.map(d => ({
    name: d.name,
    value: Number(d.value) || 0,
    benchmark: Number(d.benchmark) || 0,
    fullMark: 100 // Normalizer
  })).filter(d => d.value > 0);

  if (safeData.length < 3) return null;

  return (
    // Responsive container
    <div className="w-full h-full min-h-[180px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={safeData}>
          <PolarGrid stroke="#404040" />
          <PolarAngleAxis
            dataKey="name"
            tick={{ fill: '#a3a3a3', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />

          {/* Global Average / Benchmark Layer (Ghosted) */}
          <Radar
            name="Global Avg"
            dataKey="benchmark"
            stroke="#525252"
            strokeWidth={1}
            fill="#525252"
            fillOpacity={0.1}
          />

          {/* Project Skill Layer (Vibrant) */}
          <Radar
            name="Project Identity"
            dataKey="value"
            stroke="#2E5CFF"
            strokeWidth={3}
            fill="#2E5CFF"
            fillOpacity={0.4}
          />

          <Tooltip
            contentStyle={{ backgroundColor: '#171717', border: '1px solid #404040' }}
            itemStyle={{ color: '#e5e5e5' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

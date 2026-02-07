import  {  useState } from 'react';
import { motion } from 'framer-motion';

// Mock Data Generator
const generateData = () => Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    output: i > 6 && i < 18 ? Math.sin((i - 6) * Math.PI / 12) * 100 : 0,
    consumption: 20 + Math.random() * 10
}));

export default function SolarMetrics() {
    const [data, setData] = useState(generateData());

    return (
        <div className="w-full p-6 bg-neutral-950 rounded-xl border border-neutral-800 font-mono">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <div className="text-xs text-neutral-500 uppercase tracking-widest">System Status</div>
                    <div className="text-2xl font-bold text-green-400 flex items-center gap-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        ONLINE - NET POSITIVE
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-neutral-500">Daily Yield</div>
                    <div className="text-xl text-white">4.2 kWh</div>
                </div>
            </div>

            {/* Graph Visualization */}
            <div className="relative h-48 w-full flex items-end justify-between gap-1">
                {data.map((d, i) => (
                    <div key={i} className="relative w-full h-full flex items-end group">
                        {/* Solar Output Bar */}
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${d.output}%` }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            className="w-full bg-yellow-500/20 border-t-2 border-yellow-500 hover:bg-yellow-500/40 transition-colors"
                        />
                        {/* Consumption Line (Simulated) */}
                        <div
                            className="absolute bottom-0 w-full bg-red-500/30"
                            style={{ height: `${d.consumption}%` }}
                        />

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-black text-[10px] p-1 rounded whitespace-nowrap z-10">
                            {d.hour}:00 - {Math.round(d.output)}W
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-2 flex justify-between text-xs text-neutral-600">
                <span>00:00</span>
                <span>12:00</span>
                <span>23:59</span>
            </div>
        </div>
    );
}

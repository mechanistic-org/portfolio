import  { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PowerTelemetry() {
    const [history, setHistory] = useState<number[]>([]);
    const [currentWatts, setCurrentWatts] = useState(0);
    const [peakWatts, setPeakWatts] = useState(1240);
    const [work, setWork] = useState(3800);

    // Simulate Data Stream
    useEffect(() => {
        // Initial Fill
        const initialData = Array.from({ length: 30 }, () => 200 + Math.random() * 100);
        setHistory(initialData);

        const interval = setInterval(() => {
            setHistory(prev => {
                // Generate next watt value based on "Mode"
                // 80% chance of 'Cruise' (250-350W)
                // 10% chance of 'Surge' (400-600W)
                // 10% chance of 'Sprint' (800-1200W)
                const rand = Math.random();
                let nextWatts = 280 + Math.random() * 100; // Cruise World Tour Baseline

                if (rand > 0.85) nextWatts = 450 + Math.random() * 200; // Attack
                if (rand > 0.96) nextWatts = 900 + Math.random() * 500; // Sprint

                // Update Peak
                if (nextWatts > peakWatts) setPeakWatts(Math.floor(nextWatts));
                setCurrentWatts(Math.floor(nextWatts));

                // Accumulate Work (kJ approx)
                setWork(w => w + (nextWatts / 1000 * 0.5)); // Crude approx for 0.5s interval

                const newData = [...prev.slice(1), nextWatts];
                return newData;
            });
        }, 300); // Fast update rate

        return () => clearInterval(interval);
    }, [peakWatts]);

    return (
        // Made Container Bigger and Cleaner
        <div className="w-full max-w-lg p-6 bg-black/90 rounded-none border-l-4 border-blue-600 font-mono text-xs shadow-2xl">
            {/* Header Metrics */}
            <div className="flex justify-between items-end mb-6 border-b border-neutral-800 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-blue-500 font-bold tracking-widest text-[10px]">LIVE TELEMETRY</span>
                    </div>
                    <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                        {currentWatts}<span className="text-lg text-neutral-500 font-normal ml-1">W</span>
                    </div>
                </div>

                <div className="text-right space-y-1">
                    <div>
                        <span className="text-neutral-500 text-[10px] uppercase mr-2">Peak (5s)</span>
                        <span className="text-xl font-bold text-white tabular-nums">{peakWatts} W</span>
                    </div>
                    <div>
                        <span className="text-neutral-500 text-[10px] uppercase mr-2">Work</span>
                        <span className="text-xl font-bold text-neutral-300 tabular-nums">{Math.floor(work)} kJ</span>
                    </div>
                </div>
            </div>

            {/* The Graph - Thicker Bars, Less Gap */}
            <div className="relative h-40 w-full flex items-end justify-between gap-[1px]">
                {history.map((watts, i) => {
                    // Color Logic based on "Zones" (Coggan)
                    let color = "bg-neutral-600"; // Z1/Z2 (Recover)
                    if (watts > 300) color = "bg-blue-500"; // Z3 (Tempo)
                    if (watts > 400) color = "bg-green-400"; // Z4 (Threshold)
                    if (watts > 600) color = "bg-yellow-400"; // Z5 (VO2)
                    if (watts > 900) color = "bg-red-500"; // Z6 (Anaerobic)

                    // Height relative to scale (Max 1500 for visual sanity)
                    const height = Math.min(100, (watts / 1400) * 100);

                    return (
                        <div
                            key={i}
                            className={`w-full rounded-t-[1px] ${color} transition-all duration-300 ease-out`}
                            style={{ height: `${height}%` }}
                        />
                    );
                })}

                {/* FTP Line (Threshold ~400W for Pro) */}
                <div className="absolute top-[72%] left-0 w-full h-[1px] bg-white/10 border-t border-dashed border-white/30 pointer-events-none"></div>
            </div>

            {/* X-Axis labels */}
            <div className="mt-2 flex justify-between text-[9px] text-neutral-600 uppercase">
                <span>-30s</span>
                <span>Now</span>
            </div>
        </div>
    );
}

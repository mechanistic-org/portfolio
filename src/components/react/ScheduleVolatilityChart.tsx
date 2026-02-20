import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	ReferenceLine,
	Cell,
} from "recharts";

// Data derived from curtis_task_volatility.csv
// Selected "Problem Children" and "Key Engineering Tasks"
const data = [
	{ name: "Marketing Approval", revisions: 87, slip: 201, category: "Approval" },
	{ name: "Tool Parts (ME)", revisions: 95, slip: 172, category: "Engineering" },
	{ name: "PCB Layout", revisions: 715, slip: -110, category: "Engineering" },
	{ name: "PCBA Build", revisions: 565, slip: -63, category: "Production" },
	{ name: "Large Plastics", revisions: 23, slip: 284, category: "Engineering" },
	{ name: "Sheet Metal", revisions: 22, slip: 188, category: "Engineering" },
	{ name: "Pilot Build", revisions: 18, slip: 180, category: "Production" },
	{ name: "FCS (Release)", revisions: 17, slip: 355, category: "Milestone" },
];

const ScheduleVolatilityChart = () => {
	return (
		<div className="w-full rounded-lg border border-slate-700 bg-slate-900 p-4 shadow-xl">
			<div className="mb-6">
				<h2 className="text-xl font-bold text-slate-100">Forensic Volatility Index</h2>
				<p className="text-sm text-slate-400">
					Analysis of 49 schedule snapshots (2006-2008).
					<span className="ml-2 text-amber-400">Bar = Revisions (Chaos)</span>
					<span className="ml-2 text-cyan-400"> | Label = Days Slipped</span>
				</p>
			</div>

			<div className="h-[400px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						layout="vertical"
						margin={{ top: 5, right: 50, left: 40, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
						<XAxis type="number" stroke="#94a3b8" />
						<YAxis
							dataKey="name"
							type="category"
							width={140}
							stroke="#e2e8f0"
							tick={{ fontSize: 12 }}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "#1e293b",
								borderColor: "#475569",
								color: "#f1f5f9",
							}}
							itemStyle={{ color: "#f1f5f9" }}
							cursor={{ fill: "#334155", opacity: 0.4 }}
						/>
						<Legend />
						<Bar dataKey="revisions" name="Revisions (Count)" fill="#f59e0b" radius={[0, 4, 4, 0]}>
							{data.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={entry.category === "Approval" ? "#ec4899" : "#f59e0b"}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>
			</div>

			<div className="mt-4 grid grid-cols-1 gap-4 text-center md:grid-cols-3">
				<div className="rounded bg-slate-800 p-3">
					<div className="text-2xl font-bold text-pink-500">87</div>
					<div className="text-xs text-slate-400">Marketing Approval Revs</div>
				</div>
				<div className="rounded bg-slate-800 p-3">
					<div className="text-2xl font-bold text-amber-500">715</div>
					<div className="text-xs text-slate-400">Layout Revisions (Max)</div>
				</div>
				<div className="rounded bg-slate-800 p-3">
					<div className="text-2xl font-bold text-cyan-500">+1 Year</div>
					<div className="text-xs text-slate-400">Total Project Drift</div>
				</div>
			</div>
		</div>
	);
};

export default ScheduleVolatilityChart;

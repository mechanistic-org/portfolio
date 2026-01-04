import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import thermalDataRaw from "../../config/sc48_thermal_real.json";

interface ThermalData {
	timestamp: number;
	sensors: {
		cpu: number;
		psu: number;
		dmp: number; // DSP Chips
		amb: number; // Ambient
	};
}

const SCThermalMatrix: React.FC = () => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [data, setData] = useState<ThermalData[]>([]);

	useEffect(() => {
		// FILTER & LOAD REAL DATA
		// Filter out "dropout" frames where CPU temp is 0/invalid
		const clean: ThermalData[] = (thermalDataRaw as any[]).filter(
			(d) => d.sensors.cpu > 10 && d.sensors.psu > 10,
		);
		setData(clean);
	}, []);

	useEffect(() => {
		if (!data.length || !svgRef.current) return;

		const svg = d3.select(svgRef.current);
		const width = 800;
		const height = 400;
		const margin = { top: 40, right: 30, bottom: 40, left: 50 };

		svg
			.attr("viewBox", `0 0 ${width} ${height}`)
			.style("background", "#111")
			.style("border", "1px solid #333");

		svg.selectAll("*").remove(); // Clear previous

		// SCALES
		const x = d3
			.scaleLinear()
			.domain(d3.extent(data, (d) => d.timestamp) as [number, number])
			.range([margin.left, width - margin.right]);

		const y = d3
			.scaleLinear()
			.domain([20, d3.max(data, (d) => Math.max(d.sensors.cpu, d.sensors.psu, d.sensors.dmp))! + 5])
			.range([height - margin.bottom, margin.top]);

		// AXES
		// X Axis (Minutes)
		svg
			.append("g")
			.attr("transform", `translate(0,${height - margin.bottom})`)
			.call(
				d3
					.axisBottom(x)
					.ticks(10)
					.tickFormat((d) => `${d}m`),
			)
			.attr("color", "#666")
			.style("font-family", "monospace");

		// Y Axis (Temp C)
		svg
			.append("g")
			.attr("transform", `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).ticks(5))
			.attr("color", "#666")
			.style("font-family", "monospace");

		// GRID LINES
		svg
			.append("g")
			.attr("class", "grid")
			.attr("color", "#222")
			.call(
				d3
					.axisLeft(y)
					.tickSize(-width)
					.tickFormat(() => ""),
			)
			.attr("transform", `translate(${margin.left},0)`);

		// LINE GENERATOR
		const line = (key: keyof ThermalData["sensors"], color: string, label: string) => {
			const l = d3
				.line<ThermalData>()
				.x((d) => x(d.timestamp))
				.y((d) => y(d.sensors[key]))
				.curve(d3.curveMonotoneX);

			svg
				.append("path")
				.datum(data)
				.attr("fill", "none")
				.attr("stroke", color)
				.attr("stroke-width", 2)
				.attr("d", l);

			// Legend Label (at end of line)
			if (data.length > 0) {
				const last = data[data.length - 1];
				svg
					.append("text")
					.attr("x", x(last.timestamp) + 5)
					.attr("y", y(last.sensors[key]))
					.attr("fill", color)
					.style("font-size", "10px")
					.style("font-family", "monospace")
					.text(label);
			}
		};

		line("cpu", "#ff4444", "CPU");
		line("dmp", "#ffbb33", "DSP");
		line("psu", "#00C851", "PSU");
		line("amb", "#33b5e5", "AMB");

		// TITLE
		svg
			.append("text")
			.attr("x", width / 2)
			.attr("y", 25)
			.attr("text-anchor", "middle")
			.attr("fill", "#fff")
			.style("font-family", "monospace")
			.style("font-weight", "bold")
			.text("SC48 THERMAL PROFILE: UNIBODY HEAT DISSIPATION");

		svg
			.append("text")
			.attr("x", width / 2)
			.attr("y", height - 10)
			.attr("text-anchor", "middle")
			.attr("fill", "#666")
			.style("font-family", "monospace")
			.style("font-size", "10px")
			.text("SOURCE: LUX THERMAL TEST_LOG_11-19-07a (RAW)");
	}, [data]);

	return (
		<div className="flex h-full w-full flex-col items-center justify-center p-4">
			<svg ref={svgRef} className="w-full max-w-4xl rounded-lg shadow-2xl" />
		</div>
	);
};

export default SCThermalMatrix;

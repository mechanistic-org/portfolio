// Shared career scale and employer periods from the canonical chronology projection.
import * as d3 from "d3";
import chronology from "../../data/careerChronology.json";
import { getEntityColor } from "../../config/color_registry";

interface ProjectPoint {
	id: string;
	group: string;
	date: Date | null;
	end_date?: string;
	radius: number;
	x?: number;
	y?: number;
}

function employerKey(name: string) {
	const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
	if (key.startsWith("digidesign")) return "digidesign";
	if (key.startsWith("noon")) return "noon";
	return key;
}

const displayNames: Record<string, string> = {
	mechanistic: "Mechanistic",
	hyphen: "Hyphen",
	noon: "Noon",
	avegant: "Avegant",
	kaleidescape: "Kaleidescape",
	digidesign: "Digidesign",
	frogdesign: "frogdesign",
	eptechnologies: "EP Technologies",
};

const ribbonOpacity = {
	restingFill: 0.02,
	restingStroke: 0.06,
	activeFill: 0.21,
	activeStroke: 0.7,
};

export function careerMapGeometry(width: number, height: number, nodes: ProjectPoint[]) {
	const compact = width < 600;
	const axisX = compact ? 46 : 66;
	const railX = width - (compact ? 102 : 144);
	const top = 118;
	const bottom = height - 142;
	const now = new Date();
	const firstYear = Math.min(
		...nodes.flatMap((node) => (node.date ? [node.date.getUTCFullYear()] : [])),
		...chronology.roles.flatMap((role) => (role.period.start ? [Number(role.period.start)] : [])),
	);
	const oldest = Math.floor(firstYear / 5) * 5;
	const timeScale = d3
		.scaleUtc()
		.domain([now, new Date(Date.UTC(oldest, 0, 1))])
		.range([top, bottom]);
	return {
		width,
		height,
		compact,
		axisX,
		railX,
		top,
		bottom,
		oldest,
		now,
		timeScale,
		plotLeft: axisX + 12,
		plotRight: railX - 16,
	};
}

export function drawCareerBackdrop(
	svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
	layout: ReturnType<typeof careerMapGeometry>,
	nodes: ProjectPoint[],
) {
	const { width, height, compact, axisX, railX, top, bottom, oldest, now, timeScale } = layout;
	const color = (key: string) =>
		d3.color(getEntityColor(displayNames[key] ?? key, "EMPLOYER"))?.formatHex() ?? "#749abe";
	const background = svg.append("g").attr("class", "career-backdrop");
	const ribbons = background.append("g").attr("pointer-events", "none");
	const grid = background.append("g").attr("pointer-events", "none");
	const axis = background
		.append("g")
		.attr("class", "career-year-axis")
		.attr("font-family", "ui-monospace, monospace");
	axis
		.append("line")
		.attr("x1", axisX)
		.attr("x2", axisX)
		.attr("y1", top)
		.attr("y2", bottom)
		.attr("stroke", "#94a3b8")
		.attr("stroke-opacity", 0.3);
	axis
		.append("text")
		.attr("x", axisX - 10)
		.attr("y", top - 16)
		.attr("text-anchor", "end")
		.attr("fill", "#e2e8f0")
		.attr("font-size", 10)
		.attr("letter-spacing", "0.1em")
		.text("NOW");
	for (let year = oldest; year <= now.getUTCFullYear(); year++) {
		const y = timeScale(new Date(Date.UTC(year, 0, 1)));
		const major = year % 5 === 0;
		const tick = axis.append("g").attr("data-year", year).attr("transform", `translate(0,${y})`);
		tick
			.append("line")
			.attr("x1", axisX - (major ? 8 : 4))
			.attr("x2", axisX + (major ? 4 : 0))
			.attr("stroke", "#cbd5e1")
			.attr("stroke-opacity", major ? 0.6 : 0.22);
		if (!major) continue;
		const count = nodes.filter(
			(node) => node.date && Math.floor(node.date.getUTCFullYear() / 5) * 5 === year,
		).length;
		tick
			.append("text")
			.attr("x", axisX - 13)
			.attr("dy", "0.35em")
			.attr("text-anchor", "end")
			.attr("fill", year % 10 === 0 ? "#e2e8f0" : "#aeb9c8")
			.attr("font-size", compact ? 10 : 12)
			.attr("font-weight", year % 10 === 0 ? 600 : 400)
			.text(year)
			.append("title")
			.text(`${year}–${year + 4}: ${count} projects`);
		grid
			.append("line")
			.attr("x1", axisX + 5)
			.attr("x2", railX - 12)
			.attr("y1", y)
			.attr("y2", y)
			.attr("stroke", "#cbd5e1")
			.attr("stroke-opacity", 0.055)
			.attr("stroke-dasharray", "2 7");
	}
	const identities = new Set(nodes.map((node) => employerKey(node.group)));
	const periods = chronology.roles
		.flatMap((role) => {
			const key = employerKey(role.company);
			if (!role.period.start || !identities.has(key)) return [];
			const start = Number(role.period.start);
			const end = role.period.end ? Number(role.period.end) : now.getUTCFullYear();
			const yTop = timeScale(role.period.end ? new Date(Date.UTC(end, 0, 1)) : now);
			const yBottom = timeScale(new Date(Date.UTC(start, 0, 1)));
			return [
				{
					id: role.id,
					key,
					start,
					end,
					yTop,
					yBottom,
					label: displayNames[key] ?? role.company,
					period: `${start}–${role.period.end ?? "Present"}`,
					ongoing: !role.period.end,
					labelY: (yTop + yBottom) / 2,
					rail: railX,
				},
			];
		})
		.sort((a, b) => a.labelY - b.labelY);
	// Keep labels readable while the colored brackets retain their actual time spans.
	for (let i = 1; i < periods.length; i++) {
		periods[i].labelY = Math.max(periods[i].labelY, periods[i - 1].labelY + 37);
		if (periods[i].yTop < periods[i - 1].yBottom) periods[i].rail = railX - 7;
	}
	const overshoot = Math.max(0, (periods.at(-1)?.labelY ?? 0) - bottom + 12);
	if (overshoot)
		periods.forEach((period) => {
			period.labelY -= overshoot;
		});
	const curveX = axisX + (railX - axisX) * 0.52;
	const ribbon = ribbons
		.selectAll("path")
		.data(periods)
		.join("path")
		.attr("class", "employer-ribbon")
		.attr("data-role-id", (period) => period.id)
		.attr("fill", (period) => color(period.key))
		.attr("fill-opacity", ribbonOpacity.restingFill)
		.attr("stroke", (period) => color(period.key))
		.attr("stroke-opacity", ribbonOpacity.restingStroke)
		.attr("stroke-width", 0.7)
		.attr("d", (period) => {
			const half = Math.min(19, Math.max(5, (period.yBottom - period.yTop) * 0.17));
			return `M${axisX + 1},${period.yTop} C${curveX},${period.yTop} ${curveX},${period.labelY - half} ${period.rail},${period.labelY - half}
			L${period.rail},${period.labelY + half} C${curveX},${period.labelY + half} ${curveX},${period.yBottom} ${axisX + 1},${period.yBottom} Z`;
		});
	const zones = background
		.append("g")
		.attr("pointer-events", "none")
		.selectAll("g")
		.data(periods)
		.join("g")
		.attr("class", "employer-zone")
		.attr("data-role-id", (period) => period.id)
		.attr("data-employer", (period) => period.key)
		.attr("role", "img")
		.attr("aria-label", (period) => `${period.label}, ${period.period}`);
	zones
		.append("path")
		.attr("class", "employer-period")
		.attr(
			"d",
			(period) =>
				`M${period.rail - 3},${period.yTop} H${period.rail} V${period.yBottom} H${period.rail - 3}`,
		)
		.attr("fill", "none")
		.attr("stroke", (period) => color(period.key))
		.attr("stroke-width", 2)
		.attr("stroke-opacity", (period) => (period.ongoing ? 0.85 : 0.55));
	zones
		.append("line")
		.attr("x1", (period) => period.rail)
		.attr("x2", railX + 7)
		.attr("y1", (period) => (period.yTop + period.yBottom) / 2)
		.attr("y2", (period) => period.labelY)
		.attr("stroke", (period) => color(period.key))
		.attr("stroke-opacity", 0.4);
	zones
		.append("text")
		.attr("class", "employer-name")
		.attr("x", railX + 12)
		.attr("y", (period) => period.labelY - 2)
		.attr("font-family", "system-ui, sans-serif")
		.attr("font-size", compact ? 10 : 12)
		.attr("font-weight", 500)
		.attr("fill", (period) => (period.ongoing ? "#e2e8f0" : "#adb6c3"))
		.text((period) => period.label);
	zones
		.append("text")
		.attr("x", railX + 12)
		.attr("y", (period) => period.labelY + 13)
		.attr("font-family", "ui-monospace, monospace")
		.attr("font-size", compact ? 8 : 9)
		.attr("fill", (period) => (period.ongoing ? "#b2bfd0" : "#717e90"))
		.text((period) => period.period);
	if (nodes.some((node) => !node.date)) {
		axis
			.append("text")
			.attr("x", 12)
			.attr("y", height - 88)
			.attr("font-size", 8)
			.attr("letter-spacing", "0.06em")
			.attr("fill", "#8b98aa")
			.text("UNDATED");
		grid
			.append("line")
			.attr("x1", axisX)
			.attr("x2", railX - 12)
			.attr("y1", height - 94)
			.attr("y2", height - 94)
			.attr("stroke", "#94a3b8")
			.attr("stroke-opacity", 0.12)
			.attr("stroke-dasharray", "3 5");
	}
	const focus = background
		.append("g")
		.attr("class", "career-focus-path")
		.attr("pointer-events", "none")
		.attr("opacity", 0);
	const leftPath = focus.append("path").attr("fill", "none").attr("stroke-width", 1.2);
	const rightPath = focus.append("path").attr("fill", "none").attr("stroke-width", 1.2);
	const timeDot = focus.append("circle").attr("cx", axisX).attr("r", 3);
	let active: ProjectPoint | null = null;
	let activePeriod: (typeof periods)[number] | undefined;
	const periodFor = (node: ProjectPoint | null) => {
		const year = node?.date?.getUTCFullYear();
		const endYear = node?.end_date ? new Date(node.end_date).getUTCFullYear() : year;
		return year === undefined
			? undefined
			: periods.find(
					(period) =>
						period.key === employerKey(node!.group) &&
						year <= period.end &&
						(endYear ?? year) >= period.start,
				);
	};
	const position = () => {
		if (!active?.date) return;
		const x = active.x ?? width / 2;
		const y = active.y ?? top;
		const sourceY = timeScale(active.date);
		const mid = (axisX + x - active.radius) / 2;
		leftPath.attr(
			"d",
			`M${axisX},${sourceY} C${mid},${sourceY} ${mid},${y} ${x - active.radius - 3},${y}`,
		);
		timeDot.attr("cy", sourceY);
		rightPath.attr(
			"d",
			activePeriod
				? `M${x + active.radius + 3},${y} C${railX - 40},${y} ${railX - 40},${activePeriod.labelY} ${activePeriod.rail},${activePeriod.labelY}`
				: null,
		);
	};
	return {
		position,
		periodFor,
		update(node: ProjectPoint | null) {
			active = node;
			const key = node ? employerKey(node.group) : null;
			// Only connect to a particular engagement when its recorded years overlap.
			activePeriod = periodFor(node);
			const selected = (period: (typeof periods)[number]) => period.id === activePeriod?.id;
			ribbon
				.attr("data-active", (period) => String(selected(period)))
				.attr("fill-opacity", (period) =>
					selected(period) ? ribbonOpacity.activeFill : ribbonOpacity.restingFill,
				)
				.attr("stroke-opacity", (period) =>
					selected(period) ? ribbonOpacity.activeStroke : ribbonOpacity.restingStroke,
				);
			zones.attr("data-active", (period) => String(selected(period)));
			zones
				.select(".employer-name")
				.attr("fill", (period) =>
					selected(period) ? "#f1f5f9" : period.ongoing ? "#e2e8f0" : "#adb6c3",
				);
			zones
				.select(".employer-period")
				.attr("stroke-opacity", (period) => (selected(period) ? 1 : period.ongoing ? 0.85 : 0.55));
			focus
				.attr("opacity", node?.date ? 0.8 : 0)
				.attr("stroke", key ? color(key) : "none")
				.attr("fill", key ? color(key) : "none")
				.attr("data-project-id", node?.id ?? "")
				.attr("data-role-id", activePeriod?.id ?? "");
			position();
		},
	};
}

// Temporarily pack one recorded employer period, then restore
// the original swarm. These coordinates are presentation only, never chronology.
import * as d3 from "d3";

interface Point extends d3.SimulationNodeDatum {
	id: string;
	radius: number;
	date: Date | null;
}
interface Swath {
	id: string;
	yTop: number;
	yBottom: number;
	labelY: number;
}
export interface Position {
	x: number;
	y: number;
}

export function employerPackingTargets<T extends Point>(
	nodes: T[],
	baseline: Map<string, Position>,
	focus: T,
	swath: Swath,
	periodFor: (node: T) => Swath | undefined,
	geometry: {
		plotLeft: number;
		plotRight: number;
		top: number;
		height: number;
		timeScale: (date: Date) => number;
	},
) {
	const { plotLeft, plotRight, top, height, timeScale } = geometry;
	const cohort = nodes
		.filter((node) => periodFor(node)?.id === swath.id)
		.sort((a, b) => baseline.get(a.id)!.x - baseline.get(b.id)!.x || a.id.localeCompare(b.id));
	const members = new Set(cohort.map((node) => node.id));
	const largest = Math.max(...cohort.map((node) => node.radius));
	const left = plotLeft + largest + 6;
	const right = plotRight - largest - 6;
	const localMargin = largest * 2 + 30;
	const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
	const packed = nodes.map((node) => {
		const base = baseline.get(node.id)!;
		const member = members.has(node.id);
		const ordinal = cohort.findIndex((candidate) => candidate.id === node.id);
		const spreadX =
			cohort.length < 2 ? base.x : left + ((right - left) * ordinal) / (cohort.length - 1);
		const targetX = member ? base.x * 0.2 + spreadX * 0.8 : base.x;
		const timeY = node.date ? timeScale(node.date) : base.y;
		// Follow the converging ribbon softly; collision can widen a dense cohort.
		const taper = clamp((targetX - plotLeft) / (plotRight - plotLeft), 0, 1) * 0.65;
		const targetY = member ? timeY * (1 - taper) + swath.labelY * taper : base.y;
		const fixed =
			node.id === focus.id ||
			(!member && (base.y < swath.yTop - localMargin || base.y > swath.yBottom + localMargin));
		const anchor = node.id === focus.id ? { x: node.x!, y: node.y! } : base;
		return {
			id: node.id,
			radius: node.radius,
			member,
			targetX,
			targetY,
			x: base.x,
			y: base.y,
			fx: fixed ? anchor.x : null,
			fy: fixed ? anchor.y : null,
		};
	});
	const layout = d3
		.forceSimulation(packed)
		.stop()
		.alphaDecay(0.035)
		.force(
			"x",
			d3
				.forceX<(typeof packed)[number]>((node) => node.targetX)
				.strength((node) => (node.member ? 0.3 : 0.15)),
		)
		.force(
			"y",
			d3
				.forceY<(typeof packed)[number]>((node) => node.targetY)
				.strength((node) => (node.member ? 0.65 : 0.7)),
		)
		.force(
			"collide",
			d3
				.forceCollide<(typeof packed)[number]>((node) => node.radius + 3)
				.strength(1)
				.iterations(3),
		);
	for (let tick = 0; tick < 150; tick++) {
		layout.tick();
		for (const node of packed) {
			node.x = clamp(node.x, plotLeft + node.radius + 4, plotRight - node.radius - 4);
			node.y = clamp(node.y, top + node.radius, height - node.radius - 40);
		}
	}
	return { members, positions: new Map(packed.map((node) => [node.id, { x: node.x, y: node.y }])) };
}

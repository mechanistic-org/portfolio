/** A bounded, deterministic projection of generated career records (#137).
 * Window: the current project's dated span plus two whole calendar years on
 * each side. Select the six closest project starts inside that window; ties
 * use the slug, never collection order. Lanes only prevent visual collisions.
 * Missing/invalid starts are omitted. A missing/invalid/reversed end remains
 * a dated point; duration strings never manufacture dates. All math is UTC.
 */
interface CareerNode {
	id: string;
	type: string;
	data: { title?: unknown; date?: unknown; endDate?: unknown; employer?: unknown };
}

export interface RibbonProject {
	slug: string;
	title: string;
	employer: string;
	start: number;
	end: number | null;
	period: string;
	current: boolean;
	x: number;
	width: number;
	lane: number;
}

export interface RibbonModel {
	projects: RibbonProject[];
	years: { label: number; x: number }[];
	startYear: number;
	endYear: number;
	laneCount: number;
	neighborCount: number;
	availableNeighbors: number;
}

function timestamp(value: unknown): number | null {
	if (!(value instanceof Date) && typeof value !== "string") return null;
	if (typeof value === "string" && !/^\d{4}-\d{2}-\d{2}(?:[T\s]|$)/u.test(value)) return null;
	const result = value instanceof Date ? value.getTime() : Date.parse(value);
	return Number.isFinite(result) ? result : null;
}

const compareSlug = (a: { slug: string }, b: { slug: string }) =>
	a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0;

export function buildContextRibbon(
	nodes: readonly CareerNode[],
	currentSlug: string,
): RibbonModel | null {
	const records = nodes.flatMap((node) => {
		if (node.type !== "project" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(node.id)) return [];
		const start = timestamp(node.data.date);
		if (start === null || typeof node.data.title !== "string" || !node.data.title.trim()) return [];
		const candidateEnd = timestamp(node.data.endDate);
		const end = candidateEnd !== null && candidateEnd >= start ? candidateEnd : null;
		const startYear = new Date(start).getUTCFullYear();
		const endYear = end === null ? startYear : new Date(end).getUTCFullYear();
		return [
			{
				slug: node.id,
				title: node.data.title,
				employer: typeof node.data.employer === "string" ? node.data.employer : "",
				start,
				end,
				period: startYear === endYear ? `${startYear}` : `${startYear}–${endYear}`,
			},
		];
	});
	const current = records.find((record) => record.slug === currentSlug);
	if (!current) return null;
	const startYear = new Date(current.start).getUTCFullYear() - 2;
	const endYear = new Date(current.end ?? current.start).getUTCFullYear() + 2;
	const windowStart = Date.UTC(startYear, 0, 1);
	const windowEnd = Date.UTC(endYear + 1, 0, 1);
	const available = records.filter(
		(record) =>
			record.slug !== currentSlug &&
			record.start < windowEnd &&
			(record.end ?? record.start) >= windowStart,
	);
	const selected = available
		.sort(
			(a, b) =>
				Math.abs(a.start - current.start) - Math.abs(b.start - current.start) || compareSlug(a, b),
		)
		.slice(0, 6);
	// Chart units leave room for focus rings and year labels at either edge.
	const position = (date: number) =>
		24 +
		((Math.max(windowStart, Math.min(windowEnd, date)) - windowStart) / (windowEnd - windowStart)) *
			912;
	const laneEnds: number[] = [];
	const projects = [current, ...selected]
		.sort((a, b) => a.start - b.start || compareSlug(a, b))
		.map((record) => {
			const x = position(record.start);
			const width = record.end === null ? 0 : Math.max(0, position(record.end) - x);
			let lane = laneEnds.findIndex((end) => end + 24 <= x);
			if (lane === -1) lane = laneEnds.length;
			laneEnds[lane] = x + Math.max(width, 12);
			return { ...record, current: record.slug === currentSlug, x, width, lane };
		});
	return {
		projects,
		years: Array.from({ length: endYear - startYear + 1 }, (_, index) => ({
			label: startYear + index,
			x: position(Date.UTC(startYear + index, 0, 1)),
		})),
		startYear,
		endYear,
		laneCount: laneEnds.length,
		neighborCount: selected.length,
		availableNeighbors: available.length,
	};
}

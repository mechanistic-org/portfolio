import chronology from "../data/careerChronology.json" with { type: "json" };

interface Period {
	start: string | null;
	end: string | null;
	basis: string;
	context?: string;
	approximate?: boolean;
}
const periods: Record<string, Period> = chronology.projects;

/** Shared canonical chronology for the map, viewer and project timelines.
 * Year boundaries are plotting coordinates, never newly asserted exact dates. */
export function projectPeriod(id: string, data: { date?: unknown; endDate?: unknown }) {
	const canonical = periods[id];
	const fallback = projectDates(data);
	const start = canonical ? canonical.start : fallback.start_date || null;
	const end = canonical ? canonical.end : fallback.end_date || null;
	const startYear = start ? new Date(start).getUTCFullYear() : null;
	const endYear = end ? new Date(end).getUTCFullYear() : startYear;
	const period =
		startYear === null
			? "Date unresolved"
			: startYear === endYear
				? `${startYear}`
				: `${startYear}–${endYear}`;
	return {
		start,
		end,
		period: canonical?.approximate && startYear !== null ? `c. ${period}` : period,
		basis: canonical?.basis ?? "project-record",
		context: canonical?.context,
	};
}

/** Never substitute the render/build date for an unknown project date. */
export function projectDates(data: { date?: unknown; endDate?: unknown }) {
	const iso = (value: unknown) => {
		if (!(value instanceof Date) && typeof value !== "string") return "";
		const date = new Date(value);
		return Number.isFinite(date.getTime()) ? date.toISOString() : "";
	};
	const start_date = iso(data.date);
	const end = iso(data.endDate);
	return { start_date, end_date: start_date && end >= start_date ? end : "" };
}

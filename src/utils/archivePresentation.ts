import { INDUSTRIES, PRODUCTION_STATUS } from "../config/taxonomy.ts";
import { projectPeriod } from "./projectDates.ts";

export type ArchiveColumn = "project" | "client" | "industry" | "year" | "status";
export type ArchiveDirection = "ascending" | "descending";
export interface ArchiveSortValues {
	slug: string;
	project: string;
	client: string | null;
	industry: string | null;
	year: number | null;
	status: string | null;
}
interface ArchiveProject {
	id: string;
	data: {
		title: string;
		date?: unknown;
		endDate?: unknown;
		client?: string[];
		employer?: string;
		industry?: string;
		production?: string;
	};
}

/** Archive display uses reviewed year precision, never fabricated exact dates. */
export function archivePresentation(project: ArchiveProject) {
	const { id, data } = project;
	const period = projectPeriod(id, data);
	const startYear = period.start ? new Date(period.start).getUTCFullYear() : null;
	const year = startYear !== null && Number.isFinite(startYear) ? startYear : null;
	const industry = INDUSTRIES.find((item) => item.value === data.industry)?.label ?? null;
	const status = PRODUCTION_STATUS.find((item) => item.value === data.production)?.label ?? null;
	const clients = [...new Set([...(data.client ?? []), data.employer].filter(Boolean))];
	return {
		period: year === null ? "Date unresolved" : period.period,
		basis: period.basis,
		context: period.context,
		industry: industry ?? "Industry not recorded",
		status: status ?? "Status not recorded",
		sort: {
			slug: id,
			project: data.title,
			client: clients.join(", ") || null,
			industry,
			year,
			status,
		} satisfies ArchiveSortValues,
	};
}

const compareText = (a: string, b: string) =>
	a.localeCompare(b, "en", { numeric: true, sensitivity: "base" });

/** Missing values stay last in either direction; equal values have a stable identity tie-break. */
export function compareArchive(
	a: ArchiveSortValues,
	b: ArchiveSortValues,
	column: ArchiveColumn = "year",
	direction: ArchiveDirection = "descending",
) {
	const left = a[column],
		right = b[column];
	if (left === null && right !== null) return 1;
	if (right === null && left !== null) return -1;
	const difference =
		left === null || right === null
			? 0
			: typeof left === "number" && typeof right === "number"
				? left - right
				: compareText(String(left), String(right));
	return (
		difference * (direction === "ascending" ? 1 : -1) ||
		compareText(a.project, b.project) ||
		compareText(a.slug, b.slug)
	);
}

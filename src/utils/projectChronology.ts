export interface ChronologyEvent {
	id: string;
	date: string;
	end_date?: string;
	date_label?: string;
	date_basis?: string;
	verification_note?: string;
	title: string;
	summary: string;
	phase: string;
	category: string;
	prominence: "prominent" | "detail" | "cluster-detail";
	source_ids: string[];
	cluster_id?: string;
	anchor?: string;
	link_label?: string;
}
export interface Chronology {
	title: string;
	start: string;
	end: string;
	phases: { id: string; label: string; start: string; end: string }[];
	events: ChronologyEvent[];
	clusters: {
		id: string;
		label: string;
		summary: string;
		event_ids: string[];
		verified_identifier_count?: number;
	}[];
}

/** Recorded display precision takes precedence over dates used for sorting/geometry. */
export function chronologyDate(event: ChronologyEvent): string {
	if (event.date_label?.trim()) return event.date_label;
	const format = (date: string) =>
		new Intl.DateTimeFormat("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			timeZone: "UTC",
		}).format(new Date(`${date}T00:00:00Z`));
	return event.end_date ? `${format(event.date)} – ${format(event.end_date)}` : format(event.date);
}

export function chronologyPhases(chronology: Chronology) {
	return chronology.phases.map((phase) => ({
		...phase,
		events: chronology.events.filter((event) => event.phase === phase.id),
	}));
}

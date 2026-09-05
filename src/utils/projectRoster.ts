/** Shared route eligibility. An empty targets array deliberately emits no route (including aliases). */
export function routeEligibleProjects<
	T extends { id: string; data: { targets?: string[]; draft?: boolean } },
>(projects: readonly T[], site: string, includeDrafts = false): T[] {
	return projects.filter(
		({ data }) => (data.targets ?? ["main"]).includes(site) && (!data.draft || includeDrafts),
	);
}

/** Lightweight career projection: no skill graph, physics, or intelligence payloads. */
export function careerRecords<
	T extends {
		id: string;
		data: { title?: unknown; date?: unknown; endDate?: unknown; employer?: unknown };
	},
>(projects: readonly T[], aliases: Readonly<Record<string, string>> = {}) {
	return projects
		.filter(({ id }) => !Object.hasOwn(aliases, id))
		.map(({ id, data }) => ({ id, type: "project", data }));
}

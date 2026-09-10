// Browser-safe claim resolution. Private evidence and approval records never enter this module.
export function resolveClaim(bundle, ref) {
	const claim = bundle.claims.find((item) => item.id === ref.id);
	if (!claim || claim.status !== "active") throw new Error(`Unavailable claim: ${ref.id}`);
	if (claim.project !== ref.project) throw new Error(`Claim/project mismatch: ${ref.id}`);
	if (claim.revision !== ref.revision) throw new Error(`Stale claim revision: ${ref.id}`);
	const variant = claim.variants[ref.surface];
	if (!variant) throw new Error(`Unreviewed surface: ${ref.id}/${ref.surface}`);
	return { ...variant, href: claim.href, project: claim.project, id: claim.id };
}

export function interpolate(template, values) {
	return template.replace(/\{\{([a-zA-Z][\w.-]*)\}\}/g, (_, key) => {
		if (!Object.hasOwn(values, key)) throw new Error(`Missing claim parameter: ${key}`);
		return values[key];
	});
}

// One complete assertion is mandatory on every surface; no number-only degradation.
export function renderRecord(record) {
	const values = Object.fromEntries(Object.entries(record.facts).map(([key, fact]) => {
		if (!Number.isFinite(fact.value) || !Number.isInteger(fact.precision) || fact.precision < 0 || fact.precision > 6)
			throw new Error(`Invalid quantity: ${record.id}/${key}`);
		if (!fact.unit || !fact.kind || !fact.scope) throw new Error(`Unscoped quantity: ${record.id}/${key}`);
		return [key, fact.value.toFixed(fact.precision)];
	}));
	for (const key of Object.keys(values)) {
		if (!record.statement.includes(`{{${key}}}`)) throw new Error(`Unused quantity: ${record.id}/${key}`);
	}
	const statement = interpolate(record.statement, values);
	const variants = Object.fromEntries(Object.entries(record.variants).map(([surface, variant]) => {
		if ((variant.text.match(/\{\{statement\}\}/g) ?? []).length !== 1)
			throw new Error(`Complete assertion required: ${record.id}/${surface}`);
		return [surface, { text: interpolate(variant.text, { statement }), title: variant.title }];
	}));
	return { id: record.id, project: record.project, revision: record.revision, status: record.status, href: record.href, variants };
}

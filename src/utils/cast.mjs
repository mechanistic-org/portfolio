/**
 * @typedef {{name: string, role: string, org: string, roster?: "key" | "stakeholder",
 * linkedin?: string, consent?: "unset" | "approved" | "editorial-approved" | "declined"}} CastMember
 */
const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
const key = (member) => [member.name, member.role, member.org].map((v) => clean(v).toLowerCase()).join("|");

/** One visibility rule for the selector and the roster. Multiple distinct roles survive.
 * @param {CastMember[]} [raw]
 * @param {string} [omit]
 * @returns {CastMember[]}
 */
export function normalizeCast(raw = [], omit = "Erik Norris") {
	const declined = new Set(raw.filter((m) => m.consent === "declined").map(key));
	const seen = new Set();
	return raw.filter((m) => {
		const name = clean(m.name);
		const owner = name.replace(/\s*\([^)]*\)/g, "").trim().toLowerCase() === clean(omit).toLowerCase();
		const identity = key(m);
		if (!name || owner || declined.has(identity) || seen.has(identity)) return false;
		seen.add(identity);
		return true;
	}).map((m) => ({ ...m, name: clean(m.name), role: clean(m.role), org: clean(m.org) }));
}

/** Group by recorded organization and curated roster, never inferred discipline or vendor status.
 * @param {CastMember[]} cast
 */
export function groupCast(cast) {
	return ["key", "stakeholder"].map((roster) => {
		const organizations = new Map();
		for (const member of cast.filter((m) => (m.roster ?? "key") === roster)) {
			const org = member.org || "Contributors";
			if (!organizations.has(org)) organizations.set(org, []);
			organizations.get(org).push(member);
		}
		return { roster, organizations: [...organizations].map(([org, members]) => ({ org, members })) };
	}).filter((group) => group.organizations.length);
}

/** Link approval can be editorial; it never rewrites historical colleague consent. */
export function canLinkCast(member) {
 return ["approved", "editorial-approved"].includes(member.consent) &&
  typeof member.linkedin === "string" && /^https:\/\/(www\.)?linkedin\.com\/in\/[^/?#]+\/?$/.test(member.linkedin);
}

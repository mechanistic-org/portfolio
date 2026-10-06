const ID = /^[a-z][a-z0-9-]*$/;
const validId = (value) => typeof value === "string" && ID.test(value);
const fail = (message) => {
	throw new Error(`[project synopsis] ${message}`);
};
const object = (value) => value && typeof value === "object" && !Array.isArray(value);
const text = (value) =>
	typeof value === "string" &&
	value.trim() === value &&
	value.length > 0 &&
	!/[<>\r\n]/.test(value);
const keys = (value, allowed) => {
	if (Object.keys(value).some((k) => !allowed.includes(k))) fail("Unknown field");
};

/** Canon owns the words and selections. Adapters may format, never invent or truncate them. */
export function validateSynopsis(value) {
	if (!object(value)) fail("Expected an object");
	keys(value, ["version", "title", "subtitle", "roleId", "paragraphs", "outputs"]);
	if (value.version !== 1) fail("Unsupported version");
	for (const field of ["title", "subtitle"])
		if (value[field] !== undefined && !text(value[field])) fail(`Invalid ${field}`);
	if (value.roleId !== undefined && !validId(value.roleId)) fail("Invalid roleId");
	if (!Array.isArray(value.paragraphs) || !value.paragraphs.length) fail("Missing paragraphs");
	const ids = new Set();
	for (const p of value.paragraphs) {
		if (!object(p)) fail("Invalid paragraph");
		keys(p, ["id", "text"]);
		if (!validId(p.id) || ids.has(p.id) || !text(p.text)) fail("Invalid or duplicate paragraph");
		ids.add(p.id);
	}
	if (value.outputs !== undefined) {
		if (!object(value.outputs)) fail("Invalid outputs");
		keys(value.outputs, ["resume", "linkedinExperience", "linkedinProjects"]);
		if (!value.roleId) fail("Outputs require a canonical roleId");
		for (const channel of ["resume", "linkedinExperience"]) {
			const selection = value.outputs[channel];
			if (
				selection !== undefined &&
				(!Array.isArray(selection) ||
					!selection.length ||
					new Set(selection).size !== selection.length ||
					selection.some((id) => !ids.has(id)))
			)
				fail(`Invalid ${channel} paragraph selection`);
		}
		const projects = value.outputs.linkedinProjects;
		if (projects !== undefined) {
			if (!Array.isArray(projects)) fail("Invalid LinkedIn projects");
			const seen = new Set();
			for (const p of projects) {
				if (!object(p)) fail("Invalid LinkedIn project");
				keys(p, ["id", "title", "sections"]);
				if (!validId(p.id) || seen.has(p.id) || !text(p.title))
					fail("Invalid or duplicate LinkedIn project");
				seen.add(p.id);
				if (
					!Array.isArray(p.sections) ||
					!p.sections.length ||
					new Set(p.sections).size !== p.sections.length ||
					p.sections.some((id) => !validId(id))
				)
					fail("Invalid section selection");
			}
		}
	}
	return value;
}

export function synopsisText(synopsis, channel = "site") {
	validateSynopsis(synopsis);
	if (!["site", "resume", "linkedinExperience"].includes(channel))
		fail(`Unknown channel ${channel}`);
	const selection =
		channel === "site" ? synopsis.paragraphs.map((p) => p.id) : synopsis.outputs?.[channel];
	if (!selection) return null;
	return selection.map((id) => synopsis.paragraphs.find((p) => p.id === id).text).join("\n\n");
}

export function synopsisForRole(records, roleId, channel) {
	if (!Array.isArray(records)) fail("Expected project records");
	const selected = records
		.filter((r) => r.roleId === roleId)
		.map((r) => ({ record: r, text: synopsisText(r.synopsis, channel) }))
		.filter((r) => r.text);
	if (!selected.length) return null;
	return selected
		.map(({ record, text }) => (selected.length > 1 ? `${record.title}\n\n${text}` : text))
		.join("\n\n");
}

/** A synopsis-only project uses this same opening without article or gallery requirements. */
export function synopsisOpening(page) {
	const value = page.frontmatter?.synopsis;
	if (!value) return null;
	validateSynopsis(value);
	const escape = (text) =>
		text.replace(
			/[&<>"']/g,
			(c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
		);
	return {
		title: value.title ?? page.title,
		subtitle: value.subtitle,
		blocks: value.paragraphs.map((p) => escape(p.text)),
		image: page.image,
		pieces: page.pieces,
		removedImageCount: 0,
	};
}

const PRIVATE_PUBLIC_KEYS = new Set([
	"command",
	"exact_command",
	"raw_output",
	"private_source_identity",
	"local_path",
	"person",
	"person_id",
	"customer",
	"customer_id",
	"transcript",
	"prompt",
	"session_id",
	"private_repository",
	"issue_id",
	"confidential",
]);

const PRIVATE_PUBLIC_TEXT_PATTERNS = [
	{ pattern: /\b[a-zA-Z]:[\\/]/u, description: "a local drive path" },
	{ pattern: /(?:^|\s)\\\\/u, description: "a UNC path" },
	{
		pattern:
			/\b(?:[a-z0-9_.-]+#\d+|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\b/iu,
		description: "a session identifier",
	},
	{
		pattern: /\bssn_[a-f0-9]{32}\b/iu,
		description: "an opaque session identifier",
	},
	{
		pattern: /\brec_[a-f0-9]{32}\b/iu,
		description: "an opaque durable-record identifier",
	},
	{
		pattern: /\btranscripts?\b/iu,
		description: "transcript material",
	},
	{
		pattern: /\bprompts?\b/iu,
		description: "prompt material",
	},
	{
		pattern: /\bprivate\s+(?:issue|ticket)\b/iu,
		description: "private issue content",
	},
	{
		pattern:
			/\bhttps:\/\/github\.com\/[^/\s]+\/[^/\s]*(?:private|internal|confidential)[^/\s]*(?:\/[^\s]*)?/iu,
		description: "a private repository identity",
	},
	{
		pattern: /\b(?:private|internal|confidential)\s+(?:source\s+)?repositor(?:y|ies)\b/iu,
		description: "a private repository identity",
	},
	{
		pattern: /\bcustomer(?:\s+(?:name|identity|attribution))?\s*[:=]/iu,
		description: "customer attribution",
	},
	{
		pattern:
			/\b(?:[Bb]uilt|[Mm]ade|[Dd]elivered|[Dd]eveloped|[Ww]orked|[Pp]roduced)\s+(?:for|with)\s+\p{Lu}[\p{L}\p{N}&.'-]*/u,
		description: "customer attribution",
	},
	{
		pattern: /\bconfidential(?:[-\s]+work)?\b/iu,
		description: "a confidential-work signal",
	},
	{
		pattern:
			/\b(?:created|closed|committed|completed|worked|logged|ran|published)\b[^.\n]{0,80}(?:\bon\s+|,\s*)\d{4}-\d{2}-\d{2}\b/iu,
		description: "person-level or daily activity",
	},
	{
		pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/iu,
		description: "an email identity",
	},
];

function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function assertPublicProjectionPrivacy(value, fail, label = "public projection") {
	if (Array.isArray(value)) {
		value.forEach((item, index) => assertPublicProjectionPrivacy(item, fail, `${label}[${index}]`));
		return;
	}

	if (!isRecord(value)) {
		if (typeof value === "string") {
			for (const privatePattern of PRIVATE_PUBLIC_TEXT_PATTERNS) {
				if (privatePattern.pattern.test(value)) {
					fail(`${label} contains ${privatePattern.description}`);
				}
			}
		}
		return;
	}

	for (const [key, child] of Object.entries(value)) {
		if (PRIVATE_PUBLIC_KEYS.has(key)) fail(`${label} contains private field ${key}`);
		assertPublicProjectionPrivacy(child, fail, `${label}.${key}`);
	}
}

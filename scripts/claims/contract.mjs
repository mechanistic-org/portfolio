import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { renderRecord } from "../../src/lib/project-claims.mjs";

export const digest = (value) => createHash("sha256").update(typeof value === "string" || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest("hex");
export const canonical = (value) => JSON.stringify(sort(value), null, 2) + "\n";
function sort(value) {
	if (Array.isArray(value)) return value.map(sort);
	if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sort(value[key])]));
	return value;
}
export function approvalDigest(record) {
	const { review, ...assertion } = record;
	return digest(canonical(assertion));
}
export function projectPackage(registry, { release = false } = {}) {
	if (registry.schema !== 1) throw new Error("Unknown claims schema");
	const seen = new Set();
	const claims = registry.claims.map((record) => {
		if (seen.has(record.id)) throw new Error(`Duplicate claim: ${record.id}`);
		seen.add(record.id);
		if (!/^[a-z0-9-]+$/.test(record.id) || !/^[a-z0-9-]+$/.test(record.project) || !Number.isInteger(record.revision) || record.revision < 1)
			throw new Error(`Invalid identity: ${record.id}`);
		if (!record.href.startsWith(`/projects/${record.project}/`)) throw new Error(`Wrong project destination: ${record.id}`);
		if (!record.attribution || !record.scope || !["observed", "proposed", "shipped"].includes(record.outcome)) throw new Error(`Incomplete assertion: ${record.id}`);
		if (!record.sources?.length || record.sources.some((source) => !source.id || !source.locator || !/^[a-f0-9]{64}$/.test(source.sha256))) throw new Error(`Missing support: ${record.id}`);
		if (!record.publicationAllowed) throw new Error(`Private claim: ${record.id}`);
		if (record.review?.digest !== approvalDigest(record)) throw new Error(`Changed assertion needs review: ${record.id}`);
		if (release && (record.review.status !== "accepted" || !record.review.receipt)) throw new Error(`Exact approval pending: ${record.id}`);
		if (!["active", "withdrawn"].includes(record.status)) throw new Error(`Unknown claim status: ${record.id}`);
		return renderRecord(record);
	});
	// Explicit allowlist: no source IDs, locators, testimony, reviewers or private paths.
	return { schema: 1, claims };
}
export function affectedConsumers(registry, ids) {
	return registry.consumers.filter((use) => ids.includes(use.id)).map((use) => `${use.path} [${use.id}/${use.surface}]`);
}
export function validateConsumers(registry, bundle) {
	const paths = new Set();
	for (const use of registry.consumers) {
		if (paths.has(use.path)) throw new Error(`Duplicate consumer: ${use.path}`);
		paths.add(use.path);
		const record = bundle.claims.find((claim) => claim.id === use.id);
		if (!record || record.status !== "active" || record.project !== use.project || record.revision !== use.revision || !record.variants[use.surface])
			throw new Error(`Invalid consumer: ${use.path} [${use.id}/${use.surface}]`);
	}
}
export function verifyEvidence(registry, evidenceRoot) {
	const index = fs.readFileSync(path.join(evidenceRoot, "registry/evidence.jsonl"), "utf8").trim().split(/\r?\n/).map(JSON.parse);
	const byId = new Map(index.map((entry) => [entry.id.replace(/^evidence:/, ""), entry]));
	if (byId.size !== index.length) throw new Error("Duplicate evidence registry identity");
	const checked = new Map();
	for (const claim of registry.claims) for (const source of claim.sources) {
		const impacted = registry.claims.filter((item) => item.sources.some((support) => support.id === source.id)).map((item) => item.id);
		const affected = affectedConsumers(registry, impacted).join("\n");
		const entry = byId.get(source.id.replace(/^evidence:/, ""));
		if (!entry || entry.sha256 !== source.sha256) throw new Error(`Changed evidence: ${claim.id}/${source.id}\n${affected}`);
		const file = path.resolve(evidenceRoot, entry.path);
		if (!file.startsWith(path.resolve(evidenceRoot) + path.sep)) throw new Error("Evidence path escaped root");
		const actualFile = fs.realpathSync(file);
		if (!actualFile.startsWith(fs.realpathSync(evidenceRoot) + path.sep)) throw new Error("Evidence link escaped root");
		if (!checked.has(actualFile)) checked.set(actualFile, digest(fs.readFileSync(actualFile)));
		if (checked.get(actualFile) !== entry.sha256) throw new Error(`Evidence bytes changed: ${claim.id}/${source.id}\n${affected}`);
	}
}
export function claimBlock(id, text) { return `{/* shared-claim:${id}:start */}\n${text}\n{/* shared-claim:${id}:end */}`; }
export function checkProjectBlocks(registry, bundle, canonRoot) {
	for (const record of bundle.claims) {
		const file = path.join(canonRoot, "entities/projects", record.project, `${record.project}.md`);
		const content = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
		const original = registry.claims.find((claim) => claim.id === record.id);
		const excerpt = original.projectExcerpt;
		const expected = record.variants["case-study"] ? claimBlock(record.id, record.variants["case-study"].text) : excerpt;
		if (!expected || !content.includes(expected) || !content.includes(`id="shared-${record.id}"`))
			throw new Error(`Project assertion drift: ${record.id}\n${affectedConsumers(registry, [record.id]).join("\n")}`);
		for (const guard of original.projectGuards ?? []) {
			if (!content.includes(guard)) throw new Error(`Project table/metadata drift: ${record.id}\n${affectedConsumers(registry, [record.id]).join("\n")}`);
		}
	}
}

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { canonical, projectPackage, validateConsumers, verifyEvidence, checkProjectBlocks } from "./contract.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const output = path.join(root, "src/data/project-claims.json");
const canon = process.env.CANON_ROOT;
if (!canon) {
	if (process.argv.includes("--release") || process.argv.includes("--write")) throw new Error("Explicit CANON_ROOT required for claims export/release");
	// Public CI verifies the committed projection; private support verification runs locally.
	const bundle = JSON.parse(fs.readFileSync(output, "utf8"));
	const { resolveClaim } = await import("../../src/lib/project-claims.mjs");
	const uses = JSON.parse(fs.readFileSync(path.join(root, "src/data/claim-consumers.json"), "utf8"));
	for (const use of uses) resolveClaim(bundle, use);
	console.log(`Claims: ${uses.length} public references resolved; private support check requires CANON_ROOT.`);
} else {
	const registry = JSON.parse(fs.readFileSync(path.join(canon, "claims/project-claims.json"), "utf8"));
	const bundle = projectPackage(registry, { release: process.argv.includes("--release") });
	validateConsumers(registry, bundle);
	verifyEvidence(registry, process.env.EVIDENCE_ROOT ?? "D:/GitHub/portfolio-evidence");
	checkProjectBlocks(registry, bundle, canon);
	const publicUses = registry.consumers.map(({ id, project, revision, surface, path }) => ({ id, project, revision, surface, path }));
	for (const [file, value] of [[output, bundle], [path.join(root, "src/data/claim-consumers.json"), publicUses]]) {
		const bytes = canonical(value);
		if (process.argv.includes("--write")) fs.writeFileSync(file, bytes);
		else if (fs.readFileSync(file, "utf8") !== bytes) throw new Error(`Stale public claim projection: ${path.basename(file)}`);
	}
	console.log(`Claims: ${bundle.claims.length} assertions; ${publicUses.length} consumers; evidence bytes, case-study blocks and projection verified.`);
	if(process.argv.includes("--release")) {
		const {verifyPDFCandidate}=await import("./pdf-parity.mjs");
		verifyPDFCandidate(root,process.env.CLAIMS_PDF_RECEIPT);
		await import("./built.mjs");
	}
}

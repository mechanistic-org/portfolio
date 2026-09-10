import bundle from "../data/project-claims.json" with { type: "json" };
import uses from "../data/claim-consumers.json" with { type: "json" };
import { resolveClaim } from "../lib/project-claims.mjs";

export function claimFor(path: string) {
	const ref = uses.find((use) => use.path === path);
	if (!ref) throw new Error(`Undeclared claim consumer: ${path}`);
	return resolveClaim(bundle, ref);
}

const cardOrder = ["c24-interfaces", "glyph-cohorts", "sc48-thermal", "c24-service", "glyph-fit", "c24-paint", "c24-architecture", "c24-margin"];
export const claimCards = uses.filter((use) => use.surface === "colophon").sort((a,b) => cardOrder.indexOf(a.id)-cardOrder.indexOf(b.id)).map((use) => {
	const claim = resolveClaim(bundle, use);
	return { id: use.id, projectId: claim.project, headline: claim.title, context: claim.text, href: claim.href };
});

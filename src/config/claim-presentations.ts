import bundle from "../data/project-claims.json" with { type: "json" };
import uses from "../data/claim-consumers.json" with { type: "json" };
import { resolveClaim } from "../lib/project-claims.mjs";

export function claimFor(path: string) {
	const ref = uses.find((use) => use.path === path);
	if (!ref) throw new Error(`Undeclared claim consumer: ${path}`);
	return resolveClaim(bundle, ref);
}

export const claimCards = uses.filter((use) => use.surface === "colophon").map((use) => {
	const claim = resolveClaim(bundle, use);
	return { id: use.id, projectId: claim.project, headline: claim.title, context: claim.text, href: claim.href };
});

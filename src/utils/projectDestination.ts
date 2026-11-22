import type { SiteVariant } from "../config/site_config";

/** Authored primary_home describes ownership; a link must name a deployed page.
 * These retained Mechanistic-owned cases are currently published on the portfolio.
 * Move this explicit delivery mapping only when the replacement routes are live.
 */
const publishedHomes: Readonly<Record<string, SiteVariant>> = {
	bazooka: "main",
	"room-director": "main",
	"wall-plates": "main",
};

export function publishedProjectHome(
	slug: string,
	authoredHome: SiteVariant = "main",
): SiteVariant {
	return publishedHomes[slug] ?? authoredHome;
}

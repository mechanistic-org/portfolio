import { SITE_CONFIG, currentSite, type SiteVariant } from "@config/site_config";

export const getAssetUrl = (
	path: string | undefined | null,
	sourceBucket?: SiteVariant,
): string | undefined => {
	if (!path) return undefined;

	// If it's already an absolute URL (http/https), return as is
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}

	// If we are in PRODUCTION, rewrite /assets/ to the CDN URL
	if (import.meta.env.PROD) {
		const targetSite = sourceBucket || currentSite;
		const assetBase = SITE_CONFIG[targetSite].r2_bucket;

		// R2 Assets (referenced as /assets/r2/...)
		// bucket root is flat (e.g. c24/...), so we must strip /assets/r2/
		if (path.startsWith("/assets/r2/")) {
			return `${assetBase}/${path.slice("/assets/r2/".length)}`;
		}

		// Standard Assets (branding, etc referenced as /assets/...)
		if (path.startsWith("/assets/")) {
			return `${assetBase}/${path.slice("/assets/".length)}`;
		}
	}

	// In DEVELOPMENT (or if path doesn't match), return the original path
	// which effectively points to the public/assets/r2 folder
	return path;
};

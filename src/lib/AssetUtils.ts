import { currentSite, SITE_CONFIG, type SiteVariant } from "../config/site_config";

/**
 * Resolves an asset path to the correct Sovereign R2 Bucket.
 *
 * @param path - The relative path to the asset (e.g., "projects/my-image.jpg" or "/assets/r2/...")
 * @param sourceBucket - (Optional) Force the asset to load from a specific sovereign bucket.
 *                       Use this to cross-reference assets (e.g., showing a 'play' image on 'main').
 * @returns The fully qualified URL to the asset.
 */
export function getAssetUrl(path: string, sourceBucket?: SiteVariant): string {
	if (!path) return "";

	// 1. Clean the path (remove leading slash)
	const cleanPath = path.startsWith("/") ? path.slice(1) : path;

	// 2. Determine the target bucket
	// If sourceBucket is explicit, use it. Otherwise, default to the current site's bucket.
	const targetVariant = sourceBucket || currentSite;
	const baseUrl = SITE_CONFIG[targetVariant].r2_bucket;

	// 3. Asset Sovereignty Check (The Air Gap)
	// If we are on 'main' and trying to load 'play' without explicit intent, warn or fail?
	// For now, we allow it if the code explicitly asked for it (sourceBucket param).
	// If no sourceBucket was passed, it defaults to local, which is safe.

	// Note: We might need to handle /assets/r2/ prefix if it's already in the path
	// Since we are moving to absolute URLs, we should likely strip any legacy proxy paths.
	// Legacy Path: /assets/r2/project/image.jpg
	// Target: https://assets.mechanistic.com/project/image.jpg
	const finalPath = cleanPath.replace(/^assets\/r2\//, "");

	return `${baseUrl}/${finalPath}`;
}

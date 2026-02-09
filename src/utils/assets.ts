export const getAssetUrl = (path: string | undefined | null): string | undefined => {
	if (!path) return undefined;

	// If it's already an absolute URL (http/https), return as is
	if (path.startsWith("http://") || path.startsWith("https://")) {
		return path;
	}

	// If we are in PRODUCTION, rewrite /assets/ to the CDN URL
	if (import.meta.env.PROD) {
		if (path.startsWith("/assets/")) {
			return path.replace("/assets/", "https://assets.eriknorris.com/");
		}
	}

	// In DEVELOPMENT (or if path doesn't match), return the original path
	// which effectively points to the public/assets/r2 folder
	return path;
};

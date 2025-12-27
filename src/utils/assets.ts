export const getAssetUrl = (path: string): string => {
    // If it's already an absolute URL (http/https), return as is
    if (path.startsWith("http://") || path.startsWith("https://")) {
        return path;
    }

    // If we are in PRODUCTION, rewrite /assets/r2/ to the CDN URL
    if (import.meta.env.PROD) {
        if (path.startsWith("/assets/r2/")) {
            return path.replace("/assets/r2/", "https://assets.eriknorris.com/");
        }
    }

    // In DEVELOPMENT (or if path doesn't match), return the original path
    // which effectively points to the public/assets/r2 folder
    return path;
};

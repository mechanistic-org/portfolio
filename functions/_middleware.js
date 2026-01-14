/**
 * DOMAIN SOVEREIGNTY MIDDLEWARE
 *
 * This function enforces the "One Domain" policy.
 * It strictly redirects all traffic from *.pages.dev to www.eriknorris.com
 * to prevent Duplicate Content SEO penalties and "Mystery 404s".
 */

export async function onRequest(context) {
	const url = new URL(context.request.url);
	const hostname = url.hostname;

	// Define the canonical domain
	const CANONICAL_DOMAIN = "www.eriknorris.com";

	// Check if we are on a "pages.dev" domain (Preview or Production alias)
	// We exclude localhost to avoid breaking dev environment
	if (hostname.endsWith(".pages.dev") && hostname !== "localhost" && hostname !== "127.0.0.1") {
		// Construct the new URL preserving path and query strings
		url.hostname = CANONICAL_DOMAIN;
		url.port = ""; // Ensure standard port
		url.protocol = "https:";

		// Return a 301 Permanent Redirect
		return Response.redirect(url.toString(), 301);
	}

	// If already on the correct domain or localhost, proceed
	return context.next();
}

export async function fetchLocalPassthroughImage(request, environment) {
	const requestUrl = new URL(request.url);
	if (requestUrl.pathname !== "/_image" || !requestUrl.searchParams.has("href")) {
		return null;
	}

	const sourceUrl = new URL(requestUrl.searchParams.get("href"), requestUrl.origin);
	if (sourceUrl.origin !== requestUrl.origin) {
		return null;
	}

	return environment.ASSETS.fetch(
		new Request(sourceUrl, { headers: request.headers }),
	);
}

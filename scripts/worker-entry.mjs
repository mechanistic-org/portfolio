import astroWorker from "../dist/_worker.js/index.js";
import { fetchLocalPassthroughImage } from "./worker-image-passthrough.mjs";

export default {
	async fetch(request, environment, context) {
		const localImage = await fetchLocalPassthroughImage(request, environment);
		if (localImage) {
			return localImage;
		}

		const response = await astroWorker.fetch(request, environment, context);

		if (response.status !== 404) {
			if (
				response.status === 200 &&
				new URL(request.url).pathname.startsWith("/assets/") &&
				!response.headers.has("Cache-Control")
			) {
				const headers = new Headers(response.headers);
				headers.set("Cache-Control", "max-age=14400");
				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers,
				});
			}
			return response;
		}

		const headers = new Headers(response.headers);
		headers.set("Cache-Control", "no-store");

		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});
	},
};

/** A single observer covers both inline clips and dynamically selected gallery clips. */
export function initializeDeferredVideos(article: HTMLElement) {
	const observer =
		"IntersectionObserver" in window
			? new IntersectionObserver(
					(entries) => {
						for (const entry of entries)
							if (entry.isIntersecting) {
								const video = entry.target as HTMLVideoElement;
								if (video.dataset.videoPoster) video.poster = video.dataset.videoPoster;
								delete video.dataset.videoPoster;
								observer?.unobserve(video);
							}
					},
					{ rootMargin: "200px" },
				)
			: null;
	const defer = (video: HTMLVideoElement, poster = "") => {
		video.preload = "none";
		video.removeAttribute("poster");
		video.dataset.videoPoster = poster;
		observer?.unobserve(video);
		observer?.observe(video);
	};
	article
		.querySelectorAll<HTMLVideoElement>("video[data-video-poster]")
		.forEach((video) => defer(video, video.dataset.videoPoster));
	document.addEventListener("astro:before-swap", () => observer?.disconnect(), { once: true });
	return defer;
}

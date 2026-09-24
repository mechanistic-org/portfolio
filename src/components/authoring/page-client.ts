import { mediaUrl, type AuthoringMediaItem } from "./media-url";

type Item = AuthoringMediaItem & { captionHtml: string };
type Group = {
	id: string;
	title: string;
	chapter: string;
	items: Item[];
	element: HTMLElement;
	index: number;
};
export function initializeAuthoringPage() {
	const article = document.querySelector<HTMLElement>("[data-authoring-project]");
	if (!article || article.dataset.initialized) return;
	article.dataset.initialized = "true";
	const viewer = document.querySelector<HTMLDialogElement>(".image-viewer")!;
	const browser = document.querySelector<HTMLDialogElement>(".media-browser")!;
	const groups: Group[] = [];
	let active: Group | undefined;
	let activeIndex = 0;
	let opener: HTMLElement | null = null;
	const viewerImage = viewer.querySelector<HTMLImageElement>(".viewer-image img")!;
	const zoomButton = viewer.querySelector<HTMLButtonElement>("[data-zoom]")!;
	const strip = (html: string) => {
		const d = document.createElement("div");
		d.innerHTML = html;
		return d.textContent || "";
	};
	function setImage(img: HTMLImageElement, src: string, alt: string) {
		const container = img.parentElement!;
		let status = container.querySelector<HTMLElement>(".image-load-status");
		if (!status) {
			status = document.createElement("span");
			status.className = "image-load-status";
			status.setAttribute("role", "status");
			container.append(status);
		}
		const message = status;
		img.classList.add("is-loading");
		container.setAttribute("aria-busy", "true");
		message.hidden = false;
		message.textContent = "Loading photograph…";
		img.onload = () => {
			img.classList.remove("is-loading");
			container.removeAttribute("aria-busy");
			message.hidden = true;
		};
		img.onerror = () => {
			container.removeAttribute("aria-busy");
			message.textContent = "Photograph could not load. Try opening the full-size image.";
		};
		img.src = src;
		img.alt = alt;
		if (img.complete && img.naturalWidth) {
			img.classList.remove("is-loading");
			container.removeAttribute("aria-busy");
			message.hidden = true;
		}
	}
	function renderViewer() {
		if (!active) return;
		const item = active.items[activeIndex];
		viewer.querySelector("h2")!.textContent = active.title;
		setImage(viewerImage, mediaUrl(item, "zoom"), item.alt);
		viewer.querySelector(".viewer-caption")!.innerHTML = item.captionHtml;
		viewer.querySelector(".viewer-count")!.textContent =
			`${activeIndex + 1} / ${active.items.length}`;
		viewer.querySelector<HTMLAnchorElement>(".viewer-original")!.href = mediaUrl(item, "original");
		viewer.classList.remove("is-zoomed");
		zoomButton.textContent = "Zoom in";
		zoomButton.setAttribute("aria-pressed", "false");
	}
	function open(group: Group, index: number, from: HTMLElement) {
		active = group;
		activeIndex = index;
		opener = from;
		renderViewer();
		viewer.showModal();
	}
	viewer.querySelector("[data-close-viewer]")!.addEventListener("click", () => viewer.close());
	viewer.addEventListener("close", () => opener?.focus({ preventScroll: true }));
	viewer.querySelectorAll<HTMLButtonElement>("[data-viewer-step]").forEach((button) =>
		button.addEventListener("click", () => {
			if (!active) return;
			activeIndex =
				(activeIndex + Number(button.dataset.viewerStep) + active.items.length) %
				active.items.length;
			renderViewer();
		}),
	);
	viewer.addEventListener("keydown", (event) => {
		if (!active || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
		event.preventDefault();
		activeIndex =
			(activeIndex + (event.key === "ArrowRight" ? 1 : -1) + active.items.length) %
			active.items.length;
		renderViewer();
	});
	zoomButton.addEventListener("click", () => {
		const zoom = viewer.classList.toggle("is-zoomed");
		zoomButton.setAttribute("aria-pressed", String(zoom));
		zoomButton.textContent = zoom ? "Fit image" : "Zoom in";
	});
	let chapter = "Photographs from the work";
	article.querySelectorAll<HTMLElement>("h2[id], [data-gallery]").forEach((element) => {
		if (element.tagName === "H2") {
			chapter = element.textContent || chapter;
			return;
		}
		const group: Group = {
			id: element.dataset.gallery!,
			title: element.dataset.title!,
			chapter,
			items: JSON.parse(element.dataset.items!),
			element,
			index: 0,
		};
		groups.push(group);
		if (group.items[0].kind === "video") return;
		const grid = element.querySelector<HTMLElement>(".gallery-grid")!;
		const stage = element.querySelector<HTMLElement>(".gallery-stage")!;
		const stageButton = stage.querySelector<HTMLButtonElement>("[data-open-image]")!;
		const controls = element.querySelector<HTMLElement>(".gallery-controls")!;
		const thumbs = element.querySelector<HTMLElement>(".gallery-thumbs")!;
		const comparison = element.querySelector<HTMLElement>(".comparison")!;
		const choices: number[] = JSON.parse(element.dataset.compare!);
		const multiple = group.items.length > 1;
		stage.hidden = false;
		grid.hidden = true;
		controls.hidden = !multiple;
		thumbs.hidden = !multiple;
		stageButton.addEventListener("click", () => open(group, group.index, stageButton));
		function select(index: number) {
			group.index = (index + group.items.length) % group.items.length;
			const item = group.items[group.index];
			const img = stage.querySelector("img")!;
			setImage(img, mediaUrl(item, "display"), item.alt);
			stage.querySelector("[data-image-counter]")!.textContent =
				`${String(group.index + 1).padStart(2, "0")} / ${String(group.items.length).padStart(2, "0")}`;
			stage.querySelector("[data-image-caption]")!.innerHTML = item.captionHtml;
			controls.querySelector(".current-label")!.textContent =
				`Image ${group.index + 1} of ${group.items.length}`;
			stageButton.setAttribute("aria-label", "Enlarge: " + item.alt);
			thumbs
				.querySelectorAll<HTMLButtonElement>("button")
				.forEach((button, i) => button.setAttribute("aria-pressed", String(i === group.index)));
		}
		function compare() {
			choices.forEach((index, side) => {
				const item = group.items[index];
				const column = comparison.querySelectorAll<HTMLElement>(".comparison-side")[side];
				const img = column.querySelector("img")!;
				setImage(img, mediaUrl(item, "display", 1000), item.alt);
				column.querySelector("p")!.textContent = strip(item.captionHtml);
				column.querySelector("select")!.value = String(index);
			});
		}
		controls
			.querySelectorAll<HTMLButtonElement>("[data-step]")
			.forEach((button) =>
				button.addEventListener("click", () => select(group.index + Number(button.dataset.step))),
			);
		thumbs
			.querySelectorAll<HTMLButtonElement>("[data-select]")
			.forEach((button) =>
				button.addEventListener("click", () => select(Number(button.dataset.select))),
			);
		element.querySelectorAll<HTMLAnchorElement>("[data-grid-open]").forEach((link) =>
			link.addEventListener("click", (event) => {
				event.preventDefault();
				open(group, Number(link.dataset.gridOpen), link);
			}),
		);
		controls
			.querySelector<HTMLButtonElement>('[data-mode="all"]')!
			.addEventListener("click", (event) => {
				grid.hidden = !grid.hidden;
				(event.currentTarget as HTMLElement).setAttribute("aria-expanded", String(!grid.hidden));
				(event.currentTarget as HTMLElement).textContent = grid.hidden
					? `View all ${group.items.length}`
					: "Hide overview";
			});
		controls
			.querySelector<HTMLButtonElement>('[data-mode="compare"]')!
			.addEventListener("click", (event) => {
				comparison.hidden = !comparison.hidden;
				stage.hidden = !comparison.hidden;
				thumbs.hidden = !comparison.hidden;
				controls.querySelector<HTMLElement>(".gallery-paging")!.hidden = !comparison.hidden;
				(event.currentTarget as HTMLElement).textContent = comparison.hidden
					? "Compare two"
					: "Single view";
				if (!comparison.hidden) compare();
			});
		comparison.querySelectorAll<HTMLSelectElement>("select").forEach((select) =>
			select.addEventListener("change", () => {
				choices[Number(select.dataset.compareSide)] = Number(select.value);
				compare();
			}),
		);
		comparison
			.querySelectorAll<HTMLButtonElement>("[data-compare-open]")
			.forEach((button) =>
				button.addEventListener("click", () =>
					open(group, choices[Number(button.dataset.compareOpen)], button),
				),
			);
		select(0);
	});
	const browserGroups = browser.querySelector(".media-browser-groups")!;
	const chapterGrids = new Map<string, HTMLElement>();
	groups
		.filter((group) => group.items[0].kind !== "video")
		.forEach((group) => {
			let grid = chapterGrids.get(group.chapter);
			if (!grid) {
				const section = document.createElement("section");
				const heading = document.createElement("h3");
				heading.textContent = group.chapter;
				section.append(heading);
				grid = document.createElement("div");
				grid.className = "browser-grid";
				section.append(grid);
				browserGroups.append(section);
				chapterGrids.set(group.chapter, grid);
			}
			group.items.forEach((item, index) => {
				const button = document.createElement("button");
				button.type = "button";
				button.setAttribute("aria-label", item.alt);
				const img = document.createElement("img");
				img.src = mediaUrl(item, "thumbnail", 360);
				img.alt = "";
				img.loading = "lazy";
				const label = document.createElement("span");
				label.textContent = strip(item.captionHtml);
				button.append(img, label);
				button.addEventListener("click", () => open(group, index, button));
				grid.append(button);
			});
		});
	document
		.querySelectorAll("[data-browse-media]")
		.forEach((button) => button.addEventListener("click", () => browser.showModal()));
	browser.querySelector("[data-close-browser]")!.addEventListener("click", () => browser.close());
	document.querySelectorAll<HTMLAnchorElement>("a[data-note]").forEach((link) =>
		link.addEventListener("click", () => {
			const notes = document.querySelector<HTMLDetailsElement>("#source-notes");
			if (notes) notes.open = true;
		}),
	);
	const toc = article.querySelectorAll<HTMLAnchorElement>(".article-contents a");
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting)
					toc.forEach((link) =>
						link.classList.toggle("is-current", link.hash === "#" + entry.target.id),
					);
			});
		},
		{ rootMargin: "-10% 0px -65% 0px" },
	);
	article.querySelectorAll("h2[id]").forEach((heading) => observer.observe(heading));
	const positionKey = `${article.dataset.authoringProject}-authoring-scroll`;
	window.addEventListener(
		"pagehide",
		() => sessionStorage.setItem(positionKey, String(window.scrollY)),
		{ once: true },
	);
	if (
		!location.hash &&
		performance.getEntriesByType("navigation").some((entry: any) => entry.type === "reload")
	) {
		const y = Number(sessionStorage.getItem(positionKey));
		if (y) window.requestAnimationFrame(() => window.scrollTo(0, y));
	}
}

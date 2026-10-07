import { initializeEvidenceSequences } from "./evidence-sequence";

export function initializeReaderNavigation(article: HTMLElement) {
	const index = article.querySelector<HTMLElement>("[data-reader-index]");
	if (!index || index.dataset.ready) return;
	index.dataset.ready = "true";
	const lifecycle = new AbortController();
	const { signal } = lifecycle;
	const rows = [...index.querySelectorAll<HTMLElement>("[data-index-chapter]")];
	const links = [...index.querySelectorAll<HTMLAnchorElement>("nav a")];
	const workbenches = [...article.querySelectorAll<HTMLDetailsElement>("[data-workbench]")];
	const mobile = index.querySelector<HTMLButtonElement>(".reader-location")!;
	const outline = index.querySelector<HTMLElement>(".reader-outline")!;
	const key = `${article.dataset.authoringProject}-workbenches`;
	let hovering = false,
		frame = 0,
		keyboardFocus = false;
	const focused = () => keyboardFocus && index.contains(document.activeElement);
	index.addEventListener(
		"keydown",
		() => {
			keyboardFocus = true;
		},
		{ signal },
	);
	index.addEventListener(
		"pointerdown",
		() => {
			keyboardFocus = false;
		},
		{ signal },
	);
	const setExpanded = (row: HTMLElement, expanded: boolean) => {
		const children = row.querySelector<HTMLElement>(".index-children");
		if (children) children.hidden = !expanded;
	};
	try {
		const saved = JSON.parse(sessionStorage.getItem(key) || "[]");
		workbenches.forEach((w) => (w.open = Array.isArray(saved) && saved.includes(w.id)));
	} catch {
		/* Storage is optional. */
	}
	const reveal = (target: HTMLElement | null) => {
		if (!target) return;
		let p: HTMLElement | null = target;
		while (p && p !== article) {
			if (p instanceof HTMLDetailsElement) p.open = true;
			p = p.parentElement;
		}
	};
	const fragment = () => {
		try {
			return document.getElementById(decodeURIComponent(location.hash.slice(1)));
		} catch {
			return null;
		}
	};
	reveal(fragment());
	const update = () => {
		frame = 0;
		const readingLine = Math.max(155, mobile.getBoundingClientRect().bottom + 16);
		const targets = links
			.map((link) => ({ link, target: document.getElementById(link.hash.slice(1)) }))
			.filter(
				(x) =>
					x.target?.getClientRects().length &&
					!x.target.closest("[data-workbench]:not([open]) .workbench-body"),
			);
		const current =
			targets.filter((x) => x.target!.getBoundingClientRect().top <= readingLine).at(-1) ||
			targets[0];
		const currentRow = current?.link.closest<HTMLElement>("[data-index-chapter]") || rows[0];
		const applyEvidence = prepareEvidence(readingLine);
		const bodies = workbenches
			.filter((w) => w.open)
			.map((w) => w.querySelector<HTMLElement>(".workbench-body")!.getBoundingClientRect());
		const storyY = (y: number) =>
			y - bodies.reduce((n, r) => n + Math.min(Math.max(0, y - r.top - scrollY), r.height), 0);
		const rowProgress = rows.map((row, i) => {
			const start = document.getElementById(row.dataset.indexChapter!)!;
			const end = rows[i + 1]
				? document.getElementById(rows[i + 1].dataset.indexChapter!)
				: article.querySelector<HTMLElement>(".article-composition");
			const top = storyY(start.getBoundingClientRect().top + scrollY);
			const bottom = end
				? storyY(end.getBoundingClientRect()[rows[i + 1] ? "top" : "bottom"] + scrollY)
				: top + 1;
			return Math.max(
				0,
				Math.min(1, (storyY(scrollY + readingLine) - top) / Math.max(1, bottom - top)),
			);
		});
		applyEvidence();
		links.forEach((link) => {
			const selected = link === current?.link;
			link.classList.toggle("is-current", selected);
			if (selected) link.setAttribute("aria-current", "location");
			else link.removeAttribute("aria-current");
		});
		rows.forEach((row, i) => {
			row.classList.toggle("is-active", row === currentRow);
			const progress = rowProgress[i];
			row.style.setProperty("--chapter-progress", `${progress * 100}%`);
			if (!hovering && !focused()) setExpanded(row, row === currentRow);
		});
		const chapterName =
			currentRow
				?.querySelector("[data-chapter-link]")
				?.textContent?.trim()
				.replace(/^\d+\s*/, "") || "";
		index.querySelector("[data-reader-location]")!.textContent = chapterName;
		if (!hovering && !focused() && current) {
			const rect = current.link.getBoundingClientRect(),
				box = outline.getBoundingClientRect();
			if (rect.top < box.top + 30) outline.scrollTop -= box.top + 30 - rect.top;
			else if (rect.bottom > box.bottom - 15) outline.scrollTop += rect.bottom - box.bottom + 15;
		}
	};
	const schedule = () => {
		if (!frame) frame = requestAnimationFrame(update);
	};
	const prepareEvidence = initializeEvidenceSequences(article, schedule, signal);
	index.addEventListener(
		"pointerenter",
		() => {
			hovering = true;
		},
		{ signal },
	);
	index.addEventListener(
		"pointerleave",
		() => {
			hovering = false;
			schedule();
		},
		{ signal },
	);
	index.addEventListener(
		"focusout",
		() => {
			queueMicrotask(schedule);
		},
		{ signal },
	);
	mobile.hidden = false;
	mobile.addEventListener(
		"click",
		() => {
			const open = mobile.getAttribute("aria-expanded") !== "true";
			mobile.setAttribute("aria-expanded", String(open));
			index.classList.toggle("mobile-open", open);
		},
		{ signal },
	);
	article.addEventListener(
		"click",
		(event) => {
			const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
			if (
				!link ||
				event.defaultPrevented ||
				(event instanceof MouseEvent &&
					(event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey))
			)
				return;
			let target;
			try {
				target = document.getElementById(decodeURIComponent(link.hash.slice(1)));
			} catch {
				return;
			}
			if (!target) return;
			reveal(target);
			if (index.contains(link)) {
				const selectedRow = link.closest<HTMLElement>("[data-index-chapter]");
				rows.forEach((row) => setExpanded(row, row === selectedRow));
				// Native fragment navigation remains the URL/history contract.
				index.classList.remove("mobile-open");
				mobile.setAttribute("aria-expanded", "false");
			}
			schedule();
		},
		{ signal },
	);
	workbenches.forEach((w) => {
		const close = w.querySelector<HTMLButtonElement>("[data-workbench-close]")!;
		close.hidden = false;
		close.addEventListener(
			"click",
			() => {
				w.open = false;
				w.querySelector("summary")!.focus({ preventScroll: true });
				w.scrollIntoView({ block: "start", behavior: "instant" });
			},
			{ signal },
		);
		w.addEventListener(
			"toggle",
			() => {
				if (!w.open) w.querySelectorAll("video").forEach((v) => v.pause());
				try {
					sessionStorage.setItem(
						key,
						JSON.stringify(workbenches.filter((x) => x.open).map((x) => x.id)),
					);
				} catch {
					/* Optional. */
				}
				schedule();
			},
			{ signal },
		);
	});
	window.addEventListener("scroll", schedule, { passive: true, signal });
	window.addEventListener("resize", schedule, { signal });
	window.addEventListener(
		"hashchange",
		() => {
			reveal(fragment());
			schedule();
		},
		{ signal },
	);
	const resize = new ResizeObserver(schedule);
	resize.observe(article);
	document.addEventListener(
		"astro:before-swap",
		() => {
			lifecycle.abort();
			resize.disconnect();
			cancelAnimationFrame(frame);
		},
		{ once: true },
	);
	update();
}

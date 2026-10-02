/** One complete static chronology, enhanced into a dialog by the shared reader.
 * Full timeline and existing event fragments remain native links without JavaScript.
 */
export class ProjectTimelineElement extends HTMLElement {
	private cleanup?: () => void;
	private selected: string | null = null;

	connectedCallback() {
		this.cleanup?.();
		const dialog = this.querySelector<HTMLDialogElement>("dialog");
		const reference = this.querySelector<HTMLElement>("[data-timeline-reference]");
		if (!dialog || !reference || typeof dialog.showModal !== "function") return;
		const controller = new AbortController();
		const signal = controller.signal;
		const rows = [...reference.querySelectorAll<HTMLElement>("[data-timeline-reference-event]")];
		const byId = new Map(rows.map((row) => [row.dataset.timelineReferenceEvent!, row]));
		let opener: HTMLElement = this.closest("article")?.querySelector(".timeline-shortcut") ?? this;
		let returnFocus = true;
		let lockedBody: HTMLElement | null = null;
		let oldOverflow = "";
		let oldPriority = "";
		const releaseScroll = () => {
			if (!lockedBody) return;
			if (oldOverflow) lockedBody.style.setProperty("overflow", oldOverflow, oldPriority);
			else lockedBody.style.removeProperty("overflow");
			lockedBody = null;
		};
		const select = (id: string | null) => {
			if (id !== null && !byId.has(id)) return;
			this.selected = id;
			this.dataset.selectedEvent = id ?? "";
			rows.forEach((row) =>
				row.toggleAttribute("data-selected", row.dataset.timelineReferenceEvent === id),
			);
		};
		const targetFor = (hash: string) => {
			try {
				return document.getElementById(decodeURIComponent(hash.slice(1)));
			} catch {
				return null;
			}
		};
		const open = (from?: HTMLElement, target?: HTMLElement) => {
			if (from && !dialog.contains(from)) opener = from;
			const row = target?.closest<HTMLElement>("[data-timeline-reference-event]");
			if (row) select(row.dataset.timelineReferenceEvent!);
			returnFocus = true;
			if (!dialog.open) {
				lockedBody = document.body;
				oldOverflow = lockedBody.style.getPropertyValue("overflow");
				oldPriority = lockedBody.style.getPropertyPriority("overflow");
				dialog.showModal();
				lockedBody.style.setProperty("overflow", "hidden");
			}
			this.dataset.view = "reference";
			if (target) target.scrollIntoView({ block: "start", behavior: "instant" });
			else dialog.scrollTop = 0;
		};
		const followHash = () => {
			const target = targetFor(location.hash);
			if (target && reference.contains(target)) open(undefined, target);
			else if (dialog.open) {
				returnFocus = false;
				dialog.close();
				releaseScroll();
				this.dataset.view = "article";
				const destination = target ?? this.closest<HTMLElement>("article") ?? this;
				destination.tabIndex = -1;
				destination.focus({ preventScroll: true });
			}
		};
		dialog.append(reference);
		this.dataset.ready = "true";
		this.dataset.view = "article";
		select(this.selected);
		this.addEventListener(
			"click",
			(event) => {
				const target = event.target as Element;
				if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
					return;
				if (target.closest("[data-timeline-close]")) dialog.close();
				const row = target.closest<HTMLElement>("[data-timeline-reference-event]");
				if (row) select(row.dataset.timelineReferenceEvent!);
				const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
				const destination = link && targetFor(link.hash);
				if (dialog.contains(target) && destination && !dialog.contains(destination)) {
					returnFocus = false;
					dialog.close();
					releaseScroll();
					destination.tabIndex = -1;
					destination.focus({ preventScroll: true });
				}
			},
			{ signal },
		);
		this.addEventListener(
			"focusin",
			(event) => {
				const row = (event.target as Element).closest<HTMLElement>(
					"[data-timeline-reference-event]",
				);
				if (row) select(row.dataset.timelineReferenceEvent!);
			},
			{ signal },
		);
		dialog.addEventListener(
			"close",
			() => {
				// A queued close from Back must not unlock a reference reopened by Forward.
				if (dialog.open) return;
				this.dataset.view = "article";
				releaseScroll();
				if (returnFocus && opener.isConnected) opener.focus({ preventScroll: true });
			},
			{ signal },
		);
		document.addEventListener(
			"click",
			(event) => {
				if (
					event.defaultPrevented ||
					event.button !== 0 ||
					event.metaKey ||
					event.ctrlKey ||
					event.shiftKey ||
					event.altKey
				)
					return;
				const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
				const target = link && targetFor(link.hash);
				if (link && target && reference.contains(target)) open(link, target);
			},
			{ capture: true, signal },
		);
		window.addEventListener("hashchange", followHash, { signal });
		const closeForNavigation = () => {
			returnFocus = false;
			dialog.close();
			releaseScroll();
		};
		document.addEventListener("astro:before-swap", closeForNavigation, { signal });
		this.cleanup = () => {
			closeForNavigation();
			controller.abort();
		};
		followHash();
	}

	disconnectedCallback() {
		this.cleanup?.();
	}
}

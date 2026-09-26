/** One selection across a phase overview and the complete static reference.
 * The reference is moved, never duplicated. Without enhancement it stays readable in flow.
 */
export class ProjectTimelineElement extends HTMLElement {
	private cleanup?: () => void;
	private selected: string | null = null;
	private phase: string | null = null;

	connectedCallback() {
		this.cleanup?.();
		const dialog = this.querySelector<HTMLDialogElement>("dialog");
		const reference = this.querySelector<HTMLElement>("[data-timeline-reference]");
		if (!dialog || !reference || typeof dialog.showModal !== "function") return;
		const controller = new AbortController();
		const signal = controller.signal;
		const rows = [...reference.querySelectorAll<HTMLElement>("[data-timeline-reference-event]")];
		const byId = new Map(rows.map((row) => [row.dataset.timelineReferenceEvent!, row]));
		const markers = [...this.querySelectorAll<HTMLAnchorElement>("[data-timeline-event]")];
		const phaseLinks = [...this.querySelectorAll<HTMLAnchorElement>("[data-timeline-phase]")];
		const panels = [...this.querySelectorAll<HTMLElement>("[data-timeline-phase-panel]")];
		const copy = this.querySelector<HTMLElement>("[data-timeline-selected-copy]")!;
		const defaultOpener = this.querySelector<HTMLElement>("[data-timeline-view='reference']")!;
		let opener = defaultOpener;
		let returnFocus = true;
		let lockedBody: HTMLElement | null = null;
		let oldOverflow = "";
		let oldPriority = "";
		const releaseScroll = () => {
			if (lockedBody) {
				if (oldOverflow) lockedBody.style.setProperty("overflow", oldOverflow, oldPriority);
				else lockedBody.style.removeProperty("overflow");
				lockedBody = null;
			}
		};
		const showPhase = (id: string) => {
			if (!panels.some((panel) => panel.dataset.timelinePhasePanel === id)) return;
			this.phase = id;
			panels.forEach((panel) => {
				panel.hidden = panel.dataset.timelinePhasePanel !== id;
			});
			phaseLinks.forEach((link) =>
				link.setAttribute("aria-current", String(link.dataset.timelinePhase === id)),
			);
		};
		const select = (id: string | null) => {
			if (id !== null && !byId.has(id)) return;
			this.selected = id;
			this.dataset.selectedEvent = id ?? "";
			rows.forEach((row) =>
				row.toggleAttribute("data-selected", row.dataset.timelineReferenceEvent === id),
			);
			markers.forEach((marker) =>
				marker.setAttribute("aria-current", String(marker.dataset.timelineEvent === id)),
			);
			copy.replaceChildren();
			if (id) {
				const row = byId.get(id)!;
				for (const child of row.childNodes) copy.append(child.cloneNode(true));
				// A selected detail is a second view, never a second anchor target.
				copy.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
				const marker = markers.find((item) => item.dataset.timelineEvent === id);
				if (marker) showPhase(marker.dataset.eventPhase!);
			}
			copy.hidden = id === null;
			this.querySelector<HTMLElement>(".timeline-selection-hint")!.hidden = id !== null;
		};
		const revealRow = (row: HTMLElement) => {
			row.scrollIntoView({ block: "start", behavior: "instant" });
		};
		const openReference = (from?: HTMLElement, target?: HTMLElement) => {
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
			if (target && !row) target.scrollIntoView({ block: "start", behavior: "instant" });
			else if (this.selected) revealRow(byId.get(this.selected)!);
			else dialog.scrollTop = 0;
		};
		const showVisualization = () => {
			returnFocus = false;
			dialog.close();
			const marker = markers.find((item) => item.dataset.timelineEvent === this.selected);
			if (marker) showPhase(marker.dataset.eventPhase!);
			const target = marker ?? (this.selected ? copy : defaultOpener);
			if (target === copy) target.tabIndex = -1;
			target.focus({ preventScroll: true });
			target.scrollIntoView({ block: "center", behavior: "instant" });
		};
		const fragmentTarget = (hash: string) => {
			try {
				return document.getElementById(decodeURIComponent(hash.slice(1)));
			} catch {
				return null;
			}
		};
		const followHash = () => {
			const target = fragmentTarget(location.hash);
			if (target && reference.contains(target)) openReference(undefined, target);
			else if (dialog.open) {
				// History can leave the reference without clicking an article link.
				// Restore the article immediately; keep the selected event for Forward.
				returnFocus = false;
				dialog.close();
				releaseScroll();
				this.dataset.view = "visualization";
				const destination = target ?? this.closest<HTMLElement>("article") ?? this;
				destination.tabIndex = -1;
				destination.focus({ preventScroll: true });
			}
		};
		dialog.append(reference);
		this.querySelectorAll<HTMLElement>("[data-timeline-controls]").forEach((node) => {
			node.hidden = false;
		});
		this.dataset.ready = "true";
		this.dataset.view = "visualization";
		if (panels.length) showPhase(this.phase ?? panels[0].dataset.timelinePhasePanel!);
		select(this.selected);

		this.addEventListener(
			"click",
			(event) => {
				const target = event.target as Element;
				if (
					target.closest("a") &&
					(event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
				)
					return;
				const marker = target.closest<HTMLElement>("[data-timeline-event]");
				const phase = target.closest<HTMLElement>("[data-timeline-phase]");
				const view = target.closest<HTMLElement>("[data-timeline-view]");
				if (marker) {
					event.preventDefault();
					select(marker.dataset.timelineEvent!);
				} else if (phase) {
					event.preventDefault();
					showPhase(phase.dataset.timelinePhase!);
				} else if (view?.dataset.timelineView === "reference") openReference(view);
				else if (view?.dataset.timelineView === "visualization") showVisualization();
				else if (target.closest("[data-timeline-close]")) dialog.close();
				else {
					const row = target.closest<HTMLElement>("[data-timeline-reference-event]");
					if (row) select(row.dataset.timelineReferenceEvent!);
				}
				const link = target.closest<HTMLAnchorElement>('a[href^="#"]');
				const destination = link && fragmentTarget(link.hash);
				if (dialog.contains(target) && destination && !dialog.contains(destination)) {
					returnFocus = false;
					dialog.close();
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
		this.addEventListener(
			"keydown",
			(event) => {
				const target = event.target as HTMLElement;
				const options = target.matches("[data-timeline-phase]")
					? phaseLinks
					: markers.filter(
							(marker) => !marker.closest<HTMLElement>("[data-timeline-phase-panel]")!.hidden,
						);
				const index = options.indexOf(target as HTMLAnchorElement);
				if (index < 0) return;
				let next = index;
				if (["ArrowRight", "ArrowDown"].includes(event.key)) next = (index + 1) % options.length;
				else if (["ArrowLeft", "ArrowUp"].includes(event.key))
					next = (index + options.length - 1) % options.length;
				else if (event.key === "Home") next = 0;
				else if (event.key === "End") next = options.length - 1;
				else return;
				event.preventDefault();
				options[next].click();
				options[next].focus();
			},
			{ signal },
		);
		dialog.addEventListener(
			"close",
			() => {
				// A queued close from Back must not unlock a reference reopened by Forward.
				if (dialog.open) return;
				this.dataset.view = "visualization";
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
				const target = link && fragmentTarget(link.hash);
				if (link && target && reference.contains(target) && !link.matches("[data-timeline-event]"))
					openReference(link, target);
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

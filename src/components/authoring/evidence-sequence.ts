/** Uses the reader's existing animation frame. Geometry is read before its writes. */
export function initializeEvidenceSequences(
	article: HTMLElement,
	schedule: () => void,
	signal: AbortSignal,
) {
	const sequences = [...article.querySelectorAll<HTMLElement>("[data-evidence-sequence]")].map(
		(element) => ({
			element,
			panels: [...element.querySelectorAll<HTMLElement>("[data-evidence-panel]")],
			accounts: [...element.querySelectorAll<HTMLElement>("[data-evidence-account]")],
			button: element.querySelector<HTMLButtonElement>("[data-sequence-layout]")!,
			inline: false,
			active: -1,
			anchor: null as HTMLElement | null,
		}),
	);
	const media = matchMedia(
		"(min-width: 1200px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)",
	);
	media.addEventListener("change", schedule, { signal });
	// An old media fragment must reveal its exact evidence, including on first load.
	const revealFragment = () => {
		let target: HTMLElement | null = null;
		try {
			target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
		} catch {
			return;
		}
		sequences.forEach((s) => {
			if (target && s.panels.some((p) => p.contains(target))) s.inline = true;
		});
		schedule();
	};
	revealFragment();
	window.addEventListener("hashchange", revealFragment, { signal });

	sequences.forEach((s) =>
		s.button.addEventListener(
			"click",
			() => {
				s.inline = !s.inline;
				schedule();
			},
			{ signal },
		),
	);
	sequences.forEach((s) =>
		s.element.addEventListener(
			"click",
			(event) => {
				if ((event.target as Element).closest("[data-mode]")) {
					s.anchor = (event.target as Element).closest<HTMLElement>("[data-gallery]");
					s.inline = true;
					schedule();
				}
			},
			{ signal },
		),
	);
	return (readingLine: number) => {
		const states = sequences.map((s) => {
			const enabled = media.matches && !s.inline;
			const positions = s.accounts.map((a) => a.getBoundingClientRect().top);
			let active = Math.max(
				0,
				positions.findLastIndex((top) => top <= Math.max(readingLine, innerHeight * 0.45)),
			);
			// Never conceal a keyboard-focused control or interrupt a playing clip.
			if (
				s.active >= 0 &&
				(s.panels[s.active].contains(document.activeElement) ||
					[...s.panels[s.active].querySelectorAll("video")].some((v) => !v.paused && !v.ended))
			)
				active = s.active;
			return { s, enabled, active };
		});
		return () =>
			states.forEach(({ s, enabled, active }) => {
				s.element.classList.toggle("is-sticky-sequence", enabled);
				s.button.hidden = !media.matches;
				s.button.setAttribute("aria-pressed", String(s.inline));
				s.button.textContent = s.inline
					? "Follow the account with evidence"
					: "Show all evidence inline";
				s.panels.forEach((panel, i) => {
					const hidden = enabled && i !== active;
					panel.classList.toggle("is-evidence-current", i === active);
					panel.inert = hidden;
					if (hidden) panel.setAttribute("aria-hidden", "true");
					else panel.removeAttribute("aria-hidden");
				});
				s.active = active;
				if (s.anchor) {
					s.anchor.scrollIntoView({ block: "start", behavior: "instant" });
					s.anchor = null;
					schedule();
				}
			});
	};
}

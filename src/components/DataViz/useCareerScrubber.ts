import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import {
	nearestPip,
	stepPip,
	SCRUB_PAUSE_MS,
	SCRUB_RETURN_MS,
} from "../../utils/careerScrubber.mjs";

interface Pip {
	id: string;
	x: number;
}
type Phase = "home" | "preview" | "returning";

/** Transient label state only: never acquires the page/reading project. */
export function useCareerScrubber(records: Pip[], homeId?: string) {
	const [previewId, setPreviewId] = useState<string | null>(null);
	const [phase, setPhase] = useState<Phase>("home");
	const [ready, setReady] = useState(false);
	const selected = useRef(homeId);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const gesture = useRef<{
		id: number;
		target: HTMLElement;
		x: number;
		y: number;
		origin: number;
		width: number;
		moved: boolean;
	} | null>(null);
	const plotRef = useRef<SVGSVGElement>(null);
	const clearTimers = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
	};
	const release = () => {
		const active = gesture.current;
		gesture.current = null;
		if (active?.target.hasPointerCapture(active.id)) active.target.releasePointerCapture(active.id);
	};
	const reset = () => {
		clearTimers();
		release();
		selected.current = homeId;
		setPreviewId(null);
		setPhase("home");
	};
	const preview = (id: string) => {
		clearTimers();
		selected.current = id;
		setPreviewId(id);
		setPhase(id === homeId ? "home" : "preview");
	};
	const settle = () => {
		clearTimers();
		if (selected.current === homeId) {
			reset();
			return;
		}
		timers.current.push(
			setTimeout(() => {
				selected.current = homeId;
				setPreviewId(null);
				if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
					setPhase("home");
				} else {
					setPhase("returning");
					timers.current.push(setTimeout(() => setPhase("home"), SCRUB_RETURN_MS));
				}
			}, SCRUB_PAUSE_MS),
		);
	};
	useEffect(() => {
		setReady(true);
		reset();
		const hidden = () => {
			if (document.hidden) reset();
		};
		// Capture Escape during a drag even if focus was moved elsewhere. In HXO,
		// this must not bubble to the global handler that clears the held reading.
		const escape = (event: globalThis.KeyboardEvent) => {
			if (event.key === "Escape" && (gesture.current || selected.current !== homeId)) {
				event.preventDefault();
				event.stopImmediatePropagation();
				reset();
			}
		};
		window.addEventListener("blur", reset);
		window.addEventListener("resize", reset);
		window.addEventListener("keydown", escape, true);
		document.addEventListener("visibilitychange", hidden);
		return () => {
			clearTimers();
			release();
			window.removeEventListener("blur", reset);
			window.removeEventListener("resize", reset);
			window.removeEventListener("keydown", escape, true);
			document.removeEventListener("visibilitychange", hidden);
		};
	}, [homeId]);
	const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
		if (!homeId || !event.isPrimary || event.button !== 0 || gesture.current) return;
		const pip = records.find((record) => record.id === (previewId ?? homeId));
		const bounds = plotRef.current?.getBoundingClientRect();
		if (!pip || !bounds?.width) return;
		clearTimers();
		setPhase(previewId && previewId !== homeId ? "preview" : "home");
		gesture.current = {
			id: event.pointerId,
			target: event.currentTarget,
			x: event.clientX,
			y: event.clientY,
			origin: pip.x,
			width: bounds.width,
			moved: false,
		};
		event.currentTarget.setPointerCapture(event.pointerId);
	};
	const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
		const active = gesture.current;
		if (!active || event.pointerId !== active.id) return;
		const dx = event.clientX - active.x;
		const dy = event.clientY - active.y;
		if (!active.moved) {
			if (Math.abs(dy) > 5 && Math.abs(dy) > Math.abs(dx)) {
				reset();
				return;
			}
			if (Math.abs(dx) < 5) return;
			active.moved = true;
		}
		const pip = nearestPip(records, active.origin + (dx * 960) / active.width, selected.current);
		if (pip) preview(pip.id);
	};
	const onPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
		if (gesture.current?.id !== event.pointerId) return;
		release();
		settle();
	};
	const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
		if (event.altKey || event.ctrlKey || event.metaKey) return;
		if (
			!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Escape"].includes(
				event.key,
			)
		)
			return;
		event.preventDefault();
		event.stopPropagation();
		release();
		if (event.key === "Home" || event.key === "Escape") {
			reset();
			return;
		}
		const pip =
			event.key === "End"
				? records.at(-1)
				: stepPip(
						records,
						selected.current,
						event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1,
					);
		if (pip) preview(pip.id);
	};
	return {
		previewId,
		phase,
		ready,
		plotRef,
		control: {
			onPointerDown,
			onPointerMove,
			onPointerUp,
			onPointerCancel: reset,
			onLostPointerCapture: () => {
				if (gesture.current) reset();
			},
			onKeyDown,
			onKeyUp: (event: KeyboardEvent<HTMLButtonElement>) => {
				if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "End"].includes(event.key))
					settle();
			},
			onBlur: reset,
			onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
				event.preventDefault();
				event.stopPropagation();
			},
		},
	};
}

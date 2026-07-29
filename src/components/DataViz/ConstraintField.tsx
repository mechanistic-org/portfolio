import { useEffect, useState, useMemo } from "react";
import * as d3 from "d3";
import {
	DOMAINS,
	INTERSECTIONS,
	intersectionCentroid,
	domainCentroid,
	type DomainId,
} from "@config/domains";

/**
 * CONSTRAINT FIELD
 *
 * The navigation surface for the /about biographical front door (global_agent#90),
 * rendering the four-domain constraint model ruled in global_agent#91.
 *
 * Two layers, deliberately:
 *   1. THE ARGUMENT — four soft-edged domain fields with the A-D intersections
 *      labelled. Static, non-interactive. This is the claim the page makes.
 *   2. THE NAVIGATION — project and biography bubbles pulled toward the centroid
 *      of their domain membership, sized by weight, coloured by overlap, clickable.
 *
 * A true Venn was considered and rejected: its geometry is fixed by set membership
 * (four sets, fifteen regions, no free placement), which fights directly with
 * placing nodes by weight and reachability. Membership wins by definition, so the
 * result would be correct and unusable. Soft fields keep the argument and free the
 * layout.
 *
 * Distinct from ResVizSwarm (homepage), which clusters the same projects by TIME.
 * Same collection, different question — that is why both exist.
 */

export interface FieldNode {
	id: string;
	name: string;
	kind: "project" | "bio";
	domains: DomainId[];
	/** Relative mass; drives radius. */
	value: number;
	color: string;
	/** Resolved destination. Absent = no page yet; opens the detail panel instead. */
	href?: string;
	/** True when href leaves the current property (mechanistic.com / moreplay.com). */
	external?: boolean;
	blurb?: string;
	employer?: string;
	year?: number;
}

interface SimNode extends FieldNode, d3.SimulationNodeDatum {
	radius: number;
	tx: number;
	ty: number;
}

interface Props {
	nodes: FieldNode[];
	width?: number;
	height?: number;
}

const VB_W = 1000;
const VB_H = 720;

export default function ConstraintField({ nodes: raw }: Props) {
	const [selected, setSelected] = useState<FieldNode | null>(null);
	const [isolated, setIsolated] = useState<DomainId | null>(null);
	const [hovered, setHovered] = useState<string | null>(null);
	const [layout, setLayout] = useState<Record<string, { x: number; y: number }> | null>(null);

	// Pre-compute simulation seeds. Target position is the centroid of the node's
	// domain membership — a node in three domains sits where those three meet.
	//
	// Seeds are scattered on a deterministic ring around that target rather than
	// placed on it. Membership is coarse (four domains, heavy overlap), so dozens
	// of nodes share a target; seeding them on the point makes collision resolve
	// into a pile instead of a disc.
	const simNodes = useMemo<SimNode[]>(() => {
		return raw.map((n) => {
			const { cx, cy } = domainCentroid(n.domains);
			const tx = cx * VB_W;
			const ty = cy * VB_H;
			const angle = ((hashCode(n.id) % 360) * Math.PI) / 180;
			const spread = 40 + (hashCode(n.id + "r") % 90);
			// Round the seeds. Math.cos/sin are implementation-defined to the last
			// ULP, and Node and Chrome disagree there — SSR emitted cy="…962" while
			// the browser computed …964, which React reports as a hydration
			// mismatch on every node. Two decimals is far below a rendered pixel.
			return {
				...n,
				radius: round2(Math.max(4, Math.sqrt(Math.max(n.value, 1)) * 2.4)),
				tx,
				ty,
				x: round2(tx + Math.cos(angle) * spread),
				y: round2(ty + Math.sin(angle) * spread),
			};
		});
	}, [raw]);

	useEffect(() => {
		// Desktop-only. Below the breakpoint the grouped list is the navigation,
		// and a 120-node force simulation on a phone is not navigation.
		if (typeof window === "undefined" || !window.matchMedia("(min-width: 768px)").matches) {
			return;
		}

		// Run to convergence synchronously and render the settled result, rather
		// than animating and mutating DOM attributes underneath React. A
		// navigation surface wants a stable layout, and this removes the
		// per-tick contention between d3's selection writes and React's renders
		// (every hover re-renders; an animating sim would fight it).
		const work = simNodes.map((n) => ({ ...n }));
		const sim = d3
			.forceSimulation<SimNode>(work)
			.force("x", d3.forceX<SimNode>((d) => d.tx).strength(0.05))
			.force("y", d3.forceY<SimNode>((d) => d.ty).strength(0.05))
			.force(
				"collide",
				d3
					.forceCollide<SimNode>((d) => d.radius + 2)
					.strength(1)
					.iterations(4),
			)
			.force("charge", d3.forceManyBody<SimNode>().strength(-4))
			.stop();

		const ticks = Math.ceil(Math.log(sim.alphaMin()) / Math.log(1 - sim.alphaDecay()));
		for (let i = 0; i < ticks; i++) sim.tick();

		setLayout(
			Object.fromEntries(work.map((n) => [n.id, { x: round2(n.x ?? 0), y: round2(n.y ?? 0) }])),
		);
	}, [simNodes]);

	const dimmed = (n: FieldNode) => isolated !== null && !n.domains.includes(isolated);

	const activate = (n: FieldNode) => {
		if (n.href) {
			window.location.href = n.href;
			return;
		}
		setSelected(n);
	};

	return (
		<div className="constraint-field">
			{/* ---------------- DESKTOP: the field ---------------- */}
			<div className="cf-stage">
				<svg
					viewBox={`0 0 ${VB_W} ${VB_H}`}
					role="img"
					aria-label="Career constraint domains and their intersections, as a navigable field"
					preserveAspectRatio="xMidYMid meet"
				>
					<defs>
						{DOMAINS.map((d) => (
							<radialGradient key={d.id} id={`cf-grad-${d.id}`}>
								<stop offset="0%" stopColor={d.color} stopOpacity="0.20" />
								<stop offset="55%" stopColor={d.color} stopOpacity="0.08" />
								<stop offset="100%" stopColor={d.color} stopOpacity="0" />
							</radialGradient>
						))}
					</defs>

					{/* LAYER 1 — the argument */}
					<g className="fields" aria-hidden="true">
						{DOMAINS.map((d) => (
							<circle
								key={d.id}
								cx={round2(d.cx * VB_W)}
								cy={round2(d.cy * VB_H)}
								r={round2(VB_W * 0.29)}
								fill={`url(#cf-grad-${d.id})`}
								style={{
									opacity: isolated && isolated !== d.id ? 0.25 : 1,
									transition: "opacity 240ms ease",
								}}
							/>
						))}
					</g>

					{/* LAYER 2 — the navigation */}
					<g className="nodes">
						{simNodes.map((n) => (
							<circle
								key={n.id}
								r={n.radius}
								cx={layout?.[n.id]?.x ?? n.x}
								cy={layout?.[n.id]?.y ?? n.y}
								fill={n.color}
								className={[
									"cf-node",
									`cf-node--${n.kind}`,
									n.href ? "cf-node--linked" : "cf-node--inert",
									hovered === n.id ? "is-hovered" : "",
									dimmed(n) ? "is-dimmed" : "",
								]
									.filter(Boolean)
									.join(" ")}
								tabIndex={0}
								role="button"
								aria-label={`${n.name} — ${n.domains
									.map((id) => DOMAINS.find((d) => d.id === id)?.label)
									.join(", ")}`}
								onMouseEnter={() => setHovered(n.id)}
								onMouseLeave={() => setHovered(null)}
								onFocus={() => setHovered(n.id)}
								onBlur={() => setHovered(null)}
								onClick={() => activate(n)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										activate(n);
									}
								}}
							/>
						))}
					</g>

					{/* Letter badges only, painted ABOVE the nodes so they stay readable
					    inside the cloud they mark (pointer-events: none, so they never
					    swallow a click). The full intersection names are long enough to
					    collide with that cloud, so they live in the prose list below. */}
					<g className="intersections" aria-hidden="true">
						{INTERSECTIONS.map((node) => {
							const { cx, cy } = intersectionCentroid(node);
							return (
								<g key={node.id} className="cf-intersection">
									<circle cx={round2(cx * VB_W)} cy={round2(cy * VB_H)} r={13} />
									<text
										x={round2(cx * VB_W)}
										y={round2(cy * VB_H)}
										textAnchor="middle"
										dy="0.35em"
									>
										{node.id}
									</text>
								</g>
							);
						})}
					</g>

					{/* Anchored to the frame corner of each domain's quadrant. Offsetting
					    from the centroid put the top pair at y = -19, off-canvas. */}
					<g className="domain-labels">
						{DOMAINS.map((d) => {
							const left = d.cx < 0.5;
							const top = d.cy < 0.5;
							return (
								<text
									key={d.id}
									x={left ? 8 : VB_W - 8}
									y={top ? 26 : VB_H - 12}
									textAnchor={left ? "start" : "end"}
									className="cf-domain-label"
									fill={d.color}
									style={{
										opacity: isolated && isolated !== d.id ? 0.3 : 1,
										transition: "opacity 240ms ease",
									}}
								>
									{d.label}
								</text>
							);
						})}
					</g>
				</svg>

				{/* Hover readout — sits outside the SVG so it can use real type */}
				<div className="cf-readout" aria-live="polite">
					{hovered ? (
						(() => {
							const n = simNodes.find((x) => x.id === hovered);
							if (!n) return null;
							return (
								<>
									<span className="cf-readout-name">{n.name}</span>
									<span className="cf-readout-meta">
										{n.domains
											.map((id) => DOMAINS.find((d) => d.id === id)?.label)
											.join("  ·  ")}
										{n.href ? "" : "  ·  no page yet"}
									</span>
								</>
							);
						})()
					) : (
						<span className="cf-readout-meta">
							{simNodes.length} nodes · hover to identify · click to open
						</span>
					)}
				</div>
			</div>

			{/* ---------------- Domain legend / isolate ---------------- */}
			<ul className="cf-legend">
				{DOMAINS.map((d) => {
					const count = raw.filter((n) => n.domains.includes(d.id)).length;
					return (
						<li key={d.id}>
							<button
								type="button"
								className={`cf-legend-btn ${isolated === d.id ? "is-active" : ""}`}
								style={{ "--cf-domain": d.color } as React.CSSProperties}
								onClick={() => setIsolated(isolated === d.id ? null : d.id)}
								aria-pressed={isolated === d.id}
							>
								<span className="cf-legend-dot" />
								<span className="cf-legend-text">
									<strong>{d.label}</strong>
									<em>{d.subtitle}</em>
								</span>
								<span className="cf-legend-count">{count}</span>
							</button>
						</li>
					);
				})}
			</ul>

			{/* ---------------- MOBILE: grouped list ----------------
			    Rendered always, shown by CSS below the breakpoint. This is the
			    real navigation on a phone — not a pinch-zoomed force simulation. */}
			<div className="cf-list">
				{DOMAINS.map((d) => {
					const members = raw
						.filter((n) => n.domains.includes(d.id))
						.sort((a, b) => b.value - a.value);
					return (
						<section key={d.id} className="cf-list-group">
							<h3 style={{ color: d.color }}>{d.label}</h3>
							<p className="cf-list-sub">{d.subtitle}</p>
							<ul>
								{members.map((n) => (
									<li key={n.id}>
										{n.href ? (
											<a href={n.href}>{n.name}</a>
										) : (
											<button type="button" onClick={() => setSelected(n)}>
												{n.name}
											</button>
										)}
									</li>
								))}
							</ul>
						</section>
					);
				})}
			</div>

			{/* ---------------- Detail panel ---------------- */}
			{selected && (
				<div
					className="cf-panel"
					role="dialog"
					aria-modal="false"
					aria-label={selected.name}
				>
					<button
						type="button"
						className="cf-panel-close"
						onClick={() => setSelected(null)}
						aria-label="Close"
					>
						×
					</button>
					<h3>{selected.name}</h3>
					<p className="cf-panel-domains">
						{selected.domains
							.map((id) => DOMAINS.find((d) => d.id === id)?.label)
							.join("  ·  ")}
						{selected.year ? `  ·  ${selected.year}` : ""}
					</p>
					{selected.blurb && <p className="cf-panel-blurb">{selected.blurb}</p>}
					{selected.href && (
						<a className="cf-panel-link" href={selected.href}>
							Open{selected.external ? " ↗" : ""}
						</a>
					)}
				</div>
			)}
		</div>
	);
}

const round2 = (v: number) => Math.round(v * 100) / 100;

/** Deterministic seed so opening frames are stable across builds. */
function hashCode(s: string): number {
	let h = 0;
	for (let i = 0; i < s.length; i++) {
		h = (h << 5) - h + s.charCodeAt(i);
		h |= 0;
	}
	return Math.abs(h);
}

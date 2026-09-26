import { useMemo, type CSSProperties, type MouseEvent } from "react";
import {
	buildContextRibbon,
	careerTimelineRecords,
	type CareerNode,
} from "../../utils/contextRibbon";
import { getEntityColor } from "../../config/color_registry";
import chronology from "../../data/careerChronology.json";
import "./CareerTimeline.css";

interface Props {
	nodes: CareerNode[];
	currentId?: string | null;
	onSelect?: (id: string) => void;
	compact?: boolean;
}

/** The same career projection and renderer serve the map, deep dives and lites.
 * Selection belongs to the caller. Native links remain usable without hydration. */
export default function CareerTimeline({ nodes, currentId, onSelect, compact = false }: Props) {
	const Neighborhood = compact ? "details" : "div";
	const model = useMemo(() => buildContextRibbon(nodes, currentId ?? ""), [nodes, currentId]);
	const dated = useMemo(
		() =>
			careerTimelineRecords(nodes)
				.map((record) => ({ ...record, id: record.slug }))
				.sort((a, b) => a.start - b.start || a.id.localeCompare(b.id)),
		[nodes],
	);
	const undated = nodes
		.filter((node) => !dated.some((record) => record.id === node.id))
		.map((node) => ({ id: node.id, title: String(node.data.title ?? node.id) }));
	const datedRoles = chronology.roles.filter((role) => role.period.start !== null);
	const ongoingRoles = datedRoles.filter((role) => role.period.end === null);
	const currentYear = new Date().getUTCFullYear();
	const startYear = Math.min(
		...dated.map((record) => new Date(record.start).getUTCFullYear()),
		...datedRoles.map((role) => Number(role.period.start)),
	);
	const endYear = Math.max(
		...dated.map((record) => new Date(record.end ?? record.start).getUTCFullYear()),
		...datedRoles.map((role) => (role.period.end ? Number(role.period.end) : currentYear)),
	);
	const first = Date.UTC(startYear, 0, 1);
	const last = Date.UTC(endYear + 1, 0, 1);
	const x = (date: number) => 16 + ((date - first) / (last - first || 1)) * 928;
	const current = dated.find((record) => record.id === currentId);
	const currentIndex = dated.findIndex((record) => record.id === currentId);
	const adjacent = currentIndex >= 0 ? [dated[currentIndex - 1], dated[currentIndex + 1]] : [];
	const undatedCurrent = undated.find((record) => record.id === currentId);
	const activate = (event: MouseEvent, id: string) => {
		if (
			!onSelect ||
			event.ctrlKey ||
			event.metaKey ||
			event.shiftKey ||
			event.altKey ||
			event.button !== 0
		)
			return;
		event.preventDefault();
		onSelect(id);
	};
	const years =
		model?.years.filter(
			(_, i, all) =>
				i === 0 || i === all.length - 1 || i % Math.max(1, Math.ceil(all.length / 5)) === 0,
		) ?? [];
	return (
		<nav
			className={compact ? "career-timeline career-timeline--compact" : "career-timeline"}
			aria-label="Career timeline"
			data-context-ribbon
			data-current={currentId ?? ""}
			data-source="routeEligibleProjects"
		>
			<div className="career-timeline-heading">
				{!compact && <h2>Career timeline</h2>}
				<a href="/projects/">All work ↗</a>
			</div>
			{dated.length > 0 && (
				<div className="career-overview">
					{compact && current && (
						<p
							className="career-current"
							style={{ "--current-x": `${x(current.start) / 9.6}%` } as CSSProperties}
						>
							{current.title} <span>{current.period}</span>
						</p>
					)}
					<div className="career-overview-years">
						<span>{startYear}</span>
						<span>{ongoingRoles.length > 0 && endYear === currentYear ? "Present" : endYear}</span>
					</div>
					<svg
						preserveAspectRatio={compact ? "none" : "xMidYMid meet"}
						viewBox="0 0 960 64"
						aria-label="Projects across the career"
						data-career-overview
					>
						{model && (
							<rect
								className="career-window"
								x={Math.max(0, x(Date.UTC(model.startYear, 0, 1)))}
								y="1"
								width={
									Math.min(960, x(Date.UTC(model.endYear + 1, 0, 1))) -
									Math.max(0, x(Date.UTC(model.startYear, 0, 1)))
								}
								height="62"
								rx="3"
							/>
						)}
						{dated.map((record, i) => (
							<a
								key={record.id}
								href={`/projects/${record.id}/`}
								onClick={(event) => activate(event, record.id)}
								aria-label={`${record.title} · ${record.period}${record.context ? ` · ${record.context}` : ""}`}
								aria-current={record.id === currentId ? "true" : undefined}
								data-project={record.id}
							>
								<title>{`${record.title} · ${record.period}${record.context ? ` · ${record.context}` : ""}`}</title>
								<rect
									x={x(record.start) - 3}
									y={6 + (i % 3) * 18}
									width="6"
									height="16"
									fill={getEntityColor(record.employer, "EMPLOYER")}
								/>
							</a>
						))}
						{ongoingRoles.map((role) => (
							<rect
								key={role.id}
								data-ongoing-role={role.id}
								x={x(Date.UTC(Number(role.period.start), 0, 1))}
								y="61"
								width={x(last) - x(Date.UTC(Number(role.period.start), 0, 1))}
								height="2"
								fill={getEntityColor(role.company, "EMPLOYER")}
							>
								<title>{`${role.company}: ${role.period.start}–Present`}</title>
							</rect>
						))}
					</svg>
				</div>
			)}
			{model ? (
				<Neighborhood className={compact ? "career-neighborhood" : undefined}>
					{compact && (
						<summary>
							Work from this period{" "}
							<span>
								{model.startYear}–{model.endYear}
							</span>
						</summary>
					)}
					<div className="career-axis">
						<span>
							{model.startYear}–{model.endYear}
						</span>
						<div>
							{years.map((year) => (
								<span key={year.label} style={{ left: `${year.x / 9.6}%` }}>
									{year.label}
								</span>
							))}
						</div>
					</div>
					<ol className="career-tracks">
						{model.projects.map((project) => (
							<li key={project.slug}>
								<a
									href={`/projects/${project.slug}/`}
									onClick={(event) => activate(event, project.slug)}
									aria-current={project.current ? "true" : undefined}
									data-project={project.slug}
									data-period-basis={project.basis}
									style={
										{
											"--career-color": getEntityColor(project.employer, "EMPLOYER"),
										} as CSSProperties
									}
								>
									<span className="career-track-label">
										{project.title}
										<small>
											{project.period}
											{project.context ? ` · ${project.context}` : ""}
										</small>
									</span>
									<span className="career-track" aria-hidden="true">
										<span
											className="career-span"
											style={{ left: `${project.x / 9.6}%`, width: `${project.width / 9.6}%` }}
										/>
										<span className="career-start" style={{ left: `${project.x / 9.6}%` }} />
									</span>
								</a>
							</li>
						))}
					</ol>
					<p className="career-note">
						{model.neighborCount} of {model.availableNeighbors} nearby projects · Dated work; dashed
						bars show employer periods.
					</p>
				</Neighborhood>
			) : (
				<p className="career-empty">
					{current
						? `${current.title}${Number.isFinite(current.start) ? ` · ${new Date(current.start).getUTCFullYear()}` : " · Date not recorded"}`
						: undatedCurrent
							? `${undatedCurrent.title} · Date not recorded`
							: "Choose a project to see its place in the timeline."}
				</p>
			)}
			{currentIndex >= 0 && (
				<div className="career-adjacent">
					{adjacent.map((record, i) =>
						record ? (
							<a
								key={record.id}
								href={`/projects/${record.id}/`}
								onClick={(event) => activate(event, record.id)}
								aria-label={`${i === 0 ? "Previous" : "Next"} project: ${record.title}`}
							>
								{i === 0 ? "← Previous" : "Next →"}
							</a>
						) : (
							<span key={i} />
						),
					)}
				</div>
			)}
			{undated.length > 0 && (
				<details className="career-undated">
					<summary>Undated projects ({undated.length})</summary>
					{undated.map((record) => (
						<a
							key={record.id}
							href={`/projects/${record.id}/`}
							data-project={record.id}
							onClick={(event) => activate(event, record.id)}
						>
							{record.title}
						</a>
					))}
				</details>
			)}
		</nav>
	);
}

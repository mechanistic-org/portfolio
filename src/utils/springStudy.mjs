export function normalizeSpringStudy(study) {
	const fail = () => {
		throw new Error("Invalid clamp response study");
	};
	if (
		study?.type !== "clamp-response" ||
		study.extensionMm !== 20 ||
		study.linerShoreA !== 75 ||
		typeof study.sourceLabel !== "string" ||
		!Array.isArray(study.rows)
	)
		fail();
	const groups = [1.6, 1.4, 1.2].map((spring) => {
		const rows = study.rows.filter((r) => r.spring === spring).sort((a, b) => a.width - b.width);
		if (
			rows.length !== 10 ||
			rows.some(
				(r, i) =>
					r.width !== 100 + i * 10 ||
					!Array.isArray(r.samples) ||
					!r.samples.length ||
					r.samples.some((v) => !Number.isFinite(v) || v < 0),
			)
		)
			fail();
		const n = rows[0].samples.length;
		if (rows.some((r) => r.samples.length !== n)) fail();
		return {
			spring,
			n,
			rows: rows.map((r) => ({
				width: r.width,
				samples: [...r.samples],
				mean: r.samples.reduce((a, b) => a + b, 0) / n,
			})),
		};
	});
	if (study.rows.length !== 30) fail();
	return {
		type: study.type,
		extensionMm: study.extensionMm,
		linerShoreA: study.linerShoreA,
		sourceLabel: study.sourceLabel,
		groups,
		assemblies: groups.reduce((n, g) => n + g.n, 0),
		measurements: groups.reduce((n, g) => n + g.n * g.rows.length, 0),
	};
}
export const springColors = ["#94bbff", "#f3bc68", "#c3acf8"];
export const springDashes = ["", "9 5", "3 5"];
export const chartX = (width) => 65 + ((width - 100) / 90) * 595;
export const chartY = (force) => 330 - (force / 25) * 285;
export const springPath = (rows, specimen) =>
	rows
		.map(
			(r, i) =>
				`${i ? "L" : "M"}${chartX(r.width)},${chartY(specimen === undefined ? r.mean : r.samples[specimen])}`,
		)
		.join(" ");

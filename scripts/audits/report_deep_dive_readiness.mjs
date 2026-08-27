/**
 * Report-only deep-dive readiness.
 *
 * The governed maturity/applicability contract lives in portfolio-canon's
 * DEEP_DIVE_SOP.md. Per-project status is read from the generated dashboard.
 * Findings never set a failing exit code and never become publication gates.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const READINESS_DIMENSIONS = [
	"Archive / vault",
	"NotebookLM custody",
	"Material-claim review",
	"Role / metrics",
	"Narrative",
	"Visuals / captions",
	"Projection",
	"Operator acceptance",
];
export const READINESS_STATES = ["complete", "pending", "not_applicable"];

function tableCells(line) {
	const sentinel = "\u0000PIPE\u0000";
	return line
		.trim()
		.slice(1, -1)
		.replaceAll("\\|", sentinel)
		.split("|")
		.map((cell) => cell.trim().replaceAll(sentinel, "|"));
}

export function parseTable(markdown, heading) {
	const marker = `## ${heading}`;
	const start = markdown.indexOf(marker);
	if (start === -1) throw new Error(`missing heading: ${marker}`);
	const lines = markdown.slice(start + marker.length).split(/\r?\n/);
	const headerIndex = lines.findIndex((line) => line.trim().startsWith("|"));
	if (headerIndex === -1 || !lines[headerIndex + 1]?.trim().startsWith("|")) {
		throw new Error(`missing table under ${marker}`);
	}
	const headers = tableCells(lines[headerIndex]);
	const rows = [];
	for (const line of lines.slice(headerIndex + 2)) {
		if (!line.trim().startsWith("|")) break;
		const cells = tableCells(line);
		if (cells.length !== headers.length) throw new Error(`malformed row under ${marker}: ${line}`);
		rows.push(Object.fromEntries(headers.map((header, index) => [header, cells[index]])));
	}
	return rows;
}

function stateOf(value) {
	return READINESS_STATES.find((state) => value.startsWith(state)) || null;
}

export function auditReadiness({ sopPath, manifestPath }) {
	const errors = [];
	if (!fs.existsSync(sopPath) || !fs.existsSync(manifestPath)) {
		return {
			available: false,
			errors: [
				`governed readiness inputs unavailable: ${!fs.existsSync(sopPath) ? sopPath : manifestPath}`,
			],
		};
	}

	const sop = fs.readFileSync(sopPath, "utf8");
	const manifest = fs.readFileSync(manifestPath, "utf8");
	const maturityStates = [...sop.matchAll(/^\d+\. `([^`]+)`/gm)].map((match) => match[1]);
	if (maturityStates.join(",") !== "unmined,mined,reconciled,composed,reviewed") {
		errors.push("DEEP_DIVE_SOP.md maturity model is missing or unparseable");
	}
	for (const state of READINESS_STATES) {
		if (!sop.includes(`\`${state}\``))
			errors.push(`DEEP_DIVE_SOP.md omits readiness state: ${state}`);
	}

	let identityRows = [];
	let readinessRows = [];
	try {
		identityRows = parseTable(manifest, "Identity and custody");
		readinessRows = parseTable(manifest, "Readiness by governed dimension");
	} catch (error) {
		errors.push(error.message);
	}

	const readinessHeaders = readinessRows.length ? Object.keys(readinessRows[0]) : [];
	for (const dimension of READINESS_DIMENSIONS) {
		if (!readinessHeaders.includes(dimension))
			errors.push(`dashboard omits readiness dimension: ${dimension}`);
	}

	const dimensions = {};
	for (const dimension of READINESS_DIMENSIONS) {
		dimensions[dimension] = Object.fromEntries(READINESS_STATES.map((state) => [state, 0]));
		for (const row of readinessRows) {
			const state = stateOf(row[dimension] || "");
			if (!state) errors.push(`${row.Slug || "unknown row"}: invalid ${dimension} state`);
			else dimensions[dimension][state] += 1;
		}
	}

	const maturity = {};
	for (const row of identityRows) {
		const state = row.Maturity;
		maturity[state] = (maturity[state] || 0) + 1;
	}
	return {
		available: true,
		errors,
		rows: readinessRows.length,
		maturity,
		dimensions,
		contract: sopPath,
		report: manifestPath,
	};
}

function runCli() {
	const canonRoot = path.resolve(process.env.CANON_ROOT || "D:\\GitHub\\portfolio-canon");
	const result = auditReadiness({
		sopPath: path.join(canonRoot, "DEEP_DIVE_SOP.md"),
		manifestPath: path.join(canonRoot, "entities", "projects", "deep_dive_manifest.md"),
	});
	if (process.argv.includes("--json")) {
		console.log(JSON.stringify(result, null, 2));
		return;
	}
	console.log("-------------------------------------------------------");
	console.log("Deep-dive readiness (report-only)");
	console.log("-------------------------------------------------------");
	if (!result.available) {
		console.log(result.errors.join("\n"));
		console.log("\nREPORT-ONLY: readiness unavailable; publication remains unaffected.");
		return;
	}
	console.log(`governed rows : ${result.rows}`);
	console.log(`maturity      : ${JSON.stringify(result.maturity)}`);
	for (const dimension of READINESS_DIMENSIONS) {
		console.log(`${dimension.padEnd(23)} ${JSON.stringify(result.dimensions[dimension])}`);
	}
	if (result.errors.length) console.log(`\nREPORT WARNINGS: ${result.errors.join("; ")}`);
	console.log("\nREPORT-ONLY: pending and not_applicable states never fail publication.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href)
	runCli();

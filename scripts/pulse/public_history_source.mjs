import fs from "node:fs";
import path from "node:path";
import process from "node:process";

export const PUBLIC_HISTORY_PATH_ENV = "PULSE_PUBLIC_HISTORY_PATH";

const defaultPublicHistoryPath = path.join("src", "data", "pulse", "public-history.json");

export function resolvePublicHistoryPath(explicitPath, environment = process.env) {
	return path.resolve(
		explicitPath ?? environment[PUBLIC_HISTORY_PATH_ENV] ?? defaultPublicHistoryPath,
	);
}

export function loadPublicHistory(explicitPath, environment = process.env) {
	return JSON.parse(fs.readFileSync(resolvePublicHistoryPath(explicitPath, environment), "utf8"));
}

export function selectCurrentPublicSnapshot(history) {
	if (history.current_snapshot_id === null) return null;
	const currentRecord = history.snapshots.find(
		(record) => record.snapshot.snapshot_id === history.current_snapshot_id,
	);
	if (!currentRecord) {
		throw new Error("[public-history] current_snapshot_id does not resolve for rendering");
	}
	return {
		...currentRecord.snapshot,
		lifecycle_state: currentRecord.lifecycle.state,
	};
}

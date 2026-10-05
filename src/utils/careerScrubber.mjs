/** Input is the visible, chronologically sorted pip list (date, then slug).
 * Equal-distance pointer ties retain the held pip, then use list order.
 * Keyboard stepping visits every record, including coincident pips.
 */
export function nearestPip(records, position, preferredId) {
	let best = null;
	let distance = Infinity;
	for (const record of records) {
		const next = Math.abs(record.x - position);
		if (next < distance || (next === distance && record.id === preferredId)) {
			best = record;
			distance = next;
		}
	}
	return best;
}
export function stepPip(records, currentId, direction) {
	const index = records.findIndex((record) => record.id === currentId);
	return records[Math.max(0, Math.min(records.length - 1, index + direction))] ?? null;
}
export const SCRUB_PAUSE_MS = 600;
export const SCRUB_RETURN_MS = 200;

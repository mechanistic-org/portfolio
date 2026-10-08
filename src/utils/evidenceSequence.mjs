/** Pair each existing evidence group with its preceding account; preserve every piece once. */
export function evidenceSteps(pieces) {
	/** @type {{prose: any[], group: any, after: any[]}[]} */
	const steps = [];
	let pending = [];
	for (const piece of pieces) {
		if (piece.group) {
			steps.push({ prose: pending, group: piece.group, after: [] });
			pending = [];
		} else pending.push(piece);
	}
	if (pending.length && steps.length) steps.at(-1).after = pending;
	return steps;
}

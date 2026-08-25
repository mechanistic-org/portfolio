export const DAY_MS = 86_400_000;

export function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

function stableValue(value) {
	if (Array.isArray(value)) return value.map(stableValue);
	if (!isRecord(value)) return value;
	return Object.fromEntries(
		Object.keys(value)
			.sort()
			.map((key) => [key, stableValue(value[key])]),
	);
}

export function stableJson(value) {
	return `${JSON.stringify(stableValue(value), null, "\t")}\n`;
}

export function addCalendarDays(value, days) {
	return new Date(Date.parse(`${value}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

export function collectReceiptIds(record) {
	return new Set(
		record.snapshot.groups.flatMap((group) => group.metrics.map((metric) => metric.receipt.id)),
	);
}

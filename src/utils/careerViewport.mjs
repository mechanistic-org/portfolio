/** A moving overview around the selected period, bounded by the actual career.
 * Preserve the full highlighted period, with context on both sides when available.
 * End years are inclusive; date coordinates use January 1 of endYear + 1.
 */
export function careerViewport(firstYear, lastYear, period) {
 if (!period) return { startYear: firstYear, endYear: lastYear };
 const total = lastYear - firstYear + 1;
 const span = Math.min(total, Math.max(20, period.endYear - period.startYear + 1 + 8));
 const center = (period.startYear + period.endYear + 1) / 2;
 const startYear = Math.max(firstYear, Math.min(lastYear + 1 - span, Math.floor(center - span / 2)));
 return { startYear, endYear: startYear + span - 1 };
}

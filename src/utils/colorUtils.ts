import * as d3 from "d3";

/**
 * COLOR HARMONIZATION ENGINE & UTILS
 *
 * Powered by d3-color to robustly handle 8-digit Hex codes (Alpha channels),
 * RGB, HSL, and other formats without fragile regex.
 */

export type PaletteScheme = "complementary" | "analogous" | "monochromatic" | "triadic";

/**
 * Generates a harmonious palette based on a single base color.
 * Respects alpha channels from the input.
 *
 * @param baseColor - Any valid CSS color string (Hex, RGB, etc.)
 * @param scheme - The harmony rule to apply
 * @returns Array of CSS color strings
 */
export function generatePalette(
	baseColor: string,
	scheme: PaletteScheme = "monochromatic",
): string[] {
	const c = d3.hsl(baseColor);
	if (!c.displayable()) return [baseColor]; // Fallback if invalid

	switch (scheme) {
		case "complementary": {
			// Base + Opposite (180deg)
			const comp = c.copy();
			comp.h += 180;
			return [c.formatHex(), comp.formatHex()];
		}

		case "analogous": {
			// Base + (-30deg) + (+30deg)
			const left = c.copy();
			left.h -= 30;
			const right = c.copy();
			right.h += 30;
			return [left.formatHex(), c.formatHex(), right.formatHex()];
		}

		case "triadic": {
			// Base + 120 + 240
			const t1 = c.copy();
			t1.h += 120;
			const t2 = c.copy();
			t2.h += 240;
			return [c.formatHex(), t1.formatHex(), t2.formatHex()];
		}

		case "monochromatic":
		default:
			// Base + Brighter + Darker
			// Note: d3.brighter(k) - k=1 is roughly 14% brighter
			return [c.brighter(0.5).formatHex(), c.formatHex(), c.darker(0.5).formatHex()];
	}
}

/**
 * Adjusts the opacity of a color while preserving its hue/sat/lightness.
 * Useful because our Base Colors often have built-in Alpha (8-digit hex),
 * and CSS `opacity` prop stacks (multiplying them), which might be too faint.
 *
 * @param colorStr - The source color
 * @param targetOpacity - 0.0 to 1.0 (Overrides existing alpha)
 */
export function setOpacity(colorStr: string, targetOpacity: number): string {
	const c = d3.rgb(colorStr);
	c.opacity = targetOpacity;
	return c.toString(); // Returns rgba() or rgb()
}

/**
 * Returns a high-contrast text color (White or Black) for a given background.
 */
export function getContrastText(bgColorStr: string): string {
	const c = d3.rgb(bgColorStr);
	// YIQ equation for brightness
	const yiq = (c.r * 299 + c.g * 587 + c.b * 114) / 1000;
	return yiq >= 128 ? "#000000" : "#FFFFFF";
}

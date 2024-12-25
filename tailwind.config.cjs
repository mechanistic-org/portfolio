/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	darkMode: "class",
	theme: {
		screens: {
			xs: "400px",
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
			"2xl": "1536px",
		},
		extend: {
			colors: {
				// use any standard tailwind colors from here https://tailwindcss.com/docs/customizing-colors
				// or generate with https://uicolors.app/create
				primary: {
					50: "#f1feef",
					100: "#dffeda",
					200: "#bffbb7",
					300: "#8cf67f",
					400: "#52e840",
					500: "#2ad017",
					600: "#20c20e", // main color
					700: "#1a870e",
					800: "#196a11",
					900: "#155710",
					950: "#043102",
				},
				base: colors.neutral,
				info: colors.sky["500"],
				"info-content": colors.sky["950"],
				success: "#52e840",
				"success-content": "#043102",
				warning: colors.yellow["500"],
				"warning-content": colors.yellow["950"],
				error: colors.red["500"],
				"error-content": colors.red["950"],
			},
		},
		fontFamily: {
			mono: [
				"JetBrains Mono",
				"SFMono-Regular",
				"Menlo",
				"Monaco",
				"Consolas",
				"Liberation Mono",
				"Courier New",
				"monospace",
			],
		},
	},
	plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};

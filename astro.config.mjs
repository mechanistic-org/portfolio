import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import sitemap from "@astrojs/sitemap";
import expressiveCode from "astro-expressive-code";
import mdx from "@astrojs/mdx";
import compress from "@playform/compress";
import AutoImport from "astro-auto-import";
import icon from "astro-icon";
import react from "@astrojs/react";
import keystatic from "@keystatic/astro";
import cloudflare from "@astrojs/cloudflare";

/** @type {import('astro-expressive-code').AstroExpressiveCodeOptions} */
const expressiveCodeOptions = {
	themes: ["slack-dark"],
	styleOverrides: {
		borderRadius: "0",
		borderColor: "#525252",
		codeBackground: "#171717",
		scrollbarThumbColor: "#525252",
		focusBorder: "#2E5CFF",
		codeFontFamily:
			"JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
		frames: {
			editorActiveTabIndicatorBottomColor: "#2E5CFF",
			editorActiveTabBackground: "#262626",
			editorBackground: "#262626",
			editorTabBarBackground: "#171717",
			frameBoxShadowCssValue: "0",
		},
	},
};

const isProduction = process.env.CF_PAGES === "1";

// /// CRITICAL ARCHITECTURE WARNING ///////////////////////////////////////////
// 1. PRODUCTION (Cloudflare) MUST be "static".
//    - Why: "server" mode bundles the entire site into one _worker.js.
//    - Risk: This hits the "10,000 Module Limit" and crashes the build.
//    - Fix: We force "static" to generate pure HTML/CSS/JS files.
//
// 2. LOCAL (Dev) MUST be "server".
//    - Why: Keystatic requires API routes (/api/keystatic) which need SSR.
//    - Fix: We force "server" locally to allow CMS editing.
// /////////////////////////////////////////////////////////////////////////////

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
	// Use Static for Production (Cloudflare Pages) to avoid Worker limits
	// Use Server for Local to support Keystatic API routes
	output: isProduction ? "static" : "server",
	// Only use the Cloudflare adapter in Server mode.
	// In Static mode, we want a pure HTML build (no _worker.js) to bypass module limits.
	adapter: isProduction ? undefined : cloudflare({ imageService: "compile" }),
	site: "https://www.eriknorris.com",
	redirects: isProduction
		? {}
		: {
				"/admin": "/keystatic",
			},

	i18n: {
		defaultLocale: "en",
		locales: ["en"], // Kept only English to simplify your build
		routing: {
			prefixDefaultLocale: false,
		},
	},

	integrations: [
		AutoImport({
			imports: [
				"@components/Cta/Newsletter.astro",
				"@components/Admonition/Admonition.astro",
				"@components/MDX/ModelViewer.astro",
				{
					"@astro-community/astro-embed-youtube": ["YouTube"],
				},
			],
		}),
		icon({
			tdesign: [
				"chevron-left-double-s",
				"chevron-right-double-s",
				"chevron-down",
				"close",
				"play",
				"plus",
				"lightbulb-circle",
				"lightbulb",
				"error-triangle",
				"close-circle",
				"info-circle",
				"mail",
				"filter",
				"download",
				"work-history",
				"share",
			],
			tabler: ["menu-2", "chevron-left", "chevron-right"],
		}),
		expressiveCode(expressiveCodeOptions),
		mdx(),
		react(),
		sitemap(),
		// compress({
		// 	HTML: true,
		// 	JavaScript: true,
		// 	CSS: false,
		// 	Image: false,
		// 	SVG: false,
		// 	Exclude: [/digiME/],
		// }),
		!isProduction ? keystatic() : null,
	].filter(Boolean),
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: ["axobject-query"],
		},
		server: {
			fs: {
				// Allow serving files from the sibling 'quantum-assets' repo via Symlinks
				allow: ["../eriknorris-assets", "."],
			},
		},
		ssr: {
			noExternal: ["three", "@react-three/fiber", "@react-three/drei"],
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
	},
});

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
	shiki: {
		langs: [
			"json",
			"javascript",
			"typescript",
			"html",
			"css",
			"bash",
			"markdown",
			"mdx",
			"python",
			"yaml",
			"astro",
		],
	},
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
	// HYBRID ARCHITECTURE (Dual-Mode)
	// 1. LOCAL: "server" mode to support Keystatic and dynamic previews.
	// 2. PROD: "static" mode to prevent OOM errors by generating HTML files + minimal Worker.
	output: isProduction ? "static" : "server",
	// Cloudflare Adapter handles the Worker generation.
	adapter: cloudflare({
		imageService: "compile",
	}),
	site: "https://eriknorris.com",
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
				"@components/DLS/Chip.astro",
				"@components/DLS/Wire.astro",
				"@components/Effects/ScrambleText.tsx",
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
		sitemap({
			filter: (page) => {
				const isDilute =
					page.includes("/colophon/") ||
					page.includes("/docs/") ||
					page.includes("/raw/") ||
					page.includes("/archive/") ||
					page.includes("/resume/"); // Exclude alternate resume views, main resume is typically /about/bio or similar?
				// Actually list shows https://eriknorris.com/resume/ exists. Keep that one?
				// User said "orphaned/unused".
				// Let's be strict on docs/colophon/raw/archive first.
				// If page is exactly resume/, keep it?
				// content: https://eriknorris.com/resume/
				// content: https://eriknorris.com/resume/pdf/
				// Let's filter sub-resumes.
				if (
					page.includes("/colophon/") ||
					page.includes("/docs/") ||
					page.includes("/raw/") ||
					page.includes("/archive/")
				) {
					return false;
				}
				// Filter resume sub-pages but keep the main one?
				// The URL is https://eriknorris.com/resume/
				if (page.includes("/resume/") && page !== "https://eriknorris.com/resume/") {
					return false;
				}
				return true;
			},
		}),
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
				allow: [".", "D:/GitHub/eriknorris-assets/R2_STAGING"],
			},
			watch: {
				// Use strict glob patterns with forward slashes for Windows compatibility
				ignored: ["**/public/assets/**", "**/public/assets", "**/R2_STAGING/**"],
			},
		},
		ssr: {
			noExternal: ["three", "@react-three/fiber", "@react-three/drei"],
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				...(isProduction ? { "react-dom/server": "react-dom/server.edge" } : {}),
			},
		},
	},
});

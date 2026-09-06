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

// Static output everywhere. "server" mode bundles the whole site into one
// _worker.js and hits Cloudflare's 10,000-module limit, so production MUST stay
// static — and dev now matches it (Keystatic, the old reason for SSR in dev, is gone).

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
	output: "static",
	// Cloudflare Adapter handles the edge image service / Worker generation.
	adapter: cloudflare({
		imageService: "compile",
	}),
	site: "https://eriknorris.com",

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
			// Static public/ pages are not Astro routes, so they never reach the
			// filter below and must be advertised explicitly.
			customPages: [
				"https://eriknorris.com/diligence/",
				"https://eriknorris.com/yes-shape/",
				"https://eriknorris.com/manual/",
			],
			// Surfaces that exist for the operator, the build, or agents - not for a
			// reader arriving from search. Keep this list in sync with the
			// X-Robots-Tag rules in public/_headers: dropping a URL from the sitemap
			// does not stop it being indexed, it only stops it being advertised.
			// #423 publishes the reviewed Wave 1 and current EN-OS explanation.
			// Other historical colophon routes retain their prior sitemap exclusion.
			filter: (page) => {
				const pathname = new URL(page).pathname.replace(/\/$/, "");
				if (
					pathname.startsWith("/colophon/") &&
					![
						"/colophon/en-os",
						"/colophon/reversible-editorial-queue",
						"/colophon/work-survives-a-session",
						"/colophon/missing-evidence",
						"/colophon/shipped-means-reachable",
					].includes(pathname)
				)
					return false;
				const EXCLUDED = [
					"/docs/",
					"/raw/",
					"/archive/",
					"/meta/",
					"/api/",
					"/kitchen-sink",
					"/design-system",
					"/assembly",
				];
				if (EXCLUDED.some((segment) => page.includes(segment))) return false;
				// Keep the canonical resume; drop any alternate view still in the tree.
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
	],
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: ["axobject-query"],
		},
		server: {
			fs: {
				// Allow serving files from the sibling 'quantum-assets' repo via Symlinks
				allow: [".", "D:/GitHub/portfolio-assets/R2_MIRROR"],
			},
			watch: {
				// Use strict glob patterns with forward slashes for Windows compatibility
				ignored: ["**/public/assets/**", "**/public/assets", "**/R2_MIRROR/**"],
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

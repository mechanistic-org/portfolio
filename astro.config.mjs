import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
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

// https://astro.build/config
export default defineConfig({
    adapter: cloudflare({
        imageService: "compile",
    }),
    site: "https://www.eriknorris.com",
    redirects: {
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
                "@components/Admonition/Admonition.astro",
                "@components/Cta/Newsletter.astro",
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
        compress({
            HTML: true,
            JavaScript: true,
            CSS: false,
            Image: false,
            SVG: false,
        }),
        // keystatic(),
    ],
    vite: {
        plugins: [tailwindcss()],
        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (id.includes("node_modules")) {
                            // Exclude Astro and Cloudflare specific packages from the vendor chunk
                            // to avoid "Received protocol 'cloudflare:'" errors during SSG/Node build
                            if (id.includes("astro") || id.includes("cloudflare") || id.includes("wrangler")) {
                                return;
                            }
                            return "vendor";
                        }
                    },
                },
            }
        },
        optimizeDeps: {
            exclude: ["axobject-query"],
        },
    },
});
# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is an Astro 5 static portfolio site (eriknorris.com) with Keystatic CMS, React components, TailwindCSS v4, and Three.js 3D visualizations. No databases or external services are required for local development.

### Running the dev server

```bash
npm run dev
```

Starts the Astro dev server at `http://localhost:4321`. Keystatic CMS is available at `/keystatic` (only in dev mode; production builds are fully static).

### Lint

```bash
npx eslint src/
```

Pre-existing lint errors exist in the codebase (6 as of writing); these are known and not blocking.

### Build

```bash
npm run build
```

Runs the CI prebuild script, Astro build, and Pagefind indexing. Note: build uses `output: "static"` mode (controlled by `CF_PAGES` env var), while dev uses `output: "server"` for Keystatic SSR routes.

### Key architecture notes

- **Dual output mode**: The `astro.config.mjs` switches between `"server"` (local dev) and `"static"` (production) based on `CF_PAGES === "1"`. Do not set `CF_PAGES=1` locally or Keystatic will break.
- **R2 asset proxy**: The local asset proxy in `src/pages/assets/[...path].ts` references a Windows path (`D:/GitHub/portfolio-assets/R2_STAGING`). On Linux, asset image requests will 404 but the site renders all text content fine.
- **No `.env` file needed**: The site uses `SITE_VARIANT` (defaults to `"main"`) and `CF_PAGES` (set by Cloudflare at deploy time). Neither needs to be set for local dev.
- **Package manager**: npm (lockfile is `package-lock.json`).
- **Node version**: 20+ required (CI uses 20, v22 works locally).

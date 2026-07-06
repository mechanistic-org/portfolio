# Mechanistic Production Deployment Profile

Technical profile and deployment protocols for the `mechanistic` repository within the EN-OS ecosystem.

## 1. Core Technical Stack

- **Framework**: Astro 5.x — `output: "static"` (SSG) via the `@astrojs/cloudflare` adapter.
- **Runtime**: Node.js (ESM - `type: module`)
- **Package Management**: `npm` (`package-lock.json`) for both local development and CI.
- **Content**: MDX collections (`@astrojs/mdx`) validated by Zod in `src/content.config.ts`. Keystatic — the dev-only CMS that briefly sat over the MDX — was fully retired (#104); content truth is migrating to the canon vault.
- **Frontend Core**: React 19 (`@astrojs/react`), Tailwind CSS 4.x (`@tailwindcss/vite`).
- **Visualizations**: D3.js (`d3`, `d3-sankey`), Three.js via React Three Fiber (`@react-three/fiber` + `drei`), Framer Motion, Tabler icons (for high-density forensic iconography).

## 2. Infrastructure & Deployment Architecture (Cloudflare Pages)

The primary (and only) production environment is **Cloudflare Pages**. The earlier Netlify path has been fully removed — `netlify.toml` and the `@astrojs/netlify` adapter are gone; Cloudflare configuration lives in `wrangler.toml`.

- **Deployment Model**: Git-integrated CD (Continuous Deployment).
- **Trigger**: Pushes to the `main` branch.
- **Build Command**: `node scripts/ci-prebuild.js && astro build && npx pagefind --site dist` (from `package.json`; the prebuild step clears a CI-only symlink — Cloudflare sets `CF_PAGES=1`).
- **Output Directory**: `dist`.
- **Search**: Static full-text index built by Pagefind over `dist` as the final build step.

## 3. Operational Protocols & Deployment Workflow

Deployment is governed by a standardized automation workflow (`.agent/workflows/deploy_production.md`):

1.  **Safety Check**: Local execution of `npm run build` to ensure compilation integrity before commitment.
2.  **Staging & Commit**: Atomic staging of features/fixes with descriptive commit messages.
3.  **Push to Main**: Execution of `git push origin main`, which triggers the Cloudflare Pages build pipeline.
4.  **Verification**: Manual validation of the production URL after ~120 seconds.

- **Build Stabilization**:
  - CI runs on Cloudflare Pages (`CF_PAGES=1`); `scripts/ci-prebuild.js` removes a problematic symlink before `astro build` so dependency resolution stays deterministic.
- **Performance**: Leveraging Astro's island architecture to minimize client-side JS while maintaining the interactive D3 / Three.js forensic consoles.
- **Persona Alignment**: Dashboard UI and narratives are synchronized with the **"Cheerful Mentor"** persona, ensuring technical diagnostic clinicality (ECU Dashboard) while maintaining strategic transparency.
- **Cross-Repo Consistency**: Deployment protocols are mirrored from the `eriknorris` ecosystem to ensure operational homogeneity for the Principal Architect.

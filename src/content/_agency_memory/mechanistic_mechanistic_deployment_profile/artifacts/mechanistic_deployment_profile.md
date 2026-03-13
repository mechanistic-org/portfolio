# Mechanistic Production Deployment Profile

Technical profile and deployment protocols for the `mechanistic` repository within the EN-OS ecosystem.

## 1. Core Technical Stack

- **Framework**: Astro 5.x (Hybrid/SSG)
- **Runtime**: Node.js (ESM - `type: module`)
- **Package Management**:
  - **Development**: `npm` (Local CLI)
  - **Production/CI**: `pnpm` (Configured in `netlify.toml`)
- **CMS Integration**: Keystatic (`@keystatic/astro`) for content collection management.
- **Frontend Core**: React 18 (`@astrojs/react`), Tailwind CSS 4.x.
- **Visualizations**: D3.js, ReactFlow, Lucide React (for high-density forensic iconography).

## 2. Infrastructure & Deployment Architecture (Cloudflare Pages)

While the repository contains legacy `netlify.toml` and `@astrojs/netlify` adapters, the primary production environment is **Cloudflare Pages**.

- **Deployment Model**: Git-integrated CD (Continuous Deployment).
- **Trigger**: Pushes to the `main` branch.
- **Build Command**: `pnpm build` (configured in Cloudflare Dashboard).
- **Output Directory**: `dist`.
- **Legacy Artifacts**: Keep `netlify.toml` and Netlify adapters for redundancy/compatibility during transition, but all production traffic routes through Cloudflare.

## 3. Operational Protocols & Deployment Workflow

Deployment is governed by a standardized automation workflow (`.agent/workflows/deploy_production.md`):

1.  **Safety Check**: Local execution of `npm run build` to ensure compilation integrity before commitment.
2.  **Staging & Commit**: Atomic staging of features/fixes with descriptive commit messages.
3.  **Push to Main**: Execution of `git push origin main`, which triggers the Cloudflare Pages build pipeline.
4.  **Verification**: Manual validation of the production URL after ~120 seconds.

- **Build Stabilization**:
  - Observed warnings when using `npm`: `Unknown project config "auto-install-peers"`.
  - Deployment strategy prefers `pnpm` in CI environment to ensure deterministic dependency resolution.
- **Performance**: Leveraging Astro's island architecture to minimize client-side JS while maintaining interactive D3/ReactFlow forensic consoles.
- **Persona Alignment**: Dashboard UI and narratives are synchronized with the **"Cheerful Mentor"** persona, ensuring technical diagnostic clinicality (ECU Dashboard) while maintaining strategic transparency.
- **Cross-Repo Consistency**: Deployment protocols are mirrored from the `eriknorris` ecosystem to ensure operational homogeneity for the Principal Architect.

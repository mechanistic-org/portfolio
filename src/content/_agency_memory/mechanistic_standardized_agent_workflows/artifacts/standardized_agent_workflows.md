# Standardized EN-OS Agent Workflows

Protocol for maintaining operational consistency across the EN-OS repository ecosystem (e.g., `eriknorris`, `mechanistic`).

## 1. Production Deployment Workflow (`/deploy_production`)

To ensure a "Zero-Defect" deployment pipeline, every repository in the ecosystem should maintain a `.agent/workflows/deploy_production.md` file with the following standard protocol:

### 1.1 Implementation Requirements

1.  **Safety Check**:
    - **Status Check**: Run `git status` to verify the working directory is clean or understood.
    - **Build Validation**: Run `npm run build` (or `pnpm build` depending on repo config). **STOP** if the build fails. This prevents "breaking production" at the source.
2.  **Commit Protocol**:
    - **Staging**: `git add .`
    - **Attribution**: Ask the user for a specific commit message or default to a "chore: [context] update".
    - **Commit**: `git commit -m "{message}"`
3.  **Push Protocol**:
    - **Central Branch**: `git push origin main`.
    - **CD Trigger**: This push triggers the external build provider (typically Cloudflare Pages for EN-OS projects).
4.  **Verification Pulse**:
    - Notify the user of the push.
    - provide a ~2-minute cooldown reminder before checking the live URL.

## 2. Cross-Repository Synchronicity

The "Principal Architect" (Erik Norris) expects operational homogeneity. When initializing or auditing a new repository within the ecosystem:

- Verify the existence of `.agent/workflows/`.
- Ensure the deployment workflow aligns with the "Push to Main" standard.
- Prefer `Cloudflare Pages` as the CD target for modern Astro/React consoles.

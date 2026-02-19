---
title: "Active Roadmap"
slug: "roadmap-active"
sidebar:
  group: "System Manual"
  order: 3
---

> [!NOTE]
> This is the **Active Roadmap (Sprint View)**.
> For historical changes, see [Changelog Archive](./CHANGELOG_ARCHIVE.md).

## 📍 Current Focus State (The "Cursor")

- **Active Task:** **Project Normalization (The "Ready State").**
- **Objective:** Bring ALL hydrated projects to a known baseline: "Text in Body".
- **Next Steps:**
  1.  Hydrate remaining ~7 projects (Bolus/Report -> Body).
      - [x] `webtv-galaxy` (Thermal Crisis)
      - [x] `webtv-elmer` (Cost War)
      - [x] `webtv-cortez` (Satellite)
      - [x] `sc48` (Meltdown)
      - [x] `d-command` (Conflict)
      - [ ] `d-show` / `mix-rack` (Missing Dumps)
  2.  **Verify:** No "Slide-out Drawers". All content must be in the main body.
  3.  **Status:** "Access Dossier" / "Forensic Drawer" functionality is **REMOVED**.
- **Context:** Normalizing the portfolio to a known baseline before starting Deep Dive curation (Images, 3D, Video).

## 🚀 Active Work (Feb 2026)

- [2026-02-10] (Infrastructure): **Main Site Stabilization.**
  - **Asset Proxy:** Implemented "Virtual Fallback" to Local Disk for `npm run preview`.
  - **Keystatic:** Fixed Schema Type Mismatches (`interventions.value`, `process.yield`).
  - **Identity:** Standardized Site Favicons to `logo.png` (White Branding). Deleted legacy `favicon.ico`.
  - **Feature:** Enabled `ConspiracyBoard` Component (`StandardDeepDive`).
  - **Critical Fix:** Removed `path.join` from Production Asset Proxy (Cloudflare Worker 500 Error Fix).
  - **Critical Fix:** Switched `HXOSwarmContainer` to `client:only` (Hydration #418 Fix).
- [2026-02-12] (Infrastructure): **The Pipeline Unblocking.**
  - **Hydration:** Patched `hydrate_content.py` to inject `events` (Seismograph), `bom`, `teamSize`, and `transcript`.
  - **Schema:** Updated `content.config.ts` to support V2 Forensic fields.
  - **HUD:** Wired `SonicHeartbeat` and `ForensicSeismograph` in `ForensicHUD.astro`.
  - **SEO:** Fixed `jsonLD.ts` schema mapping (`tags` -> `keywords`).
- [2026-02-09] (Forensics): **WebTV & Avid Injection.** Manually enriched `galaxy`, `elmer`, `cortez`, `sc48`, `d-command` with high-fidelity "Red Gold" narratives.
- [2026-02-09] (Infrastructure): **Virtual Bridge Protocol.** Replaced `public/assets` Junction with a direct-read Virtual Proxy in `[...path].ts`.
- [2026-02-09] (Governance): **Grok Log V2.** Refactored 44 Laws into 9 Constitutive Doctrines.
- [2026-02-08] (Governance): **Project Onboarding.** Loaded Core Context Files.
- [2026-02-16] (Forensics): **Avegant Glyph Restoration.**
  - **Full Graph:** Enriched Phase IV (BOM/Cast/Timeline).
  - **Visual:** Fixed "Ghost Filter" (`targets: []`) and "Void Mask" (Z-Index) bugs.
  - **Status:** **VALIDATED.** Text-Only Mode active.
- [2026-02-17] (Forensics): **Schedule Forensics Engine.**
  - **Pipeline:** Automated MPP -> Excel -> NLM Text conversion for 95 schedules (`digidesign`, `avegant`, `kaleidescape`).
  - **Analysis:** "Cone of Uncertainty" Volatility & Slippage Analysis (`scripts/analyze_task_volatility.py`).
  - **Dashboard:** Live "Forensic Volatility Index" visualization (`/forensics`).
- [2026-02-18] (Infrastructure): **Build Stabilization (MDX & Edge).**
  - **MDX:** Sanitized 43 unescaped `<Number` sequences (e.g. `<10min`) causing `vite-plugin-mdx` compilation failure.
  - **Asset Proxy:** Hardened `[...path].ts` with `@vite-ignore` to prevent `node:fs` leakage into Cloudflare Worker bundle.
  - **Schema:** Fixed `cinema-one` recursion and `dreamjob` simulation compliance.
  - **Status:** **DEPLOYED.**
- [2026-02-18] (Forensics): **Tagging Campaign (The Great Migration).**
  - **Ingestion:** Ingested `LinkedIn Skills.csv` (40+ terms) to create a high-fidelity taxonomy.
  - **Enrichment:** Ran `scripts/suggest_tags.cjs --apply` to inject thousands of tags across 125+ projects (Pro/E, SolidWorks, Leadership).
  - **Repair:** Executed `scripts/repair_tags_final.cjs` to fix widespread YAML corruption (`[object Object]`, Malformed Lists) in ~100 files.
  - **Status:** **VERIFIED.** Database is clean.
- [2026-02-18] (Architecture): **The Structured Assembly (The Circuit Board).**
  - **Physics:** Refactored `ExplodedView.tsx` from "Network Graph" to "Laned Layout".
  - **Taxonomy:** Defined `Left Lane` (Hard Skills), `Center Lane` (Timeline), `Right Lane` (Soft Skills).
  - **Result:** Turned the "Hairball" into a readable "PCB Wiring" diagram.
  - **Codified:** Added _Law IX (The Structured Assembly)_ to `GROK_LOG_V2.md`.

## 🚀 The Horizon (V6 Vision)

- **[Keystone] The Neural Assembly (The Brain):**
  - **Component:** `src/components/DataViz/Assembly.tsx` (Latent).
  - **Goal:** Visualize 30 years of "Life's Work" as a biological network (D3 Force Simulation).
  - **Status:** **Skeleton Exists.** Needs formalization. Not currently surfaced to user.

- **[Exploration] Operation Tactile Depth:**
  - **Goal:** Move beyond "Clean" to "Physical" (Haptics, Weight, Grit).
  - **Status:** **Queued** (Post-Normalization).

## 🎨 Moreplay / Colophon (The Archive)

- **[Concept] Ouroboros & Hyde:**
  - **Goal:** Vehicles to surface personality traits and "soft skills" via silicon-centric element mapping.
  - **Status:** **Archive / Moreplay.** Doesn't belong in active codebase roadmap.

- **[Product] The Screenshot Colophon:**
  - **Goal:** Curate the 1800+ project screenshots (since 11/22/25) into a visual history.
  - **Status:** **Backlog.** Distinct from main site.

## 🧊 The Backlog (Immediate)

- **[Refactor] Semantic Naming Strategy:**
  - **Goal:** Replace "Hyperspace" and standardize logic.
  - **Status:** **Friction.** Currently suffering from "Context Drag". Needs comprehensive semantic theming.

- **[Infrastructure] Cloudflare Cleanup (Quantum):**
  - **Goal:** Delete legacy "Quantum" project (175+ deployments) which blocks standard deletion.
  - **Tool:** `scripts/nuke_cloudflare_deployments.py`.
  - **Status:** **Deferred** (Feb 17). Script created, execution queued.

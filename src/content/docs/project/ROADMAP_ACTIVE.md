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

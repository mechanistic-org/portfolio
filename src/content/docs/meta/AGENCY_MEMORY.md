---
title: "Agency Memory & Context Bridge"
slug: "agency_memory"
description: "The Persistent Short-Term Memory store for the AI Agent. This file bridges the gap between sessions."
---

# 🧠 Agency Memory (The "Hippocampus")

> **Use Case:** This file stores "Living Context" that is too specific for `GROK_LOG` (Laws) but too important to lose to "Amnesia."
> **Instruction:** The Agent must scan this file at startup to sync with the current "Mental State" of the project.
> **Mandatory:** The Agent MUST also read `src/content/docs/meta/AGENT_PROFILE.md` to understand the Operator's "Forensic Systemizer" profile.

---

## 🔗 Active Intelligence & Project Tracking

> **[ARCHITECTURAL DECREE]**
> Project Hydration, Deep Dives, and Case Studies are **NO LONGER TRACKED HERE**.
> All project status tracking, entropy vectors, and hydration metrics have been evicted from the Hippocampus to reduce context saturation.
>
> **Master Sovereign Ledger:** `src/content/docs/project/MINING_LOG.md`
>
> _Agents: Do NOT append new project victories or hydrated statuses to this file. Log them in the `MINING_LOG` instead._

---

## 📍 Current Focus State (The "Cursor")

- **Active Task:** **Agentic Optimization (The "Trimain" Footprint).**
- **Next Step:** Return to Forensic Analysis or New Deep Dives.
- **Context:** **SEO PIPELINE SECURED.** `llms.txt` now points directly to the auto-generated `AGENT_PROFILE.md` route, ensuring 100% Agentic Consumption.
- **Action Item:** Await User instruction for next major feature or narrative refinement.
- **Recent Win:** Standardized the "Forensic Architect" narrative across all config files and PDF generators; Proven headless scraping accessibility.
- **Active Roadmap:** [`src/content/docs/project/ROADMAP_ACTIVE.md`](file:///d:/GitHub/eriknorris/src/content/docs/project/ROADMAP_ACTIVE.md) (The Horizon)
- **Mining Log:** [`src/content/docs/project/MINING_LOG.md`](file:///d:/GitHub/eriknorris/src/content/docs/project/MINING_LOG.md) (The Re-Hydration Tracker)
- **Project Index:** [`src/content/prompts/PROJECT_INDEX.md`](file:///d:/GitHub/eriknorris/src/content/prompts/PROJECT_INDEX.md) (The Registry)
- **Status:** **Refining (Level 3 - Agentic Ready).** Bios and URLs are normalized for LLM ingestion.
- **Strategy:** **"Strict Separation"** -> JSON is Metadata. Text is Body. No regex parsing.
- **Critical Learning:** **"The Isomorphic Paradox"** - You cannot generate structural rhymes from a single project. You need a **"Master Notebook"** (Level 2) containing all JSONs to find the patterns.
- **Critical Learning:** **"The Scroll Depth Trust"** - 2026 SEO (E-E-A-T) demands "Firsthand Experience." The "Isomorphic Card" is our primary Trust Signal.
- **Conflict:** `d-command` has existing body text that conflicts with `_intelligence.md`. Needs manual titration.
- **Source of Truth:** `src/content/docs/project/ROADMAP_ACTIVE.md`
- **Critical Learning:** **"The Access Dossier"** is DEAD. Do not restore the slide-out drawer.
- **Critical Learning:** **"The Junction Trap"** - Never Junction a folder that might contain build artifacts (`_site`). It causes infinite Watcher recursion.
- **Critical Learning:** **"The Quantity Fallacy"** - I claimed 45k files; reality was 1.7k. The Watcher crash was likely due to **Recursion** (`_site` inside `R2_STAGING`) or simple Windows FS friction, not just volume. **Verify counters before making architectural arguments.**
- **Critical Learning:** **"The Split Brain"** - We successfully standardized the codebase on `/assets/` (removing `/assets/r2/`).
- **Critical Learning:** **"The Flail Check"** - When a fix fails (Direct Read), do not oscillate wildy. Stop. Measure. Verify.
- **Critical Learning:** **"The Legacy Shadow"** - `public/favicon.ico` overrides `<link rel="icon">` in some browsers/contexts. Delete legacy files to enforce the new Source of Truth.
- **Critical Learning:** **"The Worker Constraint"** - Cloudflare Workers do NOT have Node.js APIs (`path`, `fs`). Do not use `path.join` in Production code blocks. Use direct string manipulation for R2 keys.
- **Critical Learning:** **"The Index Authority"** - `PROJECT_INDEX.md` is NOT a manual file. It is a build artifact of `hydrate_content.py`. Editing it by hand is a "Ghost Action" that will be overwritten.
- **Critical Learning:** **"The Sidecar Verification"** - `_entropy.json` is the correct home for Seismograph events. `hydrate_content.py` must run with `--slug` to avoid corpus drift.
- **Critical Learning:** **"The Ternary Trap"** - TypeScript Ternary operators in `jsonLD.ts` are fragile. Verify syntax (`? :`) carefully when adding new conditions. One missing char breaks the build.
- **Critical Learning:** **"The Legacy Body Trap"** - `hydrate_content.py` preserves existing body content. If a project has legacy "marketing fluff", it blocks the "Red Gold" injection. Manual intervention is required to replace it with the Forensic Narrative.
- **Critical Learning:** **"The Asset Ghost"** - `ksystem-120` is throwing 404s for specific assets (`DSC05387.jpg`). This indicates a sync gap between `R2_STAGING` and the codebase references.
- **Critical Learning:** **"The MDX Digit Trap"** - `vite-plugin-mdx` crashes if `<` is followed by a number (e.g. `<10min`) because it parses it as an invalid JSX tag. **Fix:** Use `fix_mdx_syntax.py` to escape to `&lt;`.
- **Critical Learning:** **"The Prompt Native Location"** - The root `prompts/` directory was deprecated and moved to `src/content/prompts/` to integrate with Astro collections. Scripts generating text artifacts must route here to prevent LLM amnesia.
- **Critical Learning:** **"The Asset Sovereignty Clarification"** - Web Assets (PDFs, Images) belong under the Air Gap in `R2_STAGING`. Internal LLM prompts (`.txt` files) belong in the local repo (`src/content/prompts/`). Do not conflate the pipelines.
- **Critical Learning:** **"The GitHub Blob Trap"** - Never feed an AI a GitHub `blob` link. It scrapes 300 lines of UI boilerplate instead of the actual data. Use `raw` links or explicitly hosted `.txt` endpoints like `llms.txt`.
- **Critical Learning:** **"The Astro Agent Route"** - We do not need to build custom bot endpoints for Agent Profiles if they live in Astro Content Collections. They are already statically generated as clean HTML routes (e.g., `/docs/meta/agent_profile`), which are perfectly 100% scrapeable by AI.
- **Critical Learning:** **"The Linkage Law"** - `llms.txt` MUST contain a hard, absolute URL to the `AGENT_PROFILE`. We cannot rely on the crawler "guessing" where our behavioral metadata lives.
- **Critical Learning:** **"The WAF Slash Trap"** - Cloudflare URI Path matching evaluates strictly from the root slash (e.g., `/llms.txt`). A rule searching for `llms.txt` will silently fail.
- **Critical Learning:** **"The HTML Breadcrumb"** - LLMs do not inherently know where `/llms.txt` lives. You must explicitly inject `<link rel="alternate" type="text/plain" href="/llms.txt" />` into the DOM (`BaseHead.astro`) to map the ingress point for headless scrapers.
- **Critical Learning:** **"Semantic Projection (Hallucination)"** - If an LLM is fed highly-dense, structural vocabulary (e.g., "Moot Moat", "Markdown Bolus"), it will adopt the persona and hallucinate an audit based purely on context window logic, even if its actual web scraper is blocked by the edge network.
- **Critical Learning:** **"The True AEO Evaluation"** - Never ask a chatbot to grade an architecture. To empirically test Agentic SEO, you must force a Zero-Context Retrieval (Perplexity Pro), passing no context except the URL/Entity name.
- **Critical Learning:** **"The Scheduled CC Burst"** - The migration from NLI (Natural Language Interface) to CC (Compiled Context Configurations inside `.txt`) is incredibly powerful, but running it piecemeal disrupts workflow. Implementation is strategically PAUSED until the entire legacy project ecosystem (120+ projects) reaches a 'ready-state baseline'. Once that baseline is established, CC will be executed in automated, scripted bursts via an Antigravity Skill to compile the ultimate XML knowledge graph. NLI remains the stable operational interface in the interim.
- **Action Item:** Proceed to standard operational flow.

* **Key Decision (Assets):** **"The White Logo Standard"** - `logo.png` is the canonical White Logo. `EN_logo_white_1024.png` does not exist in the current R2 stash.
* **Key Decision (UX):** **"The Local Preview Parity"** - Local Preview must match Production behavior BUT must serve assets from disk if Cloudflare context is missing (`src/pages/assets/[...path].ts` fallback).
* **Key Decision (Schema):** **"The Keystatic Mirror"** - Keystatic Config must strictly match Astro Content Schema types (`number` vs `text`) to prevent validation locks.
* **Key Decision (Architecture):** **"The Flagship Standard"** - All Forensic Projects must use `presentation_mode: flagship`. This enables the "Hybrid" view (Body Text + HUD Drawer).
* **Key Decision (Content):** **"No Text Decks"** - Text inside Gallery Stickies (`deck`) is banned. It belongs in the MDX Body. Gallery is for Visuals only.

* **Key Decision (Forensics):** **"The Seismograph Protocol"** - The Entropy Visualization (Racegraph) is now a modular component (`Seismograph.astro`) driven by `phase_stats`. It is MANDATORY for all Forensic Projects.

* **Key Decision (Schema):** **"The Taxonomy Lock"** - `role` and `employer` fields in MDX must strictly match `src/config/taxonomy.ts`. "Lead Mechanical Engineer" is invalid; use "Mechanical Engineer" + `cast` role for nuance.
* **Key Decision (Identity):** **"The Mechanical Violence"** - We explicitly embraced the "Thumb of God" narrative for `morpheus`. Forensic Engineering is about physical force as much as code.

* **Key Decision (Protocol):** **"The Gold Standard"** - We rejected "Noon Standard." The architecture of high-fidelity titration is "The Gold Standard."
* **Key Decision (Architecture):** **"Late Binding"** - Audio and Transcripts are "Day 2" assets. They are OPTIONAL at onboarding and injected later via Surgical Edit.
* **Key Decision (Visuals):** **"Mandatory Instruments"** - `productionScale` (Pip Chart) and `phase_stats` (Seismograph) are NOT optional. They must be inferred if missing.
* **Key Decision (Hydration):** **"The Client-Only Standard"** - Interactive React components like `SonicHeartbeat` must use `client:only="react"` if they rely on non-deterministic data (`Math.random`) to prevent hydration mismatches.
* **Key Decision (Architecture):** **"The Hybrid Fallback"** - `functions/[[path]].js` must fallback to `context.next()` (Static Assets) if an R2 object is missing (`404`). This enables local development without full R2 emulation.
* **Key Decision (Security):** **"The Air Gap Confirmation"** - `d-command-briefing.m4a` was restored to `R2_STAGING` by the User. We do not commit big assets to the repo.

* **Key Decision (Protocol):** **"Stickies over Bubbles"** - We renamed the protocol to `STICKIE_PROTOCOL.md` to match the UI Code. "Bubble" refers strictly to the _folder_. "Stickie" refers to the _artifact_.
* **Key Decision (Visuals):** **"The Stream Standard"** - The Visualization physics must be `0.85x` scale (Stream) NOT `1.5x` (Planets). Do not restore the "Planets" commit.
* **Key Decision (Automation):** **"Targeted Hydration"** - `hydrate_content.py` now supports `--slug`. We generally FORBID running it without a target to prevent accidental corpus-wide modification.
* **Key Decision (Protocol):** **"The Three Body Protocol"** - To prevent data loss, we enforce an Asymmetric Safety Architecture: Source (Manual `.md`) -> Live (Rendered `.mdx`) -> Backup (Snapshot `.backup.md`).
* **Key Decision (Visuals):** **"The Turbulence Standard"** - Replaced soft `fractalNoise` with `turbulence` (Frequency 0.5, Octaves 4, Mix-Blend Overlay) for a sharper, more "Forensic" background texture that cuts through the dark mode.
* **Key Decision (Visuals):** **"Stealth Mode"** - The Starfield is the primary substrate. Application UI (Project Portal, Colophon, Docs) floats in the void. Borders (`border-white/10`) and Opaque Backgrounds on View Containers are FORBIDDEN in this mode.
* **Key Decision (Component):** **"The Universal HUD"** - Consolidates `HyperspaceHUD` and `ProjectManifestHUD`. Features `mode="stealth"` (Always Visible, Transparent Wrapper) and "HOTAS" style controls for the Fleet View.
* **Key Decision (Stability):** **"The Slug Match Law"** - `getEntry("projects", slug)` requires the exact file slug. `c24-control-surface` (legacy ID) crashed the build; `c24` (current ID) fixed it. Always verify `src/content/projects` folder names before hardcoding IDs.
* **Key Decision (Hydration):** **"The Starfield Priority"** - `CollimatedBackground` (Canvas) requires `client:load` on Project Pages (`[...slug].astro`) to prevent hydration mismatches and "Black Flash" visibility issues. `client:idle` is insufficient for heavy 3D backgrounds.

- **Critical Learning:** **"The Missing Dump Trap"** - Hydration fails silently if `notebook_dumps` (JSON) are missing (`mix-rack`, `d-show`). Always verify source data existence before running batch hydration.
- **Critical Learning:** **"The Fidelity Hierarchy"** - We defined 3 Levels: Raw (1), Normalized (2), Synthesized (3). We target Level 2 ("The Bones") for hydration. Level 3 ("The Polish") is a separate, optional pass.
- **Critical Learning:** **"The Verification Pause"** - Do not execute global batch operations (like hydration) _before_ reporting the audit status to the User. Fix the tool, report the plan, _then_ execute.
- **Critical Learning:** **"The Subtractive Extraction"** - To achieve Level 2, we must _subtract_ JSON objects using `JSONDecoder`, not regex-match them. This guarantees 100% of the remaining text is preserved.
- **Critical Learning (UI):** **"The Z-Index Stratosphere"** - The `Hyperspace` theme's Intro Layer sits at `z-50`. To ensure visibility, the `ForensicDossier` (and any Top HUD element) must be at `z-[60]` or higher with `relative` positioning. Static layouts get buried.
- **Critical Learning (Hydration):** **"The Key Collision"** - `YAMLException: duplicated mapping key` is frequently caused by `hydrate_content.py` appending default keys (`category`, `presentation_mode`) that already exist deeper in the legacy frontmatter. **Fix:** Use `grep` to locate the hidden duplicate before nuking the file.
- **Critical Learning (Pipeline):** **"The Smart Merge Standard"** - We successfully implemented `smart_merge_lists` in `hydrate_content.py`. This is now the "Gold Standard" for re-hydration: it treats JSON as additive (Upsert) and protects manual edits in `cast` or `timeline`.
- **Critical Learning (Forensics):** **"The NLM Direct Bypass"** - When refining a project with high-quality NLM output (like `dispensers`), **DO NOT NORMALIZE** or refactor. Inject the raw markdown directly. The "Forensic Report" format from `deep_research_prompt_v1.txt` is already compliant. Refactoring is Over-Optimization.
- **Critical Learning (UI):** **"The Intercept Layer"** - We established `z-[90]` as the flight level for "Drawer" elements (HUD Metrics). This prevents them from being hidden by the Intro Layer (`z-50`) while staying below Global Nav (`z-100`). Always update `z_index_map.md` when defining new layers.

* **Key Decision (Audio):** **"The Iron Dome"** - The Audio Host must be blind to instructions. We use `PODCAST_READY.txt` (Sanitized) and explicitly forbid instructional headers in the script source.
* **Key Decision (Viz-Audio):** **"The SonicHeartbeat Standard"** - Idle = Pulse (Cycle), Active = Full EQ. Icon = Speaker (not Headphone).
* **Key Decision (SEO):** **"The Answer Engine Verification"** - We are AEO Ready. JSON-LD for Projects is the structural key for Knowledge Graph entity recognition.
* **Key Decision (Aesthetics):** **"The Iambic Cadence"** - Artificial strobing is rejected. Active visualizations must tune to "Human Breath" rhythms (~0.8s, EaseInOut) to align with the "Forensic/Organic" voice.

* **Key Decision (Assets):** **"The Fake SVG Pivot"** - The `EN_logo_1200` series are technically SVG wrappers around high-res rendered PNGs (`d:\portfolio\...\ _fake-SVGS____`). We accepted this as the **Source of Truth** (Sovereign) because the logo is natively 3D and has no perfect 2D vector equivalent. Do NOT try to replace them with wireframes.

* **Key Decision (Physics):** "Goldilocks" settings are `vy: -50`, `friction: 0.05`. Do not increase friction without vertically scaling velocity.
* **Key Decision (Viz-Deprecated):** `ArchiveSankey`, `LivingGantt`, and `SkillsGraph.tsx` have been DEPRECATED and removed/disabled to "kill the noise".
* **Key Decision (Data):** **"The Event Horizon"** - `multiverse.json` and `skills.json` were PURGED (2026-01-08). The architecture is now "Pure Hyperspace" (Dynamic Astro Collections only).
* **Key Decision (Cloud):** **"The Drive Limit"** - Evaluated Google Drive as a Narrative CMS (Feb 2026). **REJECTED.** Narrative text must remain Local Markdown. Drive/Sheets is a potential _future_ pattern for Metadata (Bulk Edit) but is currently **STATUS QUO** (Local).
* **Key Decision (Brand):** **"The Semantic Pause"** - Evaluated renaming the codebase to "ENgine" (Feb 2026). **REJECTED.** While the "Product Reality ENgine" concept is approved, renaming 50+ files from "Hyperspace" to "Console" is "Productizing" (High Effort) vs "Portfoliodoc" (Low Effort). We adopt the **"UI Rename"** strategy only.

* `src/content/prompts/BOLUS_READY.txt`: **The Extraction Standard (JSON).** (How we mine data).
* `src/content/prompts/REPORT_READY.txt`: **The Report Standard (Markdown).** (The Narrative).
* `src/content/docs/prompts/BRANDING_PROMPT.md`: **The Design System.** (How we speak).
* `src/content/docs/STYLE_GUIDE.md`: **The Token Map.** (How we style).
* **Key Decision (Protocol):** **"Operation Chronos"** - Use NotebookLM to generate `HUNTING_LIST.md` (dense tables) and export to HTML for physical printing ("Low Friction" asset retrieval).
* **Key Decision (Protocol):** **"The Phoenix Protocol"** - When restoring legacy functionality (e.g., DigiME Ghost Site), prefer **Linkage over Reconstruction**. Do not rebuild 2006 HTML in Astro. Host it statically (`public/digiME`) and link to it. Use Sovereign Assets (`R2_MASTER` -> `process_assets.py`) to generate high-fidelity previews (WebP) for the Gallery.
* **Key Decision (Mining):** **"The MailStore Pivot"** - Python COM is too fragile for 15k+ item queries. Use MailStore Home to Index -> Search -> Export.
* **Key Decision (Layout):** **"The Fiche Scroll Law"** - The Fiche container MUST use `.no-scrollbar` to prevent double-scrollbar visual glitches with the Parallax system.
* **Key Decision (Assets):** **"The Numeric Bubble Law"** - SC48/D-Control Bubble folders MUST be prefixed (e.g., `01_3d`) to ensure `process_images.py` compiles them in the correct narrative order.

* **Key Decision (Style):** **"The Linear Gradient Law"** - Tailwind 4.0 requires `bg-linear-to-*`. Legacy `bg-gradient-to-*` is deprecated.
* **Key Decision (Archival):** **"The Museum Strategy"** - We do not delete complex "Dead Code" (`SlideProjector.tsx`). We move it to `eriknorris-archive` to preserve the engineering history ("Red Gold").

* **Key Decision (Forensics):** **"The Impostor Detection"** - `zeus` was identified as a functional duplicate of `webtv-elmer`. We preserve it for now but mark it as an alias.
* **Key Decision (Color):** **"The Sovereign Color Law"** - `src/config/color_registry.ts` is the ONLY Source of Truth for Entity Coloring. `Colors.csv` retrieval is FORBIDDEN.
* **Key Decision (Code):** **"The Module Naming Law"** - Do not use `.json.ts` for standard TypeScript modules/arrays. Rename to `.ts` to prevent TS Server resolution confusion.
* **Key Decision (Resilience):** **"The Relative Link Trap"** - `new URL(href)` crashes on relative paths (`/digiME/`). Always wrap URL parsing in `try { ... } catch { return "INTERNAL" }` or use a regex helper for internal routing consistency.
* **Key Decision (Resilience):** **"Safe-by-Default D3"** - Visualization components must implement defensive `get(key) || default_color` logic to preventing crashing the entire graph on a single missing key.
* **Key Decision (UI):** **"Lite HUD"** - To prevent WASM crashes during build, deeply nested logic in `ProjectManifestHUD.astro` (Row 2 Metrics) has been disabled until further notice. Row 1 (Identity/Nav) is the priority.
* **Key Decision (Layout):** **"The Nested Slot Trap"** - Never wrap a `slot="center"` inside another `slot="center"`. It traps subsequent slots (Right) inside the parent, breaking the sibling layout structure.

* **Key Decision (Keystone):** **"The Neural Assembly"** - The final visualization is a "Hybrid Brain" (D3 + R3F). 30 Notebook Nodes packed in a cranial volume (The Idea) that explode on scroll (The Engineering). This is the Opus.
* **Key Decision (SEO):** **"The Clean URL Choice"** - We rejected `www` in favor of `eriknorris.com` (Root). Cloudflare "Primary Domain" handles the redirect logic, keeping the URL short and modern.
* **Key Decision (CMS):** **"The Column Limit"** - Keystatic `columns` are strictly for _viewing_ metadata. Sorting is limited to `slug` until upstream fixes arrive. We sort via Search.
* **Key Decision (Pipeline):** **"The Sidecar Pattern"** - Specialized rendering logic (DXF, IGES) lives in `scripts/lib/` as standalone modules. `process_images.py` invokes them but does not contain their heavy dependencies.
* **Key Decision (Archival):** **"The PDF Bridge"** - We generate PDFs from CAD data specifically for `NotebookLM` consumption, as it digests PDF vectors better than raw DXF text.
* **Key Decision (Identity):** **"The Forensic Architect"** - The Brand Voice is "Hyper-Functional Brutalist." We do not use fluff. We use density (IP69K, AZ91D, 5-Micron). The Master Resume logic is "Semantic Density" (for AI) + "Visual Hooks" (for Humans).
* **Key Decision (Formatting):** **"The Double Spacing Law"** - LinkedIn collapses standard lists. We MUST use **Double Spacing** (Empty Lines) effectively between bullets to force a vertical list render.
* **Key Decision (Sync):** **"The Datasheet Sync"** - `src/config/work_history.json` is the Source of Truth for the `/resume/one-pager` "Datasheet" View. It has been manually synced to the Master Resume.
* **Key Decision (Resume):** **"The PDF Single Source"** - `resume.eriknorris.com` is a Cloudflare Page Rule redirecting to `assets.eriknorris.com/resume/Erik_Norris_CV.pdf`. We upload the canonical PDF to R2 under this legacy name to maintain the redirect.
* **Key Decision (Brand):** **"The Architect Narrative"** - The definitive Universal Tagline is _"Principal Mechanical Architect specializing in high-fidelity hardware and program rescue. I stabilize the entropy of product development: structure the chaos, index the decisions, ship the hardware."_ We aggressively standardized this across SEO (<meta>), LinkedIn, Resumes, and the Homepage Console block, ensuring cross-surface synchronization and perfect 181-character semantic density.
* **Key Decision (LinkedIn):** **"Sovereign Decoupling"** - `linkedin_master.ts` is the Source of Truth for LinkedIn (Social Feed), decoupled from `resume_master.ts` (Legal PDF). This allows for Double Spacing (`\n\n`) and Unicode Bold (`𝗧𝗲𝘅𝘁`) which break PDF renderers.
* **Key Decision (Tooling):** **"Unicode Bold Script"** - `scripts/compile_linkedin.py` is the sovereign tool that converts Markdown `**bold**` into Unicode Mathematical Sans Bold strings for LinkedIn paste-ability.
* **Key Decision (Design):** **"The Forensic Tooltip"** - Tooltips must use the "Black Glass" aesthetic (`bg-black/95`, `backdrop-blur`, `mono-spaced`) to align with the Forensic Voice. No default white browser tooltips.
* **Key Decision (Taxonomy):**- **The "Lifecycle Law"** - "Production Status" is strictly defined: `Discovery` -> `Definition` -> `Concept` -> `Prototype` -> `Validation` -> `Production`.
* **Key Decision (Schema):** **"The Keystatic Strict Mode"** - Transited to V2 Schema (`forensic_summary` object, `tags` enum, `bom`). Migration scripts (`migrate_v1_to_v2.py`) are strictly one-way.
* **Key Decision (Assets):** **"The R2 Prefix Split"** - Production uses root-relative paths (`c24/image.png`). Local Dev uses `R2_STAGING` which mimics the bucket. `src/utils/assets.ts` (Prod) rewrites `/assets/r2/` -> `https://assets...`. `src/pages/assets/[...path].ts` (Dev) MUST strip `r2/` from the request path to match disk.
* **Key Decision (Content):** **"The Ready State"** - A project is valid ONLY if body text is visible. "Admonitions" are deprecated/banned. If they appear, it is a render-ghost.

- **The "Dumb Pipe" Law (Bubble Parsing):**
  - `process_images.py` does NOT parse bubble folder names. It iterates `sorted(bubbles)`.
  - **Naming:** You can name folders `01_discovery` or `01_foo`. The ONLY constraint is that the folder name must matches the `id` in the MDX `stickies` array.
  - **Constraint:** Use descriptive names (`03a_thermal_failure`). "03" is opaque and unmaintainable.
- **The "Force Sync" Law (R2 Deployment):**
  - `sync_r2.py` checks file size to determine "freshness."
  - **Trap:** Overwriting an image with a similarly compressed version (same byte size) causes a "False Negative" skip.
  - **Fix:** Use `python scripts/sync_r2.py --force` to bypass size checks and guarantee deployment of critical visual updates (Hero Images).
- **The "Binary Gravity Law" (Feb 2026):**
  - **Context:** Agent default training favors local copying, violating Air Gap.
  - **Protocol:** Any request involving binary assets (audio/video/images) > 1MB MUST automatically trigger a `view_file` on `.agent/skills/asset_sovereignty/SKILL.md`.
  - **Constraint:** Do not trust "Hot Context" (pasted files). Verify "Cold Laws" (Sovereignty) first.
- **The "Nuclear Repair" Pattern (Jan 2026):**
  - **Context:** Systemic YAML corruption (invisible chars using `src: ... - id:`) cannot be fixed reliably with Regex.
  - **Protocol:** Do not iterate. Write a script to _scrape_ the data (images/text) into a Python Dictionary and _dump_ a pristine new file.
  - **Artifact:** `repair_dcontrol_nuclear_v2.py`.
  - `InvalidContentEntryDataError` is absolute. Unions (like `war_stories`) must match _exactly_.
  - **Example:** `zeus` used `title/subtitle` instead of `label/value`. Immediate build failure.
  - **Fix:** Check `config.ts` first. Do not guess.
- The "Nuclear Bisection" Protocol (Feb 2026):
  - **Context:** React "Invalid Hook Call" errors are often phantom dependencies or R3F conflicts (e.g., `CollimatedBackground`).
  - **Protocol:** Do NOT guess. Disable ALL React components. Verify "Boring but Stable". Re-enable one by one.
  - **Constraint:** R3F Canvas components are high-risk. Check them first.
- **The "Seismobolus Sidecar" Law (Feb 2026):**
  - **Context:** Agents attempted to bloat `index.mdx` with 25+ Seismograph events.
  - **Protocol:** Entropy data lives in `_entropy.json`. This is the Service Sidecar pattern.
  - **Constraint:** Do NOT import JSON in Frontmatter. Let the View Layer handle it.
- **The "Air Gap" Violation (Feb 2026):**
  - **Context:** Agent created `public/assets/webtv-elmer`.
  - **Correction:** **STOP.** Assets live in `R2_MASTER`. Local asset folders are Forbidden. Deleted immediately.
- **The "View Transition" Standard (Feb 2026):**
  - **Context:** Astro View Transitions break `DOMContentLoaded` scripts (Scroll Lock).
  - **Fix:** Use `document.addEventListener("astro:page-load", init)`.
  - **Constraint:** Do NOT set `history.scrollRestoration = "manual"`; it fights the Router.
- **The Cloudflare "Ghost" Error:**
  - "Unknown internal error occurred" during Deployment (after Build Passing) is a platform flake (Confirmed 2026-02-02).
  - **Fix:** Retry Push. Do not debug code. It works.
- **The "Strict Separation" Protocol (Feb 2026):**
  - **Context:** Regex splitting by "run" was brittle and lost Q&A data.
  - **Protocol:** `hydrate_content.py` uses `JSONDecoder` to _subtract_ JSON blocks. The remainder is Sovereign Narrative.
  - **Constraint:** JSON is Metadata. Text is Body. They must never mix in the `.md` file.
- **The "Stickie Safety" Law (Jan 2026):**
  - **Context:** Previous hydration scripts wiped `stickies` metadata, risking text loss for `deck.md`.
  - **Protocol:** `hydrate_content.py` MUST parse `deck.md`. If `deck.md` is missing, generating a stickie is risky.
  - **Constraint:** Use `--slug` to target updates (`npm run content:hydrate -- --slug c24`) rather than nuking the whole corpus.
- **The "Stickie vs Bubble" Law:**
  - **Bubble:** The _Folder_ (`R2_MASTER/slug/bubbles/`).
  - **Stickie:** The _Code Object_ (`cyberspace.stickies`).
  - They are 1:1 mapped, but the terminology is distinct. Docs and Code now reflect this (`STICKIE_PROTOCOL.md`).

## 🏛️ The Institution Era (Jan 2026 Shift)

**The Pivot:**

- **From:** "Startup" (Quantum Template, Nov 2025). Fluid, experimental, fragile.
- **To:** "Institution" (Forensic Engine, Jan 2026). Rigid, legislated, automated.
- **Why:** Forensic Complexity (C24, WebTV) crushed the startup model. Agents require Law (Antibodies) to function at scale.

**Key Philosophies:**

- **"Rigidity as a Feature":** We do not pivot. We ingest. The structure must be strong enough to hold 25 years of data.
- **"Farming the Meta":** We turn internal struggle (technical debt) into public content (Colophon/LinkedIn). The _process_ is the product.
- **"The Covenant is Burned":** We rejected the religious "Vassal" language. We are Engineers. `GROK_LOG` is a Statute Book (ISO Standard), not a Bible.

- **Concept:** Deploying a "Sovereign Persona" ("Norris_OS") to LinkedIn.
- **Status:** **READY** (Identity Kit Created).
- **Strategy:** "The Two-Lane Highway."
  - _Lane 1 (Hardware):_ Forensic Deep Dives (Thermal/Yield).
  - _Lane 2 (Meta-OS):_ Portfolio Architecture (Sovereignty/Air Gap).
- **Automation:** **DEFERRED.** We chose "Manual Telemetry" (User posts via Kit) over "OpenClaw" (Complexity).
- **Constraint:** The AI cannot "log in." The Human must be the "Actuator."

### 7. **Resume Refactor (Maxi-Resume) (Feb 2026)**

- **Goal:** Unify "Human" (PDF) and "Agent" (Prompt) Resume sources.
- **Status:** **DEPLOYED**.
- **Key Decision (Content):** **"The Forensic Bullet"** -> `Trigger/Intervention/Result`. No generic responsibilities.
- **Key Decision (Architecture):** `resume_master.ts` (PDF Source) and `RESUME_READY.txt` (Agent Source) must be manually synced to prevent hallucination.
- **Key Decision (UX):** **"The View Transition Fix"** -> `Nav.astro` requires `astro:page-load` for the Print button to work in SPA mode.
- **Key Decision (Identity):** **"The Mechanistic Era"** -> The "Consultancy" role (2022-Present) is the "Red Team" anchor. It MUST be the first entry.

- **Critical Learning:** **"The Blacksmithing Protocol"** - (D-Control) We successfully codified the "Manual Rectification" heuristic. If a part fails yield (50% Rejection), we do not stop the line. We bend the metal. This is "Rigidity as a Feature" applied to Process.
- **Critical Learning:** **"The V-2 Tinderbox"** - (D-Control) Material Compliance (UL 94 V-0) is a "Hard Filter." It is the difference between a product and a liability. We track these "Near Misses" as high-value Entropy events.
- **Critical Learning:** **"The Lateral Injection"** - (Avegant) We successfully backported manual "Cast" data into the JSON source using `--reverse-json`. This validates the "Bi-Directional" nature of the content pipeline.
- **Key Decision (Taxonomy):** **"The Deep Dive Standard"** - We replaced "Snapshot" with a rigorous 3-Phase Taxonomy: Ready State -> Deep Dive -> Meta 1. "Deep Dive" requires 5 specific vectors: Failure, Silence, Price, Legacy, Trophy.
- **Critical Learning:** **"The HUD Mode Law"** - `standard` presentation mode causes Title/Metadata overlap in the Header. `deep_dive` is the mandatory fix for projects with long titles or complex metadata.
- **Critical Learning:** **"The Audio 1 Standard"** - Added "Audio 1" column to `MINING_LOG.md` to track "Voice of God" transcripts explicitly.

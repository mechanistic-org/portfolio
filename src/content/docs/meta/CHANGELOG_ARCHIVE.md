---
title: "Changelog Archive"
slug: "changelog_archive"
sidebar:
  group: "Meta"
  order: 99
---

# 📜 System Changelog (Archive)

> **Status:** Archived History (2025-2026).
> **Purpose:** A forensic record of the "ErikNorris" system evolution, preserved from the `docs_backup` vault.

---

## 📜 Change Log (Recent)

- **[2026-01-18] Prompt Engineering V3 (The Refinery)**
  - **[Architecture]** Split `notebook-refine` into `notebook-bolus` (JSON) and `notebook-report` (MD) to decouple logic from narrative.
  - **[Protocol]** Established "Iron Dome" stealth protocols for Audio Generation, preventing the host from reading instructions.
  - **[Resume]** Finalized "Forensic Architect" persona (PDF + LinkedIn V6) with validated "MTTR" and "Line-Down" metrics.

- **[2026-01-15] Hyperspace Migration & D-Control Restoration**
  - **[Restoration] D-Control Deep Dive:** Restored Flagship status. Injected `metrics` via frontmatter for Deep HUD and extracted `legacy_deck` for Dossier Narrative.
  - **[Migration] Archive Standardization:** Batch-migrated 120+ projects to `theme: hyperspace` using a new safe migration script.
  - **[Fix] Lite HUD Visibility:** Enforced **"No Variant has No Nav"** rule. Modified `Hyperspace.astro` to render the Top HUD in Standard mode (Lite).
  - **[Taxonomy] The Forensic Chain:** Proposed "Evidence Locker" paradigm as the successor to the "Hyperspace" naming convention.

- **[2026-01-15] Asset Densification & Timeline Repair (The Wrangle)**
  - **[Protocol] Operation SC48:** Established "Manual Curation" workflow for SC48 asset hydration (Scaffold -> Curate -> Optimize).
  - **[Fix] The MDX Trap:** Repaired critical Cloudflare build failures caused by unescaped `<` characters in `d-command` and `sc48`.
  - **[Fix] The Infinite Bubble:** Resolved "Time Dilation" bug in `d-control` visualization by enforcing `endDate: 2004-05-01` (was previously Open/Present).

- **[2026-01-14] Site Stabilization (The Corpse Purge)**
  - **[Architecture] Blog Decommissioning:** Removed all legacy blog infrastructure (`src/data/blog`, `authors`, and config references) to silence "No files found" warnings.
  - **[Fix] Cloudflare Sharp:** Configured `adapter: cloudflare({ imageService: "compile" })` to resolve runtime warnings while preserving build-time image optimization.
  - **[Cleanup] NPM Config:** Purged deprecated `.npmrc` settings (`auto-install-peers`, `node-linker`) to future-proof the environment.
  - **[Cleanup] Corpse Code:** Fixed broken image reference in `HeroTinyImage.astro` (Ghost Asset) instead of deleting it.
  - **[Fix] Schema Enforcement:** Resolved Keystatic validation error by enforcing String type for `teamSize` ("6") in `webtv-cortez`.

- **[2026-01-12] Forensic Resume & LinkedIn Overhaul**
  - **[Identity] Master Resume:** Established `MASTER_RESUME_GENERATED.md` as the "Universal Source of Truth," consolidating 30 years of history with "Forensic" fidelity (IP69K, Haptics, Magnesium).
  - **[Platform] LinkedIn V4:** Finalized Profile Overhaul with "Anti-Collapse" formatting (Double Spacing + Emoji Bullets).
    - **Bio:** "Hybrid Architect" narrative (WebTV -> Apple -> Forensic).
    - **Headline:** "Forensic Engineering | Program Rescue".
    - **Experience:** Full historic backfill (SGI to Present) with STAR-formatted wins.
  - **[Site] Asset Sync:** Updated `src/config/work_history.json` to reflect the new Master Resume narrative on the `/resume/one-pager` Datasheet view.
  - **[Protocol] External Synthesis:** Validated the "External Gemini" workflow for generating high-security career artifacts off-repo.

- **[2026-01-11] Debugging & Stabilization (The Numeric Trap)**
  - **[Fix] MDX Crash:** Resolved persistent `MDXError: Unexpected character 0` by enforcing "The Numeric ID Law" (Quoting all zero-prefixed keys in `c24`, `sc48`, `d-control`).
  - **[Fix] Content Body:** Identified and escaped invalid JSX tags (`<0.5mm`) in legacy content that were masquerading as parser errors.
  - **[Asset] SC48 Restoration:** Restored missing `SC48-hero-01.png` from `R2_MASTER` using `process_images.py` to generate optimized WebP variants.
  - **[Tooling] IDE Repair:** Diagnosed "Stream Error" in Commit Generator as a Google Cloud API Permission/Quota issue (404 on Model), not a code regression.
  - **[Fix] Branding:** Restored correct `EN_logo_1200` assets (Black/White variants) to `public/assets/branding/`. Resolved "Rusty" color issue and broken image links.

- **[2026-01-09] Sovereign Asset Pipeline (Legacy CAD)**
  - **[Feature] DXF Engine:** Implemented `dxf_renderer.py`, a modular "sidecar" engine using `ezdxf` + `matplotlib`.
  - **[Output] Tri-Format:** Automatically renders legacy `.dxf` files into:
    - **SVG:** For scalable web diagrams.
    - **PNG:** For high-speed raster previews (Gallery).
    - **PDF:** For high-fidelity Vector Archival (NotebookLM ready).
  - **[Workflow] Sidecar Pattern:** Decoupled specialized rendering from the main `process_images.py` loop to prevent bloat.
- **[FIX] HUD Mobile Break:** Implemented "Lite HUD" for mobile. Hides secondary metadata, increases touch target size for Nav, and prevents layout shifts.
- **[FEAT] Maintenance Mode:** Temporarily suspended Main Navigation (About, Work, Search) to allow for deep asset surgery without public traffic hitting 404s.
- **[CONTENT] Galaxy Pivot:** Refocused `webtv-galaxy` on "The God Box" narrative (Thermals & Aesthetics). Scrubbed "Invoices" and "Xbox Transition" to keep the portfolio professional.
- **[FIX] Dev Server OOM Crash:** Configured `astro.config.mjs` to **IGNORE** `public/assets/projects` in the file watcher. Linking `R2_STAGING` (thousands of files) caused the watcher to demand 64GB RAM.
- **[FEAT] Universal Notebook Prompt:** Created `src/content/docs/prompts/UNIVERSAL_NOTEBOOK_PROMPT.md` as the Single Source of Truth for forensic extraction. Standardizes "The Cast", "Ranked STARs", and "Visual Hunting Lists".
- **[DATA] Intelligence Standardization:** Hydrated `C24`, `SC48`, and `Galaxy` with high-fidelity "Boluses" generated by the new Universal Prompt.
- **[ARCH] Symlink Requirement:** Identified that `public/assets/projects` MUST be a **JUNCTION** (not Symlink) to `R2_STAGING`. PowerShell: `New-Item -ItemType Junction -Path public\assets\projects -Target ...` (Bypasses Admin req).

- **[2026-01-08] The Pure Static Pivot & Assembly Integration**
  - **[Architecture] Pure Static:** Resolved "20,000 Module Wall" deployment failure by conditionally disabling `astro-adapter-cloudflare` and forcing `output: "static"` in production (`CF_PAGES=1`).
  - **[Cleanup] Deployment Bloat:** Reduced production file count from 20k to ~170 files by stripping Keystatic and SSR logic from the build artifact.
  - **[Refactor] History Assembly:** Unified the `/history` and `/resume/pdf` data source by replacing legacy `work_history.json` with a live `getCareerTimeline()` utility (derived from Keystatic).
  - **[Documentation] Constitutional Sync:** Merged critical laws ("Sovereign Color", "Air Gap") from `AGENCY_MEMORY` into `03_THE_ENGINE_ROOM` to resolve "Split Brain" documentation.
  - **[Artifact] Onboarding Lite:** Created `ONBOARDING_QUICK.md` ("The 1-Liner") for rapid context hydration.

- **[2026-01-08] The Legacy Data Purge (Event Horizon)**
  - **[Cleanup] Multiverse Deletion:** Deleted `multiverse.json` and `skills.json` (The "Static Monolith"). Data is now purely dynamic, sourced from Content Collections.
  - **[Refactor] Dynamic Injection:** Updated all components (`WorkRealm`, `ResVizSwarm`) to accept data via props, breaking the hard dependency on static JSON.
  - **[UX] Simplification:** Deprecated `LivingGantt` and `ArchiveSankey` ("Little/No Value") to streamline the narrative experience.
  - **[Architecture] Pure Hyperspace:** The "Hyperspace" theme now runs on a fully dynamic data mesh.

- **[2026-01-07] Stabilization & Color Sovereignty**
  - **[Architecture] Sovereign Color Registry:** Finalized `src/config/color_registry.ts` as the single source of truth, replacing flexible but fragile CSV lookups.
  - **[Fix] SwarmFiche Regression:** Hardened `getEntityColor` logic to prevent D3 crashes on undefined inputs, restoring the Swarm visualization.
  - **[Refactor] Type Safety:** Renamed `projectData.json.ts` to `projectData.ts` to resolve persistent IDE lint errors and module resolution conflicts.
  - **[Cleanup] Tailwind 4.0 Prep:** Resolved all deprecation warnings (`flex-grow`, `aspect-ratio`) and updated `global.css` utilities.

- **[2026-01-06] Operation Chronos (Timeline & Hunting)**
  - **[Data] Timeline Truth:** Synced `multiverse.json` with Forensic Reality.
    - **WebTV:** Added Titan, Mercury, Pluto, Galaxy (The Grind Era).
    - **Digidesign:** Mapped C24 (Curtis), Project 003 (Kessel), Project 001 (Vandross).
  - **[Protocol] Asset Hunting:** Established "Pilot Protocol" where Antigravity drives NotebookLM to generate `HUNTING_LIST.md`.
  - **[Artifact]** Delivered `HUNTING_LIST_PRINTABLE.html` for low-friction MailStore retrieval.
  - **[Architecture] The Vault:** Codified `eriknorris-assets\R2_STAGING` as the "True Vault" and declared `eriknorris-workspace` DEAD.
  - **[Metric] Velocity:** Confirmed 45-day duration (Nov 22 Inception) for "Sovereign Pipeline" build.

- **[2026-01-05] Forensic Enrichment (The Flagships)**
  - **[Content] D-Control (Buckley):** Restored the flagship story using NotebookLM "War Stories" (Adhesion Crisis, Fader Wars, Thermal Bridge).
    - **Asset:** Ingested `d-control-hero-01-xl.webp` and confirmed verified visual evidence.
    - **Fix:** Resolved "Hero Image Placeholder" bug by enforcing Standard YAML Frontmatter (fixing schema validation failure).
  - **[Content] D-Command (Danko):** Mined the "Mid-Tier" narrative (Tinderbox PCBs, Umbilical Ground Loops).
  - **[Protocol]** Established "Code Name" metadata layer (Buckley, Danko, Curtis) for historical accuracy.

- **[2026-01-05] SwarmFiche Stabilization**
  - **[Fix] Interaction Gap:** Resolved `ResVizSwarm` clipping and unclickable nodes by ensuring `pointer-events-auto` propagated to D3 groups.
  - **[Fix] Layout:** Fixed "Double Scrollbar" glitch in Fiche list by applying `.no-scrollbar` utility to the container.
  - **[Fix] Z-Index:** Patched `HyperspaceHome` logo layer overlapping the interactive Swarm area.

- **[2026-01-05] The MailStore Pivot (Harvester V2)**
  - **[Strategy]** Retired custom Python extraction in favor of **MailStore Home**.
  - **[Workflow]** Search (in MailStore) -> Export EML -> Stitch (Python) -> NotebookLM.
  - **[Why]** Solves the "15k Item Timeout" and "MAPI Lock" issues inherent to direct Outlook automation.

- **[2026-01-05] SC48 Standardization & Mining Pivot**
  - **[Refactor] SC48 Bubbles:** Renamed bubble folders to `01_...` pattern to enforce correct compilation order and narrative flow.
  - **[Fix] SwarmFiche:** Resolved "Unclickable Nodes" by applying `pointer-events-auto` to D3 groups.
  - **[Fix] Scrollbars:** Implemented `.no-scrollbar` utility to fix "Double Scrollbar" glitch in Fiche container.
  - **[Strategy] Email Mining:** Pivoted from custom Python scripts to **MailStore Home** for "Search-First" email extraction (The Harvester Pivot).
  - **[Fix] Z-Index:** Patched `HyperspaceHome` to toggle `visibility: hidden` on logo layer to prevent input blocking.

- **[2026-01-04] Homepage "Creation Sequence"**
  - **Architecture:** Refactored `HyperspaceHome.astro` to use Vanilla JS scroll orchestration for performance.
  - **Feature:** Implemented "Carny Bell" physics trigger for Swarm entrance.
  - **Feature:** "Three-Click" Narrative: Logo -> Swarm -> Date Axis (Slow Fade).
  - **Cleanup:** Consolidated all project data to `multiverse.json`; retired `hierarchy.json` and `sacred_timeline.json`.
- **[2026-01-04] Data Consolidation & Stabilization**
  - **[Fix] Data Integrity:** Restored missing `SC48` node to `multiverse.json`; fixed broken image paths for `C|24`, `D-Control`, and `D-Command`.
  - **[Asset Pipeline]** Validated that `getAssetUrl` correctly handles R2 paths in production.
  - **[Architecture] Data Mesh:** Formalized the retirement of `hierarchy.json` and `sacred_timeline.json` in favor of a unified `multiverse.json`.
- **[2026-01-03] Stratospheric Recon & Viral Strategy**
  - **[Analysis] The Delta Scan:** Conducted a "60k Feet" audit comparing the Cold Vault (`\\morespace`) to the Workbench (`D:\portfolio`). Identified ~30 "Redacted Specimens" (Lytro, Apple, Avegant) that are effectively Air-Gapped.
  - **[Strategy] Viral Data:** Pivot validated. We will use D3.js to visualize the "Metadata Sonar" of 70,000 files, proving career contiguity despite local data loss (Ransomware).
    -\* **Key Decision (Architecture):** **"The Sovereign Pipeline"** - `eriknorris-workspace\R2_MASTER` is the **SOURCE OF TRUTH**. `eriknorris-assets\R2_STAGING` is the **PUBLISHED MIRROR**.

* **Key Decision (Infra):** **"The Junction Bridge"** - `public\assets\r2` MUST be a **JUNCTION** to `R2_STAGING`. DO NOT USE `mklink` (Symlink requires Admin). USE `New-Item -ItemType Junction` (Works globally).
  - **[Protocol] Stream Signatures:** Defined unique ingestion fingerprints for Noon (Visual), Hyphen (Process), and Kaleidescape (Industrial).

- **[2026-01-02] Sovereignty & Stability**
  - **[Architecture] Sovereignty Model:** Implemented `sovereign_manifest.json` to protect "Deep Projects" (C24, D-Command) from automated overwrite.
  - **[Cleanup] The Great Pruning:** Deleted obsolete scripts (`ingest_inbox.py`, `debug_*.py`) to enforce the "Two-Step Dance" workflow.
  - **[Fix] C24 UI Regressions:**
    - **HUD:** Resolved "Double Fixed" issue causing permanent HUD visibility.
    - **Links:** Fixed `ScrollyHud` hrefs to correctly target anchor IDs.
    - **Scrolling:** Moved `overflow-x: hidden` to `body` to restore scrolling.
  - **[Fix] Build Crash:** Identified and fixed a syntax error in `Hyperspace.astro` (`animateWiggle`) that was crashing the build pipeline.
- **[2026-01-04] C24 & System Stabilization**
  - **[Fix] C24 3D Pipeline:** Restored full `modelSrc` mapping in `Hyperspace.astro`, enabling correct GLB rendering across local/prod.
  - **[Cleanup] Vestigial Code:** Removed broken `TextDeck` logic from Stage 06/07.
  - **[Infrastructure] Golden Path:** Validated `getAssetUrl` integrity across all gallery components.
  - **[Fix] IDE Errors:** Patched `tsconfig.json` with `dom` lib to resolve 70+ false positive errors.
  - **[Polishing]** Removed debug logging from production components.
  - **[Protocol] Neural Scaffolding:** Established a new ingestion workflow: `NotebookLM` (Oracle) -> `Browser Agent` (Manifest Extraction) -> `Auto-Migration` (PowerShell). Replaced manual "Hunt and Drag" with "Approve and Watch."
  - **[Feature] SC48 Deep Dive:** Reconstructed the SC48 project using the **Hybrid Registration Protocol** (CSV Stub + Manual MD Override). Defined 4 "Exhibit Halls" (Meltdown, Origami, Brain, Shell) based on Oracle mining.
  - **[Infrastructure] Auto-Migration:** Implemented the "Law of Automation" – prohibiting the Agent from requesting manual file transfers when source/destination paths are known.

- **[2025-12-31] C24 Fidelity Restoration**
  - **[Fix] Title Render:** Resolved persistent "Missing Pipe" issue in "C|24" due to font glyph stripping. Implemented `C24TitleAnimator.tsx` with a CSS-geometric pipe for robust visibility.
  - **[Interaction] Title Hover:** Implemented "Reveal on Hover" logic (`C | 24` -> `Control | 24`) with `pointer-events-auto` fix.
  - **[Cleanup] Artifact Overlay:** Removed `Deck` array from "The Artifact" bubble in `c24.mdx` to eliminate obstructing text overlay on the 3D model.
  - **[Docs] Context Protocol:** Hardened `ONBOARDING_PROMPT.md` with a "Coercive Handshake" to force agent acknowledgement of critical laws (Air Gap, Asset Sovereignty).
- **[2025-12-31] Ghost Port & Cockpit Reconstruction**
  - **[FEAT] Cockpit HUD Reconstruction:** Re-implemented the "Deep Mode" HUD for the C24 project page, featuring a dense 2-row grid for COGS, Profitability, and Governance metrics.
  - **[FIX] Data Injection Pipeline:** Established a pattern for injecting sensitive/calculated project data via the router (`[...slug].astro`) rather than statically storing it in MDX.
  - **[INCIDENT] Ghost Port 001:** Resolved "Phantom Code" confusion caused by a zombie process serving a divergent state on port 4322. Documented widely to prevent recurrence.
- **[2025-12-30] Immersive Galleries (R&D)**
  - **[R&D] Reality Distortion:** Prototyped "Conspiracy Board" (Canvas) and "Comparator" (X-Ray) components.
  - **[Feat] Living Grid:** Upgraded `SharedLayoutGallery` to support Isotope-style category filtering using `framer-motion` layout animations.
  - **[Refactor] Archive:** Reverted C24 to standard galleries; archived immersive prototypes to `feature/immersive-prototypes`.
  - **[Fix] CSS:** Resolved "Invisible Filter Buttons" bug caused by flexbox vertical centering clipping overflow content.
- **[Asset Pipeline]** Fixed C24 Hero Image missing from Project Card.
  - _Root Cause:_ Source file `hero.png` failed regex validation in `process_images.py`.
  - _Resolution:_ Renamed to `c24-hero-01.png` to satisfy taxonomy; verified generation of optimized slices.
- **[v-Next] - Operation Time Capsule & C24 Refinement**
  - **[Feature] Time Capsule Engine:** Implemented `TimeCapsule.tsx`, a "Netscape/IE6" retro-browser modal triggered from the gallery to display legacy intranet evidence.
  - **[Feature] Flux Capacitor:** Created `RetroLogoAnimator.tsx` to reconstruct legacy 2002 branding sequences using React/Framer Motion with intentional "Holographic Instability".
  - **[Content] C24 Honors Class:** Refined Narrative Bubble 5 ("The Paper Trail") to focus on "Engineering Ops" and "Tribal Knowledge," upgrading the persona to "Infrastructure Architect."
  - **[Aesthetic] Masonry Scatter:** Enabled `scattered: true` layout in SharedLayoutGallery for "Messy Desk" forensics aesthetic.
  - **[Asset] DigiME Excavation:** Recovered high-res `digi_logo` variants and `gen_mod_guide.php` from 2006 archives.
- **[v-Next] - C24 Scrolly-Telling Polish**
  - **[Feature] Mega-Gallery Engine:** Upgraded `SharedLayoutGallery` with a multi-mode Layout Engine supporting `masonry`, `collage`, and `spotlight` presentations.
  - **[Design] Narrative Rhythm:** Implemented a "Visual Rhythm" strategy for C24, alternating between "Scattered Masonry" (Origin), "Spotlight" (Crisis), and "Collage" (Forensics) to prevent scroll fatigue.
  - **[Content] Narrative Refinement:** Polished Bubbles 1 & 2 ("Dodge the Lead Bullet", "Defying Gravity") using the "Gold Bar" mining protocol from NotebookLM.
  - **[Fix] Asset Sanitation:** Resolved critical Windows filename spacing issues in the Structural gallery via `sanitize_structural.py`.
  - **[Feature] C24 Origin Story:** Implemented "Deep Dive" chapter using the Mega-Gallery pattern (21-image grid).
  - **[Refactor] Hyperspace Text Engine:** Upgraded `NarrativeItem` to use Slot-based rendering for robust rich-text support.
  - **[Fix] Sticky Titles:** Added `invisible` prop to `ScrollTrigger` to remove obstructive default styling when titles are empty.
- **[v2.5.0] - Data Ingestion Upgrade**
  - **[Script] Stitcher v2:** Upgraded `stitcher.py` to support "Bolus Extraction" for PDF (`pypdf`) and PPTX (`python-pptx`).
  - **[Protocol] Hybrid Ingestion:** Enforced "The Law of Assets" (IV), establishing the Bolus (Text) + Original (Visual) separation for NotebookLM.
  - **[Content] Origin Story:** Mined the "Control 24" archives using the new protocol, drafting the "Code Name Curtis" and "Solo Governance" narratives.
  - **[Artifact] The Grok Log:** Established `GROK_LOG.md` as the project constitution to prevent regression.
- **[Polish] Control-24 & Symlink Protocol:**
  - **[Architecture] Symlink Bridge:** Established `public/assets/r2` -> `../ErikNorris-assets/R2_STAGING` symlink as the Definitive Local Dev Strategy. Eliminated repo bloat while maintaining instant asset access.
  - **[Content] Control-24 Restoration:** Stabilized the `control-24` case study with verified "China Crisis" evidence, "Seven Millimeter" narrative, and a transparent "Cinematic Hero" layer.
  - **[Theme] Hyperspace Patch:** Fixed `Hyperspace.astro` to render the `heroImage` (30% opacity) in the intro layer, creating a verified "Movie Poster" aesthetic.
- **[Polish] C|24 Interactive Layers:**
  - **[3D]** Integrated `C24_shell.glb` with "Matte CAD" lighting (Exp 0.3) and "Elastic Snap" physics.
  - **[DataViz]** Functioning `MetricComparison` component showing transition stats.
  - **[Fix]** Restored DataViz slot in `Hyperspace` theme and fixed Sidenav active states.
- **C24 Gallery Refactor:**
  - **Interactivity:** Resolved `z-index` blocking issues; enabled metadata (Title/Desc) on Lightbox.
  - **Density Control:** Added `columns` prop to `SharedLayoutGallery` (Supports 2, 3, 4, 5, 6, 8 columns).
  - **Navigation:** Added explicit "GRID VIEW" (Close) button `z-[9999]` and standard Next/Prev arrows.
  - **Architecture:** Enforced "Air Gap" sync for `c24` assets via patched `ingest_data.py`.
- **[v6.0.0] - Ouroboros Constellation Arc**
  - **[Feature] Constellation Engine:** Launched the `ConstellationEngine.tsx`, a 3D physics-based navigator replacing the legacy Archive Sankey.
  - **[Vision] Macroscopic Physics:** Implemented "Celestial Drift" (slow global rotation) and non-coplanar spherical distribution to break the 2D plane logic.
  - **[Aesthetic] The $10M Glow:** Integrated a high-fidelity atmospheric stack (Bloom, Noise, Vignette) and a custom Shader-based **Nebula** for cosmic depth.
  - **[Architecture] Integral CORE:** Dissolved the explicit "HOME" hub in favor of an implicit origin where Identity nodes (Expertise, Bio, Tools) act as the "Fundamental Matter" of the system.
  - **[Feature] Sector Isolation:** Deployed `/work-constellation` and `/specs-constellation` as dedicated, deep-field sector exploration sandboxes.
  - **[Prototype] Project Systems:** Created the first recursive "System within a System" at `/projects/strato/system`, mapping a project’s internal case studies into their own constellation.
- **[v5.0.0] - Hyperspace Launch**
  - **[Feature] System Realm:** Restored full 3D fidelity to Realm IV (The Machine). Implemented "Exploded Stack" visualization with anisotropic glass materials.
  - **[Fix] Navigation Sync:** Resolved "Ghost Pill" issues in `HyperspaceHUD` by implementing "Sweet Spot" IntersectionObserver logic (`-25%` margin).
  - **[Infrastructure] Deployment:** Successfully deployed Hyperspace Theme to production (`a0abb61`).
- **[v1.0.0-beta] - NorrOS Soft Launch**
  - **Default Theme:** Migrated `index.astro` to serve `HyperspaceHome` as the primary interface (`DEFAULT_THEME = 'hyperspace'`).
  - **The 4-Stroke Engine:** Implemented the full "Scrollytelling" lifecycle:
    1.  **Identity:** `WiggleLogoParallax` (Zoom/Orbit).
    2.  **Work:** `SlideProjector` (Vertical Pin + List).
    3.  **Specs:** `LivingGantt` (Horizontal Scroll).
    4.  **System:** `SystemAssembly` (Scroll-driven Explosion).
  - **HUD:** Added global `HyperspaceHUD` with Search trigger and status indicator.
  - **Light Mode:** Enabled support in Realm II (Proof of Velocity).
- **[Infrastructure] R2 Pruning:** Upgraded `sync_r2.py` with `--prune` (Mirror Mode) to support efficient asset replacement and cleanup of orphaned files.
- **[Maintenance] Documentation Consolidation:** Merged duplicate `IMAGE_WORKFLOW.md` SOPs into a strict Single Source of Truth.
- **[Security] Credential Rotation:** Hardened `sync_r2.py` with explicit `.env` path loading and `region_name='auto'` Boto3 patching to resolve signature verification failures.
- **[Architecture] Theme Engine:** Refactored project routing to support multiple distinct layouts (`Hyperspace`, `Command`, `DataSheet`) via a scalable Registry pattern.
- **[Feature] Redacted Theme:** Implemented Tier 4 "NDA" archetype with 3 aesthetic variants:
  - **Terminal:** Green phosphor, ASCII art, CRT effects.
  - **Dossier:** Manila folder, typewriter typography, physical stamps.
  - **Omega:** "Mission Impossible" amber alert style.
- **[Polish] Command V3:** Upgraded Command theme with "Ouroboros HUD" (D3.js Skill/Phase visualization) and "Technical Frame" layout.
- **[Infrastructure] R3 Registry:** Established `public/assets/r3` as the standardized namespace for Theme Engine assets.
- **[Strategy] Genesis Analysis:** Conducted a deep architectural audit ("The Crisis of Faith") validating the "Infrastructure First" approach and establishing the "Builder vs. Operator" phase transition.
- **[Artifact] Genesis Story:** Mined the "Sonnie's Edge" / "Bucking Foundation" narrative into `src/content/docs/backlog/GENESIS_STORY.md`.
- **[Maintenance] Process Cleanup:** Identified and terminated zombie `curl` processes from legacy asset verification tasks to restore system stability.
- **[Refactor] Identity Scrub II:** Renamed internal package to `erik-norris-portfolio` and migrated system events from `ErikNorris:boot` to `system:boot`.
- **[Fix] Workspace Stability:** Created `ErikNorris.code-workspace` to resolve "Ghost Workspace" issues.
- **[Architecture] Zero-Bloat Pivot:** Abandoned `astro-adapter-cloudflare` in favor of `output: static` + Manual Pages Functions to resolve "Too Many Modules" build failure.
- **[Fix] Asset Regression:** Regenerated "Dreamjob" visual assets (converted Green -> Blue) and forced a `--remote` sync to correct the R2 Source of Truth.
- **[Infrastructure] R2 Proxy:** Migrated asset delivery from a manual `_worker.js` to the native `functions/[[path]].js` standard.
- **[Feature] Visual Sitemap:** Implemented `/map` ("System Topology"), a tree-based visualization of the site's routing architecture derived dynamically from `navData` and content collections.
- **[Backlog] Structure Optimization:** Archived "Specs & CV" refactoring plan to `docs/backlog/SITE_STRUCTURE_OPTIMIZATION.md`.
- **[Feature] Pitch Deck:** Implemented `/pitch` with 5-slide narrative (Hook, Problem, Solution, Proof, Ask).
- **[Branding] 3D Logo:** Integrated `WiggleLogo3D` (Forged Carbon texture with anisotropic animation) via R3F.
- **[Infrastructure] 3D Stack:** Added React Three Fiber ecosystem (`three`, `@react-three/fiber`, `@react-three/drei`).
- **[Fix] Impact Resonance:** Corrected "Stable Core" stroke color in `ImpactResonance.tsx` to fully align with YInMn Blue identity (Green Purge Complete).
- **[Strategy] The Council:** Executed deep site audit (`site_audit_report_deep.md`) using 5-persona protocol; validated "Productization" strategy.
- **[Feature] Technical Header:** Implemented `ProjectSpecCard.astro`, a modular metadata card with "Mini Gauge" status indicator, replacing the legacy BOM list.
- **[Refactor] Terminal Silence:** Cleared verbose debug logging (`PHASE STATS DUMP`) from project templates for a cleaner dev experience.
- **[Pivot] YInMn Blue:** Officially migrated brand identity from "Neon Green" (`#10b981`) to "**YInMn Blue**" (`#2E5CFF`). Discovered by Mas Subramanian, representing stability and discovery.
- **[Feature] Design System:** Launched `/about/elements` as a live token inspection engine (The "Figma Inspector").
- **[Architecture] Hybrid Data Strategy:** Refactored `Colors.csv` to map legacy skill categories to the new strict Technical Palette (Blue/Cyan/Slate).
- **[3D] Nav Logo 2.0:** Integrated `model-viewer` with "Bobblehead" physics and Neutral/Commerce lighting environment.
- **[Pipeline]** Established "Pro UV Workflow" for Plasticity -> Blender -> Substance.
  - Validated "Ngons" export strategy.
  - Documented "Select Sharp Edges" automation in Blender.
  - Standardized Substance Import (OpenGL, No Auto-Unwrap).
- **[Materials]** Refined "Matte Forged Carbon" recipe with **Tri-planar Projection** to solve UV stretching artifacts.
- **[Feature] 3D Pipeline 2.0:** Integrated Adobe Substance 3D with "Harvesting Protocol" (Anti-Lock-In) and "Unlimited Asset" strategy.
- **[Design] Material Tokens:** Defined "Matte Forged Carbon" and "Titanium Ceramic" recipes in `STYLE_GUIDE.md`.
- **[Refactor] Identity Polish:** Scrubbed "ErikNorris" vanity branding from public documentation to align with "Erik Norris" identity.
- **[Architecture] D3 Migration:** Completely removed `recharts` dependency. Refactored all dashboard visualizations (`SkillRadar`, `PhaseDonut`) to lightweight, native D3.js implementations.
- **[Feature] Impact Resonance:** Implemented a new physics-based "System Velocity" gauge to replace the static placeholder in the Mini-Dashboard.
- **[Fix] Docs System:** Restored documentation builds by implementing a robust `import.meta.glob` loader for the sidebar, bypassing Content Collection instability.
- **[Fix] OpenGraph:** Resolved build failures caused by missing frontmatter in operational documents (`implementation_plan.md`).
- **[Refactor] Schema Hardening:** Loosened Zod validation for `phase_stats` to prevent "Ghost Data" issues where valid ingestion data was stripped by strict typing.
- **[Feature] The Data God Dashboard:** Transformed `/resume/dashboard` into a "747 Cockpit" or "Nerve Center" (`variant="mega"`).
  - **Tech:** `UnifiedDashboard.tsx`, Recharts Streamgraph, Tailwind Animation.
  - **Metrics:** Added "System Phase Distribution" (Real Data), "Tenure Timeline" (Gantt), and "Spec Ticker".
- **[Feature] The Multiverse:** Integrated a D3 Forces simulation into the dashboard footer to visualize career node interconnectedness (`MultiverseGraph`).
  - **Data Source:** `src/data/timeline/multiverse.json`.
- **[Fix] Artifact cleanup:** Removed stray markdown fences (` ``` `) from `FiberGrid.astro` which caused global rendering artifacts ("errant characters").
- **[Refactor] Dashboard Architecture:** Retired legacy "Dream Job" placeholder text in favor of zero-latency "Metric Rectifiers" (Total Parts, Active Streams).
- **[Feature] Video Pipeline:** Established `WORKFLOW_VIDEO.md` SOP and implemented `<YouTube />` "Zero-UI" components.
- **[Feature] The Pulse:** Implemented build-time tracking (`ingest_data.py` -> `build.json`) displayed in the global footer.
- **[Feature] Raw Mode:** Added `/raw/[slug]` endpoint and UI button to view raw markdown source, enforcing the "Datasheet" aesthetic.
- **[Audit] Gap Tightening:** Verified and standardized `gap-8` (reduced from `gap-12`) for higher information density in Project Layouts.
- **[Style] Grid System:** Refined global grid size from 50px to 40px (Tailwind scale) and tuned glassmorphism for better legibility.
- **[Fix] Asset Pipeline:** Hardened `ingest_data.py` to auto-correct local asset paths (`/assets/r2/`) to remote R2 URLs in manual content, enforcing the "Physical Asset Law".
- **[Fix] ModelViewer:** Restored "Neil Armstrong" resilience fallback for components missing a custom GLB.
- **[SEO] Metadata:** Optimized Homepage title ("High-Performance Mechanical Design") and meta description.
- **[Fix] Chart Layout:** Resolved regression where Skill/Part graphs were stacking vertically on desktop. Restored side-by-side grid layout (`grid-cols-1 md:grid-cols-2`) in `[...slug].astro`.
- **[Fix] Asset Staging:** Corrected `R2_STAGING` path resolution. Enforced `../ErikNorris-assets/R2_STAGING` as the single Source of Truth to prevent "Ghost Asset" confusion.
- **[Fix] Extension Mismatch:** Updated `dreamjob.mdx` to reference generated `.png` assets, resolving 404 errors caused by legacy `.jpg` references.
- **[Audit]** Established "The Council of Voices" Site Audit Protocol (`docs/prompts/SITE_AUDIT_PROMPT.md`).
- **[Audit]** Archived initial site benchmark: `docs/audits/2025-12-04_SITE_AUDIT.md`.
- **[UX]** Removed "Quick Filter" chips from the Project Directory to enforce interaction with the comprehensive Filter Menu (EN Logo).
- **[Branding]** Consolidated all branding assets to `public/assets/branding/`.
- **[UI]** Implemented theme-aware logo switching in Project Filter Menu.
- **[Refactor]** Updated `SiteLogo` and `ModelViewer` to use consolidated assets.
- **Colophon Repair:** Fixed a critical issue where the "Meta-Features" section was blank by implementing a `import.meta.glob` workaround to bypass a failing `getCollection` call.
- **Meta-Portfolio Expansion:** Added "Living Style Guide" to the Colophon and expanded existing entries (`ar-viewer`, `physical-spec`, `the-pulse`) with detailed "Narrative STAR" case studies.
- **Build Fix:** Resolved "Duplicate Identifier" crash in Living Style Guide (`index.mdx`) caused by conflict between manual imports and `astro-auto-import`.
- **Meta-Portfolio Migration:** Refactored Colophon features ("The Pulse", "AR-Ready Viewer", "The Physical Spec") from hardcoded HTML into a dedicated `colophon` Content Collection for easier maintenance and documentation.
- **Colophon Polish:** Switched Tech Stack Marquee to icon-only mode (`variant="logo-only"`).
- **SEO Upgrade:** Implemented `og:type="article"` for Project pages to improve social sharing.
- **Print Optimization:** Added `print.css` to hide navigation/footer for PDF exports, enforcing the "Datasheet" aesthetic.
- **Layout Standardization:** Enforced `pt-32` top padding across Home, Project List, and Project Detail pages for consistent vertical rhythm.
- **Project Detail Refactor:** Moved navigation controls (Prev/Next) from the sidebar to the header.
- **Robust Header Grid:** Implemented a 3-column CSS Grid (`1fr auto 1fr`) on the Project Detail page to prevent multi-line titles from overlapping centered navigation controls.
- **Negative Space Reduction:** Tightened vertical spacing on the Homepage (Hero 3D viewer) and Project Detail page (Title to Image gap).
- **Design Polish:** Updated Project Detail headers (H2) to match the "Active System" aesthetic (Primary Green + Pulsing LED indicator).
- **Build Fix:** Resolved Tailwind v4 scoping issues in Astro components by implementing the `@reference` directive in isolated style blocks.
- **Brand System:** Established `docs/STYLE_GUIDE.md` defining the "Hyper-Functional Brutalist" aesthetic.
- **Visible Grid:** Implemented global CSS grid pattern with Light/Dark mode support.
- **Build Stats:** Added runtime performance tracking to `ingest_data.py` and displayed it in the site footer.
- **Layering Fix:** Refactored `BaseLayout.astro` to remove conflicting body backgrounds, fixing grid visibility.
- **Ingestion Upgrade:** Added `Slug Name` column support to `Main.csv` (and all auxiliary CSVs) to decouple display names from filenames.
- **Stability Fix:** Resolved MDX compilation crashes caused by numeric slugs (e.g., `002-rack`) and unescaped HTML-like characters in markdown.
- **Project Strip Layout:** Unlocked full-width display on the homepage by removing container constraints.
- **Type Safety:** Fixed strict type errors in `ProjectDirectory` for `toolIcons` and `teamSize` using type assertions.
- **Trust Wall Repair:** Fixed logo fetching via domain mapping in `ingest_data.py`.
- **Type Safety Hardening:** Resolved strict TypeScript errors in core layouts and project pages.
- **Design Polish:** Implemented Matrix Boot Sequence, Swarm Spotlight, and Resume Navigation.
- **Elite Engineering Overhaul (Phases 16-20):**
  - **Brutalist Design:** Implemented `Inter` headers, transparent navigation, and a global radial grid background.
  - **Spec Sheet Modal:** Replaced simple modal with a technical split-view datasheet including navigation.
  - **Debug Mode:** Added global wireframe toggle for UI inspection.
  - **Directory Polish:** Added hover previews and deep linking from the Trust Wall.
- **Automated R2 Asset Sync:** Integrated `sync_r2.py` directly into the ingestion pipeline.
- **Site User Manual:** Added `/about/ifu` page documenting site maintenance.
- **Construction Badge:** Added environment-aware status indicator ("LOCAL DEV" / "UNDER CONSTRUCTION").
- **Documentation:** Restructured into `docs/` and migrated User Manual.
- **Asset Workflow Refactor:** Externalized `R2_STAGING` to sibling directory (`../ErikNorris-assets`).
- **Marquee Refactor:** Unified Homepage and Colophon marquees, fixed infinite loop and spacing issues.
- **Boot Sequence Refactor:** Converted from forced initial load effect to optional "Restart" action in footer.
- **Build Stability:** Resolved Keystatic and a11y dependency conflicts.
- **Footer Update:** Replaced Debug toggle with System Restart button.
- **Filter Menu Refinement:** Removed redundant "[ All ... ]" options, implemented hierarchical filtering, and added "Reset View" logic.

* [x] **Swarm Physics Tuning:** Replaced "Glycerin" feel with "Gravity Well". Dreamjob node now attracts cursor (Strength 5.0) and grows on proximity (45px -> 85px).
* [x] **Asset Sovereignty:** Codified "ErikNorris Laws" in Onboarding Prompt to prevent unauthorized asset generation.
* [x] **Dreamjob Restoration:** Restored canonical "Mechanical Arm" hero asset for Dreamjob project (fixed 404).
* [x] **Layout Polish:** Adjusted Swarm top margin (140px) for balanced vertical distribution.

### Dev Server Crashing (Memory Allocation / OOM)

- **Symptom:** `npm run dev` fails with "memory allocation of 64424509440 bytes failed" (64GB request).
- **Cause:** The `public/assets/projects` Junction points to `R2_STAGING`, which contains thousands of files. Astro's file watcher tries to index them all on startup.
- **Fix:** Ensure `astro.config.mjs` includes `server: { watch: { ignored: ["**/public/assets/projects/**"] } }`. DO NOT remove this exclusion.

* **Rendering Fix:** Resolved critical rendering issue (blank page) on Project Detail pages.
* **Context Lifecycle:** Created `docs/ONBOARDING_PROMPT.md` and `docs/CONVERSATION_MINER_PROMPT.md` to standardize AI session management.
* **Colophon Scout:** Updated `CONVERSATION_MINER_PROMPT` to actively identify "Meta-Features" for the Colophon.
* **Content Standardization:** Refactored manual content for `002-rack`, `kavo-dental-unit-1`, `kserver-5000`, and `xbox` using the Narrative STAR framework.
* **Content Scaffolding:** Implemented `--scaffold` flag in `ingest_data.py` to auto-generate markdown templates for missing project writeups.
* **Content Strategy:** Established `docs/CONTENT_STRATEGY.md` to formalize the Hybrid Content System.
* **Brand System Foundation:** Created `docs/BRANDING_PROMPT.md` to facilitate the future development of a comprehensive Design Language System (DLS) and Style Guide.
* **Typography Refinement:** Enforced `JetBrains Mono` for body text and `Inter` for headers on Project Detail pages to align with the "Datasheet" aesthetic.
* **Brutalist Styling:** Updated blockquote styling in markdown content (removed rounded corners, refined borders) for a more technical look.
* **Living Style Guide:** Reinstated `/about/elements` as a live visualization of the Design Language System (Typography, Colors, Components).
* **Image Workflow Upgrade:** Expanded `docs/IMAGE_WORKFLOW.md` with "Lightroom Power User" strategies (Smart Collections, Keyword Automation, Exposure Matching).
* **Colophon Feature:** Implemented "The Darkroom" (`src/content/colophon/darkroom.mdx`) to document the hybrid image pipeline.
* **Living Style Guide Upgrade:** Transformed `/about/elements` into a fully functional DLS showcase.
  - Implemented live "Kit" components: `Admonition`, `Chip`, `Wire`.
  - Added "Effects" section demonstrating `ScrambleText`.
  - Enforced DLS typography (Inter headers) in MDX content via `markdown-content.css`.
  - Restored missing list examples and fixed rendering issues.
* **Council of Voices Refinement & Layout Stabilization:**
  - **Content Rigor (The Recruiter):** Updated `backsplash.md` with specific engineering metrics (IP69K, 316 Stainless, 300% throughput) to satisfy technical personas.
  - **Visual Flair (The Arbiter):** Implemented `ScrambleText` effect on project headers for dynamic "glitch" aesthetic.
  - **Layout Stability:**
    - **Revert:** Rolled back experimental `gap-8` grid spacing to `gap-12` (original) to resolve layout collapse on `portion-cup` and `base`.
    - **Fix:** Resolved critical layout collapse in `[...slug].astro` caused by misplaced `<Content />` component and malformed JSX.

* **Deep HUD Injection:**
  - **Hook:** "Injecting fiction into the machine."
  - **Tech:** Astro Dynamic Routing, Props Injection.
  - **Description:** A mechanical way to distinguish "Deep" projects by injecting fictional or high-fidelity metrics directly into the page routing logic, allowing the UI to adapt without changing the underlying content schema.

## Meta-Portfolio (Colophon Features)

- **AR-Ready 3D Viewer:**
  - **Hook:** "Bringing hardware to your living room."
  - **Tech:** `<model-viewer>`, Google ARCore.
  - **Description:** A smart component that adapts lighting environments (Moon vs. Studio) based on the asset and supports "View in Room" AR on mobile devices.

- **The Physical Spec (Print Mode):**
  - **Hook:** "The Datasheet is physical."
  - **Tech:** CSS (`@media print`).
  - **Description:** Optimized print styles that strip the UI (Nav, Footer, Buttons) and output a clean, high-contrast specification document suitable for PDF export.

### Completed

- [x] **Hybrid Image Pipeline:** Full workflow (Lightroom -> Python -> R2).
  - [x] Animated WebP support with variable timing.
  - [x] Smart Letterboxing for mixed-aspect sequences.
  - [x] Gallery deduplication logic.
- [x] **Smart Bento Gallery:** Replaced Masonry with a CSS Grid that adapts to image aspect ratios (Tall/Wide spans).
- [x] **Animation Pipeline Repair:** Fixed distortion by implementing Letterboxing (`ImageOps.pad`) and EXIF Orientation support in `process_images.py`.

* [x] **Resume Expansion:** Implemented 7 distinct resume variants (Standard, KPI, Timeline, Interactive, 3D, One-Pager, Infographic).
* [x] **Data Pipeline Upgrade:** Created `export_data.py` to transform `Skills.csv` into `src/data/skills.json` for frontend visualization.
* [x] **KPI Dashboard:** Implemented "Career Velocity" and "Skill Matrix" charts using Recharts.
* [x] **Scroll Mechanism:** Added physics-based Rack and Pinion scroll effect.
* [x] **Build Hardening:** Enforced `core.ignorecase false` and refactored component paths to resolve Cloudflare build failures.
* [x] **[UX] Sticky Table of Contents:** Implemented for long-form case studies.
* [x] **[UX] Project List Filters:** Added quick-filter chips for main industries.
* [x] **[Content] Impact Summary:** Added schema support for high-level project results.
* [x] **[Visual] Hero Voltage:** Added "SYSTEM ONLINE" glitch effect to Home hero.
* [x] **[Meta] Testimonial Wall:** Integrated AI persona testimonials into the Colophon.
* **[Feature] Skill Streamgraph:** Upgraded standard Radar Charts to multi-layered Streamgraphs, visualizing "Project Identity" (Green) vs. "Global Career Average" (Ghosted Grey) for immediate skill context.
* **[Refactor] Data Resilience:** Renamed critical frontmatter fields to `snake_case` (`phase_stats`) to resolve persistent aggressive caching and YAML parsing conflicts in Astro's Content Layer.
* **[Refactor] Chart Stability:** Replaced volatile `ResponsiveContainer` logic with fixed-dimension layouts in `PhaseDonut` and `SkillRadar` to eliminate `width(-1)` layout thrashing errors.
* **[Bug] Phase Donut:** _Known Issue_ - The Phase Breakdown chart rendering is currently unstable despite verifying data presence. Scheduled for deep-dive debugging (Ref: "The Snake Case Strategy").

- [x] **Universal Ingestion Pipeline:** Automated conversion of Audio/Text -> Markdown using Gemini 2.5 Pro.

* **[Feature] D3 Skills Graph:** Added interactive force-directed graph for skill visualization.
* **[Feature] Homepage Parallax:** Added scroll-driven vertical parallax and "Scroll to Init" indicator to Hero.
* **[Refactor] Radial View:** Replaced static `hierarchy.json` with dynamic generation; fixed "Other" category grouping; added interaction (click-to-filter).
* **[Feature] Sitewide Scroll Physics:** Standardized "Flee", "Fade", and "Focus" effects across Home, About, and Projects.
* **[Feature] D3 Interaction:** Added "Jiggle" physics and size-pop on hover for Skills Graph.

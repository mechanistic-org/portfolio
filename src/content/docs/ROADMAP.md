---
title: "Roadmap"
slug: "roadmap"
sidebar:
  group: "System Manual"
  order: 3
---

    *   **Colophon:** Architecture breakdown and Tech Stack marquee.
    *   **Global:** Construction Badge (Status & Commit SHA).

- **Context Lifecycle:** Established **"Conversation Miner"** Protocol (`src/content/docs/CONVERSATION_MINER_PROMPT.md`) to capture architectural gold from LLM sessions.
- **Infrastructure:** Cloudflare R2 Asset Hosting with Staging/Production workflow.
- **Project Gallery:** Lightbox + Masonry layout for project images.
- **Marquee System:** Physics-based, auto-resuming, shared component for Trust Wall and Colophon.
- **Data Visualization:**
  - **Skill Fingerprint:** Static SVG Radar Chart.
  - **Part Breakdown:** Static SVG Donut Chart.
  - **Tech:** MDX, Astro, Tailwind v4.
  - **Description:** A live render of the Design Language System available at `/about/elements`.

- **Living Style Guide:**
  - **Hook:** The map is the territory.
  - **Tech:** MDX + Astro Components (`Admonition`, `Chip`, `Wire`).
  - **Description:** A live, render-accurate implementation of the Design Language System at `/about/elements`. It serves as both documentation and a visual regression test suite for the "Hyper-Functional Brutalist" aesthetic.

- **The Meta-Portfolio (Self-Documentation):**
  - **Hook:** The site documents its own features as if they were engineering projects.
  - **Tech:** Astro Content Collections (`src/content/colophon`), MDX.
  - **Description:** A dedicated content pipeline for documenting site features, allowing for rich text, code blocks, and future expansion without touching the page template.

- **Living Style Guide:**
  - **Hook:** The map is the territory.
  - **Tech:** MDX, Astro Components (`Admonition`, `Chip`, `Wire`).
  - **Description:** A live, render-accurate implementation of the Design Language System at `/about/elements`. It serves as both documentation and a visual regression test suite for the "Hyper-Functional Brutalist" aesthetic.

- **Templating System (The Engine):**
  - **Hook:** "Zero-friction authoring for complex brutalist layouts."
  - **Tech:** VS Code Snippets + Astro MDX Components.
  - **Description:** A "Plug-and-Play" authoring system that allows complex UI patterns (Zigzag Grids, 3D Viewers, Process Strips) to be inserted via shortcodes (`qq-*`). This transforms the IDE into a layout engine, ensuring every project page adheres to the strict "Visual Taxonomy" without manual coding.

- **Macroscopic Constellation Engine:**
  - **Hook:** Navigate the site as if it were a galaxy.
  - **Tech:** R3F, Post-processing (@react-three/bloom), GLSL (Custom Shaders).
  - **Description:** An interactive 3D navigator that maps site hierarchy into a celestial coordinate system. Features hierarchical bloom, macroscopic orbital physics, and recursive scaling for project-level deep dives.

## 📜 Change Log (Recent)

- **[2026-01-03] Stratospheric Recon & Viral Strategy**
  - **[Analysis] The Delta Scan:** Conducted a "60k Feet" audit comparing the Cold Vault (`\\morespace`) to the Workbench (`D:\portfolio`). Identified ~30 "Redacted Specimens" (Lytro, Apple, Avegant) that are effectively Air-Gapped.
  - **[Strategy] Viral Data:** Pivot validated. We will use D3.js to visualize the "Metadata Sonar" of 70,000 files, proving career contiguity despite local data loss (Ransomware).
  - **[Infrastructure] Ghost Pipeline:** Confirmed `eriknorris-workspace\R2_MASTER` is dead. `eriknorris-assets\R2_STAGING` is the confirmed Source of Truth.
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

- **Rendering Fix:** Resolved critical rendering issue (blank page) on Project Detail pages.
- **Context Lifecycle:** Created `docs/ONBOARDING_PROMPT.md` and `docs/CONVERSATION_MINER_PROMPT.md` to standardize AI session management.
- **Colophon Scout:** Updated `CONVERSATION_MINER_PROMPT` to actively identify "Meta-Features" for the Colophon.
- **Content Standardization:** Refactored manual content for `002-rack`, `kavo-dental-unit-1`, `kserver-5000`, and `xbox` using the Narrative STAR framework.
- **Content Scaffolding:** Implemented `--scaffold` flag in `ingest_data.py` to auto-generate markdown templates for missing project writeups.
- **Content Strategy:** Established `docs/CONTENT_STRATEGY.md` to formalize the Hybrid Content System.
- **Brand System Foundation:** Created `docs/BRANDING_PROMPT.md` to facilitate the future development of a comprehensive Design Language System (DLS) and Style Guide.
- **Typography Refinement:** Enforced `JetBrains Mono` for body text and `Inter` for headers on Project Detail pages to align with the "Datasheet" aesthetic.
- **Brutalist Styling:** Updated blockquote styling in markdown content (removed rounded corners, refined borders) for a more technical look.
- **Living Style Guide:** Reinstated `/about/elements` as a live visualization of the Design Language System (Typography, Colors, Components).
- **Image Workflow Upgrade:** Expanded `docs/IMAGE_WORKFLOW.md` with "Lightroom Power User" strategies (Smart Collections, Keyword Automation, Exposure Matching).
- **Colophon Feature:** Implemented "The Darkroom" (`src/content/colophon/darkroom.mdx`) to document the hybrid image pipeline.
- **Living Style Guide Upgrade:** Transformed `/about/elements` into a fully functional DLS showcase.
  - Implemented live "Kit" components: `Admonition`, `Chip`, `Wire`.
  - Added "Effects" section demonstrating `ScrambleText`.
  - Enforced DLS typography (Inter headers) in MDX content via `markdown-content.css`.
  - Restored missing list examples and fixed rendering issues.
- **Council of Voices Refinement & Layout Stabilization:**
  - **Content Rigor (The Recruiter):** Updated `backsplash.md` with specific engineering metrics (IP69K, 316 Stainless, 300% throughput) to satisfy technical personas.
  - **Visual Flair (The Arbiter):** Implemented `ScrambleText` effect on project headers for dynamic "glitch" aesthetic.
  - **Layout Stability:**
    - **Revert:** Rolled back experimental `gap-8` grid spacing to `gap-12` (original) to resolve layout collapse on `portion-cup` and `base`.
    - **Fix:** Resolved critical layout collapse in `[...slug].astro` caused by misplaced `<Content />` component and malformed JSX.

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

## Colophon / Meta-Portfolio

### The System Assembly (3D Stack)

- **Hook:** "Architecture you can touch."
- **Tech:** React Three Fiber, Framer Motion (Scroll), Glassmorphism.
- **Description:** A recursive visualization where the website renders _its own architecture_ as 3D server blades. As the user scrolls, the stack "assembles" from an exploded diagram into a cohesive unit, mirroring the "Intake -> Compression" narrative. Validates the "Glass requires Environment" rendering law.

### NorrOS (Hyperspace)

- **Hook:** A scroll-driven operating system for the portfolio, replacing navigation with "Realms".
- **Tech:** Astro, React, Framer Motion, Three.js (R3F).
- **Description:** A single-page application experience built on top of a static site generator. Uses sticky containers and manual scroll listeners to map vertical scroll progress to complex 3D and 2D animations (Zoom, Pan, Assemble).

### Narrative Scroll Engine (ScrollCoordinator)

- **Hook:** "Turns static layouts into cinematic, depth-aware stages."
- **Tech:** Astro, Vanilla JS, CSS Transforms.
- **Description:** A headless behavior engine that orchestrates the "entrance and exit" of UI actors based on scroll position, allowing "Technical Topography" (data layers) to emerge as "Marketing Fluff" (headers) recedes.

### Dynamic Radial Taxonomy

- **Hook:** Visualizing the career ecosystem without manual data curation.
- **Tech:** D3.js (Cluster Layout), React, Astro Content Collections.
- **Description:** Dynamically constructs a hierarchical taxonomy tree from flat project frontmatter, handling messy real-world data (e.g., falling back to Category when Industry is undefined) to generate a "Galaxy" view of professional history.

### Parallax Hero

- **Hook:** Depth without weight.
- **Tech:** Vanilla JS, CSS Variables (`--scroll-y`).
- **Description:** A performant scroll-driven parallax implementation that translates 3D model and text layers at different rates using CSS custom properties, avoiding heavy animation libraries for this specific touch.

### The Darkroom

- **Hook:** "Developing the future, one pixel at a time."
- **Tech:** Python, Pillow, Lanczos Resampling, Cloudflare R2.
- **Description:** A deep dive into the "Human Eye, Machine Hand" philosophy, featuring a live "Before & After" comparison of the `base` project. It documents how we shrank 15MB of GIFs down to 1.2MB of High-Res WebP using a custom automation engine.

- **Impact Resonance (The Third Gauge):**
  - **Hook:** "Visualizing the system's heartbeat."
  - **Tech:** D3.js (`d3-timer`, `d3-ease`), SVG.
  - **Description:** A custom visualization component that uses a stable core and orbiting particles to represent "System Velocity." It isn't just a number; it's a living SVG animation that pulses effectively at 60fps without React render-cycle overhead.

- **Smart Bento Gallery:**
  - **Hook:** "A grid that knows its content."
  - **Tech:** Python (PIL), Astro, CSS Grid.
  - **Description:** The ingestion engine analyzes every image's aspect ratio during the build, allowing the frontend to dynamically assign "Bento" spans (Tall/Wide) for a magazine-style layout without client-side JavaScript or layout shift.

- **Smart Gallery Engine:**
  - **Hook:** A gallery that reads your mind (and your markdown).
  - **Tech:** Python, Regex, Astro.
  - **Description:** The ingestion engine parses the narrative content to understand context. If an asset is used to tell the story inline, it gracefully steps aside from the grid gallery, ensuring a non-repetitive reading experience.

- **The Resume Matrix:**
  - **Hook:** "One career, seven perspectives."
  - **Tech:** React (Recharts), Astro, CSS Grid.
  - **Description:** A demonstration of how the same underlying data (`Skills.csv`) can be transformed into radically different user experiences, from a high-density datasheet to a playable terminal game.

- **The Meta-Testimonial Wall:**
  - **Hook:** "The site talks back."
  - **Tech:** React, Embla Carousel, JSON.
  - **Description:** A carousel of testimonials not from clients, but from the AI's internal modules (The Kernel, The Linter, The Architect) reflecting on the codebase and the collaboration.

- **The Visual Taxonomy (Dreamjob):**
  - **Hook:** "A Rosetta Stone for the System aesthetic."
  - **Tech:** AI Generation (Gemini), Manual Content Injection.
  - **Description:** The `dreamjob` project serves as the "Kitchen Sink" stress test. It maps every theoretical asset type (Product, Engineering, Abstract, Digital) to a concrete visual example, ensuring the pipeline can handle the full spectrum of engineering deliverables.

- **The Pulse (Build Timer):**
  - **Hook:** "The machine knows its own speed."
  - **Tech:** Python, JSON, Astro.
  - **Description:** The ingestion engine clocks its own performance during the build (e.g., "0.42s") and stamps it into `src/config/build.json`, which is statically imported and displayed in the footer as a live system metric.

- **The Skill Streamgraph:**
  - **Hook:** "Context is King."
  - **Tech:** Python (Pandas), React (Recharts).
  - **Description:** The ingestion engine doesn't just read data; it analyzes it. By calculating the global average of every skill across the entire portfolio, it generates a "Benchmark" layer for every project's radar chart. This allows viewers to instantly see if a project was a learning experience (below avg) or a mastery demonstration (above avg) relative to the engineer's baseline.

- **Raw Mode (The Source):**
  - **Hook:** "Trust, but verify."
  - **Tech:** Astro API Endpoints (`.ts`), Plain Text.
- **Data:** Added `Impact` field to `Main.csv` schema.
- **Colophon:** Integrated "Audit Personas" (The Hater, The Recruiter, The Data God) into the Testimonial Wall.
- **EN_Matte_Carbon_Manual (Smart Material):**
  - **Hook:** "Forged Carbon that actually follows the laws of physics."
  - **Tech:** Adobe Substance Painter (Anisotropy Channel + Tri-planar Crystal Noise).
  - **Description:** A procedural material stack that simulates chopped tow resin with holographic light response, moving beyond limited "Texture Wrap" presets.

- **The Archivist (Universal History):**
  - **Hook:** "Recovering 40 years of history from digital dust."
  - **Tech:** Python, Gemini 1.5 Flash (Chunked), D3.js (CSV Parsing).
  - **Description:** A custom ETL pipeline that digests legacy `.doc`/`.pdf` hoards, handles API rate limits via smart chunking, and synthesizes a "Universal Timeline" (`RESUME_CORPUS_timeline.md`) from 200MB of unorganized files, establishing a "Source of Truth" for the `history.astro` page.

### WiggleLogo3D

- **Hook:** A brand that breathes.
- **Tech:** React Three Fiber, GLTF, Framer Motion (wrapper).
- **Description:** An interactive 3D implementation of the "Erik Norris" logo using "Forged Carbon" shading and anisotropic lighting to simulate a living, breathing object.

### The Living Grid

- **Hook:** "A portfolio that sorts itself out."
- **Tech:** `framer-motion`, React State
- **Description:** An upgrade to the standard lightbox gallery that adds physics-based filtering and sorting animations, turning static image dumps into interactive data explorations.

### 3D Asset Lab (`test-logo.astro`)

- **Hook:** "An MRI machine for GLB files."
- **Tech:** `model-viewer` v3.4.0 API, Vanilla JS, Astro.
- **Description:** A runtime debugger that programmatically "kills" specific PBR texture channels (Normals, ORM, AO) and forces material overrides (Matte/Gloss/Metal) to isolate rendering artifacts without recompiling the asset.

### The Redacted Trinity

- **Hook:** "Three ways to say 'No Comment'."
- **Tech:** Astro Layouts, CSS Blending Modes, CRT Emulation.
- **Description:** An exploration in "Thematic UI" where a single content source (`classified.mdx`) can be rendered as a Cold War Terminal, a Physical Dossier, or a High-Tech Self-Destruct sequence depending on the active Theme Router key.

- **The Technical Header (Spec Card):**
  - **Hook:** "Turning the Portfolio into a Product Catalog."
  - **Tech:** Astro Props, Tailwind, CSS Animation.
  - **Description:** A modular "Head Unit" component that standardizes disparate project metadata (CSV source) into a unified "Spec Sheet" visual, replete with a live "System Status" pulse.

#### [2025-12-09] The "Anisotropy" Update

- **[3D] Express Lane:** Established direct GLB export pipeline from Substance Painter to Web, bypassing Blender-induced geometry corruption ("White Blob").
- **[3D] Anisotropy:** Validated `KHR_materials_anisotropy` workflow for "Holographic" Carbon Fiber using the `pbr-metal-roughness-anisotropy-angle` shader.
- **[Dev] Asset Forensics:** Built `test-logo.astro`, a hardware-accelerated diagnostic lab for inspecting PBR channels in the browser.
- **[FIX] 3D Pipeline:** Validated "Option B" (ErikNorris_ORM) as the primary workflow for Carbon materials. Direct export ("Option A") is deprecated for complex shaders due to Alpha channel bugs.

- **Documentation:** Restructured `docs/` into 4 distinct groups (System, Workflows, Reference, Prompts) for better discoverability.
- **Feature:** Implemented the **Universal Inbox** (`data_source/inbox/`) with a "Smart Filename" Schema (`slug.context.ext`) for zero-friction content ingestion.
- **Architecture:** Merged `CONTENT_INGESTION_WORKFLOW.md` into `CONTENT_STRATEGY.md`, establishing a single source of truth for all content pipelines.
- **Refactor:** Updated `ingest_inbox.py` to parse context tags (`technical`, `rant`, `social`) and guide the LLM's output persona.
- **UX:** Polished Sidebar Navigation (`SidebarNav.astro`) to strictly enforce the new logical grouping system.
- **Protocol:** Inducted **"The V.C."** (Thiel/Khosla persona) into the Council of Voices (`SITE_AUDIT_PROMPT.md`) to weaponize FOMO and challenge architectural scope.
- **Infrastructure:** Established **The Plasticity Pipeline** (`Plasticity` -> `Blender` -> `Substance`) as the standard workflow for high-fidelity 3D assets (`docs/SETUP_PLASTICITY_PIPELINE.md`).

#### [2025-12-07] The "Identity Core" Update

- **[Strategy] Branding Codex:** Drafted and ratified `BRANDING.md` defining the "Hyper-Functional Brutalism" identity, Snake Case naming, and Voice/Tone ("Transparency & Truth").
- **[Pipeline] Vector Truth:** Established `VECTOR_PIPELINE.md` differentiating between "Geometric Truth" (Blender Line Art -> SVG) and "Material Truth" (Substance -> PNG/GLB).
- **[Strategy] The Collector:** Refined `SUBSTANCE_MAXIMIZATION_PLAN.md` with a strict local library protocol (`00_Sources`, `02_Smart_Specials`) and "The Harvest" anti-lock-in strategy.
- **[Design] The Triad:** Defined the core material palette: "Matte Forged Carbon", "Titanium Ceramic", and "Weathered Steel".

#### [2025-12-06] The "Polish Arc"

- **[Polish] Branding Scrub:** Removed "Fortississimo" and "ErikNorris" vanity branding from `dreamjob.mdx` and system roadmaps to enforce "Erik Norris" identity.
- **[Feature] Pipeline Integration:** Integrated `SETUP_PLASTICITY_PIPELINE.md` into the global "System Manual" sidebar group.
- **[UI] Back Button Standardization:** Implemented `BackButton.astro` component to enforce consistent "Outline + Arrow" navigation across 404 and Colophon pages.
- **[Fix] Tinnitus Restoration:** Fixed broken external `noise.svg` dependency by baking a base64 Data URI directly into `global.css` (`.bg-noise`), restoring the signature "Hyper-Functional" grain overlay.
- **[UI] Hero Status Standard:**
  - **Change:** Replaced "System Online" (Green) with "Under Construction" (Amber).
  - **Component:** Created `<ConstructionGauge />` to preserve `<ImpactResonance />` for future use.
  - **Aesthetic:** Reduced animation speed (3000ms pulse) for a "calmer" holding pattern.

#### [2025-12-11] The "Identity Scrub" & Stability Arc

- **[Identity] The Exorcism:** Executed full "Identity Scrub".
  - Renamed Presets: `ErikNorris_ORM` -> `EN_ORM`.
  - Renamed Docs: `ErikNorris-darkroom.mdx` -> `darkroom.mdx`.
  - **Audit Result:** Confirmed zero remaining `ErikNorris-` CSS classes.
- **[Fix] Build Resilience:** Patched `SidebarNav.astro` and `[...slug].astro` to filter out legacy markdown files (missing frontmatter) that were causing `localeCompare` crashes.
- **[Feature] Social Presence:** Added dedicated "CV" icon (YinMn Blue) to the global navigation.
- **[Polish] Noise:** Increased noise overlay opacity to `0.05` for enhanced brutalist texture.

#### [In Progress] Operation Productize (The HardTech Productizer)

- **[Audit]** Inducted **"The HardTech Productizer"** (Vinod/Stanford/MechE persona) into `SITE_AUDIT_PROMPT.md`.
- **[Strategy]** Defined **"The Productization Engine"** model (`docs/PRODUCTIZATION_MODEL.md`).
- **[Refactor] Phase 1 (The Inputs):** Pivot Homepage to "System Status" (`HardTechHero`, `ImpactResonance`).
- **[Refactor] Phase 2 (The Factory):** Convert Project Index to "high-frequency" Datasheet View.
- **[Plan] Phase 3 (The Output):** Refactor Project Detail pages to "Spec Sheet" aesthetic (Dense headers, technical schematics).
  - **[Phase 1] Technical Header:** Verified prototype on `dreamjob`. Next: Roll out to all project templates.

- **[Fix] Radial View:** Resolved "Blank Screen" critical failure by identifying and restoring missing DOM container (`div#view-radial`) in `index.astro`.
- **[Refactor] Taxonomy Cleanup:** Eliminated "Other" `industry` category by remapping 20+ projects to "Pro Audio", "Robotics", and "Computing" via `fix_industries.py`.
- **[Refactor] Radial Branding:** Removed "ErikNorris" labels from Radial Taxonomy, replacing them with "Erik Norris".
- **[Safety] D3 Hardening:** Patched `RadialTaxonomy.tsx` to handle 0x0 container dimensions gracefully (preventing negative radius crashes).

## 🚀 The Horizon (V6)

- **[Vision] The Ouroboros (Constellation Engine):**
  - **Goal:** Dissolve linear "Realms" into a unified, non-linear graph navigation.
  - **Concept:** "The Page is the Map." Zoom-based navigation through the 3D Multiverse of projects and skills.
  - **Reference:** `docs/backlog/OUROBOROS_VISION.md`.
- **[Exploration] Operation Tactile Depth:**
  - **Goal:** Move beyond "Clean" to "Physical."
  - **Pillars:**
    - **Haptic Audio:** UI sounds (clicks, hums, snaps) that reinforce mechanical interaction.
    - **Weight:** Elements should drag, collide, and resist like physical objects.
    - **Grit:** Intentional use of high-ISO noise, scratches, and "Messy" layouts (Scatter) to break the digital veneer.
  - **Benchmark:** Teenage Engineering (Playful) vs. C24 (Forensic).

## 🧊 The Backlog (Icebox)

- **[Refactor] Operation Identity Shift:**
  - **Goal:** Rename repo (`ErikNorris` -> `eriknorris`) and local folders.
  - **Status:** Aborted (Dec 6, 2025). Too risky for current phase.
  - **Plan:** Requires "Nuclear Option" script + manual folder renaming. Saved for post-V1.0 stability.
- **[Strategy] Visual Log Integration:**
  - **Goal:** Integrate 128 mined screenshots into "Deep Dive" docs.
  - **Status:** Paused (Dec 2025).
  - **Document:** `docs/backlog/VISUAL_LOG_STRATEGY.md`.

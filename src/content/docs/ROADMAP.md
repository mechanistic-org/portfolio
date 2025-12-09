---
title: "Roadmap"
slug: "roadmap"
sidebar:
  group: "System Manual"
  order: 3
---
    *   **Colophon:** Architecture breakdown and Tech Stack marquee.
    *   **Global:** Construction Badge (Status & Commit SHA).
*   **Infrastructure:** Cloudflare R2 Asset Hosting with Staging/Production workflow.
*   **Project Gallery:** Lightbox + Masonry layout for project images.
*   **Marquee System:** Physics-based, auto-resuming, shared component for Trust Wall and Colophon.
*   **Data Visualization:**
    *   **Skill Fingerprint:** Static SVG Radar Chart.
    *   **Part Breakdown:** Static SVG Donut Chart.
    *   **Tech:** MDX, Astro, Tailwind v4.
    *   **Description:** A live render of the Design Language System available at `/about/elements`.

*   **Living Style Guide:**
    *   **Hook:** The map is the territory.
    *   **Tech:** MDX + Astro Components (`Admonition`, `Chip`, `Wire`).
    *   **Description:** A live, render-accurate implementation of the Design Language System at `/about/elements`. It serves as both documentation and a visual regression test suite for the "Hyper-Functional Brutalist" aesthetic.

*   **The Meta-Portfolio (Self-Documentation):**
    *   **Hook:** The site documents its own features as if they were engineering projects.
    *   **Tech:** Astro Content Collections (`src/content/colophon`), MDX.
    *   **Description:** A dedicated content pipeline for documenting site features, allowing for rich text, code blocks, and future expansion without touching the page template.

*   **Living Style Guide:**
    *   **Hook:** The map is the territory.
    *   **Tech:** MDX, Astro Components (`Admonition`, `Chip`, `Wire`).
    *   **Description:** A live, render-accurate implementation of the Design Language System at `/about/elements`. It serves as both documentation and a visual regression test suite for the "Hyper-Functional Brutalist" aesthetic.

*   **Templating System (The Engine):**
    *   **Hook:** "Zero-friction authoring for complex brutalist layouts."
    *   **Tech:** VS Code Snippets + Astro MDX Components.
    *   **Description:** A "Plug-and-Play" authoring system that allows complex UI patterns (Zigzag Grids, 3D Viewers, Process Strips) to be inserted via shortcodes (`qq-*`). This transforms the IDE into a layout engine, ensuring every project page adheres to the strict "Visual Taxonomy" without manual coding.

## ðŸ“œ Change Log (Recent)
*   **[Pipeline]** Established "Pro UV Workflow" for Plasticity -> Blender -> Substance.
    *   Validated "Ngons" export strategy.
    *   Documented "Select Sharp Edges" automation in Blender.
    *   Standardized Substance Import (OpenGL, No Auto-Unwrap).
*   **[Materials]** Refined "Matte Forged Carbon" recipe with **Tri-planar Projection** to solve UV stretching artifacts.
*   **[Feature] 3D Pipeline 2.0:** Integrated Adobe Substance 3D with "Harvesting Protocol" (Anti-Lock-In) and "Unlimited Asset" strategy.
*   **[Design] Material Tokens:** Defined "Matte Forged Carbon" and "Titanium Ceramic" recipes in `STYLE_GUIDE.md`.
*   **[Refactor] Identity Polish:** Scrubbed "Quantum" vanity branding from public documentation to align with "Erik Norris" identity.
*   **[Architecture] D3 Migration:** Completely removed `recharts` dependency. Refactored all dashboard visualizations (`SkillRadar`, `PhaseDonut`) to lightweight, native D3.js implementations.
*   **[Feature] Impact Resonance:** Implemented a new physics-based "System Velocity" gauge to replace the static placeholder in the Mini-Dashboard.
*   **[Fix] Docs System:** Restored documentation builds by implementing a robust `import.meta.glob` loader for the sidebar, bypassing Content Collection instability.
*   **[Fix] OpenGraph:** Resolved build failures caused by missing frontmatter in operational documents (`implementation_plan.md`).
*   **[Refactor] Schema Hardening:** Loosened Zod validation for `phase_stats` to prevent "Ghost Data" issues where valid ingestion data was stripped by strict typing.
*   **[Feature] The Data God Dashboard:** Transformed `/resume/dashboard` into a "747 Cockpit" or "Nerve Center" (`variant="mega"`).
    *   **Tech:** `UnifiedDashboard.tsx`, Recharts Streamgraph, Tailwind Animation.
    *   **Metrics:** Added "System Phase Distribution" (Real Data), "Tenure Timeline" (Gantt), and "Spec Ticker".
*   **[Feature] The Multiverse:** Integrated a D3 Forces simulation into the dashboard footer to visualize career node interconnectedness (`MultiverseGraph`).
    *   **Data Source:** `src/data/timeline/multiverse.json`.
*   **[Fix] Artifact cleanup:** Removed stray markdown fences (` ``` `) from `FiberGrid.astro` which caused global rendering artifacts ("errant characters").
*   **[Refactor] Dashboard Architecture:** Retired legacy "Dream Job" placeholder text in favor of zero-latency "Metric Rectifiers" (Total Parts, Active Streams).
*   **[Feature] Video Pipeline:** Established `WORKFLOW_VIDEO.md` SOP and implemented `<YouTube />` "Zero-UI" components.
*   **[Feature] The Pulse:** Implemented build-time tracking (`ingest_data.py` -> `build.json`) displayed in the global footer.
*   **[Feature] Raw Mode:** Added `/raw/[slug]` endpoint and UI button to view raw markdown source, enforcing the "Datasheet" aesthetic.
*   **[Audit] Gap Tightening:** Verified and standardized `gap-8` (reduced from `gap-12`) for higher information density in Project Layouts.
*   **[Style] Grid System:** Refined global grid size from 50px to 40px (Tailwind scale) and tuned glassmorphism for better legibility.
*   **[Fix] Asset Pipeline:** Hardened `ingest_data.py` to auto-correct local asset paths (`/assets/r2/`) to remote R2 URLs in manual content, enforcing the "Physical Asset Law".
*   **[Fix] ModelViewer:** Restored "Neil Armstrong" resilience fallback for components missing a custom GLB.
*   **[SEO] Metadata:** Optimized Homepage title ("High-Performance Mechanical Design") and meta description.
*   **[Fix] Chart Layout:** Resolved regression where Skill/Part graphs were stacking vertically on desktop. Restored side-by-side grid layout (`grid-cols-1 md:grid-cols-2`) in `[...slug].astro`.
*   **[Fix] Asset Staging:** Corrected `R2_STAGING` path resolution. Enforced `../quantum-assets/R2_STAGING` as the single Source of Truth to prevent "Ghost Asset" confusion.
*   **[Fix] Extension Mismatch:** Updated `dreamjob.mdx` to reference generated `.png` assets, resolving 404 errors caused by legacy `.jpg` references.
*   **[Audit]** Established "The Council of Voices" Site Audit Protocol (`docs/prompts/SITE_AUDIT_PROMPT.md`).
*   **[Audit]** Archived initial site benchmark: `docs/audits/2025-12-04_SITE_AUDIT.md`.
*   **[UX]** Removed "Quick Filter" chips from the Project Directory to enforce interaction with the comprehensive Filter Menu (EN Logo).
*   **[Branding]** Consolidated all branding assets to `public/assets/branding/`.
*   **[UI]** Implemented theme-aware logo switching in Project Filter Menu.
*   **[Refactor]** Updated `SiteLogo` and `ModelViewer` to use consolidated assets.
*   **Colophon Repair:** Fixed a critical issue where the "Meta-Features" section was blank by implementing a `import.meta.glob` workaround to bypass a failing `getCollection` call.
*   **Meta-Portfolio Expansion:** Added "Living Style Guide" to the Colophon and expanded existing entries (`ar-viewer`, `physical-spec`, `the-pulse`) with detailed "Narrative STAR" case studies.
*   **Build Fix:** Resolved "Duplicate Identifier" crash in Living Style Guide (`index.mdx`) caused by conflict between manual imports and `astro-auto-import`.
*   **Meta-Portfolio Migration:** Refactored Colophon features ("The Pulse", "AR-Ready Viewer", "The Physical Spec") from hardcoded HTML into a dedicated `colophon` Content Collection for easier maintenance and documentation.
*   **Colophon Polish:** Switched Tech Stack Marquee to icon-only mode (`variant="logo-only"`).
*   **SEO Upgrade:** Implemented `og:type="article"` for Project pages to improve social sharing.
*   **Print Optimization:** Added `print.css` to hide navigation/footer for PDF exports, enforcing the "Datasheet" aesthetic.
*   **Layout Standardization:** Enforced `pt-32` top padding across Home, Project List, and Project Detail pages for consistent vertical rhythm.
*   **Project Detail Refactor:** Moved navigation controls (Prev/Next) from the sidebar to the header.
*   **Robust Header Grid:** Implemented a 3-column CSS Grid (`1fr auto 1fr`) on the Project Detail page to prevent multi-line titles from overlapping centered navigation controls.
*   **Negative Space Reduction:** Tightened vertical spacing on the Homepage (Hero 3D viewer) and Project Detail page (Title to Image gap).
*   **Design Polish:** Updated Project Detail headers (H2) to match the "Active System" aesthetic (Primary Green + Pulsing LED indicator).
*   **Build Fix:** Resolved Tailwind v4 scoping issues in Astro components by implementing the `@reference` directive in isolated style blocks.
*   **Brand System:** Established `docs/STYLE_GUIDE.md` defining the "Hyper-Functional Brutalist" aesthetic.
*   **Visible Grid:** Implemented global CSS grid pattern with Light/Dark mode support.
*   **Build Stats:** Added runtime performance tracking to `ingest_data.py` and displayed it in the site footer.
*   **Layering Fix:** Refactored `BaseLayout.astro` to remove conflicting body backgrounds, fixing grid visibility.
*   **Ingestion Upgrade:** Added `Slug Name` column support to `Main.csv` (and all auxiliary CSVs) to decouple display names from filenames.
*   **Stability Fix:** Resolved MDX compilation crashes caused by numeric slugs (e.g., `002-rack`) and unescaped HTML-like characters in markdown.
*   **Project Strip Layout:** Unlocked full-width display on the homepage by removing container constraints.
*   **Type Safety:** Fixed strict type errors in `ProjectDirectory` for `toolIcons` and `teamSize` using type assertions.
*   **Trust Wall Repair:** Fixed logo fetching via domain mapping in `ingest_data.py`.
*   **Type Safety Hardening:** Resolved strict TypeScript errors in core layouts and project pages.
*   **Design Polish:** Implemented Matrix Boot Sequence, Swarm Spotlight, and Resume Navigation.
*   **Elite Engineering Overhaul (Phases 16-20):**
    *   **Brutalist Design:** Implemented `Inter` headers, transparent navigation, and a global radial grid background.
    *   **Spec Sheet Modal:** Replaced simple modal with a technical split-view datasheet including navigation.
    *   **Debug Mode:** Added global wireframe toggle for UI inspection.
    *   **Directory Polish:** Added hover previews and deep linking from the Trust Wall.
*   **Automated R2 Asset Sync:** Integrated `sync_r2.py` directly into the ingestion pipeline.
*   **Site User Manual:** Added `/about/ifu` page documenting site maintenance.
*   **Construction Badge:** Added environment-aware status indicator ("LOCAL DEV" / "UNDER CONSTRUCTION").
*   **Documentation:** Restructured into `docs/` and migrated User Manual.
*   **Asset Workflow Refactor:** Externalized `R2_STAGING` to sibling directory (`../quantum-assets`).
*   **Marquee Refactor:** Unified Homepage and Colophon marquees, fixed infinite loop and spacing issues.
*   **Boot Sequence Refactor:** Converted from forced initial load effect to optional "Restart" action in footer.
*   **Build Stability:** Resolved Keystatic and a11y dependency conflicts.
*   **Footer Update:** Replaced Debug toggle with System Restart button.
*   **Filter Menu Refinement:** Removed redundant "[ All ... ]" options, implemented hierarchical filtering, and added "Reset View" logic.
*   **Project List UX:** Removed "Link" column and enabled whole-row clickability.
*   **Stability:** Fixed `ingest_data.py` corruption and 404 errors for missing assets.
*   **Rendering Fix:** Resolved critical rendering issue (blank page) on Project Detail pages.
*   **Context Lifecycle:** Created `docs/ONBOARDING_PROMPT.md` and `docs/CONVERSATION_MINER_PROMPT.md` to standardize AI session management.
*   **Colophon Scout:** Updated `CONVERSATION_MINER_PROMPT` to actively identify "Meta-Features" for the Colophon.
*   **Content Standardization:** Refactored manual content for `002-rack`, `kavo-dental-unit-1`, `kserver-5000`, and `xbox` using the Narrative STAR framework.
*   **Content Scaffolding:** Implemented `--scaffold` flag in `ingest_data.py` to auto-generate markdown templates for missing project writeups.
*   **Content Strategy:** Established `docs/CONTENT_STRATEGY.md` to formalize the Hybrid Content System.
*   **Brand System Foundation:** Created `docs/BRANDING_PROMPT.md` to facilitate the future development of a comprehensive Design Language System (DLS) and Style Guide.
*   **Typography Refinement:** Enforced `JetBrains Mono` for body text and `Inter` for headers on Project Detail pages to align with the "Datasheet" aesthetic.
*   **Brutalist Styling:** Updated blockquote styling in markdown content (removed rounded corners, refined borders) for a more technical look.
*   **Living Style Guide:** Reinstated `/about/elements` as a live visualization of the Design Language System (Typography, Colors, Components).
*   **Image Workflow Upgrade:** Expanded `docs/IMAGE_WORKFLOW.md` with "Lightroom Power User" strategies (Smart Collections, Keyword Automation, Exposure Matching).
*   **Colophon Feature:** Implemented "The Quantum Darkroom" (`src/content/colophon/quantum-darkroom.mdx`) to document the hybrid image pipeline.
*   **Living Style Guide Upgrade:** Transformed `/about/elements` into a fully functional DLS showcase.
    *   Implemented live "Kit" components: `Admonition`, `Chip`, `Wire`.
    *   Added "Effects" section demonstrating `ScrambleText`.
    *   Enforced DLS typography (Inter headers) in MDX content via `markdown-content.css`.
    *   Restored missing list examples and fixed rendering issues.
*   **Council of Voices Refinement & Layout Stabilization:**
    *   **Content Rigor (The Recruiter):** Updated `backsplash.md` with specific engineering metrics (IP69K, 316 Stainless, 300% throughput) to satisfy technical personas.
    *   **Visual Flair (The Arbiter):** Implemented `ScrambleText` effect on project headers for dynamic "glitch" aesthetic.
    *   **Layout Stability:**
        *   **Revert:** Rolled back experimental `gap-8` grid spacing to `gap-12` (original) to resolve layout collapse on `portion-cup` and `base`.
        *   **Fix:** Resolved critical layout collapse in `[...slug].astro` caused by misplaced `<Content />` component and malformed JSX.

## Meta-Portfolio (Colophon Features)
*   **AR-Ready 3D Viewer:**
    *   **Hook:** "Bringing hardware to your living room."
    *   **Tech:** `<model-viewer>`, Google ARCore.
    *   **Description:** A smart component that adapts lighting environments (Moon vs. Studio) based on the asset and supports "View in Room" AR on mobile devices.

*   **The Physical Spec (Print Mode):**
    *   **Hook:** "The Datasheet is physical."
    *   **Tech:** CSS (`@media print`).
    *   **Description:** Optimized print styles that strip the UI (Nav, Footer, Buttons) and output a clean, high-contrast specification document suitable for PDF export.
### Completed
- [x] **Hybrid Image Pipeline:** Full workflow (Lightroom -> Python -> R2).
    - [x] Animated WebP support with variable timing.
    - [x] Smart Letterboxing for mixed-aspect sequences.
    - [x] Gallery deduplication logic.
- [x] **Smart Bento Gallery:** Replaced Masonry with a CSS Grid that adapts to image aspect ratios (Tall/Wide spans).
- [x] **Animation Pipeline Repair:** Fixed distortion by implementing Letterboxing (`ImageOps.pad`) and EXIF Orientation support in `process_images.py`.
*   [x] **Resume Expansion:** Implemented 7 distinct resume variants (Standard, KPI, Timeline, Interactive, 3D, One-Pager, Infographic).
*   [x] **Data Pipeline Upgrade:** Created `export_data.py` to transform `Skills.csv` into `src/data/skills.json` for frontend visualization.
*   [x] **KPI Dashboard:** Implemented "Career Velocity" and "Skill Matrix" charts using Recharts.
*   [x] **Scroll Mechanism:** Added physics-based Rack and Pinion scroll effect.
*   [x] **Build Hardening:** Enforced `core.ignorecase false` and refactored component paths to resolve Cloudflare build failures.
*   [x] **[UX] Sticky Table of Contents:** Implemented for long-form case studies.
*   [x] **[UX] Project List Filters:** Added quick-filter chips for main industries.
*   [x] **[Content] Impact Summary:** Added schema support for high-level project results.
*   [x] **[Visual] Hero Voltage:** Added "SYSTEM ONLINE" glitch effect to Home hero.
*   [x] **[Meta] Testimonial Wall:** Integrated AI persona testimonials into the Colophon.
*   **[Feature] Skill Streamgraph:** Upgraded standard Radar Charts to multi-layered Streamgraphs, visualizing "Project Identity" (Green) vs. "Global Career Average" (Ghosted Grey) for immediate skill context.
*   **[Refactor] Data Resilience:** Renamed critical frontmatter fields to `snake_case` (`phase_stats`) to resolve persistent aggressive caching and YAML parsing conflicts in Astro's Content Layer.
*   **[Refactor] Chart Stability:** Replaced volatile `ResponsiveContainer` logic with fixed-dimension layouts in `PhaseDonut` and `SkillRadar` to eliminate `width(-1)` layout thrashing errors.
*   **[Bug] Phase Donut:** *Known Issue* - The Phase Breakdown chart rendering is currently unstable despite verifying data presence. Scheduled for deep-dive debugging (Ref: "The Snake Case Strategy").
- [x] **Universal Ingestion Pipeline:** Automated conversion of Audio/Text -> Markdown using Gemini 2.5 Pro.

*   **[Feature] D3 Skills Graph:** Added interactive force-directed graph for skill visualization.
*   **[Feature] Homepage Parallax:** Added scroll-driven vertical parallax and "Scroll to Init" indicator to Hero.
*   **[Refactor] Radial View:** Replaced static `hierarchy.json` with dynamic generation; fixed "Other" category grouping; added interaction (click-to-filter).
*   **[Feature] Sitewide Scroll Physics:** Standardized "Flee", "Fade", and "Focus" effects across Home, About, and Projects.
*   **[Feature] D3 Interaction:** Added "Jiggle" physics and size-pop on hover for Skills Graph.

## Colophon / Meta-Portfolio
### Narrative Scroll Engine (ScrollCoordinator)
*   **Hook:** "Turns static layouts into cinematic, depth-aware stages."
*   **Tech:** Astro, Vanilla JS, CSS Transforms.
*   **Description:** A headless behavior engine that orchestrates the "entrance and exit" of UI actors based on scroll position, allowing "Technical Topography" (data layers) to emerge as "Marketing Fluff" (headers) recedes.

### Dynamic Radial Taxonomy
*   **Hook:** Visualizing the career ecosystem without manual data curation.
*   **Tech:** D3.js (Cluster Layout), React, Astro Content Collections.
*   **Description:** Dynamically constructs a hierarchical taxonomy tree from flat project frontmatter, handling messy real-world data (e.g., falling back to Category when Industry is undefined) to generate a "Galaxy" view of professional history.

### Parallax Hero
*   **Hook:** Depth without weight.
*   **Tech:** Vanilla JS, CSS Variables (`--scroll-y`).
*   **Description:** A performant scroll-driven parallax implementation that translates 3D model and text layers at different rates using CSS custom properties, avoiding heavy animation libraries for this specific touch.
### The Darkroom
*   **Hook:** "Developing the future, one pixel at a time."
*   **Tech:** Python, Pillow, Lanczos Resampling, Cloudflare R2.
*   **Description:** A deep dive into the "Human Eye, Machine Hand" philosophy, featuring a live "Before & After" comparison of the `base` project. It documents how we shrank 15MB of GIFs down to 1.2MB of High-Res WebP using a custom automation engine.

*   **Impact Resonance (The Third Gauge):**
    *   **Hook:** "Visualizing the system's heartbeat."
    *   **Tech:** D3.js (`d3-timer`, `d3-ease`), SVG.
    *   **Description:** A custom visualization component that uses a stable core and orbiting particles to represent "System Velocity." It isn't just a number; it's a living SVG animation that pulses effectively at 60fps without React render-cycle overhead.

*   **Smart Bento Gallery:**
    *   **Hook:** "A grid that knows its content."
    *   **Tech:** Python (PIL), Astro, CSS Grid.
    *   **Description:** The ingestion engine analyzes every image's aspect ratio during the build, allowing the frontend to dynamically assign "Bento" spans (Tall/Wide) for a magazine-style layout without client-side JavaScript or layout shift.

*   **Smart Gallery Engine:**
    *   **Hook:** A gallery that reads your mind (and your markdown).
    *   **Tech:** Python, Regex, Astro.
    *   **Description:** The ingestion engine parses the narrative content to understand context. If an asset is used to tell the story inline, it gracefully steps aside from the grid gallery, ensuring a non-repetitive reading experience.

*   **The Resume Matrix:**
    *   **Hook:** "One career, seven perspectives."
    *   **Tech:** React (Recharts), Astro, CSS Grid.
    *   **Description:** A demonstration of how the same underlying data (`Skills.csv`) can be transformed into radically different user experiences, from a high-density datasheet to a playable terminal game.

*   **The Meta-Testimonial Wall:**
    *   **Hook:** "The site talks back."
    *   **Tech:** React, Embla Carousel, JSON.
    *   **Description:** A carousel of testimonials not from clients, but from the AI's internal modules (The Kernel, The Linter, The Architect) reflecting on the codebase and the collaboration.

*   **The Visual Taxonomy (Dreamjob):**
    *   **Hook:** "A Rosetta Stone for the System aesthetic."
    *   **Tech:** AI Generation (Gemini), Manual Content Injection.
    *   **Description:** The `dreamjob` project serves as the "Kitchen Sink" stress test. It maps every theoretical asset type (Product, Engineering, Abstract, Digital) to a concrete visual example, ensuring the pipeline can handle the full spectrum of engineering deliverables.

*   **The Pulse (Build Timer):**
    *   **Hook:** "The machine knows its own speed."
    *   **Tech:** Python, JSON, Astro.
    *   **Description:** The ingestion engine clocks its own performance during the build (e.g., "0.42s") and stamps it into `src/config/build.json`, which is statically imported and displayed in the footer as a live system metric.

*   **The Skill Streamgraph:**
    *   **Hook:** "Context is King."
    *   **Tech:** Python (Pandas), React (Recharts).
    *   **Description:** The ingestion engine doesn't just read data; it analyzes it. By calculating the global average of every skill across the entire portfolio, it generates a "Benchmark" layer for every project's radar chart. This allows viewers to instantly see if a project was a learning experience (below avg) or a mastery demonstration (above avg) relative to the engineer's baseline.

*   **Raw Mode (The Source):**
    *   **Hook:** "Trust, but verify."
    *   **Tech:** Astro API Endpoints (`.ts`), Plain Text.
*   **Data:** Added `Impact` field to `Main.csv` schema.
*   **Colophon:** Integrated "Audit Personas" (The Hater, The Recruiter, The Data God) into the Testimonial Wall.
*   **EN_Matte_Carbon_Manual (Smart Material):**
    *   **Hook:** "Forged Carbon that actually follows the laws of physics."
    *   **Tech:** Adobe Substance Painter (Anisotropy Channel + Tri-planar Crystal Noise).
    *   **Description:** A procedural material stack that simulates chopped tow resin with holographic light response, moving beyond limited "Texture Wrap" presets.

### 3D Asset Lab (`/about/test-logo`)
*   **Hook:** A focused "Clean Room" for debugging web-based 3D assets.
*   **Purpose:** Isolates the model from site CSS/Layout to debug Lighting, Textures, and Orientation.
*   **Status:** Active Tool. (Use `?v=` timestamp to bust cache).
#### [2025-12-06] The "Unification" Update
*   **Documentation:** Restructured `docs/` into 4 distinct groups (System, Workflows, Reference, Prompts) for better discoverability.
*   **Feature:** Implemented the **Universal Inbox** (`data_source/inbox/`) with a "Smart Filename" Schema (`slug.context.ext`) for zero-friction content ingestion.
*   **Architecture:** Merged `CONTENT_INGESTION_WORKFLOW.md` into `CONTENT_STRATEGY.md`, establishing a single source of truth for all content pipelines.
*   **Refactor:** Updated `ingest_inbox.py` to parse context tags (`technical`, `rant`, `social`) and guide the LLM's output persona.
*   **UX:** Polished Sidebar Navigation (`SidebarNav.astro`) to strictly enforce the new logical grouping system.
*   **Protocol:** Inducted **"The V.C."** (Thiel/Khosla persona) into the Council of Voices (`SITE_AUDIT_PROMPT.md`) to weaponize FOMO and challenge architectural scope.
*   **Infrastructure:** Established **The Plasticity Pipeline** (`Plasticity` -> `Blender` -> `Substance`) as the standard workflow for high-fidelity 3D assets (`docs/SETUP_PLASTICITY_PIPELINE.md`).

#### [2025-12-07] The "Identity Core" Update
*   **[Strategy] Branding Codex:** Drafted and ratified `BRANDING.md` defining the "Hyper-Functional Brutalism" identity, Snake Case naming, and Voice/Tone ("Transparency & Truth").
*   **[Pipeline] Vector Truth:** Established `VECTOR_PIPELINE.md` differentiating between "Geometric Truth" (Blender Line Art -> SVG) and "Material Truth" (Substance -> PNG/GLB).
*   **[Strategy] The Collector:** Refined `SUBSTANCE_MAXIMIZATION_PLAN.md` with a strict local library protocol (`00_Sources`, `02_Smart_Specials`) and "The Harvest" anti-lock-in strategy.
*   **[Design] The Triad:** Defined the core material palette: "Matte Forged Carbon", "Titanium Ceramic", and "Weathered Steel".

#### [2025-12-06] The "Polish Arc"
*   **[Polish] Branding Scrub:** Removed "Fortississimo" and "Quantum" vanity branding from `dreamjob.mdx` and system roadmaps to enforce "Erik Norris" identity.
*   **[Feature] Pipeline Integration:** Integrated `SETUP_PLASTICITY_PIPELINE.md` into the global "System Manual" sidebar group.
*   **[UI] Back Button Standardization:** Implemented `BackButton.astro` component to enforce consistent "Outline + Arrow" navigation across 404 and Colophon pages.
*   **[Fix] Tinnitus Restoration:** Fixed broken external `noise.svg` dependency by baking a base64 Data URI directly into `global.css` (`.bg-noise`), restoring the signature "Hyper-Functional" grain overlay.
*   **[UI] Hero Status Standard:**
    *   **Change:** Replaced "System Online" (Green) with "Under Construction" (Amber).
    *   **Component:** Created `<ConstructionGauge />` to preserve `<ImpactResonance />` for future use.
    *   **Aesthetic:** Reduced animation speed (3000ms pulse) for a "calmer" holding pattern.


#### [In Progress] Operation Productize (The HardTech Productizer)
*   **[Audit]** Inducted **"The HardTech Productizer"** (Vinod/Stanford/MechE persona) into `SITE_AUDIT_PROMPT.md`.
*   **[Strategy]** Defined **"The Productization Engine"** model (`docs/PRODUCTIZATION_MODEL.md`).
*   **[Refactor] Phase 1 (The Inputs):** Pivot Homepage to "System Status" (`HardTechHero`, `ImpactResonance`).
*   **[Refactor] Phase 2 (The Factory):** Convert Project Index to "high-frequency" Datasheet View.
*   **[Plan] Phase 3 (The Output):** Refactor Project Detail pages to "Spec Sheet" aesthetic (Dense headers, technical schematics).

*   **[Fix] Radial View:** Resolved "Blank Screen" critical failure by identifying and restoring missing DOM container (`div#view-radial`) in `index.astro`.
*   **[Refactor] Taxonomy Cleanup:** Eliminated "Other" `industry` category by remapping 20+ projects to "Pro Audio", "Robotics", and "Computing" via `fix_industries.py`.
*   **[Refactor] Radial Branding:** Removed "Quantum" labels from Radial Taxonomy, replacing them with "Erik Norris".
*   **[Safety] D3 Hardening:** Patched `RadialTaxonomy.tsx` to handle 0x0 container dimensions gracefully (preventing negative radius crashes).

## 🧊 The Backlog (Icebox)
*   **[Refactor] Operation Identity Shift:**
    *   **Goal:** Rename repo (`quantum` -> `eriknorris`) and local folders.
    *   **Status:** Aborted (Dec 6, 2025). Too risky for current phase.
    *   **Plan:** Requires "Nuclear Option" script + manual folder renaming. Saved for post-V1.0 stability.

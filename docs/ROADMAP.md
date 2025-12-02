# Roadmap & Status

## ✅ Systems Operational
*   **Pipeline:** `ingest_data.py` with Smart Header Hunting.
*   **Visuals:**
    *   **Homepage:** 3D Hero, Trust Wall (CSS Marquee), Featured Projects.
    *   **Project Directory:** Interactive table with filtering, sorting, and hover previews.
    *   **Project Page:** Center-stage Radar Chart, Hardware Dashboard, Gallery Grid, Spec Sheet Modal.
    *   **About:** Technical Datasheet + Git-Style Career Log + User Manual (IFU).
    *   **Colophon:** Architecture breakdown and Tech Stack marquee.
    *   **Global:** Construction Badge (Status & Commit SHA).
*   **Infrastructure:** Cloudflare R2 Asset Hosting with Staging/Production workflow.
*   **Project Gallery:** Lightbox + Masonry layout for project images.
*   **Marquee System:** Physics-based, auto-resuming, shared component for Trust Wall and Colophon.
*   **Data Visualization:**
    *   **Skill Fingerprint:** Static SVG Radar Chart.
    *   **Part Breakdown:** Static SVG Donut Chart.
*   **UX:**
    *   **Mobile:** Collapsible filters and "View All" button.
    *   **Navigation:** Previous/Next Project links.
    *   **Colophon:** SimpleIcons integration for the tech stack marquee.

## 🚧 Active Work (The "Hero" Phase)
*   **Brand Implementation:**
    *   [x] Create Design Language System (`docs/STYLE_GUIDE.md`).
    *   [x] Implement "Visible Grid" (CSS).
    *   [x] Implement "Build Stats" (Python + Footer).
*   **Hero Content:** Writing deep-dive markdown content in `data_source/manual_content/` for key projects (e.g. Xbox).
*   **Asset Population:** Populating `R2_STAGING/` with more `model.glb` files and `hero.png` files.
*   **Colophon Expansion:** Transforming the Colophon into a "Meta-Portfolio" with a dedicated content collection for site features.

## 🔮 Backlog & Refinement

### High Priority
*   **Colophon Icons:** Replace text labels in the Tech Stack Marquee with SVGs (similar to the Trust Wall).
*   **SEO:** Add OpenGraph tags for social sharing.
*   **Data Refinement:** Address "Core Competencies" duplication (Skills.csv data is currently proportional to duration, leading to identical profiles).

### Future / Nice-to-Have
*   **Print CSS:** Optimize pages for PDF export.
*   **Light/Dark Mode:** Re-enable and refine the light mode theme.
*   **Scroll Gear Mechanism:** Re-implement the rack and pinion scroll gear with better physics/visuals.

### Branding & Identity
*   **System Name Candidates:**
    *   **VECTOR** (Velocity/Direction)
    *   **LATTICE** (Structure/Interconnectivity)
    *   **KERNEL** (Core Engineering)


### Colophon / Meta-Portfolio
*   **The Pulse (Build Stats):**
    *   **Hook:** The site knows how fast it was built.
    *   **Tech:** Python (Timer) -> JSON -> Astro (Static Import).
    *   **Description:** A self-referential feature where the ingestion pipeline measures its own performance and stamps the footer with the build duration.

*   **Living Style Guide:**
    *   **Hook:** The system documents itself.
    *   **Tech:** MDX, Astro, Tailwind v4.
    *   **Description:** A live render of the Design Language System available at `/about/elements`.

*   **Living Style Guide:**
    *   **Hook:** The map is the territory.
    *   **Tech:** MDX + Astro Components (`Admonition`, `Chip`, `Wire`).
    *   **Description:** A live, render-accurate implementation of the Design Language System at `/about/elements`. It serves as both documentation and a visual regression test suite for the "Hyper-Functional Brutalist" aesthetic.

## 📜 Change Log (Recent)
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
*   **Living Style Guide Upgrade:** Transformed `/about/elements` into a fully functional DLS showcase.
    *   Implemented live "Kit" components: `Admonition`, `Chip`, `Wire`.
    *   Added "Effects" section demonstrating `ScrambleText`.
    *   Enforced DLS typography (Inter headers) in MDX content via `markdown-content.css`.
    *   Restored missing list examples and fixed rendering issues.

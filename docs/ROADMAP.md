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

## 🚧 Active Work (The "Hero" Phase)
*   **Hero Content:** Writing deep-dive markdown content in `data_source/manual_content/` for key projects (e.g. Xbox).
*   **Asset Population:** Populating `R2_STAGING/` with more `model.glb` files and `hero.png` files.

## 🔮 Backlog & Refinement

### High Priority
*   **Colophon Icons:** Replace text labels in the Tech Stack Marquee with SVGs (similar to the Trust Wall).
*   **SEO:** Add OpenGraph tags for social sharing.

### Future / Nice-to-Have
*   **Print CSS:** Optimize pages for PDF export.
*   **Light/Dark Mode:** Re-enable and refine the light mode theme.
*   **Scroll Gear Mechanism:** Re-implement the rack and pinion scroll gear with better physics/visuals.

## 📜 Change Log (Recent)
*   **Site User Manual:** Added `/about/ifu` page documenting site maintenance.
*   **Spec Sheet Modal:** Enhanced project quick view with detailed specs and keyboard navigation.
*   **Debug Mode:** Added footer toggle for visual debugging and grayscale mode.

*   **Type Safety:** Resolved TypeScript errors in Project Pages.
*   **Project Directory:** Implemented interactive list with spotlight hover effects.
*   **Construction Badge:** Added environment-aware status indicator.
*   **Documentation:** Restructured into `docs/` and migrated User Manual.

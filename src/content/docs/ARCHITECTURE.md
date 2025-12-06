---
title: "Architecture & Data Schema
"
slug: "architecture"
---
# Architecture & Data Schema

## ðŸ—ï¸ System Overview
*   **Framework:** Astro v5 (Static Site Generation)
*   **Styling:** Tailwind v4
    *   **Theme:** Brutalist Typography (Inter headers + JetBrains Mono body).
    *   **Visuals:** Technical Grid (radial gradient) + Transparent Navigation.
    *   **Prose Overrides:** We override default `prose` classes in `src/pages/projects/[...slug].astro` to enforce the brand identity:
        *   **Font Stack:** Forces `font-mono` (JetBrains Mono) for body text and `font-sans` (Inter) for headers.
        *   **Custom CSS:** Specific overrides for `blockquote`, `a`, and `h2` elements to match the Brutalist design tokens (hard edges, specific colors).
    *   **Markdown Content:** We use a dedicated `markdown-content` utility class (defined in `src/styles/markdown-content.css`) to enforce DLS typography within MDX files.
        *   **Headers:** Explicitly forced to `var(--font-header)` (Inter) to prevent falling back to the mono body font.
        *   **Usage:** Must be applied to the wrapper div of any MDX content render (e.g., `<div class="markdown-content"><Content /></div>`).
*   **Interactivity:** React (for Charts), Vanilla JS (for 3D & UI)
*   **Architecture:** Originally a forced initial-load effect, it was refactored to be **opt-in** to prevent FOUC (Flash of Unstyled Content) and improve UX. It is now triggered manually via the "RESTART" button in the footer.

### Visible Grid
*   **Concept:** A technical background grid that reinforces the "Datasheet" aesthetic.
*   **Implementation:** CSS `background-image` using `linear-gradient` on the `html` element.
*   **Layering:** The `body` element must have a transparent background for the grid to show through.
*   **Theme:** Adapts via CSS variables (`--grid-color`) for Light/Dark modes.

### Build Stats ("The Pulse")
*   **Concept:** Exposing the "Ingestion Pipeline" performance in the UI.
*   **Flow:** `ingest_data.py` measures execution time -> writes to `src/config/build.json` -> `Footer.astro` imports and displays it (e.g., `BLD: 0.45s`).

## âš™ï¸ Build System
### Configuration Gotchas
*   **Keystatic Integration:** In `astro.config.mjs`, `keystatic()` **MUST** be the last item in the `integrations` array. If placed earlier, it causes `virtual:keystatic-config` resolution errors during the build.
*   **Vite Optimization:** The `axobject-query` package (used by accessibility linters) must be excluded from Vite's optimization to prevent runtime `SyntaxError` issues in the browser (`optimizeDeps.exclude: ["axobject-query"]`).

### Hybrid Content Loading
We use a hybrid approach for loading content to balance features and stability:
*   **`projects` Collection:** Uses standard `getCollection()` for full type safety and schema validation.
*   **`colophon` Collection:** Uses `import.meta.glob()` as a robust workaround for a known issue where `getCollection` returns empty arrays for this specific collection.
    *   **Trade-off:** Slightly less type safety (requires manual mapping), but guarantees content availability.

### Auto-Imports
*   **Tool:** `astro-auto-import`
*   **Purpose:** Reduces boilerplate by automatically importing core DLS components (e.g., `Admonition`, `Newsletter`) into all MDX files.
*   **Gotcha:** Do **NOT** manually import these components in your markdown files. Doing so causes a "Duplicate Identifier" build error.

## ðŸŒ Environment Awareness
The site adapts its UI based on the build environment and configuration.

### Construction Badge
*   **Component:** `ConstructionBadge.astro`
*   **Configuration:** `src/config/siteData.json.ts` (`status.type`)
*   **Logic:**
    *   **Local Development:** Displays `[ LOCAL DEV ]` (Amber).
    *   **Production (Under Construction):** Displays `[ UNDER CONSTRUCTION: <SHA> ]` (Red).
    *   **Production (Live):** Badge is hidden.
    *   **Maintenance:** Displays `[ MAINTENANCE ]` (Red).
*   **Commit SHA:** Pulled from `CF_PAGES_COMMIT_SHA` (Cloudflare) or `GITHUB_SHA` (GitHub Actions).

## ðŸ”„ Data Ingestion Pipeline
The `ingest_data.py` script is the heart of the build process. It transforms raw CSV data into structured content for Astro.

### Workflow
1.  **Read CSVs:** Parses `Main.csv` and auxiliary files.
    *   **Slug Generation:** Prioritizes the `Slug Name` column if present. Fallbacks to `Name`. This allows the display title ("002 Rack") to differ from the filename (`rack-002`) to ensure valid MDX identifiers.
    *   **Validation:** The script warns if a generated slug starts with a digit.
2.  **Generate Charts:** Creates `skill-graph.svg` (Radar) and `part-graph.svg` (Donut) using Matplotlib.
2.  **Smart Header Hunting:** In `Expertise.csv`, the script dynamically locates the "Project Start" header row to handle the complex matrix structure (Skills vs Projects) and extracts metadata like "Phase" and "Weight".
3.  **Asset Discovery:** Scans for assets in the following priority:
    1.  `R2_STAGING_PATH` (Env Var)
    2.  `../quantum-assets/R2_STAGING` (Sibling Directory - Recommended for Dev)
    3.  `R2_STAGING` (Local Directory - Fallback)
4.  **Skill Aggregation (The Benchmark):**
    *   Before generating individual project data, the script scours `Skills.csv` to calculate the **Global Average** for every tracked skill.
    *   This "Benchmark" value is injected into every project's `skillData` array, enabling the "Streamgraph" visualization (Project vs. Global) in the frontend.
5.  **Content Generation:**
    *   Generates `src/content/projects/*.mdx` files.
    *   Injects manual content from `data_source/manual_content/{slug}.md` if present.
    *   **Content Sanitization:** Automatically replaces local asset paths (`/assets/r2/`) with the remote `R2_DOMAIN` (`https://assets.eriknorris.com/`) to ensure production compatibility.
    *   **Smart Component Injection:** Replaces `{{MODEL_URL}}` placeholders with `<ModelViewer />` tags (including fallback logic if no model exists).
    *   **Empty String Fallback:** Defaults missing image/model URLs to empty strings (`""`) instead of `"None"` to prevent 404 errors.
    *   Generates `src/data/clients.json` for the Trust Wall.
        *   **Note:** Uses `CLIENT_DOMAIN_MAP` to populate the `domain` field, enabling Clearbit API logo fetching.
    *   **Scaffolding:** The `--scaffold` flag triggers a generation mode that creates missing markdown templates in `data_source/manual_content/`, ensuring 100% content coverage.

### R2 Asset Sync
Assets are managed physically, not logically.
1.  **Stage:** Place files in `R2_STAGING/{slug}/` (e.g., `hero.png`, `model.glb`).
2.  **Ingest:** Run `python ingest_data.py`.
    *   **Auto-Sync:** The script automatically calls `sync_r2.py` to upload new assets to the Cloudflare R2 bucket.
    *   **Link:** It generates production URLs (`https://assets.eriknorris.com/...`) in the MDX frontmatter.

### Auxiliary Generators
To support the main ingestion pipeline, two auxiliary scripts maintain data quality and content volume:

1.  **`scripts/refine_skills.py`**: Solves the "Skill Duplication" problem.
    *   **Logic:** Assigns an "Archetype" (e.g., Software, Hardware, Design) to each project based on its Category.
    *   **Output:** Generates a unique `Skills.csv` with varied skill profiles, preventing identical radar charts across projects.
    *   **Scaling:** Uses logarithmic scaling based on project duration to determine skill mastery levels.

2.  **`scripts/generate_content.py`**: Solves the "Empty Portfolio" problem.
    *   **Creative Matrix:** Applies specific engineering narratives to known employers (e.g., "Silent Operation" for Kaleidescape, "HPC" for SGI).
    *   **Smart Templating:** Generates "Narrative STAR" (Situation, Task, Action, Result) case studies for generic projects using metadata.
    *   **Safety:** Skips existing manual content files larger than 1KB to preserve human-authored work.


## ðŸ—‚ï¸ Asset Management
### Branding Assets
*   **Location:** `public/assets/branding/`
*   **Consolidation:** All branding assets (logos, wordmarks, badges) are consolidated here. Legacy paths like `public/images/branding/` or `public/assets/logos/` are deprecated and removed.
*   **Theme Switching:** Components like `FilterMenu` and `SiteLogo` use a dual-image approach (loading both black and white variants) controlled by CSS classes (`.logo-light`, `.logo-dark`) and the `:global(.dark)` selector to ensure instant theme switching without flash-of-wrong-content.

## ðŸ›¡ï¸ Type Safety
*   **Strict Typing:** Core components (`[...slug].astro`, `Seo.astro`, `BaseLayout.astro`) enforce strict TypeScript props, particularly for `ImageMetadata`.
*   **SEO Types:** `Seo.astro`, `BaseHead.astro`, and `BaseLayout.astro` now support `type="project"` in addition to `"general"` and `"blog"`. This maps to `og:type="article"`.
*   **Verification:** `npm run build` is the gold standard for verifying type correctness. The build will fail if types are mismatched.
*   **Gotchas:**
    *   **Content Collections:** Generated types for collections might not always sync perfectly with complex frontmatter (e.g., optional arrays like `toolIcons`). Use `as any` casting sparingly if types are stubborn but data is known to be correct.
    *   **Dates:** Astro treats frontmatter dates as `Date` objects. Explicit casting (e.g., `project.data.date as any`) may be required when passing to the `Date` constructor to satisfy strict TS checks.

## ðŸ“Š Data Schema

### 1. `Expertise.csv` (The "Smart" Matrix)
*   **Structure:** Matrix of Skills (Columns) vs Projects (Rows).
*   **Logic:** Contains "Phase" and "Weight" metadata rows. The script "hunts" for the data start point.
*   **Rule:** **Do not delete rows.** The script relies on the specific structure.
        *   **Interactive:** `resume/interactive` (Terminal-style game).
        *   **3D:** `resume/3d` (CAD-style interface).
        *   **One-Pager:** `resume/one-pager` (High-density datasheet).
        *   **Infographic:** `resume/infographic` (Visual summary).

### UI Elements
*   **`SkillRadar.tsx`:** Client-side React component using Recharts for the "Skill Fingerprint".
*   **`ProjectGallery.tsx`:**
    *   **Layout:** "Smart Bento" CSS Grid.
    *   **Logic:** The ingestion script calculates aspect ratios for every image. The frontend uses this data to assign row/column spans:
        *   **Tall (AR < 0.8):** Spans 2 rows.
        *   **Wide (AR > 1.6):** Spans 2 columns.
        *   **Standard:** Spans 1x1.
    *   **Styling:** Enforces `object-fit: cover` to prevent distortion (squishing) of images that don't perfectly match the cell ratio.
*   **`Marquee.tsx`:** Shared React component used for both the Homepage Client Grid and Colophon Tech Stack. Supports `grayscale` and `speed` props.
*   **`ScrollMechanism.astro`:**
    *   **Concept:** A physics-based Rack and Pinion gear system that rotates in sync with window scroll.
    *   **Tech:** Vanilla JS + CSS Transforms + SVG/CSS Gradients.
    *   **Logic:** Calculates scroll delta to drive rotation (Gear) and vertical translation (Rack) for a realistic mechanical effect.

*   **`UnifiedDashboard.tsx`:** 
    *   **Architecture:** A polymorphic React component that adapts to three contexts: 
        *   `mini`: Small/icon-like (Project List).
        *   `medium`: Interactive preview (Project Detail).
        *   `mega`: Full-screen "Cockpit" (Resume/Dashboard Page).
    *   **Data Flow:** Accepts a `DashboardData` interface. For the "Mega" view, it aggregates Global Stats (Total Parts, Years) and injects the `MultiverseGraph`.
    *   **Visuals:** Uses "Metric Rectifiers" (CSS Grid-based counters) and "Spec Tickers" (CSS Animations) to maximize data density.

*   **`MultiverseGraph.tsx`:**
    *   **Tech:** D3.js (Force Layout) + React (Ref Management).
    *   **Logic:** Simulates a physics-based gravity well of all career nodes.
    *   **Input:** `src/data/timeline/multiverse.json`.
    *   **Optimization:** Runs outside the React render cycle (via `useEffect` and d3 selection) to maintain 60fps physics performace.

### 8. Gallery Data Structure
*   **Old:** Array of strings (URLs).
*   **New:** Array of Objects:
    ```json
    {
      "src": "/assets/r2/...",
      "width": 800,
      "height": 600,
      "aspectRatio": 1.33
    }
    ```
*   **Why:** Enables the "Smart Bento" layout to make layout decisions at build time (or render time) without layout shift.

### 9. The Visual Taxonomy (Machine Interface)
To standardize the "Technical Datasheet" aesthetic, we established a "Visual Taxonomy" of core layout components.
*   **Decision:** These components are designed to be "Plug-and-Play" via VS Code snippets, enforcing consistent structure across all project pages.
A hybrid workflow combining human art direction with machine precision.
*   **Philosophy:** "The Darkroom" (Lightroom) -> "The Machine" (Python) -> "The Cloud" (R2).
*   **Source of Truth:** High-Res TIFFs (4000px) stored in local `~/Quantum_Workspace/R2_MASTER`.
*   **Smart Gallery Engine:** The pipeline reads the manual content markdown *before* generating the gallery. If an image (or animation) is used in the writeup, it is automatically excluded from the bottom gallery to prevent duplication.
*   **Expanded Taxonomy:** Supports a broad range of technical view types (`iso`, `ortho`, `exploded`, `cutaway`, `schematic`) to support the "Hyper-Functional Brutalism" aesthetic.
*   **Optimization:** `scripts/process_images.py` uses `Lanczos` resampling to generate `AVIF` (Primary) and `WebP` (Fallback) at standard breakpoints (`xl`, `lg`, `md`, `sm`).
*   **Animation:** Stitches sequences into Animated WebP with **Variable Duration** (folder-based config) and **Letterboxing** (distortion prevention).
*   **Pass-Through:** Non-image assets (`.pdf`, `.glb`, `.mp4`) are copied directly to staging.



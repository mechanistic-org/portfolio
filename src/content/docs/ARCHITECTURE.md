---
title: "System Architecture"
slug: "architecture"
sidebar:
  group: "System Manual"
  order: 1
---

*   **Prose Overrides:** We override default `prose` classes in `src/pages/projects/[...slug].astro` to enforce the brand identity:
    *   **Font Stack:** Forces `font-mono` (JetBrains Mono) for body text and `font-sans` (Inter) for headers.
    *   **Custom CSS:** Specific overrides for `blockquote`, `a`, and `h2` elements to match the Brutalist design tokens (hard edges, specific colors).
*   **Markdown Content:** We use a dedicated `markdown-content` utility class (defined in `src/styles/markdown-content.css`) to enforce DLS typography within MDX files.
    *   **Headers:** Explicitly forced to `var(--font-header)` (Inter) to prevent falling back to the mono body font.
    *   **Usage:** Must be applied to the wrapper div of any MDX content render (e.g., `<div class="markdown-content"><Content /></div>`).
*   **Interactivity:** React (for Charts), Vanilla JS (for 3D & UI)

## 4. The "Zero-Bloat" Architecture
To respect Cloudflare Pages limits (20k files, 25MB script size), we use a Hybrid Static approach:
1.  **Astro:** Configured as `output: static`. Generates pure HTML/CSS/JS.
2.  **Dynamic Routes:** Handled by **Native Pages Functions** (`functions/[[path]].js`).
    *   *Why:* This keeps the Worker extremely lightweight (less than 50KB) because it ONLY handles the proxy logic, not the entire site render code.
3.  **Asset Proxy:**
    *   **Route:** `/r2/*` -> Maps to `projects` R2 bucket.
    *   **Caching:** Uses `Cache-Control: no-cache` to ensure instant updates during dev (relies on Cloudflare CDN for edge caching).

### Deck Layout (`DeckLayout.astro`)
*   **Purpose:** Cinematic, full-screen presentation mode for Pitch Decks and "Scrollytelling" narratives.
*   **Architecture:**
    *   Removes global navigation and footer to eliminate distractions.
    *   Enforces `scroll-snap` behaviors for slide-based progression.
    *   Uses absolute positioning for overlay elements (e.g., "Scroll Hint").

### Scroll Coordination System
To create a "cinematic" feel without heavy libraries (like GSAP), we implemented a lightweight, headless `ScrollCoordinator` component.

*   **Component:** `src/components/Effects/ScrollCoordinator.astro`
*   **Strategy:** "Tag and Animate" via Data Attributes.
*   **Logic:**
    *   Listens to `window.scrollY`.
    *   Queries elements with `[data-scroll-effect]`.
    *   Applies hardware-accelerated transforms (`translateY`) and opacity changes.
*   **Effects:**
    *   `flee`: Moves elements UP faster than scroll (1.5x speed) and fades them out. Used for Headers/Intros to clear the stage.
    *   `fade-out`: Fades elements out and moves them DOWN slightly (0.1x) for a parquet/parallax depth effect.
    *   `focus`: Fades elements IN (opacity 0.2 -> 1.0). Used for background visualizations (D3 Graphs) to bring them to attention when foreground content clears.

*   **Architecture:** Originally a forced initial-load effect, it was refactored to be **opt-in** to prevent FOUC (Flash of Unstyled Content) and improve UX. It is now triggered manually via the "RESTART" button in the footer.

### Visible Grid
*   **Concept:** A technical background grid that reinforces the "Datasheet" aesthetic.
*   **Implementation:** CSS `background-image` using `linear-gradient` on the `html` element.
*   **Layering:** The `body` element must have a transparent background for the grid to show through.
*   **Theme:** Adapts via CSS variables (`--grid-color`) for Light/Dark modes.

### Build Stats ("The Pulse")
*   **Concept:** Exposing the "Ingestion Pipeline" performance in the UI.
*   **Flow:** `ingest_data.py` measures execution time -> writes to `src/config/build.json` -> `Footer.astro` imports and displays it (e.g., `BLD: 0.45s`).

### 4. Generative Ingestion Layer ("The Refinery")
*   **Concept:** We treat raw content (audio notes, loose text) as "Ore" that must be mineralized into "Datasheets".
*   **Engine:** `scripts/ingest_inbox.py`
*   **Model Strategy:** We utilize **Gemini 2.5 Pro** via the Google Gen AI SDK.
*   **Decision Record:**
    *   **Why Gemini?** Chosen for **Native Audio Support**. This allowed us to eliminate a dedicated transcription dependency (like Whisper/FFmpeg), drastically simplifying the local toolchain. We drop `.mp3` files directly into the context window.
    *   **Why Local Script?** A "Drop & Forget" filesystem watcher in `data_source/inbox` provided lower friction than a web UI for the specific "Brain Dump" use case.

## âš™ï¸ Build System
### Configuration Gotchas
*   **Keystatic Integration:** In `astro.config.mjs`, `keystatic()` **MUST** be the last item in the `integrations` array. If placed earlier, it causes `virtual:keystatic-config` resolution errors during the build.
*   **Vite Optimization:** The `axobject-query` package (used by accessibility linters) must be excluded from Vite's optimization to prevent runtime `SyntaxError` issues in the browser (`optimizeDeps.exclude: ["axobject-query"]`).

### Documentation Content Loader
*   **Problem:** Astro's `getCollection("docs")` was returning empty arrays due to complex/conflicting frontmatter schemas or cache invalidation issues during specific build states.
*   **Solution (The Glob Strategy):** We bypassed the Content Layer API for the documentation sidebar in favor of `import.meta.glob('../content/docs/*.md')`. This ensures a raw, file-system-level read that is 100% reliable for generating navigation structures, regardless of schema validation state.

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

## ðŸ—‚ï¸ Asset Management
### Branding Assets
*   **Location:** `public/assets/branding/`
*   **Consolidation:** All branding assets (logos, wordmarks, badges) are consolidated here. Legacy paths like `public/images/branding/` or `public/assets/logos/` are deprecated and removed.
*   **Theme Switching:** Components like `FilterMenu` and `SiteLogo` use a dual-image approach (loading both black and white variants) controlled by CSS classes (`.logo-light`, `.logo-dark`) and the `:global(.dark)` selector to ensure instant theme switching without flash-of-wrong-content.

### 3D Lighting Strategy ("The Carbon Rule")
*   **Challenge:** "Matte Forged Carbon" is physically black and highly absorbent. Standard "Neutral" HDRIs render it as a flat silhouette.
*   **Decision:** We use `model-viewer`'s **Legacy Lighting** (No `environment-image` specified) combined with High Exposure (`3.5`).
*   **Rationale:** The default lighting provides higher contrast and directional shadows needed to "fire" the anisotropic flakes. "Neutral" lighting is forbidden for Carbon assets.

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

### 2. Universal History
*   **Skeleton (Truth):** `data_source/Main.csv` contains the definitive Dates, Titles, and Employers (parsed via D3).
*   **Flesh (Narrative):** `data_source/manual_content/RESUME_CORPUS_timeline.md` contains rich, LLM-synthesized descriptions and "Lost Knowledge" extracted from legacy files.
*   **Presentation:** `src/pages/history.astro` merges these data streams.

### UI Elements
*   **Visualization Engine (D3.js Refactor):**
    *   **Decision:** We removed `recharts` (400kb+) in favor of pure D3.js modules (`d3-shape`, `d3-scale`) to achieve "Hyper-Functional Brutalism" without generic library overhead.
    *   **Components:**
        *   **`SkillRadarD3.tsx`:** Custom SVG implementation of the radar chart with precise grid control.
        *   **`PhaseDonutD3.tsx`:** Interactive donut chart leveraging D3 arc generators.
            *   *Refactor Note:* Accepts `Array<{ phase: string, value: number }>` instead of `Record` to align with the "Snake Case Strategy" and improve reliability.
        *   **`ImpactResonance.tsx`:** Physics-based "System Velocity" gauge using D3 timer loops for organic pulsing effects.
        *   **`ConstructionGauge.tsx`:** The "Amber" low-energy holding pattern (calmer pulse). separated from `ImpactResonance` to ensure the core metric component remains "High Velocity" without conditional pollution.
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



### 3D Rendering Stack ("The Asset Lab")
*   **Engine:** `three.js` via `@react-three/fiber` (R3F).
*   **Helpers:** `@react-three/drei` for environment maps, float effects, and GLTF loading.
*   **Usage:** High-fidelity brand assets (e.g., `WiggleLogo3D`) and interactive visualizations.
*   **Component:** `<model-viewer>` (Google) - Legacy support for product viewer.
*   **Version Constraint:** Must be `v3.4.0+` to support `KHR_materials_anisotropy` (Holographic/Carbon effects).
*   **Format Standard:** `glTF Binary` (.glb).
*   **Export Workflows:**
    *   **Workflow A ("Express Lane"):** Direct export from Substance Painter (`glTF PBR Metal Roughness`). Best for reliable geometry and standard materials.
    *   **Workflow B ("Round Trip"):** Substance -> Blender -> GLB. Best for complex geometry requiring Draco compression, but prone to data loss (e.g., missing Tangents/Color Space issues).
*   **Debug Tool:** `/about/test-logo` provides a hardware inspection layer for these assets.

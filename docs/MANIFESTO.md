# Project Manifesto

**Role:** High-Performance Mechanical Engineering Portfolio
**Stack:** Astro v5, React (Recharts), Python (Native CSV), Tailwind v4
**State:** V1.0 Production (Stable)

## 🛑 Core Directives (Non-Negotiable)

### 1. Single Source of Truth
The `data_source/*.csv` files are the **ONLY** source of project data.
*   We **NEVER** edit `src/content/projects/*.mdx` frontmatter manually.
*   All data updates must happen in the CSVs or the `manual_content` markdown files.

### 2. The Ingestion Engine
`python ingest_data.py` is the Master Controller.
*   It reads CSVs, finds assets, calculates stats, and regenerates all MDX files.
*   **Rule:** If data changes, run the script. If layout changes, edit the Astro template.

### 3. Hybrid Content System
*   **Auto-Generated:** By default, project pages show a generic placeholder.
*   **Manual Override:** If a file exists at `data_source/manual_content/{slug}.md`, the script injects **THAT** text into the MDX body.
*   **Workflow:** To write a Case Study, create the markdown file in `manual_content/`, then run the script.

### 4. Physical Asset Law
We do not map assets in JSON. We place them physically in the file system.
*   **Staging:** `R2_STAGING/{slug}/` (Local source for uploads)
*   **Production:** `https://assets.eriknorris.com/{slug}/` (Remote R2 bucket)
*   **Standard Files:**
    *   `hero.png` (Cover Image)
    *   `model.glb` (3D Model)
    *   `*.pdf` (Documentation/Specs)
    *   `gallery/*.{png,jpg}` (Gallery Images)

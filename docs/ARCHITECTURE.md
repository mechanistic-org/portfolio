# Architecture & Data Schema

## 🏗️ System Overview
*   **Framework:** Astro v5 (Static Site Generation)
*   **Styling:** Tailwind v4
*   **Interactivity:** React (for Charts), Vanilla JS (for 3D & UI)
*   **Data Source:** CSV Files + Markdown (Hybrid)
*   **Asset Host:** Cloudflare R2 (via custom domain `assets.eriknorris.com`)

## 🔄 Data Ingestion Pipeline
The `ingest_data.py` script is the heart of the build process. It transforms raw CSV data into structured content for Astro.

### Workflow
1.  **Read CSVs:** Parses `Main.csv`, `Expertise.csv`, `Stats.csv`, `Colors.csv`, and `Tenure.csv`.
2.  **Smart Header Hunting:** In `Expertise.csv`, the script dynamically locates the "Project Start" header row to handle the complex matrix structure (Skills vs Projects) and extracts metadata like "Phase" and "Weight".
3.  **Asset Discovery:** Scans `R2_STAGING/{slug}/` for local assets and maps them to their production URLs.
4.  **Content Generation:**
    *   Generates `src/content/projects/*.mdx` files.
    *   Injects manual content from `data_source/manual_content/{slug}.md` if present.
    *   Generates `src/data/clients.json` for the Trust Wall.

### R2 Asset Sync
Assets are managed physically, not logically.
1.  **Stage:** Place files in `R2_STAGING/{slug}/` (e.g., `hero.png`, `model.glb`).
2.  **Sync:** Run the R2 sync script (or manual upload) to push to Cloudflare R2.
3.  **Ingest:** Run `ingest_data.py`. It detects the assets (assuming they mirror the staging structure) and generates the correct URLs in the MDX frontmatter.

## 📊 Data Schema

### 1. `Expertise.csv` (The "Smart" Matrix)
*   **Structure:** Matrix of Skills (Columns) vs Projects (Rows).
*   **Logic:** Contains "Phase" and "Weight" metadata rows. The script "hunts" for the data start point.
*   **Rule:** **Do not delete rows.** The script relies on the specific structure.

### 2. `Main.csv` (The Identity)
*   **Key:** `Name` (Generates the Slug).
*   **Fields:** Title, Date, Employer, Client, Description.

### 3. `Stats.csv` (Hardware Metrics)
*   **Key:** `Name`.
*   **Metrics:** `Plastic`, `Sheetmetal`, `PCB` (Integer counts for the Hardware Dashboard).

### 4. `Colors.csv` (The Palette)
*   **Logic:** Maps Entity Name (Employer or Skill) -> Hex/RGB.
*   **Usage:** Color-codes the Career Timeline and Radar Charts.

### 5. `Tenure.csv` (Career History)
*   **Logic:** Defines the timeline segments on the `/about` page.
*   **Calculations:** Duration is computed during ingestion.

## 🧩 Key Components

### Pages
*   **`[...slug].astro`:** Master project template. Renders the layout, charts, and 3D viewer.
*   **`docs/MAINTENANCE.md` (User Manual):** Documentation for site maintenance, including the Trust Wall logic and Ingestion Script usage.
*   **`colophon.astro`:** "How it was Built" page with architecture breakdown and tech stack marquee.

### UI Elements
*   **`SkillRadar.tsx`:** Client-side React component using Recharts for the "Skill Fingerprint".
*   **`ClientGrid.astro`:** Infinite marquee "Trust Wall" on the homepage.
*   **`ProjectDirectory.astro`:** Interactive project list with filtering, sorting, and hover previews (Spotlight effect).
*   **`ConstructionBadge.astro`:** Status indicator (Local/Construction/Production) showing the current commit SHA.
*   **`<model-viewer>`:** Google's 3D viewer component. Defaults to "Neil Armstrong" if no custom GLB is found.

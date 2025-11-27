# PROJECT MANIFESTO: Erik Norris Portfolio
**Stack:** Astro v5, React (Recharts), Python (Native CSV), Tailwind v4.
**State:** V1.0 Production (Stable).
**Role:** High-Performance Mechanical Engineering Portfolio.

## 🛑 CORE DIRECTIVES (Non-Negotiable)
1.  **Single Source of Truth:** The `data_source/*.csv` files are the ONLY source of project data. We NEVER edit `src/content/projects/*.mdx` frontmatter manually.
2.  **The Ingestion Engine:** `python ingest_data.py` is the Master Controller.
    * It reads CSVs, finds assets, calculates stats, and regenerates all MDX files.
    * **Rule:** If data changes, run the script. If layout changes, edit the Astro template.
3.  **Hybrid Content System:**
    * **Auto-Generated:** By default, project pages show a generic placeholder.
    * **Manual Override:** If a file exists at `data_source/manual_content/{slug}.md`, the script injects THAT text into the MDX body.
    * **Workflow:** To write a Case Study, create the markdown file in `manual_content/`, then run the script.
4.  **Physical Asset Law:** We do not map assets in JSON. We place them physically.
    * Local Path: `R2_STAGING/{slug}/`
    * Production Path: `https://assets.eriknorris.com/{slug}/`
    * Files: `hero.png` (Cover), `model.glb` (3D), `*.pdf` (Docs).

## 🏗️ ARCHITECTURE
* **Charts:** Client-Side Only (`client:only="react"`). We use Recharts.
* **3D:** Google `<model-viewer>`. Defaults to "Neil Armstrong" if no custom GLB is found.
* **Navigation:** Linear Chronological (Next/Prev by Date). No complex filter-state routing.
* **Trust Wall:** Homepage marquee generated from `clients.json` (derived from CSVs).

## 🧩 KEY COMPONENTS
* **`[...slug].astro`:** The master project template. Handles the layout, charts, and 3D viewer.
* **`SkillRadar.tsx`:** Client-side React component for the "Skill Fingerprint" chart.
* **`ClientGrid.astro`:** The infinite marquee "Trust Wall" on the homepage.
* **`colophon.astro`:** The "How it was Built" architecture page.
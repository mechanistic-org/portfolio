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
*   **Git Rule:** We **NEVER** commit large assets to the repo. `R2_STAGING` is ignored. The R2 Bucket is the Source of Truth for binary blobs.
*   **Standard Files:**
    *   `hero.png` (Cover Image)
    *   `model.glb` (3D Model)
    *   `*.pdf` (Documentation/Specs)
    *   `gallery/*.{png,jpg}` (Gallery Images)

### 5. The Law of Zero-Runtime Visualization
If a chart doesn't need to change after page load, it should be an image.
*   **Principle:** We prefer build-time SVG generation (Matplotlib) over client-side JS libraries (Recharts).
*   **Benefit:** Faster LCP, no hydration errors, and perfect "Datasheet" aesthetics.

### 6. Respect the User's Time
We removed the forced "Matrix Boot Sequence" on initial load because it delayed access to content.
*   **Principle:** Cool effects should be **opt-in** (like the Restart button), not mandatory roadblocks.
*   **Rule:** Never block the main thread or the view for purely cosmetic reasons.

### 7. The Law of Narrative Impact
We do not just list specs; we tell the engineering story.
*   **Framework:** Use the **Narrative STAR** method (The Challenge -> Engineering Approach -> Impact) for manual content.
*   **Style:** Avoid literal "Situation/Task/Action/Result" labels. Use engaging, project-specific headings that guide the reader through the problem-solving journey.
*   **Goal:** Bridge the gap between a technical datasheet and a compelling case study.
### 8. Honest Construction
We show the seams.
*   **Principle:** The "Construction Badge", "Debug Mode", and "Build Stats" are features, not bugs.
*   **Why:** We are engineers. We value the machine as much as the output.

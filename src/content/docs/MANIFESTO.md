---
title: "Project Manifesto"
slug: "manifesto"
sidebar:
  group: "System Manual"
  order: 4
---
# Project Manifesto

**Role:** High-Performance Mechanical Engineering Portfolio
**Stack:** Astro v5, React (Recharts), Python (Native CSV), Tailwind v4
**State:** V1.0 Production (Stable)

## ðŸ›‘ Core Directives (Non-Negotiable)
*   **Manual Override:** If a file exists at `data_source/manual_content/{slug}.md`, the script injects **THAT** text into the MDX body.
*   **Workflow:** To write a Case Study, create the markdown file in `manual_content/`, then run the script.
*   **The Creative Matrix:** To avoid generic AI content, we employ a "Creative Matrix" for content generation. This maps specific Employers/Clients to specific Engineering Domains (e.g., Kaleidescape -> Thermal Management, Acoustics). This ensures that even auto-generated content respects the historical context of the work.

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
*   **Practice:** We explicitly define an `impact` field in the frontmatter to ensure the "Result" is the first thing a recruiter sees, enforcing the "BLUF" (Bottom Line Up Front) principle for engineering case studies.
### 8. Honest Construction
We show the seams.
*   **Principle:** The "Construction Badge", "Debug Mode", and "Build Stats" are features, not bugs.
*   **Why:** We are engineers. We value the machine as much as the output.

### 9. The Meta-Portfolio
The site must document itself. Every major feature (AR Viewer, Build Timer, Print Mode) is an engineering project worthy of a case study. We do not hide the machinery; we celebrate it in the `/colophon`.
### 6. The Law of Hybrid Assets
**"Human Eye, Machine Hand."**
We do not rely on build-time plugins to guess how an image should look. Art direction (color, crop, tone) is a human task performed in professional tools (Lightroom). Optimization (compression, formatting, resizing) is a machine task performed by scripts. The two never overlap.

### 10. The Law of Robustness
**"Works on my machine" is not a valid defense.**
*   **Principle:** We build for the hostile environment (CI/CD), not the comfortable one (Localhost).
*   **Practice:** We use strict relative paths, enforce case sensitivity in Git, and prefer "Nuclear Renames" over subtle fixes when resolution errors occur.

### 11. The Law of Data Density (The Cockpit)
**"Empty space is wasted space."**
*   **Context:** For the Dashboard (`/resume/dashboard`), we embrace the "747 Cockpit" aesthetic.
*   **Principle:** The specialized user (Recruiter/Engineer) wants to see *everything* at once. Do not hide complex data behind clicks.
*   **Practice:** Use Streamgraphs, Tickers, and dense Grids to visualize the "Magnitude" of the career. If the data exists, put it on the glass.


### 12. The Data God's Law
**"The Projection is not the Reality."**
The website (`src`) is merely a transient rendering of the underlying data (`data_source`). We honor the CSV as the single source of truth. We do not paint over the mirror; we change the object being reflected.

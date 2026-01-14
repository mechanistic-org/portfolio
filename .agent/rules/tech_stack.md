---
# This rule should apply to pattern: "**/*.{ts,tsx,astro,css}"
---

# Tech Stack Constraints

## Core Stack

- **Framework:** Astro (Static Output preferred).
- **UI:** React (Islands).
- **Styling:** Tailwind CSS v4 (using OKLCH colors).
- **3D:** React Three Fiber (R3F) + Drei.

## Color System (`STYLE_GUIDE`)

- **Primary:** `YInMn Blue` (`#2E5CFF`).
- **Neutral:** `neutral-50` to `neutral-950`.
- **Grid:** `process-blue` (`rgba(0, 133, 202, 0.5)`).

## Directory Structure

- `src/content/`: MDX Content (The Truth).
- `public/assets/r2/`: Symlinked Assets (The Vault).
- `scripts/`: Python Pipelines (Ingestion/Stitching).

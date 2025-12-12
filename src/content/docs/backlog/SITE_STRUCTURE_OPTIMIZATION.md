---
title: "Backlog: Site Structure Optimization"
slug: "site_structure_optimization"
description: "Plan to flatten navigation and introduce 'Specs' hub."
---

# Site Structure Optimization (Paused)

> **Status:** Paused (Dec 2025).
> **Context:** Visual Sitemap (`/map`) was built to analyze structure. User decided to stick with `Projects | About | Resume` for now.

## The Proposal (DSP)
Flatten the hierarchy to reduce "Click Budget":

1.  **Projects**: Direct link (Unchanged).
2.  **Specs**: Replaces "About". Direct link to a new "Mission Control" page that aggregates Bio, Colophon, and the "Resume Matrix" (experimental views).
3.  **CV**: Direct link to PDF. No dropdown.

## Rationale
*   **Signal to Noise:** The current "Resume" dropdown has too many options.
*   **Asset Preservation:** Experimental resume views (Dashboard, 3D) should be moved to a "Labs" section in `/specs` rather than cluttering the main nav.

## Next Steps (When Resumed)
1.  Verify `/map` logic (ensure links work).
2.  Rename "About" -> "Specs" in `navData`.
3.  Create `src/pages/specs.astro`.
4.  Update Homepage Hero "Call to Action" to point directly to PDF.

---
title: "Implementation Plan"
slug: "implementation_plan"
description: "Strategic plan for Quantum Systems Refinement and narrative restructuring."
---

# Implementation Plan: Quantum Systems Refinement (Post-Audit)

**Objective:** Address the "Council of Voices" feedback while reinforcing the "15-20 Year Architecture" narrative.
**Strategic Pivot:** "Dreamjob" is not a placeholder; it is the *destination* of the timeline. We will contextualize it as such.

## User Review Required
> [!IMPORTANT]
> **Narrative Shift:** We are effectively rebranding "Dreamjob" from a generic placeholder to a "North Star" construct. This requires adding a clear "Why" to the project page.

> [!NOTE]
> **Navigation Changes:** "Work" will become "Projects" (or "The Work") to be slightly less generic but still clear.

## Proposed Changes

### 1. Narrative & Content (The Recruiter / The Architect)
Hardening the story and "Maintaing Face".

#### [MODIFY] [dreamjob.mdx](file:///d:/GitHub/quantum/src/content/projects/dreamjob.mdx)
-   **Add Impact Metrics:** Add hard numbers to the `impact` field (e.g., "Reduced documentation time by 40%").
-   **Contextualize the Construct:** Add a "Why this exists" section to the intro. Explain that this represents the *next* 20 years of work.
-   **Add Call to Action:** "Ready to build this? [Contact Protocol]"

### 2. Navigation & UX (The Brutal Roast)
Fixing the "generic" feel and improving flow.

#### [MODIFY] [navData.json.ts](file:///d:/GitHub/quantum/src/config/navData.json.ts)
-   **Rename:** "Work" -> "Projects" (Clearer).
-   **Prune:** Ensure the Dropdowns aren't overwhelming (Resume has too many items? Verify visually).

### 3. Visuals & "The Soul" (The Arbiter of Cool)
Adding the "Grease" and "Analog" feel.

#### [MODIFY] [BaseLayout.astro](file:///d:/GitHub/quantum/src/layouts/BaseLayout.astro) (or Global CSS)
-   **Noise Overlay:** Add a subtle SVG noise filter to the `<body>` or a fixed overlay div to give it texture.
-   **Scanlines:** Optional CSS radial gradient to vignette the edges.

#### [MODIFY] [Header.astro](file:///d:/GitHub/quantum/src/components/Navigation/Header.astro)
-   **Micro-interactions:** Ensure hover states are brisk and "snappy".

## Verification Plan

### Automated Tests
-   `npm run build` to ensure no regression.
-   `python ingest_data.py` to ensure `dreamjob` is still correctly processed.

### Manual Verification
1.  **Narrative Check:** Read `http://localhost:4321/projects/dreamjob` as a "Recruiter". Does it feel like a real goal now?
2.  **Vibe Check:** Does the new noise overlay feel "premium" or "dirty"? (Adjust opacity).
3.  **Nav Check:** Does "Projects" feel correct?

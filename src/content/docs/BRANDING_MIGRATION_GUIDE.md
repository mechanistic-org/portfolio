---
title: "Branding Migration Guide"
description: "Guide for migrating branding assets to the new system."
---
# Branding Migration Guide

**Objective:** Transition from unoptimized "Fake SVGs" to a performant **Hybrid Branding Strategy**.

## The Strategy
We are splitting branding assets into two distinct pipelines to balance performance and visual fidelity.

### 1. System Logos (Vector Pipeline)
*   **Use Case:** Header, Footer, Mobile Nav, Favicon.
*   **Goal:** Extremely fast load times (< 5KB), crisp edges at any scale, and CSS themeability.
*   **Format:** Pure SVG (Vector Paths ONLY).
*   **Constraint:** NO embedded raster images (Base64 PNGs).

### 2. Brand Art (Raster Pipeline)
*   **Use Case:** "About" Page Hero, Social Cards, Readme, Rich Media Showcases.
*   **Goal:** High-fidelity 3D rendering, complex lighting, textures (Substance Painter).
*   **Format:** High-Res PNG/TIFF -> WebP/AVIF (via `process_images.py`).

---

## Migration Instructions

### Part A: Creating System Logos (Illustrator/Figma)
**Action:** Create the "Flat" Vector versions.

1.  **Open Source:** Open the original logo file (or the 3D export if it has vector paths).
2.  **Simplify:** Remove all 3D effects, shadows, and textures. We want the *shape* only.
3.  **Outline Text:** Convert all text to outlines/shapes (`Type > Create Outlines`).
4.  **Clean Up:** Merge overlapping shapes (`Pathfinder > Unite`). Remove hidden layers.
5.  **Artboard:** Resize the artboard to fit the logo bounds tightly.
6.  **Export SVG:**
    *   **Styling:** Internal CSS or Inline Style.
    *   **Images:** **Preserve** (If this option is active/selectable, **STOP**. You have raster data. Go back to Step 2).
    *   **Responsive:** Checked (No fixed width/height).
7.  **Verification:** Open the SVG in a code editor. If you see `<image ... base64... >`, it is **REJECTED**.

**Target Files:**
*   `public/assets/branding/logo-mark.svg` (The "EN" Symbol)
*   `public/assets/branding/logo-wordmark.svg` (The "Erik Norris" Text)

### Part B: Creating Brand Art (3D Workflow)
**Action:** Export the High-Fidelity Renders.

1.  **Software:** Onshape / Substance Painter / Blender.
2.  **Resolution:** Export at 4K (3840px wide) or higher.
3.  **Background:** Transparent (PNG) or Black (if using "Cinematic" style).
4.  **Export Location:** Save the raw high-res files to your local workspace:
    *   `../quantum-workspace/R2_MASTER/branding/brand-hero-3d.png`
5.  **Processing:**
    *   The `process_images.py` script will pick this up (once we update it) and generate:
        *   `brand-hero-3d.avif` (Optimized)
        *   `brand-hero-3d.webp` (Fallback)

## Troubleshooting
*   **"My SVG is 2MB":** You have an embedded image. Follow Part A.
*   **"The Logo is Black on Black":** Ensure you are using `currentColor` for the fill in the SVG code, or use the `.logo-light` / `.logo-dark` CSS utility classes.

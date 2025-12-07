---
title: "The Bridge Protocol (Moi3D)"
slug: "moi3d_bridge"
sidebar:
  group: "Workflows"
  order: 4
---
# The Bridge Protocol (Moi3D)

> [!WARNING] LEGACY PROTOCOL
> **Status:** Deprecated (Dec 2025).
> **New Standard:** We have moved to **Plasticity**. Please see [`SETUP_PLASTICITY_PIPELINE.md`](/src/content/docs/SETUP_PLASTICITY_PIPELINE.md).
> This document is retained for archival purposes.

> **Role:** The Translator
> **Objective:** Convert "Perfect Math" (NURBS) into "Perfect Polygons" (Quads) for Substance Painter.

## 0. Prerequisites (Installation)
**MOI3D (Moment of Inspiration)** is a standalone Windows/Mac application. It is **not** included in this repository.

*   **Download:** [http://moi3d.com/download.htm](http://moi3d.com/download.htm)
*   **License:** The **90-Day Trial** is fully functional and allows Saving/Exporting (critical for this workflow).
*   **Cost:** ~$295 (One-time purchase, no subscription).

> [!NOTE]
> MOI3D was created by the original developer of Rhino3D. It is famous for its "Pen-Tablet friendly" UI and its "perfect" mesh export algorithm.

---

## 1. Why Moi3D? (The "Secret Weapon")
CAD tools (Onshape, SolidWorks) speak **Math** (Curves).
Game Engines (Three.js, Unity) speak **Polygons** (Triangles).

Most converters (Blender, C4D) do a terrible job at this translation. They create "Long, Thin Triangles" that cause shading artifacts (black streaks) in Substance Painter.

**Moi3D** is unique because it generates **n-gons** (clean faces) and **quads** (squares) that align with the curvature of the object. It is the industry standard for Hard Surface modeling pipelines.

---

## 2. The Setup

### The UI
Moi3D is famous for having no "Chrome". It is entirely canvas-driven.
*   **Split View:** You typically work in the "Split" view (Top-Left quadrant of the views).
*   **Mouse:** Left click to select. Right click to pan. Scroll to zoom.

### The Input
1.  **File -> Open** (or Import).
2.  Select your **`.x_t` (Parasolid)** file from Onshape.
3.  *Note:* `.step` files work too, but `.x_t` is the native language of the kernel Onshape uses.

---

## 3. The Protocol (The Export Dialog)

This is the single most critical step in the entire 3D pipeline. **Memorize these settings.**

1.  Select the object(s) you want to export.
2.  **File -> Export**.
3.  Choose **Wavefront (.obj)** as the file type.
4.  Filename: `project_name_high.obj` (We treat this as the "High Poly" for baking).

### The "Meshing Options" Dialog
Once you click Save, a dialog appears with a slider. **Do not just click OK.**

#### A. The Slider (Angle)
*   **Value:** **10.0 - 12.0**
*   **What it does:** Controls how "smooth" curves are. Lower number = More polygons = Smoother.
*   *Guideline:* stick to 12. If it looks blocky, go to 6. If it's too dense, go to 20.

#### B. Output (The Dropdown)
*   **Setting:** **Quads & Triangles**
*   *Critical:* DO NOT select "N-gons". Substance Painter hates N-gons. DO NOT select "Triangles only".
*   *Why:* Quads relax the shading engine.

#### C. "Divide larger than" (The Secret Sauce)
*   **Setting:** **Check this box.**
*   **Value:** `0.5` (assuming Meters) or `50` (assuming mm).
*   *Visual Check:* Look at the large flat surfaces. Are there giant triangles spanning the whole face? That is bad.
*   *Goal:* We want a somewhat uniform "grid" on flat surfaces. This ensures "Texel Density" is consistent when we paint.

#### D. "Avoid smaller than" (The Cleanup)
*   **Setting:** **Check this box.**
*   **Value:** `0.001` (1mm).
*   *Why:* Prevents microscopic sliver triangles that cause rendering errors.

---

## 4. Visual Verification

Before clicking OK:
1.  Look at the wireframe overlay in the viewport.
2.  **Edge Flow:** Do the lines follow the curves of the object? (Good)
3.  **Density:** Is the mesh "black" with lines? (Too dense -> increase Angle). Is it "white" with few lines? (Too blocky -> decrease Angle).

## 5. The Handoff
1.  Click **OK**.
2.  You now have `project_name_high.obj`.
3.  **Next Step:** Import this file into **Substance 3D Painter**.

---

## FAQ

**Q: Why not use the "Low Poly" export?**
A: For this workflow ("Datasheet Aesthetic"), we use a "Mid-Poly" workflow. We don't bake a high-poly sculpt onto a low-poly cage. We use the *same mesh* for both geometry and baking. This is less optimized for AAA games but **much faster** for solo developers.

**Q: My object is tiny/huge!**
A: Check your export units in Onshape (Export as Meters) vs Moi3D. If Moi3D sees it as tiny, change Moi3D options -> "Unit System" -> Meters.

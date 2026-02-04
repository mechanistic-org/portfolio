---
title: Badge Construction Strategy (Shelved)
slug: badge_strategy
status: Backlog
description: Documentation for Badge Construction Strategy (Shelved).
---
# Badge Construction Strategy

> **Status:** SHELVED (Dec 2025).
> **Context:** The "Badge" asset (Woven wire, bolts) was deemed too skeuomorphic/ornate for the current "Brutalist/Datasheet" direction. This document preserves the technical workflow for unwrapping/building it if we return to it.

---
## 1. The Text Strategy (Vector -> 3D)
Illustrator Text does not exist in the 3D world. Two choices:

*   **Path A: The Stamped Metal Look (Geometry)**
    *   **Workflow:** Export text from AI as DXF/DWG -> Import to Onshape sketch -> Extrude (0.2mm).
    *   **Pros:** Catches light physically. Looks "machined". **(Recommended)**.
    *   **Cons:** Higher poly count.
*   **Path B: The Silkscreen Look (Texture)**
    *   **Workflow:** Export text as high-res TRANSPARENT PNG (4K) -> Import as "Texture" in Substance -> Paint via Stencil.
    *   **Pros:** Zero polys. Sharp.
    *   **Cons:** Flat. Looks printed.

## 2. The Unwrap Strategy (Component by Component)

### A. The Twisted Wire (The Hardest Part)
*   **Challenge:** Woven metal texture on twisted mesh looks bad.
*   **The Cheat:** **Don't texture the braid pattern.**
    *   Since the *actual physical twists* are modeled (Onshape), use a **Basic Anodized Metal** material.
    *   Let the *Geometry* provide the "twist".
    *   **Unwrap:** Use "Smart UV Project" in Blender.

### B. The Bolts
*   **Geometry:** High-density cylinders.
*   **Unwrap:** Mark Seam on back (hidden) and circle seam under head.
*   **Material:** "Black Oxide Steel". Use Mesh Maps (Curvature) for dirt in hex socket.

### C. The EN Logo (The Hero)
*   **Unwrap:** Seam front/back faces. Unwrap side walls as strip.
*   **Material:** **Matte Forged Carbon**.
    *   **CRITICAL:** Enable **Tri-Planar Projection** in Substance. Ignores UV distortion.

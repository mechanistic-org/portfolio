---
title: "Vector Pipeline: The Blueprint Strategy"
slug: "vector_pipeline"
sidebar:
  group: "Workflows"
  order: 4
---
# Vector Pipeline: The Blueprint Strategy

**Objective:** Generate "Datasheet-Grade" technical drawings and wireframes from 3D geometry for use as high-fidelity SVG assets.

> **The "Blueprint" Aesthetic:**
> ErikNorris uses vector lines to convey precision. These are not "illustrations"; they are **schematics**.

---

## 1. The Source (Plasticity)

Plasticity is accurate; use it to generate the base curves.

### Step 1: Isolate & View
1.  **Isolate:** Select the target component. Hide everything else.
2.  **View:** Numpad `1`, `3`, or `7` for perfect Orthographic views.
3.  **Curve extraction:**
    *   Select edges manually OR use `Shift + D` to duplicate edges as curves.
    *   **Silhouette:** Use the `Silhouette` command to grab the outer boundary relative to the view.

### Step 2: Export SVGs
1.  **File -> Export -> SVG**.
2.  **Settings:**
    *   **Scale:** 1:1 (Critical).
    *   **Line Weight:** Match the "Wireframe" token weight (usually `1px` or `0.5px`).

---

## 2. The Refinement (Illustrator / Affinity)

Raw CAD output is messy. We need to "Productize" the lines.

### Layer Structure
*   **Layer 1: Construction (Guide Lines)**
    *   *Style:* Dashed, Opacity 30%. Color `#4B5563` (Steel).
    *   *Content:* Centerlines, bounds, movement axes.
*   **Layer 2: Geometry (The Object)**
    *   *Style:* Solid, `1.5px`. Color `#FFFFFF` (White) or `#2E5CFF` (Brand).
    *   *Content:* Visible hard edges.
*   **Layer 3: Annotations (The Data)**
    *   *Style:* JetBrains Mono, Uppercase, `12px`.
    *   *Content:* Dimensions, tolerances, material specs.

> [!TIP] THE "GHOST" FILL
> To make the schematic pop on dark backgrounds, create a filled shape of the silhouette behind the lines. Set it to `#000000` with **90% Opacity**. This blocks out background noise (grid lines) behind the object.

---

## 3. Web Implementation (Optimization)

### Optimization (SVGO)
Never ship raw Illustrator SVGs.
*   **Command:** `npx svgo input.svg -o output.svg --precision=2`
*   **Manual Fixes:** Ensure `preserveAspectRatio="xMidYMid meet"` is set.

### Usage in Astro
Embed directly for maximum control (CSS styling of paths).

```astro
---
import BlueprintIcon from '../assets/blueprints/portion_cup_side.svg?raw';
---
<div class="blueprint-container text-brand-primary">
  <Fragment set:html={BlueprintIcon} />
</div>
```

---

## 4. The "Holographic" Variant
For "Active" states, we apply the `animate-pulse` or specific CSS animations to the *Construction* layer lines to make the drawing feel "live".

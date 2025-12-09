---
title: "3D Asset Pipeline (SOP)"
slug: "workflow_3d"
sidebar:
  group: "Workflows"
  order: 3
---
# 3D Asset Pipeline (SOP)

**Objective:** Transform CAD (Onshape) into high-performance Web Assets (glTF/GLB) with "AAA" visuals.

> ** The Core Tunnel ("The Daily Driver")**
> `Onshape (Geometry)` -> `Plasticity (Mesher)` -> `Blender (UVs)` -> `Painter (Look)` -> `Web/GLB`.
> *Goal:* Keep this pipeline clean. Avoid "short-circuiting" the OpenGL standard.

## Concepts (The Colophon)
*   **"The Core Tunnel":** The optimized pipeline (Onshape -> Plasticity -> Blender -> Painter) defined above. It prioritizes *geometry* over *texture* short-cuts.
*   **"Pre-Bake Assembly":** The rule that variants (e.g., Horizontal vs Vertical layouts) must be assembled in CAD/Plasticity *before* paint. This ensures "Contact Shadows" (AO) are baked into the crevices, preventing the "Floating Sticker" look.
*   **"The Harvest":** The strategy of exporting vendor-agnostic maps (PNGs) alongside proprietary files, ensuring asset ownership independent of Adobe subscriptions.

---

## Phase 1: The Source (Geometry)

### A. The Generator (Onshape)
*   **Role:** Geometric Truth.
*   **Units:** Work in any unit, but **Export as Meters** if possible (or scale later).
*   **Format:** Export as **PARASOLID (.x_t)**.
*   **Assembly Strategy:**
    *   **Components:** Export individual parts.
    *   **Variants (Logo H/V):** Assemble **in Onshape**. Create explicit configurations (e.g., `Badge_Horizontal`, `Badge_Vertical`). Export as separate `.x_t` files.

### B. The Bridge (Plasticity)
*   **Role:** The Mesher.
*   **Workflow:**
    1.  **Import:** `.x_t` from Onshape.
    2.  **Triangulation:** None. Keep as N-Gons.
    3.  **Export:** `.fbx` or `.obj`.
        *   *Density:* 0.5 - 0.7.
        *   *Topology:* **N-Gons** (Critical for UV speed).

---

## Phase 2: The Map (Blender)

*   **Role:** UV Unwrapper.
*   **Action:**
    1.  Import `.fbx` from Plasticity.
    2.  **Select Sharp Edges:** Angle ~30 degrees.
    3.  **Mark Seams.**
    4.  **Unwrap:** Conformal method.
    5.  **Pack:** High margin (0.004) to prevent bleed.
    6.  **Export:** `.fbx` (Mesh applied, Selected Objects).

---

## Phase 3: The Artist (Substance Painter)

*   **Role:** The "Paint Booth".
*   **Setup:**
    *   **Resolution:** 4096 (Working), 2048 (Export).
    *   **Baking:** Always bake Mesh Maps (AO, Curvature) first.
*   **Material Strategy:**
    *   Use established Smart Materials (`EN_Matte_Carbon`, `EN_Titanium_Ceramic`).

> [!TIP] MAXIMIZATION TRACK: SAMPLER
> **The Digitizer:** Use Substance Sampler **NOW** to digitize real-world textures (photos of concrete, fabric, specific metals) into your permanent library. Capture reality while the subscription is active.

---

## Phase 3.5: The Export (Round-Trip)

> **Context:** You cannot export a clean, compressed GLB directly from Painter's "Export Textures" window efficiently. We use the "Round-Trip" method to ensure the best compression and geometry handling.

### Step 1: Export Maps (Painter)
1.  **File -> Export Textures (`Ctrl + Shift + E`)**.
2.  **Output Template:** `Spark AR Studio` (or any PBR MetalRough preset).
    *   *Why?* We just need the raw PNGs (BaseColor, ARM/ORM, Normal).
    *   *Note:* Ensure you have a standard "Generic PBR" preset or creating one that exports:
        *   `BaseColor` (sRGB)
        *   `Roughness` (Linear)
        *   `Metallic` (Linear)
        *   `Normal` (OpenGL)
        *   `Emissive` (sRGB) - if applicable
3.  **File Type:** `PNG` (8-bit is fine, 16-bit for Normals if you have banding).
4.  **Export** to a folder (e.g., `exports/matte_carbon_maps/`).

### Step 2: Re-Assembly (Blender)
1.  Open your **Unwrapped/UV'd** Blender file.
2.  Go to **Shading** tab.
3.  **Principled BSDF Setup:**
    *   **Base Color:** Connect `_BaseColor.png`
    *   **Metallic:** Connect `_Metallic.png` (Color Space: Non-Color)
    *   **Roughness:** Connect `_Roughness.png` (Color Space: Non-Color)
    *   **Normal:** Connect `_Normal.png` -> **Normal Map Node** -> BSDF Normal.
4.  **Verify:** Does it look like Painter? Good.

### Step 3: The Final Export (GLB)
1.  **Select Object.**
2.  **File -> Export -> glTF 2.0 (.glb)**.
3.  **Settings (The Web Standard):**
    *   **Include:** Selected Objects.
    *   **Transform:** +Y Up.
    *   **Geometry:**
        *   **UVs:** Yes.
        *   **Normals:** Yes.
        *   **Tangents:** Yes (Critical for Normal Maps).
    *   **Mesh:**
        *   **Compression:** **Draco** (Recommended).
            *   *Compression Level:* 6 (Balanced).
4.  **Save:** `EN_Logo_Matte.glb`.

---

## Phase 4: Output & Deployment

### A. Web Assets (GLB)
*   **Format:** `glTF Binary (.glb)`.
*   **Compression:** Draco (Recommended).
*   **Location:** `../quantum-assets/R2_STAGING/{slug}/` (Props) or `R2_STAGING/_site/` (Branding).
*   **Naming Convention (Branding):**
    *   **Schema:** `EN_{Asset}_{Material}_{Config}.glb`
    *   **Example:** `EN_Logo_MatteCarbon.glb`
        *   *Asset:* `Logo` (The Mark) or `Badge` (The Full Emblem).
        *   *Material:* `MatteCarbon` or `Titanium`.
        *   *Config:* Optional (e.g., `Flat`, `Curved`).

### B. Marketing Assets (Stager)
> [!TIP] MAXIMIZATION TRACK: STAGER
> **The Studio:** Use Substance Stager **NOW** to generate "Hero Marketing Shots" (high-res static renders) for headers and social media. Burn those render credits on high-fidelity "Virtual Photography".

---

## Appendix A: Material Recipes (v2)

### 1. Matte Forged Carbon (Manual Stack)
*   **The Look:** "Datasheet Grade" Chopped Tow. Sharp, holographic, dry.
*   **Method:** Manual Layer Stack (Do not use presets).
*   **The Recipe (`EN_Matte_Carbon_Manual`):**
    1.  **Layer 1 (Resin Base):**
        *   Fill Layer. Dark Grey (`#151515`). Roughness `0.55` (Matte).
    2.  **Layer 2 (Chips Geometry):**
        *   Fill Layer (Height `0.04`).
        *   Mask: **Crystal 1** Noise. Scale `85` (Tiny). Contrast `0.95`. **Tri-planar**.
        *   *Goal:* Physical, sharp-edged islands.
    3.  **Layer 3 (Flash/Physics):**
        *   Fill Layer (Roughness `0.25`, **Anisotropy Level** `0.95`).
        *   **Anisotropy Angle:** Driven by **Cells 4** (or White Noise). Scale `60`.
        *   *Goal:* Holographic light response that turns on/off as you rotate.
    4.  **Layer 4 (Edge Wear):**
        *   Generator: **Metal Edge Wear**.
        *   Wear Level `0.15` (Subtle). Contrast `0.8`. Grunge Scale `10`.
    5.  **Layer 5 (Dust):**
        *   Generator: **Dirt**. Level `0.1`. Only in deep cavities.
*   **Rendering (Iray):**
    *   **Background:** Clear Color (Transparent).
    *   **Lighting:** "Studio Tomoco" (Bright strip lights) to catch Anisotropy.
    *   **Exposure:** +1EV if dark.

### 2. Titanium Ceramic (Clinic)
*   **The Look:** Medical-grade, dense, weighted. Not "cheap plastic".
*   **Base:** "Ceramic Porcelain".
*   **Adjustments:**
    1.  **Color:** `#F1F1F4` (Titanium White).
    2.  **SSS (Subsurface Scattering):** **REQUIRED.** Turn this on. Ceramic allows light to penetrate slightly.
    3.  **Micro-Noise:** Add a "Powder Coat" or "Sandblast" normal map at massive scale (tiling 128x). It needs to feel like stone texture, not injection mold.

## Appendix B: Folder Structure (The Library)
Maintain a strict "Collector" hierarchy on your local drive:
```text
D:\Assets\ErikNorris_Lib\
├── 01_Sources\ (.sbsar)
├── 02_Smart_Materials\ (.spsm) -- [YOUR RECIPES]
└── 03_The_Harvest\ (.png) -- [VENDOR AGNOSTIC BACKUP]
```

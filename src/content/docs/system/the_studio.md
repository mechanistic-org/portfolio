---
title: "The Studio: Building & Customizing"
slug: the_studio
sidebar:
  group: Handbook
  order: 2
description: "Documentation for The Studio: Building & Customizing."
---

# The Studio: Building & Customizing

> **Role:** The Architect / The Visual Designer
> **Objective:** Create high-fidelity visual assets and assemble them into standard Templates.

## 1. The 3D Pipeline ("The Core Tunnel")

We prioritize geometry over texture hacks.
**Path:** `Onshape (Geo)` -> `Plasticity (Mesh)` -> `Blender (UV)` -> `Substance (Paint)` -> `Web (GLB)`.

### Step 1: Geometry (Onshape/Plasticity)

1.  **Export:** As Parasolid (`.x_t`) from Onshape.
2.  **Meshing (Plasticity):**
    - **Format:** OBJ.
    - **Topology:** Ngons (Critical for UV speed).
    - **Density:** `0.5` - `0.7`.
    - **Triangulate:** **OFF**.

### Step 2: The Map (Blender)

1.  **Import:** The OBJ from Plasticity.
2.  **Seams:** Select Sharp Edges (30 deg) -> Mark Seam.
3.  **Unwrap:** Conformal Method.
4.  **Pack:** Margin `0.004`.
5.  **Export:** FBX (Selected Objects).

### Step 3: The Paint (Substance Painter)

1.  **Bake:** Mesh Maps (AO, Curvature) at 2048/4096.
2.  **Material:** Use **Smart Materials** (`EN_Matte_Carbon`, `EN_Titanium`).
3.  **Export:**
    - **Template:** `glTF PBR Metal Roughness`.
    - **Format:** `glTF Binary (.glb)`.
    - **Compression:** Draco.

> [!TIP]
> **Anisotropy (Holographic Carbon):**
> To get the "Flash":
>
> 1. Use the `pbr-metal-roughness-anisotropy-angle` shader in Painter.
> 2. Export using the **EN_ORM** preset (Pack Aniso Angle into Gray Channel).
> 3. Ensure your GLB export has **Tangents** checked.

---

## 2. The Vector Pipeline (Blueprints)

We use SVG lines to create "Technical Blueprint" assets.

### Step 1: Curve Extraction (Plasticity)

1.  **View:** Numpad 1/3/7 (Orthographic).
2.  **Extract:** Select edges -> `Shift+D`. Or use `Silhouette` command.
3.  **Export:** SVG (Scale 1:1).

### Step 2: Refinement (Illustrator)

Layer structure for optimal "Schematic" look:

1.  **Construction:** Dashed lines, 30% opacity (Guides).
2.  **Geometry:** Solid lines, 1.5px (The Part).
3.  **Annotations:** JetBrains Mono, 12px (Dims).

### Step 3: Implementation

Embed raw SVG in Astro for CSS control:

```astro
import Blueprint from '../assets/blueprint.svg?raw';
<div class="text-brand-primary"><Fragment set:html={Blueprint} /></div>
```

---

## 3. The Project Template ("Machine Interface")

When creating a new case study in `src/content/docs/project/`, use these Scrollytelling components.

### Zigzag Grid (Product Showcase)

Alternates Text/Image for 4 distinct angles.

```astro
<ZigzagGrid
  items={[
    { title: "Front View", description: "...", image: "..." },
    { title: "Rear View", description: "...", image: "..." },
  ]}
/>
```

### Process Strip (Timeline)

Horizontal scrolling sequence for engineering steps.

```astro
<ProcessStrip
  steps={[
    { step: "01", title: "Ideation", image: "..." },
    { step: "02", title: "Tooling", image: "..." },
  ]}
/>
```

### Model Viewer (Interactive)

Standard GLB viewer.

```astro
<ModelViewer src="/assets/xbox/controller.glb" alt="Controller" />
```

---

## 4. Material Recipes

### Matte Forged Carbon

- **Base:** Dark Grey (`#151515`), Roughness 0.55.
- **Chips:** Height Map + Crystal Noise (Tri-planar).
- **Flash:** Anisotropy Level 0.95, driven by White Noise.

### Titanium Ceramic

- **Base:** White (`#F1F1F4`).
- **SSS:** Enabled (Subsurface Scattering).
- **Surface:** Large scale "Powder Coat" normal map.

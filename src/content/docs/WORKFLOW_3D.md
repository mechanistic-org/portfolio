---
title: "3D Asset Pipeline (SOP)"
slug: "workflow_3d"
sidebar:
  group: "Workflows"
  order: 3
---
# 3D Asset Pipeline (SOP)

**Objective:** Transform CAD (Onshape) into high-performance Web Assets (glTF/GLB) with "AAA" visuals and "Mobile" performance.

## 1. The Source (Onshape)
*   **Format:** Export as **PARASOLID (.x_t)** for best geometry retention, or **STEP** as fallback.
*   **Detail Level:** Suppress internal components (PCBs, fasteners, hidden gears) *before* export. We only need the "Skin".
*   **Units:** Meters (Standard for Web/Three.js/ModelViewer).

## 2. The Mesher (Blender / MOI3D)
*   **Goal:** Convert NURBS (CAD) to Polygons (Mesh).
*   **Target Polycount:**
    *   **Hero Assets:** < 50,000 tris.
    *   **Background/Props:** < 10,000 tris.
*   **UV Mapping:** Critical. Ensure non-overlapping UVs for light baking.
*   **Optimization:** Merge static meshes that share materials to reduce draw calls.

## 3. The Texture (Substance Painter)
*   **Template:** PBR - Metallic Roughness (Allegorithmic).
*   **Baking:** Bake Mesh Maps (AO, Curvature) from the high-poly to add definition to the low-poly.
*   **Export Preset:** **glTF PBR Metal Roughness**.
    *   **Texture Size:** 2048x2048 (2K) max. Use 1K for smaller props.
    *   **Format:** JPEG (lossy) for Color, PNG (lossless) for Normal/AO.

## 4. The Optimization (GLB)
*   **Draco Compression:** HIGHLY RECOMMENDED.
    *   Reduces file size by ~40-60%.
    *   *Tool:* `gltf-pipeline` (CLI) or Blender glTF Export settings ("Compression" checked).
*   **Output:** Single `.glb` binary file.

## 5. Deployment (R2)
*   **Naming:** `{project-slug}-model.glb` (Concept) or `{project-slug}-model-{variant}.glb`.
*   **Staging:** Place in `../quantum-assets/R2_STAGING/{slug}/`.
*   **Ingest:** Run `python ingest_data.py`.

## 6. ModelViewer Configuration
We use `<model-viewer>` with the following recommended settings for the "Datasheet" look:

```html
<model-viewer
  src="model.glb"
  exposure="1.0"
  shadow-intensity="1"
  shadow-softness="1"
  environment-image="neutral" <!-- or custom HDR -->
  camera-controls
  touch-action="pan-y"
  auto-rotate
></model-viewer>
```

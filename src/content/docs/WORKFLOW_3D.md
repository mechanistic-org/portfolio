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
*   **Export Units:** **Meters** (Select in Export Dialog).
    *   *Why:* WebGL treats `1.0` as `1 meter`. Exporting in `mm` (where `1.0` = `1mm`) results in 1000x giant models.
    *   *Workflow:* **Work in any units** (mm, inches, feet), **Export in Meters**.

## 2. The Bridge (Plasticity) [CRITICAL]
*   **Role:** The Translator. Converts "Mathematical Truth" (NURBS) into "Game Ready" Polygons.
*   **Primary Tool:** **Plasticity 3D** (Better Geometry, Modern Kernel).
*   **Secondary Tool:** **Blender** (UV Unwrapping).
*   **Protocol:** See [`SETUP_PLASTICITY_PIPELINE.md`](/src/content/docs/SETUP_PLASTICITY_PIPELINE.md) for the "Pro Workflow".
*   **Action:**
    1.  Import `.x_t` into **Plasticity**.
    2.  Use **Bridge** to send to **Blender**.
    3.  **Unwrap UVs** in Blender.
    4.  Export **.fbx** to Substance.

> [!NOTE]
> **Legacy Option:** MOI3D is still supported as a backup. See [`MOI3D_BRIDGE.md`](/src/content/docs/MOI3D_BRIDGE.md).

## 3. The Artist (Substance 3D Painter)
*   **Role:** Surface Reality. "The Paint Booth".
*   **Workflow:**
    1.  **Import:** Load the `.obj` from MOI3D.
    2.  **Bake Mesh Maps:** (Crucial) Generate AO, Curvature, and World Space Normals. This allows "Smart Materials" to know where edges and cavities are.
    3.  **Apply Smart Materials:** Use edge wear, dust, and scratches to sell the illusion of reality.
    4.  **Export:** **glTF PBR Metal Roughness**.
        *   **Texture Size:** 2048x2048 (2K) max.
        *   **Format:** JPEG (lossy) for Color, PNG (lossless) for Normal/AO.

## 3b. The Studio (Substance 3D Stager)
*   **Role:** Virtual Photography (Marketing Assets only).
*   **Usage:** Create high-res renders for Hero headers or social media.
*   **Warning:** **DO NOT** use Stager for the final web `.glb`. Its compression is inferior to the dedicated pipeline.

## 3c. The Digitizer (Substance 3D Sampler)
*   **Role:** Reality Capture.
*   **Usage:** Convert photos of real-world textures (e.g., custom carbon fiber) into seamless PBR materials for Painter.
*   **Library Strategy:** See [`SUBSTANCE_MAXIMIZATION_PLAN.md`](/src/content/docs/SUBSTANCE_MAXIMIZATION_PLAN.md) for the "Datasheet Aesthetic Shopping List" (Unlimited Downloads Strategy).

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

---

## 7. The Harvesting Protocol (Anti-Lock-In)
**Mandatory step to ensure asset ownership independent of Adobe Subscription status.**

### Rule: "Bake & Archive"
For every finished asset, you must generate a **Vendor-Agnostic Zip File** containing:
1.  **The Geometry:** `.obj` or `.fbx`.
2.  **The Maps (The Harvest):** Export textures as standard **PNG** (16-bit) or **TGA**.
    *   `BaseColor.png`
    *   `Normal.png` (OpenGL format for Web)
    *   `Roughness.png`
    *   `Metallic.png`
    *   `AO.png`
    *   `Height.png`

**Why?** These bitmaps are universal. They work in Blender, Three.js, Unity, Unreal, and Godot directly. They do not require an Adobe subscription to read.

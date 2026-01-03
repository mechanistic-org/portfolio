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
<img src="/images/3d-workflow/workflow-step-01.png" class="!float-right !ml-6 !mb-4 !w-2/5 rounded-lg shadow-lg" alt="Onshape Geometry Source" />
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
<img src="/images/3d-workflow/workflow-step-02.png" class="!float-left !mr-6 !mb-4 !w-2/5 rounded-lg shadow-lg" alt="Blender UV Mapping" />
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
<img src="/images/3d-workflow/workflow-step-03.png" class="!float-right !ml-6 !mb-4 !w-2/5 rounded-lg shadow-lg" alt="Substance Painter Layer Stack" />
*   **Setup:**
    *   **Resolution:** 4096 (Working), 2048 (Export).
    *   **Baking:** Always bake Mesh Maps (AO, Curvature) first.
*   **Material Strategy:**
    *   Use established Smart Materials (`EN_Matte_Carbon`, `EN_Titanium_Ceramic`).

> [!TIP] MAXIMIZATION TRACK: SAMPLER
> **The Digitizer:** Use Substance Sampler **NOW** to digitize real-world textures (photos of concrete, fabric, specific metals) into your permanent library. Capture reality while the subscription is active.

---

## Phase 3.5: The Export (Round-Trip)

### Option A: The "Express Lane" (Direct from Painter)
<img src="/images/3d-workflow/workflow-step-04.png" class="!float-left !mr-6 !mb-4 !w-2/5 rounded-lg shadow-lg" alt="Substance Painter Export Settings" />
> **Recommended for:** Quick tests, simple assets, and debugging "White Blobs".
> **Pros:** No Blender wiring, guaranteed valid GLB.
> **Cons:** Heavier files (no Draco compression), limited geometry control.

1.  **Selection:** In Painter, ensure your mesh is ready.
2.  **File -> Export Textures**.
3.  **Settings:**
    *   **Output Template:** `glTF PBR Metal Roughness`.
    *   **File Type:** `glTF Binary` (**NOT** png).
        *   *Note:* The dropdown that usually says "png" or "jpg" has a `glTF Binary` option at the bottom.
    *   **Size:** 4096.
4.  **Export:** This produces a ready-to-use `.glb` file.
5.  **Rename & Deploy:** Rename to `EN_Logo_MatteCarbon.glb` and overwrite your site file.

---

### Option B: The "Round-Trip" (Blender Optimized)
> **STOP.** Do not use a default preset. They often mess up alpha channels or color spaces.
> Create this preset **ONCE**, and use it forever.

1.  **Painter -> Export Textures (`Ctrl + Shift + E`)**.
2.  **Output Templates (Tab) -> Click `+` (New Preset).**
3.  **Name it:** `EN_ORM`.
4.  **Create 3 Output Maps:**
    *   **Map 1: RGB (sRGB)** -> Name: `$mesh_$textureSet_BaseColor`
        *   *Drag:* `Input Maps -> Base Color` to RGB.
        *   *Bit Depth:* **8 bits**.
    *   **Map 2: R+G+B (Linear)** -> Name: `$mesh_$textureSet_ORM`
        *   *Drag:* `Input Maps -> Ambient Occlusion` to **R**. (Select **Gray Channel**)
        *   *Drag:* `Input Maps -> Roughness` to **G**. (Select **Gray Channel**)
        *   *Drag:* `Input Maps -> Metallic` to **B**. (Select **Gray Channel**)
        *   *Bit Depth:* **8 bits**.
    *   **Map 3: RGB (RGB)** -> Name: `$mesh_$textureSet_Normal`
        *   *Drag:* `Converted Maps -> Normal OpenGL` to RGB. (Select **RGB Channels**)
        *   *Bit Depth:* **16 bits** (Crucial for smooth gradients).
    *   **Map 4: Gray (Linear)** -> Name: `$mesh_$textureSet_AnisoAngle`
        *   *Drag:* `Input Maps -> Anisotropy Angle` to **Gray**.
        *   *Bit Depth:* **8 bits**.
5.  **Settings (Tab):**
    *   **Output Template:** Select `EN_ORM`.
    *   **File Type:** `PNG`.
        *   **Bit Depth:** **16 bits**.
            *   *Note:* This makes files larger, but guarantees no banding. We can optimize to 8-bit later.
    *   **Size:** 2048 or 4096.
6.  **Export.**


1.  Open your **Unwrapped/UV'd** Blender file.
2.  Go to **Shading** tab.
3.  **Principled BSDF Setup (The Node Graph):**
    *   **Base Color:** Connect `_BaseColor.png` (Color Space: **sRGB**).
    *   **The ORM Map (CRITICAL WIRING CHECK):**
        *   **Zoom In:** Look at the gray "noodle" connections, not just where you think they go.
        *   **Green Dot (Middle)** -> Must plug into **Roughness** (#3).
        *   **Blue Dot (Bottom)** -> Must plug into **Metallic** (#2).
        *   *Common Bug:* If Green goes to Metallic, the material is inverted. Swap them.
    *   **Normal:** Connect `_Normal.png` -> **Normal Map Node** -> BSDF Normal.
        *   **CRITICAL SETTING:** Change the Image Texture node's *Color Space* from `sRGB` to **Non-Color**.
        *   *Why?* If left finding `sRGB`, Blender gamma-corrects the vector data. This bends your surface normals randomly, making a mirror look like "Matte Dust" because it scatters light everywhere.
        *   *Symptom:* "Force Gloss" command makes the model shiny-grey, but leaving textures on makes it flat-black. This confirms the geometry is smooth but the normal map is destroying the reflection.
    *   **Anisotropy (The Flash):**
        *   Set **Anisotropic** slider to **1.0**.
        *   **Rotation Map:** Connect `_AnisoAngle.png` -> **Anisotropic Rotation** socket.
        *   **CRITICAL:** Set Image Texture to **Non-Color**.

### Step 2.5: The Geometry Fix (Triangulation)
> **Context:** glTF requires triangles. If you export Quads with "Tangents" enabled, it will fail unless triangulated.
1.  **Select Object.**
2.  **Modifiers Tab (Blue Wrench):**
3.  **Add Modifier** -> **Generate** -> **Triangulate**.
    *   *Settings:* Default is fine.
    *   *Note:* You do not need to "Apply" it here. The exporter will do it.

### Step 3: The Final Export (GLB)
1.  **Select Object.**
2.  **File -> Export -> glTF 2.0 (.glb)**.
3.  **Settings (The Web Standard):**
    *   **Include:** Selected Objects.
    *   **Transform:** +Y Up.
    *   **Data -> Mesh (THE CHECKLIST):**
        *   [ ] **UVs:** Yes.
        *   [ ] **Normals:** Yes.
        *   [ ] **Tangents:** **YES** (Crucial! If missing, Normal map fails).
            *   *Note:* If this box is greyed out, you forgot the Triangulate modifier.
        *   [ ] **Vertex Colors:** **None** (Save space).
        *   [ ] **Apply Modifiers:** **YES** (Bakes the Triangulate modifier).
    *   **Mesh:**
        *   **Compression:** **None** (Unchecked for Debugging).
            *   *Note:* Draco can sometimes strip Tangents. We will re-enable it once the visuals work.
---

## Phase 4: The Final Polish (Anisotropy & Detail)

If your model looks solid but "flat" (missing the holographic flash), it is likely the **Shader** is set wrong in Painter.

<img src="/images/3d-workflow/workflow-step-05.png" class="!float-right !ml-6 !mb-4 !w-2/5 rounded-lg shadow-lg" alt="Web Viewer Final Result" />

1.  **Change Shader (CRITICAL):**
    *   Open **Shader Settings** (Sphere icon on the right).
    *   Click the top button (Instance Name).
    *   Search/Select: `pbr-metal-roughness-anisotropy-angle`.
    *   **Optimize Parameters:**
        *   **Specular Quality:** Set to `Very High (256 spp)`. *Crucial for seeing fine flake noise.*
        *   **AO Intensity:** `1.0` (Maximize cavity depth).
        *   **Horizon Fading:** `0.5` (Reduces edge darkening).
    *   *Why:* The default shader ignores anisotropy. This one enables the "Flash".
2.  **Verify Layers:**
    *   Ensure your Anisotropy Layer (e.g., `03.FLASH_ANISO`) has the `a lvl` channel **Active** and set to **1.0**.
    *   Ensure top layers (Dust/Wear) have `a lvl` **Disabled** so they don't overwrite it with 0.
3.  **Export (Recall Option A):**
    *   Template: `glTF PBR Metal Roughness`.
    *   File Type: `glTF Binary`.
4.  **Test:** The debug page should now say `Anisotropy Factor: 1` and you should see the flakes dancing.

## Phase 4: Output & Deployment

### A. Web Assets (GLB)
*   **Format:** `glTF Binary (.glb)`.
*   **Compression:** Draco (Recommended).
*   **Location:** `../ErikNorris-assets/R2_STAGING/{slug}/` (Props) or `R2_STAGING/_site/` (Branding).
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

## Appendix C: Troubleshooting (The Fix)

### 3. The "Shiny Black Void" (Web Viewer)
*   **Symptom:** Model looks perfect in Painter but renders as a shiny black blob in `model-viewer`.
*   **Cause 1 (Ghost Channel):** A `Coat` or `Clearcoat` channel exists in Painter (even if disabled).
    *   *Fix:* Delete the channel in Texture Set Settings.
*   **Cause 2 (The Alpha Trap):** The Base Color map has an Alpha channel (A=0) that the viewer interprets as "Transparent".
    *   *Fix:* Use the **EN_ORM** preset. Ensure Base Color is exported as **RGB** (No Alpha).

### 4. The "Whiteout" (Shader Crash)
*   **Symptom:** Model renders as a pure white silhouette (unlit).
*   **Cause:** Anisotropy is enabled in the shader, but **Tangent** data is missing from the glTF mesh.
*   **Fix:**
    1.  **Blender:** Add a `Triangulate` modifier.
    2.  **Export:** Check `Data -> Mesh -> Tangents`.
    3.  **Export:** Uncheck `Compression` (Draco can strip tangents).

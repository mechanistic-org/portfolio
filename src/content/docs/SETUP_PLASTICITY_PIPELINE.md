---
title: "Setup: The Plasticity Pipeline"
slug: "setup_plasticity"
sidebar:
  group: "System Manual"
  order: 11
---
# Setup: The Plasticity Pipeline

> **Objective:** Install and configure the "Pro Workflow" stack:
> `Plasticity (Geo)` -> `Blender (UV)` -> `Substance (Paint)`.

---

## 1. The Shopping List

### A. Plasticity 3D (The Modeler)
*   **Cost:** ~$149 (Indie License).
*   **Terms:** Perpetual (One-time). Commercial use OK (unless you hire >10 people).
*   **Download:** [plasticity.xyz](https://www.plasticity.xyz/)
*   **Action:** Buy & Install.

### B. Blender (The Bridge / UV Station)
*   **Cost:** Free (Open Source).
*   **Action:** Download the latest stable version from [blender.org](https://www.blender.org/).
*   **Role:** We use this *only* to unwrap UVs. Think of it as a utility, not a creative tool.

### C. The Plasticity-Blender Bridge (The Link)
*   **Cost:** Free (Included/Available with Plasticity).
*   **Download:** Usually found in your Plasticity account/download page or [GitHub](https://github.com/nkallen/plasticity-blender-addon).
*   **File:** It will be a `.zip` file. **DO NOT UNZIP IT.**

### D. Adobe Substance 3D Collection (The Paint Booth)
*   **Cost:** ~$50/mo (Subscription).
*   **Action:** Install **Substance 3D Painter** via Creative Cloud.

---

## 2. The Bridge Installation (Critical)

You must link Plasticity to Blender.

1.  **Open Blender.**
2.  Go to `Edit` -> `Preferences` -> `Add-ons`.
3.  Click **Install...** (Top Right).
4.  Select the `plasticity-blender-bridge.zip` file you downloaded.
5.  **Check the box** next to "Import-Export: Plasticity Blender Bridge" to enable it.
6.  Press `N` on your keyboard. A side panel appears. Look for the "Plasticity" tab.

---

## 3. The "Pro" UV Workflow (The Surgeon's Approach)
> **Context:** "Smart UV Project" is for amateurs. It creates thousands of islands and wastes 40% of your texture resolution. For "Datasheet Grade" assets, we use **Manual Seams**.

### Step 0: The "Golden Ratio" Export (Plasticity)
Before you even open Blender, you must export correctly.
1.  **Select Objects:** Select your finished model in Plasticity.
2.  **File -> Export -> Wavefront OBJ**.
3.  **Settings (The Recipe):**
    *   **Topology:** `Ngons` (CRITICAL. Do not use Tris or Quads).
    *   **Density:** `0.5` is standard. Go to `0.7` for hero shots, `0.3` for background props.
    *   **Min Width:** Unchecked (usually).
    *   **Triangulate:** **OFF**.
4.  **Why Ngons?**
    *   Blender "sees" an Ngon as a single flat face.
    *   Ngon = One Click Select (`Select Sharp Edges` works perfectly).
    *   Triangles = 10,000 bad decisions you have to click manually.

### Step 1: The Import & Prep
1.  **Open Blender:** Delete the default Cube.
2.  **Import:** `File` -> `Import` -> `Wavefront (.obj)` (Exported from Plasticity).
3.  **Reset Scale:** Select object -> `Ctrl + A` -> **Scale**. (CRITICAL: If you skip this, your UVs will be stretched).

### Step 2: Automated Seam Extraction
Plasticity gives us perfect hard edges. We use them.

1.  **Edit Mode:** Press `Tab`.
2.  **Edge Mode:** Press `2`.
3.  **Deselect All:** `Alt + A`.
4.  **Select Sharp Edges:**
    *   Go to `Select` -> `Select Sharp Edges`.
    *   *Settings (Bottom Left):* Set Angle to `30.0` degrees.
5.  **Mark Seams:** `Right Click` -> `Mark Seam`.
    *   *Result:* Your model should now look like a crazy quilt of red lines. This is good.

### Step 3: The Manual Cuts (The Art)
Sharp edges aren't enough. You need to "unfold" cylinders and rings.

1.  **Find Cylinders:** Look for pipes, holes, or screws.
2.  **Cut the Loop:** Select ONE edge running lengthwise along the cylinder (the "zipper").
3.  **Mark Seam:** `Right Click` -> `Mark Seam`.
4.  **Check Donuts:** If you have a ring (torus), you need a seam on the *inside* loop and a seam cutting *across* the ring.

### Step 4: Unwrap & Inspect
1.  **Select All:** Press `A`.
2.  **Unwrap:** Press `U` -> **Unwrap** (NOT Smart UV Project).
    *   *Note:* In the popup (bottom left), change Method to **"Conformal"** (Better for mech parts).
3.  **Check:** Go to the "UV Editing" tab.
    *   Do the islands look like recognizable parts? Good.
    *   Is there a giant mess? You missed a "zipper" cut on a cylinder. Find it, mark it, re-unwrap.

### Step 5: Pack & Optimize
1.  **Straighten:** Select messy grid-like islands -> `UV` -> `Align` -> `Straighten` (or use UV Squares addon if you have it).
2.  **Pack:** `UV` -> `Pack Islands`.
    *   *Margin:* Set to `0.004` (keeps a safe padding between parts).
    *   *Rotation:* Enable "Rotate" to fit them tetris-style.

> [!TIP] TROUBLESHOOTING: THE "TENT POLE" UV
> *   **Symptom:** One UV island is a mile-long thin stick, forcing everything else to be microscopic.
> *   **Cause:** A continuous "ribbon" of faces (usually a side wall or bevel) has no start or end.
> *   **Fix:**
>     1.  **Find the Ribbon:** Look for long, continuous strips in the 3D view.
>     2.  **Cut the Thread:** Select *any* vertical edge on that strip (cutting the ribbon in half).
>     3.  **Mark Seam.**
>     4.  **Re-Unwrap.**
> *   **Critical Check:** Ensure `Scale` is applied (`Ctrl+A` -> `Scale`) before unwrapping.

### Step 6: The Handoff (Export to FBX)
1.  **Select Your Object:** Press `A` in Object Mode. (Ensure the outline is ORANGE).
2.  **File -> Export -> FBX (.fbx)**.
3.  **Settings:**
    *   Limit to: **Selected Objects** (Check this!).
    *   Mesh: Apply Modifiers (Check this!).
4.  **Save:** `project_name_low.fbx`.

> [!WARNING] THE 4KB BUG
> If your FBX file is **4KB**, it is EMPTY.
> This means you had "Selected Objects" checked, but *nothing was selected*.
> **Fix:** Go back to Blender, click the object (Orange Outline), and export again.

---

### Step 7: Substance Import (The Truth)
1.  **File -> New**.
2.  **File:** Select your 980KB+ `.fbx`.
3.  **Template:** `PBR - Metallic Roughness Alpha-blend` (Standard for Web).
4.  **Settings (CRITICAL):**
    *   **Document Resolution:** `2048` (Standard) or `4096` (Hero).
    *   **Normal Map Format:** **OpenGL** (CRITICAL for Three.js/Web. DirectX is for Unreal).
    *   **Auto-unwrap:** **UNCHECK** (Trust your Blender UVs. Don't let Adobe ruin your seams).
    *   **Import Cameras:** **Uncheck** (We don't need them).
5.  **Click OK.**

### Step 8: The Bake
1.  **Texture Set Settings** (Tab on right) -> Scroll down to **Mesh Maps**.
2.  Click **Bake Mesh Maps**.
3.  **Output Size:** `2048`.
4.  **Uncheck:** `Thickness` (Usually not needed for hard surface, saves time).
5.  **Dial in AO:** Click `Ambient Occlusion`. Increase `Secondary Rays` to `256` for smoother shadows.
6.  **Click "Bake selected textures"**.
    *   *Result:* Your flat grey model should suddenly pop with edge wear and depth.

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

## 3. The "Minimal Blender" Workflow (Cheat Sheet)
*You do not need to learn all of Blender. You only need this exact sequence.*

### Step 1: The Import
1.  **Open Plasticity:** creating your model.
2.  **Open Blender:** Delete the default Cube.
3.  **In Blender (Plasticity Tab):** Click **"Refresh"** (or "Import"). Your model appears!

### Step 2: The Unwrap (The "Black Box" Solved)
We need to "skin" the mesh so Substance can paint on it.

**Method A: The "Lazy" Way (Auto-Unwrap)**
*   *Good for:* Quick prototypes, non-hero assets.
1.  Select object. Press `Tab` (Edit Mode). Press `A` (Select All).
2.  Press `U` -> Select **"Smart UV Project"**.
3.  Click OK. Done.

**Method B: The "Pro" Way (Seams)**
*   *Good for:* Hero assets, clean lines.
1.  Select object. Press `Tab`.
2.  **Select Sharp Edges:** `Select` -> `Select Sharp Edges`.
3.  **Mark Seams:** Right Click -> `Mark Seam` (Lines turn red).
4.  **Unwrap:** Press `A` (Select All) -> `U` -> **"Unwrap"**.

### Step 3: The Handoff
1.  **File -> Export -> FBX (.fbx)**.
2.  **Settings:**
    *   Limit to: **Selected Objects** (Check this!).
    *   Mesh: Apply Modifiers (Check this!).
3.  **Save:** `project_name_low.fbx`.

---

## 4. Final Step: Substance Painter
1.  Open Substance Painter.
2.  **File -> New**.
3.  **File:** Select `project_name_low.fbx`.
4.  **Document Resolution:** 2048.
5.  Click OK.
6.  **Bake Mesh Maps:** (Texture Set Settings -> Bake Mesh Maps).
    *   *Note:* Even though we only have one mesh, baking generates the "Curvature" map from the geometry itself, which drives the edge wear effects.

> **Ready?**
> Once installed, reply "Pipeline Installed". We will then run a test asset.

---
title: "Substance Maximization Plan"
slug: "substance_maximization"
sidebar:
  group: "System Manual"
  order: 12
---
# Substance Maximization Plan

> **Status:** **EPHEMERAL / CRITICAL**
> **Context:** We hold an active Adobe Substance 3D Collection subscription.
> **Directive:** Extract maximum permanent value (`.sbsar`, `.spsm`, `.png`) before the subscription window closes.

---

## 1. The Sampler Strategy ("The Digitizer")
**Goal:** Build a proprietary library of "Erik Norris Real World Materials."

### Targets
*   **Forged Carbon:** Scan actual chunks of leftovers.
*   **Machined Aluminum:** Scan raw 6061 stock with varying finishes (brushed, bead-blasted).
*   **3D Print Lines:** Scan PLA/PETG layer lines to create a "Prototyping Plastic" material.

### Protocol
1.  **Capture:** Phone camera (Raw/ProRES) or Mirrorless. Even lighting.
2.  **Process:** Drag into **Substance 3D Sampler**.
3.  **Tweak:** Remove lighting gradients (Delight). Make seamless.
4.  **Export:**
    *   **Format:** `.sbsar` (Archives the logic).
    *   **Maps:** 4K PNGs (Base, Normal, Roughness, Height, AO). *This is "The Harvest" â€” vendor-agnostic files.*

---

## 2. The Stager Strategy ("The Virtual Studio")
**Goal:** Generate "Hero Shots" that replace physical photography.

### The Problem
Physical photography is slow, requires setup, and dust is the enemy.

### The Solution
Use **Substance 3D Stager** to build a "Virtual Photo Studio" (`.ssg` file).
*   **Lighting:** Pre-set "Softbox" and "Rim Light" rigs.
*   **Cameras:** Fixed focal lengths (50mm, 85mm Macro).
*   **Action:** When a new project is modeled, drop the `.glb` into this Stager studio and hit render. Consistency is guaranteed.

> [!IMPORTANT] BURN THE CREDITS
> If the subscription includes "Cloud Rendering Credits," **USE THEM.** Render 8K turntables of your core portfolio pieces.

---

## 3. The Asset Library ("The Harvest")
Do not rely on the Creative Cloud library. It disappears when you stop paying.

**Download Strategy:**
1.  Go to the **Substance 3D Assets** web store.
2.  Filter by **"Hard Surface"** and **"Tech"**.
3.  **Download:**
    *   Vent patterns.
    *   Screw heads / Fasteners.
    *   Imperfection Maps (Fingerprints, Scratches).
4.  **Storage:** `D:\Assets\ErikNorris_Lib\01_Sources\`.

---

## 4. The Smart Material Archive
Your "Look" lives in `.spsm` files.

*   **Task:** Ensure `EN_Matte_Carbon_Manual` and `EN_Titanium_Ceramic` are saved as **Smart Materials** and exported to external storage.
*   **Check:** Can you apply these to a new mesh on a fresh machine *without* logging into Adobe?

---

## Exit Criteria
*   [ ] Proprietary materials digitized (Carbon, Alum, PLA).
*   [ ] "Virtual Studio" scene file backed up.
*   [ ] All Smart Materials export to disk.
*   [ ] 50+ Hard Surface alphas downloaded.

---
title: "Operations & Maintenance Handbook"
slug: "operations"
sidebar:
  group: "System Manual"
  order: 100
---

# ⚙️ Operations & Maintenance Handbook

**Status:** Active Protocol
**Role:** The "How-To" Manual for the Forensic Data Engine.

> **Directive:** This file contains the "Standard Operating Procedures" (SOPs) for maintaining the build complexity. If the build breaks, look here first.

---

## 1. The Forensics Suite (Audit Tools)

These tools explicitly hunt for data corruption ("Ghost Assets") and fragility.

- **The Jig (`npm run audit:frontmatter`)**
  - **Source:** `scripts/validate_manifest.ts`
  - **Function:** Bulk audits 120+ MDX files. Reports "Crash Failures" (Red) and "Quality Warnings" (Yellow) like "DEFAULT" titles.

- **Air Gap Enforcer (`npm run check:assets` - _Pending alias_)**
  - **Source:** `scripts/verify_asset_links.ts`
  - **Function:** Scans MDX vs. `public/` to find broken links.
  - **Rule:** If it finds a link in Markdown that doesn't exist on disk, it flags a "Ghost Asset."

- **The Power Move (`npm run test:visual`)**
  - **Source:** `scripts/visual_smoke_test.ts`
  - **Function:** Puppeteer snapshots of core pages.

- **The AEO Bridge (Deep Crawl Verification)**
  - **Protocol:** The "Direct Link" Law.
  - **Assumption:** AI Recruiters are lazy (Shallow Scan).
  - **Action:** You must spoon-feed specific deep-link URLs (e.g., `/projects/c24`) to forced the AI to read the forensic footer.
  - **Verification:** Use `curl` or `read_url_content` to verify "Dark Data" (e.g., "Banana Defect") is present in the raw HTML payload.

---

## 2. The Toolchain Trinity (Core Processing)

These scripts drive the "Forensic Data Factory."

- **Hydration Engine (`npm run content:hydrate`)**
  - **Source:** `scripts/hydrate_content.py`
  - **Function:** Injects NotebookLM "Bolus" data (JSON) into MDX Frontmatter.
  - **Protocol:** ALWAYS use with a target slug. `npm run content:hydrate -- --slug c24`. Never hydrate blindly.
  - **Trap:** Running without a slug risks overwriting custom frontmatter edits across 20+ projects.

- **Asset Refinery (`npm run assets:process`)**
  - **Source:** `scripts/process_assets.py`
  - **Function:** The Sovereign Pipeline. Resizes images (XL/LG/MD/SM) and converts Audio to WebP/MP3.
  - **Protocol:** Use `--force` if you replace an image with a newer version of the same size. `npm run assets:process -- --all --force`.

- **Schema Modernizer (`npm run content:modernize`)**
  - **Source:** `scripts/modernize_content.py`
  - **Function:** Mass-updates legacy content to the latest C24 Schema (e.g., adding `metrics` blocks).
  - **Use Case:** Bulk architectural refactors.

---

## 2. Troubleshooting: The Build (Astro/Vite)

### 🔴 "The Live Archive" Trap (Vite Parsing)

- **Symptom:** Build fails on a file in `src/pages/archive/` or `_backup/`, even though it's not linked in the app.
- **Cause:** Vite/Rollup analyzes the entire dependency graph of `src/pages`. If a "Dead" file imports a module that was moved or deleted (e.g., `../config` vs `../../config`), the build crashes.
- **Fix:** "Dead Code must still Compile." Fix the relative path or delete the file. Do not assume "Archive" means "Ignored."

### 🔴 "Duplicated Mapping Key" (YAML Error)

- **Symptom:** Build fails with `duplicated mapping key` in MDX frontmatter.
- **Context:** Occurs when `hydrate_content.py` or a merge conflict duplicates a block like `cast:` or `teamSize:`.
- **Protocol: The Full Scan.**
  - Do not just fix the error file. Audit ALL `src/content/projects/*.mdx`.
  - Use `scripts/repair_yaml_duplicates.py` (if available) or manual grep.
  - **Visual Check:** Look for `cast:` appearing twice in the same file.

### 🔴 "Nested Slot" Layout Trap (HUD)

- **Symptom:** Elements in the `right` slot appear inside the `center` slot, or layout collapses to the left.
- **Cause:** Double-wrapping a slot. `<div slot="center"><div slot="center">...</div></div>`.
- **Fix:** Flatten the DOM. Sibling slots must be direct children of the Container.

### 🔴 MDX Parsing Errors (Octal/JSX)

- **Symptom:** `MDXError: Unexpected character 0` or invalid JSX.
- **Cause:** Unquoted keys starting with numbers (`01_intro:`) or `<` symbols in body text.
  - Quote Keys: `"01_intro":`
  - Escape Brackets: `&lt;15kCOGS` or `less than 15k`.

### 🔴 "Deep HUD" Missing (Stability Protocol)

- **Symptom:** Project Page loads, but "Intelligence Grid" (Row 2 metrics) is empty or invisible.
- **Cause:**
  1.  **Silent Stripping:** Schema mismatch caused Zod to delete the `metrics` object.
  2.  **Slot Deletion:** `UniversalHUD` missing `<slot />`.
- **Protocol: The 4 Shields.**
  1.  **Run Checks:** `npm run audit:frontmatter` (Shield 2) + `npm run check:hud` (Shield 3).
  2.  **Verify Schema:** Ensure `content.config.ts` uses `metrics: z.any().optional()`.
  3.  **Verify Layout:** Check `UniversalHUD.astro` for the default `<slot />`.

---

## 3. Troubleshooting: The Platform (Cloudflare)

### ⚠️ "Sharp Missing at Runtime"

- **Symptom:** `Cloudflare does not support sharp at runtime.`
- **Fix:** In `astro.config.mjs`:
  ```js
  adapter: isProduction ? undefined : cloudflare({ imageService: "compile" }),
  ```

### ⚠️ "Ghost Folder" (404 on Static Assets)

- **Symptom:** New folders in `public/` return 404 locally.
- **Cause:** Stale `node.exe` process holding the port.
- **Fix:** `taskkill /F /IM node.exe`.

---

## 4. Visual Engineering Protocols

### The "Sovereign Color" Law

- **Source:** `src/config/color_registry.ts`
- **Protocol:** Never use CSV lookups. The Registry is the Truth.

### The "Iambic Cadence" (Animation)

- **Concept:** Animations must breathe.
- **Standard:** Duration 0.8s, Ease `easeInOut`. Avoid `linear` mechanical strobing.

### The "Fiche Scroll" Standard

- **Context:** Parallax containers.
- **Rule:** Use `.no-scrollbar` class to prevent double scrollbars (System + Container).

### The "Linear Gradient" Law (Tailwind 4.0)

- **Context:** CSS Gradients.
- **Rule:** Use `bg-linear-to-r` (Standard) instead of `bg-gradient-to-r` (Legacy). The legacy syntax triggers deprecation warnings in v4.

### The "Dead Code" Protocol (Museum Strategy)

- **Context:** Deleting unused components.
- **Rule:** Do NOT delete complex components (`SlideProjector.tsx`).
- **Action:** Move them to `D:\GitHub\eriknorris-archive`.
- **Why:** We preserve the "Red Gold" (Engineering Effort) even if it's no longer in production.

---

## 5. Asset Pipeline Standards

### The "numeric Bubble" Law

- **Context:** `process_assets.py` sorting.
- **Rule:** Folders inside `bubbles/` MUST be prefixed: `01_intro`, `02_architecture`.
- **Why:** Python sorts alphanumerically. `intro` comes after `architecture` without numbers, breaking the narrative arc.

### The "Fake SVG" Pivot

- **Context:** 3D rendered logos (`EN_logo_1200`).
- **Rule:** We accept high-res PNGs wrapped in SVG as the "Sovereign Asset" because the source is 3D geometry, not vector paths. Do not attempt to wireframe them.

### 🔴 "The Ghost Component" (Edit Not Reflecting)

- **Symptom:** You edit `Assembly.tsx` but the `/assembly` page never changes.
- **Cause:** Wrong file. The page route (`src/pages/assembly.astro`) likely imports a _different_ component (e.g., `ExplodedView.tsx`) than the one you are editing.
- **Fix:** ALWAYS check the `.astro` page import statements before debugging a React component.

### 🔴 "Schema Enum Trap" (Content Collection)

- **Symptom:** `Invalid enum value` for `tools` or `productionScale`.
- **Cause:** Trying to put "Vendor Names" (e.g., Sanmina, Yomura) into the `tools` array, which is strict Zod Enums (Software only).
- **Fix:** Move physical vendors to the `toolchain` string array (which is loose).

---

## 6. UI Architecture ("Air Traffic Control")

To prevent "Stacking Wars", we vertically partition the Z-space into strict flight levels.

### The Z-Index Map

| Layer             | Z-Index     | Usage                                                               |
| :---------------- | :---------- | :------------------------------------------------------------------ |
| **GOD TIER**      | `9999`      | Critical Debug Overlays, Critical Error Modals, Mouse Cursors       |
| **ORBIT**         | `1000+`     | Full Screen Menus (Command Palette `z-[1001]`), Modals              |
| **STRATOSPHERE**  | `500-999`   | Tooltips, Popovers, Dropdowns                                       |
| **HIGH ALTITUDE** | `100`       | Sticky Headers, Top HUDs, Navigation Bars                           |
| **CRUISING**      | `50`        | Floating Action Buttons (FABs), Toast Notifications                 |
| **LOW ALTITUDE**  | `10-40`     | Sticky Section Headers (`z-10`), Interactive Sticky Stages (`z-40`) |
| **GROUND**        | `1`         | Standard interactive elements                                       |
| **SUBTERRANEAN**  | `0` or `-1` | Backgrounds, Noise Layers, Canvas (Three.js)                        |

**Rules:**

- **Never** use arbitrary numbers (e.g., `z-53`). Stick to the tiers.
- **Top HUD:** Currently `z-[9999]` to override legacy Nav issues, but targeted for **HIGH ALTITUDE**.

---

## 7. Operational Utilities (Legacy/Maintenance)

### `scripts/setup_workspace.py` (The Factory)

- **Function:** Initializes the local directory structure (`~/ErikNorris_Workspace`) based on `Main.csv`.
- **Use Case:** Onboarding a new machine or re-paving the environment.

### `scripts/refine_skills.py` (The Balancer)

- **Function:** Generates unique skill profiles for projects to prevent "Radar Chart Duplication".
- **Output:** Overwrites `data_source/Skills.csv`.

### `scripts/generate_content.py` (The Writer)

- **Function:** Generates placeholder "Narrative STAR" case studies for projects that lack manual content.
- **Output:** Creates files in `data_source/manual_content/`.

---

## 8. Troubleshooting: Visual Engineering (Stream A)

### 🔴 "Left Bias" Nav Trap (HTML Structure)

- **Symptom:** Right-side icons shift left or center, ignoring `justify-end`.
- **Cause:** A missing closing `</div>` in a previous slot (e.g., Center) captures the Right slot as a child.
- **Fix:** Verify `Nav.astro` structure. Use **CSS Grid** (`grid-cols-[1fr_auto_1fr]`) in `UniversalHUD` to enforce isolation.

### 🔴 "Ghost Starfield" (Transparency)

- **Symptom:** Starfield is enabled (`starfield={true}`), but the screen is black.
- **Cause:** `bg-black` or `bg-neutral-950` classes on the `body` or wrapping `div` sit at Z-1, obscuring the Z-0 Canvas.
- **Fix:** Set container backgrounds to `bg-transparent` to reveal the void.

### ⚠️ "Vite EPERM Lock" (Windows)

- **Symptom:** `Error: EPERM: operation not permitted, rename` during `npm run dev`.
- **Fix:** Restart the terminal.

---

## 9. Data Viz Engineering (D3/React)

### 🟢 "The Hover Trap" (Interaction Logic)

- **Context:** `ResVizSwarm.tsx` (Physics Engine).
- **Problem:** Moving from a node to a distant UI element (like a Console) causes the selection to drop if the cursor passes through empty space.
- **Solution: The Spatial Diode.**
  - **Logic:** If `Cursor X > Node X` (Moving Right), HOLD selection indefinitely.
  - **Code:** `const isToTheRight = x > node.x! + radius * 0.5;`
  - **Why:** Creates an "Infinite Bridge" to the right-side UI.

### 🟢 "The Console Shield" (Event Shielding)

- **Context:** Overlaid UI components (Console, HUD).
- **Problem:** Hovering a UI element triggers `mouseleave` on the canvas, clearing selection.
- **Solution:** Freeze State.
  - **Logic:** `if (isConsoleHovered) return;` in the physics loop.
  - **Result:** The visualization "pauses" its interactive state while you use the overlay.

### 🔴 "ResViz Stale Closure" (React/D3)

- **Symptom:** `CRITICAL: Active Node NOT FOUND`.
- **Cause:** `useMemo` or `useEffect` missing dependencies (e.g., `[rawNodes]`), causing the D3 simulation to reference an old array pointer.
- **Fix:** Audit dependency arrays strictly.

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

## 1. The Toolchain Trinity (Core Scripts)

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
- **Fix:**
  - Quote Keys: `"01_intro":`
  - Escape Brackets: `&lt;15kCOGS` or `less than 15k`.

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

---

## 5. Asset Pipeline Standards

### The "numeric Bubble" Law

- **Context:** `process_assets.py` sorting.
- **Rule:** Folders inside `bubbles/` MUST be prefixed: `01_intro`, `02_architecture`.
- **Why:** Python sorts alphanumerically. `intro` comes after `architecture` without numbers, breaking the narrative arc.

### The "Fake SVG" Pivot

- **Context:** 3D rendered logos (`EN_logo_1200`).
- **Rule:** We accept high-res PNGs wrapped in SVG as the "Sovereign Asset" because the source is 3D geometry, not vector paths. Do not attempt to wireframe them.

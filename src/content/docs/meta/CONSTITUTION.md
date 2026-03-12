---
title: "Project Constitution"
description: "The highly compressed invariant core, manifesto, and operations."
slug: "constitution"
sidebar:
  group: "Meta-Portfolio"
  order: 1
---

﻿---
title: "Project Manifesto"
description: "The core principles, laws, and directives governing the ErikNorris portfolio."
slug: "manifesto"
sidebar:
  group: "Meta-Portfolio"
  order: 2
---

# Project Manifesto

**Role:** High-Performance Mechanical Engineering Portfolio
**Stack:** Astro v5, React (Recharts), Python (Native CSV), Tailwind v4
**State:** V1.0 Production (Stable)

## ðŸ›‘ Core Directives (Non-Negotiable)

- **Manual Override:** If a file exists at `data_source/manual_content/{slug}.md`, the script injects **THAT** text into the MDX body.
- **Workflow:** To write a Case Study, create the markdown file in `manual_content/`, then run the script.
- **The Creative Matrix:** To avoid generic AI content, we employ a "Creative Matrix" for content generation. This maps specific Employers/Clients to specific Engineering Domains (e.g., Kaleidescape -> Thermal Management, Acoustics). This ensures that even auto-generated content respects the historical context of the work.

### 4. Physical Asset Law

We do not map assets in JSON. We place them physically in the file system.

- **Staging:** `R2_STAGING/{slug}/` (Local source for uploads)
- **Production:** `https://assets.eriknorris.com/{slug}/` (Remote R2 bucket)
- **Git Rule:** We **NEVER** commit large assets to the repo. `R2_STAGING` is ignored. The R2 Bucket is the Source of Truth for binary blobs.
- **Standard Files:**
  - `hero.png` (Cover Image)
  - `model.glb` (3D Model)
  - `*.pdf` (Documentation/Specs)
  - `gallery/*.{png,jpg}` (Gallery Images)

### 5. The Law of Zero-Runtime Visualization

If a chart doesn't need to change after page load, it should be an image.

- **Principle:** We prefer build-time SVG generation (Matplotlib) over client-side JS libraries (Recharts).
- **Benefit:** Faster LCP, no hydration errors, and perfect "Datasheet" aesthetics.

### 6. Respect the User's Time

We removed the forced "Matrix Boot Sequence" on initial load because it delayed access to content.

- **Principle:** Cool effects should be **opt-in** (like the Restart button), not mandatory roadblocks.
- **Rule:** Never block the main thread or the view for purely cosmetic reasons.

### 7. The Law of Narrative Impact

We do not just list specs; we tell the engineering story.

- **Framework:** Use the **Narrative STAR** method (The Challenge -> Engineering Approach -> Impact) for manual content.
- **Style:** Avoid literal "Situation/Task/Action/Result" labels. Use engaging, project-specific headings that guide the reader through the problem-solving journey.
- **Goal:** Bridge the gap between a technical datasheet and a compelling case study.
- **Practice:** We explicitly define an `impact` field in the frontmatter to ensure the "Result" is the first thing a recruiter sees, enforcing the "BLUF" (Bottom Line Up Front) principle for engineering case studies.

### 8. Honest Construction

We show the seams.

- **Principle:** The "Construction Badge", "Debug Mode", and "Build Stats" are features, not bugs.
- **Why:** We are engineers. We value the machine as much as the output.

### 9. The Meta-Portfolio

The site must document itself. Every major feature (AR Viewer, Build Timer, Print Mode) is an engineering project worthy of a case study. We do not hide the machinery; we celebrate it in the `/colophon`.

### 6. The Law of Hybrid Assets

**"Human Eye, Machine Hand."**
We do not rely on build-time plugins to guess how an image should look. Art direction (color, crop, tone) is a human task performed in professional tools (Lightroom). Optimization (compression, formatting, resizing) is a machine task performed by scripts. The two never overlap.

### 10. The Law of Robustness

**"Works on my machine" is not a valid defense.**

- **Principle:** We build for the hostile environment (CI/CD), not the comfortable one (Localhost).
- **Practice:** We use strict relative paths, enforce case sensitivity in Git, and prefer "Nuclear Renames" over subtle fixes when resolution errors occur.

### 11. The Law of Data Density (The Cockpit)

**"Empty space is wasted space."**

- **Context:** For the Dashboard (`/resume/dashboard`), we embrace the "747 Cockpit" aesthetic.

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
  - **Function:** Injects "Three Vector" Mining data (Narrative, Complexity, Entropy) into MDX and **Sidecars** (`_entropy.json`). Auto-Generates `PROJECT_INDEX.md`.
  - **Protocol:** ALWAYS use with a target slug. `npm run content:hydrate -- --slug c24`. Never hydrate blindly (unless regenerating the Index, in which case use `--force`).
  - **Trap:** Running without a slug risks overwriting custom frontmatter edits across 20+ projects.

- **Asset Refinery (`npm run assets:process`)**
  - **Source:** `scripts/process_assets.py`
  - **Function:** The Sovereign Pipeline. Resizes images (XL/LG/MD/SM) and converts Audio to WebP/MP3.
  - **Protocol:** Use `--force` if you replace an image with a newer version of the same size. `npm run assets:process -- --all --force`.

- **Schema Modernizer (`npm run content:modernize`)**
  - **Source:** `scripts/modernize_content.py`
  - **Function:** Mass-updates legacy content to the latest C24 Schema (e.g., adding `metrics` blocks).
  - **Use Case:** Bulk architectural refactors.

- **Reverse Hydration (`npm run content:hydrate -- --reverse-json`)**
  - **Source:** `scripts/hydrate_content.py`
  - **Function:** Backports MDX War Stories (Manual Edits) to JSON Dump files.
  - **Protocol:** Run after manually editing "Gold" content in MDX to save it to the Source of Truth.
  - **Output:** Updates `notebook_dumps/{slug}.json`.

- **Sanitation Squad (`scripts/cleanup_unused_vars.py`)**
  - **Function:** Parses `astro check` output to strip `ts(6133)` unused variable warnings.
  - **Protocol:** Run `npx astro check > check_output.txt` first. Then run script.
  - **Watcher:** Creating broken imports? Run `scripts/fix_broken_imports.py` immediately after.

- **Schema Investigator (`scripts/audit_metrics.py`)**
  - **Function:** Audits MDX files for Law XXXIX Violations (Schema Separation).
  - **Protocol:** Run `python scripts/audit_metrics.py` before committing.

- **Schedule Forensics Pipeline (`scripts/convert_mpp.py`)**
  - **Function:** Converts legacy Microsoft Project (`.mpp`) files to Forensic Text (`nlm_optimized_schedules.txt`).
  - **Dependencies:** Requires Java (OpenJDK 17) and `mpxj`.
  - **Protocol:**
    1.  Place `.mpp` files in `schedules/[client_name]`.
    2.  Run `python scripts/convert_mpp.py`.
    3.  Run `python scripts/format_schedules_nlm.py` to tokenize for AI ingestion.
  - **Output:** `nlm_[client].txt` (for NotebookLM) and `curtis_task_volatility.csv` (for Dashboard).

- **Validation Extractor (`extract_cmf.py` / `extract_noon.py`)**
  - **Source:** `scripts/extract_cmf.py` & `scripts/extract_noon.py` (in the `mechanistic` repo)
  - **Function:** Parses messy, deeply-nested manufacturing Excel sheets (like Foxconn FIH test plans) into strict JSON payloads.
  - **Protocol:** Enforces the "MOHO Sanitization". It aggressively replaces legacy codenames (Bazooka, Locoroll) with "Device" and enforces universal `MOHO-` ID prefixes.

---

## 2. Troubleshooting: The Build (Astro/Vite)

### 🔴 "The Live Archive" Trap (Vite Parsing)

- **Symptom:** Build fails on a file in `src/pages/archive/` or `_backup/`, even though it's not linked in the app.
- **Cause:** Vite/Rollup analyzes the entire dependency graph of `src/pages`. If a "Dead" file imports a module that was moved or deleted (e.g., `../config` vs `../../config`), the build crashes.
- **Fix:** "Dead Code must still Compile." Fix the relative path or delete the file. Do not assume "Archive" means "Ignored."

### 🔴 "AXObjectRoles" Runtime Error (Vite Bubbling)

- **Symptom:** Browser Console Explodes with `SyntaxError: The requested module ... does not provide an export named 'AXObjectRoles'`.
- **Context:** `eslint-plugin-jsx-a11y` leaks a CommonJS dependency (`axobject-query`) into the client bundle.
- **Fix:** Force Vite to pre-bundle it.
  ```js
  // astro.config.mjs
  optimizeDeps: {
      include: ["axobject-query"],
  },
  ```

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
- **Note (Feb 2026):** `vite-plugin-mdx` specifically crashes on `<` followed by a **digit** (e.g. `<10min`). Run `scripts/fix_mdx_syntax.py` to sanitize.

### 🔴 "The Edge Runtime Trap" (Node.js Modules)

- **Symptom:** Build fails with `[vite:resolve] Automatically externalized node built-in module "node:fs"`.
- **Context:** Cloudflare Workers do not support Node.js APIs (`fs`, `path`).
- **Fix:**
  1.  **Gate Logic:** Use `if (import.meta.env.DEV) { ... }`.
  2.  **Vite Ignore:** Use `/* @vite-ignore */` on dynamic imports: `await import(/* @vite-ignore */ "node:fs")`.
  3.  **Refactor:** Move logic to a build script if possible. Do not import `fs` in runtime components.

### 🔴 "MDX Regression" (Hydration Overwrite)

- **Symptom:** You fixed an MDX error manually, but it returned after running `hydrate_content.py`.
- **Cause:** The Script is the Source of Truth. If the bug exists in `notebook_dumps/c24.txt`, it will overwrite your manual fix in `index.mdx`.
- **Fix (Law XVIII):**
  1.  **Grep the Source:** `grep "<" notebook_dumps/c24.txt`
  2.  **Escape Upstream:** Change `&lt;0.5mm` to `\<0.5mm` in the `.txt` file.
  3.  **Re-Hydrate:** Run the script to propagate the fix safely.

### 🔴 "The EEXIST Directory Trap" (Static Prerender)

- **Symptom:** Astro build throws `EEXIST: file already exists, mkdir 'dist/<route>'` during the static prerendering phase.
- **Cause:** A raw binary or static file in the `public/` directory shares the exact same name as your destination Astro route folder (e.g., a file named `public/dfmea` colliding with `src/pages/dfmea/index.astro`).
- **Fix:** Remove or rename the colliding string in the `public` folder so it doesn't block the static HTML generator from creating the route directory.

### 🔴 "The Build Log Mask" (PowerShell Exception)

- **Symptom:** Fatal `npm run build` errors manifest as unreadable, truncated, or masked PowerShell exceptions (`NativeCommandError`).
- **Cause:** PowerShell corrupts massive `stderr` streams typical in JavaScript bundlers.
- **Fix:** Bypass PowerShell's `stderr` parsing by executing the build via CMD and piping output entirely to a text file: `cmd.exe /c "npm run build > build_log_cmd.txt 2>&1"`.

### 🔴 "Hook Violation" White Screen

- **Symptom:** Page renders white or component fails silently. Console says `Rendered fewer hooks than expected`.
- **Cause:** Conditional `return null` placed _before_ `useEffect` or `useState`.
- **Fix:** Move all conditional returns to the **bottom** of the component, after all hooks are initialized. (Ref: `SonicHeartbeat.tsx` fix).

### 🔴 "Unstyled Route" Trap

- **Symptom:** Specific route (`/projects/base`) renders as raw HTML while others work.
- **Cause:** Schema validator (Zod) rejects data _silently_ at the Layout level, causing the CSS bundle injection to fail for that specific page generation.
- **Fix:** Rigorous line-by-line schema match against a known working file (`c24`). Watch out for `links: []` vs `links: null`.

### 🔴 "Deep HUD" Missing (Stability Protocol)

- **Symptom:** Project Page loads, but "Intelligence Grid" (Row 2 metrics) is empty or invisible.
- **Cause:**
  1.  **Silent Stripping:** Schema mismatch caused Zod to delete the `metrics` object.
  2.  **Slot Deletion:** `UniversalHUD` missing `<slot />`.
- **Protocol: The 4 Shields.**
  1.  **Run Checks:** `npm run audit:frontmatter` (Shield 2) + `npm run check:hud` (Shield 3).
  2.  **Verify Schema:** Ensure `content.config.ts` uses `metrics: z.any().optional()`.
  3.  **Verify Layout:** Check `UniversalHUD.astro` for the default `<slot />`.

  4.  **Verify Layout:** Check `UniversalHUD.astro` for the default `<slot />`.

### 🔴 "Schema Validation" (Metric Mix)

- **Symptom:** `InvalidContentEntryDataError: metrics.quotes`.
- **Cause:** Mixing Objects (Metrics) with Strings (Forensics).
- **Fix:** Run `python scripts/hydrate_content.py --slug [slug] --force` to auto-migrate.

### 🔴 "The Grep Trap" (Windows)

- **Symptom:** `grep` not found in PowerShell.
- **Fix:** Use Python scripts (`scripts/audit_metrics.py`) or `Select-String`. Do not rely on bash tools in docs.

### 🔴 "The Watcher Trap" (Windows Junctions)

- **Symptom:** `npm run dev` hangs or OOMs immediately on startup.
- **Cause:** Vite/Rollup Watcher on Windows chokes on large Junctions (even ~1700 files) if they contain recursion or complex trees (`_site` inside `R2_STAGING`).
- **Fix:**
  1.  **Isolate:** Config `astro.config.mjs` to `ignored: ["**/public/assets/**"]`.
  2.  **Verify:** If ignoring fails, you must DELETE the Junction and use **Direct External Read** (modifying `[...path].ts`) or debug the folder structure for loops. Do not just restart the server.

### 🔴 "The Ghost Duplicate" (Data Harvesting)

- **Symptom:** Ghost duplicate entries appearing in Python script harvest outputs (e.g., two "Makeline" projects).
- **Cause:** Two different slugs (e.g., `backsplash` and `makeline`) share the exact same `title: Hyphen Makeline` in their MDX frontmatter.
- **Fix:** Ensure frontmatter titles are strictly unique and descriptive. Simple extraction scripts group by exact title keys unless specifically mapped.

### 🔴 "The Memory Leak Crash" (60GB Leak)

- **Symptom:** `Node.js` consumes 100% RAM. Site does not load. Vite/Watcher crashes.
- **Cause:** A local `public/assets` directory was created (often accidentally by LLM generation scripts defaulting to web standards) or contains a recursive Junction mapping to `R2_STAGING`.
- **Fix:** Ensure a local `public/assets` directory **NEVER** exists. All assets must be served via the `[...path].ts` Virtual Bridge from `R2_STAGING`. Delete local `public/assets` immediately. Do not attempt to symlink.

### 🔴 "The Split Brain" (Link Rot)

- **Symptom:** Half the site loads images, half 404s.
- **Cause:** Mixed usage of `/assets/r2/` (Legacy) and `/assets/` (Modern).
- **Fix:** **Standardize immediately.** Run a global find/replace to enforce `/assets/`. Do not support dual paths.

### 🔴 "The Connection Refused" Trap (Vite Proxy Concurrency)

- **Symptom:** Browser throws `net::ERR_CONNECTION_REFUSED` for local images (like gallery thumbnails), but a single `curl` or `Invoke-WebRequest` works fine.
- **Cause:** The Node Event Loop is blocked. The `[...path].ts` virtual bridge was dynamically executing `(await import("node:fs"))` inside the GET handler for _every_ incoming request. When a page requests 50 images at once, the 50 simultaneous synchronous module evaluations choke the Vite event listener.
- **Fix:** Cache dynamic Node API imports at the module level (Singleton pattern: `let devFs = null; if (!devFs) devFs = await import(...)`) so they only evaluate once per worker lifecycle, freeing the Event Loop.

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

### ⚠️ "The Asset Mirage" (Dev vs Live Divergence)

- **Symptom:** Audio/Image works in `npm run dev` (Localhost) but returns 404 on Production.
- **Cause:** Local filesystem resolution (Symlinks) works, but the Asset Pipeline failed to upload the file to R2 or the `public` folder commit was incomplete.
- **Fix:** Verify `public/assets/r2` contents. If missing, manually stage the asset in `R2_STAGING` and run `process_assets.py --force`.

### ⚠️ "The Node.js Module Trap" (Worker Bundle)

- **Symptom:** Build warns `[vite:resolve] Automatically externalized node built-in module "node:fs"`.
- **Cause:** Static imports (`import fs from "node:fs"`) or ungated runtime usage (`fs.readFileSync`) in Astro components being bundled for Cloudflare Workers.
- **Fix:** Use dynamic imports (`await import("node:fs")`) inside `try/catch` blocks and gate runtime logic with `if (import.meta.env.DEV)` so it is dead-code-eliminated from the production worker.

### ⚠️ "The Content Regression Trap" (Ready State)

- **Symptom:** Body text (Forensic Report) is present in `.mdx` but missing from the rendered page ("Ready State is GONE").
- **Cause:**
  1.  **Layout Logic:** `DeepDiveRenderer` or `ForensicDossier` might conditionally hide the `<Content />` slot.
  2.  **Mode Mismatch:** `presentation_mode: deep_dive` might assume a "Visual Only" experience.
- **Fix:** Audit `Hyperspace.astro` to ensure `<Content />` is always rendered, or strictly define where it lives (Drawer vs Main).

### ⚠️ "The Schema Trap" (Missing Fields)

- **Symptom:** Build fails with `Property 'events' does not exist` or data missing in HUD.
- **Cause:** `src/content.config.ts` Schema definition does not match the Hydrated Data or Props Interface.
- **Procotol:** The Trinity must match:
  1.  **Hydration:** `hydrate_content.py` (Injects Data).
  2.  **Schema:** `content.config.ts` (Validates Data).
  3.  **UI:** `ForensicHUD.astro` (Renders Data).
- **Fix:** Update `content.config.ts` immediately after patching hydration logic.

### ⚠️ "The Ghost Admonition" (Legacy Leak)

- **Symptom:** User reports "Admonitions are back," but `grep` shows no `<Admonition>` tags in the file.
- **Cause:**
  1.  **Render Injection:** A component (`Markdown` renderer) might be injecting default content.
  2.  **File Confusion:** Inspecting `index.mdx` while the system reads `_index.mdx` or `forensic_report.md`.
- **Protocol:** Trust `grep` but verify the _rendered_ HTML source.

### ⚠️ "MessageChannel is not defined" (React Worker Crash)

- **Symptom:** Cloudflare Deployment fails with `Uncaught ReferenceError: MessageChannel is not defined`.
- **Cause:** The Worker bundle includes the _Browser_ build of `react-dom/server`, which relies on `MessageChannel` (scheduler). Workers require the _Edge_ build.
- **Fix:** Alias the import in `astro.config.mjs` (Conditionally!):
  ```js
  resolve: {
    alias: {
      // ONLY apply in Production to avoid breaking Local Dev (Node)
      ...(isProduction ? { "react-dom/server": "react-dom/server.edge" } : {}),
    },
  },
  ```

### ⚠️ "The Ghost Filter" (Project Shows 'Archived')

- **Symptom:** You hydrated the project, but the UI shows "PROJECT DATA: This project is currently archived."
- **Cause:** `targets: []` in Frontmatter. The Router filters it out of the Main Site, falling back to the Knowledge Graph Placeholder.
- **Fix:** Set `targets: ["main"]` in `index.mdx`.

### ⚠️ "The Void Mask" (Invisible HUD)

- **Symptom:** `ForensicDossier` is mounted (logs firing) but invisible.
- **Cause:** `Hyperspace` Intro Layer (`z-50`) occludes the Dossier if Z-Index is weak or Tab is closed.
- **Fix:**
  1.  **Force Z-Space:** Use `z-[60]` on the Dossier Container.
  2.  **Auto-Open:** Ensure `Tabs` has a `defaultValue` (e.g., "cast") calculated from props.

---

## 4. Visual Engineering Protocols

### The "Native Fallback" Protocol (Feb 2026)

- **Context:** Missing physical assets in Dev/CI (Air Gap).
- **Rule:** UI components (`ProjectCard`, `ProjectLayout`) must implement a designated "NO VISUAL DATA" state (Wireframe/SVG).
- **Constraint:** Do not rely on physical `placeholders/tech-1.jpg`. We deleted them to force architectural purity.

### The "Virtual Bridge" Standard (Law I)

- **Context:** `public/assets`.
- **Rule:** This folder must NOT exist locally. It is virtualized by `src/pages/assets/[...path].ts`.
- **Trap:** Do NOT create a Junction or Symlink here. It causes the 60GB Memory Leak.

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
- **Example:** `OuroborosHUD` (Archived Feb 2026).

---

## 5. Asset Pipeline Standards

### The "numeric Bubble" Law

- **Context:** `process_assets.py` sorting.
- **Rule:** Folders inside `bubbles/` MUST be prefixed: `01_intro`, `02_architecture`.
- **Why:** Python sorts alphanumerically. `intro` comes after `architecture` without numbers, breaking the narrative arc.

### The "Fake SVG" Pivot

- **Context:** 3D rendered logos (`EN_logo_1200`).
- **Rule:** We accept high-res PNGs wrapped in SVG as the "Sovereign Asset" because the source is 3D geometry, not vector paths. Do not attempt to wireframe them.

### The "Main Stage" Law (Content)

- **Context:** Deep Dive Refactoring ("The Heavy 8").
- **Rule:** Forensic Narratives (The Story) belong in the **Body** (`MDX`), not Frontmatter (`transcript`).
- **Why:** Frontmatter is for Metadata (Tags, Dates). The Body is for Evidence (AEO Visibility).
- **Exception:** `transcript` is kept in schema (nullable) for future Audio Logs only.
- **[Ref:] "The Ready State" Standard (Normalization Target):**
  - **Context:** Feb 2026 Normalization Drive.
  - **Rule:** A project is "Ready" ONLY when:
    1.  **Hydrated:** Contains `bolus`, `report`, `discrete_reports`.
    2.  **Safe Body:** All text text dumped into the Markdown Body (visible/searchable).
    3.  **No Drawers:** "Access Dossier" / "Forensic Drawer" functionality is **DISABLED**.

### 🔴 "The Ghost Component" (Edit Not Reflecting)

- **Symptom:** You edit `Assembly.tsx` but the `/assembly` page never changes.
- **Cause:** Wrong file. The page route (`src/pages/assembly.astro`) likely imports a _different_ component (e.g., `ExplodedView.tsx`) than the one you are editing.
- **Fix:** ALWAYS check the `.astro` page import statements before debugging a React component.

### 🔴 "Schema Enum Trap" (Content Collection)

- **Symptom:** `Invalid enum value` for `tools` or `productionScale`.

### 🔴 "The Hidden Duplicate" (YAMLException)

- **Symptom:** Build crashes with `YAMLException: duplicated mapping key`. You check the frontmatter and see only one key.
- **Cause:** `hydrate_content.py` often appends a new `metrics:` block at the very end of the file (Line 1300+), while an empty `metrics: {}` exists at the top (Line 10).
- **Fix:**
  1.  Do NOT just scan the top. Scroll to the bottom.
  2.  Use `Ctrl+F` for "metrics:".
  3.  Delete the bottom duplicate. Move valid data to the top level.

### 🔴 "The Invisible Drawer" (Z-Index Trap)

- **Symptom:** HUD Metrics Drawer is in the DOM (`div.fixed`) but invisible.
- **Cause:** It is sitting at `z-40` or `z-50`, which puts it _behind_ the `Hyperspace` Intro Layer or Canvas.
- **Fix (Law XXIV):**
  1.  **Elevate:** Set `z-[90]` (The Intercept Layer).
  2.  **Contrast:** Add `bg-black/80 backdrop-blur-md` to force it out of the void.
  3.  **Debug:** Temporarily hardcode `const showMetrics = true` to rule out logic failures first.
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

### `scripts/nuke_cloudflare_deployments.py` (The Nuclear Option)

- **Function:** Batch-deletes Cloudflare Pages deployments to bypass the "Too many deployments" deletion blocker.
- **Usage:** `python scripts/nuke_cloudflare_deployments.py --account-id [ID] --project-name quantum --delete-project --api-token [TOKEN]`
- **Context:** Required when Wrangler/Dashboard fails to delete a legacy project due to timeout.

---

## 8. Troubleshooting: Visual Engineering (Stream A)

### 🔴 "Left Bias" Nav Trap (HTML Structure)

- **Symptom:** Right-side icons shift left or center, ignoring `justify-end`.
- **Cause:** A missing closing `</div>` in a previous slot (e.g., Center) captures the Right slot as a child.
- **Fix:** Verify `Nav.astro` structure. Use **CSS Grid** (`grid-cols-[1fr_auto_1fr]`) in `UniversalHUD` to enforce isolation.

### 🔴 "Invisible Component" Trap (Stacking Context)

- **Symptom:** Component is mounted (logs firing) but invisible on screen.
- **Cause:** `Hyperspace` theme uses a fixed `Intro` layer at `z-50`.
- **Fix:** Apply `relative z-[60]` (or higher) and a `bg-black/90` backdrop to the component container.
- **Protocol:** Use the "DEBUG Banner" pattern (temporary red border + text) to verify mounting before adjusting Z-index.

### 🔴 "Ghost Starfield" (Transparency)

- **Symptom:** Starfield is enabled (`starfield={true}`), but the screen is black.
- **Cause:** `bg-black` or `bg-neutral-950` classes on the `body` or wrapping `div` sit at Z-1, obscuring the Z-0 Canvas.
- **Fix:** Set container backgrounds to `bg-transparent` to reveal the void.

### ⚠️ "Vite EPERM Lock" (Windows)

- **Symptom:** `Error: EPERM: operation not permitted, rename` during `npm run dev`.
- **Fix:** Restart the terminal.

### ⚠️ "Case-Sensitivity Trap" (Windows -> Linux)

- **Symptom:** Build works locally (Windows) but fails on Cloudflare (Linux) with `Module not found` or `Casing mismatch`.
- **Cause:** Windows FS is case-insensitive, but Git Index is case-sensitive. If you rename `mdx` to `MDX` in Explorer, Git might not register it.
- **Protocol: The Triangle Rename.**
  1.  `git mv folder folder_temp`
  2.  `git mv folder_temp Folder`
  3.  Commit immediately.
- **Why:** Forces Git to register the move as a distinct operation.

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
- **Fix:** Audit dependency arrays strictly.

### 🔴 "Domain Routing & SEO Governance" (The 301 Law)

- **Context:** Deciding how to route ecosystem satellites (`mechanistic`, `moreplay`) to the central identity.
- **Protocol:** Always use server-side `Astro.redirect("https://eriknorris.com", 301)` for domain funnels instead of visual doorway/splash pages. This consolidates entity authority (link juice), provides a frictionless UX, and actively avoids Google "Soft 404" indexing penalties.

### 🔴 "Favicon Sovereignty" (Ecosystem Satellites)

- **Context:** Managing favicons for secondary domains without complex `.ico` generators.
- **Protocol:** Place raw generated PNGs (e.g., `moreplay-favicon.png`) in the `public/` directory and explicitly define `<link rel="icon" type="image/png" href="/your-image.png" />` in the layout's `<head>`.

### 🔴 "UI Parameterization" (Version Control)

- **Context:** Hardcoded version strings (e.g., "v21", "v22") scattered across React/Astro layouts.
- **Protocol:** Never hardcode version strings. Always retrieve `data.dashboardVersion` dynamically from the JSON schema payload to ensure centralized, data-driven truth.
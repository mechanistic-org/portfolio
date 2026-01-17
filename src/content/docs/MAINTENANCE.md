---
title: "Maintenance & Troubleshooting"
slug: "maintenance"
sidebar:
  group: "Workflows"
  order: 99
---

# System Maintenance & Troubleshooting

This document serves as the first line of defense for system issues, build failures, and pipeline errors.

## Operational Workflows (Agentic)

These tasks are now automated via Slash Commands in the IDE.

- **New Project:** `/scaffold-project` (Generates strict C24 Schema).
- **Deploy:** `/deploy-production` (Verify Build + Push to Main).
- **New Project:** `/scaffold-project` (Generates strict C24 Schema).
- **Deploy:** `/deploy-production` (Verify Build + Push to Main).

### The Toolchain Trinity (Core Scripts)

These scripts are the engine of the "Forensic Data Factory."

### Architectural Patterns

- **The Hybrid Scroll (Performance):**
  - **Context:** Heavy 3D scenes (R3F) cause main-thread lag if coupled with React State-driven scroll hooks (like `useScroll`).
  - **Pattern:** Use **Vanilla JS `scroll` listeners** attached to specific containers (e.g., `#hyperspace-container`) to calculate progress (0-1) and pass it into the Canvas via a single State update or Ref.
  - **Benefit:** Decouples the 60fps render loop from the scroll event loop.

- **Hydration Engine:** `npm run content:hydrate`
  - **Source:** `scripts/hydrate_content.py`
  - **Purpose:** Injects NotebookLM "Bolus" data (JSON) into MDX Frontmatter (Metrics, Toolchains, Summaries).
  - **Behavior:** Reads `notebook_dumps/`, matches by slug, updates `src/content/projects/`.

- **Schema Modernizer:** `npm run content:modernize`
  - **Source:** `scripts/modernize_content.py`
  - **Purpose:** Mass-updates legacy content to the latest C24 Schema.
  - **Behavior:** Injects default values for new fields (`cyberspace`, `metrics`, `statusLabel`). Use for bulk refactors.

- **Asset Refinery:** `npm run assets:process`
  - **Source:** `scripts/process_assets.py` (formerly `process_images.py`)
  - **Purpose:** The "Heavy Lifter" for media.
  - **Capabilities:**
    - **Images:** Resizes to standard breakpoints (xl, lg, md, sm) and generates WebP.
    - **Audio:**
      - **Source:** `R2_MASTER/[slug]/[filename].wav`
      - **Naming:** `[slug]-briefing.wav` (Standard) or `[slug]-deep_dive.wav`
      - **Output:** `R2_STAGING/[slug]/[filename].mp3` (192kbps)
      - **Global Audio:** Use `identity` slug (e.g., `R2_MASTER/identity/identity-overview.wav`).
    - **Usage:**
      - `npm run assets:process` (Process specific slugs in R2_MASTER).
      - `npm run assets:process -- --all` (Re-process EVERYTHING).
      - `npm run assets:process -- [slug]` (Target specific project).

## Asset Pipeline

### DXF Rendering Issues

- **Symptom:** `ModuleNotFoundError: No module named 'ezdxf'` or `matplotlib`.
- **Context:** The DXF pipeline ("The Sidecar") introduces heavy Python dependencies that are not part of the standard `requirements.txt` core set to keep the main build light.
- **Fix:**

  ```bash
  pip install -r scripts/requirements.txt
  ```

  _Note: We recently added `ezdxf` and `matplotlib` to `requirements.txt` (Jan 2026), so ensure your local environment is synced._

- **Symptom:** `[ERROR] Rendering failed: ...`
- **Fix:**
  1.  Verify the input file is a valid DXF (Try opening in a viewer like Autodesk TrueView or ODA Viewer).
  2.  Check for "Text Style" missing fonts (matplotlib backend may fallback to default font, which is non-fatal but looks different).
  3.  Run the sidecar in standalone mode to isolate the error:
      ```bash
      python scripts/lib/dxf_renderer.py "path/to/dxf/file.dxf"
      ```

### MDX Errors (Astro Content Layer)

- **Symptom:** `MDXError: Unexpected character 0` (or 1-9) preventing dev server startup.
- **Cause:** The MDX parser interprets unquoted keys starting with numbers (e.g., `01_intro:`) as octal or invalid identifiers. It also flags `<` symbols followed by numbers in body text (e.g., `<0.5mm`) as invalid JSX tags.
- **Fix:**
  1.  **Frontmatter:** Quote ALL keys/values starting with a number: `01_intro` -> `"01_intro"`.
  2.  **Body Text:** Escape `<` if followed by a number or currency: `<0.5mm` -> `&lt;0.5mm`.
      - **Trap:** `<$15k` (interpreted as tag). FIX: `&lt;$15k` or `less than $15k`.
      - **Trap:** `<40%` (interpreted as tag). FIX: `less than 40%`.

### The Timeline Trap (Infinite Bubble)

- **Symptom:** A project's bubble in the Visualization is massively oversized (e.g., covering the whole screen).
- **Cause:** **Missing End Date.** If a project has `date` (Start) but no `endDate` or `duration`, the visualization engine assumes it is _still active_ (Duration = Start Date to Now -> 20+ Years).
- **Fix:** Ensure every project has an `endDate` in frontmatter.
  ```yaml
  date: 2003-01-01
  endDate: 2004-05-01 # Cap the duration
  ```

### Broken Site Logos / Favorites

- **Symptom:** "EN" Logo appears as a broken image icon or text alt-tag in Header/Footer.
- **Cause:** Missing or corrupt `EN_logo_1200.svg` in `public/assets/branding/`.
- **Fix:** Restore the canonical "Fake SVGs" from the backup vault:
  `copy "d:\portfolio\portfolio_working\EN_logo\EN_15-based_good-reference-but _fake-SVGS____\*.svg" "public/assets/branding\"`
- **Note:** Do not use `Asset 2.svg` (Wireframe); it is incorrect.

### Cloudflare Image Service Warning

- **Symptom:** `[WARN] Cloudflare does not support sharp at runtime. However, you can configure imageService: "compile"...`
- **Cause:** The Cloudflare adapter detects Sharp is installed but unavailable in the Edge runtime.
- **Fix:** Explicitly configure the adapter to use Sharp during the build/compile phase only:
  ```js
  // astro.config.mjs
  adapter: isProduction ? undefined : cloudflare({ imageService: "compile" }),
  ```

### IDE Tooling Errors ("Stream Error")

- **Symptom:** "Error generating commit message: ... stream error" or "404 models/gemini-1.5-flash not found".
- **Cause:**
  1. **Global IDE Outage:** The Antigravity IDE has a known bug with the native "Generate" button failing to stream responses (Jan 2026).
  2. **Billing Mismatch:** "Google One Ultra" (Consumer) does NOT cover API usage. You must have a credit card on the specific Google Cloud Project for the API Key.
- **Fix:**
  1.  **Run Diagnostic:** `python scripts/test_gemini_key.py`.
  2.  **If Script Works:** The API Key is fine. The IDE is broken. **Use Manual Commits.**
  3.  **If Script Fails (429):** Add billing to Google Cloud Console for the project.

### Asset & Schema Errors

- **Symptom:** `ImageNotFound: Could not find requested image...`
- **Cause:** A component is referencing a relative asset path that was deleted (e.g., `web-reaper/avatar.jpg`).
- **Fix:** Grep the `src` directory for the missing filename. It's often in a "Tiny Image" component or legacy content.

- **Symptom:** `YAMLException: can not read an implicit mapping pair; a colon is missed`
- **Cause:** A markdown line in frontmatter starts with `*`. YAML interprets this as an alias anchor or list item.
- **Fix:** **The Asterisk Law:** You MUST quote any string starting with `*` or special characters.
  `narrative: "* The system failed..."` -> `narrative: "* The system failed..."` (Wait, quotes are required).
  `narrative: "* The system"` (Fails).
  `narrative: "* The system"` (Fixed: `narrative: '* The system'`).

### Hyperspace Migration (Batch Upgrade)

- **Script:** `node scripts/migrate_to_hyperspace.js`
- **Usage:**
  - `--dry-run`: Preview changes.
  - `--write`: Apply changes (Back up first!).
- **Logic:**
  - Standardizes `theme: "hyperspace"`.
  - Promotes `metrics` -> `deep_dive`.
  - Renames `deck` -> `legacy_deck`.

- **Symptom:** `Error: Field validation failed: teamSize: Must be a string`
- **Cause:** Keystatic/Zod schema expects a String, but a Number was provided in the markdown frontmatter.
- **Fix:** Quote the value in the `.mdx` file: `teamSize: 6` -> `teamSize: "6"`.

### The Orphan Trap (Data Stripping)

- **Symptom:** Python Hydration script runs successfully (`✅ Updated: 1`), but the data (`toolchain`, `forensic_summary`) does not appear in the Build or CMS.
- **Cause:** **Schema Collision.** The field exists in the MDX file, but Astro's Zod Schema (`content.config.ts`) is in strict mode and silently strips undefined fields. If you open it in Keystatic, it will likely DELETE the field upon save because it's missing from `keystatic.config.tsx`.
- **Fix:** **The Parity Law:**
  1.  Define field in `src/content.config.ts` (Build Safety).
  2.  Define field in `keystatic.config.tsx` (CMS Safety).
  3.  Inject field via `hydrate_content.py` (Automation).

### The "Ghost Folder" 404 (Static Assets)

- **Symptom:** You add a folder to `public/` (e.g., `public/digiME`), but `localhost:4321/digiME/` returns a 404.
- **Cause:**
  1.  **Astro Caching:** The Dev Server does not always hot-reload structure changes in `public/`.
  2.  **Zombie Processes (Windows):** `npm run dev` might fail to close the port, leaving a stale `node.exe` running on 4321 while your new server runs on 4322. You are browsing the OLD server.
- **Fix:** Terminate with extreme prejudice.
  ```powershell
  taskkill /F /IM node.exe
  npm run dev
  ```

### Gallery Crashes (Relative URLs)

- **Symptom:** `TypeError: Invalid URL` crashing the entire Gallery component.
- **Cause:** Using `new URL(image.href)` on a relative internal link (e.g., `/legacy`). The browser `URL` constructor mandates an absolute URI schema.
- **Fix:**

  ```tsx
  // BAD
  new URL(image.href).hostname;

  // GOOD
  try {
    return new URL(image.href).hostname;
  } catch {
    return "INTERNAL"; // or handle relative path manually
  }
  ```

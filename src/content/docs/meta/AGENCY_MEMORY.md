---
title: "Agency Memory & Context Bridge"
slug: "agency_memory"
description: "The Persistent Short-Term Memory store for the AI Agent. This file bridges the gap between sessions."
---

# 🧠 Agency Memory (The "Hippocampus")

> **Use Case:** This file stores "Living Context" that is too specific for `GROK_LOG` (Laws) but too important to lose to "Amnesia."
> **Instruction:** The Agent must scan this file at startup to sync with the current "Mental State" of the project.

---

## 🔗 External Oracles (Active Intelligence)

These are active AI/External resources that contain "Source of Truth" data not in the repo.

### 1. **Project C|24 (Curtis)**

- **Role:** SME Oracle / Evidence Locker
- **URL:** [NotebookLM: C24](https://notebooklm.google.com/notebook/b8f893fe-234c-44ca-9d92-8fff6f82e53d?authuser=1)
- **Status:** **VERIFIED** (2025-12-31)
- **Contents:**
  - Synthesized "Why" behind the RoHS/Focusrite split.
  - 6x "Saved Notes" (Pinboard) ready for copy-paste into MDX.
  - Contains analysis of 70+ forensic PDFs (vendor emails, dimensional reports).
- **Actionable:** Do not "infer" C24 data. Go here and read the Pinboard.

### 2. **Project Dreamjob (Visual Taxonomy)**

- **Role:** Theoretical Manifesto
- **URL:** _[Insert URL if exists]_
- **Status:** **PENDING**

### 3. **Digidesign Tool Chain (Forensic Audit)**

- **Role:** Technical Truth Source (2003-2007)
- **Artifact:** `digi_tool_chain_inventory.md`
- **Status:** **VERIFIED**
- **Contents:** Definitive versions for Pro/E (Wildfire 2.0), IntraLink (3.4), SAP, and DigiDelivery.

### 4. **Operation Chronos (Asset Hunting)**

- **Role:** Forensic Target List
- **Artifact:** `HUNTING_LIST.md` (in Brain Artifacts) / `D:/portfolio/HUNTING_LIST_PRINTABLE.html`
- **Status:** **ACTIVE**
- **Contents:** Targeted list of 25+ specific forensic assets (Titan DXF, C24 Refresh AI, etc.) extracted from NotebookLM.

### 5. **WebTV Galaxy (The Missing Link)**

- **Role:** Forensic Narrative (Pre-Xbox)
- **URL:** [NotebookLM: Galaxy](https://notebooklm.google.com/notebook/a743c4b4-0aaf-446f-b18c-13f23b38065e?authuser=1)
- **Status:** **VERIFIED** (2026-01-10)
- **Contents:**
  - 150W Thermal Crisis (AMD K7).
  - Transition to Xbox/eHome.
  - "Blind Discovery" gems (Spoons, Datsun 510).

### 6. **Project Commute (The Polar Archives)**

- **Role:** Quantified Grit / Forensic Commute
- **Path:** `D:\GitHub\eriknorris-workspace\__WORKOUT_data_working-copy`
- **Status:** **VERIFIED** (2004-2006 Data)
- **Contents:** `.hrm` files (Heart Rate/Speed) documenting the "Digi-Commute."
- **Potential:** High-fidelity data visualization of "The Grind" (La Honda -> Daly City).

---

## 📍 Current Focus State (The "Cursor")

- **Active Task:** **Forensic Resume Alignment Complete.**
- **Next Step:** Proceed to **Prospecting Protocols** (Tailoring/Pain Letters).
- **Context:** Master Resume, LinkedIn Profile (Bio/Headline/Exp V4), and Site Datasheet are now **SYNCHRONIZED** with the "Forensic Architect" narrative.

* **Key Decision (Assets):** **"The Fake SVG Pivot"** - The `EN_logo_1200` series are technically SVG wrappers around high-res rendered PNGs (`d:\portfolio\...\ _fake-SVGS____`). We accepted this as the **Source of Truth** (Sovereign) because the logo is natively 3D and has no perfect 2D vector equivalent. Do NOT try to replace them with wireframes.

* **Key Decision (Physics):** "Goldilocks" settings are `vy: -50`, `friction: 0.05`. Do not increase friction without vertically scaling velocity.
* **Key Decision (Viz-Deprecated):** `ArchiveSankey`, `LivingGantt`, and `SkillsGraph.tsx` have been DEPRECATED and removed/disabled to "kill the noise".
* **Key Decision (Data):** **"The Event Horizon"** - `multiverse.json` and `skills.json` were PURGED (2026-01-08). The architecture is now "Pure Hyperspace" (Dynamic Astro Collections only).
* **Key Decision (Architecture):** **"The Sovereign Pipeline"** - `eriknorris-workspace\R2_MASTER` is the **SOURCE OF TRUTH** (The Vault). `process_images.py` reads from here. `eriknorris-assets\R2_STAGING` is the **PUBLISHED MIRROR** (The Web). we DO NOT edit Staging directly.
* `src/content/docs/prompts/UNIVERSAL_NOTEBOOK_PROMPT.md`: **The Extraction Standard.** (How we mine data).
* `src/content/docs/prompts/BRANDING_PROMPT.md`: **The Design System.** (How we speak).
* `src/content/docs/STYLE_GUIDE.md`: **The Token Map.** (How we style).
* **Key Decision (Protocol):** **"Operation Chronos"** - Use NotebookLM to generate `HUNTING_LIST.md` (dense tables) and export to HTML for physical printing ("Low Friction" asset retrieval).
* **Key Decision (Mining):** **"The MailStore Pivot"** - Python COM is too fragile for 15k+ item queries. Use MailStore Home to Index -> Search -> Export.
* **Key Decision (Layout):** **"The Fiche Scroll Law"** - The Fiche container MUST use `.no-scrollbar` to prevent double-scrollbar visual glitches with the Parallax system.
* **Key Decision (Assets):** **"The Numeric Bubble Law"** - SC48/D-Control Bubble folders MUST be prefixed (e.g., `01_3d`) to ensure `process_images.py` compiles them in the correct narrative order.
* **Key Decision (Color):** **"The Sovereign Color Law"** - `src/config/color_registry.ts` is the ONLY Source of Truth for Entity Coloring. `Colors.csv` retrieval is FORBIDDEN.
* **Key Decision (Code):** **"The Module Naming Law"** - Do not use `.json.ts` for standard TypeScript modules/arrays. Rename to `.ts` to prevent TS Server resolution confusion.
* **Key Decision (Resilience):** **"Safe-by-Default D3"** - Visualization components must implement defensive `get(key) || default_color` logic to preventing crashing the entire graph on a single missing key.
* **Key Decision (UI):** **"Lite HUD"** - To prevent WASM crashes during build, deeply nested logic in `ProjectManifestHUD.astro` (Row 2 Metrics) has been disabled until further notice. Row 1 (Identity/Nav) is the priority.
* **Key Decision (Keystone):** **"The Neural Assembly"** - The final visualization is a "Hybrid Brain" (D3 + R3F). 30 Notebook Nodes packed in a cranial volume (The Idea) that explode on scroll (The Engineering). This is the Opus.
* **Key Decision (Pipeline):** **"The Sidecar Pattern"** - Specialized rendering logic (DXF, IGES) lives in `scripts/lib/` as standalone modules. `process_images.py` invokes them but does not contain their heavy dependencies.
* **Key Decision (Archival):** **"The PDF Bridge"** - We generate PDFs from CAD data specifically for `NotebookLM` consumption, as it digests PDF vectors better than raw DXF text.
* **Key Decision (Identity):** **"The Forensic Architect"** - The Brand Voice is "Hyper-Functional Brutalist." We do not use fluff. We use density (IP69K, AZ91D, 5-Micron). The Master Resume logic is "Semantic Density" (for AI) + "Visual Hooks" (for Humans).
* **Key Decision (Formatting):** **"The Double Spacing Law"** - LinkedIn collapses standard lists. We MUST use **Double Spacing** (Empty Lines) effectively between bullets to force a vertical list render.
* **Key Decision (Sync):** **"The Datasheet Sync"** - `src/config/work_history.json` is the Source of Truth for the `/resume/one-pager` "Datasheet" View. It has been manually synced to the Master Resume.

- **Active Thread:** `777cb7ff-d7e0-468b-905f-b84f7965a3e1` (MDX Debugging & Tooling Repair).

## 🔗 Active Intelligence (New Synapses)

- **The Numeric ID Law:** MDX is ruthless. Keys starting with numbers (`01_foo`) MUST be quoted (`"01_foo"`). Body text must escape `<` before numbers (`&lt;0.5`).
- **The Generative Key Law:** An API Key is useless without the Project Permission. "Stream Error" usually means "API Not Enabled" in Google Cloud, not "Bad Code".
- **The "Two Wallets" Law:** Google One "Ultra" (Consumer) does NOT pay for API usage. You must have a separate Google Cloud Billing account for the API Key to avoid `429 Free Tier` blocks.
- **The "Zombie Model" Trap:** Antigravity IDE native buttons may use hardcoded, deprecated models (e.g. `1.5-flash`). Always verify access with `scripts/test_gemini_key.py`.
- **Global Outage (Jan 2026):** The Antigravity IDE "Generate" mechanism is currently broken server-side. Do not debug local config for "Stream Error".
- **The Data Bridge:** We successfully bridged "Dead" binary data (Excel .xls) to "Live" visualization (D3/React). Pattern: `scripts/extract_thermal.py` -> `src/config/sc48_thermal_real.json` -> `SCThermalMatrix.tsx`.
- **The Asset Lock:** `npm run dev` locks files in `public/assets`. Ingestion scripts CANNOT overwrite them while the server is running. FAILS SILENTLY.
- **Regex Sovereignty:** `startswith("---")` is brittle. Always use Regex `^\s*---` for frontmatter parsing to handle BOM/Whitespace.
- **Protocol:** "The Neural Scaffolding Strategy"
  - **Concept:** Use NotebookLM to pre-visualize the "Exhibit Halls" (Bubbles) before creating folders.
  - **Oracle:** [SC48 NotebookLM](https://notebooklm.google.com/notebook/c783...?authuser=1)
  - **Key Decision:** **"Auto-Migration Pivot"** - If the Agent knows the Source and Destination, it must Script the move. Do not ask the user to drag files.
- **Legacy CAD Pipeline:** `python scripts/lib/dxf_renderer.py [path]` can be run in standalone mode to visualize obscure "Deep Storage" folders without triggering a full site build.
- **Forensic Code Names:**
  - **D-Control:** "Project Buckley" (18 Engineers, Flagship).
  - **D-Command:** "Project Danko" (14 Engineers, Mid-tier).

---

## 🧱 The "Known Knowns" (Facts Established in Chat)

- **NotebookLM is "SME Level":** It is not generic. It has read the raw emails. Trust it.
- **The "Air Gap" is Real:** We have 40+ raw dump folders that need "Stitching."
- **Ingestion Logic:** `ingest_data.py` handles the bulk, but "Deep Dives" (C24, Buckley) are manually curated using High-Fidelity sources.
- **The "Sovereignty Valve":** `sovereign_manifest.json` is the supreme law. If a project is listed there, `ingest_data.py` MUST NOT overwrite its MDX.
- **The "Two-Step Dance":** Image processing (`process_images.py`) is manual and decoupled from metadata ingestion (`ingest_data.py`). We do not automate the "Art."
- **The "Esbuild Red Herring":** If `npm run build` fails with an obscure `Readable.push` pipe error, it is likely a **Syntax Error** in an Astro component's `<script>` block (e.g., missing function declaration). Don't blame the environment first.
- **The "Storyteller Protocol" (Infrastructure Logic):**
  - **Tier 4 (The Vault):** `\\morespace` (Raw CAD, Cold Storage).
  - **Tier 3 (The Workbench):** `D:\portfolio` (Staging, Context, Spreadsheets).
  - **Tier 2 (The Refinery):** `eriknorris-assets` (Web-Optimized Assets).
  - **Tier 1 (The Public):** `eriknorris` (Production Site).
- **The "Pipeline Law":** `D:\GitHub\eriknorris-workspace\R2_MASTER` is the **Input**. `D:\GitHub\eriknorris-assets\R2_STAGING` is the **Output**.
- **Career Contiguity:** The "Ransomware Gap" is bridged by **Metadata**. Even if files are missing, the _timestamps_ in `\\morespace` prove continuous work from 1996-2024.
- **Stream Signatures:**
  - **Noon:** Visual Polish (Gallery-First).
  - **Hyphen:** Process & Safety (Methodology-First).
  - **Kaleidescape:** Heavy Industry (Taxonomy-First).
- **The "Brain vs. Body" Law:**
  - **The Brain:** NotebookLM (PDFs, Context, Thinking).
  - **The Body:** R2_STAGING (Images, GLBs, Display Assets).
  - _We do not dump the Brain into the Body._

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

---

## 📍 Current Focus State (The "Cursor")

- **Active Module:** Operation Chronos (Asset Hunting).
- **Next Up:**
  1.  **Asset Ingestion (`c24`, `project-003`, `webtv`):** User to drop assets into `portfolio_working`. Agent to refine to `R2_STAGING`.
  2.  **Asset Processing:** Execute `process_images.py` to populate the new `01_forensics` bubbles.
  3.  **Deck Generation:** Auto-generate `deck.md` files for the new forensic bubbles.

* **Key Decision (Physics):** "Goldilocks" settings are `vy: -50`, `friction: 0.05`. Do not increase friction without vertically scaling velocity.
* **Key Decision (Data):** `multiverse.json` is the Single Source of Truth.
* **Key Decision (Architecture):** **"The Law of The Vault"** - `eriknorris-assets\R2_STAGING` is the ONLY Production Vault. `portfolio_working` is the ONLY Staging Input. `eriknorris-workspace\R2_MASTER` is DEAD (Legacy).
* **Key Decision (Protocol):** **"Operation Chronos"** - Use NotebookLM to generate `HUNTING_LIST.md` (dense tables) and export to HTML for physical printing ("Low Friction" asset retrieval).
* **Key Decision (Mining):** **"The MailStore Pivot"** - Python COM is too fragile for 15k+ item queries. Use MailStore Home to Index -> Search -> Export.
* **Key Decision (Layout):** **"The Fiche Scroll Law"** - The Fiche container MUST use `.no-scrollbar` to prevent double-scrollbar visual glitches with the Parallax system.
* **Key Decision (Assets):** **"The Numeric Bubble Law"** - SC48/D-Control Bubble folders MUST be prefixed (e.g., `01_3d`) to ensure `process_images.py` compiles them in the correct narrative order.

- **Active Thread:** `b5ef5f6b-77c6-4c25-b991-6ffab3b1b077` (D-Control Enrichment & MailStore Pivot).

## 🔗 Active Intelligence (New Synapses)

- **The Data Bridge:** We successfully bridged "Dead" binary data (Excel .xls) to "Live" visualization (D3/React). Pattern: `scripts/extract_thermal.py` -> `src/config/sc48_thermal_real.json` -> `SCThermalMatrix.tsx`.
- **The Asset Lock:** `npm run dev` locks files in `public/assets`. Ingestion scripts CANNOT overwrite them while the server is running. FAILS SILENTLY.
- **Regex Sovereignty:** `startswith("---")` is brittle. Always use Regex `^\s*---` for frontmatter parsing to handle BOM/Whitespace.
- **Protocol:** "The Neural Scaffolding Strategy"
  - **Concept:** Use NotebookLM to pre-visualize the "Exhibit Halls" (Bubbles) before creating folders.
  - **Oracle:** [SC48 NotebookLM](https://notebooklm.google.com/notebook/c783...?authuser=1)
  - **Key Decision:** **"Auto-Migration Pivot"** - If the Agent knows the Source and Destination, it must Script the move. Do not ask the user to drag files.
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
- **The "Ghost Pipeline" (Legacy Artifact):** `D:\GitHub\eriknorris-workspace\R2_MASTER` is a legacy backup. **DO NOT USE.** The Living Pipeline is `eriknorris-assets\R2_STAGING`.
- **Career Contiguity:** The "Ransomware Gap" is bridged by **Metadata**. Even if files are missing, the _timestamps_ in `\\morespace` prove continuous work from 1996-2024.
- **Stream Signatures:**
  - **Noon:** Visual Polish (Gallery-First).
  - **Hyphen:** Process & Safety (Methodology-First).
  - **Kaleidescape:** Heavy Industry (Taxonomy-First).
- **The "Brain vs. Body" Law:**
  - **The Brain:** NotebookLM (PDFs, Context, Thinking).
  - **The Body:** R2_STAGING (Images, GLBs, Display Assets).
  - _We do not dump the Brain into the Body._

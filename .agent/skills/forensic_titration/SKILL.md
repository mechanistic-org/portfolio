---
name: Forensic Titration
description: The official protocol for enriching project files using the "Hybrid" architecture (Body Text + Gallery Shells) and distilling War Stories for the global resume.
---

# Forensic Titration Protocol

## Usage

**When to use:** Onboarding a new project (e.g., "Bazooka", "Hyphen") or refactoring a legacy one.
**Trigger:** _"Invoke the Forensic Titration skill for [slug]. Here is the bolus."_
**Input:** Raw text/JSON dump from NotebookLM (The Bolus).

## Context

This protocol defines the "Gold Standard" for ingesting forensic engineering data into the ErikNorris portfolio. It replaces ad-hoc file creation with a deterministic process that ensures **Asset Sovereignty**, **Readability**, and **Resume Continuity**.

> [!CAUTION]
> **ZERO DATA LOSS MANDATE**
> Before applying this skill, you MUST check if the target project already has forensic data (MDX/JSON).
> If data exists, you must **APPEND** or **MERGE**, never **OVERWRITE** without a backup.
> YOU MUST run `python scripts/hydrate_content.py --reverse-json --slug [slug]` immediately after any manual titration to lock the state.

## The Architecture: "The Hybrid Contract"

**The SME (Erik) provides:**

1.  **The Bolus:** A structured raw dump (JSON/Text) containing the "Red Gold" (War Stories, Thermal Crises).
2.  **The Intent:** The "Why" (e.g., "This project proves I can handle 1500W thermal loads").

**The Agent (You) provides:**

1.  **The Construction:** You build the MDX body and Frontmatter structure.
2.  **The Verification:** You run the Audit.
3.  **The Safety (Three-Body Protocol):** You ensure the data is safe via the **Source / Live / Backup** architecture.

## The Three-Body Safety Protocol

To prevent accidental data loss during hydration, we strictly enforce a three-file architecture:

1.  **THE SOURCE (Manual):** `notebook_dumps/{slug}.md`
    - **Rule:** READ-ONLY to the script. This is the "User Manual Entry" file. Automation _cannot_ overwrite it.
2.  **THE LIVE (Render):** `src/content/projects/{slug}/index.mdx`
    - **Rule:** The rendered site. Can be hydrated (Forward) or snapshotted (Reverse).
3.  **THE BACKUP (Snapshot):** `notebook_dumps/{slug}.backup.md`
    - **Rule:** WRITE-ONLY. A snapshot of the Live file. If Live gets mangled, this file triggers an alert, but Source remains pristine.

## Phase 1: Ingestion (The Bolus)

You will receive inputs in the "Adhoc Report" format. Scan for ALL the following:

1.  **The Base Bolus (JSON):** `metrics`, `cast`, `toolchain`, `forensic_summary`, `tags`.
2.  **The Visual Drivers (HUD):**
    - `productionScale`: (e.g., `series`, `limited`, `concept`) -> Drives the "Pip Chart".
    - `phase_stats`: (Object with `Design`, `Engineering`, `Production`, `Strategy` hours) -> Drives the "Seismograph".
3.  **The Discrete Reports (Text):** Deep Dives (e.g., "The Thermal Crisis").
4.  **High-Fidelity Assets (Late Binding):** `audio_url`, `transcript`, `notebook_url` (Optional in Phase 1).

## Phase 2: Distillation (The Creative Act)

**CRITICAL:** The scripts _move_ data, but the Agent must _create_ the War Stories.

### A. Titrate War Stories

Distill reports into 5-7 high-impact `war_stories` for the Frontmatter.
_Rule: If the report details a specific fix (e.g., "3Tabs"), that MUST become a War Story._

### B. Titrate Cast (The Team Drawer)

If the Bolus does not contain a `cast` array, **you must extract it from the text.**

### C. Titrate Visuals (Seismograph & Pips)

- **Seismograph (`phase_stats`):** If missing, infer relative effort (0-100) based on role (e.g., heavily Engineering = `Engineering: 80, Design: 20`).
- **Pip Chart (`productionScale`):** Infer from context (Mass Production = `series`, Prototype = `concept`).

## Phase 3: Construction (The Hybrid)

### Step A: The Project File (`index.mdx`)

Construct the file with this exact structure:

- **Frontmatter:**
  - `slug`, `role`, `dates`, `toolchain`.
  - `productionScale`: **MANDATORY.** (series | limited | concept | prototype | one_off).
  - `phase_stats`: **MANDATORY.** `{ Design: #, Engineering: #, Production: #, Strategy: # }`.
  - `presentation_mode`: **MANDATORY.** `flagship` (Enables Hybrid Body + HUD; **NO DRAWER**).
  - `tags`: **MANDATORY.** (Wires `Assembly.tsx`).
  - `metrics`: Inject `financial`, `process`, `governance` strings + `war_stories`.
  - `cast`: Insert your titrated cast list.
  - `gallery`: Create shells for EACH Discrete Report. Only use `images` array. **DO NOT use `deck` text.**
- **Body:**
  - Append Executive Report.
  - Append **Full Text** of all Discrete Reports as `##` headers.

> **CRITICAL ARCHITECTURE UPDATE (Feb 2026):**
> We have **REMOVED** the "Access Dossier" / "Forensic Drawer".
> Do **NOT** create a separate `_intelligence.md` file. All forensic narratives must live in the main `index.mdx` body to comply with the "Single Body" Search Indexing Law.

## Phase 4: Reverse Titration (The Backport Mandate)

**CRITICAL:** Manual intelligence (War Stories authored in MDX) is ephemeral until backported.

1.  Run `npm run audit:frontmatter` to verify schema.
2.  **MANDATORY:** Run the Reverse Hydration (JSON) script to update the `notebook_dumps` Source of Truth:
    ```bash
    python scripts/hydrate_content.py --reverse-json --slug [slug]
    ```
    _Note: The legacy `--reverse` flag (Text) is for Resume generation. Use `--reverse-json` for Data Safety._

## Phase 5: Day 2 Audio Injection (Late Binding)

When Audio/Transcript assets become available later:

- **Do NOT re-hydrate.** Surgical manual update of `audio_url` and `transcript` only.

## Checklist

- [ ] **Distilled:** War Stories + Cast + Phase Stats + Production Scale?
- [ ] **Files:** Created `index.mdx` (Single Body Source)? -> **NO `_intelligence.md`**.
- [ ] **Backported:** Ran `python scripts/hydrate_content.py --reverse-json` to save the JSON Lifeboat?

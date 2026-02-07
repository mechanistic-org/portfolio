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

## The Architecture: "Hybrid Mode"

A proper Project File (`index.mdx`) must serve two masters:

1.  **The Reader (Body):** Needs immediate access to the full "Deep Dive" narratives.
2.  **The System (Frontmatter):** Needs structured data (`war_stories`, `galleries`) to power the HUD, Graph visualizations, and Resume generation.

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
  - `tags`: **MANDATORY.** (Wires `Assembly.tsx`).
  - `metrics`: Inject `financial`, `process`, `governance` strings + `war_stories`.
  - `cast`: Insert your titrated cast list.
  - `gallery`: Create shells for EACH Discrete Report.
- **Body:**
  - Append Executive Report.
  - Append **Full Text** of all Discrete Reports as `##` headers.

### Step B: The Intelligence File (`_intelligence.md`)

Create a **separate file** at `src/content/projects/{slug}/_intelligence.md`.

- **Content:** Condensed Executive Summary (Sections I-V) ONLY.

## Phase 4: Reverse Titration (The Script)

Once verified:

1.  Run `npm run audit:frontmatter` to verify schema.
2.  **MANDATORY:** Run the Reverse Titration script:
    ```bash
    python scripts/hydrate_content.py --reverse
    ```

## Phase 5: Day 2 Audio Injection (Late Binding)

When Audio/Transcript assets become available later:

- **Do NOT re-hydrate.** Surgical manual update of `audio_url` and `transcript` only.

## Checklist

- [ ] **Distilled:** War Stories + Cast + Phase Stats + Production Scale?
- [ ] **Files:** Created BOTH `index.mdx` AND `_intelligence.md`?
- [ ] **Reversed:** Ran `python scripts/hydrate_content.py --reverse`?

---
title: NotebookLM Workflow Protocols
slug: notebook_workflow
last_updated: 2026-01-28T00:00:00.000Z
description: Documentation for NotebookLM Workflow Protocols.
---

# NotebookLM Workflow & The "Leakage" Principle

> **CRITICAL OBSERVATION:** The Audio Model treats _all_ source text as "Content to be Performed."

## 1. The Leakage Principle

**The Trap:** If you include "System Override," "Execute Protocol," or meta-commentary in the source file, the Host **will read it aloud** or mock it.
**The Stealth Rule:** "Instructions in the Source are Content to the Voice."

### Mitigation Strategy: Decoupling

The workflow requires **Two Distinct Artifacts** for the two distinct AI models (Text vs. Audio).

#### Stage 1: Text Generation (The Analyst & Scribe)

**Step A: The Bolus (Data Extraction)**

- **Goal:** Extract structured JSON data for the Brain.
- **Prompt:** `public/assets/prompts/BOLUS_READY.txt`.
- **Output:** A raw JSON "Bolus" used by `hydrate_content.py`.

**Step B: The Report (Narrative Generation)**

- **Goal:** Generate the human-readable Markdown for the MDX page.
- **Prompt:** `public/assets/prompts/REPORT_READY.txt`.
- **Output:** The "Forensic Report" (History, Technical Details, Legacy).

#### Stage 2: Audio Generation (The Actor)

- **Goal:** Generate the Podcast / Audio Overview.
- **Input:**
  1.  The **Clean Output** from Stage 1 (Convert Note to Source).
  2.  The **Sanitized** `PODCAST_READY.txt` (Phonetic Key & Character Bio).
- **Forbidden:** DO NOT include `BOLUS_READY` or `REPORT_READY`. They contain instructions that will leak.
- **Forbidden:** DO NOT include "Guardrails" or "Rules of Engagement" in the source text. Behavior must be implied by the Character Bio, not commanded.

## 2. The Bridge Protocol

1.  **Generate Text:** Run `BOLUS_READY` (Save as Note). Run `REPORT_READY` (Save as Note).
2.  **Convert to Source:** Select the `REPORT` Note -> "Select as Source" (or copy-paste into a new Source Note).
3.  **Sanitize:** Ensure no instructions ("Here is the report...") remain.
4.  **Inject Voice:** Add `PODCAST_READY.txt` (The "Mouth" & "Mind").
5.  **Generate Audio:** Click "Generate".

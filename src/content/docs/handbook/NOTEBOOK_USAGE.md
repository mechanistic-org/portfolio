---
title: "NotebookLM Mining Guide"
slug: "notebook-usage"
sidebar:
  group: "Handbook"
  order: 22
---

# NotebookLM Mining Guide (v3.0)

**Role:** Operator manual for schema-first NotebookLM mining.
**Tool:** Google NotebookLM.

## Concept: The Cartridge System

NotebookLM is powerful but drifts easily. To keep it on track, use compiled prompt cartridges in `public/assets/prompts/`. Source prompts live in `src/content/prompts/` and are compiled with `scripts/compile_hack_pack.py`.

| Vector | Cartridge | Output Artifact | Goal |
| :-- | :-- | :-- | :-- |
| Consolidation | `BOLUS_NLM-INPUT.txt` | reviewed bolus candidate | Canonical schema pass |
| Metrics | `METRICS_NLM-INPUT.txt` | `_metrics.json` candidate | Relative metrics and quantified results |
| Narrative | `REPORT_NLM-INPUT.txt` | `_intelligence.md` candidate | Dense forensic report |
| Crises | `VIGNETTES_NLM-INPUT.txt` | `_crises.md` / crisis JSON candidate | Scar ledger |
| Cast | `TEAM_NLM-INPUT.txt` | `cast` candidate | People, roles, vendors |
| Timeline | `TIMELINE_NLM-INPUT.txt` | `_entropy.json` / `timeline` candidate | Chronology and event pulses |
| BOM | `BOM_NLM-INPUT.txt` | `bom` / `complexity_vector` candidate | Parts, materials, tooling |
| Audio | `PODCAST_NLM-INPUT.txt` | audio briefing | Tribunal-style discussion from reviewed facts |

## Workflow: The Mining Loop

### Phase 1: Setup

1. Create a new notebook for the project or use the existing project notebook.
2. Upload source material: PDFs, emails, CAD logs, inspection reports, ECOs, DCDs, photos, spreadsheets. Avoid generic marketing material unless it is explicitly needed for launch context.
3. Record notebook ID, title, source count, source families, and known gaps in the local manifest or the relevant issue/doc.
4. Wait for indexing to complete before running prompts.

### Phase 2: Load Cartridge

1. Open Notebook Settings or Customize Chat.
2. Paste the content of the desired compiled cartridge from `public/assets/prompts/`.
3. Save. The Notebook is now in that extraction mode.

Do not blend modes in a single run. Clear chat or switch instructions between vectors.

### Phase 3: Extraction

1. Type a short trigger such as `Extract the schema payload for this project.`
2. The AI should output strict JSON or Markdown, depending on the cartridge.
3. Copy the output without repairing it inside NotebookLM.

### Phase 4: Local Ingestion

1. Save raw output in `src/content/_raw_nlm/`.
2. Normalize reviewed output into sidecars:
   - Metrics/results/cast/timeline/toolchain: `src/content/projects/{slug}/_metrics.json`
   - Crisis ledger: `src/content/projects/{slug}/_crises.md`
   - Entropy stream: `src/content/projects/{slug}/_entropy.json`
   - Narrative bolus: `src/content/projects/{slug}/_intelligence.md`
3. Project validated fields into `index.mdx` only after sidecars are reviewed.
4. Verify locally with schema/build checks before visual or Assembly work.

## Remine/Refine Protocol

1. Freeze the NotebookLM input set and record source count.
2. Run one cartridge at a time.
3. Diff raw output against existing raw output and sidecars.
4. If the model drifts, refine the cartridge or add missing sources. Do not hand-edit hallucinations into "truth".
5. Normalize only reviewed data into sidecars.
6. Compile prompt cartridges after changing source prompts:

```powershell
& 'C:\Users\erik\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' scripts\compile_hack_pack.py
```

## Audio Overview

The audio overview is downstream of reviewed data.

- Instruction: `PODCAST_NLM-INPUT.txt`
- Source of truth: reviewed bolus/report/metrics/crisis data
- Rule: audio must not introduce new facts, new numbers, or new people

When the Audio Hosts make a claim, use NotebookLM chat with the report or metrics cartridge to verify the claim against uploaded specs before shipping the audio.

## Meta-Analysis

When 12+ projects have reviewed `_metrics.json` and `_crises.md` sidecars:

1. Create a master notebook.
2. Upload the reviewed sidecars, not the raw NotebookLM transcripts.
3. Run a separate cross-project analysis prompt to identify recurring structural patterns.

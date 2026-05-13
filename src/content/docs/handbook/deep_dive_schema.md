---
title: "Deep-Dive Schema and NotebookLM Readiness"
description: "Canonical W1 schema draft, prompt-stack contract, NotebookLM readiness audit, and C24 backfill requirements."
slug: "deep-dive-schema"
sidebar:
  group: "Handbook"
  order: 23
---

# Deep-Dive Schema and NotebookLM Readiness

Status: Draft v0.1 for portfolio#75 under portfolio#69.

This document defines the receiving shape for NotebookLM mining. It is not an Assembly implementation plan. Assembly remains downstream and only depends on preserved `_intelligence.md` boluses and future sidecar stability.

## Artifact Contract

NotebookLM output moves through four local layers:

1. Raw extraction: `src/content/_raw_nlm/{slug}_*.json` and `.md`.
   These are untrusted NotebookLM transcripts. Keep them for traceability, but do not treat them as render-ready.
2. Canonical sidecars: `src/content/projects/{slug}/_metrics.json`, `_crises.md`, `_entropy.json`, and `_intelligence.md`.
   These are reviewed local artifacts. `_metrics.json` is the machine-readable canonical payload. `_crises.md` is the editorial crisis ledger. `_entropy.json` is the time-series event stream. `_intelligence.md` is the dense narrative bolus.
3. Page projection: `src/content/projects/{slug}/index.mdx` frontmatter.
   This is a render projection for existing components, not the source of truth. Use only the fields the site currently consumes: `forensic_metrics`, `metrics`, `cast`, `bom`, `timeline`, `scars`, `toolchain`, `forensic_summary`, `audio_url`, and `presentation_mode`.
4. Downstream surfaces: DeepDataHUD, ForensicHUD, project pages, resume/LinkedIn generation, and later Assembly.
   Do not wire new Assembly behavior during W1 schema work. Preserve `_intelligence.md` paths and keep the shape stable for later mapping.

## `_metrics.json`

Minimum canonical schema:

```json
{
  "schema_version": "deep-dive.v0.1",
  "slug": "project-slug",
  "project": {
    "title": "Project Title",
    "codename": "Optional Codename",
    "employer": "optional_employer_key",
    "date_range": {
      "start": "YYYY-MM-DD",
      "end": "YYYY-MM-DD"
    }
  },
  "source_manifest": {
    "notebook_id": "NotebookLM UUID",
    "notebook_title": "NotebookLM Title",
    "source_count": 0,
    "source_families": ["email", "pdf", "cad", "photo", "spreadsheet"],
    "last_audited": "YYYY-MM-DD",
    "gaps": []
  },
  "readiness": {
    "state": "ready | partial | blocked",
    "reason": "Short reason for the state",
    "next_inputs": []
  },
  "metrics": {
    "financial": [],
    "process": [],
    "technical": [],
    "governance": [],
    "production": []
  },
  "crises": [],
  "quantified_results": [],
  "cast": [],
  "timeline": [],
  "toolchain": [],
  "visuals_to_find": [],
  "extraction_notes": {
    "missing": [],
    "ambiguous": [],
    "do_not_claim": []
  }
}
```

Metric object:

```json
{
  "id": "metric-flatness-recovery",
  "category": "process",
  "label": "Side cap flatness recovery",
  "value": "<0.50",
  "unit": "mm",
  "before": "2.50 mm",
  "after": "<0.50 mm",
  "delta": ">=80% reduction",
  "claim": "Reduced side-cap flatness deviation from 2.50 mm to under 0.50 mm.",
  "source_refs": ["before_and_after_rubber_paint.pdf"],
  "confidence": "high"
}
```

Crisis object:

```json
{
  "id": "c24-side-cap-banana-defect",
  "title": "Side Cap Thermal Warping",
  "type": "thermal | tooling | supply_chain | serviceability | governance | quality | regulatory",
  "severity": 1,
  "phase": "pilot",
  "trigger": "What broke.",
  "root_cause": "Why it broke.",
  "intervention": "What changed.",
  "result": "What improved.",
  "metric_ids": ["metric-flatness-recovery"],
  "evidence": [
    {
      "source_ref": "944055165-166-00 baking fixture chg.pdf",
      "quote": "Optional short quote",
      "notes": "What this proves"
    }
  ],
  "confidence": "high"
}
```

Quantified result object:

```json
{
  "id": "result-headphone-mttr",
  "claim": "Reduced headphone jack service time from more than 2 hours to under 10 minutes.",
  "number": 10,
  "unit": "minutes",
  "before": ">2 hours",
  "after": "<10 minutes",
  "category": "process",
  "linked_crisis_ids": ["c24-headphone-trap-door"],
  "source_refs": ["ECO 12993", "RE_ Potential Field_CS concern with current headphone design.msg"],
  "confidence": "high"
}
```

Cast object:

```json
{
  "name": "Person Name",
  "role": "Specific role",
  "org": "Company or vendor",
  "discipline": "mechanical | electrical | firmware | manufacturing | quality | vendor | program | marketing",
  "relationship": "internal | vendor | customer | partner",
  "source_refs": [],
  "confidence": "high"
}
```

Timeline object:

```json
{
  "date": "YYYY-MM-DD",
  "title": "Specific event",
  "description": "Dense description of event and critical-path effect.",
  "phase": "concept | evt | dvt | pilot | pvt | mp | field",
  "source_ref": "Source filename",
  "linked_crisis_ids": []
}
```

## `_entropy.json`

The existing C24 entropy shape is valid and should be preserved:

```json
{
  "date": "YYYY-MM-DD",
  "score": 1,
  "snippet": "Short event text, ideally under 160 characters.",
  "type": "Document | Photo | ECO | Test | Vendor | Meeting",
  "source_ref": "Source filename",
  "phase": "optional phase",
  "linked_crisis_ids": [],
  "time_delta": 0
}
```

Rules:

- `score` is 1-10, where 8-10 means line-down, launch-blocking, safety/regulatory, or severe yield/cost risk.
- Every event needs a `source_ref`.
- Do not use entropy events for evergreen summary claims; they are dated pulses.

## `_crises.md`

`_crises.md` is the human-readable ledger derived from `_metrics.json.crises`. It should keep matching crisis IDs so editors can review the scar without parsing JSON.

```md
# Project Crisis Ledger

## c24-side-cap-banana-defect

- Type: thermal
- Phase: pilot
- Severity: 9/10
- Trigger: ...
- Root Cause: ...
- Intervention: ...
- Result: ...
- Metrics: metric-flatness-recovery
- Evidence: 944055165-166-00 baking fixture chg.pdf
```

## Prompt Stack

The NotebookLM stack is now split by artifact:

- `notebook-bolus`: produces a canonical consolidation payload for review.
- `notebook-metrics`: produces `_metrics.json` candidates, including relative metrics and quantified results.
- `notebook-vignettes`: produces crisis/scar records with stable IDs.
- `notebook-team`: produces `cast`.
- `notebook-timeline`: produces `timeline` and `_entropy.json` candidates.
- `notebook-bom`: produces `bom` and part/tooling context.
- `notebook-report`: produces `_intelligence.md` narrative.
- `notebook-podcast`: consumes reviewed bolus/report data only; it must not introduce new facts.

## Controlled Local Input Prep

Before mining a project:

1. Create or update a local manifest with notebook title, notebook ID, source count, source families, and known gaps.
2. Freeze inputs before prompt runs. If sources are added, increment the manifest audit date and rerun the whole prompt stack for that project.
3. Run extraction prompts separately. Do not ask NotebookLM to produce a report, metrics, cast, timeline, and audio in one response.
4. Save raw NotebookLM output into `src/content/_raw_nlm/`.
5. Normalize into sidecars only after local review. The sidecars are the controlled input boundary.
6. Project sidecar data into `index.mdx` frontmatter only after the sidecars validate.

## Remine/Refine Loop

1. Remine: run the current compiled prompt cartridge against a frozen notebook.
2. Diff: compare new raw output against existing raw output and sidecars.
3. Refine: fix prompt ambiguity or source gaps; do not hand-edit hallucinated claims into shape.
4. Normalize: write `_metrics.json`, `_crises.md`, `_entropy.json`, and `_intelligence.md`.
5. Project: update `index.mdx` frontmatter for existing UI surfaces.
6. Verify: run prompt compilation and content validation before any visual or Assembly work.

## Notebook Readiness Audit

Live NotebookLM inventory was checked on 2026-05-12. Classifications are source-count based and should be refined with source-family manifests before mining.

Ready/rich notebooks:

| Notebook | Sources | Readiness |
| :-- | --: | :-- |
| Digidesign_C24 | 343 | Ready for remine and W4 backfill |
| Avegant_Glyph | 419 | Ready |
| Hyphen_Dispensers | 222 | Ready |
| Hyphen_Backsplash | 214 | Ready |
| Hyphen_Portion-Cup | 208 | Ready |
| Hyphen_Makeline | 207 | Ready |
| NOON_Bazooka | 204 | Ready |
| NOON_Elvis | 193 | Ready |
| NOON_Waldo | 183 | Ready |
| NOON_Sativa | 182 | Ready |
| Kaleidescape_KSERVER-5000 | 148 | Ready |
| Kaleidescape_KPLAYER-6000 | 128 | Ready |
| Kaleidescape_KSERVER-1500 | 123 | Ready |
| Kaleidescape_Cinema-One | 119 | Ready |
| Motorola_MP600 | 98 | Ready |
| Kaleidescape_Sundance | 89 | Ready |
| Kaleidescape_M700 | 71 | Ready |
| Kaleidescape_KSYSTEM-120 | 66 | Ready |
| Kaleidescape_Project_Carousel | 63 | Ready |
| Mobile_Outfitters | 57 | Ready |
| HP_Jornada-430 | 52 | Ready, but source family should be checked |

Partial notebooks:

| Notebook | Sources | Readiness |
| :-- | --: | :-- |
| Digidesign_D-Command | 36 | Partial, likely remineable |
| Digidesign_D-Control | 35 | Partial, likely remineable |
| WebTV_Galaxy | 35 | Partial |
| Digidesign_SC48 | 29 | Partial, likely enough for targeted thermal extraction |
| WebTV_Cortez | 24 | Partial |
| Digidesign_ALL_eml | 18 | Partial aggregate |
| WebTV_Elmer | 13 | Partial |
| WebTV_ALL_eml | 8 | Partial to blocked unless source families are strong |

Blocked or source-deficient notebooks:

| Notebook | Sources | Reason |
| :-- | --: | :-- |
| SGI_Personal-Iris | 1 | Too sparse for schema-conformant mining |
| Avegant_ALL_eml_thin | 1 | Aggregate wrapper, not enough by itself |
| Locoroll_Noon_ALL_eml_thin | 1 | Aggregate wrapper, not enough by itself |
| Microsoft_ALL_eml | 2 | Too sparse |
| UltimateTV_ALL_eml | 1 | Too sparse |

Local raw data reinforces the same split. Rich local JSON exists for C24, Avegant Glyph, Cinema One, SC48, D-Command, D-Control, WebTV Galaxy/Cortez/Elmer, KSystem-120, Room Director, Bazooka, M700, Makeline, Backsplash, Extension Switches, Wall Plates, Carousel, Portion Cup, KServer-5000, Dispensers, KServer-1500, Motorola MP3, Sundance, and KPlayer-6000. Many legacy project JSON files are under 1 KB and should be treated as stubs until sources are added.

## C24 Backfill Requirements

C24 is ready to backfill, but the current live page is not canonical enough:

- NotebookLM source inventory is strong: `Digidesign_C24`, 343 sources.
- Raw outputs already exist: `c24_bolus.json`, `c24_report.md`, `c24_team.md`, `c24_development_timeline.md`, `c24_parts.md`, `c24_vignettes.md`, `c24.json`, and `src/config/c24_intelligence.json`.
- Live project frontmatter currently has `cast` and `audio_url`, but lacks canonical `metrics`, `forensic_metrics`, `scars`, `timeline`, `bom`, and `forensic_summary` projection.
- Existing sidecars are `_intelligence.md` and `_entropy.json`; `_metrics.json` and `_crises.md` do not exist yet.

Required W4 backfill:

1. Build `src/content/projects/c24/_metrics.json` from reviewed raw outputs.
2. Build `src/content/projects/c24/_crises.md` with stable crisis IDs.
3. Normalize duplicate cast entries, especially duplicate Erik/Architect records.
4. Reconcile C24 metrics across `c24_bolus.json`, `c24.json`, and `src/config/c24_intelligence.json`.
5. Preserve these initial crisis records: side-cap banana defect, top-panel no-bid, headphone jack trap door, DCD/geometric firewall, EMI/thermal rake pivot, CMF/silkscreen quality crisis.
6. Project only validated fields into `index.mdx` frontmatter after the sidecars are reviewed.
7. Do not start Assembly wiring; keep `_intelligence.md` and `_entropy.json` stable for later downstream work.

## Follow-On Tickets

- W1: implement sidecar validator for `_metrics.json`, `_entropy.json`, and `_crises.md` ID parity.
- W1: add a source-manifest preparation script or convention for NotebookLM notebook audits.
- W1/W2: remine C24 with the current prompt stack and compare against existing C24 raw outputs.
- W4: perform C24 sidecar backfill and frontmatter projection.
- W6: reconcile `hydrate_content.py` behavior with sidecar-first canonical data.

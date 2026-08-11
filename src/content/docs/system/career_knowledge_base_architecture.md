---
title: "Career Knowledge Base Architecture"
description: "Local source-pack architecture for deep and lite project pages."
slug: "career-knowledge-base-architecture"
---

# Career Knowledge Base Architecture

> **Disposition (2026-07-01, updated 2026-08-10): SUPERSEDED — rejected as architecture.**
> `D:\GitHub\portfolio-canon` is the authority for reviewed career claims, while
> `D:\GitHub\portfolio-evidence` holds source material and the local opaque-ID registry.
> This proposal's separate KB root would have created a duplicate authority. Retained for
> the record: the state inventory below, the audit script
> (`scripts/audits/career_kb_inventory.py`), and the NLM extractor suite
> (`scripts/career_kb/`), which writes its small index beside the canon census.

**Status:** Superseded (was Candidate v0.1)  
**Audit script:** `scripts/audits/career_kb_inventory.py`  
**Audit command:** `python scripts/audits/career_kb_inventory.py --format md --out tmp/career-kb-inventory.md`

## Objective

Build a local, auditable career knowledge base that can drive roughly 50 deep project pages and roughly 50 lite project pages without making NotebookLM, a chat transcript, or Astro frontmatter the system of record.

The system of record should be local source packs plus claim ledgers. The public site should be a projection of reviewed knowledge, not the place where facts are invented or manually patched into shape.

## Verified current state

The first read-only inventory found:

- `D:\GitHub\portfolio` exists and contains the live Astro site.
- `D:\portfolio\portfolio_working` exists and is the broad local project archive.
- `D:\GitHub\portfolio-canon` contains reviewed records and claim ledgers.
- `D:\GitHub\portfolio-evidence` contains local source material and its path/hash registry.
- `D:\GitHub\portfolio-workspace\R2_MASTER` exists and contains curated asset folders.
- `D:\GitHub\portfolio-assets\R2_MIRROR` exists and contains processed asset folders.
- `D:\GitHub\global_agent\registry\notebooklm` exists and contains synced NotebookLM summaries and source lists.
- The site has 120 project records, with 111 published and 9 draft or unlisted.
- Current `presentation_mode` yields 33 deep-like published records and 78 lite-like published records.
- `src/content/_raw_nlm` contains 129 raw NotebookLM files, 127 unique stems, and 119 stems that match project slugs.
- Raw NotebookLM JSON includes only 5 notebook links today.
- The synced NotebookLM registry contains 46 docs, 28 unique slugs, and 22 slugs that match current project records.
- `R2_MASTER` contains 97 top-level folders, 91 matching project slugs.
- `R2_MIRROR` contains 102 top-level folders, 91 matching project slugs.
- Page frontmatter currently has 0 NotebookLM links, although some raw NLM files contain them.
- Only 1 project currently has `_intelligence.md`, and only 1 has `_entropy.json`.
- `_metrics.json`, `_crises.md`, and `data.json` are not broadly present.
- `src/pages/projects/[...slug].astro` currently disables `data.json` sidecar merging pending a frozen sidecar contract and validator. Any KB projection must account for this before relying on `data.json`.

## Core architecture decision

Do not start with a vector database. Start with a local file contract.

A vector index is a query acceleration layer. The durable knowledge layer is:

1. Source refs to local raw evidence.
2. NotebookLM extraction artifacts where they already exist.
3. Reviewed claim ledgers with source refs.
4. Reviewed sidecars for renderable structured data.
5. Generated project pages.
6. Registry/router ingestion after review.

NotebookLM remains useful as a mining and artifact surface, especially for the existing dedicated notebooks. It is not the canonical source of career truth. NotebookLM output is evidence-adjacent until each claim traces to local source refs.

## Proposed local KB root

Use a workspace-level KB beside `R2_MASTER`, not inside the Astro source tree:

```text
D:\GitHub\portfolio-workspace\career-kb\
  index\
    projects.yaml
    notebooks.yaml
    source_roots.yaml
    page_targets.yaml
  projects\
    {slug}\
      manifest.yaml
      sources.yaml
      claims.jsonl
      narrative.md
      lite.md
      deep.md
      extraction-log.jsonl
      notebooklm\
        summary.md
        sources.md
        raw\
      render\
        index.frontmatter.yaml
        index.body.md
        _metrics.json
        _crises.md
        _entropy.json
        _intelligence.md
```

Rules:

- Do not copy raw binary archives into the KB.
- Store local source references, content hashes where cheap, and extraction notes.
- Keep R2 assets in `R2_MASTER` and `R2_MIRROR`.
- Keep public render projection in `D:\GitHub\portfolio\src\content\projects\{slug}`.
- Keep NotebookLM extracts under the project source pack as imported evidence-adjacent artifacts.
- Push accepted summaries and claim ledgers into the EN-OS registry/router only after review.

## Project contract

### `manifest.yaml`

Minimum fields:

```yaml
schema_version: career-kb.project.v0.1
slug: c24
title: "C|24"
page_tier: deep
status: source_pack
allowed_statuses:
  - source_pack
  - mined
  - reviewed
  - projected
  - published
owner_repo: "D:\\GitHub\\portfolio"
site_project_path: "D:\\GitHub\\portfolio\\src\\content\\projects\\c24"
asset_paths:
  r2_master: "D:\\GitHub\\portfolio-workspace\\R2_MASTER\\c24"
  R2_MIRROR: "D:\\GitHub\\portfolio-assets\\R2_MIRROR\\c24"
source_roots:
  - "D:\\GitHub\\portfolio-evidence\\raw"
  - "D:\\portfolio\\portfolio_working"
notebooklm:
  notebooks: []
  registry_docs: []
readiness:
  state: ready
  allowed_states:
    - ready
    - partial
    - blocked
  reason: short explanation
  missing_inputs: []
last_audited: YYYY-MM-DD
```

### `sources.yaml`

Purpose: source inventory, not narrative.

```yaml
schema_version: career-kb.sources.v0.1
slug: c24
sources:
  - id: src-c24-pilot-run-report
    title: 07_09_07_Pilot run report for CMD24_July07.pdf
    kind: pdf
    local_path: D:\portfolio\portfolio_working\...
    source_family: quality_report
    date: 2007-07-09
    hash: optional
    notes: what this source can prove
```

### `claims.jsonl`

Purpose: one claim per line, all sourceable.

```json
{"claim_id":"c24-flatness-recovery","slug":"c24","claim":"Reduced side-cap flatness deviation from 2.50 mm to under 0.50 mm.","claim_type":"quantified_result","source_refs":["src-c24-dims-before-after"],"confidence":"high","page_targets":["deep"],"status":"reviewed"}
```

### `lite.md`

Purpose: a short page payload.

Required shape:

- One-sentence role and product description.
- 3 to 5 proof bullets.
- 1 to 3 source refs.
- Hero asset ref if available.
- No unsourced numerical claims.

### `deep.md`

Purpose: a full project page payload.

Required shape:

- Lead paragraph.
- Context and constraints.
- Trigger, intervention, result sequence.
- Numbers section with deduplicated metrics.
- Scar ledger references.
- Source trail.
- Visual evidence plan.

## Projection path into Astro

The generator should write only reviewed data into the site:

```text
career-kb/projects/{slug}/render/index.frontmatter.yaml
career-kb/projects/{slug}/render/index.body.md
career-kb/projects/{slug}/render/_metrics.json
career-kb/projects/{slug}/render/_crises.md
career-kb/projects/{slug}/render/_entropy.json
career-kb/projects/{slug}/render/_intelligence.md
        |
        v
D:\GitHub\portfolio\src\content\projects\{slug}\index.mdx
D:\GitHub\portfolio\src\content\projects\{slug}\_metrics.json
D:\GitHub\portfolio\src\content\projects\{slug}\_crises.md
D:\GitHub\portfolio\src\content\projects\{slug}\_entropy.json
D:\GitHub\portfolio\src\content\projects\{slug}\_intelligence.md
```

Do not re-enable `data.json` projection until a validator exists. Current page routing explicitly disables `data.json` merge to avoid unvalidated sidecar injection.

## Deep vs lite page gates

### Deep project

A project can become deep when it has:

- A reviewed source manifest.
- A claim ledger with source refs.
- A full narrative in `deep.md`.
- A `forensic_summary` projection.
- Either `forensic_metrics` or `_metrics.json`.
- A source trail that names evidence artifacts.
- R2 asset coverage or a documented visual gap.
- Build and visual validation.

### Lite project

A project can remain lite when it has:

- Clean identity metadata.
- A 140 to 300 character description.
- 3 to 5 sourced proof bullets.
- A short body or `lite.md` projection.
- A hero image when available.
- No implied deep-dive promises.

Lite pages should not carry deep HUD affordances with empty data. Empty promises are worse than small honest pages.

## NotebookLM extraction tooling (verified)

The "existing tooling for extraction" is real but was not healthy or scalable enough for a 50-project migration without repair. Verified state:

- `scripts/mine_c24.py` is the legacy cartridge runner. It is hardcoded to `slug = "c24"` and a single NotebookLM UID, so "run it for every project" meant copying it once per slug.
- `mine_c24.py` (and `global_agent/scripts/run_audio_generation.py`) depend on `nlm.exe` under `C:\Users\erik\AppData\Roaming\Python\Python314\Scripts\`. The `nlm.exe` shim exists, but the Python 3.14 runtime it points at no longer exists, so that path is orphaned.
- The EN-OS registry already records the decision to abandon `nlm.exe` in favor of `notebooklm-py`. The dead shim above is consistent with that retirement, not a regression to fix.
- `notebooklm-py` is the maintained extraction path (`global_agent/scripts/notebooklm_sync.py`, `run_campaign.py`).
- `notebooklm-py` is installed in `D:\GitHub\global_agent\venv` only. It is **not** installed in the active portfolio/Hermes Python runtime, so any extractor invoked from the portfolio repo must resolve the capable runtime.
- `scripts/career_kb/career_kb_extract.py` is the replacement: a slug-parameterized extractor that runs on the maintained `notebooklm-py` path, auto-re-execs under the `global_agent` venv when the current runtime lacks the library, and dry-runs by default (live extraction requires `--live`).
- `index/notebooks.yaml` (generated by `scripts/career_kb/career_kb_notebooks.py`) reconciles the count discrepancy: **50** mapped NotebookLM titles collapse to **32** unique slugs - **27** dedicated project slugs (matching the "~26 dedicated" figure) plus **5** aggregate `ALL_eml`-style notebooks.

## NotebookLM migration path

Treat existing NotebookLMs as a finite migration batch:

1. Map each NotebookLM to a project slug in `index/notebooks.yaml`.
2. Import its current registry doc and source list into `projects/{slug}/notebooklm/`.
3. Run extraction through `scripts/career_kb/career_kb_extract.py` (the slug-parameterized, runtime-aware path) into raw exports - not the legacy `mine_c24.py` / `nlm.exe` path. Refresh `notebooklm-py` auth first; the extractor stops cleanly at cookie/auth loading when credentials are stale.
4. Normalize into claims and sidecars only after local review.
5. Mark the notebook migrated only when the project can be queried and rendered locally without opening NotebookLM.

Recommended fixtures:

- `c24` - richest source set and golden specimen.
- `sc48` - technical thermal extraction validation.
- `webtv-cortez` - partial NotebookLM plus strong source-trail behavior.

## Implementation phases

### Phase 0 - Inventory

Done in candidate form by `scripts/audits/career_kb_inventory.py`.

Next improvements:

- Add source family counts per project.
- Add raw archive path candidates per slug.
- Emit `index/projects.yaml` seed data.
- `index/notebooks.yaml` seed data is generated by `scripts/career_kb/career_kb_notebooks.py` (done in candidate form); extend it with raw NLM URLs.

### Phase 1 - Schema and fixtures

- Create `career-kb/index/source_roots.yaml`.
- Create source packs for `c24`, `sc48`, and `webtv-cortez`.
- Build a validator for `manifest.yaml`, `sources.yaml`, and `claims.jsonl`.
- Prove that each fixture can generate site-safe render sidecars.

### Phase 2 - Projection generator

- Build `scripts/career_kb_project.py` with commands:
  - `audit`
  - `seed`
  - `validate`
  - `project --slug {slug}`
  - `project --tier deep|lite`
- Keep generator writes deterministic.
- Refuse to write if the source pack has unreviewed claims or missing sources.

### Phase 3 - NotebookLM batch migration

- Migrate the dedicated NotebookLM notebooks into project source packs.
- Keep raw NotebookLM output separate from reviewed claims.
- Batch only after the three fixtures pass validation.

### Phase 4 - Scale-out

- Promote 50 deep pages by readiness, not by desire.
- Promote 50 lite pages with honest scoped payloads.
- Push reviewed summaries into registry/router for query.
- Use the public `/api/projects.json` endpoint as a downstream answer-engine projection, not as canonical truth.

## Immediate risks

- Current project pages already contain large pasted forensic reports. Some are useful source-adjacent text, but they are not a clean source pack.
- Existing raw NLM files are broad, but only 5 have notebook URLs embedded.
- Current page frontmatter has no NotebookLM links projected.
- Sidecar coverage is almost absent except C24.
- `data.json` sidecar merge is disabled, so sidecar-first projection needs validator work before rich sidecars can feed every page.
- Asset coverage is strong but incomplete. 29 project slugs do not match `R2_MASTER` or `R2_MIRROR` folders today.

## Clarifying questions

1. Should the canonical KB root be `D:\GitHub\portfolio-workspace\career-kb`, or do you want a new Git repo such as `D:\GitHub\portfolio-knowledge`?
2. Is the target exactly 50 deep plus 50 lite, or should the system classify all 111 published projects and let readiness determine counts?
3. Should `ProjectArticle` become the default renderer for both deep and lite pages, with Hyperspace reserved as a special exhibit layer?
4. Do you want NotebookLM migration to import only summaries/source lists first, or also chat history, notes, and generated audio artifacts where available?
5. For private client material, should `claims.jsonl` carry a `sensitivity` field before any registry/router ingestion?

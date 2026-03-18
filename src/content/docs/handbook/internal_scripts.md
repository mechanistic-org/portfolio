---
title: "Internal Scripts Reference"
description: "Documentation for internal maintenance scripts."
slug: "internal_scripts"
sidebar:
  group: Handbook
  order: 50
---

# Internal Scripts Reference

**Status:** Active
**Last Audit:** Jan 2026

This document inventories the active toolchain and archived scripts.

## 1. Core Toolchain (Active)

These scripts are essential for the daily build and content workflows.

| Script                 | description                                                   | Usage                      |
| :--------------------- | :------------------------------------------------------------ | :------------------------- |
| `hydrate_content.py`   | Syncs content from JSON dumps & Mines R2_MASTER for stickies. | `npm run content:hydrate`  |
| `process_assets.py`    | Optimises and moves assets from `R2_MASTER` to `R2_STAGING`.  | `npm run assets:process`   |
| `sync_r2.py`           | Syncs `R2_STAGING` to Cloudflare R2 bucket.                   | `npm run sync:assets`      |
| `generate_content.py`  | Generates placeholder/stub content for new projects.          | `npm run content:generate` |
| `keystatic.config.tsx` | CMS Configuration (Root).                                     | core config                |
| `ci-prebuild.js`       | Pre-build hook.                                               | CI                         |
| `setup_workspace.py`   | Workspace setup.                                              | Setup                      |

## 2. Generators (Active)

Scripts that create new assets or structures.

| Script                             | Purpose                       |
| :--------------------------------- | :---------------------------- |
| `scaffold_kaleidescape_bubbles.py` | Scaffolds bubble directories. |
| `generate_dynamic_favicon.py`      | Generates favicons.           |
| `generate_gallery.py`              | Generates gallery artifacts.  |
| `generate_resume_pdf.cjs`          | Generates PDF resume.         |
| `generate_topology.py`             | Generates topology data.      |
| `compile_hack_pack.py`             | Compiles hack pack.           |
| `compile_linkedin.py`              | Compiles LinkedIn posts.      |
| `catalog_workspace.py`             | Catalogs workspace.           |

## 3. External Integrations (Active)

Scripts interfacing with external APIs or tools.

| Script                | Tool            |
| :-------------------- | :-------------- |
| `onshape_export.py`   | OnShape         |
| `transcribe_local.py` | Transcription   |
| `upscale.py`          | Image Upscaling |
| `stitcher.py` / `.js` | Stitching       |
| `stitch_eml.py`       | EML Stitching   |
| `setup_ffmpeg.py`     | FFmpeg Setup    |

## 4. Audits & Validation (`scripts/audits/`)

Consolidated location for all checking and validation scripts.

- `audit_docs.js`: Validates frontmatter.
- `audit_duplicates.py`: Checking for duplicate slugs.
- `audit_gold_diff.py`: Forensic content validation.
- `audit_keys.mjs`: Key validation.
- `check_all_metrics.py`: Metrics validation.
- `check_env_safe.py`: Environment check.
- `check_taxonomy_mismatches.js`: Taxonomy validation.
- `validate_schema_structure.py`: Schema validation.
- `validate_taxonomy.py`: Taxonomy validation.
- `validate_yaml_js.js`: YAML validation.

## 5. Diagnostics (`scripts/diagnostics/`)

Tools for deep-dive debugging and probing.

- `diagnose_content.ts`
- `diagnose_r2.py`
- `diagnose_stitch_failure.py`
- `probe_onshape.py`
- `probe_outlook.py`

## 6. Archive (`scripts/_archive/`)

Legacy, one-off fixes, migrations, and retired repair scripts.
_(Contains ~50+ scripts)_

- `clean_*`, `fix_*`, `migrate_*`
- `repair_dcontrol*`: Legacy references for D-Control logic.
- `ingest_*`
- `sanitize_*`
- `standardize_*`

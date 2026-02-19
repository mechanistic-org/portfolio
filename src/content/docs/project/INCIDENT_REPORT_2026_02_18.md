---
title: "Incident Report: The M700 Build Crash"
date: 2026-02-18
tags: [Forensics, Debugging, Bisection, Astro]
description: "Forensic analysis of a critical build failure caused by type mismatches in frontmatter tags, resolved via automated bisection."
---

# Incident Report: The M700 Build Crash

**Date:** February 18, 2026
**Duration:** ~2 Hours (02:45 UTC - 04:45 UTC)
**Impact:** Total CI/CD Pipeline Paralysis (`npm run build` failure)
**Root Cause:** Type Safety Violation in `m700/index.mdx`

## Executive Summary

A persistent build failure ("stuck build") paralyzed the deployment pipeline for approximately 2 hours. The failure manifested as a silent crash within the Astro Content Layer's `glob.js` loader, masking the true error. Through a rigorous "Nuclear Bisection" protocol, the issue was isolated to a single file: `src/content/projects/m700/index.mdx`. The root cause was a subtle YAML typing error where obscure integer values (`1`, `4`) were mixed into a String array (`tags`), crashing the schema validator.

## The Timeline

| Time (UTC) | Phase             | Description                                                                                                     |
| :--------- | :---------------- | :-------------------------------------------------------------------------------------------------------------- |
| **02:45**  | **Detection**     | User reports persistent build failures despite previous fixes.                                                  |
| **03:00**  | **Investigation** | Initial audits (`audit_frontmatter.cjs`) pass, leading to false negatives. Suspicion shifts to `glob.js` crash. |
| **03:30**  | **Isolation**     | "Nuclear Option" initiated. `prompts`, `loaders`, and `docs` quarantined. Crash persists in `projects`.         |
| **03:45**  | **Bisection**     | `bisect.cjs` script deployed. Automated batch testing of 176 project folders.                                   |
| **04:10**  | **Discovery**     | Bisection flags `m700` as the crash source. Manual inspection reveals `tags: [..., 1, 4]`.                      |
| **04:20**  | **Remediation**   | Invalid tags removed. Build passes locally.                                                                     |
| **04:30**  | **Cleanup**       | forensic artifacts (`_entropy.json`, etc.) moved to `analysis_quarantine` (167 files).                          |
| **04:45**  | **Restoration**   | Fix pushed to `main`. Pipeline restored.                                                                        |

## Technical Anatomy of the Failure

### The Symptom

The build would hang or fail with opaque errors citing `node_modules/astro/dist/content/loaders/glob.js`. Standard lineage trace failed because the error occurred _during_ the graph construction, not during rendering.

### The Root Cause

File: `src/content/projects/m700/index.mdx`
Field: `tags`

```yaml
# MALFORMED (Crash)
tags: [Mechanism, Yield, Process, Leadership, 1, 4]

# CORRECTED (Valid)
tags: [Mechanism, Yield, Process, Leadership]
```

**Why it crashed:** The Astro Content Schema expects `tags` to be an array of Strings (zod `z.array(z.string())`). When the YAML parser encountered raw integers `1` and `4` (likely footnote references pasted by mistake), it passed them to the validator. The validator, or the underlying YAML parser in `glob.js`, triggered an unhandled exception when trying to process these mixed types during the "Sync" phase, causing the silent failure.

## Remediation & Prevention

### Immediate Actions

1.  **Fixed `m700`:** Removed the invalid numeric tags.
2.  **Quarantined Artifacts:** Moved 50+ forensic files (`_intelligence.md`) to `analysis_quarantine` to prevent loader confusion.

### Long-Term Prevention

The `scripts/audit_frontmatter.cjs` tool was enhanced to specifically detect this "Type Mismatch" pattern:

- It now scans `tags` arrays for raw numeric values.
- It strictly enforces String typing for known string-only fields.

## Metrics

- **Debug Time:** 2 Hours
- **Files Scanned:** 230+
- **Cleanup Count:** 167 Files (Archived)
- **Result:** 100% Build Health

---
title: "Audit: SEO & AEO Infrastructure"
slug: "seo-aeo-infrastructure-audit"
description: "Forensic analysis of the 'Product Reality Engine' search and social visibility stack."
date: "2026-02-12"
tags: ["audit", "seo", "aeo", "infrastructure"]
---

# 📡 SEO/AEO Infrastructure Audit

**Date:** 2026-02-12
**Scope:** Hydration Pipeline, Astro Components, and Schema Strategy.
**Verdict:** **STRUCTURALLY SOUND, DATA STARVED.**

## 1. Executive Summary

The "Machine Readability" failure identified in the Legacy Review is **NOT** a content problem. It is a **Pipeline Defect**.

- **The Pipeline (Hydration):** Successfully injects deep forensic data (War Stories, Complexity) but **ignores** surface-level metadata (Title, Description).
- **The Broadcaster (JSON-LD):** Contains a critical typo (`compentencies`) and targets non-existent schema fields, rendering it partially blind.
- **The Result:** You have a "Ferrari Engine" (Forensic Content) inside a "Cardboard Box" (Generic Metadata).

---

## 2. Infrastructure Analysis

### A. The Hydration Gap (Critical)

_Target: `scripts/hydrate_content.py`_

The script is designed to inject _new_ forensic schemas (`scars`, `events`), but it explicitly **skips** standard frontmatter fields.

- **Evidence:** The script has handlers for `forensic_metrics`, `tags`, `reports`, etc., but **ZERO logic** to update `title` or `description` from the Source JSON.
- **Consequence:** When you update `notebook_dumps/c24.json` with a killer description, it never reaches `c24.mdx`. The site continues to display the placeholder "Other project".

### B. Schema Drift (JSON-LD)

_Target: `src/js/jsonLD.ts`_

The standard `Project` schema generation is broken due to code-schema mismatch.

- **Typo:** Code attempts to read `projectFrontmatter.compentencies` (sic).
- **Schema Mismatch:** The `content.config.ts` defines `additionalSkills` and `tags`, but `jsonLD.ts` ignores `tags` completely.
- **Impact:** Google/Perplexity sees your projects as having **Zero Keywords**.

### C. Social Graph (Open Graph)

_Target: `src/components/Seo/Seo.astro`_

- **Status:** **HEALTHY.**
- **Logic:** Correctly maps `og:time`, `og:image`, and `twitter:card`.
- **Caveat:** Because of the Hydration Gap (Point A), these healthy tags are being populated with generic data. Fixing A fixes C.

---

## 3. AEO Assessment (Answer Engine Optimization)

Your "Forensic Architecture" is naturally AEO-friendly (high density of "How" and "Why"), but technical barriers prevent ingestion.

| Factor                 | Status        | Notes                                                                              |
| :--------------------- | :------------ | :--------------------------------------------------------------------------------- |
| **Semantic Structure** | 🟢 **STRONG** | H2/H3 heirarchy in MDX is excellent for RAG.                                       |
| **Entity Graph**       | 🔴 **WEAK**   | JSON-LD is minimal. Missing connections (`sameAs`, `knowsAbout`).                  |
| **Audio-Readiness**    | 🟢 **STRONG** | `audio_url` and `transcript` fields exist in schema (ready for podcast ingestion). |

---

## 4. Strategic Recommendations

### Phase 1: The "Metadata Bridge" (High ROI)

Modify `hydrate_content.py` to enforce `title` and `description` from the Source JSON.

- **Why:** Immediately fixes the "Dreamjob" SEO failure.
- **Effort:** Low (10 lines of Python).

### Phase 2: Schema Hardening

Refactor `jsonLD.ts` to use the actual Zod schema fields.

- **Fix:** `keywords = tags.join(", ")`
- **Why:** Tells Google exactly what the project _is_ (e.g., "Thermal Engineering", "Crisis Management").

### Phase 3: The "Entity" Upgrade (Future)

Enhance `Project` schema to include `about` (linking to Concepts) and `mentions` (linking to Tools).

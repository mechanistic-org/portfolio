---
title: Machine Readability Report
slug: machine-readability-report
sidebar:
  group: Audits
  order: 10
description: Documentation for Machine Readability Report.
---
# Machine Readability Audit (ATS/AI)

> **Auditor:** Antigravity (Agent)
> **Date:** 2025-12-31
> **Subject:** `localhost:4321` (NorrOS Portfolio)
> **Persona:** "The Machine Recruiter" (Automated Parsing Bot)

## 🚨 Executive Summary
**Status: YELLOW (At Risk)**

While the portfolio excels in **Structured Data (JSON-LD)**—a rarity for engineering portfolios—it fails the "First Glance" test for bots due to **Placeholder Metadata** and **Structure Gaps**.

A human recruiter sees a high-fidelity 3D interface. A machine recruiter sees: `Title: dreamjob | Desc: Other project.` This discrepancy will cause the portfolio to be filtered out by relevance algorithms before a human ever sees the 3D work.

---
## 🔍 The Findings

### 1. Metadata (The "Handshake")
**Gravity:** 🔴 CRITICAL
The `<title>` and `<meta name="description">` tags are the first and often only things an ATS reads. Yours are currently set to ingestion defaults.

| Page | Current Title | Current Description | ATS Score |
| :--- | :--- | :--- | :--- |
| **Home** | `Erik Norris | Senior Staff ME...` | `System Index` | 🟡 **Fair** (Title is good, Desc is too vague) |
| **C24** | `C24` | `C24 - Other project.` | 🔴 **Fail** (Ambiguous. "C24" means nothing to a bot.) |
| **Dreamjob** | `dreamjob` | `dreamjob - Other project.` | 🔴 **Fail** (Looks like a test page.) |

### 2. Semantic Hierarchy (The "Skeleton")
**Gravity:** 🟡 WARNING
Bots expect a logical flow (`H1` -> `H2` -> `H3`). Skipping levels confuses the content parser, making it harder to determine what is a main section vs. a footnote.

*   **Home:** ✅ Single `H1`. ⚠️ Flat hierarchy (everything else is `H3`).
*   **C24 / Dreamjob:** ✅ Single `H1`. ⚠️ Jumps straight to cards/sections without a unifying `H2` (Introduction/Overview).

### 3. Structured Data (The "Secret Weapon")
**Gravity:** 🟢 PASS (EXCELLENT)
The `application/ld+json` blocks are correctly implementing `WebSite` and `Project` schemas.
*   **Why this matters:** This tells Google/LinkedIn explicitly: "This is a Project, not a Blog Post." Most portfolios lack this. **Keep this intact.**

---
## 🛠️ The Fix Plan

### Phase 1: The "High-Value" Metadata Patch
**Goal:** Replace low-signal placeholders with high-signal keywords.

**Action:** Update the frontmatter in `src/content/projects/*.mdx`.

#### For C24 (`src/content/projects/c24.mdx`)
```diff
- title: "C|24"
+ title: "C|24: Control Surface Architecture"
- description: "c24 - Other project."
+ description: "Lead Mechanical Engineer for the Digidesign C|24. A ground-up re-architecture of a flagship studio console, focusing on RoHS compliance, thermal management, and high-volume manufacturing."
```

#### For Dreamjob (`src/content/projects/dreamjob.mdx`)
```diff
- title: "dreamjob"
+ title: "The Visual Taxonomy (System Architecture)"
- description: "dreamjob - Other project."
+ description: "A comprehensive Visual Taxonomy demonstrating the breakdown of complex Engineering Systems into their atomic assets: Physical, Digital, and Abstract."
```

### Phase 2: The Heading Realignment
**Goal:** Restore the `H2` layer to the Layouts.
*   **Refactor:** Ensure `Hyperspace.astro` wraps the main content stickies in a logical `<section><h2>Overview</h2>...</section>` block or promotes specific "Deck" titles to `H2`.

### Phase 3: The "Keyword Injection" (Creative Matrix)
**Goal:** Ensure the "Creative Matrix" keywords actually appear in the `meta` tags.
*   **Automation:** Update `ingest_data.py` to auto-generate the `description` field field using the "Narrative STAR" summary if the CSV description is generic.

---
## 🤖 Robot Persona Tips
To ace the machine interview:
1.  **Don't be subtle.** Bots don't get nuance. Use literal job titles in your H1s/Titles.
2.  **Density matters.** Ensure your summary contains the "Hard Skills" (GD&T, Python, DFM, FEA) in plain text, not just in images.
3.  **Link Text:** Avoid "Click Here." Use "View FEA Analysis" or "Download DFM Report."

**Next Step:** Authorize **Phase 1** to immediately boost your machine visibility score.

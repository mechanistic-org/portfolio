---
title: "The Genesis Toolkit"
slug: "toolkit"
description: "Advanced tools for site scaffolding, mining, and architectural maintenance."
sidebar:
  group: "System Manual"
  order: 2
---

# The Genesis Toolkit

> **Audience:** Architects & System Administrators.
> **Purpose:** Tools for initializing, mining, or batch-processing the site data.
> **Warning:** These tools are powerful and can overwrite data. Use with caution.

## 1. Scaffolding New Content
If you have added a large batch of projects to `Main.csv` and want to generate blank MD files for them:

```bash
python scripts/scaffold_projects.py
```

*   **Input:** `data_source/Main.csv`
*   **Output:** `data_source/manual_content/{slug}.md`
*   **Logic:** Only creates files if they do not exist. Does not overwrite.

## 2. Resume Mining ("The Archivist")
To recover work history from legacy resume files (`.doc`, `.pdf`, `.docx`).

1.  **Staging:** Place files in `d:\GitHub\ErikNorris-workspace\resume_ingest_resistance-is-futile`.
2.  **Mining:**
    ```bash
    python scripts/mine_resumes.py
    ```
    *   Extracts text and deduplicates entries.
    *   Output: `data_source/inbox/RESUME_CORPUS.resume.md`.
3.  **Synthesis:**
    ```bash
    python scripts/ingest_inbox_raw.py
    ```
    *   Uses Gemini Flash to generate a timeline.
    *   Output: `data_source/manual_content/RESUME_CORPUS_timeline.md`.

## 3. Onshape Export ("The Weaponizer")
Automated CAD asset extraction to ensure Meter-scale reliability.

```bash
python scripts/onshape_export.py "ONSHAPE_DOCUMENT_URL" --output filename.x_t
```

*   **Prerequisites:** Set `ONSHAPE_ACCESS_KEY` and `ONSHAPE_SECRET_KEY`.
*   **Method:** "Clone & Burn". Creates a temporary private clone, sets units to Meter, exports, and deletes the clone.

## 4. Skill Refinement (AI Batch)
To regenerate the `Skills.csv` or `Expertise.csv` based on new project descriptions:

```bash
python scripts/refine_skills.py
```
*   **Use when:** You import a batch of projects and want to auto-tag them.

## 5. Content Generation (AI Batch)
To generate placeholder "Hero Content" for empty projects:

```bash
python scripts/generate_content.py
```
*   **Use when:** You have 50 new empty projects and need *something* on the page.
*   **Note:** Respects existing content (>1KB).

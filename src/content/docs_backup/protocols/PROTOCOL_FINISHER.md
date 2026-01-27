---
title: "Protocol: The Finisher"
description: "SOP for upgrading a scaffolded project to Gold Status."
---

# Protocol: The Finisher

**Trigger:** When a project page exists (via CSV ingestion) but lacks narrative depth ("Nexus Event").
**Goal:** Create/Update `data_source/manual_content/{slug}.md` to achieve **Gold Status**.

## 1. The Narrative Structure (STAR)
Every manual content file **MUST** follow this structure. No "wall of text."

```markdown
import { YouTube } from '@astro-community/astro-embed-youtube';
import ModelViewer from '@components/mdx/ModelViewer.astro';

## The Challenge
> **Context:** [1-sentence "Hook" - What was the stake?]

[Paragraph 1: The Problem. The Constraints. The "Why".]

## Engineering Approach
[The "How". Specific technical decisions.]

*   **[Key Feature 1]:** [Details]
*   **[Key Feature 2]:** [Details]

## Impact
[The "Result". Quantifiable metrics preferred.]
*   [Metric 1]
*   [Metric 2]

### Project Artifacts
{{MODEL_URL}}
```

## 2. Visual Audit
Check the `R2_STAGING/{slug}/` folder (or ask to check it).
*   **Hero:** Is there a `hero-*.jpg`? (Required for cover).
*   **Gallery:** Are there "process" shots? (Sketches, WIP, failures). The gallery should tell a story, not just show the final render.
*   **3D Assets:** Is there a `.glb`?
    *   *If yes:* Insert `{{MODEL_URL}}` or `<ModelViewer src="..." />`.
    *   *If no:* Do NOT insert the viewer (it defaults to "Neil Armstrong").

## 3. The "Datasheet" Check
*   **Admonitions:** Use at least one "Technical Note" or "Warning" to break up text.
    *   `:::note[Technical Detail]`
*   **Specs:** Are there specific numbers in the text? (e.g., "6061-T6 Aluminum", "+/- 0.05mm"). **Bold them.**

## 4. Execution Command
To run this protocol on a specific project, the User will say:
> "Run Protocol Finisher on [Project Slug]."

**Agent Actions:**
1.  Read `src/content/docs/prompts/UNIVERSAL_INGEST_PROMPT.md` (for voice/tone).
2.  Read `data_source/manual_content/{slug}.md` (if exists).
3.  Rewrite/Create the file using the structure above.
4.  Run `python ingest_data.py` to compile.

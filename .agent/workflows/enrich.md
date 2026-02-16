---
description: Ingests raw "Deep Research" text from the chat, splits it into Frontmatter (Nuggets) and Body (Narratives), and archives the raw source.
---

# /enrich [project-slug]

Use this command to ingest raw research text (e.g. from NotebookLM) into a project.

**Usage:**

1.  Type `/enrich [project-slug]` (e.g. `/enrich c24`)
2.  Paste the raw text below it.

**What happens:**

1.  **Archive**: The raw text is saved to `src/content/projects/[slug]/_research_log.md`.
2.  **Split**: I will parse the text for:
    - **Nuggets**: Metrics, Dates, Scars -> Updates Frontmatter.
    - **Narratioves**: Stories, Reports -> Appends to Body.
3.  **Verify**: I will show you the diff before applying.

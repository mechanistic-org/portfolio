---
description: Ingests raw "Deep Research" text from the chat, splits it into Frontmatter (Nuggets) and Body (Narratives), and archives the raw source.
---

# Workflow: Enrich Project

Trigger this workflow when the user pastes raw research text with the command `/enrich [project-slug]`.

## Protocol

1.  **Identify Target**: Locate `src/content/projects/[slug]/index.mdx`.
2.  **Archive Raw Input**:
    - Create or Append to `src/content/projects/[slug]/_research_log.md`.
    - Add a header: `## [ ] [Date]: Chat Ingestion`.
    - Paste the full raw text provided by the user.

3.  **Analyze & Split**:
    - **Scan for Nuggets**: Look for hard metrics, dates, or specific failure modes.
    - **Scan for Narratives**: Look for coherent paragraphs, reviews, or "War Stories".

4.  **Execute Updates (Atomic Ops)**:
    - **Op A (Frontmatter)**: Update `forensic_metrics`, `scars`, `timeline`, or `complexity_vector` with the Nuggets.
    - **Op B (Body)**: Append Narratives as new Level 2 Headers (`## VI. External Validation`, etc.) at the end of the file.

5.  **Verification**:
    - Run `npm run dev` (if not running) to confirm the build didn't break.
    - Present the diff to the user.

## Parsing Rules

- **Financials** (Prices, Margins) -> `forensic_metrics.financial`
- **Failures** (Mechanics, Thermal) -> `scars` (Label/Value/Description)
- **Dates** (Launch, EOL) -> `timeline`
- **Quotes/Reviews** -> Body Section (Blockquotes)

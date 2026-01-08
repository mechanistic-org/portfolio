---
title: "Intelligence Bolus Protocol"
slug: "intelligence-bolus"
description: "Schema for raw intelligence injection (NotebookLM -> System)."
---

# The Intelligence Bolus

> **Role:** Represents the injected "Mind" of a project, separate from its "Body" (MDX).
> **Source:** NotebookLM Export (Markdown).
> **Path:** `src/content/projects/[slug]/_intelligence.md`

## Theory of Operation

The **Intelligence Bolus** is a mechanism for injecting raw, high-fidelity research (from NotebookLM or Forensic Archives) into the system without polluting the curated "Presentation Layout" of the main `mdx` file.

The `mapCareerAssembly.ts` utility specifically hunts for these files (`?raw` import) and attaches them to the Project Node in the physics graph, allowing the "Mind" to be visualized or queried by the AI Agent in future sessions.

## Schema (Template)

When exporting from NotebookLM or creating manually, follow this Markdown structure:

```markdown
# [Project Name] Intelligence

> **Source:** [NotebookLM URL or Archive Path]
> **Date:** [YYYY-MM-DD]
> **Bolus ID:** [UUID]

## 1. Technical Specifications

_Raw capture of specs, tolerances, and materials._

## 2. Narrative Arc (The "Why")

_The strategic reasoning behind the project._

## 3. Key Decisions (The "How")

_Critical engineering trade-offs._
```

## Ingestion Logic

- **Keystatic:** Ignores these files (filtered out).
- **Astro Content:** Ignores these files (starts with `_`).
- **Assembly Utility:** Explicitly _targets_ these files using `import.meta.glob`.

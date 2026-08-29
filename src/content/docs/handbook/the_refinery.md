---
title: 'The Refinery: Asset & Content Sovereignty'
slug: the_refinery
sidebar:
  group: Handbook
  order: 1
description: 'Documentation for The Refinery: Asset & Content Sovereignty.'
---
# The Refinery: Asset & Content Sovereignty

> **Status: Superseded historical reference. Do not follow the procedures below.**
> Current authority is the repository `CLAUDE.md`, `D:\GitHub\portfolio-canon\README.md`,
> `D:\GitHub\portfolio-canon\DEEP_DIVE_SOP.md`, and
> `D:\GitHub\portfolio-canon\SLUG_MIGRATION_SOP.md`. Canon is the publishing
> authority, `portfolio-evidence` is local custody, `project_pipeline.py` is the
> only project-page writer, and generated site MDX is read-only.

> **Role:** The Archivist / The Data God
> **Objective:** Manage the definitive source of truth for Content (`src/content.config.ts` over MDX) and Assets (R2_MASTER).

## 1. The Pure Hyperspace Architecture

The "Hybrid" era of CSVs and manual markdown sidecars is over. We have moved to a **Pure Hyperspace** model.

### The Two Pillars

1.  **Content (Text/Data):** Authored as MDX, validated by Zod.
    - **Schema (source of truth):** `src/content.config.ts` (Astro content collections).
    - **Storage:** `src/content/projects/*.mdx`
    - **Timeline:** Dynamic via Collections (Metadata).
2.  **Assets (Media):** Managed via **R2_MASTER**.
    - **Storage:** `D:\GitHub\portfolio-workspace\R2_MASTER`
    - **Live:** `https://assets.eriknorris.com`
3.  **Intelligence (The Fuel):** High-fidelity data for the **Assembly Engine**. (`src/content/projects/*/_intelligence.md`)

---
## 2. The Intelligence Bolus (Assembly Fuel)

**Status:** The "Assembly" (`/assembly`) is transitioning to become the **Main Interface**.
**Task:** "Hunting" involves finding old notebooks to "feed" this engine.

- **Role:** The Cognitive Layer.
- **Target:** `src/content/projects/[slug]/_intelligence.md`
- **Visibility:** Visualized in the **Exploded View** (Assembly); not part of the project collection schema.

### Hunting Protocol ("Feeding the Assembly")

1.  **Locate:** Find an old notebook (PDF/OneNote/Evernote).
2.  **Extract:** Use NotebookLM to generate the **Bolus Schema**.
3.  **Inject:** Save as `_intelligence.md` in the project folder.
4.  **Verify:** Check `http://localhost:4321/assembly` to see the new neural connection.

### Schema

```markdown
# [Project Name] Intelligence

> **Source:** [NotebookLM URL]
> **Bolus ID:** [UUID]

## 1. Technical Specifications

_Raw capture of specs, tolerances, and materials._

## 2. Narrative Arc

_The strategic reasoning._
```

---
## 3. Content Protocol (MDX + Zod)

Content lives in version-controlled MDX. The **single source of truth is the Zod schema**
in `src/content.config.ts` — it defines and validates every field. `astro check` / the build
will fail loudly on drift, which is the guardrail that replaced the old CMS.

> **Note:** Keystatic (a dev-only CMS that briefly sat over the MDX) was fully retired in #104.
> There is no `/keystatic` board, and dev/prod both run `output: "static"`.

### How to edit content

1.  **Start Dev Server:** `npm run dev` (port 4321).
2.  **Edit the MDX directly** under `src/content/projects/<slug>/index.mdx`.
3.  **Mind the pipeline.** Forensic fields (`forensic_summary`, `scars`, `metrics`, `cast`,
    `timeline`, …) are **injected by `hydrate_content.py`** — don't hand-author what the
    pipeline owns. Top-level metadata (dates, status, tech stack, gallery order) is safe to
    edit by hand.
4.  **Validate:** `npm run astro check` confirms the file still satisfies the schema.

---
## 4. Asset Protocol (The Air Gap)

**Rule #1:** NEVER commit heavy assets (JPG, PNG, GLB, MP4) to the Git Repo.
**Rule #2:** You ONLY edit `R2_MASTER`.

### The Three Zones of Reality

| Zone           | Path                                       | Purpose                                               |
| :------------- | :----------------------------------------- | :---------------------------------------------------- |
| **User Space** | `D:\GitHub\portfolio-workspace\R2_MASTER` | **YOUR WORKBENCH.** You add/delete/rename files here. |
| **Staging**    | `D:\GitHub\portfolio-assets\R2_MIRROR`   | **THE MIRROR.** Automated sync target. DO NOT TOUCH.  |
| **The Cloud**  | `Cloudflare R2 Bucket`                     | **THE CDN.** Stores files for the world to see.       |

### The Workflow

1.  **Capture:** Save raw assets to your `R2_MASTER` folder (`{slug}/bubbles/{name}/...`).
2.  **Process:** (Optional) Optimize heavy Tiffs/PSDs to WebP in Master.
3.  **Sync:** Run the sync script to push Master changes to the World.

---
## 5. The Smelter (`scripts/modernize_content.py`)

The **Smelter** script keeps every MDX file in **Schema Compliance** with `content.config.ts`.

**When to run it:**

- After adding a new project MDX file.
- When the C24 Schema is updated and files need mass-patching.

**What it does:**

1.  **Reads** all MDX files.
2.  **Patches** missing fields (e.g., `metrics`, `context_tags`).
3.  **Enforces** Snake Case naming conventions.

```powershell
python scripts/modernize_content.py
```

---
## 6. Troubleshooting

### "My image isn't showing up!"

1.  Did you put it in `R2_MASTER`?
2.  Did you run the **Sync**?

### "A content collection / schema error on build!"

- **Fix:** Read the `astro check` output — it names the file and the field that violates
  `src/content.config.ts`. Correct the frontmatter (or run the Smelter) to match the schema.
- **Nuclear Option:** Delete the `.astro` folder and run `npx astro sync`.

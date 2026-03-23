---
title: 'The Refinery: Asset & Content Sovereignty'
slug: the_refinery
sidebar:
  group: Handbook
  order: 1
description: 'Documentation for The Refinery: Asset & Content Sovereignty.'
---
# The Refinery: Asset & Content Sovereignty

> **Role:** The Archivist / The Data God
> **Objective:** Manage the definitive source of truth for Content (Keystatic) and Assets (R2_MASTER).

## 1. The Pure Hyperspace Architecture

The "Hybrid" era of CSVs and manual markdown files is over. We have moved to a **Pure Hyperspace** model.

### The Two Pillars

1.  **Content (Text/Data):** Managed via **Keystatic** (`/keystatic`).
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
- **Visibility:** Visualized in the **Exploded View** (Assembly), ignored by the static CMS.

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
## 3. Content Protocol (Keystatic)

**WE DO NOT EDIT MARKDOWN FILES MANUALLY.**
_(Exception: Architects debugging format issues)_

### Access the CMS

1.  **Start Dev Server:** `npm run dev`
2.  **Open Board:** `http://localhost:4321/keystatic`

### The "Sovereign Manifest"

Keystatic is the **Single Source of Truth**. Use it to:

- Create new Projects.
- Edit "Briefs" (The 1-pager summary).
- Manage Project Metadata (Dates, Status, Tech Stack).
- Curate the Gallery (Drag & Drop sorting).

---
## 3. Asset Protocol (The Air Gap)

**Rule #1:** NEVER commit heavy assets (JPG, PNG, GLB, MP4) to the Git Repo.
**Rule #2:** You ONLY edit `R2_MASTER`.

### The Three Zones of Reality

| Zone           | Path                                       | Purpose                                               |
| :------------- | :----------------------------------------- | :---------------------------------------------------- |
| **User Space** | `D:\GitHub\portfolio-workspace\R2_MASTER` | **YOUR WORKBENCH.** You add/delete/rename files here. |
| **Staging**    | `D:\GitHub\portfolio-assets\R2_STAGING`   | **THE MIRROR.** Automated sync target. DO NOT TOUCH.  |
| **The Cloud**  | `Cloudflare R2 Bucket`                     | **THE CDN.** Stores files for the world to see.       |

### The Workflow

1.  **Capture:** Save raw assets to your `R2_MASTER` folder (`{slug}/bubbles/{name}/...`).
2.  **Process:** (Optional) Optimize heavy Tiffs/PSDs to WebP in Master.
3.  **Sync:** Run the sync script to push Master changes to the World.

---
## 4. The Smelter (`scripts/modernize_content.py`)

Even with Keystatic, the **Smelter** script remains vital for **Schema Compliance**.

**When to run it:**

- After adding a new Project in Keystatic.
- When the C24 Schema is updated and files need mass-patching.

**What it does:**

1.  **Reads** all MDX files.
2.  **Patches** missing fields (e.g., `metrics`, `context_tags`).
3.  **Enforces** Snake Case naming conventions.

```powershell
python scripts/modernize_content.py
```

---
## 5. Troubleshooting

### "My image isn't showing up!"

1.  Did you put it in `R2_MASTER`?
2.  Did you run the **Sync**?

### "Keystatic crashed!"

- **Fix:** Check your terminal. Likely a JSON syntax error in a recent edit.
- **Nuclear Option:** Delete `.astro` folder and run `npx astro sync`.

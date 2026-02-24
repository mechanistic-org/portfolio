---
description: The official protocol for enriching project files using the "Three Vector" Mining Campaign via Python scripts.
---

# Hydrate Project Workflow

Trigger this workflow by running `/hydrate_project` or asking to "Titrate" or "Hydrate" a project.

## Usage

**When to use:** Onboarding a new project or "Re-Hydrating" an existing one with NotebookLM research.
**Master Tracker:** `src/content/docs/project/MINING_LOG.md`

## The Architecture: "The Three Vectors"

We use three distinct mining operations that result in three distinct artifacts. Do NOT attempt to merge these all manually.

| Vector            | Output Artifact                      | Goal                                     |
| :---------------- | :----------------------------------- | :--------------------------------------- |
| **1. Narrative**  | `forensic_summary` (in `index.mdx`)  | The Metabolic Layer (Isomorphic Proofs). |
| **2. Complexity** | `complexity_vector` (in `index.mdx`) | The Mass (BOM/Process).                  |
| **3. Entropy**    | `_entropy.json`                      | Data Stories (Event Log).                |

## Verification & Prerequisites

Before executing, verify the user has run the prompts in NotebookLM and placed the raw text dumps (the "Red Gold" - data won with blood/experience) into the correct locations:

- `notebook_dumps/{slug}.txt` or `notebook_dumps/{slug}.md` for narratives.

## Execution Steps

1.  **Complexity Vector** (If provided):
    - Paste the JSON into the `index.mdx` frontmatter under `complexity_vector`.

2.  **Entropy Vector** (If provided):
    - Paste the JSON array into `src/content/projects/{slug}/_entropy.json`. Do NOT paste 50+ events into `index.mdx`.

3.  **Narrative Vector** (The Body):
    - **CRITICAL**: Do NOT manually edit or "titrate" the body text for Tier 1/2 projects.
    - Run the pipeline script: `python scripts/hydrate_content.py --slug {slug} --force`
    - This script uses `smart_merge_lists` to inject the narrative while preserving your manual backported edits.

4.  **Verification**:
    - Run `npm run dev` to confirm the local preview works.
    - Does `index.mdx` contain the full "Forensic Report" header?
    - Are there any 404 errors? (If yes, follow the Virtual Bridge rules in the `asset_sovereignty` skill).

5.  **Log the Win**:
    - Open `src/content/docs/project/MINING_LOG.md`.
    - Update the status for the project to 🟢 (Ready State).
    - **DO NOT** update `AGENCY_MEMORY.md` with this status (See the Sovereign Ledger rule in the `conversation_miner` skill).

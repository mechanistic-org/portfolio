---
title: "NotebookLM Mining Guide (v2.0)"
slug: "notebook-usage"
sidebar:
  group: "Handbook"
  order: 22
---

# 📓 NotebookLM Mining Guide (v2.0)

**Role:** The "Operator Manual" for the Three Vector Mining Campaign.
**Tool:** Google NotebookLM (Experimental).

## Concept: "The Cartridge System"

NotebookLM is powerful but drifts easily. To keep it on track, we use "Prompt Cartridges" (`_READY.txt` files) that reprogram its behavior for specific extraction tasks.

| Vector            | Cartridge                                                                                             | Output Artifact     | Goal                                  |
| :---------------- | :---------------------------------------------------------------------------------------------------- | :------------------ | :------------------------------------ |
| **1. Narrative**  | [`REPORT_READY.txt`](file:///d:/GitHub/portfolio/src/content/prompts/REPORT_READY.txt)               | `forensic_summary`  | The Story (War Stories).              |
| **2. Complexity** | [`COMPLEXITY_READY.txt`](file:///d:/GitHub/portfolio/src/content/prompts/COMPLEXITY_READY.txt)       | `complexity_vector` | The Mass (BOM/Process/Tooling).       |
| **3. Entropy**    | [`SEISMOGRAPH_READY.txt`](file:///d:/GitHub/portfolio/src/content/prompts/SEISMOGRAPH_READY.txt)     | `_entropy.json`     | The Pulse (Event Log).                |
| **4. Meta**       | [`META_ANALYSIS_READY.txt`](file:///d:/GitHub/portfolio/src/content/prompts/META_ANALYSIS_READY.txt) | `isomorphics`       | The Pattern (Cross-Project Analysis). |

---

## Workflow: The Mining Loop

### Phase 1: Setup (The Notebook)

1.  Create a **New Notebook** for the Project (e.g., "C24 Analysis").
2.  **Upload Sources:** PDFs, Emails, Specs. (Do not upload generic marketing fluff).
3.  **Wait** for indexing to complete.

### Phase 2: Load Cartridge (System Instructions)

1.  Open **Notebook Settings** (or "Customize Chat").
2.  **Paste** the content of the desired `_READY.txt` file into the "System Instructions" box.
3.  **Save.** The Notebook is now in that specific "Mode."

> **Tip:** You cannot mix modes easily. It is often better to clear the chat context or toggle the System Instructions when switching vectors.

### Phase 3: Extraction (The Chat)

1.  **Type the Trigger Phrase** (e.g., "Extract Complexity Vector").
2.  The AI will output a **Structured JSON** or **Markdown** block.
3.  **Copy** the output.

### Phase 4: Ingestion (The Code)

1.  **Paste** the data into the repo:
    - **Complexity:** `index.mdx` (Frontmatter).
    - **Entropy:** `_entropy.json` (Sidecar).
    - **Narrative:** `index.mdx` (Body).
2.  **Verify** in Local Preview (`npm run dev`).
3.  **Log** completion in [`MINING_LOG.md`](file:///d:/GitHub/portfolio/src/content/docs/project/MINING_LOG.md).

---

## The Forensic Style Protocol (Feb 2026)

**The Split Brain Architecture:**

1.  **Audio Overview (The Studio):**
    - **Instruction:** [`PODCAST_READY.txt`](file:///d:/GitHub/portfolio/src/content/prompts/PODCAST_READY.txt).
    - **Role:** The **Talent**. Two hosts (Skeptic vs. Strategist) debating the engineering merits.
    - **Source of Truth:** [`GOLDEN_DIALOGUE_CORPUS.md`](file:///d:/GitHub/portfolio/src/content/docs/meta/GOLDEN_DIALOGUE_CORPUS.md).
    - **Protocol:** You MUST upload `GOLDEN_DIALOGUE_CORPUS.md` as a source and **Select It**. This file acts as the "Style Anchor," forcing the model to use specific metaphors ("Red Gold", "Forensic Architect") instead of generic banter.

2.  **Configure Chat (The Control Room):**
    - **Instruction:** [`REPORT_READY.txt`](file:///d:/GitHub/portfolio/src/content/prompts/REPORT_READY.txt).
    - **Role:** The **Fact Checker**.
    - **Why:** When the Audio Hosts make a claim (e.g., "He rejected 1,200 parts"), you use the Chat window to verify it. By setting the Chat to `REPORT_READY`, the bot becomes a Forensic Analyst, primed to validate specific data points against the uploaded specs.

## The "Meta-Analysis" (Endgame)

**Trigger:** When **12+ Projects** are hydrated.

1.  Create a **"Master Notebook"**.
2.  Upload the **JSON Outputs** from the previous steps (e.g., `c24.json`, `d-control.json`) as sources.
3.  Load the `META_ANALYSIS_READY.txt` cartridge.
4.  Run the analysis to find "Structural Rhymes" across the career.

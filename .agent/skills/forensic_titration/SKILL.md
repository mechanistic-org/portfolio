---
name: Forensic Titration
description: The official protocol for enriching project files using the "Three Vector" Mining Campaign (Narrative, Complexity, Entropy).
---

# Forensic Titration Protocol (v2.0)

## Usage

**When to use:** Onboarding a new project or "Re-Hydrating" an existing one.
**Trigger:** _"Check the Mining Log."_
**Master Tracker:** [`src/content/docs/project/MINING_LOG.md`](file:///d:/GitHub/eriknorris/src/content/docs/project/MINING_LOG.md)

## The Architecture: "The Three Vectors"

We no longer use a single "Bolus." We have three distinct mining operations that result in three distinct artifacts.

| Vector            | Prompt File             | Output Artifact                      | Goal                     |
| :---------------- | :---------------------- | :----------------------------------- | :----------------------- |
| **1. Narrative**  | `REPORT_READY.txt`      | `forensic_summary` (in `index.mdx`)  | The Story (War Stories). |
| **2. Complexity** | `COMPLEXITY_READY.txt`  | `complexity_vector` (in `index.mdx`) | The Mass (BOM/Process).  |
| **3. Entropy**    | `SEISMOGRAPH_READY.txt` | `_entropy.json`                      | The Pulse (Event Log).   |

## Protocol: The Chain of Custody

### Phase 1: Check the Log

1.  Open `MINING_LOG.md`.
2.  Identify a Project with **Pending (🔴)** status in any vector.

### Phase 2: Execute Mining (The User Loop)

1.  **Context:** Ask the User to open the relevant NotebookLM.
2.  **Config:** Instruct User to paste the specific `_READY.txt` content into "System Instructions."
3.  **Trigger:** Instruct User to run the specific trigger phrase (e.g., "Extract Complexity Vector").
4.  **Ingest:**
    - **Complexity:** Paste JSON into `index.mdx` frontmatter under `complexity_vector`.
    - **Entropy:** Paste JSON into `src/content/projects/{slug}/_entropy.json`.
    - **Narrative:** Manually titrate Markdown into `index.mdx` body.

### Phase 3: Validation

1.  **Verify:** Check the Local Preview.
    - Does the **Seismograph** appear in the HUD? (Entropy)
    - Does the **Complexity Chart** appear? (Complexity)
2.  **Log:** Update `MINING_LOG.md` status to 🟢.

## Critical Laws

### 1. The "Sidecar" Law (Entropy)

Seismograph data (`events` array) is TOO LARGE for Frontmatter. It MUST live in `_entropy.json`.
**Do not** paste 50+ events into `index.mdx`.

### 2. The "Sovereign Asset" Law

Do not generate images or audio. These are "Sovereign Assets" managed by `asset_sovereignty`.
Focus strictly on **Text** and **Data**.

### 3. The "Zero Loss" Law

When updating `index.mdx`:

- **Read** the existing file first.
- **Merge** the new vector.
- **Never** overwrite existing `war_stories` or `cast` unless explicitly instructed.

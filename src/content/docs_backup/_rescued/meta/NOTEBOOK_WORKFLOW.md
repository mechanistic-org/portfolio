---
title: "NotebookLM Workflow Protocols"
slug: "notebook_workflow"
last_updated: 2026-01-18
---

# NotebookLM Workflow & The "Leakage" Principle

> **CRITICAL OBSERVATION:** The Audio Model treats _all_ source text as "Content to be Performed."

## 1. The Leakage Principle

**The Trap:** If you include "System Override," "Execute Protocol," or meta-commentary in the source file, the Host **will read it aloud** or mock it.
**The Stealth Rule:** "Instructions in the Source are Content to the Voice."

### Mitigation Strategy: Decoupling

The workflow requires **Two Distinct Artifacts** for the two distinct AI models (Text vs. Audio).

#### Stage 1: Text Generation (The Analyst)

- **Goal:** Generate the written report, summary, or resume content.
- **Prompt:** Use `UNIVERSAL_NOTEBOOK_PROMPT.md` or `NOTEBOOK_REFINE.md`.
- **Behavior:** Heavy instruction ("Act as...", "Extract...", "Format as...").
- **Output:** A clean Markdown Text Deck or Note.

#### Stage 2: Audio Generation (The Actor)

- **Goal:** Generate the Podcast / Audio Overview.
- **Input:**
  1.  The **Clean Output** from Stage 1 (Convert Note to Source).
  2.  The **Sanitized** `AUDIO_PROTOCOL.md` (Phonetic Key & Character Bio).
- **Forbidden:** DO NOT include the "Prompt" file from Stage 1. It contains instructions that will leak.
- **Forbidden:** DO NOT include "Guardrails" or "Rules of Engagement" in the source text. Behavior must be implied by the Character Bio, not commanded.

## 2. The Bridge Protocol

1.  **Generate Text:** Run the prompt. Get the result.
2.  **Convert to Source:** Select the generated Note -> "Select as Source" (or copy-paste into a new Source Note).
3.  **Sanitize:** Ensure no instructions ("Here is the report...") remain.
4.  **Inject Voice:** Add `AUDIO_PROTOCOL.md` (The "Mouth" & "Mind").
5.  **Generate Audio:** Click "Generate".

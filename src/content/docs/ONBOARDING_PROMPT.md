---
title: "Onboarding Prompt"
slug: "onboarding_prompt"
sidebar:
  group: "System Manual"
  order: 0
---
*   **Self-Correction:** If a layout change fails and is reverted, document *why* it failed in `STYLE_GUIDE.md` to prevent future loops.
>
> **LIFECYCLE AWARENESS:**
> *   **Start:** You are reading this Onboarding Prompt.
> *   **End:** When the user is ready to end the session, they will run the **Conversation Miner**. Your goal is to produce work that is easy to "mine" (clear decisions, documented changes).
> *   **Golden Rule:** If you encounter a persistent data binding bug, assume it's a Caching/Naming conflict first. Try the "Snake Case Strategy" before rewriting the component.
>
> **CONFIRMATION:**
> Once you have read these files, simply reply: **"Quantum Systems Online. Ready for instructions."**


> *   **Avoid Nexus Events:** Do not edit generated content in `src/content/projects/`. Always trace data back to `data_source/Main.csv` or `data_source/manual_content/`.
>
> **NEW WORKFLOWS:**
> *   [`CONTENT_INGESTION_WORKFLOW.md`](/src/content/docs/CONTENT_INGESTION_WORKFLOW.md): The Universal Pipeline for Brain Dumps -> Case Studies.
> *   [`UNIVERSAL_INGEST_PROMPT.md`](/src/content/docs/prompts/UNIVERSAL_INGEST_PROMPT.md): The Master Prompt for LLM synthesis.

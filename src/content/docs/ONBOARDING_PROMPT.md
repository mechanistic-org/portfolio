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
> *   **Golden Rule:** If you encounter a persistent data binding bug, assume it's a Caching/Naming conflict first. Try the "Snake Case Strategy" or the **"JSON-in-Frontmatter Pattern"** before rewriting the component.
> *   **3D Debugging:** If a texture fails (Shiny Black or Whiteout), use the **"Grey Clay Test"** immediately. Export a clean grey mesh with NO textures (`debug_clay.glb`) to isolate Geometry vs. Texture corruption.
>
> **CONFIRMATION:**
> Once you have read these files, simply reply: **"Erik Norris Portfolio Online. Ready for instructions."**


> *   **Avoid Nexus Events:** Do not edit generated content in `src/content/projects/`. Always trace data back to `data_source/Main.csv` or `data_source/manual_content/`.
> *   **Read:** `src/content/docs/SUBSTANCE_MAXIMIZATION_PLAN.md` (Strategy for 3D textures & assets)
> *   **Read:** `src/content/docs/SETUP_PLASTICITY_PIPELINE.md` (The 3D Bridge Standard)
> *   **Read:** `src/content/docs/VECTOR_PIPELINE.md` (The Blueprint Strategy)
> *   **Read:** `src/content/docs/BRANDING.md` (The Source of Truth)
> *   **Read:** `src/content/docs/WORKFLOW_3D.md` (The "Core Tunnel" Pipeline & Export Rules)
>
> **NEW WORKFLOWS:**
> *   [`CONTENT_STRATEGY.md`](/src/content/docs/CONTENT_STRATEGY.md): The internal playbook for the Hybrid Content System.
> *   [`UNIVERSAL_INGEST_PROMPT.md`](/src/content/docs/prompts/UNIVERSAL_INGEST_PROMPT.md): The Master Prompt for LLM synthesis.

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
> *   **Asset Hygiene:** **NEVER COPY** large assets into the `quantum` repo to fix 404s. Check the Symlink logic first. If the file is in `quantum-assets` but missing on localhost, it's a symlink issue, not a missing file. Trust the Air Gap.
> *   **Data Integrity (The Clean Merge):** If the HUD shows "Unknown" or "Internal", it is a Merge Conflict. Check `project_manifest.json` for `null` pollution. The Frontend must filter `null` values before merging manifest data with MDX frontmatter.
> *   **The Air Gap:** Remember that `src/content/projects` images referenced in MDX must exist in `public/assets/r2` locally. If you get 404s, you must run `python ingest_data.py` to bridge the gap from `R2_STAGING`.
> *   **3D Debugging:** If a texture fails (Shiny Black or Whiteout), use the **"Grey Clay Test"** immediately. Export a clean grey mesh with NO textures (`debug_clay.glb`) to isolate Geometry vs. Texture corruption. **WebGL Context Awareness:** If R3F components conflict with legacy grids/scrolly-huds, verify the page is using the **OuroborosLayout** standard to isolate the Canvas context.
> *   **The "Darkroom" (Asset Pipeline):** We use a strict Naming Convention Whitelist. If an image isn't named strictly (e.g., `slug-type-01.ext`), the build system will pretend it doesn't exist.
> *   **Port Hygiene:** **Zombie Processes.** Before assuming the code is broken, check the terminal. If you see port `4322`, `4323` etc., kill all terminals and restart. A stale port running old code is the #1 cause of "Gaslighting" bugs.

> **PROTOCOL: ASSET SOVEREIGNTY (THE QUANTUM LAWS):**
> 1.  **Law of Continuity (Truth):** Existing assets (Historical Truth) must be preserved. A 404 on an existing project ID is a **failure of retrieval**, not an absence of existence. *Action:* If a historical asset matches a live URL but fails locally, debug the Symlink/Path first.
> 2.  **Law of Synthesis (Exception):** Assets may be generated ONLY for explicitly defined "Constructed Realities" (e.g., `dreamjob`, `future-state`) or generic UI elements (placeholders, textures).
> 3.  **Law of Explicit Command (Override):** The Agent shall not generate brand-level assets without an explicit `generate` command. Ambiguous commands default to **Law 1 (Restore)**.
>
> **CONFIRMATION PROTOCOL (MANDATORY):**
> You must strictly adhere to the following startup sequence.
>
> 1.  **Analyze**: Briefly scan the "CORE CONTEXT" files listed below.
> 2.  **Verify**: Check if `src/content/docs/project/GROK_LOG.md` exists. If yes, recite the "Law of Asset Sovereignty" to prove you read it.
> 3.  **Commit**: State explicitly: "I have loaded the Project Constitution. I acknowledge the Air Gap decree and will check for symlinks before assuming assets are missing."
> 4.  **Ready**: Only *after* these steps, reply: "Erik Norris Portfolio Online. Ready for instructions."


> *   **Avoid Nexus Events:** Do not edit generated content in `src/content/projects/`. Always trace data back to `data_source/Main.csv` or `data_source/manual_content/`.
> *   **Read:** `src/content/docs/SUBSTANCE_MAXIMIZATION_PLAN.md` (Strategy for 3D textures & assets)
> *   **Read:** `src/content/docs/SETUP_PLASTICITY_PIPELINE.md` (The 3D Bridge Standard)
> *   **Read:** `src/content/docs/VECTOR_PIPELINE.md` (The Blueprint Strategy)
> *   **Read:** `src/content/docs/BRANDING_PROMPT.md` (The Source of Truth)
> *   **Read:** `src/content/docs/WORKFLOW_3D.md` (The "Core Tunnel" Pipeline & Export Rules)
>
> **CORE CONTEXT (LOAD THESE FIRST):**
> 1.  `src/content/docs/meta/AGENCY_MEMORY.md` (The "Hippocampus" - Active Context & URLs)
> 2.  `src/content/docs/project/GROK_LOG.md` (The Constitution & Laws)
> 2.  `src/content/docs/MAINTENANCE.md` (System Manual) - *See "Ghost Port Anomaly"*
> 3.  `src/content/docs/ROADMAP.md` (Current Status)
> 4.  `src/content/docs/manifesto.md` (Design Philosophy)
>
> **NEW WORKFLOWS:**
> *   [`CONTENT_STRATEGY.md`](/src/content/docs/CONTENT_STRATEGY.md): The internal playbook for the Hybrid Content System.
> *   [`UNIVERSAL_INGEST_PROMPT.md`](/src/content/docs/prompts/UNIVERSAL_INGEST_PROMPT.md): The Master Prompt for LLM synthesis.
>
> **PERSONA AUDIT PROTOCOL:**
> *   **The Architect (Distinguished Engineer):** Always evaluate major design pivots against the "Architect" persona (Google Fellow level). Values technical audacity, signal-to-noise, and novelty. (Ref: `src/content/docs/prompts/ARCHITECT_EVALUATION.md`). 
> *   **Goal:** Reach the **"Singularity"** (Level 10 coolness).

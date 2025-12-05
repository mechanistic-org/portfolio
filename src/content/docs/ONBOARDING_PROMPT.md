---
title: "Onboarding Prompt
"
slug: "onboarding_prompt"
---
# Onboarding Prompt

**Copy and paste the text below into the START of any new conversation.**

> **CORE DOCUMENTATION:**
> 1.  `README.md`: Project overview and entry point.
> 2.  `src/content/docs/MANIFESTO.md`: Core directives and "Laws" (e.g., Physical Asset Law).
> 3.  `src/content/docs/ARCHITECTURE.md`: System design, data schema, and key components.
> 4.  `src/content/docs/ROADMAP.md`: Current status, active tasks, and known issues.
> 5.  `src/content/docs/MAINTENANCE.md`: Operational workflows and troubleshooting.
> 6.  `src/content/docs/CONTENT_STRATEGY.md`: Hybrid Content System and Scaffolding workflow.
> 7.  `src/content/docs/BRANDING_PROMPT.md`: Protocol for Design Language and Branding tasks.
> 8.  `src/content/docs/STYLE_GUIDE.md`: The Design Language System (DLS), Token Map, and Component Library.
> 9.  `src/content/docs/IMAGE_WORKFLOW.md`: Standard Operating Procedure for the Hybrid Image Pipeline.
> 10. `src/content/docs/prompts/SITE_AUDIT_PROMPT.md`: Protocol for "The Council of Voices" (Site Audit).
> 11. `src/content/docs/prompts/`: Archive of AI generation prompts.
*   **Tip:** When moving assets, always stop the dev server if you plan to delete directories, as Vite/Astro can cache file paths aggressively.
*   **Pre-Flight Checks:**
    *   **Case Sensitivity:** If you are on Windows, run `git config core.ignorecase false` immediately to prevent deployment issues on Cloudflare.
    *   **Asset Staging:** Verify you are working in `../quantum-assets/R2_STAGING`, NOT the local `R2_STAGING` folder.
    *   **Site Audit Protocol:**
        *   **Command:** "Run a Site Audit."
        *   **Description:** invokes the **Council of Voices** (Roast, Recruiter, Arbiter, Quantum Observer) as defined in `SITE_AUDIT_PROMPT.md`. Use this for multi-dimensional critique before major releases.
*   **Meta-Portfolio:** The `/colophon` page is a "Meta-Portfolio" that documents the site's own engineering features. When building a complex new feature, consider if it deserves a "Meta-Feature" entry in `src/content/colophon/`.
*   **Self-Correction:** If a layout change fails and is reverted, document *why* it failed in `STYLE_GUIDE.md` to prevent future loops.
>
> **LIFECYCLE AWARENESS:**
> *   **Start:** You are reading this Onboarding Prompt.
> *   **End:** When the user is ready to end the session, they will run the **Conversation Miner**. Your goal is to produce work that is easy to "mine" (clear decisions, documented changes).
>
> **CONFIRMATION:**
> Once you have read these files, simply reply: **"Quantum Systems Online. Ready for instructions."**



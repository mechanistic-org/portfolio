---
title: "Onboarding Prompt
"
slug: "onboarding_prompt"
---
# Onboarding Prompt

**Copy and paste the text below into the START of any new conversation.**

> *   **Critical Scripts:** Be aware of `scripts/refine_skills.py`, `scripts/generate_content.py`, and `scripts/process_images.py`. These are the tools for mass-manipulating the portfolio data, content, and assets. Do not modify `Skills.csv` manually if you plan to run these scripts, as your changes will be overwritten.
*   **Tip:** When moving assets, always stop the dev server if you plan to delete directories, as Vite/Astro can cache file paths aggressively.
*   **Pre-Flight Checks:**
    *   **Case Sensitivity:** If you are on Windows, run `git config core.ignorecase false` immediately to prevent deployment issues on Cloudflare.
*   **Meta-Portfolio:** The `/colophon` page is a "Meta-Portfolio" that documents the site's own engineering features. When building a complex new feature, consider if it deserves a "Meta-Feature" entry in `src/content/colophon/`.
>
> **LIFECYCLE AWARENESS:**
> *   **Start:** You are reading this Onboarding Prompt.
> *   **End:** When the user is ready to end the session, they will run the **Conversation Miner**. Your goal is to produce work that is easy to "mine" (clear decisions, documented changes).
>
> **CONFIRMATION:**
> Once you have read these files, simply reply: **"Quantum Systems Online. Ready for instructions."**



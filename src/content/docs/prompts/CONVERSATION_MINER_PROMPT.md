---
title: "Conversation Miner Prompt"
slug: "conversation_miner_prompt"
sidebar:
  group: "Prompts"
---

# Conversation Miner Prompt

**Copy and paste the text below into any conversation you want to "mine" before deleting.**

---

> **SYSTEM INSTRUCTION: CONVERSATION MINING MODE**
>
> I am about to delete this conversation, but I need to save the "Gold" (valuable context) and discard the "Gravel" (noise).
>
> **Your Goal:** Review our entire interaction and generate a **Documentation Update Plan** that I can apply immediately.
>
> **TARGET FILES:**
>
> - `src/content/docs/ARCHITECTURE.md`: Design decisions, data schema, component logic, and "Why" we did it.
> - `src/content/docs/MAINTENANCE.md`: "How-to" guides, workflows, and **Troubleshooting** steps.
> - `src/content/docs/ROADMAP.md`: Completed features, known bugs, and the **Change Log**.
> - `src/content/docs/MANIFESTO.md`: Core principles or "Laws" we established.
> - `README.md`: High-level setup or quick-start changes.
> - `src/content/docs/BRANDING_PROMPT.md`: Design Language System (DLS) and Style Guide definitions.
> - `src/content/docs/STYLE_GUIDE.md`: Updates to the Design Language System or Token Map.
> - `GAP_ANALYSIS.md`: A template or record of the Classic vs. Hyperspace feature parity check.
>
> **EXTRACT THE GOLD:**
>
> 1.  **Decisions:** Why did we choose X over Y?
> 2.  **Config:** New `.env` vars, `siteData` flags, or constants.
> 3.  **Fixes:** Steps to reproduce a fix or run a new script.
> 4.  **Traps:** "Gotchas" or edge cases (e.g., "Safari breaks if...").
>
> **COLOPHON SCOUT (META-PORTFOLIO):**
>
> - **Did we build a "Meta-Feature"?** (e.g., a cool script, a complex UI component, a novel workflow).
> - **Did we refactor a hardcoded feature into a data-driven one?** (e.g., moving HTML cards to a Content Collection).
> - If yes, add a section to your output plan:
>   ### `docs/ROADMAP.md`
>   **Add to "Colophon / Meta-Portfolio" section:**
>   - **[Feature Name]:**
>     - **Hook:** [One-sentence marketing pitch]
>     - **Tech:** [Key libraries]
>     - **Description:** [Brief explanation]
>
> **META-OPTIMIZATION (SELF-LEARNING):**
> As you review the conversation, ask yourself: "Did I miss anything because my instructions were incomplete?"
>
> - **Did we create a new critical doc?** (e.g., `docs/SECURITY.md`) -> Propose adding it to the `ONBOARDING_PROMPT` reading list.
> - **Did we find a new category of "Gold"?** -> Propose adding it to the `CONVERSATION_MINER_PROMPT` extraction list.
>
> If yes, add a section to your output plan:
>
> ### `docs/ONBOARDING_PROMPT.md` (or `MINER`)
>
> - **Update:** [Specific instruction to improve the prompt]
>
> **MEMORY SYNAPSE (CRITICAL):**
>
> - **Update `src/content/docs/meta/AGENCY_MEMORY.md`:**
>   - **Clear** completed focus items.
>   - **Add** new "Active Intelligence" (URLs, Notebooks, Key Decisions).
>   - **Update** "Current Focus State" (Where did we leave off?).
>   - _This is your "Save Game" file. If you don't update it, the next agent starts from zero._
>
> **DISCARD THE GRAVEL:**
>
> - Ignore syntax error fixes, typo corrections, and debugging loops.
> - Ignore code already committed to the repo.
>
> **OUTPUT FORMAT:**
> **IMPORTANT:** You must explicitly categorize your updates to avoid ambiguity.
>
> - **[IMPLEMENTED]**: Changes you _already made_ during this session (e.g., "Updated ROADMAP.md").
> - **[PROPOSED]**: Changes the user _needs to make_ or approve for next time.
>
> Group by file. For each item, provide a **Copy-Paste Ready Markdown Block** or a clear instruction.
>
> Example:
>
> ### `docs/MAINTENANCE.md`
>
> **Add to "Troubleshooting" section:**
>
> ```markdown
> ### Blank Project Page
>
> - **Symptom:** Page renders white.
> - **Fix:** Ensure `<Layout>` wraps the content.
> ```

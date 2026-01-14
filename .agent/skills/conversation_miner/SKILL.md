---
name: conversation_miner
description: A protocol for mining high-value context ("Gold") from chat logs before deletion and updating project documentation.
---

# Conversation Miner Skill

## When to use this skill

- When the user asks to "mine this chat" or "extract gold".
- At the end of a session before the user deletes the conversation history.
- When the user asks to "update documentation" based on recent work.

## Instructions

### 1. The Goal

Your objective is to review the entire interaction and generate a **Documentation Update Plan**. You must separate "Gold" (decisions, config, fixes, traps) from "Gravel" (typos, transient debugging).

### 2. Target Files for Updates

Scan the conversation for updates relevant to:

- `src/content/docs/ARCHITECTURE.md` (Why we did it)
- `src/content/docs/MAINTENANCE.md` (How to fix it)
- `src/content/docs/ROADMAP.md` (What we finished)
- `src/content/docs/MANIFESTO.md` (Laws established)
- `src/content/docs/BRANDING_PROMPT.md` (Design updates)
- `src/content/docs/STYLE_GUIDE.md` (Token updates)

### 3. Protocol: "Extract the Gold"

Look for:

- **Decisions:** Why did we choose X over Y?
- **Config:** New environment variables or constants.
- **Fixes:** Reproducible steps for bug fixes.
- **Traps:** Edge cases found.
- **Meta-Features:** Did we build something cool? (Add to Colophon in Roadmap).

### 4. Protocol: "Memory Synapse"

- **Update `src/content/docs/meta/AGENCY_MEMORY.md`**:
  - Clear completed focus items.
  - Add new "Active Intelligence" (URLs, Notebooks).
  - Update "Current Focus State" (Where did we leave off?).

### 5. Output Format

Generate a single markdown document categorized by file. Use tags to indicate status:

- **[IMPLEMENTED]**: Changes already made.
- **[PROPOSED]**: Changes the user needs to make.

**Example Output:**

```markdown
### `docs/MAINTENANCE.md`

**Add to "Troubleshooting" section:**

- **Symptom:** Page renders white.
- **Fix:** Ensure `<Layout>` wraps the content.
```

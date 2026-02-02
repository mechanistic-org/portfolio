---
name: conversation_miner
description: A protocol for mining high-value context ("Gold") from chat logs before deletion, sorting it into Tech (OS) and Meta (Profile) streams.
---

# Conversation Refinery Skill (v2)

## When to use this skill

- When the user asks to "mine this chat" or "extract gold".
- At the end of a session before the user deletes the conversation history.
- When the user asks to "update documentation" based on recent work.

## Instructions

### 1. The Goal: Dual-Stream Refining

Your objective is to separate the conversation into two distinct streams. Do NOT dilute them by mixing.

- **Stream A (Hard Ore):** Technical updates (Code, Config, Fixes).
- **Stream B (Red Gold):** Meta updates (Identity, Decisions, Philosophy, Bio).

### 2. Target Files (Routing Logic)

#### Stream A: The Machine (Technical)

- `src/content/docs/ARCHITECTURE.md` (Why code changed)
- `src/content/docs/handbook/OPERATIONS.md` (How to fix it)
- `src/content/docs/ROADMAP.md` (What we finished)
- `src/content/docs/meta/AGENCY_MEMORY.md` (Active focus)

#### Stream B: The Operator (Meta/Identity)

- `src/content/docs/meta/AGENT_PROFILE.md` (Behavioral updates, new "Laws" of personality)
- `src/content/docs/project/GROK_LOG.md` (Architectural Decrees)
- `src/content/docs/meta/BIO.md` (Public narrative updates)
- `src/content/docs/colophon/*.md` (Philosophical adds)
- `src/content/docs/prompts/BRANDING_PROMPT.md` (Voice/Tone updates)

### 3. Protocol: "Extract the Gold"

Look for:

- **Decisions:** Why did we choose X over Y?
- **Config:** New environment variables or constants.
- **Fixes:** Reproducible steps for bug fixes.
- **Traps:** Edge cases found.
- **Meta-Features:** Did we build something cool? (Add to Colophon in Roadmap).
- **Self-Correction:** Did the user correct our tone/behavior? (Update `AGENT_PROFILE.md`).

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
### `docs/MAINTENANCE.md` (Technical Stream)

**Add to "Troubleshooting" section:**

- **Symptom:** Page renders white.
- **Fix:** Ensure `<Layout>` wraps the content.

### `docs/meta/AGENT_PROFILE.md` (Meta Stream)

**Add to "Communication Protocol":**

- **Trigger:** User grew frustrated when I apologized excessively.
- **Calibration:** "Do NOT apologize. Report yields only."
```

---
title: "Failing direct prompt access, `AGENTS.md` or direct file execution provide fallback for Codex prompts."
description: "If direct prompt access fails, `/session_open` and `/session_close` are still available via `AGEN..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

If direct prompt access fails, `/session_open` and `/session_close` are still available via `AGENTS.md`, which Codex reads natively and is now generated and current. Alternatively, users can instruct Codex to 'read `.agent/workflows/session_open.md` and execute it,' as this file contains the canonical body wrapped by the prompt files.

**Tags:** Codex, prompts, fallback, AGENTS.md, workflow

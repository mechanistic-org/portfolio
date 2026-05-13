---
title: "Agent workflows now actively use `preload_memory` at session start and `capture_session_turn` for in-session decision recording."
description: "Agent workflows have been updated to actively leverage the new memory system. The `session_open.m..."
---

Agent workflows have been updated to actively leverage the new memory system. The `session_open.md` workflow now explicitly instructs agents to call `enos_router.preload_memory` at Step 0 for immediate context injection. Additionally, `session_open.md` includes a new "Turn Capture" instruction at Step 4, guiding agents to use `enos_router.capture_session_turn` to record key decisions and constraints during a session.

**Tags:** agent_workflow, memory, protocol, documentation

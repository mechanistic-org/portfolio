---
title: "`preload_memory` must be a mandatory, verified gate at session start, blocking if it fails."
description: "While the `enos_router.preload_memory()` call at session start is now implemented, a critical pro..."
---

While the `enos_router.preload_memory()` call at session start is now implemented, a critical protocol update is needed: verification that the gate fired successfully. A `preload_memory` call that silently fails (e.g., due to `enos_router` being down or ChromaDB locked) currently appears identical to a successful one. The system must check the return value and treat any failed preload as a P0 block, akin to other critical service checks, to prevent cross-session amnesia.

**Tags:** session-management, memory-persistence, architecture, p0-check, system-protocol

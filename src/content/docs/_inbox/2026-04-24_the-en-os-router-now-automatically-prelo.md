---
title: "The EN-OS Router now automatically preloads past session context and captures new decisions, creating a self-improving memory system."
description: "The EN-OS Router now features passive memory preload and capture. At session start, `preload_memo..."
---

The EN-OS Router now features passive memory preload and capture. At session start, `preload_memory` automatically ingests prior session constraints and decisions from ChromaDB, leveraging a rich `forensic_telemetry` collection. Key session summaries and decisions are persistently saved via `capture_session_turn` and a session-close flush, ensuring valuable context is retained and available for future agent operations.

**Tags:** architecture, memory, router, ChromaDB, agent_workflow

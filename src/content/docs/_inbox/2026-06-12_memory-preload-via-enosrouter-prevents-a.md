---
title: "Memory preload via `enos_router` prevents architectural amnesia at session start."
description: "The session open workflow mandates calling `enos_router.search_registry` with the current ticket ..."
source: "b54957c4-c6d7-4cee-a92b-440c81cb30ca"
---

The session open workflow mandates calling `enos_router.search_registry` with the current ticket reference and then `read_forensic_doc` on relevant results. This process is designed to preload context from prior decisions, actively preventing architectural amnesia in subsequent work.

**Tags:** workflow, memory, context, architecture

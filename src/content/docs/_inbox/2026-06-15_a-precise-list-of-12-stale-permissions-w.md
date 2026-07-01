---
title: "A precise list of 12 stale permissions was identified for pruning from `settings.local.json`, clarifying what to keep and remove."
description: "A specific list of 12 stale permissions was identified for pruning from `.claude/settings.local.j..."
source: "f7de8893-e6d2-4916-857a-40a3c172dfbd"
---

A specific list of 12 stale permissions was identified for pruning from `.claude/settings.local.json`. This includes `mcp__enos_router__semantic_search`, `mcp__enos_router__preload_memory` (unmounted router tools), 9 hyper-specific one-shot Bash approvals, and the over-broad `Read(//c/Users/erik/**)`. It was also clarified that "raw gh patterns" should be kept due to a 2026-06-12 gh-CLI standardization, correcting earlier assumptions.

**Tags:** configuration, cleanup, security, system_maintenance

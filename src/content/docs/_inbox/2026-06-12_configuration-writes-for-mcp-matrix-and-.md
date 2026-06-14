---
title: "Configuration writes for MCP matrix and `gh issue:*` permissions are gated by prior approval of the full MCP matrix."
description: "A critical architectural decision has been established: no configuration writes related to tighte..."
source: "62aa50e7-23a5-479f-8155-e40073006566"
---

A critical architectural decision has been established: no configuration writes related to tightening `gh issue:*` permissions or other MCP matrix elements should proceed until the core/optional/legacy MCP matrix is fully approved. This ensures a coherent and approved permission structure before implementation.

**Tags:** architecture, policy, permissions, MCP, decision

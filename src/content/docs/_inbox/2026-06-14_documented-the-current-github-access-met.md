---
title: "Documented the current GitHub access methods and credential sources across Claude Code, Antigravity, Codex, Cursor, and Hermes."
description: "A per-surface map of GitHub access was established: Claude Code uses `gh` CLI native via keychain..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

A per-surface map of GitHub access was established: Claude Code uses `gh` CLI native via keychain; Antigravity uses `github` MCP via wrapper and terminal, keychain-resolved; Codex uses `github` MCP via wrapper plus OpenAI's hosted GitHub connector (keychain + separate OAuth); Cursor is terminal only via keychain/GCM; Hermes is not yet installed.

**Tags:** architecture_pattern, tooling, credential_management, system_status

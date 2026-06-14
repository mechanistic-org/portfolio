---
title: "Defined hook events (e.g., PreToolUse, PostToolUse) and types (command, prompt, agent) for Claude Code lifecycle automation."
description: "The system supports various hook events, including `PermissionRequest`, `PreToolUse`, `PostToolUs..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

The system supports various hook events, including `PermissionRequest`, `PreToolUse`, `PostToolUse`, `Stop`, `PreCompact`, and `SessionStart`, each triggered at specific points in the Claude Code lifecycle. Hooks can be configured as three distinct types: `command` for shell execution, `prompt` for LLM condition evaluation, or `agent` for running an agent with tools.

**Tags:** hooks, events, types, automation, system_design

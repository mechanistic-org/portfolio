---
title: "`enos_router` now user-scoped for universal availability across directories."
description: "Initially, `enos_router` MCP tools were not exposed in this Claude Code session, disabling memory..."
source: "4cc484d3-e38c-46b1-b282-9863e8cc6acc"
---

Initially, `enos_router` MCP tools were not exposed in this Claude Code session, disabling memory preload and turn-capture, due to `enos_router` being registered only under the `D:/GitHub/global_agent` project in `~/.claude.json`. The decision was made to user-scope `enos_router` for broad availability across all projects. This fix was applied via agent edit, bypassing the `claude` CLI (which is bundled in the desktop app and not on PATH), and is now confirmed updated in `~/.claude.json` to be user-scoped, effective upon the next desktop-app restart.

**Tags:** configuration, enos-router, CLI, desktop-app, tooling, bug, session_management, enos_router, bug-discovery, root-cause, correction, architecture, decision, fix, maintenance, Claude, lesson

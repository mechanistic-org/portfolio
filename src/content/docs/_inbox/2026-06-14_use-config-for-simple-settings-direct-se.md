---
title: "Use `/config` for simple settings, direct `settings.json` edits for complex ones like hooks."
description: "A clear decision has been made regarding configuration management: simple settings like `theme` o..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

A clear decision has been made regarding configuration management: simple settings like `theme` or `model` should be managed via the `/config` slash command. Conversely, complex configurations such as hooks, intricate permission rules, environment variables, MCP server settings, and plugin configurations require direct editing of `settings.json`.

**Tags:** configuration_management, slash_command, settings.json, workflow

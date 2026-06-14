---
title: "Settings files follow a user \u2192 project \u2192 local hierarchy, with later files overriding earlier ones."
description: "The system defines a clear hierarchy for settings files: `~/.claude/settings.json` for global per..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

The system defines a clear hierarchy for settings files: `~/.claude/settings.json` for global personal preferences, `.claude/settings.json` for team-wide project settings (committed to Git), and `.claude/settings.local.json` for personal project overrides (Gitignored). Settings load in a specific order: user, then project, then local, with later files overriding earlier ones.

**Tags:** settings, configuration, file_hierarchy, scope

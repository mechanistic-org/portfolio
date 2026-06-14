---
title: "Relative plugin source paths are defined from the marketplace root, the directory containing `.claude-plugin/`, not from within `.claude-plugin/`."
description: "When specifying a plugin source as a relative path, it must be relative to the *marketplace root*..."
source: "88202b23-460e-48b7-933a-373808bc153a"
---

When specifying a plugin source as a relative path, it must be relative to the *marketplace root*. This refers to the directory that *contains* `.claude-plugin/`, rather than being relative to the `.claude-plugin/` directory itself. This precise definition ensures correct path resolution for plugins.

**Tags:** plugin, path_resolution, configuration, documentation

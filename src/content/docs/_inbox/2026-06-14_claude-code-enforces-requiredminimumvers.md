---
title: "Claude Code enforces `requiredMinimumVersion` and `requiredMaximumVersion` from managed settings, exiting with instructions if violated."
description: "The `requiredMinimumVersion` and `requiredMaximumVersion` settings establish critical version enf..."
source: "88202b23-460e-48b7-933a-373808bc153a"
---

The `requiredMinimumVersion` and `requiredMaximumVersion` settings establish critical version enforcement policies for Claude Code. If the running version falls outside these bounds, the application exits at startup with update/installation instructions. Crucially, these version constraints are only enforced when set via managed (policy) settings, ensuring administrative control over deployment.

**Tags:** versioning, policy, security, deployment, managed-settings

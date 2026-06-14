---
title: "`CLAUDE.md` files can now be excluded using glob patterns, but not for managed policy files."
description: "A mechanism for excluding `CLAUDE.md` files from loading has been implemented via `claudeMdExclud..."
source: "88202b23-460e-48b7-933a-373808bc153a"
---

A mechanism for excluding `CLAUDE.md` files from loading has been implemented via `claudeMdExcludes`. This uses glob patterns or absolute paths matched against absolute file paths with `picomatch`, specifically applying to User, Project, and Local memory types, but not Managed/policy files.

**Tags:** memory management, configuration, CLAUDE.md

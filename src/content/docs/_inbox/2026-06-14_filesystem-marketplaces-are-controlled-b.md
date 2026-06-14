---
title: "Filesystem marketplaces are controlled by path patterns, complementing network host restrictions."
description: "Filesystem-based marketplaces can be restricted or allowed using regex patterns matched against t..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

Filesystem-based marketplaces can be restricted or allowed using regex patterns matched against the `.path` field of file and directory sources. This complements `hostPattern` restrictions for network sources, allowing for granular control over local marketplace access. Patterns like ".*" permit all filesystem paths, while narrower patterns like "^/opt/approved/" restrict access to specific directories.

**Tags:** marketplace, security, configuration, filesystem

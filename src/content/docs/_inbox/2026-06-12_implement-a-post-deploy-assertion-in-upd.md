---
title: "Implement a post-deploy assertion in `update-resume` to verify live R2 content length against staging, preventing silent failures."
description: "The `update-resume` skill must be patched to include a post-deploy assertion that HEADs the live ..."
source: "76295520-db66-4a07-aec8-3c56a17d6a14"
---

The `update-resume` skill must be patched to include a post-deploy assertion that HEADs the live R2 URL and compares its `Content-Length` against the staging artifact. This critical check will convert silent deployment failures into loud, actionable ones, preventing future inconsistencies.

**Tags:** pipeline, verification, bug fix, best practice

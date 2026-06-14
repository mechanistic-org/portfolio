---
title: "The resume deployment architecture was clarified, diagnosing stale content as a process failure now guarded by the v3 skill."
description: "Initially, a stale live resume PDF (7,685,332 bytes uploaded Mar 13 vs 166,965-byte staging build..."
source: "85f423c9-de53-4af4-bd50-0e5ac8deef2a"
---

Initially, a stale live resume PDF (7,685,332 bytes uploaded Mar 13 vs 166,965-byte staging build from Apr 14) was discovered, indicating a silent deployment failure. Further investigation clarified that `eriknorris.com/resume` (the HTML page) and `assets.eriknorris.com/resume` (the PDF) had distinct update mechanisms and were both stale: the HTML page due to old content on main, and the PDF due to no sync after April regeneration. The resume deployment architecture was subsequently clarified, diagnosing the stale content as a process failure ("generated but never deployed") rather than a system design flaw, which the v3 skill now addresses. The core system design (one TS source of truth for both HTML and PDF) was deemed sound.

**Tags:** architecture, system-design, deployment, process-improvement, problem-solved, docs, bug_discovery, deployment_failure, resume, pipeline, data_staleness, system_architecture

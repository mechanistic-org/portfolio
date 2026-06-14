---
title: "Daily-phrased session-only loops without explicit intervals are rejected with guidance for cloud or shorter intervals."
description: "If a loop is triggered by daily phrasing but has no parsed interval, and the user opts for 'This ..."
source: "12bca159-406b-45cc-b5f6-b9a1ddf89fbe"
---

If a loop is triggered by daily phrasing but has no parsed interval, and the user opts for 'This session only', the system must not call CronCreate. Instead, it explains that a daily-cadence loop won't fire before the session closes, suggesting either a cloud schedule or re-running with an explicit shorter interval (e.g., `/loop 1h <prompt>`). This advises the user that a daily-cadence loop won't fire locally before the session closes.

**Tags:** loop, scheduling, UX, constraint, cloud, technical-constraint, agent-guidance, session-management

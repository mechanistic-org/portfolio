---
title: "Cloud scheduling is offered for loops with intervals \u226560 minutes or daily phrasing."
description: "Cloud scheduling is offered if the parsed interval is 60 minutes or greater, or if the original i..."
source: "12bca159-406b-45cc-b5f6-b9a1ddf89fbe"
---

Cloud scheduling is offered if the parsed interval is 60 minutes or greater, or if the original input uses daily phrasing (e.g., 'every morning', 'daily', 'each night'). This ensures durable loops are suggested for longer cadences, promoting reliability beyond the current session. If 'Cloud schedule' is chosen, the `schedule` skill is invoked directly, bypassing local `CronCreate` and `ScheduleWakeup` calls.

**Tags:** scheduling, cloud, UX, feature logic, cloud-integration, agent-behavior, durability, cloud integration, UX decision, system protocol

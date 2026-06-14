---
title: "Fixed-interval loops execute the prompt immediately upon scheduling, not waiting for the first cron trigger."
description: "In fixed-interval mode, the parsed prompt must be executed immediately after scheduling with Cron..."
source: "12bca159-406b-45cc-b5f6-b9a1ddf89fbe"
---

In fixed-interval mode, the parsed prompt must be executed immediately after scheduling with CronCreate, without waiting for the first cron fire. If it's a slash command, it should be invoked via the Skill tool; otherwise, it should be acted on directly. This ensures the task begins without delay upon setup.

**Tags:** loop, scheduling, execution, protocol, cron, system behavior

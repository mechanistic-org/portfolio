---
title: "Agents are now instructed to use the new file-save deploy procedure, waiting for watchdog automation and benchmark verification."
description: "The new deploy procedure dictates that saving a router source file is the entire deployment actio..."
source: "8fb0fe4d-1604-457b-b32c-90257ac52e91"
---

The new deploy procedure dictates that saving a router source file is the entire deployment action, with changes going live within approximately four minutes (3-minute cadence plus 60-second quiet period). Agent documentation (AGENTS.md and AGENT_CONTEXT.md) has been updated to instruct agents to wait for the watchdog tick and verify with the benchmark, eliminating the need for manual elevated restarts.

**Tags:** deployment, workflow, agents, documentation, automation, protocol

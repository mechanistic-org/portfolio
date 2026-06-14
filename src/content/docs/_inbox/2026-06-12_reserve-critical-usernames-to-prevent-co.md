---
title: "Reserve critical usernames to prevent confused deputy attacks in agentic systems."
description: "Odysseus employs a \"reserved-username / synthetic-owner sentinel defense\" to prevent confused dep..."
---

Odysseus employs a "reserved-username / synthetic-owner sentinel defense" to prevent confused deputy attacks. It hard-reserves usernames like `internal-tool`, `api`, `demo`, and `system` to ensure that an agent's in-process loopback access to admin routes (granted if `current_user == "internal-tool"`) cannot be exploited by a real user account with the same name.

**Tags:** security, architecture, agentic AI, confused deputy, pattern

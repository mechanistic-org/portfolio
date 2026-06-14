---
title: "Implement a prompt-injection wrapper that explicitly labels untrusted content as data, not instructions."
description: "The `src/prompt_security.py` module implements a best-practice prompt-injection wrapper. It encap..."
---

The `src/prompt_security.py` module implements a best-practice prompt-injection wrapper. It encapsulates untrusted web, email, memory, or skill content within a `user`-role "UNTRUSTED SOURCE DATA" block, explicitly labeling it as data, not instructions, to prevent injection into the system role.

**Tags:** security, prompt injection, best practice, architecture, agentic AI

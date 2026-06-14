---
title: "WSL can inherit Windows managed settings via a double opt-in policy chain for cross-OS consistency."
description: "A complex policy chain allows WSL to inherit managed settings from Windows sources (HKLM, C:/Prog..."
source: "b548833a-866e-4737-bd1d-7373472cafe1"
---

A complex policy chain allows WSL to inherit managed settings from Windows sources (HKLM, C:/Program Files/ClaudeCode, HKCU) when `wslInheritsWindowsSettings` is true. This requires a double opt-in: admin enables the chain, and the user confirms HKCU policy application on WSL, ensuring controlled cross-OS policy integration.

**Tags:** WSL, Windows, policy, configuration, architecture, security

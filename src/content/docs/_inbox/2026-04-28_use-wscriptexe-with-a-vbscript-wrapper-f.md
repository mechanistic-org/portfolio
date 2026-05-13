---
title: "Use `wscript.exe` with a VBScript wrapper for scheduled tasks to guarantee hidden execution, bypassing Windows Terminal."
description: "To ensure a scheduled task runs completely hidden and bypasses Windows Terminal's console interce..."
---

To ensure a scheduled task runs completely hidden and bypasses Windows Terminal's console interception, the task action should be configured to launch via `wscript.exe` with a VBScript wrapper. This wrapper uses `window style 0` (hidden) to execute the target command, providing a robust method for suppressing console windows that the `Hidden: True` flag alone cannot achieve.

**Tags:** windows, task-scheduler, automation, console, architecture

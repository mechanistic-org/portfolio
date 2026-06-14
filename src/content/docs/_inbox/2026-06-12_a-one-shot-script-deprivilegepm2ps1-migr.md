---
title: "A one-shot script `deprivilege_pm2.ps1` migrates the PM2 tree to non-elevated operation, eliminating future elevation needs after a brief router downtime."
description: "The `deprivilege_pm2.ps1` script is a one-shot migration tool for Phase 2. Executed from an eleva..."
source: "8fb0fe4d-1604-457b-b32c-90257ac52e91"
---

The `deprivilege_pm2.ps1` script is a one-shot migration tool for Phase 2. Executed from an elevated PowerShell, it kills the elevated PM2 tree, wipes stale resurrect dumps, re-registers the watchdog task as non-elevated (with a 3-minute cadence and background S4U logon), and initiates the first tick. This process, causing approximately two minutes of router downtime, eliminates the future need for elevated daemon operations on the machine.

**Tags:** phase 2, deprivileging, pm2, migration, automation, security, procedure, powershell

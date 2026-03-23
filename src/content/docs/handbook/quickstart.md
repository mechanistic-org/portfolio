---
title: Quickstart (Cheat Sheet)
slug: quickstart
sidebar:
  group: Handbook
  order: 0
description: Documentation for Quickstart (Cheat Sheet).
---
# ⚡ Quickstart: Daily Operations

> **Role:** Operator / Pilot
> **Objective:** Maintain, Update, and Deploy the EN-OS.

## 1. Start Engine (Dev Server & CMS)

Keystatic is essential for content management.

**Command:**

```powershell
npm run dev
```

**Telemetry:**

- **Local:** `http://localhost:4321`
- **Admin (CMS):** `http://localhost:4321/keystatic` _(Edit Content Here)_
- **Network:** `http://192.168.x.x:4321`

> [!WARNING]
> **Ghost Port Anomaly:** If you see old code or behavior, check for zombie processes.
>
> **Fix:** Run `taskkill /F /IM node.exe` to kill all stray servers.

## 2. The Data & Asset Refinery

We work in **Pure Hyperspace**. No CSVs. No Manual Content files.
But we still need to sync assets and timeline data.

**Commands:**

```powershell
# Injects NotebookLM Bolus data and mines R2_MASTER for stickies
npm run content:hydrate

# The "Heavy Lifter" for media (Images & Audio)
npm run assets:process

# Mass-updates legacy content to the latest C24 Schema
npm run content:modernize
```

**Triggers (When to Run):**

1.  **New Timeline Node:** You created a new Project in Keystatic -> Run `content:hydrate`.
2.  **Asset Drop:** You added a new folder to `R2_MASTER` -> Run `assets:process`.
3.  **Schema Change:** You need to update all MDX files -> Run `content:modernize`.

> [!TIP]
> **The Pulse:** The script outputs build time statistics. Watch for `[SUCCESS]` in Green.

## 3. Asset Management (The Vault)

**Source of Truth:** `D:\GitHub\portfolio-workspace\R2_MASTER`

**Workflow:**

1.  **Edit:** Place images in `R2_MASTER/{slug}/bubbles/...`
2.  **Sync:** Run the sync script to update Staging and Production.

```powershell
# Ensure R2_MASTER assets are processed and moved to R2_STAGING
npm run assets:process
```

## 4. Diagnostics ("Doctor")

If the system behaves erratically:

**1. Verify Ports:**

```powershell
Get-Process node, python -ErrorAction SilentlyContinue
```

**2. Check Frontmatter & Schema:**

```powershell
npm run predev
# or
npm run audit:frontmatter
```

**3. Test Build:**

```powershell
npm run build
```

_(Pre-flight check before pushing. Catch TypeErrors here.)_

## 5. Deployment

**Protocol:** Git-Triggered (CD).

1.  **Commit:** `git commit -m "feat: upgrade warp drive"`
2.  **Push:** `git push`
3.  **Monitor:** Check Cloudflare Pages dashboard for build status.

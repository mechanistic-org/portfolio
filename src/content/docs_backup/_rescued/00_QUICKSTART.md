---
title: "Quickstart (Cheat Sheet)"
slug: "quickstart"
sidebar:
  group: "Handbook"
  order: 0
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

## 2. The Refinery (Asset Sync)

We work in **Pure Hyperspace**. No CSVs. No Manual Content files.
But we still need to sync assets and timeline data.

**Command:**

````powershell
```powershell
python scripts/modernize_content.py
````

````

**Triggers (When to Run):**

1.  **New Timeline Node:** You created a new Project in Keystatic.
2.  **Asset Drop:** You added a new folder to `R2_MASTER`.

> [!TIP]
> **The Pulse:** The script outputs build time statistics. Watch for `[SUCCESS]` in Green.

## 3. Asset Management (The Vault)

**Source of Truth:** `D:\GitHub\eriknorris-workspace\R2_MASTER`

**Workflow:**

1.  **Edit:** Place images in `R2_MASTER/{slug}/bubbles/...`
2.  **Sync:** Run the sync script to update Staging and Production.

```powershell
python scripts/sync_r2.py
````

- **Prune (Mirror Mode):**
  ```powershell
  python scripts/sync_r2.py --prune
  ```
  _(Deletes remote files that do not exist locally. Use with caution.)_

## 4. Diagnostics ("Doctor")

If the system behaves erratically:

**1. Verify Ports:**

```powershell
Get-Process node, python -ErrorAction SilentlyContinue
```

**2. Lint Code:**

```powershell
npm run lint
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

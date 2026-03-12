---
description: The official protocol for syncing local MOOTMOAT_ASSETS media to the Cloudflare production bucket.
---
# R2 Asset Sync Workflow (MootMoat)

This workflow executes the `sync_r2.py` utility to ensure the Cloudflare R2 bucket (`mootmoat-assets`) matches the local `D:\GitHub\mootmoat-assets\R2_STAGING` directory. This is typically required before committing project code that relies on new imagery or large audio files.

1. Execute the Python sync script.
// turbo
```powershell
python scripts/sync_r2.py
```

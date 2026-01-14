---
# This rule should be ALWAYS ON.
---

# Asset Sovereignty & The Air Gap

## The Laws (`GROK_LOG`)

1.  **The Air Gap:** All heavy media lives in `D:\GitHub\ErikNorris-assets\R2_STAGING`.
2.  **Symlinks are the Bridge:** We access assets _only_ via the symlink `public/assets/r2`.
3.  **No Assets in SRC:** `src/` is for code. Never copy binaries there.
4.  **Law of Continuity:** A 404 on an existing project is a _failure of retrieval_, not an absence. Check the symlink first.

## Behavioral Constraints

- **IF** you encounter a 404 on an image:
  - **DO NOT** suggest generating a placeholder immediately.
  - **DO** verify if the file exists in `R2_STAGING`.
  - **DO** check if the symlink at `public/assets/r2` is healthy.
- **IF** you are asked to "fix" missing assets:
  - **CHECK** `scripts/sovereign_manifest.json` first. If the project is listed, it is a protected Sovereign Asset.

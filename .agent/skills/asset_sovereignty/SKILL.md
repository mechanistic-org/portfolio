---
name: asset_sovereignty
description: Enforces the "Air Gap" and "Sovereign Asset" laws to prevent 404s and unauthorized asset generation.
---

# Asset Sovereignty Skill

## When to use this skill

- When you encounter a **404 error** for an image or asset.
- Before generating any new image or placeholder.
- When the user mentions "Air Gap", "Sovereignty", or "Symlinks".

## The ErikNorris Laws

### 1. Law of Continuity (Truth)

**Existing assets must be preserved.**
A 404 on an existing project ID is a **failure of retrieval**, not an absence of existence.

- **Action:** If a historical asset matches a live URL but fails locally, debug the **Symlink/Path** first.
- **Do NOT** assume the file is missing.
- **Do NOT** copy large assets into `src/`.

### 2. Law of Synthesis (Exception)

Assets may be generated **ONLY** for:

- Explicitly defined "Constructed Realities" (e.g., `dreamjob`, `future-state`).
- Generic UI elements (placeholders, textures).

### 3. Law of Explicit Command (Override)

You shall **NOT** generate brand-level assets without an explicit `generate` command. Ambiguous commands default to **Law 1 (Restore)**.

## Troubleshooting Protocol

If you see a 404:

1.  Check if `public/assets/r2` exists and is a valid symlink/junction to `../ErikNorris-assets/R2_STAGING`.
2.  If the file exists in `R2_STAGING` but not in the browser, it is a symlink issue.
3.  **NEVER COPY** files from `R2_STAGING` to `src/`. The build system expects them in `public/assets/r2`.

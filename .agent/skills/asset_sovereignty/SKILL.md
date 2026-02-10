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

### 1. Law of the Virtual Bridge (Anti-Memory Leak)

**Context:** We do **NOT** use Symlinks or Junctions for `public/assets`.
The folder `public/assets` must NOT exist locally.

- **The Bridge:** Assets are served via `src/pages/assets/[...path].ts`.
- **The Vault:** The actual files live in `../ErikNorris-assets/R2_STAGING`.
- **Action:** If an asset is 404ing, check if it exists in the **Vault**.
- **Do NOT** try to create a Junction. This causes a 60GB Memory Leak.

### 2. Law of Continuity (Truth)

**Existing assets must be preserved.**
A 404 on an existing project ID is a **failure of retrieval** (Virtual Bridge), not an absence of existence.

- **Action:** Verify `src/pages/assets/[...path].ts` is correctly proxying the request.
- **Do NOT** copy large assets into `src/`.

### 3. Law of Synthesis (Exception)

Assets may be generated **ONLY** for:

- Explicitly defined "Constructed Realities" (e.g., `dreamjob`, `future-state`).
- Generic UI elements (placeholders, textures).

### 4. Law of Explicit Command (Override)

You shall **NOT** generate brand-level assets without an explicit `generate` command. Ambiguous commands default to **Law 2 (Restore)**.

## Troubleshooting Protocol

If you see a 404:

1.  **Do NOT check for Symlinks.**
2.  Check the **External Drive** (`../ErikNorris-assets/R2_STAGING`).
3.  If the file is there, the Virtual Bridge (`[...path].ts`) might be failing to map the route. Debug the Router.
4.  **NEVER COPY** files from `R2_STAGING` to `src/`.

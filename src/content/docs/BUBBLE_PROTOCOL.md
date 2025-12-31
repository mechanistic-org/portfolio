# Bubble Compiler & Darkroom Protocol

## The Golden Rule
**Any asset added to `R2_MASTER` MUST satisfy the Darkroom Protocol before ingestion.**
Failure to optimize assets results in 404s, slow loads, and "Structure Rot."

## Workflow
1.  **Add Content:** Place manual `deck.md` and raw images in `R2_MASTER/{slug}/bubbles/`.
    *   Do NOT bypass this by writing directly to `R2_STAGING`.
    *   Do NOT edit `src/content/projects/{slug}.mdx` manually.

2.  **The Darkroom (Optimization):**
    *   Run: `python scripts/process_images.py {slug}`
    *   **What it does:**
        *   Recursively scans `bubbles/` folders.
        *   Optimizes images (Resizes -> WebP/AVIF).
        *   Mirrors the structure to `R2_STAGING`.
    *   **Verification:** Check `R2_STAGING/{slug}/bubbles` for `.webp` versions.

3.  **The Compiler (Ingestion):**
    *   Run: `python ingest_data.py`
    *   **What it does:**
        *   Reads `R2_STAGING` (NOT Master).
        *   Parses `deck.md` and `config.json`.
        *   Generates `src/content/projects/{slug}.mdx`.

## Troubleshooting
*   **Images 404:** Did you run `process_images.py`? Check `public/assets/r2/{slug}/bubbles`.
*   **Layout Ignored:** Did you create `config.json` in the bubble folder?
*   **Text Not Updating:** `ingest_data.py` reads from `STAGING`. If you edited `MASTER` but didn't run the scripts, Staging is stale.

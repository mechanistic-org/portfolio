# R3 Asset Namespace ("The Registry")

This directory (`/assets/r3/`) is the standardized home for all assets used by the **V4 Theme Engine**.

## Structure
-   `/r3/common/`: Shared assets (textures, grids, UI elements).
-   `/r3/[project-slug]/`: Project-specific assets (GLB models, hero images).

## Rules
1.  **No Loose Files:** all files must be in a subdirectory.
2.  **Naming:** `kebab-case` preferred.
3.  **Optimization:** Use WebP for images and glTF/GLB for 3D.

## Migration Status
-   Legacy assets remain in `/assets/r2/`.
-   New assets go here.

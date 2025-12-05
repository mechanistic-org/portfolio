---
title: "Untitled"
slug: "internal_scripts"
---
*   **Usage:** `python ingest_data.py`

### `scripts/process_images.py` (The Image Engine)
*   **Purpose:** Optimizes images from the local `Quantum_Workspace` and places them in the `R2_STAGING` repo.
*   **Usage:** 
    *   `python scripts/process_images.py {slug}` (Single Project)
    *   `python scripts/process_images.py --all` (Batch)
*   **Input:** `~/Quantum_Workspace/R2_MASTER/{slug}/*.tif`
*   **Output:** `../quantum-assets/R2_STAGING/{slug}/*.{avif,webp}`

## Maintenance Utilities

### `scripts/setup_workspace.py` (The Factory)
*   **Purpose:** Initializes the local directory structure (`~/Quantum_Workspace`) based on the projects defined in `Main.csv`.
*   **Usage:** `python scripts/setup_workspace.py`
*   **When to run:** When onboarding a new machine or after adding new projects to the CSV.

### `scripts/refine_skills.py` (The Skill Balancer)
*   **Purpose:** Generates unique skill profiles for projects to prevent "Radar Chart Duplication".
*   **Usage:** `python scripts/refine_skills.py`
*   **Output:** Overwrites `data_source/Skills.csv`.

### `scripts/generate_content.py` (The Writer)
*   **Purpose:** Generates placeholder "Narrative STAR" case studies for projects that lack manual content.
*   **Usage:** `python scripts/generate_content.py`
*   **Output:** Creates files in `data_source/manual_content/`.

### `scripts/sync_r2.py` (The Uploader)
*   **Purpose:** Handles the actual upload of assets to Cloudflare R2. Called automatically by `ingest_data.py`.
*   **Usage:** `python scripts/sync_r2.py`



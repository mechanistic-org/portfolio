# Bubble Compiler & Darkroom Protocol

## The Golden Rule

**Any asset added to `R2_MASTER` MUST satisfy the Darkroom Protocol before ingestion.**
Failure to optimize assets results in 404s, slow loads, and "Structure Rot."

## Workflow

1.  **Add Content:** Place manual `deck.md` and raw images in `R2_MASTER/{slug}/bubbles/`.
    - Do NOT bypass this by writing directly to `R2_STAGING`.
    - Do NOT edit `src/content/projects/{slug}.mdx` manually.

2.  **The Darkroom (Optimization):**
    - Run: `python scripts/process_images.py {slug}`
    - **What it does:**
      - Recursively scans `bubbles/` folders.
      - Optimizes images (Resizes -> WebP/AVIF).
      - Mirrors the structure to `R2_STAGING`.
    - **Verification:** Check `R2_STAGING/{slug}/bubbles` for `.webp` versions.

3.  **The Compiler (Ingestion):**
    - Run: `python ingest_data.py`
    - **What it does:**
      - Reads `R2_STAGING` (NOT Master).
      - Parses `deck.md` and `config.json`.
      - Generates `src/content/projects/{slug}.mdx`.

## Troubleshooting

- **Images 404:** Did you run `process_images.py`? Check `public/assets/r2/{slug}/bubbles`.
- **Layout Ignored:** Did you create `config.json` in the bubble folder?

## Special Asset Handling

### DXF/CAD Handling

Legacy CAD files (`.dxf`) found in a bubble are automatically processed by the `dxf_renderer` sidecar.

- **Input:** `layout.dxf`
- **Output:**
  - `layout.svg` (Web Vector)
  - `layout.png` (Web Raster)
  - `layout.pdf` (Archival / NotebookLM)
- **Note:** The PDF is generated for "AI Mining" purposes (NotebookLM loves PDFs) and is safe to upload to your private notebook.

## Project Directory Taxonomy (The Narrative Arc)

To ensure consistent storytelling, all "Deep Projects" (C24, SC48, Dreamjob) MUST organize their `bubbles/` folder using the following numbered sequence. This structure maps directly to the "Engineering Lifecycle."

| Prefix | Phase             | Description                                                     |
| :----- | :---------------- | :-------------------------------------------------------------- |
| `01_`  | **Discovery**     | The Origin. Napkin sketches, initial emails, " The spark."      |
| `02_`  | **Proto**         | The Ugly Phase. Foamcore, breadboards, failed 3D prints.        |
| `03_`  | **Engineering**   | The Meat. CAD screenshots, thermal analysis, PCB layouts, DFM.  |
| `04_`  | **Manufacturing** | The Factory. Tooling, molds, assembly lines, QC reports.        |
| `05_`  | **Launch**        | The Gloss. Press photos, trade show booth, finished product.    |
| `06_`  | **Legacy**        | The Aftermath. EOL notices, forensic audits, "Where is it now?" |
| `07_`  | **Artifact**      | 3D Scans, physical remnants on your desk today.                 |

> **Naming Rule:** Folders MUST be lowercase snake*case (e.g., `01_discovery`, `02_proto_v1`).
> **Sorting:** The Ingestion Engine uses the `01*` prefix to sort the Bubbles in the UI. If you skip a number, the UI will just render the next available one.

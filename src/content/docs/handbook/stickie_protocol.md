---
title: "Stickie Protocol"
description: "The official naming convention and darkroom workflow for Project Stickies (formerly Bubbles)."
slug: "stickie_protocol"
sidebar:
  group: Handbook
  order: 20
---

# Stickie Compiler & Darkroom Protocol

## The Golden Rule

**Any asset added to `R2_MASTER` MUST satisfy the Darkroom Protocol before ingestion.**
Failure to optimize assets results in 404s, slow loads, and "Structure Rot."

## Terminology

- **Bubble:** The _Folder_ on the file system (`R2_MASTER/{slug}/bubbles/`).
- **Stickie:** The _Code Object_ in the UI (Data + Presentation).
- _They are 1:1 mapped._

## Workflow

1.  **Add Content:** Place manual `deck.md` (for text) and raw images (for gallery) in `R2_MASTER/{slug}/bubbles/`.
    - Do NOT bypass this by writing directly to `R2_STAGING`.
    - Do NOT edit `src/content/projects/{slug}.mdx` manually for gallery content.

2.  **The Darkroom (Optimization):**
    - Run: `python scripts/process_images.py {slug}`
    - **What it does:**
      - Recursively scans `bubbles/` folders.
      - Optimizes images (Resizes -> WebP/AVIF).
      - Mirrors the structure to `R2_STAGING`.
    - **Verification:** Check `R2_STAGING/{slug}/bubbles` for `.webp` versions.

3.  **The Compiler (Ingestion):**
    - Run: `python scripts/hydrate_content.py` (The Hydrator)
    - **What it does:**
      - Scans `R2_MASTER`.
      - **Mines Images:** Creates gallery data.
      - **Mines Deck.md:** Injects narrative text into the stickie.
      - Generates `src/content/projects/{slug}.mdx`.

## Troubleshooting

- **Images 404:** Did you run `process_images.py`? Check `public/assets/{slug}/bubbles`.
- **Text Missing:** Did you create `deck.md` in the bubble folder?
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

## Stickie Taxonomy (Human Organization)

> **The Dumb Pipe Law:** The Compiler does NOT understand "Phases" or "Narrative Arcs". It simply sorts folders **alphabetically**.
> You **MUST** use the `01_` prefix to control the timeline order.

To ensure consistent storytelling, we use the following convention to map the "Forensic Lifecycle" to the alphanumeric sort:

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
> **Sorting:** The Ingestion Engine uses the prefix to sort the Stickies in the UI. Duplicate prefixes (e.g. two `03*` folders) are allowed and will stack.

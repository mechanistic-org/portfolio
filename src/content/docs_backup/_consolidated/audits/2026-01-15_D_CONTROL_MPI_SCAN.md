# Forensic Scan: D-Control MPI Assets

**Date:** 2026-01-15
**Target:** `D:\portfolio\portfolio_working\2004_Digidesign_D-Control\03_Engineering_MPIs`

## Executive Summary

The directory contains high-value "Level 4" (Manufacturing) assets that establish the "Governance" and "Process Control" pillars of the Forensic Dossier.

## 1. The Documents (The Law)

These PDFs are the legal instructions sent to the factory. They serve as evidence of "Process Control" and "Vendor Management."

| Filename                             | Description                                 | Recommendation                                |
| :----------------------------------- | :------------------------------------------ | :-------------------------------------------- |
| `MPI910011504-00(Buckley Fader).pdf` | Assembly instructions for the Fader Module. | **Move to:** `R2_MASTER/d-control/documents/` |
| `MPI910012268-00(Buckley Main).pdf`  | Assembly instructions for the Main Unit.    | **Move to:** `R2_MASTER/d-control/documents/` |
| `ENGINEER - M910011504-00_C.pdf`     | Top-level assembly engineering drawing.     | **Move to:** `R2_MASTER/d-control/documents/` |

## 2. The Forensic Gold (Raw Imagery)

The HTML support folders contain the raw images extracted from the Word documents. These are likely unpolished, authentic photos of the assembly line, fixtures, and QA steps.

| Folder                                 | Content                           | Action                                                                                               |
| :------------------------------------- | :-------------------------------- | :--------------------------------------------------------------------------------------------------- |
| `MPI910011504-00(Buckley Fader)_files` | Raw photos of Fader assembly.     | **Mine this folder.** Look for "hand-on-hardware" shots, torque drivers, and fixtures.               |
| `MPI910012268-00(Buckley Main)_files`  | Raw photos of Main Unit assembly. | **Mine this folder.** Look for chassis skeletons, wiring harnesses ("The Umbilical"), and QA stamps. |

## 3. Implementation Strategy

1.  **Ingest PDFs:** Add them to the `documents: []` array in `d-control/index.mdx`.
2.  **Create Bubble 04:** Create `R2_MASTER/d-control/bubbles/04_manufacturing/`.
3.  **Populate Bubble:** Select the best 5-10 images from the `_files` folders, run them through the Darkroom (`process_assets.py`), and place them in the new bubble.

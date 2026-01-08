# OPERATION RTFM: The EN-OS Operator's Manual

**Mission Brief for Gemini 3 Pro Ultra**

## Context

The "Erik Norris Portfolio System" (EN-OS) has evolved rapidly. We have transitioned to a **"Pure Hyperspace"** architecture (Keystatic + Astro + Scrollytelling), centralized data sovereignty, and strictly typed schemas.
However, the documentation is fragmented across 20+ loose Markdown files in `src/content/docs`. The Operator (User) feels lost in the process of curation and asset ingestion.

## Objective

**Consolidate, Refine, and Operationalize the Documentation.**
Transform the loose tech-notes into a cohesive **Operator's Manual** that answers "How do I..." rather than just "How it works."

## 1. The Structure (Proposed)

Reorganize `src/content/docs` into a navigable "Handbook":

- **00_QUICKSTART.md**: The "Cheat Sheet" for daily operations.
  - _Start Dev Server (`npm run dev`)_
  - _Open Admin (`/keystatic`)_
  - _Run Diagnostics (`npm run doctor`)_
- **01_THE_REFINERY.md** (Ingestion & Curation)
  - _The Asset Pipeline (R2_STAGING -> Stickies)_
  - _NotebookLM -> Intelligence Bolus Workflow_
  - _The "Brief" Writing Guide_
- **02_THE_STUDIO.md** (Building & Customizing)
  - _Creating a New Project (Hyperspace Template)_
  - _Scrollytelling Mechanics (Deck, Slides, Layouts)_
  - _Component Library (ModelViewer, YouTube, etc.)_
- **03_THE_ENGINE_ROOM.md** (Architecture & Maintenance)
  - _Schema Definitions (Keystatic)_
  - _Astro 5.0 Routing Logic_
  - _Troubleshooting & Scripts_

## 2. The Immediate "Curation Workflow" (Pre-Game)

_To be expanded by the Agent:_

1.  **Hunt:** Locate physical assets (Images, PDFs) and textual evidence (Emails via MailStore).
2.  **Stage:** Drop raw files into `R2_STAGING/[project_slug]`.
3.  **Refine:**
    - Use **NotebookLM** to ingest PDFs/Emails and generate a "Bolus" (Summary/Narrative).
    - Export Bolus to Markdown.
4.  **Inject:**
    - Open **Keystatic Admin**.
    - Create Project -> Set Slug.
    - Paste Bolus Summary into **"Project Brief"** (00_intro).
    - Upload Assets into **"Stickies"** (01_origin, 02_crisis, etc.).

## 3. Tasks for Next Session

1.  **Audit:** Read all 24+ files in `src/content/docs` and categorize them into the new structure.
2.  **Consolidate:** Merge redundant files (e.g., `WORKFLOW_3D.md` + `MOI3D_BRIDGE.md`) into single authority files.
3.  **Author:** Write `00_QUICKSTART.md` immediately to unblock the user.
4.  **Delete:** Archive the legacy loose files to clean up the workspace.

## 4. System Prompt Injection

_You are the Chief Documentation Officer. Your goal is Clarity, Scannability, and Operational Readiness. Use the "Engineering Fidelity" voice: precise, instructional, and devoid of fluff._

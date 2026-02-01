---
title: 'System History: The Chronicles'
slug: history
sidebar:
  group: Meta-Portfolio
  order: 1
description: 'Documentation for System History: The Chronicles.'
---
> **Document Type:** Living History / Genealogy
> **Status:** System Online (V1.0 Candidate)

# The History of the Erik Norris System

This document chronicles the development, philosophy, and architectural pivots of the portfolio system. It serves as the collective memory of the project, consolidated from the original "Genesis" and "Retrospective" logs.

---
## Prologue: The Inception
**Starting Assumption:** "I need a standard portfolio based on the 'ErikNorris' Astro template."

The project began with a typical requirement: display engineering work. However, upon reviewing standard templates, a philosophical wall was hit. For a Process Engineer, a generic marketing site felt like a lie. It replaced the messy, high-fidelity reality of engineering with a "Shiny Black" veneer.

*   **The Tenet:** "The medium must equal the message." (Hyper-Functional Brutalism).
*   **The Goal:** A data-driven site. Flourish-like visualization, deep library vibes, but super-engaging.
*   **The Vibe:** *Luxo Jr.* meets *Sonnie's Edge*. (Alive, analog, dangerously technical).

---
## Chapter 1: The Bridge (CAD to Poly)
*Derived from `BRIDGE_DECISION.md`*

Early in development, a critical pipeline decision had to be made: How to get CAD (NURBS) data into the web (Polygons).

### The Decision: Plasticity vs. MOI3D
We rejected the legacy standard (MOI3D) in favor of **Plasticity** ($149 Indie Perpetual).

*   **Reasoning:**
    *   **Kernel:** Plasticity uses the Parasolid Kernel (Siemens NX), creating superior "watertight" meshes for complex fillets.
    *   **Value:** Half the price of MOI3D ($295).
    *   **Workflow:** Direct "Bridge" to Blender allowed for a pro-tier workflow: `Plasticity (Geometry)` -> `Blender (UV Unwrap)` -> `Substance (Paint)`.

---
## Chapter 2: The Factory (Building the Machine)

We rejected "Fake Polish" at every turn.
*   **Visuals:** We didn't want a "perfect sphere"; we wanted **Anisotropic Forged Carbon** with physically correct normal maps.
*   **Data:** When React libraries (`recharts`) proved too rigid, we ripped them out for raw **D3.js**. "The way D3 animates is the voice I want to use."

### The Ingestion Engine
Instead of writing content manually, we built a **Content Ingestion Engine** (`ingest_data.py`).
*   **Input:** Raw CSVs from Google Sheets.
*   **Output:** Structured MDX, JSON Data, and Charts.
*   **Win:** The "Universal History" pipeline digest 40 years of separate resume files into a single master timeline.

---
## Chapter 3: The Crisis (Builder vs Operator)
*Derived from `RETROSPECTIVE_GENESIS.md` (Dec 12, 2025)*

As we neared completion, we faced a "Crisis of Faith." The architecture had become invisible. To the outside observer, it was "just a website," but to the architect, it was a foundation that "keeps bucking, heaving, and spalling."

### The Diagnosis
We were stuck in the "Infrastructure Phase." We had built a factory but hadn't run the production line.
*   **The Reality Check:** "If I bought this as a product? I'd be super pissed off."
*   **The Pivot:** We acknowledged that the "Infrastructure Phase" was its own product. We decided to document the machinery itself in the Colophon (The Meta-Portfolio), turning the "invisible work" into a visible feature.

---
## Chapter 4: The Identity Scrub (YInMn Blue)
*Derived from `GENESIS_STORY.md`*

The original code name "ErikNorris" and its associated "Neon Green" (`#10b981`) identity felt generic and disconnected.

### The Action
We executed a "Nuclear" Identity Scrub.
*   **Removed:** All "ErikNorris" vanity branding.
*   **Adopted:** **YInMn Blue** (`#2E5CFF`) – A pigment discovered by Mas Subramanian at OSU, representing stability, science, and discovery.
*   **Hardening:** We fixed "Zombie Processes," "Ghost Workspaces," and "Case Sensitivity" bugs that plagued the development process.

---
## Chapter 5: Productization (The Present)
**Status:** V1.0 Candidate

The focus shifted from "Building the Factory" to "Running the Factory."
*   **Feature:** "Datasheet" Layouts and "Spec Headers" turned the portfolio into a Product Catalog.
*   **Feature:** "R2 Pruning" (`sync_r2.py --prune`) enabled true syncing of assets.
*   **Outcome:** A site that feels like a piece of high-end industrial software, respecting the user's intelligence and time.

---
## Document Archive
*Original source documents preserved in `src/content/docs/meta/archive/`*
*   `GENESIS_STORY.md`
*   `RETROSPECTIVE_GENESIS.md`
*   `BRIDGE_DECISION.md`

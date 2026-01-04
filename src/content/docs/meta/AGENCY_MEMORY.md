---
title: "Agency Memory & Context Bridge"
slug: "agency_memory"
description: "The Persistent Short-Term Memory store for the AI Agent. This file bridges the gap between sessions."
---

# 🧠 Agency Memory (The "Hippocampus")

> **Use Case:** This file stores "Living Context" that is too specific for `GROK_LOG` (Laws) but too important to lose to "Amnesia."
> **Instruction:** The Agent must scan this file at startup to sync with the current "Mental State" of the project.

---

## 🔗 External Oracles (Active Intelligence)

These are active AI/External resources that contain "Source of Truth" data not in the repo.

### 1. **Project C|24 (Curtis)**

- **Role:** SME Oracle / Evidence Locker
- **URL:** [NotebookLM: C24](https://notebooklm.google.com/notebook/b8f893fe-234c-44ca-9d92-8fff6f82e53d?authuser=1)
- **Status:** **VERIFIED** (2025-12-31)
- **Contents:**
  - Synthesized "Why" behind the RoHS/Focusrite split.
  - 6x "Saved Notes" (Pinboard) ready for copy-paste into MDX.
  - Contains analysis of 70+ forensic PDFs (vendor emails, dimensional reports).
- **Actionable:** Do not "infer" C24 data. Go here and read the Pinboard.

### 2. **Project Dreamjob (Visual Taxonomy)**

- **Role:** Theoretical Manifesto
- **URL:** _[Insert URL if exists]_
- **Status:** **PENDING**

### 3. **Digidesign Tool Chain (Forensic Audit)**

- **Role:** Technical Truth Source (2003-2007)
- **Artifact:** `digi_tool_chain_inventory.md`
- **Status:** **VERIFIED**
- **Contents:** Definitive versions for Pro/E (Wildfire 2.0), IntraLink (3.4), SAP, and DigiDelivery.

---

## 📍 Current Focus State (The "Cursor")

- **Active Phase:** Phase 4 (Viral Data & Ghost Protocol)
- **Recent Achievement:** Established the **"Neural Scaffolding Strategy"** for SC48 (NotebookLM -> Directory Structure -> Asset Ingestion). Successfully validated the "Hybrid Registration Protocol" (Main.csv Stub + Manual MD Override).
- **Blocked On:** SC48 Asset Migration (Auto-Migration Pending).
- **Next Milestone:** Execute the "Auto-Migration" of 8 key evidence files to `R2_MASTER`.

## 🔗 Active Intelligence (Neural Scaffolding)

- **Protocol:** "The Neural Scaffolding Strategy"
  - **Concept:** Use NotebookLM to pre-visualize the "Exhibit Halls" (Bubbles) before creating folders.
  - **Oracle:** [SC48 NotebookLM](https://notebooklm.google.com/notebook/c783...?authuser=1)
  - **Key Decision:** **"Auto-Migration Pivot"** - If the Agent knows the Source and Destination, it must Script the move. Do not ask the user to drag files.

---

## 🧱 The "Known Knowns" (Facts Established in Chat)

- **NotebookLM is "SME Level":** It is not generic. It has read the raw emails. Trust it.
- **The "Air Gap" is Real:** We have 40+ raw dump folders that need "Stitching."
- **Ingestion Logic:** `ingest_data.py` handles the bulk, but "Deep Dives" (C24) are manually curated using High-Fidelity sources.
- **The "Sovereignty Valve":** `sovereign_manifest.json` is the supreme law. If a project is listed there, `ingest_data.py` MUST NOT overwrite its MDX.
- **The "Two-Step Dance":** Image processing (`process_images.py`) is manual and decoupled from metadata ingestion (`ingest_data.py`). We do not automate the "Art."
- **The "Esbuild Red Herring":** If `npm run build` fails with an obscure `Readable.push` pipe error, it is likely a **Syntax Error** in an Astro component's `<script>` block (e.g., missing function declaration). Don't blame the environment first.
- **The "Storyteller Protocol" (Infrastructure Logic):**
  - **Tier 4 (The Vault):** `\\morespace` (Raw CAD, Cold Storage).
  - **Tier 3 (The Workbench):** `D:\portfolio` (Staging, Context, Spreadsheets).
  - **Tier 2 (The Refinery):** `eriknorris-assets` (Web-Optimized Assets).
  - **Tier 1 (The Public):** `eriknorris` (Production Site).
- **The "Ghost Pipeline" (Legacy Artifact):** `D:\GitHub\eriknorris-workspace\R2_MASTER` is a legacy backup. **DO NOT USE.** The Living Pipeline is `eriknorris-assets\R2_STAGING`.
- **Career Contiguity:** The "Ransomware Gap" is bridged by **Metadata**. Even if files are missing, the _timestamps_ in `\\morespace` prove continuous work from 1996-2024.
- **Stream Signatures:**
  - **Noon:** Visual Polish (Gallery-First).
  - **Hyphen:** Process & Safety (Methodology-First).
  - **Kaleidescape:** Heavy Industry (Taxonomy-First).
- **The "Brain vs. Body" Law:**
  - **The Brain:** NotebookLM (PDFs, Context, Thinking).
  - **The Body:** R2_STAGING (Images, GLBs, Display Assets).
  - _We do not dump the Brain into the Body._

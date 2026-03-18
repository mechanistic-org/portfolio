---
title: "The Forensic Registry"
slug: forensic_registry
sidebar:
  group: System
  order: 1
description: "Documentation of the 3-Tier Architecture for Forensic Intelligence."
---

# 🏛️ The Forensic Registry System

> **Status:** ACTIVE (Jan 2026)
> **Role:** The "Librarian" Pattern

## 1. The Scaling Problem

We have 50+ projects containing heavy forensic data (PDFs, Emails, CAD).

- **Previous Model (Flat):** Attempting to load all raw data into one context window. _Result: Token overflow, amnesia._
- **New Model (Hierarchical):** The "Librarian" Pattern. The AI knows _where_ the book is, but doesn't memorize every page.

## 2. The 3-Tier Architecture

### Tier 1: The Detail Pods (Restricted)

- **What:** Individual NotebookLM notebooks for each project (e.g., "C24 Pod").
- **Content:** Raw emails, PDDs, specific dimensions.
- **Access:** **Air Gapped.** The Master Gem _cannot_ see inside. Only the User can open them via URL.

### Tier 2: The Registry (`PROJECT_INDEX.md`)

- **What:** A single Index File injected into the Master Gem.
- **Content:**
  - Project Title & Role.
  - **Forensic Summary:** A high-density "Bolus" (100 words max) capturing the core "Win" (e.g., "Vertical Hanging Fixture").
  - **Notebook URL:** The link to the Tier 1 Pod.
- **Function:** This is the "Card Catalog." It allows the Gem to say: _"I know about C24. It involved a thermal crisis. For details, go to Shelf 3 (URL)."_

### Tier 3: The Portfolio Gem (The Interface)

- **What:** The conversational agent ("Forensic Portfolio Architect").
- **Instruction:** "You are the Librarian. Consult the Registry. Summarize the Bolus. If detail is needed, point to the URL."

## 3. Operations

### Adding a New Project

1.  **Create Notebook:** Feed it the raw data.
2.  **Generate Bolus:** Ask the Notebook for a "Forensic Summary."
3.  **Update MDX:** Add `notebook_url` and `forensic_summary` to the project's MDX file.
4.  **Compile Registry:** Run `python scripts/compile_registry.py`.
5.  **Refresh Gem:** Upload the new `PROJECT_INDEX.md` to the Master Gem.

## 4. The "Air Gap" Law

We deliberately **DO NOT** use generic "Link Reader" plugins to read the notebooks. The separation ensures that sensitive commercial data (Vendor Pricing, Emails) remains behind the user's Google Login auth wall (Restricted Access) and is never ingested into a public model context.

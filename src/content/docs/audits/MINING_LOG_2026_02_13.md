---
title: "Mining Log: Forensic Titration M700 & 320-Slot Carousel"
slug: "mining-log-2026-02-13"
description: "Forensic analysis of M700 and 320-Slot Carousel titration."
date: "2026-02-13"
tags: ["mining", "forensics", "titration"]
---

# Mining Log: Forensic Titration M700 & 320-Slot Carousel

**Date:** 2026-02-13
**Protocol:** Conversation Miner V2

## Stream A: The Machine (Technical)

### `src/components/DataViz/ComplexityViz.astro`

**[FIXED] Schema Mismatch Crash**

- **Symptom:** `TypeError: data.map is not a function` when rendering M700.
- **Root Cause:** The component expected a simple array `[{label, value}]` (Legacy Schema), but the new V2.1 `complexity_vector` is a rich object (`part_count_growth`, `process_density`).
- **Fix:** Updated `ComplexityViz` to handle both formats. Added conditional logic to check `Array.isArray(data)`. If it is an object (V2.1), it extracts high-level metrics (Max Part Count, Process Density Score, Tool Chain Nodes).

### `src/content/projects/m700/index.mdx`

**[UPDATED] Sidecar Law Enforcement**

- **Action:** Extracted 30+ events from the `events` frontmatter array into a sidecar file (`_entropy.json`).
- **Rationale:** Law X (Sidecar Law) mandates heavy data arrays must live outside MDX to prevent bloating and context window exhaustion.

**[UPDATED] Scars Law Enforcement**

- **Action:** Renamed `scars` frontmatter field to `scars` per V2.1 schema.
- **Rationale:** Standardizing nomenclature for narrative hooks.

### `src/content/projects/320-slot-optical-carousel/`

**[CREATED] New Case Study**

- **Action:** Hydrated a new "deep dive" project linked to M700.
- **Schema:** V2.1 (Full Forensics).
- **Narrative:** "The Potato Chip Pathology" / "Tight Slot War".

## Stream B: The Operator (Meta/Identity)

### `src/content/docs/project/GROK_LOG_V2.md`

**[PROPOSED] The Case Study Pattern**

- **Definition:** Small, high-density project entries that serve as children to a Flagship Parent.
- **Schema:** `category: module_subsystem`.
- **Linking:** Must have a manual `links` entry back to the Parent. Parent must link to Child.
- **Purpose:** Allows "Deep Dive" forensics on specific components (e.g., specific plastic parts) without cluttering the main project narrative.

## Active Context (For Agency Memory)

- **Current Focus:** Forensic Hydration (Goal: ~13 projects).
- **Active Projects:** `m700` (Parent), `320-slot` (Child).
- **Next Steps:** Proceed to next forensic target or refine 320-slot visuals.

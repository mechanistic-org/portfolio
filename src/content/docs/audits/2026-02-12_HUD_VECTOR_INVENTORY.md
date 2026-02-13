---
title: "Inventory: HUD Vectors (The Heavy 12)"
slug: "hud-vector-inventory-2026-02-12"
description: "Detailed mapping of Forensic Vectors across the 12 heaviest projects."
date: "2026-02-12"
tags: ["inventory", "hud", "vectors", "forensics"]
---

# 📟 HUD Vector Inventory

**Date:** 2026-02-12
**Scope:** "The Heavy 12" Projects
**Objective:** Map the flow of Forensic Assets from **Source** (JSON) to **Storage** (MDX) to **Sight** (UI).

## 1. Executive Summary

The "Product Reality Engine" has a **90% Mortality Rate** for advanced signals.
We are successfully mining diamonds (Seismic Data, Audio, War Stories) and then burying them in the MDX frontmatter where no component can see them.

- **Total Vectors Available:** 6 (Audio, Seismo, Isomorphics, War Stories, Complexity, Metrics)
- **Vectors Rendered:** 1 (Forensic Metrics - Text Only)

---

## 2. Vector Status Matrix

| Vector          | Component             | Source (JSON) | Storage (MDX)  | Render (UI)     | Status             |
| :-------------- | :-------------------- | :------------ | :------------- | :-------------- | :----------------- |
| **Audio**       | `SonicHeartbeat`      | ✅ Present    | ✅ Hydrated    | ❌ **UNUSED**   | **DARK DATA**      |
| **Seismic**     | `ForensicSeismograph` | ✅ Present    | ❌ **MISSING** | ❌ **UNUSED**   | **BLOCKED & DEAD** |
| **Isomorphics** | _None_                | ✅ Present    | ✅ Hydrated    | ❌ **MISSING**  | **DARK DATA**      |
| **War Stories** | `ForensicHUD`         | ✅ Present    | ✅ Hydrated    | ❌ **IGNORED**  | **DARK DATA**      |
| **Complexity**  | _None_                | ✅ Present    | ✅ Hydrated    | ❌ **MISSING**  | **DARK DATA**      |
| **Metrics**     | `ForensicHUD`         | ✅ Present    | ✅ Hydrated    | ✅ **RENDERED** | **LIVE**           |

---

## 3. Project Inventory ("The Heavy 12")

_Data availability check for the 12 largest forensic profiles._

| Project           | Audio (`.m4a`) | Seismo (`events`) | War Stories | Isomorphics | Complexity |
| :---------------- | :------------: | :---------------: | :---------: | :---------: | :--------: |
| **C24**           |       🟢       |        🟢         |     🟢      |     🟢      |     🟢     |
| **D-Control**     |       🟢       |        🟢         |     🟢      |     🟢      |     🟢     |
| **D-Command**     |       🟢       |        🟢         |     🟢      |     🟢      |     🟢     |
| **SC48**          |       🟢       |        🟢         |     🟢      |     🟢      |     🟢     |
| **KSystem-120**   |       🔴       |        🟢         |     🟢      |     🟢      |     🟢     |
| **WebTV Galaxy**  |       🔴       |        🟢         |     🟢      |     🟢      |     🔴     |
| **Room Director** |       🔴       |        🟢         |     🟢      |     🟢      |     🔴     |
| **Wall Plates**   |       🔴       |        🟢         |     🟢      |     🟢      |     🔴     |
| **Ext. Switches** |       🔴       |        🟢         |     🟢      |     🟢      |     🔴     |
| **Bazooka**       |       🔴       |        🟢         |     🟢      |     🟢      |     🔴     |
| **WebTV Cortez**  |       🔴       |        🟢         |     🟢      |     🟢      |     🔴     |
| **WebTV Elmer**   |       🔴       |        🟢         |     🟢      |     🟢      |     🔴     |

### Notes:

1.  **Audio Gap:** Only the "Big 4" (C24, D-Control, D-Command, SC48) have generated audio assets.
2.  **Seismic Block:** _Every_ project has an `events` timeline in JSON, but the Hydration Script **deletes/ignores** it when writing MDX. This is why the Seismograph component has nothing to read.
3.  **Complexity:** defined for the hardware projects, often missing for the WebTV series.

---

## 4. Component Audit

### A. `ForensicHUD.astro`

- **Current State:** Text-only reader.
- **Props:** `metrics` (Financial, Process, Governance), `transcript`.
- **Missed Opportunity:** It _should_ be the parent container for `SonicHeartbeat` and `ForensicSeismograph`.

### B. `SonicHeartbeat.tsx`

- **Current State:** Fully functional, beautiful ECG animation.
- **Code Status:** **Orphaned.** No file imports it.

### C. `ForensicSeismograph.tsx`

- **Current State:** Functional visualization of `EntropyEvents`.
- **Code Status:** **Orphaned.** No file imports it.
- **Data Status:** Starved. The `events` array is stripped during hydration.

---

## 5. Recommendations

1.  **Hydration Patch:** Update `hydrate_content.py` to pass the `events` array to MDX frontmatter.
2.  **HUD Unification:** Refactor `ForensicHUD.astro` to import and render `SonicHeartbeat` and `ForensicSeismograph`.
3.  **Layout Integration:** Update `ProjectLayout` to pass `audio_url` and `events` to the HUD.

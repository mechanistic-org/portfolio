---
title: "Audit: Broken Intent (Data Pipeline Analysis)"
slug: "broken-intent-audit-2026-02-12"
description: "Forensic analysis of data loss between Source (JSON), Storage (MDX), and Layout (UI)."
date: "2026-02-12"
tags: ["audit", "forensics", "pipeline", "data-integrity"]
---

# 💔 Audit: Broken Intent

**Date:** 2026-02-12
**Objective:** Identify where "Intent" (Data) dies before becoming "Reality" (User Experience).
**Verdict:** **SYSTEMIC DISCONNECT.**

## 1. Executive Summary

We have identified three distinct "Zones of Failure" where data is lost. The "Product Reality Engine" is currently operating at ~40% efficiency because the richest data is either blocked at the gate or hidden in the walls.

---

## 2. The Zones of Failure

### Zone 1: The Hydration Block (JSON → MDX)

_Data exists in the Source of Truth (`notebook_dumps`) but is **IGNORED** by the `hydrate_content.py` script._

| Field                       | Status         | Impact                                                                      |
| :-------------------------- | :------------- | :-------------------------------------------------------------------------- |
| **BOM** (Bill of Materials) | ⛔ **BLOCKED** | Detailed component lists (e.g., "9440-55165 Side Cap") are never injected.  |
| **Team Size**               | ⛔ **BLOCKED** | Falls back to "Solo" in UI because the script doesn't read the JSON string. |
| **Cast**                    | ⛔ **BLOCKED** | Collaborator credits (e.g., "Ping Zhang") are lost.                         |
| **Timeline**                | ⛔ **BLOCKED** | Project start/end dates are not updated from JSON.                          |
| **Transcript**              | ⛔ **BLOCKED** | Even if we generate AEO audio, the script won't inject the text.            |
| **SEO Metadata**            | ⛔ **BLOCKED** | `title` and `description` are ignored (as noted in previous audit).         |

### Zone 2: The Render Gap (MDX → UI)

_Data is successfully injected into MDX frontmatter but is **NEVER RENDERED** by the components._

| Field                 | Status           | Impact                                                                                   |
| :-------------------- | :--------------- | :--------------------------------------------------------------------------------------- |
| **Isomorphics**       | 🌑 **DARK DATA** | Injected, but `ProjectLayout` passes it nowhere. The "Trust Signals" are invisible.      |
| **War Stories**       | 🌑 **DARK DATA** | Injected, but `ForensicHUD` and `SpecCard` ignore them. Only used for Resume generation. |
| **Complexity Vector** | 🌑 **DARK DATA** | fully injected, but no UI component exists to visualize it.                              |

### Zone 3: The Schema Ghost (Code → Config)

_Code expects data that doesn't exist in the Schema._

| Component         | Ghost Prop | Issue                                                                                                                                        |
| :---------------- | :--------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `ProjectSpecCard` | `impact`   | Component tries to render `impact`, but it is **not defined** in `content.config.ts` or `hydrate_content.py`. It effectively does not exist. |

---

## 3. The "C24" Case Study

_What the User Sees vs. What Exists_

**The Source (`c24.json`):**

- "Engineered 'Method A' Vertical Hanging Fixture..." (War Story)
- "Thermodynamics: ABS Glass Transition vs. Paint Cure Temp" (Isomorphic)
- "Top Panel (9420-55105): Steel / Manual Offset Welding" (BOM)
- "Ping Zhang (VTech), Ed Stegall (Mass Precision)" (Cast)

**The Reality (Rendered Page):**

- **War Stories:** MISSING (Invisible).
- **Isomorphics:** MISSING (Invisible).
- **BOM:** MISSING (Not Hydrated).
- **Cast:** MISSING (Not Hydrated).
- **Team:** "Solo" (Default, because hydration failed).

## 4. Recommendations

1.  **Unblock Zone 1 (Hydration):** Update `hydrate_content.py` to map `bom`, `teamSize`, `cast`, and `transcript`.
2.  **Light Up Zone 2 (UI):**
    - Update `ForensicHUD` to render `War Stories` and `Isomorphics`.
    - Create a `BillOfMaterials` component for the BOM data.
3.  **Exorcise Zone 3:** Remove or formalize the `impact` and `complexity_vector` fields.

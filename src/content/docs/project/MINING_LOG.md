---
title: "Mining Campaign Log"
slug: "mining-log"
sidebar:
  group: "Handbook"
  order: 21
---

# ⛏️ Mining Campaign Log (Re-Hydration)

**Status:** Active (Feb 2026)
**Goal:** Achieve 100% Data Density on the "Heavy Cylinder" projects.

## 🏁 Campaign Milestones (The Roadmap)

| Phase   | Milestone                   | Status | Criteria                                                                                   |
| :------ | :-------------------------- | :----: | :----------------------------------------------------------------------------------------- |
| **I**   | **The Heavy Cylinder**      |   🔴   | All Tier 1 projects hydrated (Complexity/Entropy).                                         |
| **II**  | **The Surgical Cylinder**   |   🔴   | All Tier 2 projects hydrated.                                                              |
| **III** | **The Historical Cylinder** |   🔴   | All Tier 3 projects hydrated.                                                              |
| **IV**  | **The Meta-Analysis**       |   🔴   | **FINAL STEP:** Run `META_ANALYSIS_READY` on the Master Notebook using data from Ph I-III. |

## 🤖 Agent Protocol (Read Me)

If you are a new Agent starting a session:

1.  **Read this Log.**
2.  **Identify the next 'Pending' (🔴) Project.**
3.  **Instruct the User** to run the missing Mining Protocol (e.g. `COMPLEXITY_READY`) in NotebookLM.
4.  **Ingest the JSON** into the repo and mark the status 🟢.

## The Three Vectors

1.  **Narrative:** `REPORT_READY` -> `forensic_summary` (The Story)
2.  **Complexity:** `COMPLEXITY_READY` -> `complexity_vector` (The Mass)
3.  **Entropy:** `SEISMOGRAPH_READY` -> `events` (The Pulse)

---

## 1. The Heavy Cylinder (Tier 1)

| Project          | Slug          | Narrative | Complexity | Entropy | Notes                                          |
| :--------------- | :------------ | :-------: | :--------: | :-----: | :--------------------------------------------- |
| **C24**          | `c24`         |    🟢     |     🟢     |   🟢    | Hydrated via NotebookLM.                       |
| **D-Control**    | `d-control`   |    🟢     |     🟢     |   🟢    | Hydrated via Agent.                            |
| **D-Command**    | `d-command`   |    🟢     |     🟢     |   🟢    | Hydrated via Agent.                            |
| **SC48**         | `sc48`        |    🟢     |     🟢     |   🟢    | Hydrated via Agent.                            |
| **M700 Vault**   | `m700`        |    🟢     |     🟢     |   🟢    | Hydrated via Agent (Force-Dominant Narrative). |
| **K-System 120** | `ksystem-120` |    🟢     |     🟢     |   🟢    | Hydrated via Agent.                            |

## 2. The Surgical Cylinder (Tier 2)

| Project           | Slug                 | Narrative | Complexity | Entropy | Notes                                               |
| :---------------- | :------------------- | :-------: | :--------: | :-----: | :-------------------------------------------------- |
| **Bazooka**       | `bazooka`            |    🟢     |     🔴     |   🔴    | Narrative Enriched. Missing Complexity/Seismograph. |
| **Elvis**         | `extension-switches` |    🟢     |     🔴     |   🔴    | Narrative Enriched. Missing Complexity/Seismograph. |
| **Room Director** | `room-director`      |    🟢     |     🔴     |   🔴    | Narrative Enriched. Missing Complexity/Seismograph. |
| **Waldo**         | `wall-plates`        |    🟢     |     🔴     |   🔴    | Narrative Enriched. Missing Complexity/Seismograph. |
| **Minimerc**      | `minimerc`           |    🟢     |     🔴     |   🔴    | Narrative Enriched. Missing Complexity/Seismograph. |
| **Makeline**      | `makeline`           |    🟢     |     🔴     |   🔴    | Narrative Enriched. Missing Complexity/Seismograph. |

## 3. The Historical Cylinder (Tier 3)

| Project    | Slug               | Narrative | Complexity | Entropy | Notes |
| :--------- | :----------------- | :-------: | :--------: | :-----: | :---- |
| **Cortez** | `webtv-cortez`     |    🟢     |     🔴     |   🔴    |       |
| **Elmer**  | `webtv-elmer`      |    🟢     |     🔴     |   🔴    |       |
| **Galaxy** | `webtv-galaxy`     |    🟢     |     🔴     |   🔴    |       |
| **Pluto**  | `webtv-pluto`      |    🟢     |     🔴     |   🔴    |       |
| **Zeus**   | `zeus`             |    🟢     |     🔴     |   🔴    |       |
| **Venue**  | `venue-live-sound` |    🟢     |     🔴     |   🔴    |       |

## 4. The Meta-Cylinder (Tier 4 - Future)

**Goal:** Run `META_ANALYSIS_READY` on the "Master Notebook" (containing all project JSONs).
**Trigger:** When 12+ projects are fully hydrated.

| Analysis            | Status | Input Data Needed | Output Destination        |
| :------------------ | :----: | :---------------- | :------------------------ |
| **Isomorphic Map**  |   🔴   | 12+ JSON Vectors  | `bio/isomorphics.json`    |
| **Complexity Agg.** |   🔴   | 12+ Complexity V. | `bio/complexity_map.json` |

---

## Legend

- 🟢 **DONE:** Hydrated & Checked.
- 🟡 **PARTIAL:** Mined but not hydrated.
- 🔴 **PENDING:** Creating new data for 2026.

---
title: "Feature Exploration: Remote Physics"
slug: "remote-physics"
status: "concept"
tags: ["visualization", "data", "audio"]
---

# Feature Exploration: Remote Physics & The Director's Cut

> **Premise:** Visualizing the "distributed" nature of the career not just as a timeline, but as a physical exertion (Commute) and a data stream (Remote Output).

## 1. The Director's Cut (Audio-Sync)

**Concept:** A "Narrated Portfolio" where an audio track orchestrates the existing visualizations (`ResVizSwarm`, `SystemAssembly`).

- **Mechanism:** `NarratedPortfolioPlayer` broadcasts `timeupdate` events.
- **Integration:**
  - **Swarm:** Highlights "Eras" (Lincicum, Norris) as they are mentioned.
  - **Assembly:** "Builds" the tech stack layer-by-layer in sync with the explanation.
- **Status:** **On Ice.** Requires high-fidelity audio production ("Hack Pack" Director) to be effective.

## 2. Project Commute (The Polar Archives)

**Concept:** Using the "Quantified Grind" to prove the "Home Base" narrative.
**DataSource:** `eriknorris-workspace/__WORKOUT_data_working-copy` (.hrm files).

### The Narrative Arc

It's not just "I work from home." It's "I navigated the physical gap between Deep Work (Home) and Collaboration (Office) with extreme discipline."

### Visualization Concepts

#### A. The Gravity Well (Mapbox/Globe)

- **Home Base (Redwood City):** A massive, stable gravity well.
- **The Commute:** Visualized as "High Energy" orbital excursions.
- **Metric:** Show the _cost_ of presence vs. the _efficiency_ of remote work.
  - _Office:_ High Altitude, High Watts (Commute cost), High Collaboration.
  - _Home:_ Zero Altitude, High Commit Velocity (Code output).

#### B. The "Watts vs. Commits" Graph

- **Y-Axis (Left):** Physical Watts (Polar Data).
- **Y-Axis (Right):** Commit Volume / File Changes (Git Data).
- **X-Axis:** Timeline (2004-2006).
- **Insight:** Does the "Grind" of the commute correlate with specific project phases? (e.g., Heavy commute = Hardware Bring-up; Zero commute = Firmware Sprint).

#### C. The "Route" Texture

- Use the actual GPX/HRM route data (La Honda -> Daly City) to generate a "Texture" for the background of the specific project bubbles (e.g., _DigiME_ or _C24_).
- The "Noise" in the background isn't random; it's the _elevation profile_ of the commute that built that project.

## 3. Next Steps (Curation First)

Before coding UI, we need the "Red Gold":

1.  **Mining:** Parse `.hrm` files into JSON (`date`, `duration`, `watts`, `altitude`).
2.  **Correlation:** Map specific commutes to specific Project IDs in `multiverse.json`.
3.  **Storyboarding:** Decide if this is a global layer or a "Deep Dive" specific to the _Digidesign_ era.

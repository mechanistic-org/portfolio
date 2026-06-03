---
title: "Canvas & Evidence Graph Plan"
description: "Planning doc for the visitor-facing Canvas (infinite evidence board) and the underlying evidence graph that feeds both the linear project page and the spatial Canvas."
slug: "canvas-evidence-graph-plan"
sidebar:
  group: Handbook
  order: 24
---

# Canvas & Evidence Graph Plan

**Status:** Planning / decisions captured. No implementation started.
**Pilot project:** C24 (Curtis), side-cap thermal-warp slice.
**Relationship to existing work:** Extends `deep_dive_schema.md` and `stickie_protocol.md`. Does **not** replace the canonical sidecars.

> This doc captures decisions from a planning cycle. It is a design plan, not an implementation spec. Sections marked **TBD** are open and should be resolved before building.

---

## 1. Core model: one evidence graph, two projections

The earlier framing pitted "dossier-to-site" (H1) against "canvas-as-editorial-workbench" (H2) as competing hypotheses. We are replacing that with a single model:

> **One evidence graph -> two projections.**
>
> - **Linear projection** = the Wikipedia-style base page (`index.mdx` narrative + the existing **Dossier** tabs). Durable, linkable, SEO/AEO-friendly, LinkedIn-shareable, accessible. The *spine*.
> - **Spatial projection** = the **Canvas**, an infinite, zoomable evidence board (new). Exploratory, mixed-media (image / PDF / video / 3D). The *exhibit*.

Both render the same nodes and edges. Authority lives in the evidence graph (compiled from the canonical sidecars), **not** in any canvas tool. This is why "Obsidian adds no authority" is true but no longer disqualifying: the Canvas is a published *view*, not a source of truth.

Most of the graph already exists, scattered across sidecars. What is missing is (a) explicit **edges** between nodes and (b) **positions**, only if positions are decided to carry meaning (see Section 7).

---

## 2. Vocabulary decisions

| Term | Meaning | Decision |
| :-- | :-- | :-- |
| **Dossier** | The existing tabbed UI surface (`ForensicDossier.astro` -> Team / BOM / Timeline / Scars / Data). | **Keep as-is.** Renaming touches ~16 code files, the `src/components/Dossier/` dir, `dossierStore.ts`, layouts, plus prompt cartridges and agency memory. Not worth it. |
| **Canvas** | The new visitor-facing infinite evidence board. | **Adopted.** Does not need a globally unique name. Disambiguate in code/prose: `Canvas*` prefix for the published surface; always write "Obsidian `.canvas`" for the authoring file. |
| ~~`_dossier.json`~~ | Proposed consolidated data file from an earlier session. | **Rejected as a name** (collides with the Dossier UI) and **rejected as a new authority.** If a consolidated payload is built, name it `_evidence.json` and compile it *from* the existing sidecars. |
| "notebook" | Considered as a rename for Dossier. | **Rejected.** Collides with NotebookLM (`_raw_nlm/`, `notebook_url`, `nlm_url`, `notebook-*` prompts). |

**Canonical sidecars are unchanged** (per `deep_dive_schema.md`): `_metrics.json`, `_crises.md`, `_entropy.json`, `_intelligence.md`. The Canvas and the page are both downstream of these.

---

## 3. Decisions locked

| # | Decision | Choice |
| :-- | :-- | :-- |
| D0 | Naming | Keep "Dossier"; new surface = "Canvas"; data file (if built) = `_evidence.json`. |
| D1 | Canvas audience | **Published / visitor-facing** (not editorial-only). |
| D2 | Default layout | **Auto-layout from the graph** (force / dagre / elk). |
| D3 | Obsidian `.canvas` role | **Optional input/hint**, parsed agentically for clustering and asset placement. **Never required** for build. |
| D4 | Publishing engine | **One engine: Astro.** Do **not** adopt Quartz as a second publisher. Mine Obsidian as *input* only. |
| D5 | Interaction | **Read-only spatial**: pan / zoom / click-to-focus / expand. **No visitor drag-persistence** (avoids "looks broken"). |
| D6 | Graph vs pinboard | **Graph model** (xyflow) for control, constraints, and relative simplicity. |
| D7 | Data layer | **Carry forward** sidecars + bubbles + entropy + intelligence. One reconciliation pass only. |
| D8 | Page layer | **Carry forward** the narrative base page + Dossier tabs. |
| D9 | Canvas layer | **Start new** (greenfield; no graph lib installed today). |
| D10 | "Zero manual edits to `index.mdx`" metric | **Retired** (process-purity, not value). Replaced in Section 10. |

---

## 4. Layered architecture

1. **Evidence/claim data (carry forward).** Canonical sidecars, `_entropy.json`, `_intelligence.md`, bubbles assets in R2, NotebookLM raw. One reconciliation pass to pick the canonical store among `c24_bolus.json` / `c24.json` / `src/config/c24_intelligence.json` (already flagged as a TODO in `deep_dive_schema.md`). This is a labeling/precedence pass, not a rebuild.
2. **Narrative base page (carry forward).** `index.mdx` + Dossier tabs. The LinkedIn-shareable spine.
3. **Spatial Canvas layer (new).** Compiled from the evidence graph; rendered as a React island.

---

## 5. The evidence graph (draft schema)

Compiled artifact (working name `_evidence.json`), built **from** the sidecars — not hand-authored as a new source of truth.

### Node types and their sources

| Node | Sourced from |
| :-- | :-- |
| `claim` | `metrics`, `forensic_metrics`, quantified results |
| `artifact` | bubbles assets in R2 (image / PDF / video / 3D GLB) |
| `person` | `cast` |
| `part` | `bom`, `complexity_vector.process_density` |
| `event` | `_entropy.json`, `timeline` |
| `crisis` | `_crises.md`, `scars`, `forensic_summary` |

### Edge types (draft)

- `evidence_for` — artifact -> claim / crisis
- `caused_by` — crisis -> event / part
- `involves` — crisis -> person
- `references` — artifact -> part
- `resulted_in` — crisis -> claim
- `depends_on` — part -> part / event

Edges are the genuinely new data. Coverage of `evidence_for` (claims with >= 1 linked artifact) is the core quality signal.

---

## 6. Why the C24 side-cap slice is the right probe

The side-cap thermal-warp story already exists as a built stickie (`02_side_cap_crisis`, deck + 4 evidence images), and `_entropy.json` already carries the dated thermal events with `source_ref`s. So the cheapest valid test is:

1. Hand-build the side-cap subgraph: ~4-6 existing artifacts, 3-4 claims, the edges between them.
2. Render once in xyflow with auto-layout as a throwaway island.
3. Judge: **does the spatial evidence view teach the story better than the linear stickie?**

This answers the only question that justifies the Canvas existing, before any pipeline investment. It is the spatial analog of the dossier-to-page round-trip test.

---

## 7. Layout strategy (the pivotal question)

Restated precisely: **does spatial arrangement carry editorial meaning worth persisting?**

- **Default (D2):** auto-layout from the graph. Zero positioning maintenance; the Canvas regenerates from data.
- **Optional (D3):** parse Obsidian `.canvas` JSON (clean, documented format) to provide *hints* — clustering, grouping, and manual placement of hero artifacts — when a `.canvas` exists. Absent a `.canvas`, auto-layout stands alone.

This hybrid reconciles "from the graph would be awesome" (auto) with "Obsidian should inform the visitor canvas" (hint). The `.canvas` is an accelerator, never a build dependency.

**TBD:** how deep the Obsidian-`.canvas`-as-input pipeline goes (positions only? groups? edge hints? embedded asset refs?).

---

## 8. Interaction model

- **Baseline (D5):** pan, zoom, click-to-focus, expand-node. Read-only. No visitor drag is persisted.
- Rationale: free drag risks looking broken rather than intentional, and creates an unwanted "do we save the visitor's layout?" question.
- **Later, optional:** a "studio mode" drag behind a flag (local-only, non-persistent) as a flex. Not in the initial scope.

---

## 9. Tooling, grounded in the current stack

- **xyflow (React Flow)** — best fit for the graph model (D6); drops in as a React island; pairs with dagre/elk for auto-layout. **No graph/canvas lib is installed today**, so this axis is greenfield.
- **Rich-media nodes are already solved primitives:** `@google/model-viewer` + `@react-three/fiber` (3D/GLB), `yet-another-react-lightbox` (images), video embeds, `react-masonry-css`. Canvas nodes can host real artifacts from day one.
- **d3 / d3-sankey** already present (used by `network_topology.json`), so force/graph math is available if xyflow's layout helpers are insufficient.
- **Quartz:** not adopted (D4). It would be a second publishing engine and re-introduce the fragmentation we are trying to avoid.

---

## 10. Metrics (replacing "zero manual edits")

Outcome-oriented, aligned to "make a better page":

- Can a cold viewer reconstruct the side-cap story from the **Canvas alone**, without the prose?
- Time to add a new artifact and have it appear correctly in **both** projections.
- Claim coverage: fraction of claims with >= 1 linked evidence node (vs. orphan claims).
- Does the spatial view surface a connection the linear page hides? (The only real justification for the Canvas.)

---

## 11. Redaction baseline

Practical rule (LinkedIn-appropriate; projects span ~1985-present, mostly defunct/acquired entities):

- **Public by default** for shipped / old projects (business metrics, vendor names, ECO/part numbers, MSRP — already on the live C24 page).
- **Redact only:** (a) anything under an explicit NDA still in force, (b) named individuals' private contact info, (c) live pricing/supplier terms for products still on market.

This is a 3-line rule, not a gate with tracked sub-fields.

---

## 12. Phased plan (decision gates, not sprints)

1. **G0 - Vocabulary locked** (Section 2). Done in this doc.
2. **G1 - Forks resolved** (D1-D6). Done in this doc.
3. **G2 - Evidence-graph schema** finalized (Section 5): node types, edge types, source mapping. Produces the `_evidence.json` shape.
4. **G3 - Side-cap probe** (Section 6): throwaway xyflow island, auto-layout, hand-built subgraph. Evaluate against the metrics in Section 10.
5. **G4 - Decide pipeline:** auto-compile `_evidence.json` from sidecars vs. author-in-Obsidian hints; decide whether to generalize beyond C24.
6. **G5 (later):** split into GitHub tickets once G3 validates the concept.

---

## 13. Open questions / TBD

- **Data reconciliation:** which of `c24_bolus.json` / `c24.json` / `src/config/c24_intelligence.json` / `_intelligence.md` is the precedence winner? (Many have live visualizations/usage; this is precedence, not deletion.)
- **Obsidian pipeline depth** (Section 7 TBD): positions only, or groups/edges/asset refs too?
- **Quartz:** confirmed *not* a publisher (D4), but is there any local-vault use (private browsing of the vault) worth keeping separate from the site?
- **`_evidence.json` ownership:** compiled-only (regenerated, never hand-edited) vs. allow manual edge curation. Leaning compiled-only with a separate `_edges.json` for hand-curated relationships if needed.
- **Generalization:** C24-only proof first; portfolio-wide rollout is a separate decision after G3.

---

## 14. Out of scope (for now)

- Ticket-splitting (deferred to G5 by request).
- Any rename of the existing Dossier UI.
- Rewriting the portfolio renderer.
- Visitor-persisted drag / "live Miro" editing.
- Adopting Quartz or a second publishing engine.

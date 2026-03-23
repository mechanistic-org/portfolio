# EN-OS Implementation & Design Atlas

This document serves as the primary technical and visual standard for the EN-OS and Mechanistic DFMEA platform. It codifies the design laws, UI patterns, and deployment workflows that ensure architectural continuity and high-density engineering rigor.

---

## 1. Visual Governance & Design Laws (LXXVII–LXXXI)

### 1.1 Typography & Monitor Scaling (Law LXXVII)

Protocol for ultra-wide monitor legibility and high-density engineering hierarchy.

- **The PX vs PT Anchor (16px = 12pt)**:
  - **Tier 0 (Micro-Telemetry)**: `8px`–`9px`. (Inner badges, secondary labels).
  - **Tier 1 (High-Density Viz)**: `10px`–`11px`. (Risk Matrix body, Forensic Table, Node Pills).
  - **Tier 2 (App Shell/Navigation)**: `12px`–`13px` (`text-sm`). (Sidebar links, Buttons).
  - **Tier 3 (Executive Narrative)**: `16px`–`18px` (`text-base/lg`). (SOW, Forensic Summaries).
- **Consolidation & Density**: Engineering tables (e.g., Failure Mode Breakdown) utilize reduced padding (`px-3 py-2.5`) to maximize information density on single-viewport dashboards.
- **Bulk Refinement**: For maintaining consistency across modular React libraries, utilize automated typography refinement scripts to enforce these tiers across components.

### 1.2 The Standardized Risk Taxonomy (Law LXXVIII)

The 4-tier "Engine Control Unit" (ECU) status system for sitewide risk representation.

| Status       | Color          | Visual Signal | Operational Meaning                                                              |
| :----------- | :------------- | :------------ | :------------------------------------------------------------------------------- |
| **NOMINAL**  | Emerald        | 🟢 "GO"       | Physics aligned; validation cleared.                                             |
| **MARGINAL** | Yellow/Amber   | 🟡 "WARNING"  | Tolerance threshold reached; active mitigation.                                  |
| **CRITICAL** | Red            | 🔴 "NO-GO"    | Math breaking; catastrophic yield risk.                                          |
| **HOLD**     | Charcoal/Slate | 🛑 "LOCKED"   | System safely halted to protect capital; implies immutable physical constraints. |

- **Design Philosophy**: `HOLD` is rendered in subdued slate/charcoal to avoid competing for attention with active alarms (`CRITICAL`), establishing it as a foundational, non-negotiable constraint.

### 1.3 Constraint Iconography & Branding (Laws LXXIX-LXXXI)

- **The Lock Anchor (🔒)**: Mandatory for **PRD BASELINE** and **HOLD** states to signal fixed constraints.
- **Sovereign ID (MO Logo Redundancy)**: In specialized ECU consoles, the branding should be ultra-minimal. If the MO logo asset (e.g., `/images/MO-Logo-White-Web-updated.png`) creates overhead or 404 errors, it should be stripped in favor of clean text wayfinding to maintain low-latency "Terminal" aesthetics.
- **Title Centering**: Formal project identifiers (e.g., "HOLY GRAIL PRD-2") are horizontally centered with significant tracking (e.g., `letter-spacing: 0.25em`) above diagnostic visualizations (Arc Maps) to ground the telemetry in the project context.
- **Visual Breadcrumbs (Monolithic Constraint)**: In high-density ECU consoles, navigation icons (sidebar nodes) should maintain a **monolithic color scheme** (e.g., Slate/Blue) regardless of the underlying node status. Using status-colored rings in the navigation creates "Visual Dashboard Fatigue" and distracts from the active telemetry in the central viewport.
- **Industrial Directness (Nomenclature)**: Use "DOWNLOADS" (direct/industrial) for document indices within the ECU Dashboard shell.

---

## 2. Mechatronic Visualization Patterns

### 2.1 The Arc Diagram (Interactive Node Viz)

- **Vertical Compression**: Consolidate vertical space between the Node Map and Risk Matrix (e.g., `space-y-4`) to improve the dashboard's aspect ratio and allow simultaneous viewing of secondary table data.
- **Redundant Prefix Striping**: Remove alphabetical prefixes (e.g., "A ", "B ") from functional labels within the visualization and sidebar. Labels should be direct mechatronic descriptors (e.g., "MATERIAL", "MECHANICAL") for an engineering-first aesthetic.
- **Visual Sync (The 'Marching Ants')**: Use synchronized CSS animations (e.g., `animate-[spin_10s_linear_infinite]`) on red-dashed SVG overlays to link a physical failure in the matrix with its corresponding node in the map.
- **Animation Intensity & Stability**:
  - Ensure the **intensity and brightness** (stroke-width and opacity) of animations match perfectly across both components (Matrix vs. Map) to establish a "Visual Quorum."
  - **In-Situ Spin**: SVG indicators must utilize specific `style={{ transformOrigin: "Xpx Ypx" }}` coordinates matching their exact `cx/cy` centers to ensure the element spins in place rather than orbiting the viewport origin. (Example: `320px 140px` for Node B).
- **Juxtaposition (Andon Viz)**: Reintegrate the "Kinematic Andon" directly into the ANALYSIS navigation block to provide visual quorum contrast between "Baseline PRD" and "Proposed Recovery" paths.

### 2.2 The Risk Matrix Grid

- **Columnar Filtering**: Header cells act as active triggers for the Node Map/Interactive Viz.
- **Hover States**: Use `opacity-40` for inactive paths vs. `opacity-100` on hover to de-emphasize undesirable states (e.g., "ALL PATHS").
- **Font Scaling**: Body text in matrix cells (e.g., `text-xs`) is scaled for forensic legibility.

### 2.3 Forensic Node Breakdown (The Detailed Expansion)

- **Structural Linking**: The Forensic Table is explicitly titled and color-keyed to the linked constraint column (e.g., **"FORENSIC NODE BREAKDOWN: PRD BASELINE [LOCKED]"** in `text-amber-500`).
- **Data-Vault Mapping**: Use centralized JSON "Data Vaults" to drive the names and properties of subsystem constraints programmatically.

---

## 3. Advanced D3 Topologies for Forensic Data

For mapping complex subsystem constraints and RPN severity, the following D3.js topologies are prioritized:

- **Sunburst Partition Chart**: Best for hierarchical scaling. Root Node (Center) -> Subcomponents (Mid-ring) -> Failure Modes (Outer slices), color-coded by the ECU Taxonomy.
- **Parallel Coordinates Plot**: Optimized for multi-axis severity mapping. Tracks Severity, Occurrence, Detection, and RPN across vertical axes to visualize fault-lines.

---

---

## 5. ECU Dashboard UI Architecture (The Sovereign Navigator)

The V31 "Holy Grail" dashboard utilizes a specialized, three-tier navigation architecture designed for diagnostic clinicality:

### 5.1 Tier 1: The Empirical Index (NODES)

- Provides atomic access to individual subsystem forensic data.
- **Visual Signal**: Utilizes status-colored rings (Emerald/Amber/Red/Slate) that sync with the diagnostic matrix.
- **Identity**: Stripped of alphabetical noise; focuses on functional descriptors (e.g., "RETAIL EDGE").

### 5.2 Tier 2: Core Analytics (ANALYSIS)

- Aggregated forensic views that perform multi-variable synthesis.
- **Key Modules**:
  - **DFMEA**: The primary Risk Matrix and Failure Mode Breakdown.
  - **Kinematic Andon**: Direct quorum contrast between current constraints and proposed recovery paths.
  - **Process Mining**: Temporal telemetry of workflow execution.

### 5.3 Tier 3: Strategic Methodology (STRATEGY)

- Narrative-first views that frame forensic data in the context of capital protection and enterprise valuation.
- **Key Modules**: **Compound Efforts**, **Frontier Vectors**.

---

## 6. Deployment, Stability & AEO Pipelines

### 6.1 Production Stability (The "Airlock")

- **Pre-flight Checks**: Zod Schemas, `audit_frontmatter.cjs`, and `verify_deep_hud.cjs`.
- **Nuclear Renames (Law XVI)**: Address module resolution errors with aggressive casing/path standardization instead of path-aliases.
- **Surgical Purging**: Strip toxic dependencies (e.g., Three.js fragments) from archived entry points to bypass Vite's dependency poisoning.

### 6.2 AEO Bridge Protocol (Answer Engine Optimization)

- **Body-First Strategy**: Mandatory technical narratives (Crisis/Fix/Outcome) MUST live in the MDX body for maximum AI visibility.
- **Transcript Mandate**: Verify audio briefings are paired with verbatim text transcripts in the frontmatter.

### 6.3 Asset Transfer & Recovery (Air Gap)

- **Asset Sovereignty (Law I)**: All heavy media lives in a decoupled sibling repository (`portfolio-assets/R2_STAGING`).
- **Atomic Transfer**: Use `robocopy` or atomic sync tools for synchronization from the sovereign source to the local serve path.

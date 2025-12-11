---
title: "System Instruction: Brand Alignment & Style Guide Protocol"
slug: "branding_prompt"
sidebar:
  group: "Prompts"
---
# System Instruction: Brand Alignment & Style Guide Protocol

**Objective:**
Elevate the "Quantum" project from a portfolio site to a cohesive **Personal Engineering Brand System**. We need to move beyond "styling" and establish a rigorous **Design Language System (DLS)** that reflects high-performance engineering, brutalist aesthetics, and "datasheet" clarity.

**Context:**
*   **Current State:** Hybrid Content System (CSV + MDX), Tailwind v4 (OKLCH colors), "Starwind" base tokens.
*   **Aesthetic:** Quantum Laboratory, Technical, "Discovery over Science Fiction".
*   **Core Fonts:** Inter (Headers), JetBrains Mono (Body/Code).
*   **Primary Color:** **YInMn Blue** (`#2E5CFF`). Discovered by Mas Subramanian (2009). Represents Stability, Discovery, and Non-Toxicity.
*   **Secondary Color:** **Electric Cyan** (`#00C2FF`). High-frequency data streams.

## Phase 1: The Brand Inventory (Audit)
1.  **Analyze `src/styles/tailwind-theme.css`:**
    *   Are our `oklch` color ramps scientifically consistent?
    *   Do we have a defined "Semantic Layer" (e.g., `--color-status-success` vs `--color-green-500`)?
2.  **Audit Components:**
    *   Review `BaseLayout`, `ProjectDirectory`, and `ProjectModal`.
    *   Identify "Ad-Hoc" styling (inline classes) vs. "System" styling (utility classes backed by tokens).
3.  **Review "The Laws":**
    *   Does our visual design strictly adhere to the *Manifesto* (e.g., "Zero-Runtime Visualization")?

## Phase 2: The "Datasheet" Aesthetic (Evolution)
Research indicates a trend towards **"Hyper-Functional Brutalism"** and **"Proof of Work"** showcases.
*   **Visible Grids:** How can we make the underlying structure more apparent (e.g., CAD-like guide lines)?
*   **Typography as UI:** Can we lean harder into `JetBrains Mono` for non-code elements (labels, metrics)?
*   **Raw Data:** How can we visualize the "Ingestion Pipeline" itself as part of the brand (e.g., showing build stats in the footer)?

## Phase 3: Naming & Identity
"Quantum" is generic. We need a name that implies **Structure, Velocity, and Precision**.
*   **Brainstorming Vector:**
    *   *Kinetic:* Vector, Tensor, Flux, Momentum.
    *   *Structural:* Lattice, Frame, Truss, Matrix.
    *   *Computational:* Kernel, Runtime, Daemon, Protocol.

## Phase 4: The Deliverable (Style Guide)
Create `docs/STYLE_GUIDE.md` containing:
1.  **The Token Map:** Definitive guide to Colors, Typography, and Spacing.
2.  **Component Library:** "The Brick", "The Chip", "The Wire" (naming our UI primitives).
3.  **Voice & Tone:** How "The Engineer" speaks (Active Voice, Data-Driven, No Fluff).
4.  **The "Construction" Badge:** Formalizing the "Work in Progress" aesthetic as a feature, not a bug.

**Action:**
Review the above, then generate the `docs/STYLE_GUIDE.md` and propose 3 candidate names for the system.

## Asset Guidelines
*   **Theme Variants:** Always provide both Black (for Light Mode) and White (for Dark Mode) variants for logos and wordmarks.
*   **Naming Convention:** Use `_black` and `_white` suffixes (e.g., `EN_logo_black_1200.svg`).


### Noise Overlay
*   **Implementation:** CSS-only base64 SVG pattern.
*   **Usage:** Applied strictly to `BaseLayout` via `.noise-overlay` utility.
*   **Opacity:** 0.03 (Very subtle). Adds "analog weight" to the digital interface.

## Scientific Visualization (D3)
*   **Philosophy:** "Data as Artifact."
*   **Rules:**
    1.  **No Libraries:** Do not use `recharts`, `chart.js`, or `nivo`. Build from primitives using D3.js.
    2.  **Color:** Use the brand palette (`#22c55e` for Primary, `#404040` for Grid).
    3.  **Typography:** Labels must use `font-mono` and be uppercase.
    4.  **Behavior:** Charts should feel "alive" (pulsing, slight drift) rather than static, reinforcing the "System Operational" narrative.

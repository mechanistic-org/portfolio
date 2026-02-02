---
title: "Design Language System (DLS)"
slug: "style_guide"
sidebar:
  group: "Reference"
  order: 1
---

# ERIK NORRIS: Design Language System (DLS)

**Status:** Draft v1.0
**Aesthetic:** Hyper-Functional Brutalism / Technical Datasheet

---

## 1. Core Philosophy

The design system is not just about "styling"; it is a functional specification. Every pixel must earn its place.

### The Laws

1.  **Zero-Runtime Visualization:** If it's static data, it's an SVG. No client-side charting libraries.
2.  **Physical Asset Law:** Assets are files, not database entries.
3.  **The Datasheet Aesthetic:** The UI should feel like a technical specification document. High information density, clear hierarchy, zero fluff.
4.  **Honest Construction:** We show the seams. The "Construction Badge" and "Debug Mode" are features, not bugs.
5.  **The Physical Output:** The system must degrade gracefully to paper. `Cmd+P` should yield a professional datasheet, not a broken website screenshot.
6.  **Tactile Depth:** The interface is not glass; it is machinery. Switches click, cards have weight, and the lens has grit. We prioritize "Texture" over "Cleanliness."

> **Live Visualization:** A living example of this style guide is available at [`/about/elements`](/about/elements).

---

## 2. The Token Map

### Colors (OKLCH)

We use a scientifically calibrated OKLCH scale for consistent perceptual brightness.

- **Primary (The Signal):** `#2E5CFF` (YInMn Blue). Used for active states, cursors, and "System Online" indicators.
- **Neutral (The Chassis):** A 10-step scale from `neutral-50` (White) to `neutral-950` (Void Black).
- **Semantic Layer:**
  - `--background`: `neutral-950` (Dark Mode Default)
  - `--foreground`: `neutral-200`
  - `--border`: `neutral-800`
  - `--grid-color`: `rgba(0, 133, 202, 0.5)` (Process Blue)

### Typography

- **Headers (The Label):** `Inter` (Sans-serif). Bold, tracking-tight. Used for section headers and titles.
- **Body/UI (The Data):** `JetBrains Mono`. The default font. Used for all body text, code, metrics, and UI elements.
  - _Rule:_ If it's a number or a metric, it **MUST** be Mono.

### Icons & Logos

> [!IMPORTANT]
> **Branding Guide:** For comprehensive logo usage, naming conventions (`EN_logo_*`), and 3D assets, refer to the **Branding Guide** (`BRANDING.md`).

### Engineering Fidelity (V7 Aesthetic)

- **Application:** Strictly for `dreamjob` and future high-tech "constructed" assets.
- **Keywords:** Machine Vision, Titanium, Internal Mechanism, Process Depth-of-Field.
- **Prohibitions:**
  - NO Robotic Arms (External mechanisms).
  - NO Text/Glyphs (Pure geometric data).
- **Palette:** Titanium, Carbon Fiber, `Electric Blue (#2E5CFF)`, `Digidesign Green (#40EF29)`.

### Theme-Aware Logos

To implement a logo that switches with the theme:

1.  Include both `img` tags in the HTML.
2.  Apply `.logo-light` to the black version and `.logo-dark` to the white version.
3.  Use the standard CSS utility:
    ```css
    .logo-light {
      display: block;
    }
    .logo-dark {
      display: none;
    }
    :global(.dark) .logo-light {
      display: none;
    }
    :global(.dark) .logo-dark {
      display: block;
    }
    ```

### Prose / Long-form Content

We enforce the "Datasheet" aesthetic even in narrative content (Markdown).

- **Body Text:** `JetBrains Mono` (`font-mono`). All narrative text is treated as data.
- **Headers (H2):**
  - **Style:** "Active System" aesthetic.
  - **Visual:** `text-2xl` (Mobile) / `text-3xl` (Desktop), Primary Green (`var(--primary)`).
  - **Effect:** Bottom border (`neutral-800`), Pulse Dot animation.
- **Headers (H3):**
  - **Visual:** `text-2xl` (Mobile) / `text-3xl` (Desktop), Primary Green.
  - **Effect:** Bottom border (`neutral-800`), **NO** Pulse Dot.
  - **Usage:** "Project Artifacts" or major sub-sections.
- **Headers (General):** `Inter` (`font-sans`). Bold, tracking-tight. Provides visual hierarchy.
- **Blockquotes (The Note):**
  - **Style:** Brutalist. No border-radius.
  - **Visual:** Left border 2px (`border-primary-500`), subtle background (`bg-primary/5`).
  - **Usage:** Technical context, warnings, or "The Challenge" summaries.

### Spacing & Layout

- **The Grid:** All layouts align to a 4px baseline grid.
- **Containers:** `.site-container` (max-w-5xl).
- **The Seam:** 1px borders (`border-neutral-800`) define all component boundaries. No soft shadows; only hard lines.
- **Global Top Padding:** `pt-32` (8rem) is the standard for all main page containers (Home, Project List, Project Detail) to ensure visual consistency across page transitions.
- **The Robust Header:** For headers with centered elements (like navigation), use a 3-column CSS Grid (`grid-cols-[1fr_auto_1fr]`) with `items-end`. This ensures the center element remains perfectly centered while allowing left/right content (Titles/Breadcrumbs) to wrap naturally without overlap.

> [!NOTE]
> **Grid Gap Configuration**
> The project detail layout now uses `gap-8` (previously `gap-12`) for tighter information density.
>
> - **Status:** Verified active in `[...slug].astro`.
> - **Note:** Keep an eye on text-heavy pages (`portion-cup`) for potential overlapping, but `gap-8` is the approved "Datasheet" standard.

---

## 3. Component Library ("The Kit")

### The Kit (Implementation)

These components are available for use in MDX content:

- **Admonition:** `<Admonition variant="info|tip|caution|danger">...</Admonition>`
- **Chip:** `<Chip variant="production|prototype|concept" text="..." />`
- **Wire:** `<Wire />` (The standard divider)
- **Zigzag Grid:** Alternating text/image layout for feature breakdowns.
- **Process Strip:** Horizontal scrolling container for linear timelines.
- **Evidence Badge:** `<EvidenceBadge source="..." page="..." />` (Small verified icon for grounding).
- **Evidence Locker:** `<EvidenceLocker sources={[]} />` (The bibliography/archive section).

### The Brick (Containers)

- **Usage:** Cards, Modals, Sections.
- **Style:** `bg-neutral-950`, `border border-neutral-800`.
- **Interaction:** Hover states use `bg-neutral-900` or `border-primary/50`.

### The Chip (Status)

- **Usage:** Production Status, Tech Stack Tags.
- **Style:** `rounded-full`, `px-2 py-0.5`, `text-xs font-mono`.
- **Variants:**
  - _Mass Production:_ `bg-green-500/10 text-green-500 border-green-500/20`
  - _Prototyping:_ `bg-amber-500/10 text-amber-500 border-amber-500/20`
  - _Concept:_ `bg-neutral-800 text-neutral-400 border-neutral-700`

### The Wire (Dividers)

- **Usage:** Separating content sections.
- **Style:** `border-b border-neutral-800`.

### The Back Button

- **Usage:** Footer navigation for non-project pages (Colophon, 404).
- **Component:** `BackButton.astro`
- **Style:** `variant="outline"`, `arrow="left"`.
- **Philosophy:** Consistent exit paths are critical for deep-dive content.

### The Spotlight (Interaction)

- **Usage:** Project Directory rows.
- **Effect:** Radial gradient tracking mouse position.
- **Implementation:** CSS Variables `--x`, `--y` updated via JS.

### Data Visualization

#### Chart Layouts

- **Rule:** When displaying multiple charts (e.g., Skill Fingerprint + Part Breakdown), they **MUST** be wrapped in a responsive grid container to prevent vertical stacking on desktop.
- **Class:** `grid grid-cols-1 gap-6 md:grid-cols-2`

### Construction Gauge (Status)

- **Usage:** Temporary placeholder for sections or sites in active development.
- **Color:** `Amber-500` (`#f59e0b`).
- **Behavior:** Slower, calmer pulse (3s duration) compared to the active "System Online" frenzy.
- **Component:** `<ConstructionGauge />`

### Technical Header (Spec Card)

- **Component:** `ProjectSpecCard.astro`
- **Purpose:** Standardized "Head Unit" for project pages.
- **Behavior:** Encapsulates metadata (Role, Client, Status) in a high-density card.
- **Interaction:** "Mini Gauge" pulses to indicate project status (Blue=Done, Amber=WIP).

### The Cockpit (Deep HUD)

- **Usage:** High-Fidelity Project Pages (e.g., `c24`).
- **Aesthetic:** "747 Flight Deck" / High-Check Density.
- **Trigger:** Automatically enabled when `metrics` data is injected via the router.
- **Typography:** `JetBrains Mono` (0.8rem). Labels are strictly uppercase `neutral-500`. Values are `emerald-400` (Profit) or `orange-500` (Alerts).
- **Layout:** 2-Row Grid. Top row = Specs. Bottom row = Intelligence (COGS, Margins, Governance).

### The Evidence Locker (Grounding)

- **Aesthetic:** "Verified Document" / "Archive" feel.
- **Usage:** Providing proof for technical claims.
- **Component:** `<EvidenceBadge />`
  - _Visual:_ A subtle, monospaced tag next to a metric (e.g., `40% lift [SRC]`).
  - _Interaction:_ Hover displays the source document name and page number. Click opens the "Evidence Locker" modal.
- **Component:** `<EvidenceLocker />`
  - _Visual:_ A grid of "Artifact Cards" at the bottom of a project page.
  - _Content:_ Screenshots of source documents, bibliography entries, and links to (internal) archives.
  - _Vibe:_ "Proof of Work" transparency.

---

## 4. Voice & Tone

**"The Engineer"**

- **Active Voice:** "Built X," not "X was built."
- **Precision:** "Reduced latency by 40ms," not "Made it faster."
- **No Fluff:** Avoid marketing speak. State the facts.

---

---

## 6. Effects

### Scramble Text (The Glitch)

- **Usage:** High-impact headers and interactive elements.
- **Component:** `<ScrambleText text="ERIK NORRIS" />`
- **Behavior:** Glitches on hover and randomly on idle.

### Scroll Dynamics

We use specific motion verbs to define the relationship between content layers:

- **"Hightail" (Flee):** Foreground elements (Headers) should hastily retreat (1.5x scroll speed) to reveal the data underneath.
- **"Parquet" (Fade-Parallax):** Content strips slide continuously slightly slower than scroll (0.9x relative) to feel "heavy" and detached from the background.
- **"Emerge" (Focus):** Background data layers wait for the foreground to clear before transitioning to full opacity.

---

## 5. Visual Effects & Physics

### The Noise Overlay ("Tinnitus")

- **Implementation:** `.noise-overlay` / `.bg-noise`.
- **Tech:** Base64 SVG Data URI (Baked in `global.css`).
- **Why:** External dependencies (`netlify.app`) are fragile. We bake the noise to ensure the "grit" never fails to load.
- **Opacity:** `0.05` (Visible Texture).

### The Visible Grid

- **Aesthetic:** The coordinate system of the machine.
- **Params:**
  - **Size:** `40px` (Matches Tailwind `spacing-10` / `2.5rem`).
  - **Color:** `rgba(0, 133, 202, 0.1)` (Light) / `rgba(0, 133, 202, 0.15)` (Dark).
  - **Behavior:** Fixed attachment. Lines do not scroll; content flows over the grid.

### Glassmorphism ("Nav Glass")

- **Usage:** Fixed Navigation Bar.
- **Params:**
  - **Blur:** `16px`.
  - **Opacity:** High transparency (0.05 - 0.1) for a "Lens" effect.
  - **Border:** 1px `neutral-800` (preserves "The Seam").

### The Spec Ticker

- **Usage:** High-density technical metadata (Mega Dashboard).
- **Implementation:** Tailwind `animate-[scroll]` with a custom Keyframe in `global.css`.
- **Aesthetic:** infinite horizontal scroll, Monospaced, Uppercase.
- **Color:** `neutral-500` (Ghosted) to avoid stealing focus from the primary charts.

### 3D Micro-Interactions

- **Idle State:** Models shouldn't be statues.
- **The "Wiggle":** Models should have a subtle, continuous sine-wave animation (Idle Breath) + Mouse Parallax (User Awareness).
- **The "Elastic Snap":** If a user manually rotates the model, it should wait 2 seconds after release, then smoothly interpolate (Spring Physics) back to its canonical "Hero Pose" (`camera-orbit`).

## 6. Future Enhancements (Roadmap)

- **Build Stats:** Expose `ingest_data.py` runtime metrics in the footer (e.g., "Built in 0.4s").
- **Raw Mode:** A toggle to view the raw JSON/Markdown source of any page.

## 7. Material Tokens (3D)

Defines the physical surface properties of the brand.

### The "Stealth" Variant (Black)

- **Name:** Matte Forged Carbon
- **Base:** Chopped/Forged Carbon Fiber.
- **Finish:** Raw/Matte (Roughness 0.5+). No clear coat.
- **Vibe:** "Prototype Racer", "High-Performance Structural".

### The "Clinic" Variant (White)

- **Name:** Titanium Ceramic
- **Base:** Sintered Porcelain.
- **Color:** Titanium White (`#F1F1F4`).
- **Finish:** Powder Coat Normal (Micro-texture), SSS Enabled.
- **Vibe:** "Medical Grade", "Spacecraft Shielding".

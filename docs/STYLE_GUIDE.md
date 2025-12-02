# QUANTUM: Design Language System (DLS)

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

> **Live Visualization:** A living example of this style guide is available at [`/about/elements`](/about/elements).

---

## 2. The Token Map

### Colors (OKLCH)
We use a scientifically calibrated OKLCH scale for consistent perceptual brightness.

*   **Primary (The Signal):** `oklch(74.72% 0.2439 141.89)` (Neon Green). Used for active states, cursors, and "System Online" indicators.
*   **Neutral (The Chassis):** A 10-step scale from `neutral-50` (White) to `neutral-950` (Void Black).
*   **Semantic Layer:**
    *   `--background`: `neutral-950` (Dark Mode Default)
    *   `--foreground`: `neutral-200`
    *   `--border`: `neutral-800`
    *   `--grid-color`: `rgba(0, 133, 202, 0.5)` (Process Blue)

### Typography
*   **Headers (The Label):** `Inter` (Sans-serif). Bold, tracking-tight. Used for section headers and titles.
*   **Body/UI (The Data):** `JetBrains Mono`. The default font. Used for all body text, code, metrics, and UI elements.
    *   *Rule:* If it's a number or a metric, it **MUST** be Mono.

### Prose / Long-form Content
We enforce the "Datasheet" aesthetic even in narrative content (Markdown).

*   **Body Text:** `JetBrains Mono` (`font-mono`). All narrative text is treated as data.
*   **Headers (H2):**
    *   **Style:** "Active System" aesthetic.
    *   **Visual:** `text-3xl` (Mobile) / `text-4xl` (Desktop), Primary Green (`var(--primary)`).
    *   **Effect:** Includes a pulsing LED indicator (`::after` pseudo-element) to signify operational status.
*   **Headers (General):** `Inter` (`font-sans`). Bold, tracking-tight. Provides visual hierarchy.
*   **Blockquotes (The Note):**
    *   **Style:** Brutalist. No border-radius.
    *   **Visual:** Left border 2px (`border-primary-500`), subtle background (`bg-primary/5`).
    *   **Usage:** Technical context, warnings, or "The Challenge" summaries.

### Spacing & Layout
*   **The Grid:** All layouts align to a 4px baseline grid.
*   **Containers:** `.site-container` (max-w-5xl).
*   **The Seam:** 1px borders (`border-neutral-800`) define all component boundaries. No soft shadows; only hard lines.

---

## 3. Component Library ("The Kit")

### The Kit (Implementation)
These components are available for use in MDX content:
*   **Admonition:** `<Admonition variant="info|tip|caution|danger">...</Admonition>`
*   **Chip:** `<Chip variant="production|prototype|concept" text="..." />`
*   **Wire:** `<Wire />` (The standard divider)

### The Brick (Containers)
*   **Usage:** Cards, Modals, Sections.
*   **Style:** `bg-neutral-950`, `border border-neutral-800`.
*   **Interaction:** Hover states use `bg-neutral-900` or `border-primary/50`.

### The Chip (Status)
*   **Usage:** Production Status, Tech Stack Tags.
*   **Style:** `rounded-full`, `px-2 py-0.5`, `text-xs font-mono`.
*   **Variants:**
    *   *Mass Production:* `bg-green-500/10 text-green-500 border-green-500/20`
    *   *Prototyping:* `bg-amber-500/10 text-amber-500 border-amber-500/20`
    *   *Concept:* `bg-neutral-800 text-neutral-400 border-neutral-700`

### The Wire (Dividers)
*   **Usage:** Separating content sections.
*   **Style:** `border-b border-neutral-800`.

### The Spotlight (Interaction)
*   **Usage:** Project Directory rows.
*   **Effect:** Radial gradient tracking mouse position.
*   **Implementation:** CSS Variables `--x`, `--y` updated via JS.

---

## 4. Voice & Tone
**"The Engineer"**
*   **Active Voice:** "Built X," not "X was built."
*   **Precision:** "Reduced latency by 40ms," not "Made it faster."
*   **No Fluff:** Avoid marketing speak. State the facts.

---

---

## 6. Effects

### Scramble Text (The Glitch)
*   **Usage:** High-impact headers and interactive elements.
*   **Component:** `<ScrambleText text="ERIK NORRIS" />`
*   **Behavior:** Glitches on hover and randomly on idle.

---

## 5. Future Enhancements (Roadmap)
*   **Visible Grid:** Implement a global background grid pattern using CSS `background-image` with `--grid-color`.
*   **Build Stats:** Expose `ingest_data.py` runtime metrics in the footer (e.g., "Built in 0.4s").
*   **Raw Mode:** A toggle to view the raw JSON/Markdown source of any page.

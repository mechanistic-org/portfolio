---
title: "Navigation Options"
description: "Design options for the site navigation revamp."
---
# Navigation Revamp: Design Options

**Objective:** Replace the "heavy green box" dropdowns with a design that fits the **Hyper-Functional Brutalist** aesthetic.
**Current State:** `border-primary-600` (Solid Green Border) + `bg-base-900`.

## Option 1: The "Terminal" (Raw & Direct)
*   **Concept:** A command-line interface. Pure data, no decoration.
*   **Typography:** 100% `JetBrains Mono`.
*   **Dropdown Style:**
    *   **Border:** None or 1px `neutral-800` (Subtle Grey).
    *   **Background:** `neutral-950` (Void Black).
    *   **Hover:** Inverted colors (White text on Black block) or a blinking cursor prefix (`> Work`).
*   **Transition:** Instant (0ms). No sliding animations.
*   **Vibe:** "I am interacting with a shell."

## Option 2: The "HUD" (Technical & Glass)
*   **Concept:** A fighter jet Heads-Up Display. Precision instrumentation.
*   **Typography:** `Inter` (Headers) + `JetBrains Mono` (Metadata).
*   **Dropdown Style:**
    *   **Border:** 1px `neutral-800` with **Corner Ticks** (SVG borders).
    *   **Background:** `bg-neutral-950/90` + `backdrop-blur-md` (Frosted Glass).
    *   **Accent:** Thin "Laser Line" (`primary-500`) only on the top edge or active item.
*   **Interaction:** ScrambleText effect on hover.
*   **Vibe:** "Tactical Data Link."

## Option 3: The "File System" (Structural)
*   **Concept:** A directory tree.
*   **Typography:** `JetBrains Mono`.
*   **Dropdown Style:**
    *   **Layout:** Not a floating box, but an **Inline Expansion** (Accordion style) or a tree structure with vertical guide lines.
    *   **Visuals:** Tree connectors (`├─`, `└─`).
*   **Vibe:** "Navigating the repo."

## Recommendation: "The HUD" (Refined)
This strikes the best balance between the "Datasheet" aesthetic and usability.
*   **Remove:** The heavy 4-sided green border.
*   **Add:** A 1px `neutral-800` border.
*   **Keep:** The `primary-500` color only as a **1px Top Border** (The "Signal" line) or a small "Status LED" dot next to the active item.
*   **Effect:** Add a subtle `backdrop-blur` to integrate with the "Visible Grid" background.

## Proposed CSS Change (Prototype)

```css
/* Old */
.dropdown-content {
  @apply border border-primary-600 bg-base-900;
}

/* New (The HUD) */
.dropdown-content {
  @apply border border-neutral-800 bg-neutral-950/95 backdrop-blur-sm;
  /* Top "Signal" Line */
  border-top: 1px solid theme('colors.primary.500');
}

/* Item Hover */
.nav-link:hover {
  @apply bg-primary-500/10 text-primary-500;
}
```

---
title: "Interaction Strategy: The Living Machine"
slug: "interaction_strategy"
---
# Interaction Strategy: The Living Machine

**Objective:** The site should not feel like a "web page" but like a "physical interface." It requires weight, resistance, and tactile feedback.

## 1. The Physics
*   **Scroll:**
    *   **Snap Points:** Use `scroll-snap-type: y mandatory` for "Step-based" sections (like the Dreamjob Process Sequence).
    *   **Resistance:** Use `scroll-behavior: smooth` globally, but investigate custom accessible scrolling (like Lenis) *only if* native CSS isn't "heavy" enough.
    *   **Parallax:** Use `CSS scroll-driven animations` (`animation-timeline: scroll()`) to drive the Rotation of the background Grid or Gear elements. Zero JS required.

## 2. The Visual Haptics
*   **Fiber Optic Grid:**
    *   **Concept:** A 3D perspective grid that "flows" towards the user.
    *   **Tech:** CSS `perspective`, `transform: rotateX(60deg)`, and `background-image` linear gradients.
    *   **Animation:** Translate the background position on scroll to create infinite forward motion.
*   **Hover States:**
    *   **Tiles:** Use `transform: scale(0.98)` (Depress) on click/active to simulate physical buttons.
    *   **Spotlight:** Continue using the radial gradient spotlight, but increase intensity on interaction.

## 3. The Dreamjob Taxonomy (Interaction Expansion)
*   **The Zigzag:** An alternating Grid Layout (Text | Image -> Image | Text). Break the visual monotony.
*   **The Process:** A horizontal scrolling strip (`overflow-x: auto` + `scroll-snap-type: x mandatory`) representing a timeline or assembly line.
*   **The Calibration Cube:** A secondary `ModelViewer` instance specifically for a generic technical object (XYZ Calibration Cube) to demonstrate the viewer's fidelity without the distraction of a complex engine.

## 4. Gap Tightening Protocol
*   **Variable:** `--grid-gap`
*   **Goal:** Shift from `3rem` (48px / gap-12) to `2rem` (32px / gap-8).
*   **Risk:** Comparison of `portion-cup` and `base` projects, which have high information density.
*   **Mitigation:** Verified Layout testing on Mobile before commit.

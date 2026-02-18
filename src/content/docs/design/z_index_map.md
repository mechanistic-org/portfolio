---
title: "UI Architecture & Air Traffic Control"
description: "Z-Index Map and Flight Levels for UI layering."
slug: "z_index_map"
---

## 6. UI Architecture & "Air Traffic Control" (Z-Index Map)

To prevent "Stacking Wars", we vertically partition the Z-space into strict flight levels.

### The Flight Levels

| Layer             | Z-Index     | Usage                                                               |
| :---------------- | :---------- | :------------------------------------------------------------------ |
| **GOD TIER**      | `9999`      | Critical Debug Overlays, Critical Error Modals, Mouse Cursors       |
| **ORBIT**         | `1000+`     | Full Screen Menus (Command Palette `z-[1001]`), Modals              |
| **STRATOSPHERE**  | `500-999`   | Tooltips, Popovers, Dropdowns                                       |
| **HIGH ALTITUDE** | `100`       | Sticky Headers, Top HUDs, Navigation Bars                           |
| **INTERCEPT**     | `90`        | Metrics Drawer (Deep Dive HUD)                                      |
| **CRUISING**      | `50`        | Floating Action Buttons (FABs), Toast Notifications                 |
| **LOW ALTITUDE**  | `10-40`     | Sticky Section Headers (`z-10`), Interactive Sticky Stages (`z-40`) |
| **GROUND**        | `1`         | Standard interactive elements                                       |
| **SUBTERRANEAN**  | `0` or `-1` | Backgrounds, Noise Layers, Canvas (Three.js)                        |

### Implementation Rules

- **Never** use arbitrary numbers (e.g., `z-53`). Stick to the tiers.
- **Top HUD (`ProjectInfoTable`)**: Assigned to `z-[9999]` temporarily to override Global Nav issues, but ideally belongs in **HIGH ALTITUDE** (`z-100`) once the Nav is properly layered.
- **Navbar**: Standard `z-50`.
- **Three.js / Canvas**: Typically `z-0` or `z-[-1]`.

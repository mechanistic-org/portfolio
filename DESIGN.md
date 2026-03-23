# Dark Hangar Design System (Portfolio)
**Status:** Canonical

## Typography Constraints
- **Primary:** `Inter`, sans-serif. Used for all body copy and primary headings.
- **Monospace:** `Fira Code` or `Roboto Mono`. Strictly used for telemetry blocks, data readouts, and `__forensicsSummary` tables.

## Color Tokens (The Glassmorphism Palette)
- **Background:** `#000000` (Pure Black).
- **Surface Panels:** `rgba(255, 255, 255, 0.05)` with `backdrop-filter: blur(12px)`.
- **Primary Accent:** `#E5E5E5` (Off-White) for high-emphasis text.
- **Secondary Accent:** `#888888` (Mid-Grey) for labels and low-emphasis data.
- **Status Indicators:**
  - Success/Nominal: `#00FF00` (Terminal Green)
  - Warning/Degraded: `#FFB000` (Amber)
  - Critical/Fatal: `#FF0000` (Pure Red)

## Layout Geometry
All Spoke components must adhere to the modular "Dashboard Fragment" logic. No elements should span 100vw unless defined as a Root Navigation Shell. Use CSS Grid for strict fractional alignments.

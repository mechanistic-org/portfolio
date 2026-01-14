---
# This rule should be ALWAYS ON.
---

# Coding Standards & Design System

## Core Philosophy (`STYLE_GUIDE`)

1.  **Zero-Runtime Visualization:** Prefer SVGs or D3.js over heavy charting libraries.
2.  **Physical Asset Law:** Assets are files.
3.  **Honest Construction:** Keep debug modes and "Construction Badges" visible if unstable.

## Implementation Details

- **Visualizations:** Use **D3.js** for custom, lightweight, non-React-cycle-dependent charts. Avoid generic libraries like `recharts` unless legacy.
- **Data Binding:**
  - Use **Snake Case** for frontmatter keys (`phase_stats`, not `phaseStats`) to prevent caching bugs.
  - Use the **JSON-in-Frontmatter Pattern** for complex objects.
- **Port Hygiene:** If code behaves oddly, check for Zombie Processes on ports 4321/4322.

## Prohibitions

- **NO** new React charting libraries.
- **NO** copying assets to `src/`.
- **NO** "Magic Numbers". Use the `STYLE_GUIDE` token map.

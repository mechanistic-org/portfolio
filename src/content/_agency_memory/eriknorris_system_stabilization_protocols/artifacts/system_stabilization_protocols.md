# System Stabilization & Repository Hygiene Protocols

This document codifies the "De-templating Decree" (Law LXXVI), the "Bisection Protocol," and "Silent Corruption" detection patterns used to maintain 100% build stability across the high-density EN-OS ecosystem.

## 1. The De-templating Decree (Law LXXVI)

Surgical repository hygiene is not aesthetic; it is a fundamental engineering optimization. De-templating involves removing all unused routes, components, and assets provided by the base theme.

### The Four Yields of De-templating

1.  **Build Velocity (Speed Yield)**: Slashing static generation time by eliminating unrendered routes.
2.  **Cognitive Load (Focus Yield)**: Reducing signal-to-noise ratio in the codebase by eliminating false-positive search results in unused components.
3.  **Brand Armor (Integrity Yield)**: Hardening the site's surface area by ensuring search crawlers never index stock placeholders.
4.  **Asset Weight (Payload Yield)**: Purging megabytes of unused stock photography.

---

## 2. De-templating & Architecture Pivot Checklist

A systematic guide for stripping boilerplate and pivoting repositories to minimal states while maintaining build integrity.

### 2.1 Pre-Pivot Audit

- [ ] Identify "Radioactive" routes (High-density complex routes that crash Vite).
- [ ] Perform `npx astro check` to map every broken import.
- [ ] Locate structural dependencies (Keystatic schemas, shared UI components).

### 2.2 The Atomic Backup

- [ ] Zip core forensic logic: `Compress-Archive -Path "src/components/core", "src/dfmea_core", "src/pages/tool" -DestinationPath "pivot_restore.zip"`
- [ ] Zip core data: `Compress-Archive -Path "src/content", "public/assets" -DestinationPath "data_restore.zip"`

### 2.3 Brand & UI Restoration

- [ ] **Primary Anchor**: Restore the logo and update Header/Logo height for visual parity.
- [ ] **Typography Mandate (Law LXXVII)**: Upscale font utility classes to support ultra-wide monitors.

---

## 3. The Bisection Protocol (Incremental Isolation)

When a collection-wide build failure (e.g., `glob.js` crash) occurs, use bisection to isolate the "Contagion."

1. **The Ghost Stage**: Build with valid frontmatter but **zero body content**.
2. **The Minimal Stage**: Restore a single `# Minimal` heading. If this fails, the frontmatter/schema is the perpetrator.
3. **The Key Bisection**: Strip complex metadata keys (`war_stories`, `metrics`) and restore them one by one to identify "YAML Traps."
4. **The Narrative Bisection**: Restore MDX body sections incrementally.

---

## 4. Silent Corruption & Style Evasion

A project may render as "Raw HTML" (no CSS) despite a successful build.

- **Detection**: Identify the specific route where styling fails.
- **Drivers**: Namespace collisions (slug colliding with `base`), unquoted brackets `[]` in YAML, hydration crashes (hook violations), or invisible character corruption (null bytes).

### 4.1 The Reversion & Purge Mandate

- **Clean Slate Decree (Law XLIX)**: Perform a full **Clean Overwrite** of the file.
- **Cold Start (Law LI)**: Mandatory **Cache Purge** (`rm -rf .astro`) and server restart.

---

## 5. The Minimal Template Pivot (Ultimate Stabilization)

For projects where "Surgical De-templating" fails due to deep-seated boilerplate corruption (e.g., orphaned Keystatic schemas, persistent Vite resolution failures).

- **Objective**: Transfer the high-signal "Forensic Logic" into a clean, minimal environment.
- **Protocol**: If de-templating failure persists after cache clear, pivot to a primitive/minimal scaffold (e.g., `cosmic-themes-starter-minimal`).
- **Data Salvage**: Extract forensic artifacts from the "Radioactive" repository and re-inject them. This eliminates legacy debt and restores 100% "Build Purity."

---

## 6. JSX & Component Stability (The Icon Collision)

High-density UI systems are susceptible to **Global Namespace Collisions** during rapid component refactoring.

- **The Failure (Case Study)**: Attempting to use a `<Lock>` icon in a React component without an explicit import.
- **The Symptom**: A "Blank Screen" crash where the browser/DOM environment defaults to the native `Lock` interface (an object, not a renderable React function).
- **The Resolution**:
  1. **Strict Import Policing**: Never rely on auto-imports for low-level UI elements.
  2. **Explicit Dependency**: `import { Lock } from "lucide-react";` within the component file.
  3. **Verification**: Immediate import audit if a previously working page disappears after adding an icon.

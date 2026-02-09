---
title: "The Engine Room: Architecture & Maintenance"
slug: the_engine_room
sidebar:
  group: Handbook
  order: 3
description: "Documentation for The Engine Room: Architecture & Maintenance."
---

# The Engine Room: Architecture & Maintenance

> **Role:** The Engineer / The Mechanic
> **Objective:** Keep the machine running, fix bugs, and deploy updates.

## 1. System Architecture

The EN-OS uses a **Pure Hyperspace** architecture (Dynamic Astro Collections) to maintain "Zero-Bloat" speed.

### Core Protocols (The Law)

_Synthesized from Agency Memory_

1.  **The Event Horizon Law:** `multiverse.json` and `skills.json` are DEAD. The "Keystatic -> Astro Collections -> Dynamic Prop Injection" pipeline is the ONLY source of truth.
2.  **The Sovereign Color Law:** `src/config/color_registry.ts` is the ONLY Source of Truth for Entity Coloring. `Colors.csv` retrieval is FORBIDDEN.
3.  **The Module Naming Law:** Do not use `.json.ts` for standard TypeScript modules/arrays. Rename to `.ts` to prevent TS Server resolution confusion.
4.  **The Resilience Law (Safe-by-Default D3):** Visualization components must implement defensive `get(key) || default_color` logic to prevent crashing the entire graph on a single missing key.
5.  **The Air Gap Law:** `eriknorris-assets\R2_STAGING` is the ONLY Production Vault. `portfolio_working` is the ONLY Staging Input. `eriknorris-workspace\R2_MASTER` is DEAD (Legacy).

### The Stack

- **Framework:** Astro 5.0 (Static Output).
- **CMS:** Keystatic (Local Markdown Management).
- **Data Layer:** Astro Content Collections (`src/content/project`).
- **Styling:** TailwindCSS v4 + Custom Brutalist Tokens.
- **Interactivity:** React (Complex UI) + Vanilla JS (Scroll Physics).
- **Hosting:** Cloudflare Pages.

### Zero-Bloat Principle

To respect the 25MB script limit:

1.  **Static HTML:** We pre-render everything possible.
2.  **Asset Proxy:** Cloudflare Worker (`functions/[[path]].js`) serves heavy assets from R2.
3.  **Lite Components:** We disable deep nesting in high-frequency components (e.g., `ProjectManifestHUD`) to prevent Compiler Crashes.

### The Assembly Engine (`/assembly`)

The **Exploded View** is the primary navigation interface, visualizing the career as a physics-driven machine.

- **Logic:** `src/utils/mapCareerAssembly.ts`
- **Bodies (Nodes):** Projects from Keystatic (`Content Collection`).
- **Fasteners (Links):** Skills extracted from Project Metadata.
- **Mind (Payload):** Raw Intelligence Boluses (`_intelligence.md`).

---

## 1.5 The Agentic Layer (The Brain)

The IDE is now augmented with a persistent brain located in `.agent/`. This moves the workflow from "Manual Prompts" to "Autonomous Reflexes."

- **Skills (`.agent/skills`):** Learned capabilities (Mining, Troubleshooting, Onboarding).
- **Rules (`.agent/rules`):** Inviolable constraints (Asset Sovereignty, Coding Standards).
- **Workflows (`.agent/workflows`):** Deterministic scripts for Scaffolding and Deployment.

---

## 1.6 The Stealth Protocol (Prompt Architecture)

**The Problem:** The NotebookLM Audio Model reads "System Instructions" as content.
**The Fix:** "Decoupled Intelligence" (The Two-Stage Rocket).

1.  **Stage 1 (Text):** The Analyst Prompt (`REFINE_READY`). Stripped of "System" headers. Generates the structured data (Bolus).
2.  **The Bridge:** Convert Analyst Output -> **Source**.
3.  **Stage 2 (Audio):** The Host Prompt (`PODCAST_READY`). Contains the `AUDIO_PROTOCOL` (Phonetics). Reads the Source as "Fact."

**Result:** High-Fidelity Audio without "Protocol Leakage."

---

## 2. The Theme Engine

The site supports multiple "Realms" (Themes) controlled by Frontmatter.

| Theme          | Tier   | Use Case                                      |
| :------------- | :----- | :-------------------------------------------- |
| **Hyperspace** | Tier 1 | Immersive Scrollytelling. 3D swarms, physics. |
| **Command**    | Tier 2 | High-density control panel. Dark mode only.   |
| **DataSheet**  | Tier 3 | Clean, print-friendly default.                |

**Configuration:**
Set `theme: "hyperspace"` in the project frontmatter.

---

## 3. Deployment Protocol (CI/CD)

**Trigger:** `git push` to `main`.
**Platform:** Cloudflare Pages.

### The Build Chain

1.  **Validation:** `scripts/ci-prebuild.js` checks for critical files.
2.  **Build:** `npm run build` (Astro static generation using `getMultiverseData`).
3.  **Deploy:** Cloudflare pushes the `./dist` folder to the edge.

### Asset Air-Gap (Crucial)

- **Local:** `public/assets/r2` is a **Symlink** to `../ErikNorris-assets/R2_STAGING`.
- **Production:** The built site replaces local paths with `https://assets.eriknorris.com/`.
- **Rule:** NEVER commit heavy assets to `d:\GitHub\ErikNorris`.

---

### 7. Deployment Protocol (The 9k Limit)

The system uses a **Split-Output** strategy to survive.

- **Development:** `output: "server"` (Enables Keystatic CMS).
- **Production:** `output: "static"` (Enables Cloudflare Building).

**The Pure Static Law:**

> **WARNING:** You MUST NOT enable `output: "server"` in Production.
> Cloudflare Pages cannot handle the 9,000+ module chunks generated by the SSR bundle.
> We force `process.env.CF_PAGES ? "static" : "server"` in `astro.config.mjs`. **DO NOT REMOVE.**

## 8. Troubleshooting (The "Fix It" Guide)

### WASM Compiler Crash (The 9000-Module Limit)

**Symptom:** `npm run build` fails with `[UnknownCompilerError] ... undefined (reading 'exports')`.
**Cause:** The Astro Compiler (WASM) runs out of stack memory when processing deeply nested JSX (e.g., complex Metrics Grids) in a project with very high module counts (9000+).
**Fix:**

1.  **Identify the Culprit:** Usually a component with complex conditional rendering (e.g., `ProjectManifestHUD`).
2.  **Simplify:** Comment out deep nesting or split into smaller sub-components.
3.  **Lite Mode:** Use a "Lite" version of the component for Production if refactoring is too costly.

### "Zombie" Dev Servers

**Symptom:** Port 4321 is locked, or you see old code.
**Fix:**

```powershell
taskkill /F /IM node.exe
```

### Ghost Data

**Symptom:** HUD shows "$0k Budget" despite correct MDX.
**Cause:** Stale data in `src/config/project_manifest.json`.
**Fix:** Delete the entry in `project_manifest.json` and restart dev server.

### 404 on Assets

**Symptom:** Images missing in Production.
**Cause:** "Physical Asset Law" violation. You referenced a local path (`/assets/`) that only exists on your laptop.
**Fix:** Ensure the Ingestion Script ran and verified the asset exists in the `R2_STAGING` bucket.

### Build Crash (Heap OOM)

**Symptom:** Node process runs out of memory.
**Fix:**

```powershell
export NODE_OPTIONS="--max-old-space-size=4096"
```

## 5. The Deep HUD Injection (V7 Telemetry)

The **Deep HUD** is a metadata layer injected into every project to surface "Engineering Fidelity."

- **Mechanism:** `ProjectManifestHUD.astro`
- **Data Source:** Project Frontmatter (`metrics` object).
- **Purpose:** To turn vague "stories" into quantifiable engineering case studies.
- **Constraints:** Must be kept simple (Lite Mode) to avoid WASM crashes.

**Metrics:**

- **Financial:** Tooling Budgets, COGS, Margins.
- **Process:** ECO Counts, DCDs (Design Control Docs), War Stories.
- **Physical:** Material Composition (Plastic/Metal/PCB ratio).

---

## 6. The Dreamjob Principle (Future State)

The timeline includes a **"Dreamjob" Node (2025-2040)**.

- **Concept:** A projected career arc reflecting the _next_ 15 years.
- **Role:** "Director of Hardware / Principal Architect".
- **Function:** Acts as a "North Star" for the portfolio's tone. The entire portfolio is built to apply for _this specific hypothetical role_.
- **Implementation:** A standard `projet` entry with `date: 2025-11-23` (Future) and high-fidelity "aspirational" metadata.

---

## 5. Maintenance Scripts

Located in `scripts/`:

- `scaffold_projects.py`: The Main Engine. Merges Multiverse + MDX.
- `sync_r2.py`: Uploads `R2_STAGING` to Cloudflare.
- `process_images.py`: The Darkroom. Optimizes images.
- `doctor.py` (Planned): Automated diagnostics.

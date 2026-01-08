---
title: "The Engine Room: Architecture & Maintenance"
slug: "the_engine_room"
sidebar:
  group: "Handbook"
  order: 3
---

# The Engine Room: Architecture & Maintenance

> **Role:** The Engineer / The Mechanic
> **Objective:** Keep the machine running, fix bugs, and deploy updates.

## 1. System Architecture

The EN-OS uses a **Hybrid Static** architecture to maintain "Zero-Bloat" speed.

### The Stack

- **Framework:** Astro 5.0 (Static Output).
- **CMS:** Keystatic (Local Markdown Management).
- **Styling:** TailwindCSS v4 + Custom Brutalist Tokens.
- **Interactivity:** React (Complex UI) + Vanilla JS (Scroll Physics).
- **Hosting:** Cloudflare Pages.

### Zero-Bloat Principle

To respect the 25MB script limit:

1.  **Static HTML:** We pre-render everything possible.
2.  **Asset Proxy:** We use a Cloudflare Worker (`functions/[[path]].js`) to serve heavy assets from R2, bypassing the git repo size limits.
3.  **Lazy Hydration:** React components use `client:visible` only when necessary.

### The Assembly Engine (`/assembly`)

The **Exploded View** is the primary navigation interface, visualizing the career as a physics-driven machine.

- **Logic:** `src/utils/mapCareerAssembly.ts`
- **Bodies (Nodes):** Projects from Keystatic (`Content Collection`).
- **Fasteners (Links):** Skills extracted from Project Metadata.
- **Mind (Payload):** Raw Intelligence Boluses (`_intelligence.md`).

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

1.  **Ingest:** `python scripts/scaffold_projects.py` (Runs locally before commit, or in CI if configured).
2.  **Build:** `npm run build` (Astro static generation).
3.  **Deploy:** Cloudflare pushes the `./dist` folder to the edge.

### Asset Air-Gap (Crucial)

- **Local:** `public/assets/r2` is a **Symlink** to `../ErikNorris-assets/R2_STAGING`.
- **Production:** The built site replaces local paths with `https://assets.eriknorris.com/`.
- **Rule:** NEVER commit heavy assets to `d:\GitHub\ErikNorris`.

---

## 4. Troubleshooting (The "Fix It" Guide)

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
**Cause:** "Physical Asset Law" violation. You referenced a local path (`/assets/r2/`) that only exists on your laptop.
**Fix:** Ensure the Ingestion Script ran and verified the asset exists in the `R2_STAGING` bucket.

### Build Crash (Heap OOM)

**Symptom:** Node process runs out of memory.
**Fix:**

```powershell
export NODE_OPTIONS="--max-old-space-size=4096"
```

---

## 5. Maintenance Scripts

Located in `scripts/`:

- `scaffold_projects.py`: The Main Engine. Merges Multiverse + MDX.
- `sync_r2.py`: Uploads `R2_STAGING` to Cloudflare.
- `process_images.py`: The Darkroom. Optimizes images.
- `doctor.py` (Planned): Automated diagnostics.

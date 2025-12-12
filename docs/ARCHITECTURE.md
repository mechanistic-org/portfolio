# 🏗️ QUANTUM ARCHITECTURE (READ ME FIRST)

> [!CAUTION]
> **CRITICAL DEPLOYMENT CONSTRAINTS**
> Do not modify the build or deployment strategy without reading this document.
> We lost 16+ hours of dev time fighting these constraints. Do not repeat history.

## 1. The "Zero-Bloat" Principle
This project runs on **Cloudflare Pages** (Free Tier).
- **Constraint:** The Worker bundle must stay under **1MB** and **100 modules**.
- **Rule:** **NEVER** use Astro's `hybrid` or `server` output mode. It bundles the entire site graph into the Worker, causing immediate deployment failure ("Too many modules").
- **Solution:** We use **Pure Static Output** (`output: 'static'`).

## 2. The Pages Functions Strategy
We use **Cloudflare Pages Functions** for dynamic functionality.
- **File:** `functions/[[path]].js`
- **Role:** This is a "Catch-All" middleware.
- **Function:** It *only* handles the R2 Asset Proxy (and health checks).
- **Why:** We switched from `_worker.js` because Cloudflare Pages sometimes ignores the manual worker file. `functions/` is guaranteed to run.

## 3. Asset Management (R2)
Assets are **NOT** stored in this Git repository.
- **Storage:** Cloudflare R2 Bucket (`projects`).
- **Access:** Via the proxy at `/r2/*`.
- **Local Dev:** Mapped via `vr-link` or similar tools, but in production, they *must* come from R2.
- **Rule:** If an image 404s, **DO NOT** try to "fix" it by adding it to Git. Check the R2 bucket and the proxy script.

## 4. Deployment Pipeline
1. **Astro Build:** Generates static HTML/CSS/JS in `dist/`.
2. **Worker Upload:** Cloudflare uploads `public/_worker.js` as the `_worker.js` in the output directory.
3. **Routing:**
   - `/assets/r2/*` -> Hit Worker -> R2.
   - `/*` -> Hit Cloudflare CDN (Static Assets).

---
*Last Updated: 2025-12-12 (After the "16 Failures" Incident)*

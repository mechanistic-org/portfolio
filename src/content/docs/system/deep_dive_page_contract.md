---
title: "Perfect Deep Dive Page Contract"
description: "Exit criteria and validation procedure for deep-dive project pages. C24 is the golden specimen; the audited ready-state cohort is 22 pages."
slug: "deep-dive-page-contract"
---

# Perfect Deep Dive Page Contract (v1)

**Status:** Active — drafted 2026-06-11 per the 2026-05-09 deep-dive handoff, before any C24 code edits.
**Golden specimen:** `c24`. **Validation specimens:** `sc48`, `webtv-cortez`. **Premium-blocked:** `avegant-glyph` (needs archive→R2_MASTER curation first).
**Governing issues:** #68 (C24 normalization), #72 (Epic W4), #67 (asset routing, parallel/subordinate).

A deep-dive page is **Perfect** when page story, schema data, assets, provenance, local dev behavior, mobile behavior, HUD behavior, source trail, and agentic consumption all agree. "Ready state" (structurally hydrated, body text dumped at the end) is explicitly NOT done.

---

## The Four Gates

Every page passes the gates in order. A gate failure stops promotion; do not patch downstream symptoms.

1. **Source truth** — evidence exists in the asset pipeline and NLM registry, not just in prose.
2. **Schema hydration** — structured frontmatter carries the data; hydration runs through `hydrate_content.py`, never manual MDX-only edits that the hydrator would overwrite.
3. **Detail-page composition** — one authored narrative, components activated, no empty states.
4. **Visual / congruence verification** — rendered page agrees with schema and source on desktop and mobile.

---

## Exit Criteria

### A. Identity & machine readability
- [ ] `title` is the real product name (not a bare codename slug).
- [ ] `description` present, 140–300 chars, states role + product + quantified outcome.
- [ ] Frontmatter validates against the projects schema; no banned fields (`forensic_data` is `z.never()`).
- [ ] `employer`, `category`, `industry`, `tools`, `date`, `endDate`, `production`, `productionScale` populated.
- [ ] `draft: false` and the page is intentionally listed (or intentionally unlisted, recorded here).

### B. Story
- [ ] Exactly one authored narrative body. No duplicate or machine-stitched report blocks, no dumped text after the structured content.
- [ ] Each crisis is told as **Trigger → Intervention → Result** with quantified impact.
- [ ] No unresolved citation artifacts (e.g. `[64-66]`) in visitor-facing prose; provenance moves to the source trail (§D).
- [ ] Numbers section exists and is deduplicated (one canonical figure per claim).

### C. Structured data
- [ ] `cast` populated and rendering (DossierCast).
- [ ] `forensic_summary` (trigger/intervention/result) populated.
- [ ] `forensic_metrics` and/or `metrics` populated from source truth as available; `timeline`, `bom`, `scars` wired as W1 data lands (absence is acceptable, empty-but-promised is not).
- [ ] `cyberspace.stickies` populated; every sticky has `id` + `title` (HUD labels resolve via `label → title → id`).
- [ ] Deep Data HUD opens on the first tab that has data; tabs without data do not render.

### D. Assets, provenance & source trail
- [ ] Every referenced asset (hero, gallery, audio, 3D) returns 200 locally (served from `R2_STAGING` via `/assets/...`) and in production (R2).
- [ ] Assets entered the page only via the pipeline: raw archive → `R2_MASTER` (curation) → `R2_STAGING` (processed) → R2. Never point page content at `D:\portfolio` or `\\morespace` directly.
- [ ] Asset paths use `/assets/r2/{slug}/...` or `/assets/{slug}/...` (both tolerated until #67 canonicalizes; new hydration emits `/assets/r2/`).
- [ ] A visible **source trail** exists on the page: the evidence artifacts (ECOs, DCDs, inspection reports, photos) are named so a reader can see what the claims rest on.
- [ ] `audio_url` / `notebook_url` / `nlm_url` set when the artifact exists.

### E. Behavior
- [ ] Fixed HUD is legible over long-form content (glass background once scrolled past the intro; never transparent over body text).
- [ ] Scrolly dot nav has real accessible labels (no "Scroll to undefined").
- [ ] No inert controls on any viewport — mobile menu either works or is not rendered.
- [ ] No debug logging (`console.log`) in production components.
- [ ] No hard runtime errors in the browser console on load or scroll-through.

### F. Agentic consumption
- [ ] Core narrative renders server-side (visible to crawlers/LLMs without JS).
- [ ] `title` + `description` land in the page `<head>`.
- [ ] Structured frontmatter is the machine-readable source for the headless surface (Epic #31).

---

## Validation Procedure

1. `npm run build` passes; page present in `dist`.
2. Desktop screenshot: intro, mid-scroll (HUD over text), dossier open.
3. Mobile screenshot: hero, nav surface (no dead buttons).
4. Console check: zero errors, zero debug logs.
5. Criteria boxes above all check; record the pass in the page's PR.

---

## Ready-State Cohort (audited 2026-06-11: 22 pages)

`320-slot-optical-carousel`, `avegant-glyph`, `backsplash`, `bazooka`, `c24`, `cinema-one`, `d-command`, `d-control`, `dispensers`, `dv700`, `extension-switches`, `kplayer-6000`, `kserver-1500`, `kserver-5000`, `ksystem-120`, `m700`, `makeline`, `motorola-mp3`, `portion-cup`, `sc48`, `webtv-cortez`, `webtv-galaxy`

All 22 slugs verified to exist as project directories. Scale-out order after C24: validation specimens first (`sc48`, `webtv-cortez`), then the cohort by asset readiness; `avegant-glyph` only after its curation pass.

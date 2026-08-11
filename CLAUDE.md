# Portfolio — eriknorris.com

Headless agentic pipeline that compiles 30 years of engineering "Red Gold" (raw
PDFs, CAD, notebooks) into a static "living portfolio." Astro SSG,
TypeScript core, Python automation, deployed to Cloudflare Pages. Full prose in
[README.md](README.md); design system in [DESIGN.md](DESIGN.md).

This file is the front door. Read it (and the specific files a task names) instead
of grazing the tree — see **Context policy** below.

## ⚠️ Output is `static` everywhere — keep it that way

`astro.config.mjs` sets `output: "static"` unconditionally. Do **not** switch any
environment to `server`: that bundles the whole site into one `_worker.js`, hits
Cloudflare's 10,000-module limit, and crashes the build. Dev and prod run the same
static output.

> Content source of truth is `src/content.config.ts` (Astro collections + Zod over the
> MDX). Keystatic — the old dev-only CMS that was the sole reason dev ran in `server`
> mode — was fully removed (#104); content truth is migrating to the curated canon repo (see
> **Content model**).

**Security tripwire, not law (2026-08-06; expires at Astro >= 6):** the Dependabot
triage dismissed 26 alerts (8 astro XSS/SSRF advisories patched only in Astro 6/7,
the miniflare/undici dev-tooling nest, the adapter's /_image SSRF, esbuild's dev
server) on the rationale "affected code paths never execute in static output." That
rationale is conditional on this section staying true, not an argument against ever
changing it. If a future change enables SSR, server islands, or any request-time
rendering: re-evaluate the dismissed alerts first and take the Astro 6 + Cloudflare
adapter major as part of the same move, because on Astro 5 those paths go live
unpatched. Once the stack is on Astro >= 6, delete this note.

## Commands

| Task | Command |
|---|---|
| Dev server (static output, port 4321) | `npm run dev` |
| Project CI parity / pre-push validation | `npm run check:ci` (frontmatter audit → `astro check`) |
| Production build | `npm run build` (`ci-prebuild.js` → `check:ci` → tier gate → `astro build` → Pagefind) |
| Preview built site | `npm run preview` |
| Validate frontmatter | `npm run audit:frontmatter` |
| Tier publish gate | `npm run audit:tier` (`:verbose` per page · `:strict` fails on burn-down) |
| Visual smoke test | `npm run test:visual` |
| Lint / format | `eslint` (flat config) · Prettier (tabs; astro + tailwind plugins) |

## Content model

Collections defined in [src/content.config.ts](src/content.config.ts):

- **`projects`** — `.mdx` in `src/content/projects/`. Contract v2 schema
  (`PROJECT_SCHEMA_VERSION` in content.config.ts; frozen 2026-07-02, portfolio#120).
  Taxonomy enums live in `src/config/taxonomy`. The `theme` field routes rendering
  (e.g. `ProjectArticle`). **Generated pages are a read-only render target** — the canon
  generator (`scripts/project_pipeline.py --write-live`) is the only writer; the truth
  lives in `D:\GitHub\portfolio-canon\entities\projects\<slug>\<slug>.md`.
  `hydrate_content.py` was retired 2026-07-02 (it destructively rewrote frontmatter).
- **`docs`** — `src/content/docs/` (incl. `_inbox`, intelligence boluses).
- **`otherPages`** — `src/data/otherPages/`.

Other content dirs: `_raw_nlm` (NotebookLM raw; being absorbed into canon per-slug),
`_agency_memory`, `colophon`, `prompts`.

### Tier publish gate (`scripts/audits/validate_tier_gate.mjs`, in `npm run build`)

Roster is **42 deep dive / 54 lite / 25 cut** over 121 records. Because the
deep-dive conveyor runs for months with the site live, a visitor lands on a
*random* page — so the floor decides the outcome, not the ceiling. The gate holds
the floor by architecture rather than by remembering.

- **`draft: true` is exempt from completeness.** That is the whole point of the
  flag: the corpus can sit in any state while only the published subset meets bar.
- **ERROR (fails the build)** — correctness, not thinness: machine placeholders,
  leaked `:::` directive fences, demo assets posing as portfolio content
  (`NeilArmstrong.glb`), the rickroll, `teamSize: Unknown`, `duration: Active`,
  TBD/FIXME. All are currently at zero; this is a regression fence.
- **WARN (reported, not fatal)** — completeness against tier bar. Hard-failing
  this today would break the build on 72 of 87 published pages and amount to
  cutting the corpus to ~15, which the operator ruled against. Run
  `npm run audit:tier` for the burn-down; flip to `--strict` once it reaches zero.

**Bars.** *lite* — hero image, description, date, role-or-employer, ≥60 body words.
*deep_dive* — that plus ≥1200 body words and ≥6 image refs.

A lite page is a **complete small thing**, not a truncated large one. Scars, cast
and galleries are *allowed* on a lite page (operator ruling 2026-07-29 — "it
depends"). What is never allowed is an instrument declared and rendered empty:
thin does not discredit, filler and empty frames do.

ETL (canon-first, portfolio#121): `raw archives → canon vault (extraction + curation) →
project_pipeline.py → read-only site MDX → static HTML`. Confirm the correct venv before
running a Python script — bare `python` may resolve to the wrong environment.

## Asset sovereignty

Assets (images, 3D models) live in **Cloudflare R2** (`assets.eriknorris.com`) —
**never commit them to Git.** Curation happens in the local evidence store
(`D:\GitHub\portfolio-evidence\assets\<slug>\` — the human zone); the darkroom
derives the local machine-only bucket mirror at `D:/GitHub/portfolio-assets/R2_MIRROR`
(renamed from `R2_STAGING` 2026-07-02; no human edits, regenerable), which `sync_r2.py`
uploads. There is no symlink: dev serves assets via `src/pages/assets/[...path].ts`;
`public/assets/**` is watch-ignored.

## Deploy

Cloudflare Pages (edge), config in `wrangler.toml`. Production sets `CF_PAGES=1`.

## Context policy (why this file exists)

Scoped retrieval rule (supersedes a blanket "never scan directories"):

1. **Corpus / semantic recall** ("what do I know across the whole workspace?")
   → use the configured semantic-memory tool, not a filesystem sweep — grazing grabs
   stale/duplicate files and chokes on large dumps.
2. **In-repo work** → read this `CLAUDE.md` and the specific files the task names.
   Git-tracked + bounded = safe to trust.
3. **Always** → prefer git-tracked files; treat untracked / duplicate / giant files
   as *suspect, not gospel*; verify a file is current before asserting from it.

## Conventions

- Persona, working style, and session rituals (`/session_open`, `/session_close`)
  are configured globally by the operator's agent setup — not in this repo.
- Platform: Windows / PowerShell (`$null`, `$env:VAR`, backtick continuation).
- GitHub ops via the `gh` CLI.
- Single-operator project: absolute local paths in tooling are expected, not a smell.

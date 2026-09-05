# Portfolio — eriknorris.com

Headless agentic pipeline that compiles 30 years of engineering "Red Gold" (raw
PDFs, CAD, notebooks) into a static "living portfolio." Astro SSG,
TypeScript core, Python automation, deployed with Cloudflare Workers Static
Assets. Full prose in [README.md](README.md); design system in [DESIGN.md](DESIGN.md).

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
| Static site build | `npm run build` (public projection/history checks → project checks → publication integrity/readiness → Astro → Pagefind) |
| Production Worker candidate | `npm run build:worker` (runs the static build with the required `CF_PAGES=1` compatibility signal) |
| Worker candidate verification | `npm run check:worker` (generated-runtime assertions and both Wrangler dry-run configurations) |
| Authorized production release | `npm run deploy:production -- --message "<ticket> source <commit>"` (deploys the prepared build; does not rebuild) |
| Preview built site | `npm run preview` |
| Validate frontmatter | `npm run audit:frontmatter` |
| Publication integrity | `npm run audit:integrity` (invalid public state + local evidence identity/hash) |
| Deep-dive readiness | `npm run audit:readiness` (report-only governed maturity/applicability) |
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

### Publication integrity and readiness (`npm run build`)

`scripts/audits/validate_publication_integrity.mjs` is the build-blocking
correctness surface. It rejects unparseable project/canon content, leaked
placeholders or directives, demo assets posing as portfolio evidence, false
finished-project values, competency drift, and invalid local evidence IDs or
SHA-256 receipts. Evidence identity and hashes are integrity plumbing for every
tier; their presence or count is never a page-quality score.

`scripts/audits/report_deep_dive_readiness.mjs` reads the governed maturity and
applicability contract from `portfolio-canon/DEEP_DIVE_SOP.md` plus the generated
deep-dive dashboard. It reports archive/vault resolution, NotebookLM custody,
claim review, role/metrics, narrative, visuals/captions, projection, and operator
acceptance. `pending` and `not_applicable` are honest report states and never
fail publication. There are no word, image, scar, cast, gallery, or other
optional-instrument quotas.

`tier` is the sole `deep_dive|lite` classification field. `theme` chooses the
renderer. A lite page is a complete small thing, not a truncated large one; a
deep dive is relative to the explanatory potential of its own available record.

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

Production uses Workers Static Assets on Worker `eriknorris`, configured by
`wrangler.production.jsonc`. Astro output stays `static`; the generated Worker
handles the explicitly configured runtime routes and the `PROJECTS` R2 binding.
`CF_PAGES=1` is a retained build-compatibility signal, not the hosting provider.

Before preparing a production release, rolling back an application version, or
changing runtime/routing/bindings/hosting, read
[Deployment and rollback](README.md#deployment-and-rollback) for the selected
manual release contract and applicable verification tier.

Both Wrangler configs name the same Worker. `deploy:worker` is not isolated
staging. Production authorization applies to the reviewed source and prepared
build; the npm scripts themselves do not enforce an approval gate.

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

## Agent skills

### Issue tracker

Issues and specifications are tracked in GitHub Issues using the `gh` CLI. See
`docs/agents/issue-tracker.md`.

### Triage labels

The published engineering skills use their default five-label vocabulary. See
`docs/agents/triage-labels.md`.

### Domain docs

This is a single-context repository: domain language lives in root `CONTEXT.md`,
with consequential decisions under `docs/adr/`. See `docs/agents/domain.md`.

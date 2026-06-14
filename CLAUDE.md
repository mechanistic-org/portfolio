# Portfolio — eriknorris.com

Headless agentic pipeline that compiles 30 years of engineering "Red Gold" (raw
PDFs, CAD, notebooks) into a static "living portfolio." Astro SSG + Keystatic CMS,
TypeScript core, Python automation, deployed to Cloudflare Pages. Full prose in
[README.md](README.md); design system in [DESIGN.md](DESIGN.md).

This file is the front door. Read it (and the specific files a task names) instead
of grazing the tree — see **Context policy** below.

## ⚠️ Load-bearing footgun: dual-mode output

`astro.config.mjs` sets `output: isProduction ? "static" : "server"` keyed on
`CF_PAGES`. This is deliberate — do **not** "simplify" it:

- **Production (Cloudflare) MUST be `static`.** `server` bundles the whole site
  into one `_worker.js`, hits Cloudflare's 10,000-module limit, and crashes the build.
- **Local dev MUST be `server`.** Keystatic needs the `/api/keystatic` SSR routes.

> Keystatic is a **dev-only CMS over the MDX** — disabled in production (static), retirement
> is on the roadmap. Don't treat it as the source of truth or invest in extending it;
> content truth is migrating to the canon vault (see **Content model**).

## Commands

| Task | Command |
|---|---|
| Dev server (server mode, Keystatic at `/keystatic`, `/admin` redirects there) | `npm run dev` (port 4321) |
| Production build | `npm run build` (`ci-prebuild.js` → `astro build` → Pagefind index) |
| Preview built site | `npm run preview` |
| Validate frontmatter | `npm run audit:frontmatter` |
| Visual smoke test | `npm run test:visual` |
| Lint / format | `eslint` (flat config) · Prettier (tabs; astro + tailwind plugins) |

## Content model

Collections defined in [src/content.config.ts](src/content.config.ts):

- **`projects`** — `.mdx` in `src/content/projects/`. Deep forensic schema
  (`forensic_summary`, `complexity_vector`, `scars`, `metrics`, `cast`, `timeline`…).
  Taxonomy enums live in `src/config/taxonomy`. The `theme` field routes rendering
  (e.g. `ProjectArticle`). Forensic fields are **injected by `hydrate_content.py`** —
  don't hand-author what the pipeline owns.
- **`docs`** — `src/content/docs/` (incl. `_inbox`, intelligence boluses).
- **`otherPages`** — `src/data/otherPages/`.

Other content dirs: `_raw_nlm` (NotebookLM raw), `_agency_memory`, `colophon`, `prompts`.

ETL: `Raw PDF → NotebookLM bolus (_intelligence.md) → Astro collection → static HTML`.
Python scripts in `scripts/` (`hydrate_content.py`, `modernize_content.py`,
`project_pipeline.py`, …). Confirm the correct venv before running a Python script —
bare `python` may resolve to the wrong environment.

## Asset sovereignty

Assets (images, 3D models) live in **Cloudflare R2** (`assets.eriknorris.com`) —
**never commit them to Git.** Local staging is symlinked at
`D:/GitHub/portfolio-assets/R2_STAGING`; `public/assets/**` is watch-ignored.

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

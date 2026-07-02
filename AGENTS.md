# AGENTS.md

The canonical brief for every agent on this repo is [CLAUDE.md](CLAUDE.md).
Read it first, then read only the specific files the task names.

This file exists so non-Claude agents load the same repo front door that Claude
Code reads from `CLAUDE.md`. There is one source of truth: `CLAUDE.md`.

## Repo Invariants

- Astro output stays `static` everywhere. Do not switch dev, preview, or deploy
  to `server`; Cloudflare Pages can hit the 10,000-module limit when the site is
  bundled into one Worker.
- Content truth lives in the canon vault (`H:\workspace\canon`); the site schema is
  Astro collections + Zod in `src/content.config.ts` (contract v2). Generated project
  pages are a read-only render target written by `scripts/project_pipeline.py
  --write-live` — never hand-edit them, and never resurrect the retired
  `hydrate_content.py` pattern of scripts rewriting frontmatter.
- Images and 3D assets live in Cloudflare R2 at `assets.eriknorris.com`. Do not
  commit local asset dumps to Git.
- For local source/corpus recall, prefer the configured global context/router
  surface over broad filesystem grazing. For in-repo work, prefer tracked files
  and bounded searches.
- Python tooling on this Windows machine can resolve to different runtimes.
  Confirm the intended venv before running scripts with non-stdlib imports.

## Hook Policy

Hooks are optional early-warning rails for agent surfaces that support them.
They are not the cross-agent source of truth.

Shared repo policy must live in `CLAUDE.md`, this `AGENTS.md`, and build/CI
checks where practical. Personal permissions, session mining, and operator logs
belong in user-level or local-only config.

Only commit agent hook config when all of these are true:

- The hook enforces a project invariant, not a personal workflow.
- Every script referenced by the hook is tracked in this repo.
- The hook contains no secrets, tokens, or user-specific allowlists.
- The same invariant is documented here or in `CLAUDE.md`.

Local-only agent settings belong in `.claude/settings.local.json` or the
equivalent user-level config for the tool. Do not commit session transcripts,
generated context snippets, permission allowlists, or operator logging hooks.

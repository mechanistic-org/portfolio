---
title: Quickstart (Cheat Sheet)
slug: quickstart
sidebar:
  group: Handbook
  order: 0
description: Current portfolio authority and operational entry points.
---

# Quickstart: Daily Operations

The repository's `CLAUDE.md` is the operational front door. It owns the current
commands, runtime guidance, content pipeline and asset locations.

## Research and campaign pickup

For portfolio research, packet preparation or composition, read
`D:\GitHub\portfolio-canon\DEEP_DIVE_SOP.md`. For source capture, reuse and
closure, also read `D:\GitHub\portfolio-canon\NOTEBOOKLM_MIGRATION_SOP.md`.
Start campaign continuation from
[portfolio#229](https://github.com/mechanistic-org/portfolio/issues/229) and
its live selected contract. The controller records current work; the SOPs
define how to perform it.

Focused prompts and structured outputs can support research under those
contracts. Historical prompt cartridges and the old sidecar guide are retained
provenance. They do not replace primary-source review or the current pipeline.

## Content and assets

Curated claims live in `D:\GitHub\portfolio-canon`. Supporting evidence and
human-selected assets live in `D:\GitHub\portfolio-evidence`. Generated project
MDX is written by the authorized `scripts/project_pipeline.py` flow and is a
read-only render target.

Use `CLAUDE.md` for current validation and asset-processing commands. Run only
the checks and writes required by the selected task.

## Development and release

Use `npm run dev` for the local site and the checks listed in `CLAUDE.md` for
the relevant change. For release preparation or rollback, read
`README.md#deployment-and-rollback` and follow the exact publication contract.
Pushing a content change is not itself an instruction to deploy.

The historical hydration, bulk modernization, direct-MDX-editing and
Git-triggered Pages instructions formerly on this page were superseded.
Their history remains in Git.
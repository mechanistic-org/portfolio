#!/usr/bin/env python3
"""Slug-parameterized NotebookLM cartridge extractor.

This replaces the legacy, hardcoded mine_c24.py. That script could only ever
extract one project ("c24") against one notebook UID, and it shelled out to
`nlm.exe` under C:\\Users\\erik\\AppData\\Roaming\\Python\\Python314 - a runtime
that no longer exists and a CLI the registry has marked abandoned
(mined_2026-04-07_the-unmaintained-nlmexe-shim-is-being-ab). To migrate ~50
projects you would have copy-pasted mine_c24.py 50 times.

This tool instead:
- takes any --slug (or --all-queued) and resolves its NotebookLM title(s) via
  the single-sourced APPROVED_MAPPINGS map,
- runs the maintained notebooklm-py path (the same library run_campaign.py and
  notebooklm_sync.py use), not nlm.exe,
- auto-detects the Python runtime that actually has notebooklm-py installed
  (the global_agent venv) and re-execs itself there when needed,
- defaults to --dry-run so the full plan (notebook -> cartridges -> output
  files) is inspectable WITHOUT live auth, and only calls NotebookLM under
  --live.

Outputs land in src/content/_raw_nlm/<slug><suffix>, matching the existing
hydrate_content.py inputs, so nothing downstream changes.

Examples:
    # Inspect the plan for one project (no network, no auth):
    python scripts/career_kb/career_kb_extract.py --slug c24

    # List notebooks visible to the authenticated account:
    python scripts/career_kb/career_kb_extract.py --list --live

    # Actually extract the query cartridges for one project:
    python scripts/career_kb/career_kb_extract.py --slug sc48 --live

    # Plan a full batch over everything still queued:
    python scripts/career_kb/career_kb_extract.py --all-queued
"""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import subprocess
import sys
from pathlib import Path
from typing import Any

import career_kb_common as common


def _resolve_targets(args: argparse.Namespace) -> list[str]:
    """Return the list of slugs to operate on."""
    mappings = common.load_approved_mappings()
    s2t = common.slug_to_titles(mappings)
    if args.slug:
        if args.slug not in s2t:
            raise SystemExit(
                f"Slug '{args.slug}' has no mapped NotebookLM in APPROVED_MAPPINGS. "
                f"Known slugs: {', '.join(sorted(s2t))}"
            )
        return [args.slug]
    if args.all_queued:
        # everything that maps to a notebook; caller filters by status upstream
        return sorted(s2t)
    return []


def _selected_cartridges(args: argparse.Namespace) -> list[common.Cartridge]:
    if args.cartridges:
        names = [n.strip() for n in args.cartridges.split(",") if n.strip()]
        unknown = [n for n in names if n not in common.CARTRIDGE_BY_NAME]
        if unknown:
            raise SystemExit(f"Unknown cartridge(s): {', '.join(unknown)}")
        return [common.CARTRIDGE_BY_NAME[n] for n in names]
    # default: query cartridges only (audio is downstream of reviewed data)
    return [common.CARTRIDGE_BY_NAME[n] for n in common.DEFAULT_QUERY_CARTRIDGES]


def _plan_for_slug(slug: str, cartridges: list[common.Cartridge]) -> dict[str, Any]:
    mappings = common.load_approved_mappings()
    titles = common.slug_to_titles(mappings).get(slug, [])
    steps = []
    for cart in cartridges:
        prompt_path = common.PROMPTS_DIR / cart.prompt_file
        out_path = common.RAW_NLM_DIR / f"{slug}{cart.output_suffix}"
        steps.append(
            {
                "cartridge": cart.name,
                "prompt_file": str(prompt_path),
                "prompt_exists": prompt_path.exists(),
                "output_file": str(out_path),
                "output_exists": out_path.exists(),
                "kind": cart.kind,
            }
        )
    return {"slug": slug, "notebook_titles": titles, "steps": steps}


def _maybe_reexec_for_live(args: argparse.Namespace) -> None:
    """If --live and the current runtime lacks notebooklm, re-exec under one
    that has it (the global_agent venv). No-op in dry-run."""
    if not args.live or args.no_reexec:
        return
    if common.runtime_has_notebooklm(None):
        return
    target = common.find_notebooklm_python()
    if target is None:
        raise SystemExit(
            "live mode requested but no Python runtime with notebooklm-py was "
            "found. Install it (pip install notebooklm-py) into the current "
            "venv, or run this under the global_agent venv. Runtime report:\n"
            + json.dumps(common.runtime_report(), indent=2)
        )
    # Re-exec the same script + args under the capable interpreter, guarding
    # against infinite recursion with --no-reexec.
    cmd = [str(target), str(Path(__file__).resolve()), *sys.argv[1:], "--no-reexec"]
    print(f"[reexec] notebooklm-py not in {sys.executable}; "
          f"re-running under {target}", file=sys.stderr)
    raise SystemExit(subprocess.call(cmd))


async def _list_notebooks() -> int:
    from notebooklm import NotebookLMClient  # lazy: only under capable runtime

    async with await NotebookLMClient.from_storage() as client:
        notebooks = await client.notebooks.list()
        mappings = common.load_approved_mappings()
        rows = []
        for nb in notebooks:
            rows.append({
                "id": nb.id,
                "title": nb.title,
                "mapped_slug": mappings.get(nb.title),
            })
        print(json.dumps({"count": len(rows), "notebooks": rows},
                         indent=2, ensure_ascii=False))
    return 0


async def _extract_slug(slug: str, cartridges: list[common.Cartridge]) -> dict[str, Any]:
    from notebooklm import NotebookLMClient  # lazy

    mappings = common.load_approved_mappings()
    wanted_titles = set(common.slug_to_titles(mappings).get(slug, []))
    common.RAW_NLM_DIR.mkdir(parents=True, exist_ok=True)

    results: list[dict[str, Any]] = []
    async with await NotebookLMClient.from_storage() as client:
        notebooks = await client.notebooks.list()
        # pick the first account notebook whose title maps to this slug
        target = next((nb for nb in notebooks if nb.title in wanted_titles), None)
        if target is None:
            return {"slug": slug, "error": "no matching notebook in account",
                    "wanted_titles": sorted(wanted_titles)}
        for cart in cartridges:
            if cart.kind != "query":
                results.append({"cartridge": cart.name, "skipped": "non-query"})
                continue
            prompt_path = common.PROMPTS_DIR / cart.prompt_file
            if not prompt_path.exists():
                results.append({"cartridge": cart.name,
                                "error": f"missing prompt {prompt_path}"})
                continue
            prompt = prompt_path.read_text(encoding="utf-8")
            out_path = common.RAW_NLM_DIR / f"{slug}{cart.output_suffix}"
            try:
                answer = await client.chat.ask(target.id, prompt)
                text = answer.text if hasattr(answer, "text") else str(answer)
                out_path.write_text(text, encoding="utf-8")
                results.append({"cartridge": cart.name, "output": str(out_path),
                                "chars": len(text)})
            except Exception as exc:  # noqa: BLE001 - report, do not crash batch
                results.append({"cartridge": cart.name, "error": str(exc)})
    return {"slug": slug, "notebook_id": target.id, "notebook_title": target.title,
            "results": results}


def main() -> int:
    parser = argparse.ArgumentParser(description="Slug-parameterized NotebookLM extractor.")
    parser.add_argument("--slug", help="Project slug to extract.")
    parser.add_argument("--all-queued", action="store_true",
                        help="Plan/extract every slug with a mapped notebook.")
    parser.add_argument("--cartridges",
                        help="Comma list (default: all query cartridges). "
                             f"Choices: {', '.join(c.name for c in common.CARTRIDGES)}")
    parser.add_argument("--list", action="store_true",
                        help="List notebooks visible to the account (needs --live).")
    parser.add_argument("--live", action="store_true",
                        help="Actually call NotebookLM. Default is dry-run.")
    parser.add_argument("--no-reexec", action="store_true",
                        help="Internal: do not re-exec under another runtime.")
    args = parser.parse_args()

    _maybe_reexec_for_live(args)

    if args.list:
        if not args.live:
            print(json.dumps({"note": "--list needs --live (account access). "
                                      "Runtime:", **common.runtime_report()}, indent=2))
            return 0
        return asyncio.run(_list_notebooks())

    targets = _resolve_targets(args)
    if not targets:
        parser.error("provide --slug <slug>, --all-queued, or --list")
    cartridges = _selected_cartridges(args)

    if not args.live:
        plans = [_plan_for_slug(s, cartridges) for s in targets]
        print(json.dumps(
            {
                "mode": "dry-run",
                "runtime": common.runtime_report(),
                "target_count": len(targets),
                "cartridges": [c.name for c in cartridges],
                "plans": plans,
                "note": "No NotebookLM calls made. Re-run with --live to extract.",
            },
            indent=2,
        ))
        return 0

    out = []
    for slug in targets:
        out.append(asyncio.run(_extract_slug(slug, cartridges)))
    print(json.dumps({"mode": "live", "results": out}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

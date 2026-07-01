#!/usr/bin/env python3
"""Generate the NotebookLM migration queue and reconcile coverage.

Outputs `career-kb/index/notebooks.yaml`: one entry per project slug that has
at least one mapped NotebookLM, recording the source notebook title(s), whether
a synced registry doc already exists, whether raw cartridge outputs already
exist locally, whether the slug matches a live project record, and a derived
migration status.

It also prints a reconciliation summary that answers the question the prior
pass left open: the user said "26 projects have dedicated NotebookLMs", but the
approved mapping has 50 notebook titles collapsing to 32 unique slugs (several
notebooks per project, plus ALL_eml aggregate notebooks). This tool makes that
discrepancy explicit instead of silently trusting either number.

Read-only except for writing notebooks.yaml. Never calls NotebookLM.

Usage:
    python scripts/career_kb/career_kb_notebooks.py            # print report
    python scripts/career_kb/career_kb_notebooks.py --write    # also write yaml
    python scripts/career_kb/career_kb_notebooks.py --format json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import yaml

import career_kb_common as common


# Aggregate notebooks cover many projects at once; they are not a single-project
# "dedicated" notebook, so they are flagged separately during reconciliation.
AGGREGATE_SLUG_HINTS = ("all-eml", "all_eml", "rez")


def _is_aggregate(slug: str, titles: list[str]) -> bool:
    s = slug.lower()
    if any(h in s for h in AGGREGATE_SLUG_HINTS):
        return True
    return all("all_eml" in t.lower() or "all eml" in t.lower() for t in titles)


def _project_slugs() -> set[str]:
    if not common.PROJECTS_DIR.exists():
        return set()
    return {p.parent.name for p in common.PROJECTS_DIR.rglob("index.mdx")}


def _registry_docs_by_slug() -> dict[str, list[str]]:
    out: dict[str, list[str]] = {}
    if not common.REGISTRY_NLM_DIR.exists():
        return out
    for doc in sorted(common.REGISTRY_NLM_DIR.glob("*.md")):
        # filename convention: <slug>__<SafeTitle>.md
        slug = doc.name.split("__", 1)[0]
        out.setdefault(slug, []).append(doc.name)
    return out


def _raw_outputs_for(slug: str) -> list[str]:
    if not common.RAW_NLM_DIR.exists():
        return []
    hits: list[str] = []
    for cart in common.CARTRIDGES:
        candidate = common.RAW_NLM_DIR / f"{slug}{cart.output_suffix}"
        if candidate.exists():
            hits.append(candidate.name)
    return hits


def build_entries() -> list[dict[str, Any]]:
    mappings = common.load_approved_mappings()
    s2t = common.slug_to_titles(mappings)
    project_slugs = _project_slugs()
    registry = _registry_docs_by_slug()

    entries: list[dict[str, Any]] = []
    for slug in sorted(s2t):
        titles = s2t[slug]
        raw_outputs = _raw_outputs_for(slug)
        has_registry = slug in registry
        has_project = slug in project_slugs
        aggregate = _is_aggregate(slug, titles)

        # Derived migration status: what the operator still owes this slug.
        if aggregate:
            status = "aggregate_source"        # multi-project notebook, not a page
        elif raw_outputs:
            status = "raw_extracted"           # cartridge outputs already on disk
        elif has_registry:
            status = "summary_synced"          # registry summary only, no cartridges
        else:
            status = "queued"                  # mapped but nothing pulled yet

        entries.append(
            {
                "slug": slug,
                "notebook_titles": titles,
                "notebook_count": len(titles),
                "aggregate": aggregate,
                "has_registry_doc": has_registry,
                "registry_docs": registry.get(slug, []),
                "has_project_record": has_project,
                "raw_outputs": raw_outputs,
                "status": status,
            }
        )
    return entries


def reconcile(entries: list[dict[str, Any]]) -> dict[str, Any]:
    dedicated = [e for e in entries if not e["aggregate"]]
    aggregate = [e for e in entries if e["aggregate"]]
    return {
        "total_mapped_notebook_titles": sum(e["notebook_count"] for e in entries),
        "unique_slugs": len(entries),
        "dedicated_project_slugs": len(dedicated),
        "aggregate_notebooks": len(aggregate),
        "aggregate_slugs": [e["slug"] for e in aggregate],
        "user_stated_dedicated": 26,
        "reconciliation_note": (
            "User stated ~26 dedicated NotebookLMs. The approved mapping holds "
            f"{sum(e['notebook_count'] for e in entries)} notebook titles "
            f"collapsing to {len(entries)} unique slugs "
            f"({len(dedicated)} dedicated project slugs + {len(aggregate)} "
            "aggregate ALL_eml notebooks). The 26 figure most likely counts "
            "distinct projects with a primary dedicated notebook; confirm "
            "against the live NotebookLM account with career_kb_extract.py "
            "--list before batch extraction."
        ),
        "status_counts": {
            s: sum(1 for e in entries if e["status"] == s)
            for s in ("queued", "summary_synced", "raw_extracted", "aggregate_source")
        },
        "slugs_without_project_record": [
            e["slug"] for e in entries if not e["has_project_record"]
        ],
    }


def write_yaml(entries: list[dict[str, Any]], summary: dict[str, Any]) -> Path:
    common.CAREER_KB_INDEX.mkdir(parents=True, exist_ok=True)
    out = common.CAREER_KB_INDEX / "notebooks.yaml"
    doc = {
        "schema_version": "career-kb.notebooks.v0.1",
        "generated_by": "scripts/career_kb/career_kb_notebooks.py",
        "source_of_truth": str(common.NOTEBOOKLM_SYNC),
        "reconciliation": summary,
        "notebooks": entries,
    }
    out.write_text(
        yaml.safe_dump(doc, sort_keys=False, allow_unicode=True, width=100),
        encoding="utf-8",
    )
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="NotebookLM migration queue + coverage.")
    parser.add_argument("--write", action="store_true",
                        help="Write career-kb/index/notebooks.yaml.")
    parser.add_argument("--format", choices=("text", "json"), default="text")
    args = parser.parse_args()

    entries = build_entries()
    summary = reconcile(entries)

    written = None
    if args.write:
        written = write_yaml(entries, summary)

    if args.format == "json":
        print(json.dumps(
            {"summary": summary, "entries": entries,
             "written": str(written) if written else None},
            indent=2,
        ))
        return 0

    print("# NotebookLM Migration Queue\n")
    print(f"- Mapped notebook titles : {summary['total_mapped_notebook_titles']}")
    print(f"- Unique slugs           : {summary['unique_slugs']}")
    print(f"- Dedicated project slugs: {summary['dedicated_project_slugs']}")
    print(f"- Aggregate notebooks    : {summary['aggregate_notebooks']} "
          f"({', '.join(summary['aggregate_slugs']) or 'none'})")
    print(f"- User-stated dedicated  : {summary['user_stated_dedicated']}")
    print(f"\nStatus counts: {json.dumps(summary['status_counts'])}")
    if summary["slugs_without_project_record"]:
        print(f"\nMapped slugs with NO live project record "
              f"({len(summary['slugs_without_project_record'])}): "
              f"{', '.join(summary['slugs_without_project_record'])}")
    print(f"\nReconciliation: {summary['reconciliation_note']}")
    if written:
        print(f"\nWrote {written}")
    else:
        print("\n(dry run - pass --write to emit notebooks.yaml)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

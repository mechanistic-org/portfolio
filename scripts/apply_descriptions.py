"""Apply batch descriptions to project MDX frontmatter (Phase 2 hydration).

Reads a {project_id: description} JSON map and inserts (or replaces) a single
`description:` line in each project's frontmatter. Edits are minimal-diff:
one line per file, original line endings preserved, value emitted via
json.dumps (valid YAML double-quoted scalar). Each file's frontmatter is
re-parsed after the edit; any parse failure aborts that file.

Usage:
    python scripts/apply_descriptions.py scripts/descriptions_2026-06-11.json [--dry-run]
"""

import argparse
import json
import re
import sys
from pathlib import Path

import yaml

PROJECTS_DIR = Path(__file__).resolve().parent.parent / "src" / "content" / "projects"


def find_file(project_id: str) -> Path | None:
    base = PROJECTS_DIR / Path(project_id)
    for name in ("index.mdx", "_index.mdx"):
        if (base / name).exists():
            return base / name
    return None


def apply(path: Path, description: str, dry_run: bool) -> str:
    with path.open(encoding="utf-8", newline="") as fh:
        raw = fh.read()
    eol = "\r\n" if "\r\n" in raw[:500] else "\n"

    m = re.match(r"^---(\r?\n)(.*?)(\r?\n)---(\r?\n)", raw, re.DOTALL)
    if not m:
        return "SKIP: no frontmatter"
    fm_start = m.end(1)
    fm_end = m.start(3)
    fm_block = raw[fm_start:fm_end]

    new_line = f"description: {json.dumps(description, ensure_ascii=False)}"

    existing = re.search(r"^description:[^\r\n]*$", fm_block, re.MULTILINE)
    if existing:
        # only replace single-line scalars; bail on block styles
        val = existing.group(0)[len("description:"):].strip()
        if val in (">", "|") or val.startswith((">", "|")):
            return "SKIP: block-style description"
        new_fm = fm_block[: existing.start()] + new_line + fm_block[existing.end():]
        action = "replaced"
    else:
        new_fm = new_line + eol + fm_block
        action = "inserted"

    try:
        parsed = yaml.safe_load(new_fm)
        assert parsed.get("description") == description
    except Exception as e:
        return f"FAIL: post-edit parse error: {e}"

    if not dry_run:
        with path.open("w", encoding="utf-8", newline="") as fh:
            fh.write(raw[:fm_start] + new_fm + raw[fm_end:])
    return action


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("mapping", help="JSON file of {project_id: description}")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    mapping = json.loads(Path(args.mapping).read_text(encoding="utf-8"))
    counts = {"inserted": 0, "replaced": 0, "skipped": 0, "failed": 0, "missing": 0}

    for project_id, description in sorted(mapping.items()):
        f = find_file(project_id)
        if not f:
            counts["missing"] += 1
            print(f"MISSING FILE: {project_id}")
            continue
        result = apply(f, description, args.dry_run)
        if result in ("inserted", "replaced"):
            counts[result] += 1
        elif result.startswith("SKIP"):
            counts["skipped"] += 1
            print(f"{project_id}: {result}")
        else:
            counts["failed"] += 1
            print(f"{project_id}: {result}")

    print(f"\n{'DRY RUN - ' if args.dry_run else ''}inserted={counts['inserted']} "
          f"replaced={counts['replaced']} skipped={counts['skipped']} "
          f"failed={counts['failed']} missing={counts['missing']}")
    sys.exit(1 if counts["failed"] or counts["missing"] else 0)


if __name__ == "__main__":
    main()

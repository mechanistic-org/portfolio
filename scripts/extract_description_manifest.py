"""Extract a compact context manifest for projects lacking descriptions.

Phase 2 (description hydration) support tool. Collects taxonomy frontmatter,
a body excerpt, sticky-deck titles, and a NotebookLM registry excerpt for
every non-draft project whose description is missing or a stub (<40 chars).

Usage:
    python scripts/extract_description_manifest.py [--out manifest.json]
"""

import argparse
import json
import re
from pathlib import Path

import yaml

PROJECTS_DIR = Path(__file__).resolve().parent.parent / "src" / "content" / "projects"
NLM_REGISTRY = Path(r"D:\GitHub\global_agent\registry\notebooklm")

BODY_EXCERPT_LEN = 420
NLM_EXCERPT_LEN = 420


def split_frontmatter(raw: str):
    m = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?(.*)$", raw, re.DOTALL)
    if not m:
        return None, raw
    return m.group(1), m.group(2)


def clean_excerpt(text: str, limit: int) -> str:
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", "", text)  # images
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)  # links -> text
    text = re.sub(r"[#>*`|_]", "", text)
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit]


def nlm_excerpt(slug: str) -> str:
    candidates = sorted(NLM_REGISTRY.glob(f"{slug}*.md")) if NLM_REGISTRY.exists() else []
    if not candidates:
        return ""
    raw = candidates[0].read_text(encoding="utf-8", errors="replace")
    _, body = split_frontmatter(raw)
    return clean_excerpt(body or raw, NLM_EXCERPT_LEN)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="description_manifest.json")
    args = ap.parse_args()

    entries = []
    skipped = {"draft": 0, "has_description": 0, "parse_error": []}

    for f in sorted(PROJECTS_DIR.rglob("*.mdx")):
        rel_id = f.relative_to(PROJECTS_DIR).with_suffix("").as_posix()
        rel_id = re.sub(r"/(index|_index)$", "", rel_id) or rel_id
        raw = f.read_text(encoding="utf-8", errors="replace")
        fm_text, body = split_frontmatter(raw)
        if fm_text is None:
            skipped["parse_error"].append(rel_id)
            continue
        try:
            fm = yaml.safe_load(fm_text) or {}
        except yaml.YAMLError as e:
            skipped["parse_error"].append(f"{rel_id}: {e}")
            continue

        if fm.get("draft"):
            skipped["draft"] += 1
            continue
        desc = (fm.get("description") or "").strip()
        if len(desc) >= 40:
            skipped["has_description"] += 1
            continue

        deck_titles = []
        for sticky in (fm.get("cyberspace") or {}).get("stickies", []) or []:
            for deck in sticky.get("deck", []) or []:
                t = (deck.get("title") or "").strip()
                if t:
                    deck_titles.append(t)

        date = fm.get("date")
        end = fm.get("endDate")
        entries.append(
            {
                "id": rel_id,
                "file": str(f.relative_to(PROJECTS_DIR.parent.parent.parent)),
                "title": fm.get("title"),
                "existing_description": desc or None,
                "employer": fm.get("employer"),
                "client": fm.get("client") or [],
                "category": fm.get("category"),
                "industry": fm.get("industry"),
                "year": str(date)[:4] if date else None,
                "end_year": str(end)[:4] if end else None,
                "production": fm.get("production"),
                "scale": fm.get("productionScale"),
                "tools": fm.get("tools") or [],
                "tags": fm.get("tags") or [],
                "team": fm.get("teamSize"),
                "deck_titles": deck_titles[:8],
                "body": clean_excerpt(body, BODY_EXCERPT_LEN),
                "nlm": nlm_excerpt(rel_id.split("/")[0]),
            }
        )

    out = Path(args.out)
    out.write_text(json.dumps({"entries": entries, "skipped": skipped}, indent=1), encoding="utf-8")
    print(f"entries needing description: {len(entries)}")
    print(f"skipped: draft={skipped['draft']} has_description={skipped['has_description']}")
    if skipped["parse_error"]:
        print("parse errors:", skipped["parse_error"])
    print(f"wrote {out}")


if __name__ == "__main__":
    main()

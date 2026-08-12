#!/usr/bin/env python3
"""Inventory local career KB inputs and portfolio render coverage.

Read-only audit for the portfolio knowledge-base migration. It does not call
NotebookLM, mutate project content, or copy assets. It summarizes the current
state of:

- Astro project records in src/content/projects
- Raw NotebookLM extracts in src/content/_raw_nlm
- Synced NotebookLM registry docs in global_agent/registry/notebooklm
- Curated asset folders in R2_MASTER and R2_MIRROR
- Curated canon, local evidence, and legacy local archive roots

Usage:
    python scripts/audits/career_kb_inventory.py
    python scripts/audits/career_kb_inventory.py --format md
    python scripts/audits/career_kb_inventory.py --out tmp/career-kb-inventory.json
"""

from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml


SIDECARES = ("_intelligence.md", "_metrics.json", "_crises.md", "_entropy.json", "data.json")
DEEP_PRESENTATION_MODES = {"deep_dive", "flagship", "notebook"}
SKIP_DIRS = {".git", "node_modules", ".venv", "venv", "dist", "build", ".next", "__pycache__"}


@dataclass(frozen=True)
class Roots:
    repo: Path
    raw_nlm: Path
    projects: Path
    r2_master: Path
    R2_MIRROR: Path
    legacy_archive: Path
    curated_canon: Path
    local_evidence: Path
    notebook_registry: Path


def default_roots(repo: Path) -> Roots:
    github_root = repo.parent
    return Roots(
        repo=repo,
        raw_nlm=repo / "src" / "content" / "_raw_nlm",
        projects=repo / "src" / "content" / "projects",
        r2_master=github_root / "portfolio-workspace" / "R2_MASTER",
        R2_MIRROR=github_root / "portfolio-assets" / "R2_MIRROR",
        legacy_archive=Path(r"D:\portfolio\portfolio_working"),
        curated_canon=github_root / "portfolio-canon",
        local_evidence=github_root / "portfolio-evidence",
        notebook_registry=github_root / "global_agent" / "registry" / "notebooklm",
    )


def split_frontmatter(text: str) -> tuple[dict[str, Any], str]:
    match = re.match(r"^---\r?\n(.*?)\r?\n---\r?\n?(.*)$", text, re.DOTALL)
    if not match:
        return {}, text
    data = yaml.safe_load(match.group(1)) or {}
    return data, match.group(2)


def safe_read(path: Path) -> str:
    return path.read_text(encoding="utf-8", errors="replace")


def path_exists_safe(path: Path) -> bool:
    try:
        return path.exists()
    except OSError:
        return False


def path_is_dir_safe(path: Path) -> bool:
    try:
        return path.is_dir()
    except OSError:
        return False


def top_level_dirs(path: Path) -> list[str]:
    if not path_exists_safe(path) or not path_is_dir_safe(path):
        return []
    out: list[str] = []
    try:
        for child in path.iterdir():
            if path_is_dir_safe(child) and child.name not in SKIP_DIRS:
                out.append(child.name)
    except OSError:
        return []
    return sorted(out)


def project_rows(projects_dir: Path) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for mdx in sorted(projects_dir.rglob("index.mdx")) if projects_dir.exists() else []:
        fm, body = split_frontmatter(safe_read(mdx))
        slug = mdx.parent.name
        sidecars = {name: (mdx.parent / name).exists() for name in SIDECARES}
        presentation_mode = str(fm.get("presentation_mode") or "").lower()
        description = (fm.get("description") or "").strip()
        body_len = len(body.strip())
        depth_score = 0
        if presentation_mode in DEEP_PRESENTATION_MODES:
            depth_score += 3
        if sidecars["_intelligence.md"] or sidecars["_metrics.json"] or sidecars["_entropy.json"]:
            depth_score += 3
        if body_len >= 3500:
            depth_score += 2
        if fm.get("notebook_url") or fm.get("nlm_url"):
            depth_score += 2
        if len(description) >= 80:
            depth_score += 1
        rows.append(
            {
                "slug": slug,
                "title": fm.get("title") or slug,
                "date": str(fm.get("date")) if fm.get("date") else None,
                "endDate": str(fm.get("endDate")) if fm.get("endDate") else None,
                "draft": bool(fm.get("draft", False)),
                "listed": fm.get("listed", True) is not False,
                "presentation_mode": presentation_mode or None,
                "theme": fm.get("theme"),
                "employer": fm.get("employer"),
                "client": fm.get("client") or [],
                "description_len": len(description),
                "body_len": body_len,
                "has_notebook_link_in_page": bool(fm.get("notebook_url") or fm.get("nlm_url")),
                "has_audio_url": bool(fm.get("audio_url")),
                "sidecars": sidecars,
                "depth_score": depth_score,
            }
        )
    return rows


def raw_nlm_index(raw_dir: Path) -> dict[str, Any]:
    files = [p for p in raw_dir.iterdir() if p.is_file()] if raw_dir.exists() else []
    by_ext = Counter(p.suffix.lower() or "[noext]" for p in files)
    stems: dict[str, set[str]] = defaultdict(set)
    notebook_links: dict[str, str] = {}
    json_parse_errors: list[str] = []
    for path in files:
        stems[path.stem].add(path.suffix.lower() or "[noext]")
        if path.suffix.lower() != ".json":
            continue
        try:
            data = json.loads(safe_read(path))
        except Exception as exc:  # noqa: BLE001 - audit wants filename, not traceback
            json_parse_errors.append(f"{path.name}: {exc}")
            continue
        url = data.get("notebook_url") or data.get("nlm_url")
        slug = data.get("slug") or path.stem
        if url:
            notebook_links[str(slug)] = str(url)
    return {
        "file_count": len(files),
        "extension_counts": dict(sorted(by_ext.items())),
        "unique_stems": {k: sorted(v) for k, v in sorted(stems.items())},
        "notebook_links": dict(sorted(notebook_links.items())),
        "json_parse_errors": json_parse_errors,
    }


def notebook_registry_index(registry_dir: Path) -> dict[str, Any]:
    docs = sorted(registry_dir.glob("*.md")) if registry_dir.exists() else []
    slugs: dict[str, list[str]] = defaultdict(list)
    for doc in docs:
        fm, _ = split_frontmatter(safe_read(doc))
        slug = fm.get("slug")
        title = fm.get("title") or doc.stem
        if slug:
            slugs[str(slug)].append(str(title))
    return {
        "doc_count": len(docs),
        "unique_slug_count": len(slugs),
        "slugs": {slug: sorted(titles) for slug, titles in sorted(slugs.items())},
    }


def summarize(roots: Roots) -> dict[str, Any]:
    projects = project_rows(roots.projects)
    project_slugs = {p["slug"] for p in projects}
    raw = raw_nlm_index(roots.raw_nlm)
    registry = notebook_registry_index(roots.notebook_registry)
    raw_stems = set(raw["unique_stems"])
    registry_slugs = set(registry["slugs"])
    master_dirs = set(top_level_dirs(roots.r2_master))
    staging_dirs = set(top_level_dirs(roots.R2_MIRROR))

    sidecar_counts: Counter[str] = Counter()
    for project in projects:
        for name, present in project["sidecars"].items():
            if present:
                sidecar_counts[name] += 1

    published = [p for p in projects if not p["draft"] and p["listed"]]
    deep_like = [p for p in published if (p["presentation_mode"] or "") in DEEP_PRESENTATION_MODES]
    weak_public = [p for p in published if p["body_len"] < 200 or p["description_len"] < 40]
    deep_candidates = sorted(published, key=lambda p: (-int(p["depth_score"]), p["slug"]))[:50]

    roots_status = {
        "repo": str(roots.repo),
        "projects": str(roots.projects),
        "raw_nlm": str(roots.raw_nlm),
        "r2_master": str(roots.r2_master),
        "R2_MIRROR": str(roots.R2_MIRROR),
        "legacy_archive": str(roots.legacy_archive),
        "curated_canon": str(roots.curated_canon),
        "local_evidence": str(roots.local_evidence),
        "notebook_registry": str(roots.notebook_registry),
    }
    roots_exists = {name: path_exists_safe(Path(path)) for name, path in roots_status.items()}

    return {
        "roots": roots_status,
        "roots_exist": roots_exists,
        "summary": {
            "project_count": len(projects),
            "published_count": len(published),
            "draft_or_unlisted_count": len(projects) - len(published),
            "deep_like_by_current_mode": len(deep_like),
            "lite_like_by_current_mode": len(published) - len(deep_like),
            "raw_nlm_file_count": raw["file_count"],
            "raw_nlm_unique_stems": len(raw_stems),
            "raw_nlm_stems_matching_projects": len(raw_stems & project_slugs),
            "raw_nlm_notebook_link_count": len(raw["notebook_links"]),
            "notebook_registry_doc_count": registry["doc_count"],
            "notebook_registry_unique_slug_count": registry["unique_slug_count"],
            "notebook_registry_slugs_matching_projects": len(registry_slugs & project_slugs),
            "r2_master_dir_count": len(master_dirs),
            "r2_master_dirs_matching_projects": len(master_dirs & project_slugs),
            "R2_MIRROR_dir_count": len(staging_dirs),
            "R2_MIRROR_dirs_matching_projects": len(staging_dirs & project_slugs),
            "page_notebook_link_count": sum(1 for p in projects if p["has_notebook_link_in_page"]),
            "audio_url_count": sum(1 for p in projects if p["has_audio_url"]),
            "weak_public_project_count": len(weak_public),
            "sidecar_counts": dict(sorted(sidecar_counts.items())),
        },
        "projects": projects,
        "raw_nlm": {
            "extension_counts": raw["extension_counts"],
            "notebook_links": raw["notebook_links"],
            "json_parse_errors": raw["json_parse_errors"],
            "stems_not_in_projects": sorted(raw_stems - project_slugs),
            "projects_without_raw_nlm": sorted(project_slugs - raw_stems),
        },
        "notebook_registry": registry,
        "assets": {
            "r2_master_not_in_projects": sorted(master_dirs - project_slugs),
            "R2_MIRROR_not_in_projects": sorted(staging_dirs - project_slugs),
            "projects_without_r2_master": sorted(project_slugs - master_dirs),
            "projects_without_R2_MIRROR": sorted(project_slugs - staging_dirs),
        },
        "deep_candidates": deep_candidates,
        "weak_public_projects": sorted(weak_public, key=lambda p: (p["description_len"], p["body_len"], p["slug"])),
    }


def render_md(data: dict[str, Any]) -> str:
    s = data["summary"]
    lines = [
        "# Career KB Inventory",
        "",
        "## Roots",
        "",
    ]
    for name, path in data["roots"].items():
        exists = "yes" if data["roots_exist"].get(name) else "no"
        lines.append(f"- `{name}`: `{path}` - exists: {exists}")
    lines.extend(
        [
            "",
            "## Summary",
            "",
            f"- Projects: {s['project_count']} total, {s['published_count']} published, {s['draft_or_unlisted_count']} draft or unlisted.",
            f"- Current deep-like modes: {s['deep_like_by_current_mode']} deep-like, {s['lite_like_by_current_mode']} lite-like among published records.",
            f"- Raw NotebookLM extracts: {s['raw_nlm_file_count']} files, {s['raw_nlm_unique_stems']} unique stems, {s['raw_nlm_stems_matching_projects']} matching project slugs.",
            f"- Raw NotebookLM records with notebook links: {s['raw_nlm_notebook_link_count']}.",
            f"- Synced NotebookLM registry: {s['notebook_registry_doc_count']} docs, {s['notebook_registry_unique_slug_count']} unique slugs, {s['notebook_registry_slugs_matching_projects']} matching project slugs.",
            f"- R2_MASTER: {s['r2_master_dir_count']} dirs, {s['r2_master_dirs_matching_projects']} matching project slugs.",
            f"- R2_MIRROR: {s['R2_MIRROR_dir_count']} dirs, {s['R2_MIRROR_dirs_matching_projects']} matching project slugs.",
            f"- Page frontmatter notebook links: {s['page_notebook_link_count']}.",
            f"- Audio URLs: {s['audio_url_count']}.",
            f"- Weak public records by body or description threshold: {s['weak_public_project_count']}.",
            f"- Sidecars: {json.dumps(s['sidecar_counts'], sort_keys=True)}.",
            "",
            "## Top deep candidates by current signals",
            "",
            "| Slug | Mode | Body chars | Description chars | Score |",
            "| :-- | :-- | --: | --: | --: |",
        ]
    )
    for p in data["deep_candidates"][:30]:
        lines.append(
            f"| `{p['slug']}` | {p.get('presentation_mode') or ''} | {p['body_len']} | {p['description_len']} | {p['depth_score']} |"
        )
    lines.extend(["", "## Weak public project sample", "", "| Slug | Mode | Body chars | Description chars |", "| :-- | :-- | --: | --: |"])
    for p in data["weak_public_projects"][:25]:
        lines.append(
            f"| `{p['slug']}` | {p.get('presentation_mode') or ''} | {p['body_len']} | {p['description_len']} |"
        )
    lines.extend(["", "## Gaps", ""])
    gap_sets = [
        ("Projects without raw NLM", data["raw_nlm"]["projects_without_raw_nlm"]),
        ("Raw NLM stems not in projects", data["raw_nlm"]["stems_not_in_projects"]),
        ("Projects without R2_MASTER", data["assets"]["projects_without_r2_master"]),
        ("Projects without R2_MIRROR", data["assets"]["projects_without_R2_MIRROR"]),
    ]
    for title, values in gap_sets:
        sample = ", ".join(f"`{v}`" for v in values[:30])
        suffix = f" plus {len(values) - 30} more" if len(values) > 30 else ""
        lines.append(f"- {title}: {len(values)}. {sample}{suffix}")
    return "\n".join(lines) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description="Audit local career KB source coverage.")
    parser.add_argument("--repo", default=str(Path(__file__).resolve().parents[2]), help="Portfolio repo root.")
    parser.add_argument("--format", choices=("json", "md"), default="json")
    parser.add_argument("--out", help="Optional output file. Prints to stdout when omitted.")
    args = parser.parse_args()

    roots = default_roots(Path(args.repo).resolve())
    data = summarize(roots)
    rendered = json.dumps(data, indent=2, ensure_ascii=False, sort_keys=True) + "\n"
    if args.format == "md":
        rendered = render_md(data)

    if args.out:
        out = Path(args.out)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(rendered, encoding="utf-8")
        print(f"wrote {out}")
    else:
        print(rendered, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

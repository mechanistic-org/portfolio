#!/usr/bin/env python3
"""Shared resolver for the career-KB NotebookLM extraction pipeline.

This module is the single source of truth for three things the previous
tooling hardcoded or duplicated:

1. The notebook-title -> project-slug map (APPROVED_MAPPINGS), read straight
   from global_agent/scripts/notebooklm_sync.py via AST so the two never drift.
2. The cartridge set (which compiled prompt produces which raw artifact),
   derived from the legacy hardcoded mine_c24.py so a slug-parameterized
   runner can replace it.
3. Path + runtime resolution, including which Python actually has the
   maintained `notebooklm-py` library installed.

Nothing in this module imports `notebooklm`. It is import-safe in any runtime,
including the portfolio venv where the library is intentionally absent. The
live NotebookLM calls live in career_kb_extract.py and are guarded there.

Why this exists: the user's stated extraction tooling is split across two
repos and two Python runtimes, and its only batch runner (mine_c24.py) is
hardcoded to a single slug on a CLI (nlm.exe / Python314) the registry has
already marked abandoned. This module centralizes the facts so the rest of
the pipeline can be slug-parameterized and runtime-honest.
"""

from __future__ import annotations

import ast
import subprocess
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any


# --- Path resolution -------------------------------------------------------
# This file lives at <portfolio>/scripts/career_kb/career_kb_common.py
PORTFOLIO_ROOT = Path(__file__).resolve().parents[2]
GITHUB_ROOT = PORTFOLIO_ROOT.parent
GLOBAL_AGENT_ROOT = GITHUB_ROOT / "global_agent"

RAW_NLM_DIR = PORTFOLIO_ROOT / "src" / "content" / "_raw_nlm"
PROMPTS_DIR = PORTFOLIO_ROOT / "public" / "assets" / "prompts"
PROJECTS_DIR = PORTFOLIO_ROOT / "src" / "content" / "projects"
REGISTRY_NLM_DIR = GLOBAL_AGENT_ROOT / "registry" / "notebooklm"
NOTEBOOKLM_SYNC = GLOBAL_AGENT_ROOT / "scripts" / "notebooklm_sync.py"

# The curated canon repo is the single source of reviewed career claims. Raw
# source material stays in the sibling non-Git evidence store; this tool writes
# only its small index artifact beside the canon census board.
CANON_ROOT = GITHUB_ROOT / "portfolio-canon"
CANON_CENSUS = CANON_ROOT / "census"


# --- Cartridge contract ----------------------------------------------------
# Source of truth derived from the legacy mine_c24.py + compile_hack_pack.py.
# A slug-parameterized runner emits <RAW_NLM_DIR>/<slug><suffix> per cartridge.
@dataclass(frozen=True)
class Cartridge:
    name: str            # logical cartridge id
    prompt_file: str     # compiled prompt in public/assets/prompts/
    output_suffix: str   # appended to slug -> raw output filename
    kind: str            # "query" (text/JSON answer) or "audio"


CARTRIDGES: tuple[Cartridge, ...] = (
    Cartridge("bolus", "BOLUS_NLM-INPUT.txt", "_bolus.json", "query"),
    Cartridge("metrics", "METRICS_NLM-INPUT.txt", "_metrics.json", "query"),
    Cartridge("report", "REPORT_NLM-INPUT.txt", "_report.md", "query"),
    Cartridge("vignettes", "VIGNETTES_NLM-INPUT.txt", "_vignettes.md", "query"),
    Cartridge("team", "TEAM_NLM-INPUT.txt", "_team.md", "query"),
    Cartridge("bom", "BOM_NLM-INPUT.txt", "_parts.md", "query"),
    Cartridge("timeline", "TIMELINE_NLM-INPUT.txt", "_development_timeline.md", "query"),
    Cartridge("resume", "RESUME_NLM-INPUT.txt", "_resume.md", "query"),
    Cartridge("podcast", "PODCAST_NLM-INPUT.txt", "_podcast.audio", "audio"),
)

CARTRIDGE_BY_NAME = {c.name: c for c in CARTRIDGES}
DEFAULT_QUERY_CARTRIDGES = tuple(c.name for c in CARTRIDGES if c.kind == "query")


# --- Approved title -> slug mapping ---------------------------------------
def load_approved_mappings(path: Path | None = None) -> dict[str, str]:
    """Read APPROVED_MAPPINGS from notebooklm_sync.py without importing it.

    notebooklm_sync.py imports `notebooklm` at module top, which is absent in
    the portfolio venv. We parse the source instead so the mapping stays
    single-sourced regardless of runtime.
    """
    src_path = path or NOTEBOOKLM_SYNC
    if not src_path.exists():
        raise FileNotFoundError(
            f"notebooklm_sync.py not found at {src_path}; cannot resolve "
            "notebook->slug mappings."
        )
    tree = ast.parse(src_path.read_text(encoding="utf-8"))
    for node in tree.body:
        if isinstance(node, ast.Assign) and any(
            getattr(t, "id", "") == "APPROVED_MAPPINGS" for t in node.targets
        ):
            value = ast.literal_eval(node.value)
            if not isinstance(value, dict):
                raise ValueError("APPROVED_MAPPINGS did not parse to a dict.")
            return {str(k): str(v) for k, v in value.items()}
    raise ValueError(f"APPROVED_MAPPINGS not found in {src_path}.")


def slug_to_titles(mappings: dict[str, str]) -> dict[str, list[str]]:
    """Invert the title->slug map into slug->[notebook titles]."""
    out: dict[str, list[str]] = {}
    for title, slug in mappings.items():
        out.setdefault(slug, []).append(title)
    for slug in out:
        out[slug].sort()
    return out


# --- Runtime resolution ----------------------------------------------------
def candidate_python_runtimes() -> list[Path]:
    """Likely Python executables that may carry notebooklm-py, best first."""
    cands = [
        GLOBAL_AGENT_ROOT / ".venv-notebooklm" / "Scripts" / "python.exe",
        GLOBAL_AGENT_ROOT / ".venv-notebooklm" / "bin" / "python",
        GLOBAL_AGENT_ROOT / "venv" / "Scripts" / "python.exe",   # Windows venv
        GLOBAL_AGENT_ROOT / "venv" / "bin" / "python",           # POSIX venv
    ]
    return [p for p in cands if p.exists()]


def runtime_has_notebooklm(python_exe: Path | None = None) -> bool:
    """True if the given (or current) runtime can import notebooklm."""
    if python_exe is None:
        try:
            import importlib.util

            return importlib.util.find_spec("notebooklm") is not None
        except Exception:
            return False
    try:
        res = subprocess.run(
            [str(python_exe), "-c",
             "import importlib.util,sys;"
             "sys.exit(0 if importlib.util.find_spec('notebooklm') else 1)"],
            capture_output=True, timeout=30,
        )
        return res.returncode == 0
    except Exception:
        return False


def find_notebooklm_python() -> Path | None:
    """Return the first Python runtime that can import notebooklm, or None.

    Checks the current interpreter first, then known global_agent venvs.
    """
    if runtime_has_notebooklm(None):
        return Path(sys.executable)
    for cand in candidate_python_runtimes():
        if runtime_has_notebooklm(cand):
            return cand
    return None


def runtime_report() -> dict[str, Any]:
    """Diagnostic snapshot of the cross-repo runtime situation."""
    nlm_python = find_notebooklm_python()
    return {
        "current_python": sys.executable,
        "current_has_notebooklm": runtime_has_notebooklm(None),
        "notebooklm_python": str(nlm_python) if nlm_python else None,
        "candidate_runtimes": [str(p) for p in candidate_python_runtimes()],
        "portfolio_root": str(PORTFOLIO_ROOT),
        "global_agent_root": str(GLOBAL_AGENT_ROOT),
        "prompts_dir_exists": PROMPTS_DIR.exists(),
        "raw_nlm_dir_exists": RAW_NLM_DIR.exists(),
        "notebooklm_sync_exists": NOTEBOOKLM_SYNC.exists(),
    }


if __name__ == "__main__":
    import json

    mappings = load_approved_mappings()
    s2t = slug_to_titles(mappings)
    print(json.dumps(
        {
            "mapping_count": len(mappings),
            "unique_slugs": len(s2t),
            "cartridges": [c.name for c in CARTRIDGES],
            "default_query_cartridges": list(DEFAULT_QUERY_CARTRIDGES),
            "runtime": runtime_report(),
        },
        indent=2,
    ))

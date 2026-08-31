#!/usr/bin/env python3
"""Validate and sync the canon-approved public relationship projection.

The private canon remains authoritative. This writer accepts only its bounded
public projection, validates the complete shape, verifies every endpoint
against a generated public projects API, and writes a byte-identical static
artifact for the portfolio build. Bare invocation is read-only.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import tempfile


REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CANON_ROOT = Path(os.environ.get("CANON_ROOT", r"D:\GitHub\portfolio-canon"))
DEFAULT_SOURCE = Path("census/project_relationships.public.json")
DEFAULT_DESTINATION = REPO_ROOT / "src" / "data" / "projectRelationships.json"
ALLOWED_TOP_LEVEL_KEYS = {"schema_version", "portfolio_roster_sha256", "relationships"}
ALLOWED_EDGE_KEYS = {"edge_key", "source", "target", "kind", "public_claim"}
ALLOWED_KINDS = {
    "successor_of",
    "derived_from",
    "component_of",
    "variant_of",
    "shares_platform_with",
    "method_transfer_from",
}
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


def load_json(path: Path) -> tuple[bytes, object]:
    raw = path.read_bytes()
    try:
        return raw, json.loads(raw.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise SystemExit(f"[relationships] invalid JSON at {path}: {exc}") from exc


def public_project_ids(path: Path) -> set[str]:
    _, payload = load_json(path)
    if not isinstance(payload, dict) or not isinstance(payload.get("projects"), list):
        raise SystemExit(f"[relationships] projects JSON has no projects array: {path}")
    ids = [project.get("id") for project in payload["projects"] if isinstance(project, dict)]
    if any(not isinstance(project_id, str) or not project_id for project_id in ids):
        raise SystemExit("[relationships] projects JSON contains an invalid project id")
    if len(ids) != len(set(ids)):
        raise SystemExit("[relationships] projects JSON contains duplicate project ids")
    return set(ids)


def validate_projection(payload: object, project_ids: set[str]) -> list[dict[str, str]]:
    if not isinstance(payload, dict) or set(payload) != ALLOWED_TOP_LEVEL_KEYS:
        raise SystemExit("[relationships] projection has unexpected top-level keys")
    if payload["schema_version"] != 2:
        raise SystemExit("[relationships] projection schema_version must be 2")
    if not isinstance(payload["portfolio_roster_sha256"], str) or not SHA256_RE.fullmatch(
        payload["portfolio_roster_sha256"]
    ):
        raise SystemExit("[relationships] portfolio_roster_sha256 is invalid")
    relationships = payload["relationships"]
    if not isinstance(relationships, list):
        raise SystemExit("[relationships] relationships must be an array")

    seen: set[str] = set()
    prior_key = ""
    for index, edge in enumerate(relationships):
        if not isinstance(edge, dict) or set(edge) != ALLOWED_EDGE_KEYS:
            raise SystemExit(f"[relationships] edge {index} has unexpected keys")
        if any(not isinstance(edge[key], str) or not edge[key].strip() for key in ALLOWED_EDGE_KEYS):
            raise SystemExit(f"[relationships] edge {index} contains an empty field")
        if edge["kind"] not in ALLOWED_KINDS:
            raise SystemExit(f"[relationships] edge {index} has invalid kind {edge['kind']!r}")
        expected_key = f"{edge['source']}::{edge['kind']}::{edge['target']}"
        if edge["edge_key"] != expected_key:
            raise SystemExit(f"[relationships] edge {index} key does not match its endpoints/kind")
        if edge["edge_key"] in seen:
            raise SystemExit(f"[relationships] duplicate edge key: {edge['edge_key']}")
        if edge["edge_key"] <= prior_key:
            raise SystemExit("[relationships] edges must be strictly sorted by edge_key")
        if edge["source"] == edge["target"]:
            raise SystemExit(f"[relationships] self edge is forbidden: {edge['edge_key']}")
        unknown = {edge["source"], edge["target"]} - project_ids
        if unknown:
            raise SystemExit(
                f"[relationships] edge {edge['edge_key']} has unknown endpoint(s): {sorted(unknown)}"
            )
        seen.add(edge["edge_key"])
        prior_key = edge["edge_key"]
    return relationships


def canonical_bytes(payload: object) -> bytes:
    return (json.dumps(payload, indent=2, ensure_ascii=False) + "\n").encode("utf-8")


def atomic_write(path: Path, content: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    descriptor, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", dir=path.parent)
    temporary = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "wb") as handle:
            handle.write(content)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
    finally:
        if temporary.exists():
            temporary.unlink()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--canon-root", type=Path, default=DEFAULT_CANON_ROOT)
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--destination", type=Path, default=DEFAULT_DESTINATION)
    parser.add_argument("--projects-json", type=Path, required=True)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()

    source = args.source if args.source.is_absolute() else args.canon_root / args.source
    source_raw, payload = load_json(source)
    project_ids = public_project_ids(args.projects_json)
    relationships = validate_projection(payload, project_ids)
    normalized = canonical_bytes(payload)
    if source_raw != normalized:
        raise SystemExit("[relationships] canon projection is not canonical JSON with a final newline")

    destination = args.destination.resolve()
    if args.write:
        atomic_write(destination, source_raw)
        action = "wrote"
    else:
        if not destination.is_file() or destination.read_bytes() != source_raw:
            raise SystemExit(f"[relationships] public projection drift: {destination}")
        action = "verified"

    covered = {endpoint for edge in relationships for endpoint in (edge["source"], edge["target"])}
    digest = hashlib.sha256(source_raw).hexdigest()
    print(
        f"[relationships] {action} {len(relationships)} edges / {len(covered)} projects; "
        f"source_sha256={digest}; roster={len(project_ids)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

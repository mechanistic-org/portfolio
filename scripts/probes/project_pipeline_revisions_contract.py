#!/usr/bin/env python3
"""Focused fail-closed and withdrawal contract for revision sidecars."""

import importlib.util
import json
from pathlib import Path
import tempfile


REPO_ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location(
    "project_pipeline", REPO_ROOT / "scripts" / "project_pipeline.py"
)
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)


def valid_payload():
    return {
        "schema_version": "1.0",
        "project": "c24",
        "title": "Revision records",
        "context": "Document dates, not approval dates or exhaustive history.",
        "parts": [
            {
                "part": "P-1",
                "label": "Assembly",
                "related_scar_anchor": "scar-one",
                "revs": [
                    {
                        "rev": "1",
                        "date": "2006-04-21",
                        "date_basis": "drawing-revision-table",
                        "source_ids": ["LK-one"],
                    },
                    {
                        "rev": "2",
                        "date": "2006-05-03",
                        "date_basis": "eco-document",
                        "source_ids": ["LK-two"],
                        "factual_note": "A bounded fact.",
                        "scar_anchor": "scar-one",
                    },
                ],
            }
        ],
    }


def expect_error(canon, payload, message):
    canon.write_text(json.dumps(payload), encoding="utf-8")
    try:
        pipeline.revisions_bytes(
            ["evidence:LK-one", "evidence:LK-two"], [{"anchor": "scar-one"}]
        )
    except ValueError as exc:
        assert message in str(exc), str(exc)
    else:
        raise AssertionError(f"expected validation error containing {message!r}")


with tempfile.TemporaryDirectory(prefix="c24-revisions-contract-") as temporary:
    root = Path(temporary)
    canon_dir = root / "canon"
    site_dir = root / "site"
    out_dir = root / "out"
    canon_dir.mkdir()
    site_dir.mkdir()
    out_dir.mkdir()
    canon = canon_dir / "_revisions.json"
    site_target = site_dir / "_revisions.json"
    out_target = out_dir / "_revisions.json"
    sibling = site_dir / "_chronology.json"
    pipeline.CANON_REVISIONS = str(canon)
    pipeline.SITE_REVISIONS = str(site_target)

    payload = valid_payload()
    canonical_bytes = (json.dumps(payload, indent=2) + "\n").encode()
    canon.write_bytes(canonical_bytes)
    assert pipeline.revisions_bytes(
        ["evidence:LK-one", "evidence:LK-two"], [{"anchor": "scar-one"}]
    ) == canonical_bytes

    invalid = valid_payload()
    invalid["parts"][0]["revs"][0]["date"] = "2006-02-30"
    expect_error(canon, invalid, "invalid ISO date")
    invalid = valid_payload()
    invalid["parts"][0]["revs"][1]["source_ids"] = ["LK-missing"]
    expect_error(canon, invalid, "undeclared evidence id")
    invalid = valid_payload()
    invalid["parts"][0]["revs"][1]["rev"] = "1"
    expect_error(canon, invalid, "duplicated")
    invalid = valid_payload()
    invalid["parts"][0]["revs"][1]["scar_anchor"] = "scar-missing"
    expect_error(canon, invalid, "unknown scar anchor")
    invalid = valid_payload()
    invalid["context"] = "Private D:/portfolio_working locator"
    expect_error(canon, invalid, "private evidence locator")

    canon.unlink()
    out_target.write_bytes(b'{"stale":true}\n')
    pipeline.sync_optional_sidecar(str(out_target), None)
    assert not out_target.exists()
    sibling.write_bytes(b'{"preserve":true}\n')
    site_target.write_bytes(b'{"stale":true}\n')
    pipeline.sync_optional_sidecar(str(site_target), None)
    assert not site_target.exists()
    assert sibling.read_bytes() == b'{"preserve":true}\n'

print("PASS revisions pipeline: strict dates/sources/duplicates/scars/paths and isolated withdrawal")

#!/usr/bin/env python3
"""Focused contract checks for entropy provenance and chronology date parity."""

import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "scripts"))

import project_pipeline  # noqa: E402


chronology = json.dumps(
    {
        "events": [
            {"id": "shared-event", "date": "2007-03-07"},
            {"id": "documentary-only", "date": "2007-11-07"},
        ]
    }
).encode("utf-8")

project_pipeline.validate_entropy(
    [
        {
            "id": "shared-event",
            "date": "2007-03-07",
            "score": 9,
            "source_ref": "Curtis.3.7.07.pdf",
        },
        {
            "date": "2007-04-25",
            "score": 9,
            "source_ref": "headphone-redesign.msg",
        },
    ],
    chronology,
)

try:
    project_pipeline.validate_entropy(
        [{"id": "shared-event", "date": "2006-11-15", "score": 9, "source_ref": "status.pdf"}],
        chronology,
    )
except ValueError as exc:
    assert "date divergence" in str(exc)
else:
    raise AssertionError("date-divergent shared identity was accepted")

try:
    project_pipeline.validate_entropy(
        [{"id": "shared-event", "date": "2007-03-07", "score": 9}],
        chronology,
    )
except ValueError as exc:
    assert "needs source_ref" in str(exc)
else:
    raise AssertionError("entropy event without source_ref was accepted")

print("PASS entropy pipeline: source_ref required; shared identities require date parity")

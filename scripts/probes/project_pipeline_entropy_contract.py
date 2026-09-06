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
            {
                "id": "interval-event",
                "date": "2007-10-03",
                "end_date": "2007-10-24",
            },
        ]
    }
).encode("utf-8")


def expect_error(events, message, chronology_payload=chronology):
    try:
        project_pipeline.validate_entropy(events, chronology_payload)
    except ValueError as exc:
        assert message in str(exc), str(exc)
    else:
        raise AssertionError(f"expected validation error containing {message!r}")


project_pipeline.validate_entropy(
    [
        {
            "chronology_event_id": "shared-event",
            "date": "2007-03-07",
            "score": 9,
            "source_ref": "Curtis.3.7.07.pdf",
        },
        {
            "chronology_event_id": "interval-event",
            "chronology_date_field": "end_date",
            "date": "2007-10-24",
            "score": 6,
            "source_ref": "Curtis.10.24.07.pdf",
        },
        {
            "date": "2007-04-25",
            "score": 9,
            "source_ref": "headphone-redesign.msg",
        },
    ],
    chronology,
)

expect_error(
    [
        {
            "chronology_event_id": "shared-event",
            "date": "2006-11-15",
            "score": 9,
            "source_ref": "status.pdf",
        }
    ],
    "date divergence",
)
expect_error(
    [
        {
            "chronology_event_id": "interval-event",
            "chronology_date_field": "end_date",
            "date": "2007-10-23",
            "score": 6,
            "source_ref": "status.pdf",
        }
    ],
    "date divergence",
)
expect_error(
    [{"date": "2007-03-07", "score": 9}],
    "needs source_ref",
)
expect_error(
    [
        {
            "chronology_event_id": "missing-event",
            "date": "2007-03-07",
            "score": 9,
            "source_ref": "status.pdf",
        }
    ],
    "unknown chronology event id",
)
expect_error(
    [
        {
            "chronology_date_field": "end_date",
            "date": "2007-10-24",
            "score": 6,
            "source_ref": "status.pdf",
        }
    ],
    "needs chronology_event_id",
)
expect_error(
    [
        {
            "chronology_event_id": "shared-event",
            "date": "2007-03-07",
            "score": 9,
            "source_ref": "status.pdf",
        }
    ],
    "linked entropy event needs chronology",
    None,
)

print(
    "PASS entropy pipeline: source_ref required; explicit event/date-field links fail closed"
)

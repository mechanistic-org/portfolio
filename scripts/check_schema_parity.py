#!/usr/bin/env python3
"""
Top-level schema drift check for portfolio#61.

This intentionally checks only the Projects collection's top-level fields.
Nested object members are not Keystatic collection fields and should not be
reported as drift.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

DETACHED_PROJECT_FIELDS = {
    # Deprecated or sidecar-first deep-dive payloads. These are rendered by
    # Astro and local sidecars, not edited directly in Keystatic.
    "bom",
    "complexity_vector",
    "events",
    "forensic_data",
    "forensic_metrics",
    "forensic_summary",
    "isomorphics",
    "metrics",
    "phase_stats",
    "scars",
    "timeline",
}


class ParseError(RuntimeError):
    pass


def _find_balanced_body(source: str, open_index: int) -> str:
    if open_index < 0 or source[open_index] != "{":
        raise ParseError("balanced body search must start at an opening brace")

    depth = 0
    quote: str | None = None
    in_line_comment = False
    in_block_comment = False
    escape = False

    for index in range(open_index, len(source)):
        char = source[index]
        next_char = source[index + 1] if index + 1 < len(source) else ""

        if in_line_comment:
            if char in "\r\n":
                in_line_comment = False
            continue

        if in_block_comment:
            if char == "*" and next_char == "/":
                in_block_comment = False
            continue

        if quote:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == quote:
                quote = None
            continue

        if char == "/" and next_char == "/":
            in_line_comment = True
            continue

        if char == "/" and next_char == "*":
            in_block_comment = True
            continue

        if char in ("'", '"', "`"):
            quote = char
            continue

        if char == "{":
            depth += 1
            continue

        if char == "}":
            depth -= 1
            if depth == 0:
                return source[open_index + 1 : index]

    raise ParseError("unterminated object body")


def _extract_top_level_keys(object_body: str) -> set[str]:
    keys: set[str] = set()
    index = 0
    depth = 0
    quote: str | None = None
    in_line_comment = False
    in_block_comment = False
    escape = False

    while index < len(object_body):
        char = object_body[index]
        next_char = object_body[index + 1] if index + 1 < len(object_body) else ""

        if in_line_comment:
            if char in "\r\n":
                in_line_comment = False
            index += 1
            continue

        if in_block_comment:
            if char == "*" and next_char == "/":
                in_block_comment = False
                index += 2
                continue
            index += 1
            continue

        if quote:
            if escape:
                escape = False
            elif char == "\\":
                escape = True
            elif char == quote:
                quote = None
            index += 1
            continue

        if char == "/" and next_char == "/":
            in_line_comment = True
            index += 2
            continue

        if char == "/" and next_char == "*":
            in_block_comment = True
            index += 2
            continue

        if char in ("'", '"', "`"):
            quote = char
            index += 1
            continue

        if char in "{[(":
            depth += 1
            index += 1
            continue

        if char in "}])":
            depth -= 1
            index += 1
            continue

        if depth == 0 and (char.isalpha() or char == "_"):
            match = re.match(r"[A-Za-z_][A-Za-z0-9_]*", object_body[index:])
            if match:
                name = match.group(0)
                after_name = index + len(name)
                if object_body[after_name:].lstrip().startswith(":"):
                    keys.add(name)
                    index = after_name
                    continue

        index += 1

    return keys


def _project_zod_body(source: str) -> str:
    marker = "const projectsCollection"
    start = source.find(marker)
    if start == -1:
        raise ParseError("could not find projectsCollection")

    zod_call = source.find("z.object", start)
    if zod_call == -1:
        raise ParseError("could not find projectsCollection z.object")

    open_brace = source.find("{", zod_call)
    return _find_balanced_body(source, open_brace)


def _project_keystatic_schema_body(source: str) -> str:
    marker = "projects: collection"
    start = source.find(marker)
    if start == -1:
        raise ParseError("could not find Keystatic projects collection")

    collection_open = source.find("{", start)
    collection_body = _find_balanced_body(source, collection_open)
    schema_match = re.search(r"\bschema\s*:", collection_body)
    if not schema_match:
        raise ParseError("could not find Keystatic projects schema")

    schema_open = collection_body.find("{", schema_match.end())
    return _find_balanced_body(collection_body, schema_open)


def get_project_zod_fields(source: str) -> set[str]:
    return _extract_top_level_keys(_project_zod_body(source))


def get_project_keystatic_fields(source: str) -> set[str]:
    return _extract_top_level_keys(_project_keystatic_schema_body(source))


def find_missing_fields(zod_source: str, keystatic_source: str) -> list[str]:
    zod_fields = get_project_zod_fields(zod_source)
    keystatic_fields = get_project_keystatic_fields(keystatic_source)
    return sorted(zod_fields - keystatic_fields - DETACHED_PROJECT_FIELDS)


def main() -> int:
    parser = argparse.ArgumentParser(description="Check Projects schema parity.")
    parser.add_argument("--advisory", action="store_true", help="Report drift but exit 0.")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent.parent
    zod_path = root / "src" / "content.config.ts"
    keystatic_path = root / "keystatic.config.tsx"

    try:
        zod_source = zod_path.read_text(encoding="utf-8")
        keystatic_source = keystatic_path.read_text(encoding="utf-8")
        missing = find_missing_fields(zod_source, keystatic_source)
    except OSError as error:
        print(f"[schema-parity] ERROR: {error}", file=sys.stderr)
        return 1
    except ParseError as error:
        print(f"[schema-parity] ERROR: {error}", file=sys.stderr)
        return 1

    if missing:
        print("[schema-parity] Drift detected: Zod project fields missing in Keystatic")
        for field in missing:
            print(f"  - {field}")
        print("\nAdd these top-level fields to keystatic.config.tsx or add an intentional exception.")
        return 0 if args.advisory else 1

    print("[schema-parity] OK: Projects Zod top-level fields match Keystatic")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

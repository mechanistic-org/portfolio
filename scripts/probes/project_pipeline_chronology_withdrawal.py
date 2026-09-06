#!/usr/bin/env python3
"""Integration regression contract for optional chronology-sidecar withdrawal."""

import importlib.util
from pathlib import Path
import tempfile


REPO_ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location(
    "project_pipeline", REPO_ROOT / "scripts" / "project_pipeline.py"
)
pipeline = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pipeline)


with tempfile.TemporaryDirectory(prefix="c24-chronology-withdrawal-") as temporary:
    root = Path(temporary)
    canon_dir = root / "canon"
    site_dir = root / "site"
    out_dir = root / "out"
    registry = root / "evidence.jsonl"
    canon = canon_dir / "_chronology.json"
    site_target = site_dir / "_chronology.json"
    out_target = out_dir / "_chronology.json"
    sibling = site_dir / "_entropy.json"
    canon_dir.mkdir()
    site_dir.mkdir()
    out_dir.mkdir()
    registry.write_text("", encoding="utf-8")
    (canon_dir / "c24.md").write_text(
        "---\ntitle: Sample\nslug: c24\nsources: []\n---\nBody\n", encoding="utf-8"
    )
    (site_dir / "index.mdx").write_text(
        "---\ntitle: Sample\nslug: c24\n---\nBody\n", encoding="utf-8"
    )

    pipeline.CANON_DIR = str(canon_dir)
    pipeline.CANON_REC = str(canon_dir / "c24.md")
    pipeline.CANON_CHRONOLOGY = str(canon)
    pipeline.SITE_DIR = str(site_dir)
    pipeline.SITE_MDX = str(site_dir / "index.mdx")
    pipeline.SITE_CHRONOLOGY = str(site_target)
    pipeline.SITE_ENTROPY = str(sibling)
    pipeline.OUT_DIR = str(out_dir)
    pipeline.EVIDENCE_ROOT = str(root)
    pipeline.EVIDENCE_REGISTRY = str(registry)

    out_target.write_bytes(b'{"stale":true}\n')
    pipeline.WRITE_LIVE = False
    pipeline.generate()
    assert not out_target.exists()
    assert pipeline.verify()

    out_target.write_bytes(b'{"stale":true}\n')
    assert not pipeline.verify()
    out_target.unlink()

    site_target.write_bytes(b'{"stale":true}\n')
    sibling.write_bytes(b'{"preserve":true}\n')
    assert not pipeline.verify()
    pipeline.WRITE_LIVE = True
    pipeline.generate()
    assert not site_target.exists()
    assert sibling.read_bytes() == b'{"preserve":true}\n'

    canonical_bytes = b'{"schema_version":"1.0"}\n'
    canon.write_bytes(canonical_bytes)
    pipeline.sync_optional_sidecar(str(site_target), canonical_bytes)
    assert site_target.read_bytes() == canonical_bytes
    assert pipeline.optional_sidecar_matches_authority(str(canon), str(site_target))

print("PASS chronology withdrawal: generate removes stale targets, verify fails drift, siblings survive")

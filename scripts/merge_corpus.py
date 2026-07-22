import argparse
import datetime
import hashlib
import os

# --- CONFIGURATION (defaults; override with --skeptic / --physics / --out) ---
# Corpus home ruled 2026-07-21: canon vault, NOT the site tree (the docs
# collection publishes to the live site). Versioned by the canon repo plus the
# provenance block written into the header.
BASE_DIR = r"D:\GitHub\portfolio-workspace\podcasts"
SKEPTIC_FILE = os.path.join(BASE_DIR, "skeptic_clips.md")
PHYSICS_FILE = os.path.join(BASE_DIR, "physics_ingenuity_clips.md")
TARGET_FILE = r"H:\workspace\canon\_calibration\GOLDEN_DIALOGUE_CORPUS.md"
VERSION_TAG = "v5"

HEADER_TEMPLATE = """# Golden Dialogue Corpus (The Frankenstein Primer)

> **CONTEXT:** This document contains curated "Perfect Moments" of banter, technical skepticism, and "Red Gold" metaphors from previous podcasts.
> **USAGE:** This file is to be provided to the Audio Host as a "Leaked Internal Transcript" (`leaked_transcript_{version}.txt`) to force-align the style.
> **PROVENANCE:** {version} | generated {date} by portfolio/scripts/merge_corpus.py
> - Section 1 input: {skeptic_name} ({skeptic_bytes:,} bytes, md5 {skeptic_md5})
> - Section 2 input: {physics_name} ({physics_bytes:,} bytes, md5 {physics_md5})

---

"""


def md5_of(path):
    hasher = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def main():
    ap = argparse.ArgumentParser(
        description="Fuse skeptic + physics clip files into the Golden Dialogue Corpus"
    )
    ap.add_argument("--skeptic", default=SKEPTIC_FILE, help="skeptic clips input")
    ap.add_argument("--physics", default=PHYSICS_FILE, help="physics/ingenuity clips input")
    ap.add_argument("--out", default=TARGET_FILE, help="corpus output (canon home)")
    ap.add_argument("--version-tag", default=VERSION_TAG, help="corpus version tag (e.g. v5)")
    args = ap.parse_args()

    print(f"Reading {args.skeptic}...")
    with open(args.skeptic, "r", encoding="utf-8") as f:
        skeptic_content = f.read()

    print(f"Reading {args.physics}...")
    with open(args.physics, "r", encoding="utf-8") as f:
        physics_content = f.read()

    header = HEADER_TEMPLATE.format(
        version=args.version_tag,
        date=datetime.date.today().isoformat(),
        skeptic_name=os.path.basename(args.skeptic),
        skeptic_bytes=os.path.getsize(args.skeptic),
        skeptic_md5=md5_of(args.skeptic),
        physics_name=os.path.basename(args.physics),
        physics_bytes=os.path.getsize(args.physics),
        physics_md5=md5_of(args.physics),
    )

    print(f"Writing to {args.out}...")
    with open(args.out, "w", encoding="utf-8") as f:
        f.write(header)
        f.write("## Section 1: Brewer/Red Team (Skepticism)\n\n")
        f.write(skeptic_content)
        f.write("\n\n---\n\n")
        f.write("## Section 2: Physics & Ingenuity (MacGyver Moments)\n\n")
        f.write(physics_content)

    print(f"Done. Final size: {os.path.getsize(args.out):,} bytes")


if __name__ == "__main__":
    main()

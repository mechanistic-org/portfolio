import argparse
import os
import glob
import re

# --- CONFIGURATION (defaults; override with --dirs / --out) ---
TRANSCRIPT_DIR = r"D:\GitHub\portfolio-workspace\podcasts"
OUTPUT_FILE = r"D:\GitHub\portfolio-workspace\podcasts\physics_ingenuity_clips.md"

# --- THEMATIC HEURISTICS ---
# Trigger vocabulary recovered from the 2026-01-26 generation of this file
# (the original miner script was never committed). Left word-boundary matching
# keeps morphological variants (tolerances, hacked) while dropping mid-word
# false positives (shack, megaphysics).
PHYSICS_TRIGGERS = [
    "thermal",
    "thermodynamics",
    "heat",
    "celsius",
    "degrees",
    "watts",
    "cfm",
    "airflow",
    "convection",
    "plastic",
    "steel",
    "aluminum",
    "material",
    "density",
    "mass",
    "tolerance",
    "millimeter",
    "micron",
    "geometry",
    "stress",
    "friction",
    "force",
    "load",
    "torque",
    "vibration",
    "rigidity",
    "physics",
]

INGENUITY_TRIGGERS = [
    "crisis",
    "impossible",
    "deadline",
    "fire drill",
    "crunch time",
    "under pressure",
    "scramble",
    "macgyver",
    "workaround",
    "retrofit",
    "radical",
    "novel",
    "innovation",
    "unique",
    "miracle",
    "new approach",
    "on the fly",
    "first time",
    "breakthrough",
    "hack",
]

# Exact-word overrides for stems the prefix matcher over-triggers
# ("massive", figurative "forced a redesign" — 2026-07-21 QA findings).
PATTERN_OVERRIDES = {
    "mass": r"\bmass\b",
    "force": r"\bforces?\b",
}

CATEGORIES = [
    ("⚛️ PHYSICS", PHYSICS_TRIGGERS),
    ("🛠️ INGENUITY", INGENUITY_TRIGGERS),
]

COMPILED = [
    (category, trigger,
     re.compile(PATTERN_OVERRIDES.get(trigger, r"\b" + re.escape(trigger))))
    for category, triggers in CATEGORIES
    for trigger in triggers
]

CONTEXT_WINDOW = 4  # Lines before and after to capture the full banter

# Whisper hallucination collapse shows up as mixed-script garbage
# (CJK/Hangul/Cyrillic/Hebrew) or degenerate repetition loops.
GARBAGE_CHARS = re.compile(r"[Ѐ-ӿ֐-׿一-鿿가-힯]")
MAX_LINE_REPEATS = 3


def is_garbage(chunk_lines):
    text = "\n".join(chunk_lines)
    if GARBAGE_CHARS.search(text):
        return True
    prefixes = {}
    for line in chunk_lines:
        # Degenerate loops repeat with small mutations ("Or is it...",
        # "Or is it reallybt..."), so count shared line prefixes.
        p = line[:8]
        prefixes[p] = prefixes.get(p, 0) + 1
        if prefixes[p] > MAX_LINE_REPEATS:
            return True
    return False


def load_transcripts(dirs):
    files = []
    for d in dirs:
        files += glob.glob(os.path.join(d, "*.transcript.txt"))
    return files


def extract_chunks(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    lines = content.split("\n")

    # Handle single-line transcripts: split by sentence endings to create
    # pseudo-lines for granular matching (same normalization as mine_skepticism).
    if len(lines) < 5 and len(content) > 500:
        content = re.sub(r"([.?!])\s+", r"\1\n", content)
        lines = content.split("\n")

    chunks = []
    next_allowed = 0  # suppress sliding-window near-duplicates

    for i, line in enumerate(lines):
        if i < next_allowed:
            continue
        line_lower = line.lower()

        hit = None
        for category, trigger, pattern in COMPILED:
            if pattern.search(line_lower):
                hit = (category, trigger)
                break

        if hit:
            start = max(0, i - CONTEXT_WINDOW)
            end = min(len(lines), i + CONTEXT_WINDOW + 1)
            chunk_lines = [c.strip() for c in lines[start:end] if c.strip()]
            if chunk_lines and not is_garbage(chunk_lines):
                chunks.append((hit[0], hit[1], "\n".join(chunk_lines)))
                next_allowed = i + CONTEXT_WINDOW + 1

    return chunks


def main():
    ap = argparse.ArgumentParser(
        description="Mine podcast transcripts for physics/ingenuity clips"
    )
    ap.add_argument("--dirs", nargs="*", default=[TRANSCRIPT_DIR],
                    help="transcript directories to sweep (default: the podcasts dir)")
    ap.add_argument("--out", default=OUTPUT_FILE, help="output clips file")
    args = ap.parse_args()

    files = load_transcripts(args.dirs)
    print(f"⚛️  Scanning {len(files)} transcripts for Physics & Ingenuity...")

    total_clips = 0
    files_with_clips = 0

    with open(args.out, "w", encoding="utf-8") as out:
        out.write("# Physics & Ingenuity Clips (MacGyver Moments)\n\n")
        out.write("> Auto-mined based on thematic heuristics (Physics + MacGyver/Pressure).\n\n")

        for file_path in files:
            filename = os.path.basename(file_path)
            clips = extract_chunks(file_path)

            if not clips:
                continue

            files_with_clips += 1
            out.write(f"## 🎧 {filename}\n\n")

            seen_content = set()
            for category, trigger, text in clips:
                if text in seen_content:
                    continue
                seen_content.add(text)

                out.write(f"### {category} (Trigger: `{trigger}`)\n\n")
                out.write("```text\n")
                out.write(text)
                out.write("\n```\n\n")
                total_clips += 1

            out.write("---\n\n")

    print(f"✅ Found {total_clips} clips across {files_with_clips}/{len(files)} transcripts.")
    print(f"📄 Report written to: {args.out}")


if __name__ == "__main__":
    main()

import argparse
import os
import glob
import re

# --- CONFIGURATION (defaults; override with --dirs / --out) ---
TRANSCRIPT_DIR = r"D:\GitHub\portfolio-workspace\podcasts"
OUTPUT_FILE = r"D:\GitHub\portfolio-workspace\podcasts\skeptic_clips.md"

# --- SKEPTIC HEURISTICS ---
# Patterns that indicate a host is pushing back, questioning, or identifying a crisis.
SKEPTIC_TRIGGERS = [
    r"wait, hold on",
    r"hang on a second",
    r"are you saying",
    r"let me get this straight",
    r"that sounds impossible",
    r"red team",
    r"devils advocate",
    r"to be honest",
    r"frankly",
    r"nightmare",
    r"disaster",
    r"unmitigated failure",
    r"catastrophe",
    r"stop ship",
    r"line down",
    r"but wait",
    r"doesn't add up",
    r"skeptical",
    r"red flag",
    r"audit",
    r"forensic",
    r"brutal reality",
    r"unforgiving",
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
        # Degenerate loops repeat with small mutations, so count shared
        # line prefixes rather than identical lines.
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
    
    # Split by some reasonable delimiter if possible, but Whisper output is often one big block or lines.
    # Assuming lines for now based on previous file reads.
    lines = content.split('\n')
    
    # Handle single-line transcripts (common in some formats)
    if len(lines) < 5 and len(content) > 500:
        # Split by sentence endings to create pseudo-lines for granular matching
        # Normalized to roughly one sentence per line
        content = re.sub(r'([.?!])\s+', r'\1\n', content)
        lines = content.split('\n')
    
    chunks = []
    next_allowed = 0  # suppress sliding-window near-duplicates

    for i, line in enumerate(lines):
        if i < next_allowed:
            continue
        line_lower = line.lower()

        # Check for triggers
        for trigger in SKEPTIC_TRIGGERS:
            if re.search(trigger, line_lower):
                # We found a trigger. Let's grab context.
                start = max(0, i - CONTEXT_WINDOW)
                end = min(len(lines), i + CONTEXT_WINDOW + 1)

                chunk_lines = [c.strip() for c in lines[start:end] if c.strip()]

                if chunk_lines and not is_garbage(chunk_lines):
                    chunks.append((trigger, "\n".join(chunk_lines)))
                    next_allowed = i + CONTEXT_WINDOW + 1
                break # Only match once per line to avoid dupes

    return chunks

def main():
    ap = argparse.ArgumentParser(description="Mine podcast transcripts for skeptic/red-team clips")
    ap.add_argument("--dirs", nargs="*", default=[TRANSCRIPT_DIR],
                    help="transcript directories to sweep (default: the podcasts dir)")
    ap.add_argument("--out", default=OUTPUT_FILE, help="output clips file")
    args = ap.parse_args()

    files = load_transcripts(args.dirs)
    print(f"🕵️  Scanning {len(files)} transcripts for Skepticism...")

    with open(args.out, "w", encoding="utf-8") as out:
        out.write("# Skeptic & Red Team Clips\n\n")
        out.write("> Auto-mined based on skepticism heuristics.\n\n")
        
        total_clips = 0
        
        for file_path in files:
            filename = os.path.basename(file_path)
            clips = extract_chunks(file_path)
            
            if clips:
                out.write(f"## 🎧 {filename}\n")
                # Deduplicate loosely based on content overlap? 
                # For now, just dump. User will curate.
                
                unique_clips = []
                seen_content = set()
                
                for trigger, text in clips:
                    # Simple automated dedup
                    if text not in seen_content:
                        seen_content.add(text)
                        
                        out.write(f"**Trigger:** `{trigger}`\n")
                        out.write("```text\n")
                        out.write(text)
                        out.write("\n```\n\n")
                        total_clips += 1
                
                out.write("---\n\n")
    
    print(f"✅ Found {total_clips} potential skeptic clips.")
    print(f"📄 Report written to: {args.out}")

if __name__ == "__main__":
    main()

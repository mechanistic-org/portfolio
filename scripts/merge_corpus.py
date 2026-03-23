import os

# Define paths
base_dir = r"D:\GitHub\portfolio-workspace\podcasts"
target_file = r"D:\GitHub\portfolio\src\content\docs\meta\GOLDEN_DIALOGUE_CORPUS.md"

skeptic_file = os.path.join(base_dir, "skeptic_clips.md")
physics_file = os.path.join(base_dir, "physics_ingenuity_clips.md")

header = """# Golden Dialogue Corpus (The Frankenstein Primer)

> **CONTEXT:** This documents contains curated "Perfect Moments" of banter, technical skepticism, and "Red Gold" metaphors from previous podcasts.
> **USAGE:** This file is to be provided to the Audio Host as a "Leaked Internal Transcript" (`leaked_transcript_v4.txt`) to force-align the style.

---

"""

print(f"Reading {skeptic_file}...")
with open(skeptic_file, "r", encoding="utf-8") as f:
    skeptic_content = f.read()

print(f"Reading {physics_file}...")
with open(physics_file, "r", encoding="utf-8") as f:
    physics_content = f.read()

print(f"Writing to {target_file}...")
with open(target_file, "w", encoding="utf-8") as f:
    f.write(header)
    f.write("## Section 1: Brewer/Red Team (Skepticism)\n\n")
    f.write(skeptic_content)
    f.write("\n\n---\n\n")
    f.write("## Section 2: Physics & Ingenuity (MacGyver Moments)\n\n")
    f.write(physics_content)

print(f"Done. Final size: {os.path.getsize(target_file)} bytes")

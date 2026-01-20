import os
import glob
import re

# --- CONFIGURATION ---
TRANSCRIPT_DIR = r"D:\GitHub\eriknorris-workspace\podcasts"
OUTPUT_FILE = r"D:\GitHub\eriknorris-workspace\podcasts\physics_ingenuity_clips.md"

# --- THEME HEURISTICS ---
THEMES = {
    "PHYSICS": [
        r"thermodynamics", r"physics", r"thermal", r"heat", r"degrees", r"celsius", 
        r"watts", r"airflow", r"cfm", r"tolerance", r"micron", r"millimeter", 
        r"stress", r"strain", r"load", r"force", r"torque", r"material", 
        r"plastic", r"steel", r"aluminum", r"density", r"mass", r"geometry",
        r"friction", r"vibration", r"stiffness", r"rigidity", r"convection"
    ],
    "INGENUITY": [
        # Novelty & Innovation
        r"novel", r"unique", r"first time", r"never been done", r"innovation", 
        r"invented", r"patent", r"breakthrough", r"radical", r"new approach",
        
        # MacGyver / Hacks / Workarounds
        r"macgyver", r"jerry rig", r"hack", r"workaround", r"kludge", r"improvise", 
        r"on the fly", r"duct tape", r"bodge", r"retrofit", r"clever fix",
        
        # Pressure / Crisis Response
        r"under pressure", r"gun to", r"clock was ticking", r"deadline", 
        r"crisis", r"fire drill", r"scramble", r"save the day", r"eleventh hour",
        r"hail mary", r"do or die", r"crunch time", r"impossible", r"miracle"
    ]
}

CONTEXT_WINDOW = 4

def load_transcripts():
    return glob.glob(os.path.join(TRANSCRIPT_DIR, "*.transcript.txt"))

def extract_chunks(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    lines = content.split('\n')
    
    # Handle single-line transcripts (common in some formats)
    if len(lines) < 5 and len(content) > 500:
        # Split by sentence endings to create pseudo-lines for granular matching
        # Normalized to roughly one sentence per line
        content = re.sub(r'([.?!])\s+', r'\1\n', content)
        lines = content.split('\n')

    chunks = []
    
    for i, line in enumerate(lines):
        line_lower = line.lower()
        
        matches_in_line = []
        
        # Check against all themes
        for theme, triggers in THEMES.items():
            for trigger in triggers:
                if re.search(r"\b" + trigger + r"\b", line_lower):
                    matches_in_line.append((theme, trigger))
                    # Don't break here, find all triggers in the line? 
                    # Actually, just finding one trigger per theme is enough to tag the theme.
                    break 
        
        if matches_in_line:
            start = max(0, i - CONTEXT_WINDOW)
            end = min(len(lines), i + CONTEXT_WINDOW + 1)
            chunk = lines[start:end]
            chunk_text = "\n".join([c.strip() for c in chunk if c.strip()])
            
            if chunk_text:
                for theme, trigger in matches_in_line:
                    chunks.append({
                        "theme": theme,
                        "trigger": trigger,
                        "text": chunk_text
                    })
                
    return chunks

def main():
    files = load_transcripts()
    print(f"🔬 Scanning {len(files)} transcripts for Physics & Ingenuity...")
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
        out.write("# Physics & Ingenuity Clips\n\n")
        out.write("> Auto-mined based on thematic heuristics (Physics + MacGyver/Pressure).\n\n")
        
        clip_counts = {"PHYSICS": 0, "INGENUITY": 0}
        
        for file_path in files:
            filename = os.path.basename(file_path)
            clips = extract_chunks(file_path)
            
            if clips:
                out.write(f"## 🎧 {filename}\n")
                
                seen_content = set()
                
                for clip in clips:
                    # Deduplicate within file
                    if clip["text"] not in seen_content:
                        seen_content.add(clip["text"])
                        # Default to 0 if key missing (safety)
                        if clip["theme"] in clip_counts:
                            clip_counts[clip["theme"]] += 1
                        
                        icon = "⚛️" if clip["theme"] == "PHYSICS" else "🛠️"
                        out.write(f"### {icon} {clip['theme']} (Trigger: `{clip['trigger']}`)\n")
                        out.write("```text\n")
                        out.write(clip["text"])
                        out.write("\n```\n\n")
                
                out.write("---\n\n")
    
    print(f"✅ Physics Clips: {clip_counts.get('PHYSICS', 0)}")
    print(f"✅ Ingenuity Clips: {clip_counts.get('INGENUITY', 0)}")
    print(f"📄 Report written to: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()

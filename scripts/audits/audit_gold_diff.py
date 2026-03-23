import os
import re
import glob

# --- CONFIGURATION ---
TRANSCRIPT_DIR = r"D:\GitHub\portfolio-workspace\podcasts"
PROJECTS_DIR = r"d:\GitHub\portfolio\src\content\projects"
OUTPUT_REPORT = r"D:\GitHub\portfolio-workspace\podcasts\gold_gap_report.md"

# --- ENTITY DICTIONARY (THE GOLD) ---
# Terms we expect to see in the project files if they are mentioned in audio
ENTITIES = {
    "Vendors": [
        "Jetcrown", "Danko", "Hon Hai", "Foxconn", "Flextronics", 
        "Solectron", "Cheng Uei", "Volex"
    ],
    "Technical": [
        "Flow Lines", "Sink Marks", "Ejector Pin", "Side Action", 
        "Draft Angle", "Boss", "Rib", "Wall Thickness", "Texture",
        "Interference Fit", "Tolerance Stack", "GD&T", "Datums"
    ],
    "Crisis Terms": [
        "Line Down", "Stop Ship", "Recall", "Fire", "Meltdown", 
        "Scrap", "Yield Loss", "Root Cause", "Corrective Action"
    ],
    "Specifics": [
        "PN944", "PN2801", "C24", "D-Control", "D-Command", "SC48",
        "Cortez", "Galaxy", "Elmer", "Zeus", "0.05mm", "1mm"
    ]
}

def load_project_content(project_slug):
    """
    Loads text content of a project from src/content/projects/[slug]/index.mdx
    """
    path = os.path.join(PROJECTS_DIR, project_slug, "index.mdx")
    if not os.path.exists(path):
        # Try finding any md/mdx in the folder
        files = glob.glob(os.path.join(PROJECTS_DIR, project_slug, "*.md*"))
        if files:
            path = files[0]
        else:
            return ""
            
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read().lower()
    except Exception:
        return ""

def map_transcript_to_project(filename):
    """
    Heuristic to guess project slug from transcript filename.
    """
    name_lower = filename.lower()
    
    if "c24" in name_lower or "control24" in name_lower:
        return "c24"
    if "d-control" in name_lower or "d_control" in name_lower:
        return "d-control"
    if "d-command" in name_lower or "d_command" in name_lower:
        return "d-command"
    if "sc48" in name_lower:
        return "sc48"
    if "cortez" in name_lower:
        return "webtv-cortez"
    if "galaxy" in name_lower:
        return "webtv-galaxy"
    if "xbox" in name_lower:
        return "xbox"
    if "ultimatetv" in name_lower:
        return "ultimatetv" # Check real slug
    if "elmer" in name_lower:
        return "webtv-elmer"
    if "zeus" in name_lower:
        return "zeus"
        
    return None

def scan_text_for_entities(text):
    found = {}
    text_lower = text.lower()
    
    for category, terms in ENTITIES.items():
        found[category] = []
        for term in terms:
            if term.lower() in text_lower:
                found[category].append(term)
    return found

def main():
    print("🔍 Starting Gold Diff Audit...")
    
    transcripts = glob.glob(os.path.join(TRANSCRIPT_DIR, "*.transcript.txt"))
    print(f"📂 Found {len(transcripts)} transcripts.")
    
    report_lines = ["# Gold Gap Report: Missing Documentation\n"]
    report_lines.append("> This report lists High Value Entities found in Audio Transcripts that are **MISSING** from the corresponding Project Markdown file.\n")
    
    for t_path in transcripts:
        filename = os.path.basename(t_path)
        project_slug = map_transcript_to_project(filename)
        
        if not project_slug:
            continue
            
        # Load Content
        try:
            with open(t_path, "r", encoding="utf-8") as f:
                transcript_text = f.read()
        except Exception:
            continue
            
        project_text = load_project_content(project_slug)
        if not project_text:
            print(f"⚠️  Project not found for transcript: {filename} -> {project_slug}")
            continue
            
        # Analyze
        t_entities = scan_text_for_entities(transcript_text)
        
        missing_in_project = {}
        has_missing = False
        
        for cat, terms in t_entities.items():
            missing_list = []
            for term in terms:
                if term.lower() not in project_text:
                    missing_list.append(term)
            if missing_list:
                missing_in_project[cat] = missing_list
                has_missing = True
                
        if has_missing:
            report_lines.append(f"## 🎧 {filename}")
            report_lines.append(f"**Linked Project:** `{project_slug}`\n")
            for cat, terms in missing_in_project.items():
                report_lines.append(f"- **Missing {cat}:** {', '.join(terms)}")
            report_lines.append("\n" + "-"*40 + "\n")
            
    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        f.write("\n".join(report_lines))
        
    print(f"✅ Gap Report Generated: {OUTPUT_REPORT}")

if __name__ == "__main__":
    main()

import os
import csv
import json
import glob
import urllib.request

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
OUTPUT_CONTENT_DIR = "src/content/projects"
OUTPUT_DATA_DIR = "src/data"
ASSETS_DIR = "public/assets/placeholders"
R2_DOMAIN = "https://assets.eriknorris.com"

for d in [OUTPUT_CONTENT_DIR, OUTPUT_DATA_DIR, ASSETS_DIR]:
    os.makedirs(d, exist_ok=True)

# --- UTILS ---
def find_file(suffix):
    """Smartly finds files regardless of prefix."""
    exact = os.path.join(SOURCE_DIR, suffix)
    if os.path.exists(exact): return exact
    pattern = os.path.join(SOURCE_DIR, f"*{suffix}")
    matches = glob.glob(pattern)
    return matches[0] if matches else None

def read_csv_smart(filepath):
    """Standard reader for clean CSVs."""
    if not filepath: return []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
    if not lines: return []
    if lines[0].startswith(','): lines[0] = lines[0][1:]
    return list(csv.DictReader(lines))

def extract_expertise_metadata(filepath):
    """Hunts for 'Phase' and '%' rows anywhere in the file."""
    if not filepath: return {}
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = list(csv.reader(f))
        
    header_row = []
    header_idx = -1
    for i, row in enumerate(lines):
        if "Name" in row and "Project Start" in row:
            header_row = [c.strip() for c in row]
            header_idx = i
            break
            
    if not header_row: return {}

    phase_row = []
    weight_row = []
    for row in lines:
        if "Phase ->" in row: phase_row = row
        if "%" in row and "Phase" not in row: weight_row = row 

    skill_defs = {}
    ignored = ["Name", "Project Start", "Project End", "days", "midpoint", "✔️", "▲", "midpoint Y"]
    
    for idx, col_name in enumerate(header_row):
        if col_name and col_name not in ignored:
            p_val = phase_row[idx] if phase_row and idx < len(phase_row) else "0"
            w_val = weight_row[idx] if weight_row and idx < len(weight_row) else "1"
            skill_defs[col_name] = {
                "Phase": p_val.strip() or "0",
                "Weight": w_val.replace('%','').strip() or "1"
            }
    return skill_defs

def ensure_dummy_assets():
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
    dummies = [
        ("tech-1.jpg", "https://picsum.photos/id/1/800/600"),
        ("tech-2.jpg", "https://picsum.photos/id/20/800/600"),
        ("blueprint.jpg", "https://picsum.photos/id/201/800/600"),
        ("abstract.jpg", "https://picsum.photos/id/180/800/600")
    ]
    for filename, url in dummies:
        filepath = os.path.join(ASSETS_DIR, filename)
        if not os.path.exists(filepath):
            try:
                opener = urllib.request.build_opener()
                opener.addheaders = [('User-agent', 'Mozilla/5.0')]
                urllib.request.install_opener(opener)
                urllib.request.urlretrieve(url, filepath)
            except: pass

# --- PROCESSORS ---

def process_colors():
    print("🎨 Processing Colors...")
    path = find_file("Colors.csv") or find_file("color_etc.csv")
    if not path: return 
    data = read_csv_smart(path)
    color_map = {}
    for row in data:
        keys = list(row.keys())
        if len(keys) > 0:
            name = row[keys[0]]
            for v in row.values():
                if "rgb" in v:
                    color_map[name] = v
                    break
    with open(os.path.join(OUTPUT_DATA_DIR, "colors.json"), "w") as f:
        json.dump(color_map, f, indent=2)

def process_specs():
    print("⚙️  Processing Specs...")
    path = find_file("Specs.csv")
    if not path: return
    data = read_csv_smart(path)
    clean_specs = []
    for row in data:
        clean_specs.append({
            "category": row.get("Category"),
            "parameter": row.get("Parameter"),
            "typical": row.get("Typical"),
            "min": row.get("Min") if row.get("Min") != "-" else None,
            "max": row.get("Max") if row.get("Max") != "-" else None,
            "unit": row.get("Unit") if row.get("Unit") != "-" else "",
            "notes": row.get("Notes"),
        })
    with open(os.path.join(OUTPUT_DATA_DIR, "specs.json"), "w") as f:
        json.dump(clean_specs, f, indent=2)

def process_tenure():
    print("⏳ Processing Tenure...")
    path = find_file("Tenure.csv")
    if not path: return
    data = read_csv_smart(path)
    history = []
    for row in data:
        company = row.get("Employer") or row.get("job")
        if not company: continue
        history.append({
            "company": company,
            "title": row.get("Title", ""),
            "start": row.get("Start Date") or row.get("start"),
            "end": row.get("End Date") or row.get("end"),
            "is_consulting": "Mechanistic" in company or "Contract" in row.get("Type", "")
        })
    with open(os.path.join(OUTPUT_DATA_DIR, "work_history.json"), "w") as f:
        json.dump(history, f, indent=2)

def process_projects():
    print("🏗️  Processing Projects...")
    ensure_dummy_assets()
    
    main = read_csv_smart(find_file("Main.csv"))
    tax = {r.get('Project Name'): r for r in read_csv_smart(find_file("Taxonomy.csv"))}
    stats = {r['Name']: r for r in read_csv_smart(find_file("Part count.csv") or find_file("Stats.csv"))}
    phases = {r['Name']: r for r in read_csv_smart(find_file("Phase.csv"))}
    
    f_expert = find_file("Expertise.csv")
    skills_
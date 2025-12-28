import os
import csv
import json
import math
import hashlib
from datetime import datetime

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
OUTPUT_DIR = "src/data/timeline"

# Colors for "Employers" (The Variants)
COLOR_MAP_FILE = "src/config/colors.json"

# --- UTILS ---
def load_colors():
    if os.path.exists(COLOR_MAP_FILE):
        with open(COLOR_MAP_FILE, "r") as f:
            return json.load(f)
    return {}

def get_color(name, color_map):
    # If explicit color exists, use it
    if name in color_map:
        return color_map[name]
    
    # Otherwise, generate a deterministic "Variant Color"
    hash_object = hashlib.md5(name.encode())
    hex_hash = hash_object.hexdigest()
    return f"#{hex_hash[:6]}"

def safe_float(val, default=0.0):
    try:
        return float(val.replace('%','').strip())
    except:
        return default

def calculate_mass(duration_days, skill_count):
    # Mass = Duration * (1 + ln(SkillCount))
    # Heuristic: Longer projects with more skills are "heavier"
    if duration_days <= 0: return 5 # Minimum mass
    return math.log(duration_days) * 10 + (skill_count * 2)

# --- THE PRUNING PROCESS ---
def prune_timeline():
    print("✂️  TVA: Pruning Timeline... preserving stability.")
    
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
        
    color_map = load_colors()
    
    # 1. READ RAW DATA (The Chaos)
    projects = []
    
    # Main.csv
    main_path = os.path.join(SOURCE_DIR, "Main.csv")
    print(f"DEBUG: Reading {main_path}")
    with open(main_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        headers = [h.strip() for h in reader.fieldnames]
        print(f"DEBUG: Headers found: {headers}")
        main_data = []
        for r in reader:
             # Clean keys
             clean_r = {k.strip(): (v or "").strip() for k, v in r.items() if k}
             if clean_r.get('Slug Name') or clean_r.get('Name'):
                 main_data.append(clean_r)
    print(f"DEBUG: Found {len(main_data)} rows in Main.csv")

    # Skills.csv (For Gravity)
    with open(os.path.join(SOURCE_DIR, "Skills.csv"), 'r', encoding='utf-8-sig') as f:
        # We need to find the header row first, similar to ingest_data but simpler
        lines = f.readlines()
        start_idx = 0
        for i, line in enumerate(lines):
            if "Slug Name" in line or "Project Start" in line:
                start_idx = i
                break
        
        reader = csv.DictReader(lines[start_idx:])
        skills_data = {}
        for row in reader:
            k = row.get('Slug Name') or row.get('Name')
            if k: skills_data[k] = row

    # 2. TRANSFORM (The Ordering)
    timeline_nodes = []
    bubbles = []
    
    for row in main_data:
        name = row.get('Slug Name') or row.get('Name')
        if not name: continue
        
        # Pruning Rule 1: Must have a date (even if approximate)
        start_str = row.get('Project Start Date') or row.get('Project Start Date raw')
        end_str = row.get('Project End Date') or row.get('Project End Date raw')
        
        # Default to "Timeless" (Current Era) if missing
        # But for visualization, we need coordinates.
        if not start_str: 
            # print(f"    [PRUNED] {name} - No start date.")
            continue # We prune timeless events from the linear timeline

        try:
            start_date = datetime.strptime(start_str, "%m/%d/%Y")
            end_date = datetime.strptime(end_str, "%m/%d/%Y") if end_str else datetime.now()
        except:
             # print(f"    [PRUNED] {name} - Invalid date format.")
             continue
             
        duration_days = (end_date - start_date).days
        year = start_date.year
        
        # Gravity Calculation
        skill_row = skills_data.get(name, {})
        # Count non-zero skills
        skill_count = 0
        top_skills = []
        ignored = {"Slug Name", "Project Start", "Project End", "days", "midpoint"}
        for k, v in skill_row.items():
            if k not in ignored and safe_float(v) > 0:
                skill_count += 1
                top_skills.append((k, safe_float(v)))
        
        top_skills.sort(key=lambda x: x[1], reverse=True)
        top_skills = [s[0] for s in top_skills[:5]]
        
        mass = calculate_mass(duration_days, skill_count)
        
        employer = row.get('Employer') or "Independent"
        if "Mechanistic" in employer: employer = "Mechanistic"
        
        category = row.get('Category') or "Unclassified"
        
        # --- BUILD ARTEFACTS ---
        
        # --- INDUSTRY MAPPING (Taxonomy Fix) ---
        # Map Employers/Categories to meaningful Industries if missing
        industry = row.get('Industry')
        if not industry or industry == "Other":
            employer_map = {
                "Hyphen": "Robotics & Automation",
                "Momentum Machines": "Robotics & Automation",
                "Digidesign": "Pro Audio",
                "Avid": "Pro Audio",
                "Noon Home": "Consumer Electronics",
                "Noon": "Consumer Electronics",
                "Avegant": "Consumer Electronics",
                "Apple": "Consumer Electronics",
                "Kaleidescape": "Consumer Electronics",
                "Nima": "Consumer Electronics", 
                "6SensorLabs": "Consumer Electronics",
                "EP Technologies": "MedTech",
                "Boston Scientific": "MedTech",
                "Freelance": "Consulting",
                "Independent": "Consulting"
            }
            
            # 1. Try Employer match
            industry = employer_map.get(employer)
            
            # 2. If still unknown, try Category heuristics
            if not industry:
                if "Audio" in category: industry = "Pro Audio"
                elif "Automation" in category: industry = "Robotics & Automation"
                elif "Medical" in category: industry = "MedTech"
                elif "Consumer" in category: industry = "Consumer Electronics"
                elif "Future" in category or "Goal" in category: industry = "Future"
                else: industry = "Other"

        # 1. Multiverse Bubble Node
        bubbles.append({
            "id": name,
            "name": row.get('Descriptive Name') or name,
            "group": employer,
            "color": get_color(employer, color_map),
            "value": mass, # Radius
            "year": year,
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "category": category,
            "industry": industry, # Patched
            "skills": top_skills,
            "img": f"/assets/r2/{name.lower().replace(' ', '-')}/hero-sm.webp"
        })
        
        # 2. Timeline Strip
        timeline_nodes.append({
            "id": name,
            "start": start_date.isoformat(),
            "end": end_date.isoformat(),
            "group": category,
            "content": row.get('Descriptive Name') or name
        })
        
    # 3. OUTPUT (The Sacred Timeline)
    
    # Multiverse JSON (Bubble Graph)
    with open(os.path.join(OUTPUT_DIR, "multiverse.json"), "w") as f:
        json.dump({"nodes": bubbles}, f, indent=2)
        print(f"✨ Variance Stabilized: {len(bubbles)} nodes in multiverse.json")

    # Sacred Timeline (Gantt/River) - Keep for reference
    with open(os.path.join(OUTPUT_DIR, "sacred_timeline.json"), "w") as f:
        json.dump(timeline_nodes, f, indent=2)
        print(f"✨ Timeline Secured: {len(timeline_nodes)} events in sacred_timeline.json")

    # 4. HIERARCHY (The Dendrogram)
    # Root -> Industry -> Category -> Project
    hierarchy = {"name": "Quantum", "children": []}
    
    # Group by Industry
    industries = {}
    for b in bubbles:
        ind = b.get("industry", "Other")
        cat = b.get("category", "Unclassified")
        
        if ind not in industries: industries[ind] = {}
        if cat not in industries[ind]: industries[ind][cat] = []
        
        industries[ind][cat].append({
            "name": b["name"],
            "value": b["value"],
            "group": b["group"],
            "id": b["id"]
        })
    
    for ind_name, cats in industries.items():
        ind_node = {"name": ind_name, "children": []}
        for cat_name, projects in cats.items():
            cat_node = {"name": cat_name, "children": projects}
            ind_node["children"].append(cat_node)
        hierarchy["children"].append(ind_node)
        
    with open(os.path.join(OUTPUT_DIR, "hierarchy.json"), "w") as f:
        json.dump(hierarchy, f, indent=2)
        print(f"✨ Taxonomy Ordered: Generated hierarchy.json")

if __name__ == "__main__":
    prune_timeline()

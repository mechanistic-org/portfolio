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
    """Smartly finds files regardless of 'resviz...' prefix."""
    exact = os.path.join(SOURCE_DIR, suffix)
    if os.path.exists(exact): return exact
    pattern = os.path.join(SOURCE_DIR, f"*{suffix}")
    matches = glob.glob(pattern)
    if matches:
        return max(matches, key=os.path.getmtime)
    return None

def read_csv_smart(filepath, header_trigger="Name"):
    """
    Robust Reader: Hunts for the 'header_trigger' string.
    """
    if not filepath or not os.path.exists(filepath): 
        print(f"⚠️  File not found: {filepath}")
        return []
    
    filename = os.path.basename(filepath)
    
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
    
    if not lines: return []
    
    # Hunt for the header row
    start_idx = -1
    for i, line in enumerate(lines):
        if header_trigger in line:
            # Extra check to avoid false positives in metadata
            if "Expertise" in filename and "Project Start" not in line:
                continue
            start_idx = i
            break
    
    if start_idx == -1:
        # Fallback: If trigger fails, try Row 0 (for perfectly clean files)
        if "Name" in lines[0]:
             start_idx = 0
        else:
             print(f"      ❌ Error: Could not find header '{header_trigger}' in {filename}")
             return []

    # Clean leading chars
    if lines[start_idx].startswith(','): lines[start_idx] = lines[start_idx][1:]
    
    reader = csv.DictReader(lines[start_idx:])
    data = []
    for row in reader:
        clean_row = {k.strip(): v.strip() for k, v in row.items() if k}
        if clean_row:
            data.append(clean_row)
            
    print(f"   📖 {filename}: Found header at line {start_idx+1}. Loaded {len(data)} rows.")
    return data

def extract_expertise_metadata(filepath):
    """Hunts for 'Phase' and '%' rows."""
    if not filepath: return {}
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = list(csv.reader(f))
        
    header_row = []
    for row in lines:
        if "Name" in row and "Project Start" in row:
            header_row = [c.strip() for c in row]
            break
    if not header_row: return {}

    phase_row = []
    weight_row = []
    for row in lines:
        row_str = ",".join(row)
        if "Phase ->" in row_str or "Phase" in row_str: phase_row = row
        if "%" in row_str and "Phase" not in row_str: weight_row = row 

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
    # Updated Trigger: "Name"
    data = read_csv_smart(path, "Name")
    
    color_map = {}
    for row in data:
        keys = list(row.keys())
        if len(keys) > 0:
            name = row[keys[0]]
            for v in row.values():
                if "rgb" in v or "#" in v:
                    color_map[name] = v
                    break
    with open(os.path.join(OUTPUT_DATA_DIR, "colors.json"), "w") as f:
        json.dump(color_map, f, indent=2)

def process_specs():
    print("⚙️  Processing Specs...")
    path = find_file("Specs.csv")
    if not path: return
    data = read_csv_smart(path, "Category")
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
    data = read_csv_smart(path, "Employer")
    
    history = []
    color_map = {}
    if os.path.exists(os.path.join(OUTPUT_DATA_DIR, "colors.json")):
        with open(os.path.join(OUTPUT_DATA_DIR, "colors.json"), "r") as f:
            color_map = json.load(f)

    for row in data:
        company = row.get("Employer")
        if not company: continue
        
        color = color_map.get(company, "#10b981")
        history.append({
            "company": company,
            "title": row.get("Title", ""),
            "start": row.get("Start Date") or row.get("start"),
            "end": row.get("End Date") or row.get("end"),
            "color": color,
            "description": row.get("Description", ""),
            "is_consulting": "Mechanistic" in company or "Contract" in row.get("Type", "")
        })
    with open(os.path.join(OUTPUT_DATA_DIR, "work_history.json"), "w") as f:
        json.dump(history, f, indent=2)

def process_projects():
    print("🏗️  Processing Projects...")
    ensure_dummy_assets()
    
    # 1. Load Files (UPDATED TRIGGERS: "Name")
    main = read_csv_smart(find_file("Main.csv"), "Name")
    
    # Lookup tables updated to look for "Name"
    tax = {r.get('Name'): r for r in read_csv_smart(find_file("Taxonomy.csv"), "Name")}
    phases = {r.get('Name'): r for r in read_csv_smart(find_file("Phase.csv"), "Name")}
    
    f_stats = find_file("Stats.csv") or find_file("Part count.csv")
    # Stats often has metadata, so we look for the "Plastic" column to confirm header
    stats_data = read_csv_smart(f_stats, "Plastic") 
    stats = {r.get('Name'): r for r in stats_data if r.get('Name')}
    
    f_expert = find_file("Expertise.csv")
    expert_data = read_csv_smart(f_expert, "Project Start") 
    project_skills = {r.get('Name'): r for r in expert_data}
    skill_defs = extract_expertise_metadata(f_expert) 

    dummy_files = ["tech-1.jpg", "tech-2.jpg", "blueprint.jpg", "abstract.jpg"]
    all_clients = set()
    count = 0

    print(f"   ... Generating MDX files ...")

    for i, row in enumerate(main):
        # Trigger on "Name"
        name = row.get("Name")
        if not name: continue
        
        slug = name.lower().strip().replace(' ', '-').replace('/', '-')
        title = row.get("Descriptive Name") or name
        
        employer = row.get("Employer", "")
        if "Mechanistic" in employer: employer = "Mechanistic (Consulting)"
        
        clients = [c.strip() for c in row.get("Client", "").split('/') if c.strip()]
        for c in clients: all_clients.add(c)

        # Facets
        t_row = tax.get(name, {})
        industry = t_row.get("Industry", "Other")
        category = t_row.get("Category", "")
        tools = [t.strip() for t in row.get("Tools", "").split(',') if t.strip()]

        # Status
        p_row = phases.get(name, {})
        prod_status = "Concept"
        if float(p_row.get("Production", p_row.get("Phase 5", 0)) or 0) > 0: prod_status = "Mass Production"
        elif float(p_row.get("Validation", p_row.get("Phase 4", 0)) or 0) > 0: prod_status = "Manufacturing Prep"
        elif float(p_row.get("Development", p_row.get("Phase 3", 0)) or 0) > 0: prod_status = "Prototyping"

        # Stats
        s_row = stats.get(name, {})
        part_counts = {
            "plastic": int(float(s_row.get("Plastic", 0) or 0)),
            "metal": int(float(s_row.get("Sheetmetal", 0) or 0)),
            "pcb": int(float(s_row.get("PCB", 0) or 0))
        }

        # Skills
        skill_row = project_skills.get(name, {})
        weighted_skills = []
        for skill_name, val_str in skill_row.items():
            if skill_name in skill_defs:
                try:
                    val = float(val_str.replace('%','').replace(',','').strip())
                    if val > 0:
                        weight = float(skill_defs[skill_name].get("Weight", 1))
                        weighted_skills.append((skill_name, val * weight))
                except: pass
        
        weighted_skills.sort(key=lambda x: x[1], reverse=True)
        bom_skills = [s[0] for s in weighted_skills]
        skill_data = [{"name": s[0], "value": round(s[1], 1)} for s in weighted_skills[:6]]

        # Assets
        hero_img = f"/assets/placeholders/{dummy_files[i % 4]}"
        comment = ""
        local_path = os.path.join("R2_STAGING", slug)
        if os.path.exists(local_path):
            for ext in [".jpg", ".png", ".webp"]:
                if os.path.exists(os.path.join(local_path, f"hero{ext}")):
                    hero_img = f"{R2_DOMAIN}/{slug}/hero{ext}"
                    break
        else:
             comment = f"# R2: {R2_DOMAIN}/{slug}/hero.jpg"

        mdx = f"""---
title: {json.dumps(title)}
slug: "{slug}"
date: "{row.get('Project Start Date raw', '')}"
employer: "{employer}"
client: {json.dumps(clients)}
industry: "{industry}"
category: "{category}"
tools: {json.dumps(tools)}
production: "{prod_status}"
tags: {json.dumps(bom_skills)}
skillData: {json.dumps(skill_data)}
stats: {json.dumps(part_counts)}
heroImage: "{hero_img}" {comment}
draft: false
description: "{title} - {industry} project."
---
import {{ YouTube }} from '@astro-community/astro-embed-youtube';

## Overview
**{title}** ({row.get('Title', 'Engineer')}). 

> *Auto-generated placeholder content.*

### Hardware Metrics
* **Plastic Parts:** {part_counts['plastic']}
* **Metal Parts:** {part_counts['metal']}
* **PCBs:** {part_counts['pcb']}

### Bill of Materials (Skills)
{', '.join(bom_skills)}

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
<ModelViewer src="{R2_DOMAIN}/{slug}/model.glb" alt="3D Asset" />
"""
        with open(os.path.join(OUTPUT_CONTENT_DIR, f"{slug}.mdx"), "w", encoding="utf-8") as f:
            f.write(mdx)
        count += 1

    print(f"✅ Generated {count} MDX files.")
    
    with open(os.path.join(OUTPUT_DATA_DIR, "clients.json"), "w") as f:
        json.dump(sorted(list(all_clients)), f, indent=2)

if __name__ == "__main__":
    process_colors()
    process_specs()
    process_tenure()
    process_projects()
    print("\n🚀 INGESTION COMPLETE.")
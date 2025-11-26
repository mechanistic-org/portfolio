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
    skills_map = parse_expertise(f_expert) # Use the specialized parser below

    dummy_files = ["tech-1.jpg", "tech-2.jpg", "blueprint.jpg", "abstract.jpg"]
    all_clients = set()
    count = 0

    for i, row in enumerate(main):
        name = row.get("Slug Name")
        if not name: continue
        
        slug = name.lower().strip().replace(' ', '-').replace('/', '-')
        title = row.get("Descriptive Name") or name
        employer = row.get("Employer", "")
        if "Mechanistic" in employer: employer = "Mechanistic (Consulting)"
        clients = [c.strip() for c in row.get("Client", "").split('/') if c.strip()]
        for c in clients: all_clients.add(c)

        t_row = tax.get(name, {})
        industry = t_row.get("Industry", "Other")
        category = t_row.get("Category", "")
        tools = [t.strip() for t in row.get("Tools", "").split(',') if t.strip()]

        p_row = phases.get(name, {})
        prod_status = "Concept"
        if float(p_row.get("Production", p_row.get("Phase 5", 0)) or 0) > 0: prod_status = "Mass Production"
        elif float(p_row.get("Validation", p_row.get("Phase 4", 0)) or 0) > 0: prod_status = "Manufacturing Prep"
        elif float(p_row.get("Development", p_row.get("Phase 3", 0)) or 0) > 0: prod_status = "Prototyping"

        s_row = stats.get(name, {})
        part_counts = {
            "plastic": int(float(s_row.get("Plastic", 0) or 0)),
            "metal": int(float(s_row.get("Sheetmetal", 0) or 0)),
            "pcb": int(float(s_row.get("PCB", 0) or 0))
        }

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

        # Use the intelligently extracted skills list
        bom_skills = skills_map.get(name, [])

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
tags: {json.dumps(bom_skills[:8])}
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
    
    sorted_clients = sorted(list(all_clients))
    with open(os.path.join(OUTPUT_DATA_DIR, "clients.json"), "w") as f:
        json.dump(sorted_clients, f, indent=2)

def parse_expertise(filepath):
    """Extracts Skills and Weights from Expertise.csv."""
    if not filepath: return {}
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = list(csv.reader(f))

    header_idx = next((i for i, r in enumerate(lines) if "Name" in r and "Project Start" in r), -1)
    if header_idx == -1: return {}

    header, weights = lines[header_idx], lines[header_idx-1]
    skill_weights = {h.strip(): float(w.replace('%','').strip() or 1) for h, w in zip(header, weights) if "%" in w}

    skills_map = {}
    for row in lines[header_idx+1:]:
        if len(row) < len(header): continue
        name = row[header.index("Name")].strip()
        if not name: continue
        
        proj_skills = []
        for i, val in enumerate(row):
            skill = header[i].strip()
            if skill in skill_weights:
                try:
                    intensity = float(val.replace('%','').strip())
                    if intensity > 0:
                        proj_skills.append((skill, intensity * skill_weights[skill]))
                except: pass
        
        proj_skills.sort(key=lambda x: x[1], reverse=True)
        skills_map[name] = [s[0] for s in proj_skills]
    return skills_map

if __name__ == "__main__":
    process_colors()
    process_specs()
    process_tenure()
    process_projects()
    print("\n🚀 INGESTION COMPLETE.")
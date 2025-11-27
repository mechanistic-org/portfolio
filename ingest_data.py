import os
import csv
import json
import glob
import urllib.request
import shutil

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
MANUAL_CONTENT_DIR = "data_source/manual_content"
OUTPUT_CONTENT_DIR = "src/content/projects"
OUTPUT_DATA_DIR = "src/data"
ASSETS_DIR = "public/assets/placeholders"
LOCAL_R2_DIR = "public/assets/r2"
# R2_DOMAIN = "https://assets.eriknorris.com" 
# SWITCHING TO LOCAL ASSETS FOR STABILITY
R2_DOMAIN = "/assets/r2"

for d in [OUTPUT_CONTENT_DIR, OUTPUT_DATA_DIR, ASSETS_DIR, MANUAL_CONTENT_DIR, LOCAL_R2_DIR]:
    os.makedirs(d, exist_ok=True)

# --- UTILS ---
def find_file(suffix):
    exact = os.path.join(SOURCE_DIR, suffix)
    if os.path.exists(exact): return exact
    pattern = os.path.join(SOURCE_DIR, f"*{suffix}")
    matches = glob.glob(pattern)
    return matches[0] if matches else None

def read_csv_smart(filepath, header_trigger="Name"):
    if not filepath or not os.path.exists(filepath): 
        print(f"⚠️  File not found: {filepath}")
        return []
    
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
    
    if not lines: return []
    
    start_idx = -1
    for i, line in enumerate(lines):
        if header_trigger in line:
            start_idx = i
            break
    if start_idx == -1: start_idx = 0

    if lines[start_idx].startswith(','): lines[start_idx] = lines[start_idx][1:]
    
    reader = csv.DictReader(lines[start_idx:])
    data = []
    for row in reader:
        clean_row = {k.strip(): v.strip() for k, v in row.items() if k}
        if clean_row: data.append(clean_row)
    return data

def extract_expertise_metadata(filepath):
    if not filepath: return {}
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = list(csv.reader(f))
    header_row = []
    for row in lines:
        if "Name" in row and "Project Start" in row:
            header_row = [c.strip() for c in row]
            break
    if not header_row: return {}
    phase_row, weight_row = [], []
    for row in lines:
        if "Phase ->" in "".join(row): phase_row = row
        if "%" in "".join(row) and "Phase" not in "".join(row): weight_row = row 
    skill_defs = {}
    ignored = ["Name", "Project Start", "Project End", "days", "midpoint", "✔️", "▲", "midpoint Y"]
    for idx, col in enumerate(header_row):
        if col and col not in ignored:
            p = phase_row[idx] if phase_row and idx < len(phase_row) else "0"
            w = weight_row[idx] if weight_row and idx < len(weight_row) else "1"
            skill_defs[col] = {"Phase": p.strip() or "0", "Weight": w.replace('%','').strip() or "1"}
    return skill_defs

def ensure_dummy_assets():
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
    dummies = [("tech-1.jpg", "https://picsum.photos/id/1/800/600")]
    for filename, url in dummies:
        path = os.path.join(ASSETS_DIR, filename)
        if not os.path.exists(path):
            try:
                opener = urllib.request.build_opener()
                opener.addheaders = [('User-agent', 'Mozilla/5.0')]
                urllib.request.install_opener(opener)
                urllib.request.urlretrieve(url, path)
            except: pass

def sync_r2_assets(slug, source_path):
    """Copy assets from R2_STAGING to public/assets/r2/{slug}"""
    dest_dir = os.path.join(LOCAL_R2_DIR, slug)
    if os.path.exists(dest_dir):
        shutil.rmtree(dest_dir)
    shutil.copytree(source_path, dest_dir)

# --- PROCESSORS ---
def process_colors():
    print("🎨 Processing Colors...")
    path = find_file("Colors.csv") or find_file("color_etc.csv")
    if not path: return 
    data = read_csv_smart(path, "Requirements Analysis")
    if not data: data = read_csv_smart(path, "Name")

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
            "min": row.get("Min"), "max": row.get("Max"),
            "unit": row.get("Unit"), "notes": row.get("Notes")
        })
    with open(os.path.join(OUTPUT_DATA_DIR, "specs.json"), "w") as f:
        json.dump(clean_specs, f, indent=2)

def process_tenure():
    print("⏳ Processing Tenure...")
    path = find_file("Tenure.csv")
    if not path: return
    data = read_csv_smart(path, "Employer")
    if not data: data = read_csv_smart(path, "job")
    
    history = []
    color_map = {}
    if os.path.exists(os.path.join(OUTPUT_DATA_DIR, "colors.json")):
        with open(os.path.join(OUTPUT_DATA_DIR, "colors.json"), "r") as f:
            color_map = json.load(f)

    for row in data:
        company = row.get("Employer") or row.get("job")
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
    
    # SYNC _SITE ASSETS FIRST
    site_assets = os.path.join("R2_STAGING", "_site")
    if os.path.exists(site_assets):
        sync_r2_assets("_site", site_assets)

    main = read_csv_smart(find_file("Main.csv"), "Slug Name")
    if not main: main = read_csv_smart(find_file("Main.csv"), "Name")
    
    tax = {r.get('Project Name') or r.get('Name'): r for r in read_csv_smart(find_file("Taxonomy.csv"), "Project Name")}
    if not tax: tax = {r.get('Name'): r for r in read_csv_smart(find_file("Taxonomy.csv"), "Name")}
    
    phases = {r['Name']: r for r in read_csv_smart(find_file("Phase.csv"))}
    stats = {r['Name']: r for r in read_csv_smart(find_file("Stats.csv") or find_file("Part count.csv"))}
    
    f_expert = find_file("Expertise.csv")
    expert_data = read_csv_smart(f_expert, "Project Start") 
    project_skills = {r.get('Name'): r for r in expert_data}
    skill_defs = extract_expertise_metadata(f_expert) 

    dummy_files = ["tech-1.jpg", "tech-2.jpg", "blueprint.jpg", "abstract.jpg"]
    all_clients = set()
    count = 0

    for i, row in enumerate(main):
        name = row.get("Slug Name") or row.get("Name")
        if not name: continue
        
        slug = name.lower().strip().replace(' ', '-').replace('/', '-')
        title = row.get("Descriptive Name") or name
        
        employer = row.get("Employer", "")
        if employer and "Mechanistic" not in employer and "#awesomejob" not in employer:
             all_clients.add(employer)
        if "Mechanistic" in employer: employer = "Mechanistic (Consulting)"
        
        clients = [c.strip() for c in row.get("Client", "").split('/') if c.strip()]
        for c in clients: all_clients.add(c)

        t_row = tax.get(name, {})
        industry = t_row.get("Industry", "Other")
        category = t_row.get("Category", "")
        tools = [t.strip() for t in row.get("Tools", "").split(',') if t.strip()]

        p_row = phases.get(name, {})
        prod = "Concept"
        if float(p_row.get("Production", p_row.get("Phase 5", 0)) or 0) > 0: prod = "Mass Production"
        elif float(p_row.get("Validation", p_row.get("Phase 4", 0)) or 0) > 0: prod = "Manufacturing Prep"
        elif float(p_row.get("Development", p_row.get("Phase 3", 0)) or 0) > 0: prod = "Prototyping"

        s_row = stats.get(name, {})
        parts = {"plastic": int(float(s_row.get("Plastic",0) or 0)), "metal": int(float(s_row.get("Sheetmetal",0) or 0)), "pcb": int(float(s_row.get("PCB",0) or 0))}
        
        skill_row = project_skills.get(name, {})
        weighted = []
        for s, v_str in skill_row.items():
            try:
                val = float(v_str.replace('%','').strip())
                if val > 0:
                    w = float(skill_defs.get(s, {}).get("Weight", 1))
                    weighted.append((s, val * w))
            except: pass
        weighted.sort(key=lambda x: x[1], reverse=True)
        bom = [s[0] for s in weighted]
        skill_data = [{"name": s[0], "value": round(s[1], 1)} for s in weighted[:6]]

        # Assets
        hero_img = f"/assets/placeholders/{dummy_files[i % 4]}"
        model_url = f"{R2_DOMAIN}/_site/NeilArmstrong.glb"
        comment = ""
        gallery_images = []

        local_stage = os.path.join("R2_STAGING", slug)
        if os.path.exists(local_stage):
             # SYNC ASSETS
             sync_r2_assets(slug, local_stage)
             
             for ext in [".png", ".jpg", ".webp"]:
                if os.path.exists(os.path.join(local_stage, f"hero{ext}")):
                    hero_img = f"{R2_DOMAIN}/{slug}/hero{ext}"
                    break
             if os.path.exists(os.path.join(local_stage, "model.glb")):
                 print(f"✅ Found model for {slug}")
                 model_url = f"{R2_DOMAIN}/{slug}/model.glb"
             else:
                 if slug == "xbox": print(f"❌ No model.glb found for {slug} in {local_stage}")

             for f in os.listdir(local_stage):
                 lower = f.lower()
                 if lower.endswith(('.png', '.jpg', '.jpeg', '.webp')) and "hero" not in lower:
                     gallery_images.append(f"{R2_DOMAIN}/{slug}/{f}")
        else:
             comment = f"# R2: {R2_DOMAIN}/{slug}/hero.jpg"

        # Resource Scanning
        documents = []
        links = []
        if os.path.exists(local_stage):
            for f in os.listdir(local_stage):
                if f.lower().endswith(".pdf"):
                    documents.append({"name": f, "url": f"{R2_DOMAIN}/{slug}/{f}"})
                elif f.lower().endswith(".url"):
                    links.append({"name": f.replace(".url", ""), "url": f"{R2_DOMAIN}/{slug}/{f}"})

        # Manual Override
        manual_path = os.path.join(MANUAL_CONTENT_DIR, f"{slug}.md")
        if os.path.exists(manual_path):
            with open(manual_path, 'r', encoding='utf-8') as f:
                content_body = f.read()
            
            # Template Replacement
            content_body = content_body.replace("{{MODEL_URL}}", model_url)
            content_body = content_body.replace("{{HERO_IMAGE}}", hero_img)
        else:
            content_body = f"""
import {{ YouTube }} from '@astro-community/astro-embed-youtube';

## Overview
**{title}** ({row.get('Title', 'Engineer')}). 

> *Auto-generated placeholder content.*

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
<ModelViewer src="{model_url}" alt="3D Asset" />
"""

        mdx = f"""---
title: {json.dumps(title)}
slug: "{slug}"
date: "{row.get('Project Start Date raw', '')}"
endDate: "{row.get('Project End Date raw', '')}"
employer: "{employer}"
client: {json.dumps(clients)}
industry: "{industry}"
category: "{category}"
tools: {json.dumps(tools)}
production: "{prod}"
tags: {json.dumps(bom)}
skillData: {json.dumps(skill_data)}
stats: {json.dumps(parts)}
gallery: {json.dumps(gallery_images)}
documents: {json.dumps(documents)}
links: {json.dumps(links)}
heroImage: "{hero_img}" {comment}
draft: false
description: "{title} - {industry} project."
---
{content_body}
"""
        with open(os.path.join(OUTPUT_CONTENT_DIR, f"{slug}.mdx"), "w", encoding="utf-8") as f:
            f.write(mdx)
        count += 1

    print(f"✅ Generated {count} MDX files.")
    
    client_data = []
    for client in sorted(list(all_clients)):
        logo_name = client.lower().replace(' ', '')
        logo_path = None
        # CHECK LOCAL R2
        if os.path.exists(os.path.join(LOCAL_R2_DIR, "_site", "logos", f"{logo_name}.svg")):
            logo_path = f"{R2_DOMAIN}/_site/logos/{logo_name}.svg"
        elif os.path.exists(os.path.join(LOCAL_R2_DIR, "_site", "logos", f"{logo_name}.png")):
            logo_path = f"{R2_DOMAIN}/_site/logos/{logo_name}.png"
        client_data.append({"name": client, "logo": logo_path})

    with open(os.path.join(OUTPUT_DATA_DIR, "clients.json"), "w") as f:
        json.dump(client_data, f, indent=2)

if __name__ == "__main__":
    process_colors()
    process_specs()
    process_tenure()
    process_projects()
    print("\n🚀 INGESTION COMPLETE.")
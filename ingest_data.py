import os
import csv
import json
import urllib.request

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
OUTPUT_CONTENT_DIR = "src/content/projects"
OUTPUT_DATA_DIR = "src/data"
ASSETS_DIR = "src/assets/placeholders"
R2_DOMAIN = "https://assets.eriknorris.com"
HERO_EXT = ".jpg" 

os.makedirs(OUTPUT_CONTENT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)

def read_csv(filepath, header_trigger="Name"):
    if not os.path.exists(filepath): return []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = f.readlines()
    start_idx = 0
    for i, line in enumerate(lines):
        if header_trigger in line:
            headers = next(csv.reader([line]))
            start_idx = i + 1
            break
    else: return []
    
    data = []
    reader = csv.reader(lines[start_idx:])
    for row in reader:
        if not row or not row[0].strip(): continue
        item = {}
        for h_i, h_val in enumerate(headers):
            if h_i < len(row): item[h_val.strip()] = row[h_i].strip()
        data.append(item)
    return data

# --- 1. PROCESS COLORS (For Visualization) ---
def process_colors():
    print("🎨 Processing Color Palette...")
    # Reads color_etc.csv to create a map for the UI/Viz later
    color_data = read_csv(os.path.join(SOURCE_DIR, "color_etc.csv"), "Requirements Analysis")
    
    color_map = {}
    for row in color_data:
        # Map "Requirements Analysis" -> "rgb(229,80,57)"
        # The CSV structure is a bit loose, assuming Col 0 is Name and Col 2 is RGB
        keys = list(row.keys())
        if len(keys) >= 3:
            name = row[keys[0]]
            color = row[keys[2]] # Assuming 3rd column is the RGB value
            if name and color:
                color_map[name] = color
    
    with open(os.path.join(OUTPUT_DATA_DIR, "colors.json"), "w") as f:
        json.dump(color_map, f, indent=2)

# --- 2. PROCESS PROJECTS ---
def process_projects():
    print("🏗️  Processing Projects...")
    
    main_data = read_csv(os.path.join(SOURCE_DIR, "Main.csv"), "Slug Name")
    taxonomy_data = read_csv(os.path.join(SOURCE_DIR, "Taxonomy.csv"), "Project Name")
    skills_data = read_csv(os.path.join(SOURCE_DIR, "Expertise.csv"), "Name")
    phase_data = read_csv(os.path.join(SOURCE_DIR, "Phase.csv"), "Name")
    # We skip assets.csv as we are using Physical Convention now

    # Lookup Maps
    taxonomy_map = {r['Project Name']: r for r in taxonomy_data if 'Project Name' in r}
    skills_map = {r['Name']: r for r in skills_data if 'Name' in r}
    phase_map = {r['Name']: r for r in phase_data if 'Name' in r}

    dummy_files = ["tech-1.jpg", "tech-2.jpg", "blueprint.jpg", "abstract.jpg"]
    count = 0

    for i, row in enumerate(main_data):
        name = row.get("Slug Name")
        if not name: continue

        title = row.get("Descriptive Name") or name
        slug = name.lower().strip().replace(' ', '-').replace('/', '-')
        
        # -- FACETS --
        # 1. Engagement (Employer)
        employer = row.get("Employer", "Independent")
        if "Mechanistic" in employer: employer = "Mechanistic (Consulting)"
        
        # 2. Sector (Industry)
        tax_row = taxonomy_map.get(name, {})
        industry = tax_row.get("Industry", "Other")
        category = tax_row.get("Category", "")

        # 3. Toolchain (Tools)
        tools = []
        if row.get("Tools"): 
            tools = [t.strip() for t in row.get("Tools").split(',') if t.strip()]

        # 4. Status (Production Level)
        # Logic: If Phase 5 or 4 exists > 0, it shipped.
        phase_row = phase_map.get(name, {})
        prod_status = "Concept"
        try:
            p5 = float(phase_row.get("Phase 5", 0) or 0)
            p4 = float(phase_row.get("Phase 4", 0) or 0)
            if p5 > 0: prod_status = "Mass Production"
            elif p4 > 0: prod_status = "Manufacturing Prep"
            elif float(phase_row.get("Phase 3", 0) or 0) > 0: prod_status = "Prototyping"
        except: pass

        # -- SKILLS (BOM) --
        skill_row = skills_map.get(name, {})
        bom_skills = []
        if skill_row:
            for k, v in skill_row.items():
                if k not in ["Name", "Project Start", "Project End", "days", "Phase ->", "%", "midpoint Y"]:
                    try:
                        if float(v.replace('%','')) > 0: bom_skills.append(k)
                    except: pass

        # -- ASSET LOGIC --
        # Physical R2 Convention: Check if R2_STAGING/{slug}/hero.jpg exists
        hero_image_path = f"../../assets/placeholders/{dummy_files[i % 4]}"
        hero_comment = ""
        
        local_stage_dir = os.path.join("R2_STAGING", slug)
        # Simple check for standard extensions
        if os.path.exists(local_stage_dir):
            for ext in [".jpg", ".png", ".webp"]:
                if os.path.exists(os.path.join(local_stage_dir, f"hero{ext}")):
                    hero_image_path = f"{R2_DOMAIN}/{slug}/hero{ext}"
                    break
        else:
            hero_comment = f"# R2 PATH: {R2_DOMAIN}/{slug}/hero.jpg"

        # -- WRITE MDX --
        # We write DISTINCT fields for filtering, but keep 'tags' for generic search if needed
        mdx_body = f"""---
title: {json.dumps(title)}
slug: "{slug}"
date: "{row.get('Project Start Date raw', '')}"
employer: "{employer}"
industry: "{industry}"
category: "{category}"
tools: {json.dumps(tools)}
production: "{prod_status}"
tags: {json.dumps(bom_skills)}
heroImage: "{hero_image_path}" {hero_comment}
draft: false
description: "{title} - {industry} project ({prod_status})."
---
import {{ YouTube }} from '@astro-community/astro-embed-youtube';

## Overview
**{title}** ({row.get('Title', 'Engineer')}). 

> *Auto-generated placeholder content.*

### Bill of Materials (Skills)
{', '.join(bom_skills)}

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
<ModelViewer src="{R2_DOMAIN}/{slug}/model.glb" alt="3D Asset" />
"""
        with open(os.path.join(OUTPUT_CONTENT_DIR, f"{slug}.mdx"), "w", encoding="utf-8") as f:
            f.write(mdx_body)
        count += 1

    print(f"✅ Refreshed {count} MDX files with structured facets.")

if __name__ == "__main__":
    process_colors()
    process_projects()
import os
import csv
import json
import urllib.parse
import urllib.request
from datetime import datetime

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
OUTPUT_CONTENT_DIR = "src/content/projects"
OUTPUT_DATA_DIR = "src/data"
ASSETS_DIR = "src/assets/placeholders"
R2_DOMAIN = "https://assets.yourdomain.com"

os.makedirs(OUTPUT_CONTENT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)

def ensure_dummy_assets():
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
    dummies = [
        ("tech-1.jpg", "https://picsum.photos/id/1/800/600"),
        ("tech-2.jpg", "https://picsum.photos/id/20/800/600"),
        ("blueprint.jpg", "https://picsum.photos/id/201/800/600"),
        ("abstract.jpg", "https://picsum.photos/id/180/800/600")
    ]
    print("🎨 Checking assets...")
    for filename, url in dummies:
        filepath = os.path.join(ASSETS_DIR, filename)
        if not os.path.exists(filepath):
            try:
                opener = urllib.request.build_opener()
                opener.addheaders = [('User-agent', 'Mozilla/5.0')]
                urllib.request.install_opener(opener)
                urllib.request.urlretrieve(url, filepath)
            except Exception: pass

def read_csv(filepath, header_trigger="Name"):
    if not os.path.exists(filepath): 
        print(f"⚠️  Missing: {filepath}")
        return []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = f.readlines()
    
    start_idx = 0
    headers = []
    for i, line in enumerate(lines):
        if header_trigger in line:
            headers = next(csv.reader([line]))
            start_idx = i + 1
            break
    
    if not headers: return []
    
    data = []
    reader = csv.reader(lines[start_idx:])
    for row in reader:
        if not row or not row[0].strip(): continue
        item = {}
        for h_i, h_val in enumerate(headers):
            if h_i < len(row): item[h_val.strip()] = row[h_i].strip()
        data.append(item)
    return data

def process_projects():
    ensure_dummy_assets()
    print("🏗️  Processing Projects...")
    
    # 1. Load All Data Sources
    main_data = read_csv(os.path.join(SOURCE_DIR, "Main.csv"), "Slug Name")
    assets_data = read_csv(os.path.join(SOURCE_DIR, "assets.csv"), "Name")
    skills_data = read_csv(os.path.join(SOURCE_DIR, "Expertise.csv"), "Name")
    # Ingesting "Sheet9" as Taxonomy.csv
    taxonomy_data = read_csv(os.path.join(SOURCE_DIR, "Taxonomy.csv"), "Project Name")

    # 2. Create Lookup Maps
    assets_map = {r['Name']: r for r in assets_data if 'Name' in r}
    skills_map = {r['Name']: r for r in skills_data if 'Name' in r}
    # Mapping Taxonomy by "Project Name" -> Industry/Category
    taxonomy_map = {r['Project Name']: r for r in taxonomy_data if 'Project Name' in r}

    dummy_files = ["tech-1.jpg", "tech-2.jpg", "blueprint.jpg", "abstract.jpg"]
    all_clients = set()
    timeline_data = []
    count = 0

    for i, row in enumerate(main_data):
        name = row.get("Slug Name")
        if not name: continue

        # --- METADATA MAPPING ---
        title = row.get("Descriptive Name") or name
        slug = name.lower().replace(' ', '-').replace('/', '-')
        
        # Lookups
        skill_row = skills_map.get(name, {})
        tax_row = taxonomy_map.get(name, {}) # Try strict match
        
        # Data Fields
        employer = row.get("Employer", "")
        raw_client = row.get("Client", "")
        days = row.get("Days", "0")
        
        # Client List
        clients = [c.strip() for c in raw_client.split('/') if c.strip()]
        for c in clients: all_clients.add(c)

        # --- FILTERING TAGS (The "Index" Data) ---
        # We explicitly pull these for the "Filter Bar"
        industry = tax_row.get("Industry", "Other")
        category = tax_row.get("Category", "Uncategorized")
        
        # TODO: Add "Tools" column to Main.csv later. For now, infer generic CAD if skill exists.
        tools = []
        if skill_row.get("CAD Modeling", "0") != "0":
            tools.append("CAD") 

        # --- BOM SKILLS (The "Detail" Data) ---
        # Extracts ALL skills > 0% (Removed the [:8] limit!)
        bom_skills = []
        for k, v in skill_row.items():
            if k not in ["Name", "Project Start", "Project End", "days", "Phase ->", "%"]:
                try:
                    if float(v.replace('%','')) > 0:
                        bom_skills.append(k)
                except: pass
        
        # Sort skills by highest percentage? (Requires storing value, simpler to just list for now)

        # --- IMAGE LOGIC ---
        asset_row = assets_map.get(name, {})
        local_path = asset_row.get("misc_files_", "")
        hero_image = f"../../assets/placeholders/{dummy_files[i % 4]}"
        
        # --- MDX GENERATION ---
        mdx_body = f"""---
title: {json.dumps(title)}
slug: "{slug}"
date: "{row.get('Project Start Date raw', '')}"
endDate: "{row.get('Project End Date raw', '')}"
duration: {days}
employer: "{employer}"
client: {json.dumps(clients)}
industry: "{industry}"
category: "{category}"
tools: {json.dumps(tools)}
tags: {json.dumps(bom_skills)} 
heroImage: "{hero_image}"
draft: false
description: "{title} - {industry} project for {employer}."
---
import {{ YouTube }} from '@astro-community/astro-embed-youtube';

## Project Overview
**{title}** ({row.get('Title', 'Engineer')}). 
**Industry:** {industry} | **Category:** {category}

> *Auto-generated placeholder content.*

### Bill of Materials (Skills Used)
{', '.join(bom_skills)}

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
<ModelViewer src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" alt="Sample 3D Model" />
"""
        with open(os.path.join(OUTPUT_CONTENT_DIR, f"{slug}.mdx"), "w", encoding="utf-8") as f:
            f.write(mdx_body)
        
        # Timeline Data
        timeline_data.append({
            "title": title,
            "start": row.get('Project Start Date raw', ''),
            "end": row.get('Project End Date raw', ''),
            "employer": employer,
            "industry": industry
        })
        count += 1

    print(f"\n✅ Refreshed {count} MDX files with full taxonomy.")
    
    # Write Globals
    with open(os.path.join(OUTPUT_DATA_DIR, "timeline.json"), "w") as f:
        json.dump(timeline_data, f, indent=2)

if __name__ == "__main__":
    process_projects()
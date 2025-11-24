import os
import csv
import json
import urllib.parse
import urllib.request

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
OUTPUT_CONTENT_DIR = "src/content/projects"
OUTPUT_DATA_DIR = "src/data"
ASSETS_DIR = "src/assets/placeholders"

# Your R2 Public Domain
# We assume a strict structure: R2_DOMAIN / {slug} / {filename}
R2_DOMAIN = "https://assets.yourdomain.com"

# Ensure directories exist
os.makedirs(OUTPUT_CONTENT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)

def ensure_dummy_assets():
    """Downloads high-quality placeholder images if they don't exist locally."""
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
    
    dummies = [
        ("tech-1.jpg", "https://picsum.photos/id/1/800/600"),
        ("tech-2.jpg", "https://picsum.photos/id/20/800/600"),
        ("blueprint.jpg", "https://picsum.photos/id/201/800/600"),
        ("abstract.jpg", "https://picsum.photos/id/180/800/600")
    ]
    
    print("🎨 Checking dummy assets...")
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
    print("🏗️  Processing Projects (Physical Convention Mode)...")
    
    # 1. Load Data (We dropped assets.csv!)
    main_data = read_csv(os.path.join(SOURCE_DIR, "Main.csv"), "Slug Name")
    skills_data = read_csv(os.path.join(SOURCE_DIR, "Expertise.csv"), "Name")
    taxonomy_data = read_csv(os.path.join(SOURCE_DIR, "Taxonomy.csv"), "Project Name")

    # 2. Create Lookup Maps
    skills_map = {r['Name']: r for r in skills_data if 'Name' in r}
    taxonomy_map = {r['Project Name']: r for r in taxonomy_data if 'Project Name' in r}

    dummy_files = ["tech-1.jpg", "tech-2.jpg", "blueprint.jpg", "abstract.jpg"]
    all_clients = set()
    timeline_data = []
    count = 0

    for i, row in enumerate(main_data):
        name = row.get("Slug Name")
        if not name: continue

        # --- METADATA ---
        title = row.get("Descriptive Name") or name
        # This SLUG is now your Source of Truth for folders
        slug = name.lower().strip().replace(' ', '-').replace('/', '-')
        
        # --- PHYSICAL R2 MAPPING ---
        # We don't ask "Where is it?" We say "It IS here."
        # You must create a folder in R2 named exactly matching {slug}
        r2_folder = slug 
        
        # Placeholder logic for now (Visuals)
        hero_image_path = f"../../assets/placeholders/{dummy_files[i % 4]}"
        
        # The "Real" Asset Comment (Standardized)
        hero_comment = f"# REAL ASSET: {R2_DOMAIN}/{r2_folder}/hero.jpg"

        # ... (Dates, Clients, Employer logic remains same) ...
        start_date_raw = row.get("Project Start Date raw", "")
        end_date_raw = row.get("Project End Date raw", "")
        employer = row.get("Employer", "")
        raw_client = row.get("Client", "")
        display_employer = employer
        if raw_client and "Mechanistic" in employer: display_employer = "Mechanistic (Consulting)"
        client_list = []
        if raw_client:
            client_list = [c.strip() for c in raw_client.split('/') if c.strip()]
            for c in client_list: all_clients.add(c)

        # Filters
        tax_row = taxonomy_map.get(name, {})
        industry = tax_row.get("Industry", "Other")
        category = tax_row.get("Category", "Uncategorized")
        
        tools = []
        if row.get("Tools"): 
             tools = [t.strip() for t in row.get("Tools").split(',')]

        # Skills
        skill_row = skills_map.get(name, {})
        bom_skills = []
        for k, v in skill_row.items():
            if k not in ["Name", "Project Start", "Project End", "days", "Phase ->", "%"]:
                try:
                    if float(v.replace('%','')) > 0: bom_skills.append(k)
                except: pass

        # --- MDX GENERATION ---
        mdx_body = f"""---
title: {json.dumps(title)}
slug: "{slug}"
date: "{start_date_raw}"
endDate: "{end_date_raw}"
employer: "{display_employer}"
client: {json.dumps(client_list)}
industry: "{industry}"
category: "{category}"
tools: {json.dumps(tools)}
tags: {json.dumps(bom_skills)}
heroImage: "{hero_image_path}" {hero_comment}
draft: false
description: "{title} - {industry} project."
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
<ModelViewer src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" alt="Sample 3D Model" />
"""
        with open(os.path.join(OUTPUT_CONTENT_DIR, f"{slug}.mdx"), "w", encoding="utf-8") as f:
            f.write(mdx_body)
        
        timeline_data.append({
            "title": title,
            "start": start_date_raw,
            "end": end_date_raw,
            "employer": display_employer
        })
        count += 1

    print(f"\n✅ Refreshed {count} MDX files using Physical Convention.")
    
    with open(os.path.join(OUTPUT_DATA_DIR, "timeline.json"), "w") as f:
        json.dump(timeline_data, f, indent=2)

def process_specs():
    # ... (Keep your existing specs function or copy from previous if needed) ...
    pass

if __name__ == "__main__":
    process_projects()
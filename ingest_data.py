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
R2_DOMAIN = "https://assets.yourdomain.com"

# Ensure directories exist
os.makedirs(OUTPUT_CONTENT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)

def ensure_dummy_assets():
    """Downloads high-quality placeholder images if they don't exist locally."""
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
        print(f"📁 Created assets directory: {ASSETS_DIR}")

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
            except Exception as e:
                print(f"   ❌ Failed to download {filename}: {e}")

def read_csv_with_header_search(filepath, header_trigger="Name"):
    if not os.path.exists(filepath): return []
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = f.readlines()
    
    start_index = 0
    headers = []
    for i, line in enumerate(lines):
        if header_trigger in line:
            headers = next(csv.reader([line]))
            start_index = i + 1
            break
    
    if not headers: return []
    
    data = []
    reader = csv.reader(lines[start_index:])
    for row in reader:
        if not row or not row[0].strip(): continue
        item = {}
        for h_index, h_name in enumerate(headers):
            if h_index < len(row):
                item[h_name.strip()] = row[h_index].strip()
        data.append(item)
    return data

def extract_skills_from_data(skill_data):
    """Helper function to extract skills from a skill data dictionary."""
    skills = []
    if not skill_data: return skills
    for k, v in skill_data.items():
        if k not in ["Name", "Project Start", "Project End", "days", "Phase ->", "%", ""]:
            try:
                val_clean = v.replace('%', '').strip()
                if val_clean and float(val_clean) > 0:
                    skills.append(k)
            except ValueError:
                pass
    return skills

def process_projects():
    ensure_dummy_assets()
    print("🏗️  Processing Projects...")
    
    # Load Data
    projects = read_csv_with_header_search(os.path.join(SOURCE_DIR, "Main.csv"), "Slug Name")
    
    # SPECIAL HANDLING FOR EXPERTISE.CSV (Your improved logic)
    skills_map = {}
    skills_path = os.path.join(SOURCE_DIR, "Expertise.csv")
    
    if os.path.exists(skills_path):
        with open(skills_path, 'r', encoding='utf-8-sig') as f:
            lines = f.readlines()
            
        # Find the header row manually
        header_row = None
        start_idx = 0
        for i, line in enumerate(lines):
            if "Name" in line and "Project Start" in line:
                reader = csv.reader([line])
                header_row = next(reader)
                start_idx = i + 1
                break
        
        if header_row:
            headers = [h.strip() for h in header_row]
            reader = csv.reader(lines[start_idx:])
            for row in reader:
                if len(row) < 2: continue
                item = {}
                for h_i, h_val in enumerate(headers):
                    if h_i < len(row) and h_val:
                        item[h_val] = row[h_i]
                if "Name" in item:
                    skills_map[item["Name"]] = item
    
    print(f"   📊 Loaded Skills for {len(skills_map)} projects")

    dummy_files = ["tech-1.jpg", "tech-2.jpg", "blueprint.jpg", "abstract.jpg"]
    all_clients = set()
    count = 0

    for i, row in enumerate(projects):
        name = row.get("Slug Name")
        if not name: continue
        
        lookup_name = row.get("Slug Name")
        title = row.get("Descriptive Name") or name
        slug = name.lower().replace(' ', '-').replace('/', '-')
        
        start_date_raw = row.get("Project Start Date raw", "")
        end_date_raw = row.get("Project End Date raw", "")
        
        raw_client = row.get("Client", "")
        employer = row.get("Employer", "")
        display_employer = employer
        if raw_client and "Mechanistic" in employer:
            display_employer = "Mechanistic (Consulting)"
        
        client_list = []
        if raw_client:
            client_list = [c.strip() for c in raw_client.split('/') if c.strip()]
            for c in client_list: all_clients.add(c)

        # Skills Logic
        skill_data = skills_map.get(lookup_name)
        skills = extract_skills_from_data(skill_data)
        
        if not skills:
            desc_name = row.get("Descriptive Name")
            fallback_skill_data = skills_map.get(desc_name)
            skills = extract_skills_from_data(fallback_skill_data)

        # 3. MDX Body
        # NO IMPORTS HERE - We rely on Global Registration in [...slug].astro
        hero_image_path = f"../../assets/placeholders/{dummy_files[i % 4]}"
        
        mdx_body = f"""---
title: {json.dumps(title)}
slug: "{slug}"
date: "{start_date_raw}"
endDate: "{end_date_raw}"
employer: "{display_employer}"
client: {json.dumps(client_list)}
tags: {json.dumps(skills[:8])}
heroImage: "{hero_image_path}"
draft: false
description: "Field notes for {title}."
---

## Overview
**{title}** ({row.get('Title', 'Engineer')}). 

> *Auto-generated placeholder content.*

### Key Competencies
{', '.join(skills[:10])}

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
<ModelViewer src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" alt="Sample 3D Model" />
"""
        with open(os.path.join(OUTPUT_CONTENT_DIR, f"{slug}.mdx"), "w", encoding="utf-8") as f:
            f.write(mdx_body)
        
        count += 1

    print(f"   ✅ Refreshed {count} MDX files with tags.")

if __name__ == "__main__":
    process_projects()
import os
import csv
import json
import re
import shutil
from datetime import datetime

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"  # Put your CSVs here
OUTPUT_CONTENT_DIR = "src/content/projects"
OUTPUT_DATA_DIR = "src/data"

# Ensure directories exist
os.makedirs(OUTPUT_CONTENT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)

def clean_key(key):
    """Normalizes CSV headers to variable-friendly names"""
    return key.strip().lower().replace(" ", "_").replace("/", "_").replace("-", "_")

def read_csv_with_header_search(filepath, header_trigger="Name"):
    """
    Reads a CSV but skips rows until it finds the header row.
    Useful for sheets like 'Expertise' that have metadata rows at the top.
    """
    with open(filepath, 'r', encoding='utf-8-sig') as f:
        lines = f.readlines()
    
    start_index = 0
    headers = []
    
    for i, line in enumerate(lines):
        if header_trigger in line:
            # Found the header row!
            # Use CSV reader to parse just this line to get proper split
            headers = next(csv.reader([line]))
            start_index = i + 1
            break
            
    if not headers:
        print(f"⚠️  Warning: Could not find header '{header_trigger}' in {filepath}")
        return []

    # Parse the rest of the file using these headers
    data = []
    reader = csv.reader(lines[start_index:])
    for row in reader:
        if not row or not row[0].strip(): continue # Skip empty lines
        
        # Create dictionary safely (handle row length mismatch)
        item = {}
        for h_index, h_name in enumerate(headers):
            if h_index < len(row):
                item[h_name.strip()] = row[h_index].strip()
        data.append(item)
        
    return data

# --- 1. PROCESS SPECS (Personal Datasheet) ---
def process_specs():
    print("⚙️  Processing Specs...")
    specs_path = os.path.join(SOURCE_DIR, "Specs.csv")
    if not os.path.exists(specs_path):
        print("   Skipping (Specs.csv not found)")
        return

    raw_data = read_csv_with_header_search(specs_path, header_trigger="Category")
    
    # We just need to clean this up for JSON
    clean_specs = []
    for row in raw_data:
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
    print(f"   ✅ Generated src/data/specs.json ({len(clean_specs)} items)")

# --- 2. PROCESS PROJECTS & SKILLS ---
def process_projects():
    print("🏗️  Processing Projects...")
    
    # Load Main Data
    main_path = os.path.join(SOURCE_DIR, "Main.csv")
    if not os.path.exists(main_path):
        print("❌ Error: Main.csv not found!")
        return
    
    # Main.csv usually has headers on row 1, so standard read is fine, 
    # but we use our safe reader just in case.
    projects = read_csv_with_header_search(main_path, header_trigger="Slug Name")
    
    # Load Skills Data (Expertise) to merge
    skills_path = os.path.join(SOURCE_DIR, "Expertise.csv")
    skills_data = {} # Map Name -> Skills Dict
    if os.path.exists(skills_path):
        raw_skills = read_csv_with_header_search(skills_path, header_trigger="Name")
        for row in raw_skills:
            # Store the whole row, keyed by project name for lookup
            skills_data[row.get("Name")] = row

    # Global lists to build side-files
    all_clients = set()
    timeline_data = []

    for row in projects:
        # 1. Basic Metadata
        slug_name = row.get("Slug Name")
        if not slug_name: continue # Skip empty rows

        # Fallback logic for Title: Descriptive > Slug > "Untitled"
        descriptive_name = row.get("Descriptive Name")
        title = descriptive_name if descriptive_name else slug_name
        
        # Date Logic
        start_date_raw = row.get("Project Start Date raw", "")
        end_date_raw = row.get("Project End Date raw", "")
        
        # Client Logic (Trust Wall)
        raw_client = row.get("Client", "")
        employer = row.get("Employer", "")
        
        # "Mechanistic" Logic
        # If we have a client, and employer is empty or generic, we imply consulting
        display_employer = employer
        if raw_client and "Mechanistic" in employer:
            # It's a consulting gig
            display_employer = "Mechanistic (Consulting)"
            
        # Split clients for the "Trust Wall"
        if raw_client:
            # Split by slash, strip whitespace
            clients = [c.strip() for c in raw_client.split('/')]
            for c in clients:
                if c: all_clients.add(c)
        else:
            clients = []

        # 2. Merge Skills
        # Try to find this project in the skills database
        project_skills = []
        phase_vector = {}
        
        if slug_name in skills_data:
            s_row = skills_data[slug_name]
            # Extract non-zero skills (Assuming columns 6 onwards are skills)
            # We iterate dict items to be safe
            for k, v in s_row.items():
                # Heuristic: If value is a number > 0 and not a date/name
                try:
                    val = float(v)
                    if val > 0 and k not in ["days", "midpoint Y", "Project Start", "Project End"]:
                        project_skills.append(k)
                except ValueError:
                    continue
        
        # 3. Generate Frontmatter
        # We use json.dumps for safe string escaping of descriptions/tags
        mdx_content = f"""---
title: {json.dumps(title)}
slug: "{slug_name.lower().replace(' ', '-')}"
date: "{start_date_raw}"
endDate: "{end_date_raw}"
employer: "{display_employer}"
client: {json.dumps(clients)}
tags: {json.dumps(project_skills[:10])} # Top 10 skills
industry: "{row.get('Industry', '')}"
category: "{row.get('Category', '')}"
codename: "{row.get('Codename', '')}"
draft: false
---

## Overview
Case study for **{title}**.

### Project Details
* **Role:** {row.get('Title', 'Mechanical Engineer')}
* **Duration:** {row.get('Days', '')} days

### Key Skills
{', '.join(project_skills[:5]) if project_skills else "No specific skills tagged."}

> *Auto-generated content placeholder.*
"""
        
        # Write MDX file
        filename = f"{slug_name.lower().replace(' ', '-')}.mdx"
        with open(os.path.join(OUTPUT_CONTENT_DIR, filename), "w", encoding="utf-8") as f:
            f.write(mdx_content)
            
        # Add to timeline data
        timeline_data.append({
            "title": title,
            "start": start_date_raw,
            "end": end_date_raw,
            "employer": display_employer,
            "category": row.get("Category", "")
        })

    print(f"   ✅ Generated {len(projects)} MDX files.")
    
    # Write Global Data Files
    
    # Clients
    sorted_clients = sorted(list(all_clients))
    with open(os.path.join(OUTPUT_DATA_DIR, "clients.json"), "w") as f:
        json.dump(sorted_clients, f, indent=2)
    print(f"   ✅ Generated src/data/clients.json ({len(sorted_clients)} clients)")

    # Timeline
    with open(os.path.join(OUTPUT_DATA_DIR, "timeline.json"), "w") as f:
        json.dump(timeline_data, f, indent=2)
    print(f"   ✅ Generated src/data/timeline.json")

if __name__ == "__main__":
    process_specs()
    process_projects()
    print("\n🚀 Ingestion Complete.")
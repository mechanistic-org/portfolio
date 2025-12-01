import os
import csv
import json
import glob
import urllib.request
import shutil
import math
import random
from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np

# --- CONFIGURATION ---
SOURCE_DIR = "data_source"
OUTPUT_DATA_DIR = "src/config"
OUTPUT_CONTENT_DIR = "src/content/projects"
ASSETS_DIR = "public/assets"
LOCAL_R2_DIR = "public/assets/r2"

# Determine Staging Dir
# Priority: 1. Env Var, 2. Sibling Directory, 3. Local Directory
STAGING_DIR_ENV = os.environ.get("R2_STAGING_PATH")
STAGING_DIR_SIBLING = os.path.abspath(os.path.join(os.getcwd(), "..", "quantum-assets", "R2_STAGING"))
STAGING_DIR_LOCAL = os.path.abspath("R2_STAGING")

if STAGING_DIR_ENV and os.path.exists(STAGING_DIR_ENV):
    STAGING_DIR = STAGING_DIR_ENV
    print(f"📂 Using Staging Dir (Env): {STAGING_DIR}")
elif os.path.exists(STAGING_DIR_SIBLING):
    STAGING_DIR = STAGING_DIR_SIBLING
    print(f"📂 Using Staging Dir (Sibling): {STAGING_DIR}")
else:
    STAGING_DIR = STAGING_DIR_LOCAL
    print(f"📂 Using Staging Dir (Local): {STAGING_DIR}")

# Determine R2 Domain
# Default to local proxy for dev, override for prod
R2_DOMAIN = os.environ.get("PUBLIC_R2_DOMAIN", "https://assets.eriknorris.com")
print(f"🌐 Using R2 Domain: {R2_DOMAIN}")

def find_file(suffix):
    """Find a file in SOURCE_DIR ending with suffix."""
    pattern = os.path.join(SOURCE_DIR, f"*{suffix}")
    matches = glob.glob(pattern)
    return matches[0] if matches else None

def validate_headers(headers, required_set, filename):
    """Fail hard if critical headers are missing."""
    missing = required_set - set(headers)
    if missing:
        raise ValueError(f"❌ CRITICAL: {filename} is missing required headers: {missing}")

def read_csv_smart(filepath, header_trigger="Name", required_headers=None):
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
    
    # Validation
    headers = [h.strip() for h in lines[start_idx].split(',')]
    if required_headers:
        validate_headers(set(headers), required_headers, os.path.basename(filepath))

    reader = csv.DictReader(lines[start_idx:])
    data = []
    for row in reader:
        clean_row = {k.strip(): v.strip() for k, v in row.items() if k}
        if clean_row: data.append(clean_row)
    return data

def ensure_dummy_assets():
    if not os.path.exists(ASSETS_DIR):
        os.makedirs(ASSETS_DIR)
    dummies = [("tech-1.jpg", "https://picsum.photos/id/1/800/600")]
    for filename, url in dummies:
        path = os.path.join(ASSETS_DIR, filename)
        if not os.path.exists(path):
            try:
                urllib.request.urlretrieve(url, path)
            except: pass

def sync_r2_assets(slug, source_dir):
    """Copy local R2 staging assets to public/assets/r2"""
    # If using a remote R2 domain, DO NOT copy files locally
    if R2_DOMAIN.startswith("http"):
        # print(f"☁️  Skipping local copy for {slug} (using remote R2)")
        return

    target_dir = os.path.join(LOCAL_R2_DIR, slug)
    if not os.path.exists(target_dir):
        os.makedirs(target_dir)
    
    # Copy all files
    for item in os.listdir(source_dir):
        s = os.path.join(source_dir, item)
        d = os.path.join(target_dir, item)
        if os.path.isfile(s):
            shutil.copy2(s, d)

def generate_radar_chart(skill_data, slug):
    """Generate SVG radar chart for skills"""
    if not skill_data: return None
    
    # Setup data
    categories = [d['name'] for d in skill_data]
    values = [d['value'] for d in skill_data]
    N = len(categories)
    
    if N < 3: return None

    # Close the loop
    values += values[:1]
    angles = [n / float(N) * 2 * math.pi for n in range(N)]
    angles += angles[:1]
    
    # Plot
    fig, ax = plt.subplots(figsize=(6, 6), subplot_kw=dict(polar=True))
    
    # Style
    ax.set_facecolor('none')
    fig.patch.set_alpha(0.0)
    
    # Draw one axe per variable + add labels
    plt.xticks(angles[:-1], categories, color='#a3a3a3', size=10)
    
    # Draw ylabels
    ax.set_rlabel_position(0)
    plt.yticks([25, 50, 75], ["", "", ""], color="grey", size=7)
    plt.ylim(0, max(values) * 1.1)
    
    # Plot data
    ax.plot(angles, values, linewidth=2, linestyle='solid', color='#20C20E')
    ax.fill(angles, values, '#20C20E', alpha=0.4)
    
    # Grid color
    ax.grid(color='#404040')
    ax.spines['polar'].set_visible(False)
    
    # Save to STAGING
    output_dir = os.path.join(STAGING_DIR, slug)
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "skill-graph.svg")
    plt.savefig(output_path, transparent=True, bbox_inches='tight')
    plt.close()
    
    return f"{R2_DOMAIN}/{slug}/skill-graph.svg"

def generate_donut_chart(stats, slug):
    """Generate SVG donut chart for part count breakdown"""
    if not stats: return None
    
    labels = []
    sizes = []
    colors = []
    
    # Map keys to colors
    color_map = {
        "plastic": "#3b82f6", # Blue
        "metal": "#ef4444", # Red
        "pcb": "#10b981", # Green
        "pcba": "#f59e0b" # Yellow
    }
    
    for k, v in stats.items():
        try:
            val = int(v)
            if val > 0:
                labels.append(k.title())
                sizes.append(val)
                colors.append(color_map.get(k, "#888888"))
        except: pass
            
    if not sizes: return None

    fig, ax = plt.subplots(figsize=(6, 6))
    
    # Donut
    wedges, texts, autotexts = ax.pie(sizes, labels=labels, autopct='%1.1f%%', startangle=90, colors=colors, pctdistance=0.85, textprops=dict(color="white"))
    
    # Draw circle
    centre_circle = plt.Circle((0,0),0.70,fc='none')
    fig = plt.gcf()
    fig.gca().add_artist(centre_circle)
    
    # Equal aspect ratio ensures that pie is drawn as a circle
    ax.axis('equal')  
    plt.tight_layout()
    
    # Save to STAGING
    output_dir = os.path.join(STAGING_DIR, slug)
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "part-graph.svg")
    plt.savefig(output_path, transparent=True, bbox_inches='tight')
    plt.close()
    
    return f"{R2_DOMAIN}/{slug}/part-graph.svg"

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
    print("🚀 Processing Projects...")
    main = read_csv_smart(find_file("Main.csv"), "Name", required_headers={"Name", "Employer"})
    
    tax = {r.get('Project Name') or r.get('Name'): r for r in read_csv_smart(find_file("Taxonomy.csv"), "Project Name")}
    if not tax: tax = {r.get('Name'): r for r in read_csv_smart(find_file("Taxonomy.csv"), "Name")}
    
    phases = {r['Name']: r for r in read_csv_smart(find_file("Phase.csv"))}
    stats = {r['Name']: r for r in read_csv_smart(find_file("Stats.csv") or find_file("Part count.csv"))}
    
    # New Flat Skill Files
    expertise_rows = read_csv_smart(find_file("Expertise.csv"), "Project Start")
    expertise_map = {r.get('Name'): r for r in expertise_rows}
    
    skills_rows = read_csv_smart(find_file("Skills.csv"), "Project Start")
    skills_map = {r.get('Name'): r for r in skills_rows}

    dummy_files = ["tech-1.jpg", "tech-2.jpg", "blueprint.jpg", "abstract.jpg"]
    all_clients = set()
    count = 0

    # --- MAPS ---
    CLIENT_ICON_MAP = {
        "Google": "google",
        "Microsoft": "microsoft",
        "Apple": "apple",
        "Amazon": "amazon",
        "Meta": "meta",
        "Tesla": "tesla",
        "SpaceX": "spacex",
        "NVIDIA": "nvidia",
        "Intel": "intel",
        "AMD": "amd",
        "Samsung": "samsung",
        "Sony": "sony",
        "Nintendo": "nintendo",
        "Adobe": "adobe",
        "Autodesk": "autodesk",
        "Blender": "blender",
        "Unity": "unity",
        "Unreal Engine": "unrealengine",
        "Figma": "figma",
        "Slack": "slack",
        "Discord": "discord",
        "Spotify": "spotify",
        "Netflix": "netflix",
        "Uber": "uber",
        "Lyft": "lyft",
        "Airbnb": "airbnb",
        "Stripe": "stripe",
        "PayPal": "paypal",
        "Square": "square",
        "Shopify": "shopify",
        "Salesforce": "salesforce",
        "Oracle": "oracle",
        "IBM": "ibm",
        "HP": "hp",
        "Dell": "dell",
        "Lenovo": "lenovo",
        "Asus": "asus",
        "Acer": "acer",
        "Razer": "razer",
        "Logitech": "logitech",
        "Corsair": "corsair",
        "Raspberry Pi": "raspberrypi",
        "Arduino": "arduino",
        "Espressif": "espressif",
        "Nordic Semiconductor": "nordicsemiconductor",
        "Texas Instruments": "texasinstruments",
        "Analog Devices": "analogdevices",
        "STMicroelectronics": "stmicroelectronics",
        "NXP": "nxp",
        "Infineon": "infineon",
        "Renesas": "renesas",
        "Microchip": "microchip",
        "Qualcomm": "qualcomm",
        "Broadcom": "broadcom",
        "MediaTek": "mediatek",
        "Arm": "arm",
        "RISC-V": "riscv",
        "NASA": "nasa",
        "ESA": "esa",
        "CERN": "cern",
        "MIT": "mit",
        "Stanford": "stanford",
        "Berkeley": "berkeley",
        "Caltech": "caltech",
        "CMU": "cmu",
        "Georgia Tech": "georgiatech",
        "ETH Zurich": "ethzurich",
        "EPFL": "epfl",
        "TUM": "tum",
        "Cambridge": "cambridge",
        "Oxford": "oxford",
        "Imperial College": "imperial",
        "UCL": "ucl",
        "Tsinghua": "tsinghua",
        "Peking": "peking",
        "NUS": "nus",
        "NTU": "ntu",
        "KAIST": "kaist",
        "Seoul National": "snu",
        "Tokyo": "u-tokyo",
        "Kyoto": "kyoto",
        "Osaka": "osaka",
        "Tohoku": "tohoku",
        "Hokkaido": "hokkaido",
        "Kyushu": "kyushu",
        "Nagoya": "nagoya",
        "Tokyo Tech": "titech",
        
        "Keio": "keio",
        "Waseda": "waseda",
        "Mechanistic": "mechanistic",
    }

    TOOL_ICON_MAP = {
        "Solidworks": "dassaultsystemes",
        "Creo": "ptc",
        "ProEngineer": "ptc",
        "Rhino": "rhinoceros",
        "Keyshot": "keyshot", 
        "Figma": "figma",
        "Adobe Creative Suite": "adobecreativecloud",
        "Python": "python",
        "C++": "cplusplus",
        "Arduino": "arduino",
        "Raspberry Pi": "raspberrypi",
        "Altium": "altiumdesigner",
        "KiCad": "kicad",
        "Fusion 360": "autodesk",
        "Blender": "blender",
        "Unity": "unity",
        "Unreal": "unrealengine",
        "Matlab": "mathworks",
        "Simulink": "mathworks",
        "Ansys": "ansys",
        "Abaqus": "dassaultsystemes",
        "Comsol": "comsol",
        "LabVIEW": "ni",
        "Git": "git",
        "Jira": "jira",
        "Confluence": "confluence",
        "Slack": "slack",
        "Notion": "notion",
        "Trello": "trello",
        "Asana": "asana",
        "Excel": "microsoft",
        "PowerPoint": "microsoft",
        "Word": "microsoft",
    }

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

        # Taxonomy / Category
        t_row = tax.get(name, {})
        industry = t_row.get("Industry", "Other")
        # Prefer Main.csv Category, fallback to Taxonomy
        category = row.get("Category") or t_row.get("Category", "")
        
        tools = [t.strip() for t in row.get("Tools", "").split(',') if t.strip()]
        
        # Map Tools to Icons
        tool_icons = []
        for t in tools:
            # Try exact match or partial
            slug_icon = TOOL_ICON_MAP.get(t)
            if not slug_icon:
                # Try simple lookup
                slug_icon = TOOL_ICON_MAP.get(t.split(' ')[0])
            if slug_icon:
                tool_icons.append(slug_icon)
        
        # Team Size
        team_size = row.get("Team Size") or row.get("Team") or "Unknown"

        p_row = phases.get(name, {})
        prod = "Concept"
        if float(p_row.get("Production", p_row.get("Phase 5", 0)) or 0) > 0: prod = "Mass Production"
        elif float(p_row.get("Validation", p_row.get("Phase 4", 0)) or 0) > 0: prod = "Manufacturing Prep"
        elif float(p_row.get("Development", p_row.get("Phase 3", 0)) or 0) > 0: prod = "Prototyping"

        s_row = stats.get(name, {})
        parts = {"plastic": int(float(s_row.get("Plastic",0) or 0)), "metal": int(float(s_row.get("Sheetmetal",0) or 0)), "pcb": int(float(s_row.get("PCB",0) or 0))}
        
        # --- SKILLS (Expertise.csv) ---
        skill_row = expertise_map.get(name, {})
        weighted = []
        ignored_keys = {"Name", "Project Start", "Project End", "days", "midpoint", "✔️", "▲", "midpoint Y"}
        for k, v in skill_row.items():
            if k in ignored_keys or not v: continue
            try:
                val = float(v.replace('%','').strip())
                if val > 0:
                    weighted.append((k, val))
            except: pass
        
        weighted.sort(key=lambda x: x[1], reverse=True)
        bom = [s[0] for s in weighted] # Top skills as tags
        skill_data = [{"name": s[0], "value": round(s[1], 1)} for s in weighted[:6]]

        # --- ADDITIONAL SKILLS (Skills.csv) ---
        add_skill_row = skills_map.get(name, {})
        add_weighted = []
        for k, v in add_skill_row.items():
            if k in ignored_keys or not v: continue
            try:
                val = float(v.replace('%','').strip())
                if val > 0:
                    add_weighted.append((k, val))
            except: pass
        add_weighted.sort(key=lambda x: x[1], reverse=True)
        additional_skills = [s[0] for s in add_weighted[:10]] # Top 10 additional skills

        # --- LOGIC: Duration & Status ---
        start_date_raw = row.get('Project Start Date', '') or row.get('Project Start Date raw', '')
        end_date_raw = row.get('Project End Date', '') or row.get('Project End Date raw', '')
        duration_str = "Active"
        if start_date_raw:
            try:
                # Try multiple formats if needed, currently assuming m/d/Y
                start = datetime.strptime(start_date_raw, "%m/%d/%Y")
                end = datetime.strptime(end_date_raw, "%m/%d/%Y") if end_date_raw else datetime.now()
                diff_days = (end - start).days
                if diff_days > 365:
                    duration_str = f"{diff_days / 365:.1f} Years"
                else:
                    months = max(1, round(diff_days / 30))
            except: pass
        
        status_label = "Completed"
        if not end_date_raw: status_label = "Ongoing"

        # --- IMAGES ---
        # Look for images in STAGING_DIR/slug
        # If found, copy to LOCAL_R2_DIR and use R2_DOMAIN/slug/image
        # If not, use dummy
        
        hero_img = f"/assets/placeholders/{random.choice(dummy_files)}"
        gallery_images = []
        
        staging_project_dir = os.path.join(STAGING_DIR, slug)
        
        if os.path.exists(staging_project_dir):
            # Sync assets to public/assets/r2
            sync_r2_assets(slug, staging_project_dir)
            
            for f in os.listdir(staging_project_dir):
                if f.lower().startswith("hero."):
                    hero_img = f"{R2_DOMAIN}/{slug}/{f}"
                elif f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.gif')) and "hero" not in f.lower():
                    gallery_images.append(f"{R2_DOMAIN}/{slug}/{f}")
        
        # Sort gallery
        gallery_images.sort()
        
        # Documents
        documents = []
        if os.path.exists(staging_project_dir):
             for f in os.listdir(staging_project_dir):
                if f.endswith(".pdf"):
                    documents.append({"name": f, "url": f"{R2_DOMAIN}/{slug}/{f}"})
        
        # Links
        links = []
        if row.get("Link"):
            links.append({"name": "Website", "url": row.get("Link")})

        # 3D Model
        model_url = ""
        # Check for .glb
        if os.path.exists(staging_project_dir):
            for f in os.listdir(staging_project_dir):
                if f.endswith(".glb"):
                    model_url = f"{R2_DOMAIN}/{slug}/{f}"
                    break

        # Generate Charts
        skill_graph_url = generate_radar_chart(skill_data, slug)
        part_graph_url = generate_donut_chart(parts, slug)

        # Template Replacement
        model_viewer_tag = ""
        if model_url:
            model_viewer_tag = f'<ModelViewer src="{model_url}" alt="3D Asset" />'

        content_body = f"""
import {{ YouTube }} from '@astro-community/astro-embed-youtube';

## Overview
**{title}** ({row.get('Title', 'Engineer')}). 

> *Auto-generated placeholder content.*

### Project Artifacts
<div class="my-8">
  <YouTube id="dQw4w9WgXcQ" />
</div>
{model_viewer_tag}
"""

        mdx = f"""---
title: {json.dumps(title)}
slug: "{slug}"
date: "{start_date_raw}"
endDate: "{end_date_raw}"
employer: "{employer}"
client: {json.dumps(clients)}
industry: "{industry}"
category: "{category}"
tools: {json.dumps(tools)}
toolIcons: {json.dumps(tool_icons)}
production: "{prod}"
tags: {json.dumps(bom)}
skillData: {json.dumps(skill_data)}
additionalSkills: {json.dumps(additional_skills)}
stats: {json.dumps(parts)}
teamSize: "{team_size}"
gallery: {json.dumps(gallery_images)}
documents: {json.dumps(documents)}
links: {json.dumps(links)}
heroImage: "{hero_img}" 
draft: false
description: "{title} - {industry} project."
duration: "{duration_str}"
statusLabel: "{status_label}"
skillGraph: "{skill_graph_url}"
partGraph: "{part_graph_url}"
---
{content_body}
"""
        
        out_path = os.path.join(OUTPUT_CONTENT_DIR, f"{slug}.mdx")
        with open(out_path, "w", encoding='utf-8') as f:
            f.write(mdx)
        count += 1

    print(f"✅ Generated {count} MDX files.")

    client_data = []
    for client in sorted(list(all_clients)):
        logo_name = client.lower().replace(' ', '')
        logo_path = None
        icon_slug = CLIENT_ICON_MAP.get(client) # Check map first

        # CHECK STAGING FOR LOGOS (Fallback or Override?)
        
        staging_logo_dir = os.path.join(STAGING_DIR, "_site", "logos")
        if os.path.exists(os.path.join(staging_logo_dir, f"{logo_name}.svg")):
            logo_path = f"{R2_DOMAIN}/_site/logos/{logo_name}.svg"
            # Sync logo
            if not R2_DOMAIN.startswith("http"):
                target_logo_dir = os.path.join(LOCAL_R2_DIR, "_site", "logos")
                os.makedirs(target_logo_dir, exist_ok=True)
                shutil.copy2(os.path.join(staging_logo_dir, f"{logo_name}.svg"), os.path.join(target_logo_dir, f"{logo_name}.svg"))
        elif os.path.exists(os.path.join(staging_logo_dir, f"{logo_name}.png")):
            logo_path = f"{R2_DOMAIN}/_site/logos/{logo_name}.png"
            # Sync logo
            if not R2_DOMAIN.startswith("http"):
                target_logo_dir = os.path.join(LOCAL_R2_DIR, "_site", "logos")
                os.makedirs(target_logo_dir, exist_ok=True)
                shutil.copy2(os.path.join(staging_logo_dir, f"{logo_name}.png"), os.path.join(target_logo_dir, f"{logo_name}.png"))
            
        client_data.append({
            "name": client, 
            "logo": logo_path,
            "icon": icon_slug
        })

    with open(os.path.join(OUTPUT_DATA_DIR, "clients.json"), "w") as f:
        json.dump(client_data, f, indent=2)

def sync_site_assets():
    """Sync _site directory from STAGING to LOCAL_R2_DIR"""
    if R2_DOMAIN.startswith("http"):
        # print("☁️  Skipping _site asset sync (using remote R2)")
        return

    print("🔄 Syncing _site assets...")
    source = os.path.join(STAGING_DIR, "_site")
    target = os.path.join(LOCAL_R2_DIR, "_site")
    
    if os.path.exists(source):
        if not os.path.exists(target):
            os.makedirs(target)
            
        # Sync files in root of _site
        for item in os.listdir(source):
            s = os.path.join(source, item)
            d = os.path.join(target, item)
            if os.path.isfile(s):
                shutil.copy2(s, d)
            elif os.path.isdir(s):
                # Recursive copy for subdirectories like logos
                if os.path.exists(d):
                    shutil.rmtree(d)
                shutil.copytree(s, d)

if __name__ == "__main__":
    ensure_dummy_assets()
    sync_site_assets()
    process_colors()
    process_specs()
    process_tenure()
    process_projects()
    
    # Auto-run R2 Sync
    try:
        from sync_r2 import sync_assets
        print("\n🔄 Auto-running R2 Sync...")
        sync_assets()
    except ImportError:
        print("\n⚠️  Could not import sync_r2.py. Skipping auto-sync.")
    except Exception as e:
        print(f"\n❌ Auto-sync failed: {e}")

    print("\n🚀 INGESTION COMPLETE.")
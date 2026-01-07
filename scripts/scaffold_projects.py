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
import matplotlib.pyplot as plt
import numpy as np
import time
from PIL import Image
import re
import yaml # Added for scaffold generation

# --- CONFIGURATION ---
SRC_DIR = "src" # Added for resolving multiverse path
SOURCE_DIR = "data_source_ARCHIVE"
OUTPUT_DATA_DIR = "src/config"
OUTPUT_CONTENT_DIR = "src/content/projects"
ASSETS_DIR = "public/assets"
LOCAL_R2_DIR = "public/assets/r2"

# Determine Staging Dir
# Priority: 1. Env Var, 2. Sibling Directory, 3. Local Directory
STAGING_DIR_ENV = os.environ.get("R2_STAGING_PATH")
STAGING_DIR_SIBLING = os.path.abspath(os.path.join(os.getcwd(), "..", "eriknorris-assets", "R2_STAGING"))
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
R2_DOMAIN = os.environ.get("PUBLIC_R2_DOMAIN", "/assets/r2")
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
        clean_row = {k.strip(): (v.strip() if v else "") for k, v in row.items() if k}
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
            try:
                if os.path.exists(d):
                    os.remove(d) # Clean destination first
                shutil.copy2(s, d)
            except Exception as e:
                print(f"⚠️  Skipping locked file: {item} ({e})")

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

def process_bubbles(slug, title):
    """
    The Bubble Compiler: Scans R2_STAGING/{slug}/bubbles/ and generates 'cyberspace' JSON.
    Returns: (cyberspace_json_object, theme_override) or (None, None)
    """
    bubbles_dir = os.path.join(STAGING_DIR, slug, "bubbles")
    if not os.path.exists(bubbles_dir):
        return None, None

    print(f"🔮 Compiling Bubbles for {slug}...")
    
    stickies = []
    
    # Get all subdirectories, sorted (01_, 02_, etc)
    subdirs = sorted([d for d in os.listdir(bubbles_dir) if os.path.isdir(os.path.join(bubbles_dir, d))])
    print(f"    DEBUG: Found {len(subdirs)} bubbles: {subdirs}")
    
    for i, dirname in enumerate(subdirs):
        bubble_path = os.path.join(bubbles_dir, dirname)
        
        # --- PARSE deck.md ---
        deck_file = os.path.join(bubble_path, "deck.md")
        slides = []
        
        if os.path.exists(deck_file):
            with open(deck_file, "r", encoding="utf-8") as f:
                raw_text = f.read()
                
            # Split by '---' separator
            slide_texts = [s.strip() for s in raw_text.split("---") if s.strip()]
            
            for s_text in slide_texts:
                lines = s_text.split('\n')
                s_title = ""
                s_subtitle = ""
                s_body = ""
                
                body_lines = []
                for line in lines:
                    if line.startswith("# ") and not s_title:
                        s_title = line[2:].strip()
                    elif line.startswith("## ") and not s_subtitle:
                        s_subtitle = line[3:].strip()
                    else:
                        body_lines.append(line)
                
                s_body = "\n".join(body_lines).strip()
                slides.append({
                    "title": s_title,
                    "subtitle": s_subtitle,
                    "body": s_body
                })
        else:
            # Fallback if no deck.md (e.g. Model Bubble)
            clean_name = dirname.split('_', 1)[-1].replace('_', ' ').title()
            slides.append({
                "title": clean_name,
                "subtitle": "",
                "body": ""
            })

        # --- GATHER ASSETS ---
        # Images
        bubble_images = []
        all_files = sorted(os.listdir(bubble_path))
        
        has_model = False
        model_file = None
        
            # --- SMART DEDUPLICATION ---
            # Group by "Base Name" to avoid adding -lg, -md, -sm, -xl, .avif variants as separate images
            # WEBP > JPG/PNG
            # XL > LG > MD > SM
            
        # First, group files
        image_groups = {}
        
        for f in all_files:
            lower_f = f.lower()
            
            # Check for Model
            if lower_f.endswith('.glb'):
                has_model = True
                model_file = f
                continue

            if not lower_f.endswith(('.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif')):
                continue
                
            # Determine Base Name
            # remove extension
            name_no_ext = os.path.splitext(f)[0]
            
            # remove known size suffixes
            base_name = name_no_ext
            for suffix in ['-xl', '-lg', '-md', '-sm']:
                if base_name.lower().endswith(suffix):
                    base_name = base_name[:-len(suffix)]
                    break
                    
            if base_name not in image_groups:
                image_groups[base_name] = []
            image_groups[base_name].append(f)
            
        # Pick best candidate for each group
        for base_name in sorted(image_groups.keys()):
            candidates = image_groups[base_name]
            
            # Scoring: 
            # .webp = +2, .avif = +1 (prefer webp for compatibility if naive img tag)
            # -xl = +10, -lg = +5, -md = +1
            best_candidate = candidates[0]
            best_score = -1
            
            for cand in candidates:
                score = 0
                lower_c = cand.lower()
                if ".webp" in lower_c: score += 20
                elif ".avif" in lower_c: score += 10 # If we support avif src directly
                elif ".jpg" in lower_c or ".png" in lower_c: score += 5
                
                if "-xl" in lower_c: score += 4
                elif "-lg" in lower_c: score += 3
                elif "-md" in lower_c: score += 2
                elif "-sm" in lower_c: score += 1
                
                if score > best_score:
                    best_score = score
                    best_candidate = cand
            
            f = best_candidate
            
            # Get Dimensions
            width, height = 800, 600
            try:
                 with Image.open(os.path.join(bubble_path, f)) as img:
                    width, height = img.size
            except: pass
            
            bubble_images.append({
                "src": f"{R2_DOMAIN}/{slug}/bubbles/{dirname}/{f}",
                "width": width,
                "height": height,
                "aspectRatio": width/height if height > 0 else 1.33,
                "alt": base_name
            })
            
            # Sync Bubble Assets to Public R2
            if not R2_DOMAIN.startswith("http"):
                 target_bubble_dir = os.path.join(LOCAL_R2_DIR, slug, "bubbles", dirname)
                 os.makedirs(target_bubble_dir, exist_ok=True)
                 for item in os.listdir(bubble_path):
                    s = os.path.join(bubble_path, item)
                    d = os.path.join(target_bubble_dir, item)
                    if os.path.isfile(s): 
                        try:
                            shutil.copy2(s, d)
                        except Exception as e:
                            print(f"⚠️  Copy warning {item}: {e}")

        
        # --- DETERMINE TYPE ---
        b_type = "gallery"
        if has_model: b_type = "model"
        
        # --- CONSTRUCT STICKY ---
        sticky = {
            "id": dirname, # Use folder name as ID
            "type": b_type,
            "deck": slides,
            "data": {} 
        }
        
        if b_type == "gallery":
            sticky["data"] = {
                "images": bubble_images,
                "layout": "masonry" # Default
            }
        # --- CONFIG OVERRIDE (Any Type) ---
        config_path = os.path.join(bubble_path, "config.json")
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r') as cf:
                    conf = json.load(cf)
                    # Allow type override
                    if "type" in conf:
                        sticky["type"] = conf["type"]
                    # Merge data keys
                    sticky["data"].update(conf)
                    
                    # Remove "type" from data if it accidentally got there (cleanup)
                    if "type" in sticky["data"]:
                        del sticky["data"]["type"]
            except Exception as e:
                print(f"    ⚠️ Config Error in {dirname}: {e}")

        if b_type == "gallery":
            sticky["data"]["layout"] = sticky["data"].get("layout", "masonry")
                
        elif b_type == "model":
             # Ensure specific model data is preserved if not overridden
             pass
                
        elif b_type == "model":
             sticky["data"] = {
                 "modelSrc": f"{R2_DOMAIN}/{slug}/bubbles/{dirname}/{model_file}",
                 "poster": "", # TODO: Add poster support
                 "cameraOrbit": "0deg 75deg 105%",
                 "fieldOfView": "30deg"
             }

        stickies.append(sticky)

    cyberspace = {
        "layout": "linear",
        "stickies": stickies
    }
    
    return cyberspace, "RedactedDossier"

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
    print("🚀 Scaffolding Projects (Sovereign Default Mode)...")
    
    # 1. Load Multiverse (The Single Source of Truth)
    multiverse_path = os.path.join(SRC_DIR, "data", "timeline", "multiverse.json")
    if not os.path.exists(multiverse_path):
        print("❌ CRITICAL: multiverse.json not found!")
        return

    with open(multiverse_path, "r", encoding="utf-8") as f:
        multiverse = json.load(f)
        
    projects = multiverse.get("nodes", [])
    print(f"    Loaded {len(projects)} nodes from Multiverse.")

    scaffold_count = 0
    skip_count = 0

    for node in projects:
        slug = node.get("id")
        if not slug: continue
        
        # Normalize slug for filename
        slug = slug.lower().strip().replace(' ', '-')
        
        # --- PATHS ---
        mdx_path = os.path.join(OUTPUT_CONTENT_DIR, f"{slug}.mdx")
        
        # --- ASSET SYNC (Always Run) ---
        # We still want to generate graphs and sync bubbles even if MDX exists
        # This keeps assets fresh without touching the content file
        
        # 1. Bubbles
        cyberspace, theme = process_bubbles(slug, node.get("name"))
        
        # 2. Skill Graph (Requires converting node 'skills' list to data format? 
        #    Actually, legacy used CSV data. We should use node data if available, or skip?)
        #    For now, we skip generating new SVG graphs to avoid dependency hell 
        #    unless we port the graph logic to use JSON. 
        #    The user wants "Scaffold", so let's focus on MDX presence.
        
        # --- SOVEREIGN CHECK ---
        if os.path.exists(mdx_path):
            print(f"    Existing: {slug} - SKIPPING (Sovereign)")
            skip_count += 1
            continue

        # --- SCAFFOLD NEW FILE ---
        print(f"    ✨ Scaffolding: {slug}")
        scaffold_count += 1
        
        # Construct Frontmatter from Node Data
        fm = {
            "title": node.get("name", slug),
            "slug": slug,
            "date": node.get("start_date", "2000-01-01"),
            "endDate": node.get("end_date", "2000-01-01"),
            "employer": node.get("employer", "Unknown"),
            "client": node.get("client", []),
            "industry": node.get("industry", "Other"),
            "category": node.get("category", "Project"),
            "tools": node.get("tools", []),
            "toolIcons": [], # TODO: Map icons
            "production": "Concept", # Default
            "tags": node.get("skills", []), # Use skills as tags for now
            "skillData": [],
            "additionalSkills": [],
            "phase_stats": {"Strategy": 0, "Design": 0, "Engineering": 0, "Production": 0},
            "cyberspace": cyberspace, # Injected from Bubble Scan
            "theme": theme if theme else "DataSheet",
            "teamSize": node.get("team", {}).get("text", "Unknown"),
            "gallery": [],
            "documents": [],
            "links": [],
            "heroImage": node.get("img", "/assets/placeholders/blueprint.jpg"),
            "draft": False,
            "description": node.get("description", ""),
            "duration": "Active", # Calc later
            "statusLabel": "Completed",
            "impact": ""
        }

        # Write MDX
        with open(mdx_path, "w", encoding="utf-8") as f:
            f.write("---\n")
            yaml.dump(fm, f, default_flow_style=None, sort_keys=False)
            f.write("---\n\n")
            f.write(f"import {{ YouTube }} from '@astro-community/astro-embed-youtube';\n")
            f.write(f"import ModelViewer from '@components/mdx/ModelViewer.astro';\n\n")
            f.write(f"## {fm['title']}\n\n")
            f.write(f"> *Auto-generated scaffold from Multiverse Registry.*\n")

    print(f"🏁 DONE. Scaffolds: {scaffold_count} | Skipped (Sovereign): {skip_count}")

if __name__ == "__main__":
    # Ensure directories exist
    os.makedirs(OUTPUT_DATA_DIR, exist_ok=True)
    os.makedirs(OUTPUT_CONTENT_DIR, exist_ok=True)
    os.makedirs(STAGING_DIR, exist_ok=True)
    
    # Process
    process_projects()
    print(f"DEBUG: Read {len(main)} rows from Main.csv")

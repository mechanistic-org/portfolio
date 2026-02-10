import os
import argparse
import json
import sys
import subprocess
import frontmatter
from pathlib import Path
from datetime import datetime

# --- Configuration ---
SOURCE_DIR = Path("notebook_dumps")
TARGET_DIR = Path("src/content/projects")

def check_git_status(force=False):
    """
    Ensures the repo is clean before running.
    """
    if force:
        print("⚠️  FORCE MODE: Skipping Git safety check.")
        return True

    try:
        # Check for uncommitted changes
        result = subprocess.run(
            ["git", "status", "--porcelain"], 
            capture_output=True, 
            text=True, 
            check=True
        )
        if result.stdout.strip():
            print("❌  ABORT: Git repository has uncommitted changes.")
            print("    Please commit or stash your changes before running hydration.")
            print("    Or use --force to bypass this check.")
            sys.exit(1)
        print("✅  Git status clean. Proceeding...")
    except FileNotFoundError:
        print("⚠️  Git not found. Skipping safety check.")
    except subprocess.CalledProcessError:
        print("⚠️  Not a git repository or git error. Skipping safety check.")

def find_target_mdx(slug, content_dir):
    """
    Locates the MDX file for a given slug.
    Checks:
    1. src/content/projects/{slug}/index.mdx (Folder Structure)
    2. src/content/projects/{slug}.mdx (File Structure)
    """
    # 1. Folder Structure
    folder_path = content_dir / slug / "index.mdx"
    if folder_path.exists():
        return folder_path
    
    # 2. File Structure
    file_path = content_dir / f"{slug}.mdx"
    if file_path.exists():
        return file_path

    return None


# --- Mining Logic (Stickies) ---

def get_title_from_slug(slug):
    # "01_early_id" -> "Early Id"
    parts = slug.split('_')
    if len(parts) > 1 and parts[0].isdigit():
        return " ".join([p.capitalize() for p in parts[1:]])
    return slug.replace("_", " ").title()

def parse_deck_md(bubble_dir):
    """
    Parses deck.md in the bubble directory.
    Returns a list of slide objects for the 'deck' array.
    """
    deck_path = bubble_dir / "deck.md"
    if not deck_path.exists():
        return []

    try:
        post = frontmatter.load(deck_path)
        slides = []
        
        # 1. Check for 'slides' in frontmatter (Structured)
        if "slides" in post.metadata:
            return post.metadata["slides"]

        # 2. Key Wins / Loose H2 parsing (Fallback)
        # Simple parsing of H2s as titles and content as body
        content = post.content
        lines = content.split('\n')
        current_slide = {}
        
        for line in lines:
            if line.strip().startswith("## "):
                if current_slide:
                    slides.append(current_slide)
                current_slide = {
                    "title": line.strip().replace("## ", ""),
                    "subtitle": "",
                    "body": ""
                }
            elif current_slide:
                current_slide["body"] += line + "\n"
        
        if current_slide:
            slides.append(current_slide)
            
        # Clean up bodies
        for s in slides:
            s["body"] = s["body"].strip()

        return slides

    except Exception as e:
        print(f"      ⚠️  Error parsing deck.md in {bubble_dir.name}: {e}")
        return []

def mine_model(slug, master_root, public_base_url):
    """
    Scans R2_MASTER/{slug}/3d and returns a model sticky if found.
    """
    master_3d_dir = master_root / slug / "3d"
    if not master_3d_dir.exists():
        return None

    # Priority: GLB > GLTF
    model_files = sorted([f for f in master_3d_dir.iterdir() if f.suffix.lower() == '.glb'])
    if not model_files:
        model_files = sorted([f for f in master_3d_dir.iterdir() if f.suffix.lower() == '.gltf'])
    
    if not model_files:
        return None
    
    model_file = model_files[0]
    src = f"{public_base_url}/{slug}/3d/{model_file.name}"
    
    print(f"  🧊  Found 3D Model: {model_file.name}")
    
    sticky = {
        "id": "3d_model",
        "title": "Interactive Model",
        "type": "model",
        "align": "right",
        "data": {
             "modelSrc": src,
             "cameraOrbit": "45deg 55deg 2.5m",
             "fieldOfView": "30deg"
        },
        "featuredIndices": [],
        "deck": []
    }
    return sticky

def mine_stickies(slug, master_root, public_base_url):
    """
    Scans R2_MASTER/{slug}/bubbles and returns a list of gallery stickies.
    """
    master_bubbles_dir = master_root / slug / "bubbles"
    if not master_bubbles_dir.exists():
        return []

    print(f"  ⛏️  Mining bubbles from {master_bubbles_dir}...")
    stickies = []
    
    # Sort folders
    folders = sorted([f for f in master_bubbles_dir.iterdir() if f.is_dir()])
    
    for folder in folders:
        # Check for images
        images = []
        img_files = sorted([f for f in folder.iterdir() if f.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.tif', '.tiff']])
        
        for img_file in img_files:
            fname = img_file.stem
            # Construct public src path
            # Tiff Handling: Browser cannot render .tif. We point to the processed -xl.webp version.
            if img_file.suffix.lower() in ['.tif', '.tiff']:
                safe_name = f"{fname}-xl.webp"
            else:
                safe_name = img_file.name
                
            src = f"{public_base_url}/{slug}/bubbles/{folder.name}/{safe_name}"
            
            images.append({
                "src": src,
                "alt": fname,
                "aspectRatio": 1.5 
            })
            
        # Parse Deck.md (Narrative Overlay)
        deck_slides = parse_deck_md(folder)
        
        # We create a stickie if we have images OR deck content
        if images or deck_slides:
            sticky = {
                "id": folder.name,
                "title": get_title_from_slug(folder.name),
                "type": "gallery",
                "data": {
                    "layout": "masonry",
                    "columns": 3,
                    "scattered": True,
                    "images": images
                },
                "featuredIndices": [],
                "deck": deck_slides # Inject the deck
            }
            stickies.append(sticky)
            
    return stickies


# --- Main Hydration ---

def hydrate_content(dry_run=False, force=False, target_slug=None):
    """
    Main hydration logic.
    """
    check_git_status(force)

    if not SOURCE_DIR.exists():
        print(f"❌  Source directory '{SOURCE_DIR}' not found.")
        sys.exit(1)

    # Resolve Master Root (Sibling Repo)
    # Assumption: eriknorris/scripts/hydrate_content.py -> eriknorris -> eriknorris-workspace -> R2_MASTER
    # Script is in scripts/, so resolve up to repo root, then up to workspace
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parent
    workspace_root = repo_root.parent / "eriknorris-workspace"
    master_root = workspace_root / "R2_MASTER"
    
    # Public Base URL for assets
    public_base_url = "/assets/r2"

    all_json_files = list(SOURCE_DIR.glob("*.json"))
    
    if target_slug:
        # Filter for specific slug
        json_files = [f for f in all_json_files if f.stem == target_slug]
        if not json_files:
            print(f"❌  Target slug '{target_slug}' not found in '{SOURCE_DIR}'.")
            return
        print(f"🎯  Targeted Mode: Hydrating only '{target_slug}'")
    else:
        json_files = all_json_files

    if not json_files:
        print(f"⚠️  No JSON files found in '{SOURCE_DIR}'.")
        return

    print(f"🔍  Found {len(json_files)} JSON files. Scanning targets...")
    
    stats = {"matched": 0, "skipped": 0, "updated": 0}

    for json_file in json_files:
        slug = json_file.stem # Filename without extension
        target_mdx = find_target_mdx(slug, TARGET_DIR)

        if not target_mdx:
            print(f"⏭️  Skipped: No matching MDX for '{slug}'")
            stats["skipped"] += 1
            continue

        stats["matched"] += 1

        # Load Data
        with open(json_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Load MDX
        try:
            post = frontmatter.load(target_mdx)
        except Exception as e:
            print(f"❌  Error reading '{target_mdx}': {e}")
            continue

        # Prepare Updates
        changes = []
        
        # 1. Forensic Metrics (Direct Injection)
        if "forensic_metrics" in data:
            fm = data["forensic_metrics"]
            # Ensure target exists
            if "forensic_metrics" not in post.metadata or post.metadata["forensic_metrics"] is None:
                post.metadata["forensic_metrics"] = {}
            
            # Direct Map
            for key, val in fm.items():
                if post.metadata["forensic_metrics"].get(key) != val:
                    changes.append(f"  - Update 'forensic_metrics.{key}'")
                    post.metadata["forensic_metrics"][key] = val

        # 2. War Stories (Direct Injection)
        if "war_stories" in data:
            ws = data["war_stories"]
            if post.metadata.get("war_stories") != ws:
                changes.append(f"  - Update 'war_stories' ({len(ws)} items)")
                post.metadata["war_stories"] = ws

        # 3. Isomorphics (Direct Injection)
        if "isomorphics" in data:
            iso = data["isomorphics"]
            if post.metadata.get("isomorphics") != iso:
                changes.append(f"  - Update 'isomorphics' ({len(iso)} items)")
                post.metadata["isomorphics"] = iso

        # 4. Seismobolus (Direct Injection)
        if "seismobolus" in data:
            seismo = data["seismobolus"]
            if post.metadata.get("seismobolus") != seismo:
                changes.append(f"  - Update 'seismobolus' ({len(seismo)} events)")
                post.metadata["seismobolus"] = seismo

        # 5. Reports (Direct Injection to Metadata - NOT Body for now)
        if "reports" in data:
            reports = data["reports"]
            if post.metadata.get("reports") != reports:
                changes.append(f"  - Update 'reports' ({len(reports)} items)")
                post.metadata["reports"] = reports

        # --- V2.0 SCHEMA UPDATES (Feb 2026) ---
        
        # 8. BOM (Bill of Materials)
        if "bom" in data:
            if post.metadata.get("bom") != data["bom"]:
                changes.append(f"  - Update 'bom' ({len(data['bom'])} items)")
                post.metadata["bom"] = data["bom"]

        # 9. Team Size
        if "teamSize" in data:
            if post.metadata.get("teamSize") != data["teamSize"]:
                changes.append(f"  - Update 'teamSize'")
                post.metadata["teamSize"] = data["teamSize"]

        # 10. Tags (Controlled Vocabulary)
        if "tags" in data:
            if post.metadata.get("tags") != data["tags"]:
                changes.append(f"  - Update 'tags' ({len(data['tags'])} items)")
                post.metadata["tags"] = data["tags"]

        # 11. Forensic Summary (Strict Object)
        if "forensic_summary" in data:
            fs = data["forensic_summary"]
            
            # V2 Safety Check: Must be Dict
            if isinstance(fs, str):
                print(f"  ❌ ERROR: {slug} has V1 String Summary. Migration Required.")
                continue # Skip this file to prevent corruption
            
            if post.metadata.get("forensic_summary") != fs:
                changes.append(f"  - Update 'forensic_summary' (Structured V2)")
                post.metadata["forensic_summary"] = fs

                            
        # 6. Quotes (Legacy top-level injection check)
        if "quotes" in data:
             val = data["quotes"]
             if post.metadata["metrics"].get("quotes") != val:
                changes.append(f"  - Update 'metrics.quotes' (Root Source)")
                post.metadata["metrics"]["quotes"] = val
             
             # Schema Cleanup
             if "forensic_metrics" in post.metadata and "quotes" in post.metadata["forensic_metrics"]:
                 changes.append(f"  - Delete 'forensic_metrics.quotes' (Schema Cleanup)")
                 del post.metadata["forensic_metrics"]["quotes"]

        # 7. Intelligence Bolus (Raw Content Injection)
        # Scan for corresponding {slug}.md in notebook_dumps
        dump_md_path = SOURCE_DIR / f"{slug}.md"
        if dump_md_path.exists():
             # Determine target path resolved from target_mdx parent
             target_intelligence = target_mdx.parent / "_intelligence.md"
             
             # Read source content
             try:
                 with open(dump_md_path, "r", encoding="utf-8") as f:
                     raw_intelligence = f.read()
                 
                 # Check if update needed
                 needs_update = True
                 if target_intelligence.exists():
                     with open(target_intelligence, "r", encoding="utf-8") as f:
                         existing_intelligence = f.read()
                     if existing_intelligence == raw_intelligence:
                         needs_update = False
                 
                 if needs_update:
                     # Helper to ensure we are not creating files in a flat structure where they shouldn't be
                     # But our target_mdx logic handles folder vs file. 
                     # If target_mdx is a file (projects/c24.mdx), target_mdx.parent is projects/
                     # So we'd get projects/_intelligence.md which is WRONG.
                     # We need to enforce a folder structure for intelligence.
                     
                     if target_mdx.name == "index.mdx":
                         # Correct Folder Structure
                         if not dry_run:
                            with open(target_intelligence, "w", encoding="utf-8") as f:
                                f.write(raw_intelligence)
                            print(f"  - Created/Updated '_intelligence.md'")
                         else:
                            print(f"  - [Dry Run] would create/update '_intelligence.md'")
                     else:
                         print(f"  ⚠️  Skipping intelligence creation for flat file '{target_mdx.name}'. Migrate to folder structure first.")

             except Exception as e:
                 print(f"  ❌ Failed to process intelligence dump: {e}")
                
        # 5. Mine Stickies (Bubbles + Model)
        # Attempt to mine stickies from R2_MASTER
        mined_stickies = mine_stickies(slug, master_root, public_base_url)
        
        # Mine Model
        model_sticky = mine_model(slug, master_root, public_base_url)
        if model_sticky:
            mined_stickies.append(model_sticky)
            
        if mined_stickies:
            # Check if stickies changed
            current_stickies = post.metadata.get("cyberspace", {}).get("stickies", [])
            # Simple check, or deep compare? Let's assume if mined has content, we want it.
            # But wait, what if manual edits? Stickies are usually auto-generated now.
            
            # Helper to get ID list for comparison
            mined_ids = [s['id'] for s in mined_stickies]
            current_ids = [s['id'] for s in current_stickies] if current_stickies else []
            
            # Update criteria: If IDs differ OR forcing update. 
            # For now, let's update if we found stickies, assuming Master is truth.
            
            # Ensure cyberspace exists
            if "cyberspace" not in post.metadata or post.metadata["cyberspace"] is None:
                post.metadata["cyberspace"] = {}
                
            post.metadata["cyberspace"]["stickies"] = mined_stickies
            
            # Ensure layout
            if "layout" not in post.metadata["cyberspace"]:
                post.metadata["cyberspace"]["layout"] = "linear"
            
            changes.append(f"  - Mined {len(mined_stickies)} stickies from R2_MASTER")
            
            # FORCE Deep Dive if stickies exist
            if post.metadata.get("presentation_mode") != "deep_dive":
                post.metadata["presentation_mode"] = "deep_dive"
                changes.append(f"  - Auto-switched to 'deep_dive' mode")


        # Apply Changes
        if changes:
            print(f"📝  {slug}:")
            for change in changes:
                print(change)
            
            if not dry_run:
                try:
                    # Write back to file
                    # python-frontmatter's dump defaults to --- separators
                    with open(target_mdx, "w", encoding="utf-8") as f:
                        f.write(frontmatter.dumps(post))
                    stats["updated"] += 1
                except Exception as e:
                    print(f"❌  Failed to write '{slug}': {e}")
        else:
            if dry_run:
                print(f"⚪  {slug}: No changes needed.")

    # Summary
    print("-" * 30)
    print(f"🏁  Hydration{' (Dry Run)' if dry_run else ''} Complete.")
    print(f"    Matched: {stats['matched']}")
    print(f"    Skipped: {stats['skipped']}")
    if not dry_run:
        print(f"    Updated: {stats['updated']}")


# --- Auto-Tiering Logic (HXO) ---

def auto_tier_projects(project_dir, dry_run=False):
    """
    Scans MDX files and assigns hydration_status and tier 
    based on the depth of existing data.
    """
    print(f"📊  Running Auto-Tiering Analysis on '{project_dir}'...")
    
    stats = {1: 0, 2: 0, 3: 0, "updated": 0}
    
    # Iterate over MDX files (handles flat files and folder/index.mdx)
    # We need to walk the directory
    for root, dirs, files in os.walk(project_dir):
        for filename in files:
            if filename.endswith(".mdx"):
                filepath = Path(root) / filename
                
                try:
                    post = frontmatter.load(filepath)
                    
                    # 1. Detection Logic
                    has_forensics = 'forensic_summary' in post.metadata
                    has_audio = post.metadata.get('audio_url') is not None
                    # Check for bolus/metrics (forensic_metrics or metrics)
                    has_metrics = 'forensic_metrics' in post.metadata or 'metrics' in post.metadata
                    
                    # 2. Assignment Logic
                    new_status = 'executive'
                    new_tier = 3
                    
                    if has_forensics and (has_audio or has_metrics):
                        new_status = 'full'
                        new_tier = 1
                    elif has_forensics:
                        new_status = 'partial'
                        new_tier = 2
                    
                    # 3. Check for changes
                    current_status = post.metadata.get('hydration_status')
                    current_tier = post.metadata.get('tier')
                    
                    if current_status != new_status or current_tier != new_tier:
                        post.metadata['hydration_status'] = new_status
                        post.metadata['tier'] = new_tier
                        post.metadata['hxo_ready'] = (new_tier <= 2)
                        
                        if not dry_run:
                            with open(filepath, 'wb') as f:
                                frontmatter.dump(post, f)
                        stats["updated"] += 1
                        
                    stats[new_tier] += 1
                    
                except Exception as e:
                    print(f"⚠️  Error tiering {filename}: {e}")

    print(f"    Tier 1 (Sovereign): {stats[1]}")
    print(f"    Tier 2 (Partial):   {stats[2]}")
    print(f"    Tier 3 (Executive): {stats[3]}")
    if dry_run:
        print(f"    [Dry Run] Would update {stats['updated']} files.")
    else:
        print(f"    Updated {stats['updated']} files.")


# --- Reverse Hydration (MDX -> Resume/LinkedIn) ---

# --- Reverse Hydration (MDX -> JSON Backport) ---

def reverse_hydrate_json(dry_run=False, target_slug=None):
    """
    Extracts high-value forensic data (War Stories, Summaries) from MDX 
    and updates the JSON Source of Truth in notebook_dumps.
    """
    print(f"🔙  Starting Reverse Hydration (MDX -> JSON)...")
    
    stats = {"created": 0, "updated": 0, "skipped": 0}
    
    mdx_files = list(TARGET_DIR.glob("**/*.mdx"))
    
    for mdx_file in mdx_files:
        try:
            post = frontmatter.load(mdx_file)
            slug = post.metadata.get("slug") or mdx_file.stem
            
            if target_slug and slug != target_slug:
                continue

            # Determine JSON path
            json_path = SOURCE_DIR / f"{slug}.json"
            
            # Load existing JSON if available
            data = {}
            if json_path.exists():
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
            else:
                # Initialize new structure
                data = {"id": slug}

            # Prepare Updates
            changes = []
            
            # 1. Forensic Summary
            if "forensic_summary" in post.metadata:
                 if data.get("forensic_summary") != post.metadata["forensic_summary"]:
                     data["forensic_summary"] = post.metadata["forensic_summary"]
                     changes.append(f"  - Backported 'forensic_summary'")

            # 2. War Stories (The Gold)
            # Check both root and metrics.war_stories
            ws = post.metadata.get("war_stories")
            if not ws and "metrics" in post.metadata:
                ws = post.metadata["metrics"].get("war_stories")
            
            if ws:
                 # Clean up format (remove numbers/legacy)
                 clean_ws = [s for s in ws if isinstance(s, dict)]
                 if clean_ws:
                     # Ensure metrics dict exists in JSON
                     if "metrics" not in data: data["metrics"] = {}
                     
                     # Compare
                     if data["metrics"].get("war_stories") != clean_ws:
                         data["metrics"]["war_stories"] = clean_ws
                         changes.append(f"  - Backported {len(clean_ws)} War Stories")

            # 3. Forensic Metrics (Process/Financial/Governance)
            # Only backport if present in MDX (we might have just deleted them in MDX, so don't revive from dead MDX? 
            # No, if MDX *has* them, we assume they are valid.
            # But recent migration *deleted* them from MDX to use War Stories instead.
            # So if MDX doesn't have them, we do nothing.
            if "forensic_metrics" in post.metadata:
                if data.get("metrics") != post.metadata["forensic_metrics"]:
                     # Note: This might conflict with war_stories if both exist?
                     # Ideally we want war_stories in metrics.war_stories, and forensic_metrics keys merged into metrics?
                     # For now, let's just ensure the data exists.
                     # But wait, forensic_metrics keys are financial, process, governance (strings).
                     # JSON metrics keys are also financial, process, governance.
                     # We should be careful.
                     pass 

            # 4. Body Content (The Intelligence Bolus)
            # Three-Body Safety Protocol:
            # 1. Source (notebook_dumps/{slug}.md): Master Text (User Manual). NEVER written by script.
            # 2. Live (index.mdx): The rendered page. Hydrated from Source.
            # 3. Backup (notebook_dumps/{slug}.backup.md): Snapshot of Live. Always written by script.

            if post.content and post.content.strip():
                 # Write to BACKUP file (Safety Copy)
                 backup_path = SOURCE_DIR / f"{slug}.backup.md"
                 
                 # Read existing backup to check for drift
                 current_backup = ""
                 if backup_path.exists():
                     with open(backup_path, "r", encoding="utf-8") as f:
                         current_backup = f.read()
                 
                 if current_backup != post.content:
                     if not dry_run:
                        with open(backup_path, "w", encoding="utf-8") as f:
                            f.write(post.content)
                     changes.append(f"  - Snapshot Body to '{slug}.backup.md' (Safety Copy)")
            else:
                 # If Live Body is empty, DO NOT touch the Source.
                 # Just log a warning or skip.
                 pass 

            # Write Check
            if changes:
                print(f"💾  {slug}:")
                for change in changes:
                    print(change)
                
                if not dry_run:
                    with open(json_path, "w", encoding="utf-8") as f:
                        json.dump(data, f, indent=4)
                    if json_path.exists():
                        stats["updated"] += 1
                    else:
                        stats["created"] += 1
            else:
                 stats["skipped"] += 1

        except Exception as e:
            print(f"❌  Error processing {mdx_file}: {e}")

    print(f"🏁  Reverse Hydration Complete. Created: {stats['created']}, Updated: {stats['updated']}")


# --- Reverse Hydration (MDX -> Resume/LinkedIn) ---

def reverse_hydrate_text(dry_run=False):
    """
    Extracts 'forensic_metrics' and 'war_stories' from Project MDX files
    and updates RESUME_READY.txt and LINKEDIN_READY.txt.
    """
    resume_path = Path("public/assets/prompts/RESUME_READY.txt")
    linkedin_path = Path("public/assets/branding/LINKEDIN_READY.txt")
    
    # 1. Collect Data from MDX
    project_data = {}
    mdx_files = list(TARGET_DIR.glob("**/*.mdx"))
    
    for mdx_file in mdx_files:
        try:
            post = frontmatter.load(mdx_file)
            project_slug = post.metadata.get("slug") or mdx_file.stem
            
            # Extract War Stories
            war_stories = []
            if "metrics" in post.metadata and "war_stories" in post.metadata["metrics"]:
                stories = post.metadata["metrics"]["war_stories"]
                for story in stories:
                    if isinstance(story, dict): # Handle object format
                        label = story.get('label')
                        # EXCLUSION LIST: Items to keep in Project MDX but HIDE from Resume/LinkedIn
                        if "Berry Creek" in label:
                            continue
                        war_stories.append(f"- **{label}**: {story.get('description')}")
            
            # Extract Forensic Metrics
            forensics = []
            if "forensic_metrics" in post.metadata:
                fm = post.metadata["forensic_metrics"]
                if fm.get("financial"): forensics.append(f"- **Financial**: {fm['financial']}")
                if fm.get("process"): forensics.append(f"- **Process**: {fm['process']}")
                if fm.get("technical"): forensics.append(f"- **Technical**: {fm['technical']}")
                if fm.get("governance"): forensics.append(f"- **Governance**: {fm['governance']}")

            if war_stories or forensics:
                project_data[project_slug] = {
                    "title": post.metadata.get("title", project_slug),
                    "war_stories": war_stories,
                    "forensics": forensics
                }
                
        except Exception as e:
            print(f"⚠️  Error reading MDX {mdx_file}: {e}")

    # 2. Generate Resume Section
    new_resume_section = "\n## PROJECT ARTIFACTS (Auto-Generated)\n\n"
    for slug, data in project_data.items():
        new_resume_section += f"### {data['title']}\n"
        for item in data['forensics']:
            new_resume_section += item + "\n"
        for item in data['war_stories']:
            new_resume_section += item + "\n"
        new_resume_section += "\n"

    # 3. Update Resume File
    if resume_path.exists():
        with open(resume_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Basic append if marker not found (First Run)
        if "## PROJECT ARTIFACTS (Auto-Generated)" not in content:
            updated_content = content + "\n" + new_resume_section
        else:
            # Replace existing block (Regex or simple split would be better, but simple split for now)
            pre_split = content.split("## PROJECT ARTIFACTS (Auto-Generated)")[0]
            updated_content = pre_split + new_resume_section
            
        if not dry_run:
            with open(resume_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print("✅  Updated RESUME_READY.txt")
        else:
            print("⚪  [Dry Run] Would update RESUME_READY.txt")

    # 4. Generate LinkedIn Section (Copy-Paste Ready)
    new_linkedin_section = "\n## LINKEDIN EXPERIENCE BLURBS (Auto-Generated)\n\n"
    for slug, data in project_data.items():
        new_linkedin_section += f"**{data['title']}**\n"
        for item in data['forensics']:
            new_linkedin_section += item + "\n"
        for item in data['war_stories']:
            new_linkedin_section += item + "\n"
        new_linkedin_section += "\n"

    # 5. Update LinkedIn File
    if linkedin_path.exists():
        with open(linkedin_path, "r", encoding="utf-8") as f:
            content = f.read()
            
        if "## LINKEDIN EXPERIENCE BLURBS (Auto-Generated)" not in content:
            updated_content = content + "\n" + new_linkedin_section
        else:
             pre_split = content.split("## LINKEDIN EXPERIENCE BLURBS (Auto-Generated)")[0]
             updated_content = pre_split + new_linkedin_section
        
        if not dry_run:
            with open(linkedin_path, "w", encoding="utf-8") as f:
                f.write(updated_content)
            print("✅  Updated LINKEDIN_READY.txt")
        else:
            print("⚪  [Dry Run] Would update LINKEDIN_READY.txt")


# --- Project Index Generation ---

def generate_project_index(dry_run=False):
    """
    Generates src/content/prompts/prompts/PROJECT_INDEX.md using a Tiered Strategy.
    
    Tier 1 (Forensic): Projects with 'forensic_summary' or 'war_stories'. Full detail.
    Tier 2 (Ready State/On Deck): Projects with body text (intro) but no forensic struct.
    Tier 3 (Stub): Minimal metadata only.
    """
    output_path = Path("src/content/prompts/prompts/PROJECT_INDEX.md")
    
    print(f"🗂️  Generating Holistic Project Index (Tiered)...")

    tier1_projects = []
    tier2_projects = []

    mdx_files = list(TARGET_DIR.glob("**/*.mdx"))
    
    # 1. Collect Data
    for mdx_file in mdx_files:
        try:
            post = frontmatter.load(mdx_file)
            slug = post.metadata.get("slug") or mdx_file.stem
            title = post.metadata.get("title", slug)
            
            # --- TIER 1 CHECKS ---
            summary = post.metadata.get("forensic_summary")
            metrics_data = {}
            
            # Helper to extract metrics safely
            if "forensic_metrics" in post.metadata:
                metrics_data = post.metadata["forensic_metrics"]
            elif "metrics" in post.metadata:
                m = post.metadata["metrics"]
                if isinstance(m, dict):
                    # Only grab top-level string summaries if they exist
                    for k in ["financial", "process", "governance", "technical"]:
                        if k in m and isinstance(m[k], str):
                            metrics_data[k] = m[k]

            # If it has a Forensic Summary, it is Tier 1
            if summary:
                tier1_projects.append({
                    "slug": slug,
                    "title": title,
                    "summary": summary,
                    "metrics": metrics_data,
                    "detail_pod": "_[URL_PENDING]_" 
                })
                continue
            
            # --- TIER 2 CHECKS (Body Text / Description) ---
            # If no forensic summary, check for description or body content
            description = post.metadata.get("description")
            body_snippet = ""
            
            if post.content:
                # Simple extraction of first non-empty paragraph
                lines = post.content.split('\n')
                for line in lines:
                    line = line.strip()
                    # Skip headers, empty lines, imports
                    if line and not line.startswith('#') and not line.startswith('import') and not line.startswith('<'):
                        body_snippet = line[:300] + "..." if len(line) > 300 else line
                        break
            
            # Use description if available, else body snippet, else "No Data"
            display_text = description if description else body_snippet
            if not display_text:
                display_text = "*No forensic data or description available.*"

            tier2_projects.append({
                "slug": slug,
                "title": title,
                "text": display_text
            })

        except Exception as e:
            print(f"⚠️  Error reading {mdx_file}: {e}")

    # Sort by Slug
    tier1_projects.sort(key=lambda x: x["slug"])
    tier2_projects.sort(key=lambda x: x["slug"])

    # 2. Build Content
    today = datetime.now().strftime("%Y-%m-%d")
    total_count = len(tier1_projects) + len(tier2_projects)
    
    content = f"""---
title: "Project Index"
description: "Holistic Forensic Archive & Catalog"
last_updated: "{today}"
total_entries: {total_count}
---

# 📂 The Project Index

**System Purpose:** This is the master routing table for the ErikNorris Portfolio.
**Do Not Edit:** This file is auto-generated by `scripts/hydrate_content.py`.

---

## 1. The Forensic Registry (Tier 1)
**Count:** {len(tier1_projects)}
*High-fidelity entries with structured forensic data, war stories, and metrics.*

"""

    # Render Tier 1
    for p in tier1_projects:
        content += f"### {p['title']} (`{p['slug']}`)\n"
        content += f"**Detail Pod:** {p['detail_pod']}\n\n"
        content += f"> **Forensic Summary:** {p['summary'].strip()}\n\n"
        
        if p['metrics']:
            content += f"**Key Metrics:**\n"
            for k, v in p['metrics'].items():
                content += f"- **{k.capitalize()}:** {v}\n"
        
        content += "\n---\n\n"

    content += f"""
## 2. The Project Catalog (Tier 2)
**Count:** {len(tier2_projects)}
*Standard entries, ready-state drafts, and archival stub records.*

"""

    # Render Tier 2 (Compact List)
    for p in tier2_projects:
        content += f"- **{p['title']}** (`{p['slug']}`): {p['text']}\n"

    # 3. Write File
    if not dry_run:
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅  Generated PROJECT_INDEX.md with {total_count} total entries ({len(tier1_projects)} Forensic, {len(tier2_projects)} Standard).")
    else:
        print(f"⚪  [Dry Run] Would generate PROJECT_INDEX.md with {total_count} entries.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Hydrate content from JSON dumps or Reverse Hydrate MDX to Text/JSON.")
    parser.add_argument("--force", action="store_true", help="Bypass Git safety check.")
    parser.add_argument("--reverse", action="store_true", help="Run Reverse Hydration (MDX -> Resume/Text).")
    parser.add_argument("--reverse-json", action="store_true", help="Run Backport Hydration (MDX -> JSON Source).")
    parser.add_argument("--dry-run", action="store_true", help="Simulate without writing.")
    
    parser.add_argument("--slug", type=str, help="Target a specific project slug.")
    
    parser.add_argument("--tier", action="store_true", help="Run Auto-Tiering Analysis (HXO).")
    parser.add_argument("--index", action="store_true", help="Generate Project Index (Forensic Registry).")
    
    args = parser.parse_args()
    
    if args.reverse:
        print("🔄  Starting Reverse Hydration (Text)...")
        reverse_hydrate_text(dry_run=args.dry_run)
    elif args.reverse_json:
        print("🔄  Starting Reverse Hydration (JSON)...")
        reverse_hydrate_json(dry_run=args.dry_run, target_slug=args.slug)
    elif args.tier:
        auto_tier_projects(TARGET_DIR, dry_run=args.dry_run)
    elif args.index:
        generate_project_index(dry_run=args.dry_run)
    else:
        hydrate_content(dry_run=args.dry_run, force=args.force, target_slug=args.slug)



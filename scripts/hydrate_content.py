import sys
import json
import os
import shutil
import subprocess
import re
from pathlib import Path
import frontmatter
import yaml
import argparse
from datetime import datetime

# Force UTF-8 for Windows Consoles/Redirection
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

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


def smart_merge_lists(existing_list, new_list, key_field, priority="source"):
    """
    Merges new_list into existing_list.
    Priority:
    - 'source' (Default): new_list overwrites existing_list.
    - 'target': existing_list keeps its values if conflict.
    """
    if not existing_list:
        return new_list
    if not new_list:
        return existing_list

    merged_map = {}
    
    def get_key(item):
        if isinstance(item, dict):
             return item.get(key_field)
        return str(item)

    # If Priority is TARGET, load EXISTING first, then NEW (only if missing)
    # Actually, dictionary overwrite logic is: last one wins.
    
    if priority == "target":
        # Load NEW first
        for item in new_list:
            k = get_key(item)
            if k: merged_map[k] = item
        # Load EXISTING second (Winner)
        for item in existing_list:
            k = get_key(item)
            if k: merged_map[k] = item
    else:
        # Priority Source (Default)
        # Load EXISTING first
        for item in existing_list:
            k = get_key(item)
            if k: merged_map[k] = item
        # Load NEW second (Winner)
        for item in new_list:
            k = get_key(item)
            if k: merged_map[k] = item
            
    result_list = []
    seen_keys = set()
    
    # Reconstruct List (Preserve Order of Primary Source)
    primary_list = existing_list if priority == "target" else new_list
    secondary_list = new_list if priority == "target" else existing_list

    # 1. Add all from Primary (with merged values)
    for item in primary_list:
        k = get_key(item)
        if k:
            if k in merged_map:
                result_list.append(merged_map[k])
                seen_keys.add(k)
        else:
             result_list.append(item)
             
    # 2. Add remaining from Secondary
    for item in secondary_list:
        k = get_key(item)
        if k and k not in seen_keys:
            result_list.append(merged_map[k])
            seen_keys.add(k)
             
    return result_list


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


# --- Spec V2 Parsing ---

# --- Spec V2 Parsing ---

def parse_spec_v2(txt_path):
    """
    Parses a Spec V2 (.txt) file containing multiple JSON blocks and Markdown.
    Supports both Fenced Markdown (```json) and Raw NotebookLM Dumps (separated by 'run').
    Merges all JSON blocks into a single data dictionary.
    """
    try:
        content = txt_path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"❌ Error reading spec file {txt_path}: {e}")
        return {}

    data = {}
    
    # Strategy 1: Fenced Code Blocks (Standard Markdown)
    # Strategy 1: Fenced Code Blocks (Standard Markdown)
    # Relaxed Regex: Capture everything inside fences, then filter for JSON
    json_blocks = []
    raw_blocks = re.findall(r'```json\s*(.*?)\s*```', content, re.DOTALL | re.IGNORECASE)
    
    with open("debug_log.txt", "a", encoding="utf-8") as debug_f:
        debug_f.write(f"DEBUG: Content len: {len(content)}\n")
        debug_f.write(f"DEBUG: snippet start: {content[:100]}\n")
        debug_f.write(f"DEBUG: snippet end: {content[-100:]}\n")
        debug_f.write(f"DEBUG: raw_blocks count: {len(raw_blocks)}\n")
    
    for block in raw_blocks:
        block = block.strip()
        
        # 1. Global Sanitization (String Level)
        # Remove "source_indices" lines
        block = re.sub(r'"source_indices":\s*\[.*?\],?', '', block, flags=re.DOTALL)
        # Remove trailing commas before closing braces/brackets
        block = re.sub(r',\s*}', '}', block, flags=re.DOTALL)
        block = re.sub(r',\s*]', ']', block, flags=re.DOTALL)

        # 2. Decoder Loop (Handle Concatenation & Garbage)
        decoder = json.JSONDecoder()
        pos = 0
        while pos < len(block):
            next_brace = block.find('{', pos)
            if next_brace == -1: break
            
            try:
                obj, idx = decoder.raw_decode(block, next_brace)
                # Success!
                # Re-serialize to string to keep downstream logic consistent
                # (Or just append the substring `block[next_brace:idx]`)
                json_blocks.append(json.dumps(obj)) 
                pos = idx
            except json.JSONDecodeError:
                # Malformed or not JSON, skip this brace
                pos = next_brace + 1

    
    if json_blocks:
        print(f"   🔹 Found {len(json_blocks)} Fenced JSON blocks")
    else:
        # Strategy 2: Raw Dump Splitting (NotebookLM 'run' separator)
        # Split by 'run' on its own line
        chunks = re.split(r'\nrun\n', content, flags=re.IGNORECASE)
        # Also handle file start/end if 'run' is missing at boundaries
        if len(chunks) == 1 and not content.strip().startswith('```'):
             chunks = [content]
             
        for i, chunk in enumerate(chunks):
            chunk = chunk.strip()
            if not chunk: continue
            
            # Same Robust Logic for Raw Chunks
            # 1. Global Sanitization
            chunk = re.sub(r'"source_indices":\s*\[.*?\],?', '', chunk, flags=re.DOTALL)
            chunk = re.sub(r',\s*}', '}', chunk, flags=re.DOTALL)
            chunk = re.sub(r',\s*]', ']', chunk, flags=re.DOTALL)
            
            # 2. Decoder Loop
            decoder = json.JSONDecoder()
            pos = 0
            while pos < len(chunk):
                next_brace = chunk.find('{', pos)
                if next_brace == -1: break
                
                try:
                    obj, idx = decoder.raw_decode(chunk, next_brace)
                    json_blocks.append(json.dumps(obj)) 
                    pos = idx
                except json.JSONDecodeError:
                    pos = next_brace + 1
    
    if not json_blocks:
         print(f"   ⚠️  No JSON blocks found in {txt_path.name}")
         return {}

    print(f"   🔹 Merging {len(json_blocks)} JSON blocks from {txt_path.name}")
    
    for i, block in enumerate(json_blocks):
        try:
            chunk_data = json.loads(block)
            with open("debug_log.txt", "a", encoding="utf-8") as debug_f:
                debug_f.write(f"DEBUG: Parsed block type: {type(chunk_data)}\n")
                
            data.update(chunk_data)
            
            with open("debug_log.txt", "a", encoding="utf-8") as debug_f:
                debug_f.write(f"DEBUG: Successfully merged block with keys: {list(chunk_data.keys())}\n")
        except Exception as e:
            with open("debug_log.txt", "a", encoding="utf-8") as debug_f:
                debug_f.write(f"DEBUG: Merge Error: {e}\nBlock snippet start: {block[:100]}...\nBlock snippet end: {block[-100:]}\n")
            print(f"   ❌ Merge Error in block {i+1}: {e}")

    return normalize_rich_data(data)


def normalize_rich_data(data):
    """
    Normalizes rich data keys (metal_components, hardware_engineering) 
    into standard 'bom' and 'cast' arrays.
    """
    # BOM Mapping
    bom_sources = [
        "metal_components", "plastic_components", 
        "pcb_and_electrical", "films_labels_gaskets", 
        "fasteners_and_hardware"
    ]
    
    combined_bom = data.get("bom", [])
    
    for key in bom_sources:
        if key in data:
            items = data[key]
            if isinstance(items, list):
                for item in items:
                    # Normalize Item
                    # Logic: label = description, value = material (fallback to part_number)
                    label = item.get("description", item.get("part_number", "Unknown"))
                    value = item.get("material", item.get("part_number", ""))
                    
                    entry = {
                        "label": label,
                        "value": value,
                        "url": item.get("url", "")
                    }
                    combined_bom.append(entry)
            
    if combined_bom:
        data["bom"] = combined_bom
        
    # Cast/Team Mapping
    team_sources = ["hardware_engineering", "hardware_coops"]
    combined_cast = data.get("cast", [])
    
    for key in team_sources:
        if key in data:
            items = data[key]
            if isinstance(items, list):
                for item in items:
                    # Logic: name, role, org = "Kaleidescape"
                    name = item.get("name", "Unknown")
                    role = item.get("role", "Engineer")
                    
                    entry = {
                        "name": name,
                        "role": role,
                        "org": "Kaleidescape"
                    }
                    combined_cast.append(entry)
                    
    if combined_cast:
        data["cast"] = combined_cast

    # Timeline Mapping
    if "timeline_events" in data:
        # Standardize to 'events'
        events = data["timeline_events"]
        # Ensure it's a list
        if isinstance(events, list):
            data["events"] = events

    return data


def parse_notebook_dump(txt_path):
    """
    Parses a raw NotebookLM text dump (`.txt`) to extract the Narrative content.
    
    Strategy (Strict Separation):
    1. Scan the entire file for valid JSON objects using `json.JSONDecoder`.
    2. Extract and DISCARD these JSON blocks (they are metadata, handled by parse_spec_v2).
    3. The remaining text is the "Full Raw Narrative".
    4. Perform minimal cleanup (whitespace, specific delimiters).
    """
    try:
        content = txt_path.read_text(encoding="utf-8")
    except Exception as e:
        print(f"❌ Error reading {txt_path}: {e}")
        return None

    # Robust JSON Subtraction using JSONDecoder
    decoder = json.JSONDecoder()
    pos = 0
    cleaned_segments = []
    
    while pos < len(content):
        # Find next potential JSON start
        # Use simple search for '{'
        next_brace = content.find('{', pos)
        
        if next_brace == -1:
            # No more JSON candidates, append the rest
            cleaned_segments.append(content[pos:])
            break
            
        # Append text before the brace
        if next_brace > pos:
            cleaned_segments.append(content[pos:next_brace])
            
        # Try to decode a JSON object starting at next_brace
        try:
            # raw_decode returns (object, end_index) where end_index is relative to string start
            # But wait, raw_decode takes input string.
            # We pass content[next_brace:]? No, raw_decode takes full string and idx.
            _, end_offset = decoder.raw_decode(content, next_brace)
            
            # If successful, we found a JSON block!
            # We SKIP it (do not append to segments)
            # raw_decode returns the absolute end index, so we just set pos to that.
            pos = end_offset
            
        except json.JSONDecodeError:
            # Not a valid JSON start. Treat the brace as text.
            cleaned_segments.append(content[next_brace])
            pos = next_brace + 1
            
    full_narrative = "".join(cleaned_segments)
    
    # Post-Processing / Cleanup
    lines = full_narrative.split('\n')
    final_lines = []
    
    for line in lines:
        line = line.strip()
        # Filter out 'run' commands that are often left over as isolated lines
        # e.g. "run", "run for c24", "please run"
        # Heuristic: Short line starting with "run"
        if len(line) < 50 and line.lower().startswith("run"):
            continue
            
        if not line:
            final_lines.append("") # Keep paragraph breaks
            continue
            
        final_lines.append(line)
        
    result = "\n".join(final_lines).strip()
    
    if not result:
        return None
        
    return result



# --- Main Hydration ---

def hydrate_content(dry_run=False, force=False, target_slug=None, priority="source"):
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

    
    # Discovery Phase: Collect all unique slugs from .txt (V2) and .json (Legacy)
    all_txt_files = list(SOURCE_DIR.glob("*.txt"))
    all_json_files = list(SOURCE_DIR.glob("*.json"))
    
    all_slugs = set([f.stem for f in all_txt_files] + [f.stem for f in all_json_files])
    
    if target_slug:
        if target_slug not in all_slugs:
             print(f"❌  Target slug '{target_slug}' not found in '{SOURCE_DIR}'.")
             return
        target_slugs = [target_slug]
        print(f"🎯  Targeted Mode: Hydrating only '{target_slug}'")
    else:
        target_slugs = sorted(list(all_slugs))

    if not target_slugs:
        print(f"⚠️  No Spec files found in '{SOURCE_DIR}'.")
        return

    print(f"🔍  Found {len(target_slugs)} Projects. Scanning targets...")
    
    stats = {"matched": 0, "skipped": 0, "updated": 0}

    for slug in target_slugs:
        target_mdx = find_target_mdx(slug, TARGET_DIR)

        if not target_mdx:
            print(f"⏭️  Skipped: No matching MDX for '{slug}'")
            stats["skipped"] += 1
            continue

        stats["matched"] += 1

        # Load Data (Priority: TXT > JSON)
        txt_path = SOURCE_DIR / f"{slug}.txt"
        json_path = SOURCE_DIR / f"{slug}.json"
        
        data = {}
        source_type = "UNKNOWN"

        if txt_path.exists():
            # NEW: Narrative Titration (Smart Parse)
            # If we have a spec v2 txt, but no matching .md (or force), try to extract narrative
            dump_md_path = SOURCE_DIR / f"{slug}.md"
            if force or not dump_md_path.exists():
                 # Only parse if we have a txt file
                 # We already checked txt_path.exists()
                 extracted_narrative = parse_notebook_dump(txt_path)
                 if extracted_narrative:
                     print(f"   ✨ Smart Parsing Narrative from {txt_path.name}...")
                     if not dry_run:
                        with open(dump_md_path, "w", encoding="utf-8") as f:
                            f.write(extracted_narrative)
                     print(f"   📄 Generated Sovereign Narrative: {dump_md_path.name}")
            
            data = parse_spec_v2(txt_path)
            source_type = "SPEC V2 (.txt)"
            
            # --- NEW: Rich Data Normalization (Post-Ready State) ---
            from datetime import datetime # Ensure import if not at top
            
            def normalize_rich_data(data):
                """
                Extracts and normalizes 'Rich' keys (metal_components, hardware_engineering)
                into standard 'bom' and 'cast' arrays.
                """
                # 1. BOM Extraction
                rich_bom_keys = [
                    "metal_components", 
                    "plastic_components", 
                    "pcb_and_electrical", 
                    "films_labels_gaskets", 
                    "fasteners_and_hardware"
                ]
                
                extracted_bom = []
                
                for key in rich_bom_keys:
                    if key in data and isinstance(data[key], list):
                        with open("debug_log.txt", "a", encoding="utf-8") as debug_f:
                            debug_f.write(f"DEBUG: Extracting BOM data from '{key}'...\n")
                            
                        # print(f"   🛠️  Extracting BOM data from '{key}'...")
                        for item in data[key]:
                            # Map to Standard BOM Object { label, value }
                            # Schema: label=description, value=material (or part_number fallback)
                            
                            label = item.get("description", item.get("label", "Unknown"))
                            
                            # Value Strategy: Material first, then Part Number
                            val = item.get("material")
                            if not val or val == "N/A":
                                val = item.get("part_number")
                            elif item.get("part_number") and item.get("part_number") != "N/A":
                                # format: "Material (Part#)"
                                val = f"{val} ({item.get('part_number')})"
                                
                            extracted_bom.append({
                                "label": label,
                                "value": val
                            })
                            
                if extracted_bom:
                    # Merge into existing 'bom'
                    current_bom = data.get("bom", [])
                    # We simply append/merge. Smart merge handles dupes by label.
                    data["bom"] = current_bom + extracted_bom
                    with open("debug_log.txt", "a", encoding="utf-8") as debug_f:
                        debug_f.write(f"DEBUG: Merged {len(extracted_bom)} rich items into 'bom'.\n")

                # 2. Team Extraction
                rich_team_keys = ["hardware_engineering", "hardware_coops", "firmware_engineering", "industrial_design"]
                
                extracted_cast = []
                
                for key in rich_team_keys:
                    if key in data and isinstance(data[key], list):
                         print(f"   👥 Extracting Team data from '{key}'...")
                         for item in data[key]:
                             # Map to Standard Cast Object { name, role, org }
                             name = item.get("name")
                             role = item.get("role")
                             org = item.get("org", "Kaleidescape") # Default for Cinema One era
                             
                             if name and role:
                                 extracted_cast.append({
                                     "name": name,
                                     "role": role,
                                     "org": org
                                 })
                                 
                if extracted_cast:
                    current_cast = data.get("cast", [])
                    data["cast"] = current_cast + extracted_cast
                    print(f"   ✅ Merged {len(extracted_cast)} rich items into 'cast'.")

            # Apply Normalization
            normalize_rich_data(data)

            # Safety: If parse failed (empty data), should we fallback?
            if not data and json_path.exists():
                 print(f"   ⚠️  Spec V2 parse failed/empty. Falling back to JSON.")
                 with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                 source_type = "LEGACY (.json)"
        elif json_path.exists():
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            source_type = "LEGACY (.json)"
        
        if not data:
            print(f"   ❌ No data found for {slug}. Skipping.")
            continue

        print(f"🚀  Hydrating {slug} [{source_type}]")

        # Load MDX
        try:
            post = frontmatter.load(target_mdx)
        except Exception as e:
            print(f"❌  Error reading '{target_mdx}': {e}")
            continue

        # Prepare Updates
        changes = []
        
        # BLOCKER: Garbage Timeline Data from Source
        # We only support 'events' (from timeline_events). 'timeline' is legacy.
        if "timeline" in data:
             del data["timeline"]
        
        # 0. SEO Essentials (Critical for Social Sharing/AEO)
        if "title" in data:
            if post.metadata.get("title") != data["title"]:
                 changes.append(f"  - Update 'title' (SEO)")
                 post.metadata["title"] = data["title"]
        
        if "description" in data:
            if post.metadata.get("description") != data["description"]:
                 changes.append(f"  - Update 'description' (SEO)")
                 post.metadata["description"] = data["description"]

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

        # 1.5 Forensic Context (BOM, Team, Cast)
        # These were previously ignored "Dark Data"
        if "bom" in data:
            current_bom = post.metadata.get("bom") or []
            merged_bom = smart_merge_lists(current_bom, data["bom"], "label", priority)
            
            if current_bom != merged_bom:
                 changes.append(f"  - Update 'bom' (Merged {len(data['bom'])} items)")
                 post.metadata["bom"] = merged_bom

        if "teamSize" in data:
            if post.metadata.get("teamSize") != data["teamSize"]:
                 changes.append(f"  - Update 'teamSize' (Forensic Context)")
                 post.metadata["teamSize"] = data["teamSize"]
        # AUTO-GENERATION: If teamSize missing but Cast exists
        elif "cast" in data or "cast" in post.metadata:
             cast_list = data.get("cast") or post.metadata.get("cast")
             if cast_list:
                 auto_team = f"INT {len(cast_list)}"
                 if post.metadata.get("teamSize") != auto_team:
                     changes.append(f"  - Auto-Generate 'teamSize': {auto_team}")
                     post.metadata["teamSize"] = auto_team

        if "cast" in data:
            current_cast = post.metadata.get("cast") or []
            merged_cast = smart_merge_lists(current_cast, data["cast"], "name", priority)
            
            if current_cast != merged_cast:
                 changes.append(f"  - Update 'cast' (Merged {len(data['cast'])} items)")
                 post.metadata["cast"] = merged_cast
                 
        if "transcript" in data:
            # Check for empty transcript cleanup
            if not data["transcript"] and "transcript" in post.metadata:
                 changes.append(f"  - Cleared empty 'transcript'")
                 post.metadata["transcript"] = ""
            elif post.metadata.get("transcript") != data["transcript"]:
                 changes.append(f"  - Update 'transcript' (Accessibility)")
                 post.metadata["transcript"] = data["transcript"]

        # 2. Scars (formerly War Stories) - V2.1 Renaming
        # Check 'scars' first, then 'war_stories' fallback
        scars_data = data.get("scars")
        if not scars_data:
            scars_data = data.get("war_stories")

        if scars_data:
            current_scars = post.metadata.get("scars") or []
            # Scars use "label" as key
            merged_scars = smart_merge_lists(current_scars, scars_data, "label", priority)
            
            # Update Scars if changed or new
            if current_scars != merged_scars:
                changes.append(f"  - Update 'scars' (Merged {len(merged_scars)} items)")
                post.metadata["scars"] = merged_scars

        # CLEANUP: Legacy Removal (Schema Compliance)
        if "war_stories" in post.metadata:
             del post.metadata["war_stories"]
             changes.append("  - Cleaned up legacy 'war_stories' (Root)")
        
        if "metrics" in post.metadata and "war_stories" in post.metadata["metrics"]:
             del post.metadata["metrics"]["war_stories"]
             changes.append("  - Cleaned up legacy 'metrics.war_stories'")
                 
        # 3. Isomorphics (Direct Injection)
        if "isomorphics" in data:
            iso = data["isomorphics"]
            if post.metadata.get("isomorphics") != iso:
                changes.append(f"  - Update 'isomorphics' ({len(iso)} items)")
                post.metadata["isomorphics"] = iso

        # 4. Seismobolus (Legacy) & Consolidating to 'events' (Seismograph)
        # The 'ForensicSeismograph' component reads 'events', not 'seismobolus'
        # LAW UPDATE: Seismobolus data MUST live in _entropy.json sidecar.
        # We do NOT inject into Frontmatter to prevent bloat.
        if "events" in data:
             # Ensure we cleanup legacy if it exists
             if "events" in post.metadata:
                  changes.append(f"  - Remove 'events' from Frontmatter (Moved to Sidecar)")
                  del post.metadata["events"]
        
        # CLEANUP: Validate Timeline Schema
        # Schema requires array of objects {date, title, description}
        if "timeline" in post.metadata:
            tl = post.metadata["timeline"]
            
            should_delete = False
            # Case 1: Legacy String Array ["start", "end"]
            if isinstance(tl, list) and len(tl) > 0 and isinstance(tl[0], str):
                 should_delete = True
                 reason = "String Array"
            # Case 2: Legacy Object { start: ..., end: ... }
            elif isinstance(tl, dict):
                 should_delete = True
                 reason = "Legacy Object"
            # Case 3: Empty List (keep? or delete? Schema allows empty or optional)
            
            if should_delete:
                 del post.metadata["timeline"]
                 changes.append(f"  - Cleaned up legacy 'timeline' ({reason})")
        
        # CLEANUP: Remove Banned 'forensic_data' (Use 'forensic_metrics' or 'forensic_summary')
        if "forensic_data" in post.metadata:
             del post.metadata["forensic_data"]
             changes.append("  - Cleaned up banned 'forensic_data' (Schema Law)")
        
        if "reports" in data:
            reports = data["reports"]
            if post.metadata.get("reports") != reports:
                changes.append(f"  - Update 'reports' ({len(reports)} items)")
                post.metadata["reports"] = reports

        # 5. BOM & Team (Rich Data from Text Dump)
        if "bom" in data:
            current = post.metadata.get("bom") or []
            merged = smart_merge_lists(current, data["bom"], "label")
            if current != merged:
                changes.append(f"  - Update 'bom' (Merged {len(data['bom'])} items)")
                post.metadata["bom"] = merged

        if "cast" in data:
            current = post.metadata.get("cast") or []
            merged = smart_merge_lists(current, data["cast"], "name")
            if current != merged:
                changes.append(f"  - Update 'cast' (Merged {len(data['cast'])} items)")
                post.metadata["cast"] = merged

        # --- V2.2: FORENSIC LOCKER (Local _data.json) ---
        # "Smart Router" for Structured Data Infusion
        target_locker = target_mdx.parent / "_data.json"
        if target_locker.exists():
            try:
                with open(target_locker, "r", encoding="utf-8") as f:
                    locker_data = json.load(f)
                
                print(f"   🔓 Unlocked Forensic Data: {target_locker.name}")
                
                # Container for "Oddballs"
                forensic_data = post.metadata.get("forensic_data") or {}
                
                for key, val in locker_data.items():
                    # 1. Known Schema Keys -> Map Directly
                    if key in ["bom", "cast", "scars", "timeline", "forensic_metrics", "reports", "forensic_summary"]:
                        # Deep Merge Logic (Basic)
                        # Specific handling for Arrays vs Objects might be needed
                        # For now, we trust the Locker is "High Fidelity" and overrides/merges
                        if key == "bom":
                             current = post.metadata.get("bom") or []
                             merged = smart_merge_lists(current, val, "label")
                             if current != merged:
                                 changes.append(f"  - [Locker] Update 'bom' ({len(val)} items)")
                                 post.metadata["bom"] = merged
                                 
                        elif key == "cast":
                             current = post.metadata.get("cast") or []
                             merged = smart_merge_lists(current, val, "name")
                             if current != merged:
                                 changes.append(f"  - [Locker] Update 'cast' ({len(val)} items)")
                                 post.metadata["cast"] = merged
                                 
                        elif key == "scars":
                             current = post.metadata.get("scars") or []
                             merged = smart_merge_lists(current, val, "label")
                             if current != merged:
                                 changes.append(f"  - [Locker] Update 'scars' ({len(val)} items)")
                                 post.metadata["scars"] = merged
                                 
                        else:
                            # Direct Overwrite for Objects/Strings
                            if post.metadata.get(key) != val:
                                changes.append(f"  - [Locker] Update '{key}'")
                                post.metadata[key] = val
                                
                    else:
                        # 2. Unknown Keys -> Route to 'forensic_data' (Catch-All)
                        if forensic_data.get(key) != val:
                            changes.append(f"  - [Locker] Stashed Oddball '{key}' in forensic_data")
                            forensic_data[key] = val
                            
                # Save the Catch-All
                if forensic_data:
                    post.metadata["forensic_data"] = forensic_data

            except Exception as e:
                print(f"   ❌ Error reading Forensic Locker {target_locker}: {e}")

        # --- V2.0 SCHEMA UPDATES (Feb 2026) ---

        # 6. Complexity Vector (Physical Design)
        if "complexity_vector" in data:
            cv = data["complexity_vector"]
            if post.metadata.get("complexity_vector") != cv:
                 changes.append(f"  - Update 'complexity_vector' (Structure)")
                 post.metadata["complexity_vector"] = cv
                 
        # 7. Timeline (V2.1)
        if "timeline" in data:
            current_timeline = post.metadata.get("timeline") or []
            # For timeline, unique key is tricky. Let's use 'title'. 
            # If same title (e.g. "Production Start"), we update details.
            merged_timeline = smart_merge_lists(current_timeline, data["timeline"], "title")
            
            # Sort by Date? 
            # Ideally yes, but let's trust manual order or sort in UI.
            # Sorting here might break if format varies.
            
            if current_timeline != merged_timeline:
                 changes.append(f"  - Update 'timeline' (Merged {len(data['timeline'])} items)")
                 post.metadata["timeline"] = merged_timeline

        # 8. Entropy Sidecar (Seismograph) - Writes to _entropy.json
        # We do NOT put this in Frontmatter (Law X).
        if "events" in data:
            events = data["events"]
            
            # --- V2.3 VELOCITY CALCULATION ---
            # 1. Sort by Date
            # Handle potential missing dates or bad formats? Assuming ISO YYYY-MM-DD
            try:
                events.sort(key=lambda x: x.get("date", "0000-00-00"))
                
                # 2. Calculate Delta
                from datetime import datetime
                
                for i in range(len(events)):
                    current_event = events[i]
                    current_date_str = current_event.get("date")
                    
                    if not current_date_str:
                         current_event["time_delta"] = 0
                         continue

                    # Parse
                    try:
                        c_date = datetime.strptime(current_date_str, "%Y-%m-%d")
                    except ValueError:
                         # Fallback for strict ISO or just ignore
                         current_event["time_delta"] = 0
                         continue

                    if i > 0:
                        prev_event = events[i-1]
                        prev_date_str = prev_event.get("date")
                        if prev_date_str:
                             try:
                                 p_date = datetime.strptime(prev_date_str, "%Y-%m-%d")
                                 delta = (c_date - p_date).days
                                 current_event["time_delta"] = max(0, delta) # No negatives
                             except ValueError:
                                 current_event["time_delta"] = 0
                        else:
                             current_event["time_delta"] = 0 # Start of time
                    else:
                        current_event["time_delta"] = 0 # First event
                        
            except Exception as e:
                print(f"   ⚠️  Velocity Calc Failed: {e}")

            # Path: src/content/projects/{slug}/_entropy.json
            # target_mdx is .../index.mdx. Parent is the project folder.
            entropy_path = target_mdx.parent / "_entropy.json"
            
            # Check for changes
            needs_write = True
            if entropy_path.exists():
                with open(entropy_path, "r", encoding="utf-8") as f:
                    existing_entropy = json.load(f)
                if existing_entropy == events:
                    needs_write = False
            
            if needs_write:
                changes.append(f"  - Write Sidecar '_entropy.json' ({len(events)} events) with Velocity Data")
                if not dry_run:
                     with open(entropy_path, "w", encoding="utf-8") as f:
                         json.dump(events, f, indent=2)

        # Legacy Support (Seismobolus) - Deprecated but checking to prevent regression
        if "seismobolus" in data and "events" not in data:
             print(f"  ⚠️  Legacy 'seismobolus' found in {slug}. Please standardise to 'events' (Seismograph V1.0).")

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
             # Ensure metrics dict exists
             if "metrics" not in post.metadata or post.metadata["metrics"] is None:
                 post.metadata["metrics"] = {}

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
                 
                 # Body Injection (Ready State Compliance) - Check regardless of _intelligence.md status
                 if target_mdx.name == "index.mdx":
                     # FORCE OVERWRITE if --force is used, or if empty
                     if force or not post.content or not post.content.strip():
                         if post.content != raw_intelligence:
                             post.content = raw_intelligence
                             changes.append(f"  - Injected Sovereign Body Content (Force={force})")

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
            # Using Priority Flag for Stickies? 
            # If priority="target" and we have stickies, we should probably keep them if they exist?
            # Stickies are complex. Let's assume if priority=target, we trust the manual edits to stickies too.
            
            if priority == "target" and current_stickies:
                 # Merge? Stickies don't merge well. Let's keep existing.
                 mined_stickies = current_stickies
            
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

            # 2. Scars (Formerly War Stories)
            # Check for 'scars' in MDX
            scars = post.metadata.get("scars")
             
            # Fallback check for legacy war_stories in metrics (should be gone, but safety)
            if not scars and "metrics" in post.metadata:
                scars = post.metadata["metrics"].get("war_stories")
            
            if scars:
                 # Clean up format (remove numbers/legacy)
                 clean_scars = [s for s in scars if isinstance(s, dict)]
                 if clean_scars:
                     # Backport to JSON 'scars' field
                     if data.get("scars") != clean_scars:
                         data["scars"] = clean_scars
                         changes.append(f"  - Backported {len(clean_scars)} Scars")
                          
                     # Clean up legacy war_stories if present in JSON
                     if "war_stories" in data:
                         del data["war_stories"]
                         changes.append(f"  - Removed legacy 'war_stories' from JSON")

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
            
            # --- SIMULATION EXCLUSION (The Realm Protocol) ---
            if post.metadata.get("realm") == "simulation":
                continue
            
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
            
            # Extract Scars (New Standard)
            if "scars" in post.metadata:
                scars = post.metadata["scars"]
                for scar in scars:
                    if isinstance(scar, dict):
                        label = scar.get('label')
                        if "Berry Creek" in label: continue
                        war_stories.append(f"- **{label}**: {scar.get('description')}")
            
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
    Generates src/content/prompts/PROJECT_INDEX.md using a Tiered Strategy.
    
    Tier 1 (Forensic): Projects with 'forensic_summary' or 'war_stories'. Full detail.
    Tier 2 (Ready State/On Deck): Projects with body text (intro) but no forensic struct.
    Tier 3 (Stub): Minimal metadata only.
    """
    output_path = Path("src/content/prompts/PROJECT_INDEX.md")
    
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
            
            # --- SIMULATION EXCLUSION (The Realm Protocol) ---
            # "Simulations" (Dreamjob) are excluded from the Forensic Registry.
            # "Real Concepts" (production: concept, realm: reality) ARE included.
            if post.metadata.get("realm") == "simulation":
                continue
            
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
        summary_text = ""
        if isinstance(p['summary'], dict):
            # V2 Schema: Reconstruct the narrative
            trigger = p['summary'].get('trigger', '')
            intervention = p['summary'].get('intervention', '')
            result = p['summary'].get('result', '')
            summary_text = f"TRIGGER: {trigger} INTERVENTION: {intervention} RESULT: {result}"
        else:
            # V1 Legacy or String
            summary_text = str(p['summary']).strip()

        content += f"> **Forensic Summary:** {summary_text}\n\n"
        
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
    
    parser.add_argument("--priority", type=str, default="source", choices=["source", "target"], help="Conflict resolution priority.")
    
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
        hydrate_content(dry_run=args.dry_run, force=args.force, target_slug=args.slug, priority=args.priority)
        # Always regenerate index after hydration
        generate_project_index(dry_run=args.dry_run)



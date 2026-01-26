import os
import re
from pathlib import Path

CONTENT_DIRS = [Path("src/content/projects")]

# CATEGORY Mapping Rules (Old -> New)
CATEGORY_MAP = {
    # Consumer
    "game_console": "home_entertainment",
    "set_top_box": "home_entertainment",
    "media_player": "home_entertainment",
    "media_server": "home_entertainment",
    
    "consumer_appliance": "appliance",
    
    # Components / Input
    "remote_control": "input_device",
    "peripheral": "input_device",
    "input_device": "input_device", # Keep
    "user_interface": "input_device", # Map UI to Input Device if it is a physical thing? Or Module? Let's check context. Most are remotes.
    
    # Pro Audio
    "control_surface": "pro_audio", 
    "live_sound_console": "pro_audio",
    "audio_interface": "pro_audio",
    
    # Enterprise
    "rack_appliance": "enterprise_hardware",
    "server_storage": "enterprise_hardware",
    "security_appliance": "enterprise_hardware",
    
    # Computing
    "personal_computer": "computing",
    "workstation": "computing",
    
    # Mobile
    "handheld_mobile": "mobile_device",
    
    # Smart Home
    "smart_home_device": "smart_home",
    "iot_node": "smart_home",
    
    # Subsystems
    "circuit_board": "module_subsystem",
    "embedded_device": "module_subsystem",
    "electromechanical_assembly": "module_subsystem",
    
    # Medical
    "medical_equipment": "medical_device",
    
    # To Process/Tags
    "thermal_simulation": "other", # Add tag
    "sustaining_engineering": "other", # Add tag
    
    # Keep others if valid in new list or map to other
    "micromobility": "other", # Map to other for now
    "sports_and_fitness": "other",
    "uncategorized": "other",
    "data_ingestion": "other", # What is this?
}

# Tag Mapping for Process Categories
PROCESS_TAGS = {
    "thermal_simulation": "Thermal Analysis",
    "sustaining_engineering": "Sustaining Engineering",
    "data_ingestion": "Data Ingestion",
}

def migrate_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    modified = False
    new_lines = []
    
    current_category = None
    
    for i, line in enumerate(lines):
        # Check Category
        match_cat = re.match(r'^(\s*)category:\s*([a-zA-Z0-9_]+)\s*$', line)
        if match_cat:
            indent = match_cat.group(1)
            val = match_cat.group(2)
            current_category = val
            
            if val in CATEGORY_MAP:
                new_val = CATEGORY_MAP[val]
                if new_val != val:
                    print(f"[{file_path.stem}] Migrating category: {val} -> {new_val}")
                    new_lines.append(f"{indent}category: {new_val}\n")
                    modified = True
                    continue
        
        # Add Tag if needed (search for tags block)
        # This is tricky in stream. We might miss tags if they appear before category?
        # Standard format usually has category near top. Tags lower.
        # But we need to know if we need to add a tag based on the category we JUST read or read previously.
        # Let's simple append the tag to the tags list if we find it.
        
        if line.strip().startswith("tags:"):
            # Check if we need to add a tag based on the OLD category we found earlier in the file?
            # Or scan file first?
            # Let's scan file for category first.
            pass

        new_lines.append(line)
        
    # Second pass for tags if needed is too complex for single pass script without parsing YAML.
    # We will do regex replace for category, and if we change a process category, we will try to append the tag.
    # Let's use two passes logic. Read all, find category, determine needed tag, then rewrite.
    
    # Re-read for robust logic
    content = "".join(lines)
    
    # Find category
    cat_match = re.search(r'^(\s*)category:\s*([a-zA-Z0-9_]+)\s*$', content, re.MULTILINE)
    tag_to_add = None
    
    if cat_match:
        old_cat = cat_match.group(2)
        if old_cat in PROCESS_TAGS:
            tag_to_add = PROCESS_TAGS[old_cat]
            
    if modified: 
        # We already modified lines in one pass? No, let's discard simple loop and use list manipulation
        pass
        
    # Let's just use the built lines from first pass 
    # But we need to insert tags.
    # Where is 'tags:'?
    
    if tag_to_add:
        # Find tags line
        tags_idx = -1
        for idx, l in enumerate(new_lines):
            if l.strip().startswith("tags:"):
                # Check if empty array '[]'
                if "[]" in l:
                     new_lines[idx] = l.replace("[]", f"\n  - {tag_to_add}")
                else:
                     # It has items or is a list leader
                     # Check next line to see indentation
                     # Assume it's a list. Insert after.
                     # indent? "tags:" usually no indent or same as category
                     indent = l[:l.find("tags:")]
                     new_lines.insert(idx + 1, f"{indent}  - {tag_to_add}\n")
                print(f"[{file_path.stem}] Added tag: {tag_to_add}")
                modified = True
                break
        if tags_idx == -1:
            # No tags field? Add it end of FM?
            # Too risky. Most files have tags.
            pass
            
    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)

def main():
    for d in CONTENT_DIRS:
        if d.exists():
            files = list(d.glob("**/*.mdx")) + list(d.glob("**/*.md"))
            print(f"Scanning {len(files)} files in {d}...")
            for f in files:
                migrate_file(f)

if __name__ == "__main__":
    main()

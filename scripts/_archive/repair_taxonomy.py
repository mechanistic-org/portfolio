import os
import glob
import re

# Strict Taxonomy (Values Only)
EMPLOYERS = {
    "digidesign", "mechanistic", "mechanistic_webtv", "mechanistic_consulting",
    "kaleidescape", "noon", "internal_audit", "silicon_graphics", "hyphen",
    "unknown", "frogdesign", "electromechanical_mechanism", "mobile_phone", 
    "wearable_ar", "avegant", "ep_technologies"
}

INDUSTRIES = {
    "consumer_electronics", "pro_audio", "technology", "other", "consumer_appliance"
}

CATEGORIES = {
    "game_console", "set_top_box", "remote_control", "media_server",
    "consumer_appliance", "control_surface", "media_player", "rack_appliance",
    "live_sound_console", "data_ingestion", "handheld_mobile", "smart_home_device",
    "personal_computer", "workstation", "iot_node", "audio_interface",
    "input_device", "uncategorized", "wearable_ar",
    "thermal_simulation", "user_interface", "sustaining_engineering", "electromechanical_assembly",
    "micromobility", "sports_and_fitness", "peripheral", "embedded_device", "server_storage",
    "circuit_board", "security_appliance", "other", "medical_equipment", "unknown"
}

TOOLS = {
    "pro_engineer", "windchill", "solidworks", "cad", "other", "adobe_creative_suite", "blender",
    "onshape", "ptc_creo", "keyshot", "thermal_simulation", "autocad",
    "microfilm", "typewriter", "shoe_phone", "launch_keys", "invisible_ink", "wopr" # Wait, these were mapped to 'other', so they shouldn't be in valid set unless I want to support them.
    # Actually, I removed them from valid set logic by mapping them to 'other'.
    # So valid set should match taxonomy.ts exactly.
}

ROLES = {
    "mechanical_engineer", "industrial_designer", "software_engineer", "project_lead", "consultant", "other"
}
# Added 'adobe_creative_suite' and 'blender' as likely missing tools if found commonly, 
# otherwise they will map to 'other' or need adding to taxonomy.

# Manual Map for tricky ones
FIX_MAP = {
    "Frog Design": "frogdesign",
    "Mobile Phone": "handheld_mobile",
    "Mobile": "handheld_mobile",
    "Pro/ENGINEER": "pro_engineer",
    "Pro/Engineer": "pro_engineer",
    "Other": "other",
    "consumer electronics": "consumer_electronics",
    "Consumer Electronics": "consumer_electronics",
    "Pro Audio": "pro_audio",
    "Technology": "technology",
    "Smart Home Device": "smart_home_device",
    "Live Sound Console": "live_sound_console",
    "Control Surface": "control_surface",
    "Media Server": "media_server",
    "Game Console": "game_console",
    "Set-top Box": "set_top_box",
    "Set-Top Box": "set_top_box",
    "Remote Control": "remote_control",
    "Media Player": "media_player",
    "Workstation": "workstation",
    "Audio Interface": "audio_interface",
    "Input Device": "input_device",
    "Uncategorized": "uncategorized",
    "Wearable / AR": "wearable_ar",
    "Wearable AR": "wearable_ar",
    "Personal Computer": "personal_computer",
    "IoT Node": "iot_node",
    "Rack Appliance": "rack_appliance",
    "Consumer Appliance": "consumer_appliance",
    "Data Ingestion": "data_ingestion",
    "Mechanistic": "mechanistic",
    "Digidesign": "digidesign",
    "Kaleidescape": "kaleidescape",
    "Noon": "noon",
    "Internal Audit": "internal_audit",
    "Silicon Graphics": "silicon_graphics",
    "Hyphen": "hyphen",
    "Unknown": "unknown",
    "Mechanistic (Consulting)": "mechanistic_consulting",
    "Mechanistic / WebTV": "mechanistic_webtv",
    "Mechanistic/WebTV": "mechanistic_webtv",
    "Mechanistic/WebTV": "mechanistic_webtv",
    "Mechanistic (Consultant)": "mechanistic_consulting",
    "Electromechanical Assy": "electromechanical_assembly",
    "Onshape": "onshape",
    "PTC Creo": "ptc_creo",
    "KeyShot": "keyshot",
    "Blender": "blender",
    "Adobe Creative Suite": "adobe_creative_suite",
    "Prototype": "uncategorized",
    "Gaming Console": "game_console",
    "Electromechanical Mechanism": "electromechanical_assembly",
    "Handheld / PDA": "handheld_mobile",
    "Handheld/PDA": "handheld_mobile",
    "PDA": "handheld_mobile",
    "Thermal Simulation": "thermal_simulation",
    "Micromobility": "micromobility",
    "Sports and Fitness": "sports_and_fitness",
    "AutoCAD": "autocad",
    "Autocad": "autocad",
    "Audio Console": "live_sound_console",
    "Concept": "uncategorized",
    "Tech": "technology",
    "Server Prototype": "media_server",
    "Black Ops": "uncategorized",
    "Consumer Appliances": "consumer_appliance",
    "Server / Storage": "server_storage",
    "[REDACTED]": "unknown",
    "Espionage": "other",
    "Handheld / Mobile": "handheld_mobile",
    "Shoe Phone": "other",
    "Launch Keys": "other",
    "Invisible Ink": "other",
    "Global Thermonuclear War": "uncategorized",
    "DEFENSE DEPT": "unknown",
    "MP3 Player": "media_player",
    "Nuclear Deterrence": "other",
    "Portable Audio": "media_player",
    "WOPR": "other",
    "Field Operations": "uncategorized",
    "USB Audio Interface": "audio_interface",
    "Foodservice Automation": "uncategorized",
    "Media Storage": "server_storage",
    "The Bureau": "unknown",
    "Robotics / Disc Vault": "electromechanical_assembly",
    "Intelligence": "other",
    "Server / Rackmount": "server_storage",
    "Portable Media": "media_player",
    "Microfilm": "other",
    "Career Goal": "uncategorized",
    "Typewriter": "other",
    "EP Technologies": "ep_technologies",
    "Various": "unknown",
    "awesomejob": "unknown",
    "Audio Gear": "uncategorized"
}

def to_snake_case(text):
    if not text: return text
    s = str(text).lower().strip()
    s = s.replace(" ", "_").replace("/", "_").replace("-", "_")
    return s

def fix_value(val, valid_set, field_name):
    if not val: return val
    
    # 1. Check if already valid
    if val in valid_set:
        return val
    
    # 2. Check Manual Map
    if val in FIX_MAP:
        mapped = FIX_MAP[val]
        if mapped in valid_set:
            return mapped
        else:
            # Maybe mapped value is valid but just missing from my hardcoded set above?
            # Or maybe I mapped it to something I haven't added to valid set yet.
            print(f"Warning: Mapped '{val}' -> '{mapped}' but '{mapped}' is not in valid set for {field_name}.")
            return mapped # Return it anyway, assume taxonomy update might handle it or it's a new valid value.

    # 3. Snake Case Auto-Fix
    snaked = to_snake_case(val)
    if snaked in valid_set:
        return snaked
    
    print(f"FAILED to fix {field_name}: '{val}' -> '{snaked}' not found in valid set.")
    return val # Return original so we don't destroy data

def process_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to capture frontmatter
    fm_pattern = re.compile(r'^---\s+(.*?)\s+---', re.DOTALL)
    match = fm_pattern.search(content)
    if not match:
        return

    original_fm = match.group(0)
    # We will modify the content line by line inside the frontmatter to preserve comments/structure 
    # better than full YAML dump which destroys ordering/comments.
    
    lines = original_fm.splitlines()
    new_lines = []
    modified = False
    
    current_key = None
    in_tools_list = False

    for line in lines:
        # Check for key: value
        key_match = re.match(r'^(\s*)([a-zA-Z0-9_]+):\s*(.+)?$', line)
        list_match = re.match(r'^(\s*)-\s+(.+)$', line)
        
        if key_match:
            indent, key, val = key_match.groups()
            current_key = key
            in_tools_list = (key == "tools")
            
            if val and not in_tools_list: # Scalar value
                val = val.strip()
                # Strip quotes for check
                clean_val = val.strip('"').strip("'")
                new_val = clean_val
                
                if key == "employer":
                    new_val = fix_value(clean_val, EMPLOYERS, "employer")
                elif key == "industry":
                    new_val = fix_value(clean_val, INDUSTRIES, "industry")
                elif key == "category":
                    new_val = fix_value(clean_val, CATEGORIES, "category")
                elif key == "job_title":
                    new_val = fix_value(clean_val, ROLES, "job_title")
                
                if new_val != val:
                    line = f"{indent}{key}: {new_val}"
                    modified = True
            
            new_lines.append(line)
        
        elif list_match and in_tools_list:
            indent, val = list_match.groups()
            val = val.strip()
            # Strip quotes for list items too
            clean_val = val.strip('"').strip("'")
            new_val = fix_value(clean_val, TOOLS, "tools")
            
            if new_val != clean_val:
                line = f"{indent}- {new_val}"
                modified = True
            
            new_lines.append(line)
        else:
            new_lines.append(line)
            # Reset context if we hit empty line or something else
            if line.strip() == "":
                in_tools_list = False

    if modified:
        new_fm = "\n".join(new_lines)
        new_content = content.replace(original_fm, new_fm)
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Fixed: {os.path.basename(os.path.dirname(file_path))}")

def main():
    projects_dir = os.path.join(os.getcwd(), "src", "content", "projects")
    files = glob.glob(os.path.join(projects_dir, "**", "*.mdx"), recursive=True)
    
    print(f"Scanning {len(files)} project files for repairs...")
    
    for file_path in files:
        process_file(file_path)

if __name__ == "__main__":
    main()

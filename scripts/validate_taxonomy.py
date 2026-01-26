import os
import glob
import yaml
import re

# Taxonomy Definitions (Synced with src/config/taxonomy.ts)
EMPLOYERS = {
    "digidesign", "mechanistic", "mechanistic_webtv", "mechanistic_consulting",
    "kaleidescape", "noon", "internal_audit", "silicon_graphics", "hyphen",
    "unknown", "frogdesign", "electromechanical_mechanism", "mobile_phone", 
    "wearable_ar", "avegant"
}

INDUSTRIES = {
    "consumer_electronics", "pro_audio", "technology", "other"
}

CATEGORIES = {
    "game_console", "set_top_box", "remote_control", "media_server",
    "consumer_appliance", "control_surface", "media_player", "rack_appliance",
    "live_sound_console", "data_ingestion", "handheld_mobile", "smart_home_device",
    "personal_computer", "workstation", "iot_node", "audio_interface",
    "input_device", "uncategorized", "wearable_ar"
}

TOOLS = {
    "pro_engineer", "windchill", "solidworks", "cad", "other"
}

def parse_frontmatter(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    match = re.search(r'^---\s+(.*?)\s+---', content, re.DOTALL)
    if not match:
        return None
    
    try:
        return yaml.safe_load(match.group(1))
    except yaml.YAMLError as e:
        print(f"Error parsing YAML in {file_path}: {e}")
        return None

def validate_project(file_path):
    data = parse_frontmatter(file_path)
    if not data:
        return

    errors = []
    
    # Validate Employer
    if 'employer' in data:
        emp = data['employer']
        if emp and emp not in EMPLOYERS:
            errors.append(f"Employer: '{emp}' (Expected one of {', '.join(sorted(EMPLOYERS))})")

    # Validate Industry
    if 'industry' in data:
        ind = data['industry']
        if ind and ind not in INDUSTRIES:
            errors.append(f"Industry: '{ind}' (Expected one of {', '.join(sorted(INDUSTRIES))})")
    
    # Validate Category
    if 'category' in data:
        cat = data['category']
        if cat and cat not in CATEGORIES:
            errors.append(f"Category: '{cat}' (Expected one of {', '.join(sorted(CATEGORIES))})")

    # Validate Tools
    if 'tools' in data and isinstance(data['tools'], list):
        for tool in data['tools']:
            if tool and tool not in TOOLS:
                errors.append(f"Tool: '{tool}' (Expected one of {', '.join(sorted(TOOLS))})")

    if errors:
        print(f"\nIssues in {os.path.basename(os.path.dirname(file_path))}:")
        for err in errors:
            print(f"  - {err}")

def main():
    projects_dir = os.path.join(os.getcwd(), "src", "content", "projects")
    files = glob.glob(os.path.join(projects_dir, "**", "*.mdx"), recursive=True)
    
    print(f"Scanning {len(files)} project files...")
    
    for file_path in files:
        validate_project(file_path)

if __name__ == "__main__":
    main()

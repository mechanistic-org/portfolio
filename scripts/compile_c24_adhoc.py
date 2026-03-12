import os
import json
import re

DATA_PATH = r"D:\GitHub\eriknorris\src\content\projects\c24\data.json"
MDX_PATH = r"D:\GitHub\eriknorris\src\content\projects\c24\index.mdx"
RAW_DIR = r"D:\GitHub\eriknorris\src\content\_raw_nlm"

TEAM_FILE = os.path.join(RAW_DIR, "c24_team.md")
TIMELINE_FILE = os.path.join(RAW_DIR, "c24_development_timeline.md")
ADHOC_FILE = os.path.join(RAW_DIR, "c24_adhoc.md")

def clean_nlm_json(filepath):
    if not os.path.exists(filepath):
        print(f"File not found: {filepath}")
        return None
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # NLM sometimes escapes markdown heavily
    content = content.replace("&nbsp;", " ")
    content = content.replace(r"\_", "_")
    content = content.replace(r"\[", "[")
    content = content.replace(r"\]", "]")
    content = content.replace(r"\\", "") # Fix double backslashes
    content = content.replace('\n', ' ') # Flatten lines to prevent multiline string issues
    content = re.sub(r'(?<!\\)" ', '", ', content) # Sometimes NLM misses commas between objects
    
    # Strip everything outside the first { and last }
    match = re.search(r'\{.*\}', content, re.DOTALL)
    if not match:
        print(f"Could not find JSON payload in {filepath}")
        return None
        
    json_str = match.group(0)
    
    try:
        return json.loads(json_str)
    except Exception as e:
        print(f"JSON Parse Error for {filepath}: {e}")
        return None

def main():
    # 1. Load the existing Sidecar Brain
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        sidecar = json.load(f)
        
    # 2. Extract Team
    team_data = clean_nlm_json(TEAM_FILE)
    if team_data:
        # It's deeply nested e.g. {"Digidesign_C24_Team": {"Mechanical_and_Industrial_Design": [...]}}
        root_key = list(team_data.keys())[0] # Digidesign_C24_Team
        sub_key = list(team_data[root_key].keys())[0] # Mechanical...
        cast_array = team_data[root_key][sub_key]
        
        # We merge into existing 'cast' or overwrite if empty
        if "cast" not in sidecar or not sidecar["cast"]:
            sidecar["cast"] = []
            
        # Optional: Prevent duplicates
        existing_names = set(c.get("name") for c in sidecar["cast"])
        
        for member in cast_array:
            if member.get("name") not in existing_names:
                sidecar["cast"].append(member)
        print(f"Injected {len(cast_array)} Team Members into data.json")
        
    # 3. Extract Timeline
    timeline_data = clean_nlm_json(TIMELINE_FILE)
    if timeline_data:
        root_key = list(timeline_data.keys())[0] # erik_norris_c24_development_timeline
        events = timeline_data[root_key]
        
        if "timeline" not in sidecar:
            sidecar["timeline"] = []
            
        existing_events = set(e.get("date") for e in sidecar["timeline"])
        for evt in events:
            if evt.get("date") not in existing_events:
                # Rename 'event' to 'title' if necessary based on your schema
                if "title" not in evt and "event" in evt:
                    evt["title"] = evt.pop("event")
                sidecar["timeline"].append(evt)
        print(f"Injected {len(events)} Timeline Events into data.json")

    # Save Sidecar
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(sidecar, f, indent=2)
        print("Successfully updated C24 data.json sidecar")
        
    # 4. Process Adhoc Notes
    if os.path.exists(ADHOC_FILE):
        with open(ADHOC_FILE, 'r', encoding='utf-8') as f:
            adhoc_notes = f.read().strip()
            
        with open(MDX_PATH, 'r', encoding='utf-8') as f:
            mdx_content = f.read()
            
        # Append only if not already appended
        if "<AdHocDossier>" not in mdx_content and "C24 Curtis Forensic Report" not in mdx_content:
            mdx_content += f"\n\n\n## Ad-Hoc Forensic Notes\n\n{adhoc_notes}\n"
            
            with open(MDX_PATH, 'w', encoding='utf-8') as f:
                f.write(mdx_content)
            print("Successfully appended c24_adhoc.md to the bottom of index.mdx body")
        else:
            print("Ad-hoc notes already seem present in index.mdx")

if __name__ == "__main__":
    main()
